import Fuse from 'fuse.js';
import type { IconEntry } from './icons';

let fuseInstance: Fuse<IconEntry> | null = null;

export function getSearchIndex(icons: IconEntry[]): Fuse<IconEntry> {
  if (!fuseInstance) {
    fuseInstance = new Fuse(icons, {
      keys: ['name'],
      threshold: 0.3,
      distance: 100,
    });
  }
  return fuseInstance;
}

export function searchIcons(icons: IconEntry[], query: string): IconEntry[] {
  if (!query.trim()) return icons;
  const fuse = getSearchIndex(icons);
  return fuse.search(query).map((result) => result.item);
}
