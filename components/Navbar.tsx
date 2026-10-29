'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
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
  const reduce = useReducedMotion();

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
    const media = window.matchMedia('(min-width: 1024px)');
    const resize = () => { if (media.matches) setIsOpen(false); };
    media.addEventListener('change', resize);
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
      media.removeEventListener('change', resize);
    };
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
          <span className="display hidden text-[0.95rem] tracking-[-0.01em] sm:inline whitespace-nowrap">
            Branko Ottavianelli
          </span>
        </a>

        <div className="hidden items-center lg:flex">
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
            className="ml-2 hidden h-10 items-center rounded-full bg-accent px-5 text-[0.92rem] font-semibold text-accent-ink transition-transform duration-150 ease-[var(--ease-micro)] hover:-translate-y-px active:translate-y-0 lg:flex"
          >
            {nav.cv}
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-ink lg:hidden"
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
            transition={{ duration: reduce ? 0 : 0.25, ease: EASE }}
            className="fixed inset-0 -z-10 flex flex-col justify-end bg-ground px-6 pb-12 pt-28 lg:hidden"
          >
            <ul className="flex flex-col gap-1">
              {nav.links.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: reduce ? 1 : 0, transform: reduce ? 'none' : 'translateY(16px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0)' }}
                  transition={{ delay: reduce ? 0 : i * 0.03, duration: reduce ? 0 : 0.2, ease: EASE }}
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
