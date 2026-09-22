import { test } from 'node:test';
import assert from 'node:assert/strict';
import { auditSnapshot, collectScript, formatReport, tierOf, trackingRangeEm, trackingTargetEm } from './taste-lint.mjs';

function textEl(over = {}) {
  return {
    sel: 'p',
    tag: 'p',
    sample: 'contoh',
    fontFamily: 'Satoshi, sans-serif',
    fontSize: 18,
    fontWeight: 400,
    letterSpacingEm: 0,
    lineHeightRatio: 1.3,
    textTransform: 'none',
    textWrap: 'pretty',
    fontVariantNumeric: 'normal',
    opacity: 1,
    charsPerLine: 60,
    digitRatio: 0,
    ...over,
  };
}

function cleanSnapshot(over = {}) {
  return {
    url: 'http://localhost:3000/test',
    texts: [
      textEl({ sel: 'h1', tag: 'h1', fontSize: 272, fontWeight: 400, letterSpacingEm: -0.045, lineHeightRatio: 0.85, textWrap: 'balance', charsPerLine: 20 }),
      textEl({ sel: 'h2', tag: 'h2', fontSize: 64, fontWeight: 500, letterSpacingEm: -0.025, lineHeightRatio: 0.85, textWrap: 'balance', charsPerLine: 28 }),
      textEl(),
      textEl({ sel: 'span', tag: 'span', fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500, letterSpacingEm: 0.08, lineHeightRatio: 1.2, textTransform: 'uppercase', textWrap: 'wrap', charsPerLine: 18 }),
    ],
    decor: [{ sel: 'div.grain', opacity: 0.12 }],
    sections: [
      { sel: 'section#hero', paddingTop: 288, paddingBottom: 288 },
      { sel: 'section#about', paddingTop: 120, paddingBottom: 120 },
    ],
    transitions: [{ sel: 'a', property: 'transform, opacity', timing: 'cubic-bezier(0.16, 1, 0.3, 1)', duration: '0.6s' }],
    colors: [{ value: 'rgb(255, 255, 255)', count: 4 }, { value: 'rgb(10, 10, 10)', count: 3 }],
    radii: [],
    ...over,
  };
}

function ruleOf(result, id) {
  return result.rules.find((r) => r.id === id);
}

test('tierOf memetakan ukuran ke tier yang benar', () => {
  assert.equal(tierOf(272), 'display');
  assert.equal(tierOf(64), 'display');
  assert.equal(tierOf(63), 'statement');
  assert.equal(tierOf(32), 'statement');
  assert.equal(tierOf(18), 'body');
  assert.equal(tierOf(12), 'label');
});

test('trackingTargetEm = median terukur dari 104 referensi', () => {
  assert.equal(trackingTargetEm(420, 'none'), 0);
  assert.equal(trackingTargetEm(272, 'none'), -0.03);
  assert.equal(trackingTargetEm(120, 'none'), -0.02);
  assert.equal(trackingTargetEm(64, 'none'), 0);
  assert.equal(trackingTargetEm(40, 'none'), -0.01);
  assert.equal(trackingTargetEm(24, 'none'), 0);
  assert.equal(trackingTargetEm(16, 'none'), 0);
  assert.equal(trackingTargetEm(12, 'none'), 0);
});

test('rentang menampung seluruh nilai nyata dari 15 referensi', () => {
  const real = [
    [264, -0.10], [409, -0.08], [300, -0.06], [427, -0.06], [333, -0.04],
    [260, -0.04], [176, -0.0455], [326, -0.03], [260, -0.0346], [369, -0.02],
    [162, -0.02], [256, -0.02], [397, -0.0075], [200, 0],
  ];
  for (const [size, ls] of real) {
    const r = trackingRangeEm(size, 'none');
    assert.ok(ls >= r.lo && ls <= r.hi, `${size}px @ ${ls}em harus masuk ${r.lo}…${r.hi}`);
  }
});

test('tracking body dan label negatif dari referensi tetap diterima', () => {
  const body = trackingRangeEm(22, 'none');
  assert.ok(-0.05 >= body.lo, 'body -0.05em (lyniq) harus diterima');
  const label = trackingRangeEm(12, 'none');
  assert.ok(-0.04 >= label.lo && 0.02 <= label.hi, 'label -0.04em s/d netral harus diterima');
  const upper = trackingRangeEm(12, 'uppercase');
  assert.ok(0.067 <= upper.hi, 'label uppercase +0.067em (porto) harus diterima');
});

/* Data 104 referensi membantah asumsi monotonik yang dipakai kalibrasi sebelumnya. Kurvanya
   berbentuk U: paling rapat di 160-299px (median -0.03), melonggar lagi di >=300px (median 0,
   58% memakai nol) karena famili display-optimized sudah rapat sejak metriknya. */
test('kurva tracking berbentuk U — terapat di 160-299px, melonggar di >=300px', () => {
  const t = (s) => trackingRangeEm(s, 'none').em;
  assert.ok(t(272) < t(24), 'tier 160-299px harus lebih rapat daripada body');
  assert.ok(t(272) < t(120), 'tier 160-299px harus lebih rapat daripada 96-159px');
  assert.ok(t(420) > t(272), 'tier >=300px harus lebih longgar daripada 160-299px');
  assert.equal(t(420), 0, 'median tier >=300px adalah tracking netral');
});

/* Rentang tetap harus menampung ujung rapat meski targetnya netral: famili teks yang dipakai
   pada ukuran display tetap butuh dirapatkan agresif. */
test('tier >=300px tetap menerima tracking sangat rapat di ujung rentang', () => {
  const r = trackingRangeEm(420, 'none');
  assert.ok(-0.08 >= r.lo, 'display 420px @ -0.08em harus diterima');
  assert.ok(0 <= r.hi && 0 >= r.lo, 'tracking netral harus diterima');
});

test('snapshot bersih lolos semua rule yang berlaku', () => {
  const r = auditSnapshot(cleanSnapshot());
  const failed = r.rules.filter((x) => x.status === 'FAIL');
  assert.deepEqual(failed.map((x) => x.id), [], formatReport(r));
  assert.equal(r.summary.green, true);
});

/* Setelah rentang dikalibrasi ke data nyata, satu nilai global bisa saja masuk rentang di
   setiap tier — jadi yang menangkapnya tinggal `tracking-not-global`. Itu memang satu-satunya
   hal yang bisa ditegakkan secara mekanis ketika tracking yang benar bergantung famili. */
test('tracking global seragam tetap terdeteksi meski nilainya masuk rentang', () => {
  const s = cleanSnapshot();
  for (const t of s.texts) t.letterSpacingEm = -0.02;
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'tracking-threshold').status, 'PASS', '-0.02em masuk rentang di semua tier');
  assert.equal(ruleOf(r, 'tracking-not-global').status, 'FAIL');
});

test('leading di luar rentang terukur ditangkap', () => {
  const s = cleanSnapshot();
  s.texts[0].lineHeightRatio = 1.6;
  const r = auditSnapshot(s);
  const rule = ruleOf(r, 'leading-tier');
  assert.equal(rule.status, 'FAIL');
  assert.match(rule.offenders[0], /display/);
});

/* 1.2 pada display terasa longgar tapi masih di dalam sebaran nyata (max terukur 1.54),
   jadi lint tidak boleh menandainya sebagai pelanggaran. */
test('leading display 1.2 diterima karena masih dalam sebaran referensi', () => {
  const s = cleanSnapshot();
  s.texts[0].lineHeightRatio = 1.2;
  assert.equal(ruleOf(auditSnapshot(s), 'leading-tier').status, 'PASS');
});

test('rasio display:body di bawah 5x gagal', () => {
  const s = cleanSnapshot();
  s.texts[0].fontSize = 72;
  s.texts[0].letterSpacingEm = -0.025;
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'display-body-ratio').status, 'FAIL');
});

test('zona ukuran 30-39px terlarang', () => {
  const s = cleanSnapshot();
  s.texts.push(textEl({ sel: 'h3', tag: 'h3', fontSize: 34, letterSpacingEm: -0.015, lineHeightRatio: 1.0, textWrap: 'balance' }));
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'forbidden-size-zone').status, 'FAIL');
});

test('heading tanpa text-wrap balance gagal', () => {
  const s = cleanSnapshot();
  s.texts[0].textWrap = 'wrap';
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'text-wrap').status, 'FAIL');
});

test('elemen didominasi angka wajib tabular-nums', () => {
  const s = cleanSnapshot();
  s.texts.push(textEl({ sel: 'span.counter', tag: 'span', sample: '2026', digitRatio: 1, fontSize: 12, letterSpacingEm: 0, textWrap: 'wrap', lineHeightRatio: 1.2 }));
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'tabular-nums').status, 'FAIL');

  s.texts.at(-1).fontVariantNumeric = 'tabular-nums';
  assert.equal(ruleOf(auditSnapshot(s), 'tabular-nums').status, 'PASS');
});

test('measure body di atas 75ch gagal, display pakai batas lebih ketat', () => {
  const s = cleanSnapshot();
  s.texts[2].charsPerLine = 92;
  assert.equal(ruleOf(auditSnapshot(s), 'measure').status, 'FAIL');

  const s2 = cleanSnapshot();
  s2.texts[1].charsPerLine = 40;
  assert.equal(ruleOf(auditSnapshot(s2), 'measure').status, 'FAIL');
});

test('padding section tetangga identik gagal', () => {
  const s = cleanSnapshot({
    sections: [
      { sel: 'section#a', paddingTop: 120, paddingBottom: 120 },
      { sel: 'section#b', paddingTop: 120, paddingBottom: 120 },
    ],
  });
  assert.equal(ruleOf(auditSnapshot(s), 'section-padding-neighbor').status, 'FAIL');
});

test('opacity di bawah floor gagal', () => {
  const s = cleanSnapshot({ decor: [{ sel: 'div.ghost', opacity: 0.03, blend: 'normal' }] });
  assert.equal(ruleOf(auditSnapshot(s), 'opacity-floor').status, 'FAIL');
});

test('grain ber-blend-mode dikecualikan dari opacity floor', () => {
  const s = cleanSnapshot({ decor: [{ sel: 'div.grain', opacity: 0.04, blend: 'overlay' }] });
  const rule = ruleOf(auditSnapshot(s), 'opacity-floor');
  assert.equal(rule.status, 'PASS');
  assert.match(rule.actual, /dikecualikan karena blend mode/);
});

test('elemen inline tidak dinilai untuk leading', () => {
  const s = cleanSnapshot();
  s.texts.push(textEl({ sel: 'a', tag: 'a', fontSize: 18, lineHeightRatio: 1.6, letterSpacingEm: 0, textWrap: 'wrap' }));
  assert.equal(ruleOf(auditSnapshot(s), 'leading-tier').status, 'PASS');
});

test('display-body-ratio menjelaskan kemungkinan masthead di canvas', () => {
  const s = cleanSnapshot({
    texts: [
      textEl({ sel: 'h1', tag: 'h1', fontSize: 27, letterSpacingEm: -0.005, lineHeightRatio: 1.3, textWrap: 'balance', charsPerLine: 30 }),
      textEl({ fontSize: 27, letterSpacingEm: -0.005, lineHeightRatio: 1.3 }),
    ],
  });
  const rule = ruleOf(auditSnapshot(s), 'display-body-ratio');
  assert.equal(rule.status, 'FAIL');
  assert.match(rule.offenders[0], /canvas\/WebGL/);
});

test('jumlah famili dan weight dibatasi', () => {
  const s = cleanSnapshot();
  s.texts.push(textEl({ fontFamily: 'Bebas Neue', fontWeight: 700 }));
  s.texts.push(textEl({ fontFamily: 'Cormorant', fontWeight: 300 }));
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'font-family-count').status, 'FAIL');
  assert.equal(ruleOf(r, 'font-weight-count').status, 'FAIL');
});

test('font-family-count membedakan skeleton diulang dari kontras skeleton', () => {
  const sameSkeleton = cleanSnapshot();
  sameSkeleton.texts.push(textEl({ fontFamily: 'Bebas Neue' }));
  sameSkeleton.texts.push(textEl({ fontFamily: 'Switzer' }));
  const a = ruleOf(auditSnapshot(sameSkeleton), 'font-family-count');
  assert.equal(a.status, 'FAIL');
  assert.match(a.offenders.join(' '), /nol kontras skeleton/);

  const mixedSkeleton = cleanSnapshot();
  mixedSkeleton.texts.push(textEl({ fontFamily: 'Bebas Neue' }));
  mixedSkeleton.texts.push(textEl({ fontFamily: 'Apparel' }));
  const b = ruleOf(auditSnapshot(mixedSkeleton), 'font-family-count');
  assert.equal(b.status, 'FAIL');
  assert.match(b.offenders.join(' '), /kontras skeleton ADA/);
  assert.match(b.offenders.join(' '), /jangan longgarkan ambang/);
});

test('easing dan properti animasi BANNED terdeteksi', () => {
  const s = cleanSnapshot({
    transitions: [
      { sel: 'a', property: 'width, opacity', timing: 'ease', duration: '0.3s' },
    ],
  });
  const r = auditSnapshot(s);
  assert.equal(ruleOf(r, 'easing-banned').status, 'FAIL');
  assert.equal(ruleOf(r, 'animated-props').status, 'FAIL');
});

test('lebih dari satu skala radius gagal', () => {
  const s = cleanSnapshot({ radii: [{ value: '4px', count: 3 }, { value: '12px', count: 2 }] });
  assert.equal(ruleOf(auditSnapshot(s), 'radius-scale').status, 'FAIL');
});

test('rule tanpa data dilaporkan SKIP, bukan PASS', () => {
  const r = auditSnapshot({ texts: [], sections: [], transitions: [], decor: [], colors: [], radii: [] });
  assert.equal(ruleOf(r, 'easing-banned').status, 'SKIP');
  assert.equal(ruleOf(r, 'section-padding-neighbor').status, 'SKIP');
  assert.equal(ruleOf(r, 'display-body-ratio').status, 'SKIP');
});

test('collectScript menghasilkan IIFE yang menerima document dan window', () => {
  const src = collectScript();
  assert.match(src, /^\(function collector\(doc, win\)/);
  assert.match(src, /\)\(document, window\)$/);
  assert.doesNotMatch(src, /\bdocument\.querySelector/);
});

test('formatReport menandai status hijau dan merah', () => {
  assert.match(formatReport(auditSnapshot(cleanSnapshot())), /HIJAU/);
  const s = cleanSnapshot();
  s.texts[0].lineHeightRatio = 2;
  assert.match(formatReport(auditSnapshot(s)), /BELUM SIAP/);
});
