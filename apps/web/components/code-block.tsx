import { CopyButton } from './copy-button';

interface CodeBlockProps {
  code: string;
  label?: string;
}

export function CodeBlock({ code, label }: CodeBlockProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {label && (
        <div className="flex items-center justify-between border-b border-border px-4 py-2">
          <span className="text-xs font-medium text-muted">{label}</span>
          <CopyButton value={code} label="Copy" />
        </div>
      )}
      <pre className="overflow-x-auto p-4 text-sm text-foreground">
        <code>{code}</code>
      </pre>
      {!label && (
        <div className="flex justify-end border-t border-border px-4 py-2">
          <CopyButton value={code} label="Copy" />
        </div>
      )}
    </div>
  );
}
