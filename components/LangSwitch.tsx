'use client';

import type { Lang } from '@/content';

/** Cambia de idioma conservando el #ancla actual. Sin JS es un link normal. */
export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const other: Lang = lang === 'en' ? 'es' : 'en';
  const href = `/${other}/`;
  return (
    <a
      href={href}
      hrefLang={other}
      lang={other}
      aria-label={`${other.toUpperCase()} · ${label}`}
      title={label}
      onClick={(e) => {
        e.preventDefault();
        window.location.assign(href + window.location.hash);
      }}
      className="grid h-11 min-w-11 place-items-center rounded-full px-2 font-mono text-xs uppercase tracking-[0.12em] text-ink-dim transition-colors duration-150 ease-[var(--ease-micro)] hover:text-ink"
    >
      {other}
    </a>
  );
}
