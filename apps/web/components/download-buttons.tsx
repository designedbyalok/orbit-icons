'use client';

import { downloadSvg, downloadPng, downloadJpeg } from '@/lib/download';

interface DownloadButtonsProps {
  name: string;
  body: string;
  width: number;
  height: number;
}

export function DownloadButtons({ name, body, width, height }: DownloadButtonsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => downloadSvg(name, body, width, height)}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
      >
        SVG
      </button>
      <button
        onClick={() => downloadPng(name, body, width, height)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
      >
        PNG
      </button>
      <button
        onClick={() => downloadJpeg(name, body, width, height)}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-card-hover transition-colors"
      >
        JPEG
      </button>
    </div>
  );
}
