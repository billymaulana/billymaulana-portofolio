/**
 * useIridescentBlob — CRZ Studio-style morphing iridescent sphere
 *
 * Three.js composable: IcosahedronGeometry + 3D Perlin noise vertex displacement
 * + MeshPhysicalMaterial (iridescence, metalness, clearcoat)
 *
 * Technique: three-custom-shader-material extends MeshPhysicalMaterial with
 * custom vertex shader for organic morphing while keeping PBR lighting intact.
 *
 * Render loop synced to GSAP ticker (not RAF) for timeline synchronization.
 */

import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three'

interface IridescentBlobAPI {
  init: (canvas: HTMLCanvasElement) => Promise<void>
  setScale: (scale: number) => void
  setOpacity: (opacity: number) => void
  setNoiseStrength: (strength: number) => void
  destroy: () => void
}

// ─── Perlin 3D Noise (Stefan Gustavson) — GLSL ───
const vertexPreamble = /* glsl */ `
  // 3D Perlin noise — Stefan Gustavson (public domain)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  uniform float uTime;
  uniform float uNoiseStrength;
  uniform float uNoiseScale;
  uniform float uSpeed;
`

const vertexMain = /* glsl */ `
  void main() {
    float displacement = snoise(csm_Position * uNoiseScale + uTime * uSpeed) * uNoiseStrength;
    csm_Position += csm_Normal * displacement;
  }
`

export function useIridescentBlob(): IridescentBlobAPI {
  let renderer: WebGLRenderer | null = null
  let scene: Scene | null = null
  let camera: PerspectiveCamera | null = null
  let tickerCallback: ((time: number, deltaTime: number) => void) | null = null
  let uniforms: {
    uTime: { value: number }
    uNoiseStrength: { value: number }
    uNoiseScale: { value: number }
    uSpeed: { value: number }
  } | null = null
  let meshOpacity = 1

  async function init(canvas: HTMLCanvasElement) {
    const [
      THREE,
      { mergeVertices },
      { default: CustomShaderMaterial },
      { default: gsap },
    ] = await Promise.all([
      import('three'),
      import('three/addons/utils/BufferGeometryUtils.js'),
      import('three-custom-shader-material/vanilla'),
      import('gsap'),
    ])

    // ─── Renderer ───
    renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2

    // ─── Scene ───
    scene = new THREE.Scene()

    // ─── Camera ───
    const aspect = canvas.clientWidth / canvas.clientHeight
    camera = new THREE.PerspectiveCamera(45, aspect, 0.1, 100)
    camera.position.set(0, 0, 2.8)

    // ─── Geometry — high-detail icosahedron ───
    const baseGeo = new THREE.IcosahedronGeometry(1, 128)
    const geo = mergeVertices(baseGeo)
    geo.computeTangents()

    // ─── Uniforms ───
    uniforms = {
      uTime: { value: 0 },
      uNoiseStrength: { value: 0.3 },
      uNoiseScale: { value: 1.5 },
      uSpeed: { value: 0.4 },
    }

    // ─── Material — CustomShaderMaterial extending MeshPhysicalMaterial ───
    const material = new CustomShaderMaterial({
      baseMaterial: THREE.MeshPhysicalMaterial,
      vertexShader: vertexPreamble + vertexMain,
      uniforms,
      // PBR properties for iridescent dark liquid look
      color: new THREE.Color('#3a3a6e'),
      emissive: new THREE.Color('#080828'),
      emissiveIntensity: 1.5,
      metalness: 0.4,
      roughness: 0.35,
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      clearcoat: 0.5,
      clearcoatRoughness: 0.1,
      transparent: true,
      opacity: 1,
    })

    const mesh = new THREE.Mesh(geo, material)
    scene.add(mesh)

    // ─── Lighting ───
    const ambient = new THREE.AmbientLight(0x303050, 1.0)
    scene.add(ambient)

    // Brand electric blue — primary key light
    const pointBlue = new THREE.PointLight(0x0047FF, 4, 20)
    pointBlue.position.set(2, 3, 4)
    scene.add(pointBlue)

    // Brand cyan — secondary fill
    const pointCyan = new THREE.PointLight(0xA1E0E7, 2, 15)
    pointCyan.position.set(-3, -1, 2)
    scene.add(pointCyan)

    // Warm rim for depth
    const pointRim = new THREE.PointLight(0x4A2A80, 1.5, 10)
    pointRim.position.set(0, -2, -3)
    scene.add(pointRim)

    // ─── Render loop via GSAP ticker ───
    tickerCallback = (_time: number, deltaTime: number) => {
      if (!renderer || !scene || !camera || !uniforms)
        return
      uniforms.uTime.value += deltaTime * 0.001
      material.opacity = meshOpacity
      renderer.render(scene, camera)
    }

    gsap.ticker.add(tickerCallback)

    // ─── Resize handler ───
    const resizeObserver = new ResizeObserver(() => {
      if (!renderer || !camera || !canvas)
        return
      const w = canvas.clientWidth
      const h = canvas.clientHeight
      renderer.setSize(w, h)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    })
    resizeObserver.observe(canvas)
  }

  function setScale(scale: number) {
    if (!scene)
      return
    const mesh = scene.children.find(c => c.type === 'Mesh')
    if (mesh) {
      mesh.scale.setScalar(scale)
    }
  }

  function setOpacity(opacity: number) {
    meshOpacity = opacity
  }

  function setNoiseStrength(strength: number) {
    if (!uniforms)
      return
    uniforms.uNoiseStrength.value = strength
  }

  function destroy() {
    if (tickerCallback) {
      import('gsap').then(({ default: gsap }) => {
        gsap.ticker.remove(tickerCallback!)
        tickerCallback = null
      })
    }
    if (renderer) {
      renderer.dispose()
      renderer = null
    }
    if (scene) {
      scene.traverse((obj) => {
        if ('geometry' in obj && obj.geometry) {
          (obj.geometry as { dispose: () => void }).dispose()
        }
        if ('material' in obj && obj.material) {
          const mat = obj.material as { dispose: () => void }
          mat.dispose()
        }
      })
      scene = null
    }
    camera = null
    uniforms = null
  }

  return { init, setScale, setOpacity, setNoiseStrength, destroy }
}
