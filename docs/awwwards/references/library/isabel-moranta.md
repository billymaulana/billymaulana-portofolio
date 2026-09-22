---
type: reference
slug: isabel-moranta
title: "Isabel Moranta"
source_url: https://www.isabelmoranta.com/
captured: 2026-07-26
category: [portfolio]
style: [editorial, cinematic, minimalism, kinetic-type]
fonts: [Ogg, CentSchbook Mono BT]
grid: Gutter 20px kiri/kanan (konten 1385px di vw 1440). Hero: blok mono 260x63px persis di pusat viewport (x 583-843, y 418-481), sisanya kosong total. Statement: type 237.76px full-width 1385px, per-huruf jadi node (A=160px, L=135px, E=138px, X=153px, T=147px). Work: 3 kolom asimetris 428px judul (x=50) / 193px body (x=631) / 425px media (x=980), dipisah hairline horizontal 1px #848484 selebar 1385px + rule vertikal 1px tinggi 150px sebagai bracket kiri. Archive: modular 8 kolom x 129px, gap 50px, tinggi sel natural 80-161px (top-aligned). Footer: 3 zona edge-anchored x=20 / center 626-799 / flush kanan 1405.
grid_type: [editorial, asymmetric, edge-anchored, modular]
motion: [text-reveal, scroll-scrub, cursor-driven, page-transition]
libraries: [gsap, scrolltrigger, lenis, ogl, barba, webgl, wordpress]
mood: [austere, mystic, premium]
influence: new
thumb: assets/isabel-moranta-desktop.png
summary: "Portfolio art director dengan ground #080808 nyaris kosong: hero cuma blok mono 12px seukuran 260x63px di pusat void bergrain, karya disembunyikan di balik smoke WebGL (OGL) yang hanya terungkap saat kursor bergerak; lalu meledak jadi Ogg 237.76px (leading 0.758, tracking -0.04em) mengutip Virginia Woolf. Rasio display:body 19.8x. Huruf pada label sengaja dihapus (DESIGN -> 'D S GN')."
typography:
  primary: "Ogg (Sharp Type) weight 400 — display 237.756px / line-height 180.219px (0.758) / letter-spacing -9.51px (-0.04em); nama project 82.5px / 75.075px (0.91) / -2.475px (-0.03em); h2 24px / 28.8px"
  label: "CentSchbook Mono BT weight 300, 12px / 14.4px (1.2), uppercase, tracking normal (mobile 13px / 15.6px) — dipakai untuk SELURUH teks non-display: nav, meta, body paragraf, footer"
  traits: [didone-display, letter-dropout, bracket-labels, extreme-scale-jump-19.8x, locked-leading-per-tier]
color:
  bg: "#080808"
  mode: dark
  accent: ["#efefee", "#848484"]
---

## Apa yang Menarik
Ini portfolio yang menolak memamerkan diri, dan justru itu yang membuatnya terasa mahal. Hero-nya adalah viewport 1440x900 hitam #080808 bergrain dengan SATU blok teks mono 12px seukuran 260x63px di titik pusat — 98% layar sengaja kosong. Karya (video reel) ada di balik kegelapan itu, tapi hanya terungkap sebagai bayangan luminance rendah ketika kursor digerakkan menembus lapisan smoke WebGL. Label-nya pun tidak utuh: 'DESIGN' ditulis 'D S GN', 'DIRECTOR' jadi 'DR CT R', 'SCROLL' berputar acak jadi 'IOPUFZ' lalu 'LH PLR LSW L'. Informasi ditahan sebagai strategi. Lalu tepat setelah hero, halaman meledak jadi Ogg 237.756px yang memenuhi 1385px lebar — lompatan skala 19.8x dari 12px ke 237.76px dalam satu scroll. Dua ekstrem itu (nyaris tidak ada, lalu terlalu besar) adalah keseluruhan sistem desainnya.

## Teknik yang Diidentifikasi
Stack diverifikasi dari bundle main_55a7e7e8.js (WordPress custom theme, CDN bunny.net): GSAP (108 hit) + ScrollTrigger (32) + Flip (25) + Lenis (40) + OGL (53) + Barba (18) untuk page transition. Tidak ada Three.js. Canvas WebGL 1440x900 di `.bg-plane` menjalankan smoke/dye simulation yang berfungsi sebagai MASK, bukan dekorasi — video di baliknya cuma terbaca sampai ~#3a3a3a. Teks display di-split per-huruf jadi node terpisah (terverifikasi: setiap huruf punya bounding box sendiri, 'A' 160x180px) lalu di-scrub ScrollTrigger sehingga huruf memudar putih -> abu progresif dalam satu baris. Hairline #848484 setebal 1px dipakai sebagai satu-satunya elemen struktural di halaman Work — plus rule vertikal 150px sebagai bracket kiri baris project. Grain overlay full-viewport konstan di semua halaman.

## Timing & Feel
Teramati langsung: (1) cursor-driven smoke — dye menumpuk mengikuti trail kursor dan meluruh perlahan, terverifikasi dengan tiga hover CDP berurutan yang meninggalkan jejak makin tebal; (2) scramble label — '( SCROLL )' menampilkan tiga string acak berbeda dalam tiga sampel berjarak beberapa detik, jadi ini loop terus-menerus, bukan sekali jalan; (3) scroll-scrub statement — pada scrollY 1300 baris 'ARE ALLIED' menampilkan gradien terang->abu di tengah kata, artinya progress dipetakan per-huruf, bukan per-baris. BELUM diukur: durasi/easing spesifik, carousel credits 8 slide (counter '( 1 / 8 )' terlihat tapi mekanik maju-nya tidak diverifikasi), dan transisi Barba antar halaman.

## Kenapa Terasa Premium
1) Menahan informasi: hero tidak menjual apa pun, dan kesediaan mengosongkan 98% layar membaca sebagai kepercayaan diri, bukan kekosongan. 2) Disiplin satu-warna: seluruh situs monokrom #080808/#efefee, satu-satunya warna datang dari karya itu sendiri (thumbnail 166x93px, total ~1.5% area viewport) — jadi warna selalu berarti 'ini karya'. 3) Rasio tipografi ekstrem 19.8x dengan leading dikunci per tier (0.758 display / 1.2 mono) — bukan sekadar 'font besar', tapi sistem dua tier yang tidak pernah berpapasan di tengah. 4) Ogg (Didone kontras tinggi berlisensi) melawan mono lebar tetap = ketegangan mewah vs teknis. 5) Blur berat pada portrait About sampai wajah tidak dikenali — potret yang menolak jadi potret. 6) Halaman Archive yang penuh warna berfungsi sebagai pelepasan tekanan setelah lima layar hampir kosong.

## Section-by-Section

### 1. Hero — The Void (`assets/isabel-moranta-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Blok teks mono 260x63px persis di pusat viewport (x 583-843, y 418-481) — 3 baris; nav flush kiri x=20 dan kanan berakhir 1405; label '( SCROLL )' flush bawah tengah. Sisanya kosong total |
| Typography | CentSchbook Mono BT 12px / 14.4px (1.2), weight 300, uppercase, tracking normal, ink #efefee. Huruf sengaja dihapus: 'D S GN' / 'DR CT R' / 'P R ... TF L'; hanya label kurung yang utuh: '( ART DIRECTOR )' '( CANADA )' '( 2026 )' |
| Motion | Cursor-driven (teramati): smoke/dye WebGL menumpuk mengikuti trail kursor dan mengungkap video portrait di baliknya. Scramble loop pada '( SCROLL )' — tiga sampel menghasilkan 'S CR L' / 'IOPUFZ' / 'LH PLR LSW L' |
| Color | Ground #080808 + grain overlay full-viewport; ink #efefee; video yang terungkap puncaknya hanya ~#3a3a3a — nyaris tidak terbaca |
| Konsep | Portfolio yang menolak memamerkan: informasi ditahan, huruf dihapus, karya disembunyikan. Penonton harus menggosok layar untuk melihat apa pun |
| Teknik | OGL smoke/dye simulation sebagai MASK (canvas 1440x900 di `.bg-plane`), bukan dekorasi + grain overlay + per-char scramble + letter dropout |

### 2. Statement — All Extremes Of Feeling (`assets/isabel-moranta-statement.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Type memenuhi 1385px (gutter 20px), 4 baris + 'WITH MADNESS'; baris 8 thumbnail video 166x93px (gap 40px) menyisip di tengah blok type; tombol '( PLAY SHOWREEL )' tepat di pusat baris thumbnail. Section setinggi 1457px |
| Typography | Ogg 400, 237.756px / line-height 180.219px (0.758) / letter-spacing -9.51px (-0.04em), per-huruf jadi node terpisah. Kontras vs mono 12px = 19.8x |
| Motion | Scroll-scrub (teramati): huruf memudar #efefee -> ~#8a8a8a progresif DI DALAM satu baris ('ARE ALLIED' terang di kiri, abu di kanan), jadi progress dipetakan per-huruf |
| Color | Monokrom; satu-satunya warna datang dari 8 thumbnail karya (merah, pink, oranye) — total ~1.5% area viewport |
| Konsep | Kutipan Virginia Woolf (Orlando, 1928) jadi arsitektur halaman. Karya diperkecil jadi thumbnail mungil di bawah kalimat raksasa — pesan mendahului portofolio |
| Teknik | Per-char split + ScrollTrigger scrub warna, autoplay muted video 166x93px, leading 0.758 mengunci baris agar saling menghimpit |

### 3. Credits Carousel + Footer (`assets/isabel-moranta-credits-footer.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Video portrait 240x290px di pusat; meta 3 baris flush kiri x=20 ('PROJECT' / 'HERVE BAILLARGEON WITH LOCOMOTIVE'); counter '( 1 / 8 )' flush kanan 1405. Footer 3 zona edge-anchored: SOCIALS x=20 / REACH OUT center / DEVELOPMENT flush kanan |
| Typography | CentSchbook Mono BT 12px / 14.4px uppercase untuk seluruh zona; sistem label kurung '( SOCIALS )' '( REACH OUT )' '( DEVELOPMENT )' |
| Motion | Carousel 8 slide — counter '( 1 / 8 )' terbaca, tapi mekanik maju (auto/drag/scroll) TIDAK diverifikasi (inferred) |
| Color | Video monokrom blur di ground #080808; ink #efefee, meta sekunder #848484 |
| Konsep | Kredit kolaborator ditempatkan setara dengan karya — nama developer (Yannis Yannakopoulos) dapat kolom sendiri di footer |
| Teknik | Bracket-label system, flush edge anchoring 3 zona, video portrait rasio 4:5 sebagai satu-satunya massa visual |

### 4. Work Index (`assets/isabel-moranta-work-index.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Header halaman = blok mono terpusat (pola sama seperti hero). Tiap baris project: 3 kolom asimetris — judul x=50 w=428 / deskripsi x=631 w=193 / media x=980 w=425. Meta-row di atas hairline: inisial + kategori kiri, tag x=345, 'LIVE SITE' flush kanan 1405. Halaman 7380px, 16 project |
| Typography | Ogg 400 82.5px / 75.075px (0.91) / -2.475px (-0.03em) untuk nama project; body CentSchbook Mono BT 12px / 14.4px dalam kolom 193px (~24 karakter per baris). Rasio 6.9x |
| Motion | Media reveal saat scroll — inferred, tidak diukur |
| Color | Monokrom; warna hanya masuk lewat still karya (interior mobil, food shot) yang sudah gelap secara natural |
| Konsep | Index majalah, bukan galeri kartu: nama besar - deskripsi kecil - satu still. Tidak ada thumbnail seragam, tidak ada hover-zoom card |
| Teknik | Hairline 1px #848484 selebar 1385px + rule vertikal 1px tinggi 150px sebagai bracket kiri; kolom asimetris 428/193/425 dengan gutter 153px dan 156px |

### 5. About (`assets/isabel-moranta-about.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Portrait 285x380px (rasio 3:4) tepat di pusat viewport; satu baris label mono di atasnya; sisa layar kosong. Halaman total 6127px |
| Typography | CentSchbook Mono BT 12px / 14.4px uppercase — pola label hero diulang ('D S GN ( ART DIRECTOR ) DR CT R'), teks naratif baru muncul jauh di bawah lipatan |
| Motion | Scroll narrative panjang (6127px) — inferred; '( SCROLL )' scramble sama seperti hero (teramati) |
| Color | Portrait grayscale dengan gaussian blur berat, luminance puncak ~#c8c8c8 di ground #080808 |
| Konsep | Potret diri yang di-blur sampai wajah tidak dikenali — hadir tapi menolak dibaca. Konsisten dengan hero yang menahan informasi |
| Teknik | Heavy gaussian blur + grayscale + grain, tanpa border/frame, ukuran portrait sengaja kecil (285px di viewport 1440px) |

### 6. Archive (`assets/isabel-moranta-archive.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Grid modular 8 kolom x 129px, gap 50px, tinggi sel natural 80-161px (top-aligned, tidak di-crop seragam). 45 item, halaman 1599px. Label '( ARTWORKS )' terpusat di atas grid |
| Typography | Hanya nav + satu label mono 12px — nol tipografi display |
| Motion | Hover reveal per-tile — inferred, tidak diverifikasi |
| Color | SATU-SATUNYA halaman berwarna penuh: poster merah, biru kobalt, oranye, pink di atas ground #080808 yang sama |
| Konsep | Moodboard mentah dinaikkan jadi halaman setara Work — referensi visual diakui sebagai bagian dari praktik, bukan disembunyikan |
| Teknik | Grid modular rapat dengan tinggi natural (bukan aspect-ratio seragam), kontras maksimum terhadap lima layar sebelumnya yang hampir kosong |

