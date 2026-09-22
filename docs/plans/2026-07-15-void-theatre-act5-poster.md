# VOID THEATRE — ACT V: "POSTER" (clone hero chdartmaker.com)

**Mandat user**: "tiru saja hero ini: https://www.chdartmaker.com". Clone
struktur & tipografinya, adaptasi konten Billy. Screenshot referensi sudah
diambil live 2026-07-15 (poster B&W: video industrial fullscreen + masthead
condensed satu baris edge-to-edge + nav di bawah masthead + 3 blok meta kaki).

## Anatomi referensi → adaptasi

| chdartmaker | Clone Billy |
|---|---|
| Video B&W industrial fullscreen | Fluid simulation fullscreen sebagai media latar hidup: idle = ambient wisps lambat monokrom-indigo gelap (emitSplat interval ~4s, dye redup keabu-abuan); interaksi = ink identity palette (mekanisme existing) |
| "CHDARTMAKER" 1 baris condensed putih solid, edge-to-edge margin-ke-margin, menempati ~sepertiga atas | "BILLYMAULANA" (TANPA spasi, 12 huruf) Bebas Neue 400, putih #F2EFEA, fit-to-width margin-ke-margin (pakai fit-to-width existing), baseline ~32% viewport, tracking -0.01em |
| Nav links horizontal DI BAWAH masthead kiri | Meta row di bawah masthead kiri: WORK · ABOUT · CONTACT (anchor #work #about #contact, Switzer 500 caps 0.75rem tracking 0.18em) — kanan: status dot + AVAILABLE FOR SELECT WORK |
| Kiri-bawah: deskripsi studio 2 baris + arrow link | FRONTEND ARCHITECT & CREATIVE DEVELOPER (2 baris, Switzer) + EXPLORE ↘ |
| Tengah-bawah: SCROLLER | SCROLL (existing hint, tanpa garis panjang) |
| Kanan-bawah: klien + link | PLN MOBILE, FLEXBEN, UNESCO IHP + VIEW WORK ↘ (Switzer, 2 baris) |
| Monokrom total | Void #060610 + cream; chroma HANYA dari fluid saat interaksi |

## Teknis
- Font: tambah @fontsource/bebas-neue (400) via main.css (pnpm via corepack
  pnpm@10.17.1). Masthead pakai Bebas Neue; fallback 'Anton', Impact.
- Masthead tetap lewat useTextDistortion (1 line, xAlign left, fit-to-width
  target = width − 2·pad, yFrac ≈ 0.32) + overlay DOM crossfade existing +
  font race guard existing (fonts.load + fonts.ready refresh).
- Fluid: init TANPA skipInitialSplats? TIDAK — tetap skip; tambahkan ambient
  timer emitSplat lambat (4±1s, posisi acak, dy kecil) dengan dye SANGAT redup
  via warna gray-indigo: gunakan hue existing tapi kalikan 0.35 saat ambient
  (parameter baru emitSplat(x,y,dx,dy,brightness?)). Interaksi pointer tetap
  cerah seperti sekarang.
- Meta lama yang DIHAPUS: index 01—05 + rule, koordinat+clock kanan-bawah,
  PORTFOLIO—2026/V.3, rotator scramble (statusnya jadi statis AVAILABLE FOR
  SELECT WORK + dot pulse tetap). Clock & rotator API di useHeroStage boleh
  tinggal (dipakai lagi nanti) tapi tak dipanggil hero.
- Grain overlay existing tetap. Entrance: masthead per-char rise+blur dari
  bawah (y 40→0, blur 12→0, stagger 0.018, power4.out), lalu nav row, lalu
  meta kaki stagger. Semua easing sesuai aturan.
- prefers-reduced-motion: masthead DOM statis + meta tampil, tanpa fluid.

## Gates
typecheck + lint pass · console bersih · masthead edge-to-edge presisi di
1440/2560 · idle hidup (ambient wisps + dot pulse) · fluid interaktif tetap.
