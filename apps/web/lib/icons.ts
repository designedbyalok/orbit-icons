import iconsData from 'orbit-icons/icons.json';
import type { IconifyJSON } from '@iconify/utils';

export const iconifyData = iconsData as IconifyJSON;

export interface IconEntry {
  name: string;
  body: string;
  width: number;
  height: number;
}

export function getAllIcons(): IconEntry[] {
  const defaultWidth = iconifyData.width ?? 24;
  const defaultHeight = iconifyData.height ?? 24;

  return Object.entries(iconifyData.icons).map(([name, icon]) => ({
    name,
    body: icon.body,
    width: icon.width ?? defaultWidth,
    height: icon.height ?? defaultHeight,
  }));
}

export function getIcon(name: string): IconEntry | null {
  const icon = iconifyData.icons[name];
  if (!icon) return null;

  return {
    name,
    body: icon.body,
    width: icon.width ?? (iconifyData.width ?? 24),
    height: icon.height ?? (iconifyData.height ?? 24),
  };
}

export function getAllIconNames(): string[] {
  return Object.keys(iconifyData.icons);
}
