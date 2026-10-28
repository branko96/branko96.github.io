import type { Content } from '@/content';
import { SectionHead } from './SectionHead';

export function Experience({ experience: x }: { experience: Content['experience'] }) {
  return (
    <section id="experience" data-backdrop="0.3" aria-labelledby="experience-title" className="section-py">
      <div className="shell">
        <SectionHead id="experience-title" eyebrow={x.eyebrow} title={x.title} />

        <ol className="mt-12">
          {x.roles.map((r) => (
            <li
              key={`${r.company}-${r.period}`}
              data-reveal
              className="grid gap-2 border-t border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-10"
            >
              <div>
                <p className="font-display text-xl font-semibold tracking-tight">{r.company}</p>
                <p className="mt-1 font-mono text-[0.78rem] text-muted tabular-nums">{r.period}</p>
                {r.meta && <p className="mt-1 text-sm text-muted">{r.meta}</p>}
              </div>
              <div>
                <h3 className="text-lg font-semibold tracking-tight text-ink">{r.title}</h3>
                <ul className="mt-3 space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="relative pl-5 text-[0.97rem] leading-relaxed text-ink-dim">
                      <span aria-hidden="true" className="absolute left-0 top-[0.72em] h-px w-2.5 bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>

        <div data-reveal className="grid gap-2 border-t border-line py-8 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-10">
          <h3 className="font-display text-xl font-semibold tracking-tight">{x.earlierTitle}</h3>
          <ul className="space-y-2">
            {x.earlier.map((e) => (
              <li key={e} className="text-[0.97rem] leading-relaxed text-ink-dim">
                {e}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <div data-reveal className="rounded-[18px] border border-line p-6 md:p-8">
            <h3 className="eyebrow text-accent">{x.stackTitle}</h3>
            <dl className="mt-5 space-y-4">
              {x.stack.map((s) => (
                <div key={s.area} className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-4">
                  <dt className="font-semibold text-ink">{s.area}</dt>
                  <dd className="text-[0.95rem] leading-relaxed text-ink-dim">{s.items}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="flex flex-col gap-6 rounded-[18px] border border-line p-6 md:p-8">
            <div>
              <h3 className="eyebrow text-accent">{x.certTitle}</h3>
              <p className="mt-4 font-semibold text-ink">{x.cert.name}</p>
              <p className="text-sm text-muted">{x.cert.by}</p>
              <a
                href={x.cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-accent underline-offset-4 hover:underline"
              >
                {x.cert.verify} ↗
              </a>
            </div>
            <div>
              <h3 className="eyebrow text-accent">{x.educationTitle}</h3>
              <ul className="mt-4 space-y-2">
                {x.education.map((e) => (
                  <li key={e} className="text-[0.95rem] leading-relaxed text-ink-dim">
                    {e}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
