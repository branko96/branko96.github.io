/**
 * Magnetic — el elemento se inclina hacia el puntero dentro de un radio y vuelve
 * con el mismo lerp exponencial (sin spring CSS: tiene masa). Solo punteros finos.
 */
import { damp, prefersReducedMotion } from './core';

export interface MagneticOptions {
  strength?: number;
  radius?: number;
  /** Desplazamiento extra del contenido interno, para dar profundidad. */
  inner?: HTMLElement | null;
}

export function createMagnetic(
  el: HTMLElement,
  { strength = 0.35, radius = 90, inner = null }: MagneticOptions = {}
) {
  if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return null;

  const pos = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf = 0;
  let last = 0;
  let settling = false;

  const frame = (now: number) => {
    const dt = Math.min((now - last) / 1000, 1 / 20);
    last = now;
    pos.x = damp(pos.x, pos.tx, dt, 0.0008);
    pos.y = damp(pos.y, pos.ty, dt, 0.0008);
    el.style.transform = `translate3d(${pos.x.toFixed(2)}px, ${pos.y.toFixed(2)}px, 0)`;
    if (inner)
      inner.style.transform = `translate3d(${(pos.x * 0.35).toFixed(2)}px, ${(pos.y * 0.35).toFixed(2)}px, 0)`;

    if (
      Math.abs(pos.x - pos.tx) < 0.05 &&
      Math.abs(pos.y - pos.ty) < 0.05 &&
      pos.tx === 0 &&
      pos.ty === 0
    ) {
      settling = false;
      el.style.transform = '';
      if (inner) inner.style.transform = '';
      return;
    }
    raf = requestAnimationFrame(frame);
  };

  const kick = () => {
    if (settling) return;
    settling = true;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  };

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const reach = radius + Math.max(r.width, r.height) / 2;
    if (Math.hypot(dx, dy) < reach) {
      pos.tx = dx * strength;
      pos.ty = dy * strength;
      kick();
    } else if (pos.tx !== 0 || pos.ty !== 0) {
      pos.tx = 0;
      pos.ty = 0;
      kick();
    }
  };

  window.addEventListener('pointermove', onMove, { passive: true });

  return {
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      el.style.transform = '';
      if (inner) inner.style.transform = '';
    },
  };
}
