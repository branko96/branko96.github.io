'use client';

import { useEffect, useRef } from 'react';
import { createParticleGlyph } from '@/fx/particle-glyph';
import { cn } from '@/lib/cn';
import { useFreshCanvas } from './use-fresh-canvas';

type Instance = NonNullable<ReturnType<typeof createParticleGlyph>>;

/** El monograma BO en partículas; se dispersa a medida que el hero sale de pantalla. */
export function ParticleGlyph({ className }: { className?: string }) {
  const instanceRef = useRef<Instance | null>(null);
  const hostRef = useFreshCanvas(
    (canvas) => createParticleGlyph(canvas, { src: '/bo-mark.svg', count: 2400, fit: 0.9 }),
    (instance) => (instanceRef.current = instance)
  );

  useEffect(() => {
    const section = hostRef.current?.closest('section');
    if (!section) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = section.getBoundingClientRect();
      instanceRef.current?.setDispersion(Math.min(1, Math.max(0, -r.top / (r.height * 0.7))));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
    };
  }, [hostRef]);

  return <div ref={hostRef} aria-hidden="true" className={cn('pointer-events-none absolute', className)} />;
}
