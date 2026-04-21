// ═══════════════════════════════════════════════════════════
// SaSMaster — MACRO DASHBOARDS
// MacroDashContent: market-level factoids + charts for Content Research
// MacroDashExchange: marketplace-level factoids + charts for Content Exchange
// ═══════════════════════════════════════════════════════════
const M_D = window.SASMASTER_DATA;
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];

// ─── Factoid KPI tile (richer than the regular KPI) ──────────
function MacroFact({ fact, accent, onClick, active }) {
  const deltaSign = fact.delta > 0 ? '▲' : fact.delta < 0 ? '▼' : '●';
  const deltaCls = fact.delta > 0 ? 'up' : fact.delta < 0 ? 'down' : 'flat';
  return React.createElement('button', {
    className: `macro-fact ${active ? 'active' : ''} ${fact.tone || ''}`,
    onClick,
    style: { '--tile-accent': accent || 'var(--gold)' }
  },
    React.createElement('div', { className: 'macro-fact-label' }, fact.label),
    React.createElement('div', { className: 'macro-fact-value' }, fact.value),
    React.createElement('div', { className: 'macro-fact-row' },
      fact.delta !== 0 && React.createElement('span', { className: `macro-fact-delta ${deltaCls}` },
        deltaSign, ' ', Math.abs(fact.delta).toFixed(1), '%'),
      fact.delta === 0 && React.createElement('span', { className: 'macro-fact-delta flat' }, '— flat'),
      React.createElement('span', { className: 'macro-fact-foot' }, fact.foot)
    )
  );
}

// ─── Bubble chart: shows over time ────────────────────────────
function BubbleChart({ data, genres, width = 860, height = 280, activeGenre, onHoverGenre }) {
  const [hover, setHover] = React.useState(null);
  const padL = 44, padR = 20, padT = 20, padB = 32;
  const w = width - padL - padR, h = height - padT - padB;
  const yMin = 0, yMax = 4;
  const genreMap = Object.fromEntries(genres.map(g => [g.key, g]));
  const gridY = [0, 1, 2, 3, 4];

  return React.createElement('div', { className: 'bubble-wrap' },
    React.createElement('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', style: { display: 'block' } },
      // y gridlines
      gridY.map((g, i) => React.createElement('g', { key: i },
        React.createElement('line', {
          x1: padL, x2: width - padR,
          y1: padT + h - ((g - yMin) / (yMax - yMin)) * h,
          y2: padT + h - ((g - yMin) / (yMax - yMin)) * h,
          stroke: 'rgba(255,255,255,0.05)'
        }),
        React.createElement('text', {
          x: padL - 8, y: padT + h - ((g - yMin) / (yMax - yMin)) * h + 3,
          fill: 'rgba(240,238,255,0.4)', fontSize: 10, textAnchor: 'end', fontFamily: 'Share Tech Mono'
        }, g.toFixed(1))
      )),
      // x labels
      MONTHS.map((m, i) => React.createElement('text', {
        key: i,
        x: padL + (i / 11) * w,
        y: height - 10,
        fill: 'rgba(240,238,255,0.4)', fontSize: 9, textAnchor: 'middle', fontFamily: 'Share Tech Mono', letterSpacing: 1,
      }, m)),
      // y label
      React.createElement('text', {
        x: 12, y: padT + h/2,
        fill: 'rgba(240,238,255,0.45)', fontSize: 9, fontFamily: 'Share Tech Mono',
        letterSpacing: 2, transform: `rotate(-90 12 ${padT + h/2})`, textAnchor: 'middle'
      }, 'HH RATING'),

      // bubbles
      data.map((d, i) => {
        const g = genreMap[d.g] || { color: '#888' };
        const cx = padL + (d.m / 11) * w;
        const cy = padT + h - ((d.y - yMin) / (yMax - yMin)) * h;
        const r = 4 + Math.sqrt(d.r) * 2.2;
        const dim = activeGenre && activeGenre !== d.g;
        return React.createElement('circle', {
          key: i, cx, cy, r,
          fill: g.color,
          fillOpacity: dim ? 0.08 : 0.35,
          stroke: g.color,
          strokeOpacity: dim ? 0.2 : 0.9,
          strokeWidth: 1.4,
          style: { cursor: 'pointer', transition: 'all .2s' },
          onMouseEnter: (e) => setHover({ d, x: cx, y: cy, r }),
          onMouseLeave: () => setHover(null),
        });
      }),
    ),
    hover && React.createElement('div', {
      className: 'bubble-tip',
      style: { left: `${(hover.x / width) * 100}%`, top: `${(hover.y / height) * 100}%` }
    },
      React.createElement('div', { className: 'bubble-tip-title' }, hover.d.name),
      React.createElement('div', { className: 'bubble-tip-row' },
        React.createElement('span', null, genreMap[hover.d.g].name), ' · ',
        React.createElement('span', { className: 'mono' }, hover.d.y.toFixed(1), ' HH · ', hover.d.r, 'M reach')
      )
    )
  );
}

// ─── Genre trends: waveforms + rank list (Market Watch style) ────
function GenreTrends({ trends, genres, activeGenre, onSelect }) {
  const genreMap = Object.fromEntries(genres.map(g => [g.key, g]));
  const w = 120, h = 34;
  return React.createElement('div', { className: 'genre-trends' },
    trends.map(t => {
      const g = genreMap[t.key];
      const max = Math.max(...t.data), min = Math.min(...t.data);
      const rng = max - min || 1;
      const pts = t.data.map((v, i) => {
        const x = (i / (t.data.length - 1)) * w;
        const y = h - ((v - min) / rng) * h;
        return `${x},${y}`;
      }).join(' ');
      // area fill pts
      const areaPts = `0,${h} ${pts} ${w},${h}`;
      const active = activeGenre === t.key;
      const dim = activeGenre && !active;
      const deltaCls = t.delta > 0 ? 'up' : t.delta < 0 ? 'down' : 'flat';
      return React.createElement('button', {
        key: t.key,
        className: `genre-row ${active ? 'active' : ''} ${dim ? 'dim' : ''}`,
        onClick: () => onSelect(active ? null : t.key),
      },
        React.createElement('span', { className: 'genre-rank' }, String(t.rank).padStart(2, '0')),
        React.createElement('span', { className: 'genre-name', style: { color: g.color } },
          React.createElement('i', { className: 'genre-dot', style: { background: g.color } }),
          g.name),
        React.createElement('svg', { width: w, height: h, className: 'genre-spark' },
          React.createElement('defs', null,
            React.createElement('linearGradient', { id: `gg-${t.key}`, x1: 0, y1: 0, x2: 0, y2: 1 },
              React.createElement('stop', { offset: '0%', stopColor: g.color, stopOpacity: 0.35 }),
              React.createElement('stop', { offset: '100%', stopColor: g.color, stopOpacity: 0 })
            )
          ),
          React.createElement('polygon', { points: areaPts, fill: `url(#gg-${t.key})` }),
          React.createElement('polyline', { points: pts, fill: 'none', stroke: g.color, strokeWidth: 1.6 })
        ),
        React.createElement('span', { className: 'genre-share mono' }, t.share.toFixed(1), '%'),
        React.createElement('span', { className: `genre-delta ${deltaCls}` },
          t.delta > 0 ? '▲ +' : t.delta < 0 ? '▼ ' : '● ',
          Math.abs(t.delta).toFixed(1), '%'
        )
      );
    })
  );
}

// ─── Stacked demo viewing bars ─────────────────────────────
function ViewingHabits({ data }) {
  const segs = [
    { key: 'live',    label: 'LIVE',        color: '#f0c040' },
    { key: 'sameDay', label: 'SAME-DAY DVR',color: '#c8352d' },
    { key: 'ts3',     label: 'TS 3-7D',     color: '#a78bfa' },
    { key: 'svod',    label: 'SVOD',        color: '#3a7bd5' },
  ];
  return React.createElement('div', { className: 'viewing-habits' },
    React.createElement('div', { className: 'viewing-legend' },
      segs.map(s => React.createElement('span', { key: s.key, className: 'vh-leg' },
        React.createElement('i', { style: { background: s.color } }), s.label))
    ),
    React.createElement('div', { className: 'vh-rows' },
      data.map((row, i) => React.createElement('div', { key: i, className: 'vh-row' },
        React.createElement('span', { className: 'vh-demo' }, row.demo),
        React.createElement('div', { className: 'vh-bar' },
          segs.map(s => row[s.key] > 0 && React.createElement('div', {
            key: s.key,
            className: 'vh-seg',
            style: { width: `${row[s.key]}%`, background: s.color },
            title: `${s.label}: ${row[s.key]}%`,
          }, row[s.key] >= 10 && React.createElement('span', null, row[s.key])))
        )
      ))
    )
  );
}

// ═══ MACRO DASH — CONTENT PORTAL ════════════════════════════
function MacroDashContent() {
  const [activeGenre, setActiveGenre] = React.useState(null);
  const facts = M_D.MACRO_FACTS;
  return React.createElement('div', { className: 'macro-dash' },
    // FACTS ROW
    React.createElement('div', { className: 'macro-facts' },
      facts.map((f, i) => React.createElement(MacroFact, { key: i, fact: f }))
    ),

    // CHART ROW 1: Bubble chart (wide) + Genre trends (side)
    React.createElement('div', { className: 'macro-grid-2' },
      // Bubble chart
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'SHOW PERFORMANCE · LAST 12 MONTHS'),
          React.createElement('div', { className: 'panel-spacer' }),
          React.createElement('div', { className: 'genre-legend' },
            M_D.GENRES.map(g => React.createElement('button', {
              key: g.key,
              className: `genre-chip ${activeGenre === g.key ? 'active' : ''} ${activeGenre && activeGenre !== g.key ? 'dim' : ''}`,
              onClick: () => setActiveGenre(activeGenre === g.key ? null : g.key),
              style: { '--chip-color': g.color }
            },
              React.createElement('i', { style: { background: g.color } }),
              g.name))
          )
        ),
        React.createElement('div', { style: { padding: '10px 18px 16px' } },
          React.createElement(BubbleChart, { data: M_D.BUBBLE_SHOWS, genres: M_D.GENRES, activeGenre })
        ),
        React.createElement('div', { className: 'bubble-foot' },
          React.createElement('span', null, 'BUBBLE SIZE = WEEKLY REACH'),
          React.createElement('span', null, 'Y-AXIS = AVG HH RATING'),
          React.createElement('span', null, 'CLICK CHIP TO ISOLATE GENRE')
        )
      ),

      // Genre trends rank list
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'GENRE WATCH · 14W INDEX'),
          React.createElement('div', { className: 'panel-spacer' }),
          React.createElement('span', { className: 'chip gold' }, 'YoY')),
        React.createElement('div', { style: { padding: '8px 0 4px' } },
          React.createElement(GenreTrends, { trends: M_D.GENRE_TRENDS, genres: M_D.GENRES, activeGenre, onSelect: setActiveGenre })
        )
      )
    ),

    // CHART ROW 2: Viewing habits stacked bars
    React.createElement('div', { className: 'data-panel' },
      React.createElement('div', { className: 'panel-head' },
        React.createElement('div', { className: 'panel-title' }, 'VIEWING HABITS · LIVE vs TIME-SHIFTED vs STREAMING'),
        React.createElement('div', { className: 'panel-spacer' }),
        React.createElement('span', { className: 'chip', style: { color: 'var(--text-muted)' } }, 'SHARE OF DAILY VIEWING · %')),
      React.createElement(ViewingHabits, { data: M_D.VIEWING_HABITS })
    )
  );
}

// ═══ GEO HEATMAP (Exchange) ════════════════════════════════
function GeoHeatmap({ regions }) {
  const [hover, setHover] = React.useState(null);
  // color by score
  const colorFor = (s) => {
    if (s >= 75) return '#a78bfa';
    if (s >= 60) return '#7e6bd1';
    if (s >= 45) return '#5a4fa0';
    if (s >= 30) return '#3e3572';
    return '#241f47';
  };
  return React.createElement('div', { className: 'geo-heat' },
    React.createElement('svg', { viewBox: '0 0 100 100', width: '100%', style: { display: 'block' } },
      // grid background
      Array.from({ length: 10 }).map((_, i) => React.createElement('line', {
        key: `h${i}`, x1: 0, y1: i * 10, x2: 100, y2: i * 10, stroke: 'rgba(255,255,255,0.04)', strokeWidth: 0.15
      })),
      Array.from({ length: 10 }).map((_, i) => React.createElement('line', {
        key: `v${i}`, x1: i * 10, y1: 0, x2: i * 10, y2: 100, stroke: 'rgba(255,255,255,0.04)', strokeWidth: 0.15
      })),
      // region tiles (simplified US regions as hex-like cells)
      regions.map(r => React.createElement('g', { key: r.code, onMouseEnter: () => setHover(r), onMouseLeave: () => setHover(null) },
        React.createElement('rect', {
          x: r.x, y: r.y, width: 10, height: 10,
          fill: colorFor(r.score),
          stroke: hover?.code === r.code ? '#f0c040' : 'rgba(255,255,255,0.12)',
          strokeWidth: hover?.code === r.code ? 0.6 : 0.3,
          style: { cursor: 'pointer', transition: 'all .15s' }
        }),
        React.createElement('text', {
          x: r.x + 5, y: r.y + 5.4,
          fill: r.score >= 45 ? '#fff' : 'rgba(255,255,255,0.55)',
          fontSize: 3, textAnchor: 'middle', fontFamily: 'Share Tech Mono', letterSpacing: 0.3,
          style: { pointerEvents: 'none' }
        }, r.code),
        React.createElement('text', {
          x: r.x + 5, y: r.y + 8.2,
          fill: r.score >= 45 ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.4)',
          fontSize: 1.8, textAnchor: 'middle', fontFamily: 'Share Tech Mono',
          style: { pointerEvents: 'none' }
        }, r.score)
      ))
    ),
    // legend
    React.createElement('div', { className: 'geo-legend' },
      React.createElement('span', { className: 'geo-legend-label' }, 'RIGHTS AVAILABILITY'),
      [
        { min: 75, label: 'HIGH' },
        { min: 60, label: 'MED-HI' },
        { min: 45, label: 'MED' },
        { min: 30, label: 'LOW' },
        { min:  0, label: 'NONE' },
      ].map((s, i) => React.createElement('span', { key: i, className: 'geo-legend-item' },
        React.createElement('i', { style: { background: colorFor(s.min) } }),
        s.label
      ))
    ),
    hover && React.createElement('div', { className: 'geo-tip' },
      React.createElement('div', { className: 'geo-tip-title' }, hover.name),
      React.createElement('div', { className: 'geo-tip-row' }, 'Availability score: ', React.createElement('b', null, hover.score)),
      React.createElement('div', { className: 'geo-tip-row' }, 'Active deals: ', React.createElement('b', null, hover.deals))
    )
  );
}

// ═══ SANKEY: buyers → titles ═══════════════════════════════
function Sankey({ sankey, genres }) {
  const width = 520, height = 320;
  const colW = 140, colH = height - 20;
  const gap = 6;
  const genreMap = Object.fromEntries(genres.map(g => [g.key, g]));

  // Layout buyers (left column) and titles (right column)
  const totalL = sankey.buyers.reduce((s, b) => s + b.vol, 0);
  const totalR = sankey.titles.reduce((s, t) => s + t.vol, 0);
  let yL = 10;
  const buyerNodes = sankey.buyers.map((b, i) => {
    const h = (b.vol / totalL) * (colH - (sankey.buyers.length - 1) * gap);
    const node = { ...b, idx: i, y: yL, h, x: 20, remain: b.vol };
    yL += h + gap;
    return node;
  });
  let yR = 10;
  const titleNodes = sankey.titles.map((t, i) => {
    const h = (t.vol / totalR) * (colH - (sankey.titles.length - 1) * gap);
    const node = { ...t, idx: i, y: yR, h, x: width - 20 - 10, remain: t.vol };
    yR += h + gap;
    return node;
  });

  // Build flow ribbons
  const ribbons = sankey.flows.map(([bi, ti, v], k) => {
    const b = buyerNodes[bi];
    const t = titleNodes[ti];
    const bY0 = b.y + (b.h * (1 - b.remain / b.vol));
    const bY1 = bY0 + (v / b.vol) * b.h;
    b.remain -= v;
    const tY0 = t.y + (t.h * (1 - t.remain / t.vol));
    const tY1 = tY0 + (v / t.vol) * t.h;
    t.remain -= v;
    const x0 = b.x + 10, x1 = t.x;
    const cx = (x0 + x1) / 2;
    const path = `M ${x0} ${bY0} C ${cx} ${bY0}, ${cx} ${tY0}, ${x1} ${tY0} L ${x1} ${tY1} C ${cx} ${tY1}, ${cx} ${bY1}, ${x0} ${bY1} Z`;
    const color = genreMap[t.genre]?.color || '#a78bfa';
    return { path, color, k };
  });

  return React.createElement('div', { className: 'sankey-wrap' },
    React.createElement('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', style: { display: 'block' } },
      // ribbons
      ribbons.map(r => React.createElement('path', {
        key: r.k, d: r.path, fill: r.color, fillOpacity: 0.2, stroke: r.color, strokeOpacity: 0.35, strokeWidth: 0.8
      })),
      // buyer nodes
      buyerNodes.map(b => React.createElement('g', { key: `b${b.idx}` },
        React.createElement('rect', { x: b.x, y: b.y, width: 10, height: b.h, fill: '#f0c040' }),
        React.createElement('text', {
          x: b.x - 6, y: b.y + b.h / 2 + 3,
          fill: '#f6f4ff', fontSize: 10, textAnchor: 'end', fontFamily: 'Barlow Condensed', fontWeight: 600, letterSpacing: 1,
        }, b.name),
        React.createElement('text', {
          x: b.x - 6, y: b.y + b.h / 2 + 14,
          fill: 'rgba(240,238,255,0.45)', fontSize: 8, textAnchor: 'end', fontFamily: 'Share Tech Mono'
        }, '$', b.vol, 'M')
      )),
      // title nodes
      titleNodes.map(t => {
        const g = genreMap[t.genre];
        return React.createElement('g', { key: `t${t.idx}` },
          React.createElement('rect', { x: t.x, y: t.y, width: 10, height: t.h, fill: g.color }),
          React.createElement('text', {
            x: t.x + 16, y: t.y + t.h / 2 + 3,
            fill: '#f6f4ff', fontSize: 10, textAnchor: 'start', fontFamily: 'Barlow Condensed', fontWeight: 600, letterSpacing: 1,
          }, t.name),
          React.createElement('text', {
            x: t.x + 16, y: t.y + t.h / 2 + 14,
            fill: 'rgba(240,238,255,0.45)', fontSize: 8, textAnchor: 'start', fontFamily: 'Share Tech Mono',
          }, '$', t.vol, 'M · ', g.name)
        );
      }),
      // headers
      React.createElement('text', { x: 20, y: 6, fill: 'rgba(240,238,255,0.5)', fontSize: 8, fontFamily: 'Share Tech Mono', letterSpacing: 2 }, 'BUYERS'),
      React.createElement('text', { x: width - 20, y: 6, fill: 'rgba(240,238,255,0.5)', fontSize: 8, fontFamily: 'Share Tech Mono', letterSpacing: 2, textAnchor: 'end' }, 'TITLES'),
    )
  );
}

// ═══ EXCHANGE BUBBLES: asking price vs rating ══════════════
function ExchangeBubbles({ data, genres, width = 520, height = 280 }) {
  const [hover, setHover] = React.useState(null);
  const padL = 44, padR = 16, padT = 14, padB = 32;
  const w = width - padL - padR, h = height - padT - padB;
  const xMin = 0, xMax = 14; // $M asking
  const yMin = 1, yMax = 3.5;
  const genreMap = Object.fromEntries(genres.map(g => [g.key, g]));

  return React.createElement('div', { className: 'bubble-wrap' },
    React.createElement('svg', { viewBox: `0 0 ${width} ${height}`, width: '100%', style: { display: 'block' } },
      // grid
      [0, 1, 2, 3, 4, 5, 6, 7].map(t => React.createElement('line', {
        key: `vg${t}`,
        x1: padL + (t * 2 - xMin) / (xMax - xMin) * w,
        x2: padL + (t * 2 - xMin) / (xMax - xMin) * w,
        y1: padT, y2: padT + h, stroke: 'rgba(255,255,255,0.05)'
      })),
      [1, 1.5, 2, 2.5, 3, 3.5].map(t => React.createElement('line', {
        key: `hg${t}`,
        x1: padL, x2: padL + w,
        y1: padT + h - ((t - yMin) / (yMax - yMin)) * h,
        y2: padT + h - ((t - yMin) / (yMax - yMin)) * h,
        stroke: 'rgba(255,255,255,0.05)'
      })),
      // y labels
      [1, 2, 3].map(t => React.createElement('text', {
        key: `yl${t}`, x: padL - 8,
        y: padT + h - ((t - yMin) / (yMax - yMin)) * h + 3,
        fill: 'rgba(240,238,255,0.4)', fontSize: 9, textAnchor: 'end', fontFamily: 'Share Tech Mono'
      }, t.toFixed(1))),
      // x labels
      [0, 4, 8, 12].map(t => React.createElement('text', {
        key: `xl${t}`,
        x: padL + (t - xMin) / (xMax - xMin) * w,
        y: height - 10,
        fill: 'rgba(240,238,255,0.4)', fontSize: 9, textAnchor: 'middle', fontFamily: 'Share Tech Mono'
      }, '$', t, 'M')),
      // axis titles
      React.createElement('text', {
        x: padL + w / 2, y: height - 1, fill: 'rgba(240,238,255,0.45)',
        fontSize: 8, textAnchor: 'middle', fontFamily: 'Share Tech Mono', letterSpacing: 2,
      }, 'ASKING PRICE →'),
      React.createElement('text', {
        x: 10, y: padT + h / 2, fill: 'rgba(240,238,255,0.45)',
        fontSize: 8, fontFamily: 'Share Tech Mono', letterSpacing: 2,
        transform: `rotate(-90 10 ${padT + h / 2})`, textAnchor: 'middle'
      }, 'HH RATING →'),

      // bubbles
      data.map((d, i) => {
        const g = genreMap[d.g] || { color: '#888' };
        const cx = padL + (d.price - xMin) / (xMax - xMin) * w;
        const cy = padT + h - ((d.rating - yMin) / (yMax - yMin)) * h;
        const r = 5 + Math.sqrt(d.eps) * 1.4;
        return React.createElement('circle', {
          key: i, cx, cy, r,
          fill: g.color, fillOpacity: 0.3,
          stroke: g.color, strokeOpacity: 0.9, strokeWidth: 1.4,
          style: { cursor: 'pointer', transition: 'all .15s' },
          onMouseEnter: () => setHover({ d, x: cx, y: cy }),
          onMouseLeave: () => setHover(null),
        });
      })
    ),
    hover && React.createElement('div', {
      className: 'bubble-tip',
      style: { left: `${(hover.x / width) * 100}%`, top: `${(hover.y / height) * 100}%` }
    },
      React.createElement('div', { className: 'bubble-tip-title' }, hover.d.name),
      React.createElement('div', { className: 'bubble-tip-row' },
        React.createElement('span', { className: 'mono' }, '$', hover.d.price, 'M · ', hover.d.rating.toFixed(1), ' HH · ', hover.d.eps, ' eps')
      )
    )
  );
}

// ═══ MACRO DASH — EXCHANGE PORTAL ════════════════════════════
function MacroDashExchange() {
  const facts = M_D.EXCHANGE_KPI;
  return React.createElement('div', { className: 'macro-dash' },
    // facts
    React.createElement('div', { className: 'macro-facts four' },
      facts.map((f, i) => React.createElement(MacroFact, { key: i, fact: f, accent: 'var(--purple)' }))
    ),

    // Row 1: Geo heatmap + Sankey side-by-side
    React.createElement('div', { className: 'macro-grid-2' },
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'RIGHTS AVAILABILITY · TERRITORY HEATMAP'),
          React.createElement('div', { className: 'panel-spacer' }),
          React.createElement('span', { className: 'chip purple' }, 'US · Q2 2026')),
        React.createElement('div', { style: { padding: '14px 20px 18px' } },
          React.createElement(GeoHeatmap, { regions: M_D.GEO_REGIONS })
        )
      ),
      React.createElement('div', { className: 'data-panel' },
        React.createElement('div', { className: 'panel-head' },
          React.createElement('div', { className: 'panel-title' }, 'ACTIVE BIDS · BUYERS → TITLES'),
          React.createElement('div', { className: 'panel-spacer' }),
          React.createElement('span', { className: 'chip gold' }, '24H FLOW')),
        React.createElement('div', { style: { padding: '8px 20px 18px' } },
          React.createElement(Sankey, { sankey: M_D.SANKEY_BIDS, genres: M_D.GENRES })
        )
      )
    ),

    // Row 2: Exchange bubbles chart (full width)
    React.createElement('div', { className: 'data-panel' },
      React.createElement('div', { className: 'panel-head' },
        React.createElement('div', { className: 'panel-title' }, 'OPEN LISTINGS · ASKING PRICE vs RATING'),
        React.createElement('div', { className: 'panel-spacer' }),
        React.createElement('div', { className: 'genre-legend' },
          M_D.GENRES.slice(0, 5).map(g => React.createElement('span', {
            key: g.key, className: 'genre-chip static', style: { '--chip-color': g.color }
          },
            React.createElement('i', { style: { background: g.color } }),
            g.name))
        )),
      React.createElement('div', { style: { padding: '12px 20px 16px' } },
        React.createElement(ExchangeBubbles, { data: M_D.EXCHANGE_BUBBLES, genres: M_D.GENRES })
      ),
      React.createElement('div', { className: 'bubble-foot' },
        React.createElement('span', null, 'BUBBLE SIZE = EPISODE COUNT'),
        React.createElement('span', null, '12 OPEN LISTINGS'),
        React.createElement('span', null, 'HOVER FOR DETAIL')
      )
    )
  );
}

Object.assign(window, { MacroDashContent, MacroDashExchange });
