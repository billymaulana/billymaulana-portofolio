# Motion Architecture

Cara membangun motion system yang survive di production. Dari Vladyslav Penev, 1820 Productions, dan BL/S.

---

## Prinsip: Motion Bukan Dekorasi

"I don't trust ideas until they survive the browser." — Penev

Motion di situs award-winning bukan ornamen yang ditambahkan di akhir. Motion ADALAH material desain. Semakin sedikit elemen visual, semakin besar tanggung jawab motion untuk menyampaikan kualitas.

---

## Arsitektur Input-to-Output

### 3 Sinyal Input
1. **Scroll progress** — coupling ke viewport position (normalized 0-1)
2. **Cursor position** — spatial awareness untuk interactive feedback
3. **Velocity/inertia** — physics-based lag; scroll keras = efek kuat, scroll pelan = subtle

Sinyal di-feed ke **CSS variables** → komponen downstream bereaksi lokal tanpa koordinasi global.

### Separation of Concerns
Satu elemen bisa respond ke 3 driver simultan:
- Scripted keyframe poses
- Scroll-driven transitions
- Cursor parallax

Layer-layer ini **STACK** (additive), bukan compete — mencegah jitter.

### Inertia = State Signal
Velocity diperlakukan BEDA dari position. Text deformation terikat scroll inertia: bukan "di mana user scroll" tapi "seberapa keras user scroll". Position-only deformation terasa dekoratif. Inertia membuat motion terasa intentional.

---

## Cursor System (3 Layer)

| Layer | Easing | Fungsi |
|-------|--------|--------|
| Icon | 0.15 (cepat) | Direct feedback, SVG morph (play/pause/arrow) |
| Circle | 0.08 (medium) | Spatial context |
| Label | 0.05 (lambat) | Contextual info, perceived mass |

**Performance**: SVG path di-cache saat init. Morph via `morphSVG` (rotational, 0.5s expo.out). Event delegation di document-level (capture phase) — tidak re-attach setelah navigasi.

---

## Timing Rules

| Context | Duration | Alasan |
|---------|----------|--------|
| Desktop transition | 0.6s | Layar besar butuh waktu "settle" |
| Mobile transition | 0.3s | Thumb-swipe butuh feedback cepat |
| Hover morph | 0.5s | Terasa responsive tapi smooth |
| Stagger per-element | 0.08-0.1s | Orchestrated tapi tidak lambat |
| Mobile stagger | 0.05s | Snappy |
| Easing | power3+ atau expo | BUKAN linear atau power1 |

---

## Performance Patterns

| Teknik | Kapan |
|--------|-------|
| Single rAF loop | Unify smooth scroll + WebGL + entry anims + transitions |
| GPU-resident effects | Trail rendering via texture shader, bukan DOM nodes |
| Lazy loading | Dari real content pressure, bukan teori |
| WebGL hanya saat perlu | Jika CSS tidak bisa express — bukan default |
| CSS > JS untuk animation | CSS state drive animation; JS hanya orchestrate |
| Layout = source of truth | 3D objects track DOM position/size, bukan sebaliknya |
| deltaTime capping di rAF | Cegah jank setelah tab switch |
| Module cleanup | onDestroy: kill listeners, kill timelines — cegah zombie |

---

## Abstraksi

1. One-off experiment → validated pattern → library component
2. JANGAN abstract sebelum terbukti di production (real content, edge cases, responsive)
3. Clean structure prioritas cheap iteration, bukan complexity reduction
