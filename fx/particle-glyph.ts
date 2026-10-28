/**
 * Particle Glyph — adaptación de `particles-morph` (web-fx-kit) a Canvas 2D.
 * Las partículas se ensamblan en la silueta de una imagen (el monograma BO),
 * respiran, se apartan del puntero y se dispersan con `setDispersion(0..1)`.
 *
 * Sin Three.js: ~3k partículas en 2D rinden de sobra y mantienen el JS inicial
 * dentro del presupuesto. Degrada solo si el framerate cae (regla del kit).
 */
import { createLoop, fitCanvas, prefersReducedMotion, readColorToken } from './core';

export interface ParticleGlyphOptions {
  src: string;
  /** Partículas en escritorio; en pantallas chicas se usa ~la mitad. */
  count?: number;
  /** Tokens CSS del gradiente, de izquierda a derecha. */
  colors?: string[];
  /** Tamaño del logo relativo al lado menor del canvas. */
  fit?: number;
}

interface P {
  hx: number;
  hy: number; // posición destino normalizada (-0.5..0.5)
  x: number;
  y: number;
  vx: number;
  vy: number;
  dx: number;
  dy: number; // dirección de dispersión
  reach: number; // cuán lejos viaja al dispersarse
  seed: number;
  size: number;
  bucket: number;
}

const BUCKETS = 6;

async function sampleImage(src: string, want: number): Promise<Array<[number, number]>> {
  const img = new Image();
  img.decoding = 'async';
  img.src = src;
  await img.decode();

  const S = 260;
  const off = document.createElement('canvas');
  off.width = S;
  off.height = S;
  const ctx = off.getContext('2d', { willReadFrequently: true })!;
  const ratio = img.naturalWidth / img.naturalHeight || 1;
  const w = ratio >= 1 ? S : S * ratio;
  const h = ratio >= 1 ? S / ratio : S;
  ctx.drawImage(img, (S - w) / 2, (S - h) / 2, w, h);
  const data = ctx.getImageData(0, 0, S, S).data;

  const inside: Array<[number, number]> = [];
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      if (data[(y * S + x) * 4 + 3] > 140) inside.push([x / S - 0.5, y / S - 0.5]);
    }
  }
  // Muestreo aleatorio sin reemplazo, con jitter subpíxel para evitar la grilla
  for (let i = inside.length - 1; i > 0; i--) {
    const j = (Math.random() * (i + 1)) | 0;
    [inside[i], inside[j]] = [inside[j], inside[i]];
  }
  return inside
    .slice(0, want)
    .map(([x, y]) => [x + (Math.random() - 0.5) / S, y + (Math.random() - 0.5) / S]);
}

function toCss([r, g, b]: [number, number, number]) {
  return `rgb(${Math.round(r * 255)} ${Math.round(g * 255)} ${Math.round(b * 255)})`;
}

function mix(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function createParticleGlyph(canvas: HTMLCanvasElement, options: ParticleGlyphOptions) {
  const {
    src,
    count = 2800,
    colors = ['--color-lilac', '--color-glow', '--color-violet'],
    fit = 0.86,
  } = options;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const reduced = prefersReducedMotion();
  const small = window.matchMedia('(max-width: 768px)').matches;
  const target = small ? Math.round(count * 0.5) : count;

  // Gradiente de marca discretizado: un fillStyle por bucket, no por partícula
  const stops = colors.map((c) => readColorToken(c));
  const palette = Array.from({ length: BUCKETS }, (_, i) => {
    const t = (i / (BUCKETS - 1)) * (stops.length - 1);
    const k = Math.min(Math.floor(t), stops.length - 2);
    return toCss(mix(stops[k], stops[k + 1], t - k));
  });

  let particles: P[] = [];
  let dispersion = reduced ? 0 : 1; // arranca disperso y se ensambla
  let dispersionTarget = 0;
  let introT = reduced ? 1 : 0;
  const pointer = { x: -9999, y: -9999, active: false };
  let loop: { destroy(): void } | null = null;
  let destroyed = false;

  // Presupuesto de framerate: si cae < 32 fps por 2 s, se recorta la densidad una vez
  let slowTime = 0;
  let degraded = false;

  const layout = () => {
    fitCanvas(canvas);
    const w = canvas.width;
    const h = canvas.height;
    return {
      cx: w / 2,
      cy: h / 2,
      L: Math.min(w, h) * fit,
      dpr: w / Math.max(1, canvas.clientWidth),
    };
  };
  let geo = { cx: 0, cy: 0, L: 1, dpr: 1 };

  const draw = (time: number) => {
    const { dpr } = geo;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'lighter';

    let current = -1;
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      if (p.bucket !== current) {
        current = p.bucket;
        ctx.fillStyle = palette[current];
      }
      const fade = 1 - dispersion * (0.55 + 0.45 * p.seed);
      if (fade <= 0.02) continue;
      // Titileo leve: la silueta está viva pero no vibra
      ctx.globalAlpha = fade * (0.72 + 0.28 * Math.sin(time * 1.3 + p.seed * 40));
      const s = p.size * dpr;
      ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };

  const step = (dt: number, time: number) => {
    const { cx, cy, L, dpr } = geo;

    if (introT < 1) {
      introT = Math.min(1, introT + dt / 2.2);
    }
    // La intro manda hasta terminar; después, el scroll
    const introDisp = 1 - easeOutCubic(introT);
    const goal = Math.max(introDisp, dispersionTarget);
    dispersion += (goal - dispersion) * (1 - Math.pow(0.02, dt));

    const R = 110 * dpr;
    const R2 = R * R;
    const spring = 16;
    const drag = Math.pow(0.02, dt);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      const breathe = Math.sin(time * 0.8 + p.seed * 12) * 1.4 * dpr;
      const reach = p.reach * L * dispersion * dispersion;
      const tx = cx + p.hx * L + p.dx * reach + breathe;
      const ty =
        cy +
        p.hy * L +
        p.dy * reach -
        dispersion * 40 * dpr * p.seed +
        Math.cos(time * 0.7 + p.seed * 9) * dpr;

      p.vx += (tx - p.x) * spring * dt;
      p.vy += (ty - p.y) * spring * dt;

      if (pointer.active) {
        const ox = p.x - pointer.x;
        const oy = p.y - pointer.y;
        const d2 = ox * ox + oy * oy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R) * (1 - d / R) * 2400 * dpr;
          p.vx += (ox / d) * f * dt;
          p.vy += (oy / d) * f * dt;
        }
      }

      p.vx *= drag;
      p.vy *= drag;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }

    draw(time);

    if (!degraded && dt > 1 / 32) {
      slowTime += dt;
      if (slowTime > 2) {
        degraded = true;
        particles = particles.filter((_, i) => i % 2 === 0);
        console.info('[particle-glyph] framerate bajo: densidad reducida a', particles.length);
      }
    } else {
      slowTime = Math.max(0, slowTime - dt);
    }
  };

  const onPointer = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = (e.clientX - r.left) * geo.dpr;
    pointer.y = (e.clientY - r.top) * geo.dpr;
    pointer.active =
      e.clientX >= r.left - 60 &&
      e.clientX <= r.right + 60 &&
      e.clientY >= r.top - 60 &&
      e.clientY <= r.bottom + 60;
  };
  const onLeave = () => (pointer.active = false);

  const ro = new ResizeObserver(() => {
    const prev = geo;
    geo = layout();
    // Reubica en proporción para no "explotar" al redimensionar
    if (prev.L > 1) {
      for (const p of particles) {
        p.x = geo.cx + ((p.x - prev.cx) / prev.L) * geo.L;
        p.y = geo.cy + ((p.y - prev.cy) / prev.L) * geo.L;
      }
    }
    if (reduced) draw(0);
  });

  sampleImage(src, target)
    .then((points) => {
      if (destroyed) return;
      geo = layout();
      particles = points
        .map(([hx, hy]) => {
          const a = Math.atan2(hy, hx) + (Math.random() - 0.5) * 1.6;
          const seed = Math.random();
          const startR = (0.6 + Math.random() * 0.9) * geo.L;
          return {
            hx,
            hy,
            x: reduced ? geo.cx + hx * geo.L : geo.cx + Math.cos(a) * startR,
            y: reduced ? geo.cy + hy * geo.L : geo.cy + Math.sin(a) * startR,
            vx: 0,
            vy: 0,
            dx: Math.cos(a),
            dy: Math.sin(a),
            reach: 0.35 + Math.random() * 0.9,
            seed,
            size: 1.4 + Math.random() * 1.6,
            bucket: Math.min(BUCKETS - 1, Math.max(0, Math.floor((hx + 0.5 + hy * 0.3) * BUCKETS))),
          };
        })
        .sort((a, b) => a.bucket - b.bucket);

      ro.observe(canvas);
      canvas.dataset.ready = 'true';

      if (reduced) {
        draw(0);
        return;
      }
      window.addEventListener('pointermove', onPointer, { passive: true });
      document.addEventListener('pointerleave', onLeave);
      loop = createLoop(canvas, step);
    })
    .catch(() => {
      /* Sin imagen no hay efecto; el contenido no depende de esto */
    });

  return {
    /** 0 = pulpo formado, 1 = disuelto. Pensado para atarlo al scroll. */
    setDispersion(value: number) {
      dispersionTarget = Math.min(1, Math.max(0, value));
    },
    destroy() {
      destroyed = true;
      loop?.destroy();
      ro.disconnect();
      window.removeEventListener('pointermove', onPointer);
      document.removeEventListener('pointerleave', onLeave);
      particles = [];
    },
  };
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}
