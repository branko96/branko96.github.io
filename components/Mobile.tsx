import type { Content } from '@/content';
import { SectionHead } from './SectionHead';

export function Mobile({ mobile }: { mobile: Content['mobile'] }) {
  return (
    <section id="mobile" data-backdrop="0.6" aria-labelledby="mobile-title" className="section-py">
      <div className="shell">
        <SectionHead id="mobile-title" eyebrow={mobile.eyebrow} title={mobile.title} intro={mobile.intro} />
        <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mobile.apps.map((app, i) => (
            <li
              key={app.name}
              data-reveal
              style={{ '--d': `${(i % 3) * 80}ms` } as React.CSSProperties}
            >
              <article data-tilt data-glow className="flex h-full flex-col rounded-[18px] border border-line bg-raised/40 p-6 md:p-7">
                <p className="text-xs uppercase tracking-[0.12em] text-muted">{app.context}</p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight">{app.name}</h3>
                {app.stat && <p className="mt-1 font-serif text-lg italic text-accent">{app.stat}</p>}
                <ul className="mt-4 space-y-2.5">
                  {app.points.map((p) => (
                    <li key={p} className="text-[0.95rem] leading-relaxed text-ink-dim">
                      {p}
                    </li>
                  ))}
                </ul>
                <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Stack">
                  {app.stack.map((t) => (
                    <li key={t} className="rounded-full border border-line px-2.5 py-1 font-mono text-[0.7rem] text-ink-dim">
                      {t}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
