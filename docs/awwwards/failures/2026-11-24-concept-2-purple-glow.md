---
type: failure
slug: concept-2-purple-glow
date: 2026-11-24
route: /explore/concept/2
concept: Korona ungu yang memancar dari siluet sosok (dan dua percobaan sebelumnya: glow "bara" di balik nama, noda cairan/sapuan ungu) sebagai jawaban atas "foto masih tempelan"
verdict: "saat diam glow ungu tersebut entah mengapa saya merasa jelek dan sangat slop"
severity: rejected
style_attempted: [thermal, glow, outer-glow]
fonts_used: [Bebas Neue, Satoshi]
technique_level: 1
screenshot: assets/2026-11-24-concept-2-purple-glow-desktop.jpg
rule_added: "Tanpa glow, aura, korona, atau gradien kabur di sekitar sosok saat diam. Latar yang 'cocok' harus berupa gambar berisi (foto, tekstur, bentuk), bukan gradien."
---

# Concept 2 rute hero — glow ungu saat diam

Bukti: `assets/2026-11-24-concept-2-purple-glow-desktop.jpg` (korona, 1440×900),
`assets/2026-11-24-concept-2-purple-glow-variants.jpg` (tiga watak korona: tenang, cair, sapuan),
`assets/2026-11-24-concept-2-purple-glow-ember.jpg` (glow "bara" di balik nama, percobaan pertama).
Billy melihatnya di rute hidup saat saya masih mengganti-ganti latar.

## 1. Kutipan verbatim

> "saat diam glow ungu tersebut entah mengapa saya merasa jelek dan sangat slop"

## 2. Apa yang dibangun

Sesudah verdict "tempelan", saya menambah latar bersuhu sendiri di balik sosok, di texture konten yang sama:
(1) glow elips kabur di kiri atas, (2) rekaman cairan yang dikompres ke ungu, (3) goresan noise horizontal, lalu
(4) korona: jarak ke matte sosok dipetakan ke suhu (jangkauan 0,72 unit wajah, puncak 0,72, dikali noise plasma),
ditambah kabut 0,10. Semuanya tampil saat diam.

## 3. Diagnosis

Baris "AI slop" di adjective decoder §7C:

| Butir decoder | Terukur |
|---|---|
| (a) teknik Level 0–1 sebagai visual utama | korona = falloff jarak dari matte yang dikaburkan, sama dengan gaya lapis "outer glow"; kerapatan tepi di dalam glow 0,68% (lantai detail `effect-audit` 2%) |
| (d) simetri sempurna tanpa pelanggaran | pancaran mengikuti kontur sosok secara merata di seluruh keliling |
| (e) efek sebagai overlay, bukan konten | glow tidak membawa isi apa pun; dihapus, tidak ada informasi yang hilang |

- Luas glow yang terlihat 18,1% frame (di atas ambang beda 5%), satu hue (ungu), tanpa struktur.
- `effect-audit --idle`: cakupan idle naik dari 29,32% ke 46,03%.
- **Saya melanggar tiga hal yang sudah tertulis.** Prinsip 1 master brief ("cahaya datang dari subjek, tidak dari gradien
  latar"), larangan "efek yang menyala sendiri saat diam", dan aturan yang saya tulis sendiri beberapa jam sebelumnya
  ("ground tetap hitam tanpa kabut ambien").
- **Salah baca referensi.** Dari hero #8 saya mengambil "ada glow di belakang sosok". Yang membuat #8 menyatu adalah sosok
  yang benar-benar difoto dalam cahaya itu (rim dan bayangan konsisten), huruf yang berlapis dengan sosok, dan elemen di
  sekelilingnya. Glow yang ditempel di belakang potongan hanya meniru gejalanya.
- **Salah baca "background images".** Ia menulis gambar latar; folder `reference style concept/background/` dan `texture/`
  berisi gambar berisi (bentuk cair, riak halftone, gradien berbutir kasar). Saya memberi gradien halus.
- **Cara kerja.** Empat percobaan latar saya uji langsung di rute yang sedang ia tonton, tanpa konsep dan tanpa
  styleframe. Ia melihat keadaan setengah jadi.

## 4. Tes yang gagal

SWAP gagal (glow ungu di belakang potret bisa dipasang di portofolio siapa pun). NEIGHBOR dan WOW gagal menurut kata Billy.

## 5. Sinyal taste

- Glow ungu lunak di sekitar sosok saat diam = "jelek dan sangat slop", walau ia pernah menyukai "vibrant deep ungu dengan
  glow" pada referensi lain. Yang ia sukai di sana bukan aura di sekeliling potongan.
- Keadaan diam harus bersih. Ini konsisten dengan "single dulu saja jika ada interaction baru ada effect".
- Ia menambahkan sendiri lapisan grain film di atas semua hero ("itu saya menambah grain agar lebih detail"): detail
  permukaan penting baginya, dan grain itu tidak boleh ditimpa atau digandakan.

## 6. Rule baru

- Tanpa glow, aura, korona, halo, atau gradien kabur di sekitar sosok saat diam. Cahaya tambahan hanya boleh lahir dari
  interaksi dan hilang bersamanya.
- "Latar yang cocok" berarti gambar berisi (foto, tekstur berbutir, bentuk) yang punya detail terukur (kerapatan tepi
  ≥ 2%), bukan gradien.
- Eksplorasi arah tidak dilakukan di rute hidup. Arah baru ditunjukkan sebagai styleframe diam; rute hanya berubah
  sesudah Billy memilih.
