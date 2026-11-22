import assert from 'node:assert/strict';
import test from 'node:test';
import { auditAll, auditSnapshot, collectScript, formatReport } from './align-audit.mjs';

function item(sel, opts = {}) {
  return {
    sel,
    text: opts.text ?? sel,
    fontSize: opts.fontSize ?? 16,
    side: opts.side ?? 'left',
    leading: opts.leading ?? true,
    trailing: opts.trailing ?? true,
    top: opts.top ?? 0,
    bottom: opts.bottom ?? 20,
    inkLeft: opts.inkLeft ?? 0,
    inkRight: opts.inkRight ?? 100,
    ancestry: opts.ancestry ?? `${sel}#0>div#0`,
  };
}

function snap(items, w = 1440, h = 722) {
  return { url: 'http://x/', viewport: { w, h }, items };
}

test('dua kolom yang meleset 14px dilaporkan sebagai tepi nyaris sejajar', () => {
  const maulana = item('span.c1-word', { text: 'Maulana', fontSize: 238, top: 307, bottom: 588, inkLeft: 219 });
  const tagline = item('p.c1-tagline', { text: 'Transforming pixels', top: 603, bottom: 642, inkLeft: 233 });
  const r = auditSnapshot(snap([maulana, tagline]));
  assert.equal(r.pass, false);
  assert.equal(r.findings[0].rule, 'near-miss-left');
  assert.equal(r.findings[0].px, 14);
});

test('tepi yang persis sejajar dan tepi yang terpisah jauh sama-sama lolos', () => {
  const a = item('p.a', { top: 0, bottom: 20, inkLeft: 96 });
  const b = item('p.b', { top: 40, bottom: 60, inkLeft: 96.8 });
  const c = item('p.c', { top: 80, bottom: 100, inkLeft: 480 });
  assert.equal(auditSnapshot(snap([a, b, c])).pass, true);
});

test('elemen sebaris tidak dibandingkan satu sama lain', () => {
  const a = item('li.a', { top: 658, bottom: 676, inkLeft: 233 });
  const b = item('li.b', { top: 658, bottom: 676, inkLeft: 245 });
  assert.equal(auditSnapshot(snap([a, b])).pass, true);
});

test('induk dan keturunannya tidak dibandingkan', () => {
  const parent = item('p.parent', { top: 0, bottom: 60, inkLeft: 96, ancestry: 'p#0>div#0' });
  const child = item('span.child', { top: 40, bottom: 60, inkLeft: 106, ancestry: 'span#1>p#0>div#0' });
  assert.equal(auditSnapshot(snap([parent, child])).pass, true);
});

test('teks rata kanan dibandingkan pada tepi kanannya, teks tengah dilewati', () => {
  const a = item('p.a', { side: 'right', top: 0, bottom: 20, inkLeft: 900, inkRight: 1344 });
  const b = item('p.b', { side: 'right', top: 40, bottom: 60, inkLeft: 1100, inkRight: 1332 });
  const c = item('p.c', { side: 'center', top: 80, bottom: 100, inkLeft: 905, inkRight: 1338 });
  const r = auditSnapshot(snap([a, b, c]));
  assert.equal(r.failCount, 1);
  assert.equal(r.findings[0].rule, 'near-miss-right');
});

test('baris miring yang tintanya meleset dari kolom dilaporkan, dan lolos setelah dirata-optiskan', () => {
  const mast = item('span.c1-ch', { text: 'B', fontSize: 200, top: 90, bottom: 300, inkLeft: 96 });
  const raw = item('span.lede', { text: 'performance.', fontSize: 40, top: 340, bottom: 380, inkLeft: 91.8 });
  const fixed = item('span.lede', { text: 'performance.', fontSize: 40, top: 340, bottom: 380, inkLeft: 96 });
  assert.equal(auditSnapshot(snap([mast, raw])).failCount, 1);
  assert.equal(auditSnapshot(snap([mast, fixed])).pass, true);
});

test('huruf yang bukan pembuka baris bukan tepi tata letak', () => {
  const inner = item('span.c1-ch', { text: 'l', fontSize: 200, top: 90, bottom: 300, inkLeft: 351.6, leading: false });
  const clock = item('time', { text: '22:03:06', top: 28, bottom: 52, inkLeft: 355, leading: false });
  const block = item('p.proof', { text: 'Built PLN Mobile', top: 640, bottom: 740, inkLeft: 356 });
  const r = auditSnapshot(snap([inner, clock, block]));
  assert.equal(r.pass, true);
  assert.equal(r.itemCount, 1);
});

test('laporan menyebut jumlah tepi yang diperiksa dan daftar tepi', () => {
  const report = auditAll([snap([item('p.a', { inkLeft: 96 }), item('p.b', { top: 40, bottom: 60, inkLeft: 480 })])]);
  const text = formatReport(report);
  assert.match(text, /2 tepi teks/);
  assert.match(text, /tepi kiri \[96, 480\]/);
  assert.match(text, /HIJAU/);
});

test('kolektor berupa ekspresi yang bisa dijalankan di browser', () => {
  assert.match(collectScript(), /^\(function collector/);
  assert.match(collectScript(), /\(document, window\)$/);
});
