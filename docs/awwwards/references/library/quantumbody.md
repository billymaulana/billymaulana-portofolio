---
type: reference
slug: quantumbody
title: "Quantum Body (quantumbody.io)"
source_url: https://www.quantumbody.io/
captured: 2026-07-25
category: [product, editorial]
style: [editorial, cinematic, minimalism]
fonts: [Neue Haas Display]
grid: Container 20px gutter (konten 1405px di viewport 1425px); display flush-left ke gutter, gambar bleed lewat tepi; baris asimetris 3-kolom (image bleed kiri / kolom angka 356px / portrait bleed kanan); pillars = tabel editorial 2-kolom 356px + 1069px dengan hairline rules; education = split 50/50 panel warna + media
grid_type: [editorial, asymmetric, edge-anchored, split-panel]
motion: [smooth-scroll, hover-shuffle, text-reveal, ambient-float]
libraries: [lenis, lottie, webflow, jquery]
mood: [austere, serene, premium]
verdict: "saya suka typography di text A New Dimension of Wellness, color dan typography setnya bagus dan grid juga bagus, typography di section berikutnya juga bagus dari letter spacing, line-height, text-color dan font pairing 'Quantum Body offers an evolved approach to wellness, rooted in the power of consciousness to shape reality.', saya suka object svg [sacred geometry] ininya juga, saya juga suka object brutalist seperti ini [earth.svg], dan di section ini fourth-section typography grid nya juga bagus saya suka, section ini juga grid dan typographynya bagus id=pillars, object lottie ininya juga bagus saya suka class=lottie-animation-2"
influence: new
thumb: assets/quantumbody-desktop.png
summary: "Situs brand wellness (Webflow, by Denys Verholomchuk) — Neue Haas Display 400 SATU famili di 8 ukuran, palet hangat muted cream #FFEBC4 / bone #D7D1C3 / paper #FFFDF5 / warm-black #201914 / forest #2D3622, grid editorial flush-gutter dengan objek line-art sacred-geometry (Lottie) sebagai aksen; Billy suka typography, color set, grid, dan objek SVG/Lottie-nya."
typography:
  primary: "Neue Haas Display 'Neuehaasdisplay Roman' weight 400 — SATU famili untuk seluruh halaman, 8 ukuran: 14/16/20/30/40/60/90/120px"
  masthead: "h1 hero 120px / line-height 102px (0.85) / letter-spacing -3px (-0.025em) / sentence case / #FFEBC4; mobile 390x844@3x: 50px / lh 45px (0.90) / ls -1px"
  secondary: "h2 section 90px / lh 76.5px (0.85) / ls -3px; statement h4 60px / lh 60px (1.0) / ls -1px center; list item 40px / lh 40px / ls normal"
  label: "eyebrow + nav 16px / lh 18.08-24px / uppercase / tanpa tracking tambahan"
  traits: [single-family, regular-weight-400, tight-leading-0.85, negative-tracking, size-contrast-hierarchy, sentence-case-display]
color:
  bg: "#201914"
  mode: dark
  accent: ["#FFEBC4", "#D7D1C3", "#FFFDF5", "#2D3622", "#000000"]
---

## Apa yang Menarik
Situs brand wellness yang menahan diri hampir total: SATU famili (Neue Haas Display Roman 400), SATU bobot, dan palet lima warna hangat yang semuanya low-saturation. Kekuatannya bukan dari efek melainkan dari rasio — line-height dikunci per tier (display 0.85, statement 1.0, body 1.3) dan tracking negatif -3px hanya di ukuran >=90px, -1px di 60px, normal di <=40px. Hero: 'A New Dimension / of Wellness' 120px cream #FFEBC4 flush ke gutter 20px di atas video shoreline aerial full-bleed, dengan kartu meditasi glass dan baris intro 20px di baseline bawah. Section beralternasi ground: warm-black #201914 -> bone #D7D1C3 -> paper #FFFDF5 -> forest #2D3622 -> paper -> bone, jadi tiap section punya identitas tanpa mengganti sistem tipografi. Objek line-art sacred-geometry (Lottie, stroke 1px #FFEBC3, tanpa fill) dipakai sebagai aksen struktural: flower-of-life 6 lingkaran + hexagram 180x181px di kolom kanan about, dan wireframe torus 259x202px di panel education. Yang paling kuat secara konsep: glyph earth.svg dan eye.svg 50x50 di-typeset INLINE di dalam kalimat 60px sebagai pengganti kata — 'There is more to this (globe) world' / 'Than meets the (eye) eye'.

## Teknik yang Diidentifikasi
Stack: Webflow + jQuery 3.5.1 + Lenis (smooth scroll) + Lottie (data-animation-type=lottie, data-loop=1) + Webflow IX2 untuk interaksi. Tidak ada WebGL/canvas sama sekali (canvasCount 0) — seluruh efek murni DOM/CSS/SVG. Teknik bernama: (1) masked line-roll hover — wrapper .h3-header overflow:clip tinggi 60px berisi dua baris identik 60px, hover menggeser translateY(-60px); TERVERIFIKASI lewat dispatch pointer event, bukan inferensi. Pola duplikat yang sama dipakai di label tombol ('MORE ABOUT' x2, 'READ MORE' x2). (2) Inline SVG glyph-as-word — img 50x50 di-align di dalam flow teks 60px. (3) Circular image cutout — foto mata dan kaleidoskop di-mask lingkaran melayang di atas background bleed. (4) Editorial index table — baris 76px, hairline rule antar baris, kolom 'Pillar' 356px + 'North Stars' 1069px, plus preview image 198x300 di x1202. (5) Full-bleed background video Webflow di hero. (6) Outline button 1px solid #FFEBC4 radius 10px. Aset Lottie: Circles 1.json dan sphere.json dari CDN Webflow.

## Timing & Feel
Yang TERAMATI: hover pada baris pillars menghasilkan translateY(-60px) pada .h3-header dalam mask 60px (diverifikasi dengan pointer event + delay 700ms). Yang ATRIBUTNYA teramati tapi playback-nya tidak difilmkan: dua Lottie dengan data-loop=1 (loop ambient, durasi tidak dideklarasikan di atribut). Yang INFERRED: smooth scroll Lenis (library termuat, lenis.js ada di network), scroll-reveal Webflow IX2 (Webflow.require tersedia, elemen punya transition), dan autoplay video hero (elemen video 1425x660 ada di #hero, frame bergerak terlihat antar screenshot). Capture dilakukan pada state statis per posisi scroll — tidak ada scroll-scrub/pin yang terdeteksi.

## Kenapa Terasa Premium
1) Restraint sebagai strategi: satu famili + satu bobot memaksa hierarki lahir dari ukuran, case, dan ruang — bukan dari bobot tebal. Hasilnya tenang tapi tidak lemah. 2) Rasio leading yang konsisten (0.85 / 1.0 / 1.3) membuat setiap blok teks terasa disetel, bukan default. 3) Palet hangat lima warna tanpa satupun saturated: cream, bone, paper, warm-black, forest — kesan mahal datang dari suhu warna, bukan kontras. 4) Objek line-art 1px stroke tanpa fill memberi presisi instrumen ilmiah yang mendukung narasi 'science meets consciousness'. 5) Glyph inline di dalam kalimat adalah keputusan editorial berani yang tidak bisa dihasilkan template. 6) Negative space besar di kanan headline #fourth-section dibiarkan kosong — percaya diri, tidak diisi.

## Tension dengan Hard Constraint (perlu keputusan Billy)

Referensi ini disukai Billy, tetapi lima poinnya bertabrakan langsung dengan aturan tertulis di
`personal-taste-profile.md` / `CLAUDE.md`. Dicatat apa adanya — bukan untuk dibela, melainkan untuk
diputuskan apakah constraint-nya yang perlu direvisi.

| Constraint tertulis | Yang sebenarnya dilakukan quantumbody.io |
| --- | --- |
| `BANNED: single font family` | SATU famili saja (Neue Haas Display Roman) untuk 100% halaman — justru ini yang dipuji Billy sebagai "font pairing" |
| `Weight: Bold → Extra Bold` | Seluruh situs weight **400 Roman**; nol penggunaan bold |
| `Vibrant > muted. Saturated > pastel. Always.` | Palet lima warna semuanya low-saturation hangat (cream/bone/paper/warm-black/forest) |
| `BANNED: white backgrounds` | 7 dari 12 section ber-ground terang (`#FFFDF5` paper, `#D7D1C3` bone) |
| `BANNED: green on dark bg` | `#2D3622` forest dipakai sebagai **ground penuh** section (education, research), bukan aksen di atas gelap |
| `letter-spacing -4px at 100px` | Di sini lebih ringan: **-3px at 120px**, -1px at 60px, normal di ≤40px |

Yang membuat Billy suka **bukan** hal-hal yang di-BAN itu, melainkan sistem rasio di baliknya:
line-height terkunci per tier (0.85 display / 1.0 statement / 1.3 body) dan tracking negatif yang
diterapkan **berdasarkan ambang ukuran**, bukan disamaratakan. Hierarki lahir dari ukuran + case +
ruang, bukan dari bobot. Itu yang layak diambil, terlepas dari apakah constraint-nya direvisi.

## Responsif — diukur ulang di 390x844@3x (2026-07-26)

Pengukuran mobile pertama keliru: diambil di viewport ~500px (batas minimum lebar window Chrome),
bukan 390px. Diukur ulang lewat CDP device emulation (`isMobile: true`, `hasTouch: true`, DPR 3).

| Elemen | Desktop 1440 | Mobile 390 | Rasio leading |
| --- | --- | --- | --- |
| h1 hero | 120px / lh 102px / ls -3px | **50px / lh 45px / ls -1px** | 0.85 → 0.90 |
| h2 section | 90px / lh 76.5px / ls -3px | **40px / lh 34px / ls -2px** | 0.85 → 0.85 |
| Statement h4 | 60px / lh 60px / ls -1px | **28px / lh 28px / ls normal** | 1.0 → 1.0 |
| Body | 16px / lh 20.8px | 16px / lh 18.08px | 1.3 → 1.13 |
| Nav | 16px uppercase | 30px (menu overlay) | — |

Temuan yang MEMPERKUAT klaim "tracking berbasis ambang ukuran": saat ukuran mengecil, tracking ikut
mengendur secara proporsional — h1 `-3px → -1px`, h2 `-3px → -2px`, statement `-1px → normal`.
Jadi tracking bukan properti font, melainkan fungsi dari ukuran render. Ini justru bukti lebih kuat
daripada pengukuran desktop saja.

Catatan lain: **video hero berganti klip di mobile** — desktop memakai shoreline aerial, mobile
memakai footage siluet sosok manusia. Bukan crop dari klip yang sama.

## Section-by-Section

### 1. Hero — A New Dimension of Wellness (`assets/quantumbody-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Full-bleed background video shoreline aerial 1425x660; logo Quantum Body kiri-atas + nav 6 item (ABOUT/EDUCATION/MEDITATIONS/RESEARCH/APP) tengah + CONTACT kanan; h1 dua baris flush ke gutter kiri 20px; baseline bawah dibagi hairline jadi dua zona: kartu carousel 'Meditations' kiri (thumb 4 slide + tombol prev/next + ORDER) dan 'Introduction' kanan |
| Typography | Neue Haas Display Roman 400 — h1 120px / lh 102px (rasio 0.85) / ls -3px / sentence case; intro 20px / lh 22.6px (1.13); nav + eyebrow 16px uppercase / lh 18.08px; mobile 390x844@3x: h1 turun ke 50px / lh 45px (0.90) dan tracking IKUT mengendur -3px -> -1px |
| Motion | Background video autoplay loop (elemen video teramati, playback inferred dari perbedaan frame antar screenshot); carousel meditasi 4 slide dengan dot + arrow (kontrol teramati, transisi tidak difilmkan); smooth scroll Lenis (inferred, lenis.js termuat) |
| Color | Video shoreline coklat-ochre + buih putih sebagai ground; teks cream #FFEBC4 100% tanpa blend mode (mix-blend-mode: normal) — kontras dijaga oleh gelapnya footage, bukan overlay; kartu carousel semi-transparan warm-grey |
| Konsep | 'Dimensi baru' dibuka dengan citra batas — garis pantai tempat air bertemu daratan; tipografi setenang mungkin agar footage yang bergerak |
| Teknik | Webflow w-background-video full-bleed; h1 flush-gutter dengan leading 0.85 sehingga dua baris mengunci jadi satu blok optis; hairline divider 1px memisahkan zona baseline; carousel Webflow slider |

### 2. About / Step Into a New Paradigm (`assets/quantumbody-about-qb.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Section 1063px tinggi di ground warm-black; eyebrow 'STEP INTO A NEW PARADIGM' dengan glyph asterisk (✷) sliding sticky di baris nav; statement 5 baris CENTER-aligned memakai ~65% lebar; di bawahnya baris 2-kolom asimetris — foto perempuan 355x379 di x358 (kiri-tengah, bukan tepi) dan kolom kanan x733 berisi paragraf 240px + objek Lottie sacred-geometry 180x181 |
| Typography | Statement h4 60px / lh 60px (rasio 1.0 — persis solid) / ls -1px / center / #FFEBC4; eyebrow 16px / lh 24px / uppercase; body 16px / lh 20.8px (1.3) dengan measure sempit 240px (~34 karakter per baris) |
| Motion | Eyebrow bergerak sticky ke area nav saat scroll (teramati sebagai state overlap di screenshot); Lottie Circles 1.json data-loop=1 (atribut teramati, playback tidak difilmkan); reveal Webflow IX2 (inferred) |
| Color | Ground warm-black #201914 (bukan hitam murni — hangat, R>G>B); seluruh teks cream #FFEBC4 dalam satu nilai, hierarki dibangun oleh ukuran bukan opacity; stroke Lottie #FFEBC3 1px tanpa fill |
| Konsep | Pernyataan tesis brand — 'consciousness shapes reality'; digeser ke center agar terbaca sebagai deklarasi, kontras dengan hero yang flush-kiri |
| Teknik | Lottie sacred-geometry (flower-of-life 6 lingkaran + hexagram 2 segitiga, stroke 1px tanpa fill) sebagai aksen struktural di kolom teks — objek yang Billy kutip; measure sempit disengaja agar paragraf jadi blok tegak, bukan pita lebar. Frame detail objek: assets/quantumbody-about-qb-objects.png |

### 3. There Is More Than Meets the Eye (`assets/quantumbody-there-is-more.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Blok full-bleed 660px tanpa id; satu gambar lebar membentang dari delta sungai aerial (biru/ochre) ke nebula kosmik (gelap/bintang); copy dipecah dua sisi — 'There is more / to this (globe) world' di kiri, 'Than meets / the (eye) eye' di kanan, dengan 'AND YOU' kecil uppercase di tengah; dua potongan foto lingkaran (mata asli, kaleidoskop hijau) melayang di sumbu tengah |
| Typography | Headline 60px / lh 60px (1.0) / ls -1px / #FFEBC4 dua baris per sisi; 'AND YOU' 16px uppercase; glyph SVG 50x50 di-set INLINE sejajar baseline di dalam baris 60px |
| Motion | Tidak ada motion yang terverifikasi pada blok ini; parallax antara foto lingkaran dan background besar kemungkinan ada tapi TIDAK diamati (inferred, tidak diklaim) |
| Color | Background bentang tunggal: biru tinta + ochre keemasan (delta) melebur ke coklat-gelap berbintang (nebula); teks cream #FFEBC4; cutout kaleidoskop hijau lime jadi satu-satunya titik saturasi tinggi di seluruh halaman |
| Konsep | Bumi dan kosmos disambung dalam satu bidang — 'dunia' dan 'mata' dipisah kiri-kanan supaya pembaca menyeberangi gambar untuk menyelesaikan kalimat; 'AND YOU' menempatkan user di tengah |
| Teknik | Inline SVG glyph-as-word (earth.svg + eye.svg 50x50 line-art, keduanya objek yang Billy kutip) — ikon menggantikan kata di dalam flow teks, bukan ditempel sebagai dekorasi; circular mask image cutout melayang; split-copy across full-bleed image |

### 4. Mind Over Matter — Energy in Motion (#fourth-section) (`assets/quantumbody-fourth-section.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Inversi ground ke bone terang, tinggi 693px; h2 dua baris flush kiri x20 selebar 1405px dengan negative space besar dibiarkan kosong di kanan; di bawahnya baris 3-kolom asimetris — image makro 215x251 bleed lewat tepi kiri, kolom teks dengan penanda angka 01/02 rata-kanan di x376 sebagai gutter tipis, dan portrait glitch 455x580 bleed lewat tepi kanan; tombol '+ MORE ABOUT' outline di kiri bawah |
| Typography | h2 90px / lh 76.5px (rasio 0.85) / ls -3px / hitam #000000; penanda angka 16px / lh 18.08px rata-kanan; body 16px / lh 20.8px (1.3) measure ~470px; kontras terbesar halaman: 90px vs 16px = rasio 5.6x dalam famili dan bobot yang sama |
| Motion | Reveal saat masuk viewport (inferred, Webflow IX2); label tombol punya duplikat teks 'MORE ABOUT' x2 = siap untuk masked line-roll hover (struktur teramati, hover pada tombol ini tidak diuji) |
| Color | Ground bone hangat #D7D1C3, teks hitam murni #000000 — pembalikan penuh dari section gelap sebelumnya; warna hanya masuk lewat dua foto (makro prisma ungu/hijau dan portrait glitch RGB oranye/biru) |
| Konsep | Pergantian dari 'dunia batin' gelap ke penjelasan metodologis terang — grid jadi lebih rasional, angka 01/02 memberi struktur argumen |
| Teknik | Mega headline flush-gutter dengan negative space asimetris; numbered editorial list dengan angka di gutter rata-kanan; dua gambar sengaja bleed keluar tepi kiri dan kanan sehingga baris terasa lebih lebar dari container |

### 5. Pillars — Believe It, Then You'll See It (#pillars) (`assets/quantumbody-pillars.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Ground paper #FFFDF5, tinggi 997px; h2 flush kiri x20; jarak kosong ~250px sebelum tabel; tabel indeks 6 baris (tinggi 76px per baris) dengan header kolom 'Pillar' (x0, lebar 356px) dan 'North Stars' (x356, lebar 1069px), dipisah hairline rule antar baris; slot preview image 198x300 di x1202 muncul saat hover |
| Typography | h2 90px / lh 76.5px (0.85) / ls -3px hitam; header kolom 16px / lh 18.08px abu; nomor dan judul pilar keduanya 40px / lh 40px / ls normal — sengaja TANPA tracking negatif karena di bawah ambang 90px |
| Motion | TERVERIFIKASI: hover pada baris menggeser .h3-header sebesar translateY(-60px) di dalam wrapper overflow:clip setinggi 60px, menukar baris atas dengan duplikatnya (diuji dengan dispatch pointerover/mouseenter + tunggu 700ms, transform berubah dari matrix(1,0,0,1,0,0) ke matrix(1,0,0,1,0,-60)) |
| Color | Paper hangat #FFFDF5 (bukan putih murni — sedikit kuning), teks hitam #000000, header kolom abu; hairline rule tipis abu muda; nol aksen warna sampai preview image muncul |
| Konsep | Enam pilar disajikan sebagai indeks/daftar isi, bukan kartu — menolak pola grid 3-kolom dan memilih bahasa buku |
| Teknik | Masked line-roll hover (dua baris identik 60px di dalam mask overflow:clip 60px); editorial index table dengan hairline rules; hover-linked image preview 198x300 di kolom kanan |

### 6. Education (`assets/quantumbody-education.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Split 50/50 tepat: panel kiri 713x660 solid forest green, panel kanan media liquid marbled; di panel kiri — h2 'Education' flush atas x20, objek Lottie wireframe torus 259x202 di x227 (tengah optis), lalu 'Awakened Wisdom' + paragraf 314px dan tombol '+ READ MORE' outline di baseline bawah; panel kanan berisi cutout mata lingkaran di atas tekstur cair kuning-hijau |
| Typography | h2 90px / lh 76.5px (0.85) / ls -3px / cream #FFEBC4; label 'Awakened Wisdom' dan body keduanya 16px / lh 20.8px (1.3) — dibedakan hanya oleh jarak, bukan ukuran atau bobot |
| Motion | Lottie sphere.json data-loop=1 (atribut loop teramati; rotasi wireframe tidak difilmkan — hanya frame statis yang tertangkap); reveal masuk viewport inferred |
| Color | Panel kiri forest green pekat #2D3622 dengan teks cream #FFEBC4 (kontras hangat, bukan hitam-putih); panel kanan tekstur cair kuning-olive tersaturasi — satu-satunya section dengan dua suhu warna berdampingan |
| Konsep | Pengetahuan digambarkan sebagai struktur (torus wireframe presisi) yang berdampingan dengan materi cair yang belum terbentuk — sisi kiri tertata, sisi kanan mengalir |
| Teknik | Lottie wireframe torus (cincin elips bertumpuk, stroke 1px cream tanpa fill) — objek .lottie-animation-2 yang Billy kutip; split-panel 50/50 warna solid vs media; outline button 1px solid #FFEBC4 radius 10px |

