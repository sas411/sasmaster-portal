// ═══════════════════════════════════════════════════════════
// SaSMaster — shared chrome: TopNav, Ticker, PortalHeader, DrScoop
// Exports all to window for cross-file access.
// ═══════════════════════════════════════════════════════════

const { useState, useEffect, useRef, useMemo } = React;

// ─── Logo / wordmark ───────────────────────────────────────
function Wordmark({ size = 22, showTag = true }) {
  return React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: 10 } },
    React.createElement('div', { className: 'hex-logo', style: { display: 'flex', flexDirection: 'column', gap: 2 } },
      React.createElement('div', { style: { display: 'flex', gap: 2 } },
        React.createElement('div', { style: hexStyle() }),
        React.createElement('div', { style: hexStyle(0.6) }),
      ),
      React.createElement('div', { style: { display: 'flex', gap: 2, marginLeft: 6 } },
        React.createElement('div', { style: hexStyle(0.6) }),
        React.createElement('div', { style: hexStyle() }),
      ),
    ),
    React.createElement('div', null,
      React.createElement('div', { style: { fontFamily: 'var(--display)', fontSize: size, letterSpacing: 3, color: '#fff', lineHeight: 1 } },
        'SAS', React.createElement('span', { style: { color: 'var(--gold)' } }, 'MASTER')
      ),
      showTag && React.createElement('div', { style: { fontFamily: 'var(--label)', fontSize: 8, letterSpacing: 2, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: 2 } }, 'Media Intelligence')
    )
  );
}
function hexStyle(alpha = 1) {
  return {
    width: 9, height: 11,
    clipPath: 'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
    background: 'var(--gold)', opacity: alpha,
  };
}

// ─── Top Navigation ─────────────────────────────────────────
function TopNav({ current, onNav, onHome, theme, onTheme }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const t = time.toLocaleTimeString('en-US', { hour12: false });

  const PORTALS = [
    { id: 'content', label: 'CONTENT', color: 'var(--gold)' },
    { id: 'advertising', label: 'ADVERTISING', color: 'var(--cyan)' },
    { id: 'marketing', label: 'MARKETING', color: 'var(--red)' },
    { id: 'cpg', label: 'CPG', color: 'var(--green)' },
    { id: 'exchange', label: 'EXCHANGE', color: 'var(--purple)' },
  ];

  return React.createElement('div', { className: 'topnav' },
    React.createElement('button', { onClick: onHome, style: btnReset },
      React.createElement(Wordmark, { size: 20, showTag: false })
    ),
    React.createElement('div', { className: 'nav-divider only-tablet-up' }),
    React.createElement('nav', { className: 'nav-portals only-tablet-up' },
      PORTALS.map(p => React.createElement('button', {
        key: p.id,
        onClick: () => onNav(p.id),
        className: `nav-portal-link ${current === p.id ? 'active' : ''}`,
        style: { '--accent': p.color },
      }, p.label))
    ),
    React.createElement('div', { className: 'nav-spacer' }),
    React.createElement('div', { className: 'nav-live only-tablet-up' },
      React.createElement('span', { className: 'live-dot' }),
      'LIVE FEED'
    ),
    React.createElement('div', { className: 'nav-time only-desktop' }, t, ' UTC'),
    theme && onTheme && React.createElement(window.ThemeSwitcher, { theme, onTheme }),
    React.createElement('button', { className: 'nav-user', title: 'Account' },
      React.createElement('span', { style: { fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold)' } }, 'SM')
    )
  );
}
const btnReset = { background: 'none', border: 'none', padding: 0, cursor: 'pointer' };

// ─── Ticker ─────────────────────────────────────────────────
function Ticker({ items }) {
  const doubled = [...items, ...items, ...items];
  return React.createElement('div', { className: 'ticker' },
    React.createElement('div', { className: 'ticker-track' },
      doubled.map((it, i) => React.createElement(React.Fragment, { key: i },
        React.createElement('span', { className: 'ticker-item' }, it),
        React.createElement('span', { className: 'ticker-sep' }, '◆'),
      ))
    )
  );
}

// ─── Portal Header ─────────────────────────────────────────
function PortalHeader({ eyebrow, title, subtitle, accent, rightNode }) {
  return React.createElement('header', { className: 'portal-header' },
    React.createElement('div', null,
      React.createElement('div', { className: 'portal-eyebrow', style: { color: accent } }, eyebrow),
      React.createElement('h1', { className: 'portal-title' }, title),
      React.createElement('div', { className: 'portal-sub' }, subtitle)
    ),
    rightNode
  );
}

// ─── Dr. Scoop — persistent AI companion ───────────────────
function DrScoop({ context, insights }) {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(null);
  const [typing, setTyping] = useState(true);
  const [msgs, setMsgs] = useState([
    { from: 'scoop', text: `I'm reading the ${context} feed. Anything you'd like me to dig into?` }
  ]);
  const [draft, setDraft] = useState('');
  const scrollRef = useRef(null);

  // Proactive hint rotator
  useEffect(() => {
    if (open) return;
    let i = 0;
    const next = () => {
      setHint(insights[i % insights.length]);
      i++;
    };
    next();
    const t = setInterval(next, 8000);
    return () => clearInterval(t);
  }, [open, insights]);

  useEffect(() => {
    if (open && scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [msgs, open]);

  useEffect(() => {
    const t = setTimeout(() => setTyping(false), 1200);
    return () => clearTimeout(t);
  }, []);

  const send = (text) => {
    if (!text.trim()) return;
    const user = { from: 'user', text };
    setMsgs(m => [...m, user]);
    setDraft('');
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      setMsgs(m => [...m, { from: 'scoop', text: scoopReply(text, context) }]);
    }, 900 + Math.random() * 600);
  };

  const suggestions = useMemo(() => suggestionsFor(context), [context]);

  return React.createElement('div', { className: `drscoop ${open ? 'open' : ''}` },
    // Avatar button
    !open && React.createElement('button', {
      className: 'drscoop-avatar',
      onClick: () => setOpen(true),
      title: 'Ask Dr. Scoop'
    },
      React.createElement(ScoopFace, null),
      hint && React.createElement('div', { className: 'drscoop-hint' },
        React.createElement('div', { className: 'drscoop-hint-portal' }, hint.portal),
        React.createElement('div', { className: 'drscoop-hint-text' }, hint.title),
        React.createElement('div', { className: 'drscoop-hint-tail' })
      )
    ),
    // Chat panel
    open && React.createElement('div', { className: 'drscoop-panel' },
      React.createElement('div', { className: 'drscoop-head' },
        React.createElement('div', { className: 'drscoop-avatar-mini' }, React.createElement(ScoopFace, { small: true })),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { className: 'drscoop-name' }, 'DR. SCOOP'),
          React.createElement('div', { className: 'drscoop-status' },
            React.createElement('span', { className: 'live-dot' }), 'Online · reading ', context)
        ),
        React.createElement('button', { className: 'drscoop-x', onClick: () => setOpen(false) }, '×')
      ),
      React.createElement('div', { className: 'drscoop-body', ref: scrollRef },
        msgs.map((m, i) => React.createElement('div', { key: i, className: `drscoop-msg ${m.from}` }, m.text)),
        typing && React.createElement('div', { className: 'drscoop-msg scoop typing' },
          React.createElement('span', null), React.createElement('span', null), React.createElement('span', null)
        )
      ),
      React.createElement('div', { className: 'drscoop-suggest' },
        suggestions.map((s, i) => React.createElement('button', {
          key: i, className: 'drscoop-chip', onClick: () => send(s)
        }, s))
      ),
      React.createElement('form', {
        className: 'drscoop-form',
        onSubmit: (e) => { e.preventDefault(); send(draft); }
      },
        React.createElement('input', {
          placeholder: `Ask about ${context}…`,
          value: draft,
          onChange: (e) => setDraft(e.target.value),
        }),
        React.createElement('button', { type: 'submit', className: 'drscoop-send' }, '→')
      )
    )
  );
}

// Dr. Scoop face — authentic SCOOP brand mark
// Purple→cyan organic blob with white stacked speech-bubble logo ("Dr. SCOOP")
function ScoopFace({ small }) {
  const size = small ? 32 : 64;
  return React.createElement('div', {
    className: 'scoop-face', style: { width: size, height: size }
  },
    React.createElement('svg', { viewBox: '0 0 100 100', width: size, height: size },
      React.createElement('defs', null,
        React.createElement('linearGradient', { id: 'scoopBg', x1: '0%', y1: '0%', x2: '100%', y2: '60%' },
          React.createElement('stop', { offset: '0%',  stopColor: '#a020f0' }),
          React.createElement('stop', { offset: '55%', stopColor: '#7a3fff' }),
          React.createElement('stop', { offset: '100%', stopColor: '#22d3ff' })
        )
      ),
      // organic blob shape (the SCOOP brand backdrop)
      React.createElement('path', {
        d: 'M50 6 C72 6 92 18 96 38 C100 58 88 80 68 90 C48 100 24 96 12 80 C0 64 4 40 18 26 C28 16 36 6 50 6 Z',
        fill: 'url(#scoopBg)'
      }),
      // outer speech bubble (white, larger - back layer)
      React.createElement('path', {
        d: 'M28 28 Q28 22 34 22 L72 22 Q78 22 78 28 L78 50 Q78 56 72 56 L46 56 L40 64 L40 56 Q28 56 28 50 Z',
        fill: '#fff'
      }),
      // inner speech bubble (purple - front layer)
      React.createElement('path', {
        d: 'M22 36 Q22 30 28 30 L66 30 Q72 30 72 36 L72 60 Q72 66 66 66 L34 66 L26 76 L26 66 Q22 66 22 60 Z',
        fill: '#7a3fff'
      }),
      // "Dr." label
      React.createElement('text', {
        x: 32, y: 46, fontFamily: 'Bebas Neue',
        fontSize: 11, fill: '#fff', letterSpacing: 0.5
      }, 'Dr.'),
      // "SCOOP" main wordmark
      React.createElement('text', {
        x: 47, y: 60, fontFamily: 'Bebas Neue',
        fontSize: 14, fill: '#fff', textAnchor: 'middle', letterSpacing: 1.5, fontWeight: 700
      }, 'SCOOP')
    )
  );
}

function suggestionsFor(ctx) {
  const map = {
    HOME: ['What changed today?', 'Top anomalies', 'Brief me in 30 seconds'],
    CONTENT: ['Why is ESPN up?', 'Top 5 gainers this week', 'Compare BET vs TNT'],
    ADVERTISING: ['Pharma CPM trajectory', 'Which category is pacing hot?', 'Automotive vs Streaming'],
    MARKETING: ['Pantera QX performance', 'Best DMAs for reach', 'Flight status overview'],
    CPG: ['Fathom Beverage story', 'Categories losing velocity', 'Which brands to watch'],
    EXCHANGE: ['What\'s hot right now?', 'Bidding activity today', 'Suggest a deal'],
  };
  return map[ctx] || map.HOME;
}

function scoopReply(q, ctx) {
  const qq = q.toLowerCase();
  if (qq.includes('espn')) return 'ESPN is +68% above benchmark over the last 14 weeks. Sunday Night Countdown alone drove +12.3% week-over-week, with A25-54 reach at 18.2M — well ahead of season averages.';
  if (qq.includes('pantera')) return 'Pantera QX EV Launch hit 68.4M reach with frequency holding at 3.2. GRP is 218.4 — that\'s 24% above plan. Strong lift in NY (124 index) and SF (122).';
  if (qq.includes('pharma')) return 'Pharma & Rx breached the 2Q CPM ceiling at $34.60 — 22.8% pacing. Lumen Pharma DTC campaign is the primary driver. I\'d watch this window closely.';
  if (qq.includes('fathom')) return 'Fathom Beverage is the breakout this cycle: velocity 136, lift +22.3%. Six-week run with no sign of cooling. HHP is still only 19.6% — lots of headroom.';
  if (qq.includes('bidding') || qq.includes('hot') || qq.includes('exchange')) return 'Three listings in active bidding right now. Paper Cities S2 is the heat — 3 buyers, $10.8M current bid against $12.4M ask. The Last Convoy and Overnight Library are close behind.';
  if (qq.includes('brief')) return `Here\'s your 30-second brief for ${ctx}: signals are healthy overall. Two anomalies to watch: ESPN Sunday surge and Pharma CPM ceiling break. Everything else is tracking to plan.`;
  if (qq.includes('change') || qq.includes('today')) return 'Six signals moved today. Biggest: ESPN Sunday +12.3%, Fathom velocity 136, Paper Cities bidding opened. I\'ve flagged them in the insight panel.';
  return `Let me pull that. Based on current ${ctx} data: signals point to a positive week with two anomalies worth your attention. Want me to drill into one specifically?`;
}

Object.assign(window, { Wordmark, TopNav, Ticker, PortalHeader, DrScoop, ScoopFace });
