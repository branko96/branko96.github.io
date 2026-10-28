'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_PALETTE, PALETTES } from '@/lib/palettes';
import { cn } from '@/lib/cn';

// Herramienta interna (solo con ?lab): panel flotante real, lleva sombra y blur
const PANEL = 'pointer-events-auto w-full max-w-4xl rounded-[18px] border border-line-strong bg-ground/85 shadow-[0_24px_80px_-24px_rgb(0_0_0/0.6)] backdrop-blur-xl'; // taste-skill-ignore

/**
 * Panel para probar paletas sobre el sitio real. Solo aparece con ?lab (queda
 * recordado en este navegador); los visitantes ven siempre la paleta publicada.
 * Atajos: [ y ] recorren las paletas, L alterna claro/oscuro.
 */
export function PaletteLab() {
  const [enabled, setEnabled] = useState(false);
  const [open, setOpen] = useState(true);
  const [current, setCurrent] = useState(DEFAULT_PALETTE);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = document.documentElement;
    setEnabled('lab' in root.dataset);
    setCurrent(root.dataset.palette ?? DEFAULT_PALETTE);
    setTheme(root.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const apply = useCallback((id: string) => {
    document.documentElement.dataset.palette = id;
    try {
      localStorage.setItem('palette', id);
    } catch {
      /* sin storage la elección dura la sesión */
    }
    setCurrent(id);
  }, []);

  const toggleTheme = useCallback(() => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {}
    setTheme(next);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input,textarea')) return;
      const i = PALETTES.findIndex((p) => p.id === document.documentElement.dataset.palette);
      if (e.key === ']') apply(PALETTES[(i + 1) % PALETTES.length].id);
      if (e.key === '[') apply(PALETTES[(i - 1 + PALETTES.length) % PALETTES.length].id);
      if (e.key.toLowerCase() === 'l' && !e.metaKey && !e.ctrlKey) toggleTheme();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [enabled, apply, toggleTheme]);

  const disable = () => {
    try {
      localStorage.setItem('lab', '0');
      localStorage.removeItem('palette');
    } catch {}
    delete document.documentElement.dataset.lab;
    apply(DEFAULT_PALETTE);
    setEnabled(false);
  };

  if (!enabled) return null;

  const active = PALETTES.find((p) => p.id === current) ?? PALETTES[0];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[60] flex justify-center px-3">
      <section
        aria-label="Palette lab"
        className={PANEL}
      >
        <header className="flex items-center justify-between gap-3 px-4 pt-3">
          <p className="flex items-baseline gap-2 text-sm font-bold text-accent">
            Palette lab
            <span className="normal-case tracking-normal text-muted">
              [ ] cycle · L {theme === 'dark' ? 'light' : 'dark'}
            </span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              className="h-9 rounded-full px-3 text-xs font-semibold text-ink-dim hover:text-ink"
            >
              {theme === 'dark' ? 'Light' : 'Dark'}
            </button>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="h-9 rounded-full px-3 text-xs font-semibold text-ink-dim hover:text-ink"
            >
              {open ? 'Hide' : 'Show'}
            </button>
            <button
              type="button"
              onClick={disable}
              title="Turn the lab off in this browser"
              className="h-9 rounded-full px-3 text-xs font-semibold text-ink-dim hover:text-ink"
            >
              Exit
            </button>
          </div>
        </header>

        {open && (
          <>
            <ul className="flex gap-2 overflow-x-auto px-4 pb-2 pt-3">
              {PALETTES.map((p) => {
                const t = theme === 'dark' ? p.dark : p.light;
                const selected = p.id === current;
                return (
                  <li key={p.id} className="shrink-0">
                    <button
                      type="button"
                      onClick={() => apply(p.id)}
                      aria-pressed={selected}
                      className={cn(
                        'flex min-w-[7.5rem] flex-col gap-2 rounded-xl border p-2.5 text-left transition-colors duration-150',
                        selected ? 'border-accent' : 'border-line hover:border-line-strong'
                      )}
                    >
                      <span className="flex h-8 overflow-hidden rounded-md border border-line" aria-hidden="true">
                        <span className="flex-[3]" style={{ background: t.ground }} />
                        <span className="flex-1" style={{ background: p.brand.deep }} />
                        <span className="flex-1" style={{ background: p.brand.mid }} />
                        <span className="flex-[1.4]" style={{ background: t.accent }} />
                        <span className="flex-1" style={{ background: t.ink }} />
                      </span>
                      <span className="flex items-center justify-between gap-2 text-sm font-semibold text-ink">
                        {p.name}
                        {p.id === DEFAULT_PALETTE && (
                          <span className="text-xs font-semibold text-muted">live</span>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="px-4 pb-3 text-sm text-ink-dim">
              <span className="font-semibold text-ink">{active.name}.</span> {active.note}
            </p>
          </>
        )}
      </section>
    </div>
  );
}
