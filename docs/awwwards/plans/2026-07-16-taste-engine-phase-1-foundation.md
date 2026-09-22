# Taste Engine — Fase 1: Fondasi (Konsolidasi + Format + Index) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Menjadikan `docs/awwwards/` satu-satunya source of truth yang lengkap, lalu memberi taste library format baru (per-note + frontmatter + `index.json` queryable) sehingga retrieval tidak lagi membaca monolith 91 KB.

**Architecture:** Content consolidation (tarik 8 file teknis, ciutkan global jadi pointer, satukan profil taste) + satu potongan kode nyata: index builder Node ESM **dependency-free** yang memindai `references/library/*.md` → menghasilkan `index.json` + `INDEX.md`. Hanya index builder yang di-TDD; sisanya diverifikasi via command.

**Tech Stack:** Node 24 (ESM), test runner bawaan `node --test` + `node:assert/strict`. TANPA dependency baru. Obsidian sebagai antarmuka visual.

## Global Constraints

- Source of Truth = `docs/awwwards/` di repo `.../awwwards/billymaulana-portofolio`. Path relatif ke repo root.
- **MODE NO-COMMIT.** Semua perubahan tetap di working tree. DILARANG `git add`, `git commit`, `git stage`, `git stash`. Controller yang membuat diff per-task untuk review. User mengurus git sendiri di akhir.
- **JANGAN menyentuh `package.json` / `pnpm-lock.yaml`** (itu WIP user). Karena itu index builder WAJIB dependency-free — tanpa `pnpm add` apa pun.
- Jangan menyentuh file WIP user lain: `app/**`, `docs/plans/**`, `docs/snapshots/**`. Fase 1 hanya membuat/menyunting file di `docs/awwwards/**`, `docs/memory/MEMORY.md`, `CLAUDE.md`, `.gitignore`, dan global config di luar repo.
- Project ESM (`type: module`) — script pakai `import`/`export`, ekstensi `.mjs`.
- Komentar kode: JANGAN kecuali WHY non-obvious (block comment). CSS: tanpa komentar. (CLAUDE.md user.)
- DILARANG referensi ke Claude/AI/agent atau ke file planning di dalam kode.
- Frontmatter schema reference: field yang di-index WAJIB top-level; array WAJIB inline (`[a, b]`), bukan block list.

---

### Task 1: Tarik 8 file teknis global → project `references/`

**Files:**
- Create: `docs/awwwards/references/{gsap-patterns,lenis-patterns,threejs-patterns,motion-principles,taste-design-comprehensive,webgpu-tsl-skill,webgpu-tsl-reference}.md` + folder `webgpu-tsl/` (disalin dari `~/.claude/skills/awwwards/references/`).

**Interfaces:**
- Produces: project `references/` = superset lengkap.

- [ ] **Step 1: Salin 8 artefak dari global ke project**

Run:
```bash
GLOBAL="$HOME/.claude/skills/awwwards/references"
DEST="docs/awwwards/references"
for f in gsap-patterns.md lenis-patterns.md threejs-patterns.md motion-principles.md taste-design-comprehensive.md webgpu-tsl-skill.md webgpu-tsl-reference.md; do
  cp -n "$GLOBAL/$f" "$DEST/$f"
done
cp -Rn "$GLOBAL/webgpu-tsl" "$DEST/webgpu-tsl"
```
Expected: tanpa error.

- [ ] **Step 2: Verifikasi 7 file + 1 folder hadir**

Run:
```bash
DEST="docs/awwwards/references"
for f in gsap-patterns.md lenis-patterns.md threejs-patterns.md motion-principles.md taste-design-comprehensive.md webgpu-tsl-skill.md webgpu-tsl-reference.md; do
  [ -f "$DEST/$f" ] && echo "OK $f" || echo "MISSING $f"
done
[ -d "$DEST/webgpu-tsl" ] && echo "OK webgpu-tsl/" || echo "MISSING webgpu-tsl/"
```
Expected: 8 baris "OK ...".

- [ ] **Step 3: Review checkpoint (controller)** — controller menjalankan `git -C <repo> status --short -- docs/awwwards/references/` dan mendiff file baru. Tidak ada commit.

---

### Task 2: Ciutkan global `SKILL.md` jadi pointer

**Files:**
- Create: `~/.claude/skills/awwwards/SKILL.md.bak` (backup).
- Modify: `~/.claude/skills/awwwards/SKILL.md` (isi pointer). Di luar repo — tidak masuk diff repo.

**Interfaces:**
- Produces: global awwwards tidak lagi sumber aktif; menunjuk ke project.

- [ ] **Step 1: Backup**

Run: `cp "$HOME/.claude/skills/awwwards/SKILL.md" "$HOME/.claude/skills/awwwards/SKILL.md.bak"`
Expected: tanpa output.

- [ ] **Step 2: Tulis pointer** ke `~/.claude/skills/awwwards/SKILL.md`:
```markdown
---
name: awwwards
description: Pointer — Taste Engine (source of truth) telah pindah ke project portfolio.
---

# Awwwards — Pointer

Source of truth Taste Engine sekarang project-scoped:

`Data Billy/Works/2026-billy-portofolio/awwwards/billymaulana-portofolio/docs/awwwards/`

Buka `docs/awwwards/SKILL.md` di project itu. Untuk global, salin folder tersebut ke sini.
Arsip lama: `SKILL.md.bak` dan folder `references/`.
```

- [ ] **Step 3: Verifikasi** — `head -5 "$HOME/.claude/skills/awwwards/SKILL.md"` menampilkan `description: Pointer — ...`.

---

### Task 3: Satukan profil taste personal → `personal-taste-profile.md`

**Files:**
- Create: `docs/awwwards/personal-taste-profile.md`
- Modify (tambah 1 baris pointer di atas body): `docs/awwwards/references/taste-dna.md`, `docs/memory/MEMORY.md`, `CLAUDE.md`.

**Interfaces:**
- Produces: satu file kanonik profil taste personal Billy.

- [ ] **Step 1: Baca 4 sumber (SALIN nilai terkunci verbatim, jangan mengarang)**

1. `docs/awwwards/references/taste-dna.md` → section "Taste Profile".
2. `docs/memory/MEMORY.md` → section "User Taste DNA (COMPREHENSIVE v2.0)".
3. `~/.claude/skills/awwwards/SKILL.md.bak` → section "Billy's Taste DNA".
4. `CLAUDE.md` → section "Hard Constraints" + "Art Direction Mandate".

Hex, nama font, daftar BANNED, keputusan terkunci WAJIB disalin verbatim.

- [ ] **Step 2: Tulis `docs/awwwards/personal-taste-profile.md`** (isi tiap section dari Step 1, bukan teks contoh):
```markdown
---
type: personal-taste-profile
owner: Billy Maulana
updated: 2026-07-16
---

# Personal Taste Profile — Billy

> Kanonik. Sumber lain menunjuk ke sini. Update lewat learning loop (Fase 4).

## Identity & Benchmarks
## Feel / Emotional Arc
## Typography
## Color
## Motion
## Layout & Materials
## Locked Decisions (jangan ditawar)
```

- [ ] **Step 3: Verifikasi tak ada section kosong** — tiap heading `##` diikuti isi nyata (bukan kosong/placeholder).

- [ ] **Step 4: Tambah pointer di 3 sumber** — baris di atas body:
```markdown
> Profil taste personal kanonik: `docs/awwwards/personal-taste-profile.md`. Section di bawah = arsip.
```

- [ ] **Step 5: Review checkpoint (controller)** — diff `personal-taste-profile.md` + 3 file yang ditambah pointer.

---

### Task 4: Struktur `references/library/` + schema + seed

**Files:**
- Create dirs: `docs/awwwards/references/library/assets/`, `docs/awwwards/references/lessons/`
- Create: `references/library/SCHEMA.md`, `references/library/index.json`, `references/library/INDEX.md`, `docs/awwwards/anti-slop-rules.md`

**Interfaces:**
- Produces: struktur + `SCHEMA.md` (kontrak frontmatter untuk Fase 2), `index.json` awal (count 0).

- [ ] **Step 1: Buat direktori**

Run: `mkdir -p docs/awwwards/references/library/assets docs/awwwards/references/lessons`

- [ ] **Step 2: Tulis `references/library/SCHEMA.md`** PERSIS:
```markdown
# Reference Note Schema

Satu situs = satu note `references/library/<slug>.md`. Field yang di-index WAJIB top-level; array WAJIB inline (`[a, b]`).

| Field | Tipe | Wajib | Nilai |
| --- | --- | --- | --- |
| type | string | ya | selalu `reference` |
| slug | string | ya | kebab-case = nama file tanpa `.md` |
| title | string | ya | nama situs |
| source_url | string | ya | URL |
| captured | date | ya | YYYY-MM-DD |
| awwwards_status | string | tidak | SOTD \| Honorable Mention \| Nominee \| Non-awwwards |
| category | string[] inline | ya | portfolio\|agency\|ecommerce\|saas\|editorial\|product\|experimental |
| style | string[] inline | ya | dari 14 kategori style-dna-guide §1 |
| grid | string | tidak | mis. `12-col asymmetric` |
| motion | string[] inline | tidak | scroll-scrub, text-reveal, ... |
| libraries | string[] inline | tidak | gsap, lenis, three, webgpu, framer-motion |
| mood | string[] inline | ya | premium, brutal, playful, calm, tense, luxurious |
| verdict | string | tidak | kutipan Billy kenapa suka |
| influence | string | tidak | strengthen \| new \| confirm |
| rating | number | tidak | 1-10 (rubrik evaluation-system) |
| thumb | string | tidak | path screenshot desktop relatif ke library/ (mis. `assets/<slug>-desktop.png`) |
| summary | string | tidak | satu baris esensi (fallback: verdict) |

Field non-index (nested, untuk body/manusia): `typography:` dan `color:` boleh ditulis sebagai blok nested — indexer mengabaikannya.
Body mengikuti `../site-analysis-framework.md`. Setelah ubah note jalankan `node docs/awwwards/scripts/taste-index.mjs`.
```

- [ ] **Step 3: Tulis `references/library/index.json`** PERSIS:
```json
{
  "version": 1,
  "updated": "2026-07-16",
  "count": 0,
  "entries": []
}
```

- [ ] **Step 4: Tulis `references/library/INDEX.md`** PERSIS:
```markdown
# Reference Library Index

> 0 entri. Dihasilkan oleh `taste-index.mjs` — jangan edit manual.
```

- [ ] **Step 5: Tulis `docs/awwwards/anti-slop-rules.md`** PERSIS:
```markdown
# Anti-Slop Rules (kanonik, append-only)

> Diisi oleh learning loop (Fase 4). Orchestrator membaca file ini di awal tiap job.
> Seed dari `docs/memory/failure-patterns.md` + Anti-AI-Slop Rules SKILL global (Fase 4).
```

- [ ] **Step 6: Review checkpoint (controller)** — diff seluruh `docs/awwwards/references/library/` + `anti-slop-rules.md`.

---

### Task 5: Index builder dependency-free (TDD)

**Files:**
- Create: `docs/awwwards/scripts/taste-index.mjs`
- Test: `docs/awwwards/scripts/taste-index.test.mjs`

DILARANG mengubah `package.json`/`pnpm-lock.yaml`. Tanpa dependency eksternal.

**Interfaces:**
- Produces:
  - `parseFrontmatter(md) -> object` (hanya key top-level; array inline; nested diabaikan)
  - `validateFrontmatter(fm) -> { valid, errors[] }`
  - `toIndexEntry(fm, filename) -> entry` (`{ slug, title, url, category[], style[], mood[], libraries[], rating|null, summary, path, thumb|null }`)
  - `buildIndex(libraryDir) -> { version, updated, count, entries[] }`
  - `renderIndexMd(index) -> string`
  - CLI `main()` menulis `index.json` + `INDEX.md`.

- [ ] **Step 1: Tulis test yang gagal** → `docs/awwwards/scripts/taste-index.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseFrontmatter, validateFrontmatter, toIndexEntry, buildIndex } from './taste-index.mjs';

test('parseFrontmatter: scalar, inline array, null, angka; abaikan nested', () => {
  const md = [
    '---',
    'type: reference',
    'slug: x',
    'title: "X Site"',
    'category: [portfolio, agency]',
    'rating: 8.5',
    'thumb: null',
    'color:',
    '  bg: "#000"',
    '---',
    'body',
  ].join('\n');
  const fm = parseFrontmatter(md);
  assert.equal(fm.type, 'reference');
  assert.equal(fm.title, 'X Site');
  assert.deepEqual(fm.category, ['portfolio', 'agency']);
  assert.equal(fm.rating, 8.5);
  assert.equal(fm.thumb, null);
  assert.equal(fm.bg, undefined);
});

test('validateFrontmatter menandai field wajib hilang', () => {
  const { valid, errors } = validateFrontmatter({ type: 'reference', slug: 'x' });
  assert.equal(valid, false);
  assert.ok(errors.some((e) => e.includes('title')));
});

test('validateFrontmatter lolos untuk lengkap', () => {
  const fm = { type: 'reference', slug: 'x', title: 'X', source_url: 'https://x.com', category: ['portfolio'], style: ['minimalism'], mood: ['calm'] };
  assert.deepEqual(validateFrontmatter(fm), { valid: true, errors: [] });
});

test('toIndexEntry memetakan field & menurunkan path/thumb', () => {
  const fm = { slug: 'x', title: 'X', source_url: 'https://x.com', category: ['portfolio'], style: ['minimalism'], mood: ['calm'], thumb: 'assets/x-desktop.png' };
  const e = toIndexEntry(fm, 'x.md');
  assert.equal(e.path, 'references/library/x.md');
  assert.equal(e.thumb, 'references/library/assets/x-desktop.png');
  assert.equal(e.url, 'https://x.com');
});

test('buildIndex memindai dir, kecualikan INDEX.md, urut by slug', () => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-'));
  const note = (slug) => `---\ntype: reference\nslug: ${slug}\ntitle: ${slug}\nsource_url: https://${slug}.com\ncategory: [portfolio]\nstyle: [minimalism]\nmood: [calm]\n---\nbody\n`;
  writeFileSync(join(dir, 'beta.md'), note('beta'));
  writeFileSync(join(dir, 'alpha.md'), note('alpha'));
  writeFileSync(join(dir, 'INDEX.md'), '# ignore');
  const index = buildIndex(dir);
  assert.equal(index.count, 2);
  assert.deepEqual(index.entries.map((e) => e.slug), ['alpha', 'beta']);
  rmSync(dir, { recursive: true, force: true });
});
```

- [ ] **Step 2: Jalankan test → pastikan GAGAL**

Run: `node --test docs/awwwards/scripts/taste-index.test.mjs`
Expected: FAIL — `Cannot find module ... taste-index.mjs`.

- [ ] **Step 3: Tulis implementasi** → `docs/awwwards/scripts/taste-index.mjs`:
```js
import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const REQUIRED = ['type', 'slug', 'title', 'source_url', 'category', 'style', 'mood'];

function unquote(s) {
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) return s.slice(1, -1);
  return s;
}

function parseValue(raw) {
  if (raw === '' || raw === 'null' || raw === '~') return null;
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    return inner ? inner.split(',').map((s) => unquote(s.trim())) : [];
  }
  if (raw !== '' && !raw.startsWith('"') && !raw.startsWith("'") && !Number.isNaN(Number(raw))) return Number(raw);
  return unquote(raw);
}

export function parseFrontmatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const fm = {};
  for (const line of m[1].split('\n')) {
    const mm = line.match(/^([a-zA-Z_][\w]*):\s*(.*)$/);
    if (!mm) continue;
    fm[mm[1]] = parseValue(mm[2].trim());
  }
  return fm;
}

export function validateFrontmatter(fm) {
  const errors = [];
  for (const key of REQUIRED) {
    const v = fm[key];
    if (v === undefined || v === null || v === '') errors.push(`missing required field: ${key}`);
  }
  if (fm.type && fm.type !== 'reference') errors.push(`type must be "reference", got "${fm.type}"`);
  for (const arrKey of ['category', 'style', 'mood']) {
    if (fm[arrKey] !== undefined && !Array.isArray(fm[arrKey])) errors.push(`${arrKey} must be an array`);
  }
  return { valid: errors.length === 0, errors };
}

export function toIndexEntry(fm, filename) {
  return {
    slug: fm.slug,
    title: fm.title,
    url: fm.source_url,
    category: fm.category ?? [],
    style: fm.style ?? [],
    mood: fm.mood ?? [],
    libraries: fm.libraries ?? [],
    rating: fm.rating ?? null,
    summary: fm.summary ?? fm.verdict ?? '',
    path: `references/library/${filename}`,
    thumb: fm.thumb ? `references/library/${fm.thumb}` : null,
  };
}

export function buildIndex(libraryDir) {
  const files = readdirSync(libraryDir).filter((f) => f.endsWith('.md') && f !== 'INDEX.md');
  const entries = [];
  for (const file of files) {
    const fm = parseFrontmatter(readFileSync(join(libraryDir, file), 'utf8'));
    const { valid, errors } = validateFrontmatter(fm);
    if (!valid) throw new Error(`Invalid frontmatter in ${file}: ${errors.join('; ')}`);
    entries.push(toIndexEntry(fm, file));
  }
  entries.sort((a, b) => a.slug.localeCompare(b.slug));
  return { version: 1, updated: new Date().toISOString().slice(0, 10), count: entries.length, entries };
}

export function renderIndexMd(index) {
  const lines = [
    '# Reference Library Index',
    '',
    `> ${index.count} entri · diperbarui ${index.updated}. Dihasilkan oleh \`taste-index.mjs\` — jangan edit manual.`,
    '',
    '| Slug | Style | Mood | Rating | Ringkasan |',
    '| --- | --- | --- | --- | --- |',
  ];
  for (const e of index.entries) {
    lines.push(`| [[${e.slug}]] | ${e.style.join(', ')} | ${e.mood.join(', ')} | ${e.rating ?? '-'} | ${e.summary} |`);
  }
  return lines.join('\n') + '\n';
}

function main() {
  const libraryDir = join(process.cwd(), 'docs/awwwards/references/library');
  if (!existsSync(libraryDir)) {
    console.error(`library dir tidak ada: ${libraryDir}`);
    process.exit(1);
  }
  const index = buildIndex(libraryDir);
  writeFileSync(join(libraryDir, 'index.json'), JSON.stringify(index, null, 2) + '\n');
  writeFileSync(join(libraryDir, 'INDEX.md'), renderIndexMd(index));
  console.log(`index dibangun: ${index.count} entri`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
```

- [ ] **Step 4: Jalankan test → pastikan LULUS**

Run: `node --test docs/awwwards/scripts/taste-index.test.mjs`
Expected: PASS — `# pass 5`, `# fail 0`.

- [ ] **Step 5: Review checkpoint (controller)** — diff `docs/awwwards/scripts/`.

---

### Task 6: Migrasi 5–10 entri taste-dna teratas → per-note + regenerasi index

**Files:**
- Create: `docs/awwwards/references/library/<slug>.md` (5–10 file)
- Regenerate: `index.json`, `INDEX.md` (via script)

**Interfaces:**
- Consumes: `main()` dari Task 5; template body `site-analysis-framework.md`.

- [ ] **Step 1: Pilih 5–10 entri lengkap** dari `docs/awwwards/references/taste-dna.md` (yang punya analisis penuh, bukan partial P#).

- [ ] **Step 2: Untuk tiap entri tulis note per SCHEMA** (nilai dari taste-dna, `thumb` dikosongkan — screenshot diisi Fase 2):
```markdown
---
type: reference
slug: art-yakushev
title: art-yakushev.com
source_url: https://art-yakushev.com
captured: 2026-07-16
awwwards_status: SOTD
category: [portfolio]
style: [cinematic, editorial]
grid: broken-grid
motion: [scroll-scrub, text-reveal]
libraries: [gsap, lenis]
mood: [premium, tense]
verdict: "<kutipan Billy dari taste-dna>"
influence: strengthen
rating: 8.5
thumb: null
typography:
  primary: <font dari taste-dna>
color:
  bg: "#0a0a0a"
  accent: ["#ff3b00"]
  mode: dark
---

## Apa yang Menarik
## Teknik yang Diidentifikasi
## Timing & Feel
## Kenapa Terasa Premium
```
Slug = domain di-kebab-case. Nilai WAJIB dari taste-dna, bukan dikarang.

- [ ] **Step 3: Regenerasi index** — `node docs/awwwards/scripts/taste-index.mjs` → `index dibangun: N entri`.

- [ ] **Step 4: Verifikasi jumlah cocok**

Run:
```bash
node -e "const i=require('./docs/awwwards/references/library/index.json'); const fs=require('node:fs'); const f=fs.readdirSync('docs/awwwards/references/library').filter(x=>x.endsWith('.md')&&x!=='INDEX.md').length; console.log('count',i.count,'files',f); if(i.count!==f) process.exit(1)"
```
Expected: `count N files N` (sama, exit 0).

- [ ] **Step 5: Review checkpoint (controller)** — diff `docs/awwwards/references/library/`.

---

### Task 7: Daftarkan vault Obsidian + gitignore `.obsidian/`

**Files:**
- Modify: `~/Library/Application Support/obsidian/obsidian.json` (di luar repo)
- Create/Modify: `.gitignore` (repo root)

- [ ] **Step 1: Tambah `.obsidian/` ke `.gitignore`**

Run:
```bash
grep -qxF '.obsidian/' .gitignore 2>/dev/null || printf '\n# Obsidian vault config\n.obsidian/\n' >> .gitignore
tail -3 .gitignore
```
Expected: blok berisi `.obsidian/`.

- [ ] **Step 2: Daftarkan vault** ke `obsidian.json` (tambah vault baru, tak menimpa lama):
```bash
node -e '
const fs=require("node:fs");
const p=process.env.HOME+"/Library/Application Support/obsidian/obsidian.json";
const j=JSON.parse(fs.readFileSync(p,"utf8"));
const id=require("node:crypto").randomBytes(8).toString("hex");
j.vaults[id]={path:"/Users/billymaulana/Data Billy/Works/2026-billy-portofolio/awwwards/billymaulana-portofolio/docs/awwwards",ts:Date.now(),open:false};
fs.writeFileSync(p,JSON.stringify(j));
console.log("registered vault", id);
'
```
Expected: `registered vault <hex>`.

- [ ] **Step 3: Verifikasi** — `node -e 'const j=require(process.env.HOME+"/Library/Application Support/obsidian/obsidian.json"); console.log(Object.values(j.vaults).map(v=>v.path))'` memuat path `.../docs/awwwards`.

- [ ] **Step 4: Review checkpoint (controller)** — diff `.gitignore`.

---

## Catatan eksekusi
- MODE NO-COMMIT: di akhir Fase 1, controller menyajikan ringkasan seluruh perubahan working tree (`docs/awwwards/**` + `.gitignore` + pointer di `docs/memory/MEMORY.md` & `CLAUDE.md`) untuk user urus git sendiri. Global config (`~/.claude/skills/awwwards`, `obsidian.json`) di luar repo.
- Fase 2–4 dapat plan sendiri setelah Fase 1 landing.
