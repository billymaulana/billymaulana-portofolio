# Spec — `/explore/concept/2`, potret sebagai latar hero (2026-11-24)

Menjawab verdict Billy: *"bagaimana jika photo itu sebagai background, dan perbaiki photo saya karna tidak enak di lihat
cuttingnya. dan tidak terlihat menyatu di hero"* dan *"di foto yang di edit saya ingin rambut saya terlihat di background
hitam."*

## 1. Header

Hero satu layar untuk portofolio Billy Maulana. Tata letaknya salinan `/hero/hero-3` (masthead satu baris, nav kecil,
meta di sudut bawah, fluida termal saat pointer bergerak). Yang baru: foto Billy `IMG_6094` utuh, dipetakan ke suhu,
menjadi latar seluruh hero. Rambut naik ke balik nama, wajah panas berada di antara garis dasar nama dan baris footer, bahu
keluar lewat tepi bawah. Stack: Nuxt 4.6 · Vue 3 `<script setup>` · TypeScript strict · GSAP 3.15 · WebGL2 in-house, semuanya
inline di `app/pages/explore/concept/2.vue`.

## 2. Fonts

| Peran | Famili · weight | Sumber | Ukuran · tracking · leading · warna |
|---|---|---|---|
| Masthead `BILLYMAULANA` | Bebas Neue 400 | `@fontsource/bebas-neue/400.css` (di `main.css`) | tinggi tinta 192/1440 lebar viewport; letter-spacing dihitung supaya tinta selebar kontainer; `#FFFFFF` di kanvas, blend `difference` |
| Nav, footer | Satoshi 500 | `/assets/fonts/satoshi/Satoshi-Variable.woff2` | 12 px (11 px ≤ 768) · 0,18em · uppercase · leading 1,7 pada baris footer |
| Nav link, footer link | — | — | `rgba(232,232,236,0.78)` |
| Status, baris footer, scroll | — | — | `rgba(208,208,216,0.62)` |

## 3. Assets

| Konstanta | URL | Status |
|---|---|---|
| `BACKDROP.heatSrc` | `/assets/images/concept-2/backdrop-6094.webp` (2288×2836, peta suhu skala abu, akar kuadrat) | `200`, 310.542 B |
| `BACKDROP.staticSrc` | `/assets/images/concept-2/backdrop-6094-static.webp` (1373×1702, sudah lewat ramp, ground hitam) | `200`, 131.600 B |

Sumber: `bahan/profile/IMG_6094.HEIC` (3024×4032) dengan matte orang, rambut, dan kulit bawaan HEIC. Pipa:
`billy-portfolio-assets/concept-2/r4-bg/bake-bg.sh` → `export.sh`.

Peta suhu T (0–1) per wilayah:

| Wilayah | Rumus |
|---|---|
| Kulit | `0,18·K + 0,80·mix(blur σ 52 / 14 / 3,2 px; bobot 0,34 / 0,36 / 0,30)` dari luminans (level 14–90%, γ 0,85) yang dihaluskan selective-blur σ 8 px / 6%; area mata bobot 0,10 / 0,24 / 0,66; lubang mulut dan mata pada matte kulit ditutup (closing disk 13 px pada lebar 378) |
| Leher | dikali gradien 1 → 0,25 dari y 2330 ke y 3000 (piksel foto) |
| Rambut | `H·(0,06 + 0,11·P) + Hinti·tekstur·(0,17 + 0,13·P)`; tekstur = luminans level 5–72% γ 1,35 + unsharp σ 5 px; `P` = (1 − jarak ke kulit / 896 px)², 0 di luar; `P1` = bentuk linearnya |
| Kaus | `G·(0,07 + 0,07·P1^1,5)`, cetakan kaus tidak dipakai |
| Ambien | `0,025·blur(A, σ 560 px)^1,2`; ruangan foto tidak dipakai, ground tetap hitam |
| Bloom | `0,10·blur(kulit, σ 176 px)` |

Satuan px di tabel ini piksel foto asli; plat diskalakan 0,75×, diberi pad kiri 225 px, dipotong 188 px di atas.
Jangkar plat: sumbu wajah x 1369,1 · garis mata y 1027,4 · satu unit wajah (garis mata → dagu) 589,9 px.

## 4. Lapisan (urut z-index)

| z | Elemen | Kelas | Blend |
|---|---|---|---|
| 0 | `section.chd` | `#060610` + radial `rgba(6,6,16,0.6)` | — |
| 2 | `canvas.chd__backdrop` (hanya reduced-motion / tanpa WebGL) | `absolute inset-0` | `screen` |
| 3 | `canvas.chd__canvas` (fluida + foto) | `absolute inset-0` | `screen` |
| 4 | `.chd__grain` | opacity 0,05 | `overlay` |
| 5 | `.chd__head` (kanvas masthead + nav) | `top/left/right: clamp(15px, 2.08vw, 30px)` | `difference` |
| 6 | `.chd__foot` | `bottom: clamp(32px, 4vh, 48px)` | normal |

## 5. GLSL (cabang termal shader display)

```glsl
float skin = base.r * base.r * uSkinGain;
float inkHeat = heat * mix(1.0, 0.38, smoothstep(0.10, 0.45, skin));
float t = skin + inkHeat * (1.0 - skin);
float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5;
t += grain * 0.009 * smoothstep(0.0, 0.06, skin);
float body = mix(cover, 1.0, clamp(skin * 8.0, 0.0, 1.0));
col = max(thermal(t) - C0, 0.0) * body;
col += grain / 255.0;
```

Ramp `thermal` memakai C0–C10 dengan stop 0 · 0,13 · 0,28 · 0,43 · 0,56 · 0,68 · 0,79 · 0,875 · 0,935 · 0,975 · 1 dan
`smoothstep` di antara stop.

## 6. Algoritma tata letak dan lukis

1. `cap = lebar × 192/1440`; `garisDasarNama = top kanvas masthead + round(cap × 24/192) + cap`.
2. `atasWajah = garisDasarNama + 12`; `unit = min((atasFooter − atasWajah) / 1,72, tinggi × 0,36, lebar × 0,40)`.
3. `ruang = atasFooter − 0,04·unit − atasWajah`; `garisMata = atasWajah + (ruang − 1,68·unit)/2 + 0,68·unit`.
4. `skala = max(unit / 589,9, (tinggi − garisMata) / (2836 − 1027,4))`, sehingga plat tidak pernah berakhir di dalam viewport.
5. Sumbu wajah: `lebar × 0,485` bila label Scroll tampil (leher lewat di kiri label); selain itu
   `lebar/2 + 0,174·unit` (massa rambut di tengah).
6. Kanvas konten: isi `#000` → `drawImage(plat)` → kantong di balik blok teks (bayangan persegi luar-kanvas, pad 20 px,
   blur 48 px, alpha 0,70 untuk nav ber-blend `difference`, 0,58 untuk footer) → huruf masthead dilukis hitam di posisi
   kanvas masthead dengan 9 salinan bergeser 0,75 px, supaya tidak ada suhu di balik huruf.
7. Fluida: `curl 8 · splatRadius 0,3 · splatForce 7200 · displace 0,0007 · chromatic 0,003 · densityDissipation 1,8 ·
   velocityDissipation 1,2 · pressureIterations 20` (hero-3; hanya `displace` 0,001 → 0,0007).

## 7. Motion

| Elemen | Dari → ke | Durasi | Mulai | Easing |
|---|---|---|---|---|
| Kanvas masthead | opacity 0 → 1 | 0,8 s | 0,3 s setelah font siap | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Item nav (4) | autoAlpha 0 → 1 | 0,6 s | 0,5 s + 0,08 s per item | `power3.out` |
| Blok footer (3) | autoAlpha 0 → 1 | 0,6 s | 0,75 s + 0,1 s per blok | `power3.out` |
| Foto | `uSkinGain` 0 → 1 (suhu naik dari ground) | 2 s | 1,5 s | `power3.out` |
| Tinta pertama | `uInkGain` 0 → 1 | 1,2 s | gerak pointer pertama | `power2.out` |

Saat diam tidak ada yang bergerak.

## 8. Teks verbatim

"BILLYMAULANA" · "Work" · "About" · "Contact" · "Available for select work" · "Frontend Architect & Creative Developer" ·
"Explore ↘" · "Scroll" · "PLN Mobile, Flexben, UNESCO IHP" · "View work ↘". Semuanya warisan `/hero/hero-3`.

## 9. Responsif

| Viewport | Unit wajah | Sumbu | Yang berubah |
|---|---|---|---|
| 1920×1080 | 368 px | 0,485 | rambut utuh di dalam frame, puncaknya di balik nama |
| 1600×900 · 1440×900 | 295 · 310 px | 0,485 | sama |
| 1440×780 · 1366×768 | 242 px | 0,485 | sama |
| 1180×820 | 291 px | 0,485 | sama |
| 834×1112 | 334 px (batas lebar) | 0,485 | rambut terpotong tepi kiri |
| 390×844 · 390×664 | 156 px (batas lebar) | 0,5 + 0,174·unit | status, scroll, dan klien disembunyikan; rambut terpotong 50 px di tiap sisi |

## 10. Gotchas

- Jangan memberi suhu di balik huruf masthead: blend `difference` mengubah violet menjadi hijau di dalam huruf.
- Jangan memotong sosok dengan topeng; cacat matte diperbaiki di matte.
- Jangan menambah kabut ambien: ground harus tetap hitam supaya rambut terbaca.
- Plat harus selalu melewati tepi bawah viewport (langkah 4).
- Reduced-motion memakai aset `-static` di kanvas 2D dengan tata letak, kantong, dan knock-out yang sama.

## 11. Yang dilihat

Halaman dibuka hitam, nama muncul, lalu foto Billy menghangat dari ground: mula-mula ungu dingin, kemudian wajah naik ke
oranye dan kuning sementara rambut tetap violet bertekstur helai di atas hitam. Nama berdiri utuh di depan rambut. Saat
pointer bergerak, tinta termal hero-3 mengalir di atas foto, menyeret dan memanaskannya, dan huruf nama terbalik warnanya
hanya di tempat tinta lewat. Setelah pointer berhenti, semuanya kembali diam dalam beberapa detik.
