// ═══════════════════════════════════════════════════════════
// SaSMaster — THEME SYSTEM
// PortalBackdrop: layered ambient background (drift, spotlight, glow, grid)
// ThemeSwitcher: cycles Light / Dark Terminal / Midnight Sky
// Theme is controlled by data-theme on .app-stage; tokens in theme.css
// ═══════════════════════════════════════════════════════════

const THEMES = [
  { id: 'light',      label: 'EDITORIAL', glyph: '◐', desc: 'Clean off-white' },
  { id: 'light-warm', label: 'PAPER',     glyph: '◓', desc: 'Warm cream / FT' },
  { id: 'light-cool', label: 'BLUEPRINT', glyph: '◒', desc: 'Cool blue-gray / tech' },
  { id: 'dark',       label: 'TERMINAL',  glyph: '◑', desc: 'Dark / Bloomberg' },
  { id: 'midnight',   label: 'MIDNIGHT',  glyph: '◆', desc: 'Night sky' },
];

function ThemeSwitcher({ theme, onTheme }) {
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef(null);
  React.useEffect(() => {
    const onClick = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    window.addEventListener('click', onClick);
    return () => window.removeEventListener('click', onClick);
  }, []);
  const cur = THEMES.find(t => t.id === theme) || THEMES[0];
  return React.createElement('div', { className: 'theme-switcher', ref: rootRef },
    React.createElement('button', {
      className: 'theme-trigger',
      onClick: (e) => { e.stopPropagation(); setOpen(o => !o); }
    },
      React.createElement('span', { className: 'theme-glyph' }, cur.glyph),
      React.createElement('span', { className: 'theme-lbl' }, cur.label)
    ),
    open && React.createElement('div', { className: 'theme-menu' },
      React.createElement('div', { className: 'theme-menu-head' }, 'SASMASTER THEMES'),
      THEMES.map(t => React.createElement('button', {
        key: t.id,
        className: `theme-opt ${t.id === theme ? 'active' : ''}`,
        onClick: (e) => { e.stopPropagation(); onTheme(t.id); setOpen(false); }
      },
        React.createElement('span', { className: 'theme-opt-glyph' }, t.glyph),
        React.createElement('div', { className: 'theme-opt-text' },
          React.createElement('div', { className: 'theme-opt-lbl' }, t.label),
          React.createElement('div', { className: 'theme-opt-desc' }, t.desc),
        ),
        t.id === theme && React.createElement('span', { className: 'theme-opt-check' }, '●')
      ))
    )
  );
}

// ─── PortalBackdrop ─────────────────────────────────────────
// Renders 4 layered effects behind the portal content:
//   1. Subtle drift — slow moving gradient blobs (two colors: neutral + accent)
//   2. Ambient glow — pulsing corner glow in portal accent
//   3. Grid overlay — very faint, portal accent tinted
//   4. Cursor spotlight — radial follows mouse (reactive)
// Parallax: translateY relative to scroll for layers 1+2
function PortalBackdrop({ accent = '#f0c040' }) {
  const [mouse, setMouse] = React.useState({ x: 50, y: 30 });
  const [scroll, setScroll] = React.useState(0);

  React.useEffect(() => {
    let ticking = false;
    const onMove = (e) => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setMouse({ x: (e.clientX / window.innerWidth) * 100, y: (e.clientY / window.innerHeight) * 100 });
        ticking = false;
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScroll(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return React.createElement('div', {
    className: 'portal-backdrop',
    style: { '--accent': accent }
  },
    // Layer 1: base color wash (theme-dependent in CSS)
    React.createElement('div', { className: 'bd-wash' }),
    // Layer 2: drift blobs (parallax slow)
    React.createElement('div', {
      className: 'bd-drift',
      style: { transform: `translate3d(0, ${-scroll * 0.12}px, 0)` }
    },
      React.createElement('div', { className: 'bd-blob bd-blob-a' }),
      React.createElement('div', { className: 'bd-blob bd-blob-b' }),
      React.createElement('div', { className: 'bd-blob bd-blob-c' })
    ),
    // Layer 3: grid (parallax medium)
    React.createElement('div', {
      className: 'bd-grid',
      style: { transform: `translate3d(0, ${-scroll * 0.04}px, 0)` }
    }),
    // Layer 4: ambient glow (pulses)
    React.createElement('div', {
      className: 'bd-glow',
      style: { transform: `translate3d(0, ${-scroll * 0.2}px, 0)` }
    }),
    // Layer 5: cursor spotlight (reactive)
    React.createElement('div', {
      className: 'bd-spotlight',
      style: { '--mx': `${mouse.x}%`, '--my': `${mouse.y}%` }
    }),
    // Layer 6: vignette (frames content)
    React.createElement('div', { className: 'bd-vignette' })
  );
}

// ─── Hook: load + persist theme ────────────────────────────
function useTheme(defaultTheme = 'light') {
  const [theme, setTheme] = React.useState(() => {
    try {
      const stored = localStorage.getItem('sm.theme');
      if (stored && THEMES.some(t => t.id === stored)) return stored;
    } catch {}
    return defaultTheme;
  });
  React.useEffect(() => {
    try { localStorage.setItem('sm.theme', theme); } catch {}
  }, [theme]);
  return [theme, setTheme];
}

Object.assign(window, { ThemeSwitcher, PortalBackdrop, useTheme, THEMES });
