'use client';

import { OrbitIcon } from './orbit-icon';

export function Toast({ text }: { text: string | null }) {
  return (
    <div className={`toast ${text ? 'show' : ''}`}>
      <OrbitIcon name="check" size={13} strokeWidth={2} />
      {text}
    </div>
  );
}
