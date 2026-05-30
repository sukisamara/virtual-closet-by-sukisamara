// TODAY.JS

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SLOT_DEFS = [
  { key:'top',       label:'Top',            cats:['tops'],             bodyPos:'top'       },
  { key:'bottom',    label:'Bottom / Skirt', cats:['bottoms','skirts'], bodyPos:'bottom'    },
  { key:'dress',     label:'Dress',          cats:['dresses'],          bodyPos:'full'      },
  { key:'outerwear', label:'Layer',          cats:['outerwear'],        bodyPos:'outer'     },
  { key:'shoes',     label:'Shoes',          cats:['shoes'],            bodyPos:'shoes'     },
  { key:'bag',       label:'Bag',            cats:['bags'],             bodyPos:'bag'       },
  { key:'accessory', label:'Accessory',      cats:['accessories'],      bodyPos:'accessory' },
];

let items    = getItems();
let wearLog  = getWearLog();
let events   = getEvents();
let weather  = getMockWeather();
let gcalConn = getGcal();

let outfit      = {};
let slotIndices = {};
let logged      = false;
let showWPicker = false;
let activeSlotKey = null; // which slot the side panel shows

const now      = new Date();
const todayStr = now.toISOString().split('T')[0];

function getTodayEvents() { return events.filter(e => e.date === todayStr); }
function getOccasion()    { return getTodayEvents()[0]?.type || 'casual everyday'; }
function getPool(slot)    { return items.filter(i => slot.cats.includes(i.category)); }

function generateOutfit() {
  outfit = {}; slotIndices = {}; logged = false; activeSlotKey = null;
  const useDress = items.filter(i=>i.category==='dresses').length > 0 && Math.random() > 0.45;
  SLOT_DEFS.forEach(slot => {
    if (slot.key==='dress' && !useDress) return;
    if ((slot.key==='top'||slot.key==='bottom') && useDress) return;
    const pool = getPool(slot);
    if (!pool.length) return;
    const idx = Math.floor(Math.random()*pool.length);
    slotIndices[slot.key] = idx;
    outfit[slot.key] = pool[idx];
  });
  renderMain();
}

function cycleSlot(key, dir) {
  const slot = SLOT_DEFS.find(s=>s.key===key);
  const pool = getPool(slot);
  if (pool.length < 2) return;
  const cur  = slotIndices[key] ?? 0;
  const next = ((cur+dir)+pool.length) % pool.length;
  slotIndices[key] = next;
  outfit[key] = pool[next];
  renderMain();
}

function selectSlot(key) {
  activeSlotKey = activeSlotKey === key ? null : key;
  renderMain();
}

function logWearToday() {
  if (logged) return;
  const ids = Object.values(outfit).filter(Boolean).map(i=>i.id);
  wearLog.push({ id:'w-'+Date.now(), itemIds:ids, date:todayStr });
  saveWearLog(wearLog);
  ids.forEach(id => { const it=items.find(i=>i.id===id); if(it) it.wears++; });
  saveItems(items);
  logged = true;
  renderMain();
}

function handleConnectGcal() {
  connectGcal(); gcalConn=true; events=getEvents(); generateOutfit();
}

// ── Build the mannequin body SVG with outfit images layered on ──
function buildBody() {
  const top       = outfit['top']       || outfit['dress'];
  const bottom    = outfit['bottom'];
  const dress     = outfit['dress'];
  const outer     = outfit['outerwear'];
  const shoes     = outfit['shoes'];
  const bag       = outfit['bag'];
  const acc       = outfit['accessory'];

  // Each "zone" is a clickable region on the body shape
  const activeSlots = SLOT_DEFS.filter(s => outfit[s.key]);

  return `
  <div class="body-figure">
    <!-- Central mannequin silhouette -->
    <div class="mannequin">
      <svg class="mannequin-svg" viewBox="0 0 200 480" xmlns="http://www.w3.org/2000/svg">
        <!-- neck + head -->
        <ellipse cx="100" cy="38" rx="26" ry="30" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <!-- shoulders -->
        <path d="M40 95 Q100 75 160 95 L168 200 Q100 215 32 200 Z" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <!-- torso -->
        <rect x="45" y="195" width="110" height="110" rx="8" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <!-- hips -->
        <path d="M38 295 Q100 310 162 295 L158 360 Q100 375 42 360 Z" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <!-- legs -->
        <rect x="48" y="355" width="44" height="110" rx="6" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <rect x="108" y="355" width="44" height="110" rx="6" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <!-- feet -->
        <ellipse cx="70" cy="468" rx="26" ry="10" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
        <ellipse cx="130" cy="468" rx="26" ry="10" fill="#fce4ef" stroke="#f4a2c3" stroke-width="1.5"/>
      </svg>

      <!-- Outfit image layers overlaid on body zones -->
      ${dress ? `
        <div class="body-layer body-dress" onclick="selectSlot('dress')" title="${dress.name}" style="border-color:${activeSlotKey==='dress'?'var(--pink-dark)':'transparent'}">
          <img src="${dress.image||''}" alt="${dress.name}" onerror="this.style.display='none'" />
        </div>` : ''}
      ${top && !dress ? `
        <div class="body-layer body-top" onclick="selectSlot('top')" title="${top.name}" style="border-color:${activeSlotKey==='top'?'var(--pink-dark)':'transparent'}">
          <img src="${top.image||''}" alt="${top.name}" onerror="this.style.display='none'" />
        </div>` : ''}
      ${bottom ? `
        <div class="body-layer body-bottom" onclick="selectSlot('bottom')" title="${bottom.name}" style="border-color:${activeSlotKey==='bottom'?'var(--pink-dark)':'transparent'}">
          <img src="${bottom.image||''}" alt="${bottom.name}" onerror="this.style.display='none'" />
        </div>` : ''}
      ${outer ? `
        <div class="body-layer body-outer" onclick="selectSlot('outerwear')" title="${outer.name}" style="border-color:${activeSlotKey==='outerwear'?'var(--pink-dark)':'transparent'}">
          <img src="${outer.image||''}" alt="${outer.name}" onerror="this.style.display='none'" />
        </div>` : ''}
      ${shoes ? `
        <div class="body-layer body-shoes" onclick="selectSlot('shoes')" title="${shoes.name}" style="border-color:${activeSlotKey==='shoes'?'var(--pink-dark)':'transparent'}">
          <img src="${shoes.image||''}" alt="${shoes.name}" onerror="this.style.display='none'" />
        </div>` : ''}
    </div>

    <!-- Side accessories column -->
    <div class="body-accessories">
      ${bag ? `
      <div class="acc-chip${activeSlotKey==='bag'?' active':''}" onclick="selectSlot('bag')" title="${bag.name}">
        ${bag.image ? `<img src="${bag.image}" alt="${bag.name}" />` : '<span>👜</span>'}
        <span class="acc-chip-label">Bag</span>
      </div>` : ''}
      ${acc ? `
      <div class="acc-chip${activeSlotKey==='accessory'?' active':''}" onclick="selectSlot('accessory')" title="${acc.name}">
        ${acc.image ? `<img src="${acc.image}" alt="${acc.name}" />` : '<span>✨</span>'}
        <span class="acc-chip-label">Accessory</span>
      </div>` : ''}
    </div>
  </div>

  <!-- Slot detail panel (shows when a zone is tapped) -->
  ${activeSlotKey && outfit[activeSlotKey] ? (() => {
    const slot = SLOT_DEFS.find(s=>s.key===activeSlotKey);
    const item = outfit[activeSlotKey];
    const pool = getPool(slot);
    return `
    <div class="slot-panel fade-up">
      <div class="slot-panel-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}88)">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ''}
      </div>
      <div class="slot-panel-info">
        <span class="eyebrow">${slot.label}</span>
        <h3 class="slot-panel-name">${item.name}</h3>
        <p class="slot-panel-brand">${item.brand}</p>
        <div class="slot-panel-tags">${item.aesthetics.map(a=>`<span class="pill">${a}</span>`).join('')}</div>
        <div class="slot-panel-arrows">
          <button class="arrow-btn" onclick="cycleSlot('${activeSlotKey}',-1)" ${pool.length<2?'disabled':''}>‹ Prev</button>
          <span class="eyebrow" style="margin:0">${pool.length} options</span>
          <button class="arrow-btn" onclick="cycleSlot('${activeSlotKey}',1)" ${pool.length<2?'disabled':''}>Next ›</button>
        </div>
      </div>
    </div>`;
  })() : ''}`;
}

function renderMain() {
  const todayEvents = getTodayEvents();
  const occasion    = getOccasion();
  const activeSlots = SLOT_DEFS.filter(s => outfit[s.key]);

  document.getElementById('main').innerHTML = `
  <!-- Hero bar -->
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
        ${showWPicker?`<div class="weather-picker">${WEATHERS.map((w,i)=>`<button class="weather-opt${weather.desc===w.desc?' active':''}" onclick="pickWeather(${i})">${w.icon} ${w.desc} · ${w.temp}°C</button>`).join('')}</div>`:''}
      </div>
    </div>
  </div>

  <!-- Outfit section -->
  <div class="outfit-section fade-up fade-up-1">
    <div class="outfit-section-hdr">
      <div>
        <span class="eyebrow">Today's Look</span>
        <h2 class="section-title">Your outfit for <em>${occasion}</em></h2>
      </div>
      <div style="display:flex;gap:10px;align-items:center">
        ${logged
          ? `<span class="logged-inline">✦ Outfit logged!</span>`
          : `<button class="btn btn-ghost" onclick="logWearToday()">✦ I'm wearing this</button>`}
        <button class="btn btn-primary" onclick="generateOutfit()">Shuffle ✦</button>
      </div>
    </div>

    ${items.length === 0
      ? `<div class="empty-state"><span class="empty-icon">✿</span><p>Your closet is empty</p><a href="add.html" class="btn btn-primary">Add your first item</a></div>`
      : `<div class="body-layout">${buildBody()}</div>`
    }
  </div>`;
}

function toggleWeatherPicker() { showWPicker=!showWPicker; renderMain(); }
function pickWeather(i) { weather=WEATHERS[i]; showWPicker=false; generateOutfit(); }

document.getElementById('navbar-mount').innerHTML = renderNavbar('index.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
generateOutfit();
