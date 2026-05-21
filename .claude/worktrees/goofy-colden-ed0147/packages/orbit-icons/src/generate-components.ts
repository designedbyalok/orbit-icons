import { promises as fs } from 'fs';
import path from 'path';
import type { IconifyJSON } from '@iconify/types';

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function generateComponent(name: string, body: string, width: number, height: number): string {
  const pascalName = toPascalCase(name);
  return `import { forwardRef } from 'react';
import type { SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number | string;
}

const ${pascalName} = forwardRef<SVGSVGElement, IconProps>(
  ({ size = 24, width: w, height: h, ...props }, ref) => (
    <svg
      ref={ref}
      xmlns="http://www.w3.org/2000/svg"
      width={w ?? size}
      height={h ?? size}
      viewBox="0 0 ${width} ${height}"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      ${body}
    </svg>
  )
);

${pascalName}.displayName = '${pascalName}';
export default ${pascalName};
`;
}

export async function generateReactComponents(iconifyJson: IconifyJSON, distDir: string) {
  const iconsDir = path.join(distDir, 'icons');
  await fs.mkdir(iconsDir, { recursive: true });

  const defaultWidth = iconifyJson.width ?? 24;
  const defaultHeight = iconifyJson.height ?? 24;
  const iconNames: string[] = [];

  for (const [name, icon] of Object.entries(iconifyJson.icons)) {
    const width = icon.width ?? defaultWidth;
    const height = icon.height ?? defaultHeight;
    const pascalName = toPascalCase(name);

    const componentCode = generateComponent(name, icon.body, width, height);
    await fs.writeFile(path.join(iconsDir, `${pascalName}.tsx`), componentCode, 'utf8');
    iconNames.push(name);
  }

  const barrel = iconNames
    .map((name) => {
      const pascalName = toPascalCase(name);
      return `export { default as ${pascalName} } from './icons/${pascalName}';`;
    })
    .join('\n');
  await fs.writeFile(path.join(distDir, 'index.tsx'), barrel + '\n', 'utf8');

  console.log(`Generated ${iconNames.length} React components`);
}
