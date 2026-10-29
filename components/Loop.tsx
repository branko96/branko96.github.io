'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { Content, LogLine, LogTone } from '@/content';
import { cn } from '@/lib/cn';

// El terminal es un fragmento de interfaz real: colores propios, fijos en cualquier paleta
// Logs reales del runner: la mono y la sombra pertenecen al fragmento (data-ui)
const TERMINAL = 'overflow-hidden rounded-2xl bg-[var(--term-bg)] shadow-[0_40px_100px_-30px_rgb(0_0_0/0.6)]'; // taste-skill-ignore
const TERMINAL_BAR = 'flex items-center justify-between px-5 py-3 font-mono text-[0.72rem] text-[#ecebf2]/70'; // taste-skill-ignore
const TERMINAL_BODY = 'h-[15rem] overflow-hidden px-5 pb-4 font-mono text-[0.82rem] leading-6 text-[#ecebf2]'; // taste-skill-ignore
const LOG_BLOCK = 'overflow-x-auto rounded-xl bg-[var(--term-bg)] px-4 py-3 font-mono text-[0.78rem] leading-6 text-[#ecebf2]'; // taste-skill-ignore

const TONE: Record<LogTone, string> = {
  ok: 'text-[#7ee2b8]',
  warn: 'text-[#f5c76b]',
  info: 'text-[#d9deef]',
  crit: 'text-[#ff8a9a]',
};

/**
 * La orquestación fuerte de la página. En escritorio con movimiento es un stage
 * sticky: el scroll avanza una corrida y el terminal escribe el log de cada etapa.
 * "Romper algo" reemplaza el log de una etapa por una falla y su recuperación.
 * En mobile, sin JS o con movimiento reducido es una lista ordenada estática.
 */
export function Loop({ loop }: { loop: Content['loop'] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [active, setActive] = useState(0);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [scenarioId, setScenarioId] = useState<string | null>(null);
  const n = loop.stages.length;

  const scenario = loop.scenarios.find((s) => s.id === scenarioId) ?? null;
  const logs = useMemo(
    () => loop.stages.map((s): LogLine[] => (scenario && scenario.stage === s.id ? scenario.log : s.log)),
    [loop.stages, scenario]
  );

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px) and (min-height: 800px) and (prefers-reduced-motion: no-preference)');
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
      if (progressRef.current) progressRef.current.style.transform = `scaleY(${p})`;
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
    if (!live) {
      document.getElementById(`stage-${loop.stages[i].id}`)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
      return;
    }
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + ((i + 0.5) / n) * travel, behavior: 'smooth' });
  };

  const pick = (id: string | null) => {
    setScenarioId(id);
    const target = loop.scenarios.find((s) => s.id === id);
    if (target) goTo(loop.stages.findIndex((s) => s.id === target.stage));
  };

  const stage = loop.stages[active];

  // Romper algo: el "live thing" del loop. En escritorio vive dentro del panel sticky.
  const picker = (
    <>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label={loop.scenarioLabel}>
        <span className="mr-2 font-bold">{loop.scenarioLabel}</span>
        {[{ id: null as string | null, label: loop.cleanRun }, ...loop.scenarios].map((s) => {
          const on = scenarioId === s.id;
          return (
            <button
              key={s.id ?? 'clean'}
              type="button"
              aria-pressed={on}
              onClick={() => pick(s.id)}
              className={cn(
                'h-11 rounded-full px-4 text-sm font-semibold transition-[background-color,color,transform] duration-150 ease-[var(--ease-micro)] active:scale-[0.97]',
                on ? 'bg-on-field text-field' : 'bg-on-field/12 text-on-field hover:bg-on-field/20'
              )}
            >
              {s.label}
            </button>
          );
        })}
      </div>
      <p className="mt-3 min-h-[1.6em] max-w-[60ch] text-ink" role="status">
        {scenario && (
          <span key={scenario.id} className="pop-in inline-block">
            {scenario.recovered}
          </span>
        )}
      </p>
    </>
  );

  return (
    <section id="loop" aria-labelledby="loop-title" className="px-2 md:px-4">
      <div data-wipe className="field section-py rounded-[28px]">
        <div className="shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <h2 id="loop-title" data-reveal className="display text-[clamp(2.3rem,5vw,4.4rem)] lg:col-span-7">
              {loop.title}
            </h2>
            <p
              data-reveal
              style={{ '--d': '90ms' } as React.CSSProperties}
              className="max-w-[52ch] text-lg text-ink lg:col-span-5 lg:self-end"
            >
              {loop.intro}
            </p>
          </div>

          {!live && (
            <div data-reveal style={{ '--d': '160ms' } as React.CSSProperties} className="mt-12">
              {picker}
            </div>
          )}
        </div>

        <div ref={trackRef} className="relative mt-10" style={live ? { height: `${n * 35 + 65}vh` } : undefined}>
          <div className={cn('shell', live && 'sticky top-0 flex h-dvh items-center')}>
            <div className={cn('w-full', live && 'grid grid-cols-[minmax(0,4fr)_minmax(0,8fr)] items-center gap-12')}>
              <ol className="relative">
                {live && (
                  <span aria-hidden="true" className="absolute bottom-3 left-[7px] top-3 w-0.5 rounded bg-on-field/20">
                    <span ref={progressRef} className="absolute inset-0 origin-top rounded bg-on-field" style={{ transform: 'scaleY(0)' }} />
                  </span>
                )}
                {loop.stages.map((s, i) => {
                  const isActive = live && i === active;
                  const done = live && i < active;
                  const broken = scenario?.stage === s.id;
                  return (
                    <li
                      key={s.id}
                      id={`stage-${s.id}`}
                      data-reveal={live ? undefined : ''}
                      className={cn(
                        'relative pl-8',
                        live ? 'py-2' : 'py-7 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-12 lg:pl-0'
                      )}
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          'absolute left-0 size-4 rounded-full border-2 transition-colors duration-300',
                          live ? 'top-[0.95rem]' : 'top-[2.25rem] lg:hidden',
                          isActive || done || !live ? 'border-on-field' : 'border-on-field/35',
                          (isActive || s.human) && 'bg-on-field',
                          broken && 'border-[#ff8a9a]'
                        )}
                      />
                      <div>
                        <h3 className="flex items-center gap-3 text-2xl font-bold tracking-tight">
                          {live ? (
                            <button
                              type="button"
                              onClick={() => goTo(i)}
                              aria-current={isActive ? 'step' : undefined}
                              className={cn(
                                'text-left transition-opacity duration-300',
                                isActive ? 'opacity-100' : 'opacity-55 hover:opacity-80'
                              )}
                            >
                              {s.name}
                            </button>
                          ) : (
                            s.name
                          )}
                          {s.human && (
                            <span className="rounded-full bg-on-field px-2.5 py-0.5 text-xs font-bold text-field">
                              {loop.humanBadge}
                            </span>
                          )}
                        </h3>
                        <p className={cn('mt-1.5 max-w-[46ch] leading-relaxed text-ink-dim', live && !isActive && 'sr-only')}>
                          {s.summary}
                        </p>
                      </div>
                      {/* Detalle estático: en modo live lo muestra el panel */}
                      <div className={cn(live && 'sr-only', 'mt-5 lg:mt-0')}>
                        <pre data-ui className={LOG_BLOCK}>
                          {logs[i].map((l) => (
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
                <div className="min-w-0">
                  <div className="mb-5">{picker}</div>
                  <div aria-hidden="true" data-ui className={TERMINAL}>
                    <div className={TERMINAL_BAR}>
                      <span>{loop.runLabel} · feature/checkout-coupons</span>
                      <span className="flex items-center gap-2">
                        <span className={cn('size-1.5 rounded-full', stage.human ? 'bg-[#f5c76b]' : 'bg-[#7ee2b8]')} />
                        {stage.id}
                      </span>
                    </div>
                    <div className={TERMINAL_BODY}>
                      <div className="flex h-full flex-col justify-end">
                        {loop.stages.slice(0, active + 1).flatMap((s, si) =>
                          logs[si].map((l, li) => (
                            <div
                              key={`${s.id}-${scenarioId}-${li}`}
                              className={cn('flex gap-3 whitespace-nowrap', si === active && 'loop-line')}
                              style={si === active ? { animationDelay: `${li * 240}ms` } : undefined}
                            >
                              <span className="w-14 shrink-0 text-[#ecebf2]/55">{s.id}</span>
                              <span className={TONE[l.tone]}>{l.text}</span>
                            </div>
                          ))
                        )}
                        <div className="loop-cursor text-[#ecebf2]/55">$</div>
                      </div>
                    </div>
                  </div>
                  <div aria-hidden="true">
                    <StageFacts key={stage.id} loop={loop} stage={stage} className="loop-line mt-7" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="shell">
          <p className="mt-6 text-sm text-muted">{loop.runNote}</p>
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
    <dl className={cn('grid gap-6 sm:grid-cols-3', className)}>
      {facts.map(([label, text]) => (
        <div key={label}>
          <dt className="font-bold">{label}</dt>
          <dd className="mt-1.5 text-[0.95rem] leading-relaxed text-ink-dim">{text}</dd>
        </div>
      ))}
    </dl>
  );
}
