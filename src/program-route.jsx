// ═══════════════════════════════════════════════════════════
// ProgramRoute — Full-bleed cinematic shell
// Rails + pills + expanded panes
// ═══════════════════════════════════════════════════════════

const RAIL_DEFS = [
  { key: 'credits',    label: 'METADATA · NETWORK · CAST',  C: 'PR_RailCredits' },
  { key: 'financials', label: 'FINANCIALS · DEAL',      C: 'PR_RailFinancials' },
  { key: 'awards',     label: 'AWARDS · ACCOLADES',     C: 'PR_RailAwards' },
  { key: 'streaming',  label: 'STREAMING AVAILABILITY', C: 'PR_RailStreaming' },
  { key: 'performance',label: 'PERFORMANCE · VELOCITY', C: 'PR_RailPerformance' },
];

function ProgramRoute({ program, onClose }) {
  const [, forceRender] = React.useState(0);
  // Re-render when live TMDB data arrives
  React.useEffect(() => {
    const onHydrated = (e) => {
      if (e.detail && e.detail.rank === program.rank) forceRender(x => x + 1);
    };
    window.addEventListener('tmdb-hydrated', onHydrated);
    return () => window.removeEventListener('tmdb-hydrated', onHydrated);
  }, [program.rank]);
  const tmdb = window.SASMASTER_TMDB.getTMDB(program.rank);
  const firstGenre = (tmdb && tmdb.genres && tmdb.genres[0]) || program.genre;
  const backdrop = window.SASMASTER_TMDB.getGenreBackdrop(firstGenre);
  const [railIdx, setRailIdx] = React.useState(0);
  const [pane, setPane] = React.useState(null); // 'rights' | 'performance' | 'audience' | null
  const paneDepth = React.useRef(0);

  // Close on ESC (but only if no pane open; if pane open, close pane first)
  React.useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (pane) setPane(null);
        else onClose();
      }
      if (e.key === 'ArrowRight' && !pane) setRailIdx((i) => Math.min(RAIL_DEFS.length - 1, i + 1));
      if (e.key === 'ArrowLeft' && !pane) setRailIdx((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, pane]);

  // Scroll lock
  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  if (!tmdb || !tmdb.title) {
    // Fallback minimal view when TMDB record missing
    return React.createElement('div', { className: 'program-route',
      style: { '--pr-c1': backdrop.c1, '--pr-c2': backdrop.c2, '--pr-accent': backdrop.accent } },
      React.createElement('div', { className: 'pr-backdrop' }),
      React.createElement('div', { className: 'pr-topbar' },
        React.createElement('button', { className: 'pr-back', onClick: onClose }, '← BACK'),
        React.createElement('button', { className: 'pr-close', onClick: onClose }, '×')
      ),
      React.createElement('div', { className: 'pr-title-card' },
        React.createElement('div', { className: 'pr-meta-line' }, program.network, ' · ', program.genre),
        React.createElement('h1', { className: 'pr-wordmark' }, program.title),
      )
    );
  }

  const railDef = RAIL_DEFS[railIdx];
  const RailC = window[railDef.C];

  const meta = [
    (tmdb.genres || []).slice(0, 3).join(' · '),
    fmtRuntime(tmdb.runtime),
    tmdb.certification,
  ].filter(Boolean).join('   ·   ');

  const openPane = (k) => { paneDepth.current += 1; setPane(k); };
  const closePane = () => setPane(null);

  return React.createElement('div', {
    className: 'program-route',
    style: {
      '--pr-c1': backdrop.c1,
      '--pr-c2': backdrop.c2,
      '--pr-accent': backdrop.accent
    }
  },
    // Backdrop (gradient base + real TMDB backdrop image if available, else painted scene)
    React.createElement('div', { className: 'pr-backdrop' }),
    tmdb.backdrop_url
      ? React.createElement('div', {
          className: 'pr-backdrop-img',
          style: { backgroundImage: `url(${tmdb.backdrop_url})` }
        })
      : React.createElement(window.PR_KeyArtScene, { genre: (tmdb.genres || [])[0] }),
    React.createElement('div', { className: 'pr-grain' }),

    // Top bar — minimal floating close, no back-label chrome
    React.createElement('div', { className: 'pr-topbar' },
      React.createElement('span', { className: 'pr-eyebrow-center' }, 'PROGRAM · #', String(program.rank).padStart(3, '0'), ' · ', program.network),
      React.createElement('button', { className: 'pr-close', onClick: onClose, title: 'Close (ESC)' }, '×')
    ),

    // Title card (bottom-left) — poster stacked with painted title block
    React.createElement('div', { className: 'pr-title-card' },
      React.createElement('div', { className: 'pr-poster',
        style: tmdb.poster_url
          ? { backgroundImage: `url(${tmdb.poster_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: `linear-gradient(135deg, ${backdrop.accent}, ${backdrop.c2})` } },
        !tmdb.poster_url && React.createElement('div', { className: 'pr-poster-title' }, tmdb.title),
        React.createElement('div', { className: 'pr-poster-ribbon' },
          React.createElement('span', { className: 'pr-poster-ribbon-dot' }),
          'WATCH NOW'
        )
      ),
      React.createElement('div', { className: 'pr-title-block' },
        React.createElement('h1', { className: 'pr-wordmark' }, tmdb.title,
          React.createElement('span', { className: 'pr-wordmark-year' }, ' (', fmtYear(tmdb.release_date), ')')
        ),
        React.createElement('div', { className: 'pr-meta-chips' },
          tmdb.certification && React.createElement('span', { className: 'pr-meta-chip outline' }, tmdb.certification),
          (tmdb.genres || []).slice(0, 2).map((g, i) =>
            React.createElement('span', { key: i, className: 'pr-meta-chip' }, g)),
          tmdb.runtime && React.createElement('span', { className: 'pr-meta-chip' }, fmtRuntime(tmdb.runtime))
        ),
        tmdb.tagline && React.createElement('div', { className: 'pr-tagline' }, '"', tmdb.tagline, '"')
      )
    ),

    // Right-side glass rail
    React.createElement('div', { className: 'pr-rail' },
      React.createElement('div', { className: 'pr-rail-glass' },
        React.createElement('div', { className: 'pr-rail-label' }, railDef.label),
        RailC && React.createElement(RailC, { tmdb, program }),
        React.createElement('div', { className: 'pr-rail-nav' },
          React.createElement('button', {
            className: 'pr-rail-arrow',
            onClick: () => setRailIdx((i) => Math.max(0, i - 1)),
            disabled: railIdx === 0
          }, '←'),
          React.createElement('div', { className: 'pr-rail-dots' },
            RAIL_DEFS.map((r, i) => React.createElement('button', {
              key: r.key,
              className: `pr-rail-dot ${i === railIdx ? 'active' : ''}`,
              onClick: () => setRailIdx(i),
              'aria-label': r.label
            }))
          ),
          React.createElement('button', {
            className: 'pr-rail-arrow',
            onClick: () => setRailIdx((i) => Math.min(RAIL_DEFS.length - 1, i + 1)),
            disabled: railIdx === RAIL_DEFS.length - 1
          }, '→')
        )
      )
    ),

    // Bottom rail — SaSMaster three-item layout
    React.createElement('div', { className: 'pr-bottom-rail' },
      React.createElement('button', {
        className: `pr-insight ${pane === 'performance' ? 'active' : ''}`,
        onClick: () => openPane('performance')
      },
        React.createElement('span', { className: 'pr-insight-i' }, 'ⓘ'),
        React.createElement('span', { className: 'pr-insight-label' },
          React.createElement('span', null, 'Program'),
          React.createElement('span', null, 'Performance Insights')
        )
      ),
      React.createElement('button', {
        className: `pr-rights-btn ${pane === 'rights' ? 'active' : ''}`,
        onClick: () => openPane('rights')
      },
        React.createElement('span', { className: 'pr-rights-label' }, 'Rights'),
        React.createElement('span', { className: 'pr-rights-play' }, '▶'),
        React.createElement('span', { className: 'pr-rights-chain' }, '⛓')
      ),
      React.createElement('button', {
        className: `pr-insight right ${pane === 'audience' ? 'active' : ''}`,
        onClick: () => openPane('audience')
      },
        React.createElement('span', { className: 'pr-insight-label right' },
          React.createElement('span', null, 'Audience Profile'),
          React.createElement('span', null, 'Insights')
        ),
        React.createElement('span', { className: 'pr-insight-i' }, 'ⓘ')
      )
    ),

    // Expanded pane
    pane && React.createElement(ProgramPane, { paneKey: pane, program, tmdb, onClose: closePane })
  );
}

function ProgramPane({ paneKey, program, tmdb, onClose }) {
  const titles = {
    rights: { title: 'RIGHTS & AVAILABILITY', sub: 'deal sheet · linear · streaming · territory' },
    performance: { title: 'PERFORMANCE DETAILS', sub: '14-week trend · demos · benchmarks' },
    audience: { title: 'AUDIENCE PROFILE', sub: 'demos · ethnic · dma · cross-platform' },
  };
  const { title, sub } = titles[paneKey];
  return React.createElement('div', { className: 'pr-pane' },
    React.createElement('div', { className: 'pr-pane-scrim', onClick: onClose }),
    React.createElement('div', { className: 'pr-pane-content' },
      React.createElement('div', { className: 'pr-pane-head' },
        React.createElement('div', null,
          React.createElement('span', { className: 'pr-pane-title' }, title),
          React.createElement('span', { className: 'pr-pane-sub' }, sub)
        ),
        React.createElement('button', { className: 'pr-pane-close', onClick: onClose }, '×')
      ),
      React.createElement('div', { className: 'pr-pane-body' },
        paneKey === 'rights'      && React.createElement(window.RightsTab,   { program, availableStream: STREAM_PARTNERS_PR.slice(0, 6), availablePurchase: STREAM_PARTNERS_PR.slice(5, 11) }),
        paneKey === 'performance' && React.createElement(window.PerfTab,     { program }),
        paneKey === 'audience'    && React.createElement(window.AudienceTab, { program })
      )
    )
  );
}

const STREAM_PARTNERS_PR = [
  { name: 'Hulu',        c1: '#1ce783', c2: '#0a3' },
  { name: 'Max',         c1: '#002be7', c2: '#5b1aff' },
  { name: 'Netflix',     c1: '#e50914', c2: '#831010' },
  { name: 'Prime',       c1: '#00a8e1', c2: '#003e72' },
  { name: 'Disney+',     c1: '#0a47a1', c2: '#1c80ff' },
  { name: 'Paramount+',  c1: '#0064ff', c2: '#00308f' },
  { name: 'Peacock',     c1: '#fa8b21', c2: '#a838c7' },
  { name: 'Apple TV+',   c1: '#000',    c2: '#444' },
  { name: 'YouTube TV',  c1: '#ff0000', c2: '#990000' },
  { name: 'Tubi',        c1: '#ffd400', c2: '#ff7a00' },
  { name: 'Roku',        c1: '#6f1ab1', c2: '#2c0a4f' },
  { name: 'fuboTV',      c1: '#fa3c00', c2: '#a01700' },
];

const { fmtMoney, fmtYear, fmtRuntime } = window.PR_Helpers;

Object.assign(window, { ProgramRoute });
