<script setup lang="ts">
definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Checkpoint — Hero 2',
  robots: 'noindex',
})

/* Rute checkpoint sengaja mandiri: seluruh engine, state, dan style yang dipakainya tinggal di
   file ini. Tidak ada composable, constant, atau token CSS global yang dirujuk, sehingga menghapus
   satu file ini menghapus seluruh eksplorasi tanpa meninggalkan sisa di mana pun. */

/* ── engine: stage clock ─────────────────────────────────────── */
function useHeroStage() {
  const clockText = ref('00:00:00')
  let clockTimer: ReturnType<typeof setInterval> | null = null
  let rotatorTimer: ReturnType<typeof setInterval> | null = null

  function startClock() {
    if (clockTimer)
      return
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Jakarta',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
    const tick = () => {
      clockText.value = formatter.format(new Date())
    }
    tick()
    clockTimer = setInterval(tick, 1000)
  }

  function startStatusRotator(
    el: HTMLElement,
    statuses: string[],
    scramble: (el: HTMLElement) => Promise<void>,
    intervalMs = 8000,
  ) {
    if (rotatorTimer || statuses.length < 2)
      return
    let index = 0
    rotatorTimer = setInterval(() => {
      index = (index + 1) % statuses.length
      el.dataset.originalText = statuses[index]!
      scramble(el)
    }, intervalMs)
  }

  function destroy() {
    if (clockTimer) {
      clearInterval(clockTimer)
      clockTimer = null
    }
    if (rotatorTimer) {
      clearInterval(rotatorTimer)
      rotatorTimer = null
    }
  }

  return {
    clockText,
    startClock,
    startStatusRotator,
    destroy,
  }
}

/* ── engine: raster masthead ────────────────────────────────── */
/**
 * Masthead rasterizer — menggambar teks hero ke offscreen 2D canvas sebagai
 * sumber texture untuk display pass useFluidSimulation. Displacement dan
 * chromatic split kini terjadi di GPU pass fluid, bukan di modul ini.
 */

interface DistortionLine {
  text: string
  xAlign?: 'left' | 'center' | 'right'
  yFrac?: number
  indent?: number
  fontSize?: number
}

interface MastheadRasterConfig {
  fontFamily: string
  fontWeight: number
  letterSpacingEm: number
  lines: DistortionLine[]
}

function distortionTextPadding(width: number): number {
  const rootFs = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16
  return Math.min(Math.max(0.875 * rootFs, width * 0.0111), 1.5 * rootFs)
}

function useMastheadRaster(config: MastheadRasterConfig) {
  const cfg = {
    ...config,
    lines: [...config.lines],
  }
  const canvas = document.createElement('canvas')

  function applyFont(ctx: CanvasRenderingContext2D, fontSize: number) {
    ctx.font = `${cfg.fontWeight} ${fontSize}px ${cfg.fontFamily}`
    if ('letterSpacing' in ctx)
      ctx.letterSpacing = `${fontSize * cfg.letterSpacingEm}px`
  }

  /* Latar HITAM opak, bukan transparan: display pass fluid memakai shader
     referensi tanpa alpha handling — kompositing ke halaman terjadi lewat
     mix-blend-mode: difference pada elemen canvas (hitam = identity) */
  function render(cssWidth: number, cssHeight: number, scale: number): HTMLCanvasElement {
    const width = Math.max(1, Math.floor(cssWidth * scale))
    const height = Math.max(1, Math.floor(cssHeight * scale))
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#000000'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'alphabetic'

    const pad = distortionTextPadding(cssWidth) * scale

    for (let i = 0; i < cfg.lines.length; i++) {
      const line = cfg.lines[i]!
      const fontSize = (line.fontSize ?? 200) * scale
      applyFont(ctx, fontSize)
      const metrics = ctx.measureText(line.text)
      const indentPx = (line.indent ?? 0) * (fontSize / 200)
      const align = line.xAlign ?? 'left'
      let x = pad + indentPx
      if (align === 'right')
        x = width - pad - metrics.width - indentPx
      else if (align === 'center')
        x = (width - metrics.width) / 2 + indentPx
      const yFrac = line.yFrac ?? (i + 1) / (cfg.lines.length + 1)
      ctx.fillText(line.text, x, yFrac * height)
    }

    return canvas
  }

  function updateLines(lines: DistortionLine[]) {
    cfg.lines = lines
  }

  return { render, updateLines }
}

/* ── engine: simulasi fluida ────────────────────────────────── */
/**
 * useFluidSimulation — Faithful port of Pavel Dobryakov's WebGL-Fluid-Simulation
 * https://github.com/PavelDoGreat/WebGL-Fluid-Simulation (MIT License)
 *
 * Pipeline: Navier-Stokes velocity field → vorticity confinement → pressure solve →
 *           bilinear advection (dye + velocity) → bloom → sunrays → display
 *
 * Changes from original:
 * - Wrapped as Vue composable (init/resize/destroy)
 * - TypeScript strict types
 * - Mouse always tracks (no click-drag requirement — portfolio behavior)
 * - Dithering texture generated procedurally (no external PNG)
 * - No dat.GUI, no screenshot capture, no mobile promo
 */

interface FluidColor {
  r: number
  g: number
  b: number
}

interface FBO {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
}

interface DoubleFBO {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

interface TextureObj {
  texture: WebGLTexture
  width: number
  height: number
  attach: (id: number) => number
}

interface GLFormats {
  formatRGBA: { internalFormat: number, format: number } | null
  formatRG: { internalFormat: number, format: number } | null
  formatR: { internalFormat: number, format: number } | null
  halfFloatTexType: number
  supportLinearFiltering: boolean
}

interface Pointer {
  id: number
  texcoordX: number
  texcoordY: number
  prevTexcoordX: number
  prevTexcoordY: number
  deltaX: number
  deltaY: number
  down: boolean
  moved: boolean
  seeded: boolean
  color: FluidColor
}

interface SplatSegment {
  fromX: number
  fromY: number
  toX: number
  toY: number
  deltaX: number
  deltaY: number
  color: FluidColor
}

function useFluidSimulation() {
  // ── State ──
  let canvas: HTMLCanvasElement | null = null
  let gl: WebGL2RenderingContext | WebGLRenderingContext | null = null
  let ext: GLFormats | null = null
  let isWebGL2 = false
  let animFrameId = 0

  /* Kalibrasi perilaku fluid daspritam.in (decay multiplicative per-frame
     dikonversi ke bentuk divisive Pavel 1/(1+d*dt) pada dt 1/60):
     dye 0.93/frame -> 4.5 · velocity 0.90/frame -> 6.7 · curl 20 ·
     pressure iterations 3 · splat force deltaPx*5 ~ 7200 screen-normalized.
     Trail mati cepat = tidak ada akumulasi dye = tidak bisa blow-out putih */
  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 512,
    /* 3.5, bukan 4.5 hasil konversi persis: trail butuh sisa napas ~1s agar
       smear terbaca sebagai air, bukan kilat. Clamp DYE_MAX tetap menjamin
       anti blow-out pada dissipation berapapun */
    DENSITY_DISSIPATION: 4.5,
    VELOCITY_DISSIPATION: 6.7,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 3,
    /* 14, bukan 20 forensik daspritam: tanpa shading, vorticity 20 masih
       menyisakan tendril keriting di tepi blob — referensi bertepi mulus */
    CURL: 14,
    SPLAT_RADIUS: 0.35,
    SPLAT_FORCE: 7200,
    /* Referensi daspritam tanpa shading/bloom/sunrays: normal-based shading
       memberi relief 3D kasar, sunrays flicker radial saat dye melewati
       threshold — keduanya sumber "kedip" dan tekstur berkerut */
    SHADING: false,
    COLORFUL: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: false,
    BLOOM: false,
    BLOOM_ITERATIONS: 8,
    BLOOM_RESOLUTION: 256,
    BLOOM_INTENSITY: 0.7,
    BLOOM_THRESHOLD: 0.8,
    BLOOM_SOFT_KNEE: 0.7,
    SUNRAYS: false,
    SUNRAYS_RESOLUTION: 196,
    SUNRAYS_WEIGHT: 1.0,
  }

  /* Dye di-clamp saat splat: dissipation cepat sekalipun, gerakan menetap di
     satu titik menumpuk deposit >1 dan bloom memutihkan layar. Clamp = plafon
     energi; velocity TIDAK di-clamp (butuh rentang ratusan, bertanda) */
  /* 0.85, bukan 1.0: hue cycling menumpuk deposit beda warna di titik dwell —
     ketiga channel mencapai plafon bersamaan = core memutih. Di bawah 1.0
     campuran tetap ber-tint dan bloom prefilter (threshold 0.8) nyaris diam */
  const DYE_MAX = 0.85
  const VELOCITY_CLAMP = 1e6
  /* Sub-splat interpolasi segmen: jarak antar deposit jauh di bawah FWHM
     gaussian radius 0.3 (~0.09 uv) supaya flick cepat tetap pita kontinu */
  const SPLAT_INTERP_SPACING = 0.02
  const MAX_SPLATS_PER_SEGMENT = 8
  /* 1.4, bukan 1.8: radius 0.35 menaikkan total deposit ~2x (terukur mean
     luminance 22 vs 11) — sustained sweep memenuhi layar dengan kabut,
     sedangkan referensi menjaga background tetap void */
  const DYE_SPLAT_MULT = 1.2

  // ── Pointers ──
  const pointers: Pointer[] = []
  let splatStack: number[] = []
  /* Cap 32: bila rAF macet (tab background) event menumpuk — segmen tertua
     dibuang daripada membanjiri GPU dengan ratusan splat sekali frame */
  const splatSegments: SplatSegment[] = []
  const MAX_QUEUED_SEGMENTS = 32

  // ── Programs ──
  let blurProgram: ProgramObj | null = null
  let copyProgram: ProgramObj | null = null
  let clearProgram: ProgramObj | null = null
  let colorProgram: ProgramObj | null = null
  let bloomPrefilterProgram: ProgramObj | null = null
  let bloomBlurProgram: ProgramObj | null = null
  let bloomFinalProgram: ProgramObj | null = null
  let sunraysMaskProgram: ProgramObj | null = null
  let sunraysProgram: ProgramObj | null = null
  let splatProgram: ProgramObj | null = null
  let advectionProgram: ProgramObj | null = null
  let divergenceProgram: ProgramObj | null = null
  let curlProgram: ProgramObj | null = null
  let vorticityProgram: ProgramObj | null = null
  let pressureProgram: ProgramObj | null = null
  let gradientSubtractProgram: ProgramObj | null = null
  let displayMaterial: MaterialObj | null = null

  // ── FBOs ──
  let dye: DoubleFBO | null = null
  let velocity: DoubleFBO | null = null
  let divergenceFBO: FBO | null = null
  let curlFBO: FBO | null = null
  let pressure: DoubleFBO | null = null
  let bloomFBO: FBO | null = null
  let bloomFramebuffers: FBO[] = []
  let sunraysFBO: FBO | null = null
  let sunraysTempFBO: FBO | null = null
  let ditheringTexture: TextureObj | null = null

  // ── Content display (mode displacement daspritam) ──
  let contentDisplayEnabled = false
  let interpolateSegments = false
  let contentDisplayProgram: ProgramObj | null = null
  let contentTexture: TextureObj | null = null
  let pointerGate: ((u: number, v: number) => boolean) | null = null

  const contentDisplay = {
    mode: 0,
    displace: 0.001,
    chromatic: 0.003,
    color: [0, 0.28, 1] as [number, number, number],
    whiteCore: 0.95,
  }

  function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '')
    const int = Number.parseInt(h.length === 3
      ? h.replace(/./g, c => c + c)
      : h, 16)
    return [(int >> 16 & 255) / 255, (int >> 8 & 255) / 255, (int & 255) / 255]
  }

  // ── Blit ──
  let blit: ((target: FBO | null, clear?: boolean) => void) | null = null

  // ── Timing ──
  let lastUpdateTime = Date.now()
  let colorUpdateTimer = 0.0

  // ══════════════════════════════════════════════════════════════════════
  // GLSL SHADER SOURCES
  // ══════════════════════════════════════════════════════════════════════

  const baseVertexShaderSource = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `

  const blurVertexShaderSource = `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform vec2 texelSize;
    void main () {
        vUv = aPosition * 0.5 + 0.5;
        float offset = 1.33333333;
        vL = vUv - texelSize * offset;
        vR = vUv + texelSize * offset;
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `

  const blurShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    uniform sampler2D uTexture;
    void main () {
        vec4 sum = texture2D(uTexture, vUv) * 0.29411764;
        sum += texture2D(uTexture, vL) * 0.35294117;
        sum += texture2D(uTexture, vR) * 0.35294117;
        gl_FragColor = sum;
    }
  `

  const copyShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        gl_FragColor = texture2D(uTexture, vUv);
    }
  `

  const clearShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;
    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `

  const colorShaderSource = `
    precision mediump float;
    uniform vec4 color;
    void main () {
        gl_FragColor = color;
    }
  `

  const displayShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform sampler2D uBloom;
    uniform sampler2D uSunrays;
    uniform sampler2D uDithering;
    uniform vec2 ditherScale;
    uniform vec2 texelSize;

    vec3 linearToGamma (vec3 color) {
        color = max(color, vec3(0));
        return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
    }

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;
        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);
        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);
        float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
        c *= diffuse;
    #endif

    #ifdef BLOOM
        vec3 bloom = texture2D(uBloom, vUv).rgb;
    #endif

    #ifdef SUNRAYS
        float sunrays = texture2D(uSunrays, vUv).r;
        c *= sunrays;
    #ifdef BLOOM
        bloom *= sunrays;
    #endif
    #endif

    #ifdef BLOOM
        float noise = texture2D(uDithering, vUv * ditherScale).r;
        noise = noise * 2.0 - 1.0;
        bloom += noise / 255.0;
        bloom = linearToGamma(bloom);
        c += bloom;
    #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a);
    }
  `

  const bloomPrefilterShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform vec3 curve;
    uniform float threshold;
    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;
        float br = max(c.r, max(c.g, c.b));
        float rq = clamp(br - curve.x, 0.0, curve.y);
        rq = curve.z * rq * rq;
        c *= max(rq, br - threshold) / max(br, 0.0001);
        gl_FragColor = vec4(c, 0.0);
    }
  `

  const bloomBlurShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum;
    }
  `

  const bloomFinalShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform float intensity;
    void main () {
        vec4 sum = vec4(0.0);
        sum += texture2D(uTexture, vL);
        sum += texture2D(uTexture, vR);
        sum += texture2D(uTexture, vT);
        sum += texture2D(uTexture, vB);
        sum *= 0.25;
        gl_FragColor = sum * intensity;
    }
  `

  const sunraysMaskShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    void main () {
        vec4 c = texture2D(uTexture, vUv);
        float br = max(c.r, max(c.g, c.b));
        c.a = 1.0 - min(max(br * 20.0, 0.0), 0.8);
        gl_FragColor = c;
    }
  `

  const sunraysShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTexture;
    uniform float weight;
    #define ITERATIONS 16
    void main () {
        float Density = 0.3;
        float Decay = 0.95;
        float Exposure = 0.7;
        vec2 coord = vUv;
        vec2 dir = vUv - 0.5;
        dir *= 1.0 / float(ITERATIONS) * Density;
        float illuminationDecay = 1.0;
        float color = texture2D(uTexture, vUv).a;
        for (int i = 0; i < ITERATIONS; i++) {
            coord -= dir;
            float col = texture2D(uTexture, coord).a;
            color += col * illuminationDecay * weight;
            illuminationDecay *= Decay;
        }
        gl_FragColor = vec4(color * Exposure, 0.0, 0.0, 1.0);
    }
  `

  const splatShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspectRatio;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;
    uniform float clampValue;
    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspectRatio;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 result = texture2D(uTarget, vUv).xyz + splat;
        /* Skala proporsional, bukan min() per-channel: min meratakan ketiga
           channel ke plafon yang sama sehingga titik dwell memutih abu-abu;
           skala mempertahankan rasio hue tinta */
        float peak = max(result.x, max(result.y, result.z));
        result *= peak > clampValue ? clampValue / peak : 1.0;
        gl_FragColor = vec4(result, 1.0);
    }
  `

  const advectionShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
        vec2 st = uv / tsize - 0.5;
        vec2 iuv = floor(st);
        vec2 fuv = fract(st);
        vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
        vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
        vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
        vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
        return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
    }

    void main () {
    #ifdef MANUAL_FILTERING
        vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
        vec4 result = bilerp(uSource, coord, dyeTexelSize);
    #else
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
    #endif
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }
  `

  const divergenceShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;
        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }
        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `

  const curlShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = R - L - T + B;
        gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
    }
  `

  const vorticityShaderSource = `
    precision highp float;
    precision highp sampler2D;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;
    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;
        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        force /= length(force) + 0.0001;
        force *= curl * C;
        force.y *= -1.0;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel += force * dt;
        vel = min(max(vel, -1000.0), 1000.0);
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
  `

  const pressureShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float C = texture2D(uPressure, vUv).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float press = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(press, 0.0, 0.0, 1.0);
    }
  `

  const gradientSubtractShaderSource = `
    precision mediump float;
    precision mediump sampler2D;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;
    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 vel = texture2D(uVelocity, vUv).xy;
        vel.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(vel, 0.0, 1.0);
    }
  `

  /* Display pass daspritam: velocity fluid men-displace konten (uv - vel*0.001).
     Fringe chromatic R-vs-G/B (dulu merah+aqua) diganti tint dua-tone biru:
     TANDA aberration (hi-lo) memilih #0000ff (biru solid) vs #0061ff (azure),
     magnitudonya jadi kekuatan mix ke tepi huruf yang bergerak. */
  /* Buffer dye mode content menyimpan (vx, vy, presence): rg = vektor
     kecepatan (peta displacement, meluruh bersih), b = density presence 0..1
     penanda jejak kursor. Tiga mode display via uMode (semua parameter uniform
     supaya warna/displace/chromatic diubah dari config tanpa menyentuh GLSL):
       0 FAITHFUL — paritas mekanik daspritam: fluid invisible, teks meleleh +
         chromatic aberration; energi tepi diberi tint uColor (biru).
       1 DYE — tubuh cairan uColor terlihat dengan inti putih (non-daspritam).
       2 THERMAL — energi tepi (presence + speed) dipetakan lewat colormap
         termal 9-stop, dipakai identik dengan background heat field. */
  const contentDisplayShaderSource = `
    precision highp float;

    uniform sampler2D tMap;
    uniform sampler2D tFluid;
    uniform float uMode;
    uniform float uDisplace;
    uniform float uChromatic;
    uniform vec3 uColor;
    uniform float uWhite;
    varying vec2 vUv;

    const vec3 C0 = vec3(0.020, 0.020, 0.027);
    const vec3 C1 = vec3(0.059, 0.039, 0.447);
    const vec3 C2 = vec3(0.227, 0.102, 0.620);
    const vec3 C3 = vec3(0.420, 0.184, 0.784);
    const vec3 C4 = vec3(0.639, 0.169, 0.659);
    const vec3 C5 = vec3(0.831, 0.361, 0.431);
    const vec3 C6 = vec3(0.933, 0.541, 0.165);
    const vec3 C7 = vec3(0.973, 0.749, 0.153);
    const vec3 C8 = vec3(0.996, 0.898, 0.365);
    const vec3 C9 = vec3(0.999, 0.961, 0.702);
    const vec3 C10 = vec3(1.000, 0.996, 0.961);

    vec3 thermal(float t) {
      t = clamp(t, 0.0, 1.0);
      if (t < 0.13) return mix(C0, C1, smoothstep(0.00, 0.13, t));
      if (t < 0.28) return mix(C1, C2, smoothstep(0.13, 0.28, t));
      if (t < 0.43) return mix(C2, C3, smoothstep(0.28, 0.43, t));
      if (t < 0.56) return mix(C3, C4, smoothstep(0.43, 0.56, t));
      if (t < 0.68) return mix(C4, C5, smoothstep(0.56, 0.68, t));
      if (t < 0.79) return mix(C5, C6, smoothstep(0.68, 0.79, t));
      if (t < 0.875) return mix(C6, C7, smoothstep(0.79, 0.875, t));
      if (t < 0.935) return mix(C7, C8, smoothstep(0.875, 0.935, t));
      if (t < 0.975) return mix(C8, C9, smoothstep(0.935, 0.975, t));
      return mix(C9, C10, smoothstep(0.975, 1.00, t));
    }

    void main() {
      vec3 f = texture2D(tFluid, vUv).rgb;
      vec2 vel = f.rg;
      float presence = clamp(f.b, 0.0, 1.6);

      vec2 uv = vUv;
      vec2 uv2 = uv - vel * uDisplace;
      vec3 base = texture2D(tMap, uv2).rgb;

      vec2 shift = vel * uChromatic;
      vec3 sh = texture2D(tMap, vec2(uv.x - shift.x, uv.y + shift.y)).rgb;

      vec3 col;
      if (uMode < 0.5) {
        float aberr = clamp(length(sh - base), 0.0, 1.0);
        col = base + uColor * aberr;
      } else if (uMode < 1.5) {
        base.g = sh.g;
        base.b = sh.b;
        vec3 hue = mix(uColor, vec3(1.0), smoothstep(uWhite, uWhite + 0.4, presence));
        vec3 body = hue * smoothstep(0.0, 0.3, presence);
        float cover = smoothstep(0.04, 0.22, presence);
        col = mix(base, body, cover);
      } else {
        float speed = length(vel);
        /* Pemotongan keras di ujung panas memetakan semua energi di atas ambang
           ke warna identik, sehingga inti aliran runtuh jadi bidang cream rata
           dan detail yang sudah dihitung solver terbuang. Kurva eksponensial
           mendekati 1 tanpa pernah menyentuhnya — gradasi tetap hidup sampai
           piksel terpanas. */
        float raw = presence * 0.62 + speed * 0.0042;
        float heat = pow(1.0 - exp(-raw * 1.35), 0.62);

        vec3 hot = thermal(heat);
        float cover = smoothstep(0.015, 0.30, heat);

        /* Pemisahan kanal RGB milik mode dye menghasilkan cyan dan merah pada tinta putih —
           dua warna yang tidak ada di ramp termal, sehingga terbaca sebagai artefak rusak.
           Magnitudo aberasi dipertahankan, tapi warnanya diambil dari ramp pada suhu lebih
           tinggi supaya tepi yang bergerak tetap berada di dalam palet. */
        float aberr = clamp(length(sh - base), 0.0, 1.0);
        vec3 ink = mix(base, thermal(min(heat + 0.34, 1.0)), aberr * 0.85);

        col = mix(ink, max(ink, hot), cover);
      }

      gl_FragColor = vec4(col, 1.0);
    }
  `

  // ══════════════════════════════════════════════════════════════════════
  // CLASSES: Material + Program
  // ══════════════════════════════════════════════════════════════════════

  interface ProgramObj {
    program: WebGLProgram
    uniforms: Record<string, WebGLUniformLocation | null>
    bind: () => void
  }

  interface MaterialObj {
    vertexShader: WebGLShader
    fragmentShaderSource: string
    programs: Record<number, WebGLProgram>
    activeProgram: WebGLProgram | null
    uniforms: Record<string, WebGLUniformLocation | null>
    setKeywords: (keywords: string[]) => void
    bind: () => void
  }

  function createProgramObj(vertexShader: WebGLShader, fragmentShader: WebGLShader): ProgramObj {
    const g = gl!
    const program = g.createProgram()!
    g.attachShader(program, vertexShader)
    g.attachShader(program, fragmentShader)
    g.linkProgram(program)

    if (!g.getProgramParameter(program, g.LINK_STATUS))
      console.error('Program link error:', g.getProgramInfoLog(program))

    return {
      program,
      uniforms: getUniforms(program),
      bind() { g.useProgram(program) },
    }
  }

  function createMaterial(vertexShader: WebGLShader, fragmentShaderSource: string): MaterialObj {
    const material: MaterialObj = {
      vertexShader,
      fragmentShaderSource,
      programs: {},
      activeProgram: null,
      uniforms: {},
      setKeywords(keywords: string[]) {
        let hash = 0
        for (let i = 0; i < keywords.length; i++)
          hash += hashCode(keywords[i]!)

        let program = material.programs[hash]
        if (program == null) {
          const fragmentShader = compileShader(gl!.FRAGMENT_SHADER, material.fragmentShaderSource, keywords)
          program = gl!.createProgram()!
          gl!.attachShader(program, material.vertexShader)
          gl!.attachShader(program, fragmentShader)
          gl!.linkProgram(program)

          if (!gl!.getProgramParameter(program, gl!.LINK_STATUS))
            console.error('Material link error:', gl!.getProgramInfoLog(program))

          material.programs[hash] = program
        }

        if (program === material.activeProgram)
          return

        material.uniforms = getUniforms(program)
        material.activeProgram = program
      },
      bind() {
        gl!.useProgram(material.activeProgram)
      },
    }
    return material
  }

  function getUniforms(program: WebGLProgram): Record<string, WebGLUniformLocation | null> {
    const g = gl!
    const uniforms: Record<string, WebGLUniformLocation | null> = {}
    const uniformCount = g.getProgramParameter(program, g.ACTIVE_UNIFORMS)
    for (let i = 0; i < uniformCount; i++) {
      const uniformName = g.getActiveUniform(program, i)!.name
      uniforms[uniformName] = g.getUniformLocation(program, uniformName)
    }
    return uniforms
  }

  function compileShader(type: number, source: string, keywords?: string[] | null): WebGLShader {
    const g = gl!
    source = addKeywords(source, keywords ?? null)
    const shader = g.createShader(type)!
    g.shaderSource(shader, source)
    g.compileShader(shader)

    if (!g.getShaderParameter(shader, g.COMPILE_STATUS))
      console.error('Shader compile error:', g.getShaderInfoLog(shader))

    return shader
  }

  function addKeywords(source: string, keywords: string[] | null): string {
    if (keywords == null)
      return source
    let keywordsString = ''
    keywords.forEach((keyword) => {
      keywordsString += `#define ${keyword}\n`
    })
    return keywordsString + source
  }

  function hashCode(s: string): number {
    if (s.length === 0)
      return 0
    let hash = 0
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i)
      hash |= 0
    }
    return hash
  }

  // ══════════════════════════════════════════════════════════════════════
  // FBO MANAGEMENT
  // ══════════════════════════════════════════════════════════════════════

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    const g = gl!
    g.activeTexture(g.TEXTURE0)
    const texture = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, texture)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, param)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, param)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
    g.texImage2D(g.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

    const fbo = g.createFramebuffer()!
    g.bindFramebuffer(g.FRAMEBUFFER, fbo)
    g.framebufferTexture2D(g.FRAMEBUFFER, g.COLOR_ATTACHMENT0, g.TEXTURE_2D, texture, 0)
    g.viewport(0, 0, w, h)
    g.clear(g.COLOR_BUFFER_BIT)

    const texelSizeX = 1.0 / w
    const texelSizeY = 1.0 / h

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        g.activeTexture(g.TEXTURE0 + id)
        g.bindTexture(g.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param)
    let fbo2 = createFBO(w, h, internalFormat, format, type, param)

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() { return fbo1 },
      set read(value) { fbo1 = value },
      get write() { return fbo2 },
      set write(value) { fbo2 = value },
      swap() {
        const temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
    }
  }

  function resizeFBO(target: FBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    const newFBO = createFBO(w, h, internalFormat, format, type, param)
    copyProgram!.bind()
    gl!.uniform1i(copyProgram!.uniforms.uTexture!, target.attach(0))
    blit!(newFBO)
    return newFBO
  }

  function resizeDoubleFBO(target: DoubleFBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    if (target.width === w && target.height === h)
      return target
    target.read = resizeFBO(target.read, w, h, internalFormat, format, type, param)
    target.write = createFBO(w, h, internalFormat, format, type, param)
    target.width = w
    target.height = h
    target.texelSizeX = 1.0 / w
    target.texelSizeY = 1.0 / h
    return target
  }

  // ══════════════════════════════════════════════════════════════════════
  // TEXTURE + RESOLUTION
  // ══════════════════════════════════════════════════════════════════════

  function createDitheringTextureObj(): TextureObj {
    const g = gl!
    const texture = g.createTexture()!
    g.bindTexture(g.TEXTURE_2D, texture)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.REPEAT)
    g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.REPEAT)

    const size = 128
    const data = new Uint8Array(size * size * 3)
    for (let i = 0; i < size * size * 3; i++) {
      data[i] = Math.floor(Math.random() * 256)
    }
    g.texImage2D(g.TEXTURE_2D, 0, g.RGB, size, size, 0, g.RGB, g.UNSIGNED_BYTE, data)

    return {
      texture,
      width: size,
      height: size,
      attach(id: number) {
        g.activeTexture(g.TEXTURE0 + id)
        g.bindTexture(g.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function getResolution(resolution: number): { width: number, height: number } {
    const g = gl!
    let aspectRatio = g.drawingBufferWidth / g.drawingBufferHeight
    if (aspectRatio < 1)
      aspectRatio = 1.0 / aspectRatio

    const min = Math.round(resolution)
    const max = Math.round(resolution * aspectRatio)

    if (g.drawingBufferWidth > g.drawingBufferHeight)
      return { width: max, height: min }
    else
      return { width: min, height: max }
  }

  function getTextureScale(tex: TextureObj, width: number, height: number): { x: number, y: number } {
    return {
      x: width / tex.width,
      y: height / tex.height,
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // WEBGL CONTEXT
  // ══════════════════════════════════════════════════════════════════════

  function getWebGLContext(c: HTMLCanvasElement): { gl: WebGL2RenderingContext | WebGLRenderingContext, ext: GLFormats } | null {
    const params: WebGLContextAttributes = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    }

    let context: WebGL2RenderingContext | WebGLRenderingContext | null = c.getContext('webgl2', params) as WebGL2RenderingContext | null
    isWebGL2 = !!context
    if (!isWebGL2)
      context = (c.getContext('webgl', params) || c.getContext('experimental-webgl', params)) as WebGLRenderingContext | null

    if (!context)
      return null

    let halfFloatTexType: number
    let supportLinearFiltering: boolean

    if (isWebGL2) {
      (context as WebGL2RenderingContext).getExtension('EXT_color_buffer_float')
      supportLinearFiltering = !!(context as WebGL2RenderingContext).getExtension('OES_texture_float_linear')
      halfFloatTexType = (context as WebGL2RenderingContext).HALF_FLOAT
    }
    else {
      const halfFloat = context.getExtension('OES_texture_half_float')
      supportLinearFiltering = !!context.getExtension('OES_texture_half_float_linear')
      halfFloatTexType = halfFloat ? halfFloat.HALF_FLOAT_OES : 0
    }

    context.clearColor(0.0, 0.0, 0.0, 1.0)

    let formatRGBA: { internalFormat: number, format: number } | null
    let formatRG: { internalFormat: number, format: number } | null
    let formatR: { internalFormat: number, format: number } | null

    if (isWebGL2) {
      const gl2 = context as WebGL2RenderingContext
      formatRGBA = getSupportedFormat(context, gl2.RGBA16F, gl2.RGBA, halfFloatTexType)
      formatRG = getSupportedFormat(context, gl2.RG16F, gl2.RG, halfFloatTexType)
      formatR = getSupportedFormat(context, gl2.R16F, gl2.RED, halfFloatTexType)
    }
    else {
      formatRGBA = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
      formatRG = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
      formatR = getSupportedFormat(context, context.RGBA, context.RGBA, halfFloatTexType)
    }

    return {
      gl: context,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    }
  }

  function getSupportedFormat(
    context: WebGL2RenderingContext | WebGLRenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): { internalFormat: number, format: number } | null {
    if (!supportRenderTextureFormat(context, internalFormat, format, type)) {
      if (isWebGL2) {
        const gl2 = context as WebGL2RenderingContext
        switch (internalFormat) {
          case gl2.R16F:
            return getSupportedFormat(context, gl2.RG16F, gl2.RG, type)
          case gl2.RG16F:
            return getSupportedFormat(context, gl2.RGBA16F, gl2.RGBA, type)
          default:
            return null
        }
      }
      return null
    }
    return { internalFormat, format }
  }

  function supportRenderTextureFormat(
    context: WebGL2RenderingContext | WebGLRenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): boolean {
    const texture = context.createTexture()
    context.bindTexture(context.TEXTURE_2D, texture)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE)
    context.texParameteri(context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE)
    context.texImage2D(context.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

    const fbo = context.createFramebuffer()
    context.bindFramebuffer(context.FRAMEBUFFER, fbo)
    context.framebufferTexture2D(context.FRAMEBUFFER, context.COLOR_ATTACHMENT0, context.TEXTURE_2D, texture, 0)

    const status = context.checkFramebufferStatus(context.FRAMEBUFFER)

    context.deleteTexture(texture)
    context.deleteFramebuffer(fbo)
    context.bindFramebuffer(context.FRAMEBUFFER, null)

    return status === context.FRAMEBUFFER_COMPLETE
  }

  // ══════════════════════════════════════════════════════════════════════
  // SIMULATION: step, render, bloom, sunrays
  // ══════════════════════════════════════════════════════════════════════

  function initFramebuffers() {
    const g = gl!
    const e = ext!
    const simRes = getResolution(config.SIM_RESOLUTION)
    const dyeRes = getResolution(config.DYE_RESOLUTION)

    const texType = e.halfFloatTexType
    const rgba = e.formatRGBA!
    const rg = e.formatRG!
    const r = e.formatR!
    const filtering = e.supportLinearFiltering ? g.LINEAR : g.NEAREST

    g.disable(g.BLEND)

    if (dye == null)
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
    else
      dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)

    if (velocity == null)
      velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
    else
      velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)

    divergenceFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)
    curlFBO = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)
    pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, g.NEAREST)

    initBloomFramebuffers()
    initSunraysFramebuffers()
  }

  function initBloomFramebuffers() {
    const g = gl!
    const e = ext!
    const res = getResolution(config.BLOOM_RESOLUTION)
    const texType = e.halfFloatTexType
    const rgba = e.formatRGBA!
    const filtering = e.supportLinearFiltering ? g.LINEAR : g.NEAREST

    bloomFBO = createFBO(res.width, res.height, rgba.internalFormat, rgba.format, texType, filtering)

    bloomFramebuffers.length = 0
    for (let i = 0; i < config.BLOOM_ITERATIONS; i++) {
      const width = res.width >> (i + 1)
      const height = res.height >> (i + 1)
      if (width < 2 || height < 2)
        break
      const fbo = createFBO(width, height, rgba.internalFormat, rgba.format, texType, filtering)
      bloomFramebuffers.push(fbo)
    }
  }

  function initSunraysFramebuffers() {
    const g = gl!
    const e = ext!
    const res = getResolution(config.SUNRAYS_RESOLUTION)
    const texType = e.halfFloatTexType
    const r = e.formatR!
    const filtering = e.supportLinearFiltering ? g.LINEAR : g.NEAREST

    sunraysFBO = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering)
    sunraysTempFBO = createFBO(res.width, res.height, r.internalFormat, r.format, texType, filtering)
  }

  function updateKeywords() {
    const displayKeywords: string[] = []
    if (config.SHADING)
      displayKeywords.push('SHADING')
    if (config.BLOOM)
      displayKeywords.push('BLOOM')
    if (config.SUNRAYS)
      displayKeywords.push('SUNRAYS')
    displayMaterial!.setKeywords(displayKeywords)
  }

  function calcDeltaTime(): number {
    const now = Date.now()
    let dt = (now - lastUpdateTime) / 1000
    dt = Math.min(dt, 0.016666)
    lastUpdateTime = now
    return dt
  }

  function resizeCanvas(): boolean {
    const c = canvas!
    const pixelRatio = window.devicePixelRatio || 1
    const width = Math.floor(c.clientWidth * pixelRatio)
    const height = Math.floor(c.clientHeight * pixelRatio)
    if (c.width !== width || c.height !== height) {
      c.width = width
      c.height = height
      return true
    }
    return false
  }

  function updateColors(dt: number) {
    if (!config.COLORFUL)
      return

    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer = wrap(colorUpdateTimer, 0, 1)
      pointers.forEach((p) => {
        p.color = generateColor()
      })
    }
  }

  function applyInputs() {
    if (splatStack.length > 0)
      multipleSplats(splatStack.pop()!)

    if (splatSegments.length > 0) {
      for (const seg of splatSegments)
        splatSegment(seg)
      splatSegments.length = 0
    }

    pointers.forEach((p) => {
      p.moved = false
    })
  }

  function step(dt: number) {
    const g = gl!
    g.disable(g.BLEND)

    curlProgram!.bind()
    g.uniform2f(curlProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(curlProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    blit!(curlFBO)

    vorticityProgram!.bind()
    g.uniform2f(vorticityProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(vorticityProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    g.uniform1i(vorticityProgram!.uniforms.uCurl!, curlFBO!.attach(1))
    g.uniform1f(vorticityProgram!.uniforms.curl!, config.CURL)
    g.uniform1f(vorticityProgram!.uniforms.dt!, dt)
    blit!(velocity!.write)
    velocity!.swap()

    divergenceProgram!.bind()
    g.uniform2f(divergenceProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(divergenceProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    blit!(divergenceFBO)

    clearProgram!.bind()
    g.uniform1i(clearProgram!.uniforms.uTexture!, pressure!.read.attach(0))
    g.uniform1f(clearProgram!.uniforms.value!, config.PRESSURE)
    blit!(pressure!.write)
    pressure!.swap()

    pressureProgram!.bind()
    g.uniform2f(pressureProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(pressureProgram!.uniforms.uDivergence!, divergenceFBO!.attach(0))
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      g.uniform1i(pressureProgram!.uniforms.uPressure!, pressure!.read.attach(1))
      blit!(pressure!.write)
      pressure!.swap()
    }

    gradientSubtractProgram!.bind()
    g.uniform2f(gradientSubtractProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    g.uniform1i(gradientSubtractProgram!.uniforms.uPressure!, pressure!.read.attach(0))
    g.uniform1i(gradientSubtractProgram!.uniforms.uVelocity!, velocity!.read.attach(1))
    blit!(velocity!.write)
    velocity!.swap()

    advectionProgram!.bind()
    g.uniform2f(advectionProgram!.uniforms.texelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    if (!ext!.supportLinearFiltering)
      g.uniform2f(advectionProgram!.uniforms.dyeTexelSize!, velocity!.texelSizeX, velocity!.texelSizeY)
    const velocityId = velocity!.read.attach(0)
    g.uniform1i(advectionProgram!.uniforms.uVelocity!, velocityId)
    g.uniform1i(advectionProgram!.uniforms.uSource!, velocityId)
    g.uniform1f(advectionProgram!.uniforms.dt!, dt)
    g.uniform1f(advectionProgram!.uniforms.dissipation!, config.VELOCITY_DISSIPATION)
    blit!(velocity!.write)
    velocity!.swap()

    if (!ext!.supportLinearFiltering)
      g.uniform2f(advectionProgram!.uniforms.dyeTexelSize!, dye!.texelSizeX, dye!.texelSizeY)
    g.uniform1i(advectionProgram!.uniforms.uVelocity!, velocity!.read.attach(0))
    g.uniform1i(advectionProgram!.uniforms.uSource!, dye!.read.attach(1))
    g.uniform1f(advectionProgram!.uniforms.dissipation!, config.DENSITY_DISSIPATION)
    blit!(dye!.write)
    dye!.swap()
  }

  function render(target: FBO | null) {
    if (contentDisplayEnabled) {
      drawContentDisplay(target)
      return
    }
    const g = gl!
    if (config.BLOOM)
      applyBloom(dye!.read, bloomFBO!)
    if (config.SUNRAYS) {
      applySunrays(dye!.read, dye!.write, sunraysFBO!)
      blur(sunraysFBO!, sunraysTempFBO!, 1)
    }

    if (target == null || !config.TRANSPARENT) {
      g.blendFunc(g.ONE, g.ONE_MINUS_SRC_ALPHA)
      g.enable(g.BLEND)
    }
    else {
      g.disable(g.BLEND)
    }

    if (!config.TRANSPARENT)
      drawColor(target, normalizeColor(config.BACK_COLOR))
    drawDisplay(target)
  }

  function drawColor(target: FBO | null, color: FluidColor) {
    colorProgram!.bind()
    gl!.uniform4f(colorProgram!.uniforms.color!, color.r, color.g, color.b, 1)
    blit!(target)
  }

  function drawDisplay(target: FBO | null) {
    const g = gl!
    const width = target == null
      ? g.drawingBufferWidth
      : target.width
    const height = target == null
      ? g.drawingBufferHeight
      : target.height

    displayMaterial!.bind()
    if (config.SHADING)
      g.uniform2f(displayMaterial!.uniforms.texelSize!, 1.0 / width, 1.0 / height)
    g.uniform1i(displayMaterial!.uniforms.uTexture!, dye!.read.attach(0))
    if (config.BLOOM) {
      g.uniform1i(displayMaterial!.uniforms.uBloom!, bloomFBO!.attach(1))
      g.uniform1i(displayMaterial!.uniforms.uDithering!, ditheringTexture!.attach(2))
      const scale = getTextureScale(ditheringTexture!, width, height)
      g.uniform2f(displayMaterial!.uniforms.ditherScale!, scale.x, scale.y)
    }
    if (config.SUNRAYS)
      g.uniform1i(displayMaterial!.uniforms.uSunrays!, sunraysFBO!.attach(3))
    blit!(target)
  }

  function setContentCanvas(source: HTMLCanvasElement) {
    if (!gl)
      return
    const g = gl
    if (!contentTexture) {
      const texture = g.createTexture()!
      g.bindTexture(g.TEXTURE_2D, texture)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MIN_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_MAG_FILTER, g.LINEAR)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_S, g.CLAMP_TO_EDGE)
      g.texParameteri(g.TEXTURE_2D, g.TEXTURE_WRAP_T, g.CLAMP_TO_EDGE)
      contentTexture = {
        texture,
        width: source.width,
        height: source.height,
        attach(id: number) {
          g.activeTexture(g.TEXTURE0 + id)
          g.bindTexture(g.TEXTURE_2D, texture)
          return id
        },
      }
    }
    g.bindTexture(g.TEXTURE_2D, contentTexture.texture)
    /* Raster 2D top-down, vUv WebGL bottom-up — flip saat upload agar
       searah dengan velocity field (texcoordY pointer sudah di-flip) */
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, true)
    g.texImage2D(g.TEXTURE_2D, 0, g.RGBA, g.RGBA, g.UNSIGNED_BYTE, source)
    g.pixelStorei(g.UNPACK_FLIP_Y_WEBGL, false)
    contentTexture.width = source.width
    contentTexture.height = source.height
  }

  function drawContentDisplay(target: FBO | null) {
    if (!contentTexture || !contentDisplayProgram)
      return
    const g = gl!
    g.disable(g.BLEND)
    contentDisplayProgram.bind()
    g.uniform1i(contentDisplayProgram.uniforms.tMap!, contentTexture.attach(0))
    g.uniform1i(contentDisplayProgram.uniforms.tFluid!, dye!.read.attach(1))
    g.uniform1f(contentDisplayProgram.uniforms.uMode!, contentDisplay.mode)
    g.uniform1f(contentDisplayProgram.uniforms.uDisplace!, contentDisplay.displace)
    g.uniform1f(contentDisplayProgram.uniforms.uChromatic!, contentDisplay.chromatic)
    g.uniform3f(contentDisplayProgram.uniforms.uColor!, contentDisplay.color[0], contentDisplay.color[1], contentDisplay.color[2])
    g.uniform1f(contentDisplayProgram.uniforms.uWhite!, contentDisplay.whiteCore)
    blit!(target)
  }

  function applyBloom(source: FBO, destination: FBO) {
    if (bloomFramebuffers.length < 2)
      return

    const g = gl!
    let last: FBO = destination

    g.disable(g.BLEND)
    bloomPrefilterProgram!.bind()
    const knee = config.BLOOM_THRESHOLD * config.BLOOM_SOFT_KNEE + 0.0001
    const curve0 = config.BLOOM_THRESHOLD - knee
    const curve1 = knee * 2
    const curve2 = 0.25 / knee
    g.uniform3f(bloomPrefilterProgram!.uniforms.curve!, curve0, curve1, curve2)
    g.uniform1f(bloomPrefilterProgram!.uniforms.threshold!, config.BLOOM_THRESHOLD)
    g.uniform1i(bloomPrefilterProgram!.uniforms.uTexture!, source.attach(0))
    blit!(last)

    bloomBlurProgram!.bind()
    for (let i = 0; i < bloomFramebuffers.length; i++) {
      const dest = bloomFramebuffers[i]!
      g.uniform2f(bloomBlurProgram!.uniforms.texelSize!, last.texelSizeX, last.texelSizeY)
      g.uniform1i(bloomBlurProgram!.uniforms.uTexture!, last.attach(0))
      blit!(dest)
      last = dest
    }

    g.blendFunc(g.ONE, g.ONE)
    g.enable(g.BLEND)

    for (let i = bloomFramebuffers.length - 2; i >= 0; i--) {
      const baseTex = bloomFramebuffers[i]!
      g.uniform2f(bloomBlurProgram!.uniforms.texelSize!, last.texelSizeX, last.texelSizeY)
      g.uniform1i(bloomBlurProgram!.uniforms.uTexture!, last.attach(0))
      g.viewport(0, 0, baseTex.width, baseTex.height)
      blit!(baseTex)
      last = baseTex
    }

    g.disable(g.BLEND)
    bloomFinalProgram!.bind()
    g.uniform2f(bloomFinalProgram!.uniforms.texelSize!, last.texelSizeX, last.texelSizeY)
    g.uniform1i(bloomFinalProgram!.uniforms.uTexture!, last.attach(0))
    g.uniform1f(bloomFinalProgram!.uniforms.intensity!, config.BLOOM_INTENSITY)
    blit!(destination)
  }

  function applySunrays(source: FBO, mask: FBO, destination: FBO) {
    const g = gl!
    g.disable(g.BLEND)
    sunraysMaskProgram!.bind()
    g.uniform1i(sunraysMaskProgram!.uniforms.uTexture!, source.attach(0))
    blit!(mask)

    sunraysProgram!.bind()
    g.uniform1f(sunraysProgram!.uniforms.weight!, config.SUNRAYS_WEIGHT)
    g.uniform1i(sunraysProgram!.uniforms.uTexture!, mask.attach(0))
    blit!(destination)
  }

  function blur(target: FBO, temp: FBO, iterations: number) {
    blurProgram!.bind()
    for (let i = 0; i < iterations; i++) {
      gl!.uniform2f(blurProgram!.uniforms.texelSize!, target.texelSizeX, 0.0)
      gl!.uniform1i(blurProgram!.uniforms.uTexture!, target.attach(0))
      blit!(temp)

      gl!.uniform2f(blurProgram!.uniforms.texelSize!, 0.0, target.texelSizeY)
      gl!.uniform1i(blurProgram!.uniforms.uTexture!, temp.attach(0))
      blit!(target)
    }
  }

  // ══════════════════════════════════════════════════════════════════════
  // SPLAT + COLOR
  // ══════════════════════════════════════════════════════════════════════

  /* Paritas daspritam: setiap event pointer di-queue sebagai segmen lalu
     dipecah menjadi sub-splat sepanjang garis lama->baru. Satu splat per
     frame (perilaku lama) meninggalkan titik-titik terpisah saat flick
     karena delta satu frame bisa melampaui radius gaussian */
  function splatSegment(seg: SplatSegment) {
    const dist = Math.hypot(seg.deltaX, seg.deltaY)
    const count = Math.max(1, Math.min(Math.ceil(dist / SPLAT_INTERP_SPACING), MAX_SPLATS_PER_SEGMENT))
    /* Momentum dibagi rata antar sub-splat: total energi per segmen setara
       satu splat penuh, meniru deposit per-event kecil milik daspritam */
    const dx = seg.deltaX * config.SPLAT_FORCE / count
    const dy = seg.deltaY * config.SPLAT_FORCE / count
    /* Content mode drops one full splat per event at the newest position, so a fast flick prints
       separate beads once the per-frame step passes the gaussian sigma. Interpolating only helps
       when presence is divided by the count alongside momentum — dividing momentum alone is what
       multiplied dye coverage and flooded the text band. Opt-in so routes calibrated against the
       single-splat behaviour keep it. */
    if (contentDisplayEnabled) {
      if (!interpolateSegments) {
        splat(seg.toX, seg.toY, seg.deltaX * config.SPLAT_FORCE, seg.deltaY * config.SPLAT_FORCE, seg.color)
        return
      }
      for (let i = 1; i <= count; i++) {
        const t = i / count
        splat(seg.fromX + (seg.toX - seg.fromX) * t, seg.fromY + (seg.toY - seg.fromY) * t, dx, dy, seg.color, 1 / count)
      }
      return
    }
    const dyeColor = {
      r: seg.color.r * DYE_SPLAT_MULT,
      g: seg.color.g * DYE_SPLAT_MULT,
      b: seg.color.b * DYE_SPLAT_MULT,
    }
    for (let i = 1; i <= count; i++) {
      const t = i / count
      const x = seg.fromX + (seg.toX - seg.fromX) * t
      const y = seg.fromY + (seg.toY - seg.fromY) * t
      splat(x, y, dx, dy, dyeColor)
    }
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor()
      color.r *= 10.0
      color.g *= 10.0
      color.b *= 10.0
      const x = Math.random()
      const y = Math.random()
      const dx = 1000 * (Math.random() - 0.5)
      const dy = 1000 * (Math.random() - 0.5)
      splat(x, y, dx, dy, color)
    }
  }

  /* 14 (dari 10): dissipation cepat kalibrasi daspritam memangkas umur splat
     tunggal — deposit awal dinaikkan agar splat programatik tetap terbaca
     tanpa mengubah kontrak pemanggil; plafon dijaga clamp DYE_MAX di shader */
  function emitSplat(x: number, y: number, dx: number, dy: number, brightness = 1, radius?: number) {
    const color = generateColor()
    color.r *= 14.0 * brightness
    color.g *= 14.0 * brightness
    color.b *= 14.0 * brightness
    if (radius === undefined) {
      splat(x, y, dx, dy, color)
      return
    }
    const previousRadius = config.SPLAT_RADIUS
    config.SPLAT_RADIUS = radius
    splat(x, y, dx, dy, color)
    config.SPLAT_RADIUS = previousRadius
  }

  function splat(x: number, y: number, dx: number, dy: number, color: FluidColor, presence = 1) {
    const g = gl!
    splatProgram!.bind()
    g.uniform1i(splatProgram!.uniforms.uTarget!, velocity!.read.attach(0))
    g.uniform1f(splatProgram!.uniforms.aspectRatio!, canvas!.width / canvas!.height)
    g.uniform2f(splatProgram!.uniforms.point!, x, y)
    g.uniform3f(splatProgram!.uniforms.color!, dx, dy, 0.0)
    /* Wiring OGL referensi memakai radius mentah tanpa koreksi aspect —
       correctRadius Pavel melebarkan blob ~2x di layar landscape */
    g.uniform1f(splatProgram!.uniforms.radius!, contentDisplayEnabled
      ? config.SPLAT_RADIUS / 100.0
      : correctRadius(config.SPLAT_RADIUS / 100.0))
    g.uniform1f(splatProgram!.uniforms.clampValue!, VELOCITY_CLAMP)
    blit!(velocity!.write)
    velocity!.swap()

    g.uniform1i(splatProgram!.uniforms.uTarget!, dye!.read.attach(0))
    if (contentDisplayEnabled) {
      /* Paritas daspritam: dye di-splat dengan vektor kecepatan (dx,dy,1) dan
         menjadi peta displacement — bukan velocity field. Velocity hasil
         pressure-projection punya lobus +/- berselang dan disustain vorticity
         (tearing zebra + residu saat idle); density murni ter-advect dan
         meluruh multiplicative sehingga teks selalu pulih utuh. Tanpa clamp
         DYE_MAX: nilai kecepatan ratusan akan tergencet ke 0.85 */
      g.uniform3f(splatProgram!.uniforms.color!, dx, dy, presence)
      g.uniform1f(splatProgram!.uniforms.clampValue!, VELOCITY_CLAMP)
    }
    else {
      g.uniform3f(splatProgram!.uniforms.color!, color.r, color.g, color.b)
      g.uniform1f(splatProgram!.uniforms.clampValue!, DYE_MAX)
    }
    blit!(dye!.write)
    dye!.swap()
  }

  function correctRadius(radius: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      radius *= aspectRatio
    return radius
  }

  let hueMin = 0
  let hueMax = 1

  function generateColor(): FluidColor {
    const span = hueMax - hueMin
    const hue = ((hueMin + Math.random() * span) % 1 + 1) % 1
    const c = HSVtoRGB(hue, 1.0, 1.0)
    c.r *= 0.15
    c.g *= 0.15
    c.b *= 0.15
    return c
  }

  function HSVtoRGB(h: number, s: number, v: number): FluidColor {
    let r = 0
    let g = 0
    let b = 0
    const i = Math.floor(h * 6)
    const f = h * 6 - i
    const p = v * (1 - s)
    const q = v * (1 - f * s)
    const t = v * (1 - (1 - f) * s)

    switch (i % 6) {
      case 0:
        r = v
        g = t
        b = p
        break
      case 1:
        r = q
        g = v
        b = p
        break
      case 2:
        r = p
        g = v
        b = t
        break
      case 3:
        r = p
        g = q
        b = v
        break
      case 4:
        r = t
        g = p
        b = v
        break
      case 5:
        r = v
        g = p
        b = q
        break
    }

    return { r, g, b }
  }

  function normalizeColor(input: { r: number, g: number, b: number }): FluidColor {
    return {
      r: input.r / 255,
      g: input.g / 255,
      b: input.b / 255,
    }
  }

  function wrap(value: number, min: number, max: number): number {
    const range = max - min
    if (range === 0)
      return min
    return (value - min) % range + min
  }

  function correctDeltaX(delta: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio < 1)
      delta *= aspectRatio
    return delta
  }

  function correctDeltaY(delta: number): number {
    const aspectRatio = canvas!.width / canvas!.height
    if (aspectRatio > 1)
      delta /= aspectRatio
    return delta
  }

  function scaleByPixelRatio(input: number): number {
    const pixelRatio = window.devicePixelRatio || 1
    return Math.floor(input * pixelRatio)
  }

  // ══════════════════════════════════════════════════════════════════════
  // POINTER + INPUT
  // ══════════════════════════════════════════════════════════════════════

  function createPointer(): Pointer {
    return {
      id: -1,
      texcoordX: 0,
      texcoordY: 0,
      prevTexcoordX: 0,
      prevTexcoordY: 0,
      deltaX: 0,
      deltaY: 0,
      down: false,
      moved: false,
      seeded: false,
      color: { r: 30 * 0.15 / 255, g: 0, b: 300 * 0.15 / 255 },
    }
  }

  function updatePointerDownData(pointer: Pointer, id: number, posX: number, posY: number) {
    pointer.id = id
    pointer.down = true
    pointer.moved = false
    pointer.texcoordX = posX / canvas!.width
    pointer.texcoordY = 1.0 - posY / canvas!.height
    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.deltaX = 0
    pointer.deltaY = 0
    pointer.color = generateColor()
    pointer.seeded = true
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
    /* Pointer lahir di texcoord (0,0), bukan di posisi kursor sebenarnya. Karena
       mousemove di sini tidak lagi digerbangi `down` seperti port aslinya, event
       pertama akan menghitung delta dari sudut kanvas ke kursor dan meledak jadi
       satu splat sepanjang layar — cukup kursor kebetulan berada di atas viewport
       saat halaman dimuat. Event pertama hanya menanam posisi, tanpa gaya. */
    if (!pointer.seeded) {
      pointer.texcoordX = posX / canvas!.width
      pointer.texcoordY = 1.0 - posY / canvas!.height
      pointer.prevTexcoordX = pointer.texcoordX
      pointer.prevTexcoordY = pointer.texcoordY
      pointer.deltaX = 0
      pointer.deltaY = 0
      pointer.moved = false
      pointer.seeded = true
      return
    }

    pointer.prevTexcoordX = pointer.texcoordX
    pointer.prevTexcoordY = pointer.texcoordY
    pointer.texcoordX = posX / canvas!.width
    pointer.texcoordY = 1.0 - posY / canvas!.height
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX)
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY)
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0
    /* Segmen per event (bukan per frame): browser yang tidak meng-coalesce
       mousemove mengirim >1 event/frame — semua gerakan ikut ter-splat,
       bukan hanya delta event terakhir */
    if (pointer.moved && (!pointerGate || pointerGate(pointer.texcoordX, pointer.texcoordY))) {
      if (splatSegments.length >= MAX_QUEUED_SEGMENTS)
        splatSegments.shift()
      splatSegments.push({
        fromX: pointer.prevTexcoordX,
        fromY: pointer.prevTexcoordY,
        toX: pointer.texcoordX,
        toY: pointer.texcoordY,
        deltaX: pointer.deltaX,
        deltaY: pointer.deltaY,
        color: pointer.color,
      })
    }
  }

  function updatePointerUpData(pointer: Pointer) {
    pointer.down = false
  }

  // Event handlers stored for cleanup
  let onMouseDown: ((e: MouseEvent) => void) | null = null
  let onMouseMove: ((e: MouseEvent) => void) | null = null
  let onMouseUp: (() => void) | null = null
  let onTouchStart: ((e: TouchEvent) => void) | null = null
  let onTouchMove: ((e: TouchEvent) => void) | null = null
  let onTouchEnd: ((e: TouchEvent) => void) | null = null

  function setupEventListeners() {
    const c = canvas!

    onMouseDown = (e: MouseEvent) => {
      const posX = scaleByPixelRatio(e.offsetX)
      const posY = scaleByPixelRatio(e.offsetY)
      let pointer = pointers.find(p => p.id === -1)
      if (pointer == null) {
        pointer = createPointer()
        pointers.push(pointer)
      }
      updatePointerDownData(pointer, -1, posX, posY)
    }

    onMouseMove = (e: MouseEvent) => {
      const pointer = pointers[0]!
      // Portfolio behavior: always track mouse movement (not just when down)
      const posX = scaleByPixelRatio(e.offsetX)
      const posY = scaleByPixelRatio(e.offsetY)
      updatePointerMoveData(pointer, posX, posY)
    }

    onMouseUp = () => {
      updatePointerUpData(pointers[0]!)
    }

    onTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      const touches = e.targetTouches
      while (touches.length >= pointers.length)
        pointers.push(createPointer())
      for (let i = 0; i < touches.length; i++) {
        const t = touches[i]!
        const posX = scaleByPixelRatio(t.pageX)
        const posY = scaleByPixelRatio(t.pageY)
        updatePointerDownData(pointers[i + 1]!, t.identifier, posX, posY)
      }
    }

    onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const touches = e.targetTouches
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers[i + 1]
        if (!pointer?.down)
          continue
        const t = touches[i]!
        const posX = scaleByPixelRatio(t.pageX)
        const posY = scaleByPixelRatio(t.pageY)
        updatePointerMoveData(pointer, posX, posY)
      }
    }

    onTouchEnd = (e: TouchEvent) => {
      const touches = e.changedTouches
      for (let i = 0; i < touches.length; i++) {
        const pointer = pointers.find(p => p.id === touches[i]!.identifier)
        if (pointer == null)
          continue
        updatePointerUpData(pointer)
      }
    }

    c.addEventListener('mousedown', onMouseDown)
    c.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    c.addEventListener('touchstart', onTouchStart)
    c.addEventListener('touchmove', onTouchMove, false)
    window.addEventListener('touchend', onTouchEnd)
  }

  function removeEventListeners() {
    if (!canvas)
      return
    if (onMouseDown)
      canvas.removeEventListener('mousedown', onMouseDown)
    if (onMouseMove)
      canvas.removeEventListener('mousemove', onMouseMove)
    if (onMouseUp)
      window.removeEventListener('mouseup', onMouseUp)
    if (onTouchStart)
      canvas.removeEventListener('touchstart', onTouchStart)
    if (onTouchMove)
      canvas.removeEventListener('touchmove', onTouchMove)
    if (onTouchEnd)
      window.removeEventListener('touchend', onTouchEnd)
  }

  // ══════════════════════════════════════════════════════════════════════
  // MAIN LOOP
  // ══════════════════════════════════════════════════════════════════════

  /* resizeCanvas tidak boleh dipanggil per frame: membaca clientWidth tiap
     frame memicu forced reflow (terukur 92ms/5s trace) — resize ditangani
     ResizeObserver pemilik canvas via resize() publik */
  function update() {
    const dt = calcDeltaTime()
    updateColors(dt)
    applyInputs()
    if (!config.PAUSED)
      step(dt)
    render(null)
    animFrameId = requestAnimationFrame(update)
  }

  // ══════════════════════════════════════════════════════════════════════
  // PUBLIC API
  // ══════════════════════════════════════════════════════════════════════

  function init(canvasEl: HTMLCanvasElement, options?: {
    skipInitialSplats?: boolean
    hueMin?: number
    hueMax?: number
    curl?: number
    splatRadius?: number
    splatForce?: number
    contentDisplay?: boolean
    pointerGate?: (u: number, v: number) => boolean
    displayMode?: 'faithful' | 'dye' | 'thermal'
    displace?: number
    chromatic?: number
    color?: string
    whiteCore?: number
    densityDissipation?: number
    velocityDissipation?: number
    pressureIterations?: number
    interpolateSegments?: boolean
  }): boolean {
    canvas = canvasEl
    hueMin = options?.hueMin ?? 0
    hueMax = options?.hueMax ?? 1
    if (options?.curl !== undefined)
      config.CURL = options.curl
    if (options?.splatRadius !== undefined)
      config.SPLAT_RADIUS = options.splatRadius
    if (options?.splatForce !== undefined)
      config.SPLAT_FORCE = options.splatForce
    if (options?.densityDissipation !== undefined)
      config.DENSITY_DISSIPATION = options.densityDissipation
    if (options?.velocityDissipation !== undefined)
      config.VELOCITY_DISSIPATION = options.velocityDissipation
    if (options?.pressureIterations !== undefined)
      config.PRESSURE_ITERATIONS = options.pressureIterations
    interpolateSegments = options?.interpolateSegments ?? false
    contentDisplayEnabled = options?.contentDisplay ?? false
    pointerGate = options?.pointerGate ?? null
    contentDisplay.mode = options?.displayMode === 'dye'
      ? 1
      : options?.displayMode === 'thermal'
        ? 2
        : 0
    if (options?.displace !== undefined)
      contentDisplay.displace = options.displace
    if (options?.chromatic !== undefined)
      contentDisplay.chromatic = options.chromatic
    if (options?.color !== undefined)
      contentDisplay.color = hexToRgb(options.color)
    if (options?.whiteCore !== undefined)
      contentDisplay.whiteCore = options.whiteCore

    const ctx = getWebGLContext(canvas)
    if (!ctx || !ctx.ext.formatRGBA) {
      console.warn('[FluidSimulation] WebGL not supported or missing required extensions')
      return false
    }

    gl = ctx.gl
    ext = ctx.ext

    // Adjust for mobile
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      config.DYE_RESOLUTION = 512
    }
    if (!ext.supportLinearFiltering) {
      config.DYE_RESOLUTION = 512
      config.SHADING = false
      config.BLOOM = false
      config.SUNRAYS = false
    }

    // Compile shaders
    const baseVertexShader = compileShader(gl.VERTEX_SHADER, baseVertexShaderSource)
    const blurVertexShader = compileShader(gl.VERTEX_SHADER, blurVertexShaderSource)

    blurProgram = createProgramObj(blurVertexShader, compileShader(gl.FRAGMENT_SHADER, blurShaderSource))
    copyProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, copyShaderSource))
    clearProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, clearShaderSource))
    colorProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, colorShaderSource))
    bloomPrefilterProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, bloomPrefilterShaderSource))
    bloomBlurProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, bloomBlurShaderSource))
    bloomFinalProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, bloomFinalShaderSource))
    sunraysMaskProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, sunraysMaskShaderSource))
    sunraysProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, sunraysShaderSource))
    splatProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, splatShaderSource))
    divergenceProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, divergenceShaderSource))
    curlProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, curlShaderSource))
    vorticityProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, vorticityShaderSource))
    pressureProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, pressureShaderSource))
    gradientSubtractProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, gradientSubtractShaderSource))

    advectionProgram = createProgramObj(
      baseVertexShader,
      compileShader(gl.FRAGMENT_SHADER, advectionShaderSource, ext.supportLinearFiltering
        ? null
        : ['MANUAL_FILTERING']),
    )

    displayMaterial = createMaterial(baseVertexShader, displayShaderSource)

    if (contentDisplayEnabled)
      contentDisplayProgram = createProgramObj(baseVertexShader, compileShader(gl.FRAGMENT_SHADER, contentDisplayShaderSource))

    // Setup blit (fullscreen quad)
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer())
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW)
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)

    blit = (target: FBO | null, clear = false) => {
      const g = gl!
      if (target == null) {
        g.viewport(0, 0, g.drawingBufferWidth, g.drawingBufferHeight)
        g.bindFramebuffer(g.FRAMEBUFFER, null)
      }
      else {
        g.viewport(0, 0, target.width, target.height)
        g.bindFramebuffer(g.FRAMEBUFFER, target.fbo)
      }
      if (clear) {
        g.clearColor(0.0, 0.0, 0.0, 1.0)
        g.clear(g.COLOR_BUFFER_BIT)
      }
      g.drawElements(g.TRIANGLES, 6, g.UNSIGNED_SHORT, 0)
    }

    ditheringTexture = createDitheringTextureObj()
    pointers.push(createPointer())

    updateKeywords()
    resizeCanvas()
    initFramebuffers()

    // Initial splats (skip if hero wants black-first activation)
    if (!options?.skipInitialSplats)
      multipleSplats(Math.floor(Math.random() * 20) + 5)

    setupEventListeners()

    lastUpdateTime = Date.now()
    update()

    return true
  }

  function resize() {
    if (canvas && gl) {
      if (resizeCanvas())
        initFramebuffers()
    }
  }

  function destroy() {
    cancelAnimationFrame(animFrameId)
    removeEventListeners()

    canvas = null
    gl = null
    ext = null
    blit = null
    dye = null
    velocity = null
    divergenceFBO = null
    curlFBO = null
    pressure = null
    bloomFBO = null
    bloomFramebuffers = []
    sunraysFBO = null
    sunraysTempFBO = null
    ditheringTexture = null
    contentTexture = null
    contentDisplayProgram = null
    contentDisplayEnabled = false
    interpolateSegments = false
    pointerGate = null
    pointers.length = 0
    splatStack = []
    splatSegments.length = 0
  }

  return {
    init,
    resize,
    destroy,
    multipleSplats,
    emitSplat,
    setContentCanvas,
  }
}

/* ── halaman ────────────────────────────────────────────── */
/* Motion and ink share one lifetime. At velocity 3.2 / pressure 3 the flow died after ~1.2s while
   the thermal curve kept faint presence visible past 4s, so the trail stood still while it faded.
   Velocity 1.2 lets the flow outlive the bright phase, density 1.8 retires the ink as the flow runs
   out, pressure 20 turns the surviving momentum into rolling vortices rather than stamped blobs,
   and curl 8 keeps those vortices large — curl 20 with long-lived velocity shreds a stroke into
   curly smoke within 0.3s. */
/* 'faithful' keeps the fluid itself invisible: the only thing drawn is the masthead raster being
   dragged by the velocity field, with the aberration edge tinted uColor. 'thermal' painted a heat
   field across the whole canvas, which covered the letters instead of acting on them. */
const FLUID = {
  mode: 'faithful' as const,
  color: '#0047FF',
  curl: 8,
  splatRadius: 0.3,
  splatForce: 7200,
  displace: 0.001,
  chromatic: 0.003,
  whiteCore: 0.95,
  densityDissipation: 1.8,
  velocityDissipation: 1.2,
  pressureIterations: 20,
}

const MASTHEAD_TEXT = 'BILLYMAULANA'
const NAME_FONT = '\'Bebas Neue\', Impact, sans-serif'
const NAME_TRACKING_EM = -0.015
const NAME_MEASURE_BASE_PX = 100
const NAME_Y_FRAC = 0.86

const SOCIAL_LINKS = [
  { label: 'GitHub', href: 'https://github.com/billymaulana' },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/billy-maulana' },
  { label: 'Instagram', href: 'https://instagram.com/billymaulana' },
]

const sectionRef = ref<HTMLElement>()
const fluidCanvasRef = ref<HTMLCanvasElement>()
const namesRef = ref<HTMLElement>()
const nameRef = ref<HTMLElement>()
const taglineRef = ref<HTMLElement>()
const metaRef = ref<HTMLElement>()

const fluid = useFluidSimulation()
const heroStage = useHeroStage()
const { clockText } = heroStage

let gsapCtx: gsap.Context | null = null
let resizeObserver: ResizeObserver | null = null
let fluidReady = false
let textResizeHandler: (() => void) | null = null
let nameChars: HTMLElement[] = []

const mastheadRaster = useMastheadRaster({
  fontFamily: NAME_FONT,
  fontWeight: 400,
  letterSpacingEm: NAME_TRACKING_EM,
  lines: [],
})

interface MastheadMetrics {
  pad: number
  fontSize: number
  left: number
  baselineFromTop: number
}

function measureMasthead(width: number): MastheadMetrics {
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `400 ${NAME_MEASURE_BASE_PX}px ${NAME_FONT}`
  if ('letterSpacing' in ctx)
    ctx.letterSpacing = `${NAME_MEASURE_BASE_PX * NAME_TRACKING_EM}px`
  const metrics = ctx.measureText(MASTHEAD_TEXT)
  const inkWidth = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight
  const pad = distortionTextPadding(width)
  const targetWidth = width - 2 * pad
  const scale = targetWidth / inkWidth
  const ascent = metrics.fontBoundingBoxAscent
  const descent = metrics.fontBoundingBoxDescent
  return {
    pad,
    fontSize: NAME_MEASURE_BASE_PX * scale,
    left: pad + metrics.actualBoundingBoxLeft * scale,
    baselineFromTop: ((NAME_MEASURE_BASE_PX - (ascent + descent)) / 2 + ascent) * scale,
  }
}

function layoutMasthead() {
  const section = sectionRef.value
  const name = nameRef.value
  if (!section || !name)
    return
  const m = measureMasthead(section.clientWidth)
  const baselineY = NAME_Y_FRAC * section.clientHeight
  name.style.left = `${m.left}px`
  name.style.top = `${baselineY - m.baselineFromTop}px`
  name.style.fontSize = `${m.fontSize}px`
  name.style.letterSpacing = `${NAME_TRACKING_EM}em`
  name.style.visibility = 'inherit'
}

function buildDistortionLines() {
  const width = sectionRef.value?.clientWidth ?? window.innerWidth
  const m = measureMasthead(width)
  return [
    {
      text: MASTHEAD_TEXT,
      xAlign: 'left' as const,
      yFrac: NAME_Y_FRAC,
      fontSize: m.fontSize,
      indent: (m.left - m.pad) * (200 / m.fontSize),
    },
  ]
}

function uploadMasthead() {
  const section = sectionRef.value
  if (!section)
    return
  mastheadRaster.updateLines(buildDistortionLines())
  const dpr = window.devicePixelRatio || 1
  const canvas = mastheadRaster.render(section.clientWidth, section.clientHeight, dpr)
  if (fluidReady)
    fluid.setContentCanvas(canvas)
}

function buildNameChars(el: HTMLElement): HTMLElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  const chars: HTMLElement[] = []
  for (const ch of text) {
    const span = document.createElement('span')
    span.className = 'h4__name-char'
    span.textContent = ch
    el.appendChild(span)
    chars.push(span)
  }
  return chars
}

onMounted(async () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    await document.fonts.load(`400 100px ${NAME_FONT}`)
    await document.fonts.ready
    layoutMasthead()
    heroStage.startClock()
    textResizeHandler = layoutMasthead
    window.addEventListener('resize', textResizeHandler)
    return
  }

  /* The face fetch starts before the gsap chunk is awaited, not after it: a font is only requested
     when something asks for it, so serialising the two made the masthead wait for the import and
     the download end to end. Passing the masthead string targets the glyphs actually drawn. */
  const mastheadFont = document.fonts.load(`400 100px ${NAME_FONT}`, MASTHEAD_TEXT).catch(() => [])

  const gsapModule = await import('gsap')
  const gsapLib = gsapModule.default
  const { ScrollTrigger } = await import('gsap/ScrollTrigger')
  gsapLib.registerPlugin(ScrollTrigger)

  gsapLib.set(
    [namesRef.value, taglineRef.value, metaRef.value].filter(Boolean),
    { autoAlpha: 0 },
  )

  if (fluidCanvasRef.value) {
    fluidReady = fluid.init(fluidCanvasRef.value, {
      skipInitialSplats: true,
      contentDisplay: true,
      displayMode: FLUID.mode,
      color: FLUID.color,
      curl: FLUID.curl,
      splatRadius: FLUID.splatRadius,
      splatForce: FLUID.splatForce,
      displace: FLUID.displace,
      chromatic: FLUID.chromatic,
      whiteCore: FLUID.whiteCore,
      densityDissipation: FLUID.densityDissipation,
      velocityDissipation: FLUID.velocityDissipation,
      pressureIterations: FLUID.pressureIterations,
      interpolateSegments: true,
    })
    if (fluidReady) {
      fluidCanvasRef.value.style.opacity = '0'
      resizeObserver = new ResizeObserver(() => {
        fluid.resize()
        uploadMasthead()
      })
      resizeObserver.observe(fluidCanvasRef.value)
    }
  }

  await mastheadFont
  await document.fonts.ready
  layoutMasthead()
  nameChars = nameRef.value
    ? buildNameChars(nameRef.value)
    : []

  uploadMasthead()

  textResizeHandler = () => {
    layoutMasthead()
    uploadMasthead()
  }
  window.addEventListener('resize', textResizeHandler)
  document.fonts.ready.then(() => textResizeHandler?.())

  gsapCtx = gsapLib.context(() => {
    const taglineLines = taglineRef.value
      ? Array.from(taglineRef.value.querySelectorAll<HTMLElement>('.h4__tagline-line'))
      : []
    const metaBlocks = metaRef.value
      ? Array.from(metaRef.value.querySelectorAll<HTMLElement>('.h4__meta-block'))
      : []

    gsapLib.set(nameChars, { yPercent: 100, filter: 'blur(8px)' })
    gsapLib.set(taglineLines, { autoAlpha: 0, y: 16, filter: 'blur(10px)' })
    gsapLib.set(metaBlocks, { autoAlpha: 0 })
    gsapLib.set(
      [namesRef.value, taglineRef.value, metaRef.value].filter(Boolean),
      { autoAlpha: 1 },
    )

    const tl = gsapLib.timeline({
      defaults: { ease: 'expo.out' },
    })

    if (nameChars.length) {
      tl.to(nameChars, {
        yPercent: 0,
        filter: 'blur(0px)',
        duration: 1,
        stagger: 0.02,
        ease: 'power4.out',
      }, 0)
    }

    if (taglineLines.length) {
      tl.to(taglineLines, {
        autoAlpha: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.9,
        stagger: 0.12,
        ease: 'power3.out',
      }, 0.5)
    }

    metaBlocks.forEach((block, i) => {
      tl.to(block, { autoAlpha: 1, duration: 0.6, ease: 'power3.out' }, 1 + i * 0.09)
    })

    tl.call(() => {
      heroStage.startClock()
    }, [], 1)

    if (fluidReady && fluidCanvasRef.value)
      tl.to(fluidCanvasRef.value, { opacity: 1, duration: 0.6, ease: 'power3.out' }, 1.35)

    /* The DOM masthead only leaves once the fluid display can redraw it; without WebGL it stays. */
    if (fluidReady && namesRef.value) {
      tl.to(namesRef.value, { autoAlpha: 0, duration: 0.6, ease: 'power3.out' }, 1.40)
      tl.set(namesRef.value, { display: 'none' }, 2.15)
    }

    if (sectionRef.value) {
      const parallaxTargets = [taglineRef.value, metaRef.value, fluidCanvasRef.value].filter(Boolean)
      gsapLib.to(parallaxTargets, {
        yPercent: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.value,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.5,
        },
      })

      const fadeTrigger = () => ({
        trigger: sectionRef.value,
        start: 'top top',
        end: '50% top',
        scrub: true,
      })

      gsapLib.to(
        [taglineRef.value, metaRef.value].filter(Boolean),
        {
          opacity: 0,
          ease: 'none',
          scrollTrigger: fadeTrigger(),
        },
      )

      if (fluidCanvasRef.value) {
        gsapLib.fromTo(
          fluidCanvasRef.value,
          { opacity: 1 },
          {
            opacity: 0,
            ease: 'none',
            immediateRender: false,
            scrollTrigger: fadeTrigger(),
          },
        )
      }
    }
  })
})

onUnmounted(() => {
  gsapCtx?.revert()
  fluid.destroy()
  heroStage.destroy()
  resizeObserver?.disconnect()
  if (textResizeHandler)
    window.removeEventListener('resize', textResizeHandler)
})
</script>

<template>
  <section
    ref="sectionRef"
    class="h4-root bg-[#050507] h-[100dvh] w-full relative overflow-hidden"
    aria-label="Billy Maulana — Frontend Architect & Creative Developer"
  >
    <canvas
      ref="fluidCanvasRef"
      class="h4__fluid h-full w-full pointer-events-auto inset-0 absolute z-3 mix-blend-screen"
      aria-hidden="true"
    />

    <div class="h4__grain opacity-[0.07] pointer-events-none inset-0 absolute z-4 mix-blend-overlay" aria-hidden="true" />

    <div ref="namesRef" class="h4__names pointer-events-none inset-0 absolute z-5">
      <span ref="nameRef" class="h4__name">{{ MASTHEAD_TEXT }}</span>
      <h1 class="sr-only">
        Billy Maulana
      </h1>
    </div>

    <p ref="taglineRef" class="h4__tagline text-center pointer-events-none absolute z-6">
      <span class="h4__tagline-line"><em class="h4__tagline-voice">A Frontend Architect</em> crafting interfaces</span>
      <br aria-hidden="true">
      <span class="h4__tagline-line">that move millions of people.</span>
    </p>

    <div ref="metaRef" class="h4__meta flex pointer-events-none items-baseline justify-between absolute z-6">
      <p class="h4__meta-block h4__meta-clock">
        Bandung — {{ clockText }} GMT+7
      </p>
      <ul class="h4__meta-block h4__meta-socials" aria-label="Social links">
        <li v-for="social in SOCIAL_LINKS" :key="social.href">
          <a class="h4__meta-link" :href="social.href" target="_blank" rel="noopener noreferrer">{{ social.label }}</a>
        </li>
      </ul>
      <nav class="h4__meta-block h4__meta-nav" aria-label="Sections">
        <a class="h4__meta-link" href="#work">Work</a>
        <a class="h4__meta-link" href="#about">About</a>
        <a class="h4__meta-link" href="#contact">Contact</a>
      </nav>
    </div>
  </section>
</template>

<style>
.h4-root {
  --h4-pad: clamp(1.25rem, 3.2vw, 3rem);
}

.h4__grain {
  background-image: url('/assets/textures/grain.png');
  background-size: 200px 200px;
  background-repeat: repeat;
}

.h4__name {
  position: absolute;
  top: 0;
  left: 0;
  visibility: hidden;
  font-family: 'Bebas Neue', Impact, sans-serif;
  font-weight: 400;
  line-height: 1;
  color: #F2EFEA;
  white-space: nowrap;
}

.h4__name-char {
  display: inline-block;
  will-change: transform, filter, opacity;
}

.h4-root .sr-only {
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
}

.h4__tagline {
  top: clamp(1.25rem, 4vh, 1.75rem);
  left: var(--h4-pad);
  right: var(--h4-pad);
  margin-inline: auto;
  max-width: 45rem;
  text-wrap: balance;
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  font-size: clamp(1.0625rem, 1.9vw, 2.28rem);
  line-height: 1.3;
  letter-spacing: -0.02em;
  font-feature-settings: 'kern' 1, 'liga' 1;
  color: #F2EFEA;
}

.h4__tagline-line {
  display: inline-block;
}

.h4__tagline-voice {
  font-family: 'Apparel', Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: 1em;
}

.h4__meta {
  left: var(--h4-pad);
  right: var(--h4-pad);
  bottom: var(--h4-pad);
  font-family: 'Suisse', 'Helvetica Neue', Arial, sans-serif;
  font-weight: 400;
  font-size: 0.625rem;
  line-height: 1;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: rgba(242, 239, 234, 0.92);
  column-gap: 1rem;
}

.h4__meta-clock {
  flex: 1 1 0;
  font-variant-numeric: tabular-nums;
}

.h4__meta-socials {
  flex: 0 0 auto;
  display: flex;
  align-items: baseline;
  gap: 0.75em;
}

.h4__meta-socials li {
  display: flex;
  align-items: baseline;
  gap: 0.75em;
}

.h4__meta-socials li + li::before {
  content: '/';
  color: rgba(208, 208, 216, 0.3);
}

.h4__meta-nav {
  flex: 1 1 0;
  display: flex;
  align-items: baseline;
  justify-content: flex-end;
  gap: 1.1em;
}

.h4__meta-link {
  pointer-events: auto;
  position: relative;
  color: inherit;
  transition: color 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.h4__meta-link::after {
  content: '';
  position: absolute;
  inset: -0.5rem 0;
}

.h4__meta-link:hover {
  color: #F2EFEA;
}

@media (max-width: 767px) {
  .h4__meta-socials {
    display: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .h4__fluid {
    display: none;
  }
}
</style>
