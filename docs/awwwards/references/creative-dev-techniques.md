# Creative Development Techniques — Code Patterns

Teknik spesifik dan code patterns yang dipakai di situs pemenang Awwwards.

---

## 1. Scroll-Based Storytelling

### Pin-and-Progress Sections
```typescript
gsap.to('.hero-content', {
  opacity: 0, y: -100,
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: '+=200%',     // pin selama 2x viewport height
    pin: true,
    scrub: 0.5,        // smooth lag 0.5s
    pinSpacing: true,
  }
})

// Progress callback untuk custom logic
ScrollTrigger.create({
  trigger: '.section',
  start: 'top top',
  end: 'bottom bottom',
  onUpdate: (self) => {
    updateShaderUniform('uProgress', self.progress) // 0 to 1
  }
})
```

### Horizontal Scroll (Pinned Translation)
```typescript
const sections = gsap.utils.toArray('.horizontal-panel')
const totalWidth = sections.length * window.innerWidth

gsap.to('.horizontal-wrapper', {
  x: () => -(totalWidth - window.innerWidth),
  ease: 'none',
  scrollTrigger: {
    trigger: '.horizontal-container',
    pin: true,
    scrub: 1,
    end: () => `+=${totalWidth}`,
    invalidateOnRefresh: true,
  }
})
```

### Video Scrub (Canvas Frame Sequence)
```typescript
const frameCount = 240
const images: HTMLImageElement[] = []

// Preload frames
for (let i = 0; i < frameCount; i++) {
  const img = new Image()
  img.src = `/frames/frame_${String(i).padStart(4, '0')}.jpg`
  images.push(img)
}

gsap.to({ frame: 0 }, {
  frame: frameCount - 1,
  snap: 'frame',
  ease: 'none',
  scrollTrigger: {
    trigger: '.video-section',
    start: 'top top',
    end: '+=3000',
    pin: true,
    scrub: 0.5,
  },
  onUpdate: function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(images[Math.round(this.targets()[0].frame)], 0, 0, canvas.width, canvas.height)
  }
})
```

### Multi-Depth Parallax
```typescript
// Background slowest, foreground fastest
gsap.to('.bg', { yPercent: -30, scrollTrigger: { scrub: true } })
gsap.to('.mid', { yPercent: -60, scrollTrigger: { scrub: true } })
gsap.to('.fg', { yPercent: -100, scrollTrigger: { scrub: true } })
```

### Section Transition (Circle Reveal)
```typescript
gsap.fromTo('.next-section', {
  clipPath: 'circle(0% at 50% 50%)',
}, {
  clipPath: 'circle(150% at 50% 50%)',
  scrollTrigger: { trigger: '.zone', scrub: true }
})
```

---

## 2. Page Transitions

### Barba.js + GSAP Pattern
```javascript
barba.init({
  transitions: [{
    async leave(data) {
      await gsap.to(data.current.container, {
        opacity: 0, y: -50, duration: 0.6, ease: 'power2.inOut'
      })
    },
    async enter(data) {
      await gsap.from(data.next.container, {
        opacity: 0, y: 50, duration: 0.6, ease: 'power2.out'
      })
    },
    async once(data) {
      // First load (preloader → content)
      await gsap.from(data.next.container, { opacity: 0, duration: 1 })
    }
  }]
})
```

### GSAP FLIP (Shared Element Transitions)
```typescript
// 1. Capture state
const state = Flip.getState('.shared-element')
// 2. Move DOM
targetContainer.appendChild(document.querySelector('.shared-element'))
// 3. Animate
Flip.from(state, { duration: 0.8, ease: 'power2.inOut', scale: true })
```

### View Transitions API (2025+)
```typescript
const transition = document.startViewTransition(async () => {
  await updateDOM(url)
})
await transition.ready
document.documentElement.animate(
  [
    { clipPath: 'circle(0% at 50% 50%)' },
    { clipPath: 'circle(100% at 50% 50%)' },
  ],
  { duration: 500, easing: 'ease-in-out', pseudoElement: '::view-transition-new(root)' }
)
```

### Circle Wipe dari Click Point
```typescript
function circleWipe(clickX: number, clickY: number) {
  gsap.fromTo('.overlay', {
    clipPath: `circle(0px at ${clickX}px ${clickY}px)`,
    visibility: 'visible',
  }, {
    clipPath: `circle(200vmax at ${clickX}px ${clickY}px)`,
    duration: 0.8, ease: 'power2.inOut',
    onComplete: () => {
      updateContent()
      gsap.to('.overlay', { clipPath: `circle(0px at 50% 50%)`, duration: 0.6 })
    }
  })
}
```

---

## 3. Cursor & Interaction

### Context-Aware Custom Cursor
```typescript
interface CursorState {
  x: number; y: number; scale: number
  text: string
  variant: 'default' | 'link' | 'text' | 'drag' | 'view'
  blend: 'normal' | 'difference' | 'exclusion'
}

// Smooth follow dengan lerp
function animate() {
  state.x += (targetX - state.x) * 0.15
  state.y += (targetY - state.y) * 0.15
  requestAnimationFrame(animate)
}

// Context detection via mouseover delegation
document.addEventListener('mouseover', (e) => {
  const t = e.target as HTMLElement
  if (t.closest('a, button')) { state.variant = 'link'; state.scale = 2 }
  else if (t.closest('[data-cursor="drag"]')) { state.variant = 'drag'; state.text = 'DRAG' }
  else if (t.closest('[data-cursor="view"]')) { state.variant = 'view'; state.text = 'VIEW' }
  else if (t.closest('p, h1, h2, h3')) { state.variant = 'text'; state.blend = 'difference' }
  else { state.variant = 'default'; state.scale = 1 }
})
```

### Magnetic Elements
```typescript
function magnetic(el: HTMLElement, strength = 0.3, radius = 100) {
  const bounds = el.getBoundingClientRect()
  const cx = bounds.left + bounds.width / 2
  const cy = bounds.top + bounds.height / 2

  document.addEventListener('mousemove', (e) => {
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy)
    if (dist < radius) {
      const pull = 1 - (dist / radius)
      gsap.to(el, {
        x: (e.clientX - cx) * strength * pull,
        y: (e.clientY - cy) * strength * pull,
        duration: 0.4, ease: 'power2.out',
      })
    } else {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' })
    }
  })
}
```

### Negative Space Reveal (Cursor)
```typescript
container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect()
  hiddenLayer.style.clipPath = `circle(80px at ${e.clientX - rect.left}px ${e.clientY - rect.top}px)`
})
container.addEventListener('mouseleave', () => {
  gsap.to(hiddenLayer, { clipPath: 'circle(0px at 50% 50%)', duration: 0.4 })
})
```

---

## 4. Text Animation

### SplitText Character Reveal
```typescript
const split = new SplitText('.hero-title', { type: 'chars,words,lines' })
gsap.from(split.chars, {
  opacity: 0, y: 80, rotateX: -90,
  stagger: 0.02, duration: 0.8, ease: 'back.out(1.7)',
  scrollTrigger: { trigger: '.hero-title', start: 'top 80%' }
})
```

### Line-by-Line Mask Reveal
```typescript
const split = new SplitText('.paragraph', { type: 'lines', linesClass: 'line-mask' })
gsap.from(split.lines, {
  yPercent: 100, opacity: 0, stagger: 0.1, duration: 0.6, ease: 'power3.out'
})
```
```css
.line-mask { overflow: hidden; padding-bottom: 0.1em; }
```

### Scramble/Decode Text
```typescript
gsap.to('.decode', {
  scrambleText: {
    text: 'FRONTEND ARCHITECT',
    chars: '!<>-_\\/[]{}=+*^?#_',
    revealDelay: 0.5, speed: 0.3,
  },
  duration: 1.5,
})
```

### Mask Reveals (clipPath)
```typescript
// Horizontal wipe
gsap.from('.text', { clipPath: 'inset(0 100% 0 0)', duration: 0.8, ease: 'power2.inOut' })
// Vertical curtain
gsap.from('.text', { clipPath: 'inset(0 0 100% 0)', duration: 0.6, ease: 'power3.out' })
```

### Variable Font Animation
```typescript
// Wave effect per character
function animateWave() {
  const time = performance.now() / 1000
  split.chars.forEach((char, i) => {
    const weight = 400 + Math.sin(time * 2 + i * 0.15) * 300
    char.style.fontVariationSettings = `"wght" ${weight}`
  })
  requestAnimationFrame(animateWave)
}

// Mouse-reactive weight
document.addEventListener('mousemove', (e) => {
  split.chars.forEach((char) => {
    const dist = Math.abs(e.clientX - char.getBoundingClientRect().left - char.offsetWidth / 2)
    const weight = gsap.utils.mapRange(0, 200, 900, 400, Math.min(dist, 200))
    gsap.to(char, { fontVariationSettings: `"wght" ${weight}`, duration: 0.3 })
  })
})
```

### Kinetic Typography (Rotating Words)
```typescript
const words = ['DESIGN', 'DEVELOP', 'DELIVER']
let i = 0
function rotate() {
  const tl = gsap.timeline()
  tl.to('.word', { yPercent: -100, opacity: 0, duration: 0.4, ease: 'power2.in' })
  tl.call(() => { i = (i + 1) % words.length; el.textContent = words[i] })
  tl.fromTo('.word', { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.4, ease: 'power2.out' })
  tl.call(() => gsap.delayedCall(2, rotate))
}
```

---

## 5. Image & Media

### Curtain Reveal
```typescript
gsap.from('.curtain', {
  scaleX: 1, transformOrigin: 'right center',
  duration: 0.8, ease: 'power3.inOut',
  scrollTrigger: { trigger: '.container', start: 'top 75%' }
})
gsap.from('.curtain + img', { scale: 1.3, duration: 1.2, ease: 'power2.out', delay: 0.2 })
```

### Blur-to-Sharp Reveal
```typescript
gsap.from('.image', {
  filter: 'blur(20px)', scale: 1.1, opacity: 0,
  duration: 1, ease: 'power2.out',
  scrollTrigger: { trigger: '.image', start: 'top 80%' }
})
```

### WebGL Hover Distortion (Fragment Shader)
```glsl
uniform sampler2D uTexture;
uniform sampler2D uDisplacement;
uniform vec2 uMouse;

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, uMouse);
  float strength = smoothstep(0.3, 0.0, dist) * 0.1;
  vec4 disp = texture2D(uDisplacement, uv);
  vec2 distortedUV = uv + disp.rg * strength;
  gl_FragColor = texture2D(uTexture, distortedUV);
}
```

### Lazy Loading with Blur-Up
```typescript
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return
    const img = entry.target as HTMLImageElement
    img.style.filter = 'blur(20px)'
    img.style.transform = 'scale(1.1)'
    img.style.transition = 'filter 0.6s ease, transform 0.6s ease'
    img.src = img.dataset.src!
    img.onload = () => { img.style.filter = 'blur(0)'; img.style.transform = 'scale(1)' }
    observer.unobserve(img)
  })
}, { rootMargin: '50px', threshold: 0.1 })
```

---

## 6. WebGL Effects (Non-3D Sites)

### Post-Processing Composite Shader
```glsl
// Film grain + vignette + chromatic aberration (single pass)
uniform float uTime;
uniform float uGrainIntensity;  // 0.05-0.15

float rand(vec2 co) {
  return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

float blendSoftLight(float base, float blend) {
  return (blend < 0.5)
    ? (2.0 * base * blend + base * base * (1.0 - 2.0 * blend))
    : (sqrt(base) * (2.0 * blend - 1.0) + 2.0 * base * (1.0 - blend));
}

void main() {
  vec2 uv = vUv;

  // Chromatic aberration
  float aberration = 0.003;
  float r = texture2D(uTexture, uv + vec2(aberration, 0.0)).r;
  float g = texture2D(uTexture, uv).g;
  float b = texture2D(uTexture, uv - vec2(aberration, 0.0)).b;
  vec3 color = vec3(r, g, b);

  // Film grain (soft-light blend)
  float grain = rand(uv + fract(uTime)) * uGrainIntensity;
  color.r = blendSoftLight(color.r, grain);
  color.g = blendSoftLight(color.g, grain);
  color.b = blendSoftLight(color.b, grain);

  // Vignette
  float vignette = smoothstep(0.8, 0.3, length(uv - 0.5));
  color *= vignette;

  gl_FragColor = vec4(color, 1.0);
}
```

### Mouse-Reactive Distortion
```glsl
uniform vec2 uMouse;      // normalized 0-1
uniform float uVelocity;  // mouse speed

void main() {
  vec2 uv = vUv;
  float dist = distance(uv, uMouse);
  float influence = smoothstep(0.3, 0.0, dist);

  // Ripple effect
  float ripple = sin(dist * 30.0 - uTime * 5.0) * influence * uVelocity * 0.02;
  uv += ripple;

  gl_FragColor = texture2D(uTexture, uv);
}
```

### Fluid Simulation Overlay
Pattern: Navier-Stokes pada 2 FBOs (ping-pong). Advect, diffuse, apply pressure, render. Splatting pada mouse move. Bilinear interpolation untuk smooth advection.

### Gradient Mesh Animation
```glsl
// Animated gradient mesh via noise
uniform float uTime;
void main() {
  vec2 uv = vUv;
  float n = snoise(vec3(uv * 2.0, uTime * 0.3));
  vec3 c1 = vec3(0.0, 0.28, 1.0);  // Electric blue
  vec3 c2 = vec3(0.0, 0.96, 1.0);  // Cyan
  vec3 c3 = vec3(0.27, 0.0, 1.0);  // Purple
  vec3 color = mix(mix(c1, c2, n), c3, sin(uTime * 0.2) * 0.5 + 0.5);
  gl_FragColor = vec4(color, 1.0);
}
```

---

## 7. Preloader Patterns

### Progressive Percentage Loader
```typescript
let loaded = 0
const total = document.querySelectorAll('img, video').length

function updateProgress() {
  loaded++
  const progress = Math.round((loaded / total) * 100)
  gsap.to('.progress-number', { textContent: progress, snap: { textContent: 1 }, duration: 0.3 })
  gsap.to('.progress-bar', { scaleX: loaded / total, duration: 0.3 })
  if (loaded === total) revealSite()
}

// Attach to each resource
document.querySelectorAll('img').forEach(img => {
  if (img.complete) updateProgress()
  else img.addEventListener('load', updateProgress)
})
```

### Cinematic Intro Sequence
```typescript
function preloaderAnimation() {
  const tl = gsap.timeline()

  // Logo draw-in
  tl.from('.preloader-logo path', {
    strokeDashoffset: (i, el) => el.getTotalLength(),
    duration: 1.5, ease: 'power2.inOut'
  })

  // Counter 0-100
  tl.to('.counter', {
    textContent: 100, snap: { textContent: 1 },
    duration: 2, ease: 'power1.inOut'
  }, '-=1')

  // Expand reveal
  tl.to('.preloader', {
    clipPath: 'circle(0% at 50% 50%)',
    duration: 0.8, ease: 'power3.inOut'
  })

  // Hero elements stagger in
  tl.from('.hero > *', {
    y: 60, opacity: 0, stagger: 0.1,
    duration: 0.6, ease: 'power3.out'
  }, '-=0.3')
}
```

### Skeleton Screen to Content
```css
.skeleton {
  background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

---

## 8. Sound Design Integration

### Toggle/Mute UX Pattern
```typescript
const audioContext = new AudioContext()
let isMuted = localStorage.getItem('sound') === 'off'

// Resume on first interaction (browser policy)
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') audioContext.resume()
}, { once: true })

// Ambient loop
const ambient = new Audio('/audio/ambient.mp3')
ambient.loop = true
ambient.volume = 0.3
if (!isMuted) ambient.play()
```

### Interaction Sounds
```typescript
function playHoverSound() {
  if (isMuted) return
  const osc = audioContext.createOscillator()
  const gain = audioContext.createGain()
  osc.connect(gain).connect(audioContext.destination)
  osc.frequency.value = 800
  gain.gain.setValueAtTime(0.05, audioContext.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1)
  osc.start(); osc.stop(audioContext.currentTime + 0.1)
}
```

---

## Lenis Smooth Scroll Integration

```typescript
import Lenis from 'lenis'

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  touchMultiplier: 2,
  infinite: false,
})

// Sync dengan GSAP
lenis.on('scroll', ScrollTrigger.update)
gsap.ticker.add((time) => lenis.raf(time * 1000))
gsap.ticker.lagSmoothing(0)
```

---

## Sumber
- [GSAP ScrollTrigger Docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/)
- [GSAP FLIP Plugin](https://gsap.com/docs/v3/Plugins/Flip/)
- [GSAP SplitText](https://gsap.com/docs/v3/Plugins/SplitText/)
- [Codrops: Layered Zoom Scroll Effect](https://tympanus.net/codrops/2025/10/29/building-a-layered-zoom-scroll-effect-with-gsap-scrollsmoother-and-scrolltrigger/)
- [Codrops: Cinematic 3D Scroll](https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/)
- [Codrops: Custom Cursor Effects](https://tympanus.net/codrops/2019/01/31/custom-cursor-effects/)
- [Codrops: WebGL Distortion Hover](https://tympanus.net/codrops/2018/04/10/webgl-distortion-hover-effects/)
- [Codrops: WebGL Shader Transitions](https://tympanus.net/codrops/2025/01/22/webgl-shader-techniques-for-dynamic-image-transitions/)
- [Awwwards Page Transitions Guide](https://www.awwwards.com/page-transitions-creative-examples-resources-and-some-tips.html)
- [View Transitions API](https://developer.chrome.com/blog/view-transitions-in-2025)
- [Lenis GitHub](https://github.com/darkroomengineering/lenis)
- [GL Transitions](https://gl-transitions.com/)
- [Frontend Horse: GSAP Techniques](https://frontend.horse/articles/amazing-animation-techniques-with-gsap/)
- [7 GSAP Tips - Codrops](https://tympanus.net/codrops/2025/09/03/7-must-know-gsap-animation-tips-for-creative-developers/)
