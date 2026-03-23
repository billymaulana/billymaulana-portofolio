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
  float shock = ring * (0.008 + 0.09 * tLocal) * (1.0 - sCurve(clamp(sqrt(rSq) / 0.95, 0.0, 1.0)));

  float br = clamp(0.5 + 0.5 * sin((uv.x * 10.0 - uv.y * 8.0) + T * 1.1), 0.0, 1.0);
  vec2 breakup = (vec2(br, 1.0 - br) - 0.5) * (0.01 + 0.08 * tLocal);

  vec2 finalDisp = nrm * shock + breakup;
  vec2 disp = mix(gooDisp, finalDisp, morphPhase);

  float s = uStrength * (0.22 + 2.1 * tLocal);
  vec2 warpedUv = clamp(uv + disp * s + meltWarp, vec2(0.0), vec2(1.0));

  vec4 col = texture2D(inputBuffer, warpedUv);

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
          uCenter: { value: new THREE.Vector2(0.5, 0.5) },
          uFadeToBlack: { value: 0 },
          uTint: { value: new THREE.Vector3(1, 1, 1) },
          uBgColor: { value: new THREE.Vector3(0.024, 0.024, 0.063) }, // void-blue #060610
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

  return { init, start, setExplode, setStrength, setFill, setFadeToBlack, setTint, setConverge, setLimit, setOpacity, setFlowIntensity, setMelt, destroy }
}
