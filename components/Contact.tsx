import type { Content } from '@/content';
import { CV_PATH } from '@/lib/site';
import { BOMark } from './BOMark';
import { Magnetic } from './fx/Magnetic';

export function Contact({ contact }: { contact: Content['contact'] }) {
  return (
    <section id="contact" data-backdrop="1" aria-labelledby="contact-title" className="section-py">
      <div className="shell">
        <div data-reveal className="max-w-4xl">
          <p className="eyebrow text-accent">{contact.eyebrow}</p>
          <h2 id="contact-title" className="mt-4 text-[clamp(2.4rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.035em]">
            {contact.title}
          </h2>
          <p className="mt-6 max-w-[56ch] text-ink-dim">{contact.text}</p>
        </div>
        <div data-reveal className="mt-10 flex flex-wrap items-center gap-3">
          <Magnetic strength={0.3} radius={60}>
            <a
              href={`mailto:${contact.email}`}
              className="flex h-14 items-center rounded-full bg-accent px-7 font-semibold text-accent-ink transition-[filter] duration-150 hover:brightness-110"
            >
              {contact.email}
            </a>
          </Magnetic>
          {contact.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer me"
              className="flex h-14 items-center rounded-full border border-line-strong px-6 font-semibold text-ink transition-colors duration-150 hover:border-accent hover:text-accent"
            >
              {l.label} ↗
            </a>
          ))}
          <a
            href={CV_PATH}
            download
            className="flex h-14 items-center px-3 font-semibold text-ink-dim underline-offset-4 hover:text-ink hover:underline"
          >
            {contact.cv}
          </a>
        </div>
      </div>
      <footer className="shell mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 text-sm text-muted">
        <span className="flex items-center gap-3">
          <BOMark className="h-5 text-accent" />© {new Date().getFullYear()} Branko Ottavianelli
        </span>
        <span>{contact.footer}</span>
      </footer>
    </section>
  );
}
