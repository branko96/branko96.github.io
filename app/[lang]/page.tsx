import { notFound } from 'next/navigation';
import { Contact } from '@/components/Contact';
import { Craft } from '@/components/Craft';
import { Experience } from '@/components/Experience';
import { Footer } from '@/components/Footer';
import { BranchRail } from '@/components/fx/BranchRail';
import { Effects } from '@/components/fx/Effects';
import { Hero } from '@/components/Hero';
import { Hire } from '@/components/Hire';
import { Loop } from '@/components/Loop';
import { Marquee } from '@/components/Marquee';
import { Mobile } from '@/components/Mobile';
import { Navbar } from '@/components/Navbar';
import { PaletteLab } from '@/components/PaletteLab';
import { SkillsChain } from '@/components/SkillsChain';
import { getContent, isLang } from '@/content';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const c = getContent(lang);

  return (
    <>
      <Effects />
      <Navbar lang={lang} nav={c.nav} />
      <BranchRail />
      <main id="main">
        <Hero hero={c.hero} />
        <Marquee items={c.marquee} label={lang === 'en' ? 'Tools I work with' : 'Herramientas con las que trabajo'} />
        <Loop loop={c.loop} />
        <Craft craft={c.craft} />
        <Hire hire={c.hire} />
        <SkillsChain skills={c.skills} />
        <Mobile mobile={c.mobile} />
        <Experience experience={c.experience} />
        <Contact contact={c.contact} lang={lang} />
      </main>
      <Footer lang={lang} nav={c.nav} contact={c.contact} />
      <PaletteLab />
    </>
  );
}
