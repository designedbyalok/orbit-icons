import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Orbit Icons — Open Source Icon Pack',
  description:
    'A beautifully crafted open-source icon pack. Browse, search, download, and copy icons as SVG, React components, or install via npm.',
  keywords: ['icons', 'svg', 'react', 'icon pack', 'open source', 'orbit-icons'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-background text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
