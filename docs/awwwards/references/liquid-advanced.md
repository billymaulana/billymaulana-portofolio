# Liquid Advanced — GSAP + WebGL Techniques for Awwwards Level

Riset komprehensif teknik liquid/fluid untuk portfolio yang benar-benar stunning.
Dikompilasi dari Codrops, GSAP docs, Shadertoy, dan analisis studio-studio SOTY.

---

## 1. Prinsip Utama: GSAP sebagai "Conductor" Shader

Teknik paling powerful dari studio top adalah **menjadikan GSAP sebagai conductor**
yang menganimasi shader uniforms secara langsung — bukan hanya `opacity`/`transform`,
tapi `uDistortionStrength`, `uProgress`, `uRippleRadius`, `uBlurAmount`.

```javascript
// Pattern: GSAP mengontrol multiple uniforms sekaligus
const tl = gsap.timeline({ paused: true })
tl.to(uniforms.uDistortionStrength, { value: 1.0, duration: 0.8, ease: 'power2.out' }, 0)
  .to(uniforms.uChromaticStrength,  { value: 0.01, duration: 0.6, ease: 'power3.out' }, 0.1)
  .to(uniforms.uBlurAmount,         { value: 3.0,  duration: 0.5, ease: 'power2.inOut' }, 0.2)
  .to(uniforms.uWaveAmplitude,      { value: 0.05, duration: 1.0, ease: 'power1.out' }, 0)

element.addEventListener('mouseenter', () => tl.play())
element.addEventListener('mouseleave', () => tl.reverse())
```

---

## 2. Scroll Velocity → Shader (Pattern Kritis)

Scroll velocity sebagai realtime input ke distortion shader — membuat setiap scroll
terasa "ada berat", seperti cairan yang tertinggal.

```glsl
// Vertex shader: deformasi berdasarkan velocity
vec3 deformationCurve(vec3 position, vec2 uv) {
  position.y = position.y - (sin(uv.x * PI) *
    min(abs(uScrollVelocity), 5.0) * sign(uScrollVelocity) * -0.01);
  return position;
}
```

```javascript
// JS: Per-frame update dari Lenis
mediaStore.forEach((object) => {
  if (object.isInView) {
    object.material.uniforms.uScrollVelocity.value = scroll.scrollVelocity
  }
})
```

**Efek pada cursor/noise juga:**
```glsl
float noise = snoise(gl_FragCoord.xy);
float circle = 1.0 - distance(uMouseOverPos, vUv) * 15.0;
texCoords += mix(0.0, circle * noise * 0.01,
  uMouseEnter + abs(uScrollVelocity) * 0.1);
```

---

## 3. Ripple Effect — Versi Advanced

Bukan ripple biasa — ini "rise up and settle":

```glsl
// Vertex Shader
uniform float uRippleProgress;
uniform vec2 uMouse;
varying float vRipple;

void main() {
  vec3 pos = position;
  float dist = distance(uv, uMouse);
  float ripple = sin(-PI * 10.0 * (dist - uTime * 0.1));
  ripple *= uRippleProgress;
  pos.y += ripple * 0.1;
  vRipple = ripple;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

```javascript
// GSAP keyframes [0, 1, 0] = rise and settle
gsap.timeline({ defaults: { duration: 1.5, ease: 'power3.inOut' } })
  .set(material.uniforms.uMouse, { value: intersection.uv }, 0)
  .to(material.uniforms.uGrayscaleProgress, { value: 1 }, 0)
  .to(material.uniforms.uRippleProgress, {
    keyframes: { value: [0, 1, 0] }  // Organic rise & settle
  }, 0)
```

---

## 4. Circular Liquid Reveal (Cursor-driven)

Image/section reveal dari posisi kursor — bukan clip-path biasa:

```glsl
// Fragment Shader
uniform sampler2D uTexture;
uniform sampler2D uTextureBack;
uniform float uMixFactor;
uniform vec2 uMouse;
uniform float uAspect;
varying vec2 vUv;

void main() {
  vec2 correctedUv = vec2(vUv.x, (vUv.y - 0.5) * uAspect + 0.5);
  vec2 correctedMouse = vec2(uMouse.x, (uMouse.y - 0.5) * uAspect + 0.5);

  float dist = length(correctedUv - correctedMouse);
  float influence = 1.0 - smoothstep(0.0, 0.5, dist);
  float finalMix = uMixFactor * influence;

  vec4 textureFront = texture2D(uTexture, vUv);
  vec4 textureBack  = texture2D(uTextureBack, vUv);
  gl_FragColor = mix(textureFront, textureBack, finalMix);
}
```

---

## 5. Multi-Pass Kawase Blur (Focus Effect)

Items jauh dari viewport center blur progresif — seperti depth of field:

```glsl
vec4 kawaseBlur(sampler2D tex, vec2 uv, float offset) {
  vec2 ts = vec2(1.0) / vec2(textureSize(tex, 0));
  vec4 color = vec4(0.0);
  color += texture2D(tex, uv + vec2( offset,  offset) * ts);
  color += texture2D(tex, uv + vec2(-offset,  offset) * ts);
  color += texture2D(tex, uv + vec2( offset, -offset) * ts);
  color += texture2D(tex, uv + vec2(-offset, -offset) * ts);
  return color * 0.25;
}

vec4 multiPassKawaseBlur(sampler2D tex, vec2 uv, float blurStrength) {
  vec4 base  = texture2D(tex, uv);
  vec4 blur1 = kawaseBlur(tex, uv, 1.0 + blurStrength * 1.5);
  vec4 blur2 = kawaseBlur(tex, uv, 2.0 + blurStrength);
  vec4 blur3 = kawaseBlur(tex, uv, 3.0 + blurStrength * 2.5);

  float t1 = smoothstep(0.0, 3.0, blurStrength);
  float t2 = smoothstep(3.0, 7.0, blurStrength);
  vec4 blurred = mix(blur1, mix(blur2, blur3, t2), t1);
  return mix(base, blurred, smoothstep(0.0, 1.0, blurStrength));
}
```

```javascript
// JS: Update blur berdasarkan screen position
const distance = Math.abs(screenX - centerX)
const blurAmount = MathUtils.clamp(distance / (innerWidth / 2) * 5, 0, 5)
gsap.to(tile.material.uniforms.uBlurAmount, {
  value: Math.round(blurAmount / 2) * 2,
  duration: 1.5,
  ease: 'power3.out'
})
```

---

## 6. Advanced GSAP Techniques

### CustomEase — Cinematic Curves (bukan `power3` default)

```javascript
import { CustomEase } from 'gsap/CustomEase'
gsap.registerPlugin(CustomEase)

CustomEase.create("cinematicSilk",   "0.45,0.05,0.55,0.95")
CustomEase.create("cinematicSmooth", "0.25,0.1,0.25,1")
CustomEase.create("cinematicFlow",   "0.33,0,0.2,1")
CustomEase.create("liquidEase", "M0,0 C0.1,0 0.12,0.52 0.24,0.72 0.36,0.92 0.4,1 1,1")
```

### CustomWiggle — Organic Jiggle

```javascript
import { CustomWiggle } from 'gsap/CustomWiggle'
gsap.registerPlugin(CustomWiggle)

CustomWiggle.create("liquidWobble", { wiggles: 8, type: "easeOut" })
gsap.to(element, { x: 20, duration: 2, ease: "liquidWobble" })
```

### GSAP Observer — Gesture-Driven Effects

```javascript
import { Observer } from 'gsap/Observer'
gsap.registerPlugin(Observer)

Observer.create({
  type: 'wheel,touch,pointer',
  wheelSpeed: -1,
  onChange: (self) => {
    material.uniforms.uVelocity.value = self.velocityY * 0.001
  }
})
```

### GSAP Flip — Liquid-Like Layout Transitions

```javascript
import { Flip } from 'gsap/Flip'
gsap.registerPlugin(Flip)

const state = Flip.getState(gridItems)
container.classList.toggle('grid-layout')  // Change layout

Flip.from(state, {
  absolute: true,
  duration: 1,
  ease: 'power3.inOut',
  stagger: 0.05,
})
```

---

## 7. Liquid Preloader Sequence (Cinematic)

```javascript
const preloaderTl = gsap.timeline({ onComplete: () => { preloaderEl.style.display = 'none' } })

preloaderTl
  .to(counterNumber, {
    innerText: 100,
    duration: 3,
    snap: { innerText: 1 },
    ease: 'power2.inOut'
  }, 0)
  .to(liquidShaderUniforms.uProgress, { value: 1.0, duration: 1.5, ease: 'power3.inOut' }, 2.5)
  .to(preloaderEl, { clipPath: 'inset(0 0 100% 0)', duration: 1.2, ease: 'power4.inOut' }, 3.5)
  .from(heroElements, { y: 100, opacity: 0, stagger: 0.08, duration: 1.0, ease: 'power3.out' }, 4.0)
```

---

## 8. Liquid Glass Refraction Shader

Teknik dominan 2024-2025 (dipopulerkan Apple WWDC 2025):

```glsl
// Fragment shader — liquid glass refraction
uniform sampler2D uBackground;   // Offscreen render konten di belakang
uniform sampler2D uNormalMap;
uniform float uRefractPower;
uniform float uChromaticAberration;
uniform float uFresnelPower;

void main() {
  vec3 normal = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;

  // Chromatic aberration per channel
  vec2 refractR = vUv + normal.xy * uRefractPower * (1.0 + uChromaticAberration);
  vec2 refractG = vUv + normal.xy * uRefractPower;
  vec2 refractB = vUv + normal.xy * uRefractPower * (1.0 - uChromaticAberration);

  float r = texture2D(uBackground, refractR).r;
  float g = texture2D(uBackground, refractG).g;
  float b = texture2D(uBackground, refractB).b;

  // Fresnel edge glow
  float fresnel = pow(1.0 - dot(vec3(0, 0, 1), normal), uFresnelPower);
  vec3 color = vec3(r, g, b) + vec3(0.0, 0.3, 1.0) * fresnel * 0.3;

  gl_FragColor = vec4(color, 0.8);
}
```

---

## 9. GLSL Shader Primitives

### SDF Metaball + SmoothMin

```glsl
float sdSphere(vec3 p, float s) {
  return length(p) - s;
}

// Kunci efek metaball "melebur" — polynomial smoothmin (cepat)
float smin(float a, float b, float k) {
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}
```

### Curl Noise (Divergence-Free)

Perfect untuk partikel yang bergerak seperti cairan — tidak menyusut/mengembang:

```glsl
// Membutuhkan simplex noise (snoise) sebagai dependency
vec3 snoiseVec3(vec3 x) {
  return vec3(
    snoise(x),
    snoise(vec3(x.y - 19.1, x.z + 33.4, x.x + 47.2)),
    snoise(vec3(x.z + 74.2, x.x - 124.5, x.y + 99.4))
  );
}

vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  vec3 dx = vec3(e, 0.0, 0.0);
  vec3 dy = vec3(0.0, e, 0.0);
  vec3 dz = vec3(0.0, 0.0, e);

  vec3 p_x0 = snoiseVec3(p - dx); vec3 p_x1 = snoiseVec3(p + dx);
  vec3 p_y0 = snoiseVec3(p - dy); vec3 p_y1 = snoiseVec3(p + dy);
  vec3 p_z0 = snoiseVec3(p - dz); vec3 p_z1 = snoiseVec3(p + dz);

  return normalize(vec3(
    p_y1.z - p_y0.z - p_z1.y + p_z0.y,
    p_z1.x - p_z0.x - p_x1.z + p_x0.z,
    p_x1.y - p_x0.y - p_y1.x + p_y0.x
  ) / (2.0 * e));
}
```

### 3D Value Noise (Surface Distortion)

```glsl
float rnd3D(vec3 p) {
  return fract(sin(dot(p, vec3(12.9898, 78.233, 37.719))) * 43758.5453123);
}

float noise3D(vec3 p) {
  vec3 i = floor(p); vec3 f = fract(p);
  vec3 u = f * f * (3.0 - 2.0 * f);  // Smoothstep

  float a000 = rnd3D(i);               float a100 = rnd3D(i + vec3(1,0,0));
  float a010 = rnd3D(i + vec3(0,1,0)); float a110 = rnd3D(i + vec3(1,1,0));
  float a001 = rnd3D(i + vec3(0,0,1)); float a101 = rnd3D(i + vec3(1,0,1));
  float a011 = rnd3D(i + vec3(0,1,1)); float a111 = rnd3D(i + vec3(1,1,1));

  return a000
    + (a100-a000)*u.x + (a010-a000)*u.y + (a001-a000)*u.z
    + (a000-a100-a010+a110)*u.x*u.y
    + (a000-a010-a001+a011)*u.y*u.z
    + (a000-a100-a001+a101)*u.z*u.x
    + (-a000+a100+a010-a110+a001-a101-a011+a111)*u.x*u.y*u.z;
}
```

### Droplet Coloring (Liquid Appearance)

```glsl
vec3 dropletColor(vec3 normal, vec3 rayDir, float uTime) {
  vec3 reflectDir = reflect(rayDir, normal);
  float nPos = noise3D(reflectDir * 2.0 + uTime);
  float nNeg = noise3D(reflectDir * 2.0 - uTime);
  vec3 c0 = vec3(0.0, 0.15, 0.4) * nPos;   // Deep blue
  vec3 c1 = vec3(0.0, 0.6, 1.0) * nNeg;    // Electric cyan
  return (c0 + c1) * 2.3;
}
```

### Reaction-Diffusion (Ink Spread / Organic Growth)

```glsl
// Gray-Scott model — untuk ink spread pada click/preloader
uniform sampler2D uPrevState;
uniform float uFeed;   // 0.0545 untuk spots
uniform float uKill;   // 0.062 untuk spots

void main() {
  vec2 ts = 1.0 / resolution;
  vec4 c = texture(uPrevState, vUv);

  // 9-point Laplacian
  vec4 sum = vec4(0.0);
  sum += texture(uPrevState, vUv + vec2(-ts.x, 0)) * 0.2;
  sum += texture(uPrevState, vUv + vec2( ts.x, 0)) * 0.2;
  sum += texture(uPrevState, vUv + vec2(0, -ts.y)) * 0.2;
  sum += texture(uPrevState, vUv + vec2(0,  ts.y)) * 0.2;
  sum += texture(uPrevState, vUv + vec2(-ts.x,-ts.y)) * 0.05;
  sum += texture(uPrevState, vUv + vec2( ts.x,-ts.y)) * 0.05;
  sum += texture(uPrevState, vUv + vec2(-ts.x, ts.y)) * 0.05;
  sum += texture(uPrevState, vUv + vec2( ts.x, ts.y)) * 0.05;
  vec4 lap = sum - c;

  float a = c.r; float b = c.g;
  float reaction = a * b * b;
  float dt = 1.0;

  float newA = a + (1.0 * lap.r - reaction + uFeed * (1.0 - a)) * dt;
  float newB = b + (0.5 * lap.g + reaction - (uKill + uFeed) * b) * dt;
  fragColor = vec4(clamp(newA, 0.0, 1.0), clamp(newB, 0.0, 1.0), 0.0, 1.0);
}
```

---

## 10. Scroll-Driven Camera Path (Cinematic)

```javascript
const camPos = { x: 0, y: 0, z: 8 }
const tl = gsap.timeline({
  scrollTrigger: { trigger: containerRef, start: 'top top', end: 'bottom bottom', scrub: 1 }
})

tl.to(camPos, { x: 0, y: 0, z: 8, duration: 1, ease: "cinematicSilk" })
  .to(camPos, { x: 0, y: 5, z: 5, duration: 1, ease: "cinematicFlow" })
  .to(camPos, { x: -6, y: -1, z: 8, duration: 1, ease: "cinematicSmooth" })

// Render loop:
camera.position.set(camPos.x, camPos.y, camPos.z)
```

---

## 11. Render Target — Liquid Text on 3D Surface

```javascript
const rt = new THREE.WebGLRenderTarget(1024, 512)
// ... render text scene ke rt
renderer.setRenderTarget(rt)
renderer.render(textScene, orthoCam)
renderer.setRenderTarget(null)

const mat = new THREE.ShaderMaterial({
  uniforms: {
    tMap: { value: rt.texture },
    uTime: { value: 0 },
    uDistortion: { value: 0 }
  },
  vertexShader: `
    varying vec2 vUv;
    uniform float uTime;
    uniform float uDistortion;
    void main() {
      vUv = uv;
      vec3 pos = position;
      pos.z += sin(pos.x * 3.0 + uTime) * uDistortion * 0.1;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tMap;
    varying vec2 vUv;
    void main() { gl_FragColor = texture2D(tMap, vUv); }
  `
})

gsap.to(mat.uniforms.uDistortion, {
  value: 1.0,
  scrollTrigger: { trigger: section, scrub: 1 }
})
```

---

## 12. Chromatic Aberration Post-Processing

```glsl
// Manual shader pass
precision highp float;
uniform sampler2D tDiffuse;
uniform float uOffset;
varying vec2 vUv;

void main() {
  vec2 dir = vUv - 0.5;
  float dist = length(dir);
  float aberration = uOffset * dist;  // Stronger at edges

  float r = texture2D(tDiffuse, vUv + dir * aberration).r;
  float g = texture2D(tDiffuse, vUv).g;
  float b = texture2D(tDiffuse, vUv - dir * aberration).b;

  gl_FragColor = vec4(r, g, b, 1.0);
}
```

```javascript
// Brief flash saat scroll cepat atau page transition
gsap.fromTo(chromaticPass.uniforms.uOffset,
  { value: 0 },
  { value: 0.02, duration: 0.5, yoyo: true, repeat: 1, ease: 'power2.inOut' }
)
```

---

## 13. Velocity-Driven Particle Opacity

```javascript
const vel = cylinder.rotation.y - lastRotation
const isRotating = Math.abs(vel) > 0.0001
const speed = Math.abs(vel) * 100

particles.forEach(p => {
  const target = isRotating ? Math.min(speed * 3, 0.95) : 0
  // Smooth lerp — tidak langsung set
  p.program.uniforms.uOpacity.value +=
    (target - p.program.uniforms.uOpacity.value) * 0.15
})
```

---

## Sources

- [Codrops: Animate WebGL Shaders with GSAP (Ripples, Reveals, Blur)](https://tympanus.net/codrops/2025/10/08/how-to-animate-webgl-shaders-with-gsap-ripples-reveals-and-dynamic-blur-effects/)
- [Codrops: Liquid Raymarching Scene with Three.js Shading Language](https://tympanus.net/codrops/2024/07/15/how-to-create-a-liquid-raymarching-scene-using-three-js-shading-language/)
- [Codrops: Interactive Droplet Metaballs with Three.js and GLSL](https://tympanus.net/codrops/2025/06/09/how-to-create-interactive-droplet-like-metaballs-with-three-js-and-glsl/)
- [Codrops: Cinematic 3D Scroll Experiences with GSAP](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)
- [Codrops: Scroll-Revealed WebGL Gallery with GSAP + Three.js + Barba.js](https://tympanus.net/codrops/2026/02/02/building-a-scroll-revealed-webgl-gallery-with-gsap-three-js-astro-and-barba-js/)
- [Codrops: Distortion and Grain Effects on Scroll with Shaders](https://tympanus.net/codrops/2024/07/18/how-to-create-distortion-and-grain-effects-on-scroll-with-shaders-in-three-js/)
- [Codrops: WebGL Shader Techniques for Dynamic Image Transitions](https://tympanus.net/codrops/2025/01/22/webgl-shader-techniques-for-dynamic-image-transitions/)
- [Codrops: Reaction-Diffusion Compute Shader in WebGPU](https://tympanus.net/codrops/2024/05/01/reaction-diffusion-compute-shader-in-webgpu/)
- [GSAP Flip Plugin](https://gsap.com/docs/v3/Plugins/Flip/)
- [GSAP Observer Plugin](https://gsap.com/docs/v3/Plugins/Observer/)
- [GSAP CustomWiggle](https://gsap.com/docs/v3/Eases/CustomWiggle/)
- [Pavel Dobryakov: WebGL Fluid Simulation](https://paveldogreat.github.io/WebGL-Fluid-Simulation/)
- [cabbibo/glsl-curl-noise](https://github.com/cabbibo/glsl-curl-noise)
- [liquidGL — Real-time WebGL Liquid Glass](https://github.com/naughtyduk/liquidGL)
- [Frontend Masters: Liquid Glass on the Web](https://frontendmasters.com/blog/liquid-glass-on-the-web/)
- [Lusion WebGL Scroll Sync Demo](https://webgl-scroll-sync.lusion.co/)
