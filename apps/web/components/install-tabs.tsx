'use client';

import { useState, useEffect } from 'react';
import { getInstallCommand } from '@/lib/copy';
import { CopyButton } from './copy-button';

const PACKAGE_MANAGERS = ['npm', 'pnpm', 'yarn', 'bun'] as const;
const STORAGE_KEY = 'orbit-icons-pm';

export function InstallTabs() {
  const [pm, setPm] = useState<string>('npm');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && PACKAGE_MANAGERS.includes(saved as any)) {
      setPm(saved);
    }
  }, []);

  const handleSelect = (selected: string) => {
    setPm(selected);
    localStorage.setItem(STORAGE_KEY, selected);
  };

  const command = getInstallCommand(pm);

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center border-b border-border">
        {PACKAGE_MANAGERS.map((manager) => (
          <button
            key={manager}
            onClick={() => handleSelect(manager)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors ${
              pm === manager
                ? 'text-accent border-b-2 border-accent -mb-px'
                : 'text-muted hover:text-foreground'
            }`}
          >
            {manager}
          </button>
        ))}
        <div className="ml-auto pr-3">
          <CopyButton value={command} />
        </div>
      </div>
      <pre className="p-4 text-sm text-foreground">
        <code>{command}</code>
      </pre>
    </div>
  );
}
