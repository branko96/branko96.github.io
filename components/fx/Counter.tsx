'use client';

import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '@/fx/core';

/**
 * Cifra que cuenta hasta su valor al entrar en vista. El HTML estático ya trae
 * el valor final: solo se anima si arranca fuera de pantalla (sin parpadeo).
 */
export function Counter({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion() || value < 5) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    setShown(0);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 1400;
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        setShown(Math.round(value * (1 - Math.pow(1 - t, 4))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref}>
      {prefix}
      {shown}
      {suffix}
    </span>
  );
}
