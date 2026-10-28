import type { Stat } from '@/content';
import { Counter } from './fx/Counter';

export function ProofStrip({ stats }: { stats: Stat[] }) {
  return (
    <section aria-label="Numbers" data-backdrop="0.7" className="border-y border-line">
      <dl className="shell grid grid-cols-2 gap-x-6 gap-y-8 py-10 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <div key={s.label} data-reveal style={{ '--d': `${i * 70}ms` } as React.CSSProperties} className="flex flex-col-reverse gap-1">
            <dt className="text-sm leading-snug text-ink-dim">{s.label}</dt>
            <dd className="text-brand-gradient font-display text-4xl font-semibold tabular-nums tracking-tight md:text-5xl">
              <Counter value={s.value} prefix={s.prefix} suffix={s.suffix} />
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
