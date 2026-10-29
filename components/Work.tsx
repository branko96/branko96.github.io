import type { Content } from '@/content';

/** Estudio: productos de clientes que pasaron por el harness, más el kit open source. */
export function Work({ work }: { work: Content['work'] }) {
  return (
    <section id="work" aria-labelledby="work-title" className="section-py bg-raised">
      <div className="shell">
        <header className="grid gap-6 lg:grid-cols-2 lg:items-end">
          <h2 id="work-title" data-reveal className="display text-[clamp(2.2rem,5vw,4.4rem)]">
            {work.title}
          </h2>
          <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="max-w-[52ch] text-lg text-ink-dim">
            {work.intro}
          </p>
        </header>

        <div className="mt-14 grid items-start gap-14 md:grid-cols-2 md:gap-8">
          {work.projects.map((project, i) => (
            <article key={project.name} data-reveal style={{ '--d': `${i * 90}ms` } as React.CSSProperties} className={i ? 'md:mt-24' : ''}>
              <div className="work-image overflow-hidden rounded-2xl bg-ground">
                <img
                  src={`/projects/${project.image}.webp`}
                  alt={`${project.name}: ${work.imageAlt}`}
                  width={1200}
                  height={900}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover object-top"
                />
              </div>
              <h3 className="mt-7 text-3xl font-bold tracking-tight">{project.name}</h3>
              <p className="mt-2 text-xl font-medium">{project.tagline}</p>
              <p className="mt-3 max-w-[48ch] text-ink-dim">{project.body}</p>
              <p className="mt-5 text-sm font-semibold text-ink">{project.stack}</p>
            </article>
          ))}
        </div>

        <div data-reveal className="mt-16 grid gap-6 rounded-2xl bg-ground p-6 md:grid-cols-12 md:gap-10 md:p-10">
          <div className="md:col-span-5">
            <h3 className="text-3xl font-bold tracking-tight">{work.kit.name}</h3>
            <a
              href={work.kit.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-11 items-center gap-2 font-semibold text-accent underline underline-offset-4"
            >
              {work.kit.link}
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="md:col-span-7">
            <p className="text-lg leading-relaxed text-ink-dim">{work.kit.body}</p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {work.kit.skills.map((name) => (
                <li key={name}>
                  <code className="inline-flex h-10 items-center rounded-full bg-raised px-4 font-mono text-sm text-ink">/{name}</code>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
