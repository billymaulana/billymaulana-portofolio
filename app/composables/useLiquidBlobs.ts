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

interface LiquidBlobsAPI {
  init: (canvas: HTMLCanvasElement) => Promise<boolean>
  start: () => void
  setExplode: (v: number) => void
  setStrength: (v: number) => void
  setFill: (v: number) => void
  setFadeToBlack: (v: number) => void
  setLimit: (limit: number) => void
  setOpacity: (opacity: number) => void
  destroy: () => void
}

const VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

// CRZ.STUDIO exact goo/metaball postprocessing shader
// Extracted from layout-45a9952a0e614c84.js
const GOO_FRAG = /* glsl */ `
precision highp float;

uniform sampler2D inputBuffer;
uniform float uTime;
uniform float uExplode;
uniform float uStrength;
uniform vec2 uCenter;
uniform float uFadeToBlack;

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
  float sx = sin(t * 0.4);
  float cx = cos(t * 0.4);
  return vec2(
    sin(uv.y * 8.0 + t * 0.5) + sin(uv.x * 10.0 - sx),
    cos(uv.x * 7.0 + cx) - cos(uv.y * 9.0 - t * 0.3)
  ) * 0.08;
}

float metaballs(vec2 uv, float t) {
  float f = 0.0;
  float wsum = 0.0;

  float t1 = t * 0.55;
  float t2 = t * 0.43;

  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    vec2 id = vec2(fi, fi * 1.37);

    float h1 = hash12(id + 7.3) - 0.5;
    float h2 = hash12(id + 2.1);

    float a = t1 + 0.18 * h2 * t + fi * 1.7 + h1 * 6.0;
    float b = t2 + 0.22 * h2 * t + fi * 1.2 + h1 * 6.0;

    vec2 c = vec2(
      0.5 + 0.42 * sin(a),
      0.5 + 0.40 * cos(b)
    );

    c.y += 0.12 * sin(t * 0.35 + fi) - 0.18 * (0.5 - uv.y);

    float r = 0.11 + 0.06 * hash12(id + 4.8);
    vec2 d = uv - c;
    d.x *= 1.12;

    float inv = 1.0 / (dot(d, d) + 0.005);
    f += r * inv;
    wsum += inv;
  }

  return f / (wsum + 1e-4);
}

void main() {
  vec2 uv = vUv;
  float t = clamp(uExplode, 0.0, 1.0);

  if (t < 0.001) {
    gl_FragColor = texture2D(inputBuffer, uv);
    return;
  }

  float te = pow(sCurve(t), 1.2);
  float gooPhase = sCurve(1.0 - clamp((te - 0.55) / 0.45, 0.0, 1.0));
  float morphPhase = sCurve(clamp((te - 0.40) / 0.60, 0.0, 1.0));

  vec2 p = uv - uCenter;
  float rSq = dot(p, p);
  float centerMask = 1.0 - sCurve(clamp(sqrt(rSq) / 0.95, 0.0, 1.0));

  float T = uTime * 0.75;

  float F = metaballs(uv + cheapFlow(uv, T) * 0.35, T);
  float blob = sCurve(clamp((F - 0.72) / 0.18, 0.0, 1.0));

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
  float shock = ring * (0.008 + 0.09 * tLocal) * (1.0 - sCurve(clamp(sqrt(rSq) / 0.95, 0.0, 1.0)));

  float br = clamp(0.5 + 0.5 * sin((uv.x * 10.0 - uv.y * 8.0) + T * 1.1), 0.0, 1.0);
  vec2 breakup = (vec2(br, 1.0 - br) - 0.5) * (0.01 + 0.08 * tLocal);

  vec2 finalDisp = nrm * shock + breakup;
  vec2 disp = mix(gooDisp, finalDisp, morphPhase);

  float s = uStrength * (0.22 + 2.1 * tLocal);
  vec2 warpedUv = clamp(uv + disp * s, vec2(0.0), vec2(1.0));

  vec4 col = texture2D(inputBuffer, warpedUv);

  float brightness = max(col.r, max(col.g, col.b));
  if (brightness < 0.05) {
    col = texture2D(inputBuffer, uv);
    col.rgb = vec3(0.0);
  }

  float fade = sCurve(uFadeToBlack);
  col.rgb = mix(col.rgb, vec3(0.0), fade);
  col.a *= (1.0 - fade);

  gl_FragColor = col;
}
`

export function useLiquidBlobs(): LiquidBlobsAPI {
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
    renderer.setClearColor(0x000000, 1)
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
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uFadeToBlack: { value: 0 },
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

  // Legacy API compatibility
  function setLimit(_limit: number) {
    // No-op: goo shader doesn't use uLimit
  }

  function setOpacity(o: number) {
    if (canvas)
      canvas.style.opacity = String(o)
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

  return { init, start, setExplode, setStrength, setFill, setFadeToBlack, setLimit, setOpacity, destroy }
}
