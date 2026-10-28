'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Content, Lang } from '@/content';
import { cn } from '@/lib/cn';
import { CV_PATH } from '@/lib/site';
import { BOMark } from './BOMark';
import { LangSwitch } from './LangSwitch';
import { ThemeToggle } from './ThemeToggle';

const EASE = [0.16, 1, 0.3, 1] as const;

export function Navbar({ lang, nav }: { lang: Lang; nav: Content['nav'] }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-8 md:pt-4">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        {nav.skip}
      </a>
      <nav
        aria-label={lang === 'en' ? 'Main' : 'Principal'}
        className={cn(
          'mx-auto flex max-w-6xl items-center justify-between rounded-full border pl-5 pr-1.5 transition-[background-color,border-color,height] duration-500 ease-[var(--ease-premium)]',
          isScrolled || isOpen
            ? 'h-14 border-line bg-ground/75 backdrop-blur-xl'
            : 'h-16 border-transparent bg-transparent'
        )}
      >
        <a href={`/${lang}/`} className="relative z-10 flex items-center gap-2.5 text-ink" aria-label="Branko Ottavianelli">
          <BOMark className="h-6 text-accent" />
          <span className="hidden font-display text-[0.95rem] font-semibold tracking-tight sm:inline">
            Branko Ottavianelli
          </span>
        </a>

        <div className="hidden items-center md:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-[0.92rem] font-medium text-ink-dim transition-colors duration-150 ease-[var(--ease-micro)] hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="relative z-10 flex items-center">
          <LangSwitch lang={lang} label={nav.langLabel} />
          <ThemeToggle labels={{ toLight: nav.themeLight, toDark: nav.themeDark }} />
          <a
            href={CV_PATH}
            download
            className="ml-1 hidden h-10 items-center rounded-full bg-ink px-5 text-[0.9rem] font-semibold text-ground transition-colors duration-150 ease-[var(--ease-micro)] hover:bg-accent hover:text-accent-ink md:flex"
          >
            {nav.cv}
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-ink md:hidden"
            onClick={() => setIsOpen((v) => !v)}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            aria-label={isOpen ? nav.close : nav.menu}
          >
            <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" aria-hidden="true">
              {isOpen ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 8h16M4 16h16" />}
            </svg>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.55, ease: EASE }}
            className="fixed inset-0 -z-10 flex flex-col justify-end bg-ground px-6 pb-12 pt-28 md:hidden"
          >
            <ul className="flex flex-col gap-1">
              {nav.links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
                >
                  <a href={link.href} onClick={() => setIsOpen(false)} className="block py-1 font-display text-5xl font-semibold tracking-tight text-ink">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={CV_PATH}
              download
              onClick={() => setIsOpen(false)}
              className="mt-10 flex h-14 items-center justify-center rounded-full bg-ink font-semibold text-ground"
            >
              {nav.cv} · PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
