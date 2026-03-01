# Liquid Shader Code Patterns — GLSL Reference

Kompilasi GLSL snippets dari research mendalam: ripple, fluid sim, liquid glass,
text-as-liquid, dan post-processing. Setiap shader siap diintegrasikan dengan
pola GSAP uniform yang ada di `liquid-advanced.md`.

---

## 1. DISTORTION SHADERS (Screen-Space)

### 1A. Ripple / Water Distortion

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uRippleCenter;   // mouse pos atau fixed center
uniform float uRippleRadius;  // grows with time or mouse distance
uniform float uRippleStrength;

void main() {
  vec2 center = uRippleCenter;
  float dist = distance(vUv, center);

  // Circular ripple expanding outward
  float ripple = sin(dist * 80.0 - uTime * 5.0) * uRippleStrength;
  ripple *= smoothstep(uRippleRadius + 0.05, uRippleRadius, dist);
  ripple *= smoothstep(0.0, 0.02, dist);  // avoid center spike

  vec2 distorted = vUv + normalize(vUv - center) * ripple;
  fragColor = texture(uTexture, distorted);
}
```

**GSAP Connection:**
```typescript
// Ripple yang rise & settle (bukan fade, tapi naik lalu turun)
gsap.to(uniforms.uRippleStrength, {
  keyframes: { value: [0, 0.015, 0] },
  duration: 1.5,
  ease: 'none',
  onUpdate: () => {
    uniforms.uRippleRadius.value += 0.01; // expand radius per frame
  }
})
```

---

### 1B. Liquid Morph (Image Transition)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform float uProgress;   // 0.0 → 1.0, driven by GSAP
uniform float uStrength;   // distortion intensity ~0.15

// fBm (fractal Brownian motion) untuk organic distortion
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }
float noise(vec2 p) {
  vec2 i = floor(p); vec2 f = fract(p);
  float a = hash(i), b = hash(i + vec2(1,0));
  float c = hash(i + vec2(0,1)), d = hash(i + vec2(1,1));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
  return v;
}

void main() {
  float n = fbm(vUv * 3.0 + uProgress);

  // Progressive displacement: from → distorted from → distorted to → to
  float s = smoothstep(0.0, 0.5, uProgress);
  float e = smoothstep(0.5, 1.0, uProgress);

  vec2 dispFrom = vUv + vec2(n * 2.0 - 1.0) * uStrength * s;
  vec2 dispTo   = vUv + vec2(n * 2.0 - 1.0) * uStrength * (1.0 - e);

  vec4 from = texture(uFrom, dispFrom);
  vec4 to   = texture(uTo,   dispTo);

  fragColor = mix(from, to, uProgress);
}
```

---

### 1C. Heat Haze (Ambient Distortion)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uScene;
uniform float uTime;
uniform float uIntensity;   // 0.0 → 0.01 (very subtle)

float noise(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  float n1 = noise(vUv * 5.0 + vec2(uTime * 0.2, 0.0));
  float n2 = noise(vUv * 8.0 + vec2(0.0, uTime * 0.15));

  vec2 distortion = vec2(n1 - 0.5, n2 - 0.5) * uIntensity;

  // Vertical bias: heat rises
  distortion.x *= 0.3;
  distortion.y *= 1.5;
  distortion.y *= 1.0 - vUv.y;  // stronger at bottom

  fragColor = texture(uScene, vUv + distortion);
}
```

---

### 1D. Barrel / Lens Distortion

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uScene;
uniform float uBarrelStrength;  // positive = barrel, negative = pincushion

vec2 barrelDistort(vec2 uv, float k) {
  vec2 p = uv - 0.5;
  float r2 = dot(p, p);
  float distort = 1.0 + k * r2;
  return p * distort + 0.5;
}

void main() {
  vec2 distorted = barrelDistort(vUv, uBarrelStrength);

  // Chromatic split for extra lens effect
  float ca = uBarrelStrength * 0.5;
  float r = texture(uScene, barrelDistort(vUv, uBarrelStrength + ca)).r;
  float g = texture(uScene, distorted).g;
  float b = texture(uScene, barrelDistort(vUv, uBarrelStrength - ca)).b;

  fragColor = vec4(r, g, b, 1.0);
}
```

---

### 1E. Chromatic Aberration — Spectral (Wagner / 12-tap)

Versi premium dengan 12 sample dan spectral decomposition. Sumber: [spite/Wagner](https://github.com/spite/Wagner/blob/master/fragment-shaders/chromatic-aberration-fs.glsl).

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uIntensity;  // 0.0 → 2.2, animated by GSAP

vec2 barrelDistortion(vec2 coord, float amt) {
  vec2 cc = coord - 0.5;
  float dist = dot(cc, cc);
  return coord + cc * dist * amt;
}

float sat(float t) { return clamp(t, 0.0, 1.0); }
float linterp(float t) { return sat(1.0 - abs(2.0 * t - 1.0)); }
float remap(float t, float a, float b) { return sat((t - a) / (b - a)); }

vec4 spectrumOffset(float t) {
  float lo = step(t, 0.5);
  float hi = 1.0 - lo;
  float w = linterp(remap(t, 1.0/6.0, 5.0/6.0));
  vec4 ret = vec4(lo, 1.0, hi, 1.0) * vec4(1.0 - w, w, 1.0 - w, 1.0);
  return pow(ret, vec4(1.0/2.2));
}

void main() {
  const int NUM_ITER = 12;
  const float RCP = 1.0 / float(NUM_ITER);

  vec4 sumcol = vec4(0.0);
  vec4 sumw = vec4(0.0);

  for (int i = 0; i < NUM_ITER; i++) {
    float t = float(i) * RCP;
    vec4 w = spectrumOffset(t);
    sumw += w;
    sumcol += w * texture(uTexture, barrelDistortion(vUv, uIntensity * t));
  }

  fragColor = sumcol / sumw;
}
```

**Versi simpel (velocity-based, 3 lookups):**
```glsl
uniform vec2 uMouseVelocity;
void main() {
  float r = texture(uTexture, vUv + uMouseVelocity * 0.50).r;
  float g = texture(uTexture, vUv + uMouseVelocity * 0.525).g;
  float b = texture(uTexture, vUv + uMouseVelocity * 0.55).b;
  fragColor = vec4(r, g, b, 1.0);
}
```

**GSAP Connection:**
```typescript
gsap.to(uniforms.uIntensity, {
  value: 2.0, duration: 0.3, ease: 'power2.out',
  onComplete: () => gsap.to(uniforms.uIntensity, { value: 0.0, duration: 1.0, ease: 'power3.out' })
})
```

---

### 1F. Metaball Blending (SDF Liquid Blobs)

Blob-blob liquid yang melebur saat berdekatan menggunakan SDF + smooth minimum. Sumber: [Codrops 2D Metaballs](https://tympanus.net/codrops/2021/01/19/drawing-2d-metaballs-with-webgl2/), [Codrops Droplet Metaballs 2025](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/).

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;

#define NUM_BALLS 5

// Smooth minimum — kunci dari efek liquid merging
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

float sdCircle(vec2 p, vec2 center, float radius) {
  return length(p - center) - radius;
}

void main() {
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(uResolution.x / uResolution.y, 1.0);

  float d = 1e10;
  for (int i = 0; i < NUM_BALLS; i++) {
    float fi = float(i);
    vec2 pos = vec2(
      sin(uTime * 0.7 + fi * 1.3) * 0.4,
      cos(uTime * 0.5 + fi * 2.1) * 0.3
    );
    float radius = 0.15 + sin(uTime + fi) * 0.05;
    d = smin(d, sdCircle(uv, pos, radius), 0.3);
  }

  // Mouse-driven ball
  vec2 mousePos = uMouse * 2.0 - 1.0;
  mousePos.x *= uResolution.x / uResolution.y;
  d = smin(d, sdCircle(uv, mousePos, 0.2), 0.4);

  vec3 fillColor = vec3(0.0, 0.28, 1.0);   // electric blue
  vec3 edgeColor = vec3(0.0, 0.96, 1.0);   // cyan glow

  float fill = 1.0 - smoothstep(0.0, 0.01, d);
  float edge = 1.0 - smoothstep(0.0, 0.05, abs(d));

  vec3 color = mix(vec3(0.0), fillColor, fill);
  color += edgeColor * edge * 0.5;

  fragColor = vec4(color, fill + edge * 0.3);
}
```

**Performance**: O(n) per pixel. Sampai 20-30 balls tetap 60fps.

---

## 2. FLUID SIMULATION & PROCEDURAL SHADERS

### 2A. Curl Noise (Divergence-Free Velocity Field)

Noise yang tidak spread/converge — sempurna untuk fluid particle velocity. Sumber: [cabbibo/glsl-curl-noise](https://github.com/cabbibo/glsl-curl-noise), [Emil Dziewanowski](https://emildziewanowski.com/curl-noise/).

```glsl
// Curl Noise: divergence-free velocity field dari simplex noise gradient
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  // Cross product of gradient = divergence-free
  return normalize(vec3(
    (snoise(p + dy) - snoise(p - dy)) - (snoise(p + dz) - snoise(p - dz)),
    (snoise(p + dz) - snoise(p - dz)) - (snoise(p + dx) - snoise(p - dx)),
    (snoise(p + dx) - snoise(p - dx)) - (snoise(p + dy) - snoise(p - dy))
  ) / (2.0 * e));
}
```

**Bitangent Noise (2x lebih efisien)** — sumber: [atyuwen/bitangent_noise](https://github.com/atyuwen/bitangent_noise):
```glsl
// Hanya 2 gradient evaluations (vs 6 untuk curl standard)
vec3 bitangentNoise(vec3 p) {
  vec3 n = snoise3D_grad(p);  // noise + gradient
  vec3 t = snoise3D_grad(p + vec3(31.416, 47.853, 12.793));
  return cross(n, t);  // divergence-free by construction
}
```

**GSAP**: Animate `uTime` yang di-feed ke `curlNoise(position + uTime * 0.1)` untuk evolusi organik.

---

### 2B. Reaction-Diffusion (Gray-Scott Model)

Dua "chemical" bereaksi dan berdifusi → pola organik (coral, fingerprint, mitosis). Sumber: [jasonwebb/rd-playground](https://github.com/jasonwebb/reaction-diffusion-playground), [Karl Sims](https://www.karlsims.com/rd.html).

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uPrevState;  // ping-pong input
uniform vec2 uTexelSize;
uniform float uFeedRate;       // F: ~0.0545 (mitosis pattern)
uniform float uKillRate;       // K: ~0.062
uniform float uDiffusionA;     // Da: ~1.0
uniform float uDiffusionB;     // Db: ~0.5
uniform float uTimestep;       // dt: ~1.0

void main() {
  // Current state: R = chemical A, G = chemical B
  vec4 state = texture(uPrevState, vUv);
  float A = state.r;
  float B = state.g;

  // Laplacian convolution (3x3)
  float lapA = 0.0, lapB = 0.0;
  vec4 s;

  // Adjacent (weight 0.2)
  s = texture(uPrevState, vUv + vec2(-uTexelSize.x, 0.0)); lapA += s.r*0.2; lapB += s.g*0.2;
  s = texture(uPrevState, vUv + vec2(uTexelSize.x, 0.0));  lapA += s.r*0.2; lapB += s.g*0.2;
  s = texture(uPrevState, vUv + vec2(0.0, -uTexelSize.y)); lapA += s.r*0.2; lapB += s.g*0.2;
  s = texture(uPrevState, vUv + vec2(0.0, uTexelSize.y));  lapA += s.r*0.2; lapB += s.g*0.2;

  // Diagonal (weight 0.05)
  s = texture(uPrevState, vUv + vec2(-uTexelSize.x, -uTexelSize.y)); lapA += s.r*0.05; lapB += s.g*0.05;
  s = texture(uPrevState, vUv + vec2(uTexelSize.x, -uTexelSize.y));  lapA += s.r*0.05; lapB += s.g*0.05;
  s = texture(uPrevState, vUv + vec2(-uTexelSize.x, uTexelSize.y));  lapA += s.r*0.05; lapB += s.g*0.05;
  s = texture(uPrevState, vUv + vec2(uTexelSize.x, uTexelSize.y));   lapA += s.r*0.05; lapB += s.g*0.05;

  lapA -= A;  // center weight = -1
  lapB -= B;

  // Gray-Scott equations
  float reaction = A * B * B;
  float newA = A + (uDiffusionA * lapA - reaction + uFeedRate * (1.0 - A)) * uTimestep;
  float newB = B + (uDiffusionB * lapB + reaction - (uKillRate + uFeedRate) * B) * uTimestep;

  fragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
}
```

**Pattern Variants** (F, K values):
- Mitosis: F=0.0545, K=0.062
- Coral: F=0.0545, K=0.0625
- Spots: F=0.035, K=0.065
- Stripes: F=0.025, K=0.06

---

### 2C. Voronoi Liquid Cell Patterns

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform float uTime;

vec2 random2(vec2 p) {
  return fract(sin(vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)))) * 43758.5453);
}

void main() {
  vec2 st = vUv * 5.0;
  vec2 i_st = floor(st);
  vec2 f_st = fract(st);
  float m_dist = 1.0;

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 neighbor = vec2(float(x), float(y));
      vec2 point = random2(i_st + neighbor);
      // Animate cells
      point = 0.5 + 0.5 * sin(uTime * 0.5 + 6.2831 * point);
      float dist = length(neighbor + point - f_st);
      m_dist = min(m_dist, dist);
    }
  }

  vec3 color = m_dist * vec3(0.0, 0.28, 1.0);
  color += 1.0 - step(0.02, m_dist);  // cell borders

  fragColor = vec4(color, 1.0);
}
```

---

### 2D. SPH (Smoothed Particle Hydrodynamics) — Particle-Based

SPH menggunakan partikel dengan properti fisika. Cocok untuk efek droplet/blob.

```glsl
// Vertex shader: update particle positions
#version 300 es

in vec2 aPosition;
in vec2 aVelocity;
in float aDensity;
in float aPressure;

out vec2 vPosition;
out vec2 vVelocity;

uniform float uDeltaTime;
uniform vec2 uGravity;    // vec2(0, -9.8)
uniform float uBounds;

float sphKernel(float r, float h) {
  // Poly6 kernel
  if (r > h) return 0.0;
  float t = h * h - r * r;
  return (315.0 / (64.0 * 3.14159 * pow(h, 9.0))) * t * t * t;
}

void main() {
  // Pressure force (simplified)
  vec2 pressureForce = -vec2(dFdx(aPressure), dFdy(aPressure));

  // Viscosity force
  vec2 viscForce = vec2(0.0);  // simplified

  vec2 force = pressureForce + viscForce + uGravity;
  vec2 vel = aVelocity + force * uDeltaTime / max(aDensity, 0.001);
  vec2 pos = aPosition + vel * uDeltaTime;

  // Boundary reflection
  if (abs(pos.x) > uBounds) vel.x *= -0.5;
  if (abs(pos.y) > uBounds) vel.y *= -0.5;
  pos = clamp(pos, -uBounds, uBounds);

  vPosition = pos;
  vVelocity = vel;

  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = 10.0;
}
```

**Performance**: Viable at 1000-3000 particles. Gunakan Transform Feedback.

---

### 2B. LBM (Lattice Boltzmann Method) — Grid-Based Fluid

Lebih akurat untuk fluid sim yang smooth. Sumber Navier-Stokes numerik.

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uDistributions;  // stores 9 distribution functions (D2Q9)
uniform float uOmega;              // relaxation parameter 0.5-1.9

// D2Q9 lattice directions
const vec2 e[9] = vec2[9](
  vec2(0,0), vec2(1,0), vec2(0,1), vec2(-1,0), vec2(0,-1),
  vec2(1,1), vec2(-1,1), vec2(-1,-1), vec2(1,-1)
);
const float w[9] = float[9](
  4.0/9.0, 1.0/9.0, 1.0/9.0, 1.0/9.0, 1.0/9.0,
  1.0/36.0, 1.0/36.0, 1.0/36.0, 1.0/36.0
);

void main() {
  vec2 texSize = vec2(textureSize(uDistributions, 0));
  vec2 texel = 1.0 / texSize;

  // Streaming: gather from neighbors
  float rho = 0.0;
  vec2 u = vec2(0.0);

  for (int i = 0; i < 9; i++) {
    // Read distribution from streaming position
    vec2 srcPos = vUv - e[i] * texel;
    float fi = texture(uDistributions, srcPos).r; // simplified: all in one
    rho += fi;
    u += fi * e[i];
  }
  u /= max(rho, 0.001);

  // BGK collision
  float feq_sum = 0.0;
  for (int i = 0; i < 9; i++) {
    float eu = dot(e[i], u);
    float feq = w[i] * rho * (1.0 + 3.0*eu + 4.5*eu*eu - 1.5*dot(u,u));
    feq_sum += feq;
  }

  fragColor = vec4(rho, u.x, u.y, 1.0);
}
```

**Performance**: Heavy — gunakan 256x256 max. Pre-bake jika memungkinkan (Lusion technique).

---

## 3. LIQUID GLASS SHADERS

### 3A. Refraction Shader (Snell's Law)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uScene;        // background scene
uniform sampler2D uNormalMap;    // glass surface normals
uniform float uIOR;              // index of refraction ~1.5
uniform float uThickness;        // glass thickness
uniform float uChromaticSpread;  // RGB IOR variation

void main() {
  vec3 normal = texture(uNormalMap, vUv).xyz * 2.0 - 1.0;

  // Screen-space refraction: offset UV by normal
  float iorRatio = 1.0 / uIOR;
  vec2 refractionOffset = normal.xy * uThickness * (1.0 - iorRatio);

  // Chromatic dispersion: different IOR per channel
  float spreadR = uChromaticSpread * 0.8;
  float spreadG = uChromaticSpread * 1.0;
  float spreadB = uChromaticSpread * 1.2;

  float r = texture(uScene, vUv + refractionOffset * spreadR).r;
  float g = texture(uScene, vUv + refractionOffset * spreadG).g;
  float b = texture(uScene, vUv + refractionOffset * spreadB).b;

  // Fresnel effect
  float fresnel = pow(1.0 - abs(normal.z), 3.0);
  vec3 refracted = vec3(r, g, b);
  vec3 reflected = vec3(0.8, 0.9, 1.0) * 0.1;

  vec3 color = mix(refracted, reflected, fresnel * 0.3);
  fragColor = vec4(color, 1.0);
}
```

---

### 3B. Frosted Glass Blur (Multi-Pass Kawase)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTexture;
uniform float uBlurAmount;  // 0.0 → 10.0, animated by GSAP

vec4 kawaseBlur(sampler2D tex, vec2 uv, float offset) {
  vec2 texelSize = vec2(1.0) / vec2(textureSize(tex, 0));
  vec4 color = vec4(0.0);
  color += texture(tex, uv + vec2(offset, offset) * texelSize);
  color += texture(tex, uv + vec2(-offset, offset) * texelSize);
  color += texture(tex, uv + vec2(offset, -offset) * texelSize);
  color += texture(tex, uv + vec2(-offset, -offset) * texelSize);
  return color * 0.25;
}

void main() {
  vec4 blur1 = kawaseBlur(uTexture, vUv, 1.0 + uBlurAmount * 1.5);
  vec4 blur2 = kawaseBlur(uTexture, vUv, 2.0 + uBlurAmount);
  vec4 blur3 = kawaseBlur(uTexture, vUv, 3.0 + uBlurAmount * 2.5);

  float t1 = smoothstep(0.0, 3.0, uBlurAmount);
  float t2 = smoothstep(3.0, 7.0, uBlurAmount);

  vec4 blurredTexture = mix(blur1, blur2, t1);
  blurredTexture = mix(blurredTexture, blur3, t2);

  float mixFactor = smoothstep(0.0, 1.0, uBlurAmount);
  fragColor = mix(texture(uTexture, vUv), blurredTexture, mixFactor);
}
```

**GSAP Connection:**
```typescript
gsap.to(uniforms.uBlurAmount, {
  value: 8.0,
  scrollTrigger: {
    trigger: '.glass-section',
    scrub: true,
    start: 'top center',
    end: 'bottom center'
  }
})
```

---

### 3C. Caustic Patterns (Procedural)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform float uScale;
uniform float uIntensity;

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float caustic(vec2 uv) {
  vec2 p = floor(uv);
  vec2 f = fract(uv);
  float va = 0.0, wt = 0.0;

  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(p + g);
      o = 0.5 + 0.5 * sin(uTime * 0.5 + 6.2831 * o);
      vec2 r = g - f + o;
      float d = length(r);
      float ww = pow(1.0 - smoothstep(0.0, 1.414, d), 4.0);
      va += o.x * ww;
      wt += ww;
    }
  }
  return va / wt;
}

void main() {
  vec2 scaled = vUv * uScale;
  float c1 = caustic(scaled);
  float c2 = caustic(scaled * 1.5 + vec2(3.7, 1.2));

  float result = (c1 + c2) * 0.5;
  result = pow(result, 2.0) * uIntensity;

  fragColor = vec4(vec3(result), result);
}
```

---

### 3D. Dispersion (Rainbow Prism)

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uScene;
uniform vec3 uNormal;
uniform float uBaseIOR;         // ~1.45
uniform float uDispersionRange; // ~0.1

void main() {
  float iorR = uBaseIOR - uDispersionRange * 0.5;
  float iorG = uBaseIOR;
  float iorB = uBaseIOR + uDispersionRange * 0.5;

  vec3 normal = normalize(uNormal);
  vec3 viewDir = vec3(0.0, 0.0, -1.0);

  vec3 refractR = refract(viewDir, normal, 1.0 / iorR);
  vec3 refractG = refract(viewDir, normal, 1.0 / iorG);
  vec3 refractB = refract(viewDir, normal, 1.0 / iorB);

  float r = texture(uScene, vUv + refractR.xy * 0.1).r;
  float g = texture(uScene, vUv + refractG.xy * 0.1).g;
  float b = texture(uScene, vUv + refractB.xy * 0.1).b;

  fragColor = vec4(r, g, b, 1.0);
}
```

---

### 3E. Dynamic Thickness (Breathing Glass)

```glsl
// Add to refraction shader:
uniform float uScrollProgress;  // 0.0 → 1.0

// In main():
float breathe = sin(uTime * 0.5) * 0.1 + 1.0;
float thickness = uThickness * breathe * (1.0 + uScrollProgress * 0.5);

// fBm perturbation for organic glass surface
float perturbation = fbm(vUv * 5.0 + uTime * 0.05) * 0.3;
thickness += perturbation;
// use thickness in refractionOffset calculation
```

---

## 4. TEXT-AS-LIQUID TECHNIQUES

### 4A. Canvas2D → WebGL Texture Pipeline

```typescript
function rasterizeText(text: string, fontSize: number, w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  const dpr = Math.min(window.devicePixelRatio, 2)
  canvas.width = w * dpr
  canvas.height = h * dpr
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)

  ctx.fillStyle = '#ffffff'
  ctx.font = `700 ${fontSize}px "Clash Display"`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, w / 2, h / 2)
  return canvas
}

function uploadTextTexture(gl: WebGL2RenderingContext, canvas: HTMLCanvasElement): WebGLTexture {
  const tex = gl.createTexture()!
  gl.bindTexture(gl.TEXTURE_2D, tex)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return tex
}
```

---

### 4B. SDF Text with Liquid Displacement

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uMSDF;
uniform float uTime;
uniform float uStrength;
uniform vec2 uMouse;
uniform vec4 uColor;

float median(float r, float g, float b) {
  return max(min(r, g), min(max(r, g), b));
}

void main() {
  float mouseDist = distance(vUv, uMouse);
  float influence = smoothstep(0.3, 0.0, mouseDist);

  float n = sin(vUv.x * 20.0 + uTime) * cos(vUv.y * 15.0 + uTime * 0.7);
  vec2 displacement = vec2(n * 0.01) * uStrength * (1.0 + influence * 5.0);

  vec3 msd = texture(uMSDF, vUv + displacement).rgb;
  float sd = median(msd.r, msd.g, msd.b);

  float screenPxDistance = (sd - 0.5) * fwidth(sd);
  float opacity = clamp(screenPxDistance + 0.5, 0.0, 1.0);

  // Liquid edge glow
  float edgeGlow = smoothstep(0.48, 0.5, sd) - smoothstep(0.5, 0.52, sd);
  vec4 glowColor = vec4(0.0, 0.96, 1.0, 1.0);  // cyan glow

  vec4 textColor = uColor * opacity;
  textColor += glowColor * edgeGlow * uStrength;

  fragColor = textColor;
}
```

---

### 4C. Text Particles (Form/Dissolve)

```glsl
// Vertex shader (Transform Feedback)
#version 300 es

in vec2 aTextUV;
in vec2 aRandomOffset;
in float aDelay;

uniform sampler2D uTextTexture;
uniform float uProgress;   // 0.0 = particles, 1.0 = formed text
uniform float uTime;

out float vAlpha;
out vec2 vUv;

void main() {
  float textAlpha = texture(uTextTexture, aTextUV).a;
  vec2 textPos = aTextUV * 2.0 - 1.0;
  vec2 dissolvedPos = aRandomOffset + vec2(
    sin(uTime * 0.5 + aDelay * 6.28) * 0.3,
    cos(uTime * 0.3 + aDelay * 6.28) * 0.3
  );

  float staggeredProgress = smoothstep(aDelay, aDelay + 0.3, uProgress);
  vec2 pos = mix(dissolvedPos, textPos, staggeredProgress);

  vAlpha = textAlpha * smoothstep(0.0, 0.1, staggeredProgress);
  vUv = aTextUV;

  gl_Position = vec4(pos, 0.0, 1.0);
  gl_PointSize = 2.0;
}
```

**GSAP Connection:**
```typescript
gsap.to(uniforms.uProgress, {
  value: 1.0,
  duration: 2.0,
  ease: 'power3.inOut',
  scrollTrigger: { trigger: '.text-section', scrub: true }
})
```

---

### 4D. Kinetic Typography Wave Displacement

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uText;
uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;
uniform float uScrollVelocity;

void main() {
  float wave = sin(vUv.y * uWaveFrequency + uTime * 2.0) * uWaveAmplitude;
  wave *= uScrollVelocity;  // intensify with scroll speed

  float ripple = cos(vUv.x * uWaveFrequency * 0.5 + uTime * 1.5) * uWaveAmplitude * 0.3;
  vec2 displaced = vec2(vUv.x + wave, vUv.y + ripple);

  vec4 color = texture(uText, displaced);

  // Motion blur approximation
  vec4 blur = texture(uText, displaced + vec2(wave * 0.5, 0.0));
  color = mix(color, blur, abs(uScrollVelocity) * 0.3);

  fragColor = color;
}
```

---

### 4E. Text Masking with Liquid Fill

```glsl
#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform sampler2D uTextMask;
uniform float uFillLevel;   // 0.0 → 1.0
uniform float uTime;
uniform vec3 uLiquidColor;

void main() {
  float textMask = texture(uTextMask, vUv).a;

  float waveHeight = uFillLevel
    + sin(vUv.x * 20.0 + uTime * 3.0) * 0.02
    + sin(vUv.x * 35.0 + uTime * 5.0) * 0.01;

  float fill = 1.0 - smoothstep(waveHeight - 0.01, waveHeight + 0.01, vUv.y);

  float surface = 1.0 - smoothstep(0.0, 0.02, abs(vUv.y - waveHeight));

  vec3 color = uLiquidColor * fill;
  color += vec3(1.0) * surface * 0.5;  // highlight

  fragColor = vec4(color, textMask * max(fill, surface * 0.5));
}
```

---

## 5. POST-PROCESSING PIPELINE

### 5A. Bloom + Chromatic Aberration

```glsl
// Pass 1: Brightness Extract
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uScene;
uniform float uThreshold;

void main() {
  vec4 color = texture(uScene, vUv);
  float brightness = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
  fragColor = brightness > uThreshold ? color : vec4(0.0);
}
```

```glsl
// Pass 2: Separable Gaussian Blur (9-tap)
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform vec2 uDirection;   // (1,0) horizontal, (0,1) vertical
uniform vec2 uResolution;

void main() {
  vec2 texel = 1.0 / uResolution;
  float weights[5] = float[5](0.227027, 0.1945946, 0.1216216, 0.054054, 0.016216);
  vec4 result = texture(uTexture, vUv) * weights[0];
  for (int i = 1; i < 5; i++) {
    vec2 offset = uDirection * texel * float(i);
    result += texture(uTexture, vUv + offset) * weights[i];
    result += texture(uTexture, vUv - offset) * weights[i];
  }
  fragColor = result;
}
```

```glsl
// Pass 3: Combine (Scene + Bloom + Chromatic Aberration)
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;
uniform float uChromaticStrength;

void main() {
  vec2 dir = vUv - 0.5;
  float dist = length(dir);
  vec2 offset = dir * dist * uChromaticStrength;

  float bloomR = texture(uBloom, vUv + offset).r;
  float bloomG = texture(uBloom, vUv).g;
  float bloomB = texture(uBloom, vUv - offset).b;

  vec3 scene = texture(uScene, vUv).rgb;
  fragColor = vec4(scene + vec3(bloomR, bloomG, bloomB) * uBloomStrength, 1.0);
}
```

---

### 5B. Film Grain + Vignette

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uScene;
uniform float uTime;
uniform float uGrainAmount;      // ~0.05
uniform float uVignetteStrength; // ~0.3

float filmGrain(vec2 uv, float time) {
  float x = (uv.x + 4.0) * (uv.y + 4.0) * (time * 10.0 + 10.0);
  return fract((fract(x * 13.0) + 1.0) * (fract(x * 123.0) + 1.0) * fract(x)) * 2.0 - 1.0;
}

void main() {
  vec3 color = texture(uScene, vUv).rgb;

  // Vignette
  vec2 vignetteUV = vUv * (1.0 - vUv);
  float vignette = vignetteUV.x * vignetteUV.y * 15.0;
  vignette = pow(vignette, uVignetteStrength);
  color *= vignette;

  // Film grain
  color += filmGrain(vUv, uTime) * uGrainAmount;

  fragColor = vec4(color, 1.0);
}
```

---

### 5C. ACES Filmic Tonemapping

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uScene;
uniform float uExposure;  // ~1.0
uniform float uGamma;     // ~2.2

vec3 ACESFilm(vec3 x) {
  float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
  return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

void main() {
  vec3 color = texture(uScene, vUv).rgb;
  color *= uExposure;
  color = ACESFilm(color);
  color = pow(color, vec3(1.0 / uGamma));
  fragColor = vec4(color, 1.0);
}
```

---

### 5D. Glitch / Datamosh

```glsl
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uTexture;
uniform float uTime;
uniform float uGlitchIntensity;  // 0.0 → 1.0
uniform float uLiquidStrength;

float random(float seed) { return fract(sin(seed * 12.9898) * 43758.5453); }

void main() {
  vec2 uv = vUv;

  float liquid = sin(uv.y * 20.0 + uTime * 2.0) * uLiquidStrength * 0.01;

  float glitchLine = step(0.95, random(floor(uv.y * 50.0) + floor(uTime * 20.0)));
  float glitchOffset = (random(floor(uTime * 30.0)) * 2.0 - 1.0) * 0.1;
  uv.x += liquid + glitchOffset * glitchLine * uGlitchIntensity;

  float aberration = glitchLine * uGlitchIntensity * 0.02;
  float r = texture(uTexture, uv + vec2(aberration, 0.0)).r;
  float g = texture(uTexture, uv).g;
  float b = texture(uTexture, uv - vec2(aberration, 0.0)).b;

  fragColor = vec4(r, g, b, 1.0);
}
```

---

### 5E. Feedback Loop (Trail Effect)

```glsl
// Blend pass untuk ping-pong FBO trail
#version 300 es
precision highp float;
in vec2 vUv;
out vec4 fragColor;
uniform sampler2D uCurrentFrame;
uniform sampler2D uPreviousFrame;
uniform float uFeedbackAmount;  // ~0.92

void main() {
  vec4 current = texture(uCurrentFrame, vUv);

  // Subtle distortion on previous frame = organic trail
  vec2 distortedUV = vUv + vec2(
    sin(vUv.y * 50.0 + float(gl_FragCoord.x) * 0.01) * 0.001,
    0.0
  );
  vec4 faded = texture(uPreviousFrame, distortedUV) * uFeedbackAmount;

  fragColor = max(current, faded);  // additive = glow trail
}
```

**JavaScript Ping-Pong Setup:**
```typescript
let [readFBO, writeFBO] = [fboA, fboB]
let [readTex, writeTex] = [texA, texB]

function renderFrame() {
  // Render to writeFBO
  gl.bindFramebuffer(gl.FRAMEBUFFER, writeFBO)

  // Bind previous frame
  gl.activeTexture(gl.TEXTURE1)
  gl.bindTexture(gl.TEXTURE_2D, readTex)

  drawBlendPass(gl)

  // Display writeFBO to screen
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  // ...draw with writeTex

  // Swap
  ;[readFBO, writeFBO] = [writeFBO, readFBO]
  ;[readTex, writeTex] = [writeTex, readTex]
}
```

---

## GSAP + SHADER UNIFORM PATTERN (Universal)

```typescript
// Pattern 1: Direct tween
gsap.to(uniforms.uProgress, { value: 1.0, duration: 1.5, ease: 'power3.inOut' })

// Pattern 2: ScrollTrigger-driven
gsap.to(uniforms.uStrength, {
  value: 1.0,
  scrollTrigger: { trigger: '.section', scrub: 0.5, start: 'top center', end: 'bottom center' }
})

// Pattern 3: Keyframe animation (rise & settle)
gsap.to(uniforms.uStrength, {
  keyframes: { value: [0, 1, 0.3, 0.8, 0] },
  duration: 2.0,
  ease: 'none'
})

// Pattern 4: Render loop — update uniform setiap frame
function render() {
  uniforms.uTime.value += 0.016
  gl.uniform1f(uTime_loc, uniforms.uTime.value)
  gl.uniform1f(uProgress_loc, uniforms.uProgress.value)
  requestAnimationFrame(render)
}
```

---

## PERFORMANCE SUMMARY

| Technique | GPU Cost | FBO Required | Recommendation |
|---|---|---|---|
| Ripple distortion | Low | No | Use freely on hover |
| Liquid morph transition | Low | No | Image transitions |
| Chromatic aberration (simple) | Low | No | Always-on post-process |
| Heat haze | Low | No | Ambient animation |
| Barrel distortion | Low | No | Hover lens effect |
| Metaball SDF (see liquid-advanced.md) | Low-Medium | No | Up to ~30 balls |
| Navier-Stokes fluid (existing project) | Heavy | Yes (5+ FBOs) | Half-res, already in project |
| SPH particles | Heavy | Transform Feedback | 1000-3000 max |
| LBM | Very Heavy | Multiple | 256x256 max |
| Refraction glass | Low-Medium | No | Nav panel, cards |
| Kawase blur | Medium | Yes (multi-pass) | Frosted glass |
| Caustics | Low-Medium | No | Decorative overlay |
| Dispersion | Low | No | Glass prism effect |
| Bloom pipeline | Medium | Yes (3 FBOs) | Global post-process |
| Film grain + vignette | Low | No | Always-on |
| ACES tonemapping | Low | No | Always-on |
| Glitch/datamosh | Low | No | Interaction-triggered |
| Feedback trail | Low | Yes (2 FBOs) | Mouse trail |
| Text particles | Medium | Transform Feedback | Section reveal only |

---

## Sources

- [Codrops: Animate WebGL Shaders with GSAP](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/)
- [Codrops: Liquid Distortion Effects](https://tympanus.net/codrops/2017/10/10/liquid-distortion-effects/)
- [Codrops: WebGL Distortion Hover Effects](https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/)
- [Codrops: Interactive WebGL Hover Effects](https://tympanus.net/codrops/2020/04/14/interactive-webgl-hover-effects/)
- [Codrops: Dissolve Effect with Shaders + Particles](https://tympanus.net/codrops/2025/02/17/implementing-a-dissolve-effect-with-shaders-and-particles-in-three-js/)
- [Codrops: Drawing 2D Metaballs with WebGL2](https://tympanus.net/codrops/2021/01/19/drawing-2d-metaballs-with-webgl2/)
- [Codrops: SEO-friendly WebGL Text](https://tympanus.net/codrops/2025/06/05/how-to-create-responsive-and-seo-friendly-webgl-text/)
- [Codrops: Kinetic Typography with Three.js](https://tympanus.net/codrops/2020/06/02/kinetic-typography-with-three-js/)
- [Maxime Heckel: Refraction + Dispersion Shader Effects](https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/)
- [Maxime Heckel: Render Targets (Trail Effects)](https://blog.maximeheckel.com/posts/beautiful-and-mind-bending-effects-with-webgl-render-targets/)
- [ACES Filmic Tone Mapping — Narkowicz 2015](https://knarkowicz.wordpress.com/2016/01/06/aces-filmic-tone-mapping-curve/)
- [Taylor Petrick: Simulating Dispersion in OpenGL](https://taylorpetrick.com/blog/post/dispersion-opengl)
- [GitHub: spite/Wagner — Chromatic Aberration](https://github.com/spite/Wagner/blob/master/fragment-shaders/chromatic-aberration-fs.glsl)
- [GitHub: pmndrs/postprocessing](https://github.com/pmndrs/postprocessing)
- [GitHub: dmnsgn/glsl-tone-map](https://github.com/dmnsgn/glsl-tone-map)
- [The Book of Shaders: Noise ch.11](https://thebookofshaders.com/11/)
- [NVIDIA GPU Gems: Water Caustics](https://developer.nvidia.com/gpugems/gpugems/part-i-natural-effects/chapter-2-rendering-water-caustics)
- [Inigo Quilez: SDF Functions Reference](https://iquilezles.org/articles/distfunctions/)
- [OpenGL Refpages: refract()](https://registry.khronos.org/OpenGL-Refpages/gl4/html/refract.xhtml)
