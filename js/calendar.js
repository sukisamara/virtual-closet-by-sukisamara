// CALENDAR.JS

const MONTHS_FULL = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT  = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const EVT_TYPES   = ['going out','office wear','business formal','casual everyday','brunch','date night','gym & active','travel','beach & holiday','wedding guest','festival','cosy at home'];

let events   = getEvents();
let wearLog  = getWearLog();
let gcalConn = getGcal();

let cur      = new Date();
let selected = null;
let addingEvt= false;
let newEvt   = { title:'', type:'casual everyday' };

const todayStr = new Date().toISOString().split('T')[0];

function fmt(yr,mo,d) { return `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function eventsOn(yr,mo,d) { return events.filter(e => e.date === fmt(yr,mo,d)); }
function wearsOn(yr,mo,d)  { return wearLog.filter(w => w.date === fmt(yr,mo,d)); }

function prevMo() { cur = new Date(cur.getFullYear(), cur.getMonth()-1); render(); }
function nextMo() { cur = new Date(cur.getFullYear(), cur.getMonth()+1); render(); }

function selectDay(d) { selected = selected===d ? null : d; addingEvt=false; render(); }

function toggleAddEvt() { addingEvt=!addingEvt; render(); }

function setNewEvtTitle(v) { newEvt.title=v; }
function setNewEvtType(v)  { newEvt.type=v; }

function addEvtSubmit() {
  if (!newEvt.title || selected===null) return;
  const yr=cur.getFullYear(),mo=cur.getMonth();
  events.push({ id:'evt-'+Date.now(), title:newEvt.title, type:newEvt.type, date:fmt(yr,mo,selected) });
  saveEvents(events);
  newEvt={title:'',type:'casual everyday'};
  addingEvt=false;
  render();
}

function deleteEvt(id) {
  events = events.filter(e => e.id !== id);
  saveEvents(events);
  render();
}

function handleConnectGcal() {
  connectGcal();
  gcalConn=true;
  events=getEvents();
  render();
}

function render() {
  const yr=cur.getFullYear(), mo=cur.getMonth();
  const firstDay = new Date(yr,mo,1).getDay();
  const daysInMo = new Date(yr,mo+1,0).getDate();

  // Build calendar cells
  let cells = '';
  for (let i=0;i<firstDay;i++) cells += `<div class="cal-cell empty"></div>`;
  for (let d=1;d<=daysInMo;d++) {
    const dateStr = fmt(yr,mo,d);
    const evts  = eventsOn(yr,mo,d);
    const wears = wearsOn(yr,mo,d);
    const isToday = dateStr===todayStr;
    const isSel   = selected===d;
    cells += `
    <div class="cal-cell${isToday?' today':''}${isSel?' selected':''}${evts.length?' has-evt':''}" onclick="selectDay(${d})">
      <span class="day-num">${d}</span>
      <div class="cal-dots">
        ${evts.slice(0,3).map(()=>`<span class="cal-dot evt-dot"></span>`).join('')}
        ${wears.length ? `<span class="cal-dot wear-dot">✦</span>` : ''}
      </div>
    </div>`;
  }

  // Sidebar
  let sidebar = '';
  if (selected===null) {
    sidebar = `<div class="sidebar-ph"><span class="sidebar-ph-icon">◈</span><p>Tap a day to see details</p></div>`;
  } else {
    const dateStr = fmt(yr,mo,selected);
    const isToday = dateStr===todayStr;
    const selEvts  = eventsOn(yr,mo,selected);
    const selWears = wearsOn(yr,mo,selected);
    sidebar = `
    <div class="sidebar-date-hdr">
      <div>
        <p class="sidebar-mo">${MONTHS_FULL[mo].toUpperCase()}</p>
        <p class="sidebar-day">${selected}</p>
      </div>
      ${isToday?`<span class="today-pill">TODAY</span>`:''}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-hdr">
        <span>Events</span>
        <button class="sidebar-add-btn" onclick="toggleAddEvt()">${addingEvt?'✕ Cancel':'+ Add'}</button>
      </div>
      ${addingEvt?`
      <div class="add-evt-form">
        <input class="add-evt-input" placeholder="Event name…" value="${newEvt.title}" oninput="setNewEvtTitle(this.value)" onkeydown="if(event.key==='Enter')addEvtSubmit()" />
        <select class="add-evt-select" onchange="setNewEvtType(this.value)">
          ${EVT_TYPES.map(t=>`<option value="${t}"${newEvt.type===t?' selected':''}>${t}</option>`).join('')}
        </select>
        <button class="btn btn-primary add-evt-submit" onclick="addEvtSubmit()">Add Event</button>
      </div>`:''}
      ${selEvts.length===0&&!addingEvt?`<p class="sidebar-empty">No events planned</p>`:''}
      ${selEvts.map(e=>`
      <div class="evt-item">
        <span class="evt-dot-sm"></span>
        <div class="evt-text">
          <p class="evt-title">${e.title}</p>
          <div class="evt-type-row">
            <span class="pill" style="font-size:9px">${e.type}</span>
            ${e.source==='google'?`<span class="gcal-tag">GCAL</span>`:''}
          </div>
        </div>
        ${e.source!=='google'?`<button class="evt-del" onclick="deleteEvt('${e.id}')">✕</button>`:''}
      </div>`).join('')}
    </div>

    <div class="sidebar-section">
      <div class="sidebar-section-hdr"><span>Outfits Worn</span></div>
      ${selWears.length===0?`<p class="sidebar-empty">No outfits logged</p>`:''}
      ${selWears.map(w=>`<div class="wear-item"><span>✦</span><span>${w.itemIds.length} piece${w.itemIds.length>1?'s':''} worn</span></div>`).join('')}
    </div>`;
  }

  document.getElementById('main').innerHTML = `
  <div class="cal-top fade-up">
    <div>
      <span class="eyebrow">Schedule</span>
      <h1 class="section-title">Calendar</h1>
    </div>
    ${gcalConn
      ? `<span class="gcal-status">📅 Google Calendar connected</span>`
      : `<button class="btn btn-ghost" onclick="handleConnectGcal()" style="font-size:12px">📅 Connect Google Calendar</button>`
    }
  </div>

  <div class="cal-layout">
    <div class="cal-main fade-up fade-up-1">
      <div class="cal-nav">
        <button class="cal-nav-btn" onclick="prevMo()">‹</button>
        <h2 class="cal-month-title">${MONTHS_FULL[mo]} ${yr}</h2>
        <button class="cal-nav-btn" onclick="nextMo()">›</button>
      </div>
      <div class="cal-grid">
        ${DAYS_SHORT.map(d=>`<div class="cal-day-hdr">${d}</div>`).join('')}
        ${cells}
      </div>
      <div class="cal-legend">
        <div class="leg-item"><span class="cal-dot evt-dot"></span> Event</div>
        <div class="leg-item"><span class="cal-dot wear-dot">✦</span> Outfit logged</div>
      </div>
    </div>

    <div class="cal-sidebar fade-up fade-up-2">${sidebar}</div>
  </div>`;
}

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('calendar.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
render();
