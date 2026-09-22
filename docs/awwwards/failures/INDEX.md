# Failure Index

> Karya Claude yang ditolak Billy. Dibuat otomatis saat Billy menyatakan penolakan.
> Skema: `SCHEMA.md`. Referensi situs bagus ada di `../references/library/`.

| Tanggal | Slug | Rute | Konsep | Verdict (verbatim, dipotong) | Severity |
| --- | --- | --- | --- | --- | --- |
| 2026-09-22 | [[2026-09-22-explore-hero-1-plasma-burn]] | `/explore/hero/hero-1` | Plasma burn — masthead tersulut, terkoyak, menghangus di dalam medan termal | "text effect jelek, dan detail pada liquid saya kurang suka adjust lagi." | iterate |
| 2026-09-21 | [[2026-09-21-explore-hero-1-thermal-ink]] | `/explore/hero/hero-1` | Thermal ink — ramp termal di-clip ke dalam letterform agar tidak menutupi masthead | "jelek pada explore/hero/hero-1 saya ingin plasma seperti ini: /checkpoint/liquid/liquid-2" | iterate |
| 2026-08-02 | [[2026-08-02-explore-liquid-1-dye-blob]] | `/explore/liquid/liquid-1` | Liquid-only — engine hero-2 mode dye di atas ground hitam | "jelek, saat putih tidak terlihat liqudi ... berbeda dengan checkpoint/hero-2 liquidnya" | iterate |
| 2026-08-02 | [[2026-08-02-hero-ambient-plume]] | `/explore/hero` | Ambient emitter — tiga sumber splat sinusoidal menyalakan fluida termal tanpa input user | "saya tidak suka bentuk shader yang muncul di awal seperti itu karna jelek, hapus saja defaultnya jangan langsung muncul" | iterate |
| 2026-07-26 | [[2026-07-26-hero-explore-3-v4]] | `/hero-explore-3` | Iterasi 4 — Instrument Serif satu baris, Host Grotesk, isoline termal | "jelek. ada dual text billy maulana, shader cacat dan jelek ... font terlalu monoton tidak bold dan font family jelek tidak sesuaai konsep" → **"hapus saja hero-explore-3"** | **deleted** |
| 2026-07-26 | [[2026-07-26-hero-explore-3-v3]] | `/hero-explore-3` | Iterasi 3 — masthead serif dua baris, brand row, HUD sudut | "typography nya jelek dan tidak terbaca ... available works dan email terlalu penuh dan design ini ai slop ... text billy maulana itu saling bertabrakkan dan bertumbuk" | rejected |
| 2026-07-26 | [[2026-07-26-hero-explore-3-v2]] | `/hero-explore-3` | Iterasi 2 — serif + italic selektif, nama sebagai masthead | "shader bentuknya masih kaku jelek ... logo terlalu besar dan menabrak text frontend enginer apa ini kualitas awwwards?" | partial |
| 2026-07-26 | [[2026-07-26-hero-explore-3-thermal]] | `/hero-explore-3` | THERMAL READOUT — halaman sebagai citra termal, HUD frame time nyata | "typography jelek padahal saya sudah punya contoh reference typography yang bagus di skills awwwards" | partial (shader lolos) |
| 2026-07-26 | [[2026-07-26-specimen-pair-01]] | `/calibration` | Spesimen pasangan 01 — Inter disiplin vs Clash default | "kedua pilihan tersebut masih jelek." | rejected |
| 2026-07-26 | [[2026-07-26-calibration-ui]] | `/calibration` | Sesi kalibrasi A/B typography — instrumen pengukuran taste | "typography masih terlihat biasa saja, dan ui calibration juga jelek." | rejected |
| 2026-07-25 | [[2026-07-25-specimen-001]] | `/hero-explore-3` | SPECIMEN 001 — type specimen brutalis, kursor sebagai cahaya | "jelek ... taste ui masih ai slop, pemilihan fontnya juga jelek" | rejected |
| 2026-07-25 | molten-index *(tanpa screenshot — sudah dihapus)* | `/hero-explore-3` | MOLTEN INDEX — nama sebagai logam yang meleleh | "jelek taste design masih jauh dengan sotd awwwards, hapus saja" | deleted |
| 2026-07-25 | video-hero-series *(4 iterasi)* | `/hero-explore-1`, `/hero-explore-2`, `/hero-explore-3` | Prisma · Axon · Studio · Red Manifesto | "Jelek." | rejected |

---

## Font yang pernah dipakai saat ditolak

> **Direvisi 2026-07-26.** Tabel ini dulu berjudul "Font yang sudah ditolak" dan diperlakukan
> sebagai daftar larangan. Itu **diagnosis yang salah**. Billy verbatim:
> *"sebenernya font inter juga tidak masalah karna yang penting font pairing dan typography
> seperti tracking line height font weight optical dan lain lain"*
>
> Akar penolakan bukan identitas font, melainkan **eksekusi tipografinya**. Font di bawah tidak
> dilarang; yang mengikat sekarang adalah **Typography Execution Gate** di `../anti-slop-rules.md`.

| Font | Dipakai di | Diagnosis ulang |
| --- | --- | --- |
| **Inter** | Prisma, Axon, Studio, VortxLab | Bukan fontnya. Dipakai dengan tracking/leading/weight default — gagal gate 1, 2, 4, 5 |
| **Obviously Condensed Black** | SPECIMEN 001, **THERMAL READOUT** | **Diulang 2×.** Kombinasi condensed-black + mono-uppercase tanpa kontras skeleton dicatat gagal 2026-07-25, dibangun ulang 2026-07-26 di rute yang sama |
| **Almarai** | Prisma | Tidak dikomentari; hero ditolak karena video stock, bukan karena font |
| **JetBrains Mono** | THERMAL READOUT | Billy: "saya tidak suka font mono". Bukan eksekusi — **preferensi famili**. Mono keluar dari palet UI project ini |
| **Marck Script** | Red Manifesto | Script sebagai display — gagal gate 6 (kontras skeleton) |
| **PP Editorial New** | hero-explore-3 v2, **v3** | Bukan fontnya sendiri: rasio tintanya **1,054** — tertinggi dari 8 famili di repo. Dipasang dengan leading 0,86 yang diwarisi dari era Clash Display (rasio 0,840) tanpa diukur ulang → tinta antar baris tumpang tindih 51,6px. Billy minta famili masthead diganti pada v2 dan v3 |
| **Switzer** | THERMAL v2, v3 | Tidak dikomentari langsung; ikut dalam permintaan "ganti semua font family dan font pairingnya" |
| **Instrument Serif** | hero-explore-3 v4 | **Hanya punya 1 weight (400).** Sebagai masthead 274px ia membuat weight tertinggi di halaman jatuh di 500 — nol elemen bold. Billy: "font terlalu monoton tidak bold". Juga "tidak sesuai konsep": serif editorial bergaya Times di atas konsep instrumen termal |
| **Host Grotesk** | hero-explore-3 v4 | Dipilih dari frekuensi library (20 kemunculan), bukan dari kecocokan konsep. Variable 300–800 tapi hanya 300/400/500 yang dipakai |

## Pola kegagalan yang berulang

1. **Video stock sebagai daya tarik utama** — 4×. Melanggar preferensi anti-video-heavy di taste profile.
2. ~~**Font BANNED dipakai** — Inter 3×~~ → **didiagnosis ulang 2026-07-26**: yang berulang bukan pemakaian Inter, melainkan **tipografi dieksekusi dengan nilai default** (tracking, leading, weight, optical). Fontnya kebetulan Inter.
3. **Logam grayscale prosedural** — 2×. Sinyal "silver/prisma/kaca" kemungkinan berarti refraksi optik, bukan brushed metal.
4. **Lolos semua gate teknis, tetap ditolak** — 5×. Gate mekanis (typecheck/lint/build/console) tidak mengukur taste. Pada THERMAL READOUT bahkan `taste-lint` 15/15 hijau — rule `font-family-count` meluluskan tiga famili sans karena hanya menghitung jumlah, tidak memeriksa klasifikasi.
5. **Gagal uji SWAP** — 7×. Ganti nama → tampilan identik.
6. **Mega-type + label mono uppercase tanpa kontras skeleton** — 3×. Sudah jadi rule sejak 2026-07-25; diulang di `/calibration`, lalu diulang lagi di THERMAL READOUT dengan **font yang persis sama** (Obviously Condensed Black) yang sudah tercatat gagal di tabel di atas.
7. **Teknik Level 1 (CSS statis) sebagai keseluruhan halaman** — 1×. Tidak ada elemen visual non-teks sama sekali.
8. **Memperbaiki token, bukan komposisi** — 1×. Setelah ditolak, `/calibration` dinaikkan dari Level 1 ke Level 5 dan `taste-lint` dari 5 ke 14 pass; susunan tipografinya tidak disentuh sama sekali dan tetap ditolak.
9. **Lolos di batas ambang lalu berhenti** — 1×. Rasio display:body 5.1× terhadap ambang 5×, padahal target 10–20×.
10. **Spec ditulis tanpa membuka library sendiri** — 1×. Blok Fonts THERMAL READOUT diisi dari inventaris `public/assets/fonts/`; `typography-execution-patterns.md` (ditulis beberapa jam sebelumnya, memuat jawabannya) tidak dibuka sama sekali.
11. **Konsep art director menggeser subjek halaman** — 1×. Masthead diisi tagline konsep (`RUNNING HOT`) 280px, nama Billy diletakkan di label HUD 11px.
12. **UI dinilai dengan mata, bukan diukur** — 1×. Logo menabrak eyebrow 22px (2.247px²) pada 1440×780 lolos DUA iterasi; hanya 1440×900 dan 390×844 yang pernah diuji, keduanya kebetulan di sisi aman dari ambang tinggi 830px. Ditutup dengan `scripts/layout-audit.mjs` (7 viewport) yang kini wajib sebelum klaim selesai.
13. **Gate yang dibangun untuk kelas kegagalan tertentu meluluskan kelas itu juga** — 1×. `layout-audit` dibuat 2026-07-26 khusus untuk mencegah tabrakan elemen, lalu keesokan build-nya meluluskan halaman dengan tiga tabrakan kasat mata di **7 dari 7 viewport**. Sebabnya bukan gate tidak dijalankan — gate-nya dijalankan dan gate-nya salah: ia mengukur kotak CSS, sedangkan yang dilihat Billy adalah tinta glyph. Ditutup dengan `scripts/ink-audit.mjs`.
14. **Angka desain berpindah famili tanpa diukur ulang** — 1×. Leading 0,86 sah untuk Clash Display (rasio tinta 0,840), lalu ikut berpindah ke Obviously, lalu ke PP Editorial New (1,054) sebagai "leading display portfolio ini". Varian baru dari pola #10/#13: bukan menyalin dari inventaris, tapi menyalin dari konteks yang berbeda.
15. **Aturan ditulis, lalu dilanggar oleh build sendiri** — 1×. Aturan isoline termal ditulis beberapa jam sebelum build, dan build-nya mencapai kerapatan tepi 0,00% pada region bebas teks. Rasio 71 rule prosa : 27 rule mesin — aturan diproduksi jauh lebih cepat daripada kemampuan menegakkannya.
16. **Memperbaiki keluhan lama membuka cacat yang selama ini tertutup** — 1×. Echo bleed 67,7px sudah ada sejak iterasi sebelumnya tetapi tersembunyi di balik baris kedua masthead. Menjadikan masthead satu baris — perbaikan untuk keluhan v3 — membuka echo itu ke ruang kosong dan langsung ditolak sebagai "dual text". Setelah mengubah struktur layout, efek yang sebelumnya lolos WAJIB dinilai ulang di konfigurasi barunya.
17. **Mengoptimasi ke metrik sendiri, bukan ke hal yang diwakilinya** — 1×. Target "kerapatan tepi > 3%" dipenuhi dengan menaikkan pita isoline jadi 13 pada medan datar; angkanya lolos (4,5–6,9%) sementara hasilnya terbaca sebagai banding — "shader cacat".
18. **Opsi yang diajukan ke Billy disusun dari data yang salah dimensinya** — 1×. Font dipilih dari frekuensi kemunculan di library, bukan dari jumlah weight dan kecocokan konsep. Billy memilih dari dua opsi yang keduanya sudah salah sebelum ditawarkan.
19. **Menulis ulang yang sudah ada di repo** — 2×. Blok Fonts diisi dari inventaris alih-alih dari `typography-execution-patterns.md`; simulasi fluida ditulis dari nol dengan curl-noise padahal `useFluidSimulation.ts` sudah memuat Navier-Stokes lengkap.
20. **Keadaan diam tidak pernah diperiksa** — 1×. Ambient emitter di `/explore/hero` menyala sejak `onMounted` dan menutupi 7,16% viewport melintasi masthead, lolos beberapa sesi karena setiap verifikasi berupa "gerakkan kursor, lihat jejaknya". Kondisi yang paling sering dialami pengunjung — tiga detik pertama tanpa gerakan kursor — tidak pernah di-screenshot. Varian dari pola #12: bukan UI yang dinilai dengan mata alih-alih diukur, melainkan **keadaan halaman yang tidak pernah dimasukkan ke dalam ruang uji sama sekali**.
21. **Parameter shader dikonfigurasi lalu diabaikan oleh mode render** — 1×. `color: '#0047FF'` ditulis di konfigurasi fluida sementara `displayMode: 'thermal'` memetakan intensitas ke colormap violet→oranye; hasil terukur nol persen area pada pita hue tempat biru identitas berada. Konfigurasi yang tidak berpengaruh terbaca sebagai "identitas sudah diterapkan" padahal tidak pernah sampai ke layar.

## Yang belum pernah dicoba

Kandidat arah berikutnya, diturunkan dari kegagalan di atas:

- Refraksi/dispersi optik nyata (MeshTransmissionMaterial, multiside refraction) — bukan fbm grayscale
- Konten nyata sebagai material desain (nama proyek, tahun, klien) — bukan metadata tentang diri sendiri
- Tipografi serif editorial atau variable font, bukan condensed-black grotesque **(masih belum dicoba per 2026-07-26 — THERMAL READOUT justru memakai condensed-black lagi)**
- Italic selektif per-huruf/kata sebagai penekanan (`typography-execution-patterns.md` §4) — terukur di 3 referensi, belum pernah dipakai di repo
- Layout yang tidak bertumpu pada grid hairline + label mono
