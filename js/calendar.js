// CALENDAR.JS

const MONTHS_FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS_SHORT=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const EVT_TYPES=['going out','office wear','business formal','casual everyday','brunch','date night','gym & active','travel','beach & holiday','wedding guest','festival','cosy at home'];

let events=getEvents(), wearLog=getWearLog(), items=getItems(), gcalConn=getGcal();
let cur=new Date(), selected=null, addingEvt=false, newEvt={title:'',type:'casual everyday'};
let uploadingOOTD=false;

const todayStr=new Date().toISOString().split('T')[0];

function fmt(yr,mo,d){ return `${yr}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`; }
function eventsOn(yr,mo,d){ return events.filter(e=>e.date===fmt(yr,mo,d)); }
function wearsOn(yr,mo,d){ return wearLog.filter(w=>w.date===fmt(yr,mo,d)); }
function getOOTD(dateStr){ try{ return JSON.parse(localStorage.getItem('ootd-'+dateStr)||'null'); }catch{return null;} }
function saveOOTD(dateStr,data){ localStorage.setItem('ootd-'+dateStr,JSON.stringify(data)); }

function prevMo(){ cur=new Date(cur.getFullYear(),cur.getMonth()-1); render(); }
function nextMo(){ cur=new Date(cur.getFullYear(),cur.getMonth()+1); render(); }
function selectDay(d){ selected=selected===d?null:d; addingEvt=false; uploadingOOTD=false; render(); }
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

// OOTD photo upload
function handleOOTD(input){
  const file=input.files[0]; if(!file) return;
  const yr=cur.getFullYear(),mo=cur.getMonth();
  const dateStr=fmt(yr,mo,selected);
  const reader=new FileReader();
  reader.onload=e=>{
    saveOOTD(dateStr,{image:e.target.result, uploadedAt:Date.now()});
    uploadingOOTD=false;
    render();
  };
  reader.readAsDataURL(file);
}

function removeOOTD(){
  const yr=cur.getFullYear(),mo=cur.getMonth();
  const dateStr=fmt(yr,mo,selected);
  localStorage.removeItem('ootd-'+dateStr);
  render();
}

// Get outfit worn on a date for display (from wear log → find items)
function getOutfitImagesForDate(dateStr){
  const logs=wearLog.filter(w=>w.date===dateStr);
  if(!logs.length) return [];
  const ids=[...new Set(logs.flatMap(l=>l.itemIds))];
  return ids.map(id=>items.find(i=>i.id===id)).filter(Boolean);
}

function render(){
  const yr=cur.getFullYear(),mo=cur.getMonth();
  const firstDay=new Date(yr,mo,1).getDay();
  const daysInMo=new Date(yr,mo+1,0).getDate();

  let cells='';
  for(let i=0;i<firstDay;i++) cells+=`<div class="cal-cell empty"></div>`;
  for(let d=1;d<=daysInMo;d++){
    const dateStr=fmt(yr,mo,d);
    const evts=eventsOn(yr,mo,d);
    const wears=wearsOn(yr,mo,d);
    const ootd=getOOTD(dateStr);
    const isToday=dateStr===todayStr;
    const isSel=selected===d;
    cells+=`
    <div class="cal-cell${isToday?' today':''}${isSel?' selected':''}${evts.length?' has-evt':''}" onclick="selectDay(${d})">
      <span class="day-num">${d}</span>
      <div class="cal-dots">
        ${evts.slice(0,3).map(()=>`<span class="cal-dot evt-dot"></span>`).join('')}
        ${wears.length||ootd?`<span class="cal-dot wear-dot">✦</span>`:''}
      </div>
      ${ootd?`<div class="cal-ootd-thumb"><img src="${ootd.image}" alt="ootd" /></div>`:''}
    </div>`;
  }

  // Sidebar content
  let sidebar='';
  if(selected===null){
    sidebar=`<div class="sidebar-ph"><span class="sidebar-ph-icon">◈</span><p>Tap a day to see details</p></div>`;
  } else {
    const dateStr=fmt(yr,mo,selected);
    const isToday=dateStr===todayStr;
    const selEvts=eventsOn(yr,mo,selected);
    const selWears=wearsOn(yr,mo,selected);
    const ootd=getOOTD(dateStr);
    const outfitItems=getOutfitImagesForDate(dateStr);

    sidebar=`
    <div class="sidebar-date-hdr">
      <div><p class="sidebar-mo">${MONTHS_FULL[mo].toUpperCase()}</p><p class="sidebar-day">${selected}</p></div>
      ${isToday?`<span class="today-pill">TODAY</span>`:''}
    </div>

    <!-- OOTD Section -->
    <div class="sidebar-section">
      <div class="sidebar-section-hdr"><span>Outfit of the Day</span></div>
      ${ootd
        ? `<div class="ootd-display">
            <img src="${ootd.image}" alt="OOTD" class="ootd-img" />
            <button class="btn btn-ghost" style="font-size:11px;margin-top:8px;width:100%;justify-content:center" onclick="removeOOTD()">✕ Remove photo</button>
          </div>`
        : outfitItems.length
          ? `<div class="ootd-outfit-preview">
              <p class="sidebar-empty" style="margin-bottom:8px">From your logged outfit:</p>
              <div class="ootd-items-row">
                ${outfitItems.slice(0,4).map(item=>`
                <div class="ootd-mini" style="background:linear-gradient(135deg,${item.color}44,${item.color}88)">
                  ${item.image?`<img src="${item.image}" alt="${item.name}" />`:''}
                </div>`).join('')}
              </div>
              <label class="btn btn-ghost" style="font-size:11px;margin-top:8px;width:100%;justify-content:center;cursor:pointer">
                📷 Upload your photo instead
                <input type="file" accept="image/*" hidden onchange="handleOOTD(this)" />
              </label>
            </div>`
          : `<div class="ootd-empty">
              <p class="sidebar-empty">No outfit recorded yet</p>
              <label class="btn btn-primary" style="font-size:11px;margin-top:8px;justify-content:center;cursor:pointer">
                📷 Upload OOTD photo
                <input type="file" accept="image/*" hidden onchange="handleOOTD(this)" />
              </label>
            </div>`
      }
    </div>

    <!-- Events -->
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
          <div class="evt-type-row"><span class="pill" style="font-size:9px">${e.type}</span>${e.source==='google'?`<span class="gcal-tag">GCAL</span>`:''}</div>
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

document.getElementById('navbar-mount').innerHTML=renderNavbar('calendar.html');
document.getElementById('footer-mount').innerHTML=renderFooter();
if (!requireAuth()) throw new Error('not authed');
render();
