'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

const TOP = 60;
const BOTTOM = 940;

/**
 * La página como una rama: una línea de feature que se dibuja con el scroll, un
 * commit por sección, y que se mergea a main al llegar al contacto. Solo en
 * pantallas anchas, donde el margen tiene lugar; es decorativa (la nav ya orienta).
 */
export function BranchRail() {
  const [p, setP] = useState(0);
  const [commits, setCommits] = useState<{ id: string; at: number }[]>([]);

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setCommits(
        Array.from(document.querySelectorAll<HTMLElement>('main > section[id]')).map((s) => ({
          id: s.id,
          at: Math.min(1, s.offsetTop / max),
        }))
      );
    };
    const update = () => {
      raf = 0;
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      setP(Math.min(1, window.scrollY / max));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      onScroll();
    };
    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    const ro = new ResizeObserver(onResize);
    ro.observe(document.body);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const y = (at: number) => `${((TOP + at * (BOTTOM - TOP)) / 1000) * 100}%`;
  const merged = p > 0.985;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed bottom-8 left-8 top-24 z-40 hidden w-5 2xl:block">
      <svg viewBox="0 0 20 1000" preserveAspectRatio="none" className="absolute inset-0 h-full w-full overflow-visible">
        <path d="M3 0V1000" fill="none" stroke="var(--line-strong)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        <path
          d={`M3 20C3 40 16 40 16 ${TOP}V${BOTTOM}C16 960 3 960 3 980`}
          pathLength={1}
          className="branch-path"
          style={{ '--len': 1, '--p': p } as React.CSSProperties}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {commits.map((c) => (
        <span
          key={c.id}
          className={cn(
            'absolute left-[16px] size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-colors duration-300',
            p >= c.at - 0.002 ? 'border-accent bg-accent' : 'border-line-strong bg-ground'
          )}
          style={{ top: y(c.at) }}
        />
      ))}
      <span
        className={cn(
          'absolute left-[3px] top-[98%] size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 transition-[background-color,border-color,transform] duration-500 ease-[var(--ease-premium)]',
          merged ? 'scale-125 border-accent bg-accent' : 'border-line-strong bg-ground'
        )}
      />
    </div>
  );
}
