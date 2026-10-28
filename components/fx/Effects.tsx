'use client';

import { useEffect } from 'react';

/**
 * Único componente cliente de efectos declarativos (adaptado de oblivion-ecommerce):
 * las secciones son Server Components y solo declaran atributos.
 *
 * - `[data-reveal]`: entra al hacer scroll. El CSS solo lo oculta con
 *   `data-fx="on"` en <html>, que se setea acá: sin JS el contenido queda visible.
 * - `[data-glow]`: posición del puntero como `--mx`/`--my`.
 * - `[data-tilt]`: inclinación 3D según el puntero (`--rx`/`--ry`).
 */
export function Effects() {
  useEffect(() => {
    const root = document.documentElement;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.shown = '';
          io.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.12 }
    );

    // Lo que ya está en pantalla al montar no se esconde (primera pintura legible)
    const vh = window.innerHeight;
    document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
      if (el.getBoundingClientRect().top < vh * 0.9) el.dataset.shown = '';
      else io.observe(el);
    });
    root.dataset.fx = 'on';

    if (reduceMotion || !finePointer) return () => io.disconnect();

    let frame = 0;
    let last: PointerEvent | null = null;

    const apply = () => {
      frame = 0;
      if (!last) return;
      const { clientX, clientY, target } = last;

      const glow = (target as Element | null)?.closest<HTMLElement>('[data-glow]');
      if (glow) {
        const r = glow.getBoundingClientRect();
        glow.style.setProperty('--mx', `${clientX - r.left}px`);
        glow.style.setProperty('--my', `${clientY - r.top}px`);
      }

      const tilt = (target as Element | null)?.closest<HTMLElement>('[data-tilt]');
      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        if (el !== tilt) {
          el.style.removeProperty('--rx');
          el.style.removeProperty('--ry');
          return;
        }
        const r = el.getBoundingClientRect();
        const nx = Math.max(-1, Math.min(1, (clientX - (r.left + r.width / 2)) / (r.width / 2)));
        const ny = Math.max(-1, Math.min(1, (clientY - (r.top + r.height / 2)) / (r.height / 2)));
        el.style.setProperty('--ry', `${nx * 4}deg`);
        el.style.setProperty('--rx', `${-ny * 3}deg`);
      });
    };

    const onMove = (e: PointerEvent) => {
      last = e;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('pointermove', onMove);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
