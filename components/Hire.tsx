import type { Content } from '@/content';
import { EMAIL } from '@/lib/site';
import { Magnetic } from './fx/Magnetic';

/** Qué puedo hacer por un equipo: tres ofertas en bloques grandes, no tarjetas. */
export function Hire({ hire }: { hire: Content['hire'] }) {
  return (
    <section id="hire" aria-labelledby="hire-title" className="section-py bg-raised">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="hire-title" data-reveal className="display text-[clamp(2.2rem,4.6vw,4rem)] lg:col-span-8">
            {hire.title}
          </h2>
          <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="text-lg text-ink-dim lg:col-span-4 lg:self-end">
            {hire.intro}
          </p>
        </div>

        <ol className="mt-16 space-y-16 md:mt-20">
          {hire.offers.map((o, i) => (
            <li key={o.title} className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-5" data-reveal>
                <h3 className="display text-[clamp(1.6rem,2.8vw,2.4rem)] leading-[1.02]">{o.title}</h3>
              </div>
              <div className="lg:col-span-7" data-reveal style={{ '--d': '80ms' } as React.CSSProperties}>
                <p className="max-w-[58ch] text-lg leading-relaxed text-ink">{o.body}</p>
                <ul className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2">
                  {o.points.map((p) => (
                    <li key={p} className="flex gap-3 text-ink-dim">
                      <svg viewBox="0 0 20 20" className="mt-1 size-4 shrink-0 text-accent" aria-hidden="true">
                        <path d="M4.5 10.5l3.5 3.5 7.5-8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              {i < hire.offers.length - 1 && <span aria-hidden="true" className="h-2 lg:col-span-12" />}
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-16">
          <Magnetic strength={0.3} radius={60}>
            <a
              href={`mailto:${EMAIL}`}
              className="flex h-14 items-center gap-2 rounded-full bg-accent px-7 font-semibold text-accent-ink transition-transform duration-150 active:scale-[0.98]"
            >
              {hire.cta}
              <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
