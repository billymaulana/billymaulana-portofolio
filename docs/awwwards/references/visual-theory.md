# Visual Theory — Fondasi Teori di Balik Visual Award-Winning

Teori visual bukan abstraksi akademis — ini **toolkit kognitif** untuk memahami KENAPA layout tertentu terasa "benar" dan yang lain terasa "off". Award-winning sites intuitively menguasai prinsip-prinsip ini, lalu melanggarnya dengan sengaja di tempat yang tepat.

Sources:
- https://www.interaction-design.org/literature/article/visual-hierarchy-organizing-content-to-follow-natural-eye-movement-patterns
- https://www.interaction-design.org/literature/topics/gestalt-principles
- https://www.smashingmagazine.com/2013/02/creating-visual-hierarchies-typography/
- https://www.interaction-design.org/literature/topics/rule-of-thirds
- https://www.figma.com/resource-library/golden-ratio/
- https://clay.global/blog/web-design-guide/visual-hierarchy-web-design
- https://www.awwwards.com/academy/course/introduction-to-color-theory-for-visual-communication
- https://www.awwwards.com/academy/course/creative-portfolios-a-powerful-visual-language-for-brands-online-course

---

## 1. Visual Hierarchy — Mengarahkan Mata

Visual hierarchy = sistem yang mengontrol **urutan mata melihat** elemen di halaman. Tanpa hierarchy, semua elemen compete for attention dan tidak ada yang menang.

### 8 Faktor Hierarchy

| Faktor | Cara Kerja | Kekuatan |
|--------|-----------|----------|
| **Size** | Besar = penting, kecil = secondary | Paling kuat — dilihat pertama |
| **Color** | Bright > dark > light > muted > grayscale | Kedua terkuat setelah size |
| **Contrast** | Perbedaan dramatic antara elemen | Direct attention ke elemen yang kontras |
| **Alignment** | Posisi strategis di area expected (top-right = action) | Memanfaatkan scanning habit |
| **Repetition** | Konsistensi → pattern. Break pattern → perhatian | Disruption yang intentional sangat powerful |
| **Proximity** | Dekat = related. Jauh = separate | Grouping otomatis di otak |
| **Whitespace** | Ruang kosong = frame yang bilang "lihat sini" | Absence creates presence |
| **Texture/Style** | Permukaan visual — smooth = calm, busy = energetic | Tone setter, bukan attention grabber |

### Brightness Hierarchy (Color)
```
Paling menarik perhatian:
  1. Bright, saturated colors (neon, vivid)
  2. Rich, deep colors (navy, burgundy)
  3. Light tints (pastel, soft)
  4. Muted, desaturated (gray-ish)
  5. Pure grayscale

Analogi: Hi-vis vest > burgundy coat > pastel shirt > gray sweater
```

**Untuk Awwwards**: Hero headline HARUS menang di hierarchy. Jika mata user pergi ke nav atau secondary element dulu, hierarchy gagal. Test: squint test — blur mata, elemen mana yang masih visible? Itu yang "menang" di hierarchy.

### Squint Test
Blur mata (atau screenshot → gaussian blur 10px). Elemen yang masih terlihat = elemen yang menang di visual hierarchy. Jika elemen salah yang menang, adjust size/contrast/color.

---

## 2. Eye Movement Patterns — Bagaimana Mata Scan

### Z-Pattern (Landing Pages, Visual-Heavy)

```
┌──── SCAN 1 (horizontal) ────┐
│  LOGO          NAV    CTA   │
│        ╲                    │
│          ╲ SCAN 2 (diagonal)│
│            ╲                │
│  HEADLINE     ╲             │
│                 ╲           │
│  SUPPORTING      SCAN 3 ─→ │
│  TEXT           CTA BUTTON  │
└─────────────────────────────┘
```

**Kapan**: Low-text content — landing pages, hero sections, portfolio grids.
**Key positions**: Top-left (logo/brand), top-right (CTA), diagonal intersection (headline), bottom-right (primary action).

### F-Pattern (Text-Heavy Content)

```
┌──── SCAN 1 (top horizontal) ─┐
│ ████████████████             │
│ ████████████                 │
│ ████████                     │
│ █ ← SCAN 2 (vertical left)  │
│ █████████████                │
│ ████████                     │
│ █                            │
│ ████████████                 │
│ █████                        │
└──────────────────────────────┘
```

**Kapan**: Blog posts, case studies, about sections — content-heavy.
**Key positions**: Top-left = paling banyak dilihat. Left margin = scanning anchor. Sub-headings = horizontal sweeps.

### Breaking Patterns = Creative Power

Award-winning sites TAHU pattern ini, lalu **intentionally break** di momen kritis:
- Elemen di center screen (bukan top-left) → forces refocus → "wow" moment
- Oversized element yang spans full viewport → resets scanning habit
- Motion that guides eye to unexpected position → narrative control

**Rule**: Ikuti pattern untuk navigability, break pattern untuk impact. Break di MAX 1-2 tempat per page.

---

## 3. Gestalt Principles — Bagaimana Otak Mengelompokkan

Otak manusia secara otomatis mengelompokkan elemen visual. Gestalt = aturan pengelompokan ini.

### Proximity (Kedekatan)
**Dekat = related. Jauh = separate.**

```
TERKAIT:           TERPISAH:
[A] [B] [C]        [A] [B]     [C]
  ← grouped →      ← group 1 → ← alone →
```

**Di web**: Margin antara section = separator. Padding dalam card = grouping. Spacing antara label dan input = relationship.

**Untuk Awwwards**: Spacing BUKAN arbitrary. Setiap jarak komunikasikan relationship. `gap: 8px` = "ini satu unit". `gap: 80px` = "ini section berbeda".

### Similarity (Kesamaan)
**Elemen yang mirip dipersepsikan sebagai satu grup.**

Similarity bisa via: shape, color, size, texture, orientation, typography.

```
● ● ● ▲ ▲ ▲    ← otak otomatis bagi jadi 2 grup
■ ■ ■ ■ ■ ■    ← dipersepsikan satu grup (semua sama)
```

**Di web**: Card yang sama = portfolio items. Label yang sama (JetBrains Mono, uppercase) = category tag. Break similarity = Von Restorff (highlight).

### Closure (Penutupan)
**Otak "melengkapi" shape yang tidak complete.**

```
(  )     ← otak melihat lingkaran, padahal hanya kurva
╔═══     ← otak melihat kotak, padahal hanya corner
```

**Di web**: Logo yang "tidak lengkap" tapi otak complete. Grid yang terpotong viewport → user tahu ada lebih banyak. Image yang crop → otak infer keseluruhan.

**Untuk Awwwards**: Closure = anticipation. Element yang partially visible = invitation to scroll. Jangan reveal semua — biarkan otak bekerja.

### Continuity (Kesinambungan)
**Mata mengikuti garis, kurva, atau arah visual.**

```
• • • • • •
            • • • • •    ← mata mengikuti alur
```

**Di web**: Scroll trajectory. Diagonal layout yang guide mata. Line/stroke yang menghubungkan sections. Animation path.

### Figure-Ground (Bentuk-Latar)
**Otak memisahkan "objek" dari "background" secara otomatis.**

```
Stable:    Light text ON dark background
           (text = figure, dark = ground)

Ambiguous: Equal visual weight between layers
           (otak bolak-balik → tension, artistic)
```

**Di web**: Z-depth layer — content (figure) di atas background (ground). Overlay, glassmorphism, blur = explicit figure-ground separation.

**Untuk Awwwards**: Playing dengan figure-ground ambiguity = creative technique. `mix-blend-mode: difference` bikin elemen "fuse" dengan background — intentional visual complexity.

### Common Region (Area Bersama)
**Elemen dalam satu boundary dipersepsikan sebagai grup.**

```
┌─────────────────┐
│  [A]  [B]  [C]  │    ← satu grup karena dalam boundary yang sama
└─────────────────┘
```

**Di web**: Card = common region. Modal = floating region. Section dengan background berbeda = region boundary.

### Common Fate (Nasib Bersama)
**Elemen yang bergerak bersama dipersepsikan sebagai grup.**

**Di web**: Parallax layers — elemen yang bergerak di speed sama = satu layer. Stagger animation — elemen yang animate dengan timing mirip = related.

---

## 4. Color Theory — Bukan Tentang Pilih Warna yang Bagus

Color theory = memahami RELATIONSHIP antara warna dan dampak psikologis/emosionalnya.

### Color Wheel Relationships

| Scheme | Relasi | Karakter | Kapan Pakai |
|--------|--------|----------|-------------|
| **Monochromatic** | Satu hue, variasi tint/shade/tone | Elegant, cohesive, calm | Portfolio dark theme, editorial |
| **Analogous** | 2-3 warna bersebelahan di wheel | Harmonis, natural, subtle | Nature brands, warm vibes |
| **Complementary** | 2 warna bersebrangan di wheel | High contrast, energetic, bold | CTA emphasis, accent pop |
| **Split-Complementary** | 1 base + 2 adjacent ke complement | Contrast tanpa tension | Balanced vibrant design |
| **Triadic** | 3 warna equidistant di wheel | Dynamic, playful, balanced | Branding, illustration |

### Color Temperature

| Temperature | Warna | Emosi | Web Usage |
|-------------|-------|-------|-----------|
| **Warm** | Red, orange, yellow, amber | Energy, passion, urgency, excitement | CTA, sale, food, entertainment |
| **Cool** | Blue, teal, green, purple | Calm, trust, professionalism, focus | Tech, finance, healthcare, SaaS |
| **Neutral** | Black, white, gray, beige | Sophistication, timelessness, editorial | Luxury, portfolio, editorial |

### Sean Adams' Color Approach
> "Understanding color rules is important, but knowing when to break them is essential."

Sean Adams (ArtCenter, Awwwards Academy) menekankan:
- Warna = **communication tool**, bukan dekorasi
- Purity dan simplicity over complexity
- Emotional resonance — warna harus bikin MERASAKAN sesuatu
- Bold when necessary — "there's no such thing as too bright" (ketika context meminta)

### Color Hierarchy dalam Layout

```
DOMINAN (60%):  Background/primary surface — sets mood
SECONDARY (30%): Section backgrounds, cards — creates rhythm
ACCENT (10%):   CTA, highlights, links — directs action

Contoh Billy's portfolio:
  Dominan:   Deep dark (#0a0a0a range) — 60%
  Secondary: Subtle grays, dark cards — 30%
  Accent:    Blue + yellow/amber — surgical 10%
```

### Practical: Grayscale Test
Convert desain ke grayscale. Jika hierarchy masih jelas (elemen penting masih stand out), color usage benar. Jika hierarchy collapse, terlalu bergantung pada color — perlu fix contrast/size.

---

## 5. Compositional Balance — Mengatur Ruang

### Rule of Thirds

```
┌───────┬───────┬───────┐
│       │       │       │
│   ◉   │       │   ◉   │  ← Intersection points =
│       │       │       │    sweet spots
├───────┼───────┼───────┤
│       │       │       │
│   ◉   │       │   ◉   │  ← Place key elements
│       │       │       │    at these intersections
├───────┼───────┼───────┤
│       │       │       │
│       │       │       │
│       │       │       │
└───────┴───────┴───────┘
```

**Di web**: Hero image subject di intersection. CTA di power position. Headline di upper-third.

### Golden Ratio (1:1.618)

```
┌────────────────────┬────────────┐
│                    │            │
│                    │            │
│     Content        │  Sidebar   │
│     (61.8%)        │  (38.2%)   │
│                    │            │
│                    │            │
└────────────────────┴────────────┘
```

**Golden ratio di font scale**: Base size × 1.618 = next level.
```
Body:     16px
H3:       16 × 1.618 ≈ 26px
H2:       26 × 1.618 ≈ 42px
H1:       42 × 1.618 ≈ 68px
Display:  68 × 1.618 ≈ 110px
```

### Balance Types

| Type | Deskripsi | Feel | Kapan Pakai |
|------|-----------|------|-------------|
| **Symmetrical** | Mirror kiri-kanan | Formal, stable, trustworthy | Corporate, luxury, editorial |
| **Asymmetrical** | Visual weight seimbang tapi beda komposisi | Dynamic, modern, creative | Portfolio, agency, creative |
| **Radial** | Elemen memancar dari center | Focus, energy, unity | Hero sections, product spotlight |
| **Mosaic** | Scattered tapi punya rhythm | Eclectic, energetic, playful | Gallery, mood board, collage |

**Untuk Awwwards**: Asymmetrical balance = standar. Symmetry terasa "safe" dan "template". Asymmetry terasa "designed" dan "intentional" — tapi harus tetap balanced secara visual weight.

### Visual Weight Factors

| Faktor | Heavier (lebih berat) | Lighter (lebih ringan) |
|--------|----------------------|----------------------|
| **Size** | Besar | Kecil |
| **Color** | Dark, saturated | Light, desaturated |
| **Density** | Dense content, detailed | Sparse, minimal |
| **Shape** | Complex, irregular | Simple, geometric |
| **Position** | Lower on page, right side | Upper on page, left side |
| **Texture** | Rough, detailed | Smooth, flat |

**Balancing trick**: Elemen besar tapi ringan (light color, simple) bisa balanced dengan elemen kecil tapi berat (dark, detailed, textured).

---

## 6. Typography as UI — Teks sebagai Material Visual

Baca juga: `visual-vocabulary.md` untuk praktek spesifik studio.

### Typographic Hierarchy Levels

| Level | Fungsi | Technique |
|-------|--------|-----------|
| **Display** | Hero statement, section hero | Extreme size (8-16vw), weight 900, tight letter-spacing |
| **H1** | Page title, section header | Large (4-8vw), bold, clear |
| **H2** | Sub-section header | Medium-large, semi-bold |
| **H3** | Card title, feature label | Medium, medium weight |
| **Body** | Main content | 16-18px, regular weight, 1.5-1.7 line-height |
| **Caption/Label** | Metadata, timestamps | Small (11-14px), uppercase, mono font, wide letter-spacing |

### Contrast Dimensions in Typography

```
CONTRAST = apa yang membedakan satu level dari level lain

5 dimensi contrast:
  1. SIZE:    48px heading vs 16px body
  2. WEIGHT:  900 (black) vs 400 (regular)
  3. CASE:    UPPERCASE label vs Sentence case body
  4. FONT:    Editorial New (serif) vs JetBrains Mono (mono)
  5. SPACING: -0.04em heading vs +0.15em label
```

Semakin banyak dimensi contrast antara dua elemen, semakin jelas hierarchy.

**Rule dari Smashing**: Test hierarchy di grayscale. Jika masih jelas tanpa color, hierarchy kuat. Color = bonus, bukan crutch.

### Grid untuk Typography

Uneven column counts (3, 5, 7) menciptakan asymmetry yang lebih menarik dari even columns (2, 4, 6).

```
BAD (boring):          GOOD (dynamic):
┌─────┬─────┐          ┌───┬─────────┐
│  1  │  2  │          │ 1 │    2    │
│     │     │          │   │         │
└─────┴─────┘          └───┴─────────┘

BAD (template):        GOOD (designed):
┌───┬───┬───┐          ┌──────┬───┬───┐
│ 1 │ 2 │ 3 │          │  1   │ 2 │ 3 │
│   │   │   │          │      │   │   │
└───┴───┴───┘          └──────┴───┴───┘
```

---

## 7. Depth & Layering — Z-Axis di 2D Screen

### Creating Depth without 3D

| Technique | Cara | Depth Level |
|-----------|------|-------------|
| **Shadow** | `box-shadow` dengan offset dan blur | Mild — card elevation |
| **Blur** | `filter: blur()` pada background layer | Medium — focus separation |
| **Overlap** | Elemen overlap via negative margin / absolute positioning | Strong — visual depth |
| **Scale** | Foreground besar, background kecil | Strong — perspective |
| **Opacity** | Background layer lebih transparan | Mild — atmospheric |
| **Parallax** | Speed berbeda per layer | Strong — kinetic depth |
| **Glassmorphism** | `backdrop-filter: blur()` + transparency | Medium — material depth |

### Layer Architecture

```
Z-INDEX STACK (bottom to top):
  z-0: Background (gradient, noise, ambient)
  z-1: Content sections (cards, text blocks)
  z-2: Overlapping elements (images crossing boundaries)
  z-3: Navigation (fixed, floating)
  z-4: Cursor (custom cursor layer)
  z-5: Overlays (modals, lightboxes)
```

**Untuk Awwwards**: Depth = salah satu hal pertama yang jury notice. Flat layout = template. Layered layout = designed. Minimal 3 depth levels: background, content, floating elements.

---

## 8. Negative Space — Keberanian Tidak Mengisi

### Negative Space sebagai Design Tool

> "A wide margin isn't wasted space — it's an inhale before the exhale."

Negative space (white space) bukan "kosong" — ini **aktif communication**:
- Mewah (brand percaya diri tidak perlu fill every pixel)
- Fokus (isolasi = emphasis)
- Rhythm (jeda antara informasi)
- Breathability (cognitive rest)

### Types

| Type | Deskripsi | Contoh |
|------|-----------|--------|
| **Macro** | Ruang besar antar section/regions | Section padding (80-120px+) |
| **Micro** | Ruang kecil antar elemen detail | Line-height, letter-spacing, padding |
| **Active** | Ruang yang sengaja didesain untuk guide attention | Isolasi CTA dengan space besar |
| **Passive** | Ruang yang terjadi natural (margin, padding) | Standard grid gaps |

### Comprehension Impact
Research: proper spacing antara content blocks meningkatkan comprehension hingga **20%**. Otak butuh visual rest stops untuk menyerap informasi.

**Untuk Awwwards**: Generous negative space = premium signal. Template sites mengisi setiap pixel. Award-winning sites berani meninggalkan ruang kosong.

---

## 9. Art Direction — Visual Language yang Koheren

### Apa itu Art Direction untuk Web

Art direction = proses mengawasi **keseluruhan aesthetic** project sehingga setiap elemen ceritakan hal yang sama. Ini bukan soal individual choice (warna ini, font itu) — ini soal **system of choices** yang coherent.

### Mood Board → Design Tokens

```
Mood Board (feeling, vibe, reference):
  → Color palette extraction
  → Typography mood (serious/playful/editorial)
  → Texture preference (clean/grainy/organic)
  → Motion personality (snappy/flowy/heavy)
  → Layout tendency (grid/organic/brutalist)

Design Tokens (implementable values):
  → --color-primary, --color-accent
  → --font-display, --font-body
  → --spacing-section, --spacing-element
  → --ease-primary, --duration-reveal
  → --radius-default, --shadow-elevation
```

### Visual Language Consistency

| Aspek | Pertanyaan | Konsisten Jika... |
|-------|-----------|-------------------|
| **Color** | Apakah accent color selalu di context yang sama? | Blue selalu = interactive, yellow selalu = highlight |
| **Typography** | Apakah hierarchy konsisten across pages? | H1 selalu sama besar, labels selalu mono |
| **Motion** | Apakah easing personality sama? | Semua reveal pakai `expo.out`, semua hover pakai `power4.out` |
| **Spacing** | Apakah grid logic konsisten? | Section padding selalu `clamp(6rem, 15vh, 12rem)` |
| **Imagery** | Apakah photo treatment sama? | Semua images punya grain filter atau monochrome treatment |
| **Interaction** | Apakah feedback pattern sama? | Semua clickable punya magnetic effect |

**Key dari 14islands**: "Creativity, craftsmanship, and care" = setiap detail intentional dan aligned. Inconsistency = "this was assembled, not designed."

### Awwwards Academy Courses

| Course | Instructor | Fokus |
|--------|-----------|-------|
| **Color Theory for Visual Communication** | Sean Adams | Color sebagai communication tool, rules + kapan break them |
| **Creative Portfolios: Visual Language** | Awwwards Academy | Turn visual arts into functional design |
| **Art Direction & Design Leadership** | Awwwards Academy | Creative toolkit across media, design systems thinking |

---

## Synthesis: Visual Theory → Awwwards Scoring

```
DESIGN (40%):
  Visual Hierarchy → mata diarahkan ke content penting
  Color Theory → palette yang ceritakan narasi
  Compositional Balance → asymmetric tapi balanced
  Typography as UI → text sebagai primary visual element
  Depth & Layering → bukan flat, ada z-axis

USABILITY (30%):
  Gestalt Principles → grouping jelas tanpa explanation
  Eye Movement → content di scanning sweet spots
  Negative Space → breathable, tidak overwhelming
  Contrast → accessible, readable

CREATIVITY (20%):
  Breaking Patterns → intentional disruption di 1-2 spot
  Art Direction → unique visual language, bukan template
  Figure-Ground play → creative ambiguity
  Typography experimentation → type sebagai art, bukan hanya text
```

---

## Hubungan dengan Portfolio Billy

**Sudah strong**:
- Dark theme dengan extreme contrast (deep dark + bright accent)
- Typography hierarchy (oversized hero, small labels)
- Depth layering (WebGL, overlay, content layers)
- Asymmetric layout approach
- Planned imperfection (italic, grain, jitter)

**Bisa ENHANCE**:
- Golden ratio pada type scale (verify current scale vs 1.618 progression)
- More intentional Z-pattern layout pada hero (CTA di power positions)
- Visual weight balancing — pastikan asymmetric sections balanced via weight, bukan just feeling
- Active negative space — audit apakah section padding cukup generous
- Color as narrative — document KENAPA blue dan yellow dipilih (bukan just "looks good")
- Art direction tokens — formalize visual language ke CSS custom properties yang consistent
