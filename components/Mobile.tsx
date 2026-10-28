import type { Content } from '@/content';
import { PhoneChat } from './PhoneChat';

/** Mobile: el teléfono fijo a un lado y las apps como lista editorial, no como grilla de tarjetas. */
export function Mobile({ mobile }: { mobile: Content['mobile'] }) {
  return (
    <section id="mobile" aria-labelledby="mobile-title" className="section-py">
      <div className="shell grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-24">
            <h2 id="mobile-title" data-reveal className="display text-[clamp(2.2rem,4vw,3.4rem)]">
              {mobile.title}
            </h2>
            <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="mt-6 max-w-[42ch] text-lg text-ink-dim">
              {mobile.intro}
            </p>
            <div data-reveal style={{ '--d': '160ms' } as React.CSSProperties} className="mt-12">
              <PhoneChat phone={mobile.phone} />
            </div>
          </div>
        </div>

        <ol className="lg:col-span-7">
          {mobile.apps.map((app) => (
            <li key={app.name} data-reveal className="group py-8 first:pt-0 md:py-10">
              <h3 className="display text-[clamp(1.9rem,3.6vw,3rem)] transition-colors duration-300 group-hover:text-accent">
                {app.name}
              </h3>
              <p className="mt-2 text-lg">
                {app.stat && <span className="font-bold text-accent">{app.stat}. </span>}
                <span className="text-ink-dim">{app.context}</span>
              </p>
              <div className="mt-4 space-y-2.5">
                {app.points.map((p) => (
                  <p key={p} className="max-w-[58ch] leading-relaxed text-ink-dim">
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
