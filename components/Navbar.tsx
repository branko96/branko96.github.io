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
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-[background-color] duration-300 ease-[var(--ease-micro)]',
        isScrolled || isOpen ? 'bg-ground' : 'bg-transparent'
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-ink"
      >
        {nav.skip}
      </a>
      <nav
        aria-label={lang === 'en' ? 'Main' : 'Principal'}
        className="shell flex h-16 items-center justify-between"
      >
        <a href={`/${lang}/`} className="relative z-10 flex items-center gap-2.5 text-ink" aria-label="Branko Ottavianelli">
          <BOMark className="h-6 text-accent" />
          <span className="display hidden text-[0.95rem] tracking-[-0.01em] sm:inline">
            Branko Ottavianelli
          </span>
        </a>

        <div className="hidden items-center md:flex">
          {nav.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-[0.95rem] font-medium text-ink-dim transition-colors duration-150 ease-[var(--ease-micro)] hover:text-ink"
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
            className="ml-2 hidden h-10 items-center rounded-full bg-accent px-5 text-[0.92rem] font-semibold text-accent-ink transition-transform duration-150 ease-[var(--ease-micro)] hover:-translate-y-px active:translate-y-0 md:flex"
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
                  <a href={link.href} onClick={() => setIsOpen(false)} className="display block py-1.5 text-[2.6rem] text-ink">
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
            <a
              href={CV_PATH}
              download
              onClick={() => setIsOpen(false)}
              className="mt-10 flex h-14 items-center justify-center rounded-full bg-accent font-semibold text-accent-ink"
            >
              {nav.cv} · PDF
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
