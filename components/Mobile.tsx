import type { Content } from '@/content';

/** Mobile: título fijo a un lado y las apps en dos columnas, con la cifra de cada una adelante. */
export function Mobile({ mobile }: { mobile: Content['mobile'] }) {
  return (
    <section id="mobile" aria-labelledby="mobile-title" className="section-py">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <header className="lg:col-span-4">
          <div className="lg:sticky lg:top-28">
            <h2 id="mobile-title" data-reveal className="display text-[clamp(2.2rem,4vw,3.4rem)]">
              {mobile.title}
            </h2>
            <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="mt-6 max-w-[38ch] text-lg text-ink-dim">
              {mobile.intro}
            </p>
          </div>
        </header>

        <ol className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:col-span-8">
          {mobile.apps.map((app, i) => (
            <li key={app.name} data-reveal style={{ '--d': `${(i % 2) * 70}ms` } as React.CSSProperties} className="group">
              <h3 className="text-[1.6rem] font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-accent">
                {app.name}
              </h3>
              {app.stat && <p className="mt-1.5 font-bold text-accent">{app.stat}</p>}
              <p className="mt-1 text-sm text-ink-dim">{app.context}</p>
              <div className="mt-4 space-y-2.5">
                {app.points.map((p) => (
                  <p key={p} className="leading-relaxed text-ink-dim">
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-4 text-sm font-semibold text-ink">{app.stack.join(' · ')}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
