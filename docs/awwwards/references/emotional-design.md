# Emotional Design — "How It Feels"

Website Awwwards-level bukan hanya terlihat bagus — mereka **terasa** berbeda. "How it feels" adalah gabungan dari sensory experience, emotional resonance, dan perceived quality yang membuat user bilang "wow" tanpa bisa menjelaskan kenapa.

Sources:
- Don Norman, *Emotional Design: Why We Love (or Hate) Everyday Things* (2004)
- Aarron Walter, *Designing for Emotion* (A Book Apart, 2nd Ed.)
- https://www.awwwards.com/case-study-kode-immersive.html
- https://tympanus.net/codrops/2025/11/24/building-a-different-kind-of-agency-inside-14islands-people-first-creative-vision/
- https://www.composite.global/news/scroll-fatigue-and-the-case-for-digital-pacing
- https://www.uxmatters.com/mt/archives/2025/11/the-emotional-map-of-user-interface-zones.php
- https://www.smashingmagazine.com/2021/06/web-design-done-well-audio/
- https://www.interaction-design.org/literature/article/norman-s-three-levels-of-design

---

## Don Norman's Three Levels of Emotional Design

Setiap interaksi dengan website diproses di tiga level secara simultan. Award-winning sites menang karena mereka address KETIGA level, bukan hanya satu.

### Level 1: Visceral — "First Gut Reaction"
**Apa**: Reaksi bawah sadar, instan, sebelum otak sempat berpikir. Terjadi dalam < 50ms.

**Trigger di web**:
- Warna dominan dan kontras
- Typography scale dan weight
- Kualitas imagery (hi-res vs pixelated)
- Layout density vs white space
- Kehadiran motion (atau keheningan)

**Visceral = first impression**. Jika visceral gagal, user bounce sebelum sempat experience behavioral dan reflective level.

**Untuk Awwwards**: Ini kenapa hero section sangat kritis. Design score (40%) heavily weighted ke visceral response. Jury membuka site dan dalam 3 detik sudah punya "feeling" — sisanya konfirmasi atau kontradiksi.

### Level 2: Behavioral — "How It Works"
**Apa**: Experience saat menggunakan — apakah interaksi terasa smooth, responsive, dan predictable?

**Trigger di web**:
- Response time < 400ms (Doherty Threshold)
- Easing quality — `power4.out` terasa "mahal", `linear` terasa "murah"
- Hover feedback — immediate dan satisfying
- Scroll smoothness — Lenis smooth vs browser default jerky
- Navigation clarity — bisa menemukan yang dicari tanpa berpikir
- Animation timing — reveal yang terlalu cepat = cheap, terlalu lambat = frustrating

**Behavioral = usability + feel**. Site bisa cantik (visceral bagus) tapi terasa "murah" karena easing-nya generic atau response-nya lambat.

**Untuk Awwwards**: Usability 30%. Jury CLICK, SCROLL, HOVER — dan langsung merasakan apakah behavioral layer polished atau generic.

### Level 3: Reflective — "What It Means to Me"
**Apa**: Refleksi setelah experience — apakah user merasa "ini situs premium", "ini brand yang saya percaya", "saya ingin kembali"?

**Trigger di web**:
- Brand coherence — semua elemen bercerita hal yang sama
- Uniqueness — "saya belum pernah lihat ini sebelumnya"
- Prestige association — terasa di level Apple, luxury brand, atau exclusive
- Shareability — "saya harus tunjukkan ini ke orang lain"
- Memory — masih diingat setelah tab ditutup (Peak-End Rule)

**Reflective = lasting impression**. Ini yang membedakan SOTD dari Honorable Mention — apakah site meninggalkan jejak?

**Untuk Awwwards**: Creativity 20% = reflective uniqueness. Tapi reflective juga mempengaruhi semua score lain — jika reflective kuat, jury ingat site dengan fondness.

### Synthesis: Three Levels in Practice

```
USER OPENS SITE:
  Visceral (< 50ms): "Wow, this looks amazing" ← Design score
  ↓
USER INTERACTS:
  Behavioral (50ms - minutes): "This feels smooth and premium" ← Usability score
  ↓
USER REFLECTS:
  Reflective (after): "I need to share this / come back" ← Creativity score
```

**Key insight**: Awwwards sites yang menang address semua tiga level. Sites yang hanya visceral (cantik tapi clunky) atau hanya behavioral (smooth tapi boring) tidak menang.

---

## Walter's Hierarchy of Interface Needs

Aarron Walter mengadaptasi Maslow's hierarchy untuk interface design:

```
        ┌───────────────┐
        │  PLEASURABLE  │ ← Delight, surprise, emotional connection
        ├───────────────┤
        │    USABLE     │ ← Mudah digunakan, efficient
        ├───────────────┤
        │   RELIABLE    │ ← Konsisten, tidak error
        ├───────────────┤
        │  FUNCTIONAL   │ ← Berfungsi, works as expected
        └───────────────┘
```

**Untuk Awwwards**: Semua level WAJIB terpenuhi. Tapi yang membedakan winner dari participant = **pleasurable layer**. Sites yang functional + reliable + usable tapi TIDAK pleasurable = "professionally built website". Sites yang reach pleasurable = "experience".

### Pleasurable Layer Triggers

| Trigger | Contoh | Kenapa Works |
|---------|--------|-------------|
| **Surprise** | Unexpected hover effect, hidden Easter egg | Dopamine reward — otak suka novelty |
| **Delight** | Micro-animation yang "just right", satisfying click feedback | Positive reinforcement loop |
| **Personality** | Brand voice in copy, unique cursor, custom 404 page | Humanizes — bukan template, ini dibuat oleh manusia |
| **Anticipation** | Preloader yang build excitement, scroll hints | Zeigarnik Effect — incomplete = memorable |
| **Belonging** | "Made with love" footer, behind-the-scenes detail | User merasa bagian dari sesuatu |

---

## 6 Dimensi "How It Feels"

Breakdown praktis dari sensory + emotional experience yang membuat website terasa premium.

### Dimensi 1: Weight & Gravity (Berat)

Elemen di layar TERASA punya "berat" meskipun literal tidak ada berat. Ini disampaikan melalui:

| Property | Light / Ringan | Heavy / Berat |
|----------|---------------|---------------|
| **Easing** | `power1.out` — muncul cepat, berhenti cepat | `power4.out` / `expo.out` — deceleration dramatic, "tiba dengan berat" |
| **Duration** | 0.2-0.4s — snappy, responsive | 0.8-1.5s — deliberate, weighty |
| **Scale** | Element kecil = quick, light animation | Element besar = slow, heavy animation |
| **Delay** | Langsung respond | Slight delay 50-100ms — "perlu effort untuk bergerak" |

**Rule**: Ukuran element menentukan "berat" animasinya. Headline besar harus animate lebih lambat dari label kecil. Button kecil harus respond lebih cepat dari section reveal.

**Analogi**: Bayangkan batu vs bulu. Batu jatuh lambat dan berhenti dengan impact. Bulu jatuh cepat tapi melayang. Elemen besar = batu. Elemen kecil = bulu.

### Dimensi 2: Temperature (Suhu)

Website punya "suhu" — warm, cool, atau neutral. Ini bukan metafora samar — warna dan texture literally mempengaruhi persepsi suhu.

| Warm | Cool | Neutral |
|------|------|---------|
| Orange, amber, gold tones | Blue, teal, violet tones | Monochrome, high contrast B&W |
| Noise texture, grain overlay | Clean, crisp edges | Matte finish, low saturation |
| Soft blur, diffused light | Hard shadows, sharp highlights | Flat, minimal shadow |
| Serif typography | Geometric sans-serif | Mono/technical |
| Organic shapes, rounded corners | Angular, geometric | Grid-strict |

**Warm = approachable, human, boutique, artisanal**
**Cool = professional, tech, precision, futuristic**
**Neutral = editorial, archival, intellectual**

**Untuk portfolio Billy**: Dark atmospheric theme = cool-neutral. Yang membuat ini work: noise texture dan subtle warm accent (amber/gold) mencegah terasa "sterile digital".

### Dimensi 3: Texture & Materiality (Tekstur)

Website yang terasa premium punya "material" — seolah elemen-elemen dibuat dari sesuatu, bukan hanya pixel di layar.

| Material Feel | Teknik CSS/WebGL |
|---------------|-----------------|
| **Glass** | `backdrop-filter: blur()`, transparency, refraction shader |
| **Metal** | High contrast, sharp reflections, `mix-blend-mode: hard-light` |
| **Paper** | Noise overlay, subtle shadow, off-white backgrounds, grain |
| **Fabric** | Soft gradients, low contrast, muted palette |
| **Liquid** | Fluid shader, displacement, `mix-blend-mode: difference` |
| **Film/Analog** | Grain texture, vignette, chromatic aberration, color grading |

**Key insight dari KODE Immersive**: "High-fidelity 3D clashing with flat backgrounds" — diperbaiki dengan "subtle layer of pixel distortion and soft noise texture" yang menyatukan semuanya. **Texture unifies disparate elements.**

**Grain/noise sebagai "glue"**: Noise overlay pada seluruh page membuat semua elemen terasa berada di "ruang" yang sama, bahkan jika mereka secara teknis berbeda (HTML, WebGL, video).

### Dimensi 4: Rhythm & Pacing (Ritme)

Website adalah komposisi temporal — punya ritme seperti musik. Scroll = tempo. Sections = bars. Animations = notes.

#### Scroll Fatigue Problem
> "In the race to communicate everything, we have removed friction, but also removed rhythm." — Composite

Ketika setiap section demands attention, uses bold headlines, competes with animation — hasilnya bukan engagement, tapi **fatigue**.

#### Pacing Strategies

| Strategy | Deskripsi | Feel |
|----------|-----------|------|
| **Tension → Release** | Dense info section → wide breathing space | Dramatic, cinematic |
| **Build → Climax** | Progressive complexity → hero moment → cool down | Narrative, storytelling |
| **Steady Pulse** | Consistent rhythm, predictable spacing | Calm, editorial, trustworthy |
| **Syncopation** | Unexpected beat — asymmetric layout setelah grid section | Energetic, creative |
| **Rest Beats** | Full-bleed empty space between dense sections | Premium, confident |

#### Emotional Zones of a Page

| Zone | Emosi Default | Jika Gagal |
|------|---------------|------------|
| **Hero / Header** | Orientasi, kontrol, "saya tahu di mana saya" | Dense header = oppressive, hurried |
| **Mid sections** | Engagement, discovery, "ini menarik" | Cluttered = micro-anxieties, fatigue |
| **Margins / White space** | Breathing, confidence, "ini brand percaya diri" | No margins = claustrophobic |
| **Footer** | Closure, grounding, "experience complete" | Cluttered footer = incomplete feeling |

**Rule**: Metric terpenting BUKAN scroll depth — tapi **retention**. Apakah user ingat satu headline, satu visual, satu interaksi setelah tab ditutup? Jika semua ditonjolkan, tidak ada yang diingat.

### Dimensi 5: Sound & Silence (Suara)

Sound = dimensi paling underutilized di web design, tapi paling powerful untuk emotional impact.

#### Kenapa Sound Matters
- Sound bypasses cognitive processing — langsung ke emotional center
- Confirmation sound saat click = user confidence naik
- Ambient sound = immersion level meningkat drastis
- Silence setelah sound = dramatic tension

#### Types of Web Sound

| Type | Fungsi | Contoh |
|------|--------|--------|
| **Ambient** | Establish atmosphere, mood | Background drone, nature sounds, subtle music loop |
| **Interaction SFX** | Confirm action, provide feedback | Click tick, hover whisper, success chime |
| **Narrative** | Storytelling, voiceover | Audio tour, narrated scroll experience |
| **Transitional** | Accompany page/section change | Whoosh, dissolve sound, musical bridge |

#### Implementation Rules

| Rule | Detail |
|------|--------|
| **Never auto-play** | User HARUS opt-in. Provide clear audio toggle |
| **Subtle > Loud** | Web sound harus felt, bukan heard. Think whisper, bukan shout |
| **Meaningful only** | Setiap sound punya purpose — jangan add sound ke semua interaction |
| **Muted by default** | Start silent, invite user to enable. Respect context |
| **Tab-aware** | Cut/pause sound saat user leaves tab |
| **Accessible** | Visual alternatives untuk semua audio feedback |

#### Sound Palette Strategy
Seperti color palette, pilih 3-5 sounds yang coherent:
1. **Base tone** — ambient mood setter
2. **Click/tap** — primary interaction confirmation
3. **Hover whisper** — proximity feedback (optional, very subtle)
4. **Success** — completion/achievement
5. **Transition** — scene change

**Untuk Awwwards**: Sound differentiates instantly. Sebagian besar sites tidak punya sound — yang punya sound (dan bagus) langsung terasa "different level".

### Dimensi 6: Personality & Soul (Kepribadian)

Website yang "terasa" punya personality — seolah dibuat oleh manusia dengan opini, bukan oleh template atau AI.

#### Personality Signals

| Signal | Generic / Tanpa Soul | Punya Personality |
|--------|---------------------|-------------------|
| **404 page** | "Page not found" | Custom illustration + witty copy + animation |
| **Loading state** | Spinner | Cinematic sequence, brand-specific animation |
| **Cursor** | Default arrow | Custom cursor yang react ke context |
| **Footer** | Contact info, social links | "Experience closing" — Easter eggs, credits sequence |
| **Hover** | Color change | Displacement, magnetic, text scramble |
| **Copy/Microcopy** | Functional | Voice — funny, poetic, or deliberately terse |
| **Details** | None visible | Corner labels, coordinates, live clock, version number |

**14islands' philosophy**: "Creativity, craftsmanship, and care." Care = obsessing over details yang 95% user mungkin tidak notice, tapi 5% yang notice LOVE it. Dan itu 5% termasuk Awwwards jury.

#### The "Someone Made This" Test

Website yang lulus tes ini terasa punya **human authorship**:
- Apakah ada keputusan desain yang clearly opinionated? (bukan safe/generic)
- Apakah ada satu momen "oh, that's clever"?
- Apakah ada imperfection yang terasa intentional? (italic pertama, analog grain, jittery motion)
- Apakah footer terasa seperti someone actually designed it?
- Apakah ada hidden detail yang reward exploration?

---

## Emotion Mapping per Section

Panduan emosi target per section untuk portfolio:

| Section | Target Emotion | Teknik |
|---------|---------------|--------|
| **Preloader** | Anticipation, curiosity | Cinematic counter, text reveal, building tension |
| **Hero** | Awe, confidence, "this is different" | Extreme typography scale, shader/WebGL, bold statement |
| **About** | Connection, trust, warmth | Human photo, personal voice, subtle animation |
| **Work/Projects** | Excitement, curiosity, "I want to see more" | Grid distortion hover, project preview, chromatic effect |
| **Skills/Process** | Respect, understanding, competence | Clean layout, scroll-triggered data, technical detail |
| **Contact/Footer** | Invitation, closure, satisfaction | Warm CTA, experience wrap-up, memorable last impression |

### Peak-End Mapping

User ingat **puncak emosi** dan **akhir**. Desain dua momen ini dengan obsesi:

```
PEAK (momen wow terkuat):
  → Biasanya di hero ATAU satu signature interaction di tengah
  → Ini yang user screenshot dan share
  → Budget 60% creative energy ke sini

END (momen terakhir):
  → Footer / closing section
  → Jangan afterthought — ini last taste di mulut user
  → Budget 20% creative energy ke sini

EVERYTHING ELSE:
  → Solid, polished, tapi tidak compete dengan peak
  → Visual rest — izinkan peak dan end bersinar
```

---

## Practical: "Feel" Checklist

### Before Launch — "How Does This Feel?"

**Weight Test**:
- [ ] Apakah elemen besar animate lebih lambat dari elemen kecil?
- [ ] Apakah easing terasa `power3+` atau `expo`, bukan `linear`?
- [ ] Apakah ada "settling" setelah animasi berhenti?

**Temperature Test**:
- [ ] Apakah palette punya warmth/coolness yang intentional?
- [ ] Apakah texture (noise, grain) present?
- [ ] Apakah typography pilihan align dengan temperature?

**Rhythm Test**:
- [ ] Apakah ada breathing space antara dense sections?
- [ ] Apakah scroll experience punya "tension → release" moments?
- [ ] Apakah section terakhir terasa seperti closure, bukan drop-off?

**Personality Test**:
- [ ] Apakah ada minimal satu "oh that's clever" moment?
- [ ] Apakah cursor, hover, footer punya character?
- [ ] Apakah site terasa "someone made this" bukan "template"?

**Sound Test** (optional, high-impact):
- [ ] Apakah ada audio toggle yang tidak auto-play?
- [ ] Apakah sound palette coherent (3-5 sounds)?
- [ ] Apakah sound subtle dan meaningful?

**Peak-End Test**:
- [ ] Apakah ada satu momen yang user akan ingat?
- [ ] Apakah footer/closing intentionally designed?
- [ ] Apakah momen wow itu TIDAK compete dengan 5 momen lain?

---

## Hubungan dengan Portfolio Billy

**Sudah ada (visceral + behavioral kuat)**:
- Dark atmospheric theme — strong visceral reaction
- GLSL shaders (glass, fluid, text distortion) — unique visual
- Smooth scroll (Lenis) — polished behavioral
- Magnetic + chromatic + displacement hovers — premium behavioral feel
- Custom cursor — personality signal
- Noise overlay — texture/material quality

**Bisa ENHANCE untuk reflective + pleasurable**:
- Sound design — bahkan subtle hover SFX meningkatkan "feel" drastis
- Pacing/rhythm — breathing space antara dense sections
- Footer as experience closer — bukan just links
- Peak moment optimization — identify dan amplify satu signature moment
- Micro-copy personality — voice di labels, descriptions
- Temperature consistency — warm accent coherent across sections
- "Someone Made This" details — corner labels, coordinates, version number, Easter eggs
