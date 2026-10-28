import type { Content } from '@/content';
import { SectionHead } from './SectionHead';

export function SkillsChain({ skills }: { skills: Content['skills'] }) {
  return (
    <section id="skills" data-backdrop="0.45" aria-labelledby="skills-title" className="section-py">
      <div className="shell">
        <SectionHead id="skills-title" eyebrow={skills.eyebrow} title={skills.title} intro={skills.intro} />
        <ol className="relative mt-12 grid gap-px overflow-hidden rounded-[18px] border border-line bg-line md:grid-cols-2 lg:grid-cols-4">
          {skills.chain.map((s, i) => (
            <li
              key={s.name}
              data-reveal
              data-glow
              style={{ '--d': `${i * 90}ms` } as React.CSSProperties}
              className="relative bg-ground p-6 md:p-7"
            >
              <p className="font-mono text-[0.95rem] text-accent">
                <span className="text-muted">/</span>
                {s.name}
              </p>
              <p className="mt-3 text-[0.95rem] leading-relaxed text-ink-dim">{s.does}</p>
              {i < skills.chain.length - 1 && (
                <span aria-hidden="true" className="absolute bottom-6 right-6 hidden font-mono text-muted lg:block">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
        <div data-reveal className="mt-8 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] md:gap-10">
          <p className="font-serif text-xl italic leading-snug text-ink">{skills.note}</p>
          <p className="text-sm text-muted">{skills.credit}</p>
        </div>
      </div>
    </section>
  );
}
