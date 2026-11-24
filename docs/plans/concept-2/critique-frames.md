# Kritik styleframe — Explore Concept 2

Kritikus: agen Fable, tahap styleframe (tanpa browser, tanpa audit DOM). Tanggal 2026-11-23.
Yang dinilai hanya sembilan JPG dan crop 2×-nya; teks konsep dipakai sebagai pembanding, bukan sebagai pembela.
Angka porsi warna di bawah adalah taksiran piksel kasar dari JPG (ambang hitam max-channel < 40, zona menurut hue), bukan `thermal-zones`.
Prediksi tersegel belum ditulis ke `calibration/predictions.jsonl` karena tugas ini melarang mengubah file lain; baris tabel di bawah bisa disalin ke sana.

| konsep | A | T | min | uji gagal | prediksi Billy | kalimat verdict yang mungkin |
|---|---|---|---|---|---|---|
| a — Kaca Sentuh | 5,7 | 4,7 | **4,7** | OBJECT, SWAP, EMPTY, WOW | reject | "design ini ai slop" · "text effect jelek" |
| b — Piksel Pijar | 6,0 | 5,1 | **5,1** | SWAP (hero), WOW (hero), NEIGHBOR (splash vs hero tidak terasa satu karya) | reject hero, splash mungkin dipuji | "text effect jelek, dan detail pada liquid saya kurang suka" |
| c — Bidang Depan | 6,2 | 5,4 | **5,4** | WOW; OBJECT lolos tetapi objeknya cacat | reject | "fotor saya thermal juga tidak rapih. semua yang saya lihat tidak aesthetic." |

Tidak ada konsep yang mendekati gate 8,0. Tidak ada frame hero yang bisa duduk di sebelah sheet-2/sheet-4 tanpa terlihat lebih murah; satu-satunya frame yang bisa adalah splash b.

Rincian skor:

| konsep | Design | UX | Creativity | Content | Taste | Anti-Slop | Editorial | Mood | Novelty |
|---|---|---|---|---|---|---|---|---|---|
| a | 5 | 6,5 | 5,5 | 6 | 5 | 4 (plafon 6) | 6 | 3 (plafon: template efek teks) | 5 |
| b | 5,5 | 6 | 6,5 | 6,5 | 5,5 | 5 (plafon 6) | 5,5 | 3 (plafon: ramai + template efek teks) | 6 |
| c | 5,5 | 7 | 6 | 7 | 5 | 5 (plafon 6) | 6,5 | 5 | 6 |

## a — Kaca Sentuh

### Yang terlihat (per frame)

**splash-1440x900** — 3 detik pertama: gumpalan panas magenta-violet di kiri atas, dan di dalamnya huruf "Bil" timbul; "ly" dan "Maula" hanya garis luar indigo yang nyaris hilang. Ini frame terbaik konsep a dan satu-satunya tempat ide "benda bening yang baru tampak saat panas lewat" terbaca: panasnya berbentuk bebas, hurufnya tidak berwarna sendiri. Tetapi bahkan di sini hurufnya terbaca sebagai timbul/emboss di atas permukaan, bukan kaca tebal: tidak ada pergeseran atau pembesaran latar yang terlihat di tepi huruf.

**hero-1440x900** — 3 detik pertama: nama ungu-oranye dengan garis kuning di dalam dan pendar indigo di sekelilingnya. Terbaca sebagai papan neon / layer style Photoshop (Bevel & Emboss "Chisel Hard" + Inner Stroke + Outer Glow). Ide konsep TIDAK terbaca: tidak ada yang bening, tidak ada yang dibiaskan, tidak ada tanda sentuhan. Panas mengikuti bentuk huruf persis (halo 20–40 px di luar tiap glyph), sehingga otak membacanya sebagai isian + glow, bukan cairan di bawah kaca.

**hero-390x844** — 3 detik pertama: lockup "Billy" besar di atas "Maulana" kecil dengan pendar; terbaca sebagai stiker/logo neon. 55% layar hitam kosong di atas dan bawah lockup tanpa fungsi.

Efek template yang terbaca: bevel-emboss (ya, kuat), neon glow (ya), stiker (ya, di ponsel).

Cocok dengan type-spec: posisi dan fit benar (Maulana x≈287–1376, meta kiri berbagi baseline 629). Yang meleset dari yang dijanjikan: shortlist meminta kerning pasangan manual, spec mengaku tidak ada; "pita kaustik inti ≈1 px" terlihat sebagai garis 2–3 px seragam; "noda/gores permukaan" tidak terlihat sama sekali di crop 2×. Hitam ≈75% dan kuning ≈4% dari bidang berwarna, kuota terpenuhi.

### Cacat terbesar

1. **Bevel berpotongan miter** — sudut tiap batang (mis. titik i di x≈315–380 y≈215–250, batang l x≈395–450, sudut kiri atas B di (64,215)) menunjukkan garis diagonal 45° khas chisel. Arahan art director menulis "bila terbaca sebagai bevel/emboss Photoshop, frame gagal"; ini terbaca persis begitu.
2. **Garis kaustik seragam** — garis kuning-oranye menyusuri sisi dalam semua huruf dengan lebar dan terang yang sama (B, M, tiap a di x 900–1376). Kaustik nyata bergantung pada cahaya di bawahnya; ini terbaca sebagai tabung neon / inner stroke.
3. **Panas berbentuk huruf + halo luar** — pendar indigo mengikuti kontur nama di seluruh hero (paling jelas di bawah "Maulana" y≈640–660 dan kanan "y" x≈600). Menghapus seluruh premis kaca. Tambahan: di splash, batang l kedua (x≈478–545, y≈130–370) berisi bidang hitam bertepi vertikal keras — terbaca sebagai bug render, bukan kaca tanpa panas.

Cacat lain: di ponsel dua baris berbeda ukuran (178 vs 87 px, rasio Maulana 6,7×); tiga tanda "+" di y=64 tidak mengunci apa pun.

### Revisi prioritas (satu putaran)

1. **Hero memakai logika splash: panas tidak berbentuk huruf.** Hapus halo luar seluruhnya. Ganti residu dengan 3–4 kolam elips bebas (lebar 300–500 px) yang melampaui tepi huruf 80–200 px dan membiarkan ≥ 35% luas huruf tanpa panas; di bagian itu huruf hanya rim C1–C2 1 px.
2. **Profil bevel dibulatkan.** Lebar bevel 0,055 → 0,11 em, profil seperempat lingkaran penuh, heightmap di-blur 0,02 em sebelum Sobel agar miter sudut hilang; "garis gelap tepi 50%" dihapus.
3. **Kaustik bergantung panas.** Intensitas = suhu lokal × divergensi normal; lebar 0,5–3 px tidak seragam; hanya muncul di atas suhu ≥ C4; krem C9 hanya di puncak, selebihnya C6; diputus oleh peta noda. Target kuning ≤ 4% bidang berwarna.
4. **Refraksi harus terlihat sebagai diskontinuitas.** Di tepi huruf, fluida di bawahnya tergeser 18–24 px dan diperbesar 1,15× terhadap fluida di luar huruf; tepi luar diberi pinggiran dispersi 3–4 px dari tetangga ramp (C2/C5). Peta noda dinaikkan sampai terlihat di crop 2×.
5. **Ponsel:** dua baris ukuran sama (fit "Maulana" 358 px), skala dibawa oleh kolam panas (≈358 × 500 px) dan bukan oleh ukuran huruf; perbaiki bidang hitam di batang l splash.

Bisa diselamatkan dalam satu putaran? Mungkin naik ke "revise", tidak ke "ship". Butir 1 dan 2 adalah syaratnya; tanpa keduanya frame tetap neon-bevel.

## b — Piksel Pijar

### Yang terlihat (per frame)

**splash-1440x900** — 3 detik pertama: satu benda persegi berpijar putih di tengah gelap, dengan kerak, butir, dan satu lidah cair menetes di bawahnya. Ini frame paling sinematik dan paling "mahal" dari sembilan: satu subjek menyala di ground hitam (§2.1), panas mengikuti volume (§2.2), permukaan tidak bersih (§2.5). Bisa duduk di sebelah keluarga thermal imaging sheet-2. Tetapi ia terbaca sebagai nampan/tungku/pelat panas yang difoto kamera termal, bukan sebagai piksel: bentuknya trapesium berperspektif dengan bibir tepi (sudut di (350,190), (1060,190), (1085,590), (350,590)). Ide "piksel = titik huruf i" tidak terbaca dari frame ini sendirian.

**hero-1440x900** — 3 detik pertama: nama serif tebal berisi pita kuning-oranye-ungu, dengan enam kepulan asap ungu naik dari huruf, dan satu kotak putih di atas i. Terbaca sebagai "teks terbakar" / flame text + inner-glow kontur. Titik i persegi tertangkap sebagai keanehan, tetapi tanpa splash tidak ada yang menghubungkannya dengan "piksel asal"; ia datar `#FFFEF5` tanpa material, kontras dengan benda berkerak di splash.

**hero-390x844** — 3 detik pertama: asap besar di atas "Billy" serif menyala, "Maulana" setengah ukuran di bawahnya. Lebih ramai daripada desktop relatif terhadap luas layar; kuning-krem ≈16% bidang berwarna (termasuk meta), di atas kuota 12%.

Efek template yang terbaca: flame text (ya, kuat), neon/inner glow berpita (ya). Splash: tidak ada; mendekati "foto termal" tetapi sebagai benda, bukan potret.

Cocok dengan type-spec: ukuran, baseline, dan saluran sesuai. Yang perlu dicatat: celah tinta Billy–Maulana 0,6 px (diakui) terlihat sesak di ekor "y" (≈(520,560)); spec menyebut plume tidak melewati kotak tinta meta, benar, tetapi plume besar dari "l" Maulana (x≈590–830, y≈220–600) menyentuh lengan kanan "y" Billy di ≈(600–625, 370–400); meta memakai dua ukuran (16 dan 14) sehingga halaman punya tiga ukuran teks kecil-menengah.

### Cacat terbesar

1. **Enam plume saat diam** — di atas B (x≈140), i (x≈330), l (x≈480), l Maulana (x≈700, tinggi ≈380 px), n (x≈960), a (x≈1140). Ramai, melanggar "satu subjek", dan sebagai keadaan hero diam ia melanggar "efek menyala sendiri saat diam" serta "hero diam tidak menyala sendiri". Pangkal plume terpotong keras oleh tepi huruf sehingga terbaca tempelan.
2. **Pita isoterm konsentris di dalam setiap batang** — empat pita keras (tepi C3, C5, C6, inti C8–C9) yang sejajar kontur glyph di seluruh nama. Ini pola "thermal ink di-clip ke letterform" (2026-09-21) dan "Instrument Serif + isoline termal" (v4, dihapus). Tekstur kerak di inti (terlihat di crop 2×) bagus tetapi kalah oleh kontur.
3. **Splash dan hero bukan satu benda** — splash: objek bermaterial berperspektif; hero: persegi putih datar 48 px tanpa rim, kerak, atau pendar. Janji splash tidak ditepati hero. Ditambah setengah-kotak saluran di kanan (x 740–1408, y 514–800) yang terbaca sebagai bingkai kosong di sekitar meta.

### Revisi prioritas (satu putaran)

1. **Hero diam tanpa plume.** Hapus keenamnya. Bila harus ada satu jejak, hanya satu, dari titik i, tinggi ≤ 260 px, C1–C4, dan hanya sebagai sisa splash yang sedang habis.
2. **Ganti pita kontur dengan satu gradien lintas-nama.** Badan huruf = kerak gelap C2–C3 bertekstur retak; panas hanya menembus retakan dan memudar menurut jarak geodesik dari titik i (penuh di "i", turun ke C3 di "M" dan "a" terakhir). Tidak ada pita sejajar kontur. Target kuning-krem ≤ 6%.
3. **Titik i memakai material splash.** 48 → 64–72 px, dengan bibir tepi, kerak, inti putih, dan pendar radius 40 px C1–C3; ia harus dikenali sebagai benda yang sama.
4. **Splash terbaca piksel.** Hadap-depan, bujur sangkar, sudut 90° tajam, tanpa perspektif nampan; buang percik di luar badan (≥ 12 titik, mis. (70,598), (330,548), (1100,527)); inti putih ≤ 8% frame; lidah cair dipertahankan.
5. **Rapikan struktur.** Buang setengah-kotak saluran (sisakan satu garis baseline atau tidak sama sekali); leading dinaikkan sampai celah ekor "y" ≥ 12 px; ponsel dua baris ukuran sama; meta satu ukuran.

Terus terang: **hero b tidak bisa diselamatkan dengan mengubah parameter.** Dengan plume ia flame text ("text effect jelek", 2026-09-22); tanpa plume ia gradien di dalam huruf ("jelek … saya ingin plasma seperti liquid-2", 2026-09-21). Kedua ujungnya sudah ditolak. Satu-satunya jalan dalam satu putaran adalah butir 2 + 3 dikerjakan bersama, yaitu mengubah struktur keadaan diam menjadi "coran yang mendingin dengan satu sumber", dan itu praktis konsep hero baru yang meminjam splash.

## c — Bidang Depan

### Yang terlihat (per frame)

**splash-1440x900** — 3 detik pertama: nama raksasa indigo tua di atas hitam, dan dari "y" mengalir plasma ungu-oranye dengan satu garis kuning tajam di dalamnya. Ini frame yang paling dekat dengan kata-kata Billy ("vibrant deep ungu", "plasma seperti ini", "typography full width … bold"). Tetapi sosok Billy tidak terlihat sama sekali, sehingga garis kuning terbaca sebagai retakan/petir acak, dengan lonjakan vertikal tak beralasan di x≈1100–1130, y≈450–590 (profil hidung yang tidak dikenali). Plasma menutup "lana" (x≈780–1390, y≈520–700).

**hero-1440x900** — 3 detik pertama: "Billy Maulana" krem raksasa selebar frame, dan di kanan atas sepotong kepala berwarna termal yang mengambang. Tata letaknya paling poster dan paling tenang dari tiga konsep. Ide konsep (bidang nama menembus sosok) TIDAK terbaca: yang terlihat adalah foto wajah bergradien termal yang dipotong di rahang, tanpa leher dan bahu, di sebelah teks. Sosok yang dijanjikan (bust 92% tinggi frame) tidak ada; kepala hanya ≈520 px.

**hero-390x844** — 3 detik pertama: kepala termal mengambang di atas, nama krem di bawah. Tidak ada tembus-menembus sama sekali; ini potret termal + nama. Rasio display:meta 8,4× (diakui di bawah 10×).

Efek template yang terbaca: foto termal (ya, kuat, di kedua hero). Bevel, neon, flame: tidak.

Cocok dengan type-spec: Cabinet Grotesk 800, 378,3 px, leading 0,90 di atas lantai tinta 0,850, tracking −0,02, tiga blok meta di satu baseline — semuanya sesuai yang terlihat, dan ini tipografi paling rapi dari tiga konsep. Yang meleset: oklusi "9,3% luas y" terlihat sebagai gigitan bergerigi; nama krem solid ≈59% dari bidang berwarna di desktop (≈34% di ponsel) terhadap kuota kuning-putih ≤ 12%; "sosok hanya diterangi garis potong" tidak benar di hero, hampir separuh kepala hangat.

### Cacat terbesar

1. **Potret = foto termal yang ditolak, dan tidak rapi.** Gradien hangat menaik dari garis potong menutupi ±45% kepala (dagu oranye, dahi indigo): panas mengikuti sumbu vertikal, bukan volume (§2.2 gagal), dan arahan "sosok bukan foto termal, tidak ada posterize rata" dilanggar. Matte rambut bergerigi di kontur atas (x≈700–1360, y≈70–260) dan ada tonjolan tak terbaca di kanan (x≈1310–1360, y≈240–440). Mulut dan hidung lumer di crop 2×.
2. **Kepala terpenggal mengambang.** Bagian di belakang bidang dirender hitam, sehingga wajah berakhir di tepi rahang dengan takik vertikal di ≈(1125, 440–490). Tanpa leher/bahu ia terbaca sebagai topeng atau gumpalan, bukan orang di belakang antarmuka.
3. **Tidak ada interpenetrasi yang terlihat.** Satu-satunya oklusi adalah tepi bergerigi pada lengan kanan "y" (x≈665–690, y≈255–350) yang terbaca sebagai kerusakan huruf. Di ponsel nol. Nama sendiri teks krem datar tanpa material; ia bold dan terbaca, tetapi tidak membawa "efek pada font" yang Billy puji.

### Revisi prioritas (satu putaran)

1. **Sosok menjadi volume gelap, panas hanya di garis potong.** Seluruh potret di C1–C2 (luma maksimum ≤ 0,18), bentuk dibawa oleh luminans rendah; panas C5→C8 hanya dalam pita σ = 10–14 px di sekitar garis potong. Tidak ada gradien hangat lain di wajah.
2. **Tampilkan bust utuh.** Bagian di belakang bidang tetap digambar sebagai volume gelap (tertutup huruf, bukan dihitamkan); kepala + leher + bahu sampai tepi bawah, tinggi 92% frame seperti di teks konsep. Takik rahang hilang dengan sendirinya.
3. **Geser sosok sampai tembus-menembus terbaca.** Pusat kepala ke x≈50–58% sehingga "lly" berada di belakang kepala dengan ≥ 25% luas huruf tertutup (oklusi biner bersih), dan "Maulana" melintas di depan dada; garis potong menyala tepat di tempat huruf masuk. Ponsel: kepala di belakang "Billy", bukan di atasnya.
4. **Matte.** Kontraksi 2 px, feather 1,5 px, rambut dilarutkan ke C0 lewat falloff luma (bukan tepi matte keras), atau crop sehingga puncak rambut keluar frame; buang tonjolan kanan.
5. **Nama diberi material dan plasma dibawa ke hero.** Krem tetap untuk keterbacaan, tetapi huruf dalam radius ≈120 px dari titik tembus menyerap panas (C6–C7) dan tepinya diberi grain/tinta 1 px; satu sisa plasma splash (≤ 15% frame, C1–C4) tertinggal di sepanjang garis potong agar hero tidak kehilangan satu-satunya hal yang membuat splash menarik.

Bisa diselamatkan dalam satu putaran? Hanya bila butir 1–3 berhasil sekaligus, dan itu bergantung pada mutu foto dan depth, bukan pada compositor. Bila foto sumbernya tidak sanggup dibawa 92% tinggi frame dalam keadaan gelap, ganti foto; jangan menambal shader.

## Perbandingan

Dari yang TERLIHAT, c paling dekat dengan taste Billy, tetapi karena kerangkanya dan bukan karena subjeknya: nama bold selebar frame, layout tenang dengan tiga blok meta yang terkunci, dan splash berisi nama indigo tua dengan plasma liquid-2 yang bebas, yaitu tiga hal yang ia sebut suka dengan kata-katanya sendiri. Yang menjatuhkannya adalah satu elemen yang paling ia benci dari Concept 1, potret termalnya sendiri, kali ini terpenggal dan bermatte kasar; selama itu ada, verdict lama hampir pasti terulang kata demi kata. b memiliki satu frame terbaik dari sembilan (splash: benda berpijar, material, sinematik), lalu membuangnya di hero dengan enam asap dan pita kontur di dalam serif, yang terbaca sebagai teks terbakar dan sudah ditolak dua kali dari dua arah. a kalah paling jauh: janji terkuatnya di atas kertas (kaca, refraksi, sentuhan) tidak sampai ke gambar, dan yang tiba adalah bevel pahat, garis neon, dan pendar luar, tiga tanda layer style yang langsung terbaca "ai slop". Bila hanya satu konsep yang mendapat putaran revisi, pilih c dengan syarat potretnya dikerjakan ulang; bila potret tidak bisa bersih, kandidat berikutnya bukan a atau b utuh melainkan kerangka tipografi c dengan benda berpijar dari splash b sebagai satu-satunya objek.

## Putaran 2 (setelah revisi)

Dinilai ulang dari sembilan JPG yang ditimpa (12:43–12:47) dan tujuh crop 2× baru, rubrik dan plafon sama. Porsi warna tetap taksiran piksel kasar.
Tidak ada konsep yang mencapai gate 8,0. Urutan berubah: c tetap di depan dan menjauh, a melompati b.

| konsep | A | T | min | uji gagal | prediksi Billy | kalimat verdict yang mungkin |
|---|---|---|---|---|---|---|
| a — Kaca Sentuh | 6,1 | 6,2 | **6,1** (dari 4,7) | SWAP; WOW lolos di desktop, gagal di ponsel | revise | "typography nya jelek dan tidak terbaca" · "mendekati style saya bentuk ekspresinya tapi overall belum begitu impressive" |
| b — Piksel Pijar | 6,3 | 5,4 | **5,4** (dari 5,1) | WOW, EMPTY (hero tanpa teks = satu kotak kecil) | reject | "text effect jelek" · "kurang impress karna terlalu biasa saja" |
| c — Bidang Depan | 6,8 | 6,5 | **6,5** (dari 5,4) | tidak ada uji 30 detik yang gagal mutlak; WOW di batas | revise | "mendekati style saya bentuk ekspresinya tapi overall belum begitu impressive" · risiko "text billy maulana itu saling bertabrakkan" |

| konsep | Design | UX | Creativity | Content | Taste | Anti-Slop | Editorial | Mood | Novelty |
|---|---|---|---|---|---|---|---|---|---|
| a | 6,5 | 5 | 7 | 6 | 7 | 6 (plafon) | 5,5 | 5,5 | 6,5 |
| b | 6 | 6,5 | 6,5 | 6,5 | 5,5 | 5,5 (plafon 6) | 6,5 | 3 (plafon: tekstur lava di dalam huruf = template efek teks) | 6 |
| c | 7 | 6 | 7,5 | 7 | 6,5 | 6 (plafon: dekorasi marmer magenta) | 6,5 | 7 | 7 |

### a — Kaca Sentuh

Butir revisi:
1. Panas tidak berbentuk huruf — **berhasil**. Halo luar hilang, kolam bebas melampaui huruf. Catatan: bagian huruf tanpa panas tidak tinggal rim 1 px seperti diminta, melainkan diisi indigo rata berbercak ("ula", separuh "B"), sehingga satu kata punya dua bahasa visual (kaca vs. isian datar).
2. Bevel dibulatkan — **berhasil**. Miter hilang; "y" dan "a-n-a" terakhir terbaca tabung kaca.
3. Kaustik bergantung panas — **berhasil**. Tidak ada lagi garis neon seragam; kilau hanya di atas oranye.
4. Refraksi sebagai diskontinuitas — **sebagian**. Terlihat di "y" (x≈440–590, y≈260–430) dan "a" (x≈960–1060); pinggiran dispersi dari ramp tidak terlihat di crop 2×.
5. Ponsel dan bug splash — **gagal**. Dua baris sudah sama ukuran, tetapi "Billy" di ponsel indigo tua di atas hitam dan nyaris tak terbaca; bidang hitam bertepi keras di batang l splash masih ada (x≈480–545, y≈290–370). Splash juga kehilangan kaustiknya dan kini lebih kusam daripada putaran 1.

Tiga alasan utama skor:
- Kacanya sekarang nyata: plasma liquid-2 dibiaskan tabung huruf, tanpa neon dan tanpa bevel pahat.
- Nama kalah oleh cairan: "Billy" separuh tenggelam, "ula" jadi lempeng indigo datar; di ponsel nama depan hampir hilang.
- Tujuh gumpalan dan dua "jamur" plume tersebar tanpa satu fokus; frame mulai ramai dan tetap bisa ditukar ke nama siapa pun.

Terkuat: `a/hero-1440x900.jpg`. Terlemah: `a/hero-390x844.jpg`.

### b — Piksel Pijar

Butir revisi:
1. Hero tanpa plume — **berhasil**. Tinggal satu jejak tipis dari titik i.
2. Gradien lintas-nama menggantikan pita kontur — **berhasil secara struktur, gagal secara rasa**. Panas memang memudar dari "Billy" ke "Maulana", tetapi yang terlihat adalah tekstur retak lava yang di-clip ke huruf: jaring retakan kuning merata di "Billy" (x 32–640), lalu "lana" ungu datar hampir tanpa kejadian. Masih keluarga "thermal ink di dalam letterform".
3. Titik i bermaterial splash — **sebagian**. Inti dan bingkainya ada, tetapi pendar biru berbentuk persegi (≈130 px, sekitar (271,300)) terbaca box-shadow dan menimpa mangkuk "B" serta puncak batang i.
4. Splash terbaca piksel — **berhasil sebagai bentuk, mundur sebagai gambar**. Kini bujur sangkar hadap-depan tanpa percik, tetapi garis tepi 2 px dan pendar luar membuatnya terbaca kartu UI berpijar; material dan kedalaman putaran 1 hilang. Kuning-krem ≈14%, masih di atas 12%.
5. Struktur — **berhasil**. Saluran hilang, leading 1,119, ponsel satu ukuran, meta satu ukuran.

Tiga alasan utama skor:
- Semua yang ramai sudah dibuang, tetapi yang tersisa adalah nama serif bertekstur lava: masih efek teks, hanya lebih tenang.
- Kanan frame kosong (x > 660 di baris atas) dan tidak ada plasma; hero terasa sepi, bukan misterius.
- Splash kehilangan satu-satunya keunggulan konsep ini: benda bermaterial yang sinematik menjadi kotak bergaris tepi.

Terkuat: `b/splash-1440x900.jpg` (tetap, walau turun). Terlemah: `b/hero-390x844.jpg` (nama 84 px di bawah 55% layar hitam kosong).

### c — Bidang Depan

Butir revisi:
1. Sosok volume gelap, panas hanya di garis potong — **berhasil**. Wajah indigo tua, tidak lagi terbaca foto termal; ini perubahan paling menentukan dari sembilan frame.
2. Bust utuh — **berhasil**. Kepala, leher, bahu menerus di belakang huruf; kepala terpenggal hilang.
3. Tembus-menembus terbaca — **berhasil, dengan harga**. Kepala kini menutup "l" keempat dan lengan "y"; ide konsep terbaca tanpa penjelasan. Harganya: "Billy" terbaca "Bill" + pecahan (desktop x≈490–660, y≈200–510; ponsel "y" hampir habis tertutup pita).
4. Matte — **berhasil**. Rambut larut ke hitam, tidak ada tepi bergerigi.
5. Material nama dan plasma — **sebagian**. "lly" menyerap kuning-oranye (terlihat), tetapi plasma yang dibawa ke hero adalah marmer magenta bertepi keras satu warna (x≈730–1140, y≈340–670) yang tidak sebahasa dengan ramp termal dan terbaca ornamen tempelan. Nama krem masih ≈68% bidang berwarna di desktop.

Catatan baru: garis potong menebal menjadi pita ≈30 px yang melintang di pipi dan hidung; kuat sebagai gambar, tetapi di tepi "light painting"/neon. Wajah di crop 2× lunak dan beresolusi rendah; gelap menutupinya sekarang, build tidak akan.

Tiga alasan utama skor:
- Satu-satunya konsep yang idenya terbaca dari gambar dan hanya bisa milik Billy: wajahnya sendiri di belakang namanya, satu garis panas di tempat keduanya bertemu.
- Nama depan terpotong: "y" tertutup kepala dan pita, sehingga "Billy" tidak terbaca utuh, terutama di ponsel.
- Marmer magenta bertepi keras adalah elemen asing; ia menggantikan plasma liquid-2 yang Billy puji dengan ornamen datar.

Terkuat: `c/hero-1440x900.jpg`. Terlemah: `c/splash-1440x900.jpg` (kepala nyaris tak terlihat, marmer magenta paling menonjol).

### Dari kesembilan frame

Terkuat: `c/hero-1440x900.jpg`. Terlemah: `a/hero-390x844.jpg` (nama, subjek halaman, nyaris tak terbaca).

### Perbandingan ulang

c sekarang jelas di depan dan untuk alasan yang benar: potret termal yang dulu menjatuhkannya sudah menjadi volume gelap yang tenang, bust-nya utuh, dan tembus-menembus huruf–wajah terbaca dalam tiga detik, sehingga ia satu-satunya frame yang cinematic, mystic, dan lolos SWAP sekaligus; yang masih menahannya di 6,5 adalah "y" yang terpotong, marmer magenta yang asing, dan mutu foto yang belum teruji di resolusi tayang. a membuat lompatan terbesar (4,7 → 6,1): kacanya akhirnya kaca dan plasmanya adalah plasma yang Billy minta, tetapi ia menukar masalah "efek template" dengan masalah "nama tidak terbaca" dan komposisi yang mulai ramai, dan di ponsel ia runtuh. b paling sedikit bergerak: revisi menghapus semua yang ditolak tanpa menemukan pengganti, menyisakan nama bertekstur lava di frame yang sepi, dan dalam prosesnya melunakkan splash yang tadinya frame terbaik. Bila Billy memilih dari gambar, c adalah kandidat; a adalah alternatif bila ia lebih menginginkan liquid glass daripada sosoknya sendiri; b sebaiknya disajikan dengan skor apa adanya dan tidak didorong. Ketiganya di bawah 8,0, jadi presentasi wajib memuat skor dan tiga alasan di atas.
