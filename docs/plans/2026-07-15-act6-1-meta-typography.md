# ACT VI.1 — Meta reposition + Tagline typography craft

**Feedback user**: (1) meta harus di BAWAH seperti referensi yakushev (overlay
di atas kaki nama): sosial bawah-tengah, kiri-bawah pilih SATU (kota+jam),
kanan-bawah bukan menu (hamburger sudah ada) → CTA "OPEN TO WORK ↗";
(2) tagline "A Frontend Architect" = jelek/mentah/AI-slop — set ulang dengan
craft penuh (font, tracking, kerning, line-height, typescale, color, grid).

## Meta row (pindah ke garis bawah viewport, Z DI DEPAN masthead)

Posisi: `bottom: clamp(1.25rem, 2.6vh, 2rem)`, tiga blok pada satu baseline,
z-index di atas content (teks kecil overlay pada kaki nama raksasa — persis
referensi). Warna chrome 62%, Switzer 500, 0.625rem, tracking 0.28em, caps.

| Posisi | Isi |
|---|---|
| Kiri (left: pad) | `BANDUNG — HH:MM:SS GMT+7` (clock existing; "AVAILABLE" DIHAPUS dari kiri) |
| Tengah (center) | `GITHUB / LINKEDIN / INSTAGRAM` — separator `/` chrome 30%, gap 0.75em, link hover: warna → cream (transisi 0.3s expo.out) |
| Kanan (right: pad) | `OPEN TO WORK ↗` — CTA link ke #contact; dot pulse biru existing di depannya; hover: cream + ↗ translate(2px,-2px) expo.out |

Rationale UX (catat di laporan): menu kanan-bawah = duplikasi hamburger →
redundansi; CTA availability = fungsi nyata di zona akhir alur baca.
Meta row lama di atas ink masthead + var --hero-ink-top DIHAPUS.

## Tagline — set ulang presisi (struktur referensi yakushev)

Konten (satu kalimat mengalir, 2 baris, break disengaja):
baris 1: `A Frontend Architect crafting interfaces`
baris 2: `that move millions of people.`

Spesifikasi (WAJIB angka persis):
- Frasa `A Frontend Architect` → PP Editorial New Italic 400,
  font-size 1.14em relatif baris, letter-spacing -0.005em,
  posisi baseline diselaraskan: `vertical-align: baseline` + line-height 0
  span trick TIDAK — cukup sizing em + padding-right 0.08em sebelum kata
  berikut (ruang optik italic→roman)
- Sisa kalimat → Satoshi 400 (BUKAN Switzer — kalimat butuh warmth body face),
  letter-spacing 0.012em
- Ukuran dasar: clamp(1.0625rem, 0.9rem + 0.8vw, 1.3125rem); line-height 1.32
- Two-tone per-frasa (persis pola referensi): `A Frontend Architect` cream 92% ·
  `crafting interfaces` cream 78% · `that move millions of people.` chrome 50%
- font-feature-settings: 'kern' 1, 'liga' 1 pada kedua font
- Container: max-width 38ch, center, top: clamp(4.5rem, 11vh, 7rem)
- text-wrap: balance sebagai guard; break manual via <br> tetap ada

## Gates
typecheck + CI lint pass · console bersih · verifikasi live: meta baseline
sejajar (satu garis), overlay terbaca di atas kaki nama, tagline align optik
italic/roman (screenshot zoom), clock berdetak, CTA hover bekerja.
