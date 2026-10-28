'use client';

import { useEffect, useRef, useState } from 'react';
import type { Content, LogTone } from '@/content';
import { cn } from '@/lib/cn';

const TONE: Record<LogTone, string> = {
  ok: 'text-[#7ee2b8]',
  warn: 'text-[#f5c76b]',
  info: 'text-[#c9b8ff]',
};

/**
 * La orquestación fuerte de la página (DESIGN.md §4). En escritorio con movimiento
 * la sección es un stage sticky: el scroll avanza una corrida y el terminal escribe
 * el log de cada etapa. En mobile, sin JS o con movimiento reducido es una lista
 * ordenada estática con todo el contenido visible.
 */
export function Loop({ loop }: { loop: Content['loop'] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const n = loop.stages.length;

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (prefers-reduced-motion: no-preference)');
    const sync = () => setLive(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (!live) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - window.innerHeight)));
      setProgress(p);
      setActive(Math.min(n - 1, Math.floor(p * n * 0.999)));
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
  }, [live, n]);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * travel, behavior: 'smooth' });
  };

  const stage = loop.stages[active];

  return (
    <section id="loop" data-backdrop="0.55" aria-labelledby="loop-title" className="section-py">
      <div className="shell">
        <header className="max-w-3xl" data-reveal>
          <p className="eyebrow text-accent">{loop.eyebrow}</p>
          <h2 id="loop-title" className="mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-none tracking-[-0.03em]">
            {loop.title}
          </h2>
          <p className="mt-6 max-w-[60ch] text-ink-dim">{loop.intro}</p>
        </header>
      </div>

      <div ref={trackRef} className="relative mt-12 lg:mt-4" style={live ? { height: `${n * 62 + 40}vh` } : undefined}>
        <div className={cn('shell', live && 'sticky top-0 flex h-dvh items-center')}>
          <div className={cn('w-full', live && 'grid grid-cols-[minmax(0,5fr)_minmax(0,7fr)] items-center gap-12')}>
            {/* La lista es la fuente de verdad (lectores de pantalla, mobile, sin JS) */}
            <ol className="relative">
              {live && (
                <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-px bg-line">
                  <span
                    className="absolute inset-x-0 top-0 origin-top bg-accent"
                    style={{ height: '100%', transform: `scaleY(${progress})` }}
                  />
                </span>
              )}
              {loop.stages.map((s, i) => {
                const isActive = live && i === active;
                const done = live && i < active;
                return (
                  <li
                    key={s.id}
                    data-reveal={live ? undefined : ''}
                    className={cn(
                      'relative pl-8',
                      live ? 'py-2.5' : 'border-t border-line py-7 first:border-t-0 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pl-0'
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute left-0 top-[1.15rem] size-[15px] rounded-full border-2 transition-colors duration-300',
                        live ? 'top-[1.05rem]' : 'top-[2.2rem] lg:hidden',
                        isActive || done || !live ? 'border-accent' : 'border-line-strong',
                        isActive && 'bg-accent',
                        s.human && !live && 'bg-accent'
                      )}
                    />
                    <div>
                      <h3 className="flex items-center gap-3 text-2xl font-semibold tracking-tight">
                        {live ? (
                          <button
                            type="button"
                            onClick={() => goTo(i)}
                            aria-current={isActive ? 'step' : undefined}
                            className={cn(
                              'text-left transition-colors duration-300',
                              isActive ? 'text-ink' : 'text-muted hover:text-ink-dim'
                            )}
                          >
                            {s.name}
                          </button>
                        ) : (
                          s.name
                        )}
                        {s.human && (
                          <span className="rounded-full border border-accent px-2.5 py-0.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.12em] text-accent">
                            {loop.humanBadge}
                          </span>
                        )}
                      </h3>
                      <p
                        className={cn(
                          'mt-1.5 max-w-[46ch] text-[0.97rem] leading-relaxed text-ink-dim',
                          live && !isActive && 'sr-only'
                        )}
                      >
                        {s.summary}
                      </p>
                    </div>
                    {/* Detalle estático: en modo live lo muestra el panel */}
                    <div className={cn(live && 'sr-only', 'mt-5 lg:mt-0')}>
                      <pre className="overflow-x-auto rounded-xl bg-[var(--term-bg)] px-4 py-3 font-mono text-[0.78rem] leading-6 text-[#e9ddff]">
                        {s.log.map((l) => (
                          <span key={l.text} className={cn('block', TONE[l.tone])}>
                            {l.text}
                          </span>
                        ))}
                      </pre>
                      <StageFacts loop={loop} stage={s} className="mt-4" />
                    </div>
                  </li>
                );
              })}
            </ol>

            {live && (
              <div aria-hidden="true" className="min-w-0">
                <div className="overflow-hidden rounded-[18px] border border-line-strong bg-[var(--term-bg)] shadow-[0_40px_120px_-40px_rgb(95_32_197/0.55)] backdrop-blur-md">
                  <div className="flex items-center justify-between border-b border-[rgb(233_221_255/0.12)] px-5 py-3 font-mono text-[0.72rem] text-[rgb(233_221_255/0.6)]">
                    <span>
                      {loop.runLabel} · feature/checkout-coupons
                    </span>
                    <span className="flex items-center gap-2">
                      <span className={cn('size-1.5 rounded-full', stage.human ? 'bg-[#f5c76b]' : 'animate-pulse bg-[#7ee2b8]')} />
                      {stage.id}
                    </span>
                  </div>
                  <div className="h-[13.5rem] overflow-hidden px-5 py-4 font-mono text-[0.8rem] leading-6 text-[#e9ddff]">
                    <div className="flex h-full flex-col justify-end">
                      {loop.stages.slice(0, active + 1).flatMap((s, si) =>
                        s.log.map((l, li) => (
                          <div
                            key={`${s.id}-${li}`}
                            className={cn('flex gap-3 whitespace-nowrap', si === active && 'loop-line')}
                            style={si === active ? { animationDelay: `${li * 260}ms` } : undefined}
                          >
                            <span className="w-14 shrink-0 text-[rgb(233_221_255/0.62)]">{s.id}</span>
                            <span className={TONE[l.tone]}>{l.text}</span>
                          </div>
                        ))
                      )}
                      <div className="loop-cursor text-[rgb(233_221_255/0.62)]">$</div>
                    </div>
                  </div>
                </div>
                <StageFacts key={stage.id} loop={loop} stage={stage} className="loop-line mt-6" />
                <p className="mt-5 text-xs text-muted">{loop.runNote}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {!live && (
        <div className="shell">
          <p className="mt-2 text-xs text-muted">{loop.runNote}</p>
        </div>
      )}

      <div className="shell mt-16">
        <div data-reveal className="rounded-[18px] border border-line p-6 md:p-8">
          <h3 className="eyebrow text-accent">{loop.alwaysOn.title}</h3>
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {loop.alwaysOn.items.map((item) => (
              <li key={item.name}>
                <p className="font-display text-lg font-semibold tracking-tight">{item.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-dim">{item.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StageFacts({
  loop,
  stage,
  className,
}: {
  loop: Content['loop'];
  stage: Content['loop']['stages'][number];
  className?: string;
}) {
  const facts = [
    [loop.actorLabel, stage.actor],
    [loop.guardrailLabel, stage.guardrail],
    [loop.failureLabel, stage.onFailure],
  ];
  return (
    <dl className={cn('grid gap-4 sm:grid-cols-3', className)}>
      {facts.map(([label, text]) => (
        <div key={label}>
          <dt className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-accent">{label}</dt>
          <dd className="mt-1.5 text-sm leading-relaxed text-ink-dim">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
