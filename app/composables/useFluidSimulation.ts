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

export function useFluidSimulation() {
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
  let contentDisplayProgram: ProgramObj | null = null
  let contentTexture: TextureObj | null = null
  let pointerGate: ((u: number, v: number) => boolean) | null = null

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

  /* Display pass daspritam: velocity fluid men-displace konten (uv - vel*0.001)
     dan menggeser channel G/B (vel*0.003) untuk fringe chromatic. Channel R
     sengaja tidak digeser — persis source referensi */
  const contentDisplayShaderSource = `
    precision highp float;

    uniform sampler2D tMap;
    uniform sampler2D tFluid;
    varying vec2 vUv;

    void main() {
      vec3 fluid = texture2D(tFluid, vUv).rgb;
      vec2 uv = vUv;
      vec2 uv2 = vUv - fluid.rg * 0.001;

      vec4 color = texture2D(tMap, uv2);

      vec3 rgb = fluid * 0.003;

      color.g = texture2D(tMap, vec2(uv.x - rgb.x, uv.y + rgb.y)).g;
      color.b = texture2D(tMap, vec2(uv.x - rgb.x, uv.y + rgb.y)).b;

      gl_FragColor = color;
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
    const params: WebGLContextAttributes = { alpha: true, depth: false, stencil: false, antialias: false, preserveDrawingBuffer: false }

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
      ext: { formatRGBA, formatRG, formatR, halfFloatTexType, supportLinearFiltering },
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
    const width = target == null ? g.drawingBufferWidth : target.width
    const height = target == null ? g.drawingBufferHeight : target.height

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
    /* Paritas daspritam pada mode content: SATU splat penuh per event di
       posisi terkini — interpolasi sub-splat (dibuat untuk pita tinta
       visible) melipatgandakan coverage dye ~8x sehingga displacement
       membanjiri seluruh pita teks, bukan mengikuti jalur cursor */
    if (contentDisplayEnabled) {
      splat(seg.toX, seg.toY, seg.deltaX * config.SPLAT_FORCE, seg.deltaY * config.SPLAT_FORCE, seg.color)
      return
    }
    const dist = Math.hypot(seg.deltaX, seg.deltaY)
    const count = Math.max(1, Math.min(Math.ceil(dist / SPLAT_INTERP_SPACING), MAX_SPLATS_PER_SEGMENT))
    /* Momentum dibagi rata antar sub-splat: total energi per segmen setara
       satu splat penuh, meniru deposit per-event kecil milik daspritam */
    const dx = seg.deltaX * config.SPLAT_FORCE / count
    const dy = seg.deltaY * config.SPLAT_FORCE / count
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
  function emitSplat(x: number, y: number, dx: number, dy: number, brightness = 1) {
    const color = generateColor()
    color.r *= 14.0 * brightness
    color.g *= 14.0 * brightness
    color.b *= 14.0 * brightness
    splat(x, y, dx, dy, color)
  }

  function splat(x: number, y: number, dx: number, dy: number, color: FluidColor) {
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
      g.uniform3f(splatProgram!.uniforms.color!, dx, dy, 1.0)
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
  }

  function updatePointerMoveData(pointer: Pointer, posX: number, posY: number) {
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
    contentDisplay?: boolean
    pointerGate?: (u: number, v: number) => boolean
  }): boolean {
    canvas = canvasEl
    hueMin = options?.hueMin ?? 0
    hueMax = options?.hueMax ?? 1
    if (options?.curl !== undefined)
      config.CURL = options.curl
    if (options?.splatRadius !== undefined)
      config.SPLAT_RADIUS = options.splatRadius
    contentDisplayEnabled = options?.contentDisplay ?? false
    pointerGate = options?.pointerGate ?? null

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
      compileShader(gl.FRAGMENT_SHADER, advectionShaderSource, ext.supportLinearFiltering ? null : ['MANUAL_FILTERING']),
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
    pointerGate = null
    pointers.length = 0
    splatStack = []
    splatSegments.length = 0
  }

  return { init, resize, destroy, multipleSplats, emitSplat, setContentCanvas }
}
