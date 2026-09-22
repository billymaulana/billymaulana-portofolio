import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

/* Viewport yang wajib diuji. 1440x780 dan 1366x768 adalah laptop 13-14 inci dengan toolbar
   browser — dua ukuran paling umum di dunia, dan dua yang paling sering terlewat karena
   pengujian biasanya memakai 1440x900 penuh tanpa chrome browser. */
export const AUDIT_VIEWPORTS = [
  { w: 1920, h: 1080, label: 'desktop besar' },
  { w: 1600, h: 900, label: 'desktop' },
  { w: 1440, h: 900, label: 'laptop penuh' },
  { w: 1440, h: 780, label: 'laptop + toolbar' },
  { w: 1366, h: 768, label: 'laptop 14"' },
  { w: 834, h: 1112, label: 'tablet' },
  { w: 390, h: 844, label: 'ponsel' },
];

/* Jarak minimum antar elemen TIDAK diperiksa di sini. Audit ini hanya melihat kotak CSS, yang
   pada line-height di bawah 1 lebih pendek daripada tinta glyph — jarak yang diukur darinya
   menyesatkan. Penegakannya ada di ink-audit.mjs, yang mengukur dari TextMetrics. */
export const DEFAULTS = {
  edgeMarginPx: 12,
  minTapPx: 44,
  minBodyPx: 14,
};

/* Dijalankan di browser lewat evaluate_script. doc/win diinjeksi supaya file ini tetap
   bebas global browser dan bisa di-lint sebagai modul Node. */
function collector(doc, win) {
  const root = doc.querySelector('#__nuxt') ?? doc.body;
  const isTooling = el => Boolean(el.closest('[id*="devtools"], [class*="devtools"], [data-v-inspector-container], .skip-link'));

  const boxes = [];
  for (const el of root.querySelectorAll('*')) {
    if (isTooling(el)) continue;
    const cs = win.getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') continue;
    if (Number.parseFloat(cs.opacity) < 0.05) continue;
    if (cs.pointerEvents === 'none' && !el.textContent?.trim() && !el.querySelector('img, svg')) continue;

    const r = el.getBoundingClientRect();
    if (r.width < 2 || r.height < 2) continue;
    if (r.bottom < 0 || r.top > win.innerHeight) continue;

    let own = '';
    for (const n of el.childNodes) if (n.nodeType === 3) own += n.nodeValue;
    own = own.replace(/\s+/g, ' ').trim();

    const isMedia = el.tagName === 'IMG' || el.tagName === 'SVG' || el.tagName === 'svg';
    /* Hanya elemen yang benar-benar menampilkan sesuatu yang bisa "menabrak". Wrapper tanpa
       teks dan tanpa media memang sengaja saling menumpuk dan bukan cacat. */
    if (!own && !isMedia) continue;

    boxes.push({
      sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className.trim() ? '.' + el.className.trim().split(/\s+/)[0] : ''),
      text: own.slice(0, 28),
      /* Panjang penuh disimpan terpisah karena `text` dipotong untuk keterbacaan laporan.
         Rule measure membandingkan terhadap 45 karakter dan akan mati diam kalau membaca
         `text.length` yang tidak pernah melebihi 28. */
      textLen: own.length,
      isMedia,
      top: r.top, bottom: r.bottom, left: r.left, right: r.right,
      w: r.width, h: r.height,
      fontSize: Number.parseFloat(cs.fontSize) || 0,
      isLabel: cs.textTransform === 'uppercase' && (Number.parseFloat(cs.letterSpacing) || 0) / (Number.parseFloat(cs.fontSize) || 1) >= 0.09,
      headingRoot: (() => {
        const h = el.closest('h1, h2, h3, h4, h5, h6');
        return h ? h.tagName.toLowerCase() + '#' + Array.prototype.indexOf.call(h.parentElement?.children ?? [], h) : '';
      })(),
      blockParent: (() => {
        let p = el.parentElement;
        while (p && p !== root && ['inline', 'inline-block', 'inline-flex'].includes(win.getComputedStyle(p).display)) p = p.parentElement;
        return p ? (p.tagName.toLowerCase() + (typeof p.className === 'string' && p.className.trim() ? '.' + p.className.trim().split(/\s+/)[0] : '') + '#' + Array.prototype.indexOf.call(p.parentElement?.children ?? [], p)) : '';
      })(),
      interactive: ['a', 'button', 'input', 'select', 'textarea'].includes(el.tagName.toLowerCase()) || cs.cursor === 'pointer',
      depth: (() => { let d = 0, p = el; while (p && p !== root) { d++; p = p.parentElement; } return d; })(),
      isAncestorOf: [],
    });
  }

  /* Tandai hubungan leluhur-keturunan supaya tumpang tindih yang wajar (anak di dalam induk)
     tidak dilaporkan sebagai tabrakan. */
  const els = [];
  for (const el of root.querySelectorAll('*')) {
    if (isTooling(el)) continue;
    els.push(el);
  }

  return {
    url: win.location.href,
    viewport: { w: win.innerWidth, h: win.innerHeight },
    boxes,
    docScrollWidth: doc.documentElement.scrollWidth,
  };
}

export function collectScript() {
  return `(${String(collector)})(document, window)`;
}

function overlapArea(a, b) {
  const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
  const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
  return x > 0 && y > 0 ? { x, y, area: x * y } : null;
}

function contains(a, b) {
  return a.left <= b.left + 1 && a.right >= b.right - 1 && a.top <= b.top + 1 && a.bottom >= b.bottom - 1;
}

export function auditViewport(snapshot, config = {}) {
  const cfg = { ...DEFAULTS, ...config };
  const { boxes, viewport } = snapshot;
  const findings = [];

  for (let i = 0; i < boxes.length; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i];
      const b = boxes[j];
      /* Salah satu memuat yang lain sepenuhnya: itu penumpukan yang disengaja (teks di atas
         kartu, ikon di dalam tombol), bukan tabrakan. */
      if (contains(a, b) || contains(b, a)) continue;
      /* Dua glyph di dalam blok teks yang sama: bounding box elemen inline mencakup seluruh
         line-height, jadi pada leading di bawah 1 baris-baris pasti tumpang tindih tanpa
         tintanya bersentuhan sama sekali. Kerapatan leading diukur oleh taste-lint
         (rule leading-tier), bukan oleh audit geometri. */
      if (a.blockParent && a.blockParent === b.blockParent) continue;
      /* Glyph dari baris berbeda dalam satu heading: tumpang tindih antar baris pada leading
         di bawah 1 adalah keputusan tipografi, bukan cacat layout. Kerapatannya diukur oleh
         taste-lint rule leading-tier. */
      if (a.headingRoot && a.headingRoot === b.headingRoot) continue;
      const ov = overlapArea(a, b);
      if (!ov) continue;
      /* Tumpang tindih tipis di satu sumbu saja biasanya pembulatan sub-piksel. */
      if (ov.x < 2 || ov.y < 2) continue;
      findings.push({
        rule: 'overlap',
        severity: 'fail',
        detail: `${a.sel}${a.text ? ` "${a.text}"` : ''} menimpa ${b.sel}${b.text ? ` "${b.text}"` : ''}`,
        overlapPx: Math.round(ov.area),
        x: Math.round(ov.x),
        y: Math.round(ov.y),
      });
    }
  }

  for (const b of boxes) {
    if (b.left < -1 || b.right > viewport.w + 1) {
      const spill = Math.round(Math.max(-b.left, b.right - viewport.w));
      /* Bleed horizontal sering disengaja untuk display besar; hanya dilaporkan kalau
         elemennya teks berukuran baca yang jadi terpotong. */
      if (!b.isMedia && b.fontSize > 0 && b.fontSize < 64 && spill > 4) {
        findings.push({ rule: 'horizontal-spill', severity: 'fail', detail: `${b.sel} "${b.text}" keluar ${spill}px dari viewport`, overlapPx: spill });
      }
    }
    if (b.interactive && (b.w < cfg.minTapPx || b.h < cfg.minTapPx) && viewport.w <= 900) {
      findings.push({ rule: 'tap-target', severity: 'warn', detail: `${b.sel} "${b.text}" ${Math.round(b.w)}x${Math.round(b.h)} di bawah ${cfg.minTapPx}px`, overlapPx: 0 });
    }
    /* Label uppercase bertracking lebar memang dirancang untuk ukuran kecil — di
       references/library/ nilainya lazim 7-13px (jasonbergh 7.2px). Menuntutnya >=14px
       melaporkan pelanggaran pada konvensi editorial yang benar.

       Ambang panjang teks memakai batas bawah measure (45 karakter, Butterick). Di bawah itu
       teks adalah label atau meta, bukan teks baca, berapa pun kapitalisasinya. Ambang lama 24
       karakter menandai setiap label sentence-case sebagai pelanggaran — dan sejak label
       diwajibkan sentence-case, `isLabel` (yang hanya mengenali uppercase bertracking) tidak
       lagi menangkapnya. */
    if (!b.isMedia && !b.isLabel && b.fontSize > 0 && b.fontSize < cfg.minBodyPx && (b.textLen ?? b.text.length) > 45) {
      findings.push({ rule: 'font-too-small', severity: 'warn', detail: `${b.sel} "${b.text}" ${b.fontSize}px`, overlapPx: 0 });
    }
  }

  if (snapshot.docScrollWidth > viewport.w + 1) {
    findings.push({ rule: 'page-scroll-x', severity: 'fail', detail: `dokumen melebar ${Math.round(snapshot.docScrollWidth - viewport.w)}px melebihi viewport`, overlapPx: 0 });
  }

  const fails = findings.filter(f => f.severity === 'fail');
  return {
    viewport,
    findings: findings.sort((a, b) => b.overlapPx - a.overlapPx),
    pass: fails.length === 0,
    failCount: fails.length,
    warnCount: findings.length - fails.length,
  };
}

export function auditAll(snapshots, config = {}) {
  const results = snapshots.map(s => auditViewport(s, config));
  return { results, pass: results.every(r => r.pass), totalFails: results.reduce((n, r) => n + r.failCount, 0) };
}

export function formatReport(report) {
  const lines = ['layout-audit'];
  for (const r of report.results) {
    const tag = r.pass ? 'PASS' : 'FAIL';
    lines.push(`\n${tag}  ${r.viewport.w}x${r.viewport.h}  —  ${r.failCount} fail · ${r.warnCount} warn`);
    for (const f of r.findings.slice(0, 6)) {
      lines.push(`       ${f.severity === 'fail' ? '✖' : '!'} [${f.rule}] ${f.detail}${f.overlapPx ? ` (${f.overlapPx}px²)` : ''}`);
    }
  }
  lines.push(`\n${report.pass ? 'HIJAU — tidak ada tabrakan di semua viewport' : `MERAH — ${report.totalFails} kegagalan`}`);
  return lines.join('\n');
}

function main(argv) {
  const path = argv[2];
  if (!path) {
    process.stdout.write(`${collectScript()}\n`);
    return 0;
  }
  const snapshots = JSON.parse(readFileSync(path, 'utf8'));
  const report = auditAll(Array.isArray(snapshots) ? snapshots : [snapshots]);
  process.stdout.write(`${formatReport(report)}\n`);
  return report.pass ? 0 : 1;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  process.exit(main(process.argv));
}
