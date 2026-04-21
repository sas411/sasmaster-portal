// ═══════════════════════════════════════════════════════════
// ProgramRoute — Full-bleed cinematic drill-down
// Merges TMDB-metadata-card aesthetic with our Rights/Perf/Audience panels
// ═══════════════════════════════════════════════════════════

const PR_D = window.SASMASTER_DATA;
const PR_T = window.SASMASTER_TMDB;

function fmtMoney(n) {
  if (!n) return '—';
  if (n >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B';
  if (n >= 1e6) return '$' + (n / 1e6).toFixed(1) + 'M';
  if (n >= 1e3) return '$' + (n / 1e3).toFixed(0) + 'K';
  return '$' + n;
}
function fmtYear(date) { return (date || '').slice(0, 4); }
function fmtRuntime(min) {
  if (!min) return '';
  const h = Math.floor(min / 60), m = min % 60;
  return (h ? h + 'h ' : '') + (m ? m + 'm' : '');
}

// Genre-specific key-art SVG (placeholder when no real TMDB backdrop)
function KeyArt({ genre }) {
  const g = genre || 'Drama';
  const common = { xmlns: 'http://www.w3.org/2000/svg', viewBox: '0 0 400 400' };
  const maps = {
    'Sports':      React.createElement('svg', common,
      // stadium arcs
      React.createElement('ellipse', { cx: 200, cy: 340, rx: 190, ry: 50, fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      React.createElement('ellipse', { cx: 200, cy: 340, rx: 140, ry: 36, fill: 'none', stroke: '#fff', strokeWidth: 1 }),
      React.createElement('ellipse', { cx: 200, cy: 340, rx: 90,  ry: 22, fill: 'none', stroke: '#fff', strokeWidth: 0.8 }),
      // lights
      React.createElement('path', { d: 'M80 60 L80 140 M160 40 L160 130 M240 40 L240 130 M320 60 L320 140', stroke: '#fff', strokeWidth: 2 }),
      React.createElement('circle', { cx: 80, cy: 50, r: 12, fill: '#fff' }),
      React.createElement('circle', { cx: 160, cy: 30, r: 12, fill: '#fff' }),
      React.createElement('circle', { cx: 240, cy: 30, r: 12, fill: '#fff' }),
      React.createElement('circle', { cx: 320, cy: 50, r: 12, fill: '#fff' }),
    ),
    'Drama':       React.createElement('svg', common,
      React.createElement('rect', { x: 80, y: 80, width: 240, height: 240, fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      React.createElement('rect', { x: 120, y: 120, width: 160, height: 160, fill: 'none', stroke: '#fff', strokeWidth: 0.8 }),
      React.createElement('circle', { cx: 200, cy: 200, r: 60, fill: 'none', stroke: '#fff', strokeWidth: 1 }),
    ),
    'Thriller':    React.createElement('svg', common,
      React.createElement('path', { d: 'M 50 350 L 200 50 L 350 350 Z', fill: 'none', stroke: '#fff', strokeWidth: 1.4 }),
      React.createElement('circle', { cx: 200, cy: 220, r: 8, fill: '#fff' }),
    ),
    'Documentary': React.createElement('svg', common,
      // film strip
      React.createElement('rect', { x: 60, y: 130, width: 280, height: 140, fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      ...Array.from({length: 7}, (_, i) => React.createElement('rect', { key: i, x: 76 + i * 38, y: 140, width: 22, height: 18, fill: 'none', stroke: '#fff', strokeWidth: 0.6 })),
      ...Array.from({length: 7}, (_, i) => React.createElement('rect', { key: 'b'+i, x: 76 + i * 38, y: 242, width: 22, height: 18, fill: 'none', stroke: '#fff', strokeWidth: 0.6 })),
    ),
    'Lifestyle':   React.createElement('svg', common,
      React.createElement('path', { d: 'M 100 200 Q 200 100, 300 200 T 100 200 Z', fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      React.createElement('circle', { cx: 200, cy: 200, r: 90, fill: 'none', stroke: '#fff', strokeWidth: 1 }),
      React.createElement('circle', { cx: 200, cy: 200, r: 40, fill: 'none', stroke: '#fff', strokeWidth: 0.8 }),
    ),
    'Reality':     React.createElement('svg', common,
      React.createElement('circle', { cx: 120, cy: 160, r: 55, fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      React.createElement('circle', { cx: 280, cy: 160, r: 55, fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      React.createElement('path', { d: 'M 80 320 L 320 320', stroke: '#fff', strokeWidth: 1 }),
    ),
    'Scripted':    React.createElement('svg', common,
      React.createElement('rect', { x: 100, y: 60, width: 200, height: 280, fill: 'none', stroke: '#fff', strokeWidth: 1.2 }),
      React.createElement('path', { d: 'M 130 120 L 270 120 M 130 160 L 270 160 M 130 200 L 230 200 M 130 240 L 250 240 M 130 280 L 270 280', stroke: '#fff', strokeWidth: 0.8 }),
    ),
    'Branded':     React.createElement('svg', common,
      React.createElement('rect', { x: 80, y: 80, width: 240, height: 240, fill: 'none', stroke: '#fff', strokeWidth: 1 }),
      React.createElement('circle', { cx: 200, cy: 200, r: 90, fill: 'none', stroke: '#fff', strokeWidth: 1 }),
      React.createElement('path', { d: 'M 110 200 L 290 200 M 200 110 L 200 290', stroke: '#fff', strokeWidth: 0.8 }),
    ),
  };
  return React.createElement('div', { className: 'pr-keyart' }, maps[g] || maps['Drama']);
}

// Big sparkline for performance rail
function BigSpark({ data, color }) {
  const w = 320, h = 88;
  const max = Math.max(...data), min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 8) + 4;
    const y = h - 8 - ((v - min) / range) * (h - 16);
    return `${x},${y}`;
  }).join(' ');
  const area = `4,${h-4} ` + pts + ` ${w-4},${h-4}`;
  return React.createElement('svg', { className: 'pr-sparkline-big', viewBox: `0 0 ${w} ${h}`, preserveAspectRatio: 'none' },
    React.createElement('polygon', { points: area, fill: color, opacity: .12 }),
    React.createElement('polyline', { points: pts, fill: 'none', stroke: color, strokeWidth: 1.8 }),
    React.createElement('circle', { cx: w - 4, cy: h - 8 - ((data[data.length-1] - min) / range) * (h - 16), r: 4, fill: color, stroke: '#000', strokeWidth: 1.5 }),
  );
}

// ─── Individual Rails ────────────────────────────────────
function RailCredits({ tmdb }) {
  const creators = (tmdb.created_by || []).map(c => ({ name: c.name, role: c.job || 'Creator' }));
  const cast = (tmdb.credits && tmdb.credits.cast) || [];
  const crew = (tmdb.credits && tmdb.credits.crew) || [];
  return React.createElement('div', { className: 'pr-rail-body' },
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Studio'),
      React.createElement('span', { className: 'pr-rail-row-val' },
        (tmdb.production_companies || []).slice(0, 2).map(p => p.name).join(' · '))
    ),
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Network'),
      React.createElement('span', { className: 'pr-rail-row-val accent' },
        (tmdb.networks || [{name: '—'}])[0].name)
    ),
    creators.length > 0 && React.createElement('div', { style: { marginTop: 16 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, 'Created by'),
      creators.map((c, i) => React.createElement('div', { key: i, className: 'pr-credit-item' },
        React.createElement('span', { className: 'pr-credit-name' }, c.name),
        React.createElement('span', { className: 'pr-credit-role' }, c.role)
      ))
    ),
    cast.length > 0 && React.createElement('div', { style: { marginTop: 14 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, 'Starring'),
      cast.slice(0, 5).map((c, i) => React.createElement('div', { key: i, className: 'pr-credit-item' },
        React.createElement('span', { className: 'pr-credit-name' }, c.name),
        React.createElement('span', { className: 'pr-credit-role' }, c.character)
      ))
    ),
    crew.length > 0 && React.createElement('div', { style: { marginTop: 14 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, 'Key Crew'),
      crew.slice(0, 3).map((c, i) => React.createElement('div', { key: i, className: 'pr-credit-item' },
        React.createElement('span', { className: 'pr-credit-name' }, c.name),
        React.createElement('span', { className: 'pr-credit-role' }, c.job)
      ))
    ),
    React.createElement('div', { style: { marginTop: 16 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, 'Keywords'),
      React.createElement('div', { className: 'pr-chips' },
        (tmdb.keywords || []).slice(0, 10).map((k, i) => React.createElement('span', {
          key: i, className: i < 3 ? 'pr-chip accent' : 'pr-chip'
        }, k))
      )
    )
  );
}

function RailFinancials({ tmdb, program }) {
  const budget = tmdb.budget || 0;
  const revenue = tmdb.revenue || 0;
  const roi = budget > 0 ? ((revenue / budget - 1) * 100).toFixed(0) + '%' : '—';
  return React.createElement('div', { className: 'pr-rail-body' },
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Production Budget'),
      React.createElement('span', { className: 'pr-rail-row-val big' }, fmtMoney(budget))
    ),
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Revenue'),
      React.createElement('span', { className: 'pr-rail-row-val big accent' }, fmtMoney(revenue))
    ),
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Return on Spend'),
      React.createElement('span', { className: 'pr-rail-row-val' }, roi)
    ),
    React.createElement('div', { style: { marginTop: 20 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, 'RSG Deal Snapshot'),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Deal Value'),
        React.createElement('span', { className: 'pr-rail-row-val' }, fmtMoney(tmdb.deal_value))
      ),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Rights Cost'),
        React.createElement('span', { className: 'pr-rail-row-val' }, fmtMoney(tmdb.rights_cost))
      ),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Window'),
        React.createElement('span', { className: 'pr-rail-row-val' }, '2026 – 2028')
      ),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Territory'),
        React.createElement('span', { className: 'pr-rail-row-val' }, 'US + LATAM')
      )
    ),
    React.createElement('div', { style: { marginTop: 18 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, 'Popularity Index'),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'TMDB Score'),
        React.createElement('span', { className: 'pr-rail-row-val accent' }, tmdb.vote_average.toFixed(1), ' / 10')
      ),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Vote Count'),
        React.createElement('span', { className: 'pr-rail-row-val' }, tmdb.vote_count.toLocaleString())
      ),
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Popularity'),
        React.createElement('span', { className: 'pr-rail-row-val' }, tmdb.popularity.toFixed(1))
      )
    )
  );
}

function RailAwards({ tmdb }) {
  const awards = tmdb.awards || [];
  if (awards.length === 0) {
    return React.createElement('div', { className: 'pr-rail-body' },
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Certification'),
        React.createElement('span', { className: 'pr-rail-row-val' }, tmdb.certification || '—')
      ),
      React.createElement('div', { style: { marginTop: 20, padding: '40px 0', textAlign: 'center' } },
        React.createElement('div', { style: { fontFamily: 'var(--label)', fontSize: 10, letterSpacing: 3, color: 'rgba(255,255,255,0.4)' } }, 'NO AWARDS ON RECORD')
      )
    );
  }
  return React.createElement('div', { className: 'pr-rail-body' },
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Certification'),
      React.createElement('span', { className: 'pr-rail-row-val' }, tmdb.certification || '—')
    ),
    React.createElement('div', { style: { marginTop: 18 } },
      React.createElement('div', { className: 'pr-stream-row-label' }, `${awards.filter(a=>a.result==='Winner').length} wins · ${awards.filter(a=>a.result==='Nominee').length} nominations`),
      awards.map((a, i) => React.createElement('div', { key: i, className: 'pr-award' },
        React.createElement('div', { className: 'pr-award-badge' }, a.label.split(' ')[0]),
        React.createElement('div', { className: 'pr-award-meta' },
          React.createElement('div', { className: 'pr-award-cat' }, a.category),
          React.createElement('div', { className: 'pr-award-year' }, a.label, ' · ', a.year)
        ),
        React.createElement('span', { className: `pr-award-result ${a.result.toLowerCase()}` }, a.result)
      ))
    )
  );
}

function RailStreaming({ tmdb }) {
  const wp = (tmdb.watch_providers && tmdb.watch_providers.US) || {};
  const providerColors = {
    'Hulu': '#1ce783', 'Max': '#002be7', 'Netflix': '#e50914', 'Prime Video': '#00a8e1',
    'Disney+': '#0a47a1', 'Paramount+': '#0064ff', 'Peacock': '#fa8b21',
    'Apple TV+': '#000', 'Apple TV': '#222', 'YouTube TV': '#ff0000', 'YouTube': '#ff0000',
    'Tubi': '#ffd400', 'Roku': '#6f1ab1', 'fuboTV': '#fa3c00', 'Fubo': '#fa3c00',
    'ESPN+': '#ff0033', 'ESPN.com': '#c8352d',
    'BET+': '#a20f44', 'History Vault': '#3a2a1f', 'Discovery+': '#0088ff',
    'Hallmark Movies Now': '#7a1aa0', 'Hayu': '#0a47a1', 'PBS Passport': '#2a2ff0',
    'FX on Hulu': '#f5b100',
  };
  const renderRow = (label, providers) => {
    if (!providers || providers.length === 0) return null;
    return React.createElement('div', { key: label },
      React.createElement('div', { className: 'pr-stream-row-label' }, label),
      React.createElement('div', { className: 'pr-stream-grid' },
        providers.map((p, i) => React.createElement('div', {
          key: i, className: 'pr-stream-tile',
          style: { background: `linear-gradient(135deg, ${providerColors[p] || '#444'} 0%, rgba(0,0,0,0.4) 100%)` }
        }, p))
      )
    );
  };
  return React.createElement('div', { className: 'pr-rail-body' },
    React.createElement('div', { className: 'pr-rail-row' },
      React.createElement('span', { className: 'pr-rail-row-label' }, 'Region'),
      React.createElement('span', { className: 'pr-rail-row-val' }, '◷ United States')
    ),
    React.createElement('div', { style: { marginTop: 12 } },
      renderRow('Stream', wp.flatrate),
      renderRow('Rent', wp.rent),
      renderRow('Buy', wp.buy),
      renderRow('Free', wp.free)
    ),
    React.createElement('div', { style: { marginTop: 18 } },
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Full availability'),
        React.createElement('span', { className: 'pr-rail-row-val' }, 'see RIGHTS pill ↓')
      )
    )
  );
}

function RailPerformance({ tmdb, program }) {
  const trend = tmdb.ratings_trend || [];
  const latest = trend[trend.length - 1] || 0;
  const prev = trend[trend.length - 2] || latest;
  const delta = prev ? (((latest - prev) / prev) * 100).toFixed(1) : '0';
  return React.createElement('div', { className: 'pr-rail-body' },
    React.createElement('div', { className: 'pr-stream-row-label' }, '8-Week HH Rating Trend'),
    React.createElement(BigSpark, { data: trend, color: 'var(--pr-accent)' }),
    React.createElement('div', { className: 'pr-perf-kpis' },
      React.createElement('div', { className: 'pr-perf-kpi' },
        React.createElement('div', { className: 'pr-perf-kpi-label' }, 'Current'),
        React.createElement('div', { className: 'pr-perf-kpi-val' }, latest.toFixed(2)),
        React.createElement('div', { className: `pr-perf-kpi-delta ${+delta >= 0 ? 'up' : 'down'}` },
          +delta >= 0 ? '▲' : '▼', ' ', Math.abs(+delta).toFixed(1), '% vs LW')
      ),
      React.createElement('div', { className: 'pr-perf-kpi' },
        React.createElement('div', { className: 'pr-perf-kpi-label' }, 'Social Velocity'),
        React.createElement('div', { className: 'pr-perf-kpi-val' }, tmdb.social_velocity),
        React.createElement('div', { className: 'pr-perf-kpi-delta up' }, 'last 24h')
      ),
      React.createElement('div', { className: 'pr-perf-kpi' },
        React.createElement('div', { className: 'pr-perf-kpi-label' }, 'Reach'),
        React.createElement('div', { className: 'pr-perf-kpi-val' }, program.reach || '—'),
        React.createElement('div', { className: 'pr-perf-kpi-delta up' }, '+8.4%')
      ),
      React.createElement('div', { className: 'pr-perf-kpi' },
        React.createElement('div', { className: 'pr-perf-kpi-label' }, 'Key Demo'),
        React.createElement('div', { className: 'pr-perf-kpi-val', style: { fontSize: 16 } }, program.demo || '—'),
        React.createElement('div', { className: 'pr-perf-kpi-delta' }, 'indexed 142')
      )
    ),
    React.createElement('div', { style: { marginTop: 16 } },
      React.createElement('div', { className: 'pr-rail-row' },
        React.createElement('span', { className: 'pr-rail-row-label' }, 'Deep dive'),
        React.createElement('span', { className: 'pr-rail-row-val' }, 'see PERFORMANCE pill ↓')
      )
    )
  );
}

Object.assign(window, {
  PR_Helpers: { fmtMoney, fmtYear, fmtRuntime },
  PR_KeyArt: KeyArt,
  PR_RailCredits: RailCredits,
  PR_RailFinancials: RailFinancials,
  PR_RailAwards: RailAwards,
  PR_RailStreaming: RailStreaming,
  PR_RailPerformance: RailPerformance,
});
