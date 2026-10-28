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
    <section id="craft" data-backdrop="0.35" aria-labelledby="craft-title" className="section-py">
      <div className="shell">
        <header className="max-w-3xl" data-reveal>
          <p className="eyebrow text-accent">{craft.eyebrow}</p>
          <h2 id="craft-title" className="mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-none tracking-[-0.03em]">
            {craft.title}
          </h2>
          <p className="mt-6 max-w-[60ch] text-ink-dim">{craft.intro}</p>
        </header>

        <ul className="mt-12 grid items-start gap-x-10 lg:grid-cols-2">
          {craft.items.map((item, i) => {
            const isOpen = open === item.id;
            const panelId = `craft-${item.id}`;
            return (
              <li
                key={item.id}
                data-reveal
                style={{ '--d': `${(i % 2) * 80}ms` } as React.CSSProperties}
                className="border-t border-line"
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
                      <span className="block font-display text-[1.45rem] font-semibold leading-tight tracking-tight">
                        {item.title}
                      </span>
                      <span className="mt-1 block font-serif text-lg italic text-accent">{item.hook}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'mt-1 grid size-9 shrink-0 place-items-center rounded-full border border-line-strong text-ink-dim transition-[transform,color,border-color] duration-300 ease-[var(--ease-premium)] group-hover:border-accent group-hover:text-accent',
                        isOpen && 'rotate-45 border-accent text-accent'
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
                              <span aria-hidden="true" className="absolute left-0 top-[0.7em] h-px w-2.5 bg-accent" />
                              {p}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-5 rounded-xl border border-line px-4 py-3 text-sm text-ink-dim">
                          <span className="mr-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">
                            {craft.evidenceLabel}
                          </span>
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
