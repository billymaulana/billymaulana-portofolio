import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/* layout-audit dan ink-audit hanya menjawab "apakah dua elemen bertabrakan". Keduanya meluluskan
   halaman yang tepi-tepinya nyaris sejajar: dua kolom yang meleset belasan piksel cukup dekat
   untuk terbaca sebagai niat sejajar dan cukup jauh untuk terbaca gagal. Itu lolos di tujuh
   viewport pada /explore/concept/1 (tepi 219px vs 233px) dan baru terlihat oleh mata.

   Tepi diukur dari TINTA, bukan dari kotak teks: side bearing huruf display mencapai belasan
   piksel, dan huruf miring 40px pun menjorok 3-7px ke kiri atau kanan kotaknya. Baris yang
   tintanya meleset dari kolom diperbaiki di halamannya (rata optis per baris), bukan dengan
   melonggarkan ukuran di sini. */

export const DEFAULTS = {
  nearMinPx: 2.5,
  nearMaxPx: 24,
  rowOverlapRatio: 0.5,
};

function collector(doc, win) {
  const root = doc.querySelector('#__nuxt') ?? doc.body;
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

    const fontSize = Number.parseFloat(cs.fontSize) || 0;
    if (!fontSize) continue;

    /* Kotak elemen blok selebar kontainernya; yang dilihat mata adalah batas teksnya. Range
       memberi kotak rapat di sekeliling baris teks, apa pun text-align-nya. */
    const range = doc.createRange();
    range.selectNodeContents(el);
    const rect = range.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) continue;
    if (rect.bottom < 0 || rect.top > win.innerHeight) continue;

    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${fontSize}px ${cs.fontFamily}`;
    const shown = cs.textTransform === 'uppercase' ? own.toUpperCase() : own;
    const first = ctx.measureText(shown[0]);
    const last = ctx.measureText(shown[shown.length - 1]);
    const tracking = Number.parseFloat(cs.letterSpacing) || 0;

    const align = cs.textAlign;
    const rtl = cs.direction === 'rtl';
    const side = align === 'center'
      ? 'center'
      : (align === 'right' || (align === 'end' && !rtl) || (align === 'start' && rtl)) ? 'right' : 'left';

    /* Huruf kedua sebuah kata dan sel kedua sebuah baris punya tepi kiri yang ditentukan oleh
       tetangganya, bukan oleh grid. Hanya pembuka (atau penutup) baris yang merupakan tepi tata
       letak. Pembungkus beranak tunggal dilewati supaya mask reveal tidak menyembunyikan saudara. */
    let unit = el;
    while (unit.parentElement && unit.parentElement !== root && unit.parentElement.children.length === 1) unit = unit.parentElement;
    const unitRect = unit.getBoundingClientRect();
    const unitFloats = win.getComputedStyle(unit).position === 'absolute';
    let leading = true;
    let trailing = true;
    for (const sib of unit.parentElement?.children ?? []) {
      if (sib === unit) continue;
      const scs = win.getComputedStyle(sib);
      if (scs.display === 'none' || scs.visibility === 'hidden') continue;
      /* Saudara di luar aliran (garis skala, hiasan) tidak ikut menentukan urutan baca. */
      if (scs.position === 'absolute' && !unitFloats) continue;
      const r = sib.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) continue;
      const overlap = Math.min(unitRect.bottom, r.bottom) - Math.max(unitRect.top, r.top);
      if (overlap <= Math.min(unitRect.height, r.height) * 0.5) continue;
      if (r.left < unitRect.left - 1) leading = false;
      if (r.right > unitRect.right + 1) trailing = false;
    }

    items.push({
      sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      text: own.slice(0, 28),
      fontSize,
      side,
      leading,
      trailing,
      top: rect.top,
      bottom: rect.bottom,
      inkLeft: rect.left - first.actualBoundingBoxLeft,
      inkRight: rect.right - tracking - (last.width - last.actualBoundingBoxRight),
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
  return `(${String(collector)})(document, window)`;
}

function isRelated(a, b) {
  return a.ancestry.endsWith(b.ancestry) || b.ancestry.endsWith(a.ancestry);
}

/* Dua elemen sebaris memang punya tepi kiri berbeda — itu urutan baca, bukan kolom yang meleset. */
function sameRow(a, b, cfg) {
  const overlap = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return overlap > Math.min(a.bottom - a.top, b.bottom - b.top) * cfg.rowOverlapRatio;
}

function edgeOf(item) {
  return item.side === 'left' ? item.inkLeft : item.inkRight;
}

export function auditSnapshot(snapshot, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  const { viewport } = snapshot;
  const items = snapshot.items.filter(t => t.side === 'left' ? t.leading !== false : t.side === 'right' ? t.trailing !== false : false);
  const findings = [];

  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (isRelated(a, b) || sameRow(a, b, cfg)) continue;
      if (a.side !== b.side) continue;

      const delta = Math.abs(edgeOf(a) - edgeOf(b));
      if (delta < cfg.nearMinPx || delta > cfg.nearMaxPx) continue;

      findings.push({
        rule: a.side === 'left' ? 'near-miss-left' : 'near-miss-right',
        severity: 'fail',
        detail: `tepi ${a.side === 'left' ? 'kiri' : 'kanan'} ${a.sel} "${a.text}" (${edgeOf(a).toFixed(1)}px) dan ${b.sel} "${b.text}" (${edgeOf(b).toFixed(1)}px) meleset ${delta.toFixed(1)}px`,
        px: Math.round(delta),
      });
    }
  }

  const edges = side => [...new Set(items.filter(t => t.side === side).map(t => Math.round(edgeOf(t))))].sort((p, q) => p - q);

  return {
    viewport,
    findings: findings.sort((a, b) => a.px - b.px),
    pass: findings.length === 0,
    failCount: findings.length,
    itemCount: items.length,
    leftEdges: edges('left'),
    rightEdges: edges('right'),
  };
}

export function auditAll(snapshots, config = {}) {
  const results = (Array.isArray(snapshots) ? snapshots : [snapshots]).map(s => auditSnapshot(s, config));
  return { results, pass: results.every(r => r.pass), totalFails: results.reduce((n, r) => n + r.failCount, 0) };
}

export function formatReport(report) {
  const lines = ['align-audit'];
  for (const r of report.results) {
    lines.push(`\n${r.pass ? 'PASS' : 'FAIL'}  ${r.viewport.w}x${r.viewport.h}  —  ${r.failCount} fail · ${r.itemCount} tepi teks · tepi kiri [${r.leftEdges.join(', ')}] · tepi kanan [${r.rightEdges.join(', ')}]`);
    for (const f of r.findings.slice(0, 8)) lines.push(`       ✖ [${f.rule}] ${f.detail}`);
  }
  lines.push(`\n${report.pass ? 'HIJAU — tidak ada tepi yang nyaris sejajar' : `MERAH — ${report.totalFails} tepi nyaris sejajar; satukan ke satu garis atau pisahkan lebih dari ${DEFAULTS.nearMaxPx}px`}`);
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
