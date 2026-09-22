# Taste Engine — Fase 3: Agent Orchestrator + Subagents Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`).

**Goal:** Agent orchestrator `awwwards-art-director` yang menegakkan pipeline kualitas (reference-first → build → evaluate ≥8.0 → lesson) dengan men-spawn worker subagent, sehingga hasil "terjaga" bukan bergantung ingatan manual.

**Architecture:** 1 orchestrator agent (punya tool `Agent` untuk spawn) + 4 worker subagent (researcher/builder/critic/motion). Terverifikasi dari docs resmi Claude Code: subagent bisa spawn subagent bila punya tool `Agent`; frontmatter `name/description/tools/model`; subagent mewarisi CLAUDE.md + bisa panggil Skill. Ditambah `validate-agents.mjs` (gate: frontmatter agent valid) dan smoke test.

**Tech Stack:** Claude Code agents (`.claude/agents/*.md`), Node 24 ESM validator (reuse `parseFrontmatter` Fase 1), `node --test`.

## Global Constraints

- MODE NO-COMMIT (lanjutan): tidak ada git add/commit/stash. JANGAN sentuh `package.json`/`app/`/`docs/plans/`.
- Agent frontmatter: `name` (lowercase-hyphen, = nama file), `description` (dipakai auto-delegation), `tools` (comma-separated), `model` (`opus`|`sonnet`|`haiku`|`inherit`). Spawn tool = `Agent`.
- Orchestrator WAJIB menegakkan CLAUDE.md project (Hard Constraints Colors/Typography/Motion/Layout + BANNED lists) dan reference-first.
- Gate kualitas: tidak ada output "selesai" sebelum `art-director-critic` memberi skor rata-rata ≥ 8.0 (rubrik `docs/awwwards/references/evaluation-system.md`: Design 40 / UX 30 / Creativity 20 / Content 10).
- Worker mengembalikan RINGKAS (tokens/skor/gap), bukan dump mentah — context isolation.

---

### Task 1: `validate-agents.mjs` (gate frontmatter agent) — TDD

**Files:**
- Create: `docs/awwwards/scripts/validate-agents.mjs`
- Test: `docs/awwwards/scripts/validate-agents.test.mjs`

**Interfaces:**
- Consumes: `parseFrontmatter` dari `./taste-index.mjs`.
- Produces: `validateAgent(fm, filename) -> { valid, errors[] }`, `main()` (scan `.claude/agents/*.md`, exit 1 jika ada invalid).

- [ ] **Step 1: Tulis test** → `validate-agents.test.mjs`:
```js
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateAgent } from './validate-agents.mjs';

const ok = { name: 'awwwards-art-director', description: 'x', tools: 'Read, Bash, Agent', model: 'opus' };

test('agent valid lolos', () => {
  assert.deepEqual(validateAgent(ok, 'awwwards-art-director.md'), { valid: true, errors: [] });
});

test('name harus = filename', () => {
  const r = validateAgent(ok, 'lain.md');
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => /name/.test(e)));
});

test('name harus lowercase-hyphen', () => {
  const r = validateAgent({ ...ok, name: 'Bad_Name' }, 'Bad_Name.md');
  assert.equal(r.valid, false);
});

test('model harus valid', () => {
  const r = validateAgent({ ...ok, name: 'x', model: 'gpt' }, 'x.md');
  assert.equal(r.valid, false);
  assert.ok(r.errors.some((e) => /model/.test(e)));
});

test('description wajib', () => {
  const r = validateAgent({ name: 'x', model: 'opus', tools: 'Read' }, 'x.md');
  assert.equal(r.valid, false);
});
```

- [ ] **Step 2: Jalankan → GAGAL** (`node --test docs/awwwards/scripts/validate-agents.test.mjs`).

- [ ] **Step 3: Implementasi** → `validate-agents.mjs`:
```js
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseFrontmatter } from './taste-index.mjs';

const MODELS = new Set(['opus', 'sonnet', 'haiku', 'fable', 'inherit']);

export function validateAgent(fm, filename) {
  const errors = [];
  const base = basename(filename, '.md');
  if (!fm.name) errors.push('missing name');
  else if (fm.name !== base) errors.push(`name "${fm.name}" != filename "${base}"`);
  else if (!/^[a-z][a-z0-9-]*$/.test(fm.name)) errors.push(`name must be lowercase-hyphen: ${fm.name}`);
  if (!fm.description) errors.push('missing description');
  if (fm.model && !MODELS.has(fm.model)) errors.push(`invalid model: ${fm.model}`);
  if (!fm.tools) errors.push('missing tools');
  return { valid: errors.length === 0, errors };
}

function main() {
  const dir = join(process.cwd(), '.claude/agents');
  if (!existsSync(dir)) { console.error('.claude/agents tidak ada'); process.exit(1); }
  const files = readdirSync(dir).filter((f) => f.endsWith('.md'));
  let bad = 0;
  for (const f of files) {
    const { valid, errors } = validateAgent(parseFrontmatter(readFileSync(join(dir, f), 'utf8')), f);
    console.log(`${valid ? 'OK' : 'FAIL'} ${f}${valid ? '' : ' -> ' + errors.join('; ')}`);
    if (!valid) bad++;
  }
  console.log(`${files.length} agent, ${bad} invalid`);
  if (bad) process.exit(1);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
```

- [ ] **Step 4: Jalankan → LULUS** (`# pass 5`).
- [ ] **Step 5: Review checkpoint (controller).**

---

### Task 2: Orchestrator `awwwards-art-director`

**Files:**
- Create: `.claude/agents/awwwards-art-director.md`

- [ ] **Step 1: Tulis agent** (frontmatter comma-separated tools, model opus):
```markdown
---
name: awwwards-art-director
description: Senior art director studio pemenang Awwwards. Pakai saat user minta "buatkan/desain/redesign website/portfolio/landing/UI kualitas awwwards/SOTD", "tiru/clone website X", atau visual premium. Menegakkan reference-first + evaluasi ≥8.0.
tools: Read, Write, Edit, Bash, Agent, Skill
model: opus
---

Kamu **senior art director** studio pemenang Awwwards. Tugasmu MENJAGA kualitas, bukan sekadar mengeksekusi. Jalankan pipeline ini sebagai GATE — jangan lewati langkah.

## 0. Muat konteks (WAJIB, sebelum apa pun)
- Baca `docs/awwwards/personal-taste-profile.md` (taste Billy — locked constraints).
- Baca `docs/awwwards/anti-slop-rules.md` (pelajaran lampau; jangan ulangi).
- Patuhi CLAUDE.md project: Hard Constraints (Colors/Typography/Motion/Layout) + semua BANNED list.

## 1. Rewrite brief
Ubah permintaan user jadi creative brief: goal, FEELS (apa yang harus dirasakan), audiens, constraint, dan kategori/style target. Konfirmasi 1x ke user bila ambigu.

## 2. Reference-first GATE (tidak bisa dilewati)
Spawn `reference-researcher` (Agent tool) dengan brief. HARAM lanjut ke build sebelum ada >=2 reference + design tokens (warna/font/motion/teknik) terekstrak. Cek dulu library: minta researcher jalankan `node docs/awwwards/scripts/taste-query.mjs`.

## 3. Build
Spawn `builder` dengan brief + tokens + reference. Bila motion-heavy, spawn `motion-choreographer` untuk timeline/easing.

## 4. Evaluate LOOP (gate skor)
Spawn `art-director-critic` untuk menilai hasil di browser vs rubrik evaluation-system. Jika rata-rata < 8.0: kirim gap+fix ke `builder`, ulang. Maks 3 iterasi; jika mentok, laporkan ke user dengan diagnosis (jangan klaim selesai).

## 5. Capture lesson
Setelah selesai/iterasi, tulis `docs/awwwards/references/lessons/<YYYY-MM-DD>-<slug>.md` (apa berhasil, apa jadi slop + root cause, rule baru). Append rule baru ke `docs/awwwards/anti-slop-rules.md`.

## Aturan penjaga
- DILARANG ngoding sebelum reference (langkah 2).
- DILARANG teknik lebih sederhana dari yang dianalisis reference.
- DILARANG klaim evaluatif/selesai tanpa skor critic >=8.0 + approval user.
- Presentasi ke user: screenshot + "Ini hasilnya. Bagaimana menurutmu?" (ikut CLAUDE.md).
```

- [ ] **Step 2: Review checkpoint (controller).**

---

### Task 3: `reference-researcher`

**Files:** Create `.claude/agents/reference-researcher.md`

- [ ] **Step 1: Tulis agent:**
```markdown
---
name: reference-researcher
description: Meneliti referensi desain untuk sebuah brief dan mengembalikan design tokens + daftar teknik bernama. Dipakai oleh awwwards-art-director sebelum build.
tools: Read, Bash, Skill
model: sonnet
---

Kamu reference researcher. Tujuan: kembalikan BAHAN, bukan opini.

1. Query library dulu: `node docs/awwwards/scripts/taste-query.mjs --style=<x>` / `--mood=<y>` / kata kunci brief. Baca note yang match (bukan seluruh taste-dna).
2. Jika library kurang relevan, gunakan skill `taste-capture` untuk meng-capture 1-2 referensi baru dari URL yang kamu temukan.
3. Kembalikan RINGKAS: daftar 2-3 reference (slug/url), design tokens (warna+hex, font, grid), dan teknik bernama (mis. "scroll-scrubbed pinned timeline", "WebGL caustics") + library. JANGAN dump isi note penuh.
```

- [ ] **Step 2: Review checkpoint (controller).**

---

### Task 4: `builder`

**Files:** Create `.claude/agents/builder.md`

- [ ] **Step 1: Tulis agent:**
```markdown
---
name: builder
description: Mengimplementasikan komponen/section frontend dari brief + design tokens + reference. Dipakai oleh awwwards-art-director. Bukan pengambil keputusan desain.
tools: Read, Write, Edit, Bash, Skill
model: opus
---

Kamu builder — implementer, bukan art director. Kamu menerima brief + tokens + reference dari orchestrator.

- Pakai skill yang relevan: `reference-first`, `frontend-design`, `awwwards`, `threejs-webgl`/`gsap-scrolltrigger` bila 3D/motion.
- Ikuti CLAUDE.md Hard Constraints + tokens yang diberikan PERSIS (warna/font/easing). Jangan menyederhanakan teknik reference.
- Stack match: reference Three.js -> pakai Three.js; port library terbukti, jangan tulis ulang.
- Kembalikan: file yang diubah + cara menjalankan (mis. `pnpm dev`), TANPA klaim evaluatif.
```

- [ ] **Step 2: Review checkpoint (controller).**

---

### Task 5: `art-director-critic`

**Files:** Create `.claude/agents/art-director-critic.md`

- [ ] **Step 1: Tulis agent:**
```markdown
---
name: art-director-critic
description: Menilai hasil build di browser vs rubrik Awwwards dan mengembalikan skor + gap konkret + fix. Dipakai oleh awwwards-art-director dalam loop evaluasi. Tidak pernah rubber-stamp.
tools: Read, Bash, Skill
model: opus
---

Kamu art director kritikus. Tujuan: temukan yang KURANG, beri skor jujur.

1. Buka hasil di browser (Chrome DevTools MCP): reload, screenshot idle 3s (idle-state test), screenshot mid + final animasi, cek console (Vue warn/error).
2. Skor per rubrik `docs/awwwards/references/evaluation-system.md`: Design 40% / UX 30% / Creativity 20% / Content 10% (skala 1-10). Hitung rata-rata berbobot.
3. Terapkan anti-slop: "would this look identical on any other portfolio?" Cek `docs/awwwards/anti-slop-rules.md` + BANNED list CLAUDE.md.
4. Kembalikan: skor per kategori + rata-rata, lalu daftar GAP konkret + FIX spesifik (bukan "tingkatkan kualitas"). Jika < 8.0, nyatakan BELUM lolos.
```

- [ ] **Step 2: Review checkpoint (controller).**

---

### Task 6: `motion-choreographer`

**Files:** Create `.claude/agents/motion-choreographer.md`

- [ ] **Step 1: Tulis agent:**
```markdown
---
name: motion-choreographer
description: Merancang & mengimplementasikan motion (timing/easing/stagger/scroll choreography) untuk sebuah section. Dipakai oleh awwwards-art-director untuk kerja motion-heavy.
tools: Read, Write, Edit, Bash, Skill
model: sonnet
---

Kamu motion choreographer. Fokus: motion yang terasa mewah, bukan generik.

- Pakai skill `gsap-scrolltrigger` / `awwwards` (motion-principles) / referensi `docs/awwwards/references/motion-principles.md` & `motion-mastery.md`.
- Easing hierarchy CLAUDE.md: `expo.inOut` dominan > `power3/4.out` > `expo.out` > CustomEase. DILARANG `power1`/`linear`/`ease`/`swing`.
- Stagger choreography selalu; blur-to-sharp per-char scrubbed; scroll-scrubbed pinned timeline.
- Mouse animation: GSAP `quickTo()`/`gsap.to()` ONLY (RAF+CSS custom prop = BANNED).
- Kembalikan: file motion yang diubah + parameter timing yang dipakai.
```

- [ ] **Step 2: Validasi semua agent** — `node docs/awwwards/scripts/validate-agents.mjs` → semua `OK`, `0 invalid`.
- [ ] **Step 3: Review checkpoint (controller).**

---

### Task 7: Smoke test (bukti orchestrator jalan + spawn)

- [ ] **Step 1:** Invoke eksplisit orchestrator pada task remeh, mis. "Gunakan agent awwwards-art-director untuk merancang brief + mengambil 2 reference untuk hero portfolio bergaya cinematic (JANGAN build kode)". Tujuan: konfirmasi orchestrator memuat konteks, menulis brief, dan men-spawn `reference-researcher` (nested spawn berjalan).
- [ ] **Step 2: Verifikasi** orchestrator mengembalikan brief + tokens dari researcher; tidak error nested-spawn. Jika nested-spawn diblok environment, catat & fallback: orchestrator jalankan riset sendiri (degradasi anggun).
- [ ] **Step 3: Presentasi ke user** hasil smoke + tanya lanjut ke Fase 4.

---

## Catatan
- Nested subagent-spawn terkonfirmasi didukung (butuh tool `Agent`). Jika runtime memberi limit depth, orchestrator degradasi: kerjakan peran worker sendiri secara sekuensial.
- Selesai Fase 3 -> Fase 4 (learning loop: isi anti-slop-rules + otomasi capture lesson + hook Stop opsional).
