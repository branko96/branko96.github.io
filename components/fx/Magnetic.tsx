'use client';

import { useEffect, useRef } from 'react';
import { createMagnetic } from '@/fx/magnetic';
import { cn } from '@/lib/cn';

/** Envuelve un CTA para que lo atraiga el puntero. En touch no hace nada. */
export function Magnetic({
  children,
  className,
  strength,
  radius,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}) {
  const outer = useRef<HTMLSpanElement>(null);
  const inner = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!outer.current) return;
    const fx = createMagnetic(outer.current, { strength, radius, inner: inner.current });
    return () => fx?.destroy();
  }, [strength, radius]);

  return (
    <span ref={outer} className={cn('inline-block will-change-transform', className)}>
      <span ref={inner} className="block">
        {children}
      </span>
    </span>
  );
}
