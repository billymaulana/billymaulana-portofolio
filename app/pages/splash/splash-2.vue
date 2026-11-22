<script setup lang="ts">
import type {
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Texture,
  WebGLRenderer,
  WebGLRenderTarget,
} from 'three'

/**
 * AppPreloader — Liquid Blob Cinematic (v5)
 *
 * Liquid blobs emerge from darkness, come alive, then cinematic zoom exit.
 * No SVG logo phase — single cohesive animation.
 */

const emit = defineEmits<{
  complete: []
  done: []
}>()

definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Splash 2',
  robots: 'noindex',
})

/* Salinan mandiri splash utama: komponen AppPreloader beserta engine useLiquidBlobs ditanam di file
   ini, sehingga iterasi di rute ini tidak pernah mengubah preloader global yang tampil di situs. */

/**
 * useLiquidBlobs — CRZ.STUDIO Splash/Preloader (exact clone)
 *
 * Source: https://www.crz.studio/ layout-45a9952a0e614c84.js
 *
 * Architecture: 2-pass rendering
 *   Pass 1: Logo on black → WebGLRenderTarget
 *   Pass 2: Goo/metaball postprocessing shader → screen
 *
 * The "water ripple" look comes from the goo shader distorting the logo
 * with metaballs at high explode/strength values.
 *
 * CRZ initial state: explode=3, strength=1.2 (heavy distortion)
 * CRZ animation: explode 3→0, strength 1.2→0 (resolves to clear text)
 */

interface LiquidBlobsAPI {
  init: (canvas: HTMLCanvasElement) => Promise<boolean>
  start: () => void
  setExplode: (v: number) => void
  setStrength: (v: number) => void
  setFill: (v: number) => void
  setFadeToBlack: (v: number) => void
  setTint: (r: number, g: number, b: number) => void
  setConverge: (v: number) => void
  setLimit: (limit: number) => void
  setOpacity: (opacity: number) => void
  setFlowIntensity: (v: number) => void
  setMelt: (v: number) => void
  destroy: () => void
}

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// CRZ.STUDIO goo/metaball postprocessing shader (enhanced)
// Based on layout-45a9952a0e614c84.js with:
//   - 5 metaballs (varied radius, satellite orbits)
//   - uConverge: metaballs gather to center before logo reveal
//   - Vibrant additive tint + emissive glow on goo fragments
const GOO_FRAG = /* glsl */ `
precision highp float;

uniform sampler2D inputBuffer;
uniform float uTime;
uniform float uExplode;
uniform float uStrength;
uniform vec2 uCenter;
uniform float uFadeToBlack;
uniform vec3 uTint;
uniform vec3 uBgColor;
uniform float uConverge;
uniform float uAspect;
uniform float uFlowIntensity;
uniform float uMelt;

varying vec2 vUv;

float sCurve(float x) {
  x = clamp(x, 0.0, 1.0);
  return x * x * (3.0 - 2.0 * x);
}

float hash12(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * 0.1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}

vec2 cheapFlow(vec2 uv, float t) {
  float sx = sin(t * 0.28);
  float cx = cos(t * 0.28);
  float s1 = sin(t * 0.18);
  return vec2(
    sin(uv.y * 8.0 + t * 0.5) + sin(uv.x * 10.0 - sx) + 0.3 * sin(uv.y * 14.0 + s1),
    cos(uv.x * 7.0 + cx) - cos(uv.y * 9.0 - t * 0.3) + 0.3 * cos(uv.x * 12.0 - s1)
  ) * uFlowIntensity;
}

float metaballs(vec2 uv, float t) {
  float f = 0.0;
  float wsum = 0.0;

  float t1 = t * 0.38;
  float t2 = t * 0.30;

  // 8 metaballs: 3 large, 2 medium, 3 small — flowing tendrils
  float radii[8];
  radii[0] = 0.24;  // large core
  radii[1] = 0.22;  // large core
  radii[2] = 0.20;  // large tendril
  radii[3] = 0.14;  // medium bridge
  radii[4] = 0.12;  // medium bridge
  radii[5] = 0.09;  // small tendril tip
  radii[6] = 0.08;  // small tendril tip
  radii[7] = 0.07;  // small satellite

  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    vec2 id = vec2(fi, fi * 1.37);

    float h1 = hash12(id + 7.3) - 0.5;
    float h2 = hash12(id + 2.1);

    float a = t1 + 0.18 * h2 * t + fi * 1.7 + h1 * 6.0;
    float b = t2 + 0.22 * h2 * t + fi * 1.2 + h1 * 6.0;

    vec2 scattered = vec2(
      0.5 + 0.38 * sin(a),
      0.5 + 0.36 * cos(b)
    );
    scattered.y += 0.10 * sin(t * 0.30 + fi) - 0.14 * (0.5 - uv.y);

    // Medium/small (i>=3) orbit near large blobs — creates tendrils
    if (i >= 3) {
      float parentIdx = mod(fi - 3.0, 3.0);
      vec2 pid = vec2(parentIdx, parentIdx * 1.37);
      float pa = t1 + 0.18 * hash12(pid + 2.1) * t + parentIdx * 1.7 + (hash12(pid + 7.3) - 0.5) * 6.0;
      float pb = t2 + 0.22 * hash12(pid + 2.1) * t + parentIdx * 1.2 + (hash12(pid + 7.3) - 0.5) * 6.0;
      vec2 parent = vec2(0.5 + 0.38 * sin(pa), 0.5 + 0.36 * cos(pb));
      float orbitDist = 0.14 + 0.08 * sin(fi * 1.9);
      float orbitAngle = t * (0.8 + fi * 0.25) + fi * 2.4;
      scattered = parent + orbitDist * vec2(cos(orbitAngle), sin(orbitAngle));
    }

    // Per-blob staggered convergence — large blobs first, tendrils trail behind
    float blobDelay = fi * 0.055;
    float localConv = sCurve(clamp((uConverge - blobDelay) / max(1.0 - blobDelay, 0.01), 0.0, 1.0));
    vec2 c = mix(scattered, uCenter, localConv);

    float r = radii[i];
    vec2 d = uv - c;
    d.x *= uAspect;

    // Per-blob elongation — creates tendril shapes instead of circles
    float stretch = 1.0 + 0.5 * sin(fi * 2.3 + t * 0.22);
    float angle = fi * 0.78 + t * 0.15;
    float ca = cos(angle), sa = sin(angle);
    vec2 dRot = vec2(ca * d.x + sa * d.y, -sa * d.x + ca * d.y);
    dRot.x *= stretch;
    float dist = dot(dRot, dRot);

    float inv = 1.0 / (dist + 0.004);
    f += r * inv;
    wsum += inv;
  }

  return f / (wsum + 1e-4);
}

void main() {
  vec2 uv = vUv;
  float t = clamp(uExplode, 0.0, 1.0);
  float T = uTime * 0.75;

  // Smooth organic warp — bridges clean logo → goo transition
  // Multi-octave noise for fluid complexity + edge-first + gravity
  float meltEdge = 0.4 + length(uv - uCenter) * 1.6;
  vec2 meltWarp = (
    cheapFlow(uv * 1.5, T * 0.9) * 0.50
    + cheapFlow(uv * 2.8, T * 0.55 + 3.0) * 0.30
    + cheapFlow(uv * 0.7, T * 0.3 + 7.0) * 0.20
  ) * uMelt * meltEdge * 0.22;
  // Gravity: top drips down, accelerates with melt^2
  meltWarp.y -= uMelt * uMelt * 0.07 * (1.0 - uv.y);

  if (t < 0.001 && uConverge < 0.001) {
    gl_FragColor = texture2D(inputBuffer, clamp(uv + meltWarp, vec2(0.0), vec2(1.0)));
    return;
  }

  float te = pow(sCurve(t), 1.2);
  float gooPhase = sCurve(1.0 - clamp((te - 0.55) / 0.45, 0.0, 1.0));
  float morphPhase = sCurve(clamp((te - 0.40) / 0.60, 0.0, 1.0));

  // Cleanup — active only in the logo-lock window (te near 0). Splash phase
  // (te high) keeps full breakup/shock so the initial goo splash is intact.
  float cleanup = 1.0 - smoothstep(0.05, 0.45, te);
  float noiseGate = 1.0 - cleanup;

  vec2 p = uv - uCenter;
  float rSq = dot(p, p);
  float centerMask = 1.0 - sCurve(clamp(sqrt(rSq) / 0.95, 0.0, 1.0));

  float F = metaballs(uv + cheapFlow(uv, T) * 0.50, T);
  float blob = sCurve(clamp((F - 0.50) / 0.22, 0.0, 1.0));

  float revealDelay = mix(0.06, 0.92, sCurve(1.0 - blob));
  float revealWidth = mix(0.25, 0.55, clamp(0.5 + 0.5 * sin((uv.x + uv.y) * 6.0 + T), 0.0, 1.0));

  float tLocal = clamp((te - revealDelay) / max(1e-4, (1.0 - revealDelay) * revealWidth), 0.0, 1.0);
  tLocal = pow(sCurve(tLocal), 1.1);

  vec2 gooDir = normalize(cheapFlow(uv * 1.2, T) + vec2(0.10 * sin(T * 0.35), -1.0));
  float visc = mix(0.04, 0.16, blob);
  float pull = mix(0.01, 0.12, blob) * centerMask;

  vec2 nrm = normalize(p + 1e-4);
  vec2 gooDisp = (gooDir * visc + nrm * pull) * (0.35 + 1.65 * gooPhase);

  float ringArg = sqrt(rSq) * (12.0 + 22.0 * tLocal) - T * (1.9 + 1.2 * tLocal);
  float ring = sin(ringArg);
  // Shock attenuated by noiseGate — ring wave fades out as logo clarifies
  float shock = ring * (0.008 + 0.07 * tLocal) * (1.0 - sCurve(clamp(sqrt(rSq) / 0.95, 0.0, 1.0))) * noiseGate;

  float br = clamp(0.5 + 0.5 * sin((uv.x * 10.0 - uv.y * 8.0) + T * 1.1), 0.0, 1.0);
  // Breakup attenuated by noiseGate — high-frequency pixel chop dies off at the end
  vec2 breakup = (vec2(br, 1.0 - br) - 0.5) * (0.01 + 0.06 * tLocal) * noiseGate;

  vec2 finalDisp = nrm * shock + breakup;
  vec2 disp = mix(gooDisp, finalDisp, morphPhase);

  float s = uStrength * (0.22 + 2.1 * tLocal);
  vec2 warpedUv = clamp(uv + disp * s + meltWarp, vec2(0.0), vec2(1.0));

  // 4-tap box blur — bell-curved band active only during logo-lock transition.
  // Off at te > 0.55 (splash stays crisp liquid) and off at te < 0.05 (final sharp).
  float blurEnvelope = smoothstep(0.05, 0.22, te) * (1.0 - smoothstep(0.35, 0.55, te));
  float blurRadius = blurEnvelope * 0.0035;
  vec4 col = texture2D(inputBuffer, warpedUv);
  if (blurRadius > 0.0001) {
    vec4 s1 = texture2D(inputBuffer, clamp(warpedUv + vec2(blurRadius, 0.0), vec2(0.0), vec2(1.0)));
    vec4 s2 = texture2D(inputBuffer, clamp(warpedUv - vec2(blurRadius, 0.0), vec2(0.0), vec2(1.0)));
    vec4 s3 = texture2D(inputBuffer, clamp(warpedUv + vec2(0.0, blurRadius), vec2(0.0), vec2(1.0)));
    vec4 s4 = texture2D(inputBuffer, clamp(warpedUv - vec2(0.0, blurRadius), vec2(0.0), vec2(1.0)));
    vec4 blurred = (col + s1 + s2 + s3 + s4) * 0.2;
    col = mix(col, blurred, blurEnvelope);
  }

  float brightness = max(col.r, max(col.g, col.b));
  if (brightness < 0.05) {
    col = texture2D(inputBuffer, uv);
    col.rgb = uBgColor;
  }

  // Tint goo fragments — additive blend for vibrant color + emissive glow
  float tintMix = clamp(te * 1.5, 0.0, 0.85);
  float emissive = smoothstep(0.10, 0.5, brightness) * tintMix * 0.35;
  col.rgb = mix(col.rgb, col.rgb * uTint + uTint * emissive, tintMix);

  float fade = sCurve(uFadeToBlack);
  col.rgb = mix(col.rgb, uBgColor, fade);
  col.a *= (1.0 - fade);

  gl_FragColor = col;
}
`

function useLiquidBlobs(): LiquidBlobsAPI {
  let renderer: WebGLRenderer | null = null
  let canvas: HTMLCanvasElement | null = null
  let animationId = 0
  let startTime = 0

  // Pass 1: Logo scene
  let logoScene: Scene | null = null
  let logoCamera: OrthographicCamera | null = null
  let logoMesh: Mesh<PlaneGeometry, MeshBasicMaterial> | null = null
  let logoTexture: Texture | null = null

  // Render target (Pass 1 output → Pass 2 input)
  let renderTarget: WebGLRenderTarget | null = null

  // Pass 2: Goo postprocessing
  let gooScene: Scene | null = null
  let gooCamera: OrthographicCamera | null = null
  let gooMaterial: ShaderMaterial | null = null
  let gooMesh: Mesh<PlaneGeometry, ShaderMaterial> | null = null

  // Logo brightness (CRZ: fill value 0→1)
  let fillValue = 0

  function handleResize() {
    if (!canvas || !renderer || !renderTarget || !gooMaterial)
      return
    const dpr = Math.min(window.devicePixelRatio, 1.5)
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    renderer.setPixelRatio(dpr)
    renderer.setSize(w, h, false)
    renderTarget.setSize(Math.floor(w * dpr), Math.floor(h * dpr))
    gooMaterial.uniforms.uAspect!.value = w / h
  }

  function render() {
    if (!renderer || !logoScene || !logoCamera || !gooScene || !gooCamera || !gooMaterial || !renderTarget)
      return

    const elapsed = (performance.now() - startTime) / 1000
    gooMaterial.uniforms.uTime!.value = elapsed

    // Update logo brightness via material color
    if (logoMesh) {
      const mat = logoMesh.material as MeshBasicMaterial
      mat.color.setRGB(fillValue, fillValue, fillValue)
    }

    // Pass 1: Render logo to renderTarget
    renderer.setRenderTarget(renderTarget)
    renderer.setClearColor(0x060610, 1)
    renderer.clear()
    renderer.render(logoScene, logoCamera)

    // Pass 2: Render goo postprocessing to screen
    renderer.setRenderTarget(null)
    renderer.render(gooScene, gooCamera)

    animationId = requestAnimationFrame(render)
  }

  async function init(canvasEl: HTMLCanvasElement): Promise<boolean> {
    canvas = canvasEl
    try {
      const THREE = await import('three')

      const dpr = Math.min(window.devicePixelRatio, 1.5)
      const w = canvasEl.clientWidth
      const h = canvasEl.clientHeight

      renderer = new THREE.WebGLRenderer({
        canvas: canvasEl,
        alpha: false,
        antialias: false,
        powerPreference: 'high-performance',
      })
      renderer.setPixelRatio(dpr)
      renderer.setSize(w, h, false)
      // No tone mapping for postprocessing pipeline
      renderer.toneMapping = THREE.NoToneMapping

      // Render target for Pass 1
      renderTarget = new THREE.WebGLRenderTarget(
        Math.floor(w * dpr),
        Math.floor(h * dpr),
      )

      // ─── Pass 1: Logo scene ───
      logoScene = new THREE.Scene()
      logoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      // Load logo texture
      logoTexture = await new Promise<Texture>((resolve, reject) => {
        new THREE.TextureLoader().load(
          '/assets/images/logo/logo-bm-white.png',
          resolve,
          undefined,
          reject,
        )
      })

      // Size logo to fill significant viewport area
      // CRZ: "CRZ." text at fontSize=0.58 with fov=35 cam at z=6 ≈ 60% viewport width
      // Larger logo = more material for goo shader to distort = better water ripple look
      const aspect = w / h
      const logoSize = 0.7 // large — fills ~70% viewport height
      const img = logoTexture.image as HTMLImageElement
      const logoAspect = img.width / img.height || 1
      const logoW = logoSize * logoAspect / aspect
      const logoH = logoSize

      const logoGeom = new THREE.PlaneGeometry(logoW * 2, logoH * 2)
      const logoMat = new THREE.MeshBasicMaterial({
        map: logoTexture,
        transparent: true,
        color: new THREE.Color(0, 0, 0), // Start dim (fill=0)
      })
      logoMesh = new THREE.Mesh(logoGeom, logoMat) as Mesh<PlaneGeometry, MeshBasicMaterial>
      logoScene.add(logoMesh)

      // ─── Pass 2: Goo postprocessing ───
      gooScene = new THREE.Scene()
      gooCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)

      gooMaterial = new THREE.ShaderMaterial({
        uniforms: {
          inputBuffer: { value: renderTarget.texture },
          uTime: { value: 0 },
          uExplode: { value: 3.0 },
          uStrength: { value: 1.2 },
          uCenter: {
            value: new THREE.Vector2(0.5, 0.5),
          },
          uFadeToBlack: { value: 0 },
          uTint: {
            value: new THREE.Vector3(1, 1, 1),
          },
          uBgColor: {
            value: new THREE.Vector3(0.024, 0.024, 0.063),
          }, // void-blue #060610
          uConverge: { value: 0 },
          uAspect: { value: w / h },
          uFlowIntensity: { value: 0.12 },
          uMelt: { value: 0 },
        },
        vertexShader: VERT,
        fragmentShader: GOO_FRAG,
        depthTest: false,
        depthWrite: false,
      })

      const gooGeom = new THREE.PlaneGeometry(2, 2)
      gooMesh = new THREE.Mesh(gooGeom, gooMaterial) as Mesh<PlaneGeometry, ShaderMaterial>
      gooScene.add(gooMesh)

      canvasEl.style.opacity = '0'
      window.addEventListener('resize', handleResize)
      return true
    }
    catch (e) {
      console.warn('[liquidBlobs] Init failed:', e)
      return false
    }
  }

  function start() {
    if (!renderer)
      return
    startTime = performance.now()
    render()
  }

  function setExplode(v: number) {
    if (gooMaterial)
      gooMaterial.uniforms.uExplode!.value = v
  }

  function setStrength(v: number) {
    if (gooMaterial)
      gooMaterial.uniforms.uStrength!.value = v
  }

  function setFill(v: number) {
    fillValue = v
  }

  function setFadeToBlack(v: number) {
    if (gooMaterial)
      gooMaterial.uniforms.uFadeToBlack!.value = v
  }

  function setTint(r: number, g: number, b: number) {
    if (gooMaterial) {
      const v = gooMaterial.uniforms.uTint!.value as { x: number, y: number, z: number }
      v.x = r
      v.y = g
      v.z = b
    }
  }

  function setConverge(v: number) {
    if (gooMaterial)
      gooMaterial.uniforms.uConverge!.value = v
  }

  // Legacy API compatibility
  function setLimit(_limit: number) {
    // No-op: goo shader doesn't use uLimit
  }

  function setOpacity(o: number) {
    if (canvas)
      canvas.style.opacity = String(o)
  }

  function setFlowIntensity(v: number) {
    if (gooMaterial)
      gooMaterial.uniforms.uFlowIntensity!.value = v
  }

  function setMelt(v: number) {
    if (gooMaterial)
      gooMaterial.uniforms.uMelt!.value = v
  }

  function destroy() {
    cancelAnimationFrame(animationId)
    window.removeEventListener('resize', handleResize)
    if (logoMesh) {
      logoMesh.geometry.dispose()
      logoMesh.material.dispose()
    }
    if (logoTexture)
      logoTexture.dispose()
    if (gooMesh) {
      gooMesh.geometry.dispose()
      gooMesh.material.dispose()
    }
    if (renderTarget)
      renderTarget.dispose()
    if (renderer)
      renderer.dispose()
    renderer = null
    logoScene = null
    logoCamera = null
    logoMesh = null
    logoTexture = null
    gooScene = null
    gooCamera = null
    gooMaterial = null
    gooMesh = null
    renderTarget = null
    canvas = null
  }

  return {
    init,
    start,
    setExplode,
    setStrength,
    setFill,
    setFadeToBlack,
    setTint,
    setConverge,
    setLimit,
    setOpacity,
    setFlowIntensity,
    setMelt,
    destroy,
  }
}

const containerRef = ref<HTMLElement>()
const canvasRef = ref<HTMLCanvasElement>()
const cornersRef = ref<HTMLElement>()
const vignetteRef = ref<HTMLElement>()

const blob = useLiquidBlobs()

onMounted(async () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    emit('complete')
    await nextTick()
    emit('done')
    return
  }

  runCinematic()
})

onBeforeUnmount(() => {
  blob.destroy()
})

async function runCinematic() {
  const gsap = (await import('gsap')).default

  // Init canvas liquid (hidden, running in background)
  if (canvasRef.value) {
    const ok = await blob.init(canvasRef.value)
    if (!ok) {
      /* The whole cinematic is drawn on this canvas, so without WebGL it would only be a black wait. */
      emit('complete')
      await nextTick()
      emit('done')
      return
    }
    blob.start()
  }

  const isDebug = new URLSearchParams(window.location.search).has('debug')
  if (isDebug)
    (window as any).__blob = blob

  // ━━━ INITIAL STATE: CRZ-style — full goo, abstract liquid ━━━
  // Shader designed for this direction: liquid → logo (resolve)
  blob.setExplode(3.0)
  blob.setStrength(1.2)
  blob.setFill(0.85)
  blob.setFadeToBlack(0)
  blob.setConverge(0)
  blob.setFlowIntensity(0.12)
  blob.setMelt(0)
  blob.setOpacity(0)
  blob.setTint(1.0, 1.0, 1.0)

  if (canvasRef.value)
    gsap.set(canvasRef.value, { scale: 1, transformOrigin: '50% 50%', filter: 'blur(0px)' })

  if (vignetteRef.value)
    gsap.set(vignetteRef.value, { opacity: 0 })

  // Corner labels — per-char split
  if (cornersRef.value) {
    const labels = cornersRef.value.querySelectorAll('.preloader__corner')
    labels.forEach((label) => {
      const text = label.textContent || ''
      label.textContent = ''
      for (const char of text) {
        const span = document.createElement('span')
        span.textContent = char
        span.classList.add('preloader__corner-char')
        label.appendChild(span)
      }
    })
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    gsap.set(allChars, { opacity: 0, filter: 'blur(6px)' })
  }

  const tl = gsap.timeline({
    onComplete: () => { emit('done') },
  })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 1: ABSTRACT LIQUID FADES IN (0 → 1.2s)
  // Heavy goo — mysterious, abstract liquid blobs.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.to({}, { duration: 0.2 })

  // Canvas fades in — abstract liquid visible
  tl.to({}, {
    duration: 1.0,
    ease: 'power3.out',
    onUpdate() {
      blob.setOpacity(this.progress())
    },
  })

  // Corner labels reveal alongside
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0.5,
      filter: 'blur(0px)',
      duration: 0.6,
      stagger: 0.012,
      ease: 'power3.out',
    }, '<+0.3')
  }

  if (isDebug) {
    tl.add(() => {
      tl.pause()
      // eslint-disable-next-line no-console
      console.log('[preloader debug] Paused after liquid fade in.')
    })
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 2: GOO RESOLVE — LOGO EMERGES (1.2s → ~4.2s)
  // CRZ-style: explode 3→0, strength 1.2→residual. Resolve dipadatkan ~0.6x
  // dari versi 5s: logo terbaca ~2.5s masuk resolve (bukan ~4.3s) — muncul
  // lebih cepat, koreografi/easing per-kuantitas dipertahankan agar tetap smooth.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /*
   * Each physical quantity gets its own clock: one uniform ease across all
   * uniforms makes the liquid "complete itself" mechanically and land hard.
   * Big mass motion (explode) finishes early, position gathering (converge)
   * next, surface noise (strength/flow) lives longest.
   */
  const shader = {
    explode: 3.0,
    strength: 1.2,
    converge: 0,
    flow: 0.12,
    fill: 0.85,
    pulse: 0,
  }

  if (isDebug) {
    /*
     * seek() suppresses tween onUpdate, so scrubbing from the console needs
     * direct access to the timeline and the shader value proxy to re-push
     * uniforms after a jump.
     */
    ;(window as any).__tl = tl
    ;(window as any).__shader = shader
  }

  tl.addLabel('resolve')

  /*
   * power3.out instead of expo.out: uExplode is clamped to 0..1 in the
   * shader, so the 3→1 stretch is invisible dead travel. expo.out burns
   * through it plus most of the visible morph in the first second;
   * power3.out keeps the same early-mass intent but spreads the readable
   * goo→logo window across ~2.2s.
   */
  tl.to(shader, {
    explode: 0,
    duration: 1.9,
    ease: 'power3.out',
    onUpdate: () => blob.setExplode(shader.explode),
  }, 'resolve')

  tl.to(shader, {
    strength: 0.12,
    duration: 2.0,
    ease: 'power3.out',
    onUpdate: () => blob.setStrength(shader.strength),
  }, 'resolve+=0.25')

  /*
   * Surface-tension overshoot lives on uStrength because uConverge and
   * uExplode are both clamped to 0..1 in the goo shader (values past the
   * final pose are no-ops there). Strength crosses through zero into a
   * brief outward rebound, then settles at a small positive residual —
   * exactly zero would freeze the surface entirely since every
   * displacement term in the shader is multiplied by uStrength.
   */
  tl.to(shader, {
    strength: -0.04,
    duration: 0.25,
    ease: 'expo.inOut',
    onUpdate: () => blob.setStrength(shader.strength),
  }, 'resolve+=2.25')

  tl.to(shader, {
    strength: 0.05,
    duration: 0.5,
    ease: 'power3.out',
    onUpdate: () => blob.setStrength(shader.strength),
  }, 'resolve+=2.5')

  tl.to(shader, {
    converge: 0.97,
    duration: 1.7,
    ease: 'expo.inOut',
    onUpdate: () => blob.setConverge(shader.converge),
  }, 'resolve+=0.35')

  tl.to(shader, {
    converge: 1.0,
    duration: 0.55,
    ease: 'power3.out',
    onUpdate: () => blob.setConverge(shader.converge),
  }, 'resolve+=2.05')

  tl.to(shader, {
    flow: 0.03,
    duration: 2.8,
    ease: 'power3.out',
    onUpdate: () => blob.setFlowIntensity(shader.flow),
  }, 'resolve')

  tl.to(shader, {
    fill: 1.0,
    duration: 1.3,
    ease: 'power3.out',
    onUpdate: () => blob.setFill(shader.fill),
  }, 'resolve+=0.95')

  /*
   * Dim pulse masks the recognition threshold; sine of eased progress
   * returns to zero at both ends so the seams carry no visible step.
   */
  tl.to(shader, {
    pulse: 1,
    duration: 1.55,
    ease: 'expo.inOut',
    onUpdate: () => blob.setFadeToBlack(Math.sin(shader.pulse * Math.PI) * 0.05),
  }, 'resolve+=0.25')

  // Vignette focuses attention on center during resolve
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 0.3,
      duration: 3.0,
      ease: 'expo.inOut',
    }, 'resolve')
  }

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 3: LOGO HOLDS — RECOGNITION (~4.2s → ~5.05s)
  // Clear BM logo, brief cinematic pause.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // Recognition pulse — logo breathes at the moment of clarity
  tl.to({}, {
    duration: 0.5,
    ease: 'power3.out',
    onUpdate() {
      const p = this.progress()
      const ping = Math.sin(p * Math.PI)
      blob.setFill(1.0 + 0.05 * ping)
      /*
       * Baseline 0.03 matches the flow residual left by PHASE 2 so the
       * pulse splices in without a step.
       */
      blob.setFlowIntensity(0.03 + 0.03 * ping)
    },
  })

  // Canvas micro-breathe — logo feels alive
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.015,
      duration: 0.25,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: 1,
    }, '<')
  }

  // Corner labels sharpen into full focus
  if (cornersRef.value) {
    const focusChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(focusChars, {
      opacity: 0.65,
      duration: 0.5,
      stagger: 0.006,
      ease: 'power2.out',
    }, '<')
  }

  // Vignette opens slightly — breath before the exit
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 0.15,
      duration: 0.5,
      ease: 'power2.out',
    }, '<')
  }

  // Brief hold — let the beat land
  tl.to({}, { duration: 0.35 })

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PHASE 4: CLIP-PATH REVEAL EXIT
  // Circle shrinks from edges → center, revealing hero behind.
  // Logo is last thing visible — cinematic focal point.
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  tl.add(() => {
    emit('complete')
  })

  // Corner labels blur-fade out
  if (cornersRef.value) {
    const allChars = cornersRef.value.querySelectorAll('.preloader__corner-char')
    tl.to(allChars, {
      opacity: 0,
      filter: 'blur(4px)',
      duration: 0.4,
      stagger: 0.01,
      ease: 'power2.in',
    })
  }

  // Clip-path circle shrinks — reveals hero from edges inward
  if (containerRef.value) {
    gsap.set(containerRef.value, { clipPath: 'circle(100% at 50% 50%)' })
    tl.to(containerRef.value, {
      clipPath: 'circle(0% at 50% 50%)',
      duration: 1.2,
      ease: 'expo.inOut',
    })
  }

  // Vignette crunch — tunnel vision as circle closes
  if (vignetteRef.value) {
    tl.to(vignetteRef.value, {
      opacity: 0.7,
      duration: 1.2,
      ease: 'power2.in',
    }, '<')
  }

  // Canvas subtle zoom — depth effect into logo
  if (canvasRef.value) {
    tl.to(canvasRef.value, {
      scale: 1.08,
      duration: 1.2,
      ease: 'power2.in',
    }, '<')
  }
}
</script>

<template>
  <div
    ref="containerRef"
    class="preloader"
    aria-live="polite"
    aria-label="Loading portfolio"
    role="status"
  >
    <!-- Atmospheric depth -->
    <div class="preloader__atmosphere" aria-hidden="true" />

    <!-- Canvas liquid (hidden, revealed during melt) -->
    <canvas ref="canvasRef" class="preloader__canvas" aria-hidden="true" />

    <!-- Film grain -->
    <div class="preloader__grain" aria-hidden="true" />

    <!-- Zoom tunnel vignette -->
    <div ref="vignetteRef" class="preloader__zoom-vignette" aria-hidden="true" />

    <!-- Corner labels -->
    <div ref="cornersRef" class="preloader__corners" aria-hidden="true">
      <span class="preloader__corner preloader__corner--tl">MONOGRAPH NO. 001</span>
      <span class="preloader__corner preloader__corner--tr">BILLY MAULANA</span>
      <span class="preloader__corner preloader__corner--bl">BANDUNG, ID</span>
      <span class="preloader__corner preloader__corner--br">MMXXVI</span>
    </div>
  </div>
</template>

<style scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: var(--z-preloader);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--void-blue, #060610);
  overflow: hidden;
  will-change: opacity;
}

.preloader__atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 80% 60% at 50% 40%, rgba(0, 20, 60, 0.08) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 30% 60%, rgba(6, 6, 16, 0.8) 0%, transparent 60%);
  pointer-events: none;
}

.preloader__canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  will-change: transform, filter;
}

.preloader__grain {
  position: absolute;
  inset: 0;
  z-index: 3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
  background-size: 128px;
  mix-blend-mode: overlay;
  opacity: 0.04;
  pointer-events: none;
}

.preloader__zoom-vignette {
  position: absolute;
  inset: 0;
  z-index: 4;
  background: radial-gradient(
    circle at 50% 50%,
    transparent 10%,
    rgba(6, 6, 16, 0.4) 40%,
    rgba(6, 6, 16, 0.9) 75%
  );
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
}

.preloader__corners {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
}

.preloader__corner {
  position: absolute;
  font-family: var(--font-system);
  font-size: var(--text-micro);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
  color: var(--chrome-dark);
  opacity: 0;
  white-space: nowrap;
}

.preloader__corner--tl {
  top: clamp(1.5rem, 3vh, 2.5rem);
  left: var(--page-margin);
}

.preloader__corner--tr {
  top: clamp(1.5rem, 3vh, 2.5rem);
  right: var(--page-margin);
}

.preloader__corner--bl {
  bottom: clamp(2rem, 4vh, 3rem);
  left: var(--page-margin);
}

.preloader__corner--br {
  bottom: clamp(2rem, 4vh, 3rem);
  right: var(--page-margin);
}

.preloader__corner-char {
  display: inline-block;
  will-change: opacity, filter;
}

@media (prefers-reduced-motion: reduce) {
  .preloader {
    display: none;
  }
}
</style>
