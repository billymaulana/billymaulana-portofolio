export const liquidTypeVertex = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

/*
 * Trail buffer: flow disimpan biased (0.5 = nol) di RG channel RGBA8 —
 * tanpa float texture supaya aman di Safari/mobile.
 */
export const liquidTrailFragment = `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uPrev;
  uniform vec2 uPointer;
  uniform vec2 uVelocity;
  uniform float uAspect;
  uniform float uDecay;
  uniform float uRadius;

  void main() {
    vec2 flow = (texture2D(uPrev, vUv).rg - 0.5) * 2.0;
    flow *= uDecay;

    vec2 d = vUv - uPointer;
    d.x *= uAspect;
    float splat = exp(-dot(d, d) / uRadius);
    flow += uVelocity * splat;
    flow = clamp(flow, -1.0, 1.0);

    gl_FragColor = vec4(flow * 0.5 + 0.5, 0.0, 1.0);
  }
`

export const liquidDisplayFragment = `
  precision highp float;
  varying vec2 vUv;

  uniform sampler2D uText;
  uniform sampler2D uTrail;
  uniform float uStrength;
  uniform vec3 uAccent;

  void main() {
    vec2 flow = (texture2D(uTrail, vUv).rg - 0.5) * 2.0;
    float mag = length(flow);

    vec2 off = flow * uStrength;
    vec2 chrom = flow * uStrength * 0.08;

    vec4 c = texture2D(uText, vUv - off);
    float r = texture2D(uText, vUv - off - chrom).r;
    float b = texture2D(uText, vUv - off + chrom).b;
    float a = max(c.a, max(texture2D(uText, vUv - off - chrom).a, texture2D(uText, vUv - off + chrom).a));

    vec3 base = vec3(r, c.g, b);
    vec3 lit = mix(base, uAccent, clamp(mag * 2.2, 0.0, 1.0) * 0.5);

    gl_FragColor = vec4(lit * a, a);
  }
`
