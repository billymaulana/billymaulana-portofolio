# Math for Motion — Matematika di Balik Animasi Award-Winning

Memahami KENAPA animasi terasa natural (atau tidak) membutuhkan matematika dasar. Ini bukan teori abstrak — ini tools yang langsung applicable saat tuning easing, membuat spring animation, atau memahami kenapa `power4.out` terasa lebih baik dari `linear`.

Sources:
- https://blog.maximeheckel.com/posts/cubic-bezier-from-math-to-motion/
- https://blog.maximeheckel.com/posts/the-physics-behind-spring-animations/
- https://easings.net/
- https://www.smashingmagazine.com/2011/10/quick-look-math-animations-javascript/

---

## 1. Linear Interpolation (Lerp) — Foundation Semua Motion

**Formula**: `lerp(a, b, t) = (1 - t) * a + t * b`

Dimana `t` bergerak dari 0.0 ke 1.0. Ini "alphabet" dari semua animasi — setiap property yang berubah dari A ke B menggunakan interpolation.

**Dalam konteks web**:
```
// Posisi antara 0px dan 500px, saat progress 0.3
lerp(0, 500, 0.3) = 150px

// Opacity dari 0 ke 1, saat progress 0.7
lerp(0, 1, 0.7) = 0.7
```

**Kenapa penting**: GSAP internal breakdown: setiap frame, GSAP menghitung progress (0-1), apply easing function ke progress, lalu lerp setiap property. Memahami lerp = memahami apa yang terjadi di setiap frame animasi.

### Variasi Lerp

| Fungsi | Formula | Kapan Pakai |
|--------|---------|-------------|
| **Lerp** | `(1-t)*a + t*b` | Posisi, opacity, scale — nilai linear |
| **Slerp** | Spherical interpolation | Rotasi 3D — interpolasi di permukaan sphere |
| **SmoothStep** | `3t² - 2t³` | Transisi yang starts slow, ends slow — natural feel |
| **SmoothDamp** | Velocity-based decay | Cursor following, camera tracking — inertia feel |
| **InverseLerp** | `(value - a) / (b - a)` | Normalize value ke range 0-1 — useful untuk mapping |

**SmoothStep** adalah yang paling sering dipakai secara implisit — ini basis dari `ease-in-out`. First derivative = 0 di kedua endpoint, sehingga terasa smooth tanpa sudden start/stop.

---

## 2. Easing Functions — Memberi Personality ke Motion

Easing function mengubah linear progress (0→1) menjadi curved progress. Ini yang membedakan animasi "murah" dari "mahal".

### Anatomi Easing

```
Input:  t (linear progress, 0.0 → 1.0)
Output: eased value (bisa > 1.0 untuk overshoot)

ease-in:     mulai lambat, akhir cepat (acceleration)
ease-out:    mulai cepat, akhir lambat (deceleration)
ease-in-out: lambat-cepat-lambat (S-curve)
```

### 30 Easing Functions (Dari easings.net)

| Family | Ease-In | Ease-Out | Ease-In-Out | Karakter |
|--------|---------|----------|-------------|----------|
| **Sine** | easeInSine | easeOutSine | easeInOutSine | Paling subtle, gentle |
| **Quad** | easeInQuad | easeOutQuad | easeInOutQuad | Mild curve (t²) |
| **Cubic** | easeInCubic | easeOutCubic | easeInOutCubic | Medium curve (t³) |
| **Quart** | easeInQuart | easeOutQuart | easeInOutQuart | Strong curve (t⁴) |
| **Quint** | easeInQuint | easeOutQuint | easeInOutQuint | Very strong (t⁵) |
| **Expo** | easeInExpo | easeOutExpo | easeInOutExpo | Exponential — dramatic |
| **Circ** | easeInCirc | easeOutCirc | easeInOutCirc | Circular arc |
| **Back** | easeInBack | easeOutBack | easeInOutBack | Overshoot — "winds up" |
| **Elastic** | easeInElastic | easeOutElastic | easeInOutElastic | Bouncy spring |
| **Bounce** | easeInBounce | easeOutBounce | easeInOutBounce | Ball drop |

### Mapping ke GSAP

| Easing Family | GSAP Equivalent | Kapan Pakai |
|---------------|-----------------|-------------|
| Quad | `power1` | Terlalu subtle — jarang pakai |
| Cubic | `power2` | Basic transitions |
| Quart | `power3` | **Standard Awwwards** — section reveals, fades |
| Quint | `power4` | **Premium feel** — hover, micro-interactions |
| Expo | `expo` | **Dramatic** — page transitions, hero reveals |
| Back | `back` | Overshoot effect — playful UI |
| Elastic | `elastic` | Bouncy — toggle, notification |
| Bounce | `bounce` | Ball physics — loading indicators |

### Math di Balik Easing

```
// Polynomial easing — semakin tinggi power, semakin dramatic
easeInQuad(t)  = t²      // power1
easeInCubic(t) = t³      // power2
easeInQuart(t) = t⁴      // power3
easeInQuint(t) = t⁵      // power4

// Ease-out = mirror ease-in
easeOutQuad(t)  = 1 - (1-t)²
easeOutCubic(t) = 1 - (1-t)³

// Ease-in-out = combine both halves
easeInOutCubic(t) = t < 0.5 ? 4t³ : 1 - (-2t + 2)³ / 2

// Exponential — most dramatic acceleration
easeInExpo(t) = t === 0 ? 0 : 2^(10t - 10)

// Back — overshoot via constant c1 = 1.70158
easeInBack(t) = (c1+1)*t³ - c1*t²
```

**Key insight**: Semakin tinggi power, semakin "mahal" motion terasa. `power4.out` dan `expo.out` adalah standar untuk Awwwards karena deceleration mereka yang dramatic bikin elemen terasa "tiba dengan berat".

---

## 3. Cubic Bezier — Custom Easing

**Formula**:
```
P(t) = (1-t)³·P0 + 3(1-t)²t·P1 + 3(1-t)t²·P2 + t³·P3
```

P0 = (0,0), P3 = (1,1) fixed. P1 dan P2 = control points yang kamu set.

### CSS/GSAP Mapping

```css
/* CSS cubic-bezier(x1, y1, x2, y2) = P1(x1,y1), P2(x2,y2) */
transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1); /* expo.out equivalent */
```

### Common Curves

| Name | cubic-bezier | Feel |
|------|-------------|------|
| **Expo Out** | `(0.16, 1, 0.3, 1)` | Swift deceleration — premium |
| **Quart Out** | `(0.25, 1, 0.5, 1)` | Smooth deceleration |
| **Back Out** | `(0.34, 1.56, 0.64, 1)` | Slight overshoot — playful |
| **Snap** | `(0.55, 0, 0.1, 1)` | Sudden start, smooth end |
| **Cinematic** | `(0.77, 0, 0.175, 1)` | Film-like dramatic move |

**Untuk Awwwards**: Buat 3-4 custom bezier curves per project sebagai "motion personality". Jangan pakai default ease di semua tempat — itu yang bikin situs terasa generic.

---

## 4. Trigonometry — Oscillation & Circular Motion

### Sine/Cosine untuk Animasi

```
// Oscillation (breathing, pulse, wave)
value = amplitude * Math.sin(time * frequency)

// Normalize sine dari [-1,1] ke [0,1]
normalized = Math.sin(time) / 2 + 0.5

// Circular motion (orbital, rotation)
x = centerX + radius * Math.cos(angle)
y = centerY + radius * Math.sin(angle)
```

### Kapan Pakai di Web

| Effect | Trigonometry | Example |
|--------|-------------|---------|
| **Breathing pulse** | `sin(time * 2)` | Background glow yang "bernapas" |
| **Wave distortion** | `sin(x * freq + time)` | Text wave, image ripple |
| **Circular path** | `cos(t) / sin(t)` | Orbital menu, particle paths |
| **Pendulum** | `sin(time) * decay` | Notification wobble, enter animation |
| **Float** | `sin(time * 0.5) * 3` | Floating element yang terasa "hidup" |
| **Rotation angle** | `atan2(dy, dx)` | Element pointing toward cursor |

### Konversi Derajat ↔ Radian
```
toRadian = degrees * (Math.PI / 180)
toDegree = radians * (180 / Math.PI)
```

---

## 5. Spring Physics — Natural Motion

Spring animation terasa lebih natural dari easing karena berbasis fisika nyata, bukan kurva arbitrary.

### Hooke's Law
```
F_spring = -stiffness * displacement
F_damping = -damping * velocity
F_total = F_spring + F_damping
acceleration = F_total / mass
```

### Update Loop (Per Frame)
```
velocity += acceleration * dt
position += velocity * dt
```

### 3 Damping Types

| Type | Damping Ratio | Visual | Kapan Pakai |
|------|---------------|--------|-------------|
| **Underdamped** | < 1.0 | Overshoot + oscillation | Playful bouncy UI, notification |
| **Critically Damped** | = 1.0 | Fastest settle, no overshoot | Smooth transitions, form fields |
| **Overdamped** | > 1.0 | Slow settle, no overshoot | Gentle, luxury feel |

### Parameter Tuning

| Parameter | Efek Saat Dinaikkan | Default (Framer Motion) |
|-----------|--------------------|-----------------------|
| **Stiffness** | Lebih snappy/cepat | 100 |
| **Damping** | Lebih cepat settle, kurang bounce | 10 |
| **Mass** | Lebih berat, reaksi lebih lambat | 1 |

**Untuk Awwwards**: Underdamped springs (sedikit bounce) pada micro-interactions bikin UI terasa "alive". Critically damped untuk page transitions — smooth tanpa overshoot. GSAP punya `CustomEase` dan `CustomBounce` yang bisa simulate spring behavior.

---

## 6. Momentum & Velocity — Scroll-Driven Motion

### Velocity sebagai State Signal

```
velocity = (currentPosition - lastPosition) / deltaTime
momentum = momentum * decayFactor + velocity * inertiaFactor
```

Ini yang bikin motion terasa "berbobot" — elemen tidak langsung berhenti tapi punya inertia.

### Decay Factor

```
// Exponential decay — paling natural
value *= 0.95  // per frame, value berkurang 5%

// Asymptotic approach — smooth settle
value += (target - value) * ease  // ease = 0.05-0.15
```

**Decay 0.95** = elemen berhenti dalam ~60 frames (~1s di 60fps)
**Decay 0.98** = elemen berhenti dalam ~150 frames (~2.5s) — terasa lebih "luxurious"

### Scroll Velocity → Visual Intensity

| Scroll Speed | Visual Response |
|-------------|----------------|
| Lambat | Subtle parallax, gentle reveals |
| Normal | Standard animations play |
| Cepat | Text deformation, blur increase, parallax amplified |
| Berhenti | Settle animation, elements "breathe" |

Ini prinsip dari Vladyslav Penev — motion respond ke HOW user scroll, bukan hanya WHERE.

---

## 7. Noise Functions — Organic Randomness

### Kenapa Math.random() Tidak Cukup

`Math.random()` = chaotic, tidak smooth. Noise = "smooth randomness" — nilai yang berubah continuously tanpa sudden jumps.

### Simplex/Perlin Noise untuk Motion

```
// Jitter yang terasa organic (bukan mechanical)
offset = noise(time * frequency) * amplitude

// 2D noise untuk displacement
dx = noise(x * 0.01, y * 0.01, time) * strength
dy = noise(x * 0.01 + 100, y * 0.01, time) * strength
```

### Fractal Brownian Motion (fBM)

Layered noise di berbagai frequency — semakin banyak layer, semakin detailed dan organic.

```
// Pseudo-code untuk fBM
result = 0
amplitude = 1
frequency = 1
for (i = 0; i < octaves; i++) {
  result += noise(position * frequency) * amplitude
  amplitude *= 0.5  // persistence
  frequency *= 2.0  // lacunarity
}
```

**Untuk Awwwards**: fBM sebagai driver untuk atmospheric backgrounds, cursor trail randomness, dan subtle element jitter yang bikin situs terasa "hidup" bukan "rendered".

---

## Cheat Sheet: Math → GSAP/CSS

| Math Concept | GSAP Implementation | CSS Implementation |
|-------------|--------------------|--------------------|
| Lerp | Internal (setiap tween) | `transition` property |
| Easing (polynomial) | `ease: "power3.out"` | `cubic-bezier(0.25, 1, 0.5, 1)` |
| Easing (exponential) | `ease: "expo.out"` | `cubic-bezier(0.16, 1, 0.3, 1)` |
| Easing (back) | `ease: "back.out(1.7)"` | `cubic-bezier(0.34, 1.56, 0.64, 1)` |
| Spring | `CustomEase` / `CustomBounce` | `linear(...)` (CSS Springs) |
| Sine oscillation | `gsap.to(el, { y: "+=10", repeat: -1, yoyo: true })` | `@keyframes` + `animation-iteration-count: infinite` |
| Circular motion | `MotionPathPlugin` | `offset-path: path(...)` |
| Decay/momentum | `InertiaPlugin` | Tidak native — butuh JS |
| Noise | Custom via `onUpdate` callback | Tidak tersedia — butuh JS/GLSL |

---

## Kapan Harus Peduli Math

| Situasi | Math yang Dibutuhkan |
|---------|---------------------|
| Tuning easing feel | Polynomial power levels, bezier control points |
| Cursor following | Lerp, decay factor, SmoothDamp |
| Scroll-driven intensity | Velocity calculation, momentum decay |
| Breathing/floating | Sine oscillation, amplitude/frequency |
| Particle movement | Noise, trigonometric paths, velocity |
| Spring UI (toggle, modal) | Stiffness, damping, mass |
| Custom GLSL shader | All of the above — shaders ARE math |
| "Kenapa animasi ini terasa aneh?" | Usually wrong easing or missing decay |

**Rule of thumb**: Jika animasi terasa "off" tapi kamu tidak bisa articulate kenapa — kemungkinan besar masalahnya di easing curve atau missing inertia/decay. Math is the debugging tool untuk motion feel.
