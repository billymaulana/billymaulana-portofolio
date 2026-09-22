---
type: failure
slug: hero-ambient-plume
date: 2026-08-02
route: /explore/hero
concept: Ambient emitter — tiga sumber splat sinusoidal menyalakan fluida termal tanpa input user
verdict: "saya tidak suka bentuk shader yang muncul di awal seperti itu karna jelek, hapus saja defaultnya jangan langsung muncul"
severity: iterate
style_attempted: [liquid, cinematic, experimental]
fonts_used: [Bebas Neue]
technique_level: 5
screenshot: assets/2026-08-02-hero-ambient-plume-desktop.png
rule_added: Efek prosedural DILARANG menyala sendiri sebagai dekorasi idle.
---

## 1. Kutipan verbatim

> "perbaiki /explore/hero, saya tidak suka bentuk shader yang muncul di awal seperti itu karna
> jelek, hapus saja defaultnya jangan langsung muncul"

## 2. Apa yang dibangun

`ThermalBody.vue` memanggil `startAmbientEmitters()` di dalam `onMounted`, tanpa syarat apa pun.
Tiga emitter menembakkan splat ke solver Navier-Stokes setiap **160ms** (`setInterval`), masing-masing
dengan radius **0,55** dan dorongan vertikal **dy = 110**:

| Emitter | x(t) | y(t) | phase |
|---|---|---|---|
| 1 | `0.50 + 0.42·sin(t·0.083)` | `-0.02 + 0.04·sin(t·0.131)` | 0.0 |
| 2 | `0.50 + 0.38·sin(t·0.061 + 2.1)` | `0.01 + 0.05·sin(t·0.097 + 1.3)` | 2.1 |
| 3 | `0.50 + 0.30·sin(t·0.113 + 4.2)` | `-0.03 + 0.04·sin(t·0.071 + 3.7)` | 4.2 |

Dorongan horizontal `dx = 85·cos(t·0.19 + phase)`. Karena `y` mendekati 0 dan sumbu Y WebGL
terbalik terhadap CSS, ketiganya menyemprot dari **tepi bawah viewport ke atas**.
Canvas di-fade dari `opacity 0` ke `1` pada t = 1,35s dalam timeline intro, jadi gumpalan itu
justru dimunculkan tepat saat masthead selesai terbaca.

`skipInitialSplats: true` sudah aktif, jadi random splat bawaan port Pavel Dobryakov bukan
penyebabnya. Yang ditolak Billy adalah emitter buatan sendiri di atasnya.

## 3. Diagnosis jujur

Terukur dari screenshot 2880×1320 (1440×900 @2× DPR) pada t = 2,2s, **tanpa satu pun gerakan kursor**:

| Yang diukur | Nilai |
|---|---|
| Piksel berwarna (sat > 0,22) | 272.128 px = **7,16% viewport** |
| Bounding box gumpalan | 2065 × 651 px = **71,7% lebar viewport** |
| Puncak gumpalan | y = 669 → menembus sampai **50,7% tinggi layar** |
| Pita hue dengan area ≥ 1% | **9 pita** |
| Pita hue di 220–240° (biru identitas `#0047FF` = 223°) | **0 pita ≥ 1%** |

Baris adjective decoder (`references/editorial/03-art-direction.md` §7C) yang gagal:

1. **"Terasa mahal / premium" (a) — rentang nilai warna sempit, ≤ 5 warna.** Terukur **9 pita hue**
   membentang 0–60° (merah–kuning) dan 240–360° (biru–violet–magenta). Konfigurasi menulis
   `color: '#0047FF'`, tetapi `displayMode: 'thermal'` memetakan intensitas ke colormap
   violet→oranye dan mengabaikan nilai itu sepenuhnya. Hue dominan justru **20–40° (26,6%)** —
   oranye, kebalikan dari palet identitas.
2. **"AI slop" (e) — efek sebagai overlay, bukan konten.** Gumpalan tidak disebabkan oleh apa pun.
   Ia tidak menjawab kursor, tidak menandai apa pun di halaman, dan tidak berubah karena keputusan
   user. Yang tersisa adalah dekorasi yang bergerak sendiri di atas nama Billy.
3. **"Tidak harmoni" (c) — suhu warna campur tanpa sistem.** Ground `#050507` netral-dingin,
   masthead putih, gumpalan hangat 20–40°. Tiga suhu tanpa aturan yang mengikat ketiganya.

Sebab strukturalnya sama dengan rule 2026-07-27 di `anti-slop-rules.md`: **bentuk medan adalah
konsekuensi dari sumbernya.** Sumber di sini adalah tiga titik sinusoidal dengan frekuensi yang
dipilih agar "tidak berulang" (0,083 / 0,061 / 0,113). Tidak ada satu pun angka itu yang berasal
dari halaman — bukan dari letak teks, bukan dari kursor, bukan dari scroll. Maka bentuk yang
dihasilkan tidak bisa tidak arbitrer, dan menyetel radius atau kecepatannya tidak akan
memperbaikinya. Yang salah bukan parameternya, melainkan keberadaan emitternya.

Kesalahan proses: gumpalan ini melintasi masthead — huruf "U", "L", "A" pada BILLYMAULANA tertutup —
dan itu lolos karena verifikasi sebelumnya menguji *interaksi* (gerakkan kursor, lihat jejaknya),
bukan *keadaan diam*. Halaman tidak pernah dilihat dalam kondisi yang paling sering dialami
pengunjung: tiga detik pertama, kursor belum bergerak.

## 4. Tes yang gagal

- **OBJECT** — gagal. Gumpalan tidak merepresentasikan objek apa pun; ia buih tanpa rujukan.
- **EMPTY** — gagal. Hapus seluruh teks, dan bentuk medannya tetap tidak masuk akal: tiga plume
  naik dari bawah tanpa sebab.
- **WOW** — gagal. Efeknya menutupi tipografi alih-alih memperkuatnya.
- OBJECT/EMPTY di atas mengulang pola #19 dan rule 2026-07-27: bentuk ditentukan sumber.

## 5. Sinyal taste yang didapat

Ini sinyal baru dan spesifik: **Billy menilai keadaan diam sebagai bagian dari desain.** Sampai
sekarang penolakan selalu tentang tipografi, font, atau kualitas render. Ini yang pertama tentang
*apa yang terjadi ketika user belum melakukan apa-apa*.

Turunannya: shader di project ini bukan wallpaper. Ia alat respons. Nilai "premium" yang dicari
Billy datang dari efek yang **muncul karena user**, bukan efek yang sudah ada sebelum user datang.
Ini konsisten dengan `hero-daspritam-mouse-effect.md` (fluida sebagai displacement tak terlihat
yang hanya hidup di bawah kursor) — arah yang sama, dan ambient emitter melawannya.

## 6. Rule baru

> Efek prosedural (fluida, medan, partikel, shader) DILARANG menyala sendiri sebagai dekorasi idle.
> Keadaan awal halaman wajib diverifikasi dengan screenshot pada t≈2–3s **tanpa menggerakkan kursor**.
