import type { Metadata } from 'next';
import '../globals.css';
import { SITE_URL } from '@/lib/site';
import { THEME_SCRIPT } from '@/lib/theme-script';
import { PaletteStyles } from '@/components/PaletteStyles';
import { DEFAULT_PALETTE } from '@/lib/palettes';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Branko Ottavianelli',
  alternates: { languages: { en: '/en/', es: '/es/' } },
  robots: { index: false },
};

export default function RedirectLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-palette={DEFAULT_PALETTE} suppressHydrationWarning>
      <head>
        <PaletteStyles />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
