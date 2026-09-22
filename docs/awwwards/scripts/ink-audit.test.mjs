import assert from 'node:assert/strict';
import test from 'node:test';
import { auditAll, auditSnapshot, collectScript, formatReport } from './ink-audit.mjs';

function item(sel, opts = {}) {
  const fontSize = opts.fontSize ?? 16;
  return {
    sel,
    text: opts.text ?? sel,
    tag: opts.tag ?? 'p',
    isInline: opts.isInline ?? false,
    fontSize,
    lineHeightRatio: opts.lineHeightRatio ?? 1.3,
    lineCount: opts.lineCount ?? 1,
    family: opts.family ?? 'Switzer',
    weight: opts.weight ?? '400',
    inkAscentRatio: opts.inkAscentRatio ?? 0.72,
    inkDescentRatio: opts.inkDescentRatio ?? 0.22,
    inkTop: opts.inkTop ?? 0,
    inkBottom: opts.inkBottom ?? 20,
    boxTop: opts.boxTop ?? 0,
    boxBottom: opts.boxBottom ?? 20,
    boxLeft: opts.boxLeft ?? opts.inkLeft ?? 0,
    boxRight: opts.boxRight ?? opts.inkRight ?? 100,
    isLabel: opts.isLabel ?? false,
    ancestry: opts.ancestry ?? `${sel}#0>div#0`,
  };
}

function snap(items, w = 1440, h = 900) {
  return { url: 'http://x/', viewport: { w, h }, items };
}

test('tinta yang menembus antar baris masthead dilaporkan meski kotak CSS tidak tumpang tindih', () => {
  const billy = item('span.line-a', { text: 'Billy', fontSize: 266, inkTop: 184.6, inkBottom: 465.3, inkLeft: 51, inkRight: 492, boxTop: 211.7, boxBottom: 440.8, ancestry: 'span#0>h1#0>div#0' });
  const maulana = item('span.line-b', { text: 'Maulana', fontSize: 266, inkTop: 413.7, inkBottom: 637.7, inkLeft: 51, inkRight: 917, boxTop: 440.8, boxBottom: 669.9, ancestry: 'span#1>h1#0>div#0' });
  const r = auditSnapshot(snap([billy, maulana]));
  assert.equal(r.pass, false);
  const hit = r.findings.find(f => f.rule === 'ink-collision');
  assert.ok(hit, 'tabrakan tinta wajib terdeteksi');
  assert.equal(hit.px, 52);
});

test('kotak CSS yang hanya bersentuhan tanpa tinta bertabrakan tidak dilaporkan', () => {
  const a = item('p.a', { inkTop: 0, inkBottom: 18, inkLeft: 0, inkRight: 100 });
  const b = item('p.b', { inkTop: 40, inkBottom: 58, inkLeft: 0, inkRight: 100, ancestry: 'p#1>div#0' });
  assert.equal(auditSnapshot(snap([a, b])).pass, true);
});

test('dua elemen berperan berbeda dengan gap nol dilaporkan', () => {
  const label = item('span.status', { text: 'AVAILABLE FOR WORK', fontSize: 11.2, isLabel: true, inkLeft: 984, inkRight: 1149, inkTop: 68, inkBottom: 87 });
  const contact = item('a.contact', { text: 'billy@mail.com', fontSize: 20, tag: 'a', isInline: true, inkLeft: 1149, inkRight: 1394, inkTop: 60, inkBottom: 90, ancestry: 'a#1>div#0' });
  const r = auditSnapshot(snap([label, contact]));
  assert.equal(r.pass, false);
  assert.ok(r.findings.some(f => f.rule === 'ink-gap'), 'gap nol antar peran berbeda wajib gagal');
});

test('teks sealiran dengan ukuran sebanding boleh rapat', () => {
  const body = item('p.body', { fontSize: 16, inkLeft: 0, inkRight: 100, inkTop: 0, inkBottom: 18 });
  const emphasis = item('em.emph', { fontSize: 18, tag: 'em', isInline: true, inkLeft: 100, inkRight: 180, inkTop: 0, inkBottom: 18, ancestry: 'em#1>div#0' });
  assert.equal(auditSnapshot(snap([body, emphasis])).pass, true);
});

test('leading di bawah rasio tinta famili dilaporkan dengan defisit piksel', () => {
  const masthead = item('h1.mast', {
    text: 'Billy Maulana', fontSize: 266.4, lineCount: 2,
    lineHeightRatio: 0.86, inkAscentRatio: 0.821, inkDescentRatio: 0.233,
    family: 'PP Editorial New', weight: '200',
  });
  const r = auditSnapshot(snap([masthead]));
  const hit = r.findings.find(f => f.rule === 'leading-below-ink');
  assert.ok(hit, 'leading di bawah rasio tinta wajib gagal');
  assert.equal(hit.px, 52);
  assert.match(hit.detail, /PP Editorial New/);
});

test('leading di atas rasio tinta lolos', () => {
  const ok = item('h1.mast', { fontSize: 200, lineCount: 2, lineHeightRatio: 1.1, inkAscentRatio: 0.82, inkDescentRatio: 0.23 });
  assert.equal(auditSnapshot(snap([ok])).pass, true);
});

test('elemen satu baris tidak diperiksa lewat rule leading', () => {
  const single = item('h1.mast', { fontSize: 200, lineCount: 1, lineHeightRatio: 0.7, inkAscentRatio: 0.82, inkDescentRatio: 0.23 });
  assert.equal(auditSnapshot(snap([single])).pass, true);
});

test('overhang kerning antar glyph sebaris tidak dilaporkan', () => {
  const b = item('span.th-glyph', { text: 'B', fontSize: 266, boxTop: 211.7, inkTop: 190, inkBottom: 400, inkLeft: 51, inkRight: 200, ancestry: 'span#0>span#0>h1#0' });
  const i = item('span.th-glyph', { text: 'i', fontSize: 266, boxTop: 211.7, inkTop: 190, inkBottom: 400, inkLeft: 195, inkRight: 240, ancestry: 'span#1>span#0>h1#0' });
  assert.equal(auditSnapshot(snap([b, i])).pass, true);
});

test('glyph dari dua baris berbeda tetap dilaporkan meski induknya bersaudara', () => {
  const y = item('span.th-glyph', { text: 'y', fontSize: 266, boxTop: 211.7, inkTop: 250, inkBottom: 465.3, inkLeft: 380, inkRight: 492, ancestry: 'span#4>span#0>h1#0' });
  const m = item('span.th-glyph', { text: 'M', fontSize: 266, boxTop: 440.8, inkTop: 413.7, inkBottom: 630, inkLeft: 160, inkRight: 420, ancestry: 'span#0>span#1>h1#0' });
  const r = auditSnapshot(snap([y, m]));
  assert.equal(r.pass, false);
  assert.ok(r.findings.some(f => f.rule === 'ink-collision'));
});

test('elemen dan keturunannya tidak dihitung bertabrakan', () => {
  const parent = item('p.wrap', { inkTop: 0, inkBottom: 100, inkLeft: 0, inkRight: 400, ancestry: 'p#0>div#0' });
  const child = item('em.inner', { inkTop: 10, inkBottom: 40, inkLeft: 10, inkRight: 200, fontSize: 40, ancestry: 'em#0>p#0>div#0' });
  assert.equal(auditSnapshot(snap([parent, child])).pass, true);
});

test('auditAll menggabungkan banyak viewport dan formatReport menandai merah', () => {
  const bad = snap([
    item('span.a', { text: 'Billy', boxTop: 0, inkTop: 0, inkBottom: 50, inkLeft: 0, inkRight: 200, ancestry: 'span#0>h1#0' }),
    item('span.b', { text: 'Maulana', boxTop: 40, inkTop: 30, inkBottom: 80, inkLeft: 0, inkRight: 300, ancestry: 'span#1>h1#0' }),
  ]);
  const report = auditAll([bad, snap([item('p.solo')])]);
  assert.equal(report.pass, false);
  assert.equal(report.totalFails, 1);
  assert.match(formatReport(report), /MERAH/);
});

test('collectScript menghasilkan ekspresi yang bisa dievaluasi di browser', () => {
  const src = collectScript();
  assert.match(src, /^\(function collector/);
  assert.match(src, /document, window/);
  assert.match(src, /measureText/);
});
