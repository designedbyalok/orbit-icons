import { getAllIcons } from '@/lib/icons';
import { IconGrid } from '@/components/icon-grid';
import { Header } from '@/components/header';

export default function HomePage() {
  const icons = getAllIcons();

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Orbit Icons
          </h1>
          <p className="mt-2 text-muted max-w-2xl">
            A beautifully crafted open-source icon pack. Browse, search, and download
            icons as SVG, PNG, or JPEG. Copy as React components or install via npm.
          </p>
        </div>
        <IconGrid icons={icons} />
      </main>
    </>
  );
}
