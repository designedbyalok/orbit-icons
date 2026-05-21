'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { ICONS, ICON_BY_NAME } from '@/data/icons';
import { OrbitIcon, BrandIcon, OrbitMark } from './orbit-icon';
import { BottomSheet } from './bottom-sheet';
import { RequestModal } from './request-modal';
import { Toast } from './toast';

const ROMAN = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII','XIII','XIV','XV','XVI','XVII','XVIII','XIX','XX'];

const CATEGORY_NOTES: Record<string, string> = {
  Arrows: 'directional cues & navigation',
  Files: 'documents, folders, archives',
  Communication: 'mail, messages, notifications',
  Media: 'playback & capture',
  User: 'people, accounts, identity',
  Commerce: 'cart, payment, value',
  Controls: 'toggles, sliders, primitives',
  Editing: 'text & vector tools',
  Charts: 'data & measurement',
  Devices: 'hardware & peripherals',
  Weather: 'climate & conditions',
  Layout: 'frames & geometric primitives',
  Time: 'clocks, dates, intervals',
  Security: 'locks, keys, access',
  Code: 'syntax, version control, infra',
  Map: 'wayfinding & transport',
  Nature: 'organic & elemental',
  Math: 'operators & symbols',
  Misc: 'odds & ends',
};

function useLocalStorage<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [val, setVal] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch { /* noop */ }
  }, [key, val]);
  return [val, setVal];
}

export function OrbitApp() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selected, setSelected] = useState<typeof ICONS[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reqOpen, setReqOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('orbit:favs', []);
  const [recents, setRecents] = useLocalStorage<string[]>('orbit:recents', []);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !sheetOpen && !reqOpen &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [sheetOpen, reqOpen]);

  const showToast = useCallback((text: string) => {
    setToast(text);
    setTimeout(() => setToast(null), 1500);
  }, []);

  const onPickIcon = (name: string) => {
    const icon = ICON_BY_NAME[name];
    if (!icon) return;
    setSelected(icon);
    setSheetOpen(true);
    setRecents(prev => [name, ...prev.filter(n => n !== name)].slice(0, 12));
  };

  const onToggleFav = (name: string) => {
    setFavorites(prev => prev.includes(name) ? prev.filter(n => n !== name) : [name, ...prev]);
  };

  const categories = useMemo(() => {
    const set = new Set(ICONS.map(i => i.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ICONS.filter(i => {
      if (activeCat !== 'All' && i.category !== activeCat) return false;
      if (q && !i.name.toLowerCase().includes(q) && !i.category.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [query, activeCat]);

  const grouped = useMemo(() => {
    if (activeCat !== 'All') return [[activeCat, filtered] as const];
    const m = new Map<string, typeof ICONS>();
    filtered.forEach(i => {
      if (!m.has(i.category)) m.set(i.category, []);
      m.get(i.category)!.push(i);
    });
    return Array.from(m.entries());
  }, [filtered, activeCat]);

  const favIcons = favorites.map(n => ICON_BY_NAME[n]).filter(Boolean);
  const recentIcons = recents.map(n => ICON_BY_NAME[n]).filter(Boolean);
  const showFavRow = !query && activeCat === 'All' && favIcons.length > 0;
  const showRecRow = !query && activeCat === 'All' && recentIcons.length > 0;

  const [installer, setInstaller] = useState('npm');
  const installCmds: Record<string, string> = {
    npm: 'npm install orbit-icons',
    pnpm: 'pnpm add orbit-icons',
    yarn: 'yarn add orbit-icons',
    bun: 'bun add orbit-icons',
  };
  const installCmd = installCmds[installer];
  const [heroCopied, setHeroCopied] = useState(false);
  const copyInstall = () => {
    navigator.clipboard?.writeText(installCmd);
    setHeroCopied(true);
    showToast('Copied install command');
    setTimeout(() => setHeroCopied(false), 1400);
  };

  const heroSpecimen = ICON_BY_NAME['compass'] || ICONS[0];

  const scrollToGrid = useCallback(() => {
    document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const sampleA = ICON_BY_NAME['activity'] || ICONS[0];
  const sampleB = ICON_BY_NAME['compass'] || ICONS[1];
  const ctaSampleNames = ['arrow-up-right', 'star', 'heart', 'bell', 'zap', 'cloud', 'circle', 'shield'];
  const ctaSamples = ctaSampleNames.map(n => ICON_BY_NAME[n]).filter(Boolean);
  const arcStats = [
    { label: '24', h: 28 },
    { label: '62', h: 50 },
    { label: '44', h: 38 },
    { label: '52', h: 60 },
    { label: '84', h: 92, hot: true },
  ];

  const handleThemeToggle = (e: React.MouseEvent) => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    const isDark = newTheme === 'dark';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!document.startViewTransition || reduced) {
      setTheme(newTheme);
      return;
    }

    const x = e.clientX;
    const y = e.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );

    document.documentElement.setAttribute('data-vt', isDark ? 'to-dark' : 'to-light');

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
    });

    transition.ready.then(() => {
      const clipFrames = isDark
        ? [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
        : [`circle(${endRadius}px at ${x}px ${y}px)`, `circle(0px at ${x}px ${y}px)`];
      document.documentElement.animate(
        { clipPath: clipFrames },
        {
          duration: 620,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          pseudoElement: isDark ? '::view-transition-new(root)' : '::view-transition-old(root)',
          fill: 'forwards',
        }
      );
    }).catch(() => {});

    transition.finished.then(() => {
      document.documentElement.removeAttribute('data-vt');
    }).catch(() => {
      document.documentElement.removeAttribute('data-vt');
    });
  };

  const [animating, setAnimating] = useState(false);
  const handleToggle = (e: React.MouseEvent) => {
    setAnimating(true);
    handleThemeToggle(e);
    setTimeout(() => setAnimating(false), 620);
  };

  const favSet = new Set(favorites);

  return (
    <div className="app">
      {/* Nav */}
      <nav className="nav">
        <div className="nav-brand">
          <span className="mark"><OrbitMark size={24} /></span>
          <span className="name">Orbit <em>Icons</em></span>
          <span className="ver">v1.0</span>
        </div>
        <div className="nav-links">
          <a href="https://github.com/designedbyalok/orbit-icons" target="_blank" rel="noopener">
            <BrandIcon kind="github" size={14} /> <span>GitHub</span>
          </a>
          <button onClick={() => setReqOpen(true)}>
            <OrbitIcon name="plus" size={14} /> <span>Request</span>
          </button>
          {mounted && (
            <button className={`theme-toggle ${animating ? 'animating' : ''}`} onClick={handleToggle} aria-label="Toggle theme">
              <OrbitIcon name={theme === 'dark' ? 'sun' : 'moon'} size={16} />
            </button>
          )}
        </div>
      </nav>

      {/* Landing — 3 stacked rounded cards */}
      <div className="landing">
        {/* Hero card */}
        <section className="lc lc-hero">
          <div>
            <div className="head">
              <span className="mark"><OrbitMark size={28} /></span>
              <h1>
                A line-icon set,<br />
                <span className="muted">drawn on the</span> <span className="it">grid.</span>
              </h1>
            </div>

            <div className="lc-hero-stat" style={{ position: 'relative', marginTop: 40 }}>
              <span className="num"><em>{ICONS.length}</em></span>
              <span className="cap">icons, 24×24 pixel grid, 1.5 px stroke, MIT licensed.</span>
            </div>
          </div>

          <div className="lc-hero-right">
            <div className="lc-chip lc-chip-1">
              <span className="chip-ico"><OrbitIcon name={sampleA?.name || 'activity'} size={16} /></span>
              <div>
                <div style={{ lineHeight: 1 }}>{sampleA?.name || 'activity'}</div>
                <div className="chip-meta">{sampleA?.category || 'Charts'}</div>
              </div>
            </div>
            <div className="lc-chip lc-chip-2">
              <span className="chip-ico"><OrbitIcon name={sampleB?.name || 'compass'} size={16} /></span>
              <div>
                <div style={{ lineHeight: 1 }}>{sampleB?.name || 'compass'}</div>
                <div className="chip-meta">{sampleB?.category || 'Map'}</div>
              </div>
            </div>

            <div className="lc-arc">
              {arcStats.map((s, i) => (
                <div key={i} className={`lc-arc-col ${s.hot ? 'hot' : ''}`}>
                  <div className="lc-arc-bar" style={{ height: `${s.h}%` }} />
                  <span className="lc-arc-label">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature list card */}
        <section className="lc">
          <div className="lc-list-head">
            <h2>Built for product surfaces, <span className="muted">not decoration.</span></h2>
            <div className="pills">
              <span className="lc-pill a"><span className="dot" />Linear</span>
              <span className="lc-pill b"><span className="dot" />Tree-shakeable</span>
              <span className="lc-pill c"><span className="dot" />MIT</span>
            </div>
          </div>
          <div className="lc-rows">
            <FeatureRow ttl="React components" sub="import { Activity }" desc="Typed, tree-shakeable, server-component friendly." />
            <FeatureRow hot ttl="Customizable strokes" sub="strokeWidth · color" desc="Inherits currentColor by default. 1.5 px stroke baseline." />
            <FeatureRow ttl="Multiple formats" sub="SVG · React · JSON" desc="Copy a single icon or install the whole pack." />
            <FeatureRow ttl="24×24 pixel grid" sub="Geometric alignment" desc="Consistent optical weight across every mark." />
            <FeatureRow ttl="Open source" sub="MIT licensed" desc="Free to use and modify, forever." />
          </div>
        </section>

        {/* CTA card */}
        <section className="lc lc-cta">
          <div className="lc-cta-icons" aria-hidden>
            {ctaSamples.map((ic, i) => {
              const positions = [
                { top: '12%', left: '8%', size: 22 },
                { top: '22%', left: '88%', size: 18 },
                { top: '48%', left: '4%', size: 16 },
                { top: '56%', left: '92%', size: 24 },
                { top: '74%', left: '14%', size: 20 },
                { top: '78%', left: '80%', size: 16 },
                { top: '34%', left: '78%', size: 14 },
                { top: '64%', left: '22%', size: 14 },
              ];
              const p = positions[i] || { top: '50%', left: '50%', size: 16 };
              return (
                <span key={ic.name} className="lc-cta-icon" style={{ top: p.top, left: p.left }}>
                  <OrbitIcon name={ic.name} size={p.size} />
                </span>
              );
            })}
          </div>
          <span className="mark"><OrbitMark size={28} /></span>
          <h2>Browse all <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>{ICONS.length}</em> icons, <span className="muted">copy or install.</span></h2>
          <button className="lc-cta-btn" onClick={scrollToGrid}>
            View the set
            <span className="arr"><OrbitIcon name="arrow-right" size={14} /></span>
          </button>

          <div className="lc-cta-foot">
            <button onClick={scrollToGrid}>Browse</button>
            <a href="https://github.com/designedbyalok/orbit-icons" target="_blank" rel="noopener">GitHub</a>
            <button onClick={() => setReqOpen(true)}>Request</button>
            <button onClick={copyInstall}>{heroCopied ? 'Copied' : installCmd}</button>
          </div>
        </section>
      </div>

      {/* Search */}
      <div className="search-section">
        <div className="search-inner">
          <div className="search-input-wrap">
            <OrbitIcon name="search" size={16} />
            <input
              ref={searchRef}
              className="search-input"
              placeholder="Search by name or category…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query
              ? <button onClick={() => setQuery('')} aria-label="Clear" style={{ padding: 4, color: 'var(--fg-3)' }}>
                  <OrbitIcon name="x" size={14} />
                </button>
              : <span className="search-kbd">/</span>}
          </div>
          <span className="search-count">{String(filtered.length).padStart(3, '0')} of {ICONS.length}</span>
        </div>
        <div className="search-inner" style={{ marginTop: 12 }}>
          <div className="cats">
            {categories.map(c => (
              <button key={c} className={`cat-chip ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Icon grid */}
      <div className="grid-wrap">
        {showFavRow && (
          <GridSection chap="—" title="Favorites" sub="frequently reached for" count={favIcons.length}>
            <IconGrid items={favIcons} onPick={onPickIcon} favSet={favSet} />
          </GridSection>
        )}
        {showRecRow && (
          <GridSection chap="—" title="Recently used" sub="from this session" count={recentIcons.length}>
            <IconGrid items={recentIcons} onPick={onPickIcon} favSet={favSet} />
          </GridSection>
        )}

        {grouped.length === 0 ? (
          <div className="empty">
            <h4>Nothing matches &ldquo;{query}&rdquo;</h4>
            <p>Try a different keyword — or ask for it.</p>
            <button className="req-link" onClick={() => setReqOpen(true)}>
              <OrbitIcon name="plus" size={14} /> Request &ldquo;{query}&rdquo;
            </button>
          </div>
        ) : grouped.map(([cat, items], i) => items.length > 0 && (
          <GridSection
            key={cat}
            chap={`§ ${ROMAN[i] || i + 1}`}
            title={cat}
            sub={CATEGORY_NOTES[cat] || ''}
            count={items.length}
          >
            <IconGrid items={items} onPick={onPickIcon} favSet={favSet} />
          </GridSection>
        ))}
      </div>

      {/* Footer */}
      <footer className="foot">
        <div className="colophon">
          <em>Colophon.</em> Set in Newsreader & Inter. {ICONS.length} icons, hand-drawn on a 24-pixel grid.
          Released under the MIT License. © 2026 Orbit.
        </div>
        <div className="foot-links">
          <a href="https://github.com/designedbyalok/orbit-icons">GitHub</a>
        </div>
      </footer>

      <BottomSheet
        icon={selected}
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        onToast={showToast}
        isFav={selected ? favorites.includes(selected.name) : false}
        onToggleFav={onToggleFav}
      />

      <RequestModal open={reqOpen} onClose={() => setReqOpen(false)} onSubmitted={() => showToast('Request submitted')} />
      <Toast text={toast} />
    </div>
  );
}

function GridSection({ chap, title, sub, count, children }: {
  chap: string;
  title: string;
  sub: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="grid-section">
      <div className="grid-section-head">
        <div className="left">
          <span className="chap-num">{chap}</span>
          <h3>{title}{sub && <span style={{ fontStyle: 'italic', color: 'var(--fg-3)', fontSize: '.7em', marginLeft: '.6em' }}> — {sub}</span>}</h3>
        </div>
        <span className="count">{String(count).padStart(2, '0')} marks</span>
      </div>
      {children}
    </section>
  );
}

function FeatureRow({ ttl, sub, desc, hot }: { ttl: string; sub: string; desc: string; hot?: boolean }) {
  return (
    <div className={`lc-row ${hot ? 'hot' : ''}`}>
      <span className="check"><OrbitIcon name="check" size={16} /></span>
      <span className="ttl">{ttl}</span>
      <span className="sub">{sub}</span>
      <span className="desc">{desc}</span>
      <span className="arr"><OrbitIcon name="arrow-right" size={14} /></span>
    </div>
  );
}

function IconGrid({ items, onPick, favSet }: {
  items: typeof ICONS;
  onPick: (name: string) => void;
  favSet: Set<string>;
}) {
  return (
    <div className="icon-grid">
      {items.map(icon => (
        <button
          key={icon.name}
          className={`icon-cell ${favSet.has(icon.name) ? 'fav-marker' : ''}`}
          onClick={() => onPick(icon.name)}
          aria-label={icon.name}
        >
          <OrbitIcon name={icon.name} size={24} />
          <span className="label">{icon.name}</span>
        </button>
      ))}
    </div>
  );
}
