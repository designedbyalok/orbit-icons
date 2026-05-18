import { defineConfig } from 'tsup';
import { readdirSync } from 'fs';
import path from 'path';

function getIconEntries(): Record<string, string> {
  const iconsDir = path.resolve('dist/icons');
  const entries: Record<string, string> = {};
  try {
    for (const file of readdirSync(iconsDir)) {
      if (file.endsWith('.tsx')) {
        const name = file.replace('.tsx', '');
        entries[`icons/${name}`] = `dist/icons/${file}`;
      }
    }
  } catch {
    // icons dir doesn't exist yet during first run
  }
  return entries;
}

export default defineConfig({
  entry: {
    index: 'dist/index.tsx',
    ...getIconEntries(),
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: false,
  external: ['react'],
  jsx: 'automatic',
  outDir: 'dist',
  esbuildOptions(options) {
    options.outbase = 'dist';
  },
});
