import { buildSvgString } from './download';

function toPascalCase(str: string): string {
  return str
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

export function getSvgSnippet(body: string, width: number, height: number): string {
  return buildSvgString(body, width, height);
}

export function getReactSnippet(name: string): string {
  const componentName = toPascalCase(name);
  return `import { ${componentName} } from 'orbit-icons';

<${componentName} size={24} />`;
}

export function getInstallCommand(pm: string): string {
  switch (pm) {
    case 'npm':
      return 'npm install orbit-icons';
    case 'pnpm':
      return 'pnpm add orbit-icons';
    case 'yarn':
      return 'yarn add orbit-icons';
    case 'bun':
      return 'bun add orbit-icons';
    default:
      return 'npm install orbit-icons';
  }
}
