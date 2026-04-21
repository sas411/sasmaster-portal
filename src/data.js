// ═══════════════════════════════════════════════════════════
// SaSMaster — realistic data snapshots (modeled on SCOOP schema)
// Shape matches production: network IDs <100000 = single, >=100000 = group
// ═══════════════════════════════════════════════════════════

const NETWORKS = [
  { id: 6200, code: 'BET',       name: 'BET',               tier: 'mid',   group: 'Paramount',    color: '#d1a054' },
  { id: 6204, code: 'ESPN',      name: 'ESPN',              tier: 'high',  group: 'Disney',       color: '#c8352d' },
  { id: 6218, code: 'TNT',       name: 'TNT',               tier: 'high',  group: 'WBD',          color: '#d17a2e' },
  { id: 6212, code: 'USA',       name: 'USA Network',       tier: 'high',  group: 'NBCU',         color: '#3a7bd5' },
  { id: 6225, code: 'FX',        name: 'FX',                tier: 'mid',   group: 'Disney',       color: '#a94442' },
  { id: 6231, code: 'FOOD',      name: 'Food Network',      tier: 'mid',   group: 'WBD',          color: '#c96a2e' },
  { id: 6240, code: 'HGTV',      name: 'HGTV',              tier: 'mid',   group: 'WBD',          color: '#5a8c3a' },
  { id: 6251, code: 'DISC',      name: 'Discovery',         tier: 'mid',   group: 'WBD',          color: '#3b5998' },
  { id: 6267, code: 'HIST',      name: 'History',           tier: 'mid',   group: 'A+E',          color: '#8b6f3a' },
  { id: 6278, code: 'LIFE',      name: 'Lifetime',          tier: 'mid',   group: 'A+E',          color: '#c94f8a' },
  { id: 6289, code: 'BRAVO',     name: 'Bravo',             tier: 'mid',   group: 'NBCU',         color: '#6a3ac9' },
  { id: 6294, code: 'HALL',      name: 'Hallmark',          tier: 'mid',   group: 'Hallmark',    color: '#3a8f6a' },
];

const NETWORK_GROUPS = [
  { id: 100002, code: 'DISNEY', name: 'Disney Portfolio',    networks: [6204, 6225] },
  { id: 100004, code: 'WBD',    name: 'Warner Bros Discovery', networks: [6218, 6231, 6240, 6251] },
  { id: 100010, code: 'NBCU',   name: 'NBCUniversal',        networks: [6212, 6289] },
  { id: 100016, code: 'PARA',   name: 'Paramount',            networks: [6200] },
];

// ═══════════════════════════════════════════════════════════
// CONTENT RESEARCH PORTAL — programs, telecasts, rankers
// ═══════════════════════════════════════════════════════════
const PROGRAMS = [
  { rank: 1,  title: 'SUNDAY NIGHT COUNTDOWN',        network: 'ESPN',   genre: 'Sports',         rating: 2.84, delta: +12.3, reach: '18.2M', demo: 'A25-54',  ep: 'S12E08' },
  { rank: 2,  title: 'THE LAST CONVOY',              network: 'USA',    genre: 'Drama',          rating: 1.92, delta:  +8.1, reach: '12.4M', demo: 'A18-49',  ep: 'S03E11' },
  { rank: 3,  title: 'MIDNIGHT KITCHEN',             network: 'FOOD',   genre: 'Lifestyle',      rating: 1.41, delta:  +3.2, reach: '8.9M',  demo: 'A25-54',  ep: 'S08E04' },
  { rank: 4,  title: 'HAMMER & NAIL',                network: 'HGTV',   genre: 'Lifestyle',      rating: 1.38, delta:  -1.4, reach: '8.2M',  demo: 'W25-54',  ep: 'S05E02' },
  { rank: 5,  title: 'IRONFORGE',                    network: 'HIST',   genre: 'Documentary',    rating: 1.22, delta:  +5.7, reach: '7.8M',  demo: 'M25-54',  ep: 'S11E09' },
  { rank: 6,  title: 'LONE STAR CROSSING',           network: 'BET',    genre: 'Scripted',       rating: 1.14, delta: +18.4, reach: '6.9M',  demo: 'A18-49',  ep: 'S02E06' },
  { rank: 7,  title: 'CAPE LIGHT',                   network: 'HALL',   genre: 'Drama',          rating: 1.08, delta:  +2.1, reach: '6.4M',  demo: 'W35+',    ep: 'S04E07' },
  { rank: 8,  title: 'DEEP OCEAN ARCHIVES',          network: 'DISC',   genre: 'Documentary',    rating: 0.98, delta:  -4.2, reach: '5.9M',  demo: 'A25-54',  ep: 'S06E03' },
  { rank: 9,  title: 'PAPER CITIES',                 network: 'FX',     genre: 'Drama',          rating: 0.94, delta:  +7.8, reach: '5.2M',  demo: 'A18-49',  ep: 'S02E10' },
  { rank: 10, title: 'THE OVERNIGHT',                network: 'TNT',    genre: 'Thriller',       rating: 0.89, delta:  -0.8, reach: '4.8M',  demo: 'A25-54',  ep: 'S01E12' },
  { rank: 11, title: 'HIDDEN PROVINCE',              network: 'BRAVO',  genre: 'Reality',        rating: 0.84, delta: +11.2, reach: '4.3M',  demo: 'W18-49',  ep: 'S09E05' },
  { rank: 12, title: 'COAST TO COAST: DINERS',       network: 'FOOD',   genre: 'Lifestyle',      rating: 0.76, delta:  +1.8, reach: '3.9M',  demo: 'A25-54',  ep: 'S14E08' },
  { rank: 13, title: 'TNT SATURDAY MOVIES: READY PLAYER ONE', network: 'TNT', genre: 'Movie', rating: 0.72, delta: +15.8, reach: '4.1M', demo: 'A18-49', ep: 'MOVIE' },
];

// Weekly ratings trend (last 14 weeks, indexed 100 = base)
const WEEKLY_TREND = [
  { week: 'W01', date: '01/06',  bet: 98,  espn: 102, tnt: 94,  usa: 99,  benchmark: 100 },
  { week: 'W02', date: '01/13',  bet: 101, espn: 108, tnt: 96,  usa: 97,  benchmark: 100 },
  { week: 'W03', date: '01/20',  bet: 106, espn: 114, tnt: 99,  usa: 98,  benchmark: 100 },
  { week: 'W04', date: '01/27',  bet: 109, espn: 118, tnt: 101, usa: 102, benchmark: 100 },
  { week: 'W05', date: '02/03',  bet: 112, espn: 122, tnt: 98,  usa: 104, benchmark: 100 },
  { week: 'W06', date: '02/10',  bet: 115, espn: 128, tnt: 95,  usa: 107, benchmark: 100 },
  { week: 'W07', date: '02/17',  bet: 118, espn: 134, tnt: 93,  usa: 111, benchmark: 100 },
  { week: 'W08', date: '02/24',  bet: 121, espn: 141, tnt: 92,  usa: 114, benchmark: 100 },
  { week: 'W09', date: '03/03',  bet: 124, espn: 148, tnt: 90,  usa: 118, benchmark: 100 },
  { week: 'W10', date: '03/10',  bet: 128, espn: 152, tnt: 89,  usa: 121, benchmark: 100 },
  { week: 'W11', date: '03/17',  bet: 131, espn: 156, tnt: 91,  usa: 125, benchmark: 100 },
  { week: 'W12', date: '03/24',  bet: 134, espn: 161, tnt: 94,  usa: 128, benchmark: 100 },
  { week: 'W13', date: '03/31',  bet: 138, espn: 164, tnt: 96,  usa: 132, benchmark: 100 },
  { week: 'W14', date: '04/07',  bet: 142, espn: 168, tnt: 98,  usa: 135, benchmark: 100 },
];

// ═══════════════════════════════════════════════════════════
// ADVERTISING PORTAL — spend, pacing, CPM, categories
// ═══════════════════════════════════════════════════════════
const AD_CATEGORIES = [
  { cat: 'Automotive',        spend: 284.2, pacing: +14.1, cpm: 28.40, share: 18.2 },
  { cat: 'QSR & Dining',      spend: 218.7, pacing:  +8.3, cpm: 22.15, share: 14.0 },
  { cat: 'Pharma & Rx',       spend: 196.4, pacing: +22.8, cpm: 34.60, share: 12.6 },
  { cat: 'Retail',            spend: 142.9, pacing:  -3.1, cpm: 19.80, share:  9.1 },
  { cat: 'CPG — Food',        spend: 128.3, pacing:  +4.7, cpm: 18.20, share:  8.2 },
  { cat: 'Financial',         spend: 112.6, pacing: +11.4, cpm: 26.90, share:  7.2 },
  { cat: 'Streaming',         spend:  98.4, pacing: +18.9, cpm: 24.10, share:  6.3 },
  { cat: 'Telecom',           spend:  87.2, pacing:  -1.8, cpm: 21.70, share:  5.6 },
  { cat: 'Insurance',         spend:  76.1, pacing:  +2.4, cpm: 23.30, share:  4.9 },
  { cat: 'Travel',            spend:  62.8, pacing: +28.2, cpm: 20.60, share:  4.0 },
];

// ═══════════════════════════════════════════════════════════
// MARKETING PORTAL — campaigns, reach/frequency, DMA
// ═══════════════════════════════════════════════════════════
const CAMPAIGNS = [
  { name: 'PANTERA QX EV LAUNCH',      brand: 'Pantera Motors',     reach: '68.4M',  freq: 3.2, grp: 218.4, status: 'live',    delta: +24 },
  { name: 'GROVE COLD BREW SPRING',    brand: 'Grove Coffee Co.',   reach: '42.1M',  freq: 2.8, grp: 117.9, status: 'live',    delta: +8  },
  { name: 'ACRE INSURANCE Q2 OPEN',    brand: 'Acre Insurance',     reach: '56.3M',  freq: 4.1, grp: 230.8, status: 'paused',  delta: -3  },
  { name: 'NORTHWIND OUTDOOR GEAR',    brand: 'Northwind Outfitters', reach: '31.8M', freq: 2.4, grp: 76.3,  status: 'live',    delta: +12 },
  { name: 'HARBOR FINANCIAL CARD',     brand: 'Harbor Financial',   reach: '48.2M',  freq: 3.6, grp: 173.5, status: 'live',    delta: +6  },
  { name: 'LUMEN PHARMA DTC',          brand: 'Lumen Pharma',       reach: '39.7M',  freq: 5.2, grp: 206.4, status: 'flight',  delta: +18 },
];

const DMAS = [
  { dma: 'New York',       index: 124, households: '7.8M',   share: 8.2 },
  { dma: 'Los Angeles',    index: 118, households: '5.9M',   share: 6.1 },
  { dma: 'Chicago',        index: 112, households: '3.6M',   share: 3.8 },
  { dma: 'Philadelphia',   index: 108, households: '3.0M',   share: 3.2 },
  { dma: 'Dallas-Ft.Worth',index: 106, households: '2.9M',   share: 3.1 },
  { dma: 'San Francisco',  index: 122, households: '2.5M',   share: 2.7 },
  { dma: 'Atlanta',        index: 116, households: '2.5M',   share: 2.6 },
  { dma: 'Houston',        index: 104, households: '2.5M',   share: 2.6 },
];

// ═══════════════════════════════════════════════════════════
// CPG PORTAL — brand velocity, retail lift, panel
// ═══════════════════════════════════════════════════════════
const BRANDS = [
  { brand: 'CANOPY KITCHEN',      category: 'Condiments',   velocity: 142, lift: +18.4, hhp: '28.2%', dollars: '$412M', sparkline: [98,102,108,115,122,128,135,142] },
  { brand: 'MERIDIAN YOGURT',     category: 'Dairy',        velocity: 128, lift: +12.1, hhp: '34.8%', dollars: '$386M', sparkline: [92,96,102,108,114,118,124,128] },
  { brand: 'AURORA CEREAL CO.',   category: 'Breakfast',    velocity: 118, lift:  +8.6, hhp: '22.4%', dollars: '$341M', sparkline: [100,104,108,110,114,116,117,118] },
  { brand: 'FATHOM BEVERAGE',     category: 'Beverages',    velocity: 136, lift: +22.3, hhp: '19.6%', dollars: '$298M', sparkline: [88,94,104,112,120,128,132,136] },
  { brand: 'CEDAR PANTRY',        category: 'Snacks',       velocity: 104, lift:  -2.4, hhp: '26.1%', dollars: '$274M', sparkline: [108,106,104,102,101,103,104,104] },
  { brand: 'NORTHWELL OATS',      category: 'Breakfast',    velocity:  98, lift:  -5.8, hhp: '14.2%', dollars: '$218M', sparkline: [110,108,104,101,98,97,98,98] },
];

// ═══════════════════════════════════════════════════════════
// EXCHANGE — content marketplace (buy/sell)
// ═══════════════════════════════════════════════════════════
const LISTINGS = [
  { id: 'SL-0412', title: 'THE LAST CONVOY — S1-3',  seller: 'Oakhurst Studios',   type: 'SVOD Rights',    territory: 'US + LATAM',  windows: '2026-2028', asking: '$4.8M',  bid: '$4.2M',  status: 'open',      episodes: 36, hot: true  },
  { id: 'SL-0418', title: 'IRONFORGE — DOC SERIES',  seller: 'Meridian Media',     type: 'Linear + AVOD',  territory: 'Global',      windows: '2026-2027', asking: '$2.1M',  bid: '$1.9M',  status: 'open',      episodes: 24, hot: false },
  { id: 'SL-0421', title: 'PAPER CITIES — S2',       seller: 'Cape Light Group',   type: 'Exclusive',      territory: 'US',          windows: '2027-2030', asking: '$12.4M', bid: '$10.8M', status: 'bidding',   episodes: 10, hot: true  },
  { id: 'SL-0425', title: 'CAPE LIGHT — HOLIDAY',    seller: 'Hearth Productions', type: 'Cable Bundle',   territory: 'US + CA',     windows: '2026 Q4',   asking: '$1.4M',  bid: '$1.2M',  status: 'open',      episodes: 8,  hot: false },
  { id: 'SL-0429', title: 'HIDDEN PROVINCE — S9',    seller: 'Rivet & Co.',        type: 'Reality Format', territory: 'Global',      windows: '2026-2029', asking: '$3.6M',  bid: '—',      status: 'preview',   episodes: 14, hot: false },
  { id: 'SL-0433', title: 'THE OVERNIGHT — LIBRARY', seller: 'Obsidian Content',   type: 'Library Pack',   territory: 'US + EU',     windows: '2026-2028', asking: '$6.2M',  bid: '$5.4M',  status: 'bidding',   episodes: 52, hot: true  },
];

// Ticker items — cinematic, cross-portal
const TICKER = [
  'ESPN +68% vs prior qtr',
  'PANTERA QX launch GRP 218',
  'CANOPY KITCHEN velocity 142',
  'THE LAST CONVOY bid $4.2M',
  'FOOD NETWORK daypart pacing +8%',
  'DISNEY PORTFOLIO reach 142.8M',
  'LUMEN PHARMA DTC flight T-14',
  'MERIDIAN YOGURT lift +12.1%',
  'TNT Sunday prime -4.2%',
  'PAPER CITIES S2 bidding 10.8M',
  'CPG food-spend pacing +4.7%',
  'BET universal default ID 6200',
];

// Insight / anomaly feed — what Dr. Scoop would surface
const INSIGHTS = [
  { portal: 'CONTENT',     title: 'Sunday Night Countdown surged 12.3% W/W',              when: '14m',  kind: 'anomaly',  sev: 'high' },
  { portal: 'ADVERTISING', title: 'Pharma CPM breached 2Q ceiling — $34.60',              when: '32m',  kind: 'threshold',sev: 'mid'  },
  { portal: 'MARKETING',   title: 'Pantera QX crossed 68M reach; freq holding at 3.2',    when: '1h',   kind: 'milestone',sev: 'mid'  },
  { portal: 'CPG',         title: 'Fathom Beverage velocity +22.3 — 6-week run',          when: '2h',   kind: 'trend',    sev: 'high' },
  { portal: 'EXCHANGE',    title: 'Paper Cities S2 now in active bidding — 3 buyers',     when: '3h',   kind: 'event',    sev: 'high' },
  { portal: 'CONTENT',     title: 'TNT Sunday Prime underperforming vs YAGO (-4.2%)',     when: '4h',   kind: 'warning',  sev: 'mid'  },
];

// ═══ MACRO · Market-level factoids + chart data ════════════
// Used by both Content Research and Content Exchange dashboards
const GENRES = [
  { key: 'drama',    name: 'Drama',    color: '#f0c040' }, // gold
  { key: 'sports',   name: 'Sports',   color: '#c8352d' }, // red
  { key: 'reality',  name: 'Reality',  color: '#a78bfa' }, // purple
  { key: 'news',     name: 'News',     color: '#3a7bd5' }, // blue
  { key: 'comedy',   name: 'Comedy',   color: '#64d6a0' }, // green
  { key: 'kids',     name: 'Kids',     color: '#ff7ec6' }, // pink
  { key: 'late',     name: 'Late',     color: '#f28a3a' }, // amber
];

// Macro KPI factoids (Content Research entry view)
const MACRO_FACTS = [
  { label: 'ACTIVE TITLES',      value: '18,420',   delta:  3.4, tone: 'gold',    foot: 'tracked across 1,240 networks'  },
  { label: 'STREAMING SHARE',    value: '44.8%',    delta:  6.1, tone: 'green',   foot: 'of total TV viewing · Mar 2026' },
  { label: 'PRIMETIME REACH',    value: '168.2M',   delta: -1.8, tone: '',        foot: 'P2+ weekly reach'               },
  { label: 'LINEAR ↔ STREAM',    value: '54 : 46',  delta:  0,   tone: 'purple',  foot: 'crossover index 108'            },
  { label: 'TOP DECLINER',       value: 'News',     delta: -9.2, tone: 'red',     foot: 'vs YAGO · A25-54'               },
];

// 12-month bubble chart — each bubble = a show cohort
// x: month index (0-11), y: avg HH rating, r: size (reach in M), g: genre key
const BUBBLE_SHOWS = [
  { m:  0, y: 2.4, r: 18, g: 'drama',   name: 'Ember Harbor' },
  { m:  0, y: 3.1, r: 24, g: 'sports',  name: 'NFL Sun Prime' },
  { m:  1, y: 1.8, r: 12, g: 'reality', name: 'Apex Games' },
  { m:  1, y: 2.2, r: 14, g: 'drama',   name: 'Paper Cities' },
  { m:  2, y: 3.4, r: 28, g: 'sports',  name: 'NBA All-Star' },
  { m:  2, y: 1.4, r:  8, g: 'comedy',  name: 'Night Static' },
  { m:  3, y: 2.6, r: 16, g: 'drama',   name: 'Midnight Call' },
  { m:  3, y: 1.2, r:  6, g: 'kids',    name: 'Rocket Rangers' },
  { m:  3, y: 2.0, r: 12, g: 'news',    name: 'Election Deep' },
  { m:  4, y: 1.9, r: 10, g: 'late',    name: 'After Hours' },
  { m:  4, y: 2.8, r: 20, g: 'reality', name: 'Trade Secrets' },
  { m:  5, y: 3.2, r: 26, g: 'sports',  name: 'MLB Midsummer' },
  { m:  5, y: 1.6, r: 10, g: 'comedy',  name: 'Dry Humor' },
  { m:  6, y: 2.1, r: 14, g: 'drama',   name: 'Glass Bureau' },
  { m:  6, y: 1.3, r:  8, g: 'kids',    name: 'Critter Club' },
  { m:  7, y: 2.4, r: 15, g: 'reality', name: 'Chef Duel' },
  { m:  7, y: 1.5, r:  9, g: 'news',    name: 'Sunday Brief' },
  { m:  8, y: 3.6, r: 30, g: 'sports',  name: 'NFL Opening' },
  { m:  8, y: 2.2, r: 12, g: 'drama',   name: 'Harbor House' },
  { m:  9, y: 2.5, r: 16, g: 'drama',   name: 'Coastal Black' },
  { m:  9, y: 1.9, r: 11, g: 'late',    name: 'Midline Live' },
  { m: 10, y: 3.0, r: 22, g: 'sports',  name: 'CFB Rivalry' },
  { m: 10, y: 2.1, r: 13, g: 'reality', name: 'Island Bids' },
  { m: 11, y: 2.8, r: 18, g: 'drama',   name: 'Winter Quiet' },
  { m: 11, y: 1.7, r: 10, g: 'comedy',  name: 'Holiday Snap' },
];

// Genre waveform trends — 14-week index (100 = prior-year avg)
const GENRE_TRENDS = [
  { key: 'drama',   rank: 1, share: 24.8, delta:  4.2, data: [102,106,110,108,112,118,116,120,124,122,128,130,134,138] },
  { key: 'sports',  rank: 2, share: 22.1, delta:  8.6, data: [ 98,102,108,114,118,112,120,128,132,138,142,146,152,156] },
  { key: 'reality', rank: 3, share: 14.6, delta:  2.1, data: [ 96, 98,102,104,106,108,104,110,112,108,112,116,114,118] },
  { key: 'news',    rank: 4, share: 11.2, delta: -9.2, data: [108,104,100, 96, 92, 94, 90, 86, 88, 84, 82, 80, 78, 76] },
  { key: 'comedy',  rank: 5, share:  9.8, delta: -1.4, data: [100, 98,102,100, 96, 98,100, 94, 96, 92, 94, 90, 92, 94] },
  { key: 'kids',    rank: 6, share:  8.2, delta: -3.8, data: [102,100, 96, 98, 94, 92, 90, 92, 88, 86, 88, 86, 84, 82] },
  { key: 'late',    rank: 7, share:  5.6, delta:  1.6, data: [ 98,100,102, 98,100,104,102,106,104,108,106,110,108,112] },
];

// Stacked demo viewing (time-shifted vs live)
const VIEWING_HABITS = [
  { demo: 'P2-17',   live: 42, sameDay: 18, ts3: 12, svod: 28 },
  { demo: 'P18-34',  live: 28, sameDay: 16, ts3: 18, svod: 38 },
  { demo: 'P25-54',  live: 38, sameDay: 22, ts3: 20, svod: 20 },
  { demo: 'P35-64',  live: 52, sameDay: 20, ts3: 16, svod: 12 },
  { demo: 'P55+',    live: 72, sameDay: 14, ts3:  8, svod:  6 },
  { demo: 'HH·KIDS', live: 34, sameDay: 18, ts3: 16, svod: 32 },
];

// ═══ EXCHANGE macro =════════════════════════════════
const EXCHANGE_KPI = [
  { label: '24H VOLUME',     value: '$18.4M',  delta: 22.4, tone: 'gold',   foot: '32 deals cleared'          },
  { label: 'AVG BID',        value: '$842K',   delta:  6.8, tone: '',       foot: 'across open listings'      },
  { label: 'OPEN LISTINGS',  value: '236',     delta:  4.2, tone: 'purple', foot: '18 in active bidding'      },
  { label: 'FILL RATE',      value: '78.4%',   delta: -2.1, tone: '',       foot: '30-day rolling'            },
];

// Geo heatmap — US regions with rights availability score (0-100)
const GEO_REGIONS = [
  { code: 'NE', name: 'Northeast',    x: 78, y: 30, score: 82, deals: 42 },
  { code: 'SE', name: 'Southeast',    x: 70, y: 58, score: 68, deals: 36 },
  { code: 'MW', name: 'Midwest',      x: 54, y: 38, score: 74, deals: 48 },
  { code: 'SW', name: 'Southwest',    x: 32, y: 60, score: 56, deals: 24 },
  { code: 'MT', name: 'Mountain',     x: 28, y: 38, score: 48, deals: 16 },
  { code: 'NW', name: 'Northwest',    x: 12, y: 24, score: 62, deals: 22 },
  { code: 'CA', name: 'California',   x: 10, y: 50, score: 88, deals: 54 },
  { code: 'AK', name: 'Alaska',       x:  6, y:  8, score: 34, deals:  4 },
  { code: 'HI', name: 'Hawaii',       x: 18, y: 88, score: 42, deals:  6 },
];

// Sankey — bids flowing from buyers to titles
const SANKEY_BIDS = {
  buyers: [
    { name: 'Argos+',     vol: 34 },
    { name: 'Meridian TV',vol: 28 },
    { name: 'Helix Media',vol: 22 },
    { name: 'Northbound', vol: 18 },
    { name: 'Zenith Co.', vol: 14 },
  ],
  titles: [
    { name: 'Paper Cities S2',  vol: 32, genre: 'drama'   },
    { name: 'Apex Games S5',    vol: 24, genre: 'reality' },
    { name: 'Midnight Call',    vol: 20, genre: 'drama'   },
    { name: 'Trade Secrets',    vol: 18, genre: 'reality' },
    { name: 'Glass Bureau',     vol: 14, genre: 'drama'   },
    { name: 'Chef Duel',        vol:  8, genre: 'reality' },
  ],
  // flows: buyer idx -> title idx -> value
  flows: [
    [0, 0, 14], [0, 2,  8], [0, 4,  6], [0, 5,  6],
    [1, 0, 10], [1, 1,  8], [1, 3,  6], [1, 4,  4],
    [2, 1,  8], [2, 2,  6], [2, 3,  4], [2, 5,  4],
    [3, 0,  6], [3, 1,  4], [3, 2,  4], [3, 3,  4],
    [4, 1,  4], [4, 2,  2], [4, 3,  4], [4, 4,  4],
  ],
};

// Exchange bubbles: asking price vs rating, sized by episodes
const EXCHANGE_BUBBLES = [
  { price:  8.2, rating: 2.4, eps: 22, g: 'drama',   name: 'Paper Cities S2' },
  { price: 12.6, rating: 3.1, eps: 18, g: 'sports',  name: 'NBA Regional Pkg' },
  { price:  4.8, rating: 1.8, eps: 32, g: 'reality', name: 'Apex Games S5' },
  { price:  6.4, rating: 2.2, eps: 14, g: 'drama',   name: 'Midnight Call' },
  { price:  2.2, rating: 1.4, eps: 24, g: 'comedy',  name: 'Dry Humor' },
  { price:  5.6, rating: 2.0, eps: 16, g: 'news',    name: 'Election Deep' },
  { price:  3.4, rating: 1.6, eps: 20, g: 'late',    name: 'After Hours' },
  { price:  7.2, rating: 2.6, eps: 12, g: 'drama',   name: 'Harbor House' },
  { price:  9.8, rating: 2.8, eps: 10, g: 'drama',   name: 'Winter Quiet' },
  { price:  4.2, rating: 1.9, eps: 22, g: 'reality', name: 'Chef Duel' },
  { price: 11.4, rating: 3.0, eps:  8, g: 'sports',  name: 'CFB Rivalry' },
  { price:  3.0, rating: 1.5, eps: 28, g: 'kids',    name: 'Critter Club' },
];

window.SASMASTER_DATA = {
  NETWORKS, NETWORK_GROUPS, PROGRAMS, WEEKLY_TREND,
  AD_CATEGORIES, CAMPAIGNS, DMAS, BRANDS, LISTINGS,
  TICKER, INSIGHTS,
  GENRES, MACRO_FACTS, BUBBLE_SHOWS, GENRE_TRENDS, VIEWING_HABITS,
  EXCHANGE_KPI, GEO_REGIONS, SANKEY_BIDS, EXCHANGE_BUBBLES,
};
