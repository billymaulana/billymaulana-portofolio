# Reference capture protocol

> Dipindah verbatim dari `CLAUDE.md` repo pada 2026-11-23. Bila isi di sini bertentangan dengan `CLAUDE.md` § Cara kerja art director (pelajari taste dari prinsip master brief, jangan meniru situs), `CLAUDE.md` yang berlaku.

## Reference Capture Protocol — WAJIB Saat Billy Memberi Link

**Pemicu**: Billy mengirim URL situs untuk dimasukkan ke taste library-nya.

Jangan hanya menyimpan URL dan kesan. Jalankan capture penuh:

### 1. Screenshot

| Shot | Path | Catatan |
|---|---|---|
| Desktop hero | `references/library/assets/<slug>-desktop.png` | 1440×900, ini nilai `thumb` |
| Mobile hero | `references/library/assets/<slug>-mobile.png` | 390×844 |
| Per section | `references/library/assets/<slug>-<section>.png` | tiap section berbeda |

Sebelum capture: cek entry/audio gate (tombol ENTER). Klik ENTER tanpa audio, tunggu hero +
animasi selesai, BARU capture. Jangan pernah menyimpan splash gate sebagai hero.

### 2. Kategorisasi WAJIB

Isi setiap field frontmatter di `references/library/SCHEMA.md`:

- **`style[]`** — dari 14 kategori `references/style-dna-guide.md` §1
  (brutalism, editorial, cinematic, minimalism, liquid, glass, sculptural, 3d-immersive,
  kinetic-type, experimental, swiss, maximalism, retro-futuristic, organic)
- **`mood[]`** — premium, brutal, playful, calm, tense, luxurious
- **`motion[]`** — scroll-scrub, text-reveal, page-transition, parallax, cursor-driven, morph
- **`libraries[]`** — dideteksi dari DOM/network, bukan ditebak
- **`category[]`**, **`grid`**, **`awwwards_status`**

### 3. Analisis detail WAJIB — lima dimensi

Body note harus memuat kelimanya, dengan **angka**, bukan kata sifat:

| Dimensi | Yang harus dicatat |
|---|---|
| **Typography** | Nama font persis, weight, ukuran px/vw, letter-spacing, line-height, pasangan font |
| **Motion effect** | Teknik, durasi (ms), easing (cubic-bezier/nama GSAP), stagger, trigger, scroll-scrub range |
| **Visual effect** | Teknik persis + level hierarki anti-slop (shader? blend mode? mask? displacement?) |
| **Color** | Hex background, hex accent, blend mode, rasio dominan/sekunder/aksen |
| **Feels** | Apa yang dirasakan user, dan **elemen mana** yang menghasilkan rasa itu |

Aturannya: kalau ada yang ditulis "smooth", "premium", "bagus" tanpa angka atau nama teknik
di sebelahnya — analisis itu belum selesai.

### 4. Kutip Billy verbatim

Field `verdict` diisi kata-kata Billy sendiri tentang situs itu. Jangan diparafrase —
kutipan mentah adalah sinyal taste paling akurat yang dimiliki sistem ini.

### 5. Re-index

Jalankan `node docs/awwwards/scripts/taste-index.mjs` dari root repo, lalu pastikan
entri baru muncul di `references/library/INDEX.md`.

---

