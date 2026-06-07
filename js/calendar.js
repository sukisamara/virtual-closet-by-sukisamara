// CALENDAR.JS — visual outfit grid

const MONTHS_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const EVT_TYPES=['going out','office wear','business formal','casual everyday','brunch','date night','gym & active','travel','beach & holiday','wedding guest','festival','cosy at home'];

let events=getEvents(), wearLog=getWearLog(), items=getItems(), gcalConn=getGcal();
let cur=new Date(), selected=null, addingEvt=false, newEvt={title:'',type:'casual everyday'};

const todayStr=new Date().toISOString().split('T')[0];

function fmt(yr,mo,d){ return `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function eventsOn(yr,mo,d){ return events.filter(e=>e.date===fmt(yr,mo,d)); }
function wearsOn(yr,mo,d){ return wearLog.filter(w=>w.date===fmt(yr,mo,d)); }
function getOOTD(dateStr){ try{ return JSON.parse(localStorage.getItem('ootd-'+dateStr)||'null'); }catch{return null;} }
function saveOOTD(dateStr,data){ localStorage.setItem('ootd-'+dateStr,JSON.stringify(data)); }

function getOutfitItemsForDate(dateStr){
  const logs=wearLog.filter(w=>w.date===dateStr);
  if(!logs.length) return [];
  const ids=[...new Set(logs.flatMap(l=>l.itemIds))];
  return ids.map(id=>items.find(i=>i.id===id)).filter(Boolean);
}

function prevMo(){ cur=new Date(cur.getFullYear(),cur.getMonth()-1); render(); }
function nextMo(){ cur=new Date(cur.getFullYear(),cur.getMonth()+1); render(); }
function selectDay(d){ selected=selected===d?null:d; addingEvt=false; render(); }
function toggleAddEvt(){ addingEvt=!addingEvt; render(); }
function setNewEvtTitle(v){ newEvt.title=v; }
function setNewEvtType(v){ newEvt.type=v; }

function addEvtSubmit(){
  if(!newEvt.title||selected===null) return;
  const yr=cur.getFullYear(),mo=cur.getMonth();
  events.push({id:'evt-'+Date.now(),title:newEvt.title,type:newEvt.type,date:fmt(yr,mo,selected)});
  saveEvents(events); newEvt={title:'',type:'casual everyday'}; addingEvt=false; render();
}
function deleteEvt(id){ events=events.filter(e=>e.id!==id); saveEvents(events); render(); }
function handleConnectGcal(){ connectGcal(); gcalConn=true; events=getEvents(); render(); }

function handleOOTD(input){
  const file=input.files[0]; if(!file) return;
  const yr=cur.getFullYear(),mo=cur.getMonth();
  const dateStr=fmt(yr,mo,selected);
  const reader=new FileReader();
  reader.onload=e=>{
    saveOOTD(dateStr,{image:e.target.result,uploadedAt:Date.now()});
    render();
  };
  reader.readAsDataURL(file);
}

function removeOOTD(){
  const yr=cur.getFullYear(),mo=cur.getMonth();
  localStorage.removeItem('ootd-'+fmt(yr,mo,selected));
  render();
}

// ── Build a single calendar cell ──
function renderCell(yr, mo, d) {
  const dateStr  = fmt(yr, mo, d);
  const evts     = eventsOn(yr, mo, d);
  const ootd     = getOOTD(dateStr);
  const outfit   = getOutfitItemsForDate(dateStr);
  const isToday  = dateStr === todayStr;
  const isSel    = selected === d;
  const hasOutfit= outfit.length > 0 || ootd;

  // Build class list
  let cls = 'cal-cell';
  if (isToday)  cls += ' today';
  if (isSel)    cls += ' selected';
  if (evts.length) cls += ' has-evt';
  if (hasOutfit)   cls += ' has-outfit';

  // If OOTD photo exists, show it as a cover with day number overlay
  if (ootd) {
    return `
    <div class="${cls}" onclick="selectDay(${d})" style="position:relative;min-height:90px">
      <div class="cal-ootd-cover">
        <img src="${ootd.image}" alt="OOTD" />
        <div class="cal-ootd-cover-overlay"></div>
      </div>
      <span class="day-num-over">${d}</span>
      ${evts.length ? `<div style="position:absolute;top:5px;right:6px;z-index:2"><span class="evt-indicator"></span></div>` : ''}
    </div>`;
  }

  // Show outfit item images in the cell
  const displayItems = outfit.slice(0, 4);
  const gridClass = displayItems.length === 1 ? 'single'
    : displayItems.length === 3 ? 'triple'
    : '';

  return `
  <div class="${cls}" onclick="selectDay(${d})">
    <div class="cal-cell-top">
      <span class="day-num">${d}</span>
      ${evts.length ? `<span class="evt-indicator"></span>` : ''}
    </div>

    ${displayItems.length > 0 ? `
    <div class="cal-cell-outfit${gridClass?' '+gridClass:''}">
      ${displayItems.map(item=>`
      <div class="cal-outfit-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}70)">
        ${item.image
          ? `<img src="${item.image}" alt="${item.name}" />`
          : `<span style="font-size:14px">✨</span>`
        }
      </div>`).join('')}
    </div>` : `
    <div class="cal-cell-empty-outfit">
      <span>·</span>
    </div>`}
  </div>`;
}

function render() {
  const yr=cur.getFullYear(), mo=cur.getMonth();
  const firstDay=new Date(yr,mo,1).getDay();
  const daysInMo=new Date(yr,mo+1,0).getDate();

  // Calendar cells
  let cells = '';
  for(let i=0;i<firstDay;i++) cells+=`<div class="cal-cell empty"></div>`;
  for(let d=1;d<=daysInMo;d++) cells+=renderCell(yr,mo,d);

  // ── Sidebar ──
  let sidebar = '';
  if(selected===null){
    sidebar=`<div class="sidebar-ph"><span class="sidebar-ph-icon">◈</span><p>Tap a day to see your outfit</p></div>`;
  } else {
    const dateStr=fmt(yr,mo,selected);
    const isToday=dateStr===todayStr;
    const selEvts=eventsOn(yr,mo,selected);
    const ootd=getOOTD(dateStr);
    const outfitItems=getOutfitItemsForDate(dateStr);

    sidebar=`
    <!-- Date header -->
    <div class="sidebar-date-hdr">
      <div>
        <p class="sidebar-mo">${MONTHS_FULL[mo].toUpperCase()}</p>
        <p class="sidebar-day">${selected}</p>
      </div>
      ${isToday?`<span class="today-pill">TODAY</span>`:''}
    </div>

    <!-- OOTD -->
    <div class="sidebar-section">
      <div class="sidebar-section-hdr"><span>Outfit of the Day</span></div>

      ${ootd ? `
      <div class="ootd-photo-display">
        <div class="ootd-photo-large"><img src="${ootd.image}" alt="OOTD" /></div>
        <button class="btn btn-ghost" style="width:100%;justify-content:center;font-size:11px;padding:8px;margin-top:4px" onclick="removeOOTD()">✕ Remove photo</button>
      </div>` :

      outfitItems.length ? `
      <div>
        <p class="sidebar-empty" style="margin-bottom:10px">From your logged outfit:</p>
        <div class="sidebar-outfit-grid">
          ${outfitItems.slice(0,6).map(item=>`
          <div class="sidebar-outfit-item">
            <div class="sidebar-outfit-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}70)">
              ${item.image?`<img src="${item.image}" alt="${item.name}" />`:`<span style="font-size:20px">✨</span>`}
            </div>
            <span class="sidebar-outfit-name">${item.brand}</span>
          </div>`).join('')}
        </div>
        <label class="ootd-upload-label" style="margin-top:8px">
          📸 Upload your photo instead
          <input type="file" accept="image/*" hidden onchange="handleOOTD(this)" />
        </label>
      </div>` : `
      <div>
        <p class="sidebar-empty">No outfit logged</p>
        <label class="ootd-upload-label" style="margin-top:10px">
          📸 Upload OOTD photo
          <input type="file" accept="image/*" hidden onchange="handleOOTD(this)" />
        </label>
      </div>`}
    </div>

    <!-- Events -->
    <div class="sidebar-section">
      <div class="sidebar-section-hdr">
        <span>Events</span>
        <button class="sidebar-add-btn" onclick="toggleAddEvt()">${addingEvt?'✕ Cancel':'+ Add'}</button>
      </div>
      ${addingEvt?`
      <div class="add-evt-form">
        <input class="add-evt-input" placeholder="Event name…" value="${newEvt.title}"
          oninput="setNewEvtTitle(this.value)" onkeydown="if(event.key==='Enter')addEvtSubmit()" />
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
    </div>`;
  }

  document.getElementById('main').innerHTML=`
  <div class="cal-top fade-up">
    <div><span class="eyebrow">Schedule</span><h1 class="section-title">Calendar</h1></div>
    ${gcalConn
      ?`<span class="gcal-status">📅 Google Calendar connected</span>`
      :`<button class="btn btn-ghost" onclick="handleConnectGcal()" style="font-size:12px">📅 Connect Google Calendar</button>`}
  </div>

  <div class="cal-layout">
    <!-- Main calendar -->
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
        <div class="leg-item"><span class="leg-img"></span> Outfit logged</div>
        <div class="leg-item"><span class="evt-indicator" style="display:inline-block;width:8px;height:8px;border-radius:50%;background:var(--pink)"></span> Event</div>
        <div class="leg-item" style="font-style:italic;font-size:11px">Tap any day to expand</div>
      </div>
    </div>

    <!-- Sidebar -->
    <div class="cal-sidebar fade-up fade-up-2">${sidebar}</div>
  </div>`;
}

document.getElementById('navbar-mount').innerHTML=renderNavbar('calendar.html');
document.getElementById('footer-mount').innerHTML=renderFooter();
if (!requireAuth()) throw new Error('not authed');
render();
