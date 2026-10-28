/** Cinta del stack: dos copias de la lista desplazándose; la segunda es solo visual. */
export function Marquee({ items, label }: { items: string[]; label: string }) {
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {items.map((item) => (
        <li key={item} className="display whitespace-nowrap text-[clamp(1.5rem,3vw,2.4rem)] text-ink-dim">
          {item}
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={label} className="marquee-host overflow-hidden bg-raised py-7">
      <div className="marquee flex w-max" style={{ '--dur': `${items.length * 3.2}s` } as React.CSSProperties}>
        {row(false)}
        {row(true)}
      </div>
    </section>
  );
}
