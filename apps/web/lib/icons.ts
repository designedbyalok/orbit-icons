import iconsData from 'orbit-icons/icons.json';

interface IconData {
  body: string;
  width?: number;
  height?: number;
}

interface IconSetData {
  prefix: string;
  icons: Record<string, IconData>;
  width?: number;
  height?: number;
}

const iconifyData = iconsData as IconSetData;

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
