'use client';

import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { Content } from '@/content';
import { cn } from '@/lib/cn';

const SPRING = { type: 'spring', damping: 28, stiffness: 300 } as const;

/** Decisiones del harness: filas que se expanden en el lugar (sin páginas de caso). */
export function Craft({ craft }: { craft: Content['craft'] }) {
  const [open, setOpen] = useState<string | null>(craft.items[0].id);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(null);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <section id="craft" aria-labelledby="craft-title" className="section-py">
      <div className="shell grid gap-12 lg:grid-cols-12">
        <header className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          <h2 id="craft-title" data-reveal className="display text-[clamp(2.2rem,4vw,3.4rem)]">
            {craft.title}
          </h2>
          <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="mt-6 max-w-[44ch] text-lg text-ink-dim">
            {craft.intro}
          </p>
        </header>

        <ul className="space-y-2 lg:col-span-7">
          {craft.items.map((item, i) => {
            const isOpen = open === item.id;
            const panelId = `craft-${item.id}`;
            return (
              <li
                key={item.id}
                data-reveal
                style={{ '--d': `${Math.min(i, 3) * 60}ms` } as React.CSSProperties}
                className={cn(
                  'rounded-2xl px-5 transition-colors duration-300 ease-[var(--ease-micro)] md:px-7',
                  isOpen ? 'bg-raised' : 'hover:bg-raised/60'
                )}
              >
                <h3>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpen(isOpen ? null : item.id)}
                    className="group flex w-full items-start justify-between gap-6 py-6 text-left"
                  >
                    <span>
                      <span className="block text-[1.45rem] font-bold leading-tight tracking-tight">{item.title}</span>
                      <span className="mt-1 block text-ink-dim">{item.hook}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-1 grid size-10 shrink-0 place-items-center rounded-full bg-ground text-ink transition-[transform,background-color,color] duration-300 ease-[var(--ease-premium)] group-hover:bg-accent group-hover:text-accent-ink',
                        isOpen && 'rotate-45 bg-accent text-accent-ink'
                      )}
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round">
                        <path d="M8 2v12M2 8h12" />
                      </svg>
                    </span>
                    <span className="sr-only">{isOpen ? craft.close : craft.open}</span>
                  </button>
                </h3>
                {/* Siempre en el HTML (SEO y lectores); cerrado = alto 0 + inert */}
                <motion.div
                      id={panelId}
                      initial={false}
                      animate={isOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                      transition={reduce ? { duration: 0 } : SPRING}
                      inert={!isOpen}
                      className="overflow-hidden"
                    >
                      <div className="pb-8">
                        <ul className="space-y-3">
                          {item.points.map((p) => (
                            <li key={p} className="relative pl-5 text-[0.98rem] leading-relaxed text-ink-dim">
                              <span aria-hidden="true" className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-accent" />
                              {p}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-5 rounded-xl bg-ground px-4 py-3 text-[0.95rem] text-ink-dim">
                          <span className="mr-2 font-bold text-ink">{craft.evidenceLabel}.</span>
                          {item.evidence}
                        </p>
                      </div>
                    </motion.div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
