# Kritik konsep putaran 2 — Explore Concept 2

Kritikus: agen Fable, tahap konsep (belum ada frame). Tanggal 2026-11-23.
Yang dinilai: teks delapan konsep di `concepts.md`, dibandingkan dengan master brief, dua failure note 2026-11-23, enam contact sheet referensi, tiga frame hero putaran 1, dan spesimen font (kartu f).
Skor adalah penilaian atas teks; tidak ada satu pun klaim alat di konsep yang sudah diuji. Gerbang: `min(originality, taste_fit) ≥ 7,0`, clone_flag no, tanpa pelanggaran aturan keras.

| id | originality | clone_flag | taste_fit | producibility | execution_risk | min | duplicate_of | gate | top_risk |
|---|---|---|---|---|---|---|---|---|---|
| F1 — Rana Kedua | 7,1 | no | 7,4 | 6,5 | 6,5 | **7,1** | — (induk G1) | **PASS** (tipis) | "foto saya tidak rapih, masih jauh dari awwwards" |
| F2 — Lampu Nama | 8,0 | no | 7,2 | 4,5 | 8,5 | **7,2** | — | **PASS** (bersyarat gate henti) | "patungnya jelek, shape tidak jelas, itu bukan saya" |
| G1 — Satu Eksposur | 6,6 | no (dekat keluarga stroboscopic recursion) | 6,8 | 5,5 | 7,0 | **6,6** | F1 | FAIL — min < 7,0, duplikat F1 yang lebih lemah | "ramai, nama kecil, biasa saja" |
| G2 — Tujuh Langkah | 6,3 | no | 5,8 | 5,0 | 8,0 | **5,8** | F1/G1 | FAIL — min < 7,0, melanggar "satu subjek" dan mood (ramai) | "jelek, seperti kolase foto saya" |
| T1 — Sungai Tertahan | 5,5 | no | 6,8 | 7,5 | 5,0 | **5,5** | — (kerangka putaran 1 a) | FAIL — SWAP gagal (pola #5), kerangka lama | "kurang impress karna terlalu biasa saja" |
| T2 — Satu Detik | 7,4 | no | 6,6 | 5,5 | 7,5 | **6,6** | — | FAIL — taste < 7,0; "60" 620 px mengalahkan nama 160 px (pola #11) | "ramai, objeknya terlihat CG murah" |
| O1 — Isolator Kaca | 7,8 | no | 7,0 | 6,0 | 6,5 | **7,0** | — | **PASS** (tepat di ambang) | "objeknya apa? tidak nyambung dengan saya, nama kurang bold" |
| O2 — Piksel Lepas | 6,0 | no (dekat keluarga krom cair 3D) | 6,8 | 5,5 | 7,5 | **6,0** | — | FAIL — min < 7,0, SWAP lemah, menyerempet larangan logam prosedural | "logam 3D generik, ai slop" |

Tiga PASS, ketiganya tipis (7,0–7,2). Tidak ada konsep yang nyaman di atas ambang. Lolos gerbang di sini berarti "boleh diuji sebagai gambar", bukan "akan lolos sebagai frame".

## Temuan lintas konsep

1. **Pelajaran putaran 1 terserap di semua konsep.** Delapan-delapannya: nama krem solid tanpa efek saat diam, Archivo Expanded 800, tanpa mono, tanpa efek menyala sendiri, jalur gambar (Photoshop) alih-alih compositor. Tidak ada pelanggaran aturan keras yang tertulis. Yang membedakan sekarang hanya subjek dan risikonya.
2. **Semua ukuran nama belum diukur, dan sebagian kemungkinan meleset.** Taksiran kasar saya dari JPG spesimen kartu f (bukan TextMetrics): baris uppercase "BILLY MAULANA" ≈ 10,6 em, "MAULANA" ≈ 6,8 em. Bila benar: satu baris selebar 1344 px ≈ 127 px (cocok dengan F2/O1), tetapi "MAULANA" fit 1344 px ≈ 197 px, bukan 240 px seperti di F1 dan T1 (mereka mengasumsikan 5,6 em); "Maulana" 220 px di O2 kemungkinan melebihi 1344 px, bukan 1045 px. Saya tidak yakin pada angka ini sampai diukur; ukur dulu sebelum tata letak dikunci.
3. **Font pilihan Billy sangat lebar, jadi satu baris = nama kecil.** Empat konsep (F2, G1, O1, T2) menaruh nama satu baris 127–160 px, cap-height ± 88–110 px. Lebar penuh terpenuhi, tetapi "typography boldnya" dan "kesan bold" berisiko hilang. Komposisi dua kata terpisah diagonal (F1, T1, O2) menjaga skala lebih baik.
4. **Enam dari delapan masih "nama + meta di sudut + satu subjek di sampingnya".** Prinsip 7 (teks dan subjek saling menembus dengan oklusi penuh) hanya dipakai F1 (MAULANA di depan dada). Sisanya menjaga jarak 24–53 px antara nama dan subjek: aman, tetapi terbaca "gambar + caption".
5. **Tidak ada klaim freefield yang sudah diuji.** Relight pada rambut keriting besar, figure-3d, kontrol geometri FLUX edit, dan kemiripan wajah setelah relight semuanya ditulis "belum saya uji" oleh agennya sendiri. Semua jalur harus punya rencana manual penuh (dodge and burn).
6. **Foto sumber adalah titik lemah bersama lima konsep sosok.** Flash ponsel, cahaya kamar datar, ISO tinggi. Kritik frame putaran 1 sudah mencatat wajah lunak di crop 2×. Frame c lolos karena wajahnya gelap; sekarang wajah wajib ≥ 3:1, jadi mutu foto tidak bisa lagi disembunyikan.

## Catatan per konsep

### F1 — Rana Kedua
- **Dipenuhi:** prinsip 1 (satu subjek menyala, cahaya di wajah bukan di latar), 4 (jejak tolehan = waktu jadi ruang, menjawab "kaku"), 5, 6 (dua kata sudut berlawanan + meta 14 px), 7 (MAULANA melintas penuh di depan dada, satu-satunya konsep yang memakai oklusi), 9. Suara Billy: sinyal "paling mending c" (sosok + nama) diteruskan dengan sebab kegagalannya dibalik (wajah 4,5–7:1, 0% tinta huruf tertutup); "intronya cinematic" lewat kilat rana; fluida hanya di belakang figur dan mati saat diam. SWAP kuat: wajah dan siluet rambut Billy, dua foto tolehan nyata, penghitung 00→60 dari etos `profile.ts`.
- **Dilanggar / lemah:** kerangkanya tetap kerangka c yang diperbaiki; agennya sendiri mengakui. Jejak 380 px yang dibangun dari foto lain lalu di-blur berada dekat larangan "gambar diam diberi drift palsu": ia sah hanya bila terbaca fotografis (rear-curtain), bukan Motion Blur Photoshop. Prinsip 2 (panas mengikuti bentuk) hanya di bayangan C1–C2; kulit tetap kulit. Itu pilihan benar terhadap penolakan "foto thermal tidak rapih", tetapi palet termal jadi tipis di hero.
- **Paling mahal:** potret itu sendiri. Seluruh konsep berdiri di atas satu wajah setinggi ±300 px dari foto ponsel berlampu datar, yang harus direlight 35° tanpa mengubah kemiripan dan tahan zoom 2×. **Klaim meragukan:** relight generatif freefield menjaga identitas dan helai rambut keriting (belum diuji; relight generatif lazim menggeser fitur wajah dan melumerkan helai); upscale tanpa kulit plastik; menyelaraskan IMG_6096 ke 6094 sebagai jejak yang tidak terbaca tempelan; "MAULANA 240 px" (lihat temuan 2).
- **Satu perbaikan terbesar:** kerjakan potret sebagai gambar lebih dulu dan beri gate henti: bila wajah hasil relight + retus tidak bisa disandingkan dengan potret di sheet-3 pada zoom 2×, ganti ke pemotretan ulang sederhana (satu lampu samping, dua pose tolehan) alih-alih menambal. Pinjam dari G1 interaksi "pointer X = posisi rana" agar jejak bisa diputar ulang; itu menaikkan kebaruan tanpa menambah sosok.

### F2 — Lampu Nama
- **Dipenuhi:** ide paling orisinal dari delapan: hubungan sebab-akibat nama → sosok (tanpa nama, sosok gelap). Prinsip 1 dan 2 secara fisik (sisi yang menghadap nama hangat, bayangan indigo), 8 (satu objek material), 9. Suara Billy: "sculpture heronya", "object silver cahayanya", "pantulan abu seakan silver/kaca", "intronya cinematic" (huruf menyala satu per satu menerangi wajah). Nama 17:1 di ground murni, tidak ada apa pun di belakangnya. Agen menulis gate henti sendiri.
- **Dilanggar / lemah:** nama satu baris ±127 px di tepi atas berisiko terbaca header, bukan masthead ("font tidak bold"). Pantulan huruf di logam menyerempet "dual text"; logam bertint menyerempet larangan "logam grayscale prosedural" (lolos hanya bila warna benar-benar datang dari lampu ramp). Sosok kehilangan kulit dan tekstur asli: risiko "itu bukan saya". Tidak ada interpenetrasi (jarak 53 px).
- **Paling mahal:** patungnya. **Klaim meragukan (serius):** relief displacement dari satu depth map MoGe tidak menghasilkan patung; dengan `metalness 1` setiap riak depth menjadi highlight bergelombang, rambut keriting menjadi gumpalan, mata tanpa albedo kosong (topeng). Normal map dari high-pass luminans foto bukan normal geometri; ia mencetak bayangan foto ke permukaan. figure-3d dari satu foto untuk rambut ini diakui tidak diandalkan. `RectAreaLight` di three tidak membuat bayangan, jadi "diterangi hanya oleh nama" harus dipalsukan dengan AO bake. Rotasi scroll −40° mustahil dengan relief (diakui). Ini jalur yang paling mirip "render teknis" putaran 1.
- **Satu perbaikan terbesar:** pindahkan patung dari mesh realtime ke **plat 2,5D yang digambar**: buat patung logam gelap sebagai gambar (FLUX edit/img2img dari IMG_6094 dengan kemiripan dijaga, atau lukis-ulang di Photoshop), render beberapa keadaan cahaya (nama padam, per kelompok huruf, penuh, rim) sebagai lapis yang dicampur di shader, depth hanya untuk paralaks ±6 px. Sebab-akibat nama → cahaya tetap utuh, lembah ganjil mesh hilang, execution_risk turun dari 8,5 ke ±6. Tambahan: nama dua baris uppercase ukuran sama di atas agar skala naik ke ±190 px.

### G1 — Satu Eksposur
- **Dipenuhi:** prinsip 4 paling harfiah, 5, 9; nama bersih di pita hitam; interaksi "pointer X = posisi rana" adalah ide interaksi terbaik di lensa sosok.
- **Dilanggar / lemah:** ide yang sama dengan F1 (tolehan sebagai eksposur) dalam versi lebih mahal dan lebih lemah. Empat sosok sejajar melemahkan prinsip 1 (satu subjek) dan berisiko terbaca "empat orang". Strukturnya dekat dengan keluarga stroboscopic recursion di sheet-2/sheet-4 (belum clone karena gema terpisah dan duoton, tetapi kebaruannya rendah). Nama satu baris ±127–144 px di bawah dada = potret + caption; prinsip 7 tidak dipakai.
- **Paling mahal / meragukan:** menyatukan empat foto flash beda arah cahaya lewat relight; dua foto belum punya cutout; 5 plat alpha 2× ≤ 900 KB.
- **Satu perbaikan terbesar:** lebur ke F1 (bawa interaksi rana dan urutan pose sebagai bahan scroll), jangan dibawa sendiri.

### G2 — Tujuh Langkah
- **Dipenuhi:** angka 7 dari `profile.ts`; paralaks kamera nyata sebagai signature.
- **Dilanggar / lemah:** tujuh sosok dari lima foto (pose berulang) = ramai, melanggar prinsip 1 dan peringatan mood ("bila terasa ramai, salah"). Tujuh tahun tidak terlihat di foto yang diambil di hari yang sama; maknanya hanya ada di label. Label + garis rambut yang menunjuk lintasan menyerempet HUD. Kartu bust berbagai skala dengan kabut terbaca kolase/paralaks kartu. Nama sentence case 176 px di kiri tanpa hubungan dengan sosok. Agen sendiri menyiapkan mundur ke lima sosok, yang meruntuhkan premis "7".
- **Paling mahal / meragukan:** menyamakan skala kepala dan cahaya lima foto; displacement depth pada rambut; three + fluida di M1 8 GB.
- **Satu perbaikan terbesar:** tidak ada yang cukup; buang. Simpan hanya gagasan "geser kamera membuktikan kedalaman" untuk F1/F2.

### T1 — Sungai Tertahan
- **Dipenuhi:** suara Billy tentang plasma ("saya ingin plasma seperti ini", "detail liquidnya mahal"), nama 240-an px bersih, prinsip 3 dan 9, paling murah dan paling aman diproduksi (engine sudah ada). Komposisi diagonal dua kata sama besar adalah tata tipografi yang baik.
- **Dilanggar / lemah:** SWAP gagal dan diakui agennya (pola #5, sudah 8×). Kerangkanya persis yang disebut failure note: "nama raksasa + meta sudut + satu medium"; ini frame a tanpa kaca. Tidak ada objek atau sosok: uji OBJECT lemah. Sungai yang sudah ada saat kunjungan ulang menyerempet "shader muncul di awal". Model cahaya "kaca cair tebal dari height map" belum terbukti dan bisa jatuh ke bevel-emboss seperti frame a putaran 1.
- **Paling mahal / meragukan:** dua kanal (dye kekal, suhu meluruh) belum diverifikasi ada di engine; kecocokan still retus ↔ sim live.
- **Satu perbaikan terbesar:** bukan konsep hero; turunkan menjadi lapis interaksi di belakang subjek konsep lain (F1 sudah memakainya begitu).

### T2 — Satu Detik
- **Dipenuhi:** aturan gambar yang cerdas dan milik Billy (60 eksposur = satu detik = etos 60fps; monogram BM), prinsip 4, 8, sebab-akibat splash → hero jelas ("tinggal di dalam akibatnya"). SWAP kuat di atas kertas.
- **Dilanggar / lemah:** angka "60" 620 px adalah glyph terbesar di halaman, 3,9× nama; walau tonal, ini pola #11 (konsep menggeser subjek halaman) dan bertentangan dengan "nama Billy adalah subjek". 60 salinan objek berlawanan dengan "tidak ada taburan dekorasi" dan berisiko ramai. Eksposur 1–18 lewat di belakang "Bil": legal (≤ C2) tetapi mengundang verdict tabrakan. Agen **belum melihat bentuk logonya** (SVG membungkus PNG): pengikat SWAP utama belum diketahui layak diekstrusi.
- **Paling mahal / meragukan:** kaca `transmission` three tanpa path tracer = risiko CG murah; atlas pose 384 px untuk objek tampil 360 px akan buram di DPR 2; 60 layer komposit manual.
- **Satu perbaikan terbesar:** buang dinding "60", pangkas jadi 8–12 eksposur terbaca, dan besarkan nama jadi dua baris; lalu **lihat dan trace logonya dulu**. Dengan itu ia kandidat putaran 3, bukan sekarang.

### O1 — Isolator Kaca
- **Dipenuhi:** satu-satunya konsep non-sosok yang SWAP-nya bertumpu pada fakta unik (`PLN Mobile, 80M+ users`), bukan pada tagline. Prinsip 1, 8 (satu objek material, kaca), 4 (gema ayun), 6, 9; mood "panas yang tertahan" secara harfiah. Suara Billy: "object liquid glass di hero", "object silver cahayanya", "detail … terasa mahal". Diam = nol piksel bergerak; lucutan sekali per kunjungan yang menunjuk baris PLN adalah signature yang punya sebab. Jalur plat (clay → FLUX → relight → retus) adalah jalur yang benar setelah putaran 1.
- **Dilanggar / lemah:** objek asing; tanpa penjelasan ia "benda industri kaca". Kaitannya dengan klien Billy, bukan dengan Billy. Nama satu baris ±127 px, jarak 37 px dari objek: caption di bawah produk. Gema ayun opasitas 22%/9% adalah gerak yang dipalsukan pada plat; sah bila fotografis, "drift palsu" bila terlihat duplikat. Tidak ada plasma liquid-2 yang Billy puji kecuali saat interaksi.
- **Paling mahal:** plat kaca. **Klaim meragukan:** FLUX edit menjaga geometri rusuk konsentris dan sambungan logam (agen tidak yakin freefield punya kontrol depth; saya juga tidak); gradient map termal di atas kaca terlihat "difilter"; kaca asli kehijauan sedangkan hijau dilarang; estimasi GPU 15–25 menit L40S melewati batas 10 menit, **wajib persetujuan Billy dulu**.
- **Satu perbaikan terbesar:** beri objek hubungan dengan nama, bukan hanya dengan baris meta: nama dua baris uppercase ±190 px dan rangkaian isolator menggantung melewati celah di antara "BILLY" dan "MAULANA" dengan satu piringan beroklusi penuh di depan/belakang huruf (niat tertulis, prinsip 7), sehingga isolator secara harfiah "menahan" di antara dua kata. Itu menaikkan skala nama dan menghapus pembacaan caption.

### O2 — Piksel Lepas
- **Dipenuhi:** tata tipografi terbaik dari delapan ("Billy" kiri-atas, "Maulana" rata kanan bawah, ±200+ px, untaian diagonal di celahnya); objek yang sendirinya rekaman gerak (prinsip 4, 8); pantulan memakai dunia termal liquid-2.
- **Dilanggar / lemah:** SWAP bertumpu pada tagline (diakui); krom cair di ground hitam adalah keluarga yang paling banyak di sheet-4/sheet-1, jadi kebaruan rendah walau bukan clone satu karya. Menyerempet "logam prosedural" dan "MOLTEN INDEX" (logam meleleh, dihapus). Kerabat "Piksel Pijar" putaran 1.
- **Paling mahal / meragukan:** transisi kubus → untaian lewat metaball ("permen karet", diakui); jarak mutu plat retus ↔ krom realtime saat crossfade; three + fluida sebagai env + bloom di M1 8 GB; "Maulana 220 px = 1045 px" kemungkinan salah (temuan 2).
- **Satu perbaikan terbesar:** tidak layak dibawa sebagai konsep; **bawa tata tipografinya** ke konsep yang lolos.

## Rekomendasi kurasi

Tiga konsep lolos gerbang, tetapi saya tidak menaikkan skor untuk mengisi kuota: ketiganya lolos tipis, dan dua dari tiga punya risiko eksekusi di atas 6.

1. **F1 — Rana Kedua (prioritas pertama).** Satu-satunya yang meneruskan sinyal eksplisit Billy ("paling mending c": sosoknya sendiri + nama bold tanpa efek) dengan setiap sebab penolakan c dibalik secara terukur, memakai oklusi penuh, dan punya risiko yang bisa diuji murah: satu potret. Syarat: potret dinilai sebagai gambar pada zoom 2× sebelum tata letak; ukuran nama diukur TextMetrics; jejak diuji diam lebih dulu.
2. **F2 — Lampu Nama (prioritas kedua, hanya dengan perubahan jalur).** Ide terkuat dan paling orisinal, sekaligus yang paling mungkin jatuh seperti putaran 1 bila dibuat sebagai relief depth metalik realtime. Layak ke styleframe **hanya** sebagai plat patung yang digambar dengan lapis cahaya (lihat perbaikannya), dan dengan gate henti yang sudah ditulis agennya: dua putaran, bila patung tidak setara poster referensi, konsep dibuang sebelum Billy melihatnya.
3. **O1 — Isolator Kaca (prioritas ketiga, di ambang 7,0).** Layak sebagai arah non-sosok satu-satunya supaya Billy tidak memilih di antara tiga varian wajahnya. Bila kapasitas hanya dua frame, ini yang ditinggal. Syarat: perbaikan hubungan objek–nama, dan persetujuan Billy atas estimasi GPU > 10 menit sebelum mulai.

Yang tidak dibawa: G1 dilebur ke F1; G2, T1, O2 dibuang; T2 ditahan untuk putaran 3 setelah logonya dilihat.

Yang harus dibawa ke styleframe, apa pun konsepnya:
- Ukur Archivo Expanded 800 dengan TextMetrics dulu; angka 240 px untuk "MAULANA" kemungkinan ±197 px.
- Nama dua kata terpisah berukuran sama (pola F1/O2), bukan satu baris ±127 px.
- Subjek dibuat dan dinilai sebagai gambar (potret, patung, kaca) sebelum ada tata letak; gate henti per subjek.
- Minimal satu oklusi penuh nama–subjek dengan niat tertulis, tanpa menutup tinta huruf.
- Uji relight freefield pada satu foto lebih dulu (kemiripan wajah, helai rambut); siapkan jalur manual penuh.

Bila ketiga subjek gagal gate henti gambar, jangan menambal: putaran 3 dimulai dari **pemotretan ulang potret** (akar bersama lima konsep sosok) dan dari T2 yang sudah dipangkas, bukan dari menghidupkan kembali T1/O2/G2.
