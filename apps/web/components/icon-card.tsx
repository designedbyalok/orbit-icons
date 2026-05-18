'use client';

import Link from 'next/link';
import type { IconEntry } from '@/lib/icons';

interface IconCardProps {
  icon: IconEntry;
}

export function IconCard({ icon }: IconCardProps) {
  return (
    <Link
      href={`/icon/${icon.name}`}
      className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 hover:bg-card-hover hover:border-accent/40 transition-all"
    >
      <div className="flex h-10 w-10 items-center justify-center text-foreground group-hover:text-accent transition-colors">
        <svg
          width="24"
          height="24"
          viewBox={`0 0 ${icon.width} ${icon.height}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          dangerouslySetInnerHTML={{ __html: icon.body }}
        />
      </div>
      <span className="text-xs text-muted group-hover:text-foreground truncate max-w-full transition-colors">
        {icon.name}
      </span>
    </Link>
  );
}
