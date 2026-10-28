'use client';

import { useEffect, useRef } from 'react';
import { createGradientBackdrop } from '@/fx/gradient-backdrop';
import { useFreshCanvas } from './use-fresh-canvas';

type Instance = NonNullable<ReturnType<typeof createGradientBackdrop>>;

/**
 * Un único shader fijo detrás de toda la página: la "cortina" del hero sigue viva
 * mientras se scrollea. Cada sección declara su intensidad con `data-backdrop`
 * (0..1) y el fondo la interpola, así no hay cortes entre secciones.
 */
export function PageBackdrop() {
  const instanceRef = useRef<Instance | null>(null);
  const hostRef = useFreshCanvas(
    (canvas) => {
      canvas.style.opacity = '0';
      canvas.style.transition = 'opacity 1.2s var(--ease-premium)';
      const fx = createGradientBackdrop(canvas);
      if (fx) requestAnimationFrame(() => (canvas.style.opacity = '1'));
      return fx;
    },
    (fx) => (instanceRef.current = fx)
  );

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      const sections = document.querySelectorAll<HTMLElement>('[data-backdrop]');
      for (const el of sections) {
        const r = el.getBoundingClientRect();
        if (r.top <= mid && r.bottom >= mid) {
          instanceRef.current?.setIntensity(Number(el.dataset.backdrop));
          return;
        }
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="page-backdrop abyss-glow grain pointer-events-none fixed inset-0 -z-10">
      <div ref={hostRef} className="absolute inset-0" />
    </div>
  );
}
