import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ICONS, ICON_BY_NAME } from '@/data/icons';
import { OrbitIcon } from '@/components/orbit-icon';
import Link from 'next/link';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ICONS.map((icon) => ({
    slug: icon.name,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const icon = ICON_BY_NAME[slug];

  if (!icon) return {};

  const title = `${icon.name} Icon — Orbit Icons`;
  const description = `The ${icon.name} icon from the Orbit Icons pack. A minimal, 24x24 line icon in the ${icon.category} category.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      url: `/icons/${slug}`,
    },
    twitter: {
      card: 'summary',
      title,
      description,
    },
  };
}

export default async function IconPage({ params }: Props) {
  const { slug } = await params;
  const icon = ICON_BY_NAME[slug];

  if (!icon) {
    notFound();
  }

  return (
    <main className="icon-detail-page">
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">← Back to all icons</Link>
        </nav>
        
        <div className="icon-hero">
          <div className="icon-display">
            <OrbitIcon name={icon.name} size={128} strokeWidth={1.5} />
          </div>
          <div className="icon-info">
            <h1>{icon.name}</h1>
            <p className="category">Category: {icon.category}</p>
            <div className="actions">
              <Link href={`/?select=${icon.name}`} className="btn-primary">
                View in App
              </Link>
            </div>
          </div>
        </div>

        <section className="icon-specs">
          <h2>Specifications</h2>
          <ul>
            <li><strong>Grid</strong> 24 × 24 pixels</li>
            <li><strong>Stroke</strong> 1.5 pixels</li>
            <li><strong>Ends</strong> Rounded caps</li>
            <li><strong>Format</strong> SVG / React</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
