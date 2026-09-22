import process from 'node:process';
import { pathToFileURL } from 'node:url';

/* Audit pertama yang membaca PIKSEL, bukan DOM. taste-lint, layout-audit, dan ink-audit
   ketiganya bersumber dari elemen teks — pada rute tanpa teks ketiganya lolos secara kosong,
   dan itulah cara /explore/liquid/liquid-1 mendapat "semua audit hijau" pada halaman yang
   ditolak. Ambang di bawah dikalibrasi dari pasangan diterima/ditolak yang sudah ada:

     hero-2 (Billy: "liquid KEREN")  detail 5.38-6.36% · deret klip 39.3-74.2px · 2 pita hue
     liquid-1 (Billy: "jelek")       detail 0.26%      · deret klip 165.6px    · identitas hadir
     ambient-plume (Billy: "jelek")  cakupan idle 27.6% · 16 pita hue · identitas 0.02%

   n=3. Ambang ditaruh di sepertiga nilai yang diterima, bukan di titik tengah — audit ini
   menyaring cacat kasar, bukan menilai selera. `maxMeanClipRunPx` sengaja 100 dan bukan 80:
   halaman yang sama terukur 39.3px dan 74.2px pada dua fase pengadukan berbeda, jadi ambang
   yang ketat akan menolak halaman yang sudah disetujui hanya karena waktu screenshot. */
export const DEFAULTS = {
  inkLuma: 40,
  clipLuma: 250,
  edgeDelta: 32,
  minDetailDensityPct: 2.0,
  maxMeanClipRunPx: 100,
  maxIdleCoveragePct: 2.0,
  maxHueBands: 4,
  hueBandMinPct: 1.0,
  minColorAreaPct: 0.5,
  minSat: 0.25,
  identityHueTolDeg: 25,
  fidelityTol: 0.4,
};

export function rgbToHueSat(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  if (d === 0) return { hue: 0, sat: 0 };
  let hue;
  if (max === r) hue = ((g - b) / d) % 6;
  else if (max === g) hue = (b - r) / d + 2;
  else hue = (r - g) / d + 4;
  hue = (hue * 60 + 360) % 360;
  return { hue, sat: max === 0 ? 0 : d / max };
}

export function hexToHue(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = Number.parseInt(m[1], 16);
  return rgbToHueSat((n >> 16) & 255, (n >> 8) & 255, n & 255).hue;
}

export function analysePixels({ data, width, height, channels = 4 }, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const total = width * height;
  const hueBins = new Array(36).fill(0);
  const clipRuns = [];

  let inkPixels = 0;
  let clipPixels = 0;
  let edgeHits = 0;
  let edgeSamples = 0;
  let huePixels = 0;

  for (let y = 0; y < height; y++) {
    let run = 0;
    let prevLuma = null;
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      const isInk = luma >= o.inkLuma;

      if (isInk) {
        inkPixels++;
        if (prevLuma !== null) {
          edgeSamples++;
          if (Math.abs(luma - prevLuma) > o.edgeDelta) edgeHits++;
        }
        const { hue, sat } = rgbToHueSat(r, g, b);
        if (sat >= o.minSat) {
          hueBins[Math.min(35, Math.floor(hue / 10))]++;
          huePixels++;
        }
      }
      prevLuma = luma;

      if (luma >= o.clipLuma) {
        clipPixels++;
        run++;
      }
      else if (run > 0) {
        clipRuns.push(run);
        run = 0;
      }
    }
    if (run > 0) clipRuns.push(run);
  }

  clipRuns.sort((a, b) => a - b);
  const meanRun = clipRuns.length ? clipRuns.reduce((s, v) => s + v, 0) / clipRuns.length : 0;

  return {
    width,
    height,
    inkPct: round(inkPixels / total * 100),
    clipPct: round(clipPixels / total * 100),
    detailDensityPct: edgeSamples ? round(edgeHits / edgeSamples * 100) : 0,
    meanClipRunPx: round(meanRun),
    p95ClipRunPx: clipRuns.length ? clipRuns[Math.floor(clipRuns.length * 0.95)] : 0,
    maxClipRunPx: clipRuns.length ? clipRuns[clipRuns.length - 1] : 0,
    /* Relatif terhadap piksel BERWARNA, bukan terhadap seluruh kanvas: pada komposisi gelap
       yang tintanya 27% layar, tiap bin hue jatuh di bawah 1% dari total dan sembilan keluarga
       warna terbaca sebagai "nol pita". Yang ingin diketahui adalah berapa banyak keluarga hue
       yang dipakai oleh warna yang muncul, bukan seberapa luas warnanya. */
    huePixelPct: round(huePixels / total * 100),
    hueBands: hueBins
      .map((count, i) => ({ deg: i * 10, pct: huePixels ? round(count / huePixels * 100) : 0 }))
      .filter(band => band.pct > 0)
      .sort((a, b) => b.pct - a.pct),
  };
}

function round(v) {
  return Math.round(v * 100) / 100;
}

function rule(id, status, actual, expected, note = '') {
  return { id, status, actual, expected, note };
}

export function auditEffect(metrics, options = {}) {
  const o = { ...DEFAULTS, ...options };
  const mode = options.mode === 'idle' ? 'idle' : 'active';
  const rules = [];

  if (mode === 'active') {
    rules.push(metrics.detailDensityPct >= o.minDetailDensityPct
      ? rule('detail-density', 'PASS', `${metrics.detailDensityPct}%`, `>= ${o.minDetailDensityPct}%`)
      : rule('detail-density', 'FAIL', `${metrics.detailDensityPct}%`, `>= ${o.minDetailDensityPct}%`,
          'bidang halus tanpa tepi internal — efek terbaca sebagai gradien, bukan material'));

    rules.push(metrics.meanClipRunPx <= o.maxMeanClipRunPx
      ? rule('flat-field', 'PASS', `${metrics.meanClipRunPx}px`, `<= ${o.maxMeanClipRunPx}px`)
      : rule('flat-field', 'FAIL', `${metrics.meanClipRunPx}px`, `<= ${o.maxMeanClipRunPx}px`,
          'deret piksel terang tidak pernah terputus — bidang mati, bukan pita'));
  }
  else {
    rules.push(rule('detail-density', 'SKIP', 'mode idle', `>= ${o.minDetailDensityPct}%`));
    rules.push(rule('flat-field', 'SKIP', 'mode idle', `<= ${o.maxMeanClipRunPx}px`));
  }

  if (mode === 'idle') {
    rules.push(metrics.inkPct <= o.maxIdleCoveragePct
      ? rule('idle-coverage', 'PASS', `${metrics.inkPct}%`, `<= ${o.maxIdleCoveragePct}%`)
      : rule('idle-coverage', 'FAIL', `${metrics.inkPct}%`, `<= ${o.maxIdleCoveragePct}%`,
          'ada yang menyala tanpa input — efek jadi wallpaper, bukan respons'));
  }
  else {
    rules.push(rule('idle-coverage', 'SKIP', 'mode active', `<= ${o.maxIdleCoveragePct}%`));
  }

  const bands = metrics.hueBands.filter(b => b.pct >= o.hueBandMinPct);
  const hasColor = metrics.huePixelPct >= o.minColorAreaPct;
  if (!hasColor) {
    rules.push(rule('hue-discipline', 'SKIP', `hanya ${metrics.huePixelPct}% kanvas berwarna`, `butuh >= ${o.minColorAreaPct}%`));
  }
  else {
    rules.push(bands.length <= o.maxHueBands
      ? rule('hue-discipline', 'PASS', `${bands.length} pita`, `<= ${o.maxHueBands} pita >= ${o.hueBandMinPct}% warna`)
      : rule('hue-discipline', 'FAIL', `${bands.length} pita`, `<= ${o.maxHueBands} pita >= ${o.hueBandMinPct}% warna`,
          `dominan ${bands.slice(0, 5).map(b => `${b.deg}deg ${b.pct}%`).join(' · ')}`));
  }

  if (options.identityHue == null) {
    rules.push(rule('identity-hue', 'SKIP', 'hue identitas tidak diberikan', 'hadir >= 1%'));
  }
  else if (!hasColor) {
    rules.push(rule('identity-hue', 'SKIP', `hanya ${metrics.huePixelPct}% kanvas berwarna`, `butuh >= ${o.minColorAreaPct}%`));
  }
  else {
    const near = metrics.hueBands
      .filter(b => hueDistance(b.deg + 5, options.identityHue) <= o.identityHueTolDeg)
      .reduce((s, b) => s + b.pct, 0);
    rules.push(near >= o.hueBandMinPct
      ? rule('identity-hue', 'PASS', `${round(near)}%`, `>= ${o.hueBandMinPct}% di ${Math.round(options.identityHue)}deg`)
      : rule('identity-hue', 'FAIL', `${round(near)}%`, `>= ${o.hueBandMinPct}% di ${Math.round(options.identityHue)}deg`,
          'warna yang dikonfigurasi tidak muncul di layar — colormap mengabaikannya'));
  }

  if (!options.reference) {
    rules.push(rule('source-fidelity', 'SKIP', 'tanpa referensi', `selisih <= ${o.fidelityTol * 100}%`));
  }
  else {
    const misses = [];
    for (const key of ['detailDensityPct', 'meanClipRunPx']) {
      const ref = options.reference[key];
      if (!ref) continue;
      const dev = Math.abs(metrics[key] - ref) / ref;
      if (dev > o.fidelityTol) misses.push(`${key} ${metrics[key]} vs ${ref} (${Math.round(dev * 100)}%)`);
    }
    rules.push(misses.length === 0
      ? rule('source-fidelity', 'PASS', 'sesuai referensi', `selisih <= ${o.fidelityTol * 100}%`)
      : rule('source-fidelity', 'FAIL', misses.join(' · '), `selisih <= ${o.fidelityTol * 100}%`,
          'konstanta boleh identik — yang dikerjakan efeknya tidak'));
  }

  const pass = rules.filter(r => r.status === 'PASS').length;
  const fail = rules.filter(r => r.status === 'FAIL').length;
  const skip = rules.filter(r => r.status === 'SKIP').length;
  return { mode, metrics, rules, summary: { pass, fail, skip, green: fail === 0 } };
}

export function hueDistance(a, b) {
  const d = Math.abs(((a - b) % 360 + 360) % 360);
  return Math.min(d, 360 - d);
}

export function formatReport(result) {
  const lines = ['effect-audit · mode ' + result.mode, ''];
  for (const r of result.rules) {
    lines.push(`${r.status.padEnd(4)} ${r.id.padEnd(16)} ${r.actual}`);
    if (r.status === 'FAIL') {
      lines.push(`     ${' '.repeat(16)} wajib: ${r.expected}`);
      if (r.note) lines.push(`     ${' '.repeat(16)} ${r.note}`);
    }
  }
  const m = result.metrics;
  lines.push('');
  lines.push(`tinta ${m.inkPct}% · klip ${m.clipPct}% · detail ${m.detailDensityPct}% · deret klip ${m.meanClipRunPx}px (p95 ${m.p95ClipRunPx}px)`);
  lines.push(`${result.summary.pass} pass · ${result.summary.fail} fail · ${result.summary.skip} skip → ${result.summary.green ? 'HIJAU' : 'BELUM SIAP'}`);
  return lines.join('\n');
}

async function readPng(path) {
  const { default: sharp } = await import('sharp');
  const img = sharp(path);
  const { width, height } = await img.metadata();
  const { data, info } = await img.raw().toBuffer({ resolveWithObject: true });
  return { data, width, height, channels: info.channels };
}

function parseArgs(argv) {
  const out = { file: null, mode: 'active', ref: null, identity: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--idle') out.mode = 'idle';
    else if (a === '--ref') out.ref = argv[++i];
    else if (a === '--identity') out.identity = argv[++i];
    else if (!out.file) out.file = a;
  }
  return out;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.file) {
    console.log('usage: node effect-audit.mjs <shot.png> [--idle] [--ref <referensi.png>] [--identity "#0047FF"]');
    console.log('  --idle      screenshot diambil 2-3s setelah reload TANPA menyentuh mouse');
    console.log('  --ref       bandingkan dengan efek sumber yang diklaim ditiru');
    console.log('  --identity  hex warna yang dikonfigurasi di kode — diperiksa benar-benar muncul');
    process.exit(2);
  }
  const metrics = analysePixels(await readPng(args.file));
  const reference = args.ref ? analysePixels(await readPng(args.ref)) : null;
  const result = auditEffect(metrics, {
    mode: args.mode,
    reference,
    identityHue: args.identity ? hexToHue(args.identity) : null,
  });
  console.log(formatReport(result));
  if (!result.summary.green) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) await main();
