import type { Content } from '@/content';

/** La cadena de skills como lo que es: comandos que se pasan la posta, en orden. */
export function SkillsChain({ skills }: { skills: Content['skills'] }) {
  return (
    <section id="skills" aria-labelledby="skills-title" className="section-py">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <h2 id="skills-title" data-reveal className="display text-[clamp(2.2rem,4.4vw,3.8rem)] lg:col-span-7">
            {skills.title}
          </h2>
          <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="text-lg text-ink-dim lg:col-span-5 lg:self-end">
            {skills.intro}
          </p>
        </div>

        <ol className="mt-14">
          {skills.chain.map((s, i) => (
            <li
              key={s.name}
              data-reveal
              style={{ '--d': `${i * 70}ms` } as React.CSSProperties}
              className="group grid gap-3 rounded-2xl px-1 py-7 transition-colors duration-300 md:grid-cols-12 md:gap-10 md:px-6 md:hover:bg-raised"
            >
              <code className="font-mono text-[clamp(1.4rem,2.6vw,2.2rem)] font-semibold leading-tight text-accent md:col-span-5">
                /{s.name}
              </code>
              <p className="max-w-[56ch] text-lg leading-relaxed text-ink-dim md:col-span-7 md:self-center">{s.does}</p>
            </li>
          ))}
        </ol>

        <div data-reveal className="mt-10 grid gap-3 md:grid-cols-12 md:gap-10">
          <p className="text-xl font-semibold leading-snug text-ink md:col-span-8">{skills.note}</p>
          <p className="text-sm text-muted md:col-span-4">{skills.credit}</p>
        </div>
      </div>
    </section>
  );
}
