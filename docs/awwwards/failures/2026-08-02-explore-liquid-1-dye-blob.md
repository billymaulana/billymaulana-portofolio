---
type: failure
slug: explore-liquid-1-dye-blob
date: 2026-08-02
route: /explore/liquid/liquid-1
concept: Liquid-only — engine checkpoint/hero-2 dijalankan mode dye di atas ground hitam
verdict: "jelek, saat putih tidak terlihat liqudi: http://localhost:3001/explore/liquid/liquid-1 berbeda dengan http://localhost:3001/checkpoint/hero-2 liquidnya"
severity: iterate
style_attempted: [liquid, cinematic]
fonts_used: []
technique_level: 1
screenshot: assets/2026-08-02-explore-liquid-1-desktop.png
rule_added: "Displacement tanpa tekstur untuk didorong adalah no-op — yang tersisa cuma blob."
---

# Explore Liquid 1 — dye blob

## 1. Verdict verbatim

> "jelek, saat putih tidak terlihat liqudi: http://localhost:3001/explore/liquid/liquid-1
> berbeda dengan http://localhost:3001/checkpoint/hero-2 liquidnya"

## 2. Apa yang dibangun

Rute `/explore/liquid/liquid-1` memanggil `useFluidSimulation` dengan seluruh parameter numerik
disalin apa adanya dari `checkpoint/hero-2`: `color #0047FF` · `curl 20` · `splatRadius 0.3` ·
`splatForce 7200` · `displace 0.001` · `chromatic 0.003` · `whiteCore 0.95`.

Satu hal diganti: `displayMode` dari `'faithful'` (`uMode 0`) menjadi `'dye'` (`uMode 1`), dan
`setContentCanvas()` diberi kanvas **1×1 piksel berisi `#000000`** sebagai pengganti raster
masthead. Alasan yang saya pakai saat itu: `drawContentDisplay()` berhenti tanpa `contentTexture`,
jadi tekstur konten wajib ada; karena rute ini tidak memuat teks, saya isi dengan warna ground.

## 3. Diagnosis jujur

Penggantian itu mematikan mekanik utamanya, dan saya menyebutnya "mengambil liquid dari hero-2"
padahal yang tersisa bukan liquid yang sama.

Pada tekstur satu warna, `texture2D(tMap, uv - vel * uDisplace)` menghasilkan nilai yang sama
untuk **setiap** nilai `vel`. Jadi di dalam shader:

- `base` konstan → displacement tidak menggeser apa pun
- `sh - base` = 0 → `aberr` = 0 → jalur chromatic aberration mati total
- `base.g = sh.g` dan `base.b = sh.b` tidak mengubah apa pun

Yang benar-benar dirender tinggal `col = mix(base, hue * smoothstep(0.0, 0.3, presence), cover)` —
fungsi dari **satu skalar** (`presence`). Fungsi satu skalar yang halus tidak bisa punya struktur
internal; hasilnya wajib berupa siluet dengan gradien. Itulah blob putih-biru yang Billy lihat.

Liquid hero-2 kaya justru karena `tMap`-nya raster huruf: pita putih-hitam berfrekuensi tinggi
yang didorong medan kecepatan menghasilkan laminasi marbling. **Tinta di hero-2 adalah tekstur
yang diaduk; tinta di liquid-1 adalah tinta yang digambar.**

Diukur dari dua screenshot 2880×1800 pada pola gerak kursor identik:

| Metrik | `/explore/liquid/liquid-1` | `/checkpoint/hero-2` | Selisih |
| --- | --- | --- | --- |
| Luas tinta (luma > 40) | 15,62% | 15,72% | ~sama |
| **Kerapatan tepi di dalam tinta** | **0,25%** | **6,36%** | **25× lebih sedikit** |
| **Panjang rata-rata deret putih** | **163,4 px** | **39,3 px** | **4,2× lebih panjang** |
| p95 deret putih | 364 px | 110 px | 3,3× |
| Deret putih terpanjang | 416 px | 260 px | 1,6× |
| Piksel putih klip | 4,49% | 12,82% | — |

Luas tintanya nyaris identik — jadi kegagalannya **bukan** soal kurang banyak atau kurang terang.
Yang hilang adalah strukturnya: tepi internal 25× lebih jarang, dan bidang putih membentang
163px tanpa satu pun interupsi. Itu terjemahan angka dari kalimat Billy "saat putih tidak
terlihat liquid" — putihnya memang bidang mati, bukan pita.

### Adjective decoder

| Baris decoder | Status | Angka |
| --- | --- | --- |
| "AI slop" (a) — teknik Level 0–1 sebagai visual utama | **GAGAL** | jalur aktif = gradien 1-skalar, setara Level 1 walau shader-nya Level 5 |
| "AI slop" (e) — efek sebagai overlay, bukan konten | **GAGAL** | fluida tidak mengerjakan apa pun; di hero-2 ia mengerjakan letterform |
| "Biasa saja" (c) — satu teknik saja | GAGAL | hanya dye body; displacement + chromatic mati |
| "Tidak harmoni" | tidak berlaku | tidak ada tipografi di rute ini |

## 4. Tes yang gagal

- **EMPTY TEST** — GAGAL. Rute ini memang tanpa teks, dan medannya sendiri tidak menahan mata:
  siluet dengan gradien, tanpa detail untuk diperiksa lebih dekat.
- **WOW TEST** — GAGAL. Tidak ada yang membuat berhenti; ini bentuk yang muncul di ribuan demo
  fluid simulation.
- OBJECT TEST — lulus (blob bisa ditunjuk), tapi lulusnya tidak berarti apa-apa di sini.
- SWAP / NEIGHBOR — tidak berlaku pada rute tunggal tanpa konten.

## 5. Sinyal taste yang didapat

Ini yang sebelumnya tidak saya ketahui: **yang Billy sebut "liquid" di hero-2 adalah tinta yang
teraduk, bukan cairan yang tergambar.** Nilai visualnya tinggal di frekuensi tinggi — pita
tipis, laminasi, tepi yang saling potong. Bidang warna halus dibaca sebagai "tidak terlihat
liquid" meskipun bentuk luarnya organik dan warnanya persis palet identitas.

Turunannya: memindahkan sebuah efek antar-rute tidak cukup dengan menyalin konstanta. Yang wajib
ikut pindah adalah **apa yang efek itu kerjakan**. Konstanta yang identik dengan sumber yang
berbeda menghasilkan efek yang berbeda kategori.

## 6. Rule baru

> **(2026-08-02) Mekanik displacement tanpa tekstur untuk didorong adalah no-op — yang tersisa
> cuma blob.** Saat memindahkan efek berbasis displacement ke rute lain, pertanyaan pertamanya
> bukan "berapa angkanya" melainkan "apa yang didorong". Pada `tMap` satu warna, `texture2D(tMap,
> uv - vel*uDisplace)` sama untuk semua `vel`: displacement mati, `aberr` = 0, dan yang dirender
> tinggal gradien dari satu skalar `presence`. Terukur di `/explore/liquid/liquid-1` vs
> `/checkpoint/hero-2` pada luas tinta yang sama (15,62% vs 15,72%): kerapatan tepi **0,25% vs
> 6,36%** (25×) dan deret putih rata-rata **163,4px vs 39,3px** (4,2×). Verdict Billy: *"saat
> putih tidak terlihat liqudi"*. Efek yang butuh substrat WAJIB dibawa bersama substratnya —
> raster teks, foto, grid, atau pola apa pun yang punya frekuensi tinggi — bukan diganti bidang
> warna ground.
