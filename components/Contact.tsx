import type { Content, Lang } from '@/content';
import { CV_PATH } from '@/lib/site';
import { Magnetic } from './fx/Magnetic';
import { Overlap } from './Overlap';

/** Contacto: campo de color pleno con las acciones y el solapamiento horario en vivo. */
export function Contact({ contact, lang }: { contact: Content['contact']; lang: Lang }) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="px-2 md:px-4">
      <div data-wipe className="field section-py rounded-[28px]">
        <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h2 id="contact-title" data-reveal className="display text-[clamp(2.6rem,6vw,5.4rem)]">
              {contact.title}
            </h2>
            <p data-reveal style={{ '--d': '90ms' } as React.CSSProperties} className="mt-6 max-w-[46ch] text-lg text-ink">
              {contact.text}
            </p>
            <div data-reveal style={{ '--d': '160ms' } as React.CSSProperties} className="mt-10 flex flex-wrap items-center gap-3">
              <Magnetic strength={0.3} radius={60}>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex h-14 items-center rounded-full bg-on-field px-7 font-semibold text-field transition-transform duration-150 active:scale-[0.98]"
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
                  className="flex h-14 items-center rounded-full bg-on-field/12 px-6 font-semibold transition-colors duration-150 hover:bg-on-field/22"
                >
                  {l.label}
                </a>
              ))}
              <a href={CV_PATH} download className="flex h-14 items-center px-3 font-semibold underline underline-offset-4">
                {contact.cv}
              </a>
            </div>
          </div>
          <div data-reveal style={{ '--d': '220ms' } as React.CSSProperties} className="lg:col-span-5 lg:self-end">
            <Overlap copy={contact.overlap} lang={lang} />
          </div>
        </div>
      </div>
    </section>
  );
}
