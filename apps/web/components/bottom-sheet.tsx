'use client';

import { useState, useEffect } from 'react';
import type { IconEntry } from '@/data/icons';
import { OrbitIcon, BrandIcon } from './orbit-icon';

const SIZES = [16, 24, 32, 48, 64];
const COPY_TABS = ['SVG', 'JSX', 'React'] as const;
const INSTALL_MANAGERS = [
  { id: 'npm', cmd: 'npm install', icon: 'npm' },
  { id: 'pnpm', cmd: 'pnpm add', icon: 'pnpm' },
  { id: 'yarn', cmd: 'yarn add', icon: 'yarn' },
  { id: 'bun', cmd: 'bun add', icon: 'bun' },
];

function pascalCase(s: string) {
  return s.split(/[-_\s]/).filter(Boolean).map(w => w[0].toUpperCase() + w.slice(1)).join('');
}

function buildSvgString(icon: IconEntry, size: number, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${icon.svg}</svg>`;
}

function buildJsxString(icon: IconEntry, size: number, color: string) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">\n  ${icon.svg.replace(/></g, '>\n  <')}\n</svg>`;
}

function buildReactString(icon: IconEntry, size: number) {
  const C = pascalCase(icon.name);
  return `import { ${C} } from 'orbit-icons';\n\n<${C} size={${size}} />`;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] || c));
}

function highlightSvg(s: string) {
  return escapeHtml(s)
    .replace(/(&lt;\/?)([a-z][a-z0-9-]*)/g, '$1<span class="tk-tag">$2</span>')
    .replace(/([a-z-]+)=(&quot;[^&]*?&quot;|\{[^}]*\})/gi, '<span class="tk-attr">$1</span>=<span class="tk-str">$2</span>');
}

function highlightJs(s: string) {
  return escapeHtml(s)
    .replace(/(import|from|const|let|return|export|default)/g, '<span class="tk-kw">$1</span>')
    .replace(/(&#39;[^&]*?&#39;)/g, '<span class="tk-str">$1</span>')
    .replace(/(&lt;\/?)([A-Z][A-Za-z0-9]*)/g, '$1<span class="tk-tag">$2</span>');
}

function downloadFile(filename: string, content: string | Blob, mime: string) {
  const blob = content instanceof Blob ? content : new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function svgToRaster(svgStr: string, size: number, mime: string): Promise<Blob> {
  return new Promise((resolve) => {
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.onload = () => {
      const c = document.createElement('canvas');
      const scale = 4;
      c.width = size * scale;
      c.height = size * scale;
      const ctx = c.getContext('2d')!;
      if (mime === 'image/jpeg') {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, c.width, c.height);
      }
      ctx.drawImage(img, 0, 0, c.width, c.height);
      c.toBlob((b) => {
        URL.revokeObjectURL(url);
        resolve(b!);
      }, mime, 0.95);
    };
    img.src = url;
  });
}

interface BottomSheetProps {
  icon: IconEntry | null;
  open: boolean;
  onClose: () => void;
  onToast: (text: string) => void;
  isFav: boolean;
  onToggleFav: (name: string) => void;
}

export function BottomSheet({ icon, open, onClose, onToast, isFav, onToggleFav }: BottomSheetProps) {
  const [size, setSize] = useState(24);
  const [color, setColor] = useState('#FFFFFF');
  const [copyTab, setCopyTab] = useState<typeof COPY_TABS[number]>('SVG');
  const [installer, setInstaller] = useState('npm');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (open && icon) {
      setSize(24);
      const themeFg = getComputedStyle(document.documentElement).getPropertyValue('--fg').trim() || '#FFFFFF';
      setColor(themeFg);
      setCopyTab('SVG');
      setInstaller('npm');
    }
  }, [open, icon?.name]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!icon) return null;

  const svgStr = buildSvgString(icon, size, color);
  const jsxStr = buildJsxString(icon, size, color);
  const reactStr = buildReactString(icon, size);
  const copyText = copyTab === 'SVG' ? svgStr : copyTab === 'JSX' ? jsxStr : reactStr;
  const installCmd = INSTALL_MANAGERS.find(m => m.id === installer)!;

  const isLight = typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'light';
  const colorPresets = isLight
    ? ['#0F0F12', '#FFFFFF', '#5B6CFF', '#22C55E', '#F59E0B', '#EF4444']
    : ['#FFFFFF', '#0F0F12', '#5B6CFF', '#22C55E', '#F59E0B', '#EF4444'];

  const copy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    onToast('Copied to clipboard');
    setTimeout(() => setCopiedKey(null), 1400);
  };

  const handleDownload = async (fmt: string) => {
    if (fmt === 'SVG') {
      downloadFile(`${icon.name}.svg`, svgStr, 'image/svg+xml');
    } else if (fmt === 'PNG' || fmt === 'JPEG') {
      const mime = fmt === 'PNG' ? 'image/png' : 'image/jpeg';
      const blob = await svgToRaster(svgStr, size, mime);
      downloadFile(`${icon.name}.${fmt.toLowerCase()}`, blob, mime);
    }
    onToast(`Downloaded ${icon.name}.${fmt.toLowerCase()}`);
  };

  return (
    <>
      <div className={`sheet-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <div className={`sheet ${open ? 'open' : ''}`} role="dialog" aria-modal="true">
        <div className="sheet-grabber" />
        <div className="sheet-head">
          <div className="left">
            <span className="fig">FIG.</span>
            <div>
              <h2>
                {icon.name.split('-').map((p, i) =>
                  i === 0 ? p : <span key={i}>-<em>{p}</em></span>
                )}
              </h2>
              <div className="meta">
                <span className="cat">{icon.category}</span>
                <span>24×24 grid</span>
                <span>·</span>
                <span>stroke 1.5</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button className="sheet-close" onClick={() => onToggleFav(icon.name)} title={isFav ? 'Remove favorite' : 'Add to favorites'}>
              <OrbitIcon name="heart" size={16} color={isFav ? 'var(--accent)' : 'currentColor'} />
            </button>
            <button className="sheet-close" onClick={onClose} aria-label="Close">
              <OrbitIcon name="x" size={18} />
            </button>
          </div>
        </div>

        <div className="sheet-body">
          {/* Preview */}
          <div>
            <div className="sec-label">
              <div className="head">
                <span className="num">i.</span>
                <span className="label">Specimen</span>
              </div>
              <div className="right">
                <span>ink</span>
                <div className="color-swatches">
                  {colorPresets.map(c => (
                    <button
                      key={c}
                      className={`color-swatch-preset ${color.toUpperCase() === c.toUpperCase() ? 'active' : ''}`}
                      style={{ background: c }}
                      onClick={() => setColor(c)}
                      aria-label={`Color ${c}`}
                    />
                  ))}
                  <label className="color-swatch" style={{ background: color }}>
                    <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
                  </label>
                </div>
              </div>
            </div>
            <div className="preview-box">
              {SIZES.map(s => (
                <button
                  key={s}
                  className={`preview-item ${size === s ? 'active' : ''}`}
                  onClick={() => setSize(s)}
                  aria-label={`Size ${s}`}
                >
                  <span className="ico" style={{ height: 64, display: 'flex', alignItems: 'flex-end' }}>
                    <OrbitIcon name={icon.name} size={s} color={color} />
                  </span>
                  <span className="size">{s}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Download */}
          <div>
            <div className="sec-label">
              <div className="head">
                <span className="num">ii.</span>
                <span className="label">Download</span>
              </div>
              <div className="right"><span>raster exports at 4× resolution</span></div>
            </div>
            <div className="format-row">
              {['SVG', 'PNG', 'JPEG'].map(f => (
                <button key={f} className="format-pill" onClick={() => handleDownload(f)}>
                  <OrbitIcon name="download" size={13} />{f}
                </button>
              ))}
            </div>
          </div>

          {/* Copy */}
          <div>
            <div className="sec-label">
              <div className="head">
                <span className="num">iii.</span>
                <span className="label">Copy</span>
              </div>
            </div>
            <div className="copy-tabs">
              {COPY_TABS.map(t => (
                <button key={t} className={`copy-tab ${copyTab === t ? 'active' : ''}`} onClick={() => setCopyTab(t)}>{t}</button>
              ))}
            </div>
            <div className="codeblock">
              <div className="codeblock-head">
                <span>{copyTab === 'SVG' ? 'svg' : copyTab === 'JSX' ? 'jsx' : 'react'}</span>
                <button className={`copy-btn ${copiedKey === 'code' ? 'copied' : ''}`} onClick={() => copy(copyText, 'code')}>
                  {copiedKey === 'code'
                    ? <><OrbitIcon name="check" size={13} />Copied</>
                    : <><OrbitIcon name="copy" size={13} />Copy</>}
                </button>
              </div>
              <pre dangerouslySetInnerHTML={{
                __html: copyTab === 'SVG' ? highlightSvg(copyText) : highlightJs(copyText)
              }} />
            </div>
          </div>

          {/* Install */}
          <div>
            <div className="sec-label">
              <div className="head">
                <span className="num">iv.</span>
                <span className="label">Install</span>
              </div>
            </div>
            <div className="codeblock">
              <div className="codeblock-head" style={{ padding: '0 6px 0 6px', textTransform: 'none', letterSpacing: 0 }}>
                <div style={{ display: 'flex' }}>
                  {INSTALL_MANAGERS.map(m => (
                    <button
                      key={m.id}
                      className={`install-tab ${installer === m.id ? 'active' : ''}`}
                      onClick={() => setInstaller(m.id)}
                    >
                      <BrandIcon kind={m.icon} size={13} /> {m.id}
                    </button>
                  ))}
                </div>
                <button
                  className={`copy-btn ${copiedKey === 'install' ? 'copied' : ''}`}
                  style={{ margin: '7px 8px' }}
                  onClick={() => copy(`${installCmd.cmd} orbit-icons`, 'install')}
                >
                  {copiedKey === 'install'
                    ? <><OrbitIcon name="check" size={13} />Copied</>
                    : <><OrbitIcon name="copy" size={13} />Copy</>}
                </button>
              </div>
              <pre>
                <span style={{ color: 'var(--fg-3)' }}>$</span> {installCmd.cmd} <span style={{ color: 'var(--accent)' }}>orbit-icons</span>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
