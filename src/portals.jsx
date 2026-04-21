// ═══════════════════════════════════════════════════════════
// SaSMaster — PORTAL SCREENS
// Five research portals: Content, Advertising, Marketing, CPG, Exchange
// ═══════════════════════════════════════════════════════════

const D = window.SASMASTER_DATA;

// ─── Shared: MiniChart (sparkline) ─────────────────────────
function Sparkline({ data, color = '#f0c040', width = 100, height = 28 }) {
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');
  return React.createElement('svg', { width, height, style: { display: 'block' } },
    React.createElement('polyline', { fill: 'none', stroke: color, strokeWidth: 1.4, points: pts }),
    React.createElement('circle', { cx: width, cy: height - ((data[data.length - 1] - min) / range) * height, r: 2.5, fill: color })
  );
}

// ─── Shared: LineChart (multi-series) ──────────────────────
function LineChart({ series, width = 800, height = 260, yMin = 80, yMax = 180 }) {
  const padL = 44, padR = 14, padT = 14, padB = 28;
  const w = width - padL - padR, h = height - padT - padB;
  const xs = series[0].data.length;
  const gridY = [yMin, (yMin+yMax)/2, yMax];
  return React.createElement('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', style: { display: 'block' } },
    // grid
    gridY.map((g, i) => React.createElement('g', { key: i },
      React.createElement('line', {
        x1: padL, x2: width - padR,
        y1: padT + h - ((g - yMin) / (yMax - yMin)) * h,
        y2: padT + h - ((g - yMin) / (yMax - yMin)) * h,
        stroke: 'rgba(255,255,255,0.06)'
      }),
      React.createElement('text', {
        x: padL - 8, y: padT + h - ((g - yMin) / (yMax - yMin)) * h + 3,
        fill: 'rgba(240,238,255,0.38)', fontSize: 9, textAnchor: 'end', fontFamily: 'Share Tech Mono'
      }, g)
    )),
    // lines
    series.map((s, si) => {
      const pts = s.data.map((v, i) => {
        const x = padL + (i / (xs - 1)) * w;
        const y = padT + h - ((v - yMin) / (yMax - yMin)) * h;
        return `${x},${y}`;
      }).join(' ');
      return React.createElement('g', { key: si },
        React.createElement('polyline', { fill: 'none', stroke: s.color, strokeWidth: 1.8, points: pts, opacity: 0.9 }),
        s.data.map((v, i) => {
          const x = padL + (i / (xs - 1)) * w;
          const y = padT + h - ((v - yMin) / (yMax - yMin)) * h;
          return React.createElement('circle', { key: i, cx: x, cy: y, r: 2, fill: s.color });
        })
      );
    })
  );
}

// ─── Helper: KPI Card ──────────────────────────────────────
function KPI({ label, value, delta, tone = '' }) {
  const cls = tone ? ` ${tone}` : '';
  const deltaCls = delta === undefined ? '' : (delta >= 0 ? 'delta-up' : 'delta-down');
  return React.createElement('div', { className: 'kpi-card' },
    React.createElement('div', { className: 'kpi-label' }, label),
    React.createElement('div', { className: `kpi-value${cls}` }, value),
    delta !== undefined && React.createElement('div', { className: `kpi-delta ${deltaCls}` },
      (delta >= 0 ? '▲ +' : '▼ '), Math.abs(delta).toFixed(1), '%'
    )
  );
}

// ═══ CONTENT PORTAL ═══════════════════════════════════════
function ContentPortal() {
  const [selectedNet, setSelectedNet] = React.useState('ESPN');
  const [view, setView] = React.useState('rankers');
  const [openProgram, setOpenProgram] = React.useState(null);
  const [tab, setTab] = React.useState('overview'); // overview | grid
  const series = [
    { name: 'ESPN',  color: '#c8352d', data: D.WEEKLY_TREND.map(w => w.espn) },
    { name: 'BET',   color: '#f0c040', data: D.WEEKLY_TREND.map(w => w.bet) },
    { name: 'USA',   color: '#3a7bd5', data: D.WEEKLY_TREND.map(w => w.usa) },
    { name: 'TNT',   color: '#d17a2e', data: D.WEEKLY_TREND.map(w => w.tnt) },
    { name: 'Bench', color: 'rgba(240,238,255,0.25)', data: D.WEEKLY_TREND.map(w => w.benchmark) },
  ];

  return React.createElement('div', { className: 'portal content-portal' },
    React.createElement(PortalHeader, {
      eyebrow: '◆ PORTAL 01',
      title: 'CONTENT',
      subtitle: 'Programming intelligence · networks · telecasts · trends',
      accent: 'var(--gold)',
      rightNode: React.createElement('div', { className: 'portal-header-kpis' },
        React.createElement('div', { className: 'mini-kpi' },
          React.createElement('div', { className: 'mini-kpi-label' }, 'Primary'),
          React.createElement('div', { className: 'mini-kpi-val gold' }, selectedNet)),
        React.createElement('div', { className: 'mini-kpi' },
          React.createElement('div', { className: 'mini-kpi-label' }, 'Window'),
          React.createElement('div', { className: 'mini-kpi-val mono' }, '14W · 1Q26')),
        React.createElement('div', { className: 'mini-kpi' },
          React.createElement('div', { className: 'mini-kpi-label' }, 'Demo'),
          React.createElement('div', { className: 'mini-kpi-val mono' }, 'A25-54'))
      )
    }),

    // Subnav: Overview / Schedule Grid / Rights & Metadata
    React.createElement('div', { className: 'subnav' },
      React.createElement('button', { className: `subnav-tab ${tab === 'overview' ? 'active' : ''}`, onClick: () => setTab('overview') }, '◆ OVERVIEW'),
      React.createElement('button', { className: `subnav-tab ${tab === 'grid' ? 'active' : ''}`, onClick: () => setTab('grid') }, '▦ MY NETWORK VIEW'),
      React.createElement('button', { className: `subnav-tab ${tab === 'rights' ? 'active' : ''}`, onClick: () => setTab('rights') }, '◈ RIGHTS & METADATA')
    ),

    // Network pills
    React.createElement('div', { className: 'net-pills' },
      D.NETWORKS.slice(0, 10).map(n => React.createElement('button', {
        key: n.id,
        className: `net-pill ${selectedNet === n.code ? 'active' : ''}`,
        onClick: () => setSelectedNet(n.code)
      }, n.code))
    ),

    // ── OVERVIEW TAB ──────────────────────────────────────
    tab === 'overview' && React.createElement(React.Fragment, null,
      // Macro-market dashboard (factoids + charts) BEFORE the tactical network view
      React.createElement(window.MacroDashContent, null),
      React.createElement('div', { className: 'kpi-row four' },
        React.createElement(KPI, { label: 'HH RATING', value: '2.84', delta: 12.3, tone: 'gold' }),
        React.createElement(KPI, { label: 'REACH', value: '18.2M', delta: 8.4, tone: '' }),
        React.createElement(KPI, { label: 'YAGO INDEX', value: '168', delta: 64.8, tone: 'green' }),
        React.createElement(KPI, { label: 'AVG MIN AUD', value: '892K', delta: 6.1, tone: '' }),
      ),
      React.createElement('div', { className: 'split-2' },
        React.createElement('div', { className: 'data-panel' },
          React.createElement('div', { className: 'panel-head' },
            React.createElement('div', { className: 'panel-title' }, '14-WEEK PERFORMANCE · ALL NETWORKS'),
            React.createElement('div', { className: 'panel-spacer' }),
            React.createElement('div', { className: 'legend' },
              series.map(s => React.createElement('span', { key: s.name, className: 'lg-item' },
                React.createElement('i', { style: { background: s.color } }), s.name)))
          ),
          React.createElement('div', { style: { padding: '14px 20px 20px' } },
            React.createElement(LineChart, { series, yMin: 80, yMax: 180 })
          )
        ),
        React.createElement('div', { className: 'data-panel' },
          React.createElement('div', { className: 'panel-head' },
            React.createElement('div', { className: 'panel-title' }, 'SMART INSIGHTS'),
            React.createElement('div', { className: 'panel-spacer' }),
            React.createElement('span', { className: 'chip gold' }, 'LIVE')),
          React.createElement('ul', { className: 'insight-list' },
            D.INSIGHTS.filter(i => i.portal === 'CONTENT' || i.sev === 'high').slice(0, 5).map((ins, i) =>
              React.createElement('li', { key: i, className: `insight ${ins.sev}` },
                React.createElement('span', { className: 'insight-tag' }, ins.portal),
                React.createElement('span', { className: 'insight-text' }, ins.title),
                React.createElement('span', { className: 'insight-when' }, ins.when)))
          )
        )
      ),
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'TOP PROGRAMMING · LAST 7 DAYS'),
          React.createElement('div', { className: 'panel-spacer' }),
          React.createElement('span', { className: 'chip', style: { color: 'var(--text-muted)' } }, 'TAP ROW FOR RIGHTS SHEET'),
          React.createElement('div', { style: { width: 10 } }),
          React.createElement('div', { className: 'tab-group' },
            ['rankers', 'trends', 'yago'].map(t => React.createElement('button', {
              key: t, className: `tab ${view === t ? 'active' : ''}`, onClick: () => setView(t)
            }, t.toUpperCase())))
        ),
        React.createElement('div', { style: { overflowX: 'auto' } },
          React.createElement('table', { className: 'data-table' },
            React.createElement('thead', null, React.createElement('tr', null,
              React.createElement('th', null, '#'),
              React.createElement('th', null, 'PROGRAM'),
              React.createElement('th', null, 'NETWORK'),
              React.createElement('th', null, 'GENRE'),
              React.createElement('th', { className: 'num' }, 'HH RATING'),
              React.createElement('th', { className: 'num' }, 'W/W'),
              React.createElement('th', { className: 'num' }, 'REACH'),
              React.createElement('th', null, 'DEMO'),
            )),
            React.createElement('tbody', null,
              D.PROGRAMS.map(p => React.createElement('tr', { key: p.rank, onClick: () => setOpenProgram(p) },
                React.createElement('td', null, React.createElement('span', { className: `rank-num ${p.rank <= 3 ? 'top' : ''}` }, String(p.rank).padStart(2, '0'))),
                React.createElement('td', null,
                  React.createElement('div', { className: 'show-title' }, p.title),
                  React.createElement('div', { className: 'show-ep' }, p.ep)),
                React.createElement('td', null, React.createElement('span', { className: 'net-tag' }, p.network)),
                React.createElement('td', null, React.createElement('span', { className: 'chip' }, p.genre)),
                React.createElement('td', { className: 'num big' }, p.rating.toFixed(2)),
                React.createElement('td', { className: `num ${p.delta >= 0 ? 'delta-up' : 'delta-down'}` },
                  (p.delta >= 0 ? '+' : ''), p.delta.toFixed(1), '%'),
                React.createElement('td', { className: 'num mono' }, p.reach),
                React.createElement('td', null, React.createElement('span', { className: 'chip' }, p.demo)))))
          )
        )
      )
    ),

    // ── SCHEDULE GRID TAB ──────────────────────────────────
    tab === 'grid' && React.createElement(ScheduleGrid, { network: selectedNet, onTelecastClick: setOpenProgram }),

    // ── RIGHTS & METADATA TAB ─────────────────────────────
    tab === 'rights' && React.createElement(RightsCatalog, { onOpen: setOpenProgram }),

    // ── PROGRAM DETAIL MODAL ──────────────────────────────
    openProgram && React.createElement(ProgramDetail, { program: openProgram, onClose: () => setOpenProgram(null) })
  );
}

// ═══ ADVERTISING PORTAL ═══════════════════════════════════
function AdvertisingPortal() {
  const totalSpend = D.AD_CATEGORIES.reduce((s, c) => s + c.spend, 0);
  return React.createElement('div', { className: 'portal advertising-portal' },
    React.createElement(PortalHeader, {
      eyebrow: '◆ PORTAL 02', title: 'ADVERTISING',
      subtitle: 'Spend · pacing · CPM · category share',
      accent: 'var(--cyan)'
    }),
    React.createElement('div', { className: 'kpi-row four' },
      React.createElement(KPI, { label: 'Q2 PACING', value: '$1.54B', delta: 11.2, tone: 'blue' }),
      React.createElement(KPI, { label: 'AVG CPM', value: '$24.18', delta: 4.2 }),
      React.createElement(KPI, { label: 'FILL RATE', value: '94.2%', delta: 1.8, tone: 'green' }),
      React.createElement(KPI, { label: 'CATEGORIES', value: '42', delta: 0 })
    ),
    React.createElement('div', { className: 'data-panel' },
      React.createElement('div', { className: 'panel-head' },
        React.createElement('div', { className: 'panel-title' }, 'CATEGORY SPEND · Q2 TO DATE'),
        React.createElement('div', { className: 'panel-spacer' }),
        React.createElement('span', { className: 'chip purple' }, 'NIELSEN + VAN')),
      React.createElement('div', { className: 'cat-grid' },
        D.AD_CATEGORIES.map((c, i) => {
          const pct = (c.spend / totalSpend) * 100;
          return React.createElement('div', { key: i, className: 'cat-row' },
            React.createElement('div', { className: 'cat-head' },
              React.createElement('span', { className: 'cat-name' }, c.cat),
              React.createElement('span', { className: `cat-pace ${c.pacing >= 0 ? 'up' : 'down'}` },
                (c.pacing >= 0 ? '▲' : '▼'), ' ', Math.abs(c.pacing).toFixed(1), '%')),
            React.createElement('div', { className: 'cat-bar-track' },
              React.createElement('div', { className: 'cat-bar', style: { width: pct * 4 + '%' } })),
            React.createElement('div', { className: 'cat-stats' },
              React.createElement('span', null, '$', c.spend.toFixed(1), 'M'),
              React.createElement('span', null, 'CPM $', c.cpm.toFixed(2)),
              React.createElement('span', null, c.share.toFixed(1), '% share')));
        })
      )
    )
  );
}

// ═══ MARKETING PORTAL ═════════════════════════════════════
function MarketingPortal() {
  return React.createElement('div', { className: 'portal marketing-portal' },
    React.createElement(PortalHeader, {
      eyebrow: '◆ PORTAL 03', title: 'MARKETING',
      subtitle: 'Campaigns · reach · frequency · DMA index',
      accent: 'var(--red)'
    }),
    React.createElement('div', { className: 'kpi-row four' },
      React.createElement(KPI, { label: 'ACTIVE CAMPAIGNS', value: '38', delta: 12.5 }),
      React.createElement(KPI, { label: 'TOTAL REACH', value: '286M', delta: 8.1, tone: 'green' }),
      React.createElement(KPI, { label: 'AVG FREQUENCY', value: '3.4', delta: -2.1 }),
      React.createElement(KPI, { label: 'GRP DELIVERED', value: '1,024', delta: 14.2, tone: 'blue' })
    ),
    React.createElement('div', { className: 'split-2' },
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'CAMPAIGN ROSTER')),
        React.createElement('div', { style: { overflowX: 'auto' } },
          React.createElement('table', { className: 'data-table' },
            React.createElement('thead', null, React.createElement('tr', null,
              React.createElement('th', null, 'CAMPAIGN'),
              React.createElement('th', null, 'BRAND'),
              React.createElement('th', { className: 'num' }, 'REACH'),
              React.createElement('th', { className: 'num' }, 'FREQ'),
              React.createElement('th', { className: 'num' }, 'GRP'),
              React.createElement('th', null, 'STATUS'))),
            React.createElement('tbody', null,
              D.CAMPAIGNS.map((c, i) => React.createElement('tr', { key: i },
                React.createElement('td', null, React.createElement('div', { className: 'show-title' }, c.name)),
                React.createElement('td', null, React.createElement('div', { style: { fontSize: 12, color: 'var(--text-dim)' } }, c.brand)),
                React.createElement('td', { className: 'num mono' }, c.reach),
                React.createElement('td', { className: 'num mono' }, c.freq.toFixed(1)),
                React.createElement('td', { className: 'num mono' }, c.grp.toFixed(1)),
                React.createElement('td', null, React.createElement('span', { className: `chip ${c.status === 'live' ? 'green' : c.status === 'paused' ? 'red' : 'purple'}` }, c.status))))))
        )
      ),
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'TOP DMAs · INDEX')),
        React.createElement('ul', { className: 'dma-list' },
          D.DMAS.map((d, i) => React.createElement('li', { key: i, className: 'dma-row' },
            React.createElement('span', { className: 'dma-name' }, d.dma),
            React.createElement('div', { className: 'dma-bar-track' },
              React.createElement('div', { className: 'dma-bar', style: { width: Math.min(100, d.index - 80) * 2 + '%' } })),
            React.createElement('span', { className: 'dma-idx' }, d.index),
            React.createElement('span', { className: 'dma-hh' }, d.households))))
      )
    )
  );
}

// ═══ CPG PORTAL ═══════════════════════════════════════════
function CPGPortal() {
  return React.createElement('div', { className: 'portal cpg-portal' },
    React.createElement(PortalHeader, {
      eyebrow: '◆ PORTAL 04', title: 'CPG',
      subtitle: 'Brand velocity · retail lift · panel signals',
      accent: 'var(--green)'
    }),
    React.createElement('div', { className: 'kpi-row four' },
      React.createElement(KPI, { label: 'BRANDS TRACKED', value: '1,284', delta: 4.6 }),
      React.createElement(KPI, { label: 'AVG VELOCITY', value: '118', delta: 8.2, tone: 'green' }),
      React.createElement(KPI, { label: '$$ VOLUME', value: '$2.48B', delta: 6.1, tone: 'gold' }),
      React.createElement(KPI, { label: 'HHP AVG', value: '24.7%', delta: 1.4 })
    ),
    React.createElement('div', { className: 'data-panel' },
      React.createElement('div', { className: 'panel-head' },
        React.createElement('div', { className: 'panel-title' }, 'BRAND VELOCITY · TOP MOVERS'),
        React.createElement('div', { className: 'panel-spacer' }),
        React.createElement('span', { className: 'chip green' }, '8W TREND')),
      React.createElement('div', { className: 'brand-grid' },
        D.BRANDS.map((b, i) => React.createElement('div', { key: i, className: 'brand-card' },
          React.createElement('div', { className: 'brand-head' },
            React.createElement('div', { className: 'brand-name' }, b.brand),
            React.createElement('div', { className: 'brand-cat' }, b.category)),
          React.createElement('div', { className: 'brand-spark' },
            React.createElement(Sparkline, { data: b.sparkline, color: b.lift >= 0 ? 'var(--green)' : 'var(--red)', width: 120, height: 36 })),
          React.createElement('div', { className: 'brand-stats' },
            React.createElement('div', null,
              React.createElement('span', { className: 'bs-l' }, 'Velocity'),
              React.createElement('span', { className: 'bs-v' }, b.velocity)),
            React.createElement('div', null,
              React.createElement('span', { className: 'bs-l' }, 'Lift'),
              React.createElement('span', { className: `bs-v ${b.lift >= 0 ? 'up' : 'down'}` },
                (b.lift >= 0 ? '+' : ''), b.lift.toFixed(1), '%')),
            React.createElement('div', null,
              React.createElement('span', { className: 'bs-l' }, 'HHP'),
              React.createElement('span', { className: 'bs-v' }, b.hhp)),
            React.createElement('div', null,
              React.createElement('span', { className: 'bs-l' }, '$ Vol'),
              React.createElement('span', { className: 'bs-v' }, b.dollars))))))
    )
  );
}

// ═══ EXCHANGE PORTAL ══════════════════════════════════════
function ExchangePortal() {
  return React.createElement('div', { className: 'portal exchange-portal' },
    React.createElement(PortalHeader, {
      eyebrow: '◆ PORTAL 05', title: 'EXCHANGE',
      subtitle: 'Content marketplace · listings · bids · rights',
      accent: 'var(--purple)'
    }),
    // Macro marketplace dashboard BEFORE the live listings
    React.createElement(window.MacroDashExchange, null),
    React.createElement('div', { className: 'data-panel' },
      React.createElement('div', { className: 'panel-head' },
        React.createElement('div', { className: 'panel-title' }, 'LIVE LISTINGS'),
        React.createElement('div', { className: 'panel-spacer' }),
        React.createElement('button', { className: 'ctrl-btn active' }, 'ALL'),
        React.createElement('button', { className: 'ctrl-btn' }, 'HOT'),
        React.createElement('button', { className: 'ctrl-btn' }, 'BIDDING'),
        React.createElement('button', { className: 'ctrl-btn' }, 'WATCHING')),
      React.createElement('div', { className: 'listing-grid' },
        D.LISTINGS.map((l, i) => React.createElement('div', { key: l.id, className: `listing-card ${l.hot ? 'hot' : ''}` },
          React.createElement('div', { className: 'listing-head' },
            React.createElement('span', { className: 'listing-id' }, l.id),
            l.hot && React.createElement('span', { className: 'listing-hot' }, '● HOT')),
          React.createElement('div', { className: 'listing-title' }, l.title),
          React.createElement('div', { className: 'listing-seller' }, 'by ', React.createElement('span', null, l.seller)),
          React.createElement('div', { className: 'listing-meta' },
            React.createElement('div', null,
              React.createElement('span', { className: 'lm-l' }, 'Type'),
              React.createElement('span', { className: 'lm-v' }, l.type)),
            React.createElement('div', null,
              React.createElement('span', { className: 'lm-l' }, 'Territory'),
              React.createElement('span', { className: 'lm-v' }, l.territory)),
            React.createElement('div', null,
              React.createElement('span', { className: 'lm-l' }, 'Window'),
              React.createElement('span', { className: 'lm-v mono' }, l.windows)),
            React.createElement('div', null,
              React.createElement('span', { className: 'lm-l' }, 'Episodes'),
              React.createElement('span', { className: 'lm-v mono' }, l.episodes))),
          React.createElement('div', { className: 'listing-bid' },
            React.createElement('div', null,
              React.createElement('div', { className: 'lb-l' }, 'Asking'),
              React.createElement('div', { className: 'lb-v gold' }, l.asking)),
            React.createElement('div', null,
              React.createElement('div', { className: 'lb-l' }, 'Current Bid'),
              React.createElement('div', { className: 'lb-v' }, l.bid))),
          React.createElement('div', { className: 'listing-actions' },
            React.createElement('button', { className: `listing-cta ${l.status}` },
              l.status === 'bidding' ? 'PLACE BID →' : l.status === 'preview' ? 'PREVIEW' : 'OPEN DEAL →'),
            React.createElement('button', { className: 'listing-watch' }, '☆')))))
    )
  );
}

// ═══════════════════════════════════════════════════════════
// SCHEDULE GRID — "My Network View" (from original Programming Research Portal)
// 7 days × dayparts; each cell is a telecast with title/time/RTG/SHR/000s
// ═══════════════════════════════════════════════════════════
const SCHEDULE_PROGRAMS = [
  { title: 'SUNDAY NIGHT COUNTDOWN', genre: 'Sports' },
  { title: 'THE LAST CONVOY',        genre: 'Drama'  },
  { title: 'MIDNIGHT KITCHEN',       genre: 'Lifestyle' },
  { title: 'HAMMER & NAIL',          genre: 'Lifestyle' },
  { title: 'IRONFORGE',              genre: 'Documentary' },
  { title: 'LONE STAR CROSSING',     genre: 'Scripted' },
  { title: 'CAPE LIGHT',             genre: 'Drama' },
  { title: 'DEEP OCEAN ARCHIVES',    genre: 'Doc' },
  { title: 'PAPER CITIES',           genre: 'Drama' },
  { title: 'THE OVERNIGHT',          genre: 'Thriller' },
  { title: 'HIDDEN PROVINCE',        genre: 'Reality' },
  { title: 'COAST TO COAST',         genre: 'Lifestyle' },
];

function makeScheduleCells() {
  // 14 daypart rows × 7 day cols
  const dayparts = ['6A','7A','8A','9A','10A','11A','12P','1P','2P','3P','4P','5P','6P','7P','8P','9P','10P','11P'];
  const days = ['MON','TUE','WED','THU','FRI','SAT','SUN'];
  const cells = {};
  let prog = 0;
  days.forEach((d, di) => {
    let h = 0;
    while (h < dayparts.length) {
      const p = SCHEDULE_PROGRAMS[(prog + di * 3) % SCHEDULE_PROGRAMS.length];
      const span = 1 + ((di + h) % 3); // 1-3 hour blocks
      const start = dayparts[h];
      const end = dayparts[Math.min(h + span, dayparts.length - 1)];
      cells[`${d}-${h}`] = {
        day: d, dayIdx: di, startHour: h, span,
        program: p,
        time: `${start} - ${end}`,
        rtg:    (0.04 + ((prog * 13 + di * 7 + h) % 220) / 1000).toFixed(3),
        shr:    (0.6 + ((prog * 7 + di * 11 + h) % 180) / 100).toFixed(3),
        thousands: 40 + ((prog * 19 + di * 13 + h * 5) % 80),
        live: (di === 6 && h >= 12 && h <= 14), // Sunday prime
      };
      h += span;
      prog++;
    }
  });
  return { dayparts, days, cells };
}

function ScheduleGrid({ network, onTelecastClick }) {
  const [demo, setDemo] = React.useState('A25-54');
  const [metric, setMetric] = React.useState('RTG');
  const { dayparts, days, cells } = React.useMemo(makeScheduleCells, [network]);

  return React.createElement('div', { className: 'schedule-wrap' },
    // Schedule toolbar
    React.createElement('div', { className: 'schedule-toolbar' },
      React.createElement('div', { className: 'sched-net' },
        React.createElement('span', { className: 'sched-net-tag' }, network),
        React.createElement('span', { className: 'sched-net-label' }, ' · MY NETWORK VIEW')),
      React.createElement('div', { className: 'sched-week' },
        React.createElement('button', { className: 'sched-step' }, '←'),
        React.createElement('span', { className: 'sched-week-range' }, 'WEEK 14 · 04 APR – 10 APR 2026'),
        React.createElement('button', { className: 'sched-step' }, '→'),
      ),
      React.createElement('div', { className: 'sched-controls' },
        React.createElement('div', { className: 'tab-group' },
          ['A18-49','A25-54','W25-54','M25-54','HH'].map(d =>
            React.createElement('button', { key: d, className: `tab ${demo === d ? 'active' : ''}`, onClick: () => setDemo(d) }, d))),
        React.createElement('div', { className: 'tab-group' },
          ['RTG','SHR','000s'].map(m =>
            React.createElement('button', { key: m, className: `tab ${metric === m ? 'active' : ''}`, onClick: () => setMetric(m) }, m)))
      )
    ),

    // The grid
    React.createElement('div', { className: 'schedule-grid-scroll' },
      React.createElement('div', { className: 'schedule-grid', style: { gridTemplateColumns: `60px repeat(7, minmax(140px, 1fr))` } },
        // header row
        React.createElement('div', { className: 'sched-corner' }, ''),
        days.map(d => React.createElement('div', { key: d, className: 'sched-day-head' },
          React.createElement('div', { className: 'sched-day-name' }, d),
          React.createElement('div', { className: 'sched-day-share' }, 'TD ', (0.7 + Math.random() * 0.5).toFixed(3), ' · PT ', (0.3 + Math.random() * 0.4).toFixed(3))
        )),
        // body rows
        dayparts.map((dp, hi) => React.createElement(React.Fragment, { key: dp },
          React.createElement('div', { className: 'sched-hour' }, dp),
          days.map(d => {
            const cell = cells[`${d}-${hi}`];
            if (!cell || cell.startHour !== hi) return React.createElement('div', { key: d, className: 'sched-cell empty' });
            const val = metric === 'RTG' ? cell.rtg : metric === 'SHR' ? cell.shr : String(cell.thousands);
            return React.createElement('button', {
              key: d,
              className: `sched-cell ${cell.live ? 'live' : ''}`,
              style: { gridRow: `span ${cell.span}` },
              onClick: () => onTelecastClick({
                title: cell.program.title,
                ep: `S${(hi % 9)+1}E${(hi*2+1)}`,
                network, genre: cell.program.genre,
                rating: parseFloat(cell.rtg) * 30, delta: ((hi % 7) - 3) * 2.5,
                reach: `${(cell.thousands * 0.18).toFixed(1)}M`, demo
              })
            },
              React.createElement('div', { className: 'sched-prog-title' }, cell.program.title),
              React.createElement('div', { className: 'sched-prog-time' }, cell.time),
              React.createElement('div', { className: 'sched-stats' },
                React.createElement('div', null, React.createElement('span', null, 'RTG'), React.createElement('em', null, cell.rtg)),
                React.createElement('div', null, React.createElement('span', null, 'SHR'), React.createElement('em', null, cell.shr)),
                React.createElement('div', null, React.createElement('span', null, '000s'), React.createElement('em', null, cell.thousands))
              ),
              cell.live && React.createElement('span', { className: 'sched-live-pip' })
            );
          })
        ))
      )
    )
  );
}

// ═══════════════════════════════════════════════════════════
// RIGHTS CATALOG — title cards with deal status
// ═══════════════════════════════════════════════════════════
function RightsCatalog({ onOpen }) {
  return React.createElement('div', { className: 'data-panel' },
    React.createElement('div', { className: 'panel-head' },
      React.createElement('div', { className: 'panel-title' }, 'RIGHTS CATALOG · ACTIVE DEALS'),
      React.createElement('div', { className: 'panel-spacer' }),
      React.createElement('span', { className: 'chip purple' }, 'RSG MARKET WATCH'),
    ),
    React.createElement('div', { className: 'rights-grid' },
      D.PROGRAMS.slice(0, 8).map(p => React.createElement('button', {
        key: p.rank, className: 'rights-card', onClick: () => onOpen(p)
      },
        React.createElement('div', { className: 'rights-poster',
          style: { background: `linear-gradient(135deg, ${posterColor(p.rank, 0)}, ${posterColor(p.rank, 1)})` }
        },
          React.createElement('div', { className: 'rights-poster-title' }, p.title.split(' ').slice(0, 3).join(' ')),
          React.createElement('div', { className: 'rights-poster-net' }, p.network),
        ),
        React.createElement('div', { className: 'rights-meta' },
          React.createElement('div', { className: 'rights-name' }, p.title),
          React.createElement('div', { className: 'rights-deal' }, dealKind(p.rank), ' · ', p.genre),
          React.createElement('div', { className: 'rights-bottom' },
            React.createElement('span', { className: 'chip gold' }, p.rank <= 3 ? 'HOT' : 'OPEN'),
            React.createElement('span', { className: 'rights-cost' }, '$', (1 + p.rank * 0.7).toFixed(1), 'M')
          )
        )
      ))
    )
  );
}

function posterColor(seed, idx) {
  const palette = ['#7a3fff','#22d3ff','#f0c040','#ff4d6a','#39d98a','#a78bfa','#36c5f0','#d17a2e'];
  return palette[(seed * 3 + idx * 5) % palette.length];
}
function dealKind(rank) {
  return ['SVOD Rights','Linear + AVOD','Exclusive','Cable Bundle','Library Pack','Format Rights','Production','TVEverywhere'][rank % 8];
}

// ═══════════════════════════════════════════════════════════
// PROGRAM DETAIL — modal with poster, deal sheet, streaming availability,
// performance overview, audience profile (echoes the Metadata Framework v2)
// ═══════════════════════════════════════════════════════════
const STREAM_PARTNERS = [
  { name: 'Hulu',        c1: '#1ce783', c2: '#0a3' },
  { name: 'Max',         c1: '#002be7', c2: '#5b1aff' },
  { name: 'Netflix',     c1: '#e50914', c2: '#831010' },
  { name: 'Prime',       c1: '#00a8e1', c2: '#003e72' },
  { name: 'Disney+',     c1: '#0a47a1', c2: '#1c80ff' },
  { name: 'Paramount+',  c1: '#0064ff', c2: '#00308f' },
  { name: 'Peacock',     c1: '#fa8b21', c2: '#a838c7' },
  { name: 'Apple TV+',   c1: '#000',   c2: '#444' },
  { name: 'YouTube TV',  c1: '#ff0000', c2: '#990000' },
  { name: 'Tubi',        c1: '#ffd400', c2: '#ff7a00' },
  { name: 'Roku',        c1: '#6f1ab1', c2: '#2c0a4f' },
  { name: 'fuboTV',      c1: '#fa3c00', c2: '#a01700' },
];

function ProgramDetail({ program, onClose }) {
  const [tab, setTab] = React.useState('rights');
  // close on escape
  React.useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const seed = (program.rank || 1);
  const availableStream  = STREAM_PARTNERS.slice(0, 6);
  const availablePurchase = STREAM_PARTNERS.slice(5, 11);

  return React.createElement('div', { className: 'modal-scrim', onClick: onClose },
    React.createElement('div', { className: 'modal-card', onClick: (e) => e.stopPropagation() },
      // Header
      React.createElement('div', { className: 'modal-head' },
        React.createElement('div', { className: 'modal-eyebrow' }, '◆ RIGHTS · METADATA · PERFORMANCE'),
        React.createElement('div', { className: 'modal-title-wrap' },
          React.createElement('div', { className: 'modal-poster',
            style: { background: `linear-gradient(135deg, ${posterColor(seed, 0)}, ${posterColor(seed, 1)})` }
          },
            React.createElement('div', { style: { fontFamily: 'var(--display)', fontSize: 22, color: '#fff', textAlign: 'center', padding: 14, lineHeight: 1.05, letterSpacing: 1 } }, program.title)
          ),
          React.createElement('div', { className: 'modal-title-meta' },
            React.createElement('h2', { className: 'modal-title' }, program.title),
            React.createElement('div', { className: 'modal-sub' },
              program.network, ' · ', program.genre, ' · ', program.ep || `S${seed}E0${(seed % 9)+1}`),
            React.createElement('div', { className: 'modal-trailer' },
              React.createElement('button', { className: 'trailer-btn' }, '▶ WATCH TRAILER'),
              React.createElement('button', { className: 'trailer-btn ghost' }, '↗ OPEN IN PORTAL'),
            )
          ),
          React.createElement('button', { className: 'modal-close', onClick: onClose }, '×')
        ),
        // Tabs
        React.createElement('div', { className: 'modal-tabs' },
          React.createElement('button', { className: `modal-tab ${tab === 'rights' ? 'active' : ''}`, onClick: () => setTab('rights') }, '◈ Rights & Availability'),
          React.createElement('button', { className: `modal-tab ${tab === 'perf' ? 'active' : ''}`, onClick: () => setTab('perf') }, '▲ Performance Details'),
          React.createElement('button', { className: `modal-tab ${tab === 'aud' ? 'active' : ''}`, onClick: () => setTab('aud') }, '◐ Audience Profile')
        )
      ),

      // Body
      React.createElement('div', { className: 'modal-body' },
        tab === 'rights' && React.createElement(RightsTab, { program, availableStream, availablePurchase }),
        tab === 'perf'   && React.createElement(PerfTab,   { program }),
        tab === 'aud'    && React.createElement(AudienceTab, { program }),
      )
    )
  );
}

function RightsTab({ program, availableStream, availablePurchase }) {
  const seed = program.rank || 1;
  return React.createElement('div', { className: 'rights-pane' },
    // Deal sheet
    React.createElement('div', { className: 'deal-sheet' },
      React.createElement('div', { className: 'deal-sheet-head' },
        React.createElement('span', { className: 'deal-sheet-label' }, 'RSG RIGHTS'),
        React.createElement('span', { className: 'deal-sheet-tag' }, 'MARKET WATCH ▶')),
      React.createElement('table', { className: 'deal-table' },
        React.createElement('tbody', null,
          React.createElement('tr', null,
            React.createElement('td', null, 'Deal Name:'),
            React.createElement('td', null, program.title, ' · ', dealKind(seed))),
          React.createElement('tr', null,
            React.createElement('td', null, 'Deal Type:'),
            React.createElement('td', null, dealKind(seed))),
          React.createElement('tr', null,
            React.createElement('td', null, 'Rights Summary:'),
            React.createElement('td', null, 'Linear · TVEverywhere · SVOD ' + (seed % 2 ? '+ AVOD' : ''))),
          React.createElement('tr', null,
            React.createElement('td', null, 'Acquisition Cost:'),
            React.createElement('td', null, '$', (1 + seed * 0.7).toFixed(1), 'M')),
          React.createElement('tr', null,
            React.createElement('td', null, 'Exhibition Window:'),
            React.createElement('td', null, '1/1/2026 – 12/31/2028')),
          React.createElement('tr', null,
            React.createElement('td', null, 'Total Runs:'),
            React.createElement('td', null, 25 + seed * 3)),
          React.createElement('tr', null,
            React.createElement('td', null, 'Remaining Runs:'),
            React.createElement('td', null, 'Unlimited'))
        )
      )
    ),

    // Streaming availability
    React.createElement('div', { className: 'avail-block' },
      React.createElement('div', { className: 'avail-head' },
        React.createElement('span', { className: 'deal-sheet-label' }, 'STREAMING AVAILABILITY'),
        React.createElement('span', { className: 'avail-region' }, '◷ United States')),
      React.createElement('div', { className: 'avail-row' },
        React.createElement('div', { className: 'avail-row-l' }, 'STREAM'),
        React.createElement('div', { className: 'avail-tiles' },
          availableStream.map((p, i) => React.createElement('div', { key: i, className: 'stream-tile',
            style: { background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }
          }, React.createElement('span', null, p.name)))
        )
      ),
      React.createElement('div', { className: 'avail-row' },
        React.createElement('div', { className: 'avail-row-l' }, 'RENT'),
        React.createElement('div', { className: 'avail-tiles' },
          availablePurchase.slice(0, 4).map((p, i) => React.createElement('div', { key: i, className: 'stream-tile',
            style: { background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }
          }, React.createElement('span', null, p.name)))
        )
      ),
      React.createElement('div', { className: 'avail-row' },
        React.createElement('div', { className: 'avail-row-l' }, 'BUY'),
        React.createElement('div', { className: 'avail-tiles' },
          availablePurchase.slice(2, 6).map((p, i) => React.createElement('div', { key: i, className: 'stream-tile',
            style: { background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }
          }, React.createElement('span', null, p.name)))
        )
      )
    )
  );
}

function PerfTab({ program }) {
  const seed = program.rank || 1;
  const series = [
    { name: program.network, color: 'var(--gold)', data: Array.from({length: 12}, (_, i) => 90 + Math.sin(i / 1.5 + seed) * 18 + i * 1.4 + seed * 2) },
    { name: 'Benchmark', color: 'rgba(240,238,255,0.3)', data: Array.from({length: 12}, () => 100) },
  ];
  return React.createElement('div', { className: 'perf-pane' },
    React.createElement('div', { className: 'kpi-row four', style: { padding: 0 } },
      React.createElement(KPI, { label: 'HH RATING', value: program.rating.toFixed(2), delta: program.delta, tone: 'gold' }),
      React.createElement(KPI, { label: 'REACH', value: program.reach, delta: 8.4 }),
      React.createElement(KPI, { label: 'AVG MIN AUD', value: `${(program.rating * 320).toFixed(0)}K`, delta: 6.1 }),
      React.createElement(KPI, { label: 'YAGO', value: '142', delta: 18.2, tone: 'green' })
    ),
    React.createElement('div', { className: 'data-panel', style: { margin: '14px 0 0' } },
      React.createElement('div', { className: 'panel-head' },
        React.createElement('div', { className: 'panel-title' }, '12-WEEK PERFORMANCE TREND')),
      React.createElement('div', { style: { padding: 16 } },
        React.createElement(LineChart, { series, yMin: 70, yMax: 160, width: 760, height: 240 }))
    )
  );
}

function AudienceTab({ program }) {
  const aud = window.SASMASTER_DATA.AUDIENCE || [
    { label: 'F25-54', val: 28 }, { label: 'M25-54', val: 24 },
    { label: 'F18-34', val: 16 }, { label: 'M18-34', val: 14 },
    { label: 'F55+',   val: 10 }, { label: 'M55+',   val: 8 },
  ];
  const max = Math.max(...aud.map(a => a.val));
  return React.createElement('div', { className: 'aud-pane' },
    React.createElement('div', { className: 'aud-block' },
      React.createElement('div', { className: 'panel-title', style: { padding: '0 0 10px' } }, 'DEMO COMPOSITION'),
      aud.map((d, i) => React.createElement('div', { key: i, className: 'aud-row' },
        React.createElement('span', { className: 'aud-label' }, d.label),
        React.createElement('div', { className: 'aud-bar-track' },
          React.createElement('div', { className: 'aud-bar', style: { width: `${(d.val / max) * 100}%` } })),
        React.createElement('span', { className: 'aud-val' }, d.val, '%')))
    ),
    React.createElement('div', { className: 'aud-block' },
      React.createElement('div', { className: 'panel-title', style: { padding: '0 0 10px' } }, 'ETHNIC INDEX (vs US Avg)'),
      [
        { label: 'African American', val: 218 },
        { label: 'Hispanic',          val: 124 },
        { label: 'Asian',             val:  88 },
        { label: 'Caucasian',         val:  72 },
      ].map((d, i) => React.createElement('div', { key: i, className: 'aud-row' },
        React.createElement('span', { className: 'aud-label' }, d.label),
        React.createElement('div', { className: 'aud-bar-track' },
          React.createElement('div', { className: 'aud-bar gold', style: { width: `${Math.min(100, d.val / 2.5)}%` } })),
        React.createElement('span', { className: 'aud-val' }, d.val)))
    )
  );
}

Object.assign(window, { ContentPortal, AdvertisingPortal, MarketingPortal, CPGPortal, ExchangePortal, ScheduleGrid, RightsCatalog, ProgramDetail });
