<script setup lang="ts">
import { useFluidSimulation } from '~/composables/useFluidSimulation'
import { experiences, profile } from '~/constants/profile'

definePageMeta({
  standalone: true,
})

useSeoMeta({
  title: 'Explore — Concept 1',
  robots: 'noindex',
})

const FIELD_SRC = '/assets/images/concept-1/portrait-field.webp'
const AUX_SRC = '/assets/images/concept-1/portrait-matte.webp'

const GROUND = '#050507'
const BONE = '#E6DFD3'
const MAX_DPR = 2

interface MastStyle {
  family: string
  stretch: 'normal' | 'expanded'
  weights: number[]
  tracking: number[]
  wordGap: number
  leading: number
  overlap: number
  uppercase: boolean
  kern?: Record<string, number>
}

/* Three voices for the same composition. The default is Clash Display in caps; ?mast=archivo is
   the wide heavy grotesk from the blind font specimen at its 125% width, and ?mast=sans the
   condensed-caps wordmark the other hero routes already use. */
const MASTHEADS: Record<'display' | 'expanded' | 'condensed', MastStyle> = {
  display: {
    family: '\'Clash Display\', sans-serif',
    stretch: 'normal',
    weights: [600],
    tracking: [-0.0075],
    wordGap: 0.24,
    leading: 0.8,
    overlap: 0.82,
    uppercase: true,
    kern: { LY: -0.13, LA: 0.02 },
  },
  expanded: {
    family: '\'Archivo Variable\', \'Archivo\', sans-serif',
    stretch: 'expanded',
    weights: [800],
    tracking: [-0.02],
    wordGap: 0.28,
    leading: 0.92,
    overlap: 0.82,
    uppercase: true,
  },
  condensed: {
    family: '\'Bebas Neue\', Impact, sans-serif',
    stretch: 'normal',
    weights: [400],
    tracking: [-0.015],
    wordGap: 0,
    leading: 0.9,
    overlap: 0.6,
    uppercase: true,
  },
}

const MAST_PROBE_PX = 200

const WIDE_QUERY = '(min-width: 1024px) and (min-aspect-ratio: 5/4)'
const SILHOUETTE = {
  cols: 96,
  rows: 64,
  matte: 76,
  keep: 0.78,
  minScale: 0.6,
}

const ATMOSPHERE = [
  [0, 'rgb(58 26 158 / 26%)'],
  [0.46, 'rgb(15 10 114 / 14%)'],
  [1, 'rgb(5 5 7 / 0%)'],
] as const

const SCAN = {
  pitch: 4,
  bend: 40,
  duty: 0.56,
  gapDrop: 0.24,
}

/* The trail only reads as liquid while its motion and its ink die together, and that balance
   lives in the density/velocity pair below. Changing one without the other freezes the trail in
   place or lets it move after it has faded. */
const FLUID = {
  curl: 8,
  simResolution: 128,
  dyeResolution: 512,
  splatRadius: 0.3,
  splatForce: 7200,
  displace: 0.001,
  chromatic: 0.003,
  whiteCore: 0.95,
  densityDissipation: 1.8,
  velocityDissipation: 1.2,
  pressureIterations: 20,
}

/* The name sits on its own warp layer above the fluid, blended by difference, so ink passing
   behind a letter shows through it inverted instead of dissolving the letter. Radius is kept in
   cap heights so one line on a desktop and two stacked lines on a phone ripple at the same
   scale. */
const WARP = {
  pad: 0.18,
  radius: 0.36,
  intensity: 0.06,
  follow: 0.14,
  hoverFollow: 0.15,
  velocityGain: 8,
  velocityAttack: 0.3,
  velocityRelease: 0.05,
  velocityDecay: 0.45,
  rest: 0.002,
}

const KNOCKOUT_BLEED = 0.75
const KNOCKOUT_RING = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
  [0.7, 0.7],
  [-0.7, 0.7],
  [0.7, -0.7],
  [-0.7, -0.7],
] as const

const WARP_VERTEX = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const WARP_FRAGMENT = `#version 300 es
precision highp float;
in vec2 vUv;
uniform sampler2D uText;
uniform vec2 uMouse;
uniform vec2 uResolution;
uniform float uRadius;
uniform float uIntensity;
uniform float uTime;
uniform float uHover;
uniform float uVelocity;
out vec4 outColor;

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(dot(hash22(i), f), dot(hash22(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
    mix(dot(hash22(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)), dot(hash22(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.0 + vec2(100.0);
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = vUv;
  float velBoost = 1.0 + uVelocity * 2.0;
  float radius = uRadius * (1.0 + uVelocity * 0.4);

  vec2 diff = uv - uMouse;
  diff.x *= uResolution.x / uResolution.y;
  float dist = length(diff);

  float outer = smoothstep(radius * 1.5, radius * 0.3, dist) * uHover;
  float inner = pow(smoothstep(radius, 0.0, dist), 0.6) * uHover;
  float influence = mix(outer, inner, 0.6);

  vec2 flowDir = normalize(diff + 0.001);
  vec2 perpDir = vec2(-flowDir.y, flowDir.x);
  float swirlAngle = fbm(uv * 6.0 + uTime * 0.25) * 3.14159;
  vec2 swirlDir = vec2(cos(swirlAngle), sin(swirlAngle));
  float ripple = sin(dist * 12.0 - uTime * 3.0) * 0.08 * influence;
  vec2 turbulence = vec2(
    fbm(uv * 10.0 + uTime * 0.25),
    fbm(uv * 10.0 + uTime * 0.25 + 50.0)
  ) * 0.12 * influence;

  vec2 displacement = flowDir * influence * 0.12
    + perpDir * influence * 0.25
    + swirlDir * influence * 0.35
    + flowDir * ripple
    + turbulence;
  displacement *= uIntensity * velBoost;

  outColor = texture(uText, uv + displacement);
}`

const PORTRAIT_VERTEX = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`

const PORTRAIT_FRAGMENT = `#version 300 es
precision highp float;

uniform sampler2D uField;
uniform sampler2D uAux;
uniform vec2 uRes;
uniform float uDpr;
uniform float uPitch;
uniform float uBend;
uniform float uDuty;
uniform float uGapDrop;
uniform float uReveal;
uniform float uDevelop;

in vec2 vUv;
out vec4 outColor;

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

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

void main() {
  vec3 field = texture(uField, vUv).rgb;
  vec3 aux = texture(uAux, vUv).rgb;
  float lum = field.r;
  float depth = field.g;
  float matte = field.b;

  float skin = smoothstep(0.12, 0.70, aux.r);
  float hair = smoothstep(0.20, 0.80, aux.g) * (1.0 - skin);

  vec2 texel = 1.0 / vec2(textureSize(uField, 0));
  float lumSoft = lum * 2.0;
  lumSoft += texture(uField, vUv + texel * vec2(3.0, 0.0)).r + texture(uField, vUv - texel * vec2(3.0, 0.0)).r;
  lumSoft += texture(uField, vUv + texel * vec2(0.0, 3.0)).r + texture(uField, vUv - texel * vec2(0.0, 3.0)).r;
  lumSoft += texture(uField, vUv + texel * vec2(5.0, 5.0)).r + texture(uField, vUv - texel * vec2(5.0, 5.0)).r;
  lumSoft += texture(uField, vUv + texel * vec2(5.0, -5.0)).r + texture(uField, vUv - texel * vec2(5.0, -5.0)).r;
  lumSoft /= 10.0;
  float lumCalm = mix(lum, lumSoft, 0.35);

  float tSkin = 0.50 + 0.48 * smoothstep(0.10, 0.78, lum);
  float tHair = 0.25 + 0.47 * smoothstep(0.02, 0.40, lumCalm);
  float tBody = 0.18 + 0.40 * smoothstep(0.02, 0.55, lumCalm);
  float t = mix(mix(tBody, tHair, hair), tSkin, skin);

  vec2 px = vUv * uRes / uDpr;
  float y = px.y + (depth - 0.5) * uBend;
  float dist = abs(fract(y / uPitch) - 0.5) * uPitch;
  float halfWidth = uPitch * uDuty * 0.5;
  float aa = 0.6 / uDpr;
  float line = 1.0 - smoothstep(halfWidth - aa, halfWidth + aa, dist);

  float scanY = uReveal * 1.10 - 0.05;
  float age = scanY - vUv.y;
  float shown = smoothstep(0.0, 0.004, age);
  float developed = max(smoothstep(0.02, 0.42, age), uDevelop);
  float tNow = mix(0.10 + t * 0.26, t, developed);

  float grain = (hash(gl_FragCoord.xy) - 0.5) * 0.05 * smoothstep(0.08, 0.5, tNow);
  float tLine = clamp(tNow + grain, 0.0, 1.0);
  float tGap = clamp(tNow - uGapDrop * mix(1.6, 1.0, developed) + grain, 0.0, 1.0);
  vec3 color = mix(thermal(tGap), thermal(tLine), line);

  float alpha = smoothstep(0.44, 0.56, matte) * shown;
  float halo = smoothstep(0.10, 0.62, aux.b) * 0.12 * shown;
  vec3 haloColor = thermal(0.22 + 0.20 * developed);

  vec3 rgb = color * alpha + haloColor * halo * (1.0 - alpha);
  float a = alpha + halo * (1.0 - alpha);

  float headDist = age * uRes.y / uDpr / 2.2;
  float head = exp(-headDist * headDist) * step(0.001, uReveal) * step(uReveal, 0.999) * smoothstep(0.05, 0.5, aux.b);
  rgb += thermal(0.90) * head * 0.9;
  a = max(a, head * 0.9);

  outColor = vec4(rgb, a);
}`

interface MastChar {
  ch: string
  x: number
  y: number
  line: number
  weight: number
  tracking: number
}

interface MastMetrics {
  chars: MastChar[]
  lines: number
  inkWidth: number
  baseline: number
  capHeight: number
}

interface PortraitRenderer {
  gl: WebGL2RenderingContext
  uniforms: Record<string, WebGLUniformLocation | null>
}

interface NameWarp {
  gl: WebGL2RenderingContext
  texture: WebGLTexture
  uniforms: Record<string, WebGLUniformLocation | null>
}

interface WarpBox {
  left: number
  top: number
  width: number
  height: number
  pad: number
  cap: number
  fontSize: number
}

const route = useRoute()
const MAST_QUERY: Record<string, keyof typeof MASTHEADS> = {
  sans: 'condensed',
  archivo: 'expanded',
}
const mastStyle = MASTHEADS[MAST_QUERY[String(route.query.mast ?? '')] ?? 'display']
const mastWords = profile.name.split(' ').map(word => mastStyle.uppercase
  ? word.toUpperCase()
  : word)
const mastVars = {
  '--c1-mast-family': mastStyle.family,
  '--c1-mast-stretch': mastStyle.stretch,
  '--c1-leading': `${mastStyle.leading}`,
  '--c1-overlap': `${mastStyle.overlap}`,
}

const rootRef = ref<HTMLElement>()
const clipRef = ref<HTMLElement>()
const portraitRef = ref<HTMLCanvasElement>()
const stageRef = ref<HTMLCanvasElement>()
const warpRef = ref<HTMLCanvasElement>()
const ledeProbeRef = ref<HTMLElement>()
const atmosRef = ref<HTMLElement>()

const mast = shallowRef<MastMetrics | null>(null)
const clock = ref('')
const isArmed = ref(false)
const isLive = ref(false)
const isStatic = ref(false)

const links = [
  { label: 'GitHub', href: profile.github },
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'Instagram', href: profile.instagram },
]

interface LedeLine {
  text: string
  indent: number
}

const sentences = profile.tagline.match(/[^.!?]+[.!?]+/g)?.map(sentence => sentence.trim()) ?? [profile.tagline]
const ledeTail = profile.tagline.split(' ').slice(-2).join(' ')
const ledeLines = ref<LedeLine[]>(sentences.map(text => ({ text, indent: 0 })))
/* The source copy is typed with straight apostrophes and plain spaces; a figure must also never
   be separated from the word it counts by a line break. */
function typeset(text: string): string {
  return text.replaceAll('\'', '\u2019').replace(/(\d[\dM]*\+?) /g, '$1\u00A0')
}

const proof = typeset(`${profile.bio.split('\n\n')[1]?.split('. ').slice(0, 2).join('. ') ?? ''}.`)
const tally = typeset(`${profile.yearsExperience}+ years, ${profile.companiesCount} companies`)

const rows = experiences.map(item => ({
  years: item.endYear === item.startYear
    ? `${item.startYear}`
    : `${item.startYear}–${item.endYear ?? 'Now'}`,
  company: item.company,
  role: item.role,
  current: item.endYear === null,
}))

const fluid = useFluidSimulation()
const portraitState = { reveal: 0, develop: 0 }

let renderer: PortraitRenderer | null = null
let warp: NameWarp | null = null
let warpFrame = 0
let warpStart = 0
const warpPointer = {
  x: 0.5,
  y: 0.5,
  smoothX: 0.5,
  smoothY: 0.5,
  inside: false,
  hover: 0,
  velocity: 0,
  dx: 0,
  dy: 0,
  atRest: false,
}
let contentCanvas: HTMLCanvasElement | null = null
let resizeObserver: ResizeObserver | null = null
let layoutFrame = 0
let clockTimer = 0
let disposed = false
let fluidReady = false
let revertIntro: (() => void) | null = null
let wideQuery: MediaQueryList | null = null
let silhouette: number[] | null = null

/* The reveal needs one mask per rendered line, and only the browser knows where a balanced
   sentence breaks. A hidden twin with the same styles is read back word by word. Italic glyphs
   also start left or right of their advance box by several pixels at this size, so each line is
   shifted until its ink, not its box, sits on the column edge. */
function measureLede() {
  const probe = ledeProbeRef.value
  if (!probe)
    return
  const style = getComputedStyle(probe)
  const fontSize = Number.parseFloat(style.fontSize)
  const ctx = document.createElement('canvas').getContext('2d')!
  ctx.font = `${style.fontStyle} ${style.fontWeight} ${fontSize}px ${style.fontFamily}`
  const range = document.createRange()
  const lines: LedeLine[] = []
  for (const block of probe.children) {
    const node = block.firstChild
    if (!node || node.nodeType !== Node.TEXT_NODE)
      continue
    let lastTop = Number.NaN
    for (const match of (node.nodeValue ?? '').matchAll(/\S+/g)) {
      range.setStart(node, match.index)
      range.setEnd(node, match.index + match[0].length)
      const top = Math.round(range.getBoundingClientRect().top)
      if (top !== lastTop) {
        lines.push({ text: match[0], indent: ctx.measureText(match[0][0]!).actualBoundingBoxLeft / fontSize })
        lastTop = top
      }
      else {
        lines[lines.length - 1]!.text += ` ${match[0]}`
      }
    }
  }
  const signature = (list: LedeLine[]) => list.map(line => `${line.text}:${line.indent.toFixed(3)}`).join('|')
  if (lines.length && signature(lines) !== signature(ledeLines.value))
    ledeLines.value = lines
}

function tickClock() {
  clock.value = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Jakarta',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date())
}

/* Splitting a word into one box per letter drops its kerning pairs, and the canvas raster would
   then disagree with the DOM by a few pixels per pair. Reading every glyph's offset from the
   shaped, unsplit word gives both renderers the same positions. */
function mastFont(weight: number, px: number) {
  return `${weight} ${mastStyle.stretch} ${px}px ${mastStyle.family}`
}

/* Canvas drops the width keyword from the font shorthand in some engines, so the property is set
   on its own as well; without it the probe measures the 100% cut while the DOM draws the 125%. */
function setMastFont(ctx: CanvasRenderingContext2D, weight: number, px: number) {
  ctx.font = mastFont(weight, px)
  if ('fontStretch' in ctx)
    ctx.fontStretch = mastStyle.stretch
}

function measureMasthead(root: HTMLElement, words: string[], stacked: boolean): MastMetrics {
  const ctx = document.createElement('canvas').getContext('2d')!
  const parts = words.map((word, index) => {
    const weight = mastStyle.weights[index % mastStyle.weights.length]!
    const tracking = mastStyle.tracking[index % mastStyle.tracking.length]!
    const probe = document.createElement('span')
    probe.textContent = word
    Object.assign(probe.style, {
      position: 'absolute',
      left: '0',
      top: '0',
      visibility: 'hidden',
      whiteSpace: 'pre',
      fontFamily: mastStyle.family,
      fontStretch: mastStyle.stretch,
      fontWeight: `${weight}`,
      fontSize: `${MAST_PROBE_PX}px`,
      lineHeight: `${mastStyle.leading}`,
      letterSpacing: `${tracking}em`,
    })
    const strut = document.createElement('span')
    Object.assign(strut.style, { display: 'inline-block', width: '0', height: '0' })
    probe.appendChild(strut)
    root.appendChild(probe)

    const node = probe.firstChild as Text
    const box = probe.getBoundingClientRect()
    const range = document.createRange()
    const offsets: number[] = []
    let kerned = 0
    for (let i = 0; i < word.length; i++) {
      if (i > 0)
        kerned += mastStyle.kern?.[word[i - 1]! + word[i]!] ?? 0
      range.setStart(node, i)
      range.setEnd(node, i + 1)
      offsets.push((range.getBoundingClientRect().left - box.left) / MAST_PROBE_PX + kerned)
    }
    const advance = box.width / MAST_PROBE_PX + kerned
    const baseline = (strut.getBoundingClientRect().bottom - box.top) / MAST_PROBE_PX
    probe.remove()

    setMastFont(ctx, weight, MAST_PROBE_PX)
    const first = ctx.measureText(word[0]!)
    const last = ctx.measureText(word[word.length - 1]!)
    return {
      word,
      weight,
      tracking,
      offsets,
      advance,
      baseline,
      inkLeft: offsets[0]! - first.actualBoundingBoxLeft / MAST_PROBE_PX,
      inkRight: offsets[offsets.length - 1]! + last.actualBoundingBoxRight / MAST_PROBE_PX,
      capHeight: ctx.measureText('H').actualBoundingBoxAscent / MAST_PROBE_PX,
    }
  })

  /* Two cuts of one family can still disagree on ascent, which would put their baselines a pixel
     apart once each letter sits in its own line box. Every line is also shifted so its ink, not
     its advance box, starts on the margin. */
  const baseline = Math.max(...parts.map(part => part.baseline))
  const chars: MastChar[] = []
  let inkWidth = 0
  let cursor = 0
  parts.forEach((part, index) => {
    const line = stacked ? index : 0
    const origin = stacked || index === 0
      ? -part.inkLeft
      : cursor
    for (let i = 0; i < part.word.length; i++) {
      chars.push({
        ch: part.word[i]!,
        x: origin + part.offsets[i]!,
        y: line * mastStyle.leading + baseline - part.baseline,
        line,
        weight: part.weight,
        tracking: part.tracking,
      })
    }
    inkWidth = Math.max(inkWidth, origin + part.inkRight)
    cursor = origin + part.advance + mastStyle.wordGap
  })

  return {
    chars,
    lines: stacked ? parts.length : 1,
    inkWidth,
    baseline,
    capHeight: parts[0]!.capHeight,
  }
}

function compile(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
    throw new Error(gl.getShaderInfoLog(shader) ?? 'shader compile failed')
  return shader
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image()
  image.decoding = 'async'
  image.src = src
  await image.decode()
  return image
}

function uploadTexture(gl: WebGL2RenderingContext, unit: number, image: HTMLImageElement) {
  const texture = gl.createTexture()
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
}

function traceSilhouette(image: HTMLImageElement): number[] {
  const canvas = document.createElement('canvas')
  canvas.width = SILHOUETTE.cols
  canvas.height = SILHOUETTE.rows
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const edges: number[] = []
  for (let row = 0; row < canvas.height; row++) {
    let col = 0
    while (col < canvas.width && data[(row * canvas.width + col) * 4 + 2]! < SILHOUETTE.matte)
      col++
    edges.push(col / canvas.width)
  }
  return edges
}

/* The portrait is sized from the viewport height and the text columns from its width, so on
   squarer screens the hair reaches into the copy. The image box says nothing about that: the
   silhouette's left edge wanders across nearly half of it. Each line of text is therefore tested
   against the outline at its own height. Beside the masthead the portrait has to keep its top on
   the letters, so it slides off the right edge instead, stopping while the face is still in frame.
   Stacked, it hangs from the bottom-right corner and can simply shrink towards it. */
function fitPortrait() {
  const root = rootRef.value
  const canvas = portraitRef.value
  const edges = silhouette
  if (!root || !canvas || !edges)
    return
  root.style.setProperty('--c1-portrait-shift', '0px')
  root.style.setProperty('--c1-portrait-scale', '1')
  const frame = root.getBoundingClientRect()
  const box = canvas.getBoundingClientRect()
  const radius = Number.parseFloat(getComputedStyle(root).getPropertyValue('--c1-gutter'))
  const range = document.createRange()
  const lines: { top: number, bottom: number, right: number }[] = []
  for (const mask of root.querySelectorAll<HTMLElement>('.c1-ui .c1-mask')) {
    const band = mask.getBoundingClientRect()
    if (!band.height || !mask.firstElementChild)
      continue
    range.selectNodeContents(mask.firstElementChild)
    lines.push({ top: band.top, bottom: band.bottom, right: range.getBoundingClientRect().right })
  }

  /* Hair hangs diagonally over the copy, so the clearance is a radius of one gutter around the
     end of each line, not a margin on both axes: a margin calls an outline a gutter up and a
     gutter across a collision and shrinks the portrait by a third on a phone. */
  function intrusion(left: number, top: number, width: number, height: number): number {
    const rows = edges!.length
    let worst = 0
    for (const line of lines) {
      const from = Math.max(0, Math.floor((line.top - radius - top) / height * rows))
      const to = Math.min(rows - 1, Math.floor((line.bottom + radius - top) / height * rows))
      for (let row = from; row <= to; row++) {
        const rowTop = top + row / rows * height
        const away = Math.max(line.top - (rowTop + height / rows), 0, rowTop - line.bottom)
        if (away < radius)
          worst = Math.max(worst, line.right + Math.sqrt(radius * radius - away * away) - (left + edges![row]! * width))
      }
    }
    return worst
  }

  if (wideQuery?.matches ?? true) {
    const limit = Math.max(0, frame.right - box.left - box.width * SILHOUETTE.keep)
    const shift = Math.min(intrusion(box.left, box.top, box.width, box.height), limit)
    root.style.setProperty('--c1-portrait-shift', `${shift.toFixed(1)}px`)
    return
  }

  let scale = 1
  while (scale > SILHOUETTE.minScale && intrusion(
    frame.right - (frame.right - box.left) * scale,
    frame.bottom - (frame.bottom - box.top) * scale,
    box.width * scale,
    box.height * scale,
  ) > 0) {
    scale -= 0.02
  }
  root.style.setProperty('--c1-portrait-scale', scale.toFixed(2))
}

async function createPortrait(canvas: HTMLCanvasElement): Promise<PortraitRenderer | null> {
  const gl = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false })
  if (!gl)
    return null

  const [field, aux] = await Promise.all([
    loadImage(FIELD_SRC),
    loadImage(AUX_SRC),
  ])
  silhouette = traceSilhouette(field)

  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, PORTRAIT_VERTEX))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, PORTRAIT_FRAGMENT))
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  uploadTexture(gl, 0, field)
  uploadTexture(gl, 1, aux)

  const names = [
    'uField',
    'uAux',
    'uRes',
    'uDpr',
    'uPitch',
    'uBend',
    'uDuty',
    'uGapDrop',
    'uReveal',
    'uDevelop',
  ]
  const uniforms: Record<string, WebGLUniformLocation | null> = {}
  for (const name of names)
    uniforms[name] = gl.getUniformLocation(program, name)

  gl.uniform1i(uniforms.uField!, 0)
  gl.uniform1i(uniforms.uAux!, 1)

  return { gl, uniforms }
}

function renderPortrait() {
  const canvas = portraitRef.value
  if (!renderer || !canvas)
    return
  const { gl, uniforms } = renderer
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(1, Math.round(rect.width * dpr))
  const height = Math.max(1, Math.round(rect.height * dpr))
  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }
  gl.viewport(0, 0, width, height)
  gl.uniform2f(uniforms.uRes!, width, height)
  gl.uniform1f(uniforms.uDpr!, dpr)
  gl.uniform1f(uniforms.uPitch!, SCAN.pitch)
  gl.uniform1f(uniforms.uBend!, SCAN.bend)
  gl.uniform1f(uniforms.uDuty!, SCAN.duty)
  gl.uniform1f(uniforms.uGapDrop!, SCAN.gapDrop)
  gl.uniform1f(uniforms.uReveal!, portraitState.reveal)
  gl.uniform1f(uniforms.uDevelop!, portraitState.develop)
  gl.clearColor(0, 0, 0, 0)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function measureWarpBox(): WarpBox | null {
  const root = rootRef.value
  const clip = clipRef.value
  const metrics = mast.value
  if (!root || !clip || !metrics)
    return null
  const frame = root.getBoundingClientRect()
  const clipBox = clip.getBoundingClientRect()
  const fontSize = Number.parseFloat(getComputedStyle(clip).fontSize)
  const pad = Math.round(WARP.pad * fontSize)
  return {
    left: clipBox.left - frame.left - pad,
    top: clipBox.top - frame.top - pad,
    width: clipBox.width + pad * 2,
    height: clipBox.height + pad * 2,
    pad,
    cap: metrics.capHeight * fontSize,
    fontSize,
  }
}

function rasterizeName(box: WarpBox, dpr: number, fill: string): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(box.width * dpr)
  canvas.height = Math.round(box.height * dpr)
  const metrics = mast.value
  if (!metrics)
    return canvas
  const ctx = canvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.textBaseline = 'alphabetic'
  ctx.fillStyle = fill
  for (const char of metrics.chars) {
    setMastFont(ctx, char.weight, box.fontSize)
    ctx.fillText(char.ch, box.pad + char.x * box.fontSize, box.pad + (char.line * mastStyle.leading + metrics.baseline) * box.fontSize)
  }
  return canvas
}

function createNameWarp(canvas: HTMLCanvasElement): NameWarp | null {
  const gl = canvas.getContext('webgl2', {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    depth: false,
    stencil: false,
  })
  if (!gl)
    return null

  const program = gl.createProgram()!
  gl.attachShader(program, compile(gl, gl.VERTEX_SHADER, WARP_VERTEX))
  gl.attachShader(program, compile(gl, gl.FRAGMENT_SHADER, WARP_FRAGMENT))
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    throw new Error(gl.getProgramInfoLog(program) ?? 'program link failed')
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)

  const texture = gl.createTexture()!
  gl.activeTexture(gl.TEXTURE0)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

  const uniforms: Record<string, WebGLUniformLocation | null> = {}
  for (const name of [
    'uText',
    'uMouse',
    'uResolution',
    'uRadius',
    'uIntensity',
    'uTime',
    'uHover',
    'uVelocity',
  ])
    uniforms[name] = gl.getUniformLocation(program, name)
  gl.uniform1i(uniforms.uText!, 0)
  gl.uniform1f(uniforms.uIntensity!, WARP.intensity)
  gl.clearColor(0, 0, 0, 0)

  return { gl, texture, uniforms }
}

function placeWarp() {
  const canvas = warpRef.value
  const box = measureWarpBox()
  if (!canvas || !warp || !box)
    return
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  canvas.style.left = `${box.left}px`
  canvas.style.top = `${box.top}px`
  canvas.style.width = `${box.width}px`
  canvas.style.height = `${box.height}px`
  canvas.width = Math.round(box.width * dpr)
  canvas.height = Math.round(box.height * dpr)

  const { gl, texture, uniforms } = warp
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, rasterizeName(box, dpr, BONE))
  gl.viewport(0, 0, canvas.width, canvas.height)
  gl.uniform2f(uniforms.uResolution!, canvas.width, canvas.height)
  gl.uniform1f(uniforms.uRadius!, WARP.radius * box.cap / box.height)
  warpPointer.atRest = false
}

function renderWarp(now: number) {
  warpFrame = requestAnimationFrame(renderWarp)
  if (!warp)
    return
  const p = warpPointer
  p.smoothX += (p.x - p.smoothX) * WARP.follow
  p.smoothY += (p.y - p.smoothY) * WARP.follow
  p.hover += ((p.inside ? 1 : 0) - p.hover) * WARP.hoverFollow
  const target = Math.min(Math.hypot(p.dx, p.dy) * WARP.velocityGain, 1)
  p.velocity += (target - p.velocity) * (target > p.velocity
    ? WARP.velocityAttack
    : WARP.velocityRelease)
  p.dx *= WARP.velocityDecay
  p.dy *= WARP.velocityDecay

  /* At rest the warp is the identity, so once one undistorted frame is on screen the loop keeps
     tracking the pointer without spending a draw on a picture that cannot change. */
  if (p.hover < WARP.rest) {
    if (p.atRest)
      return
    p.hover = 0
    p.atRest = true
  }
  else {
    p.atRest = false
  }

  const { gl, uniforms } = warp
  gl.uniform2f(uniforms.uMouse!, p.smoothX, p.smoothY)
  gl.uniform1f(uniforms.uTime!, (now - warpStart) / 1000)
  gl.uniform1f(uniforms.uHover!, p.hover)
  gl.uniform1f(uniforms.uVelocity!, p.velocity)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

function onWarpPointer(event: PointerEvent) {
  const canvas = warpRef.value
  if (!canvas)
    return
  const rect = canvas.getBoundingClientRect()
  const x = (event.clientX - rect.left) / rect.width
  const y = 1 - (event.clientY - rect.top) / rect.height
  const p = warpPointer
  p.dx = x - p.x
  p.dy = y - p.y
  p.x = x
  p.y = y
  p.inside = x >= 0 && x <= 1 && y >= 0 && y <= 1
}

/* A lifted finger leaves its last position behind; without releasing it the ripple would keep
   running under a point nobody is touching. */
function onWarpRelease(event: PointerEvent) {
  if (event.type === 'pointerleave' || event.pointerType !== 'mouse')
    warpPointer.inside = false
}

function startWarp() {
  const canvas = warpRef.value
  if (warp || !canvas)
    return
  try {
    warp = createNameWarp(canvas)
  }
  catch {
    warp = null
  }
  if (!warp)
    return
  warpStart = performance.now()
  warpFrame = requestAnimationFrame(renderWarp)
  window.addEventListener('pointermove', onWarpPointer, { passive: true })
  window.addEventListener('pointerup', onWarpRelease, { passive: true })
  window.addEventListener('pointercancel', onWarpRelease, { passive: true })
  document.documentElement.addEventListener('pointerleave', onWarpRelease, { passive: true })
}

function stopWarp() {
  cancelAnimationFrame(warpFrame)
  window.removeEventListener('pointermove', onWarpPointer)
  window.removeEventListener('pointerup', onWarpRelease)
  window.removeEventListener('pointercancel', onWarpRelease)
  document.documentElement.removeEventListener('pointerleave', onWarpRelease)
  warp?.gl.getExtension('WEBGL_lose_context')?.loseContext()
  warp = null
}

/* The fluid pass only displaces a texture, so the poster it liquefies has to exist as one raster:
   ground and portrait flattened in the order the DOM stacks them. The name is cut out of that
   plate in black, because the warp layer blends by difference and anything warm left behind a
   letter would tint it at rest; the fluid still carries ink through the cut. Without a warp layer
   the name is painted into the plate instead, as the only place it can still be seen. */
function composeContent(): HTMLCanvasElement | null {
  const root = rootRef.value
  const clip = clipRef.value
  const portrait = portraitRef.value
  const metrics = mast.value
  if (!root || !clip || !metrics)
    return null

  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR)
  const frame = root.getBoundingClientRect()
  contentCanvas ??= document.createElement('canvas')
  contentCanvas.width = Math.round(frame.width * dpr)
  contentCanvas.height = Math.round(frame.height * dpr)

  const ctx = contentCanvas.getContext('2d')!
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.fillStyle = GROUND
  ctx.fillRect(0, 0, frame.width, frame.height)

  const atmos = atmosRef.value?.getBoundingClientRect()
  if (atmos) {
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
    for (const [stop, color] of ATMOSPHERE)
      gradient.addColorStop(stop, color)
    ctx.save()
    ctx.translate(atmos.left - frame.left + atmos.width / 2, atmos.top - frame.top + atmos.height / 2)
    ctx.scale(atmos.width / 2, atmos.height / 2)
    ctx.fillStyle = gradient
    ctx.fillRect(-1, -1, 2, 2)
    ctx.restore()
  }

  const name = measureWarpBox()
  if (name && !warp)
    ctx.drawImage(rasterizeName(name, dpr, BONE), name.left, name.top, name.width, name.height)

  if (renderer && portrait) {
    renderPortrait()
    const box = portrait.getBoundingClientRect()
    ctx.drawImage(portrait, box.left - frame.left, box.top - frame.top, box.width, box.height)
  }

  if (name && warp) {
    const cut = rasterizeName(name, dpr, '#000000')
    for (const [dx, dy] of KNOCKOUT_RING)
      ctx.drawImage(cut, name.left + dx * KNOCKOUT_BLEED, name.top + dy * KNOCKOUT_BLEED, name.width, name.height)
  }

  return contentCanvas
}

function goLive() {
  if (!fluidReady || disposed)
    return
  startWarp()
  const content = composeContent()
  if (!content)
    return
  fluid.resize()
  fluid.setContentCanvas(content)
  placeWarp()
  isLive.value = true
}

function showStatic() {
  portraitState.reveal = 1
  portraitState.develop = 1
  renderPortrait()
  isStatic.value = true
}

function layoutMasthead() {
  const root = rootRef.value
  if (!root)
    return
  const stacked = !(wideQuery?.matches ?? true)
  if (mast.value && (mast.value.lines > 1) === stacked)
    return
  const metrics = measureMasthead(root, mastWords, stacked)
  mast.value = metrics
  root.style.setProperty('--c1-fit', metrics.inkWidth.toFixed(4))
  root.style.setProperty('--c1-lines', `${metrics.lines}`)
  root.style.setProperty('--c1-baseline', metrics.baseline.toFixed(4))
  root.style.setProperty('--c1-cap', metrics.capHeight.toFixed(4))
}

function scheduleLayout() {
  cancelAnimationFrame(layoutFrame)
  layoutFrame = requestAnimationFrame(async () => {
    if (disposed)
      return
    const lines = mast.value?.lines
    layoutMasthead()
    if (mast.value?.lines !== lines)
      await nextTick()
    measureLede()
    await nextTick()
    if (disposed)
      return
    fitPortrait()
    if (isLive.value)
      goLive()
    else
      renderPortrait()
  })
}

async function runIntro(root: HTMLElement) {
  const { default: gsap } = await import('gsap')
  if (disposed)
    return

  const context = gsap.context(() => {
    const chars = root.querySelectorAll<HTMLElement>('.c1-ch')
    const ledeRises = root.querySelectorAll<HTMLElement>('[data-rise="lede"]')
    const rises = root.querySelectorAll<HTMLElement>('[data-rise=""]')
    const strokes = root.querySelectorAll<SVGPathElement>('[data-stroke]')
    const scale = root.querySelector<HTMLElement>('.c1-scale')
    const rules = root.querySelectorAll<HTMLElement>('.c1-row')
    const atmos = atmosRef.value

    gsap.set(chars, { yPercent: 112 })
    gsap.set(rules, { '--c1-rule': 0 })
    gsap.set([
      ...ledeRises,
      ...rises,
    ], { yPercent: 105 })
    gsap.set(strokes, { strokeDashoffset: 1 })
    if (scale)
      gsap.set(scale, { scaleY: 0 })
    if (atmos)
      gsap.set(atmos, { opacity: 0 })
    isArmed.value = true

    const timeline = gsap.timeline()

    timeline.to(chars, {
      yPercent: 0,
      duration: 1.1,
      stagger: 0.03,
      ease: 'power4.out',
    }, 0.1)
    if (atmos)
      timeline.to(atmos, { opacity: 1, duration: 1.6, ease: 'power3.out' }, 0.35)
    timeline.to(portraitState, {
      reveal: 1,
      duration: 1.6,
      ease: 'expo.inOut',
      onUpdate: renderPortrait,
    }, 0.35)
    timeline.to(portraitState, {
      develop: 1,
      duration: 1.1,
      ease: 'power3.out',
      onUpdate: renderPortrait,
    }, 1.35)
    timeline.to(ledeRises, {
      yPercent: 0,
      duration: 0.9,
      stagger: 0.08,
      ease: 'power3.out',
    }, 0.9)
    timeline.to(rises, {
      yPercent: 0,
      duration: 0.7,
      stagger: 0.04,
      ease: 'power3.out',
    }, 1.2)
    if (scale)
      timeline.to(scale, { scaleY: 1, duration: 1, ease: 'expo.inOut' }, 1.2)
    timeline.to(rules, {
      '--c1-rule': 1,
      'duration': 0.9,
      'stagger': 0.05,
      'ease': 'expo.inOut',
    }, 1.2)
    timeline.to(strokes, {
      strokeDashoffset: 0,
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.inOut',
    }, 1.7)
    timeline.call(goLive, undefined, 2.45)
  }, root)

  revertIntro = () => context.revert()
}

onMounted(async () => {
  const root = rootRef.value
  if (!root)
    return

  tickClock()
  clockTimer = window.setInterval(tickClock, 1000)

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  await Promise.all(mastStyle.weights.map(weight => document.fonts.load(mastFont(weight, MAST_PROBE_PX), mastWords.join('')))).catch(() => [])
  if (disposed)
    return

  wideQuery = window.matchMedia(WIDE_QUERY)
  layoutMasthead()
  await nextTick()

  try {
    renderer = portraitRef.value
      ? await createPortrait(portraitRef.value)
      : null
  }
  catch {
    renderer = null
  }
  if (disposed)
    return

  resizeObserver = new ResizeObserver(scheduleLayout)
  resizeObserver.observe(root)

  if (reduced) {
    await document.fonts.ready
    measureLede()
    await nextTick()
    fitPortrait()
    showStatic()
    return
  }

  if (stageRef.value) {
    fluidReady = fluid.init(stageRef.value, {
      skipInitialSplats: true,
      contentDisplay: true,
      displayMode: 'thermal',
      interpolateSegments: true,
      ...FLUID,
    })
  }

  await document.fonts.ready
  if (disposed)
    return
  measureLede()
  await nextTick()
  fitPortrait()

  try {
    await runIntro(root)
  }
  catch {
    showStatic()
  }
})

onUnmounted(() => {
  disposed = true
  window.clearInterval(clockTimer)
  cancelAnimationFrame(layoutFrame)
  resizeObserver?.disconnect()
  revertIntro?.()
  stopWarp()
  fluid.destroy()
  renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext()
  renderer = null
})
</script>

<template>
  <main
    id="main"
    ref="rootRef"
    class="c1"
    :class="{ 'is-armed': isArmed, 'is-live': isLive, 'is-static': isStatic }"
    :style="mastVars"
  >
    <h1 class="c1-mast" :aria-label="profile.name">
      <span ref="clipRef" class="c1-mast-clip" aria-hidden="true">
        <template v-if="mast">
          <span
            v-for="(char, index) in mast.chars"
            :key="index"
            class="c1-ch"
            :style="{ left: `${char.x}em`, top: `${char.y}em`, fontWeight: char.weight, letterSpacing: `${char.tracking}em` }"
          >{{ char.ch }}</span>
        </template>
      </span>
    </h1>

    <div ref="atmosRef" class="c1-atmos" aria-hidden="true" />

    <div class="c1-portrait" aria-hidden="true">
      <canvas ref="portraitRef" />
    </div>

    <canvas ref="stageRef" class="c1-stage" aria-hidden="true" />

    <canvas ref="warpRef" class="c1-warp" aria-hidden="true" />

    <div class="c1-ui">
      <header class="c1-top">
        <p class="c1-meta">
          <span class="c1-mask"><span data-rise>{{ profile.title }}</span></span>
          <span class="c1-mask"><span data-rise class="c1-dim">{{ profile.location }}<span class="c1-wide"> — <time class="c1-num">{{ clock }}</time> GMT+7</span></span></span>
        </p>
        <nav class="c1-links" aria-label="Elsewhere">
          <a
            v-for="link in links"
            :key="link.label"
            class="c1-link"
            :href="link.href"
            target="_blank"
            rel="noopener noreferrer"
          ><span class="c1-mask"><span data-rise>{{ link.label }}</span></span></a>
        </nav>
      </header>

      <p class="c1-lede">
        <span class="c1-sr">{{ profile.tagline }}</span>
        <span
          v-for="(line, index) in ledeLines"
          :key="index"
          class="c1-mask"
          aria-hidden="true"
        >
          <span
            v-if="index === ledeLines.length - 1 && line.text.endsWith(ledeTail)"
            data-rise="lede"
            :style="{ marginLeft: `${line.indent}em` }"
          ><span class="c1-run">{{ line.text.slice(0, line.text.length - ledeTail.length) }}</span><span class="c1-run c1-under">{{ ledeTail }}<svg viewBox="0 0 200 12" preserveAspectRatio="none"><path d="M2 5.6C38 2.8 96 7.4 198 3.8M194 8.2C150 10.4 84 6.8 30 10" pathLength="1" data-stroke /></svg></span></span>
          <span v-else data-rise="lede" :style="{ marginLeft: `${line.indent}em` }">{{ line.text }}</span>
        </span>
      </p>
      <p ref="ledeProbeRef" class="c1-lede c1-lede-probe" aria-hidden="true">
        <span v-for="sentence in sentences" :key="sentence" class="c1-sentence">{{ sentence }}</span>
      </p>

      <p class="c1-proof">
        <span class="c1-mask"><span data-rise>{{ proof }}</span></span>
      </p>

      <section class="c1-index" aria-label="Experience">
        <p class="c1-caption">
          <span class="c1-mask"><span data-rise>Experience</span></span>
          <span class="c1-mask c1-wide"><span data-rise class="c1-dim c1-num">{{ tally }}</span></span>
        </p>
        <div class="c1-rows">
          <span class="c1-scale" aria-hidden="true" />
          <ol class="c1-list">
            <li v-for="row in rows" :key="row.company" class="c1-row" :class="{ 'is-current': row.current }">
              <span class="c1-mask"><span data-rise class="c1-dim c1-num">{{ row.years }}</span></span>
              <svg
                v-if="row.current"
                class="c1-ring"
                viewBox="0 0 96 32"
                aria-hidden="true"
              >
                <path d="M6 5.2C10.5 3.2 20 2.6 33 2.3C50 1.9 70 1.8 82.5 3.2C90 4.1 93.7 9 93.3 15.2C92.9 21.7 89.6 26.3 81 26.5C61 27 36 26.5 16.5 26.8C8.6 27 3.6 22.9 3.8 17C4 10 7.8 5.5 17.5 5.3C23 5.1 28 3.9 33 0.8" pathLength="1" data-stroke />
              </svg>
              <span class="c1-mask"><span data-rise>{{ row.company }}</span></span>
              <span class="c1-mask c1-wide"><span data-rise class="c1-dim">{{ row.role }}</span></span>
            </li>
          </ol>
        </div>
      </section>
    </div>

    <div class="c1-grain" aria-hidden="true" />
  </main>
</template>

<style scoped>
.c1 {
  --c1-margin: 20px;
  --c1-gutter: 16px;
  --c1-fit: 8.2585;
  --c1-lines: 1;
  --c1-baseline: 0.72;
  --c1-cap: 0.67;
  --c1-mast-top: 104px;
  --c1-size-cap: 20svh;
  --c1-size: min(calc((100vw - 2 * var(--c1-margin)) / var(--c1-fit)), var(--c1-size-cap));
  --c1-leading: 0.8;
  --c1-overlap: 0.82;
  --c1-mast-height: calc(var(--c1-size) * (var(--c1-lines) * var(--c1-leading) + 0.08));
  --c1-portrait-scale: 1;
  --c1-portrait-height: calc(56svh * var(--c1-portrait-scale));
  --c1-portrait-sink: -0.138;
  --c1-portrait-width: calc(var(--c1-portrait-height) * 0.7422);
  --c1-portrait-right: calc(var(--c1-portrait-width) * -0.3);
  --c1-portrait-shift: 0px;
  --c1-ease: cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
  isolation: isolate;
  overflow: hidden;
  min-height: max(100svh, 640px);
  background: #050507;
  color: #e6dfd3;
  font-family: 'Switzer', sans-serif;
  font-size: 15px;
  font-weight: 400;
  line-height: 20px;
  letter-spacing: -0.01em;
}

.c1:not(.is-armed, .is-static) .c1-ch,
.c1:not(.is-armed, .is-static) .c1-scale,
.c1:not(.is-armed, .is-static) .c1-atmos,
.c1:not(.is-armed, .is-static) [data-rise],
.c1:not(.is-armed, .is-static) [data-stroke] {
  visibility: hidden;
}

[data-stroke] {
  fill: none;
  stroke: #b9b2a6;
  stroke-width: 1.2;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 1;
}

.c1-sr {
  position: absolute;
  overflow: hidden;
  width: 1px;
  height: 1px;
  clip-path: inset(50%);
  white-space: nowrap;
}

.c1-mast {
  position: absolute;
  z-index: 1;
  top: var(--c1-mast-top);
  left: var(--c1-margin);
  right: var(--c1-margin);
  margin: 0;
  font-family: var(--c1-mast-family, 'Clash Display', sans-serif);
  font-stretch: var(--c1-mast-stretch, normal);
  font-size: var(--c1-size);
  line-height: var(--c1-leading);
}

.c1-mast-clip {
  position: relative;
  display: block;
  overflow: hidden;
  height: calc((var(--c1-lines) * var(--c1-leading) + 0.08) * 1em);
}

.c1-ch {
  position: absolute;
  white-space: pre;
  will-change: transform;
}

.c1-atmos,
.c1-portrait {
  position: absolute;
  right: calc(var(--c1-portrait-right) - var(--c1-portrait-shift));
  bottom: calc(var(--c1-portrait-height) * var(--c1-portrait-sink));
  width: var(--c1-portrait-width);
  height: var(--c1-portrait-height);
  pointer-events: none;
}

.c1-atmos {
  z-index: 0;
  background: radial-gradient(closest-side, rgb(58 26 158 / 26%), rgb(15 10 114 / 14%) 46%, rgb(5 5 7 / 0%));
  transform: scale(1.9);
}

.c1-portrait {
  z-index: 2;
}

.c1-portrait canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.c1-stage {
  position: absolute;
  z-index: 3;
  inset: 0;
  display: block;
  width: 100%;
  height: 100%;
}

.c1-warp {
  position: absolute;
  z-index: 4;
  display: block;
  visibility: hidden;
  mix-blend-mode: difference;
  pointer-events: none;
}

.is-live .c1-warp {
  visibility: visible;
}

.is-live .c1-mast {
  color: transparent;
}

.is-live .c1-portrait {
  visibility: hidden;
}

.c1-ui {
  position: relative;
  z-index: 10;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: auto 1fr auto;
  gap: 12px var(--c1-gutter);
  min-height: max(100svh, 640px);
  padding: calc(var(--c1-mast-top) + var(--c1-mast-height) + clamp(20px, 3.4svh, 56px)) var(--c1-margin) 28px;
  pointer-events: none;
}

.c1-top {
  position: absolute;
  top: 28px;
  right: var(--c1-margin);
  left: var(--c1-margin);
  display: flex;
  gap: var(--c1-gutter);
  align-items: flex-start;
  justify-content: space-between;
}

.c1-meta,
.c1-caption {
  margin: 0;
  text-wrap: pretty;
}

.c1-meta {
  flex: none;
}

.c1-links {
  display: flex;
  gap: 20px;
}

.c1-link {
  position: relative;
  display: block;
  margin-block: -12px;
  padding-block: 12px;
  color: #8a857c;
  text-decoration: none;
  pointer-events: auto;
}

.c1-link::after {
  content: '';
  position: absolute;
  right: 0;
  bottom: 12px;
  left: 0;
  height: 1px;
  background: currentcolor;
  transform: scaleX(0);
  transform-origin: right center;
  transition: transform 0.6s var(--c1-ease);
}

.c1-link:hover::after,
.c1-link:focus-visible::after {
  transform: scaleX(1);
  transform-origin: left center;
}

.c1-link:focus-visible {
  outline: 1px solid currentcolor;
  outline-offset: 2px;
}

.c1-mask {
  display: block;
  overflow: hidden;
}

.c1-mask > span {
  display: block;
  will-change: transform;
}

.c1-wide,
.c1-mask.c1-wide {
  display: none;
}

.c1-dim {
  color: #8a857c;
}

.c1-num {
  font-variant-numeric: tabular-nums;
}

.c1-lede {
  position: relative;
  grid-column: 1 / -1;
  grid-row: 1;
  max-width: 12.5em;
  margin: 0;
  font-family: 'PP Editorial New', serif;
  font-size: 26px;
  line-height: 1.12;
  letter-spacing: -0.015em;
  text-wrap: balance;
}

.c1-lede .c1-mask {
  margin-inline: -0.12em;
  padding-inline: 0.12em;
}

.c1-lede-probe {
  visibility: hidden;
}

.c1-sentence {
  display: block;
  text-wrap: balance;
}

.c1-run {
  display: inline-block;
  white-space: pre;
}

.c1-under {
  position: relative;
}

.c1-under svg {
  position: absolute;
  bottom: -0.12em;
  left: 0;
  width: 100%;
  height: 0.3em;
  overflow: visible;
}

.c1-proof {
  display: none;
  grid-column: 1 / -1;
  max-width: 34ch;
  margin: 0;
  color: #8a857c;
  text-wrap: pretty;
}

.c1-index {
  grid-column: 1 / -1;
  grid-row: 3;
  width: fit-content;
}

.c1-caption {
  display: flex;
  gap: 16px;
  justify-content: space-between;
  padding-bottom: 12px;
}

.c1-rows {
  position: relative;
  padding-left: 26px;
}

.c1-scale {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: linear-gradient(to bottom, #fff5b3, #f8bf27 14%, #ee8a2a 30%, #d45c6e 48%, #a32ba8 64%, #6b2fc8 80%, #0f0a72);
  transform-origin: center top;
}

.c1-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.c1-row {
  --c1-rule: 1;
  position: relative;
  display: grid;
  grid-template-columns: 9ch auto;
  column-gap: 16px;
  padding-block: 2px;
  text-wrap: pretty;
}

.c1-row::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -26px;
  width: 14px;
  height: 1px;
  background: rgb(230 223 211 / 40%);
  transform: scaleX(var(--c1-rule));
  transform-origin: left center;
}

.c1-row.is-current {
  padding-block: 6px;
}

.c1-row.is-current::after {
  content: none;
}

.c1-ring {
  position: absolute;
  top: 50%;
  left: -11px;
  width: 96px;
  height: 32px;
  margin-top: -16px;
  overflow: visible;
}

.c1-row > :last-child {
  text-align: right;
}

.c1-row + .c1-row::before {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  background: rgb(230 223 211 / 14%);
  transform: scaleX(var(--c1-rule));
  transform-origin: left center;
}

.c1-grain {
  position: absolute;
  z-index: 50;
  inset: 0;
  background: url('/assets/textures/grain-generated-film-1024.png') repeat;
  background-size: 512px;
  mix-blend-mode: screen;
  opacity: 0.08;
  filter: contrast(1.9) brightness(0.62);
  pointer-events: none;
}

@media (min-width: 768px) {
  .c1 {
    --c1-margin: 48px;
    --c1-gutter: 20px;
    --c1-portrait-height: calc(54svh * var(--c1-portrait-scale));
  }

  .c1-link {
    color: inherit;
  }

  .c1-rows {
    padding-left: 0;
  }

  .c1-scale {
    left: -14px;
  }

  .c1-row::after {
    left: -14px;
    width: 8px;
  }

  .c1-wide {
    display: inline;
  }

  .c1-mask.c1-wide {
    display: block;
  }

  .c1-ui {
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: auto 1fr auto auto;
    row-gap: 32px;
    padding-bottom: 36px;
  }

  .c1-meta {
    display: flex;
    gap: 16px;
  }

  .c1-links {
    gap: 24px;
  }

  .c1-lede {
    max-width: 14em;
    font-size: 40px;
    line-height: 1.08;
  }

  .c1-proof {
    display: block;
    grid-column: 1 / span 2;
    grid-row: 3;
  }

  .c1-index {
    grid-column: 1 / span 2;
    grid-row: 4;
    width: auto;
  }

  .c1-row {
    grid-template-columns: 9ch minmax(0, 1fr) auto;
  }
}

@media (min-width: 1024px) {
  .c1 {
    --c1-margin: 64px;
    --c1-gutter: 24px;
  }
}

@media (min-width: 1024px) and (min-aspect-ratio: 5/4) {
  .c1 {
    --c1-size-cap: 40svh;
    --c1-portrait-top: calc(var(--c1-mast-top) + var(--c1-size) * (var(--c1-baseline) - var(--c1-cap) * var(--c1-overlap)));
    --c1-portrait-height: calc((100svh - var(--c1-portrait-top)) * 1.26);
    --c1-portrait-sink: -0.2063;
    --c1-portrait-right: calc(var(--c1-size) * -0.3);
  }

  .c1-ui {
    grid-template-columns: repeat(6, minmax(0, 1fr));
    grid-template-rows: auto 1fr auto;
    row-gap: 16px;
  }

  .c1-lede {
    grid-column: 1 / span 4;
    max-width: 16em;
  }

  .c1-proof {
    grid-column: 1 / span 2;
    grid-row: 3;
    align-self: end;
    padding-bottom: 2px;
  }

  .c1-index {
    grid-column: 3 / span 2;
    grid-row: 3;
    align-self: end;
  }
}

@media (min-width: 1024px) and (min-aspect-ratio: 5/4) and (max-aspect-ratio: 3/2) {
  .c1-lede {
    max-width: 11em;
  }
}

@media (min-width: 1024px) and (max-width: 1151px) and (min-aspect-ratio: 5/4) {
  .c1-row .c1-mask.c1-wide {
    display: none;
  }
}

@media (min-width: 1440px) {
  .c1 {
    --c1-margin: 96px;
  }
}

@media (max-height: 639px) and (pointer: coarse) {
  .c1-stage {
    pointer-events: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .c1-link::after {
    transition: none;
  }
}
</style>
