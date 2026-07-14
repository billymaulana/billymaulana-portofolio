# VOID THEATRE — ACT II.1: Refinement Pass

**Tanggal**: 2026-07-14 · **Basis**: feedback user atas ACT II — layout DISUKAI
(pertahankan), empat hal DITOLAK: (1) orb 3D bentuk tidak jelas + kualitas
akhir jelek, (2) tipografi role line jelek, (3) motion berat & tersentak-sentak,
(4) border frame kaku & bertabrakan dengan konten.

## 1. Orb: ganti 3D mesh → soft gradient orb (shader 2D)

Referensi: kaitonote.com — orb-nya adalah GRADIENT LEMBUT, bukan mesh 3D.
Buang pemakaian `useIridescentBlob` dari hero (file JANGAN dihapus/diubah).
Composable baru `useGradientOrb.ts`: fragment shader satu quad —

- 3 gaussian color spot: cyan #a1e0e7 · electric blue #0047FF · violet #4A2A80,
  drift orbit lissajous lambat (uTime), sigma bervariasi
- Mask radial smoothstep → tepi larut ke void, TIDAK PERNAH ada siluet keras
- uScale (breathing ±3%, periode 6s) modulasi radius mask
- uEnergy (kick velocity pointer, clamped, decay) → brightness + kecepatan drift naik halus
- Dither hash ±1/255 wajib (anti-banding pada gradien gelap = kualitas premium)
- Canvas 42vmin @ 58%/50% (posisi sama), `mix-blend-mode: screen`, DPR cap 1.5
- GLSL kompak (~35 baris), 60fps trivial

## 2. Tipografi meta (akar masalah: JetBrains Mono tidak pernah di-load)

`--font-system: 'JetBrains Mono'` TIDAK punya @font-face → semua meta render
di fallback monospace sistem. Fix:

- Tambah dependency `@fontsource/jetbrains-mono` (400, 500), import di main.css
  → clock, index 01/HERO, status rotator, PORTFOLIO — 2026 kini mono asli
- Role line redesign (kiri-atas):
  - `FRONTEND ARCHITECT` → Switzer 600 (satu keluarga dengan nama = kohesi),
    0.6875rem, tracking 0.22em, uppercase, cream 90%
  - `& creative developer` → PP Editorial New Italic 1.25rem, cream 60%,
    letter-spacing 0.005em — voice line dengan kehadiran nyata, bukan catatan kaki

## 3. Performa (akar "berat & tersentak")

- `SIM_RESOLUTION` 256 → 128 (kembalikan; CURL 30 & SPLAT_RADIUS 0.18 tetap)
- Hapus Three.js render loop dari hero (icosahedron detail 128 ≈ 163k tris/frame)
- `useHeroStage.onPointerMove`: JANGAN `getBoundingClientRect` per event —
  cache rect, refresh hanya saat resize (layout thrash = jank)
- Orb shader canvas: DPR cap 1.5

## 4. Frame hairline: HAPUS TOTAL

Template + CSS + beat entrance-nya. Tidak diganti apapun — void tanpa bingkai.

## Yang TIDAK berubah

Layout counter-position, nama + distortion + crossfade, fluid params visual
(dye ×4.5, dissipation 0.9, hue lock), meta grid selain role line, clock,
rotator, entrance beats lain (geser waktu bekas beat frame ke rotator/index).

## Quality gates

`pnpm typecheck && pnpm lint` pass · console bersih · 60fps saat mouse aktif
(tidak ada long task > 50ms beruntun) · orb tanpa banding terlihat · meta
terbaca sebagai mono asli (bukan Courier fallback)
