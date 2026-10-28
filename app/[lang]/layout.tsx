import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import '../globals.css';
import { getContent, isLang, LANGS } from '@/content';
import { fontVariables } from '@/lib/fonts';
import { CV_PATH, EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';
import { THEME_SCRIPT } from '@/lib/theme-script';
import { PaletteStyles } from '@/components/PaletteStyles';
import { DEFAULT_PALETTE } from '@/lib/palettes';

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const { meta } = getContent(lang);
  return {
    metadataBase: new URL(SITE_URL),
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/${lang}/`, languages: { en: '/en/', es: '/es/', 'x-default': '/en/' } },
    openGraph: {
      type: 'profile',
      url: `/${lang}/`,
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      locale: meta.ogLocale,
      images: [{ url: '/og.png', width: 1200, height: 630, alt: meta.title }],
    },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: ['/og.png'] },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#110221' },
    { media: '(prefers-color-scheme: light)', color: '#f9f6fc' },
  ],
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: SITE_NAME,
  url: SITE_URL,
  email: `mailto:${EMAIL}`,
  jobTitle: 'Senior React Native & AI Engineer',
  address: { '@type': 'PostalAddress', addressLocality: 'Bahía Blanca', addressCountry: 'AR' },
  sameAs: ['https://github.com/branko96', 'https://www.linkedin.com/in/branko-ott'],
  knowsAbout: ['React Native', 'AI agents', 'Agent harness design', 'Claude Code', 'Next.js', 'NestJS'],
  subjectOf: { '@type': 'DigitalDocument', url: `${SITE_URL}${CV_PATH}` },
};

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return (
    <html lang={lang} data-theme="dark" data-palette={DEFAULT_PALETTE} className={fontVariables} suppressHydrationWarning>
      <head>
        <PaletteStyles />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
        {children}
      </body>
    </html>
  );
}
