import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/* layout-audit memakai getBoundingClientRect, yang mengembalikan kotak line-box — bukan batas
   tinta glyph. Pada line-height di bawah 1 kotak itu lebih pendek daripada huruf yang benar-benar
   digambar, sehingga dua baris bisa lolos sebagai "tidak tumpang tindih" sementara tintanya
   menembus puluhan piksel. Itu yang meluluskan /hero-explore-3 v3 di tujuh viewport sekaligus
   (defisit terukur 51,6px pada masthead 266px). Audit ini mengukur kotak tinta lewat TextMetrics
   dan karena itu melihat apa yang dilihat mata. */

export const DEFAULTS = {
  minGapPx: 8,
  roleFontRatio: 1.25,
  minInkOverlapPx: 2,
};

const INLINE_TAGS = new Set(['a', 'span', 'em', 'strong', 'b', 'i', 'small', 'sup', 'sub', 'code', 'abbr', 'label', 'time', 'mark', 'u', 's']);

function collector(doc, win, inlineTags) {
  const root = doc.querySelector('#__nuxt') ?? doc.body;
  const inline = new Set(inlineTags);
  const ctx = doc.createElement('canvas').getContext('2d');
  const isTooling = el => Boolean(el.closest('[id*="devtools"], [class*="devtools"], [data-v-inspector-container], .skip-link'));

  const items = [];
  for (const el of root.querySelectorAll('*')) {
    if (isTooling(el)) continue;
    const cs = win.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (Number.parseFloat(cs.opacity) < 0.05) continue;

    let own = '';
    for (const n of el.childNodes) if (n.nodeType === 3) own += n.nodeValue;
    own = own.replace(/\s+/g, ' ').trim();
    if (!own) continue;

    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;

    const fontSize = Number.parseFloat(cs.fontSize) || 0;
    if (!fontSize) continue;
    const lineHeightPx = cs.lineHeight === 'normal' ? fontSize * 1.2 : Number.parseFloat(cs.lineHeight) || fontSize;

    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    const m = ctx.measureText(own);

    /* Baseline baris pertama diturunkan dari kotak line-box: tinggi line-box dibagi dua di atas
       dan di bawah pusat metrik font. Berlaku selama elemen memakai line-height yang seragam,
       yang benar untuk semua teks yang diukur di sini. */
    const lineCount = Math.max(1, Math.round(rect.height / lineHeightPx));
    const firstBaseline = rect.top + (lineHeightPx + (m.fontBoundingBoxAscent - m.fontBoundingBoxDescent)) / 2;
    const lastBaseline = firstBaseline + (lineCount - 1) * lineHeightPx;

    items.push({
      sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      text: own.slice(0, 28),
      tag: el.tagName.toLowerCase(),
      isInline: inline.has(el.tagName.toLowerCase()),
      fontSize,
      lineHeightRatio: lineHeightPx / fontSize,
      lineCount,
      family: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(),
      weight: cs.fontWeight,
      inkAscentRatio: m.actualBoundingBoxAscent / fontSize,
      inkDescentRatio: m.actualBoundingBoxDescent / fontSize,
      inkTop: firstBaseline - m.actualBoundingBoxAscent,
      inkBottom: lastBaseline + m.actualBoundingBoxDescent,
      boxTop: rect.top,
      boxBottom: rect.bottom,
      boxLeft: rect.left,
      boxRight: rect.right,
      isLabel: cs.textTransform === 'uppercase' && (Number.parseFloat(cs.letterSpacing) || 0) / fontSize >= 0.09,
      ancestry: (() => {
        const chain = [];
        let p = el;
        while (p && p !== root) { chain.push(p.tagName.toLowerCase() + '#' + Array.prototype.indexOf.call(p.parentElement?.children ?? [], p)); p = p.parentElement; }
        return chain.join('>');
      })(),
    });
  }

  return { url: win.location.href, viewport: { w: win.innerWidth, h: win.innerHeight }, items };
}

export function collectScript() {
  return `(${String(collector)})(document, window, ${JSON.stringify([...INLINE_TAGS])})`;
}

function isRelated(a, b) {
  return a.ancestry.endsWith(b.ancestry) || b.ancestry.endsWith(a.ancestry);
}

/* Glyph bersebelahan pada baris yang sama saling menggantung sedikit — itu kerning dan overhang
   optis, bukan cacat. Toleransinya setengah tinggi baris, bukan satu piksel: glyph masthead
   dianimasikan per huruf (drift dan muai), sehingga ordinatnya tidak pernah persis sama. */
function isSameTextLine(a, b) {
  const parentOf = t => t.ancestry.slice(t.ancestry.indexOf('>') + 1);
  if (parentOf(a) !== parentOf(b)) return false;
  const halfLine = Math.min(a.lineHeightRatio * a.fontSize, b.lineHeightRatio * b.fontSize) / 2;
  return Math.abs(a.boxTop - b.boxTop) < halfLine;
}

function rolesDiffer(a, b, cfg) {
  const ratio = Math.max(a.fontSize, b.fontSize) / Math.min(a.fontSize, b.fontSize);
  return ratio >= cfg.roleFontRatio || a.isLabel !== b.isLabel;
}

/* Sumbu vertikal diukur dari tinta, sumbu horizontal dari kotak CSS. Alasannya bukan selera:
   `measureText` mengabaikan `letter-spacing` CSS, sehingga lebar tinta label ber-tracking lebar
   selalu terlalu pendek dan jaraknya terhitung lebih longgar daripada kenyataan. Tinggi tidak
   punya masalah itu, dan justru di sanalah line-height di bawah 1 menyembunyikan tabrakan. */
function inkGap(a, b) {
  const xOverlap = Math.min(a.boxRight, b.boxRight) - Math.max(a.boxLeft, b.boxLeft);
  const yOverlap = Math.min(a.inkBottom, b.inkBottom) - Math.max(a.inkTop, b.inkTop);
  if (xOverlap > 0 && yOverlap > 0) return { axis: 'overlap', gap: -Math.min(xOverlap, yOverlap), xOverlap, yOverlap };
  if (xOverlap > 0) return { axis: 'vertical', gap: Math.max(a.inkTop, b.inkTop) - Math.min(a.inkBottom, b.inkBottom) };
  if (yOverlap > 0) return { axis: 'horizontal', gap: Math.max(a.boxLeft, b.boxLeft) - Math.min(a.boxRight, b.boxRight) };
  return null;
}

export function auditSnapshot(snapshot, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  const { items, viewport } = snapshot;
  const findings = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (isRelated(a, b)) continue;
      const g = inkGap(a, b);
      if (!g) continue;

      if (g.axis === 'overlap') {
        if (Math.min(g.xOverlap, g.yOverlap) < cfg.minInkOverlapPx) continue;
        /* Hanya tumpang tindih tinta yang berlaku untuk sebaris; jarak antar peran di baris yang
           sama tetap diperiksa oleh cabang gap di bawah. */
        if (isSameTextLine(a, b)) continue;
        findings.push({
          rule: 'ink-collision',
          severity: 'fail',
          detail: `tinta ${a.sel} "${a.text}" menembus ${b.sel} "${b.text}"`,
          px: Math.round(Math.min(g.xOverlap, g.yOverlap)),
        });
        continue;
      }

      /* Teks dalam satu aliran yang sama memang rapat secara sah — yang ditandai hanyalah dua
         elemen yang perannya jelas berbeda (lompatan ukuran, atau label vs bukan label) namun
         diletakkan tanpa jarak sama sekali. */
      if (g.gap < cfg.minGapPx && rolesDiffer(a, b, cfg)) {
        findings.push({
          rule: 'ink-gap',
          severity: 'fail',
          detail: `${a.sel} "${a.text}" dan ${b.sel} "${b.text}" berjarak ${g.gap.toFixed(1)}px (${g.axis}), minimum ${cfg.minGapPx}px`,
          px: Math.round(cfg.minGapPx - g.gap),
        });
      }
    }
  }

  for (const t of items) {
    if (t.lineCount < 2) continue;
    const required = t.inkAscentRatio + t.inkDescentRatio;
    if (t.lineHeightRatio < required) {
      findings.push({
        rule: 'leading-below-ink',
        severity: 'fail',
        detail: `${t.sel} "${t.text}" leading ${t.lineHeightRatio.toFixed(3)} < rasio tinta ${required.toFixed(3)} (${t.family} ${t.weight})`,
        px: Math.round((required - t.lineHeightRatio) * t.fontSize),
      });
    }
  }

  const fails = findings.filter(f => f.severity === 'fail');
  return {
    viewport,
    findings: findings.sort((a, b) => b.px - a.px),
    pass: fails.length === 0,
    failCount: fails.length,
  };
}

export function auditAll(snapshots, config = {}) {
  const results = (Array.isArray(snapshots) ? snapshots : [snapshots]).map(s => auditSnapshot(s, config));
  return { results, pass: results.every(r => r.pass), totalFails: results.reduce((n, r) => n + r.failCount, 0) };
}

export function formatReport(report) {
  const lines = ['ink-audit'];
  for (const r of report.results) {
    lines.push(`\n${r.pass ? 'PASS' : 'FAIL'}  ${r.viewport.w}x${r.viewport.h}  —  ${r.failCount} fail`);
    for (const f of r.findings.slice(0, 8)) lines.push(`       ✖ [${f.rule}] ${f.detail}`);
  }
  lines.push(`\n${report.pass ? 'HIJAU — tinta tidak bertabrakan dan tidak berdempet' : `MERAH — ${report.totalFails} kegagalan`}`);
  return lines.join('\n');
}

function main(argv) {
  const path = argv[2];
  if (!path) {
    process.stdout.write(`${collectScript()}\n`);
    return 0;
  }
  const report = auditAll(JSON.parse(readFileSync(path, 'utf8')));
  process.stdout.write(`${formatReport(report)}\n`);
  return report.pass ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) process.exit(main(process.argv));
