import { promises as fs } from 'fs';
import path from 'path';
import { importDirectory } from '@iconify/tools/lib/import/directory';
import { cleanupSVG } from '@iconify/tools/lib/svg/cleanup';
import { runSVGO } from '@iconify/tools/lib/optimise/svgo';
import { parseColors, isEmptyColor } from '@iconify/tools/lib/colors/parse';
import { generateReactComponents } from './generate-components';

const ROOT = path.resolve(import.meta.dirname, '..');
const SVG_DIR = path.join(ROOT, 'svg');
const DIST_DIR = path.join(ROOT, 'dist');

async function build() {
  await fs.rm(DIST_DIR, { recursive: true, force: true });
  await fs.mkdir(DIST_DIR, { recursive: true });

  console.log('Importing SVGs...');
  const iconSet = await importDirectory(SVG_DIR, { prefix: 'orbit' });
  console.log(`Found ${iconSet.count()} icons`);

  iconSet.forEachSync((name, type) => {
    if (type !== 'icon') return;

    const svg = iconSet.toSVG(name);
    if (!svg) {
      iconSet.remove(name);
      return;
    }

    try {
      cleanupSVG(svg);
      parseColors(svg, {
        defaultColor: 'currentColor',
        callback: (_attr, colorStr, color) => {
          return !color || isEmptyColor(color) ? colorStr : 'currentColor';
        },
      });

      // Remove hardcoded stroke-width to allow global control
      const cleaned = svg.toString().replace(/stroke-width="[^"]*"/g, '');
      svg.load(cleaned);

      runSVGO(svg);
    } catch (err) {
      console.error(`Error processing ${name}:`, err);
      iconSet.remove(name);
      return;
    }

    iconSet.fromSVG(name, svg);
  });

  const exported = iconSet.export();
  const iconsJson = JSON.stringify(exported, null, '\t') + '\n';
  await fs.writeFile(path.join(DIST_DIR, 'icons.json'), iconsJson, 'utf8');
  console.log(`Exported icons.json with ${Object.keys(exported.icons).length} icons`);

  await generateReactComponents(exported, DIST_DIR);

  console.log('Build complete!');
}

build().catch((err) => {
  console.error('Build failed:', err);
  process.exit(1);
});
