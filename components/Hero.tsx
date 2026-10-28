import type { Content } from '@/content';
import { CV_PATH } from '@/lib/site';
import { Magnetic } from './fx/Magnetic';
import { ParticleGlyph } from './fx/ParticleGlyph';

/** "palabra *acento*" → la palabra entre asteriscos va en Fraunces itálica. */
function Words({ line, offset }: { line: string; offset: number }) {
  return line.split(' ').map((word, i) => {
    const accent = /^\*.*\*$/.test(word);
    const text = accent ? word.slice(1, -1) : word;
    return (
      <span key={i} className="reveal-word mr-[0.24em]" style={{ '--i': offset + i } as React.CSSProperties}>
        {accent ? <em className="font-serif font-normal text-accent">{text}</em> : text}
      </span>
    );
  });
}

export function Hero({ hero }: { hero: Content['hero'] }) {
  let offset = 0;
  return (
    <section id="top" data-backdrop="1" className="relative overflow-hidden pb-16 pt-32 md:pb-24 md:pt-44">
      <ParticleGlyph className="right-[-12%] top-16 h-[22rem] w-[26rem] opacity-60 md:right-[2%] md:top-28 md:h-[30rem] md:w-[36rem] md:opacity-90" />
      <div className="shell relative">
        <p className="eyebrow fade-in text-accent" style={{ '--d': '80ms' } as React.CSSProperties}>
          {hero.eyebrow}
        </p>
        <h1 className="mt-6 max-w-[13ch] text-[clamp(2.75rem,7.5vw,6.25rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
          {hero.title.map((line) => {
            const node = (
              <span key={line} className="reveal-line">
                <Words line={line} offset={offset} />
              </span>
            );
            offset += line.split(' ').length;
            return node;
          })}
        </h1>
        <p className="fade-in mt-8 max-w-[60ch] text-lg leading-relaxed text-ink-dim md:text-xl" style={{ '--d': '650ms' } as React.CSSProperties}>
          {hero.lead}
        </p>
        <div className="fade-in mt-10 flex flex-wrap items-center gap-3" style={{ '--d': '800ms' } as React.CSSProperties}>
          <Magnetic strength={0.3} radius={60}>
            <a
              href="#loop"
              className="flex h-14 items-center gap-2 rounded-full bg-accent px-7 font-semibold text-accent-ink transition-[filter] duration-150 hover:brightness-110"
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
            className="flex h-14 items-center rounded-full border border-line-strong px-7 font-semibold text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
          >
            {hero.ctaSecondary}
          </a>
        </div>
        <p className="fade-in mt-8 flex items-center gap-2.5 text-sm text-muted" style={{ '--d': '950ms' } as React.CSSProperties}>
          <span className="size-2 rounded-full bg-ok" aria-hidden="true" />
          {hero.available}
        </p>
      </div>
    </section>
  );
}
