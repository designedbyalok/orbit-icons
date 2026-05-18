'use client';

import { useCallback, useEffect, useRef } from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  iconCount: number;
  totalCount: number;
}

export function SearchBar({ value, onChange, iconCount, totalCount }: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === '/' && document.activeElement !== inputRef.current) {
      e.preventDefault();
      inputRef.current?.focus();
    }
  }, []);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="relative">
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Search icons..."
          className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-16 text-foreground placeholder:text-muted outline-none focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all"
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-6 items-center rounded border border-border bg-background px-1.5 text-xs text-muted">
          /
        </kbd>
      </div>
      <p className="mt-2 text-sm text-muted">
        {value
          ? `Showing ${iconCount} of ${totalCount} icons`
          : `${totalCount} icons available`}
      </p>
    </div>
  );
}
