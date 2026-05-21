import type { Metadata } from 'next';
import { Inter, Newsreader, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  style: ['normal', 'italic'],
  weight: ['400', '500'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://orbit-icons.vercel.app'),
  title: {
    default: 'Orbit Icons — Open Source Icon Pack',
    template: '%s | Orbit Icons',
  },
  description:
    'A minimal, system-driven set of line icons. Each mark is drawn on a 24-pixel grid with a 1.5-pixel stroke, rounded ends, and consistent optical weight.',
  keywords: ['icons', 'svg', 'react', 'icon pack', 'open source', 'orbit-icons', 'line icons'],
  authors: [{ name: 'Alok', url: 'https://designedbyalok.com' }],
  creator: 'Alok',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://orbit-icons.vercel.app',
    title: 'Orbit Icons — Open Source Icon Pack',
    description: 'A minimal, system-driven set of line icons. 24x24 grid, 1.5px stroke.',
    siteName: 'Orbit Icons',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Orbit Icons — Open Source Icon Pack',
    description: 'A minimal, system-driven set of line icons. 24x24 grid, 1.5px stroke.',
    creator: '@designedbyalok',
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Orbit Icons',
    description: 'A minimal, system-driven set of line icons.',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    author: {
      '@type': 'Person',
      name: 'Alok',
    },
    license: 'https://opensource.org/licenses/MIT',
  };

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${newsreader.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
