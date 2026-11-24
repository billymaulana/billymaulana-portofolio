import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const RAMP = [
  ['ground', 0x05, 0x05, 0x07],
  ['cold', 0x0F, 0x0A, 0x72],
  ['cold', 0x3A, 0x1A, 0x9E],
  ['cold', 0x6B, 0x2F, 0xC8],
  ['mid', 0xA3, 0x2B, 0xA8],
  ['mid', 0xD4, 0x5C, 0x6E],
  ['hot', 0xEE, 0x8A, 0x2A],
  ['hot', 0xF8, 0xBF, 0x27],
  ['peak', 0xFE, 0xE5, 0x5D],
  ['peak', 0xFF, 0xF5, 0xB3],
  ['peak', 0xFF, 0xFE, 0xF5],
];
const NEUTRAL_SATURATION = 0.12;
const LIMITS = { coldMin: 0.5, coldMax: 0.6, hotMax: 0.25, peakMax: 0.12 };

function hslSaturation(r, g, b) {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const d = max - min;
  if (d === 0) return 0;
  const l = (max + min) / 2;
  return d / (1 - Math.abs(2 * l - 1));
}

function nearestZone(r, g, b) {
  let best = 0;
  let bestDist = Infinity;
  for (let i = 0; i < RAMP.length; i++) {
    const dr = r - RAMP[i][1];
    const dg = g - RAMP[i][2];
    const db = b - RAMP[i][3];
    const dist = dr * dr + dg * dg + db * db;
    if (dist < bestDist) {
      bestDist = dist;
      best = i;
    }
  }
  return RAMP[best][0];
}

export function zoneShares(rgb) {
  const counts = { ground: 0, cold: 0, mid: 0, hot: 0, peak: 0 };
  const total = rgb.length / 3;
  for (let i = 0; i < rgb.length; i += 3) {
    const zone = nearestZone(rgb[i], rgb[i + 1], rgb[i + 2]);
    if (zone !== 'ground' && hslSaturation(rgb[i], rgb[i + 1], rgb[i + 2]) < NEUTRAL_SATURATION) continue;
    counts[zone]++;
  }
  const shares = {};
  for (const zone of Object.keys(counts)) shares[zone] = total ? counts[zone] / total : 0;
  return shares;
}

export function thermalViolations(s) {
  const colored = s.cold + s.mid + s.hot + s.peak;
  const violations = [];
  if (s.ground <= 0) violations.push('ground: tidak ada ground hitam yang tersisa');
  if (colored === 0) return [...violations, 'colored: tidak ada bidang berwarna termal'];
  const cold = s.cold / colored;
  const hot = s.hot / colored;
  const peak = s.peak / colored;
  if (cold < LIMITS.coldMin || cold > LIMITS.coldMax) violations.push(`cold: ${pct(cold)} dari bidang berwarna, harus 50–60%`);
  if (hot > LIMITS.hotMax) violations.push(`hot: ${pct(hot)} dari bidang berwarna, maksimal 25%`);
  if (peak > LIMITS.peakMax) violations.push(`peak: ${pct(peak)} dari bidang berwarna, maksimal 12%`);
  return violations;
}

function pct(x) {
  return `${(x * 100).toFixed(1)}%`;
}

function main(argv) {
  const image = argv[2];
  if (!image) {
    process.stderr.write('pakai: thermal-zones.mjs <image>\n');
    return 2;
  }
  const rgb = new Uint8Array(execFileSync('magick', [image, '-depth', '8', 'rgb:-'], { maxBuffer: 256 * 1024 * 1024 }));
  const s = zoneShares(rgb);
  const colored = s.cold + s.mid + s.hot + s.peak;
  process.stdout.write(`thermal-zones ${image}\n`);
  process.stdout.write(`  semua piksel: ground ${pct(s.ground)} · cold ${pct(s.cold)} · mid ${pct(s.mid)} · hot ${pct(s.hot)} · peak ${pct(s.peak)}\n`);
  if (colored > 0) {
    process.stdout.write(`  bidang berwarna (${pct(colored)}): cold ${pct(s.cold / colored)} · mid ${pct(s.mid / colored)} · hot ${pct(s.hot / colored)} · peak ${pct(s.peak / colored)}\n`);
  }
  const violations = thermalViolations(s);
  for (const v of violations) process.stdout.write(`  ✖ ${v}\n`);
  process.stdout.write(violations.length ? 'MERAH\n' : 'HIJAU\n');
  return violations.length ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv));
