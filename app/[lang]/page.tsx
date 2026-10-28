import { notFound } from 'next/navigation';
import { Contact } from '@/components/Contact';
import { Craft } from '@/components/Craft';
import { Experience } from '@/components/Experience';
import { Effects } from '@/components/fx/Effects';
import { PageBackdrop } from '@/components/fx/PageBackdrop';
import { Hero } from '@/components/Hero';
import { Loop } from '@/components/Loop';
import { Mobile } from '@/components/Mobile';
import { Navbar } from '@/components/Navbar';
import { ProofStrip } from '@/components/ProofStrip';
import { SkillsChain } from '@/components/SkillsChain';
import { getContent, isLang } from '@/content';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);

  return (
    <>
      <PageBackdrop />
      <Effects />
      <Navbar lang={lang} nav={c.nav} />
      <main id="main">
        <Hero hero={c.hero} />
        <ProofStrip stats={c.stats} />
        <Loop loop={c.loop} />
        <Craft craft={c.craft} />
        <SkillsChain skills={c.skills} />
        <Mobile mobile={c.mobile} />
        <Experience experience={c.experience} />
        <Contact contact={c.contact} />
      </main>
    </>
  );
}
