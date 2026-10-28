import type { Content, Lang } from '@/content';
import { CV_PATH, EMAIL } from '@/lib/site';

const BO = 'M26 22V98M26 22h22a18 18 0 0 1 0 36H26M26 58h26a20 20 0 0 1 0 40H26';

/** El cierre de la página: el monograma se dibuja trazo a trazo y el resto ordena salidas. */
export function Footer({ lang, nav, contact }: { lang: Lang; nav: Content['nav']; contact: Content['contact'] }) {
  const f = contact.footer;
  const other = lang === 'en' ? 'es' : 'en';
  const linkCls = 'inline-flex min-h-10 items-center text-ink-dim transition-colors duration-150 hover:text-ink';

  return (
    <footer className="shell pb-10 pt-24 md:pt-32">
      <div className="grid gap-14 lg:grid-cols-12">
        <div data-reveal className="lg:col-span-5">
          <svg
            viewBox="0 0 140 120"
            fill="none"
            stroke="currentColor"
            strokeWidth={9}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="bo-draw h-24 w-auto text-accent md:h-32"
            role="img"
            aria-label="Branko Ottavianelli"
          >
            <path d={BO} pathLength={1} className="bo-stroke" />
            <circle cx="104" cy="60" r="27" pathLength={1} className="bo-stroke" style={{ transitionDelay: '500ms' }} />
          </svg>
          <p className="display mt-8 text-[1.9rem] leading-[1.05]">Branko Ottavianelli</p>
          <p className="mt-3 max-w-[34ch] text-lg text-ink-dim">{f.tagline}</p>
        </div>

        <nav aria-label={f.onPage} className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7">
          <div data-reveal style={{ '--d': '80ms' } as React.CSSProperties}>
            <p className="font-bold">{f.onPage}</p>
            <ul className="mt-3">
              {[...nav.links, { href: '#contact', label: lang === 'en' ? 'Contact' : 'Contacto' }].map((l) => (
                <li key={l.href}>
                  <a href={l.href} className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ '--d': '140ms' } as React.CSSProperties}>
            <p className="font-bold">{f.elsewhere}</p>
            <ul className="mt-3">
              <li>
                <a href={`mailto:${EMAIL}`} className={linkCls}>
                  Email
                </a>
              </li>
              {contact.links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer me" className={linkCls}>
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={{ '--d': '200ms' } as React.CSSProperties}>
            <p className="font-bold">{f.files}</p>
            <ul className="mt-3">
              <li>
                <a href={CV_PATH} download className={linkCls}>
                  {f.cv}
                </a>
              </li>
              <li>
                <a href={`/${other}/`} hrefLang={other} lang={other} className={linkCls}>
                  {f.otherLang}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="mt-20 flex flex-col gap-6 rounded-2xl bg-raised px-6 py-5 text-sm text-ink-dim md:flex-row md:items-center md:justify-between">
        <p>
          © {new Date().getFullYear()} Branko Ottavianelli. {f.colophon}
        </p>
        <a
          href="#top"
          className="group inline-flex min-h-11 shrink-0 items-center gap-2 font-semibold text-ink"
        >
          {f.top}
          <svg viewBox="0 0 20 20" className="size-4 transition-transform duration-300 ease-[var(--ease-premium)] group-hover:-translate-y-1" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
            <path d="M10 16V4M5 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
