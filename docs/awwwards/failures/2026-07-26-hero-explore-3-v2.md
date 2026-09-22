---
type: failure
slug: hero-explore-3-v2
date: 2026-07-26
route: /hero-explore-3
verdict_by: billy
severity: partial
what_survived: pairing tipografi (Instrument Serif + Satoshi), italic selektif, logo di nav
what_died: bentuk shader, layout logo (tabrakan), copy HUD, pilihan famili masthead & body
---

# hero-explore-3 v2 — iterasi kedua

![tabrakan logo pada 1440x780](assets/2026-07-26-hero-explore-3-v2-overlap.png)

## Verdict Billy — verbatim

> "shader bentuknya masih kaku jelek tolong buat bentuk shade thermal nya lebih natural terapkan
> kinetic atau hukum fisika agar motion natural dan fluid silahkan riset dan update skills agar
> lebih baik eksekusinya, dan lihat oleh anda sendiri logo terlalu besar dan menabrak text
> frontend enginer apa ini kualitas awwwards? tolong perbaiki claude md atau skills awwwards saya
> agar hal seperti ini tidak terus terjadi terutama ui yang dihasilkan tidak pernah di check,
> saya ingin ganti font family billy maulana dan juga ganti font seven years, ganti frame time
> dengan content yang bermanfaat juga ganti n 003 karna itu tidak penting."

## Kegagalan utama: UI tidak pernah diperiksa, hanya dilihat

Ini kritik proses, dan yang paling penting dari seluruh penolakan.

**Terukur, bukan opini.** Pada viewport 1440×780 — laptop 1440×900 dengan toolbar browser, salah
satu ukuran paling umum di dunia — logo menabrak eyebrow:

| Elemen | Nilai |
|---|---|
| `.th-logo` bottom | 176 px |
| `.th-eyebrow` top | 154 px |
| **Gap** | **−22 px** (tumpang tindih) |
| Luas tabrakan | **2.247 px²** |

Ambang tabrakan sebagai fungsi tinggi viewport: `.th-lockup` diposisikan `top: 50%` dengan
`translateY(-52%)`, sementara `.th-logo` diposisikan absolut dari atas. Keduanya bergerak ke arah
berlawanan saat viewport memendek. Titik potongnya di **tinggi ≈ 830 px** — di bawah itu, selalu
menabrak.

Saya menguji **dua** viewport: 1440×900 dan 390×844. Kebetulan keduanya berada di sisi aman dari
ambang. Setiap laptop 13–14 inci dengan toolbar browser jatuh di sisi yang gagal.

### Kenapa lolos: saya melihat screenshot, bukan mengukur

Setiap iterasi saya akhiri dengan screenshot dan penilaian mata. Screenshot pada 1440×900 memang
terlihat benar — gap 38 px, tidak ada yang menabrak. Yang tidak pernah saya lakukan:

1. Menguji lebih dari dua viewport.
2. Mengukur bounding box antar elemen secara terprogram.
3. Menghitung pada tinggi berapa layout mulai rusak.

`taste-lint` punya 15 rule dan **tidak satu pun memeriksa geometri antar elemen.** Ia memeriksa
tracking, leading, rasio, measure, opacity, easing — semua properti dari satu elemen, tidak pernah
hubungan antar dua elemen. Layout yang saling menimpa lolos dengan skor 15/15.

Jawaban untuk pertanyaan Billy — *"apa ini kualitas awwwards?"* — tidak. Usability adalah 30% bobot
penilaian Awwwards, dan elemen yang saling menimpa pada viewport umum adalah kegagalan dasar yang
akan terlihat juri dalam tiga detik pertama.

## Diagnosis lewat adjective decoder

### "shader bentuknya masih kaku" → motion tanpa hukum fisika

Rujukan decoder: `references/editorial/03-art-direction.md` §7C, baris **"tidak harmoni" (d)**:
*motion CSS dan motion WebGL punya easing berbeda* — tapi masalahnya lebih dalam dari easing.

Yang saya bangun **bukan simulasi fluida**. Ia adalah:

- Medan kecepatan dari **curl noise yang di-resample tiap frame** — bukan state yang berevolusi.
- Konveksi sebagai **konstanta** (`flow.y += 0.42`), bukan gaya apung yang lahir dari suhu.
- **Tanpa umpan balik**: aliran mendorong panas, tapi panas tidak pernah mempengaruhi aliran.
- **Tanpa proyeksi divergence-free**, **tanpa vorticity confinement**, **tanpa tekanan**.

Konsekuensinya persis yang Billy rasakan: bentuknya berubah, tapi tidak pernah terasa *disebabkan*
oleh apa pun. Pola bergeser karena domain noise digeser, bukan karena ada yang mendorongnya.

Ironisnya, repo ini **sudah punya** implementasi Navier-Stokes lengkap di
`app/composables/useFluidSimulation.ts` (1.942 baris, port Pavel Dobryakov) dengan divergence,
tekanan Jacobi, dan vorticity confinement. Saya menulis simulasi baru dari nol dengan curl noise
alih-alih membaca yang sudah terbukti ada di repo — pengulangan pola kegagalan yang sama dengan
blok Fonts pada iterasi sebelumnya.

### "logo terlalu besar"

`clamp(104px, 9vw, 138px)` menghasilkan 130 px pada 1440. Logo B/M berbentuk bujur sangkar, jadi
tingginya juga 130 px — **7,5× tinggi eyebrow** (17 px) yang duduk tepat di bawahnya. Tidak ada
referensi di `references/library/` yang menaruh logo sebesar itu di sudut; median lebar wordmark
pada 24 entri yang diperiksa berada di 96–132 px untuk wordmark **horizontal**, bukan lockup
bujur sangkar.

### "ganti frame time" · "ganti N° 003"

Keduanya adalah metadata tentang implementasi itu sendiri — persis baris **"AI slop" (c)** di
decoder: *metadata tentang implementasi sendiri dijadikan konten*.

Saya membelanya di failure note sebelumnya sebagai "angka yang jujur". Kejujuran teknis bukan
alasan untuk menempati salah satu dari empat sudut layar pada portofolio. Sudut itu seharusnya
memuat sesuatu yang berguna bagi orang yang sedang menimbang apakah akan menghubungi Billy.

## Yang bertahan

- Pasangan **Instrument Serif + Satoshi** (kontras skeleton, x-height selisih 0,4%) — tidak
  dikomentari negatif, tapi Billy minta **famili masthead dan body diganti**. Prinsip pairing-nya
  yang bertahan, bukan pilihan familinya.
- **Italic selektif** pada kapital awal.
- Logo menggantikan teks di nav (ukurannya yang salah, bukan keputusannya).

## Perubahan proses yang dibuat setelah ini

1. Script `layout-audit.mjs` — memeriksa tabrakan bounding box antar elemen di **7 viewport**,
   termasuk 1440×780 dan 1366×768 yang selama ini terlewat.
2. Gate baru di `CLAUDE.md` dan `SKILL.md`: klaim selesai untuk kerja visual **wajib** melampirkan
   hasil audit multi-viewport, bukan screenshot satu ukuran.
3. Aturan di `anti-slop-rules.md`: dilarang menulis simulasi fisika baru sebelum memeriksa
   composable yang sudah ada di repo.
