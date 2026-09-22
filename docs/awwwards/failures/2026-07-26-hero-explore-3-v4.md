---
type: failure
slug: hero-explore-3-v4
date: 2026-07-26
route: /hero-explore-3
concept: THERMAL iterasi 4 — Instrument Serif satu baris, Host Grotesk, isoline termal
verdict: "jelek. ada dual text billy maulana, shader cacat dan jelek. saya tdak suka typographynya font terlalu monoton tidak bold dan font family jelek tidak sesuaai konsep"
severity: deleted
style_attempted: [editorial, cinematic, thermal]
fonts_used: [Instrument Serif 400, Host Grotesk 300/400/500]
technique_level: 5
screenshot: assets/2026-07-26-hero-explore-3-v4-desktop.png
rule_added: famili display wajib diperiksa jumlah weight-nya dan kesesuaian konsepnya sebelum diusulkan
---

# hero-explore-3 v4 — echo shader terbaca sebagai teks kedua, famili tanpa weight

![dual text dan isoline](assets/2026-07-26-hero-explore-3-v4-desktop.png)

## Verdict Billy — verbatim

> "jelek. ada dual text billy maulana, shader cacat dan jelek. saya tdak suka typographynya font
> terlalu monoton tidak bold dan font family jelek tidak sesuaai konsep"

## Konteks yang memperberat

Semua gate hijau, **termasuk gate yang baru dibuat hari itu juga**: `ink-audit` 7/7 PASS,
`layout-audit` 7/7 PASS 0 warn, typecheck · lint · build · console bersih. Kerapatan tepi bidang
naik dari 0,00% ke 4,5–6,9%, distribusi zona masuk rule.

Cacat mekanis yang ditolak pada v3 memang hilang. Yang menggantikannya adalah **cacat baru yang
tidak satu pun gate bisa lihat**, karena ketiganya membaca DOM dan geometri — bukan gambar.

## Diagnosis lewat adjective decoder

### "ada dual text billy maulana" → echo bleed dirender sebagai warna penuh

Bukan ilusi. Terukur dari profil luma per baris pada kolom x 520–1340 (kolom kanan, tidak ada
elemen lain di sana):

| Pita | Rentang y | Luma rata-rata puncak |
|---|---|---|
| Masthead | 497 – 701 px | 147,3 |
| **Salinan di bawahnya** | **704 – 795 px** | **24,4** |
| Ground | 800+ px | 5–9 |

Pita kedua setinggi **91 px** dengan luma 3–5× di atas ground, berbentuk huruf. Itu yang dibaca
Billy sebagai teks kedua.

Penyebabnya deterministik, di `useThermalField.ts`:

```glsl
for (int i = 1; i <= 8; i++) {
  bleed += texture(uHeat, vUv + vec2(0.0, k * 0.0094)).r * (1.0 - k / 9.0);
}
fragColor = vec4(heat * scale, 0.0, 0.0, bleed * 0.106);
```

lalu di render pass:

```glsl
h = max(h, texture(uField, uv).a);
```

Pergeseran maksimum `8 × 0.0094 = 0.0752` UV — pada tinggi 900 px itu **67,7 px**. Karena masthead
adalah sumber panas terkuat di layar, salinannya juga yang terkuat; dan `max()` merender salinan itu
lewat colormap **penuh**, bukan sebagai bayangan yang meredup. Hasilnya bukan jejak panas yang naik,
melainkan duplikat teks yang diberi warna.

Efek ini sudah ada sejak iterasi sebelumnya. Ia tidak terlihat sebagai duplikat saat masthead
dua baris karena tertutup baris kedua. Membuat masthead satu baris — perbaikan untuk keluhan
v3 — justru membuka echo itu ke ruang kosong di bawahnya.

### "shader cacat dan jelek" → isoline pada bidang datar terbaca sebagai artefak

Kontur ditambah untuk memenuhi aturan "batas antar zona wajib tajam". Yang dibangun: 13 pita
`fract(h * 13.0)` pada medan yang sebagian besar datar. Di medan yang tidak punya struktur kuat,
garis-garis itu tidak membaca sebagai isoline citra termal — mereka membaca sebagai **banding**,
cacat kompresi. Kerapatan tepi naik ke 4,5–6,9% dan angkanya lolos target, tetapi angka tepi
tidak membedakan kontur bermakna dari garis banding.

Ini kegagalan metrik yang saya tulis sendiri beberapa jam sebelumnya: saya menetapkan
"kerapatan tepi > 3%" sebagai target, lalu mengoptimasi ke arah metrik itu alih-alih ke arah
yang diwakilinya.

### "font terlalu monoton tidak bold" → famili display yang dipilih hanya punya SATU weight

`@fontsource/instrument-serif` hanya memuat **400 dan 400-italic**. Tidak ada weight lain.
Halaman ini karena itu punya:

| Peran | Famili | Weight |
|---|---|---|
| Masthead 274 px | Instrument Serif | 400 |
| Statement | Host Grotesk | 300 |
| Label | Host Grotesk | 400 |
| Email | Host Grotesk | 500 |

Weight tertinggi di seluruh halaman adalah **500**, pada teks 19 px. Tidak ada satu pun elemen
bold. `personal-taste-profile.md` dan `CLAUDE.md` sama-sama menyebut identitas project ini
**"Extreme Bold Typography"**.

Ini bisa diketahui sebelum membangun dengan satu perintah `ls` pada folder font.

### "font family jelek tidak sesuai konsep" → dipilih dari frekuensi, bukan dari konsep

Saya menyusun opsi berdasarkan hitungan kemunculan famili di 147 entri `references/library/`:
Host Grotesk 20×, Instrument Serif 9×. Yang tidak saya periksa: apakah famili itu cocok dengan
**konsep halaman ini** — thermal readout, brutalis, dark cinematic.

Instrument Serif adalah serif editorial bergaya Times — anggun, kontras tinggi, bertulang halus.
Itu kosakata majalah sastra, bukan kosakata instrumen termal. Frekuensi tinggi di library hanya
membuktikan famili itu dipakai di situs yang Billy suka, bukan bahwa ia benar untuk brief ini.

Billy memilih dari dua opsi yang saya susun. Opsi itu disusun dari data yang salah dimensinya —
itu kesalahan saya dalam menyusun pilihan, bukan kesalahan dalam memilih.

## Tes anti-slop yang gagal

- **OBJECT** — gagal. Objek yang paling menonjol di bidang adalah cacat (echo teks).
- **WOW** — gagal.
- **SWAP** — lolos untuk pertama kalinya: nama adalah masthead full-bleed, menggantinya mengubah
  komposisi. Ini satu-satunya yang membaik.
- **EMPTY** — lolos bersyarat: medan termal punya struktur, tetapi strukturnya dibaca sebagai
  banding.

## Sinyal taste baru

1. **Echo/jejak panas di bawah teks besar dibaca sebagai duplikat, bukan sebagai bayangan.**
   Ambang terukur: pita kedua setinggi 91 px dengan luma 3–5× ground sudah cukup untuk terbaca
   sebagai teks kedua.
2. **"Tidak bold" adalah keluhan tentang rentang weight yang tersedia, bukan tentang ukuran.**
   Masthead 274 px tetap disebut monoton karena tidak ada kontras weight di mana pun di halaman.
3. **Kecocokan konsep mengalahkan frekuensi di library.** Famili yang sering muncul di referensi
   favorit bisa tetap salah untuk brief tertentu.
4. **Metrik yang saya tetapkan sendiri bisa dioptimasi ke arah yang salah.** Kerapatan tepi
   4,5–6,9% tercapai lewat banding, bukan lewat kontur bermakna.

## Rule baru

Empat, di-append ke `anti-slop-rules.md`.

## Akhir rute

Billy: *"hapus saja hero-explore-3"*. Dihapus 2026-07-26 setelah empat iterasi dan empat
penolakan berturut-turut pada rute yang sama.

Dihapus dari repo: `app/pages/hero-explore-3.vue`, `app/hero-explore-3/ThermalHero.vue`,
`app/composables/useThermalField.ts` (1.192 baris), `public/assets/fonts/host-grotesk/`, dan dua
blok `@font-face` Host Grotesk di `main.css`. Build turun dari 19 ke 18 rute; typecheck · lint ·
build hijau, nol referensi tersisa.

Yang **tidak** dihapus: screenshot di `assets/`, keempat failure note, dan aturan yang lahir
darinya. Rute ini menghasilkan `scripts/ink-audit.mjs` dan sembilan aturan anti-slop — itu yang
bertahan.

### Yang perlu dicatat untuk arah berikutnya

Empat penolakan pada rute yang sama, masing-masing dengan sebab berbeda: tipografi tidak terbaca →
tabrakan tinta → font tanpa weight → cacat render. Setiap perbaikan menyelesaikan keluhan
sebelumnya dan membuka yang baru. Itu pola rute yang **fondasi konsepnya** tidak disepakati, bukan
pola eksekusi yang kurang teliti — dan menambah iterasi kelima tidak akan mengubahnya.

`anti-slop-rules.md` sudah memuat aturan "Darkroom guardrail — 2-iteration limit". Rute ini
mencapai empat. Aturannya ada; tidak dijalankan.
