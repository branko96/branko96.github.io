import type { Content } from '@/content';
import { CV_PATH } from '@/lib/site';
import { Magnetic } from './fx/Magnetic';
import { PrArtifact } from './PrArtifact';

export function Hero({ hero }: { hero: Content['hero'] }) {
  // Tamaño calculado para que la línea más larga entre en el ancho: dos líneas en escritorio
  const longest = Math.max(...hero.title.map((l) => l.length));
  const size = `clamp(2.5rem, calc((min(100vw, 76rem) - 5rem) / ${(longest * 0.56).toFixed(2)}), 6rem)`;

  return (
    <section id="top" className="relative pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="shell">
        <h1 className="display text-ink" style={{ fontSize: size }}>
          {hero.title.map((line, i) => (
            <span key={line} className="reveal-line md:whitespace-nowrap">
              <span style={{ '--i': i } as React.CSSProperties}>{line}</span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6">
            <p className="fade-in max-w-[56ch] text-lg leading-relaxed text-ink md:text-xl" style={{ '--d': '300ms' } as React.CSSProperties}>
              {hero.lead}
            </p>
            <p className="fade-in mt-6 max-w-[48ch] text-ink-dim" style={{ '--d': '420ms' } as React.CSSProperties}>
              {hero.proof}
            </p>
            <div className="fade-in mt-10 flex flex-wrap items-center gap-3" style={{ '--d': '540ms' } as React.CSSProperties}>
              <Magnetic strength={0.3} radius={60}>
                <a
                  href="#loop"
                  className="flex h-14 items-center gap-2 rounded-full bg-accent px-7 font-semibold text-accent-ink transition-transform duration-150 ease-[var(--ease-micro)] active:scale-[0.98]"
                >
                  {hero.ctaPrimary}
                  <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                    <path d="M10 4v12M5 11l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </Magnetic>
              <a
                href={CV_PATH}
                download
                className="flex h-14 items-center rounded-full px-5 font-semibold text-ink underline decoration-line-strong underline-offset-[0.35em] transition-colors duration-150 hover:decoration-accent"
              >
                {hero.ctaSecondary}
              </a>
            </div>
          </div>
          <div className="fade-in lg:col-span-6 lg:col-start-7 xl:col-span-5 xl:col-start-8" style={{ '--d': '200ms' } as React.CSSProperties}>
            <PrArtifact pr={hero.pr} />
          </div>
        </div>
      </div>
    </section>
  );
}
