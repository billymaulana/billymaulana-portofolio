import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

export const GATE = 8.0;

export function parseJsonl(text) {
  return text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('//'))
    .map((l, i) => {
      try {
        return JSON.parse(l);
      } catch {
        throw new Error(`baris ${i + 1} bukan JSON valid: ${l.slice(0, 60)}`);
      }
    });
}

export function jaccard(a = [], b = []) {
  const sa = new Set(a.map((x) => String(x).toLowerCase()));
  const sb = new Set(b.map((x) => String(x).toLowerCase()));
  if (!sa.size && !sb.size) return 1;
  const inter = [...sa].filter((x) => sb.has(x)).length;
  const union = new Set([...sa, ...sb]).size;
  return union ? inter / union : 0;
}

function verdictOf(entry) {
  const a = entry.actual;
  if (!a) return null;
  if (typeof a === 'string') return a;
  return a.verdict ?? null;
}

/* Entri retrospektif dinilai SETELAH verdict Billy diketahui, jadi ia menguji apakah rubrik
   mampu memisahkan yang diterima dari yang ditolak — bukan seberapa baik sistem menebak.
   Mencampurnya ke metrik prediktif akan menghasilkan false-positive rate yang palsu. */
export function splitRetrospective(entries) {
  return {
    predictive: entries.filter((e) => !e.retrospective),
    retrospective: entries.filter((e) => e.retrospective),
  };
}

export function scoreRetrospective(entries) {
  const rows = entries.filter((e) => verdictOf(e) !== null);
  const separated = rows.filter((e) => {
    const min = Math.min(e.a_score ?? 0, e.t_score ?? 0);
    return verdictOf(e) === 'reject' ? min < GATE : min >= GATE;
  });
  const gaps = rows
    .filter((e) => typeof e.a_score === 'number' && typeof e.t_score === 'number')
    .map((e) => ({ route: e.route, a: e.a_score, t: e.t_score, gap: e.a_score - e.t_score, verdict: verdictOf(e) }));
  return {
    total: rows.length,
    separated: separated.length,
    separationRate: rows.length ? separated.length / rows.length : null,
    gaps,
  };
}

export function scorePredictions(entries) {
  const resolved = entries.filter((e) => verdictOf(e) !== null);
  if (!resolved.length) {
    return { resolved: 0, pending: entries.length, accuracy: null, falsePositiveRate: null, falseNegativeRate: null, mae: null, moodJaccard: null, drift: null, misses: [] };
  }

  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;
  const errors = [];
  const moods = [];
  const misses = [];

  for (const e of resolved) {
    const actual = verdictOf(e);
    const predicted = e.predict ?? (Math.min(e.a_score ?? 0, e.t_score ?? 0) >= GATE ? 'accept' : 'reject');
    if (predicted === 'accept' && actual === 'accept') tp++;
    else if (predicted === 'reject' && actual === 'reject') tn++;
    else if (predicted === 'accept' && actual === 'reject') {
      fp++;
      misses.push({ kind: 'false-positive', route: e.route, predicted, actual, min: Math.min(e.a_score ?? 0, e.t_score ?? 0), quote: e.actual?.quote ?? '' });
    } else {
      fn++;
      misses.push({ kind: 'false-negative', route: e.route, predicted, actual, min: Math.min(e.a_score ?? 0, e.t_score ?? 0), quote: e.actual?.quote ?? '' });
    }

    const actualScore = e.actual?.score;
    if (typeof actualScore === 'number') errors.push(Math.abs(Math.min(e.a_score ?? 0, e.t_score ?? 0) - actualScore));

    const actualMood = e.actual?.mood;
    if (Array.isArray(actualMood)) moods.push(jaccard(e.mood, actualMood));
  }

  const acceptPredicted = tp + fp;
  const rejectActual = tn + fp;

  const recent = resolved.slice(-10);
  const earlier = resolved.slice(0, -10);
  const fpRateOf = (list) => {
    const acc = list.filter((e) => (e.predict ?? 'reject') === 'accept');
    if (!acc.length) return null;
    return acc.filter((e) => verdictOf(e) === 'reject').length / acc.length;
  };

  return {
    resolved: resolved.length,
    pending: entries.length - resolved.length,
    accuracy: (tp + tn) / resolved.length,
    falsePositiveRate: acceptPredicted ? fp / acceptPredicted : null,
    falseNegativeRate: rejectActual === 0 && fn === 0 ? null : fn / Math.max(1, tn + fn),
    mae: errors.length ? errors.reduce((a, b) => a + b, 0) / errors.length : null,
    moodJaccard: moods.length ? moods.reduce((a, b) => a + b, 0) / moods.length : null,
    drift: earlier.length ? { recent: fpRateOf(recent), earlier: fpRateOf(earlier) } : null,
    counts: { tp, tn, fp, fn },
    misses,
  };
}

export function checkAssertions(assertions, expectations) {
  const out = [];
  for (const a of assertions) {
    const exp = expectations.pairs?.[a.pair];
    if (!exp) {
      out.push({ pair: a.pair, status: 'UNKNOWN', detail: 'tidak ada ekspektasi terdaftar' });
      continue;
    }
    if (a.pick === 'skip') {
      out.push({ pair: a.pair, status: 'SKIPPED', rule: exp.rule, detail: 'dilewati' });
      continue;
    }
    /* Pasangan yang mengubah lebih dari satu variabel tidak bisa mengonfirmasi maupun
       membantah aturan apa pun — memaksanya jadi salah satu berarti mengunci kesimpulan
       yang tidak ditopang datanya. INCONCLUSIVE menahan pasangan itu di luar hitungan
       sampai ada uji isolatif, tanpa menghapus jejaknya. */
    if (exp.inconclusive) {
      out.push({ pair: a.pair, status: 'INCONCLUSIVE', rule: exp.rule, detail: exp.inconclusive, picked: a.pick, note: a.note });
      continue;
    }
    if (a.pick === exp.expects) {
      out.push({ pair: a.pair, status: 'CONFIRMED', rule: exp.rule, detail: `Billy memilih ${a.pick.toUpperCase()} sesuai aturan`, note: a.note });
    } else {
      out.push({ pair: a.pair, status: 'CONTRADICTED', rule: exp.rule, detail: exp.ifContradicted, picked: a.pick, expected: exp.expects, note: a.note });
    }
  }
  return out;
}

export function formatReport({ predictions, assertions, retrospective }) {
  const lines = ['taste-calibration', ''];

  if (retrospective && retrospective.total) {
    lines.push('## Validasi rubrik (retrospektif — bukan prediksi buta)');
    lines.push(`  ${retrospective.separated}/${retrospective.total} karya terpisah benar oleh min(A,T)`);
    for (const g of retrospective.gaps) {
      lines.push(`   - ${g.route.padEnd(18)} A ${g.a.toFixed(1)} · T ${g.t.toFixed(1)} · selisih ${g.gap.toFixed(1)} → ${g.verdict}`);
    }
    lines.push('  Selisih A−T besar = kegagalan taste yang tidak terlihat oleh rubrik Awwwards.');
    lines.push('');
  }

  lines.push('## Prediksi critic vs verdict Billy');
  if (!predictions || predictions.resolved === 0) {
    lines.push(`  belum ada prediksi yang punya verdict (pending: ${predictions?.pending ?? 0})`);
    lines.push('  → jalankan minimal 3 review dengan prediksi tersegel sebelum metrik ini berarti');
  } else {
    const pct = (v) => (v === null ? '-' : `${(v * 100).toFixed(0)}%`);
    lines.push(`  resolved            ${predictions.resolved} (pending ${predictions.pending})`);
    lines.push(`  accuracy            ${pct(predictions.accuracy)}`);
    lines.push(`  FALSE POSITIVE      ${pct(predictions.falsePositiveRate)}   ← metrik terpenting`);
    lines.push(`  false negative      ${pct(predictions.falseNegativeRate)}`);
    lines.push(`  MAE skor            ${predictions.mae === null ? '-' : predictions.mae.toFixed(2)}`);
    lines.push(`  mood Jaccard        ${predictions.moodJaccard === null ? '-' : predictions.moodJaccard.toFixed(2)}`);
    if (predictions.drift) lines.push(`  drift FP (10 akhir) ${pct(predictions.drift.recent)} vs ${pct(predictions.drift.earlier)} sebelumnya`);
    for (const m of predictions.misses) {
      lines.push(`   - ${m.kind} ${m.route} (min ${m.min}) ${m.quote ? `"${m.quote}"` : ''}`);
    }
  }

  lines.push('');
  lines.push('## Aturan vs pilihan Billy');
  if (!assertions || !assertions.length) {
    lines.push('  belum ada assertion — jalankan sesi di /calibration lalu isi assertions.jsonl');
  } else {
    for (const r of assertions) {
      lines.push(`  ${r.status.padEnd(13)} ${r.pair}`);
      if (r.rule) lines.push(`                ${r.rule}`);
      if (r.status === 'CONTRADICTED') {
        lines.push(`                Billy pilih ${String(r.picked).toUpperCase()}, aturan memprediksi ${String(r.expected).toUpperCase()}`);
        lines.push(`                → ${r.detail}`);
      }
      if (r.status === 'INCONCLUSIVE') {
        lines.push(`                Billy pilih ${String(r.picked).toUpperCase()} — tidak dihitung`);
        lines.push(`                → ${r.detail}`);
      }
      if (r.note) lines.push(`                catatan Billy: "${r.note}"`);
    }
    const contradicted = assertions.filter((r) => r.status === 'CONTRADICTED').length;
    const inconclusive = assertions.filter((r) => r.status === 'INCONCLUSIVE').length;
    lines.push('');
    lines.push(`  ${assertions.filter((r) => r.status === 'CONFIRMED').length} dikonfirmasi · ${contradicted} dibantah · ${inconclusive} tidak konklusif`);
    if (contradicted) lines.push('  → setiap aturan yang dibantah WAJIB direvisi bertanggal, bukan diabaikan');
    if (inconclusive) lines.push('  → pasangan tidak konklusif menunggu uji ulang dengan satu variabel berubah');
  }

  return lines.join('\n');
}

function readIfExists(path, fallback) {
  return existsSync(path) ? readFileSync(path, 'utf8') : fallback;
}

function main() {
  const dir = join(process.cwd(), 'docs/awwwards/calibration');
  const predEntries = parseJsonl(readIfExists(join(dir, 'predictions.jsonl'), ''));
  const assertEntries = parseJsonl(readIfExists(join(dir, 'assertions.jsonl'), ''));
  const expectations = JSON.parse(readIfExists(join(dir, 'expectations.json'), '{"pairs":{}}'));
  const { predictive, retrospective } = splitRetrospective(predEntries);

  const report = formatReport({
    retrospective: scoreRetrospective(retrospective),
    predictions: scorePredictions(predictive),
    assertions: checkAssertions(assertEntries, expectations),
  });
  console.log(report);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
