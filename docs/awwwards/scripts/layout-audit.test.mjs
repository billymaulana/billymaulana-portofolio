import assert from 'node:assert/strict';
import test from 'node:test';
import { AUDIT_VIEWPORTS, auditAll, auditViewport, collectScript, formatReport } from './layout-audit.mjs';

function box(sel, top, left, w, h, extra = {}) {
  return { sel, text: extra.text ?? '', textLen: extra.textLen ?? (extra.text ?? '').length, isMedia: extra.isMedia ?? false, isLabel: extra.isLabel ?? false, blockParent: extra.blockParent ?? '', headingRoot: extra.headingRoot ?? '', top, left, bottom: top + h, right: left + w, w, h, fontSize: extra.fontSize ?? 16, interactive: extra.interactive ?? false, depth: extra.depth ?? 3 };
}

function snap(boxes, w = 1440, h = 780) {
  return { url: 'http://x/', viewport: { w, h }, boxes, docScrollWidth: w };
}

test('viewport wajib memuat ukuran laptop dengan toolbar', () => {
  const has = (w, h) => AUDIT_VIEWPORTS.some(v => v.w === w && v.h === h);
  assert.ok(has(1440, 780), '1440x780 wajib — laptop 1440x900 dengan toolbar browser');
  assert.ok(has(1366, 768), '1366x768 wajib — laptop 14 inci');
  assert.ok(has(390, 844), '390x844 wajib — ponsel');
  assert.ok(AUDIT_VIEWPORTS.length >= 6, 'minimal 6 viewport');
});

test('tabrakan nyata terdeteksi — kasus logo vs eyebrow', () => {
  const r = auditViewport(snap([
    box('div.th-logo', 46, 46, 130, 130, { isMedia: true }),
    box('p.th-eyebrow', 154, 46, 372, 17, { text: 'FRONTEND ENGINEER' }),
  ]));
  assert.equal(r.pass, false);
  const f = r.findings.find(x => x.rule === 'overlap');
  assert.ok(f, 'overlap harus dilaporkan');
  assert.ok(f.overlapPx > 2000, `luas tabrakan ${f.overlapPx} harus > 2000px²`);
});

test('induk yang memuat anak bukan tabrakan', () => {
  const r = auditViewport(snap([
    box('div.card', 100, 100, 400, 200),
    box('p.card__text', 120, 120, 300, 40, { text: 'isi kartu' }),
  ]));
  assert.equal(r.findings.filter(f => f.rule === 'overlap').length, 0);
});

test('tumpang tindih sub-piksel diabaikan', () => {
  const r = auditViewport(snap([
    box('div.a', 100, 100, 200, 50, { text: 'a' }),
    box('div.b', 149, 100, 200, 50, { text: 'b' }),
  ]));
  assert.equal(r.findings.filter(f => f.rule === 'overlap').length, 0);
});

test('teks yang keluar viewport dilaporkan, media bleed tidak', () => {
  const teks = auditViewport(snap([box('p.x', 100, 1300, 300, 20, { text: 'kalimat panjang yang terpotong', fontSize: 18 })]));
  assert.ok(teks.findings.some(f => f.rule === 'horizontal-spill'));

  const media = auditViewport(snap([box('img.hero', 0, -80, 1600, 400, { isMedia: true })]));
  assert.equal(media.findings.filter(f => f.rule === 'horizontal-spill').length, 0);
});

test('display besar boleh bleed, teks baca tidak boleh', () => {
  const display = auditViewport(snap([box('h1.mast', 100, -20, 1500, 260, { text: 'Billy', fontSize: 252 })]));
  assert.equal(display.findings.filter(f => f.rule === 'horizontal-spill').length, 0);
});

test('tap target kecil hanya diperiksa pada viewport sempit', () => {
  const ponsel = auditViewport(snap([box('a.link', 100, 100, 30, 30, { text: 'x', interactive: true })], 390, 844));
  assert.ok(ponsel.findings.some(f => f.rule === 'tap-target'));
  assert.equal(ponsel.pass, true, 'tap-target adalah warn, bukan fail');

  const desktop = auditViewport(snap([box('a.link', 100, 100, 30, 30, { text: 'x', interactive: true })], 1440, 900));
  assert.equal(desktop.findings.filter(f => f.rule === 'tap-target').length, 0);
});

test('scroll horizontal halaman gagal', () => {
  const s = snap([box('div.a', 10, 10, 100, 100, { text: 'a' })]);
  s.docScrollWidth = 1500;
  const r = auditViewport(s);
  assert.equal(r.pass, false);
  assert.ok(r.findings.some(f => f.rule === 'page-scroll-x'));
});

test('font terlalu kecil untuk teks panjang diperingatkan', () => {
  const r = auditViewport(snap([box('p.tiny', 100, 100, 400, 12, { text: 'kalimat yang cukup panjang', textLen: 96, fontSize: 11 })]));
  assert.ok(r.findings.some(f => f.rule === 'font-too-small'));
});

test('label sentence-case pendek tidak dianggap teks baca', () => {
  const r = auditViewport(snap([box('p.meta', 100, 100, 200, 12, { text: 'Frontend engineer, Bandung', textLen: 26, fontSize: 12.4 })]));
  assert.equal(r.findings.filter(f => f.rule === 'font-too-small').length, 0);
});

test('rule measure membaca panjang penuh, bukan teks laporan yang dipotong', () => {
  const truncatedButLong = box('p.body', 100, 100, 400, 12, { text: 'dipotong pada dua puluh dela', textLen: 120, fontSize: 11 });
  assert.ok(truncatedButLong.text.length <= 28, 'fixture wajib mencerminkan pemotongan collector');
  assert.ok(auditViewport(snap([truncatedButLong])).findings.some(f => f.rule === 'font-too-small'));
});

test('label uppercase bertracking lebar dikecualikan dari ambang ukuran', () => {
  const r = auditViewport(snap([box('p.label', 100, 100, 400, 12, { text: 'FRONTEND ENGINEER - BANDUNG, ID', fontSize: 11.5, isLabel: true })]));
  assert.equal(r.findings.filter(f => f.rule === 'font-too-small').length, 0);
});

test('glyph dalam blok teks yang sama tidak dihitung tabrakan', () => {
  /* leading 0.86 membuat bbox baris saling tumpang tindih; tintanya tidak bersentuhan */
  const r = auditViewport(snap([
    box('span.th-glyph', 300, 400, 60, 260, { text: 'y', blockParent: 'h1.th-masthead#0' }),
    box('span.th-glyph', 520, 380, 70, 260, { text: 'a', blockParent: 'h1.th-masthead#0' }),
  ]));
  assert.equal(r.findings.filter(f => f.rule === 'overlap').length, 0);
});

test('glyph dari baris berbeda dalam satu heading tidak dihitung tabrakan', () => {
  const r = auditViewport(snap([
    box('span.th-glyph', 200, 100, 60, 260, { text: 'y', blockParent: 'span.line#0', headingRoot: 'h1#0' }),
    box('span.th-glyph', 420, 90, 90, 260, { text: 'M', blockParent: 'span.line#1', headingRoot: 'h1#0' }),
  ]));
  assert.equal(r.findings.filter(f => f.rule === 'overlap').length, 0);
});

test('elemen dari blok berbeda tetap dinilai tabrakan', () => {
  const r = auditViewport(snap([
    box('img.mark', 46, 46, 130, 130, { isMedia: true, blockParent: 'div.brand#0' }),
    box('p.id', 154, 46, 372, 17, { text: 'FRONTEND', blockParent: 'div.lockup#1' }),
  ]));
  assert.equal(r.findings.filter(f => f.rule === 'overlap').length, 1);
});

test('auditAll gagal bila satu viewport saja gagal', () => {
  const bersih = snap([box('div.a', 10, 10, 100, 100, { text: 'a' })], 1440, 900);
  const rusak = snap([
    box('div.logo', 46, 46, 130, 130, { isMedia: true }),
    box('p.eyebrow', 154, 46, 372, 17, { text: 'x' }),
  ], 1440, 780);
  const r = auditAll([bersih, rusak]);
  assert.equal(r.pass, false);
  assert.equal(r.totalFails, 1);
});

test('layout bersih di semua viewport lolos', () => {
  const clean = [1440, 780, 1366].map(() => snap([
    box('div.logo', 46, 46, 120, 28, { isMedia: true }),
    box('p.eyebrow', 200, 46, 372, 17, { text: 'FRONTEND ENGINEER' }),
  ]));
  const r = auditAll(clean);
  assert.equal(r.pass, true);
  assert.equal(r.totalFails, 0);
});

test('collectScript menghasilkan IIFE yang menerima document dan window', () => {
  const s = collectScript();
  assert.ok(s.startsWith('('), 'harus IIFE');
  assert.ok(s.endsWith('(document, window)'), 'harus dipanggil dengan document dan window');
  assert.ok(!s.includes('\nexport '), 'tidak boleh memuat sintaks modul');
});

test('formatReport menandai hijau dan merah', () => {
  const hijau = formatReport(auditAll([snap([box('div.a', 10, 10, 100, 100, { text: 'a' })])]));
  assert.match(hijau, /HIJAU/);
  const merah = formatReport(auditAll([snap([
    box('div.logo', 46, 46, 130, 130, { isMedia: true }),
    box('p.eyebrow', 154, 46, 372, 17, { text: 'x' }),
  ])]));
  assert.match(merah, /MERAH/);
  assert.match(merah, /menimpa/);
});
