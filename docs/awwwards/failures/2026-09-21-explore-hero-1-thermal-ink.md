---
type: failure
slug: explore-hero-1-thermal-ink
date: 2026-09-21
route: /explore/hero/hero-1
concept: Thermal ink — ramp termal dipotong ke dalam letterform supaya tidak menutupi masthead
verdict: "jelek pada explore/hero/hero-1 saya ingin plasma seperti ini: /checkpoint/liquid/liquid-2"
severity: iterate
style_attempted: [liquid, cinematic]
fonts_used: [Bebas Neue]
technique_level: 4
screenshot: assets/2026-09-21-explore-hero-1-thermal-ink-desktop.png
rule_added: "Medan termal yang di-clip ke letterform berhenti menjadi plasma — ia menjadi tekstur isi huruf."
---

# Explore Hero 1 — thermal ink

## 1. Kutipan verbatim

> "jelek pada explore/hero/hero-1 saya ingin plasma seperti ini: /checkpoint/liquid/liquid-2"

## 2. Apa yang dibangun

Mode display keempat di `useFluidSimulation` (`uMode 3`, opsi `displayMode: 'thermalInk'`), dipasang
di `/explore/hero/hero-1`. Ramp termal 11-stop yang sama dengan `/checkpoint/liquid/liquid-2`, tetapi
dengan mekanik mode 0: fluida tidak pernah digambar, yang digambar hanya raster masthead yang
digeser medan kecepatan.

Baris yang menentukan:

```glsl
float glyph = max(ink.r, max(ink.g, ink.b));
float cover = smoothstep(0.015, 0.30, heat) * glyph;
vec3  hot   = max(thermal(heat), ink * 0.35);
col = mix(ink, hot, cover);
```

Parameter fluid sama dengan yang disetujui sebelumnya: `velocityDissipation 1.2` · `densityDissipation 1.8` ·
`pressureIterations 20` · `curl 8` · `splatForce 7200` · sub-splat interpolasi aktif.

Urutannya: Billy meminta efek "tidak menutupi teks, seperti hero-2, hanya ketika mengenai teks"
(2026-09-21), lalu "warnanya tetap thermal". `thermalInk` adalah jawaban harfiah atas dua kalimat itu.

## 3. Diagnosis jujur

Gating `cover` dengan `glyph` menjadikan letterform sebagai **clip mask** medan panas. Konsekuensinya
struktural, bukan soal penyetelan: siluet plasma berhenti menjadi milik fluida dan menjadi milik huruf.
Setiap bentuk di layar adalah bentuk huruf.

Diukur dari dua screenshot 2880×1332 pada pola gerak kursor setara:

| Metrik | `/explore/hero/hero-1` (ditolak) | `/checkpoint/liquid/liquid-2` (diminta) | Selisih |
| --- | --- | --- | --- |
| Luas tinta (luma > 40) | 24,87% | 51,17% | **2,1× lebih sedikit** |
| Pita horizontal (dari 10) dengan ≥5% tinta | **4** | **9** | medan tidak mengisi frame |
| Sebaran tinta per pita (atas→bawah) | 1,2 · 1,1 · **0 · 0 · 0** · 22 · 26,3 · 28,3 · 20,2 · 0,9 | 4,7 · 5,6 · 6,3 · 9 · 11,6 · 15,2 · 16,9 · 15 · 10,3 · 5,5 | tiga pita tengah benar-benar kosong |
| Kerapatan tepi di dalam tinta | 6,05% | 0,17% | **35× lebih banyak** |
| p95 deret klip | 86px | 158px | inti terang 1,8× lebih kecil |

Dua angka yang paling menjelaskan kata "jelek":

1. **Tiga pita tengah layar berisi 0% tinta.** Efeknya bukan medan, melainkan satu pita setinggi
   ~40% layar yang menempel di kaki. Tidak ada yang mengisi frame.
2. **Kerapatan tepi 35× lebih tinggi daripada referensi.** Ini kebalikan dari yang saya kira
   menguntungkan: di dalam huruf, plasma terpotong-potong oleh kontur glyph sehingga terbaca sebagai
   **tekstur berisik di dalam huruf**, bukan massa cairan. Plasma yang Billy tunjuk justru punya
   bidang halus besar (0,17% tepi, inti terang p95 158px).

Perlu dicatat: `hue-discipline` gagal di KEDUA rute (18 pita vs 17 pita), dan `identity-hue` lolos di
rute yang ditolak (9,54%) tapi gagal di rute yang diminta (0%). Jadi dua gate itu **tidak** menjelaskan
penolakan ini — menyebutnya sebagai sebab akan menyesatkan iterasi berikutnya.

### Adjective decoder

| Baris decoder | Status | Angka |
| --- | --- | --- |
| "Biasa saja" (b) — tidak ada elemen non-teks yang bisa ditunjuk | **GAGAL** | 100% piksel efek berada di dalam/di tepi glyph; 0% di tiga pita tengah |
| "AI slop" (e) — efek sebagai overlay, bukan konten | lolos | efek justru terikat konten; bukan ini masalahnya |
| "Tidak harmoni" (c) — suhu warna campur tanpa sistem | tidak membedakan | 18 pita hue vs 17 pita di rute yang DIMINTA |
| "Monoton" (c) — teknik visual sama diulang | **GAGAL** | satu-satunya kejadian visual adalah "huruf berubah warna"; tidak ada kejadian kedua |

### Ini pengulangan, bukan temuan baru

`anti-slop-rules.md` sudah memuat rule (2026-07-27):

> **Medan yang sumbernya berbentuk X akan selalu berbentuk X.** ... Referensi thermal Billy
> (`vr-thermal-halftone-fluid`, `vr-plasma-smooth-warp`) semuanya medan full-bleed yang berdiri
> sendiri dengan tipografi duduk DI ATASNYA.

`thermalInk` melanggar rule itu persis, dengan mekanisme yang sedikit berbeda: bukan memakai teks
sebagai **sumber** panas, melainkan sebagai **masker** panas. Hasil visualnya kelas yang sama —
medan berbentuk huruf. Saya membaca rule tersebut ada di file, tetapi tidak mengujinya terhadap
desain yang saya bangun, karena permintaan "jangan menutupi teks" saya terjemahkan langsung menjadi
"potong medannya ke teks" tanpa memeriksa apakah hasil potongannya masih berupa plasma.

Instruksi Billy sebenarnya punya dua bagian yang kompatibel — plasma tetap medan penuh, teks tetap
terbaca di atasnya — dan saya memilih pembacaan yang paling mudah dieksekusi, bukan yang paling
masuk akal secara desain.

## 4. Tes yang gagal

- **OBJECT TEST** — GAGAL. Tidak ada elemen visual non-teks yang bisa ditunjuk; semua yang berwarna
  berbentuk huruf.
- **EMPTY TEST** — GAGAL total, dan secara harfiah: hapus teks → `tMap` kosong → `glyph` = 0 →
  `cover` = 0 → layar hitam. Efek ini tidak punya eksistensi tanpa teks.
- **WOW TEST** — GAGAL. Huruf berubah warna saat disapu adalah interaksi yang sudah umum.
- SWAP TEST — lolos (ganti nama, komposisi berubah), tapi lolosnya tidak berarti karena yang dinilai
  adalah medannya.
- NEIGHBOR TEST — tidak berlaku (rute hero tunggal).

## 5. Sinyal taste yang didapat

"Jangan menutupi teks" **bukan** berarti "kurung efeknya ke dalam teks". Dua hal yang Billy pegang
sekaligus: medan plasma wajib memiliki tubuhnya sendiri yang mengisi frame, dan masthead wajib tetap
terbaca di atasnya. Yang dituntut adalah hubungan **figure/ground** yang dikerjakan — depth, blend,
dan hierarki nilai — bukan pengurangan salah satunya.

Ini juga menegaskan kembali: setiap kali sebuah instruksi bisa dibaca sebagai "kurangi", periksa dulu
apakah ada pembacaan "kerjakan hubungannya". Billy hampir selalu memaksudkan yang kedua.

## 5b. Verdict kedua (2026-09-22) — arah diperjelas

Keadaan yang dinilai masih sama (belum ada perubahan kode sejak verdict pertama), jadi ini bukan
iterasi baru yang gagal melainkan penegasan arah:

> "jelek, warnanya saya ingin percis ini: /checkpoint/liquid/liquid-2 perbaiki pages:
> /explore/hero/hero-1 dan text effectnya agar terlihat seperti plasma."

Dua syarat yang sekarang eksplisit dan sebelumnya hanya saya duga:

1. **Warna wajib identik** dengan `/checkpoint/liquid/liquid-2` — bukan "ramp yang sama dipakai
   dengan cara lain". Ramp-nya memang sudah sama; yang berbeda adalah distribusinya, dan itu
   terbaca sebagai warna yang berbeda.
2. **Teks bukan objek yang dilindungi dari plasma, melainkan bagian dari plasma.** "Text effectnya
   agar terlihat seperti plasma" menutup pembacaan figure/ground yang saya tawarkan (teks putih
   duduk di atas medan). Masthead harus terbaca sebagai materi terpanas di dalam medan itu.

Artinya kedua opsi yang saya tawarkan setelah verdict pertama sama-sama salah sasaran: keduanya
memperlakukan teks sebagai lapisan terpisah dari medan.

## 5c. Verdict ketiga (2026-09-22) — kontur ditolak sebagai kartun

Iterasi `plasmaText` + kontur (rim gelap di luar glyph, digerbangi `fluidHeat`) ditolak:

> "saya tidak suka text effectnya karna terlihat style kartun, saya ingin seperti terbakar plasma
> dan text tidak diam saja jika terkena efek liquid saya ingin ada interaction yang stunning. dan
> saya tidak suka warna abu saat liquid mengenai, saya ingin kontras seperti terbakar melting plasma
> ... dan saya ingin pollish liquid thermal agar lebih detail jika tidak mengenai text."

Dua cacat yang bisa ditunjuk pada mekanismenya sendiri, bukan pada angkanya:

1. **Kontur seragam = bahasa visual ilustrasi, bukan material.** `rim` dihitung dari dilasi raster,
   jadi tebalnya sama di seluruh keliling huruf tanpa memandang arah aliran. Garis luar berketebalan
   konstan adalah ciri khas sticker/kartun; material yang terbakar tidak punya outline, ia punya
   tepi yang menyala lalu menghitam.
2. **`col *= 1.0 - uRimDepth * rim` menghasilkan abu.** Perkalian menurunkan ketiga kanal secara
   proporsional, sehingga cream `#FFFCE4` di bawah kontur menjadi abu kekuningan — warna yang tidak
   ada di ramp termal. Setiap penggelapan WAJIB lewat `mix()` menuju stop terdingin ramp (`C0`),
   bukan lewat perkalian, supaya hasilnya tetap di dalam palet.

Sinyal taste tambahan: yang diminta bukan "teks yang dilindungi dari plasma", melainkan **teks yang
ikut terbakar** — kontras datang dari nyala, bukan dari garis pemisah.

## 6. Rule baru

> **(2026-09-21) Medan prosedural yang di-clip ke letterform berhenti menjadi medan.** Memakai teks
> sebagai masker (`cover *= glyph`) adalah bentuk lain dari memakai teks sebagai sumber, dan gagal
> pada kelas yang sama: siluetnya menjadi siluet huruf. Terukur di `/explore/hero/hero-1` vs
> `/checkpoint/liquid/liquid-2` — luas tinta 24,87% vs 51,17%, pita horizontal terisi **4 dari 10 vs
> 9 dari 10** (tiga pita tengah 0%), kerapatan tepi 6,05% vs 0,17% (35× lebih berisik karena plasma
> terpotong kontur glyph). Verdict Billy: *"jelek ... saya ingin plasma seperti ini"*. Kalau
> permintaannya "efek jangan menutupi teks", jawabannya adalah mengerjakan figure/ground — nilai,
> blend, depth, atau masking lokal di sekitar glyph — BUKAN mengurung medan ke dalam glyph. Uji
> sebelum membangun: "kalau semua teks dihapus, apakah medan ini masih ada dan masih masuk akal?"
