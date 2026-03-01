# Dark Psychology for Portfolio — Persuasi yang Tak Terlihat

Ini BUKAN tentang menipu user. Ini tentang memahami **cognitive biases** dan **psychological triggers** yang membuat portfolio frontend developer terasa "berbeda" — membuat calon klien berpikir "orang ini level-nya beda" tanpa bisa menjelaskan kenapa.

Semua teknik di sini sudah digunakan oleh studio award-winning. Perbedaannya: mereka melakukannya secara intuitif. Kita melakukannya secara **sistematis**.

Sources:
- Robert Cialdini, *Influence: The Psychology of Persuasion* (2006)
- Daniel Kahneman, *Thinking, Fast and Slow* (2011)
- Bluma Zeigarnik, 1927 study on incomplete tasks
- Thorstein Veblen, *The Theory of the Leisure Class* (1899)
- https://cxl.com/blog/psychology-of-web-design/
- https://aguayo.co/en/blog-aguayo-user-experience/zeigarnik-effect-how-to-apply-it-in-ux/
- https://lawsofux.com/peak-end-rule/
- https://lawsofux.com/von-restorff-effect/
- https://learningloop.io/plays/psychology/authority-bias
- https://www.nngroup.com/articles/peak-end-rule/

**Catatan etis**: Gunakan untuk membuat experience LEBIH BAIK, bukan untuk menipu. "Dark" di sini = tersembunyi dari kesadaran user, bukan bermaksud jahat. Tujuan: klien merasakan "wow", bukan merasa dimanipulasi.

**Cross-reference**: Beberapa prinsip overlap dengan `ux-laws-for-awwwards.md` (UX laws) dan `emotional-design.md` (Don Norman 3 levels). File ini fokus pada **angle persuasi untuk portfolio** — bagaimana memanipulasi persepsi klien potensial secara spesifik.

---

## 1. The Halo Effect — Dominasi Kesan Pertama

### Teori
Jika seseorang melihat SATU aspek yang luar biasa, mereka **otomatis menganggap aspek lainnya juga luar biasa** — tanpa evidence. Cognitive shortcut: otak malas memverifikasi, jadi generalize dari satu data point.

Ditemukan oleh Edward Thorndike (1920): officer yang menilai tentara — kalau fisiknya bagus, mereka menganggap intelligence dan leadership-nya juga bagus.

### Mekanisme di Portfolio

```
Klien melihat hero section dengan WebGL shader →
  Otak: "Animasi secanggih ini..."
    → "Pasti koding-nya juga kelas atas"
    → "Pasti problem-solving-nya juga bagus"
    → "Pasti bisa handle proyek kompleks"

Padahal mereka BELUM melihat satu baris kode pun.
```

### Implementasi Konkret

| Area | Teknik | Dampak Psikologis |
|------|--------|-------------------|
| **Hero section** | WebGL/Three.js, custom shader, GLSL noise | "Kalau bisa bikin ini, coding-nya pasti expert" |
| **Typography** | Custom font, oversized, per-char animation | "Attention to detail level tinggi" |
| **Cursor** | Custom liquid/magnetic cursor | "Bahkan cursor-nya custom — obsessive quality" |
| **Loading** | Cinematic preloader (bukan spinner) | "Bahkan loading-nya dirancang — ini profesional" |
| **Smooth scroll** | Lenis dengan inertia | "Setiap interaksi terasa polished" |

### Rule: 70/30

**70% energi kreatif → Hero section**. Jika hero-nya biasa, tidak ada yang akan scroll ke bawah untuk menemukan kebrilianan kamu di section lain.

**30% sisanya** → tersebar di "proof points" sepanjang halaman untuk **mengkonfirmasi** halo yang sudah terbentuk, bukan membentuk halo baru.

### Hubungan dengan Awwwards
Jury membuka site → 3 detik → sudah punya "feeling". Halo effect menentukan apakah mereka menilai sisanya dengan bias positif atau netral. (Lihat juga: `emotional-design.md` → Visceral Level)

---

## 2. The Zeigarnik Effect — Rasa Penasaran yang "Gatal"

### Teori
Manusia mengingat **tugas yang belum selesai** lebih kuat daripada yang sudah selesai. Otak mengalami "cognitive tension" — semacam gatal mental yang hanya bisa hilang dengan menyelesaikan tugas tersebut.

Bluma Zeigarnik (1927): Waiters mengingat pesanan yang belum dibayar lebih baik daripada yang sudah dibayar.

### Mekanisme di Portfolio

```
Klien scroll → melihat gambar project yang TERPOTONG di edge layar →
  Otak: "Aku belum melihat gambar ini secara utuh"
    → Cognitive tension: "Aku HARUS scroll untuk melengkapi"
    → Scroll terus → engagement meningkat
    → Semakin banyak waktu dihabiskan = semakin "invested"
```

### Implementasi Konkret

| Teknik | Deskripsi | Level Tension |
|--------|-----------|---------------|
| **Visual teasing** | Gambar project terpotong oleh fold/edge layar | Medium — visual incompleteness |
| **Scroll masking** | Content ter-mask, revealed progressively | Medium — "apa di balik mask?" |
| **Horizontal scroll** | Content extends beyond viewport, hint ada lebih | High — directional curiosity |
| **Progress indicator** | Scroll percentage atau section counter (01/05) | Low — task-completion drive |
| **Partial reveal** | Text blur-to-sharp, image dari grainy ke clear | Medium — clarity pursuit |
| **Story cliffhanger** | Section title yang provocative, jawaban di section berikutnya | High — narrative drive |
| **Project teaser** | Hanya thumbnail + title, detail butuh click/hover | High — information gap |

### Pattern: "Show 70%, Hide 30%"

Jangan tampilkan SEMUA informasi sekaligus. Selalu sisakan sesuatu yang membuat klien harus **berinteraksi lebih lanjut** untuk mendapatkan jawaban penuh.

```
SALAH: Tampilkan semua detail project di satu view
BENAR: Thumbnail yang menarik → hover reveal detail → click untuk full case study

SALAH: Semua teks langsung visible saat scroll
BENAR: Text masked/blurred → reveal saat scroll → detail muncul progressively
```

### Anti-Pattern
Jangan bikin TERLALU tidak jelas sampai frustrating. Tension harus **menyenangkan** (seperti teka-teki kecil), bukan menjengkelkan (seperti website rusak). Goal: "interesting, let me explore" bukan "where the hell is the content?"

---

## 3. Cognitive Friction — Usaha yang Bikin Memorable

### Teori
Biasanya UX bertujuan meminimalkan friction. Tapi penelitian menunjukkan: ketika seseorang harus berusaha **sedikit lebih keras** untuk memproses sesuatu, otak masuk ke **deep processing mode**. Hasilnya: informasi tersimpan lebih kuat di long-term memory.

Ini terkait dengan **Processing Fluency**: informasi yang terlalu mudah diproses (high fluency) terasa familiar tapi forgettable. Informasi yang butuh effort (disfluency) terasa asing tapi memorable.

### Paradox: Easy vs Memorable

```
Portfolio "mudah" (standard layout, obvious navigation):
  → User scroll, cukup puas, close tab
  → Lupa dalam 5 menit
  → Kalah di antara 50 portfolio serupa

Portfolio "sedikit sulit" (non-standard interaction):
  → User harus figure out navigasi
  → Deep processing activated
  → "Ah, drag to explore... interesting!"
  → INGAT portfolio ini 3 hari kemudian
  → Muncul di shortlist karena MEMORABLE
```

### Implementasi Konkret

| Teknik | Friction Level | Memorability |
|--------|---------------|-------------|
| **Custom cursor** yang berubah bentuk per section | Low | Medium — subtle surprise |
| **Drag-to-explore** navigation | Medium | High — active participation |
| **Horizontal scroll** untuk case studies | Medium | High — unusual direction |
| **Keyboard-triggered** interactions | Medium | High — discovery moment |
| **Non-linear navigation** (jump to sections) | Medium-High | High — exploration feeling |
| **Cursor-reactive typography** (variable font weight berubah) | Low | Medium — "wait, did that just...?" |
| **Gravity/physics-based** interaction | Medium | High — playful discovery |

### Golden Rule: "Delightfully Difficult"

```
Terlalu mudah → Forgettable (commodity portfolio)
Terlalu sulit → Frustrating (user bounce)
Sweet spot  → "Hmm, interesting..." (memorable + engaging)

Skala friction:
[Easy]─────[Sweet Spot]─────[Hard]
  ↑             ↑                ↑
  Standard      Awwwards         Unusable
  website       portfolio        experiment
```

### Implementasi Teknis

```javascript
// Cursor yang berubah berdasarkan context
// Low friction, high memorability
const updateCursor = (context) => {
  switch(context) {
    case 'project': cursor.morph('arrow-expand')  // "click to explore"
    case 'text': cursor.morph('reading-lens')      // magnifying glass
    case 'image': cursor.morph('drag-hand')        // drag to see more
    case 'link': cursor.morph('magnetic-dot')      // magnetic pull
  }
}

// Drag-to-explore gallery
// Medium friction, very high memorability
const dragGallery = {
  interaction: 'click-and-drag horizontal',
  feedback: 'inertia + snap-to-project',
  hint: 'subtle arrow or "drag" text on first visit'
}
```

### Catatan Kritis
SELALU berikan **hint/affordance** untuk interaksi non-standard. Friction tanpa clue = confusion, bukan memorability.

---

## 4. The Veblen Effect — Psikologi Kemewahan & Eksklusivitas

### Teori
Thorstein Veblen (1899): Beberapa barang justru **lebih diinginkan ketika mahal** atau sulit didapat. Ini melawan hukum ekonomi normal (demand naik saat price turun). Luxury goods = sebaliknya.

Dalam web design: **kekosongan = kemewahan**. Portfolio yang padat terlihat seperti brosur diskon. Portfolio yang lega terlihat seperti galeri seni eksklusif.

### Mekanisme di Portfolio

```
Klien melihat portfolio dengan BANYAK whitespace →
  Otak: "Mereka tidak butuh mengisi setiap pixel"
    → "Mereka punya confidence"
    → "Ini terasa mahal dan eksklusif"
    → "Kalau hire mereka, hasilnya pasti premium"

VS

Klien melihat portfolio yang PADAT →
  Otak: "Mereka mencoba menampilkan segalanya"
    → "Sepertinya butuh validasi"
    → "Ini terasa mass-market"
    → "Rate mereka mungkin affordable..."
```

### Implementasi Konkret

| Teknik | Sinyal Psikologis | CSS Approach |
|--------|-------------------|-------------|
| **Extreme whitespace** | "Mahal" — ruang adalah luxury | `padding: clamp(8rem, 20vh, 16rem)` |
| **Tipografi tipis-besar** | "Refined" — percaya diri tanpa berteriak | `font-weight: 200; font-size: clamp(4rem, 8vw, 10rem)` |
| **Minimal content** | "Selective" — hanya yang terbaik | Max 4-6 projects, bukan 20 |
| **Hidden depth** | "Exclusive" — detail perlu effort | Password-protected projects |
| **Monochrome palette** | "Sophisticated" — restraint = confidence | Satu warna + hitam/putih |
| **Slow animation** | "Confident" — tidak terburu-buru | Duration 1.5-2.5s, ease expo |
| **No embellishment** | "Substance over style" | Zero ornamen dekoratif |

### Scarcity Signals untuk Portfolio

| Signal | Implementasi | FOMO Trigger |
|--------|-------------|-------------|
| **Availability status** | "Currently Booked Until August 2026" | "Kalau nunggu, slot bisa habis" |
| **Selected clients** | "Previously: Google, Spotify, Tokopedia" | "Kalau mereka percaya, pasti bagus" |
| **Limited projects** | "I take on 3-4 projects per year" | "Dia bisa pilih-pilih klien" |
| **Invitation only** | "For project inquiries, let's talk first" | "Bukan sembarang orang bisa hire" |
| **Award badges** | Awwwards Honorable Mention, FWA | "Diakui oleh industry" |

### Eksklusivitas dalam Detail

```
Gatekeeping yang HALUS (bukan arogan):

Level 1 — Public view:
  Portfolio utama, selected works, brief descriptions
  Cukup untuk membuat tertarik

Level 2 — Deeper engagement:
  Case study detail setelah click/hover
  Behind-the-scenes process

Level 3 — Exclusive access:
  Password-protected client work
  "Request access for full case study"
  Ini membuat klien merasa di-privilege saat mendapat akses
```

---

## 5. Peak-End Rule — Arsitek Memori

### Teori
Daniel Kahneman: Orang menilai pengalaman berdasarkan **titik paling intens (Peak)** dan **bagaimana itu berakhir (End)** — bukan rata-rata keseluruhan. Ini artinya: pengalaman yang 80% biasa tapi punya 1 peak moment + strong ending = dinilai LEBIH BAIK daripada pengalaman yang konsisten "cukup bagus" sepanjang waktu.

**Duration Neglect**: Berapa lama pengalaman itu berlangsung TIDAK berpengaruh signifikan pada penilaian. Yang penting peak + end.

(Detail lebih lanjut: lihat `emotional-design.md` → Emotion Mapping per Section dan `ux-laws-for-awwwards.md`)

### Budget Allocation untuk Portfolio

```
PEAK (60% creative energy):
  → Letakkan interaksi paling "gila" di TENGAH halaman
  → Ini yang akan diingat

  Contoh peak moments:
  - Distorsi gambar saat hover yang sangat artistik
  - 3D scroll experience pada featured project
  - Transition yang cinematic antar project
  - Interactive element yang surprising

END (25% creative energy):
  → Footer/Contact BUKAN sekedar form + email
  → Ini kesan TERAKHIR yang dibawa pulang

  Contoh strong endings:
  - Animasi transisi megah menuju contact
  - Interactive contact section (bukan form biasa)
  - Emosional closing statement dengan kinetic type
  - "Easter egg" atau surprise di ujung halaman

SUPPORTING (15% creative energy):
  → Section-section lain yang mempertahankan base quality
  → Tidak perlu spectacular, cukup polished
```

### Implementasi: Peak Placement Strategy

```
Halaman Portfolio Flow:

[Hero — Halo Effect territory]
  ↓ Strong first impression (BUKAN peak)

[About — Authority building]
  ↓ Credentials, experience, personality

[Work Section — PEAK TERRITORY]
  ↓ SATU interaksi paling gila di sini
  ↓ Featured project dengan efek terkuat
  ↓ Ini yang membuat mereka bilang "WOW"

[Other Projects — Supporting]
  ↓ Consistent quality, bukan spectacular

[Contact/Footer — END TERRITORY]
  ↓ Jangan standard form
  ↓ Closing yang emosional/interaktif
  ↓ Kesan terakhir = "This was special"
```

### Anti-Pattern

```
SALAH: Membuat SEMUA section spectacular
  → Exhausting, no peak contrast
  → Everything is special = nothing is special

SALAH: Peak di hero, biasa di footer
  → Hero sudah dilupakan saat mereka close tab
  → End rule: yang terakhir = yang dibawa pulang

BENAR: Hero (strong), middle (PEAK), footer (emotional END)
  → Halo effect sets expectation
  → Peak confirms "this person is special"
  → End seals the deal in memory
```

---

## 6. Serial Position Effect — Primacy & Recency

### Teori
Orang mengingat item di **awal (primacy)** dan **akhir (recency)** lebih baik daripada item di tengah. Item tengah masuk ke "forgetting zone".

**Primacy Effect**: Item pertama diproses lebih dalam karena working memory masih kosong → transfer ke long-term memory.

**Recency Effect**: Item terakhir masih segar di short-term memory saat diminta recall.

### Implementasi di Portfolio

```
Portfolio Section Order:

PRIMACY ZONE (akan diingat):
  [1] Hero Section — identitas + kesan pertama
  [2] About/Statement — siapa kamu + apa yang kamu percaya

FORGETTING ZONE (bisa dilupakan):
  [3] Skills/Services — informasi pendukung
  [4] Process — cara kerja (detail teknis)

RECENCY ZONE (akan diingat):
  [5] Featured Work — project terbaik
  [6] Contact/CTA — call-to-action + closing
```

### Strategi Content Placement

| Zone | Apa yang Ditaruh | Kenapa |
|------|------------------|--------|
| **First item** (primacy) | Pernyataan identitas paling kuat | "First processed, first remembered" |
| **Second item** | Authority proof (awards, clients) | Menguatkan primacy impression |
| **Middle items** | Detail teknis, process, skills | Boleh dilupakan — ini supporting |
| **Second-to-last** | Project terbaik / showcase utama | Transisi ke recency zone |
| **Last item** (recency) | CTA + emotional closing | "Last seen, top of mind" |

### Navigation Placement

```
Navbar items:
[Logo] [Home] [Work] [About] [Contact]
  ↑                              ↑
  Primacy                      Recency
  (brand recall)               (action recall)

JANGAN taruh item penting di tengah navbar.
CTA selalu di posisi terakhir (recency).
```

---

## 7. Von Restorff Effect — Yang Berbeda = Yang Diingat

### Teori
Hedwig von Restorff (1933): Dalam sekelompok item yang mirip, item yang **paling berbeda** akan paling diingat.

> "If everything stands out, nothing stands out."

(Detail UX implementation: lihat `ux-laws-for-awwwards.md`)

### Implementasi Spesifik untuk Portfolio

| Context | "Normal" Items | "Restorff" Item | Teknik |
|---------|---------------|-----------------|--------|
| **Project grid** | Standard cards (uniform) | 1 featured card (oversized, different color) | Scale break + color isolation |
| **Navigation** | Text links | CTA button (berbeda visual) | Color + shape contrast |
| **Section rhythm** | Dark sections | 1 light/accent section | Background contrast |
| **Typography** | Consistent sizing | 1 oversized statement | Scale break |
| **Animation** | Scroll reveals | 1 interactive/playable element | Interaction difference |
| **Timeline** | Regular entries | 1 highlighted achievement | Color + icon + size |

### The "One Wild Card" Strategy

```
Dalam portfolio yang 90% refined dan controlled,
sisipkan SATU element yang "breaking the pattern":

- Satu section dengan layout yang TOTALLY berbeda
- Satu interaksi yang unexpected
- Satu warna accent yang hanya muncul SEKALI
- Satu easter egg yang bikin senyum

Restraint creates contrast.
Contrast creates memory.
Memory creates preference.
```

---

## 8. Anchoring Bias — First Number Sets the Standard

### Teori
Informasi pertama yang dilihat menjadi "anchor" — titik referensi untuk menilai semua informasi selanjutnya. Anchor yang tinggi membuat yang berikutnya terasa reasonable.

### Implementasi di Portfolio

```
ANCHORING SEQUENCE untuk perceived value:

Step 1 — Show BIG first:
  "Featured in Awwwards, FWA, CSS Design Awards"
  (Anchor: "level internasional")

Step 2 — Show credentials:
  "5+ years specializing in award-winning frontend"
  (Confirms anchor: "experienced specialist")

Step 3 — Show selective work:
  "Only 4-6 projects per year"
  (Reinforces: "premium, not volume")

Step 4 — Contact CTA:
  "Let's discuss your project"
  (By now, perceived value = SANGAT tinggi)

Klien sudah ter-anchor ke "premium" sebelum tahu rate kamu.
```

### Angka sebagai Anchor

| Anchor | Format | Efek |
|--------|--------|------|
| **Experience** | "8+ Years of Crafting Digital Experiences" | Seniority anchor |
| **Projects** | "50+ Projects Delivered" | Volume credibility |
| **Awards** | "12 Industry Awards" | Quality benchmark |
| **Clients** | "Trusted by 30+ Brands" | Social proof anchor |
| **Performance** | "Avg. Lighthouse Score: 98" | Technical excellence |

### Urutan Matters

```
SALAH: "I'm a frontend developer" → kemudian credentials
  → Anchor rendah: "just another developer"
  → Credentials harus bekerja LEBIH KERAS untuk elevate

BENAR: "Award-winning frontend engineer" → kemudian details
  → Anchor tinggi: "award-winning"
  → Semua info berikutnya dinilai dari anchor ini
```

---

## 9. Authority Bias — Persepsi Otoritas

### Teori
Manusia cenderung mempercayai dan mematuhi figur yang dipersepsikan sebagai otoritas. Credential, title, dan association dengan brand terkenal = shortcut untuk trust.

### Implementasi di Portfolio

| Authority Signal | Implementasi | Trust Level |
|-----------------|-------------|-------------|
| **Award badges** | Awwwards, FWA, CSS Design Awards — subtle di header/footer | Very High |
| **Client logos** | Brand besar yang pernah dikerjakan — logo strip | High |
| **Title/label** | "Senior Frontend Engineer" bukan "Frontend Dev" | Medium-High |
| **Publikasi** | "Featured in Smashing Magazine / CSS-Tricks" | High |
| **Speaking** | "Speaker at JSConf / VueConf" | High |
| **Open source** | "Contributor to [major library]" | Medium |
| **Testimonials** | Quote dari klien dengan nama + jabatan + perusahaan | High |
| **Numbers** | "8 years experience | 50+ projects | 12 awards" | Medium |

### Credential Stacking

```
Jangan tampilkan SEMUA authority signals sekaligus (overwhelming).
Stack mereka secara strategis sepanjang halaman:

Hero area: Title + tagline
  "Award-Winning Frontend Engineer"

About section: Narrative + key credentials
  "Specializing in WebGL, Three.js, and award-winning interactions"

Work section: Client logos (passive authority)
  [Logo strip: Google, Spotify, etc.]

Testimonial: Third-party validation
  "Billy delivered beyond our expectations" — VP Product, Company

Footer: Badge display
  [Awwwards badge] [FWA badge]

Setiap section menambah satu layer trust tanpa overwhelming.
```

### Visual Authority

```
Visual choices yang MENINGKATKAN perceived authority:

HIGH AUTHORITY:
  - Monochrome palette (serious, refined)
  - Generous whitespace (confident)
  - Precision typography (attention to detail)
  - Minimal navigation (focused, intentional)
  - Professional photography (invested in quality)

LOW AUTHORITY:
  - Colorful/playful palette (casual)
  - Dense layout (trying too hard)
  - Standard system fonts (didn't bother)
  - Complex navigation (unfocused)
  - Stock photos (cheap perception)
```

---

## 10. Social Proof + Scarcity — FOMO Engineering

### Teori
Robert Cialdini's principles: **Social Proof** (orang mengikuti apa yang orang lain lakukan) + **Scarcity** (hal yang terbatas lebih bernilai).

Dikombinasikan = FOMO (Fear Of Missing Out): "Kalau orang lain sudah hire dia dan dia hampir fully booked, aku harus cepat sebelum terlambat."

### Implementasi di Portfolio

#### Social Proof Signals

| Signal | Format | Placement |
|--------|--------|-----------|
| **Client roster** | Logo strip atau "Selected Clients" section | After hero atau before footer |
| **Testimonials** | Quote + foto + nama + jabatan | Dedicated section atau scattered |
| **Case study metrics** | "+300% conversion" / "2M+ users" | Dalam project description |
| **Community** | "10K+ followers" / "500 stars on GitHub" | About section |
| **Press mentions** | "As seen in: [publication logos]" | Header atau about |

#### Scarcity Signals

| Signal | Format | FOMO Level |
|--------|--------|------------|
| **Availability status** | "Currently Booked — Available from Sept 2026" | Very High |
| **Project limit** | "Taking on 3-4 projects per year" | High |
| **Waitlist** | "Join the waitlist for 2026 Q4" | Very High |
| **Selective** | "I partner with brands that value craft" | Medium |
| **Time-sensitive** | "2 slots remaining for 2026" | Very High |

### The "Subtle Flex" Pattern

```
AROGAN (hindari):
  "I only work with the best brands"
  "You can't afford me"

HUMBLE BRAG (sweet spot):
  "I'm grateful to have collaborated with Google, Spotify..."
  "Currently fully booked, but always happy to chat about future projects"

DESPERATE (hindari):
  "Hire me! Available immediately!"
  "Discounted rates for new clients!"
```

---

## Synthesis: The Persuasion Stack

### Urutan Psikologis Lengkap

```
VISITOR LANDS ON SITE:

[0-3 sec] HALO EFFECT
  WebGL hero → "This person is exceptional"
  Anchor: "award-winning level"

[3-10 sec] ANCHORING + AUTHORITY
  Title + credentials → "Confirmed expert"
  Client logos → "Big brands trust them"

[10-30 sec] ZEIGARNIK EFFECT
  Teased content → "I need to see more"
  Progress hints → "There's more below"

[30-60 sec] COGNITIVE FRICTION
  Non-standard interaction → Deep processing
  Custom cursor/drag → "This is unique"

[60-120 sec] VON RESTORFF + PEAK
  Featured project = WILDLY different → "THIS is their best work"
  One peak moment → permanent memory marker

[120+ sec] VEBLEN + SOCIAL PROOF
  Whitespace + scarcity → "Premium"
  Client logos + testimonials → "Validated"

[Exit] PEAK-END + SERIAL POSITION
  Interactive footer → strong ending
  Recency: last impression = "I need to hire this person"

Total effect: "I don't know WHY, but this portfolio stands out"
```

### Per-Section Bias Mapping

| Section | Primary Bias | Secondary Bias | Goal |
|---------|-------------|----------------|------|
| **Preloader** | Halo Effect | Cognitive Friction | "Bahkan loading-nya impressive" |
| **Hero** | Halo Effect | Anchoring | "Level berbeda dari yang lain" |
| **About** | Authority Bias | Serial Position (primacy) | "Credentials confirmed" |
| **Work intro** | Zeigarnik | Von Restorff | "Aku HARUS lihat project-nya" |
| **Featured project** | Peak-End (peak) | Cognitive Friction | "WOW moment" — titik tertinggi |
| **Other projects** | Social Proof | Zeigarnik | "Konsisten, dan masih ada lebih" |
| **Testimonials** | Authority + Social Proof | Anchoring | "Orang lain juga impressed" |
| **Contact** | Scarcity | Peak-End (end) | "Harus hire sebelum terlambat" |
| **Footer** | Serial Position (recency) | Veblen | "Kesan terakhir: premium" |

### Quick Checklist sebelum Launch

```
PSYCHOLOGY AUDIT:
[ ] Halo: Hero section bikin "wow" dalam 3 detik?
[ ] Anchor: Credential/title pertama = high anchor?
[ ] Zeigarnik: Ada minimal 1 visual teasing yang bikin penasaran?
[ ] Friction: Ada minimal 1 non-standard interaction?
[ ] Von Restorff: Ada 1 element yang SANGAT berbeda dari pattern?
[ ] Peak: Ada 1 moment yang "gila" (peak moment)?
[ ] Veblen: Whitespace cukup generous? Terasa "mahal"?
[ ] Authority: Credentials visible tanpa overwhelming?
[ ] Social Proof: Client logos / testimonials present?
[ ] Scarcity: Availability signal visible?
[ ] Serial Position: Primacy (hero) + recency (footer) strong?
[ ] Peak-End: Ending bukan generic form?
```

---

## Ethical Boundaries

### BOLEH (Persuasi):
- Memanipulasi **urutan informasi** untuk maximum impact (anchoring, serial position)
- Menggunakan **visual language** yang communicate quality (Veblen, halo)
- Membuat **interaction yang memorable** (cognitive friction, Zeigarnik)
- Menampilkan **real achievements** secara strategis (authority, social proof)
- Membuat **genuine scarcity** visible (availability status)

### TIDAK BOLEH (Manipulasi Jahat):
- Fabricate credentials atau awards
- Fake testimonials atau client logos
- Artificial scarcity (bilang "fully booked" padahal kosong)
- Membuat navigasi SO sulit user tidak bisa menemukan info
- Dark patterns yang menipu (bait-and-switch, hidden costs)

**Rule of thumb**: Jika teknik-nya bikin user merasa "tertipu" setelah sadar, itu terlalu jauh. Jika merasa "impressed" — itu sweet spot.

---

## Hubungan dengan Portfolio Billy

**Sudah ada yang leverage dark psychology**:
- WebGL shader hero → Halo Effect
- Custom liquid cursor → Cognitive Friction + Halo
- Text scramble hover → Von Restorff
- Cinematic preloader → Halo + Peak-End setup
- Smooth Lenis scroll → Veblen (perceived quality)

**Bisa ENHANCE tanpa mengganti**:
- **Zeigarnik**: Image teasing di fold boundaries, masked project reveals
- **Anchoring**: Title hierarchy — "Award-Winning" sebagai first anchor
- **Serial Position**: Reorder sections — strongest credentials FIRST, CTA LAST
- **Scarcity**: Availability status badge ("Available Q4 2026")
- **Authority**: Client logo strip, award badges, press mentions
- **Peak**: ONE featured project dengan efek paling "gila" — 60% effort di sini
- **Veblen**: Increase whitespace di key sections, reduce content density
- **Peak-End**: Redesign footer/contact menjadi interactive experience (bukan boring form)
