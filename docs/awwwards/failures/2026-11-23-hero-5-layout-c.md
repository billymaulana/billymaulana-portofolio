---
type: failure
slug: hero-5-layout-c
date: 2026-11-23
route: /hero/hero-5
concept: Layout hero styleframe c tanpa foto dan tanpa liquid — nama Cabinet Grotesk 800 dua baris selebar 12 kolom, tagline italic kiri atas, tiga blok meta di bawah
verdict: "ternyata jelek hapus saja hero 5" — "alasannya font heronya jelek"
severity: deleted
style_attempted: [editorial, swiss]
fonts_used: [Cabinet Grotesk, PP Editorial New]
technique_level: 1
screenshot: assets/2026-11-23-hero-5-layout-c-desktop.png
rule_added: "Font display hero DILARANG dipilih agen atau dari pengukuran saja; sebelum styleframe, kandidat font ditunjukkan ke Billy sebagai spesimen 'Billy Maulana' pada skala hero dan ia memilih. Cabinet Grotesk ditolak sebagai font hero."
---

# Hero 5 — layout c tanpa foto dan liquid

Bukti: `assets/2026-11-23-hero-5-layout-c-desktop.png` (1440×900) dan `-mobile.png` (390×844). Ini keadaan sesudah
permintaan Billy sebelumnya, *"hapus saja grid ungunya"*. Pil "38 ms" di tengah bawah adalah tombol Nuxt DevTools.
Rute dihapus setelah screenshot diambil.

## 1. Kutipan verbatim

> "ternyata jelek hapus saja hero 5"
>
> "alasannya font heronya jelek"

Permintaan awal: *"tolong tambahkan di pages seperti hero c tapi tanpa foto dan liquid hanya layout"*.

## 2. Apa yang dibangun

- Nama "Billy / Maulana" dalam Cabinet Grotesk 800 (Fontshare, variable), krem `#FFF5B3`, tracking −0,02 em, leading 0,9. "Maulana" di-fit ke 12 kolom (377 px di 1440×900).
- Tagline dalam PP Editorial New Italic 22 px. Meta dalam Cabinet Grotesk 500 14 px, α 0,72.
- Ground `#050507` polos, tanpa gambar, efek, atau gerak.
- Gate geometri (layout, ink, align) HIJAU di 9 viewport. Baseline dalam ±0,5 px dari type-spec frame c.

## 3. Diagnosis jujur

Alasan Billy spesifik: **font hero-nya jelek**. Diagnosis pertama saya menyalahkan kerangka layout, dan itu tebakan yang
tidak didukung kata-katanya. Sudah dikoreksi di sini.

**Cabinet Grotesk muncul di rute ini lewat jalur yang salah**
- Agen styleframe c memilihnya karena tidak ada di tabel font-ditolak.
- Pengukurannya hanya untuk leading, tracking, dan fit-to-width.
- Billy tidak pernah melihatnya sebelum frame jadi.
- Dua penolakan berturut-turut menyebut font: c *"jelek font bentuk shape tidak jelas"*, lalu hero-5 *"alasannya font heronya jelek"*.
- Pengukuran membuktikan font itu dipasang dengan benar, tidak membuktikan font itu indah bagi Billy.

**Apa yang terlihat pada font itu di 377 px**
Cabinet Grotesk 800 adalah grotesk bertubuh lebar dengan detail lunak:
- ekor "y" melengkung bulat;
- "a" dua tingkat dengan mangkuk besar;
- terminal tumpul;
- kaki "M" yang melebar.

Pada skala hero, detail itu memberi karakter ramah dan bulat. Itu bukan karakter tajam/brutal/editorial yang ada di
referensi Billy: grotesk padat terkondensasi, grotesk ekstensi bertepi tajam, atau serif kontras tinggi. Ini pembacaan saya
atas bentuknya, bukan kata-kata Billy.

**Polanya**
Font display ditolak berulang dengan kata yang mirip:
- *"pemilihan fontnya juga jelek"* (SPECIMEN 001);
- *"font terlalu monoton tidak bold dan font family jelek"* (hero-explore-3 v4);
- *"typography jelek"* (Concept 1);
- *"font bentuk shape tidak jelas"* (c);
- *"font heronya jelek"* (hero-5).

Setiap kali, font dipilih oleh Claude atau agen dari inventaris, frekuensi library, atau pengukuran. Billy tidak pernah
memilih dari spesimen visual.

## 4. Sinyal taste yang didapat

- Bentuk font display adalah keputusan taste Billy sendiri yang belum pernah ia buat secara eksplisit di proyek ini. Pengukuran (rasio tinta, stem:cap) tidak bisa menggantikannya.
- Cabinet Grotesk tidak cocok sebagai font hero.
- Arah "sosok Billy + nama" (c) tetap paling dekat. Yang gagal adalah fontnya, bukan sosoknya.

## 5. Rule baru

Font display hero DILARANG dipilih agen atau dari pengukuran saja. Sebelum styleframe, 4–6 kandidat font ditunjukkan ke
Billy sebagai spesimen "Billy Maulana" pada skala hero (satu halaman pembanding, label netral), dan Billy memilih.
Cabinet Grotesk ditolak sebagai font hero.
