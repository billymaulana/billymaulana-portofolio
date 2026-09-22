import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkAssertions, formatReport, jaccard, parseJsonl, scorePredictions, scoreRetrospective, splitRetrospective } from './taste-calibration.mjs';

const EXPECTATIONS = {
  pairs: {
    'tracking-display': { expects: 'b', rule: 'tabel tracking', ifContradicted: 'longgarkan tabel' },
    'leading-display': { expects: 'a', rule: 'leading 0.85', ifContradicted: 'naikkan target' },
  },
};

function pred(over = {}) {
  return { ts: '2026-07-26T00:00:00Z', route: '/x', a_score: 8.5, t_score: 8.2, mood: ['premium'], predict: 'accept', actual: null, ...over };
}

test('parseJsonl mengabaikan baris kosong dan komentar', () => {
  const rows = parseJsonl('{"a":1}\n\n// catatan\n{"a":2}\n');
  assert.deepEqual(rows, [{ a: 1 }, { a: 2 }]);
});

test('parseJsonl melaporkan nomor baris saat JSON rusak', () => {
  assert.throws(() => parseJsonl('{"a":1}\n{rusak}'), /baris 2/);
});

test('jaccard menghitung irisan token mood', () => {
  assert.equal(jaccard(['premium'], ['premium']), 1);
  assert.equal(jaccard([], []), 1);
  assert.equal(jaccard(['premium', 'austere'], ['premium', 'brutal']), 1 / 3);
  assert.equal(jaccard(['Premium'], ['premium']), 1);
});

test('prediksi tanpa verdict dilaporkan sebagai pending, bukan nol', () => {
  const m = scorePredictions([pred(), pred()]);
  assert.equal(m.resolved, 0);
  assert.equal(m.pending, 2);
  assert.equal(m.falsePositiveRate, null);
});

test('false positive dihitung dari prediksi accept yang ditolak Billy', () => {
  const m = scorePredictions([
    pred({ route: '/a', predict: 'accept', actual: { verdict: 'reject', score: 5, quote: 'jelek' } }),
    pred({ route: '/b', predict: 'accept', actual: { verdict: 'accept', score: 8.4 } }),
    pred({ route: '/c', predict: 'reject', actual: { verdict: 'reject', score: 4 } }),
  ]);
  assert.equal(m.counts.fp, 1);
  assert.equal(m.counts.tp, 1);
  assert.equal(m.counts.tn, 1);
  assert.equal(m.falsePositiveRate, 0.5);
  assert.equal(m.accuracy, 2 / 3);
  assert.equal(m.misses[0].kind, 'false-positive');
  assert.equal(m.misses[0].quote, 'jelek');
});

test('predict diturunkan dari min(a,t) bila tidak ditulis', () => {
  const m = scorePredictions([
    { route: '/x', a_score: 9, t_score: 6, actual: { verdict: 'reject' } },
  ]);
  assert.equal(m.counts.tn, 1, 'min 6 → prediksi reject → cocok dengan verdict reject');
});

test('MAE memakai min(a,t), bukan rata-rata', () => {
  const m = scorePredictions([
    pred({ a_score: 9, t_score: 6, predict: 'reject', actual: { verdict: 'reject', score: 5 } }),
  ]);
  assert.equal(m.mae, 1);
});

test('verdict boleh ditulis sebagai string pendek', () => {
  const m = scorePredictions([pred({ predict: 'accept', actual: 'accept' })]);
  assert.equal(m.resolved, 1);
  assert.equal(m.counts.tp, 1);
});

test('assertion yang sesuai ekspektasi berstatus CONFIRMED', () => {
  const r = checkAssertions([{ pair: 'tracking-display', pick: 'b', note: '' }], EXPECTATIONS);
  assert.equal(r[0].status, 'CONFIRMED');
});

test('assertion yang berlawanan menghasilkan CONTRADICTED beserta tindakannya', () => {
  const r = checkAssertions([{ pair: 'tracking-display', pick: 'a', note: 'terlalu rapat' }], EXPECTATIONS);
  assert.equal(r[0].status, 'CONTRADICTED');
  assert.equal(r[0].detail, 'longgarkan tabel');
  assert.equal(r[0].note, 'terlalu rapat');
});

test('pasangan yang ditandai inconclusive tidak dihitung sebagai konfirmasi maupun bantahan', () => {
  const expectations = {
    pairs: {
      'weight-display': {
        expects: 'b',
        rule: 'weight bukan diskriminator tunggal',
        ifContradicted: 'jangan dipakai',
        inconclusive: 'varian mengubah famili sekaligus weight',
      },
    },
  };

  for (const pick of ['a', 'b']) {
    const r = checkAssertions([{ pair: 'weight-display', pick, note: '' }], expectations);
    assert.equal(r[0].status, 'INCONCLUSIVE');
    assert.equal(r[0].detail, 'varian mengubah famili sekaligus weight');
    assert.equal(r[0].picked, pick);
  }

  const text = formatReport({ assertions: checkAssertions([{ pair: 'weight-display', pick: 'a', note: '' }], expectations) });
  assert.match(text, /0 dibantah · 1 tidak konklusif/);
  assert.match(text, /menunggu uji ulang dengan satu variabel berubah/);
});

test('skip dan pair tak dikenal ditangani tanpa melempar', () => {
  const r = checkAssertions([
    { pair: 'leading-display', pick: 'skip' },
    { pair: 'entah-apa', pick: 'a' },
  ], EXPECTATIONS);
  assert.equal(r[0].status, 'SKIPPED');
  assert.equal(r[1].status, 'UNKNOWN');
});

test('report menyorot false positive dan aturan yang dibantah', () => {
  const text = formatReport({
    predictions: scorePredictions([pred({ predict: 'accept', actual: { verdict: 'reject', score: 5, quote: 'ai slop' } })]),
    assertions: checkAssertions([{ pair: 'tracking-display', pick: 'a' }], EXPECTATIONS),
  });
  assert.match(text, /FALSE POSITIVE\s+100%/);
  assert.match(text, /CONTRADICTED/);
  assert.match(text, /WAJIB direvisi bertanggal/);
});

test('entri retrospektif dipisahkan dari metrik prediktif', () => {
  const rows = [
    pred({ route: '/blind', predict: 'accept', actual: { verdict: 'reject' } }),
    pred({ route: '/old', retrospective: true, a_score: 6.6, t_score: 3.5, predict: 'reject', actual: { verdict: 'reject' } }),
  ];
  const { predictive, retrospective } = splitRetrospective(rows);
  assert.equal(predictive.length, 1);
  assert.equal(retrospective.length, 1);
  assert.equal(scorePredictions(predictive).falsePositiveRate, 1, 'retrospektif tidak boleh mengencerkan FP rate');
});

test('validasi retrospektif mengukur pemisahan, bukan tebakan', () => {
  const r = scoreRetrospective([
    { route: '/a', a_score: 6.6, t_score: 3.5, actual: { verdict: 'reject' } },
    { route: '/b', a_score: 8.4, t_score: 8.2, actual: { verdict: 'accept' } },
    { route: '/c', a_score: 9.0, t_score: 8.5, actual: { verdict: 'reject' } },
  ]);
  assert.equal(r.total, 3);
  assert.equal(r.separated, 2, 'entri /c gagal dipisahkan — rubrik meloloskan yang ditolak');
  assert.equal(r.gaps[0].gap, 6.6 - 3.5);
});

test('report menampilkan selisih A-T pada bagian retrospektif', () => {
  const text = formatReport({
    retrospective: scoreRetrospective([{ route: '/hero-explore-2', a_score: 6.6, t_score: 3.5, actual: { verdict: 'reject' } }]),
    predictions: scorePredictions([]),
    assertions: [],
  });
  assert.match(text, /Validasi rubrik/);
  assert.match(text, /selisih 3\.1/);
});

test('report tetap informatif saat kedua sumber kosong', () => {
  const text = formatReport({ predictions: scorePredictions([]), assertions: checkAssertions([], EXPECTATIONS) });
  assert.match(text, /belum ada prediksi/);
  assert.match(text, /belum ada assertion/);
});
