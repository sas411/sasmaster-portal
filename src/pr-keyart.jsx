// ═══════════════════════════════════════════════════════════
// ProgramRoute — Cinematic genre key-art scenes
// Each genre gets a full-bleed painted SVG composition with
// atmosphere (light shafts, embers, rain, haze, grain).
// Replaces the line-art placeholder.
// ═══════════════════════════════════════════════════════════

// Scene helpers ─────────────────────────────────────────
function grad(id, stops) {
  return React.createElement('linearGradient', { id, x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
    stops.map((s, i) => React.createElement('stop', { key: i, offset: s.o, stopColor: s.c, stopOpacity: s.a ?? 1 }))
  );
}
function radgrad(id, stops, cx = '50%', cy = '50%', r = '50%') {
  return React.createElement('radialGradient', { id, cx, cy, r },
    stops.map((s, i) => React.createElement('stop', { key: i, offset: s.o, stopColor: s.c, stopOpacity: s.a ?? 1 }))
  );
}

// ─── Per-genre scenes ───────────────────────────────────

function SceneSports() {
  const crowd = Array.from({length: 140}, (_, i) => ({
    x: (i * 17) % 1200,
    y: 640 + ((i * 7) % 30),
    h: 16 + (i % 4) * 3
  }));
  const lights = [
    [150, 90], [380, 60], [620, 50], [860, 60], [1090, 90]
  ];
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-sports',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      radgrad('skySp', [
        { o: '0%',   c: '#0a1f3d', a: 1 },
        { o: '60%',  c: '#050b1a', a: 1 },
        { o: '100%', c: '#000',    a: 1 },
      ], '50%', '80%', '80%'),
      grad('field', [
        { o: '0%',   c: '#0b3d1f', a: 1 },
        { o: '100%', c: '#042510', a: 1 },
      ]),
      radgrad('floodGlow', [
        { o: '0%',   c: '#ffd970', a: 0.55 },
        { o: '100%', c: '#ffd970', a: 0 },
      ]),
    ),
    // Night sky
    React.createElement('rect', { width: 1200, height: 520, fill: 'url(#skySp)' }),
    // Field
    React.createElement('path', { d: 'M 0 520 L 1200 520 L 1200 800 L 0 800 Z', fill: 'url(#field)' }),
    // Yard lines
    ...Array.from({length: 8}, (_, i) =>
      React.createElement('ellipse', { key: i,
        cx: 600, cy: 680 + i * 14,
        rx: 1200 - i * 40, ry: 4,
        fill: 'none', stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1.2
      })
    ),
    // Flood lights (halo)
    ...lights.map(([x, y], i) =>
      React.createElement('circle', { key: 'hg'+i, cx: x, cy: y, r: 180, fill: 'url(#floodGlow)' })
    ),
    // Flood poles
    ...lights.map(([x, y], i) =>
      React.createElement('g', { key: 'fl'+i },
        React.createElement('rect', { x: x - 2, y: y, width: 4, height: 420, fill: 'rgba(255,255,255,0.12)' }),
        React.createElement('rect', { x: x - 28, y: y - 12, width: 56, height: 10, fill: '#d4d7dc' }),
        React.createElement('circle', { cx: x, cy: y - 4, r: 10, fill: '#fff4b8' }),
        // Light shaft
        React.createElement('path', {
          d: `M ${x - 20} ${y} L ${x - 420} 800 L ${x + 420} 800 L ${x + 20} ${y} Z`,
          fill: '#fff4b8', opacity: 0.06
        })
      )
    ),
    // Crowd silhouette
    ...crowd.map((c, i) =>
      React.createElement('rect', { key: 'c'+i,
        x: c.x, y: c.y - c.h, width: 10, height: c.h,
        fill: 'rgba(0,0,0,0.75)'
      })
    ),
    // Stadium horizon arcs
    React.createElement('path', { d: 'M 0 540 Q 600 460 1200 540', fill: 'none', stroke: 'rgba(255,255,255,0.18)', strokeWidth: 1.4 }),
    React.createElement('path', { d: 'M 0 520 Q 600 440 1200 520', fill: 'none', stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1 }),
    // Scoreboard
    React.createElement('rect', { x: 950, y: 160, width: 200, height: 60, fill: '#0a0a0a', stroke: 'rgba(255,200,80,0.4)' }),
    React.createElement('text', { x: 1050, y: 198, fill: '#ffb800', fontSize: 22, fontFamily: 'monospace', textAnchor: 'middle', letterSpacing: 3 }, '24 · 17'),
  );
}

function SceneDrama() {
  // Noir: venetian blinds light + smoke + silhouette
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-drama',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('noirBg', [
        { o: '0%',   c: '#1a0d2e', a: 1 },
        { o: '100%', c: '#050210', a: 1 },
      ]),
      radgrad('noirGlow', [
        { o: '0%',   c: '#a78bfa', a: 0.35 },
        { o: '100%', c: '#a78bfa', a: 0 },
      ], '30%', '40%', '60%'),
      React.createElement('filter', { id: 'blurSm' },
        React.createElement('feGaussianBlur', { stdDeviation: '18' })
      ),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#noirBg)' }),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#noirGlow)' }),
    // Venetian blinds light shafts (from upper right)
    ...Array.from({length: 9}, (_, i) =>
      React.createElement('path', { key: i,
        d: `M ${200 + i * 70} 0 L ${1400 + i * 70} 800 L ${1460 + i * 70} 800 L ${260 + i * 70} 0 Z`,
        fill: '#d6c5ff', opacity: 0.045
      })
    ),
    // Floor reflection
    React.createElement('rect', { x: 0, y: 620, width: 1200, height: 180, fill: '#0a0418', opacity: 0.6 }),
    ...Array.from({length: 9}, (_, i) =>
      React.createElement('rect', { key: 'fr'+i,
        x: 200 + i * 100, y: 620, width: 50, height: 180,
        fill: '#a78bfa', opacity: 0.04
      })
    ),
    // Smoke/haze swirls
    React.createElement('ellipse', { cx: 400, cy: 500, rx: 260, ry: 80, fill: '#a78bfa', opacity: 0.08, filter: 'url(#blurSm)' }),
    React.createElement('ellipse', { cx: 820, cy: 580, rx: 340, ry: 100, fill: '#c4a0ff', opacity: 0.05, filter: 'url(#blurSm)' }),
    // Silhouette figure (standing, back-lit)
    React.createElement('path', {
      d: 'M 560 420 Q 558 380 575 360 Q 600 340 625 360 Q 642 380 640 420 L 660 480 L 670 640 L 640 760 L 620 760 L 615 600 L 585 600 L 580 760 L 560 760 L 540 640 L 550 480 Z',
      fill: '#000', opacity: 0.92
    }),
    // Rim light on silhouette
    React.createElement('path', {
      d: 'M 635 360 Q 642 380 640 420 L 660 480',
      stroke: '#d6c5ff', strokeWidth: 2, fill: 'none', opacity: 0.4
    }),
  );
}

function SceneThriller() {
  // Rain-streaked window + neon sign + pulsing red
  const drops = Array.from({length: 80}, (_, i) => ({
    x: (i * 31) % 1200,
    l: 12 + (i % 5) * 8,
    o: 0.1 + (i % 4) * 0.08
  }));
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-thriller',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('thrBg', [
        { o: '0%',   c: '#0b0b14', a: 1 },
        { o: '100%', c: '#1a0510', a: 1 },
      ]),
      radgrad('neonRed', [
        { o: '0%',   c: '#ff4d6a', a: 0.55 },
        { o: '100%', c: '#ff4d6a', a: 0 },
      ]),
      radgrad('streetLamp', [
        { o: '0%',   c: '#ffd47a', a: 0.35 },
        { o: '100%', c: '#ffd47a', a: 0 },
      ]),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#thrBg)' }),
    // Distant city windows
    ...Array.from({length: 60}, (_, i) => {
      const x = (i * 21) % 1200;
      const y = 200 + ((i * 13) % 200);
      return React.createElement('rect', { key: i, x, y, width: 3, height: 6, fill: '#8a9aff', opacity: 0.4 });
    }),
    // Neon sign glow
    React.createElement('circle', { cx: 900, cy: 260, r: 220, fill: 'url(#neonRed)' }),
    // Neon sign letters (abstract)
    React.createElement('rect', { x: 820, y: 220, width: 160, height: 6, fill: '#ff4d6a' }),
    React.createElement('rect', { x: 820, y: 240, width: 120, height: 6, fill: '#ff4d6a' }),
    React.createElement('rect', { x: 820, y: 260, width: 180, height: 6, fill: '#ff4d6a', opacity: 0.7 }),
    // Street lamp glow
    React.createElement('circle', { cx: 260, cy: 340, r: 160, fill: 'url(#streetLamp)' }),
    // Rain drops
    ...drops.map((d, i) =>
      React.createElement('line', { key: i,
        x1: d.x, y1: 0, x2: d.x - 40, y2: d.l * 12,
        stroke: '#8ac4ff', strokeWidth: 1, opacity: d.o
      })
    ),
    // Wet floor reflection
    React.createElement('rect', { x: 0, y: 640, width: 1200, height: 160, fill: '#000', opacity: 0.5 }),
    React.createElement('ellipse', { cx: 900, cy: 720, rx: 400, ry: 20, fill: '#ff4d6a', opacity: 0.15 }),
    React.createElement('ellipse', { cx: 260, cy: 720, rx: 280, ry: 16, fill: '#ffd47a', opacity: 0.12 }),
    // Window streaks
    ...Array.from({length: 12}, (_, i) =>
      React.createElement('path', { key: 'st'+i,
        d: `M ${100 + i * 90} 0 Q ${110 + i * 90} 300 ${80 + i * 90} 800`,
        stroke: 'rgba(255,255,255,0.06)', strokeWidth: 2, fill: 'none'
      })
    ),
  );
}

function SceneDocumentary() {
  // Layered paper archive: old photos, typewriter grid, masking tape
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-doc',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('docBg', [
        { o: '0%',   c: '#062a2a', a: 1 },
        { o: '100%', c: '#021212', a: 1 },
      ]),
      grad('paperA', [
        { o: '0%',   c: '#e8e0cc', a: 0.95 },
        { o: '100%', c: '#c4b89c', a: 0.9 },
      ]),
      grad('paperB', [
        { o: '0%',   c: '#d6d2c0', a: 0.9 },
        { o: '100%', c: '#a89a7c', a: 0.85 },
      ]),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#docBg)' }),
    // Grid behind
    ...Array.from({length: 24}, (_, i) =>
      React.createElement('line', { key: 'v'+i, x1: i * 50, y1: 0, x2: i * 50, y2: 800, stroke: 'rgba(57, 217, 138, 0.05)', strokeWidth: 1 })
    ),
    ...Array.from({length: 16}, (_, i) =>
      React.createElement('line', { key: 'h'+i, x1: 0, y1: i * 50, x2: 1200, y2: i * 50, stroke: 'rgba(57, 217, 138, 0.05)', strokeWidth: 1 })
    ),
    // Tossed photo 1 (rotated)
    React.createElement('g', { transform: 'translate(200, 120) rotate(-8)' },
      React.createElement('rect', { x: 0, y: 0, width: 260, height: 300, fill: 'url(#paperA)', stroke: '#000', strokeOpacity: 0.2 }),
      React.createElement('rect', { x: 16, y: 16, width: 228, height: 220, fill: '#1a2424' }),
      // Photo content: silhouette portrait
      React.createElement('circle', { cx: 130, cy: 120, r: 40, fill: '#d6cfb0', opacity: 0.5 }),
      React.createElement('path', { d: 'M 50 236 Q 130 170, 210 236 Z', fill: '#d6cfb0', opacity: 0.5 }),
      React.createElement('text', { x: 130, y: 270, fill: '#2a3434', fontSize: 14, fontFamily: 'monospace', textAnchor: 'middle' }, '— 1962 —'),
      // Masking tape
      React.createElement('rect', { x: 100, y: -12, width: 60, height: 22, fill: '#f4e9b4', opacity: 0.65 }),
    ),
    // Tossed photo 2
    React.createElement('g', { transform: 'translate(820, 80) rotate(6)' },
      React.createElement('rect', { x: 0, y: 0, width: 240, height: 280, fill: 'url(#paperB)', stroke: '#000', strokeOpacity: 0.2 }),
      React.createElement('rect', { x: 14, y: 14, width: 212, height: 200, fill: '#202020' }),
      // Industrial/archive photo
      ...Array.from({length: 6}, (_, i) =>
        React.createElement('rect', { key: i, x: 24 + i * 30, y: 60 + ((i * 7) % 40), width: 18, height: 120 - ((i*7)%40), fill: '#8aa3a3' })
      ),
      React.createElement('rect', { x: 80, y: -10, width: 80, height: 18, fill: '#f4e9b4', opacity: 0.6 }),
    ),
    // Stamped "ARCHIVE" text
    React.createElement('text', { x: 600, y: 420, fill: '#39d98a', fontSize: 110, fontFamily: 'serif', fontWeight: 900, textAnchor: 'middle', opacity: 0.08, letterSpacing: 8 }, 'ARCHIVE'),
    // Typewriter caption line
    React.createElement('rect', { x: 380, y: 620, width: 440, height: 70, fill: '#0a1a1a', stroke: 'rgba(57,217,138,0.3)' }),
    React.createElement('text', { x: 400, y: 655, fill: '#39d98a', fontSize: 14, fontFamily: 'monospace', letterSpacing: 3 }, '> CLASSIFIED.REEL-04.1962'),
    React.createElement('rect', { x: 400, y: 670, width: 12, height: 14, fill: '#39d98a' }),
  );
}

function SceneLifestyle() {
  // Warm kitchen — flames, steam, copper pot, chef silhouette
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-lifestyle',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('kitchBg', [
        { o: '0%',   c: '#3a1f0a', a: 1 },
        { o: '100%', c: '#1a0a03', a: 1 },
      ]),
      radgrad('hearth', [
        { o: '0%',   c: '#ffa040', a: 0.6 },
        { o: '50%',  c: '#ff6820', a: 0.3 },
        { o: '100%', c: '#ff6820', a: 0 },
      ], '50%', '70%', '60%'),
      grad('steam', [
        { o: '0%',   c: '#fff', a: 0 },
        { o: '50%',  c: '#fff', a: 0.3 },
        { o: '100%', c: '#fff', a: 0 },
      ]),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#kitchBg)' }),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#hearth)' }),
    // Window/brick wall slats
    ...Array.from({length: 20}, (_, i) =>
      React.createElement('rect', { key: i, x: (i%5)*244, y: Math.floor(i/5)*40 + 40, width: 240, height: 2, fill: 'rgba(0,0,0,0.4)' })
    ),
    // Counter silhouette
    React.createElement('rect', { x: 0, y: 560, width: 1200, height: 240, fill: '#0a0503' }),
    React.createElement('rect', { x: 0, y: 556, width: 1200, height: 6, fill: '#2a1810' }),
    // Copper pot
    React.createElement('ellipse', { cx: 600, cy: 560, rx: 140, ry: 12, fill: '#000', opacity: 0.8 }),
    React.createElement('path', {
      d: 'M 460 560 Q 460 480 500 450 L 700 450 Q 740 480 740 560 Z',
      fill: '#b87333'
    }),
    React.createElement('path', {
      d: 'M 470 560 Q 470 490 506 464 L 694 464 Q 730 490 730 560 Z',
      fill: '#d89055'
    }),
    React.createElement('ellipse', { cx: 600, cy: 450, rx: 100, ry: 10, fill: '#8a4a20' }),
    // Flames beneath
    ...Array.from({length: 6}, (_, i) =>
      React.createElement('path', { key: 'f'+i,
        d: `M ${500 + i * 40} 600 Q ${510 + i * 40} 570 ${520 + i * 40} 600 Q ${520 + i * 40} 630 ${500 + i * 40} 600 Z`,
        fill: '#ff8040', opacity: 0.7
      })
    ),
    // Steam plumes
    ...Array.from({length: 5}, (_, i) =>
      React.createElement('ellipse', { key: 'sm'+i,
        cx: 540 + i * 30, cy: 380 - i * 40,
        rx: 30 + i * 8, ry: 40 + i * 12,
        fill: 'url(#steam)', opacity: 0.5 - i * 0.06
      })
    ),
    // Chef silhouette (side)
    React.createElement('path', {
      d: 'M 940 560 L 940 380 Q 940 340 970 320 Q 995 300 1020 320 Q 1035 340 1030 370 L 1040 380 Q 1060 400 1050 440 L 1050 560 Z',
      fill: '#000', opacity: 0.85
    }),
    // Chef hat
    React.createElement('ellipse', { cx: 995, cy: 290, rx: 40, ry: 28, fill: '#f4ecd4' }),
    React.createElement('rect', { x: 962, y: 300, width: 68, height: 18, fill: '#f4ecd4' }),
    // Hanging herbs/warm lights
    ...Array.from({length: 6}, (_, i) =>
      React.createElement('circle', { key: 'lt'+i, cx: 80 + i * 140, cy: 80, r: 6, fill: '#ffc878', opacity: 0.9 })
    ),
  );
}

function SceneReality() {
  // Paparazzi flashes + spotlight cones + carpet
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-reality',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('realBg', [
        { o: '0%',   c: '#2a0a2e', a: 1 },
        { o: '100%', c: '#0a0210', a: 1 },
      ]),
      radgrad('spot1', [
        { o: '0%',   c: '#ff4d9a', a: 0.5 },
        { o: '100%', c: '#ff4d9a', a: 0 },
      ]),
      radgrad('spot2', [
        { o: '0%',   c: '#8ac4ff', a: 0.4 },
        { o: '100%', c: '#8ac4ff', a: 0 },
      ]),
      radgrad('flash', [
        { o: '0%',   c: '#fff', a: 0.9 },
        { o: '40%',  c: '#fff', a: 0.3 },
        { o: '100%', c: '#fff', a: 0 },
      ]),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#realBg)' }),
    // Crossed spotlight beams
    React.createElement('path', { d: 'M 100 0 L -100 800 L 400 800 L 400 0 Z', fill: 'url(#spot1)', opacity: 0.5 }),
    React.createElement('path', { d: 'M 1100 0 L 1300 800 L 800 800 L 800 0 Z', fill: 'url(#spot2)', opacity: 0.5 }),
    // Red carpet
    React.createElement('path', { d: 'M 400 560 L 800 560 L 900 800 L 300 800 Z', fill: '#8a1a1a' }),
    React.createElement('path', { d: 'M 440 580 L 760 580 L 860 800 L 340 800 Z', fill: '#c83030' }),
    // Stanchion ropes
    React.createElement('path', { d: 'M 100 560 Q 250 540 400 560', stroke: '#f0c040', strokeWidth: 3, fill: 'none' }),
    React.createElement('path', { d: 'M 800 560 Q 950 540 1100 560', stroke: '#f0c040', strokeWidth: 3, fill: 'none' }),
    // Paparazzi silhouette row
    ...Array.from({length: 14}, (_, i) => {
      const x = 60 + i * 80;
      return React.createElement('g', { key: i },
        React.createElement('circle', { cx: x, cy: 520, r: 14, fill: '#000' }),
        React.createElement('rect', { x: x - 24, y: 530, width: 48, height: 80, fill: '#000' }),
        // Camera
        React.createElement('rect', { x: x - 8, y: 495, width: 30, height: 20, fill: '#1a1a1a', stroke: 'rgba(255,255,255,0.3)' }),
        // Flash burst (every 3rd)
        i % 3 === 1 && React.createElement('circle', { cx: x + 6, cy: 490, r: 40, fill: 'url(#flash)' })
      );
    }),
    // Distant flash bursts
    ...Array.from({length: 8}, (_, i) => {
      const x = 80 + (i * 160) % 1200;
      const y = 100 + (i * 71) % 300;
      return React.createElement('circle', { key: 'db'+i, cx: x, cy: y, r: 60, fill: 'url(#flash)', opacity: 0.6 });
    }),
    // Central figure silhouette
    React.createElement('path', {
      d: 'M 590 300 Q 590 270 610 260 Q 625 260 630 270 Q 630 280 640 290 L 660 340 L 680 480 Q 620 510 560 480 L 580 340 L 600 290 Q 590 280 590 300 Z',
      fill: '#000', opacity: 0.9
    }),
    React.createElement('ellipse', { cx: 610, cy: 248, rx: 18, ry: 22, fill: '#000' }),
  );
}

function SceneScripted() {
  // Epic vista — mountain range + lone figure + sunset sky
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-scripted',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('skyEpic', [
        { o: '0%',   c: '#0a1a3d', a: 1 },
        { o: '40%',  c: '#36548a', a: 1 },
        { o: '70%',  c: '#c86a3a', a: 1 },
        { o: '100%', c: '#f0b080', a: 1 },
      ]),
      radgrad('sunEpic', [
        { o: '0%',   c: '#fff4d0', a: 1 },
        { o: '60%',  c: '#ffa050', a: 0.4 },
        { o: '100%', c: '#ff6030', a: 0 },
      ]),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#skyEpic)' }),
    // Sun
    React.createElement('circle', { cx: 720, cy: 460, r: 180, fill: 'url(#sunEpic)' }),
    React.createElement('circle', { cx: 720, cy: 460, r: 60, fill: '#fff4d0' }),
    // Distant mountain layers
    React.createElement('path', { d: 'M 0 520 L 180 400 L 320 480 L 500 380 L 680 460 L 880 390 L 1050 440 L 1200 420 L 1200 800 L 0 800 Z', fill: '#2a3a5a', opacity: 0.7 }),
    React.createElement('path', { d: 'M 0 600 L 120 500 L 280 560 L 440 480 L 620 560 L 820 490 L 1000 540 L 1200 520 L 1200 800 L 0 800 Z', fill: '#1a2440', opacity: 0.85 }),
    React.createElement('path', { d: 'M 0 680 L 200 600 L 360 650 L 560 580 L 760 650 L 940 600 L 1200 640 L 1200 800 L 0 800 Z', fill: '#0a1024' }),
    // Lone figure on ridge (silhouette on horseback)
    React.createElement('g', { transform: 'translate(820, 570)' },
      // Horse body
      React.createElement('ellipse', { cx: 0, cy: 0, rx: 42, ry: 16, fill: '#000' }),
      // Legs
      React.createElement('rect', { x: -30, y: 0, width: 4, height: 40, fill: '#000' }),
      React.createElement('rect', { x: -18, y: 0, width: 4, height: 40, fill: '#000' }),
      React.createElement('rect', { x: 20, y: 0, width: 4, height: 40, fill: '#000' }),
      React.createElement('rect', { x: 32, y: 0, width: 4, height: 40, fill: '#000' }),
      // Neck + head
      React.createElement('path', { d: 'M 30 -8 L 56 -36 L 64 -30 L 56 -24 L 48 -20 L 38 -2 Z', fill: '#000' }),
      // Tail
      React.createElement('path', { d: 'M -40 -4 L -60 10 L -58 22 L -38 6 Z', fill: '#000' }),
      // Rider
      React.createElement('path', { d: 'M -4 -30 Q 0 -44 6 -44 Q 16 -44 16 -30 L 20 -10 L 4 -2 L -8 -10 Z', fill: '#000' }),
      React.createElement('circle', { cx: 6, cy: -50, r: 7, fill: '#000' }),
      // Hat brim
      React.createElement('rect', { x: -4, y: -54, width: 24, height: 3, fill: '#000' }),
    ),
  );
}

function SceneBranded() {
  // Clean hero product on spotlight
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-branded',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('brBg', [
        { o: '0%',   c: '#0a2a1f', a: 1 },
        { o: '100%', c: '#030f09', a: 1 },
      ]),
      radgrad('brSpot', [
        { o: '0%',   c: '#39d98a', a: 0.4 },
        { o: '100%', c: '#39d98a', a: 0 },
      ], '50%', '60%', '50%'),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#brBg)' }),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#brSpot)' }),
    // Infinity backdrop curve
    React.createElement('path', { d: 'M 0 560 Q 600 520 1200 560 L 1200 800 L 0 800 Z', fill: '#0a3a28' }),
    // Hero product (bottle silhouette)
    React.createElement('g', { transform: 'translate(600, 280)' },
      React.createElement('path', {
        d: 'M -40 0 L -40 40 Q -60 60 -60 120 L -60 280 Q -60 320 -40 320 L 40 320 Q 60 320 60 280 L 60 120 Q 60 60 40 40 L 40 0 Z',
        fill: '#1a4a34'
      }),
      React.createElement('path', {
        d: 'M -30 60 L -30 30 Q -30 10 -15 4 L 15 4 Q 30 10 30 30 L 30 60 Z',
        fill: '#0a2418'
      }),
      // Label
      React.createElement('rect', { x: -48, y: 160, width: 96, height: 80, fill: '#f4ecd4' }),
      React.createElement('rect', { x: -30, y: 180, width: 60, height: 3, fill: '#1a4a34' }),
      React.createElement('rect', { x: -20, y: 195, width: 40, height: 2, fill: '#1a4a34' }),
      React.createElement('rect', { x: -30, y: 220, width: 60, height: 2, fill: '#1a4a34', opacity: 0.6 }),
      // Shine
      React.createElement('path', { d: 'M -40 60 L -30 60 L -30 300 L -40 300 Z', fill: '#fff', opacity: 0.15 }),
    ),
    // Floor reflection
    React.createElement('ellipse', { cx: 600, cy: 660, rx: 180, ry: 18, fill: '#39d98a', opacity: 0.2 }),
  );
}

function SceneAnimation() {
  // Vivid abstract bursts + confetti
  return React.createElement('svg', {
    className: 'pr-scene pr-scene-animation',
    viewBox: '0 0 1200 800', preserveAspectRatio: 'xMidYMid slice',
    xmlns: 'http://www.w3.org/2000/svg'
  },
    React.createElement('defs', null,
      grad('anBg', [
        { o: '0%',   c: '#2e0a3d', a: 1 },
        { o: '100%', c: '#0a0220', a: 1 },
      ]),
      radgrad('anBurst', [
        { o: '0%',   c: '#ff4d9a', a: 0.5 },
        { o: '100%', c: '#ff4d9a', a: 0 },
      ]),
      radgrad('anBurst2', [
        { o: '0%',   c: '#8ac4ff', a: 0.5 },
        { o: '100%', c: '#8ac4ff', a: 0 },
      ]),
    ),
    React.createElement('rect', { width: 1200, height: 800, fill: 'url(#anBg)' }),
    React.createElement('circle', { cx: 300, cy: 300, r: 300, fill: 'url(#anBurst)' }),
    React.createElement('circle', { cx: 900, cy: 500, r: 300, fill: 'url(#anBurst2)' }),
    // Star bursts
    ...Array.from({length: 40}, (_, i) => {
      const x = (i * 37) % 1200;
      const y = (i * 67) % 800;
      const size = 4 + (i % 5) * 3;
      const colors = ['#ff4d9a', '#8ac4ff', '#ffd47a', '#9a4dff', '#4dffc4'];
      const c = colors[i % colors.length];
      return React.createElement('g', { key: i, transform: `translate(${x} ${y}) rotate(${i * 23})` },
        React.createElement('path', {
          d: `M 0 ${-size} L ${size/3} ${-size/3} L ${size} 0 L ${size/3} ${size/3} L 0 ${size} L ${-size/3} ${size/3} L ${-size} 0 L ${-size/3} ${-size/3} Z`,
          fill: c, opacity: 0.7
        })
      );
    }),
  );
}

// Scene router ──────────────────────────────────────────
const SCENES = {
  'Sports':       SceneSports,
  'Drama':        SceneDrama,
  'Thriller':     SceneThriller,
  'Documentary':  SceneDocumentary,
  'Lifestyle':    SceneLifestyle,
  'Reality':      SceneReality,
  'Scripted':     SceneScripted,
  'Comedy':       SceneLifestyle, // warm daylight vibe
  'Branded':      SceneBranded,
  'Animation':    SceneAnimation,
};

function KeyArtScene({ genre }) {
  const Scene = SCENES[genre] || SCENES['Drama'];
  return React.createElement('div', { className: 'pr-scene-wrap' },
    React.createElement(Scene)
  );
}

window.PR_KeyArtScene = KeyArtScene;
