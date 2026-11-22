# /explore/concept/1 — "Thermal Specimen" · reprompt art direction

Status: brief + reprompt. BELUM spec 11 blok. Angka bertanda (awal) dikunci setelah diukur di browser.

## Bacaan atas 8 referensi Billy

| # | Referensi | Yang diadopsi | Yang TIDAK diadopsi |
|---|---|---|---|
| 1 | Poster "Ignite" | Serif display kontras tinggi memenuhi lebar, subjek termal MENIMPA huruf, kolom teks kecil di kanan, goresan tangan sebagai aksen, grain | Body uppercase ber-tracking positif (melanggar aturan sentence case) |
| 8 | Poster "Persistence" | Kata diulang 3x vertikal, separuh panel teks meleleh jadi marbling, hitam-putih murni | Barcode sebagai font mono |
| 2, 3 | Potret scanline | Garis horizontal yang digeser oleh luminance wajah; siluet profil | Glow neon ungu polos (single-tint) |
| 5, 6 | Thermal imaging | Ramp indigo → violet → magenta → oranye → cream pada kulit | Layout poster 4 panel |
| 4 | Dot hologram | Titik yang posisinya diturunkan dari DATA (heightfield), depth blur | Partikel acak (Level 0) |
| 7 | Liquify text | Kaki huruf meleleh ke bawah, tepi berpendar | Lihat keputusan terbuka B |

Temuan: palet referensi 1, 2, 5, 6 identik dengan "Palet Liquid Thermal" yang sudah tercatat
disukai (C0 `#050507` … C10 `#FFFEF5`). Tidak perlu palet baru.

## Reprompt

```
PERAN
Kamu senior art director + creative developer studio pemenang Awwwards. Bangun SATU rute
eksplorasi portofolio Billy Maulana. Do not redesign. Do not reinterpret. Do not simplify
the technique. Do not substitute the library.

STACK TERKUNCI
Nuxt 4.6 + Vue 3 <script setup lang="ts"> + TypeScript strict + UnoCSS (Wind4) + GSAP 3.15
(SplitText, CustomEase) + WebGL2 mentah. DILARANG: React, Tailwind CDN, Framer Motion,
three.js untuk rute ini, UI library, Options API. Package manager: bun.

ISOLASI (syarat mutlak)
- Buat HANYA: app/pages/explore/concept/1.vue  → rute /explore/concept/1
- Boleh menambah aset HANYA di public/assets/images/concept-1/
- definePageMeta({ standalone: true }) + useSeoMeta robots noindex
- Semua CSS di <style scoped>, token sebagai const di <script setup>, shader + engine
  DISALIN ke dalam file ini (bukan import dari app/composables/). Menghapus file ini
  tidak boleh memengaruhi rute lain.
- DILARANG menyentuh: pages lain, app.vue, components/, composables/, main.css,
  nuxt.config.ts, uno.config.ts.
- Dev server di localhost:3000 sedang hidup: JANGAN dimatikan, JANGAN start instance kedua,
  JANGAN jalankan nuxi build/generate di folder repo.

MOOD TARGET
tense · sculptural · editorial. Kalau hasilnya terasa "dashboard neon synthwave" atau
"template portfolio gelap", berarti salah.

KONSEP — "Thermal Specimen"
Billy diperlakukan sebagai spesimen yang dipindai kamera termal: halaman adalah lembar
poster cetak (ref 1, 8), tubuhnya adalah sumber panas (ref 5, 6), dan pindaian itu
tersusun dari garis (ref 2, 3). Panas = interaksi: yang disentuh pointer memanas dan meleleh.

TOKENS LITERAL
- Ground #050507 · tinta teks #E6DFD3 (bone) · teks sekunder #8A857C
- Ramp termal 11 stop: #050507 0.000 · #0F0A72 0.130 · #3A1A9E 0.280 · #6B2FC8 0.430 ·
  #A32BA8 0.560 · #D45C6E 0.680 · #EE8A2A 0.790 · #F8BF27 0.875 · #FEE55D 0.935 ·
  #FFF5B3 0.975 · #FFFEF5 1.000 — antar-stop smoothstep, bukan linear
- Display: PP Editorial New Ultralight (sudah di repo), 26vw (awal), tracking -0.04em,
  line-height 1.06 (lantai metrik famili 1.054)
- Statement: Obviously Condensed Black, 44px (awal), line-height 1.0, tracking -1px
- Body/label: Switzer 15px / 1.3, sentence case, tracking 0 s/d -0.02em, measure 34ch
- Grain: public/assets/textures/grain-generated-film-1024.png, opacity 0.04, blend overlay
- DILARANG: font monospace di peran apa pun, Inter/Roboto/Arial/system-ui

STRUKTUR (z-index naik)
1  z-0   ground #050507
2  z-10  masthead "Billy" — PP Editorial New Ultralight, memenuhi ±86% lebar, kiri-atas
3  z-20  kanvas WebGL potret, lebar 46vw (awal), menempel bawah, bergeser ke kanan-tengah,
         SENGAJA menimpa 2 huruf terakhir masthead (overlap intensional, seperti ref 1).
         mix-blend-mode: screen
4  z-30  "maulana" kecil serif italic di bawah-kanan masthead + kolom body 34ch di kanan
5  z-30  blok statement kiri-bawah (Obviously), dibingkai 1 goresan tangan SVG (DrawSVG)
6  z-40  meta: lokasi, tahun, indikator scroll — Switzer 13px
7  z-50  grain

MEKANIK INTI 1 — potret scanline termal (ref 2, 3, 5, 6)
- Sumber: foto profil Billy (cutout, latar transparan) sebagai tekstur luminance
- Fragment shader: baris ke-n pada y = n * pitch; pitch 9px @900px tinggi (awal), tebal 2.5px
- Offset vertikal tiap baris = (lum(uv) - 0.5) * 28px (awal) → garis melengkung mengikuti wajah
- Warna garis = thermal(heat), heat = lum * 0.85 + panasPointer
- Idle: garis diam, ada drift 1 arah 6px/detik (awal) supaya terbaca "sedang dipindai"
- Pointer: radius 220px (awal) menaikkan heat +0.34 dan mengisi celah antar garis sampai
  jadi citra termal penuh (ref 5/6); meluruh 1.2 detik setelah pointer pergi
- Umur gerak WAJIB = umur tinta: tidak boleh ada garis yang masih bergerak setelah warnanya padam

MEKANIK INTI 2 — masthead meleleh (ref 7, 8)
- Teks dirender ke kanvas offscreen → tekstur. Displacement vertikal ke bawah hanya di
  bagian kaki huruf, besarnya mengikuti heat pointer + scroll progress
- Maks melt 0.35 × tinggi huruf (awal). Tepi yang bergerak diwarnai thermal(min(heat+0.34,1))
- Saat diam teks harus tajam dan terbaca 100%

ELEMEN DETAIL (ref 4)
- Dot-matrix heightfield: grid titik 64×64 (awal) yang tingginya diambil dari DATA nyata
  (mis. jumlah proyek per tahun), dipakai sebagai pemisah section. Bukan partikel acak.

SECTION SETELAH HERO (tiap section wajib beda identitas dari tetangganya)
- Index karya: nama proyek 3x berulang vertikal + panel marbling hitam-putih (ref 8),
  TANPA warna termal — jeda dari hero
- Tentang: kolom teks + skala suhu vertikal (ref 5) sebagai timeline tahun
- Penutup: footer mencerminkan hero — potret kembali jadi garis dingin (heat 0.13)

COPY VERBATIM (sumber: app/constants/profile.ts — DILARANG mengarang)
"Billy" · "Maulana" · "Frontend Engineer" · "Bandung, Indonesia"
"Transforming pixels into performance. Building interfaces that move millions."
"7+ years" · "80M+ users" · "200+ developers"

MOTION
elemen | dari → ke | durasi | delay | easing
masthead per-char | y 110% + blur 12px → 0 | 1.2s | 0.2s, stagger 0.03 | expo.out
potret | garis clip 0 → 100% dari atas | 1.6s | 0.5s | expo.inOut
kolom body per-baris | opacity 0 + y 16px → 0 | 0.9s | 1.1s, stagger 0.06 | power4.out
goresan tangan | DrawSVG 0 → 100% | 0.8s | 1.4s | power3.out
BANNED: power1, linear, ease, bounce, elastic

ANTI-SLOP
Tidak ada: centered hero + CTA, 3-column card grid, glassmorphism, gradient ungu polos,
partikel generik, fluid single-tint, pemisahan kanal RGB cyan/merah, comment WHAT,
referensi AI/agent/file planning di kode. Comment hanya WHY, block comment.

RESPONSIVE
≥1440 seperti di atas · 834: potret 70vw, kolom body pindah ke bawah masthead ·
390: masthead 34vw 2 baris, potret full-bleed di bawah, tap target ≥44px, teks ≥14px

DEFINITION OF DONE
- bun run typecheck && bun run lint hijau
- Browser: reload, screenshot idle 3 detik, console bersih dari [Vue warn]
- layout-audit + ink-audit di 7 viewport: 1920×1080, 1600×900, 1440×900, 1440×780,
  1366×768, 834×1112, 390×844 — sebutkan jumlah elemen yang diperiksa
- effect-audit idle + active pada kanvas potret
- prefers-reduced-motion: potret statis termal penuh, tanpa melt

LAPORAN BALIK
File yang dibuat + cara membuka + screenshot. TANPA klaim evaluatif.
```

## Keputusan terbuka (milik Billy)

A. Foto hero. B. Fringe RGB vs fringe termal pada teks meleleh. C. Cakupan: hero dulu atau 4 section sekaligus.
