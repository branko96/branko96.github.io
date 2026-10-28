/**
 * Utilidades compartidas por los efectos de src/fx.
 * Basado en las reglas de web-fx-kit: lerp exponencial independiente del framerate,
 * colores leídos de tokens CSS (nunca literales) y respeto por prefers-reduced-motion.
 */

/** Lerp exponencial: mismo "peso" a 60 y a 144 Hz. `base` más chica = más pesado. */
export function damp(current: number, target: number, dt: number, base = 0.0015): number {
  return current + (target - current) * (1 - Math.pow(base, dt));
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Lee un token de color de :root y lo devuelve como [r, g, b] en 0..1. */
export function readColorToken(
  name: string,
  el: Element = document.documentElement
): [number, number, number] {
  const raw = getComputedStyle(el).getPropertyValue(name).trim();
  return parseColor(raw);
}

export function parseColor(value: string): [number, number, number] {
  const hex = value.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const h = hex[1].length === 3 ? hex[1].replace(/./g, (c) => c + c) : hex[1];
    const n = parseInt(h, 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }
  const rgb = value.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i);
  if (rgb) return [+rgb[1] / 255, +rgb[2] / 255, +rgb[3] / 255];
  return [0, 0, 0];
}

/**
 * Loop de render que se pausa solo cuando el elemento sale de pantalla o la pestaña
 * se oculta. `tick` recibe dt en segundos (clampeado para no saltar tras una pausa).
 */
export function createLoop(target: Element, tick: (dt: number, time: number) => void) {
  let raf = 0;
  let last = 0;
  let visible = true;
  let running = false;

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    tick(dt, now / 1000);
    raf = requestAnimationFrame(frame);
  };

  const start = () => {
    if (running || !visible || document.hidden) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) start();
    else stop();
  });
  io.observe(target);

  const onVisibility = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVisibility);

  start();

  return {
    destroy() {
      stop();
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}

/** Ajusta el canvas a su caja CSS con DPR acotado. Devuelve true si cambió. */
export function fitCanvas(canvas: HTMLCanvasElement, maxDpr = 2): boolean {
  const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
  const w = Math.round(canvas.clientWidth * dpr);
  const h = Math.round(canvas.clientHeight * dpr);
  if (canvas.width === w && canvas.height === h) return false;
  canvas.width = w;
  canvas.height = h;
  return true;
}

export interface FxHandle {
  destroy(): void;
}
