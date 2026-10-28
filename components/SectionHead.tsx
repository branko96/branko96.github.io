export function SectionHead({ id, eyebrow, title, intro }: { id: string; eyebrow: string; title: string; intro?: string }) {
  return (
    <header className="max-w-3xl" data-reveal>
      <p className="eyebrow text-accent">{eyebrow}</p>
      <h2 id={id} className="mt-4 text-[clamp(2.1rem,4.6vw,3.6rem)] font-semibold leading-none tracking-[-0.03em]">
        {title}
      </h2>
      {intro && <p className="mt-6 max-w-[60ch] text-ink-dim">{intro}</p>}
    </header>
  );
}
