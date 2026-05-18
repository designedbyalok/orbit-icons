'use client';

import { useState } from 'react';

interface IconPreviewProps {
  body: string;
  width: number;
  height: number;
  name: string;
}

const PREVIEW_SIZES = [16, 24, 32, 48, 64];

export function IconPreview({ body, width, height, name }: IconPreviewProps) {
  const [color, setColor] = useState('#000000');

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted">Preview</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="color-picker" className="text-sm text-muted">
            Color
          </label>
          <input
            id="color-picker"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="h-8 w-8 cursor-pointer rounded border border-border"
          />
        </div>
      </div>
      <div className="flex items-end gap-6 rounded-xl border border-border bg-card p-6">
        {PREVIEW_SIZES.map((size) => (
          <div key={size} className="flex flex-col items-center gap-2">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${width} ${height}`}
              fill="none"
              stroke={color}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              dangerouslySetInnerHTML={{ __html: body }}
            />
            <span className="text-xs text-muted">{size}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
