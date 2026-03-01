# Laws of UX untuk Awwwards-Level Design

Laws of UX (lawsofux.com) diterapkan dalam konteks Awwwards — dimana desain harus cutting-edge SEKALIGUS usable. Ini bukan UX textbook biasa. Ini adalah cara pakai UX laws untuk menang award.

Source: https://lawsofux.com/

---

## Standar Awwwards: 4 Pilar

Awwwards = kiblat web designer dan developer kelas dunia. Dinilai berdasarkan:

### 1. Immersive Storytelling & Motion
- **Micro-interactions**: setiap klik/hover punya respon animasi halus
- **Scroll-triggered animations**: elemen bergerak orisinal saat scroll (bukan cuma "muncul")
- **Parallax 2.0**: kedalaman visual nyata, bukan sekadar background gerak

### 2. Typography yang Berani
- **Custom/Variable fonts**: oversized dan unik
- **Typography as art**: teks jadi elemen visual utama
- **Kinetic type**: teks bergerak/berubah bentuk saat interaksi

### 3. Layout Experimental
- **Broken grid**: overlap yang tetap estetis
- **Asimetris**: tidak seimbang tradisional tapi punya harmoni visual
- **Horizontal scrolling**: navigasi menyamping yang mulus

### 4. High-End Technology ("Wow Factor")
- **WebGL & Three.js**: 3D interaktif di browser
- **Custom cursors**: kursor yang bereaksi terhadap elemen
- **Liquid transitions**: perpindahan halaman seperti cairan/distorsi kamera

---

## 10 UX Laws Paling Relevan untuk Awwwards

### 1. Aesthetic-Usability Effect
**"Desain yang cantik DIPERSEPSIKAN lebih usable."**

User lebih toleran terhadap minor usability issues jika interface terlihat polished. Ini BUKAN alasan untuk sacrifice usability — ini alasan untuk invest di visual quality karena user akan memberikan benefit of the doubt.

**Untuk Awwwards**: Design = 40% skor. Ini UX law yang literally memvalidasi kenapa visual quality sepenting itu. Tapi ingat: jury JUGA test usability. Cantik tanpa fungsi = gagal di 30% Usability.

### 2. Doherty Threshold — < 400ms
**"Produktivitas melonjak saat respons sistem < 400ms."**

Interaksi harus terasa INSTANT. Di atas 400ms, user merasakan "waiting".

**Untuk Awwwards**:
- Animasi hover/click harus respond dalam 400ms
- Jika proses butuh waktu, gunakan animation sebagai perceived performance (loading animation yang engage, bukan spinner)
- Preloader yang cinematic = Doherty Threshold in action — occupy attention saat load
- Progress indicator membuat delay lebih acceptable

### 3. Peak-End Rule
**"User menilai experience dari PUNCAK emosi dan AKHIR, bukan rata-rata."**

User tidak ingat setiap detil. Yang diingat: momen paling intens + momen terakhir.

**Untuk Awwwards**:
- **Peak**: satu momen "wow" yang memorable — bisa hero animation, bisa page transition, bisa satu interaction yang unexpected
- **End**: footer/closing experience harus intentional, bukan afterthought
- Preloader (awal) + satu signature interaction (puncak) + footer (akhir) = 3 momen kritis
- Negatif lebih diingat dari positif — hindari friction di titik manapun

### 4. Von Restorff Effect (Isolation Effect)
**"Yang BERBEDA dari sekitarnya paling diingat."**

Di antara elemen serupa, yang menonjol secara visual paling memorable.

**Untuk Awwwards**:
- Satu elemen yang break pattern = focal point. Jangan semua elemen "special" — kalau semua special, tidak ada yang special
- CTA, hero, signature section — pilih SATU yang benar-benar standout
- Restraint: jangan overuse emphasis. Competing visual elements dilute impact
- Combine color + size + position + motion untuk emphasis (jangan hanya color — accessibility)

### 5. Hick's Law
**"Semakin banyak pilihan, semakin lama user memutuskan."**

Fewer options = faster decisions.

**Untuk Awwwards**:
- Navigasi minimal — 5 item maks, bukan 10
- Portfolio: jangan tampilkan 50 project. Curate 5-8 yang terbaik
- Proses kompleks → pecah jadi steps kecil
- Award-winning sites terlihat "simple" bukan karena lazy — karena deliberate curation

### 6. Fitts's Law
**"Waktu mencapai target = fungsi jarak dan ukuran target."**

Target besar + dekat = mudah diakses. Target kecil + jauh = frustrasi.

**Untuk Awwwards**:
- Touch target minimum 44x44 CSS pixels
- CTA harus besar dan accessible tanpa harus search
- Custom cursor = perpanjangan Fitts's Law — cursor yang membesar saat mendekati target = hint visual
- Magnetic effect pada button = Fitts's Law in practice — target "menarik" cursor

### 7. Miller's Law — 7 +/- 2
**"Working memory manusia: 7 (plus minus 2) item."**

Jangan overload informasi sekaligus.

**Untuk Awwwards**:
- Section tidak boleh punya lebih dari 5-9 elemen yang compete for attention
- Chunking: kelompokkan informasi terkait
- Scroll-driven reveal = Miller's Law in practice — tampilkan bertahap, bukan sekaligus

### 8. Law of Pragnanz (Simplicity)
**"Otak melihat bentuk paling sederhana dari visual kompleks."**

User akan menyederhanakan apa yang mereka lihat. Desain yang terlalu kompleks = cognitive overload.

**Untuk Awwwards**:
- Complexity di motion/tech, simplicity di visual structure
- Award-winning sites terasa "effortless" — complexity tersembunyi di balik simplicity
- Naked City Films: brutalist = structure visible dan simple. Motion = yang bawa complexity
- Rule: jika harus explain layout, layout terlalu kompleks

### 9. Jakob's Law
**"User prefer site yang bekerja seperti site lain yang mereka kenal."**

Convention masih penting — bahkan di situs experimental.

**Untuk Awwwards**:
- Break convention di SATU area, ikuti di sisanya. Jangan break semua sekaligus
- Navigasi di tempat expected (top/fixed). Scrolling natural (down). Links clickable
- Creativity 20% — cukup satu hal yang berani. Sisanya harus familiar enough
- Daniele Buffa: "master conventions dulu, baru subvert purposefully"

### 10. Zeigarnik Effect
**"Task yang belum selesai lebih diingat dari yang sudah selesai."**

Incomplete = memorable. Anticipation = engagement.

**Untuk Awwwards**:
- Preloader menciptakan anticipation — "ada apa di balik loading ini?"
- Scroll hints: konten yang sedikit terlihat di bawah = undangan untuk scroll
- Storytelling yang progressive — jangan reveal semua sekaligus
- Parallax depth: layer yang belum fully visible = curiosity driver

---

## UX Laws Lainnya (Quick Reference)

| Law | Inti | Relevansi Awwwards |
|-----|------|-------------------|
| Cognitive Load | Kurangi mental effort | Motion guide attention, jangan overwhelm |
| Flow | Immersive focus state | Goal: user "lupa" mereka di website |
| Goal-Gradient | Motivasi naik mendekati goal | Progress indicator, scroll percentage |
| Common Region | Grouping via boundary | Section boundaries yang jelas |
| Proximity | Dekat = terkait | Spacing yang intentional |
| Similarity | Mirip = grup | Consistent styling per category |
| Uniform Connectedness | Visual connection = related | Lines, colors, animations yang menghubungkan |
| Serial Position | Ingat pertama & terakhir | Hero (pertama) + footer (terakhir) = kritis |
| Occam's Razor | Solusi tersimpel = terbaik | Jangan over-engineer interaction |
| Pareto (80/20) | 80% impact dari 20% effort | Focus di 2-3 signature moments |
| Tesler's Law | Complexity tidak bisa dihilangkan, hanya dipindah | Pindah complexity ke sistem, bukan user |
| Selective Attention | Fokus pada subset | Direct attention via motion dan contrast |
| Postel's Law | Liberal terima, konservatif kirim | Accept various input, output yang consistent |
| Paradox of Active User | User tidak baca manual | Interface harus self-explanatory |

---

## Synthesis: UX Laws x Awwwards Standards

```
DESIGN (40%) ← Aesthetic-Usability, Von Restorff, Pragnanz
  User percaya desain cantik = desain bagus
  Satu focal point yang berani, sisanya restrained
  Visual structure simpel, complexity di motion

USABILITY (30%) ← Doherty, Fitts, Hick, Jakob
  Response < 400ms, target accessible
  Fewer choices, familiar patterns
  Break convention di SATU area saja

CREATIVITY (20%) ← Zeigarnik, Peak-End, Von Restorff
  Satu momen "wow" yang memorable
  Anticipation via progressive reveal
  Yang berbeda = yang diingat

CONTENT (10%) ← Miller, Chunking, Serial Position
  Max 7 items per group
  Hero + footer = paling kritis
  Tampilkan bertahap via scroll
```
