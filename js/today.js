// TODAY.JS — flat card layout

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// Main clothing slots (bigger cards)
const MAIN_SLOTS = [
  { key:'dress',     label:'Dress',          cats:['dresses']           },
  { key:'top',       label:'Top',            cats:['tops']              },
  { key:'bottom',    label:'Bottom / Skirt', cats:['bottoms','skirts']  },
  { key:'outerwear', label:'Layer',          cats:['outerwear']         },
];

// Smaller accent slots
const EXTRA_SLOTS = [
  { key:'shoes',     label:'Shoes',     cats:['shoes']       },
  { key:'bag',       label:'Bag',       cats:['bags']        },
  { key:'accessory', label:'Accessory', cats:['accessories'] },
];

const ALL_SLOTS = [...MAIN_SLOTS, ...EXTRA_SLOTS];

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

const now      = new Date();
const todayStr = now.toISOString().split('T')[0];

function getTodayEvents(){ return events.filter(e => e.date === todayStr); }
function getOccasion()   { return getTodayEvents()[0]?.type || 'casual everyday'; }
function getPool(slot)   { return items.filter(i => slot.cats.includes(i.category)); }

function generateOutfit(){
  outfit = {}; slotIdx = {}; logged = false; activeKey = null;
  const useDress = items.filter(i => i.category === 'dresses').length > 0 && Math.random() > 0.45;
  ALL_SLOTS.forEach(slot => {
    if (slot.key === 'dress'  && !useDress) return;
    if ((slot.key === 'top' || slot.key === 'bottom') && useDress) return;
    const pool = getPool(slot);
    if (!pool.length) return;
    const idx = Math.floor(Math.random() * pool.length);
    slotIdx[slot.key] = idx;
    outfit[slot.key]  = pool[idx];
  });
  renderMain();
}

function cycleSlot(key, dir, e){
  e && e.stopPropagation();
  const slot = ALL_SLOTS.find(s => s.key === key);
  const pool = getPool(slot);
  if (pool.length < 2) return;
  const next = ((slotIdx[key] + dir) + pool.length) % pool.length;
  slotIdx[key]  = next;
  outfit[key]   = pool[next];
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

function slotCard(slot, isExtra){
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
        ${item.occasions.slice(0,2).map(o=>`<span class="pill">${o}</span>`).join('')}
      </div>
    </div>
    <div class="sdp-arrows">
      <button class="sdp-arrow-btn" onclick="cycleSlot('${activeKey}',-1,event)" ${pool.length<2?'disabled':''}>‹ Prev</button>
      <span class="sdp-count">${pool.length} options</span>
      <button class="sdp-arrow-btn" onclick="cycleSlot('${activeKey}',1,event)" ${pool.length<2?'disabled':''}>Next ›</button>
    </div>
  </div>`;
}

function renderMain(){
  const todayEvents = getTodayEvents();
  const occasion    = getOccasion();

  // Only include slots that have items
  const activeMain  = MAIN_SLOTS.filter(s => outfit[s.key]);
  const activeExtra = EXTRA_SLOTS.filter(s => outfit[s.key]);

  document.getElementById('main').innerHTML = `
  <!-- Hero -->
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

  <!-- Outfit section -->
  <div class="outfit-section fade-up fade-up-1">
    <div class="outfit-section-hdr">
      <div>
        <span class="eyebrow">Today's Look</span>
        <h2 class="section-title">Your outfit for <em>${occasion}</em></h2>
      </div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        ${logged
          ? `<span class="logged-inline">✦ Outfit logged!</span>`
          : `<button class="btn btn-ghost" onclick="logWearToday()">✦ I'm wearing this</button>`}
        <button class="btn btn-primary" onclick="generateOutfit()">Shuffle ✦</button>
      </div>
    </div>

    ${items.length === 0
      ? `<div class="empty-state">
          <span class="empty-icon">✿</span>
          <p>Your closet is empty</p>
          <a href="add.html" class="btn btn-primary">Add your first item</a>
        </div>`
      : `<div class="flat-outfit">
          ${activeMain.length ? `<div class="flat-main-row">${activeMain.map(s=>slotCard(s,false)).join('')}</div>` : ''}
          ${activeExtra.length ? `<div class="flat-extras-row">${activeExtra.map(s=>slotCard(s,true)).join('')}</div>` : ''}
          ${detailPanel()}
        </div>`
    }
  </div>`;
}

document.getElementById('navbar-mount').innerHTML = renderNavbar('index.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
generateOutfit();
