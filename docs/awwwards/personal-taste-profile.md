---
type: personal-taste-profile
owner: Billy Maulana
updated: 2026-07-26
---

# Personal Taste Profile — Billy

> Kanonik. Sumber lain menunjuk ke sini. Update lewat learning loop (Fase 4).

## Revisi 2026-07-26 — constraint diselaraskan dengan bukti library

Dipicu capture `quantumbody.io`, lalu diverifikasi ulang ke seluruh 11 entri `references/library/`.
Empat aturan absolut ternyata dibantah oleh referensi yang Billy sendiri puji:

| Aturan lama | Status | Bukti pembantah |
| --- | --- | --- |
| `BANNED: single font family` | **dicabut**, jadi bersyarat | wolverineworldwide (ABC Diatype), oharchitecture (PP Neue Montreal), quantumbody (Neue Haas) |
| `Weight: Bold → Extra Bold` | **diperlebar** ke 300–700 | kaitonote (Kumbh Sans 300), quantumbody & emotion-agency (400), bymonolog (500) |
| `BANNED: white backgrounds` | **dicabut**, jadi bersyarat | wolverineworldwide `#ffffff`, oharchitecture `#fcfcfc`, quantumbody `#FFFDF5` |
| `Vibrant > muted. Always.` | **dipersempit** ke aksen saja | quantumbody — palet muted hangat, dipuji verbatim |
| `BANNED: green on dark bg` | **dipersempit** ke kasus aslinya | quantumbody `#2D3622` sebagai ground penuh section |

**Prinsip yang menggantikannya**: yang benar-benar menyatukan semua referensi yang Billy suka
bukan gelap, bukan tebal, bukan saturated — melainkan **disiplin rasio dan koherensi sistem**.
Hierarki yang lahir dari lompatan ukuran besar, leading yang dikunci per tier, tracking yang
diterapkan per ambang, dan palet yang punya suhu warna jelas. Larangan-larangan lama sebenarnya
sedang mendeskripsikan *gejala eksekusi buruk*, dan keliru menaikkannya jadi hukum kategori.

**Tidak ikut berubah**: `## Locked Decisions`,

## Identity & Benchmarks
- **Identity**: Brutalist Expression + Premium Feel + Swiss Grid + Dark Cinematic + Vibrant Chromatic Accents + Liquid/Glass Materials + Extreme Bold Typography
- **Style Signatures**:
  1. "Editorial Void x Liquid Intelligence" — Swiss editorial hening → hidup lewat liquid/glass/chroma. Tenang, confident, mahal.
  2. "Mythic Chrome x Anti-Mainstream" — Secondary influence. Artsy, berani, nyeleneh berkelas.
- **Feel**: "terasa mahal dan premium" — NOT "terasa smooth dan clean"
- **Primary benchmarks** (dikonfirmasi konsisten di 3 sumber): daspritam.in, art-yakushev.com, kaitonote.com, junji-yamazaki.design
- **Reference set diperluas** (dari `taste-dna.md`, living document, 10 full reference + 4 partial): daspritam.in, art-yakushev.com, chdartmaker.com, latchezarboyadjiev.com, kaitonote.com, creativewebmanual.com, grids.obys.agency, eseagency.ch, junji-yamazaki.design, sileent.com. Partial (teknik spesifik saja): skizophonic.com, supersolid.agency, shanecollierdesign.ca, airborne.studio.
- **LOVES**: text-as-mask, fluid distortion, refraction shaders, ScrambleText, velocity-based effects
- **HATES**: template particles, generic canvas, invisible gradients, repeated patterns
- **Anti-monoton**: variasi antar section penting — setiap section harus punya identitas visual sendiri
- **Anti-AI slop**: hasil harus terasa human-crafted, bukan generated. Planned imperfection > algorithmic perfection
- **Anti-checklist**: desain bukan soal centang requirement. Desain soal FEEL dan TASTE
- **Konflik ditemukan**: `SKILL.md.bak` menulis Identity versi lebih pendek ("... Dark Cinematic + Liquid/Glass + Bold Typography", tanpa "Vibrant Chromatic Accents" dan "Extreme"). Versi `CLAUDE.md` (root, terkini) diambil sebagai kanonik karena lebih spesifik.

## Feel / Emotional Arc
- Calm → meledak lewat motion. BUKAN flat energy.
- "Membuat user terdiam, lalu terpukau"
- **UX Philosophy**: Experience-centric avant-garde, BUKAN user-centric konvensional. Tidak semua harus langsung dimengerti. Rasa penasaran > kecepatan.
- Pattern dari referensi terpilih: preferensi ke dark/cinematic/atmospheric aesthetic dengan motion yang purposeful. Suka teknik yang terasa analog/physical (film grain, CRT, garis persistent). Tidak suka yang bersih/sterile/corporate.

## Mood — Kosakata & Target *(baru 2026-07-26)*

Kosakata lama hanya 6 token (`premium, brutal, playful, calm, tense, luxurious`) — terlalu kasar.
`art-yakushev` dan `hashgraphvc` sama-sama tertulis "premium" padahal rasanya sangat berbeda.
Taxonomy penuh **18 token + 5 anti-mood**, lengkap dengan penanda terukur, ada di
`references/editorial/05-developing-taste.md` §4. Ringkasannya:

| Keluarga | Token |
| --- | --- |
| **Ketegangan** | `calm` · `tense` · `austere` · `serene` |
| **Status** | `premium` · `luxurious` · `clinical` · `raw` |
| **Energi** | `kinetic` · `brutal` · `playful` · `monumental` · `energetic` |
| **Atmosfer** | `cinematic` · `mystic` · `organic` · `nostalgic` · `surreal` |
| **ANTI-MOOD (haram)** | `corporate` · `sterile` · `cute` · `sporty` · `template` |

### Mood inti Billy (dari 12 entri library + verdict verbatim)

Tiga token yang muncul paling konsisten dan boleh dianggap sebagai **default identity**:
`premium` + `austere` + `monumental`. Ditambah satu dari keluarga Atmosfer sebagai pembeda
per section — biasanya `cinematic` atau `mystic`.

`austere` adalah token yang selama ini hilang dan menjelaskan banyak penolakan: yang Billy
sebut "premium" pada `oharchitecture`/`quantumbody`/`wolverineworldwide` sebenarnya
**austere** — hening, ≤ 3 warna, tanpa dekorasi, grid ketat. Bukan "mewah". Salah membaca
ini sebagai `luxurious` menghasilkan output yang terlalu ramai.

### Mood target per section (kanonik)

| Section | Mood target | Anti-mood yang diawasi |
| --- | --- | --- |
| Preloader | `[cinematic, mystic]` | `template` |
| Hero | `[monumental, austere, kinetic]` | `sterile` |
| About | `[premium, clinical]` | `corporate` |
| Manifesto | `[austere, monumental]` | `sterile` |
| Projects | `[clinical, premium]` | `template` |
| CTA | `[tense, brutal]` | `corporate` |
| Footer | `[cinematic, calm]` | `template` |

Tidak ada dua section berdampingan dengan mood identik — konsekuensi langsung NEIGHBOR TEST.

**Aturan pakai**: mood target ditulis SEBELUM membangun; setelah selesai, verifikasi penanda
terukurnya satu per satu. Kalau mood yang keluar meleset, sebutkan **penanda mana** yang
gagal — bukan "kurang pas".

## Brand Personality & Values *(baru 2026-07-26)*

Diturunkan dengan metode 8 slider di `references/editorial/03-art-direction.md` §4.
Skala 1–5; nilai 3 dihindari karena netral = tidak berkepribadian.

| Slider | Nilai | Konsekuensi mengikat |
| --- | --- | --- |
| Klasik ↔ Kontemporer | **5** | Variable font, tracking negatif ekstrem, OKLCH |
| Tenang ↔ Lantang | **2** | Sedikit elemen, durasi panjang, `expo.inOut` |
| Ramah ↔ Berjarak | **4** | Uppercase tracked pada label, ada delay sebelum respons |
| Rapi ↔ Kasar | **2** | Kasar hanya sebagai pelanggaran grid yang terencana |
| Massal ↔ Elite | **5** | ≤ 5 warna, font langka, micro-typography wajib |
| Hangat ↔ Dingin | **4** | Neo-grotesque, warm-black bukan hitam murni |
| Serius ↔ Jenaka | **2** | Tanpa bounce, tanpa elastic |
| Statis ↔ Kinetik | **5** | Minimal satu efek merespons **velocity** |

### Tiga values — dipakai untuk MENOLAK ide bagus yang tidak sesuai

| Value | Konsekuensi yang mengikat |
| --- | --- |
| **Craft over volume** | Lebih baik 4 section sempurna daripada 9 section rata-rata. Micro-typography wajib. |
| **Engineering as material** | Minimal satu shader/WebGL yang tidak bisa ditiru CSS. Efek harus JADI konten, bukan overlay. |
| **Restraint before spectacle** | Hero tidak menampilkan seluruh trik. Aksen warna baru muncul saat interaksi. |

## Hasil Kalibrasi Langsung — Sesi 2 (2026-07-26)

Delapan pasangan A/B, setiap varian rekonstruksi komposisi dari referensi nyata di
`references/library/`. **8 dari 8 dijawab, nol skip** (sesi 1: 5 dari 8 dilewati) — rumusan
pasangan yang memakai referensi nyata terbukti menghasilkan pilihan, bukan penolakan ganda.

Kolom *toggle* = berapa kali Billy menukar sebelum memutuskan. Rendah = jelas; tinggi = halus.

| Dimensi | Pilihan Billy | Toggle | Status aturan | Isolasi variabel |
| --- | --- | --- | --- | --- |
| Pola komposisi | **Wordmark menembus tepi** (Möbius) | 2 | CONFIRMED | layout + weight ringan |
| Weight display | **Berat — Inter 800** (Nexola) | 2 | **INCONCLUSIVE** *(2026-08-02)* | ⚠ famili + weight |
| Leading display | **Rapat 0.77** (Viper) | 4 | CONFIRMED | ⚠ 4 variabel |
| Cara hierarki | **Lewat nilai abu** (Mugen) | 4 | CONFIRMED | layout + weight ringan |
| Ground | **Hampir-hitam `#0A0A0A`** (Baselane) | 2 | CONFIRMED | ✓ bersih |
| Aksen warna | **Monokrom murni** (Mōno™) | 1 | **CONFIRMED** *(aturan direvisi 2026-07-26, ekspektasi disamakan 2026-08-02)* | hampir bersih |
| Case display | **Sentence case** (Lyniq) | 4 | CONFIRMED | ⚠ famili + weight + case |
| Densitas konten | **Padat editorial** (Creative Web Manual) | 3 | CONFIRMED | ⚠ layout + famili |

### Yang bisa dikunci sekarang

- **Ground hampir-hitam `#0A0A0A`** — isolasi bersih, toggle rendah. Terkunci.
- **Monokrom pada glyph tipografi** — toggle 1, keputusan tercepat di seluruh sesi. Lihat revisi di bawah.
- **Padat editorial > minimal** — konten nyata (nama proyek, tahun, stack) dipilih di atas ruang kosong.
- **Wordmark menembus tepi** sebagai pola komposisi utama.
- **Hierarki lewat nilai abu** pada ukuran sama, bukan lompatan ukuran.

### Yang butuh uji ulang isolatif

**Weight** dan **leading** dan **case** punya confound famili. Sesi berikutnya harus mengubah
**satu variabel saja** per pasangan — dengan famili, ukuran, dan layout dikunci identik.

### Revisi aturan yang terbantah

**1. Weight display — DIBATALKAN di hari yang sama** *(2026-07-26)*
Revisi awal menyimpulkan "default display adalah berat 700–900" setelah Billy memilih Inter 800
di atas Switzer 300. Beberapa menit kemudian Billy mengirim `origin-studio` dengan verdict
*"saya suka typographynya"* — situs itu memakai Inter **500** di display dan **300** di body,
tanpa satu pun weight ≥600.

**Kesimpulan yang bertahan: weight bukan diskriminator tunggal.** Inter 800 dan Inter 500
sama-sama diterima. Yang konsisten di keduanya: tracking negatif (−0.03 … −0.04em) dan disiplin
jumlah weight (2–4 per situs). Status revisi: **belum terbukti**, menunggu uji ulang isolatif
dengan famili dan ukuran dikunci.

*Ditindaklanjuti 2026-08-02*: pasangan ini ditandai `inconclusive` di `calibration/expectations.json`,
bukan dibalik. Varian A dan B mengubah famili sekaligus weight, jadi pilihan Billy tidak bisa
diatribusikan ke salah satunya; membalik `expects` agar kalibrasi terlihat bersih akan mengunci
kesimpulan yang datanya tidak topang. Ia keluar dari hitungan dikonfirmasi/dibantah sampai ada
sesi yang mengunci famili, ukuran, dan layout lalu mengubah weight saja.

**2. Aksen warna pada tipografi — monokrom** *(direvisi 2026-07-26)*
Billy memilih monokrom murni di atas satu glyph ber-aksen `#0047FF`, dengan toggle 1 —
keputusan tercepat di seluruh sesi.
**Batas klaim**: yang diuji adalah aksen warna **pada glyph tipografi**. Ini TIDAK mencabut
`chromatic event` pada interaksi/motion, dan TIDAK mengubah palet identity. Yang berubah:
memberi warna pada huruf bukan lagi teknik yang diasumsikan disukai — tipografi default
monokrom, warna hadir lewat interaksi dan material, bukan lewat glyph.

## Typography — Data Referensi (80 situs terukur, 2026-07-26)

Diukur langsung lewat `getComputedStyle`. Library berisi **95 entri**; **80** punya angka yang
bisa diparse (15 note format lama belum distandarkan — lihat catatan di bawah).
**Data ini mengalahkan tabel ambang teoritis dan mengoreksi tiga klaim awal.**

### Persentil nyata per tier

| Tier | | min | p10 | **median** | p90 | max |
| --- | --- | --- | --- | --- | --- | --- |
| **Display** | ukuran | 41px | 112px | **222px** | 397px | 890px |
| | weight | 100 | 300 | **500** | 800 | 900 |
| | tracking | −0.10em | −0.06em | **−0.03em** | 0 | +0.015em |
| | leading | 0.70 | 0.78 | **0.95** | 1.10 | 1.54 |
| **Body** | ukuran | 14px | 16px | **24px** | 24px | 26px |
| | weight | 300 | 400 | **500** | 600 | 700 |
| | tracking | −0.067em | −0.035em | **0** | 0 | +0.133em |
| | leading | 0.70 | 1.00 | **1.29** | 1.50 | 1.70 |
| **Label** | ukuran | 7px | 12px | **12px** | 13px | 13px |
| | tracking | −0.059em | −0.027em | **0** | +0.058em | +0.20em |
| | leading | 1.00 | 1.00 | **1.33** | 1.70 | 2.00 |

**Rasio display : body** — min 1.7 · p10 4.7 · **median 10.3** · p90 18.6 · max 37.1.
Target 10–20× **terkonfirmasi tepat**.

### Tracking display per bucket ukuran (n=80)

| Ukuran | n | min | p10 | median | p90 |
| --- | --- | --- | --- | --- | --- |
| ≥ 160px | 61 | −0.10 | −0.06 | **−0.030** | 0 |
| 96–159px | 14 | −0.04 | −0.04 | **−0.030** | 0 |
| 56–95px | 4 | −0.06 | −0.06 | **−0.023** | 0 |
| 32–55px | 1 | 0 | — | 0 | — |

### Jumlah weight per situs (n=67)

| 1 | 2 | 3 | 4 | 5 | 6 |
| --- | --- | --- | --- | --- | --- |
| 7 situs | 20 | **22** | 11 | 6 | 1 |

**27 dari 67 situs memakai 1–2 weight saja.** Median 3. Disiplin weight adalah pola terkuat
di seluruh dataset.

### Tiga koreksi terhadap klaim sebelumnya

1. **Leading display median 0.95, bukan 0.85.** Angka 0.85 diambil dari satu referensi
   (quantumbody) dan dinaikkan jadi aturan. Dengan 80 entri, 0.85 ada di sekitar p25 —
   condong rapat, tapi bukan median. Rentang kerja: **0.78–1.10**.
2. **Body tracking median 0, bukan negatif.** Klaim "tracking negatif berlaku di semua tier"
   benar untuk Lyniq dan Vertical, tapi p50 dari 77 entri adalah nol. Yang benar: tracking
   negatif di body **ada dan sah** (p10 = −0.035), bukan default.
3. **Weight display median 500**, p10 300, p90 800 — sebaran nyaris simetris. Bukti kuantitatif
   terakhir bahwa **weight bukan diskriminator**; menutup revisi yang sempat dibuat lalu
   dibatalkan pada hari yang sama.

### Catatan kejujuran

15 note belum ikut terhitung karena format lama: `art-yakushev`, `bymonolog`, `chdartmaker`,
`daspritam`, `emotion-agency`, `hashgraphvc`, `kaitonote`, `latchezarboyadjiev`, `mugenstudio`,
`noomo-labs`, `oharchitecture`, `origin-studio`, `quantumbody`, `valterox`, `wolverineworldwide`.
Semuanya punya angka di body note, hanya strukturnya belum seragam. Statistik di atas berbasis
**80 entri**, bukan 95.

### Yang menentukan tracking bukan ukuran, tapi FAMILI × WEIGHT

| Famili @ weight | Ukuran | Tracking yang dipakai |
| --- | --- | --- |
| Switzer 300 (vitaeresume) | 264px | **−0.10em** |
| Inter 700 (vertical) | 409px | **−0.08em** |
| Inter 600 (norvin) · Inter 700 (lyniq) | 300–427px | **−0.06em** |
| Inter Display 700 (mugen) · Switzer 300 (plutarch) | 260–333px | −0.04em |
| Inter Display 900 (mobius) · 700 (viper) | 260–326px | −0.03em |
| Switzer 400 (baselane) · Satoshi 700 (portrixe) · PP Neue Montreal 400 (cwm) | 162–369px | **−0.02em** |
| Clash Display 600 (porto) | 397px | **−0.0075em** — sudah rapat bawaan |
| Inter Display 800 (nexola) | 200px | **0em** |

**Aturan yang benar**: tracking dipilih dari famili dan weight-nya, bukan dari tabel ukuran.
Font berjarak longgar (Switzer light) butuh −0.06 … −0.10em; font yang sudah rapat
(Clash Display) butuh nyaris nol.

### Tracking negatif berlaku di SEMUA tier

Lyniq: display −0.06em · body −0.05em · label −0.04em.
Vertical: display −0.08em · body −0.04em · label −0.03em.
Creative Web Manual: **−0.02em identik di 256px, 136px, dan 24px.**

**DICABUT**: aturan lama "14–19px → 0em" dan "≤13px → +0.08em uppercase". Dari 15 referensi,
hanya `porto-template` yang memakai label ber-tracking positif (+0.067em). Sisanya netral atau
negatif, dan mayoritas **sentence case, bukan uppercase**. Ini juga menjelaskan rule 2026-07-25:
label mono uppercase ber-tracking lebar memang bukan pola yang Billy sukai.

### Weight: sedikit, dan ringan di ukuran ekstrem

Jumlah weight per situs: **2** (baselane, plutarch) · **3** (monod, porto, portrixe) · 4–6 sisanya.
Di ukuran ≥ 256px, weight yang dipakai justru **300–400** pada Switzer/PP Neue Montreal/Humane —
sementara Inter dipakai 600–900. Weight mengikuti famili, bukan ukuran.

### Single-family adalah jalur mayoritas

5 dari 15 memakai satu famili penuh: monod (Inter) · nexola (Inter Display) · portrixe (Satoshi) ·
baselane (Switzer) · plutarch (Switzer). Revisi 2026-07-26 yang mengizinkan single-family
terkonfirmasi kuat — bukan sekadar diizinkan, tapi **jalur yang paling sering dipilih**.

### Ground & aksen

Ground: 12 dari 15 hampir-hitam `#000000`–`#0F0F0F`; 3 terang (`#FFFFFF`, `#EAEAEA`, `#FFFFFF`).
Ink jarang putih murni — `#F9F9F9` / `#FAFAFA` / `#F6F6F6` / `#EAEAEA`.
Aksen selalu **satu warna saturated**: `#FF0000` · `#FF462E` · `#F9452D` · `#0019FF` · `#81FF28`.
Catatan: `vitaeresume` memakai `#0019FF`, nyaris identik dengan identity `#0047FF`.

### Komposisi — yang membuat semuanya bekerja

Pola yang berulang dan **tidak ada** di spesimen yang ditolak:

1. **Wordmark menembus tepi** — mobius, lyniq, mugen: display dipotong tepi bawah/samping
2. **Wordmark dipecah blok** — vertical (VER/TI/CAL), monod & portrixe & baselane (per karakter)
3. **Angka besar sebagai elemen grafis** — norvin (372px), creativewebmanual (256px), plutarch (260px)
4. **Hierarki lewat NILAI, bukan ukuran** — mugen (putih vs `#B8B8B8` seukuran), plutarch (`#4A4A4A`)
5. **Satu glyph diberi warna aksen** — viper (asterisk `#FF462E`)
6. **Elemen tumpang tindih** — mobius (foto menimpa wordmark)

## Typography

> **Revisi 2026-07-26 — larangan font berbasis identitas DICABUT.** Billy verbatim:
> *"sebenernya font inter juga tidak masalah karna yang penting font pairing dan typography
> seperti tracking line height font weight optical dan lain lain"*
>
> Yang mengikat sekarang adalah **Typography Execution Gate** (8 gate, di
> `anti-slop-rules.md`): tracking per ambang · leading per tier · rasio display:body ≥5× ·
> weight per konteks · optical size disimulasikan · pairing berkontras skeleton · zona 30–39px
> kosong · micro-typography dikerjakan. Font apa pun sah kalau lolos; font "premium" pun ditolak
> kalau gagal. Ditegakkan mekanis lewat `scripts/taste-lint.mjs`.
>
> Ini pola yang sama dengan revisi single-family / white-background / muted-palette di atas:
> larangan kategori ternyata sedang mendeskripsikan gejala eksekusi buruk.

- **Weight: 300–700, dipilih per konteks** *(direvisi 2026-07-26)*. Bold BUKAN syarat. Bukti dari library: Kumbh Sans **300** (kaitonote), Neue Haas Display **400** (quantumbody), Aeonik **400** (emotion-agency), Animo **500** (bymonolog), Maximanouva **700** (latchezarboyadjiev). Yang wajib adalah **hierarki SANGAT kontras** — dan itu bisa dicapai lewat ukuran/case/ruang, tidak harus lewat bobot.
- Tracking: tight di display, normal di body. Alignment: Left/Swiss.
- Text BOLEH rusak, terbelah, kena efek — tapi tetap powerful.
- **Hard constraints**:
  - Extreme viewport-filling scale (BebasNeue 267px, Maximanouva 216px, Neue Haas 120px). If it doesn't feel too big, it's not big enough.
  - **Negative letter-spacing berbasis ambang ukuran, bukan disamaratakan** *(direvisi 2026-07-26)*. Rentang terverifikasi: `-6px` s/d `-4px` di display ekstrem (bymonolog), `-3px` at 120px + `-1px` at 60px + normal di ≤40px (quantumbody). Aturan lama "`-4px` at 100px" dipertahankan sebagai titik acuan, bukan sebagai nilai wajib tunggal — pilih per tier ukuran.
  - **Line-height dikunci per tier** *(baru 2026-07-26, dari quantumbody)*: display 0.85 · statement 1.0 · body 1.3. Rasio yang konsisten inilah yang membuat blok teks terasa disetel, bukan default.
  - **Font pairing = OPSIONAL, bukan kewajiban** *(direvisi 2026-07-26)*. Dua jalur sama-sama sah:
    - *Pairing kontras* — condensed display + geometric sans body + serif italic accent (chdartmaker, art-yakushev, kaitonote).
    - *Single-family disiplin* — satu famili, hierarki dari ukuran + case + ruang (wolverineworldwide/ABC Diatype, oharchitecture/PP Neue Montreal, quantumbody/Neue Haas). Ini terbukti disukai, jadi TIDAK lagi dilarang.
  - Typography as visual material: text-as-mask, chromatic shadow clones (3x RGB layers), blend modes
  - Per-char SplitText stagger 0.02-0.05s, blur-to-sharp scrubbed to scroll. `wrapSpecificText()` untuk serif accent.
  - **BANNED**: safe proportional sizing, generic bold/regular contrast (yaitu kontras yang hanya mengandalkan tebal-vs-regular tanpa lompatan ukuran).
  - **Font monospace DIHINDARI** *(baru 2026-07-26, permintaan langsung Billy)*. Berlaku untuk
    seluruh peran termasuk yang biasanya dianggap aman — label, eyebrow, meta-row, counter, nav,
    HUD, ticker, caption, angka teknis. Termasuk JetBrains Mono, Fira Code, Space Mono, dan
    `monospace` generik. Ini **konsisten** dengan temuan §"Tracking negatif berlaku di SEMUA tier":
    14 dari 15 referensi memakai label sentence-case ber-tracking netral/negatif, bukan label mono
    uppercase ber-tracking lebar. Penggantinya: famili grotesk yang sama dengan display, 12–14px,
    sentence case, tracking netral s/d `-0.04em`; untuk kolom angka rata pakai
    `font-variant-numeric: tabular-nums`, bukan mono.
    Referensi ber-mono yang tetap dinilai tinggi (`isabel-moranta` CentSchbook Mono BT,
    `emotion-agency` Aeonik Fono, `supersolid` Sono) diadopsi **struktur**-nya — rasio skala,
    sistem label kurung, disiplin dua tier — bukan famili mono-nya.
  - **DICABUT** *(2026-07-26)*: ~~`BANNED: single font family`~~ — dibantah oleh 3 referensi yang Billy puji, dua di antaranya dengan verdict identik "typography dan grid/layoutnya bagus". Syaratnya: single-family hanya sah kalau lompatan ukurannya besar (rasio ≥5x antara display dan body) dan leading-nya dikunci per tier. Satu famili + ukuran seragam tetap ditolak.
- **Font pairing yang diverifikasi dari referensi** (`taste-dna.md`): BebasNeue (condensed) + Okomito (geometric sans) — chdartmaker.com; Apparel italic serif + Suisse sans-serif — art-yakushev.com; Kumbh Sans 300 (weight ringan, bukan bold) + Noto Serif Display italic via `wrapSpecificText()` — kaitonote.com; Maximanouva 700 — latchezarboyadjiev.com; Joyride Alt + Montserrat 700 + Sono (monospace) — supersolid.agency (partial).
- **Konflik ditemukan & resolusi**: `docs/memory/MEMORY.md` (branch eksplorasi `mac-explorer-design`, status AWAITING USER REVIEW) mencatat font list berbeda untuk konsep "Editorial Void": serif editorial besar (Canela, GT Super Display, Saol Display, Noe Display) + sans cold (Neue Montreal, Suisse Int'l, ABC Diatype, Söhne). Ini BUKAN keputusan terkunci — hanya eksplorasi konsep yang belum di-approve. Keputusan TERKUNCI di `CLAUDE.md` Art Direction Mandate (2026-07-15, lebih baru) adalah **Bebas Neue** untuk masthead hero, dipertahankan di eksplorasi layout apapun. Bebas Neue = kanonik untuk masthead; daftar serif/sans MEMORY.md disimpan sebagai arah alternatif yang belum terkunci.

## Color
- **Vibrant > muted — berlaku untuk AKSEN, bukan untuk seluruh palet** *(direvisi 2026-07-26)*. Kata "Always" dicabut. Aksen yang datang sebagai *chromatic event* tetap wajib saturated. Tapi **ground/palet dasar boleh muted asalkan koheren dan punya suhu warna yang jelas** — dibuktikan quantumbody (cream `#FFEBC4` / bone `#D7D1C3` / paper `#FFFDF5` / warm-black `#201914` / forest `#2D3622`, lima warna hangat low-saturation) yang Billy puji langsung: "color dan typography setnya bagus".
- **Diskriminatornya bukan saturasi, tapi KOHERENSI + niat.** Yang Billy tolak selama ini adalah warna pudar yang *tidak disengaja* (washed-out, tanpa sistem). Yang Billy terima adalah palet muted yang *dipilih sebagai sistem* dengan suhu konsisten. Sebelum memakai muted, harus bisa dijawab: warna ini hangat atau dingin, dan kenapa.
- **Color philosophy (dari MEMORY.md)**:
  - 70% monochrome (black, white, grey) — kanvas
  - 20% chrome/silver — material quality, kesan mahal
  - 10% chromatic event (blue, cyan, violet) — HANYA saat interaksi, reward user
  - Accent TIDAK muncul di hero awal → muncul saat interaksi → Zeigarnik tension
  - Warna "datang dengan alasan" bukan sekadar estetik
- **mix-blend-mode sistematik per section**: `luminosity` (hero heading), `difference` (nav auto-invert + ghost shadows), `screen` (fluid canvas), `overlay` (grain), `color-burn` (warm depth)
- Interaction-driven color > static decoration (fluid velocity → chromatic split)
- Noise grain overlay (opacity 0.04, `mix-blend-mode: overlay`) WAJIB pada hero + preloader + manifesto
- Per-section atmospheric gradient (radial/linear) WAJIB dengan opacity >= 0.08 — bukan flat `#000`
- **OPACITY FLOOR**: No design element below 0.08 opacity. If it's worth adding, it's worth SEEING.
- **BANNED (tetap)**: pastel/muted **accents** (aksen wajib saturated), purple gradients, invisible gradients (< 0.05 opacity)
- **DIREVISI 2026-07-26 — dua larangan diturunkan jadi bersyarat:**
  - ~~`white backgrounds`~~ → **ground terang DIIZINKAN.** Dibantah tiga referensi yang Billy puji: wolverineworldwide (`#ffffff`), oharchitecture (`#fcfcfc`), quantumbody (7 dari 12 section ber-ground terang `#FFFDF5`/`#D7D1C3`). Dua verdict-nya identik: "typography dan grid/layoutnya bagus". Syarat: ground terang harus **hangat/bernuansa** (`#FFFDF5`, `#FCFCFC`), bukan putih layar mentah, dan dipakai sebagai **pergantian ritme antar section** — bukan default seluruh situs.
  - ~~`green on dark bg`~~ → **hijau sebagai GROUND PENUH section diizinkan** (quantumbody `#2D3622` forest di section education & research). Yang tetap DILARANG adalah persis keluhan aslinya: hijau sebagai **aksen melayang di atas background gelap** (junji-yamazaki.design) — itu yang bikin kotor, bukan hijaunya.
- **BANNED (dari taste-dna.md, "TIDAK suka" verbatim — dipertahankan, tapi dibaca sebagai reaksi ke eksekusi spesifik, bukan hukum universal)**: Pastel/muted colors di hero ("ungu pastel saya tidak suka" — synchronized.studio); Hijau di hero/dark background (junji-yamazaki.design); Full bright backgrounds kuning/orange sebagai background — accent boleh, background tidak (eseagency.ch); Warna terlalu pudar/muted — harus vibrant (leeroy.ca).
  Catatan 2026-07-26: keempatnya adalah penolakan terhadap warna yang **tidak punya sistem**, bukan terhadap kategori warnanya. quantumbody memakai muted dan diterima karena palet-nya koheren; leeroy.ca memakai muted dan ditolak karena pudar tanpa arah.

## Motion
- **Easing hierarchy (kanonik, konsisten 2 sumber)**: `expo.inOut` (dominant) > `power3/4.out` (reveals) > `expo.out` (scatter) > `CustomEase` (signature). NEVER `power1`/`linear`/`ease`/`swing`.
- Cinematic preloader (~5-8s) > 20 micro-interactions. Stagger choreography always.
- Blur-to-sharp per-char (scrub: 0.15, stagger: 0.03s). Displacement multipliers: 0.001-0.01 (subtle).
- Scroll-scrubbed pinned timelines (600-1300% vh), clip-path transitions, GSAP Flip, drawSVG.
- **BANNED**: `opacity:0,y:30→opacity:1,y:0` as universal reveal. Simultaneous animation without stagger. Default/generic motion.
- **Motion philosophy (dari MEMORY.md)**:
  - Motion = simbol KELAS, bukan gimmick
  - Favorit: Liquid/ink/chroma, Glass distortion, Morphing geometry, Scroll storytelling, Cursor sebagai alat eksplorasi
  - Timing: Slow start, decisive end. Delay mikro = choreography.
  - **BANNED**: Bounce, elastic playful, over-smooth "Apple style", fade-in tanpa karakter
  - Semua mouse-driven ATAU scroll-triggered — NO auto-play chaos
- Inertia-driven (bukan position-only), layered speeds (parallax depth), persistent elements antar navigasi, planned imperfection dalam timing. Fluid simulation = real physics (Navier-Stokes), bukan fake sine waves. Velocity-driven color — warna respons terhadap ARAH gerakan, bukan random.

## Layout & Materials
- Swiss Grid (Van de Graaf, rectangular grid), NOT Bootstrap/flexbox-centered — Swiss grid sebagai VOCABULARY layout utama, bukan aksen.
- Swiss grid KETAT → lalu dilanggar secara SADAR. Hero rapi → section berikutnya mulai "rusak". Text keluar grid saat hover/scroll. Object menabrak layout.
- Every section = distinct visual identity. Adjacent sections MUST differ.
- Counter-positioned typography (diagonal tension). Negative space as design element.
- **BANNED**: 3-column card grid, centered hero+CTA, identical section padding, glassmorphism cards, linear structure
- **Materials**: Glass, Prism, Crystal, Chrome, Liquid metal, Transparent stone. Luxury + teknologi + seni.

## Editorial Craft Standards *(baru 2026-07-26)*

Lapisan yang tidak disadari user tapi menentukan apakah hasil terasa mahal. Detail penuh +
CSS siap tempel di `references/editorial/01-typography-fundamentals.md` dan `02-grid-fundamentals.md`.

### Angka yang mengikat

| Aspek | Nilai | Sumber |
| --- | --- | --- |
| Measure body | ≤ 75ch (sweet spot 60–75) | Butterick 45–90 |
| Measure display | 18–34 karakter/baris | editorial `01` §2C |
| Tracking | per ambang ukuran, BUKAN satu nilai global — `−0.045em` ≥160px → `0` di ≤19px → `+0.08em` label mono | editorial `01` §3C |
| Leading | rentang terukur — display 0.70–1.15 (median 0.85) · statement 0.75–1.00 · body 1.00–1.60 · label 1.10–1.70 | 15 referensi 2026-07-26 |
| Rasio display : body | **≥ 5×**, target 10–20× | editorial `04` §6A |
| Zona ukuran terlarang | 30–39px (jurang antara text scale dan display scale) | editorial `01` §5A |
| Grid desktop | margin 96px · 6 kolom · gutter 24px | editorial `02` §5A |
| Baseline unit | 24px — semua line-height & margin vertikal kelipatannya | editorial `02` §6A |
| Ruang antar grup | ≥ 2× ruang di dalam grup (target 3×) | editorial `04` §3A |
| Ruang di sekitar elemen berskala ekstrem | ≥ 25% tingginya sendiri | editorial `04` §6B |
| Maksimum famili | 2 famili + 1 mono, maks 3 weight | anti-slop-rules |

### Micro-typography — WAJIB, sering dilewatkan

- `text-wrap: balance` di semua heading (efektif ≤6 baris Chromium / ≤10 Firefox); `text-wrap: pretty` di body
- Semua angka dinamis (counter, jam, persentase, progress) → `font-variant-numeric: tabular-nums`
- Karakter benar: `"…"` bukan `"`, `'` bukan `'`, en dash `–` untuk rentang, em dash `—` untuk jeda, `…` bukan `...`, `×` bukan `x`
- `&nbsp;` antara angka dan satuan supaya tidak pernah patah
- Optical alignment flush-left: `margin-inline-start` `−0.02em` (sans) / `−0.06em` (display berat) / `−0.09em` (kutipan)
- `hanging-punctuation` BUKAN Baseline → selalu sertakan fallback `text-indent` negatif
- `text-box-trim` Limited Availability → bungkus dengan `@supports`, sediakan margin kompensasi
- Semua font di repo TIDAK punya sumbu `opsz` → optical sizing disimulasikan manual lewat tabel tracking/weight/leading per ambang

## Rhythm & Page Flow *(baru 2026-07-26)*

Halaman = kurva ketegangan, bukan tumpukan section.

| Momen | Section | Densitas | Amplitudo motion |
| --- | --- | --- | --- |
| 1. Tarikan napas | Hero | breathe (288px) | Tinggi |
| 2. Tanah | About | dense (120px) | Rendah |
| 3. Ledakan | Manifesto | breathe (288px) | Sangat tinggi |
| 4. Substansi | Projects | normal (192px) | Rendah–sedang |
| 5. Gema | CTA + Footer | dense (120px) → normal (192px) | Sedang |

Aturan: setelah setiap momen amplitudo tinggi WAJIB ada satu section tenang. Kalau semua
momen adalah puncak, tidak ada puncak. Tidak boleh dua densitas sama berdampingan.
Minimal satu elemen jangkar persisten sepanjang scroll. Footer mencerminkan hero.
---

## Revisi 2026-07-26 (kedua) — kalibrasi ulang dari 104 referensi terukur

Library tumbuh 95 → **142 entri** setelah dua batch: 27 situs kelompok Aeonik dan 21 referensi
SOTD. Statistik dihitung ulang dari **104 entri yang punya data terukur**. Rincian lengkap dan
tabel per-tier ada di `references/typography-execution-patterns.md`.

### Yang berubah

**1. Tracking bukan fungsi monoton dari ukuran.** Kurvanya berbentuk U — terapat di 160–299px
(median −0.03em), lalu **melonggar lagi** di ≥300px (median **0**, 58% memakai tracking netral).
Sebabnya display ≥300px cenderung memakai famili yang metriknya dirancang untuk ukuran display
(Humane, Bdo Grotesk, OT Jubilee, Times, Instrument Serif) dan sudah rapat sejak awal.

`taste-lint.mjs` dikalibrasi ulang: bucket baru `{ min: 300, em: 0, lo: -0.095, hi: 0.03 }`.
Kalibrasi lama menyamakan semua tier ≥160px di −0.03em dan akan **menolak 11 dari 19** referensi
tier ≥300px yang Billy sukai.

**2. Rasio display:body ≥5× hanya berlaku bila tipografi adalah subjek halaman.** Tiga entri
melanggarnya dan tetap disukai: `nikolamiselpuklin` (rasio **1×**, seluruh situs 18px w900),
`kvs` (**1.1×**, 9 canvas WebGL), `savage-studio` (1.7×). Pola yang sama muncul pada tiga situs
motion-driven — `hashgraphvc` 36px, `oryzo` 40.8px, `steven` 51px — semuanya menahan display di
bawah 60px karena beban visual dipikul scene 3D.

Aturan yang benar: rasio ≥5× berlaku untuk halaman **yang tipografinya adalah subjek**. Ketika
subjeknya 3D atau footage, yang wajib dijaga adalah kejelasan peran, bukan rasio.

**3. Weight ringan pada ukuran besar terbukti sah.** Median weight display = **400–500**.
Beberapa entri terkuat memakai weight sangat ringan: `jasonbergh` 149.76px w**200**, `dulcedo`
140px w**300**, `veauly` 360px w300, `silent-house` 160px w**450** dengan **sentence case**.
Ini menutup usulan "display default heavy 700–900" dari kalibrasi sesi 2 — usulan itu dibatalkan.

### Teknik baru yang masuk daftar layak-pakai

| Teknik | Sumber | Inti |
|---|---|---|
| Italic selektif | `jasonbergh` · `aupalevodka` · `dulcedo` | Italic per-huruf/kata/nomor sebagai tekanan, tanpa menaikkan ukuran atau weight |
| Media sebagai glyph | `adcker` | Video kecil di dalam `( )`, sejajar baseline, seukuran huruf |
| Grid yang diperlihatkan | `madeinevolve` · `jasonbergh` · `studiodado` | Garis kolom / penggaris numerik 7.2px sebagai elemen visual |
| Kartu di-stagger diagonal | `dulcedo` PROFILES | Jalan keluar dari larangan 3-column grid: bertingkat turun + void internal + tanpa radius/shadow |
| Pasangan sefamili beda lebar | `1820productions` · `wolverineworldwide` · `jeskojets` | Kontras tanpa menambah famili kedua |

### Yang dikonfirmasi ulang

- **Ground terang hangat** — tiga SOTD baru memakainya: `obsidianassembly` (gradient cokelat→krem),
  `adcker` (`#EFEDEA`), `dulcedo` (`#F2F2F2`). Menguatkan revisi 2026-07-26 pertama.
- **Gate eksekusi, bukan identitas font** — `unesco-museum` memenangkan SOTD dengan **Inter**
  (w300, tracking −0.05em, dipasangkan Unbounded, rasio 7.0×, 2 weight). Bukti langsung untuk
  pernyataan Billy soal Inter.

### Koreksi data

Lima entri yang sempat ditandai meragukan sudah diperiksa ulang: `zeekr-ava` (yang terbaca
ternyata pencacah preloader, display asli Aeonik Pro 78px), `prime-exits` (`line-height: normal`
tidak ditangani parser, nilai asli 1.2), `nikolamiselpuklin` (bukan capture gagal — situsnya
memang satu ukuran), `akilia` (Archia adalah font asli Atipo, bukan fallback), `raxo`
(`__Inter_8b3a0b` adalah penamaan `next/font`, familinya Inter).

---

## Revisi 2026-07-26 (ketiga) — palet visual dari 26 poster yang Billy kirim

Billy mengirim dua folder berisi 26 poster/artwork dengan pernyataan: *"ini adalah style style
warna yang ingin saya masukkan ke portofolio saya."* Seluruhnya sudah dianalisis dan dikategorikan
di `references/visual/` (7 kategori, aset ter-commit).

### Temuan tunggal terpenting

Dari 26 gambar, **tidak ada satu pun yang memakai warna aksen di luar sumbu violet → oranye.**
Ini bukan koleksi selera acak — ini satu palet yang konsisten, dan urutannya persis **colormap
termal**: hitam → indigo → violet → magenta → oranye → amber → putih panas.

| Peran | Rentang terukur | Frekuensi |
|---|---|---|
| Ground | `#000000` – `#0E0C10` | 26 / 26 |
| Dingin | `#2B0B6B` – `#5B1FC7` | 24 / 26 |
| Mid | `#6B23C8` – `#8B3FE8` | 22 / 26 |
| Transisi | `#B02CE8` – `#E8437E` | 18 / 26 |
| Panas | `#F26A1B` – `#FF5A1F` | 16 / 26 |
| Puncak | `#FFC81E` – `#FFF6D8` | 14 / 26 |
| Tipografi | `#E9E4D8` – `#FFFFFF` | 26 / 26 |

### Ini TIDAK mengganti palet identitas

`#0f0a72` (indigo dalam) jatuh **tepat di zona "dingin"** ramp termal. Artinya palet baru ini bisa
dipakai tanpa melanggar aturan "identity palette tidak berubah" — indigo identitas menjadi **titik
terdingin** sistem panas, dan `#0047FF` tetap dipakai sebagai aksen HUD/interaktif. Ramp
terkonsolidasi 8-stop ada di `references/visual/01-thermal-plasma.md`.

### Dua strategi tipografi, tidak ada di tengah

- **Menyatu total** (11 dari 26) — lewat oklusi, warp mengikuti aliran, knockout, atau chromatic
  fringe.
- **Datar penuh** (15 dari 26) — grotesk putih tegak lurus, tanpa blend mode, sengaja melawan
  kekacauan latar.

Yang **tidak pernah muncul**: tipografi setengah-menyatu, drop shadow, atau glow lembut di
sekeliling huruf demi keterbacaan. Ini menambah larangan baru di `anti-slop-rules.md`.

### Aturan komposisi termal yang diturunkan

1. Zona dingin wajib mendominasi 50–60% bidang; oranye ≤25%; kuning-putih ≤12%. Kalau panas
   mendominasi, colormap kehilangan arti dan jadi gradien pelangi.
2. Batas antar zona wajib tajam (isoline terbaca). Gradien mulus tanpa kontur = blur Photoshop.
3. Ground hitam wajib bersisa — tidak ada yang full-bleed panas sampai tepi.
4. Grain wajib (14 dari 14 gambar termal punya film grain atau dither).

### Keputusan tentang foto Billy

Tersedia `~/Downloads/2.billy.png` (600×600, pose korporat, latar koridor terang). **Tidak dipakai**
untuk hero termal. Alasan diuraikan di blok 3 `specs/2026-07-26-hero-explore-3-thermal.md`;
ringkasnya: referensi wajah di folder Billy sendiri (`vr-future-slitscan-face`,
`vr-scanline-face-coral`, `vr-overheat-portrait`) semuanya **menghapus identitas** — yang bernilai
adalah tekniknya, bukan orangnya. Kehadiran manusia dibangkitkan prosedural dari SDF.
