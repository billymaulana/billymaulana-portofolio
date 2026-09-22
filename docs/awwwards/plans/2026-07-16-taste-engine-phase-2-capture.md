# Taste Engine — Fase 2: Capture Pipeline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** "Kasih link/gambar → otomatis jadi entri taste terkategorisasi lengkap (style/grid/typo/color/motion/mood) + screenshot tersimpan permanen + masuk index" dalam satu alur.

**Architecture:** Skill `taste-capture` menggerakkan MCP browser (Chrome DevTools) untuk screenshot + ekstraksi computed style/stack (runtime, bukan dependency). Bagian deterministik = `capture-scaffold.mjs` (rakit note valid dari payload JSON, reuse `taste-index.mjs`). Index diregenerasi oleh `taste-index.mjs` Fase 1.

**Tech Stack:** Node 24 ESM, `node --test`, MCP browser (chrome-devtools). TANPA dependency baru (jangan sentuh `package.json`).

## Global Constraints

- MODE NO-COMMIT (lanjutan Fase 1): tidak ada git add/commit/stash. Controller buat diff per-task.
- JANGAN sentuh `package.json`/`pnpm-lock.yaml`/`app/`/`docs/plans/` (WIP user).
- Reuse `docs/awwwards/scripts/taste-index.mjs` (`parseFrontmatter`, `validateFrontmatter`) — JANGAN duplikasi logika validasi.
- Note hasil capture WAJIB lolos `validateFrontmatter` sebelum ditulis.
- Frontmatter: field index top-level, array inline `[a, b]` (sesuai `references/library/SCHEMA.md`).
- Skill `taste-capture` diletakkan di repo `.claude/skills/taste-capture/` (cohesion: seluruh Taste Engine di repo yang sama; deviasi sadar dari spec yang menyebut parent `.claude/skills`).

---

### Task 1: `capture-scaffold.mjs` (rakit note dari payload) — TDD

**Files:**
- Create: `docs/awwwards/scripts/capture-scaffold.mjs`
- Test: `docs/awwwards/scripts/capture-scaffold.test.mjs`

**Interfaces:**
- Consumes: `parseFrontmatter`, `validateFrontmatter` dari `./taste-index.mjs`.
- Produces:
  - `buildNote(payload) -> string` (markdown lengkap: frontmatter + body skeleton)
  - `writeNote(libraryDir, payload) -> string` (validasi lalu tulis file, return path)
  - CLI `main()` baca payload JSON dari argv[2], tulis note.

- [ ] **Step 1: Tulis test yang gagal** → `docs/awwwards/scripts/capture-scaffold.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildNote, writeNote } from './capture-scaffold.mjs';
import { parseFrontmatter, validateFrontmatter } from './taste-index.mjs';

const payload = {
  slug: 'demo-site',
  title: 'Demo Site',
  source_url: 'https://demo.example',
  captured: '2026-07-16',
  awwwards_status: 'SOTD',
  category: ['portfolio'],
  style: ['cinematic', 'minimalism'],
  motion: ['scroll-scrub'],
  libraries: ['gsap', 'lenis'],
  mood: ['premium'],
  verdict: 'Bersih dan tegas.',
  influence: 'strengthen',
  rating: 8.4,
  thumb: 'assets/demo-site-desktop.png',
  typography: { primary: 'PP Neue Montreal', traits: ['oversized-display'] },
  color: { bg: '#0a0a0a', mode: 'dark' },
  analysis: { menarik: 'Kontras skala.', teknik: 'Pinned scroll.', timing: 'expo.inOut 1.2s.', premium: 'Ruang napas.' },
};

test('buildNote menghasilkan frontmatter yang lolos validasi Fase 1', () => {
  const md = buildNote(payload);
  const fm = parseFrontmatter(md);
  assert.deepEqual(validateFrontmatter(fm), { valid: true, errors: [] });
  assert.deepEqual(fm.category, ['portfolio']);
  assert.deepEqual(fm.style, ['cinematic', 'minimalism']);
  assert.equal(fm.thumb, 'assets/demo-site-desktop.png');
  assert.equal(fm.rating, 8.4);
});

test('buildNote memuat semua heading body', () => {
  const md = buildNote(payload);
  for (const h of ['## Apa yang Menarik', '## Teknik yang Diidentifikasi', '## Timing & Feel', '## Kenapa Terasa Premium']) {
    assert.ok(md.includes(h), `missing ${h}`);
  }
});

test('writeNote menolak payload tanpa field wajib', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cap-'));
  assert.throws(() => writeNote(dir, { slug: 'x' }), /invalid/i);
  rmSync(dir, { recursive: true, force: true });
});

test('writeNote menulis file yang bisa dibaca ulang', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cap-'));
  const p = writeNote(dir, payload);
  const fm = parseFrontmatter(readFileSync(p, 'utf8'));
  assert.equal(fm.slug, 'demo-site');
  rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Jalankan test → GAGAL**

Run: `node --test docs/awwwards/scripts/capture-scaffold.test.mjs`
Expected: FAIL — `Cannot find module ... capture-scaffold.mjs`.

- [ ] **Step 3: Tulis implementasi** → `docs/awwwards/scripts/capture-scaffold.mjs`:
```js
import { writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter, validateFrontmatter } from './taste-index.mjs';

function arr(a) { return `[${(a ?? []).join(', ')}]`; }
function str(s) { return s == null ? 'null' : `"${String(s).replace(/"/g, '\\"')}"`; }

export function buildNote(p) {
  const lines = [
    '---',
    'type: reference',
    `slug: ${p.slug}`,
    `title: ${str(p.title)}`,
    `source_url: ${p.source_url}`,
    `captured: ${p.captured ?? new Date().toISOString().slice(0, 10)}`,
    p.awwwards_status ? `awwwards_status: ${p.awwwards_status}` : null,
    `category: ${arr(p.category)}`,
    `style: ${arr(p.style)}`,
    p.grid ? `grid: ${p.grid}` : null,
    `motion: ${arr(p.motion)}`,
    `libraries: ${arr(p.libraries)}`,
    `mood: ${arr(p.mood)}`,
    p.verdict ? `verdict: ${str(p.verdict)}` : null,
    p.influence ? `influence: ${p.influence}` : null,
    p.rating != null ? `rating: ${p.rating}` : null,
    `thumb: ${p.thumb ?? 'null'}`,
    p.summary ? `summary: ${str(p.summary)}` : null,
  ];
  if (p.typography) {
    lines.push('typography:', `  primary: ${str(p.typography.primary)}`);
    if (p.typography.traits) lines.push(`  traits: ${arr(p.typography.traits)}`);
  }
  if (p.color) {
    lines.push('color:', `  bg: ${str(p.color.bg)}`, `  mode: ${p.color.mode ?? 'dark'}`);
    if (p.color.accent) lines.push(`  accent: ${arr(p.color.accent.map((c) => `"${c}"`))}`);
  }
  lines.push('---', '');
  const a = p.analysis ?? {};
  lines.push(
    '## Apa yang Menarik', a.menarik ?? '', '',
    '## Teknik yang Diidentifikasi', a.teknik ?? '', '',
    '## Timing & Feel', a.timing ?? '', '',
    '## Kenapa Terasa Premium', a.premium ?? '', '',
  );
  return lines.filter((l) => l !== null).join('\n');
}

export function writeNote(libraryDir, p) {
  const content = buildNote(p);
  const { valid, errors } = validateFrontmatter(parseFrontmatter(content));
  if (!valid) throw new Error(`payload invalid: ${errors.join('; ')}`);
  const path = join(libraryDir, `${p.slug}.md`);
  writeFileSync(path, content);
  return path;
}

function main() {
  const payloadPath = process.argv[2];
  if (!payloadPath || !existsSync(payloadPath)) {
    console.error('usage: capture-scaffold.mjs <payload.json>');
    process.exit(1);
  }
  const libraryDir = join(process.cwd(), 'docs/awwwards/references/library');
  const path = writeNote(libraryDir, JSON.parse(readFileSync(payloadPath, 'utf8')));
  console.log(`note ditulis: ${path}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
```

- [ ] **Step 4: Jalankan test → LULUS**

Run: `node --test docs/awwwards/scripts/capture-scaffold.test.mjs`
Expected: PASS — `# pass 4`, `# fail 0`.

- [ ] **Step 5: Review checkpoint (controller)** — diff `docs/awwwards/scripts/capture-scaffold*`.

---

### Task 2: Skill `taste-capture`

**Files:**
- Create: `.claude/skills/taste-capture/SKILL.md` (repo root `.claude/`)

**Interfaces:**
- Consumes: `capture-scaffold.mjs`, `taste-index.mjs`, MCP browser tools.

- [ ] **Step 1: Tulis `SKILL.md`** dengan isi:
```markdown
---
name: taste-capture
description: Simpan referensi desain (URL atau gambar) jadi entri taste library terkategorisasi + screenshot. Trigger — "capture <url>", "simpan referensi ini", "tambah ke taste library", "masukkan ke taste saya".
---

# Taste Capture

Ubah satu URL/gambar jadi note taste terstruktur + screenshot + masuk `index.json`.

## Alur (URL)

1. **Slug**: domain di-kebab-case (mis. `https://art-yakushev.com` → `art-yakushev`).
2. **Screenshot** via MCP browser (Chrome DevTools):
   - `navigate_page` ke URL, tunggu load.
   - `resize_page` 1440×900 → `take_screenshot` simpan ke `docs/awwwards/references/library/assets/<slug>-desktop.png`.
   - `resize_page` 390×844 → `take_screenshot` simpan ke `.../assets/<slug>-mobile.png`.
3. **Deteksi stack + style** — jalankan via `evaluate_script`:
   ```js
   () => {
     const cs = getComputedStyle(document.body);
     const h1 = document.querySelector('h1,h2');
     return {
       title: document.title,
       bodyFont: cs.fontFamily,
       headingFont: h1 ? getComputedStyle(h1).fontFamily : null,
       bg: cs.backgroundColor,
       fg: cs.color,
       libraries: {
         gsap: !!window.gsap, three: !!window.THREE,
         lenis: !!(window.Lenis || window.lenis), framerMotion: !!window.FramerMotion,
       },
     };
   }
   ```
4. **Klasifikasi** (judgment): petakan ke `style` (14 kategori style-dna-guide §1), `category`, `mood`, `motion`. Baca `docs/awwwards/personal-taste-profile.md` untuk tentukan `influence` (strengthen/new/confirm).
5. **Payload JSON** → tulis file sementara `/tmp/taste-payload.json`, lalu:
   ```bash
   node docs/awwwards/scripts/capture-scaffold.mjs /tmp/taste-payload.json
   node docs/awwwards/scripts/taste-index.mjs
   ```
6. **Tanya user verdict** ("kenapa suka situs ini?") → update `verdict` + `influence` di note, jalankan ulang `taste-index.mjs`.

## Alur (gambar)
Lewati langkah 2-3 (tak ada live site). Analisis gambar langsung untuk style/color/mood; `libraries`/`motion` dikosongkan kecuali jelas; `thumb` = path gambar yang disalin ke `assets/`.

## Aturan
- Note WAJIB lolos `taste-index.mjs` (kalau throw "Invalid frontmatter", perbaiki field lalu ulang).
- JANGAN mengarang nilai yang tak teramati — kosongkan array/field opsional.
- Setelah selesai: tunjukkan note + kedua screenshot ke user, tanya konfirmasi.
```

- [ ] **Step 2: Verifikasi skill ter-discover** — `ls .claude/skills/taste-capture/SKILL.md` ada; frontmatter `name`/`description` valid (mulai `---`).

- [ ] **Step 3: Review checkpoint (controller)** — diff `.claude/skills/taste-capture/`.

---

### Task 3: Bukti end-to-end (capture 1 URL nyata)

**Files:**
- Create (oleh alur): `docs/awwwards/references/library/<slug>.md` + `assets/<slug>-desktop.png` + `-mobile.png`
- Regenerate: `index.json`, `INDEX.md`

**Interfaces:**
- Consumes: skill `taste-capture` (Task 2), MCP browser.

- [ ] **Step 1: Pilih 1 URL** SOTD dari daftar taste-dna yang BELUM ada di library (bukan 5 slug Fase 1). Konfirmasi ke user URL-nya bila perlu (browser mungkin minta izin situs).

- [ ] **Step 2: Jalankan alur `taste-capture`** untuk URL itu (screenshot desktop+mobile tersimpan, note tertulis, index rebuild).

- [ ] **Step 3: Verifikasi artefak lengkap**

Run:
```bash
cd "/Users/billymaulana/Data Billy/Works/2026-billy-portofolio/awwwards/billymaulana-portofolio"
SLUG=<slug>
ls -la docs/awwwards/references/library/assets/$SLUG-desktop.png docs/awwwards/references/library/assets/$SLUG-mobile.png
node -e "const i=require('./docs/awwwards/references/library/index.json'); const e=i.entries.find(x=>x.slug==='$SLUG'); console.log(e ? ('OK '+e.slug+' thumb='+e.thumb) : 'MISSING di index'); if(!e||!e.thumb) process.exit(1)"
```
Expected: kedua PNG ada (size > 0), entri ada di index dengan `thumb` terisi (bukan null).

- [ ] **Step 4: Presentasi ke user** — tunjukkan 2 screenshot + note, tanya "sudah sesuai?" (JANGAN mark complete tanpa approval — CLAUDE.md project).

- [ ] **Step 5: Review checkpoint (controller)** — diff library + assets.

---

## Catatan
- Screenshot butuh MCP browser aktif (Chrome). Task 3 mungkin memerlukan izin situs / browser user terbuka.
- Selesai Fase 2 → Fase 3 (agent orchestrator + subagent) dapat plan sendiri.
