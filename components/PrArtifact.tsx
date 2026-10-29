'use client';

import { useEffect, useState } from 'react';
import type { Content } from '@/content';
import { cn } from '@/lib/cn';

// Fragmento de interfaz real (data-ui): conserva su sombra flotante y la mono de identificadores de git
const CARD = 'overflow-hidden rounded-2xl bg-raised text-ink shadow-[0_30px_80px_-30px_rgb(0_0_0/0.55)] ring-1 ring-line'; // taste-skill-ignore
const MONO = 'font-mono'; // taste-skill-ignore
const BRANCH = 'mt-2 font-mono text-[0.78rem] text-muted'; // taste-skill-ignore

const STEP = 650;
const START = 700;

/**
 * El "live thing" del hero: el pull request que produce el loop. Los checks se
 * completan solos con CSS (funciona sin JS y con movimiento reducido queda en el
 * estado final); el único paso interactivo es el merge, que hace el visitante.
 */
export function PrArtifact({ pr }: { pr: Content['hero']['pr'] }) {
  const [merged, setMerged] = useState(false);
  const [ready, setReady] = useState(false);
  const done = START + pr.checks.length * STEP;
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const timer = window.setTimeout(() => setReady(true), done);
    const sync = () => { if (media.matches) setReady(true); };
    sync();
    media.addEventListener('change', sync);
    return () => { clearTimeout(timer); media.removeEventListener('change', sync); };
  }, [done]);

  return (
    <figure className="m-0">
      <div
        data-ui
        data-tilt
        className={CARD}
      >
        <div className="flex items-center justify-between gap-4 px-5 pb-3 pt-4 text-sm text-ink-dim">
          <span className={MONO}>
            {pr.repo} <span className="text-muted">{pr.number}</span>
          </span>
          <span
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors duration-300',
              merged ? 'bg-field text-on-field' : 'bg-ok/15 text-ok'
            )}
          >
            <BranchIcon merged={merged} />
            {merged ? pr.merged : 'Open'}
          </span>
        </div>

        <div className="px-5">
          <p className="display text-[1.35rem] leading-tight tracking-[-0.02em]">{pr.title}</p>
          <p className={BRANCH}>
            {pr.branch} <span aria-hidden="true">→</span> main
          </p>
        </div>

        <ul className="mt-5 space-y-px px-2">
          {pr.checks.map((c, i) => {
            const t = START + i * STEP;
            return (
              <li key={c.name} className="flex items-center gap-3 rounded-lg px-3 py-2.5">
                <span className="relative grid size-5 shrink-0 place-items-center" aria-hidden="true">
                  <svg
                    viewBox="0 0 20 20"
                    className="pr-spinner check-spin absolute size-5 text-muted"
                    style={{ animation: `spin 900ms linear infinite, hide 1ms ${t}ms forwards` }}
                  >
                    <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="30 14" />
                  </svg>
                  <svg viewBox="0 0 20 20" className="pop-in absolute size-5" style={{ animationDelay: `${t}ms` }}>
                    <circle cx="10" cy="10" r="9" className="fill-ok" />
                    <path d="M6 10.4l2.6 2.6L14 7.6" fill="none" stroke="var(--ground)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold leading-tight">{c.name}</span>
                  <span className="block truncate text-sm text-ink-dim">{c.detail}</span>
                </span>
              </li>
            );
          })}
        </ul>

        <p className="px-5 pt-3 text-sm text-muted">{pr.stats}</p>

        <div className="mt-4 bg-ground/50 px-5 py-4">
          {merged ? (
            <p className="pop-in flex items-center gap-3 font-semibold" role="status">
              <svg viewBox="0 0 20 20" className="size-5 shrink-0 text-accent" aria-hidden="true">
                <path d="M6 4v12M6 7c0 4 8 3 8 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="6" cy="4" r="2" fill="currentColor" />
                <circle cx="14" cy="15" r="2" fill="currentColor" />
              </svg>
              {pr.mergedNote}
            </p>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="grid text-sm" aria-live="polite">
                <span className="pr-running fade-out-late col-start-1 row-start-1 text-ink-dim" style={{ animationDelay: `${done}ms` }}>
                  {pr.running}
                </span>
                <span className="pr-awaiting fade-in col-start-1 row-start-1 text-ink" style={{ '--d': `${done}ms` } as React.CSSProperties}>
                  {pr.awaiting}
                </span>
              </p>
              <button
                type="button"
                onClick={() => setMerged(true)}
                disabled={!ready}
                className="h-11 rounded-full bg-accent px-5 text-sm font-semibold text-accent-ink transition-transform duration-150 ease-[var(--ease-micro)] disabled:cursor-wait disabled:opacity-50 active:scale-[0.98]"
              >
                {pr.merge}
              </button>
            </div>
          )}
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted">{pr.note}</figcaption>
    </figure>
  );
}

function BranchIcon({ merged }: { merged: boolean }) {
  return (
    <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
      {merged ? (
        <path d="M5 3v10M5 6c0 3 6 2 6 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M5 3v10M11 3v4c0 2-6 2-6 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}
