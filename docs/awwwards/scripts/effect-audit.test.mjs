import assert from 'node:assert/strict';
import { test } from 'node:test';
import { analysePixels, auditEffect, formatReport, hexToHue, hueDistance, rgbToHueSat } from './effect-audit.mjs';

function makeImage(width, height, fn) {
  const data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const [r, g, b] = fn(x, y);
      const i = (y * width + x) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  return { data, width, height, channels: 4 };
}

const BLACK = [0, 0, 0];
const WHITE = [255, 255, 255];

const flatBlob = makeImage(400, 100, x => (x < 200 ? WHITE : BLACK));
const stripes = makeImage(200, 100, x => (x % 12 < 3 ? WHITE : BLACK));

test('hex biru identitas jatuh di sekitar 223 derajat', () => {
  assert.ok(Math.abs(hexToHue('#0047FF') - 223) < 3);
  assert.equal(hexToHue('bukan-hex'), null);
});

test('abu-abu murni tidak punya saturasi', () => {
  assert.equal(rgbToHueSat(128, 128, 128).sat, 0);
});

test('jarak hue melewati batas 360', () => {
  assert.equal(hueDistance(350, 10), 20);
  assert.equal(hueDistance(10, 350), 20);
});

test('bidang rata terbaca sebagai deret panjang tanpa tepi', () => {
  const m = analysePixels(flatBlob);
  assert.equal(m.meanClipRunPx, 200);
  assert.ok(m.detailDensityPct < 2, `detail ${m.detailDensityPct}%`);
});

test('pola berfrekuensi tinggi terbaca sebagai deret pendek dengan banyak tepi', () => {
  const m = analysePixels(stripes);
  assert.equal(m.meanClipRunPx, 3);
  assert.ok(m.detailDensityPct > 20, `detail ${m.detailDensityPct}%`);
});

test('mode active menolak bidang rata dan meloloskan pola berdetail', () => {
  const blob = auditEffect(analysePixels(flatBlob), { mode: 'active' });
  const ids = blob.rules.filter(r => r.status === 'FAIL').map(r => r.id);
  assert.deepEqual(ids.sort(), ['detail-density', 'flat-field']);
  assert.equal(blob.summary.green, false);

  const rich = auditEffect(analysePixels(stripes), { mode: 'active' });
  assert.equal(rich.summary.green, true);
});

test('mode idle mengukur cakupan, bukan detail', () => {
  const idle = auditEffect(analysePixels(flatBlob), { mode: 'idle' });
  const coverage = idle.rules.find(r => r.id === 'idle-coverage');
  assert.equal(coverage.status, 'FAIL');
  assert.equal(idle.rules.find(r => r.id === 'detail-density').status, 'SKIP');

  const quiet = auditEffect(analysePixels(makeImage(200, 100, () => BLACK)), { mode: 'idle' });
  assert.equal(quiet.rules.find(r => r.id === 'idle-coverage').status, 'PASS');
});

test('lebih dari empat pita hue ditolak', () => {
  const palette = [
    [255, 0, 0], [255, 128, 0], [255, 255, 0], [0, 255, 0],
    [0, 255, 255], [0, 0, 255], [128, 0, 255], [255, 0, 255],
  ];
  const many = makeImage(200, 100, x => palette[Math.floor(x / 25)]);
  const result = auditEffect(analysePixels(many), { mode: 'active' });
  assert.equal(result.rules.find(r => r.id === 'hue-discipline').status, 'FAIL');
});

test('warna yang dikonfigurasi wajib benar-benar muncul', () => {
  const orange = makeImage(200, 100, () => [240, 140, 40]);
  const identityHue = hexToHue('#0047FF');

  const missing = auditEffect(analysePixels(orange), { mode: 'active', identityHue });
  assert.equal(missing.rules.find(r => r.id === 'identity-hue').status, 'FAIL');

  const blue = makeImage(200, 100, () => [0, 71, 255]);
  const present = auditEffect(analysePixels(blue), { mode: 'active', identityHue });
  assert.equal(present.rules.find(r => r.id === 'identity-hue').status, 'PASS');
});

test('kesetiaan sumber gagal saat metriknya menyimpang lebih dari toleransi', () => {
  const metrics = analysePixels(flatBlob);
  const reference = analysePixels(stripes);

  const drifted = auditEffect(metrics, { mode: 'active', reference });
  assert.equal(drifted.rules.find(r => r.id === 'source-fidelity').status, 'FAIL');

  const same = auditEffect(reference, { mode: 'active', reference });
  assert.equal(same.rules.find(r => r.id === 'source-fidelity').status, 'PASS');
});

test('tanpa referensi dan tanpa hue identitas, dua rule di-skip bukan di-pass', () => {
  const result = auditEffect(analysePixels(stripes), { mode: 'active' });
  const skipped = result.rules.filter(r => r.status === 'SKIP').map(r => r.id);
  assert.ok(skipped.includes('source-fidelity'));
  assert.ok(skipped.includes('identity-hue'));
});

test('laporan memuat status tiap rule dan ringkasan', () => {
  const text = formatReport(auditEffect(analysePixels(flatBlob), { mode: 'active' }));
  assert.match(text, /FAIL detail-density/);
  assert.match(text, /BELUM SIAP/);
});
