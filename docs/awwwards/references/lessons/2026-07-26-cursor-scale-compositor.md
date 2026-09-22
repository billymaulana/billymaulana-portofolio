---
type: lesson
date: 2026-07-26
job: "AppCursor — width/height → transform scale"
outcome: shipped
score_before: null
score_after: null
---

## Yang berhasil

`taste-lint` rule `animated-props` menandai `AppCursor` menganimasikan `width`/`height` —
properti yang memicu layout tiap frame saat hover. Ditemukan oleh alat, bukan oleh mata.

Perbaikannya butuh dua keputusan struktural, bukan sekadar mengganti properti:

**1. Pisahkan posisi dan skala ke dua elemen.**
Posisi ditulis tiap frame oleh `requestAnimationFrame`; skala ditransisikan CSS. Kalau keduanya
digabung dalam satu `transform`, transisi CSS ikut menahan posisi dan kursor terasa tertinggal
dari pointer. Wrapper memegang `translate()`, anak memegang `scale()`.

**2. `border` CSS diganti SVG dengan `vector-effect="non-scaling-stroke"`.**
`transform: scale()` ikut menskala border — pada hover 1.6× garis 1px jadi 1.6px. Satu-satunya
cara mempertahankan 1px tanpa menganimasikan `border-width` (yang juga memicu layout) adalah
SVG stroke dengan `non-scaling-stroke`.

Konsekuensi turunan: offset pemusatan tidak lagi bergantung state. Wrapper tetap 40×40, jadi
`RING_SIZES` per-state dihapus dan diganti satu konstanta `RING_BASE = 40`.

## Angka verifikasi

| | Sebelum | Sesudah |
| --- | --- | --- |
| Ring hover | `width/height: 64px` | `scale(1.6)` → render 64px |
| Ring text | `width/height: 24px` | `scale(0.6)` → render 24px |
| Dot hover | `width/height: 4px` | `scale(0.667)` → render 4px |
| Pusat ring saat hover | (400, 300) | (400, 300) — tidak bergeser |
| Stroke saat scale 1.6× | 1.6px | **1px** (non-scaling-stroke) |
| `taste-lint animated-props` | FAIL | **PASS** |

Seluruh perilaku visual identik; yang berubah hanya biaya render.

## Rule baru

(tidak ada — ini penerapan rule yang sudah ada: animate hanya `transform`/`opacity`/`clip-path`)

## Sinyal taste baru

(tidak ada — perbaikan teknis, bukan keputusan desain)

## Catatan untuk kasus serupa

Setiap elemen yang posisinya di-drive RAF **dan** punya state visual yang ditransisikan CSS
membutuhkan pemisahan dua elemen ini. Pola yang sama berlaku untuk magnetic button, tooltip
follower, dan indikator scroll.
