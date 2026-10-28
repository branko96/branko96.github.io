/**
 * Gradient Backdrop — fondo por shader con ruido simplex que reacciona al puntero.
 * WebGL crudo, sin dependencias. Si no hay WebGL devuelve null y queda visible el
 * fondo CSS del contenedor (.abyss-glow), que es también la primera pintura.
 */
import { createLoop, damp, prefersReducedMotion, readColorToken } from './core';

export interface GradientBackdropOptions {
  /** Tokens CSS de los tres colores: fondo, masa principal, acento. */
  colors?: [string, string, string];
  speed?: number;
  /** Resolución interna relativa (el shader es difuso, no necesita DPR completo). */
  scale?: number;
}

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision mediump float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;
uniform vec3 uC0;
uniform vec3 uC1;
uniform vec3 uC2;
uniform float uIntensity;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uRes;
  vec2 st = uv * vec2(uRes.x / uRes.y, 1.0);
  float t = uTime;

  // Domain warp suave: masas que respiran, no remolinos
  vec2 q = vec2(snoise(st * 0.9 + t * 0.05), snoise(st * 0.9 - t * 0.04 + 3.1));
  float n = snoise(st * 0.7 + q * 0.8 + t * 0.03);
  float n2 = snoise(st * 1.4 - q * 0.6 - t * 0.05 + 7.3);

  // El puntero "ilumina" la masa principal cerca suyo
  vec2 pAspect = uPointer * vec2(uRes.x / uRes.y, 1.0);
  float glow = smoothstep(0.75, 0.0, distance(st, pAspect));

  float body = smoothstep(-0.2, 0.9, n) * (0.55 + 0.35 * uv.x) + glow * 0.35;
  float accent = smoothstep(0.35, 1.0, n2) * (1.0 - uv.y) * 0.55;

  vec3 col = mix(uC0, uC1, clamp(body, 0.0, 1.0) * 0.7);
  col = mix(col, uC2, clamp(accent, 0.0, 1.0) * 0.45);

  // Viñeta hacia el fondo para que el texto a la izquierda respire
  col = mix(col, uC0, smoothstep(0.55, 0.0, uv.x) * 0.35);
  // Intensidad por sección: 1 = cortina plena (hero), ~0.4 = fondo de lectura
  col = mix(uC0, col, uIntensity);
  gl_FragColor = vec4(col, 1.0);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)!;
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s);
    return null;
  }
  return s;
}

export function createGradientBackdrop(
  canvas: HTMLCanvasElement,
  options: GradientBackdropOptions = {}
) {
  const {
    colors = ['--color-abyss', '--color-violet-deep', '--color-violet'],
    speed = 1,
    scale = 0.5,
  } = options;

  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: false,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  const vs = compile(gl, gl.VERTEX_SHADER, VERT);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return null;
  gl.useProgram(program);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const u = {
    res: gl.getUniformLocation(program, 'uRes'),
    time: gl.getUniformLocation(program, 'uTime'),
    pointer: gl.getUniformLocation(program, 'uPointer'),
    c0: gl.getUniformLocation(program, 'uC0'),
    c1: gl.getUniformLocation(program, 'uC1'),
    c2: gl.getUniformLocation(program, 'uC2'),
    intensity: gl.getUniformLocation(program, 'uIntensity'),
  };
  gl.uniform3fv(u.c0, readColorToken(colors[0]));
  gl.uniform3fv(u.c1, readColorToken(colors[1]));
  gl.uniform3fv(u.c2, readColorToken(colors[2]));

  const reduced = prefersReducedMotion();
  const intensity = { value: 1, target: 1 };
  const pointer = { x: 0.75, y: 0.6, tx: 0.75, ty: 0.6 };
  let elapsed = 7; // arranca con el ruido ya "desarrollado"

  const resize = () => {
    const w = Math.max(1, Math.round(canvas.clientWidth * scale));
    const h = Math.max(1, Math.round(canvas.clientHeight * scale));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(u.res, canvas.width, canvas.height);
  };

  const draw = () => {
    gl.uniform1f(u.time, elapsed);
    gl.uniform2f(u.pointer, pointer.x, pointer.y);
    gl.uniform1f(u.intensity, intensity.value);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  const onPointer = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.tx = (e.clientX - r.left) / r.width;
    pointer.ty = 1 - (e.clientY - r.top) / r.height;
  };

  const ro = new ResizeObserver(() => {
    resize();
    if (reduced) draw();
  });
  ro.observe(canvas);
  resize();

  let loop: { destroy(): void } | null = null;

  if (reduced) {
    draw();
  } else {
    window.addEventListener('pointermove', onPointer, { passive: true });
    loop = createLoop(canvas, (dt) => {
      elapsed += dt * speed;
      pointer.x = damp(pointer.x, pointer.tx, dt, 0.08);
      pointer.y = damp(pointer.y, pointer.ty, dt, 0.08);
      intensity.value = damp(intensity.value, intensity.target, dt, 0.05);
      draw();
    });
  }

  canvas.dataset.ready = 'true';

  return {
    /** Intensidad objetivo (0..1); el cambio se interpola con lerp exponencial. */
    setIntensity(value: number) {
      intensity.target = Math.min(1, Math.max(0, value));
      if (reduced) {
        intensity.value = intensity.target;
        draw();
      }
    },
    destroy() {
      loop?.destroy();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      gl.deleteBuffer(buf);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    },
  };
}
