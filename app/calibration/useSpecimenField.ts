const VERT = `#version 300 es
in vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }`

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform vec2 uMouse;
uniform float uVel;
uniform float uPulse;
out vec4 fragColor;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;

  vec2 m = uMouse;
  m.x *= uResolution.x / uResolution.y;
  float dm = distance(p, m);

  /* Domain warp mengikuti kecepatan kursor, bukan posisinya — field bereaksi pada gerakan. */
  vec2 warp = vec2(
    fbm(p * 2.4 + uTime * 0.035),
    fbm(p * 2.4 - uTime * 0.028 + 17.3)
  );
  p += (warp - 0.5) * (0.12 + uVel * 0.18) * smoothstep(0.9, 0.0, dm);

  float n = fbm(p * 3.1 + vec2(0.0, uTime * 0.035));

  float bands = fract(n * 9.0);
  float line = smoothstep(0.0, 0.06, bands) * smoothstep(0.12, 0.06, bands);

  vec2 c = vec2(0.5 * uResolution.x / uResolution.y, 0.5);
  float d = distance(p, c);

  /* Spesimen menempati sisi kiri, jadi field dimatikan di sana dan dibiarkan hidup di kanan.
     Mask radial tidak cocok untuk komposisi asimetris seperti ini. */
  float readMask = smoothstep(0.34, 0.82, uv.x);
  readMask = max(readMask, smoothstep(0.16, 0.0, uv.y) * 0.45);

  float wave = sin((d - uPulse * 1.4) * 22.0) * 0.5 + 0.5;
  wave *= smoothstep(1.0, 0.0, abs(d - uPulse * 1.4) * 3.2) * uPulse;

  float intensity = line * readMask * (0.2 + uVel * 0.34) + wave * readMask * 0.5;

  vec3 ink = vec3(0.0, 0.278, 1.0);
  vec3 col = ink * intensity;
  col += vec3(0.02) * readMask * line;

  fragColor = vec4(col, 1.0);
}`

export interface SpecimenField {
  mount: (canvas: HTMLCanvasElement) => void
  pulse: () => void
  destroy: () => void
}

export function useSpecimenField(): SpecimenField {
  let gl: WebGL2RenderingContext | null = null
  let program: WebGLProgram | null = null
  let raf = 0
  let canvasEl: HTMLCanvasElement | null = null
  const loc: Record<string, WebGLUniformLocation | null> = {}

  let mouseX = 0.5
  let mouseY = 0.5
  let targetX = 0.5
  let targetY = 0.5
  let vel = 0
  let targetVel = 0
  let pulseValue = 0
  const start = performance.now()

  function compile(type: number, src: string) {
    const s = gl!.createShader(type)!
    gl!.shaderSource(s, src)
    gl!.compileShader(s)
    if (!gl!.getShaderParameter(s, gl!.COMPILE_STATUS)) {
      throw new Error(gl!.getShaderInfoLog(s) ?? 'shader compile failed')
    }
    return s
  }

  function resize() {
    if (!canvasEl || !gl)
      return
    const dpr = Math.min(window.devicePixelRatio, 2)
    canvasEl.width = canvasEl.clientWidth * dpr
    canvasEl.height = canvasEl.clientHeight * dpr
    gl.viewport(0, 0, canvasEl.width, canvasEl.height)
  }

  function onPointer(e: PointerEvent) {
    const nx = e.clientX / window.innerWidth
    const ny = 1 - e.clientY / window.innerHeight
    targetVel = Math.min(1, Math.hypot(nx - targetX, ny - targetY) * 26)
    targetX = nx
    targetY = ny
  }

  function frame() {
    if (!gl || !program || !canvasEl)
      return
    mouseX += (targetX - mouseX) * 0.08
    mouseY += (targetY - mouseY) * 0.08
    vel += (targetVel - vel) * 0.08
    targetVel *= 0.92
    pulseValue *= 0.985

    gl.useProgram(program)
    gl.uniform2f(loc.uResolution!, canvasEl.width, canvasEl.height)
    gl.uniform1f(loc.uTime!, (performance.now() - start) / 1000)
    gl.uniform2f(loc.uMouse!, mouseX, mouseY)
    gl.uniform1f(loc.uVel!, vel)
    gl.uniform1f(loc.uPulse!, pulseValue)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
    raf = requestAnimationFrame(frame)
  }

  function mount(canvas: HTMLCanvasElement) {
    canvasEl = canvas
    gl = canvas.getContext('webgl2', { antialias: false, alpha: false })
    if (!gl)
      return

    program = gl.createProgram()!
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT))
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG))
    gl.linkProgram(program)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const aPos = gl.getAttribLocation(program, 'aPos')
    gl.enableVertexAttribArray(aPos)
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0)

    for (const name of ['uResolution', 'uTime', 'uMouse', 'uVel', 'uPulse']) {
      loc[name] = gl.getUniformLocation(program, name)
    }

    resize()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer)
    frame()
  }

  function pulse() {
    pulseValue = 1
  }

  function destroy() {
    cancelAnimationFrame(raf)
    window.removeEventListener('resize', resize)
    window.removeEventListener('pointermove', onPointer)
    gl = null
    program = null
    canvasEl = null
  }

  return { mount, pulse, destroy }
}
