'use client';

import { ICON_BY_NAME } from '@/data/icons';

export function OrbitIcon({
  name,
  size = 24,
  color,
  strokeWidth = 1.5,
  className,
  ...rest
}: {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  [key: string]: unknown;
}) {
  const icon = ICON_BY_NAME[name];
  if (!icon) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      dangerouslySetInnerHTML={{ __html: icon.svg }}
      {...rest}
    />
  );
}

export function BrandIcon({ kind, size = 14 }: { kind: string; size?: number }) {
  const map: Record<string, React.ReactNode> = {
    github: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.1-1.46-1.1-1.46-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.09.39-1.98 1.03-2.68-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02a9.5 9.5 0 0 1 5 0c1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.59 1.03 2.68 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.86v2.76c0 .27.18.58.69.48A10 10 0 0 0 12 2z" />
      </svg>
    ),
    figma: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M8 2h4v8H8a4 4 0 0 1 0-8z" />
        <path d="M12 2h4a4 4 0 0 1 0 8h-4z" />
        <path d="M12 10h4a4 4 0 0 1 0 8h-4z" />
        <path d="M8 10h4v8H8a4 4 0 0 1 0-8z" />
        <circle cx="14" cy="18" r="4" />
      </svg>
    ),
    npm: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <path d="M2 9h20v8h-8v-6h-2v6H2zM4 11v4h4v-2h2v2h2v-4zM14 11v4h2v-2h2v2h2v-4z" />
      </svg>
    ),
    pnpm: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <rect x="3" y="3" width="5" height="5" rx=".5" />
        <rect x="10" y="3" width="5" height="5" rx=".5" />
        <rect x="17" y="3" width="4" height="5" rx=".5" />
        <rect x="10" y="10" width="5" height="5" rx=".5" />
        <rect x="17" y="10" width="4" height="5" rx=".5" />
        <rect x="17" y="17" width="4" height="4" rx=".5" />
      </svg>
    ),
    yarn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M14 7s1 1 1 3M9 17c1-2 4-3 7-4M9 13c1-1 3-2 6-2M9 9c0-2 2-3 3-3" />
      </svg>
    ),
    bun: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
        <ellipse cx="12" cy="12" rx="10" ry="8.5" />
        <circle cx="9" cy="11" r="1" fill="#000" />
        <circle cx="15" cy="11" r="1" fill="#000" />
        <path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5" stroke="#000" strokeWidth="1.3" fill="none" strokeLinecap="round" />
      </svg>
    ),
  };
  return map[kind] || null;
}

export function OrbitMark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M269.176 63C340.529 63 402.998 101.012 437.461 157.877C451.686 155.977 465.871 155.007 480 155.421C463.957 157.224 445.625 161.265 427.713 166.544C390.38 177.556 352.426 188.758 314.677 202.094C296.4 208.549 277.59 215.077 258.618 222.255C207.249 241.698 143.066 264.168 96.5112 292.909C77.1999 304.828 16.8826 336.474 61.3539 348.015C-36.2477 355.75 42.1499 303.818 74.2405 285.816L74.2514 285.797C73.1102 277.247 72.5188 268.523 72.5188 259.664C72.5188 151.051 160.563 63 269.176 63ZM447.966 177.668L445.991 173.499L445.925 173.361L445.853 173.219L428.992 180.154C441.358 202.928 448.385 229.026 448.385 256.764C448.385 345.573 376.39 417.563 287.579 417.563C272.666 417.563 258.233 415.537 244.531 411.734C175.93 389.687 123.866 318.341 200.283 262.166C190.269 266.019 25.3466 336.912 92.3165 345.768L92.3537 345.794C124.284 411.235 191.46 456.324 269.177 456.324C377.785 456.324 465.836 368.273 465.836 259.664C465.836 230.759 459.966 203.796 447.966 177.668ZM416.916 161.219C387.625 121.635 340.606 95.9669 287.579 95.9669C228.1 95.9669 176.168 128.259 148.356 176.27C133.64 203.066 152.544 214.205 179.857 213.975C204.04 213.767 226.972 209.268 251.063 202.793C299.469 189.772 347.419 176.883 395.244 165.806C402.476 164.135 409.701 162.586 416.916 161.219Z"
        fill="currentColor"
      />
    </svg>
  );
}
