# Hero Foundation Audit — Grid, Typography, Spacing

**Tanggal**: 2026-07-16 · **Metode**: pengukuran computed-style live @1440×722 (`--hero-pad: 57.6px`) + pembanding live kota.co.uk & chdartmaker.com (sumber layout poster yang di-lock)

## Pembanding

| | kota.co.uk | chdartmaker.com | Hero kita |
|---|---|---|---|
| Display lh | 1.0 persis | ~1.0 | 1.0 ✓ |
| Alignment sekunder | Swiss asimetris | SEMUA left + counter kanan, nol centering | tagline CENTERED |
| Margin konten | ~7.4% | flush tepi | pad 4vw ✓ konsisten |
| Font families | 1 (Montreal) | 1 condensed + 1 sans | 3–4 (Bebas/Switzer/Cormorant + **Satoshi di nav**) |

## Temuan

### F1 — Tracking masthead 4× kurang rapat dari mandat
`letter-spacing: -0.01em` (−3.07px @306px). Mandat taste: "−4px @100px" = **−0.04em**. Fit-to-width akan mengkompensasi: teks makin rapat → fontSize naik → glyph makin monumental (sesuai "if it doesn't feel too big, it's not big enough").
**Fix**: `NAME_TRACKING_EM: -0.01 → -0.04` di `SectionHero.vue` (raster & DOM ikut otomatis).

### F2 — Tagline centered menyalahi DNA Swiss-left
Tagline center (x=R=420.6, `text-align: center; margin-inline: auto`). Taste: "Alignment: Left/Swiss"; chdartmaker: nol elemen centered. Socials row juga centered (presisi, tapi ikut prinsip sama).
**Fix (butuh keputusan)**: tagline flush-left ke `--hero-pad`, `text-align: left`, max-width tetap 38ch → tension diagonal dengan CTA kanan-bawah. Socials center bisa dipertahankan (irama meta 3-kolom kiri/tengah/kanan adalah grid sendiri) atau ikut kiri.

### F3 — Zona bawah sesak: descender masthead menabrak meta row
Baseline 0.925×722=668; pita glyph sampai ~715 (elemen overflow −7.2px di bawah viewport); meta di y=692–702 → tumpang tindih dengan ink. Jarak efektif baseline→meta 24px vs grid unit 57.6px — ritme bawah pecah.
**Fix (opsi)**: (A) `NAME_Y_FRAC 0.925 → 0.90` — clearance meta ~1 grid unit, overflow hilang; (B) pertahankan overlap sebagai statement poster (meta z6 di atas ink, kontras via difference) — verifikasi keterbacaan dulu.

### F4 — Satoshi menyusup di navigation
Burger/nav memakai `Satoshi` — di luar pairing resmi (Bebas Neue + Switzer + Cormorant). Konfirmasi: disengaja (sisa WIP nav) atau samakan ke Switzer?

### F5 — monoB/M meleset 12px dari grid kiri/kanan (perlu verifikasi visible)
Terukur x=45.6 vs pad 57.6 — persis offset `x:±12` milik initial-state tween entrance. Kemungkinan artefak tab-hidden (timeline beku). Verifikasi dengan tab visible; jika nyata = bug entrance.

### F6 — Yang sudah kokoh (jangan disentuh)
Meta row flush pad kiri+kanan presisi ✓ · socials center matematis (720.05 vs 720) ✓ · burger flush pad ✓ · masthead lh 1.0 ✓ · tagline ls −0.02em & lh 1.3 ✓ · hierarki skala 306:27 ≈ 11:1 ✓ · pad tunggal `--hero-pad` dipakai konsisten nav+meta+masthead ✓

## Hasil iterasi 1 (2026-07-16, keputusan user)

- F1 ✓ `NAME_TRACKING_EM -0.01 → -0.04` — fontSize fit-to-width naik 306.6 → 331.8px
- F2 ✓ keputusan user: **A — centered dipertahankan** (preview A/B ditunjukkan)
- F3 ✓ `NAME_Y_FRAC 0.925 → 0.90` — descender bersih dari meta row
- F4 ✓ `--font-interface: Satoshi → Switzer` (main.css) — satu sistem font
- F5 ✓ terverifikasi ARTEFAK tween beku saat tab hidden (rAF suspend) — bukan bug layout
- F7 (baru, laporan user) ✓ `NAME_OVERSHOOT_RIGHT_FRAC 0.005 → 0` — ujung "A" terkunci di garis grid kanan; verifikasi zoom: burger/M/A/CTA satu garis ±2px

## Urutan eksekusi yang diusulkan
1. F1 (tracking) — mekanis, dampak besar, tanpa risiko komposisi
2. F3 opsi A (baseline 0.90) — bereskan ritme bawah
3. F2 (tagline left) — perubahan komposisi, preview dulu → approval
4. F4/F5 — konfirmasi & verifikasi
Setiap langkah: screenshot → review → lanjut. Iterasi sampai grid terkunci.
