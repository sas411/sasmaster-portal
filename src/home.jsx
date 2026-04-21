// ═══════════════════════════════════════════════════════════
// SaSMaster — HOME (cinematic: vintage TV intro → walking hero
// with day/night cycle + 4 glass portal screens + Exchange below)
// Port of XD-export: uploads/sasmaster-homepage (6).html
// ═══════════════════════════════════════════════════════════

const { useState: useStateH, useEffect: useEffectH, useRef: useRefH } = React;

// ─── Intro: vintage TV → flash → main ────────────────────
function Intro({ onDone }) {
  const [dismissed, setDismissed] = useStateH(false);
  useEffectH(() => {
    const safety = setTimeout(() => dismiss(), 10500);
    return () => clearTimeout(safety);
  }, []);
  function dismiss() {
    if (dismissed) return;
    setDismissed(true);
    setTimeout(onDone, 800);
  }
  function skip() {
    if (dismissed) return;
    setDismissed(true);
    setTimeout(onDone, 350);
  }

  return React.createElement('div', { className: `intro ${dismissed ? 'done' : ''}` },
    React.createElement('div', { className: 'tv-scene' },
      React.createElement('img', { className: 'tv-image', src: 'assets/intro-tv.png', alt: 'Vintage television' }),
      React.createElement('div', { className: 'tv-screen-glow' })
    ),
    React.createElement('div', { className: 'flash' }),
    React.createElement('div', { className: 'hero-burst', style: { backgroundImage: "url('assets/hero-walking.jpg')" } }),
    React.createElement('div', { className: 'tv-tagline' },
      React.createElement('div', { className: 'tv-tagline-text' }, 'So, the future of television is...')),
    React.createElement('div', { className: 'intro-brand' },
      React.createElement('div', { className: 'hex-logo' },
        React.createElement('div', { className: 'hex-row' },
          React.createElement('div', { className: 'hex' }),
          React.createElement('div', { className: 'hex' })),
        React.createElement('div', { className: 'hex-row', style: { marginLeft: 7 } },
          React.createElement('div', { className: 'hex' }))
      ),
      React.createElement('div', { className: 'intro-wordmark' },
        'SaS', React.createElement('span', null, 'MasTER'))
    ),
    React.createElement('div', { className: 'enter-prompt', onClick: dismiss },
      React.createElement('div', { className: 'enter-text' }, 'Enter the Platform'),
      React.createElement('span', { className: 'enter-line' })
    ),
    React.createElement('button', { className: 'skip-btn', onClick: skip }, 'Skip Intro →')
  );
}

// ─── Glass portal screen (floating over the walking hero) ─
function GlassScreen({ id, pos, accent, icon, title, sub, onEnter, autoActive, setHovered }) {
  return React.createElement('button', {
    className: `portal-screen ps-${pos} ${autoActive ? 'auto-active' : ''}`,
    onClick: () => onEnter(id),
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    style: {
      '--face-border': accent.border,
      '--face-glow':   accent.glow,
      '--face-bg':     accent.bg,
      '--accent':      accent.color,
    }
  },
    React.createElement('div', { className: 'screen-face' },
      React.createElement('div', { className: 'screen-idle' },
        React.createElement('div', { className: 'screen-idle-icon' }, icon),
        React.createElement('div', { className: 'screen-idle-label' }, title.replace('\n', ' '))
      ),
      React.createElement('div', { className: 'screen-portal-content' },
        React.createElement('div', { className: 'pc-icon' }, icon),
        React.createElement('div', { className: 'pc-title' },
          ...title.split('\n').flatMap((l, i) => i === 0 ? [l] : [React.createElement('br', { key: i }), l])),
        React.createElement('div', { className: 'pc-sub' }, sub),
        React.createElement('div', { className: 'pc-cta' }, 'Enter Portal →')
      )
    )
  );
}

// ─── Main hero with walking background + 4 glass screens ───
function HomeScreen({ onEnterPortal }) {
  const [introDone, setIntroDone] = useStateH(() => {
    try { return sessionStorage.getItem('sm.introSeen') === '1'; } catch { return false; }
  });
  const [hoverCount, setHoverCount] = useStateH(0);
  const [autoIdx, setAutoIdx] = useStateH(-1);

  useEffectH(() => {
    if (!introDone) return;
    try { sessionStorage.setItem('sm.introSeen', '1'); } catch {}
    // subtle auto-cycle highlight on screens every 3.5s
    let i = 0;
    const iv = setInterval(() => {
      setAutoIdx(i % 4);
      i++;
    }, 3500);
    return () => clearInterval(iv);
  }, [introDone]);

  const SCREENS = [
    {
      id: 'content',  pos: '1', icon: '📺', title: 'Programming\nResearch', sub: 'Audience · Viewership · Content',
      accent: { color: '#f0c040', border: 'rgba(240,192,64,0.6)',  glow: 'rgba(240,192,64,0.28)',  bg: 'rgba(30,18,0,0.82)' },
    },
    {
      id: 'advertising', pos: '2', icon: '📊', title: 'Ad\nResearch',   sub: 'CTV · Linear · Inventory',
      accent: { color: '#36C5F0', border: 'rgba(54,197,240,0.6)',  glow: 'rgba(54,197,240,0.28)',  bg: 'rgba(0,18,30,0.82)' },
    },
    {
      id: 'marketing', pos: '3', icon: '📣', title: 'Marketing\nResearch', sub: 'Reach · Attribution · Segments',
      accent: { color: '#ff6b6b', border: 'rgba(255,107,107,0.6)', glow: 'rgba(255,107,107,0.28)', bg: 'rgba(28,4,4,0.82)'  },
    },
    {
      id: 'cpg', pos: '4', icon: '🛒', title: 'CPG\nResearch', sub: 'Consumer · Intent · Retail',
      accent: { color: '#2EB67D', border: 'rgba(46,182,125,0.6)',  glow: 'rgba(46,182,125,0.28)',  bg: 'rgba(0,22,12,0.82)' },
    },
  ];

  return React.createElement(React.Fragment, null,
    !introDone && React.createElement(Intro, { onDone: () => setIntroDone(true) }),

    React.createElement('div', { className: `main-page ${introDone ? 'visible' : ''}` },
      // ═══ HERO ═══
      React.createElement('section', { className: 'hero' },
        React.createElement('div', {
          className: 'hero-bg',
          style: { backgroundImage: "url('assets/hero-walking.jpg')" }
        }),
        React.createElement('div', { className: 'sky-sunset' }),
        React.createElement('div', { className: 'sky-night' }),
        React.createElement('div', { className: 'hero-stars' }),
        React.createElement('div', { className: 'shooting-star' }),
        React.createElement('div', { className: 'hero-overlay' }),

        // Nav
        React.createElement('nav', { className: 'hero-nav' },
          React.createElement('div', { className: 'nav-logo' },
            React.createElement('div', { className: 'hex-logo' },
              React.createElement('div', { className: 'hex-row' },
                React.createElement('div', { className: 'hex' }),
                React.createElement('div', { className: 'hex' })),
              React.createElement('div', { className: 'hex-row', style: { marginLeft: 7 } },
                React.createElement('div', { className: 'hex' }))
            ),
            React.createElement('div', null,
              React.createElement('div', { className: 'nav-wordmark' },
                'SaS', React.createElement('span', null, 'MasTER')),
              React.createElement('div', { className: 'nav-tag' }, 'Media Intelligence Platform')
            )
          ),
          React.createElement('div', { className: 'nav-right' }, 'ML · AI · Analytics')
        ),

        // 4 Glass Portal Screens
        React.createElement('div', { className: `screens-layer ${hoverCount > 0 ? 'has-hover' : ''}` },
          SCREENS.map((s, i) => React.createElement(GlassScreen, {
            key: s.id,
            ...s,
            autoActive: autoIdx === i,
            onEnter: onEnterPortal,
            setHovered: (on) => setHoverCount(c => Math.max(0, c + (on ? 1 : -1)))
          }))
        ),

        // Center tagline
        React.createElement('div', { className: 'hero-content' },
          React.createElement('div', { className: 'hero-eyebrow' }, 'Content Intelligence · Powered by ML/AI'),
          React.createElement('h1', { className: 'hero-title' },
            'The ', React.createElement('span', { className: 'highlight' }, 'Bloomberg'), ' of Media'),
          React.createElement('p', { className: 'hero-subtitle' },
            'Intelligently fitting the right content to the right viewers across every platform.')
        ),

        React.createElement('div', { className: 'scroll-cue' },
          React.createElement('div', { className: 'scroll-cue-text' }, 'Choose Your Portal'),
          React.createElement('div', { className: 'scroll-line' }))
      ),

      // ═══ PORTAL GRID SECTION (below fold — 5 cards incl. Exchange) ═══
      React.createElement('section', { className: 'portal-section', id: 'portals' },
        React.createElement('div', { className: 'portal-label' }, 'Research Portals'),
        React.createElement('h2', { className: 'portal-heading' }, 'Where Do You Want to Go?'),
        React.createElement('p', { className: 'portal-desc' },
          'Each portal is a dedicated intelligence layer — built on real data, powered by ML models, designed for decisions.'),
        React.createElement('div', { className: 'portals' },
          [
            { id: 'content',     cls: 'programming', num: '01', icon: '📺', sub: 'Research Portal', title: 'Programming Research', desc: 'Audience performance, content trends, competitive daypart analysis, and viewership forecasting across linear and streaming.', m1: '18.7K', ml1: 'Titles Tracked', m2: '719',  ml2: 'Distributors' },
            { id: 'advertising', cls: 'ad',          num: '02', icon: '📊', sub: 'Research Portal', title: 'Ad Research',          desc: 'Inventory intelligence, CPM benchmarking, avail forecasting, and yield optimization across linear, CTV, and digital.', m1: 'CTV',  ml1: '+ Linear',       m2: 'Real', ml2: 'Time Data' },
            { id: 'marketing',   cls: 'marketing',   num: '03', icon: '📣', sub: 'Research Portal', title: 'Marketing Research',   desc: 'Audience segmentation, reach & frequency analysis, campaign measurement, and cross-platform attribution modeling.', m1: '$279B', ml1: 'Content Market', m2: '240M+', ml2: 'HH Reached' },
            { id: 'cpg',         cls: 'cpg',         num: '04', icon: '🛒', sub: 'Research Portal', title: 'CPG Research',         desc: 'Consumer behavior overlays, purchase intent signals, category targeting, and retail media performance analytics.',  m1: '1st',  ml1: 'Party Data',     m2: 'ML',   ml2: 'Powered' },
            { id: 'exchange',    cls: 'exchange',    num: '05', icon: '◇',  sub: 'Content Marketplace', title: 'The Exchange',     desc: 'Buy, sell and license content, rights windows, and ad inventory in a curated marketplace with live bids and matches.', m1: '12',   ml1: 'Active Lots',    m2: '$48M', ml2: 'Cleared Volume' },
          ].map(c => React.createElement('div', {
            key: c.id, className: `portal-card ${c.cls}`, onClick: () => onEnterPortal(c.id)
          },
            React.createElement('div', { className: 'card-number' }, c.num),
            React.createElement('div', { className: 'card-icon' }, c.icon),
            React.createElement('div', { className: 'card-sub' }, c.sub),
            React.createElement('div', { className: 'card-title' }, c.title),
            React.createElement('div', { className: 'card-desc' }, c.desc),
            React.createElement('div', { className: 'card-metrics' },
              React.createElement('div', { className: 'metric' },
                React.createElement('div', { className: 'metric-val' }, c.m1),
                React.createElement('div', { className: 'metric-label' }, c.ml1)),
              React.createElement('div', { className: 'metric' },
                React.createElement('div', { className: 'metric-val' }, c.m2),
                React.createElement('div', { className: 'metric-label' }, c.ml2))
            ),
            React.createElement('div', { className: 'card-cta' },
              React.createElement('div', { className: 'cta-line' }), 'Enter Portal')
          ))
        )
      ),

      React.createElement('div', { className: 'bottom-bar' },
        React.createElement('div', { className: 'bottom-copy' }, '© 2026 SaSMaster · Media Intelligence Platform'),
        React.createElement('div', { className: 'bottom-tag' }, 'Bloomberg Terminal for Media')
      )
    )
  );
}

Object.assign(window, { HomeScreen });
