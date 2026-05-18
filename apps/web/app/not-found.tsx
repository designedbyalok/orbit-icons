import Link from 'next/link';
import { Header } from '@/components/header';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 text-center">
        <h1 className="text-4xl font-bold">404</h1>
        <p className="mt-2 text-muted">Icon not found</p>
        <Link
          href="/"
          className="mt-6 inline-flex rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
        >
          Browse all icons
        </Link>
      </main>
    </>
  );
}
