// TODAY.JS — outfit builder with arrows

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SLOT_DEFS = [
  { key:'top',       label:'Top',           cats:['tops'],              icon:'👚' },
  { key:'bottom',    label:'Bottom / Skirt',cats:['bottoms','skirts'],  icon:'👖' },
  { key:'dress',     label:'Dress',         cats:['dresses'],           icon:'👗' },
  { key:'shoes',     label:'Shoes',         cats:['shoes'],             icon:'👠' },
  { key:'bag',       label:'Bag',           cats:['bags'],              icon:'👜' },
  { key:'outerwear', label:'Layer',         cats:['outerwear'],         icon:'🧥' },
  { key:'accessory', label:'Accessory',     cats:['accessories'],       icon:'✨' },
];

let items    = getItems();
let wearLog  = getWearLog();
let events   = getEvents();
let weather  = getMockWeather();
let gcalConn = getGcal();

let outfit        = {};      // key → item
let slotIndices   = {};      // key → index in pool
let logged        = false;
let showWPicker   = false;

const now      = new Date();
const todayStr = now.toISOString().split('T')[0];

function getTodayEvents() { return events.filter(e => e.date === todayStr); }
function getOccasion()    { return getTodayEvents()[0]?.type || 'casual everyday'; }

function getPool(slot) {
  return items.filter(i => slot.cats.includes(i.category));
}

function generateOutfit() {
  outfit = {}; slotIndices = {}; logged = false;
  const occasion = getOccasion();
  const useDress = items.filter(i=>i.category==='dresses').length > 0 && Math.random() > 0.45;

  SLOT_DEFS.forEach(slot => {
    if (slot.key === 'dress' && !useDress) return;
    if ((slot.key === 'top' || slot.key === 'bottom') && useDress) return;
    const pool = getPool(slot);
    if (!pool.length) return;
    const idx = Math.floor(Math.random() * pool.length);
    slotIndices[slot.key] = idx;
    outfit[slot.key] = pool[idx];
  });
  renderMain();
}

function cycleSlot(key, dir) {
  const slot = SLOT_DEFS.find(s => s.key === key);
  const pool = getPool(slot);
  if (pool.length < 2) return;
  const cur = slotIndices[key] ?? 0;
  const next = ((cur + dir) + pool.length) % pool.length;
  slotIndices[key] = next;
  outfit[key] = pool[next];
  renderMain();
}

function logWearToday() {
  if (logged) return;
  const ids = Object.values(outfit).filter(Boolean).map(i => i.id);
  const entry = { id: 'w-'+Date.now(), itemIds: ids, date: todayStr };
  wearLog.push(entry);
  saveWearLog(wearLog);
  // increment wears
  ids.forEach(id => {
    const item = items.find(i => i.id === id);
    if (item) item.wears++;
  });
  saveItems(items);
  logged = true;
  renderMain();
}

function handleConnectGcal() {
  connectGcal();
  gcalConn = true;
  events = getEvents();
  generateOutfit();
}

function renderMain() {
  const todayEvents = getTodayEvents();
  const occasion    = getOccasion();
  const totalCost   = Object.values(outfit).filter(Boolean).reduce((s,i)=>s+i.cost,0);
  const activeSlots = SLOT_DEFS.filter(s => outfit[s.key]);

  document.getElementById('main').innerHTML = `
  <!-- Hero -->
  <div class="today-hero fade-up">
    <div class="date-block">
      <span class="eyebrow">${DAYS[now.getDay()]}</span>
      <div class="date-day-num">${now.getDate()}</div>
      <p class="date-month">${MONTHS[now.getMonth()]} ${now.getFullYear()}</p>
    </div>

    <div class="context-cards">
      <!-- Events -->
      <div class="context-card">
        <span class="eyebrow">Today's Plans</span>
        ${todayEvents.length
          ? todayEvents.map(e=>`
            <div class="event-row">
              <span class="event-dot-big"></span>
              <div>
                <p class="event-name">${e.title}</p>
                <span class="pill">${e.type}</span>
              </div>
              ${e.source==='google'?'<span class="gcal-badge">GCAL</span>':''}
            </div>`).join('')
          : `<p class="no-event">No plans — free &amp; fabulous</p>`
        }
        ${gcalConn
          ? `<span class="gcal-connected-badge">📅 Google Calendar connected</span>`
          : `<button class="btn btn-ghost" style="margin-top:12px;font-size:12px" onclick="handleConnectGcal()">📅 Connect Google Calendar</button>`
        }
      </div>

      <!-- Weather -->
      <div class="context-card">
        <span class="eyebrow">Weather</span>
        <div class="weather-row">
          <span class="weather-icon">${weather.icon}</span>
          <div>
            <p class="weather-temp">${weather.temp}°C</p>
            <p class="weather-desc">${weather.desc}</p>
            <p class="weather-meta">${weather.humidity}% humidity · ${weather.wind}km/h wind</p>
          </div>
          <button class="weather-change" onclick="toggleWeatherPicker()">${showWPicker?'✕ Close':'Change'}</button>
        </div>
        ${showWPicker ? `
        <div class="weather-picker">
          ${WEATHERS.map((w,i)=>`
          <button class="weather-opt${weather.desc===w.desc?' active':''}" onclick="pickWeather(${i})">
            ${w.icon} ${w.desc} · ${w.temp}°C
          </button>`).join('')}
        </div>` : ''}
      </div>
    </div>
  </div>

  <!-- Outfit Builder -->
  <div class="outfit-section fade-up fade-up-1">
    <div class="outfit-section-hdr">
      <div>
        <span class="eyebrow">Today's Look</span>
        <h2 class="section-title">Your outfit for <em>${occasion}</em></h2>
      </div>
      <button class="btn btn-ghost" onclick="generateOutfit()">✦ Shuffle</button>
    </div>

    ${items.length === 0 ? `
      <div class="empty-state">
        <span class="empty-icon">✿</span>
        <p>Your closet is empty — <a href="add.html" class="btn btn-primary" style="font-size:13px">Add your first item</a></p>
      </div>` : `
    <div class="outfit-builder">
      <div class="slots-grid">
        ${activeSlots.map(slot => {
          const item = outfit[slot.key];
          const pool = getPool(slot);
          const imgHtml = item.image
            ? `<img src="${item.image}" alt="${item.name}">`
            : `<span class="slot-emoji">${slot.icon}</span>`;
          return `
          <div class="outfit-slot">
            <span class="eyebrow">${slot.label}</span>
            <div class="slot-card">
              <button class="slot-arrow" onclick="cycleSlot('${slot.key}',-1)" ${pool.length<2?'disabled':''}>‹</button>
              <div class="slot-item-wrap">
                <div class="slot-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}99)">${imgHtml}</div>
                <div class="slot-info">
                  <p class="slot-name">${item.name}</p>
                  <p class="slot-brand">${item.brand}</p>
                </div>
              </div>
              <button class="slot-arrow" onclick="cycleSlot('${slot.key}',1)" ${pool.length<2?'disabled':''}>›</button>
            </div>
            ${pool.length > 1 ? `<p class="slot-count">${pool.length} OPTIONS</p>` : ''}
          </div>`;
        }).join('')}
      </div>

      <!-- Summary -->
      <div class="summary-card">
        <span class="eyebrow">Outfit Summary</span>
        <div class="summary-rows">
          ${activeSlots.map(slot => {
            const item = outfit[slot.key];
            return `
            <div class="summary-row">
              <span class="summary-icon">${slot.icon}</span>
              <div class="summary-text">
                <span class="summary-item-name">${item.name}</span>
                <span class="summary-item-brand">${item.brand}</span>
              </div>
              <span class="summary-cost">£${item.cost}</span>
            </div>`;
          }).join('')}
        </div>
        <div class="summary-divider"></div>
        <div class="summary-total">
          <span>Total value</span>
          <span class="summary-total-val">£${totalCost}</span>
        </div>
        ${logged
          ? `<div class="logged-msg">✦ OUTFIT LOGGED — YOU LOOK AMAZING ✦</div>`
          : `<button class="btn btn-primary log-btn" onclick="logWearToday()">✦ I'm wearing this today</button>`
        }
      </div>
    </div>`}
  </div>`;
}

function toggleWeatherPicker() { showWPicker = !showWPicker; renderMain(); }
function pickWeather(i) { weather = WEATHERS[i]; showWPicker = false; generateOutfit(); }

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('index.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
generateOutfit();
