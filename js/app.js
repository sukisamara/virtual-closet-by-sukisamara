// ─── SUKI SAMARA VIRTUAL CLOSET — SHARED DATA & UTILS ───

const AESTHETICS = [
  'soft glam','clean girl','old money','quiet luxury','cottage core',
  'dark academia','Y2K','coastal grandmother','mob wife','minimalist',
  'boho chic','preppy','streetwear','hard rock','ballet core','mermaid core'
];

const OCCASIONS = [
  'going out','office wear','business formal','casual everyday',
  'brunch','date night','gym & active','travel','beach & holiday',
  'wedding guest','festival','cosy at home'
];

const CATEGORIES = [
  { id:'tops',        label:'Tops',        icon:'👚', sub:['blouse','t-shirt','tank top','corset','shirt','knit','bustier','crop top'] },
  { id:'bottoms',     label:'Bottoms',     icon:'👖', sub:['trousers','jeans','shorts','leggings','cargo pants','wide leg'] },
  { id:'skirts',      label:'Skirts',      icon:'🩷', sub:['mini skirt','midi skirt','maxi skirt','pleated','wrap skirt','denim skirt'] },
  { id:'dresses',     label:'Dresses',     icon:'👗', sub:['mini dress','midi dress','maxi dress','slip dress','wrap dress','bodycon','co-ord'] },
  { id:'outerwear',   label:'Outerwear',   icon:'🧥', sub:['blazer','coat','jacket','trench','puffer','cardigan','leather jacket'] },
  { id:'shoes',       label:'Shoes',       icon:'👠', sub:['heels','flats','boots','sneakers','sandals','loafers','mules','mary janes'] },
  { id:'bags',        label:'Bags',        icon:'👜', sub:['handbag','tote','clutch','crossbody','shoulder bag','mini bag','backpack'] },
  { id:'accessories', label:'Accessories', icon:'✨', sub:['jewellery','belt','scarf','hat','sunglasses','hair accessories','gloves'] },
  { id:'swimwear',    label:'Swimwear',    icon:'👙', sub:['bikini top','bikini bottom','swimsuit','coverup','sarong'] },
  { id:'activewear',  label:'Activewear',  icon:'🏃', sub:['sports bra','leggings','set','tank','shorts'] },
];

const CAT_ICONS = { tops:'👚',bottoms:'👖',skirts:'🩷',dresses:'👗',outerwear:'🧥',shoes:'👠',bags:'👜',accessories:'✨',swimwear:'👙',activewear:'🏃' };

const PALETTE = ['#f9c6d8','#e8d5c4','#d4c8e8','#c8d8e8','#c8e8d4','#f0e6c8','#f4d4c0','#e8c8c8','#fce4d6','#e4d6fc'];

const SEED_ITEMS = [
  { id:'s1', name:'Silk Slip Dress',       brand:'Reformation',    cost:220, category:'dresses',     subcategory:'slip dress',   aesthetics:['soft glam','clean girl'],      occasions:['date night','going out'],        color:'#f9c6d8', wears:7,  image:null, addedAt: Date.now()-86400000*10 },
  { id:'s2', name:'Tailored Linen Blazer', brand:'Zara',           cost:95,  category:'outerwear',   subcategory:'blazer',       aesthetics:['quiet luxury','old money'],    occasions:['office wear','brunch'],          color:'#e8d5c4', wears:14, image:null, addedAt: Date.now()-86400000*20 },
  { id:'s3', name:'Pleated Micro Skirt',   brand:'ASOS',           cost:42,  category:'skirts',      subcategory:'mini skirt',   aesthetics:['Y2K','ballet core'],           occasions:['going out','brunch'],            color:'#d4c8e8', wears:5,  image:null, addedAt: Date.now()-86400000*5  },
  { id:'s4', name:'Pearl Drop Earrings',   brand:'Mejuri',         cost:78,  category:'accessories', subcategory:'jewellery',    aesthetics:['soft glam','quiet luxury'],    occasions:['office wear','date night'],      color:'#f0e6c8', wears:22, image:null, addedAt: Date.now()-86400000*30 },
  { id:'s5', name:'Wide Leg Trousers',     brand:'COS',            cost:115, category:'bottoms',     subcategory:'wide leg',     aesthetics:['minimalist','old money'],      occasions:['office wear','business formal'], color:'#c8d8e8', wears:18, image:null, addedAt: Date.now()-86400000*15 },
  { id:'s6', name:'Strappy Kitten Heels',  brand:'Steve Madden',   cost:88,  category:'shoes',       subcategory:'heels',        aesthetics:['ballet core','soft glam'],     occasions:['going out','date night'],        color:'#f4d4c0', wears:6,  image:null, addedAt: Date.now()-86400000*8  },
  { id:'s7', name:'Ribbed Knit Top',       brand:'Mango',          cost:38,  category:'tops',        subcategory:'knit',         aesthetics:['clean girl','minimalist'],     occasions:['casual everyday','brunch'],      color:'#f0c4d4', wears:11, image:null, addedAt: Date.now()-86400000*12 },
  { id:'s8', name:'Mini Leather Crossbody',brand:'Charles & Keith', cost:58,  category:'bags',       subcategory:'crossbody',    aesthetics:['quiet luxury','minimalist'],   occasions:['casual everyday','going out'],    color:'#e8c8b8', wears:30, image:null, addedAt: Date.now()-86400000*25 },
];

// ─── STORAGE ───
function getItems()    { try { return JSON.parse(localStorage.getItem('sc-items')||'null') || SEED_ITEMS; } catch { return SEED_ITEMS; } }
function saveItems(items) { localStorage.setItem('sc-items', JSON.stringify(items)); }
function getWearLog()  { try { return JSON.parse(localStorage.getItem('sc-wearlog')||'[]'); } catch { return []; } }
function saveWearLog(log) { localStorage.setItem('sc-wearlog', JSON.stringify(log)); }
function getEvents()   { try { return JSON.parse(localStorage.getItem('sc-events')||'[]'); } catch { return []; } }
function saveEvents(e) { localStorage.setItem('sc-events', JSON.stringify(e)); }
function getGcal()     { return localStorage.getItem('sc-gcal') === 'true'; }
function setGcal()     { localStorage.setItem('sc-gcal','true'); }

// ─── CALCULATIONS ───
function getCPW(item)  { if (!item.wears) return item.cost.toFixed(2); return (item.cost/item.wears).toFixed(2); }

function getFavoriteItem(items, wearLog) {
  if (!items.length) return null;
  const now = new Date(), monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthLog = wearLog.filter(w => new Date(w.date).getTime() >= monthStart);
  const counts = {};
  monthLog.forEach(w => w.itemIds.forEach(id => { counts[id] = (counts[id]||0)+1; }));
  if (!Object.keys(counts).length) return items.reduce((m,i) => i.wears > m.wears ? i : m, items[0]);
  const topId = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  return items.find(i => i.id === topId) || items[0];
}

function getAestheticStats(items, wearLog) {
  const counts = {};
  wearLog.forEach(log => {
    log.itemIds.forEach(id => {
      const item = items.find(i => i.id === id);
      if (item) item.aesthetics.forEach(a => { counts[a] = (counts[a]||0)+1; });
    });
  });
  if (!Object.keys(counts).length) {
    items.forEach(item => item.aesthetics.forEach(a => { counts[a] = (counts[a]||0)+item.wears; }));
  }
  return Object.entries(counts).map(([name,value])=>({name,value})).sort((a,b)=>b.value-a.value);
}

// ─── NAVBAR ACTIVE STATE ───
function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html') || (path === 'index.html' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ─── SCROLL NAVBAR ───
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 20); });
}

// ─── HAMBURGER ───
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => links.classList.remove('open')));
}

// ─── MOCK WEATHER ───
const WEATHERS = [
  { temp:24, condition:'sunny',  desc:'Clear & sunny',   icon:'☀️',  humidity:55, wind:12 },
  { temp:18, condition:'cloudy', desc:'Partly cloudy',   icon:'⛅',  humidity:68, wind:18 },
  { temp:14, condition:'rainy',  desc:'Light rain',      icon:'🌧️', humidity:82, wind:22 },
  { temp:28, condition:'hot',    desc:'Hot & bright',    icon:'🌞',  humidity:45, wind:8  },
  { temp:10, condition:'cold',   desc:'Cold & breezy',   icon:'🌬️', humidity:72, wind:35 },
];

function getMockWeather() {
  const h = new Date().getHours();
  return WEATHERS[Math.floor(h/5) % WEATHERS.length];
}

// ─── CONNECT GCAL (mock) ───
function connectGcal() {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const demoEvents = [
    { id:'gc1', title:'Team Standup',         date:fmt(today),                            type:'office wear',    source:'google' },
    { id:'gc2', title:"Mia's Birthday Dinner",date:fmt(new Date(Date.now()+86400000)),    type:'going out',      source:'google' },
    { id:'gc3', title:'Pilates Class',         date:fmt(new Date(Date.now()+172800000)),   type:'gym & active',   source:'google' },
    { id:'gc4', title:'Client Presentation',  date:fmt(new Date(Date.now()+259200000)),   type:'business formal',source:'google' },
  ];
  const events = getEvents().filter(e => e.source !== 'google');
  saveEvents([...events, ...demoEvents]);
  setGcal();
  return demoEvents;
}

// ─── RENDER NAVBAR ───
function renderNavbar(activePage) {
  const pages = [
    { href:'index.html',     label:'Today',     glyph:'✦' },
    { href:'closet.html',    label:'My Closet', glyph:'✿' },
    { href:'add.html',       label:'Add Item',  glyph:'+' },
    { href:'calendar.html',  label:'Calendar',  glyph:'◈' },
    { href:'analytics.html', label:'Analytics', glyph:'◉' },
  ];
  return `
  <nav class="navbar" id="navbar">
    <div class="nav-inner">
      <a href="index.html" class="nav-logo">
        <span class="nav-logo-star">✦</span>
        <div class="nav-logo-text">
          <span class="nav-logo-main">Virtual Closet</span>
          <span class="nav-logo-sub">by Suki Samara</span>
        </div>
      </a>
      <div class="nav-links" id="navLinks">
        ${pages.map(p=>`<a href="${p.href}" class="nav-link${p.href===activePage?' active':''}"><span class="glyph">${p.glyph}</span>${p.label}</a>`).join('')}
      </div>
      <button class="hamburger" id="hamburger" aria-label="Menu">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;
}

// ─── RENDER FOOTER ───
function renderFooter() {
  return `
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-deco">✦ ✿ ✦ ✿ ✦ ✿ ✦ ✿ ✦</div>
      <div class="footer-brand">SUKI SAMARA</div>
      <p class="footer-tagline">Virtual Closet — dress like the main character</p>
      <div class="footer-sub"><span>BRIGHT RETRO</span><span>·</span><span>AC REAL ADULT</span><span>·</span><span>EST. 2025</span></div>
      <p class="footer-copy">© 2025 Suki Samara · All rights reserved · Made with ✦</p>
    </div>
  </footer>`;
}

// ─── RENDER CLOTHING CARD ───
function renderClothingCard(item, opts={}) {
  const cpw = getCPW(item);
  const icon = CAT_ICONS[item.category] || '✨';
  const imgHtml = item.image
    ? `<img src="${item.image}" alt="${item.name}" />`
    : `<span class="card-emoji">${icon}</span>`;

  return `
  <div class="clothing-card${opts.selected?' selected':''}" data-id="${item.id}" onclick="${opts.onclick||''}">
    <div class="card-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}99)">
      ${imgHtml}
      <span class="card-cpw">£${cpw}/wear</span>
    </div>
    <div class="card-body">
      <div class="card-top-row">
        <h4 class="card-name">${item.name}</h4>
        <span class="card-wears">${item.wears}×</span>
      </div>
      <p class="card-brand">${item.brand}</p>
      <p class="card-cost">£${item.cost}</p>
      <div class="card-tags">
        ${item.aesthetics.slice(0,2).map(a=>`<span class="pill">${a}</span>`).join('')}
      </div>
    </div>
  </div>`;
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
});
