---
type: failure
slug: hero-explore-3-thermal
date: 2026-07-26
route: /hero-explore-3
verdict_by: billy
severity: partial
what_survived: shader thermal
what_died: typography, HUD mono, knockout masthead, copy judul, nav
---

# hero-explore-3 — THERMAL READOUT

![desktop](assets/2026-07-26-hero-explore-3-thermal-desktop.jpg)

## Verdict Billy — verbatim

> "text hitam tidak terlihat jelek saya tidak suka, saya tidak suka font mono, typography jelek
> padahal saya sudah punya contoh reference typography yang bagus di skills awwwards tapi output
> typography masih jelek, shades thermalnya bagus pollish agar lebih fluid dan tidak kaku
> pergerakkannya. saya ingin text motion juga di hero. bertindak kembali sebagai art director dan
> perbaiki agar standar sotd awwwards terpenuhi dan juga sesuai taste design saya."

> "dan saya merasa running hot tidak tepat judulnya seharusnya nama saya, dan text billy maulana
> di navbar itu seharusnya logo saya."

## Apa yang lolos gate, dan tetap ditolak

Ini kegagalan ketiga dengan pola yang sama: **semua gate teknis hijau, tetap ditolak.**

| Gate | Hasil |
|---|---|
| `pnpm typecheck` | lolos |
| `pnpm lint` | lolos |
| `pnpm build` | lolos, 18 rute prerender |
| `taste-lint` | **15 pass · 0 fail** |
| Median frame time | 16.7 ms |

`taste-lint` bahkan memberi **PASS pada `font-family-count`** ("2 teks + 1 mono") dan
**PASS pada `display-body-ratio`** (17×). Kedua rule itu benar secara huruf, dan sama sekali
tidak menangkap masalah sebenarnya.

## Diagnosis lewat adjective decoder

Rujukan: `references/editorial/03-art-direction.md` §7C.

### "typography jelek" → baris **"AI slop" (b): pasangan font tanpa kontras skeleton**

Ini kegagalan terukur, bukan selera.

| Peran | Famili dipakai | Klasifikasi | Skeleton |
|---|---|---|---|
| Masthead | Obviously Condensed Black | grotesk kondens | **sans** |
| Statement | Switzer 300 | grotesk netral | **sans** |
| HUD | JetBrains Mono 400 | mono | **sans** |

**Tiga famili, tiga sans, nol kontras skeleton.** Kontras satu-satunya adalah lebar dan weight —
dimensi terlemah dari lima dimensi kontras di `editorial/01-typography-fundamentals.md`.

`taste-lint` meluluskan ini karena rule-nya hanya menghitung **jumlah** famili (≤2 + 1 mono),
tidak pernah memeriksa **klasifikasinya**. Lubang rule yang nyata.

#### Angka x-height — diukur, bukan dikira

Rasio x-height : cap-height, diukur lewat `TextMetrics.actualBoundingBoxAscent` pada 200px:

| Famili | x-height | cap-height | rasio |
|---|---|---|---|
| Obviously Condensed Black | 130.2 | 150.0 | **0.868** |
| Switzer 300 | 105.7 | 136.0 | **0.777** |
| JetBrains Mono 400 | 110.0 | 146.0 | **0.753** |
| PP Editorial New 400 | 108.6 | 160.0 | **0.679** |
| Satoshi 400 | 96.8 | 143.3 | **0.676** |

Dua koreksi terhadap dugaan awal saya, keduanya harus dicatat jujur:

1. **Baris decoder "tidak harmoni (a)" TIDAK gagal.** Selisih x-height Obviously vs Switzer hanya
   **10%**, di bawah ambang 15%. Jadi masalahnya bukan disharmoni vertikal — dugaan saya salah.
2. **Yang benar-benar gagal**: selisih Switzer vs JetBrains Mono hanya **3%**. Kedua famili itu
   praktis punya proporsi vertikal identik. Kontras di antara keduanya nol kecuali monospacing —
   yang berarti "sans + mono" di sini bukan pasangan, melainkan **satu famili yang dispasi ulang**.

Sebagai pembanding, PP Editorial New (0.679) vs Obviously (0.868) berselisih **22%** — itu kontras
skeleton yang nyata. Dan PP Editorial New (0.679) vs Satoshi (0.676) berselisih **0.4%**: x-height
nyaris identik, skeleton berbeda. Itu profil pasangan yang benar — harmoni vertikal dengan kontras
klasifikasi, persis yang dipakai `jasonbergh` dan `aupalevodka`.

### "padahal saya sudah punya contoh reference typography yang bagus di skills awwwards"

Ini tuduhan yang paling telak, dan benar.

Beberapa jam sebelum membangun hero ini, saya sendiri yang menulis
`references/typography-execution-patterns.md` dari 104 situs terukur. Isinya memuat, secara
eksplisit:

- **§4 Italic selektif** — `jasonbergh` (italic per-huruf pada kapital awal), `aupalevodka`
  (satu kata italic di tengah kalimat roman), `dulcedo` (penomoran serif italic di atas grotesk).
- **§5 Pasangan sefamili beda lebar** — cara mendapat kontras tanpa famili kedua.
- **§10 Weight ringan pada ukuran besar** — `jasonbergh` 149.76px **w200**, `dulcedo` 140px
  **w300**, `silent-house` 160px **w450 sentence case**.
- Library juga memuat `obsidianassembly` (Didone 460.8px w400 tracking 0, rasio 32.9×) dan
  `studiodado` (serif display 211px leading 0.80).

Yang saya bangun: grotesk kondens **Black** (weight maksimal), uppercase, tanpa italic, tanpa
serif, tanpa varian lebar. **Kebalikan dari setiap temuan di atas.**

Alasan saya memilih Obviously, tertulis di blok 2 spec: *"padanan terdekat yang sudah dimiliki
dan belum pernah dipakai di rute mana pun"*. Itu **alasan inventaris, bukan alasan tipografi**.
Saya memilih font karena tersedia dan belum terpakai, bukan karena ia benar untuk konten ini.

### Yang membuat ini lebih buruk: kombinasi ini sudah tercatat gagal

Pernyataan "belum pernah dipakai di rute mana pun" **salah**, dan saya bisa memeriksanya dalam
satu perintah. `failures/INDEX.md` — file yang wajib dibaca sebelum memilih font, dan yang saya
buka di sesi ini juga — memuat baris:

> | **Obviously Condensed Black** | SPECIMEN 001 | Billy: "pemilihan fontnya juga jelek".
> Condensed-black + mono-uppercase tanpa kontras skeleton — gagal gate 6 |

Diagnosisnya identik dengan diagnosis hari ini: **condensed-black + mono-uppercase tanpa kontras
skeleton.** Saya membangun ulang kombinasi yang sama, di rute yang sama (`/hero-explore-3`),
dengan kegagalan yang sama, 1 hari setelah dicatat.

Ini menaikkan pola #6 di INDEX ("mega-type di atas kotak polos + label mono uppercase") dari 2×
menjadi 3×.

### "text hitam tidak terlihat jelek" → kegagalan Usability (30% bobot Awwwards)

Masthead memakai `mix-blend-mode: multiply` dengan warna void, sehingga huruf menjadi knockout
yang memotong cahaya. Saya menulisnya di spec blok 5 sebagai fitur: *"tipografi hanya terbaca
sepenuhnya ketika sistem sedang panas."*

Itu keputusan yang **mengorbankan keterbacaan demi konsep**, dan saya menuliskannya sebagai
justifikasi alih-alih sebagai risiko. Pada keadaan idle — keadaan pertama yang dilihat setiap
pengunjung — nama dan judul praktis tidak terbaca. Untuk portofolio, itu kegagalan fungsi dasar.

Referensi `vr-wegodown-thermal-arc` yang saya jadikan dasar memang memakai knockout, tapi di sana
teks hitam duduk di atas pita cahaya yang **selalu** menyala penuh. Saya menyalin tekniknya tanpa
menyalin prasyaratnya.

### "saya tidak suka font mono"

Preferensi personal yang belum pernah tercatat. Library memuat mono di beberapa entri kuat
(`jasonbergh` Monument Grotesk Mono 7.2px, `zeekr-ava` IBM Plex Mono), dan referensi visual
`vr-cddrive-cyber-hud` memakai mono untuk HUD — saya mengambilnya dari sana.

Tapi preferensi Billy mengalahkan pola library. Ini masuk daftar font-ditolak.

### "running hot tidak tepat judulnya seharusnya nama saya"

Kegagalan brief, bukan kegagalan eksekusi. Ini **portofolio pribadi** — subjek halaman adalah
orangnya. Saya membuat masthead dari tagline konsep (`RUNNING HOT`) dan menaruh nama Billy di
label HUD 11px di sudut. Hierarkinya terbalik: konsep saya sendiri diletakkan lebih besar daripada
subjek halaman.

### "text billy maulana di navbar itu seharusnya logo saya"

Kelalaian sederhana. `public/assets/images/logo/billy-maulana-logo-white.svg` ada di repo dan
tidak saya pakai.

### "shades thermalnya bagus" — yang berhasil

Shader diterima. Colormap 9-stop yang diekstrak dari piksel referensi bekerja. Ini satu-satunya
bagian yang tidak boleh diubah pada iterasi berikutnya, hanya diperhalus.

### "pollish agar lebih fluid dan tidak kaku pergerakkannya"

Motion field terlalu kaku. Penyebab terukur: setelah saya meng-clamp `curl()` ke magnitudo 1.6
dan menurunkan faktor advection 42 → 15 untuk memperbaiki bug jejak kursor, aliran jadi terlalu
jinak. Perbaikan bug mengorbankan kualitas gerak — dan saya tidak menilai ulang geraknya setelah
memperbaikinya.

## Akar masalah

Bukan satu keputusan yang salah, tapi satu kebiasaan: **saya membangun dari spec yang saya tulis
sendiri, tanpa kembali membuka library referensi saat mengeksekusi.**

Spec 11 blok itu presisi — setiap angka ada. Tapi presisi pada angka yang salah tetap salah.
Blok 2 (Fonts) diisi dalam dua menit dari inventaris `public/assets/fonts/`, sementara
`typography-execution-patterns.md` dan 142 entri library — yang berisi jawaban sebenarnya —
tidak dibuka sama sekali selama penyusunan spec.

Sistem taste ini punya knowledge, enforcement, dan measurement. Yang tidak dipunyai: **paksaan
untuk membaca knowledge-nya sendiri pada saat keputusan diambil.**

## Yang harus berubah di iterasi berikutnya

1. Masthead = **nama Billy**, bukan tagline konsep.
2. Tipografi wajib punya **kontras skeleton** — serif display berpasangan dengan sans, mengikuti
   pola `jasonbergh` / `aupalevodka` / `obsidianassembly` yang sudah terukur di library.
3. **Italic selektif** sebagai penekanan (teknik §4 yang belum pernah dipakai di repo).
4. **Nol mono.** Ganti HUD ke sans dengan tracking lebar.
5. Masthead **terbaca penuh pada keadaan idle** — knockout boleh jadi lapisan tambahan, bukan
   satu-satunya cara huruf muncul.
6. Logo SVG menggantikan teks nama di nav.
7. Text motion di hero (belum ada sama sekali).
8. Aliran termal diperhalus tanpa mengembalikan bug advection.
