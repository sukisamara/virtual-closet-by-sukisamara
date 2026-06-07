// TODAY.JS — smart outfit algorithm

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const MAIN_SLOTS = [
  { key:'dress',     label:'Dress',          cats:['dresses']          },
  { key:'top',       label:'Top',            cats:['tops']             },
  { key:'bottom',    label:'Bottom / Skirt', cats:['bottoms','skirts'] },
  { key:'outerwear', label:'Layer',          cats:['outerwear']        },
];
const EXTRA_SLOTS = [
  { key:'shoes',     label:'Shoes',     cats:['shoes']       },
  { key:'bag',       label:'Bag',       cats:['bags']        },
  { key:'accessory', label:'Accessory', cats:['accessories'] },
];
const ALL_SLOTS = [...MAIN_SLOTS, ...EXTRA_SLOTS];

// ─── Occasion → aesthetic affinity map ───
// Which aesthetics fit each occasion best (ordered by relevance)
const OCCASION_AESTHETICS = {
  'going out':        ['soft glam','mob wife','mermaid core','Y2K','dark academia','old money'],
  'office wear':      ['quiet luxury','minimalist','old money','clean girl','preppy'],
  'business formal':  ['quiet luxury','old money','minimalist','dark academia'],
  'casual everyday':  ['clean girl','minimalist','coastal grandmother','cottage core','preppy'],
  'brunch':           ['soft glam','clean girl','cottage core','preppy','coastal grandmother','boho chic'],
  'date night':       ['soft glam','old money','quiet luxury','mob wife','mermaid core','dark academia'],
  'gym & active':     ['minimalist','clean girl','streetwear'],
  'travel':           ['minimalist','coastal grandmother','clean girl','cottage core'],
  'beach & holiday':  ['mermaid core','coastal grandmother','boho chic','cottage core'],
  'wedding guest':    ['soft glam','quiet luxury','old money','ballet core'],
  'festival':         ['Y2K','boho chic','mermaid core','streetwear','mob wife'],
  'cosy at home':     ['minimalist','cottage core','clean girl'],
};

// ─── Weather rules ───
// What to force or suppress based on temperature
const WEATHER_RULES = {
  needsLayer:   (temp) => temp < 16,   // always add outerwear slot
  noLayer:      (temp) => temp > 24,   // never add outerwear
  preferDress:  (temp) => temp > 20,   // lean towards dresses
  preferBottom: (temp) => temp < 14,   // lean towards trousers not skirts
};

// ─── Aesthetic compatibility matrix ───
// Score boost when two items share the same aesthetic family
const AESTHETIC_FAMILIES = {
  'glamorous':   ['soft glam','mob wife','mermaid core'],
  'luxury':      ['quiet luxury','old money','dark academia'],
  'fresh':       ['clean girl','minimalist','coastal grandmother'],
  'playful':     ['Y2K','preppy','ballet core'],
  'natural':     ['cottage core','boho chic','coastal grandmother'],
  'edge':        ['streetwear','hard rock','dark academia'],
};

function getFamily(aesthetic) {
  return Object.entries(AESTHETIC_FAMILIES).find(([, aesthetics]) => aesthetics.includes(aesthetic))?.[0] || null;
}

function aestheticCompatibility(itemA, itemB) {
  // Returns 0–3 score: how well two items' aesthetics align
  if (!itemA || !itemB) return 0;
  let score = 0;
  const aAes = itemA.aesthetics || [];
  const bAes = itemB.aesthetics || [];
  // Exact aesthetic match = 2 points each
  aAes.forEach(a => { if (bAes.includes(a)) score += 2; });
  // Same family match = 1 point each
  aAes.forEach(a => {
    const famA = getFamily(a);
    if (famA) bAes.forEach(b => { if (getFamily(b) === famA && a !== b) score += 1; });
  });
  return score;
}

function occasionScore(item, occasion) {
  // How well does an item fit today's occasion? 0–10
  if (!item.occasions || !item.occasions.length) return 2;
  if (item.occasions.includes(occasion)) return 10;
  // Partial credit for related occasions
  const related = {
    'going out':       ['date night','festival','wedding guest'],
    'office wear':     ['business formal','casual everyday'],
    'business formal': ['office wear'],
    'casual everyday': ['brunch','travel','cosy at home'],
    'date night':      ['going out','brunch'],
    'brunch':          ['casual everyday','date night','going out'],
    'festival':        ['going out','beach & holiday'],
    'wedding guest':   ['going out','date night'],
    'beach & holiday': ['casual everyday','travel','festival'],
    'travel':          ['casual everyday','beach & holiday'],
  };
  const relatives = related[occasion] || [];
  if (item.occasions.some(o => relatives.includes(o))) return 5;
  return 1;
}

function recencyPenalty(item, wearLog) {
  // Down-weight items worn in the last 7 days
  const cutoff = Date.now() - 7 * 86400000;
  const recentWears = wearLog.filter(w =>
    new Date(w.date).getTime() > cutoff && w.itemIds.includes(item.id)
  ).length;
  if (recentWears >= 3) return -8;
  if (recentWears === 2) return -4;
  if (recentWears === 1) return -2;
  return 0;
}

function scoreItem(item, occasion, wearLog, anchorAesthetics = []) {
  // Score an individual item for today's outfit
  let score = 0;
  score += occasionScore(item, occasion);
  score += recencyPenalty(item, wearLog);

  // Boost items whose aesthetics match today's ideal aesthetics
  const idealAesthetics = OCCASION_AESTHETICS[occasion] || [];
  item.aesthetics.forEach((a, i) => {
    const idx = idealAesthetics.indexOf(a);
    if (idx === 0) score += 5;       // perfect match
    else if (idx === 1) score += 3;
    else if (idx <= 3) score += 2;
    else if (idx > 3) score += 1;
  });

  // Boost items that are compatible with what's already chosen (anchor aesthetics)
  if (anchorAesthetics.length) {
    const fakeAnchor = { aesthetics: anchorAesthetics };
    score += aestheticCompatibility(item, fakeAnchor);
  }

  // Small random tiebreaker so it doesn't always pick the same item
  score += Math.random() * 1.5;

  return score;
}

function pickBest(pool, occasion, wearLog, anchorAesthetics = []) {
  if (!pool.length) return null;
  const scored = pool.map(item => ({
    item,
    score: scoreItem(item, occasion, wearLog, anchorAesthetics)
  }));
  scored.sort((a, b) => b.score - a.score);
  // Pick from top 3 (if available) for variety while staying smart
  const topN = scored.slice(0, Math.min(3, scored.length));
  return topN[Math.floor(Math.random() * topN.length)].item;
}

// ─── MAIN ALGORITHM ───
function buildSmartOutfit(items, wearLog, occasion, weather) {
  const result = {};
  const temp = weather?.temp || 20;

  // Step 1: decide dress vs separates
  // Weather + occasion influence the decision
  const dressPool = items.filter(i => i.category === 'dresses');
  const hasDresses = dressPool.length > 0;
  let useDress = false;

  if (hasDresses) {
    // Prefer dress if warm and casual/going out
    const dressOccasions = ['going out','date night','brunch','wedding guest','festival','beach & holiday','casual everyday'];
    const warmEnough = temp > 18;
    const occasionFavoursDress = dressOccasions.includes(occasion);
    if (warmEnough && occasionFavoursDress) {
      useDress = Math.random() > 0.3;  // 70% dress
    } else if (!warmEnough && occasionFavoursDress) {
      useDress = Math.random() > 0.5;  // 50/50
    } else {
      useDress = Math.random() > 0.75; // 25% dress for office/gym etc
    }
  }

  // Step 2: pick hero piece first (dress OR top) — this sets the aesthetic anchor
  let anchorAesthetics = [];

  if (useDress) {
    const dress = pickBest(dressPool, occasion, wearLog, []);
    if (dress) {
      result.dress = dress;
      anchorAesthetics = dress.aesthetics;
    }
  } else {
    const topPool = items.filter(i => i.category === 'tops');
    const top = pickBest(topPool, occasion, wearLog, []);
    if (top) {
      result.top = top;
      anchorAesthetics = top.aesthetics;
    }

    // Step 3: pick bottom that matches top's aesthetic
    const bottomPool = items.filter(i => ['bottoms','skirts'].includes(i.category));
    // If cold, prefer trousers over skirts
    const filteredBottoms = temp < 14
      ? bottomPool.filter(i => i.category === 'bottoms').length > 0
        ? bottomPool.filter(i => i.category === 'bottoms')
        : bottomPool
      : bottomPool;
    const bottom = pickBest(filteredBottoms, occasion, wearLog, anchorAesthetics);
    if (bottom) result.bottom = bottom;
    if (bottom) anchorAesthetics = [...new Set([...anchorAesthetics, ...bottom.aesthetics])];
  }

  // Step 4: outerwear — weather-driven
  const outerPool = items.filter(i => i.category === 'outerwear');
  if (outerPool.length && WEATHER_RULES.needsLayer(temp)) {
    result.outerwear = pickBest(outerPool, occasion, wearLog, anchorAesthetics);
    if (result.outerwear) anchorAesthetics = [...new Set([...anchorAesthetics, ...result.outerwear.aesthetics])];
  }
  // If warm, still allow optional layer (e.g. blazer for office)
  if (!result.outerwear && outerPool.length && !WEATHER_RULES.noLayer(temp)) {
    const officeOccasions = ['office wear','business formal'];
    if (officeOccasions.includes(occasion) && Math.random() > 0.4) {
      result.outerwear = pickBest(outerPool, occasion, wearLog, anchorAesthetics);
    }
  }

  // Step 5: shoes — match aesthetic anchor
  const shoePool = items.filter(i => i.category === 'shoes');
  if (shoePool.length) {
    result.shoes = pickBest(shoePool, occasion, wearLog, anchorAesthetics);
    if (result.shoes) anchorAesthetics = [...new Set([...anchorAesthetics, ...result.shoes.aesthetics])];
  }

  // Step 6: bag — match aesthetic anchor
  const bagPool = items.filter(i => i.category === 'bags');
  if (bagPool.length) {
    result.bag = pickBest(bagPool, occasion, wearLog, anchorAesthetics);
  }

  // Step 7: accessory — match aesthetic anchor
  const accPool = items.filter(i => i.category === 'accessories');
  if (accPool.length) {
    result.accessory = pickBest(accPool, occasion, wearLog, anchorAesthetics);
  }

  return result;
}

// ─── UI STATE ───
let items      = getItems();
let wearLog    = getWearLog();
let events     = getEvents();
let weather    = getMockWeather();
let gcalConn   = getGcal();
let outfit     = {};
let slotIdx    = {};
let logged     = false;
let showWPicker= false;
let activeKey  = null;
let outfitReason = ''; // explain why this outfit was chosen

const now      = new Date();
const todayStr = now.toISOString().split('T')[0];

function getTodayEvents(){ return events.filter(e => e.date === todayStr); }
function getOccasion()   { return getTodayEvents()[0]?.type || 'casual everyday'; }
function getPool(slot)   { return items.filter(i => slot.cats.includes(i.category)); }

function generateOutfit(){
  items = getItems();
  wearLog = getWearLog();
  outfit = {}; slotIdx = {}; logged = false; activeKey = null;
  const occasion = getOccasion();

  outfit = buildSmartOutfit(items, wearLog, occasion, weather);

  // Sync slotIdx to current outfit items so arrows work correctly
  ALL_SLOTS.forEach(slot => {
    if (outfit[slot.key]) {
      const pool = getPool(slot);
      slotIdx[slot.key] = pool.findIndex(i => i.id === outfit[slot.key].id);
      if (slotIdx[slot.key] < 0) slotIdx[slot.key] = 0;
    }
  });

  // Build a reason string for the outfit
  const anchorItem = outfit.dress || outfit.top;
  const dominantAes = anchorItem?.aesthetics?.[0] || '';
  const idealAes = (OCCASION_AESTHETICS[occasion] || [])[0] || '';
  outfitReason = dominantAes
    ? `Curated for <strong>${occasion}</strong> — leading with a <strong>${dominantAes}</strong> aesthetic${weather ? `, dressed for ${weather.desc.toLowerCase()}` : ''}`
    : `Curated for <strong>${occasion}</strong>`;

  renderMain();
}

function cycleSlot(key, dir, e){
  e && e.stopPropagation();
  const slot = ALL_SLOTS.find(s => s.key === key);
  const pool = getPool(slot);
  if (pool.length < 2) return;
  const next = ((slotIdx[key] + dir) + pool.length) % pool.length;
  slotIdx[key] = next;
  outfit[key]  = pool[next];
  renderMain();
}

function selectSlot(key){
  activeKey = activeKey === key ? null : key;
  renderMain();
}

function logWearToday(){
  if (logged) return;
  const ids = Object.values(outfit).filter(Boolean).map(i => i.id);
  wearLog.push({ id:'w-'+Date.now(), itemIds:ids, date:todayStr });
  saveWearLog(wearLog);
  ids.forEach(id => { const it = items.find(i => i.id === id); if (it) it.wears++; });
  saveItems(items);
  logged = true;
  renderMain();
}

function handleConnectGcal(){ connectGcal(); gcalConn = true; events = getEvents(); generateOutfit(); }
function toggleWeatherPicker(){ showWPicker = !showWPicker; renderMain(); }
function pickWeather(i){ weather = WEATHERS[i]; showWPicker = false; generateOutfit(); }

// ─── CARD RENDERING ───
function slotCard(slot){
  const item = outfit[slot.key];
  if (!item) return '';
  const pool = getPool(slot);
  const isActive = activeKey === slot.key;

  const imgHtml = item.image
    ? `<img src="${item.image}" alt="${item.name}" />`
    : `<div style="font-family:'Cormorant Garamond',serif;font-style:italic;font-size:13px;color:var(--text-muted);padding:12px;text-align:center">${item.subcategory||item.category}</div>`;

  return `
  <div class="flat-slot">
    <span class="flat-slot-label">${slot.label}</span>
    <div class="flat-slot-card${isActive?' active-slot':''}" onclick="selectSlot('${slot.key}')">
      <div class="flat-slot-img" style="background:linear-gradient(135deg,${item.color}38,${item.color}80)">
        ${imgHtml}
        <div class="flat-slot-arrows">
          <button class="flat-arrow" onclick="cycleSlot('${slot.key}',-1,event)" ${pool.length<2?'disabled':''}>‹</button>
          <button class="flat-arrow" onclick="cycleSlot('${slot.key}',1,event)" ${pool.length<2?'disabled':''}>›</button>
        </div>
      </div>
      <div class="flat-slot-meta">
        <span class="flat-slot-name">${item.name}</span>
        <span class="flat-slot-brand">${item.brand}</span>
      </div>
    </div>
    ${pool.length > 1 ? `<span class="flat-slot-count">${pool.length} options</span>` : ''}
  </div>`;
}

function detailPanel(){
  if (!activeKey || !outfit[activeKey]) return '';
  const slot = ALL_SLOTS.find(s => s.key === activeKey);
  const item = outfit[activeKey];
  const pool = getPool(slot);

  // Compatibility score with rest of outfit
  const otherItems = Object.values(outfit).filter(i => i && i.id !== item.id);
  const totalCompat = otherItems.reduce((sum, other) => sum + aestheticCompatibility(item, other), 0);
  const compatLabel = totalCompat >= 6 ? '✦ Perfect match' : totalCompat >= 3 ? '✿ Good fit' : '◈ Contrasting pick';

  return `
  <div class="slot-detail-panel">
    <div class="sdp-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}88)">
      ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ''}
    </div>
    <div class="sdp-info">
      <span class="sdp-label">${slot.label}</span>
      <p class="sdp-name">${item.name}</p>
      <p class="sdp-brand">${item.brand}</p>
      <div class="sdp-tags">
        ${item.aesthetics.map(a=>`<span class="pill">${a}</span>`).join('')}
      </div>
      <p class="sdp-compat">${compatLabel}</p>
    </div>
    <div class="sdp-arrows">
      <button class="sdp-arrow-btn" onclick="cycleSlot('${activeKey}',-1,event)" ${pool.length<2?'disabled':''}>‹ Prev</button>
      <span class="sdp-count">${pool.length} options</span>
      <button class="sdp-arrow-btn" onclick="cycleSlot('${activeKey}',1,event)" ${pool.length<2?'disabled':''}>Next ›</button>
    </div>
  </div>`;
}

// ─── RENDER ───
function renderMain(){
  const todayEvents = getTodayEvents();
  const occasion    = getOccasion();
  const activeMain  = MAIN_SLOTS.filter(s => outfit[s.key]);
  const activeExtra = EXTRA_SLOTS.filter(s => outfit[s.key]);

  document.getElementById('main').innerHTML = `
  <div class="today-hero fade-up">
    <div class="date-block">
      <span class="eyebrow">${DAYS[now.getDay()]}</span>
      <div class="date-day-num">${now.getDate()}</div>
      <p class="date-month">${MONTHS[now.getMonth()]} ${now.getFullYear()}</p>
    </div>
    <div class="context-cards">
      <div class="context-card">
        <span class="eyebrow">Today's Plans</span>
        ${todayEvents.length
          ? todayEvents.map(e=>`
            <div class="event-row">
              <span class="event-dot-big"></span>
              <div><p class="event-name">${e.title}</p><span class="pill">${e.type}</span></div>
              ${e.source==='google'?'<span class="gcal-badge">GCAL</span>':''}
            </div>`).join('')
          : `<p class="no-event">No plans — free &amp; fabulous</p>`}
        ${gcalConn
          ? `<span class="gcal-connected-badge">📅 Google Calendar connected</span>`
          : `<button class="btn btn-ghost" style="margin-top:12px;font-size:12px" onclick="handleConnectGcal()">📅 Connect Google Calendar</button>`}
      </div>
      <div class="context-card">
        <span class="eyebrow">Weather</span>
        <div class="weather-row">
          <span class="weather-icon">${weather.icon}</span>
          <div>
            <p class="weather-temp">${weather.temp}°C</p>
            <p class="weather-desc">${weather.desc}</p>
          </div>
          <button class="weather-change" onclick="toggleWeatherPicker()">${showWPicker?'✕':'Change'}</button>
        </div>
        ${showWPicker?`<div class="weather-picker">${WEATHERS.map((w,i)=>`
          <button class="weather-opt${weather.desc===w.desc?' active':''}" onclick="pickWeather(${i})">${w.icon} ${w.desc} · ${w.temp}°C</button>`).join('')}
        </div>`:''}
      </div>
    </div>
  </div>

  <div class="outfit-section fade-up fade-up-1">
    <div class="outfit-section-hdr">
      <div>
        <span class="eyebrow">Today's Look</span>
        <h2 class="section-title">Your outfit for <em>${occasion}</em></h2>
        <p class="outfit-reason">${outfitReason}</p>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        ${logged
          ? `<span class="logged-inline">✦ Outfit logged!</span>`
          : `<button class="btn btn-ghost" onclick="logWearToday()">✦ I'm wearing this</button>`}
        <button class="btn btn-primary" onclick="generateOutfit()">Reshuffle ✦</button>
      </div>
    </div>

    ${items.length === 0
      ? `<div class="empty-state"><span class="empty-icon">✿</span><p>Your closet is empty</p><a href="add.html" class="btn btn-primary">Add your first item</a></div>`
      : `<div class="flat-outfit">
          ${activeMain.length ? `<div class="flat-main-row">${activeMain.map(s=>slotCard(s)).join('')}</div>` : ''}
          ${activeExtra.length ? `<div class="flat-extras-row">${activeExtra.map(s=>slotCard(s)).join('')}</div>` : ''}
          ${detailPanel()}
        </div>`
    }
  </div>`;
}

if (!requireAuth()) throw new Error('not authed');
document.getElementById('navbar-mount').innerHTML = renderNavbar('index.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
generateOutfit();
