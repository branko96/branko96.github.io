import type { Content } from '@/content';

/** Franja de cifras verificables: lo primero que un reclutador escanea después del hero. */
export function Proof({ proof }: { proof: Content['proof'] }) {
  return (
    <section aria-label={proof.label} className="shell">
      <dl className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 rounded-2xl bg-raised p-8 md:p-10">
        {proof.items.map((item, i) => (
          <div key={item.value} data-reveal style={{ '--d': `${i * 70}ms` } as React.CSSProperties}>
            <dt className="display text-[clamp(2.4rem,4vw,3.4rem)] tabular-nums text-ink">{item.value}</dt>
            <dd className="mt-3 max-w-[28ch] text-ink-dim">{item.text}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
