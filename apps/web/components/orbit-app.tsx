'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Finance: 'banking, currency, value',
  Controls: 'toggles, sliders, primitives',
  Editing: 'text & vector tools',
  Charts: 'data & measurement',
  Tech: 'hardware & peripherals',
  Interface: 'system & app primitives',
  Time: 'clocks, dates, intervals',
  Security: 'locks, keys, access',
  Status: 'feedback & indicators',
  Workflow: 'tasks & project management',
  Medical: 'clinical & health tools',
  Health: 'vitals & measurements',
  AI: 'artificial intelligence & automation',
  Emoji: 'expressive faces & symbols',
  Social: 'engagement & community',
  Storage: 'cloud & database',
  Typography: 'text formatting',
  Flags: 'country indicators',
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selected, setSelected] = useState<typeof ICONS[0] | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reqOpen, setReqOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [favorites, setFavorites] = useLocalStorage<string[]>('orbit:favs', []);
  const [recents, setRecents] = useLocalStorage<string[]>('orbit:recents', []);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    const select = searchParams.get('select');
    if (select && ICON_BY_NAME[select]) {
      setSelected(ICON_BY_NAME[select]);
      setSheetOpen(true);
    }
  }, [searchParams]);

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

    const url = new URL(window.location.href);
    url.searchParams.set('select', name);
    window.history.pushState({}, '', url.toString());
  };

  const closeSheet = () => {
    setSheetOpen(false);
    const url = new URL(window.location.href);
    url.searchParams.delete('select');
    window.history.pushState({}, '', url.toString());
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

      {/* Hero */}
      <header className="hero">
        <div>
          <div className="hero-folio">
            <span className="chap-num">§ I — Introduction</span>
            <span>·</span>
            <span className="field-of-study">A field guide to small marks</span>
          </div>
          <h1 className="hero-title">
            Icons,<br />
            <span className="rule"></span>
            <span className="it">in balance.</span>
          </h1>
          <p className="hero-sub">
            A system-driven library of <em>{ICONS.length} line icons</em>, engineered for clarity and consistency. 
            Every mark is hand-drawn on a 24-pixel grid with a signature 1.5-pixel stroke—built 
            to read equally well as a glyph or as a button.
          </p>
          <div className="hero-meta">
            <span><b>{ICONS.length}</b> icons</span>
            <span><b>24×24</b> grid</span>
            <span><b>1.5px</b> stroke</span>
            <span><b>MIT</b> license</span>
          </div>
        </div>

        {/* Specimen */}
        <aside className="specimen">
          <div className="specimen-head">
            <span className="title">Fig. — Construction</span>
            <span className="fig">24 × 24 · stroke 1.5</span>
          </div>
          <div className="specimen-grid-wrap">
            <div className="specimen-icon">
              <OrbitIcon name={heroSpecimen?.name || 'compass'} size={160} strokeWidth={1.5} />
            </div>
            <div className="specimen-annotations">
              <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0, color: 'var(--accent)', opacity: .7 }}>
                <line x1="2" y1="50" x2="14" y2="50" stroke="currentColor" strokeWidth=".25" />
                <line x1="86" y1="50" x2="98" y2="50" stroke="currentColor" strokeWidth=".25" />
                <line x1="50" y1="2" x2="50" y2="14" stroke="currentColor" strokeWidth=".25" />
                <line x1="50" y1="86" x2="50" y2="98" stroke="currentColor" strokeWidth=".25" />
                <circle cx="50" cy="50" r="32" stroke="currentColor" strokeWidth=".2" fill="none" strokeDasharray=".8 .8" />
              </svg>
              <div className="anno" style={{ top: 4, right: 6 }}>
                <span>⌐ corner radius</span>
              </div>
              <div className="anno" style={{ bottom: 4, left: 6 }}>
                <span>1.5px · round caps</span>
              </div>
            </div>
          </div>
          <div className="specimen-foot">
            <span>{heroSpecimen?.name || 'compass'}</span>
            <span>{heroSpecimen?.category || 'Map'}</span>
          </div>
        </aside>
      </header>

      {/* Install card */}
      <div className="install-row">
        <div className="install-card">
          <div className="install-card-head">
            <span className="title">Install</span>
            <div className="install-tabs">
              {(['npm', 'pnpm', 'yarn', 'bun'] as const).map(m => (
                <button key={m} className={`install-tab ${installer === m ? 'active' : ''}`} onClick={() => setInstaller(m)}>
                  <BrandIcon kind={m} size={13} /> {m}
                </button>
              ))}
            </div>
          </div>
          <div className="install-cmd">
            <div>
              <span className="prefix">$</span>
              <code dangerouslySetInnerHTML={{ __html: installCmd.replace('orbit-icons', '<span class="pkg">orbit-icons</span>') }} />
            </div>
            <button className={`copy-btn ${heroCopied ? 'copied' : ''}`} onClick={copyInstall}>
              {heroCopied
                ? <><OrbitIcon name="check" size={12} />Copied</>
                : <><OrbitIcon name="copy" size={12} />Copy</>}
            </button>
          </div>
        </div>
      </div>

      {/* Rationale */}
      <section className="rationale">
        <div className="rationale-inner">
          <div className="rationale-head">
            <span className="chap-num">§ II — Rationale</span>
            <h3>Precision as a <em>standard</em>.</h3>
          </div>
          <div className="rationale-grid">
            <div className="rationale-item">
              <h4>Precision-Engineered</h4>
              <p>Every icon strictly adheres to a 24-pixel grid. This ensures perfect pixel-alignment and razor-sharp rendering on high-density displays.</p>
            </div>
            <div className="rationale-item">
              <h4>Cohesive Weight</h4>
              <p>With a constant 1.5px stroke and rounded terminals, Orbit provides a warm, uniform aesthetic that maintains optical balance across the set.</p>
            </div>
            <div className="rationale-item">
              <h4>Developer-First Utility</h4>
              <p>Available as a tree-shakeable React package or raw SVGs. Designed to be styled effortlessly via CSS and integrated in seconds.</p>
            </div>
            <div className="rationale-item">
              <h4>Sophisticated Neutrality</h4>
              <p>Designed as a &ldquo;system-first&rdquo; icon set—sophisticated enough to stand alone, but neutral enough to blend into any interface.</p>
            </div>
          </div>
        </div>
      </section>

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
            chap={`§ ${ROMAN[i + 2] || i + 3}`}
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
        onClose={closeSheet}
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

function IconGrid({ items, onPick, favSet }: {
  items: typeof ICONS;
  onPick: (name: string) => void;
  favSet: Set<string>;
}) {
  return (
    <div className="icon-grid">
      {items.map(icon => (
        <a
          key={icon.name}
          href={`/icons/${icon.name}`}
          className={`icon-cell ${favSet.has(icon.name) ? 'fav-marker' : ''}`}
          onClick={(e) => {
            e.preventDefault();
            onPick(icon.name);
          }}
          aria-label={icon.name}
        >
          <OrbitIcon name={icon.name} size={24} />
          <span className="label">{icon.name}</span>
        </a>
      ))}
    </div>
  );
}
