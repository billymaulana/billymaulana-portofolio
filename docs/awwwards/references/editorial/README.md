---
type: editorial-curriculum
updated: 2026-07-26
---

# Editorial Foundations — 5 Lesson

Lapisan **fundamental** yang selama ini hilang dari Taste Engine. Referensi lain di
`references/` mengajarkan **teknik** (shader, GSAP, WebGL, style DNA). Folder ini mengajarkan
**dasar yang menentukan apakah teknik itu terlihat mahal atau terlihat seperti demo**.

Diagnosis yang memicu folder ini: dua hero berteknik Level 5 ditolak dengan seluruh gate
mekanis hijau (`../../failures/2026-07-25-specimen-001.md`). Teknik bukan masalahnya —
fondasi editorialnya yang belum ada.

## Urutan baca

| # | File | Isi | Baca saat |
|---|---|---|---|
| 1 | [01-typography-fundamentals.md](01-typography-fundamentals.md) | Klasifikasi typeface, anatomi, optical size (display vs text), pairing, type scale ganda, micro-typography | Sebelum memilih font apa pun |
| 2 | [02-grid-fundamentals.md](02-grid-fundamentals.md) | Anatomi grid, konstruksi Müller-Brockmann, 7 tipe grid, 10 kesalahan, baseline grid + `text-box-trim` | Sebelum menentukan layout |
| 3 | [03-art-direction.md](03-art-direction.md) | Intake 9 pertanyaan, peta kompetitor, 8 slider kepribadian, values, moodboard, **adjective decoder** | Di awal setiap project/redesign |
| 4 | [04-hierarchy-spacing-balance.md](04-hierarchy-spacing-balance.md) | Hukum tiga alat, hukum spacing, rumus bobot visual, kurva ritme 5 gerakan, skala | Saat menyusun section |
| 5 | [05-developing-taste.md](05-developing-taste.md) | Taste gap, tiga praktik, **mood taxonomy 18 token**, filter referensi, loop mingguan | Saat mengevaluasi & saat capture referensi |

## Yang paling sering dibutuhkan

| Butuh | Langsung ke |
|---|---|
| Tabel tracking/leading per ambang ukuran | `01` §3C |
| Aturan pairing + 5 dimensi kontras | `01` §4 |
| Widow/orphan, karakter benar, `tabular-nums` | `01` §6 |
| Angka grid portfolio ini (margin/kolom/gutter) | `02` §5 |
| Baseline grid + debug overlay | `02` §6 |
| Menerjemahkan "AI slop" / "biasa saja" jadi angka | `03` §7C |
| Hukum spacing antar grup | `04` §3A |
| Ritme padat/lapang per section | `04` §7 |
| Kosakata mood + penanda terukur | `05` §4 |

## Hubungan dengan file lain

```
editorial/01  ──melengkapi──>  ../typography-mastery.md   (scale, CSS, GSAP)
editorial/02  ──melengkapi──>  ../grid-techniques.md      (CSS Grid API, bento)
                               ../layout-composition.md   (pattern per section)
editorial/03  ──melengkapi──>  ../visual-theory.md §9     (art direction estetis)
                               ../../failures/            (sumber adjective decoder)
editorial/04  ──melengkapi──>  ../visual-theory.md §1,§5,§8
editorial/05  ──mengikat───>   ../library/ · ../../anti-slop-rules.md
                               ../../personal-taste-profile.md
```

## Gate editorial

Tambahan untuk gate yang sudah ada di `../../anti-slop-rules.md`. Sebuah section belum selesai
sampai kesembilan poin ini lolos:

1. Tracking mengikuti tabel ambang ukuran — bukan satu nilai global
2. Leading terkunci per tier (0.85 / 1.0 / 1.3 / 1.2)
3. Rasio display : body ≥ 5×
4. `text-wrap: balance` di heading, `pretty` di body
5. Semua angka dinamis `tabular-nums`
6. Ruang antar grup ≥ 2× ruang dalam grup
7. Padding section berbeda dari section tetangga
8. Mood target ditulis sebelum build dan diverifikasi sesudah
9. Squint test dan grayscale test lolos
