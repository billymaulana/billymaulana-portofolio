# /explore/concept/1 — v2 · "Thermal Specimen"

Iterasi kedua setelah penolakan 2026-11-20
(`docs/awwwards/failures/2026-11-20-explore-concept-1-thermal-specimen.md`). Konsep tidak
berubah; yang diganti eksekusinya. Ini iterasi terakhir yang diizinkan guardrail 2-iterasi per
rute. Bagian "Kontrak" ditulis sebelum build; bagian lain mencatat apa yang benar-benar dibangun.

## Kontrak sebelum build

| | |
| --- | --- |
| WAJIB terasa | monumental · cinematic · kinetic |
| HARAM terasa | sterile · template · cute |
| Mood target (taxonomy §4) | `[monumental, cinematic, kinetic]` |

## Referensi → apa persisnya yang diambil

| Referensi | Berkas | Yang diambil | Yang tidak |
| --- | --- | --- | --- |
| "Ignite" | `references/visual/assets/vr-ignite-thermal-hands.jpg` | serif display mengisi lebar bidang; subjek termal menimpa huruf dengan oklusi penuh; tanda tangan manusia sebagai aksen; ground gelap ber-grain | satu suara roman: famili ini di repo tidak punya cut tegak di sekitar weight itu |
| Scanline coral | `references/visual/assets/vr-scanline-face-coral.jpg` | garis horizontal rapat yang digeser kedalaman; siluet menempel tepi, sisi seberang kosong | dua warna berselang; ujung garis putus-putus |
| Scanline violet | `references/visual/assets/vr-scanline-face-violet.jpg` | tepi siluet yang menyala tipis | glow lebar |
| Thermal imaging set | `reference style concept/effect/3cb0…ef05.jpg` | gradient map; skala suhu sebagai legenda | huruf kondens berat di dalam panel |
| AURA 777 | `reference style concept/effect/934e…b33d.jpg` | zona dingin yang menyala ungu, bukan gelap; grain | — |
| OVERHEAT | `references/visual/assets/vr-overheat-portrait.jpg` | potret tiga-perempat depan sebagai subjek | reticle dan readout angka |
| "Persistence" | `reference style concept/taste/brutalist-poster/8aef…3b54.jpg` | huruf meleleh jadi marbling; massa huruf tebal | barcode; tiga kali pengulangan kata |
| Liquify "WISDOM" | gambar ke-7 dari Billy | huruf digeser medan cair | fringe RGB cyan/merah |
| Dot hologram | gambar ke-4 dari Billy | — | belum diadopsi di hero; kandidat untuk section berikutnya |
| Stroboscopic thermal trail | `reference style concept/effect/58fd…888e.jpg` | — | tidak dibangun; tidak ada echo atau tetesan |
| Smear РИТМ | `reference style concept/effect/6f8f…59c7.jpg` | — | tidak dibangun; smear searah hanya muncul sebagai akibat advection fluida |
| `/checkpoint/hero/hero-2` | rute di repo, disetujui | wordmark mengisi lebar; liquify di bawah pointer; pasangan huruf berat + serif italic | mode `faithful` (fluida tak terlihat) |
| `/checkpoint/liquid/liquid-2` | rute di repo, verdict "keren" | engine dan seluruh konstantanya | — |

Dasar memakai plasma termal di atas masthead: verdict 2026-09-21 untuk `/explore/hero/hero-1`,
*"saya ingin plasma seperti ini: /checkpoint/liquid/liquid-2"*.

## Tipografi

| Entri library | Angka terukur | Dipakai sebagai |
| --- | --- | --- |
| `obsidianassembly` | Didone 460,8px w400 · tracking 0 · body Switzer Regular 14px/1,4 · 1 weight | pasangan serif kontras tinggi + Switzer Regular |
| `aupalevodka` | Instrument Serif 436px w400 · tracking 0 · satu kata italic | italic sebagai tekanan per kata |
| `jasonbergh` | PP Editorial New · tracking −0,025em · italic per huruf | batas tracking untuk famili ini |

Diukur di 1440×900:

| Peran | Famili · cut | Ukuran | Leading | Tracking |
| --- | --- | --- | --- | --- |
| Masthead "Billy" | PP Editorial New Ultrabold (800) | 195px, fit ke lebar konten 1248px | 1,06 | +0,012em |
| Masthead "Maulana" | PP Editorial New Italic (berkas 400) | 195px | 1,06 | −0,02em |
| Lede | PP Editorial New Italic | 40px (26px di < 768px) | 1,08 (1,12) | −0,015em |
| Teks dan label | Switzer 400 | 15px | 20px = 1,33 | −0,01em |

- Dua famili, dua weight (400, 800). Rasio display : teks 13×.
- Warna: tinta `#E6DFD3`, sekunder `#8A857C`, ground `#050507`.
- Stem : cap (diukur pada huruf "I"): "Ignite" 0,122 · Italic 0,138 (+13%) · Ultrabold 0,269.
  Nama depan sengaja keluar dari rasio "Ignite"; dasarnya massa huruf "Persistence" dan poster
  termal, serta pasangan berat + italic yang sudah disetujui di hero-2.
- Tiap baris lede digeser sebesar side bearing huruf pertamanya supaya tintanya, bukan kotaknya,
  jatuh di tepi kolom.

**Varian kedua**, `?mast=sans`: "BILLYMAULANA" Bebas Neue 400, 291px, leading 0,9, tracking
−0,015em. Ini suara masthead hero-2. Menjadikan halaman tiga famili (Bebas Neue, PP Editorial
New, Switzer), sama dengan hero-2, dan karena itu gagal `font-family-count`.

## Foto

`bahan/profile/IMG_6094.HEIC` — tiga-perempat depan. Berkas ini menyimpan matte potret, matte
kulit, matte rambut, dan disparity dari kamera; keempatnya dipakai. Dicerminkan supaya bahu
keluar lewat tepi kanan dan wajah menghadap teks.

| Aset | Kanal |
| --- | --- |
| `public/assets/images/concept-1/portrait-field.webp` (1100×1482) | R luminance · G kedalaman gabungan (30% disparity, 34% matte diblur, 36% luminance diblur) · B matte potret |
| `public/assets/images/concept-1/portrait-matte.webp` | R matte kulit, lubang ditutup · G matte rambut · B matte diblur untuk tepi menyala |

Luminance dan kedalaman dinolkan di luar siluet, jadi interior ruangan tidak ikut ter-commit.

Shader potret (WebGL2, satu pass):

| Parameter | Nilai |
| --- | --- |
| Pitch garis | 4px |
| Lengkung oleh kedalaman | 40px |
| Lebar garis : pitch | 0,56 |
| Selisih suhu celah | 0,24 |
| Suhu kulit | `0,50 + 0,48 · smoothstep(0,10 · 0,78 · lum)` |
| Suhu rambut | `0,25 + 0,47 · smoothstep(0,02 · 0,40 · lumCalm)` |
| Suhu baju | `0,18 + 0,40 · smoothstep(0,02 · 0,55 · lumCalm)` |
| `lumCalm` | 35% blur 9 tap |
| Tepi siluet | `smoothstep(0,44 · 0,56 · matte)` |
| Tepi menyala | 0,12 |

Terukur pada area potret (2026-11-20): dingin 52,1% · transisi 28,5% · oranye 11,5% ·
kuning-cream 7,8% dari tinta. Hangat 47,9% (SOLARA 49,1%, OVERHEAT 48,8%; v1 20–22%).

## Komposisi

Grid editorial repo: margin 96px (≥ 1440) · 64px (≥ 1024) · 48px (≥ 768) · 20px; 6 / 4 / 2
kolom; gutter 24 / 20 / 16px.

Tata letak lebar berlaku pada `(min-width: 1024px) and (min-aspect-ratio: 5/4)`:

| Elemen | Posisi |
| --- | --- |
| Baris meta | atas 28px; peran + lokasi + jam di kiri, tautan di kanan |
| Masthead | atas 104px, kolom 1 / −1, tinta rata ke margin |
| Lede | kolom 1–4, dua kalimat = dua baris, lebar maksimum 16em |
| Bukti dampak | kolom 1–2, rata bawah; baseline baris terakhirnya = baseline baris terakhir indeks |
| Indeks pengalaman | kolom 3–4, rata bawah; rel suhu 2px di gutter kirinya |
| Potret | puncak = baseline masthead − 0,82 × tinggi kapital (0,6 pada varian sans); tinggi = (100svh − puncak) × 1,26; keluar lewat tepi kanan dan bawah |

Tepi kiri teks di 1440: 96 · 520. Tepi kanan: 920.

Baris jabatan yang sedang berjalan ("2023–Now") tingginya 32px, baris lain 24px, dan tanda
skalanya diganti lingkaran pena 90,7 × 27,2px. Jarak tinta lingkaran: 4,1px ke kotak tinta
teksnya di titik terdekat, 4,6px ke garis baris di bawahnya, 4,2px ke rel, 11,4px ke nama
perusahaan.

| Kondisi | Yang berubah |
| --- | --- |
| Lebar, rasio 5:4 sampai 3:2 | lede dipersempit ke 11em (empat baris) |
| Lebar, 1024–1151px | kolom peran di indeks disembunyikan (dua kolom grid hanya 289px) |
| Tidak lebar, ≥ 768px | masthead ditumpuk dua baris (batas 20svh); potret dijangkar ke kanan-bawah (54svh), tidak menimpa masthead; bukti dampak dan indeks menumpuk di kiri |
| < 768px | lede 26px; bukti dampak, kolom peran, jam, dan ringkasan indeks disembunyikan; rel suhu masuk ke dalam margin; tautan memakai warna sekunder; potret 56svh |

Hero setinggi `max(100svh, 640px)` dan tumbuh mengikuti isi bila isinya lebih tinggi; tidak ada
teks yang dipotong.

## Mekanik

- Masthead diukur per huruf dari kata yang belum dipecah, lalu DOM dan raster canvas memakai
  posisi yang sama. Kerning bertahan di keduanya.
- Setelah intro, ground, atmosfer, masthead, dan potret diratakan ke satu canvas 2D yang menjadi
  tekstur konten engine `useFluidSimulation` mode `thermal`. Konstanta = liquid-2: curl 8 · sim
  128 · dye 512 · splat 0,3 / 7200 · displace 0,001 · chromatic 0,003 · density 1,8 · velocity
  1,2 · pressure 20 · interpolasi segmen.
- Teks kecil tetap DOM di atas canvas dan tidak ikut meleleh.
- **Yang hero ini lakukan pada nama:** saat pointer melintasi masthead, huruf ikut terseret medan
  dan tertutup pita termal, lalu kembali utuh dalam ±2 detik.
- **Potret terhadap teks.** Tepi kiri siluet dijejak dari kanal matte (96 × 64 sel; tepinya
  berpindah dari 5% sampai 50% lebar kotak gambar). Tiap baris teks diuji terhadap siluet pada
  ketinggiannya sendiri dengan radius satu gutter di ujung kanannya. Pada tata letak lebar potret
  digeser ke kanan sebesar pelanggaran terburuk, berhenti saat 78% lebar potret masih di dalam
  bingkai. Pada tata letak bertumpuk potret mengecil ke arah sudut kanan-bawah dalam langkah
  0,02 sampai bersih, paling kecil 0,6.

## Motion

| Elemen | Dari → ke | Durasi | Mulai | Easing |
| --- | --- | --- | --- | --- |
| Huruf masthead | y 112% → 0, per karakter | 1,1s | 0,10s, stagger 0,03 | `power4.out` |
| Atmosfer | opacity 0 → 1 | 1,6s | 0,35s | `power3.out` |
| Potret, sapuan pindai | 0 → 100% dari atas | 1,6s | 0,35s | `expo.inOut` |
| Potret, garis dingin → termal | 0 → 1 | 1,1s | 1,35s | `power3.out` |
| Baris lede | y 105% → 0 dalam mask | 0,9s | 0,90s, stagger 0,08 | `power3.out` |
| Teks kecil | y 105% → 0 dalam mask | 0,7s | 1,20s, stagger 0,04 | `power3.out` |
| Rel suhu | scaleY 0 → 1 | 1,0s | 1,20s | `expo.inOut` |
| Garis dan tanda indeks | scaleX 0 → 1 | 0,9s | 1,20s, stagger 0,05 | `expo.inOut` |
| Goresan pena | stroke 0 → 100% | 0,9s | 1,70s, stagger 0,18 | `power3.inOut` |
| Fluida aktif | — | — | 2,45s | — |
| Garis bawah tautan | scaleX 0 → 1 | 0,6s | hover | `cubic-bezier(0.16, 1, 0.3, 1)` |

Setelah intro, tidak ada yang bergerak tanpa input kecuali digit jam.

## Yang menyimpang dari kontrak

- Masthead direncanakan satu weight 400; dibangun dua cut (800 + Italic).
- Lede direncanakan 28px / 1,15; dibangun 40px / 1,08, karena 28px jatuh di tier body dan
  30–39px adalah zona terlarang.
- Goresan arsir di ruang tengah dibangun lalu dibuang: terbaca pola mesin. Yang tersisa dua
  tanda pena yang menandai sesuatu: garis bawah "move millions." dan lingkaran pada "2023–Now".
- Lingkaran pena pertama memotong huruf "w" 4,8px dan berjarak 1,6px dari garis baris; path-nya
  digambar ulang dan baris jabatan aktif ditinggikan.
- Mood: `monumental` terpenuhi (13×, masthead 86,6% lebar). `cinematic` hanya lewat grain dan
  oklusi. `kinetic` hanya saat ada input.

## Hasil gate (kode disimpan 2026-11-21 13:44, bukti direkam 13:46–13:51)

| Gate | Default (serif) | `?mast=sans` |
| --- | --- | --- |
| `typecheck` · `lint` | lolos | lolos |
| Console | hanya peringatan "WebGL not supported" dari uji tanpa-WebGL yang disengaja | — |
| `layout-audit`, 7 viewport | lolos · 40·40·40·40·40·42·33 kotak | lolos · sama |
| `ink-audit`, 7 viewport | lolos · 40·40·40·40·40·42·33 item | lolos · sama |
| `align-audit`, 7 viewport | lolos · 41·41·41·41·41·43·34 item | lolos · sama |
| Teks menimpa siluet potret | 0 dari 28·28·28·28·28·30·21 | 0 |
| `taste-lint` | 14 pass · 0 fail · 2 skip (42 teks) | 13 pass · 1 fail (3 famili) |
| Selisih dua frame diam, 8 detik | 0,0079% (96 px), seluruhnya digit jam | — |
| `effect-audit --idle` | **gagal**: cakupan 23,68% (batas 2%) · 17 pita hue | — |
| `effect-audit` aktif | detail 12,72% · bidang rata 1,5px lolos; 16 pita hue **gagal** | — |
| `effect-audit --ref` liquid-2 | **gagal**: detail 12,72% vs 1,36% | — |
| FPS diam / aktif, 2880×1458 | 60 / 60 | — |
| Reduced motion · tanpa WebGL | komposisi statis · tata letak utuh tanpa potret | — |

`leading-tier` di `taste-lint` tidak memeriksa satu elemen pun di halaman ini; angka leading di
tabel tipografi dibaca dari CSS. `effect-audit --idle` menghitung semua piksel terang, jadi
potret dan huruf yang diam ikut terhitung; bukti bahwa tidak ada yang bergerak adalah selisih
dua frame.

Lima belas viewport tambahan, tiga audit geometri lolos pada kedua varian, 0 teks terpotong
bingkai, 0 teks terpangkas mask, 0 teks menimpa siluet:

| Viewport | Yang terjadi (serif) |
| --- | --- |
| 1280×720 · 1512×982 · 1728×1117 · 2560×1440 | sama dengan tata letak lebar, geser 0 |
| 1180×820 | lede empat baris, potret digeser 20,2px |
| 1024×768 | lede empat baris, kolom peran disembunyikan, potret digeser 61,1px |
| 1366×1024 · 1280×1024 | lede empat baris, geser 0 |
| 1366×625 | hero 660px, halaman bergulir 35px |
| 1024×1366 | tata letak bertumpuk |
| 768×1024 · 810×1080 | bertumpuk; hero 1068px / 1094px, bergulir 44px / 14px |
| 390×664 · 375×667 | potret mengecil ke 0,90 / 0,86 |
| 430×932 | skala 1 |

Di 390×844 potret berskala 0,80: pada skala 1 ujung "SigmaTech" berjarak kurang dari satu
gutter (16px) dari tepi rambut secara diagonal.

## Penilaian independen

| Keadaan | A | T | min | Prediksi |
| --- | --- | --- | --- | --- |
| v2 awal (2026-11-20 22:45) | 6,9 | 6,25 | 6,25 | reject |
| v2 setelah perbaikan pertama (2026-11-21 12:31) | 7,4 | 7,08 | 7,08 | reject |

Gate `min(A, T) ≥ 8,0` belum lolos. Tiga alasan teratas critic: fluida termal menutupi 53,1%
tinta masthead pada frame aktif; masthead default dua suara; mood `cinematic` dan `kinetic`
hanya sebagian. Perubahan sesudah prediksi kedua (lingkaran pena, baseline bukti dampak,
perilaku di luar tujuh viewport wajib) tidak dinilai ulang.

## Batas yang diketahui

- Jendela dengan lebar ≥ 1024px, rasio di bawah 5:4, dan tinggi di bawah ±1280px memakai tata
  letak bertumpuk yang lebih tinggi dari layarnya; halaman bergulir, tidak ada yang terpotong.
- Keadaan aktif (fluida) hanya diuji di 1440×729 dengan pointer; sentuhan di perangkat nyata
  belum diuji.
- Pemeriksaan potret-terhadap-teks dan teks terpangkas memakai kolektor di luar repo;
  `layout-audit` melewati elemen di luar layar dan tidak melihat teks yang dipangkas mask
  maupun goresan SVG yang memotong huruf.
