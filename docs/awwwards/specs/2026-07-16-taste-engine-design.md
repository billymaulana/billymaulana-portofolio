# Taste Engine — Design Spec

Tanggal: 2026-07-16
Status: Draft untuk review
Source of Truth: `docs/awwwards/` (project-scoped, versioned via git)

## 1. Masalah

Sistem awwwards yang ada sudah kaya ilmu (SKILL.md + 30 reference, rubrik evaluasi, roles, workflow, clone pipeline, failure-patterns) tetapi hasil masih sering "AI slop". Akar masalah bukan kekurangan pengetahuan, melainkan:

1. **Fragmentasi / tidak ada source of truth.** Dua salinan `awwwards` menyimpang (global v7.2 vs project v5.0); `taste-dna.md` beda isi (104 vs 66 entri); profil taste personal tersebar di ≥4 file.
2. **Tiga kapabilitas kosong**: (a) penyimpanan image/screenshot reference + auto-kategorisasi, (b) index queryable (semua retrieval = baca file penuh; `taste-dna.md` 91 KB = bom token), (c) learning loop tertutup+otomatis.
3. **Prompt-improvement / rewrite-brief tidak ada** di seluruh sistem.
4. **Tidak ada enforcement.** Mandate kualitas hanya "diingatkan" di CLAUDE.md, bergantung kepatuhan Claude, bukan gate yang tidak bisa dilewati.

## 2. Tujuan

Membangun **Taste Engine**: mesin desain awwwards project-scoped yang (a) menyimpan taste sebagai data terstruktur + queryable + bergambar, (b) menegakkan kualitas lewat agent orchestrator + subagent, (c) belajar dari tiap job dan makin baik tanpa prompt berulang, (d) hemat token via index + isolasi context subagent.

### Non-Goals
- Bukan global/portable ke semua project (keputusan user: project-scoped; promote ke global menyusul bila perlu).
- Tidak migrasi 104 entri sekaligus (pakai incremental).
- Tidak menghapus config global user (hanya diciutkan jadi pointer).
- Tidak membangun UI/dashboard khusus — Obsidian yang jadi antarmuka visual.

## 3. Arsitektur (5 Layer)

### Layer 0 — Konsolidasi Source of Truth
- SoT tunggal = `docs/awwwards/` di git repo `.../awwwards/billymaulana-portofolio`.
- Tarik 8 file teknis yang hanya ada di global ke `docs/awwwards/references/`: `gsap-patterns.md`, `lenis-patterns.md`, `threejs-patterns.md`, `motion-principles.md`, `taste-design-comprehensive.md`, `webgpu-tsl-skill.md`, `webgpu-tsl-reference.md`, folder `webgpu-tsl/`. Setelah ini project = superset lengkap.
- Global `~/.claude/skills/awwwards/SKILL.md` diciutkan jadi pointer (isi: "Taste Engine SoT ada di project portfolio `docs/awwwards`; copy ke sini bila butuh global"). Referensinya boleh tetap sebagai arsip, tapi tidak lagi jadi sumber aktif.
- Profil taste personal disatukan ke `docs/awwwards/personal-taste-profile.md` (kanonik). Cuplikan di `taste-dna.md`, `MEMORY.md`, SKILL.md, CLAUDE.md diganti pointer ke file ini.
- Obsidian dibuka di root `docs/awwwards` = vault "Taste Brain". `.obsidian/` ditambahkan ke `.gitignore` project.

### Layer 1 — Format Reference Baru (teks + image + index)
Struktur folder baru di dalam `docs/awwwards/`:
```
references/
  library/
    <slug>.md                 # 1 site = 1 note
    assets/
      <slug>-desktop.png
      <slug>-mobile.png
    INDEX.md                  # browsable (Obsidian)
    index.json                # machine-queryable manifest
  lessons/
    <date>-<slug>.md          # learning loop (Layer 4)
  ...(30 reference lama tetap)
personal-taste-profile.md
anti-slop-rules.md            # kanonik (Layer 4)
```

**Frontmatter schema per reference note** (`references/library/<slug>.md`):
```yaml
---
type: reference
slug: kebab-slug
title: Site Name
source_url: https://example.com
captured: 2026-07-16
awwwards_status: SOTD            # SOTD | Honorable Mention | Nominee | Non-awwwards
category: [portfolio]            # portfolio|agency|ecommerce|saas|editorial|product|experimental
style: [cinematic, minimalism]   # dari 14 kategori style-dna-guide §1
grid: 12-col asymmetric
typography:
  primary: PP Neue Montreal
  secondary: null
  traits: [oversized-display, variable-weight]
color:
  bg: "#0a0a0a"
  fg: "#f5f5f5"
  accent: ["#ff3b00"]
  mode: dark                     # dark | light
motion: [scroll-scrub, text-reveal, magnetic-cursor]
libraries: [gsap, lenis, three]
mood: [premium, tense]
verdict: "Kutipan langsung Billy kenapa suka"
influence: strengthen            # strengthen | new | confirm
rating: 8.5                      # opsional, rubrik evaluation-system
assets:
  desktop: assets/<slug>-desktop.png
  mobile: assets/<slug>-mobile.png
related: ["[[other-slug]]"]
---
```
**Body** mengikuti template `site-analysis-framework.md` yang sudah ada (Apa yang Menarik, Teknik yang Diidentifikasi, Timing & Feel, Kenapa Terasa Premium, Mobile, Accessibility, Influence). Ditutup wikilink ke reference terkait + dimensi taste.

**index.json schema** (`references/library/index.json`):
```json
{
  "version": 1,
  "updated": "2026-07-16",
  "count": 0,
  "entries": [
    {
      "slug": "example",
      "title": "Example",
      "url": "https://example.com",
      "category": ["portfolio"],
      "style": ["cinematic"],
      "mood": ["premium"],
      "libraries": ["gsap", "lenis"],
      "rating": 8.5,
      "summary": "Satu baris esensi.",
      "path": "references/library/example.md",
      "thumb": "references/library/assets/example-desktop.png"
    }
  ]
}
```
Alur retrieval: baca `index.json` (kecil) → filter by tag (style/mood/category/library) → baca hanya note yang cocok. Tidak pernah baca monolith 91 KB lagi.

### Layer 2 — Capture Pipeline
Skill baru `taste-capture` di `2026-billy-portofolio/.claude/skills/taste-capture/` (project-scoped, satu lokasi dengan `reference-first`). Input = URL atau path gambar.
1. **URL**: browser automation (Chrome MCP) → screenshot desktop (1440px) + mobile (390px) disimpan ke `assets/`; ekstrak computed styles via JS (font body/heading, warna dominan + hex, sample spacing/grid).
2. **Gambar**: analisis visual langsung (tanpa scrape).
3. **Auto-kategorisasi**: isi frontmatter — style dipetakan ke 14 kategori `style-dna-guide §1`, plus grid/typography/color/motion/mood via heuristik + judgment.
4. Tulis `<slug>.md` + assets, append entri ke `INDEX.md` dan `index.json`.
5. Tanya user **verdict** (kenapa suka) → sinyal taste personal; set `influence`.

Output: satu perintah `capture <url|image>` → note terkategorisasi lengkap + gambar tersimpan permanen.

### Layer 3 — Agent + Subagent (enforcement)
**Orchestrator** `.claude/agents/awwwards-art-director.md` (repo-level, model opus):
- Trigger (description): "buatkan website/portfolio/landing/UI kualitas awwwards/SOTD", "tiru/clone website X", "desain premium".
- Pipeline yang ditegakkan (gate, tidak bisa dilewati):
  1. **Rewrite brief** — ubah prompt user jadi creative brief (goal, feels, audience, references, constraints). Isi gap prompt-improvement.
  2. **Baca learning** — muat `anti-slop-rules.md` + lesson terbaru + `personal-taste-profile.md`.
  3. **Reference research** — spawn `reference-researcher`.
  4. **Gate reference-first** — HARAM lanjut build sebelum ada reference + design tokens diekstrak.
  5. **Build** — spawn `builder` (role-assigned).
  6. **Evaluate loop** — spawn `art-director-critic`; iterate sampai skor rubrik ≥ 8.0.
  7. **Capture lesson** — tulis lesson (Layer 4).

**Subagent** (context terisolasi):
- `reference-researcher.md` — query `index.json` + scrape reference baru; balikin **design tokens + daftar teknik saja** (bukan dump mentah).
- `art-director-critic.md` — review hasil di browser, skor vs rubrik `evaluation-system.md`, balikin **gap + fix konkret** (evaluator/QA).
- `motion-choreographer.md` — role motion; wire plugin `gsap-scrolltrigger` / `motion-framer`.
- `builder.md` — implement; pakai skill `frontend-design`/`threejs-webgl`/`gsap`/`reference-first`.

**Clone mode**: untuk "tiru website X" → jalankan pipeline `website-clone` 6-fase + loop `art-director-critic` iterate sampai pixel-match.

### Layer 4 — Learning Loop (tertutup + otomatis)
- Tiap job selesai → orchestrator tulis `references/lessons/<date>-<slug>.md`:
  ```yaml
  ---
  type: lesson
  date: 2026-07-16
  job: "portfolio hero build"
  outcome: shipped | slop-caught | iterated
  score_before: 6.5
  score_after: 8.4
  ---
  ## Yang berhasil
  ## Yang jadi slop + root cause
  ## Rule baru → (di-append ke anti-slop-rules.md)
  ## Preferensi taste baru → (update personal-taste-profile.md)
  ```
- Rule baru di-append ke `anti-slop-rules.md` (kanonik, append-only).
- **Penutup loop**: langkah #2 orchestrator SELALU membaca `anti-slop-rules.md` + lesson terbaru di awal job → tiap job mulai lebih pintar.
- Opsional: hook `Stop` yang mengingatkan/memaksa capture lesson bila job desain selesai tanpa lesson tertulis.

## 4. Hemat Token (cross-cutting)
- `index.json` kecil → selective read; riset baca ~3–5 KB, bukan 91 KB (~95% hemat).
- Subagent isolasi context: researcher baca 10 situs → balikin token; critic balikin skor+fix. Context orchestrator tetap bersih → iterasi clone panjang tanpa meledak.
- Progressive disclosure: SKILL.md tetap indeks lookup; file berat dibaca hanya saat relevan.
- Satu SoT → hilang biaya double-maintenance.

## 5. Fase Build (target: semua)
- **Fase 1** — Layer 0 + 1: konsolidasi SoT, tarik 8 file teknis, ciutkan global, satukan personal profile, buat struktur `references/library/` + schema + `index.json` kosong, migrasi 5–10 entri taste-dna teratas sebagai proof (incremental).
- **Fase 2** — Layer 2: skill `taste-capture` (URL + image → note terkategorisasi + assets + index).
- **Fase 3** — Layer 3: orchestrator + 4 subagent + wiring skill/plugin.
- **Fase 4** — Layer 4: lessons + `anti-slop-rules.md` + penutup loop (+ hook opsional).

Tiap fase menghasilkan artefak yang langsung dipakai.

## 6. Pendekatan Migrasi: B (Incremental)
Tidak parse 104 entri sekaligus (risiko tinggi). Yang lama tetap di `taste-dna.md`; entri baru → per-note; `index.json` mengindeks keduanya; entri terpenting dimigrasi bertahap. Bom token teratasi lewat index + migrasi top entri.

## 7. Risiko & Mitigasi
- Migrasi entri tulisan tangan tidak konsisten → incremental + migrasi manual bertahap.
- Browser automation flaky saat capture → fallback: user drop gambar manual, Claude klasifikasi.
- Context agent membengkak saat iterasi → isolasi subagent.
- Trigger agent bentrok dengan skill awwwards → agent yang memanggil skill, bukan duplikasi; skill jadi knowledge, agent jadi enforcement.
- Divergensi kambuh → global diciutkan jadi pointer; hanya project yang aktif.

## 8. Kriteria Sukses
- Riset desain membaca < 5 KB via index (bukan 91 KB).
- Tidak ada output "selesai" sebelum `art-director-critic` memberi skor ≥ 8.0.
- `capture <url>` menghasilkan note terkategorisasi lengkap + 2 screenshot dalam satu perintah.
- Tiap job desain menambah ≥ 1 lesson; orchestrator membaca `anti-slop-rules.md` di awal tiap job.
- "Tiru website X" → iterate sampai critic menyatakan match.
