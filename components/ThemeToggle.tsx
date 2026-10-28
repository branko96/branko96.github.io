'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const [theme, setTheme] = useState<Theme>('dark');

  useEffect(() => {
    setTheme(document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem('theme', next);
    } catch {
      /* sin storage el tema dura la sesión */
    }
    setTheme(next);
  };

  const label = theme === 'dark' ? labels.toLight : labels.toDark;

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center rounded-full text-ink-dim transition-colors duration-150 ease-[var(--ease-micro)] hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden="true">
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4.2" />
            <path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6" strokeLinecap="round" />
          </>
        ) : (
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" strokeLinejoin="round" />
        )}
      </svg>
    </button>
  );
}
