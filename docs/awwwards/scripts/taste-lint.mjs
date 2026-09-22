import { readFileSync, writeFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

export const TIERS = { display: 64, statement: 32, body: 15, label: 0 };

/* Dikalibrasi 2026-07-26 dari 80 situs terukur. Target = median, rentang = p10..p90 dilebarkan.
   Koreksi penting: median leading display adalah 0.95, BUKAN 0.85 — angka lama diambil dari satu
   referensi lalu dinaikkan jadi aturan. 0.85 ada di sekitar p25: condong rapat, bukan median. */
export const LEADING_RANGES = {
  display: { em: 0.95, lo: 0.68, hi: 1.25 },
  statement: { em: 0.95, lo: 0.7, hi: 1.2 },
  body: { em: 1.29, lo: 0.95, hi: 1.75 },
  label: { em: 1.33, lo: 0.95, hi: 2.05 },
};

export const LEADING_TARGETS = {
  display: LEADING_RANGES.display.em,
  statement: LEADING_RANGES.statement.em,
  body: LEADING_RANGES.body.em,
  label: LEADING_RANGES.label.em,
};

/* Dikalibrasi ulang 2026-07-26 dari 104 situs terukur di references/library/ (median = target,
   p10..p90 dilebarkan sedikit = rentang). Tracking ditentukan oleh FAMILI × WEIGHT, bukan ukuran
   semata — Clash Display butuh -0.0075em sementara Switzer 300 butuh -0.10em pada ukuran sebanding.

   Hubungan tracking terhadap ukuran TIDAK monoton. Titik terapat ada di 160-299px (median -0.03,
   hanya 32% memakai nol), lalu melonggar lagi di >=300px (median 0, 58% memakai nol). Sebabnya:
   display >=300px cenderung memakai famili yang metriknya memang dirancang untuk ukuran display
   (Humane, Bdogrotesk, OT Jubilee, Times, Instrument Serif) dan sudah rapat sejak awal, sementara
   160-299px lebih sering memakai grotesk teks yang metriknya perlu dirapatkan. Kalibrasi
   sebelumnya menyamakan keduanya di -0.03 dan akan menolak 11 dari 19 referensi tier >=300px. */
export const TRACKING_RANGES = [
  { min: 300, em: 0, lo: -0.095, hi: 0.03 },
  { min: 160, em: -0.03, lo: -0.115, hi: 0.025 },
  { min: 96, em: -0.02, lo: -0.06, hi: 0.025 },
  { min: 56, em: 0, lo: -0.09, hi: 0.025 },
  { min: 32, em: -0.01, lo: -0.06, hi: 0.025 },
  { min: 20, em: 0, lo: -0.07, hi: 0.03 },
  { min: 14, em: 0, lo: -0.07, hi: 0.03 },
];

/* Label (n=29): median 0, p90 +0.058, max +0.20. Tracking positif lebar sah tapi bukan default;
   negatif juga umum (p10 -0.027). Rentang mencakup keduanya. */
export const LABEL_TRACKING = { upper: { em: 0, lo: -0.065, hi: 0.21 }, normal: { em: 0, lo: -0.065, hi: 0.07 } };

const INLINE_TAGS = new Set(['a', 'span', 'em', 'strong', 'b', 'i', 'small', 'sup', 'sub', 'code', 'abbr', 'label', 'time', 'mark', 'u', 's']);

export const DEFAULTS = {
  maxTextFamilies: 2,
  maxWeights: 3,
  leadingTol: 0.06,
  minDisplayBodyRatio: 5,
  forbiddenSizeZone: [30, 39],
  maxMeasureBody: 75,
  maxMeasureDisplay: 34,
  opacityFloor: 0.08,
  maxColors: 5,
  maxRadiusScales: 1,
  digitDominance: 0.5,
  minSampleForUniformTracking: 3,
};

const BANNED_EASINGS = ['linear', 'ease', 'cubic-bezier(0.25, 0.1, 0.25, 1)'];

const BANNED_ANIMATED_PROPS = ['width', 'height', 'margin', 'margin-top', 'margin-left', 'margin-right', 'margin-bottom', 'top', 'left', 'right', 'bottom', 'padding'];

/* Dijalankan di dalam browser lewat evaluate_script. doc/win diinjeksi sebagai argumen
   supaya file ini tetap bebas global browser dan bisa di-lint sebagai modul Node. */
function collector(doc, win) {
  const px = (v) => {
    const n = Number.parseFloat(v);
    return Number.isFinite(n) ? n : 0;
  };
  const visible = (el, cs) => {
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const ownText = (el) => {
    let t = '';
    for (const n of el.childNodes) if (n.nodeType === 3) t += n.nodeValue;
    return t.replace(/\s+/g, ' ').trim();
  };
  const ctx = doc.createElement('canvas').getContext('2d');
  const chWidth = (cs) => {
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    return ctx.measureText('0').width || px(cs.fontSize) * 0.5;
  };

  const texts = [];
  const decor = [];
  const colors = {};
  const radii = {};
  const transitions = [];
  /* Pindai hanya di dalam root aplikasi. Overlay Nuxt DevTools disuntikkan sebagai sibling
     di luar #__nuxt dan menyumbang easing `ease` serta transition width/height yang bukan
     milik halaman — kalau ikut terpindai, lint melaporkan pelanggaran yang tidak bisa
     diperbaiki siapa pun. */
  const root = doc.querySelector('#__nuxt') ?? doc.body;
  const all = root.querySelectorAll('*');
  const isTooling = (el) => Boolean(el.closest('[id*="devtools"], [class*="devtools"], [data-v-inspector-container]'));

  for (const el of all) {
    if (isTooling(el)) continue;
    const cs = win.getComputedStyle(el);
    if (!visible(el, cs)) continue;

    const op = px(cs.opacity);
    if (op > 0 && op < 1) {
      decor.push({
        sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
        opacity: op,
        blend: cs.mixBlendMode,
      });
    }

    if (cs.backgroundColor && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors[cs.backgroundColor] = (colors[cs.backgroundColor] || 0) + 1;

    const br = cs.borderRadius;
    if (br && br !== '0px' && !br.includes('%') && px(br) < 9990) radii[br] = (radii[br] || 0) + 1;

    if (cs.transitionDuration && cs.transitionDuration !== '0s') {
      transitions.push({
        sel: el.tagName.toLowerCase(),
        property: cs.transitionProperty,
        timing: cs.transitionTimingFunction,
        duration: cs.transitionDuration,
      });
    }

    const text = ownText(el);
    if (!text) continue;

    const size = px(cs.fontSize);
    const ls = cs.letterSpacing === 'normal' ? 0 : px(cs.letterSpacing);
    const lh = cs.lineHeight === 'normal' ? size * 1.2 : px(cs.lineHeight);
    const rect = el.getBoundingClientRect();
    const digits = (text.match(/\d/g) || []).length;

    colors[cs.color] = (colors[cs.color] || 0) + 1;

    texts.push({
      sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''),
      tag: el.tagName.toLowerCase(),
      sample: text.slice(0, 40),
      textLength: text.length,
      fontFamily: cs.fontFamily,
      fontSize: size,
      fontWeight: Number(cs.fontWeight) || 400,
      letterSpacingEm: size ? ls / size : 0,
      lineHeightRatio: size ? lh / size : 0,
      textTransform: cs.textTransform,
      textWrap: cs.textWrap || cs.textWrapStyle || 'wrap',
      whiteSpace: cs.whiteSpace,
      fontVariantNumeric: cs.fontVariantNumeric,
      opacity: op,
      charsPerLine: Math.round(rect.width / chWidth(cs)),
      digitRatio: text.length ? digits / text.length : 0,
    });
  }

  const sections = [];
  for (const el of root.querySelectorAll('section, main > div, [data-section]')) {
    if (isTooling(el)) continue;
    const cs = win.getComputedStyle(el);
    if (!visible(el, cs)) continue;
    const pt = px(cs.paddingTop);
    const pb = px(cs.paddingBottom);
    /* Wrapper tanpa padding vertikal bukan section ritmis — memasukkannya membuat rule
       padding-neighbor selalu gagal karena 0 == 0. */
    if (pt === 0 && pb === 0) continue;
    sections.push({
      sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : ''),
      paddingTop: pt,
      paddingBottom: pb,
    });
  }

  return {
    url: win.location.href,
    viewport: { w: win.innerWidth, h: win.innerHeight },
    capturedAt: new Date().toISOString(),
    texts,
    decor,
    sections,
    transitions,
    colors: Object.entries(colors).map(([value, count]) => ({ value, count })),
    radii: Object.entries(radii).map(([value, count]) => ({ value, count })),
  };
}

export function collectScript() {
  return `(${collector.toString()})(document, window)`;
}

/* Modul ESM untuk ditaruh sementara di public/ supaya browser bisa meng-import-nya —
   jauh lebih murah daripada menempelkan seluruh sumber kolektor ke tiap evaluate_script. */
export function collectModule() {
  return `export default ${collector.toString()};\n`;
}

export function tierOf(size) {
  if (size >= TIERS.display) return 'display';
  if (size >= TIERS.statement) return 'statement';
  if (size >= TIERS.body) return 'body';
  return 'label';
}

export function trackingRangeEm(size, textTransform) {
  if (size < 14) return textTransform === 'uppercase' ? LABEL_TRACKING.upper : LABEL_TRACKING.normal;
  for (const t of TRACKING_RANGES) if (size >= t.min) return t;
  return LABEL_TRACKING.normal;
}

export function trackingTargetEm(size, textTransform) {
  return trackingRangeEm(size, textTransform).em;
}

function primaryFamily(fontFamily) {
  return String(fontFamily).split(',')[0].trim().replace(/^["']|["']$/g, '');
}

function isMono(family) {
  return /mono|code|courier/i.test(family);
}

const SKELETON_MAP = {
  'PP Editorial New': 'serif',
  'Apparel': 'serif',
  'Instrument Serif': 'serif',
  'Cormorant': 'serif',
  'Italiana': 'serif',
  'Marck Script': 'script',
  'Bebas Neue': 'sans',
  'Suisse': 'sans',
  'Switzer': 'sans',
  'Satoshi': 'sans',
  'Clash Display': 'sans',
  'Obviously': 'sans',
  'Host Grotesk': 'sans',
  'Inter': 'sans',
  'Manrope': 'sans',
  'Barlow': 'sans',
  'Almarai': 'sans',
};

/* Jumlah famili yang benar tidak membuktikan pasangannya benar: tiga sans adalah satu skeleton
   yang diulang tiga kali, sementara dua sans + satu serif punya kontras pada sumbu skeleton.
   Klasifikasi ini hanya memperkaya pesan diagnosis — ambangnya sengaja tidak dilonggarkan. */
function skeletonOf(family) {
  if (isMono(family))
    return 'mono';
  const known = SKELETON_MAP[family];
  if (known)
    return known;
  if (/serif|didone|editorial|garamond|times|georgia|playfair|baskerville|didot|bodoni/i.test(family))
    return 'serif';
  if (/grotesk|grotesque|sans|helvetica|arial|akzidenz|neue montreal|humane/i.test(family))
    return 'sans';
  return 'takdiketahui';
}

function round(n, d = 3) {
  return Number(n.toFixed(d));
}

function ok(id, actual, expected) {
  return { id, status: 'PASS', actual, expected, offenders: [] };
}

function bad(id, actual, expected, offenders) {
  return { id, status: 'FAIL', actual, expected, offenders };
}

function skip(id, reason) {
  return { id, status: 'SKIP', actual: reason, expected: '-', offenders: [] };
}

export const RULES = [
  {
    id: 'font-family-count',
    check(s, c) {
      const fams = [...new Set(s.texts.map((t) => primaryFamily(t.fontFamily)))];
      const mono = fams.filter(isMono);
      const text = fams.filter((f) => !isMono(f));
      const labelled = text.map((f) => `${f} [${skeletonOf(f)}]`);
      const skeletons = [...new Set(text.map(skeletonOf))];
      const actual = `${text.length} teks (${labelled.join(', ') || '-'}) + ${mono.length} mono — skeleton: ${skeletons.join(' + ') || '-'}`;
      const expected = `≤ ${c.maxTextFamilies} teks + 1 mono`;
      if (text.length <= c.maxTextFamilies && mono.length <= 1)
        return ok(this.id, actual, expected);
      const diagnosis = skeletons.length === 1
        ? `${skeletons[0]} diulang ${text.length}x — nol kontras skeleton, kontras hanya lewat lebar/weight (dimensi terlemah)`
        : `kontras skeleton ADA (${skeletons.join(' + ')}), tapi jumlah famili tetap di atas ambang — kurangi famili, jangan longgarkan ambang`;
      return bad(this.id, actual, expected, [...labelled, ...mono, diagnosis]);
    },
  },
  {
    id: 'font-weight-count',
    check(s, c) {
      const w = [...new Set(s.texts.map((t) => t.fontWeight))].sort((a, b) => a - b);
      return w.length <= c.maxWeights ? ok(this.id, w.join(', '), `≤ ${c.maxWeights}`) : bad(this.id, w.join(', '), `≤ ${c.maxWeights}`, w.map(String));
    },
  },
  {
    id: 'tracking-threshold',
    check(s) {
      const off = [];
      for (const t of s.texts) {
        const r = trackingRangeEm(t.fontSize, t.textTransform);
        if (t.letterSpacingEm < r.lo || t.letterSpacingEm > r.hi) {
          off.push(`${t.sel} ${Math.round(t.fontSize)}px → ${round(t.letterSpacingEm)}em (wajar ${r.lo}…${r.hi}em) "${t.sample}"`);
        }
      }
      const actual = `${off.length}/${s.texts.length} elemen di luar rentang`;
      return off.length === 0 ? ok(this.id, actual, 'dalam rentang per ambang ukuran') : bad(this.id, actual, 'dalam rentang per ambang ukuran', off);
    },
  },
  {
    id: 'tracking-not-global',
    check(s, c) {
      const byTier = {};
      for (const t of s.texts) (byTier[tierOf(t.fontSize)] ??= new Set()).add(round(t.letterSpacingEm, 4));
      const tiers = Object.keys(byTier);
      if (tiers.length < 2 || s.texts.length < c.minSampleForUniformTracking) return skip(this.id, 'sampel tier < 2');
      const values = [...new Set(tiers.flatMap((k) => [...byTier[k]]))];
      const actual = `${values.length} nilai tracking untuk ${tiers.length} tier`;
      return values.length > 1 ? ok(this.id, actual, '> 1 nilai') : bad(this.id, actual, '> 1 nilai', [`semua tier memakai ${values[0]}em — indikasi satu nilai global`]);
    },
  },
  {
    id: 'leading-tier',
    check(s) {
      /* Elemen inline mewarisi line-height dari blok induknya — menilainya sendiri
         menghasilkan pelanggaran palsu untuk tautan di tengah paragraf. */
      const blocks = s.texts.filter((t) => !INLINE_TAGS.has(t.tag));
      if (!blocks.length) return skip(this.id, 'tidak ada elemen blok berteks');
      const off = [];
      for (const t of blocks) {
        const tier = tierOf(t.fontSize);
        const r = LEADING_RANGES[tier];
        if (t.lineHeightRatio < r.lo || t.lineHeightRatio > r.hi) {
          off.push(`${t.sel} ${Math.round(t.fontSize)}px [${tier}] → ${round(t.lineHeightRatio, 2)} (wajar ${r.lo}…${r.hi})`);
        }
      }
      const actual = `${off.length}/${blocks.length} blok di luar rentang`;
      return off.length === 0 ? ok(this.id, actual, 'dalam rentang per tier') : bad(this.id, actual, 'dalam rentang per tier', off);
    },
  },
  {
    id: 'display-body-ratio',
    check(s, c) {
      const body = s.texts.filter((t) => tierOf(t.fontSize) === 'body').map((t) => t.fontSize);
      if (!body.length || !s.texts.length) return skip(this.id, 'tidak ada teks body');
      const sorted = [...body].sort((a, b) => a - b);
      const median = sorted[Math.floor(sorted.length / 2)];
      const max = Math.max(...s.texts.map((t) => t.fontSize));
      const ratio = median ? max / median : 0;
      const actual = `${round(ratio, 1)}× (${Math.round(max)}px : ${Math.round(median)}px)`;
      if (ratio >= c.minDisplayBodyRatio) return ok(this.id, actual, `≥ ${c.minDisplayBodyRatio}×`);
      const hint = max < TIERS.display
        ? 'tidak ada satu pun teks ≥64px di DOM — masthead kemungkinan dirender di canvas/WebGL sehingga tidak terukur di sini; verifikasi manual'
        : 'lompatan ukuran terlalu kecil';
      return bad(this.id, actual, `≥ ${c.minDisplayBodyRatio}×`, [hint]);
    },
  },
  {
    id: 'forbidden-size-zone',
    check(s, c) {
      const [lo, hi] = c.forbiddenSizeZone;
      const off = s.texts.filter((t) => t.fontSize >= lo && t.fontSize <= hi).map((t) => `${t.sel} ${Math.round(t.fontSize)}px "${t.sample}"`);
      const actual = `${off.length} elemen di zona ${lo}–${hi}px`;
      return off.length === 0 ? ok(this.id, actual, `0 elemen di ${lo}–${hi}px`) : bad(this.id, actual, `0 elemen di ${lo}–${hi}px`, off);
    },
  },
  {
    id: 'text-wrap',
    check(s) {
      const off = [];
      for (const t of s.texts) {
        /* Elemen 1–2 karakter (mis. span per-huruf hasil split) tidak pernah wrap. */
        if ((t.textLength ?? t.sample.length) <= 2) continue;
        /* `white-space: nowrap` melarang pembungkusan sama sekali, dan menyetelnya juga
           mereset `text-wrap` ke nowrap. Menuntut `balance` pada elemen semacam itu meminta
           algoritma penyeimbang bekerja pada teks yang tidak akan pernah punya baris kedua. */
        if (t.whiteSpace === 'nowrap' || t.whiteSpace === 'pre') continue;
        const tier = tierOf(t.fontSize);
        const isHeading = /^h[1-6]$/.test(t.tag) || tier === 'display' || tier === 'statement';
        /* Tier label terlalu pendek untuk terpengaruh algoritma wrap — menuntutnya
           menghasilkan pelanggaran yang tidak berarti apa pun. */
        const isBody = (t.tag === 'p' || t.tag === 'li') && tier === 'body';
        if (isHeading && t.textWrap !== 'balance') off.push(`${t.sel} heading → text-wrap: ${t.textWrap} (wajib balance)`);
        else if (isBody && !['pretty', 'balance'].includes(t.textWrap)) off.push(`${t.sel} body → text-wrap: ${t.textWrap} (wajib pretty)`);
      }
      const actual = `${off.length} elemen belum diset`;
      return off.length === 0 ? ok(this.id, actual, 'balance di heading, pretty di body') : bad(this.id, actual, 'balance di heading, pretty di body', off);
    },
  },
  {
    id: 'tabular-nums',
    check(s, c) {
      const numeric = s.texts.filter((t) => t.digitRatio >= c.digitDominance);
      if (!numeric.length) return skip(this.id, 'tidak ada elemen didominasi angka');
      const off = numeric.filter((t) => !/tabular-nums/.test(t.fontVariantNumeric)).map((t) => `${t.sel} "${t.sample}"`);
      const actual = `${off.length}/${numeric.length} elemen angka tanpa tabular-nums`;
      return off.length === 0 ? ok(this.id, actual, 'semua elemen angka tabular-nums') : bad(this.id, actual, 'semua elemen angka tabular-nums', off);
    },
  },
  {
    id: 'measure',
    check(s, c) {
      const off = [];
      for (const t of s.texts) {
        const tier = tierOf(t.fontSize);
        const limit = tier === 'display' || tier === 'statement' ? c.maxMeasureDisplay : c.maxMeasureBody;
        if (t.charsPerLine > limit) off.push(`${t.sel} [${tier}] ${t.charsPerLine}ch (maks ${limit}ch)`);
      }
      const actual = `${off.length} elemen melebihi measure`;
      return off.length === 0 ? ok(this.id, actual, `body ≤${c.maxMeasureBody}ch, display ≤${c.maxMeasureDisplay}ch`) : bad(this.id, actual, `body ≤${c.maxMeasureBody}ch, display ≤${c.maxMeasureDisplay}ch`, off);
    },
  },
  {
    id: 'section-padding-neighbor',
    check(s) {
      if (s.sections.length < 2) return skip(this.id, 'section < 2');
      const off = [];
      for (let i = 1; i < s.sections.length; i++) {
        const a = s.sections[i - 1];
        const b = s.sections[i];
        if (a.paddingTop === b.paddingTop && a.paddingBottom === b.paddingBottom) {
          off.push(`${a.sel} dan ${b.sel} identik (${a.paddingTop}/${a.paddingBottom}px)`);
        }
      }
      const actual = `${off.length} pasang tetangga identik`;
      return off.length === 0 ? ok(this.id, actual, '0 pasang identik') : bad(this.id, actual, '0 pasang identik', off);
    },
  },
  {
    id: 'opacity-floor',
    check(s, c) {
      /* Grain/noise ber-blend-mode dikecualikan: taste profile mewajibkan grain di opacity 0.04,
         dan blend mode membuatnya terlihat meski opacity mentahnya di bawah floor. */
      const candidates = s.decor.filter((d) => !d.blend || d.blend === 'normal');
      const off = candidates.filter((d) => d.opacity < c.opacityFloor).map((d) => `${d.sel} opacity ${d.opacity}`);
      const exempt = s.decor.length - candidates.length;
      const actual = `${off.length} elemen di bawah ${c.opacityFloor}${exempt ? ` (${exempt} dikecualikan karena blend mode)` : ''}`;
      return off.length === 0 ? ok(this.id, actual, `≥ ${c.opacityFloor} kecuali ber-blend-mode`) : bad(this.id, actual, `≥ ${c.opacityFloor} kecuali ber-blend-mode`, off);
    },
  },
  {
    id: 'color-count',
    check(s, c) {
      const sig = s.colors.filter((x) => x.count > 1).map((x) => x.value);
      const actual = `${sig.length} warna signifikan`;
      return sig.length <= c.maxColors ? ok(this.id, actual, `≤ ${c.maxColors}`) : bad(this.id, actual, `≤ ${c.maxColors}`, sig);
    },
  },
  {
    id: 'radius-scale',
    check(s, c) {
      const vals = s.radii.map((x) => x.value);
      const actual = vals.length ? vals.join(', ') : 'tidak ada radius';
      return vals.length <= c.maxRadiusScales ? ok(this.id, actual, `≤ ${c.maxRadiusScales} skala`) : bad(this.id, actual, `≤ ${c.maxRadiusScales} skala`, vals);
    },
  },
  {
    id: 'easing-banned',
    check(s) {
      if (!s.transitions.length) return skip(this.id, 'tidak ada CSS transition');
      const off = s.transitions.filter((t) => BANNED_EASINGS.includes(t.timing.trim())).map((t) => `${t.sel} → ${t.timing} (${t.property})`);
      const actual = `${off.length}/${s.transitions.length} transition memakai easing BANNED`;
      return off.length === 0 ? ok(this.id, actual, 'tidak ada linear/ease') : bad(this.id, actual, 'tidak ada linear/ease', off);
    },
  },
  {
    id: 'animated-props',
    check(s) {
      if (!s.transitions.length) return skip(this.id, 'tidak ada CSS transition');
      const off = [];
      for (const t of s.transitions) {
        const props = t.property.split(',').map((p) => p.trim());
        const banned = props.filter((p) => BANNED_ANIMATED_PROPS.includes(p));
        if (banned.length) off.push(`${t.sel} → ${banned.join(', ')}`);
      }
      const actual = `${off.length} transition menganimasi properti non-compositor`;
      return off.length === 0 ? ok(this.id, actual, 'hanya transform/opacity/clip-path') : bad(this.id, actual, 'hanya transform/opacity/clip-path', off);
    },
  },
];

export function auditSnapshot(snapshot, config = {}) {
  const c = { ...DEFAULTS, ...config };
  const s = {
    texts: [], decor: [], sections: [], transitions: [], colors: [], radii: [],
    ...snapshot,
  };
  const rules = RULES.map((r) => r.check(s, c));
  const fail = rules.filter((r) => r.status === 'FAIL').length;
  const pass = rules.filter((r) => r.status === 'PASS').length;
  const skipped = rules.filter((r) => r.status === 'SKIP').length;
  return {
    url: s.url ?? null,
    summary: { pass, fail, skip: skipped, total: rules.length, green: fail === 0 },
    rules,
  };
}

export function formatReport(result, { verbose = true } = {}) {
  const lines = [];
  if (result.url) lines.push(`taste-lint · ${result.url}`);
  lines.push('');
  for (const r of result.rules) {
    lines.push(`${r.status.padEnd(4)} ${r.id.padEnd(26)} ${r.actual}`);
    if (r.status === 'FAIL') {
      lines.push(`     ${' '.repeat(26)} wajib: ${r.expected}`);
      if (verbose) for (const o of r.offenders.slice(0, 8)) lines.push(`       - ${o}`);
      if (verbose && r.offenders.length > 8) lines.push(`       ... +${r.offenders.length - 8} lagi`);
    }
  }
  const { pass, fail, skip: sk } = result.summary;
  lines.push('');
  lines.push(`${pass} pass · ${fail} fail · ${sk} skip → ${result.summary.green ? 'HIJAU' : 'BELUM SIAP'}`);
  return lines.join('\n');
}

function main() {
  const [file, arg2] = process.argv.slice(2);
  if (!file) {
    console.log('usage: node taste-lint.mjs <snapshot.json>   audit snapshot');
    console.log('       node taste-lint.mjs --script          cetak IIFE untuk evaluate_script');
    console.log('       node taste-lint.mjs --emit <path.js>  tulis modul ESM (taruh di public/, import dari browser)');
    process.exit(2);
  }
  if (file === '--script') {
    console.log(collectScript());
    return;
  }
  if (file === '--emit') {
    if (!arg2) { console.error('--emit butuh path tujuan'); process.exit(2); }
    writeFileSync(arg2, collectModule());
    console.log(`modul kolektor ditulis: ${arg2}`);
    return;
  }
  const snapshot = JSON.parse(readFileSync(file, 'utf8'));
  const result = auditSnapshot(snapshot);
  console.log(formatReport(result));
  if (!result.summary.green) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
