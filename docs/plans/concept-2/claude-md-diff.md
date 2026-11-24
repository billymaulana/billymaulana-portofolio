# Ringkasan perubahan `CLAUDE.md` repo (2026-11-23)

`CLAUDE.md` 528 → 178 baris. `diff -u`: 288 baris keluar, 99 baris masuk. Backup lokal tidak
di-commit: `CLAUDE.md.pre-2026-11-23` (tercatat di `.git/info/exclude`).

Bukti tidak ada aturan yang hilang:
`node docs/awwwards/scripts/claude-md-coverage.mjs CLAUDE.md.pre-2026-11-23 CLAUDE.md docs/awwwards/process/*.md --superseded "## Art Direction Mandate (standing — permintaan user 2026-07-15)" --superseded "## Architecture"`
→ `semua section tercakup oleh 7 file`, exit 0. Tanpa file proses, alat yang sama melaporkan 25 section hilang (kontrol negatif).

## Baru di `CLAUDE.md`

| Section | Isi |
|---|---|
| `## Misi` | Project Overview lama (verbatim) + peran art director + standar Billy |
| `## Cara kerja art director` | Pelajari taste, jangan clone · konsep → styleframe · aset dibuat sendiri · delegasi Fable bebas · Awwwards/Pinterest boleh · mode `create` · jelek → ganti konsep · alur Fase 0–5 · dua titik sentuh |
| `## Definition of Done` | 7 syarat: gate commit, audit geometri 7 + 2 viewport, browser review, reduced motion, 60fps M1, kritikus ≥ 8,0 maks 2 putaran, prediksi tersegel |
| `## Stack & perintah` | Diperbarui ke Nuxt 4.6 / GSAP 3.15 / bun / indeks route; Commands + Deployment verbatim |
| `## Aturan yang dipelajari dengan mahal` | 19 aturan satu baris + penunjuk; "Hapus Fitur = Konfirmasi Dulu" verbatim |
| `## Rujukan` | Tabel penunjuk + router Taste Engine verbatim |

## Dipindah verbatim ke `docs/awwwards/process/`

| Section lama | File |
|---|---|
| Browser Review · Layout Audit · Kerja shader · Aturan turunan | `audit-protocol.md` |
| Output Contract (11 blok + gate) · "Yang membuat spec ditolak" | `spec-contract.md` |
| Delegation Prompt Contract (14 blok) | `delegation-contract.md` |
| Rejection Protocol + pengecualian screenshot | `rejection-protocol.md` |
| Reference Capture Protocol | `reference-capture.md` |
| Hard Constraints Colors / Typography / Layout + Palet Liquid Thermal | `taste-constraints.md` |

## Diganti (disetujui lewat design doc §8)

| Aturan lama | Pengganti |
|---|---|
| `## Art Direction Mandate` — wajib scrape situs bernama, teknik dipetakan ke situs | `## Cara kerja art director` — teknik dipetakan ke prinsip master brief |
| `## Architecture` — `pages/index.vue` single-page, Nuxt 4.3 (usang) | `## Stack & perintah` |
| Blok 5 kontrak delegasi — nama situs + teknik diadopsi | Prinsip master brief + keluarga referensi; dilarang "tiru X" |
| `anti-slop-rules.md` 2026-09-22 — minta referensi ke Billy setelah 2 penolakan | Entri 2026-11-23: kembali ke generasi konsep baru |
