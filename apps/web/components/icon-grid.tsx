'use client';

import { useState, useMemo } from 'react';
import { SearchBar } from './search-bar';
import { IconCard } from './icon-card';
import type { IconEntry } from '@/lib/icons';
import { searchIcons } from '@/lib/search';

interface IconGridProps {
  icons: IconEntry[];
}

export function IconGrid({ icons }: IconGridProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => searchIcons(icons, query), [icons, query]);

  return (
    <div>
      <SearchBar
        value={query}
        onChange={setQuery}
        iconCount={filtered.length}
        totalCount={icons.length}
      />
      <div className="mt-6 grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
        {filtered.map((icon) => (
          <IconCard key={icon.name} icon={icon} />
        ))}
      </div>
      {filtered.length === 0 && (
        <div className="mt-12 text-center text-muted">
          <p className="text-lg">No icons found</p>
          <p className="mt-1 text-sm">Try a different search term</p>
        </div>
      )}
    </div>
  );
}
