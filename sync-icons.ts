import { readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const ROOT = resolve(process.cwd());
const ICONS_JSON_PATH = join(ROOT, 'packages/orbit-icons/dist/icons.json');
const TARGET_PATH = join(ROOT, 'apps/web/data/icons.ts');

const CATEGORY_MAPPING: Record<string, string> = {
  'action-controls': 'Controls',
  'ai-icons': 'AI',
  'arrows-navigation': 'Arrows',
  'charts': 'Charts',
  'chevron': 'Arrows',
  'clinical-medical': 'Medical',
  'commnication-phone-calls': 'Communication',
  'communication-chat-sms': 'Communication',
  'communication-email-efax': 'Communication',
  'country-flags': 'Flags',
  'design-editing-tools': 'Editing',
  'document-files': 'Files',
  'emoji': 'Emoji',
  'finances': 'Finance',
  'health-vitals-measurements': 'Health',
  'interface': 'Interface',
  'media-entertainment': 'Media',
  'notification-alerts': 'Alerts',
  'others': 'Misc',
  'security-privacy': 'Security',
  'social-engagement': 'Social',
  'status-feedback': 'Status',
  'storage-cloud': 'Storage',
  'task-workflow': 'Workflow',
  'tech': 'Tech',
  'text-formatting': 'Typography',
  'time-calendar': 'Time',
  'user-management': 'User',
};

function sync() {
  const raw = readFileSync(ICONS_JSON_PATH, 'utf8');
  const data = JSON.parse(raw);
  const icons = data.icons;
  const defaultWidth = data.width || 24;
  const defaultHeight = data.height || 24;

  const entries = Object.entries(icons).map(([name, icon]: [string, any]) => {
    const slug = name.split('-')[0] + '-' + (name.split('-')[1] || '');
    let category = CATEGORY_MAPPING[slug];
    if (!category) {
      category = CATEGORY_MAPPING[name.split('-')[0]] || 'Misc';
    }

    return {
      name,
      category,
      svg: icon.body,
      width: icon.width || defaultWidth,
      height: icon.height || defaultHeight
    };
  });

  const content = `export interface IconEntry {
  name: string;
  category: string;
  svg: string;
  width: number;
  height: number;
}

export const ICONS: IconEntry[] = ${JSON.stringify(entries, null, 2)};

export const ICON_BY_NAME: Record<string, IconEntry> = ICONS.reduce((acc, icon) => {
  acc[icon.name] = icon;
  return acc;
}, {} as Record<string, IconEntry>);
`;

  writeFileSync(TARGET_PATH, content, 'utf8');
  console.log(`Synced ${entries.length} icons to ${TARGET_PATH}`);
}

sync();
