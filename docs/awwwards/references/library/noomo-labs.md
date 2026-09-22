---
type: reference
slug: noomo-labs
title: "Noomo Labs (labs.noomoagency.com)"
source_url: https://labs.noomoagency.com/
captured: 2026-07-26
category: [agency, experimental]
style: [3d-immersive, glass, experimental]
fonts: [DrukMedium, IBM Plex Mono]
grid: Hero satu layar 1440x660 tanpa kolom: bola kaca terpusat di sumbu optis (diameter ~660px = penuh tinggi viewport) menindih wordmark full-bleed yang di-render DI DALAM scene 3D; sisanya edge-anchored — logo kiri-atas, nav bracket kanan-atas, rail label AR/3D/AI/XR di x9 dengan jarak vertikal 92px, counter progress di x1376, tombol hold + progress bar 1152px di baseline bawah
grid_type: [centered, full-bleed, edge-anchored]
motion: [intro-choreography, ambient-float, page-transition]
libraries: [three, nuxt3, webgl, swiper]
mood: [playful, luxurious, surreal]
verdict: "saya suka glass yang membentuk effect disco dan motion ketika interactionnya di hero. ini saya hanya suka motion/visual effectnya saja"
influence: strengthen
thumb: assets/noomo-labs-desktop.png
summary: "HANYA MOTION/VISUAL EFFECT yang diambil (permintaan eksplisit Billy). Bola kaca faceted ala disco ball dari MeshTransmissionMaterial (thickness 5, backsideThickness 1.5, chromaticAberration 0.05, color #e392fe) yang membiaskan wordmark raksasa di dalam scene 3D — tiap facet jadi cermin yang memotong huruf. Typography, grid, dan palet situs ini TIDAK diendorse."
typography:
  primary: "DrukMedium weight 500 — condensed display berat; dipakai di scene-text 48px (ls 0.978px, lh 44.64px), kontak 108px (ls -2.3px), dan label hero 34px"
  label: "IBM Plex Mono weight 400/500 — seluruh UI/label: nav bracket 13px (ls 0.39px), rail AR/3D/AI/XR 11px (ls 0.33px), counter 9px"
  traits: [condensed-display, mono-label, bracket-notation, uppercase]
color:
  bg: "#B4CBF5"
  mode: light
  accent: ["#E392FE", "#D357FE", "#F7FAFF", "#000000"]
---

## Apa yang Menarik
CATATAN LINGKUP: Billy menyatakan eksplisit 'ini saya hanya suka motion/visual effectnya saja'. Yang direkam sebagai referensi HANYA efek kaca + motion hero. Typography, grid, dan palet situs ini tidak diendorse dan tidak boleh dipakai sebagai justifikasi keputusan desain. Efeknya sendiri: sebuah bola kaca faceted seukuran tinggi viewport (~660px) menggantung di tengah layar, tersusun dari puluhan panel kaca persegi yang masing-masing membiaskan dan memantulkan apa pun di belakangnya. Di belakangnya ada wordmark 'NOOMO LABS' hitam raksasa — dan karena wordmark itu di-render DI DALAM scene 3D (bukan teks DOM), tiap facet memotong hurufnya jadi pecahan hitam yang bergeser saat bola berputar. Itulah 'efek disco' yang dimaksud: bukan bola cermin yang memantulkan cahaya, melainkan bola kaca yang mencacah TIPOGRAFI jadi kepingan. Di dalam bola ada ubur-ubur ungu (#d357fe) yang ikut terbias berlapis lewat kaca depan dan belakang, memberi kedalaman yang tidak bisa dipalsukan dengan gambar datar. Tepi tiap panel memperlihatkan pecah warna merah/cyan tipis dari chromatic aberration.

## Teknik yang Diidentifikasi
Stack: Nuxt (`_nuxt/iNjJ8EkR.js`, `__NUXT_DATA__`) + three.js vanilla + WebGL2 + Swiper. Bukan React — tidak ada jejak R3F/Next. Situs MENGEKSPOS panel debug lil-gui di DOM (tersembunyi, `display:none`), dan dari situ parameter material kacanya terbaca persis, bukan ditebak. GLASS MATERIAL 1 (shell luar): backside true, thickness 5, backsideThickness 1.5, reflectivity 0.04, roughness 0, anisotropy 0, chromaticAberration 0.05, distortion 0, temporalDistortion 0, anisotropicBlur 0.1, attenuationColor #ffffff, color #e392fe, attenuationDistance Infinity. GLASS MATERIAL 2 (lapis dalam): thickness 1.3, reflectivity 0.25, roughness 0.001, anisotropy 0.16, chromaticAberration 0.01, anisotropicBlur 0, attenuationColor #ffffff, color #ffffff, attenuationDistance 2, opacity 1. CONTROLS: Orbit Control false, Jelly Color out #d357fe, Jelly Opacity out 1. Nama parameter (`backside`, `backsideThickness`, `temporalDistortion`, `anisotropicBlur`, `attenuationColor/Distance`) adalah API `MeshTransmissionMaterial` milik @react-three/drei — karena situs ini vanilla three.js, kemungkinan besar material itu di-port ke vanilla, bukan dipakai lewat drei. Konsekuensi arsitektural: transmission material membiaskan dengan menyampling backside buffer scene, jadi apa pun yang ingin terbias WAJIB jadi objek di scene — itu sebabnya wordmark tidak ada di DOM. Performa: DPR canvas di-cap 1.5 (buffer 2160 pada lebar CSS 1440), bukan 2 — wajar karena transmission me-render scene berkali-kali per frame. Ground = CSS bukan canvas: `<html>` memakai tiga linear-gradient bertumpuk (`rgb(180,203,245)`→`rgb(247,250,255)` dan `rgb(150,187,255)`→`rgb(237,244,255)`), plus dot-grid `transitionDots.png` background-size 8% dan `footerPatern.png` 5%.

## Timing & Feel
TERAMATI: bola berotasi ambient tanpa input — dua screenshot pada waktu berbeda menunjukkan panel dan tentakel ubur-ubur bergeser. Gate masuk 'IMMERSE [START] ME IN' dengan toggle audio (dimatikan sebelum capture) lalu transisi ke hero — urutan ini teramati. TIDAK TERVERIFIKASI (jangan diklaim): mekanik CLICK AND HOLD. Elemen `.progress-bar` ada dengan width 0 di dalam `.progress` selebar 1152px tinggi 13px, jadi secara struktur jelas hold mengisi bar itu; tetapi situs menolak event sintetis (`isTrusted:false`) — pointerdown yang ditahan, dispatch ke window/document/canvas, maupun WheelEvent tidak menggerakkan progress bar sedikit pun. Durasi hold, easing, dan apa yang terjadi di akhir hold TIDAK diketahui. Scroll juga terkunci di balik hold: kontainer 10330px bergerak via transform dan `window.scrollY` tetap 0, sehingga section di bawah hero TIDAK bisa di-sweep. Ini keterbatasan capture, bukan temuan tentang situsnya.

## Kenapa Terasa Premium
1) Efeknya mahal karena BENAR secara fisika, bukan karena ditumpuk-tumpuk: satu material transmission dengan refraksi dua sisi (backside true) menghasilkan pembiasan berlapis yang tidak bisa ditiru overlay CSS. 2) Kacanya diberi tugas naratif — membiaskan nama brand sendiri, sehingga efek dan identitas jadi satu benda, bukan dekorasi di sebelah logo. 3) chromaticAberration 0.05 cukup untuk terlihat di tepi facet tapi tidak sampai norak. 4) roughness 0 + reflectivity 0.04 = kaca optis bening, bukan frosted — kesan instrumen presisi. 5) Ubur-ubur di dalam memberi gerak organik lambat yang kontras dengan geometri facet yang kaku. 6) Ground periwinkle terang justru membuat kaca terbaca; kalau backgroundnya hitam, refraksinya hilang.

## Lingkup — HANYA Motion/Visual Effect

> Billy verbatim: **"ini saya hanya suka motion/visual effectnya saja"**

| Diambil | TIDAK diambil |
| --- | --- |
| Bola kaca faceted + refraksi dua sisi | Typography (DrukMedium / IBM Plex Mono) |
| Pembiasan tipografi dari dalam scene 3D | Grid & komposisi hero |
| Chromatic aberration di tepi facet | Palet periwinkle terang / light mode |
| Objek organik (ubur-ubur) di dalam kaca | Copy, nav bracket, tone brand |

Note ini **bukan** preseden untuk light mode, bukan preseden tipografi, dan bukan izin memakai
ground terang. Kalau nanti dipakai sebagai rujukan build, yang boleh dikutip hanya baris kolom kiri.

## Relevansi ke Portfolio Billy

Memperkuat preferensi yang sudah ada — Glass/Prism/Crystal materials dan refraction shaders
(bandingkan [[latchezarboyadjiev]] glass/sculptural dan [[hashgraphvc]] kristal cair).

Yang **baru** dan layak diambil: gagasan objek kaca yang membiaskan **tipografi** dari dalam scene 3D,
bukan membiaskan gambar atau environment. Konsekuensi teknisnya penting — `MeshTransmissionMaterial`
membiaskan dengan menyampling *backside buffer* scene, jadi apa pun yang ingin terbias **wajib** jadi
objek di dalam scene. Teks DOM di belakang canvas tidak akan pernah terbias.

Analog untuk portfolio Billy: masthead Bebas Neue "BILLYMAULANA" ikut dimasukkan ke scene sebagai
objek supaya bisa dibiaskan kaca — bukan ditaruh sebagai teks DOM di belakang canvas.

## Section-by-Section

### 1. Hero — Glass Disco Sphere (idle) (`assets/noomo-labs-desktop.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Satu layar 1440x660. Bola kaca faceted terpusat, diameter ~660px (setinggi viewport penuh), menindih wordmark 'NOOMO LABS' full-bleed yang di-render di dalam scene 3D. Edge-anchored di sekelilingnya: logo 'noomo Labs' kiri-atas, nav [WORK] [NOOMO AGENCY] [CONTACT] kanan-atas, toggle audio kiri-bawah, tombol jellyfish kanan-bawah, tombol hold di pusat bola |
| Typography | Wordmark raksasa = objek scene 3D (TIDAK ada di DOM, itulah sebabnya bisa terbias). Label DOM: 'ARE YOU READY TO STEP INTO THE FUTURE?' dan 'CLICK AND HOLD' DrukMedium 500 34px; nav IBM Plex Mono 13px ls 0.39px dengan notasi bracket; rail AR/3D/AI/XR IBM Plex Mono 11px ls 0.33px |
| Motion | Rotasi ambient bola + gerak tentakel ubur-ubur — TERAMATI dari perbedaan dua frame tanpa input. Masuk lewat gate 'IMMERSE [START] ME IN' (teramati). Scroll terkunci sampai hold selesai |
| Color | Ground gradient CSS periwinkle #B4CBF5 → #F7FAFF (tiga linear-gradient bertumpuk) + dot-grid PNG 8%; kaca bening dengan tint #E392FE; ubur-ubur #D357FE; wordmark hitam #000000; fringe merah/cyan di tepi facet dari chromaticAberration 0.05 |
| Konsep | Bola kaca bukan hiasan — dia lensa yang mencacah nama brand jadi kepingan. 'Step into the future' diwujudkan sebagai benda yang harus ditembus untuk melihat identitasnya |
| Teknik | MeshTransmissionMaterial (API drei, di-port ke three.js vanilla): backside true, thickness 5, backsideThickness 1.5, reflectivity 0.04, roughness 0, chromaticAberration 0.05, anisotropicBlur 0.1, color #e392fe, attenuationDistance Infinity. Lapis kedua: thickness 1.3, reflectivity 0.25, roughness 0.001, anisotropy 0.16, chromaticAberration 0.01, attenuationDistance 2. WebGL2, DPR di-cap 1.5. Parameter dibaca langsung dari panel lil-gui yang tertinggal di DOM |

### 2. Hero — state saat interaksi Click & Hold (`assets/noomo-labs-hold-interaction.png`)

| Aspek | Detail |
| --- | --- |
| Layout | Komposisi sama; bola sudah berotasi sehingga potongan huruf yang terbias bergeser posisi. Tombol 'CLICK AND HOLD' bulat ~114px di pusat, progress bar 1152x13px di baseline bawah |
| Typography | Label tombol 'CLICK AND HOLD' dua baris IBM Plex Mono; copy berubah jadi 'TAP AND HOLD' di viewport sempit — TERAMATI di 500px dan di 390x844@3x; ambang persisnya tidak diuji, yang pasti >=500px |
| Motion | TIDAK TERVERIFIKASI — `.progress-bar` (width 0, induk 1152x13px) secara struktur jelas terisi saat hold, tapi situs menolak event sintetis sehingga durasi, easing, dan hasil akhir hold tidak diketahui. Rotasi bola antar-frame TERAMATI, tapi itu ambient, bukan hasil hold |
| Color | Sama seperti idle; tombol hold putih semi-transparan di atas kaca |
| Konsep | Hold sebagai gerbang — user harus menahan, bukan sekadar klik; menunda akses demi membangun antisipasi sebelum scroll dibuka |
| Teknik | Progress-driven hold gate yang mengunci virtual scroll (kontainer 10330px digerakkan transform, `window.scrollY` tetap 0). Overlay transisi `.transition-component` putih z-index 200 + `transitionDots.png` menandakan page-transition bermotif dot |

