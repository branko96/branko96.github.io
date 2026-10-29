import type { Content } from '@/content';

export function Experience({ experience: x }: { experience: Content['experience'] }) {
  return (
    <section id="experience" aria-labelledby="experience-title" className="section-py bg-raised">
      <div className="shell">
        <h2 id="experience-title" data-reveal className="display text-[clamp(2.2rem,4.4vw,3.8rem)]">
          {x.title}
        </h2>

        <ol className="mt-10">
          {x.roles.map((r) => (
            <li
              key={`${r.company}-${r.period}`}
              data-reveal
              className="grid gap-3 py-6 md:grid-cols-12 md:gap-10 md:py-7"
            >
              <div className="md:col-span-4">
                <p className="display text-[1.6rem] leading-none">{r.company}</p>
                <p className="mt-2 font-semibold tabular-nums text-ink-dim">{r.period}</p>
                {r.meta && <p className="mt-1 text-sm text-muted">{r.meta}</p>}
              </div>
              <div className="md:col-span-8">
                <h3 className="text-lg font-bold">{r.title}</h3>
                <ul className="mt-3 space-y-2">
                  {r.points.map((p) => (
                    <li key={p} className="relative max-w-[66ch] pl-5 leading-relaxed text-ink-dim">
                      <span aria-hidden="true" className="absolute left-0 top-[0.62em] size-1.5 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
          <li data-reveal className="grid gap-3 py-6 md:grid-cols-12 md:gap-10 md:py-7">
            <h3 className="display text-[1.6rem] leading-none md:col-span-4">{x.earlierTitle}</h3>
            <ul className="space-y-2 md:col-span-8">
              {x.earlier.map((e) => (
                <li key={e} className="max-w-[66ch] leading-relaxed text-ink-dim">
                  {e}
                </li>
              ))}
            </ul>
          </li>
        </ol>

        <div className="mt-10 grid gap-3 lg:grid-cols-12">
          <div data-reveal className="rounded-2xl bg-ground p-6 md:p-9 lg:col-span-8">
            <h3 className="text-xl font-bold">{x.stackTitle}</h3>
            <dl className="mt-6 space-y-4">
              {x.stack.map((s) => (
                <div key={s.area} className="grid gap-1 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6">
                  <dt className="font-bold text-ink">{s.area}</dt>
                  <dd className="leading-relaxed text-ink-dim">{s.items}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="flex flex-col gap-8 rounded-2xl bg-ground p-6 md:p-9 lg:col-span-4">
            <div>
              <h3 className="text-xl font-bold">{x.certTitle}</h3>
              <p className="mt-4 font-semibold text-ink">{x.cert.name}</p>
              <p className="text-ink-dim">{x.cert.by}</p>
              <a
                href={x.cert.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 inline-flex min-h-11 items-center font-semibold text-accent underline underline-offset-4"
              >
                {x.cert.verify}
              </a>
            </div>
            <div>
              <h3 className="text-xl font-bold">{x.educationTitle}</h3>
              <ul className="mt-4 space-y-2">
                {x.education.map((e) => (
                  <li key={e} className="leading-relaxed text-ink-dim">
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
