import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getAllIconNames, getIcon } from '@/lib/icons';
import { getSvgSnippet, getReactSnippet } from '@/lib/copy';
import { Header } from '@/components/header';
import { IconPreview } from '@/components/icon-preview';
import { DownloadButtons } from '@/components/download-buttons';
import { CodeBlock } from '@/components/code-block';
import { InstallTabs } from '@/components/install-tabs';

interface PageProps {
  params: Promise<{ name: string }>;
}

export async function generateStaticParams() {
  return getAllIconNames().map((name) => ({ name }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { name } = await params;
  const pascalName = name
    .split('-')
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');

  return {
    title: `${pascalName} — Orbit Icons`,
    description: `Download or copy the ${pascalName} icon from Orbit Icons. Available as SVG, PNG, JPEG, or React component.`,
  };
}

export default async function IconPage({ params }: PageProps) {
  const { name } = await params;
  const icon = getIcon(name);

  if (!icon) {
    notFound();
  }

  const svgSnippet = getSvgSnippet(icon.body, icon.width, icon.height);
  const reactSnippet = getReactSnippet(icon.name);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to all icons
        </Link>

        <h1 className="text-2xl font-bold tracking-tight mb-8">{name}</h1>

        <div className="space-y-8">
          <IconPreview body={icon.body} width={icon.width} height={icon.height} name={icon.name} />

          <div>
            <h2 className="text-sm font-medium text-muted mb-3">Download</h2>
            <DownloadButtons name={icon.name} body={icon.body} width={icon.width} height={icon.height} />
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted mb-3">Copy as SVG</h2>
            <CodeBlock code={svgSnippet} label="SVG" />
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted mb-3">Use in React</h2>
            <CodeBlock code={reactSnippet} label="React" />
          </div>

          <div>
            <h2 className="text-sm font-medium text-muted mb-3">Install</h2>
            <InstallTabs />
          </div>
        </div>
      </main>
    </>
  );
}
