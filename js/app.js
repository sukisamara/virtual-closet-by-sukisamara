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
  { id:'tops',        label:'Tops',        sub:['blouse','button-down shirt','corset top','crop top','fitted tank','graphic tee','knit top','linen shirt','off-shoulder','polo shirt','strapless top','tube top'] },
  { id:'bottoms',     label:'Bottoms',     sub:['barrel jeans','bootcut jeans','cargo pants','flare pants','high-waist jeans','linen trousers','loose trousers','mom jeans','relaxed shorts','skinny jeans','straight jeans','tailored trousers','wide leg trousers'] },
  { id:'skirts',      label:'Skirts',      sub:['asymmetric skirt','denim mini','flippy skirt','floral midi','knit mini','maxi skirt','pencil skirt','pleated midi','pleated mini','satin midi','wrap skirt'] },
  { id:'dresses',     label:'Dresses',     sub:['asymmetric dress','bodycon dress','co-ord set','linen dress','maxi dress','midi wrap dress','mini dress','shirt dress','slip dress','smock dress','strapless dress','sundress'] },
  { id:'outerwear',   label:'Outerwear',   sub:['biker jacket','blazer','bouclé jacket','chunky cardigan','denim jacket','faux fur coat','leather jacket','long trench','oversized blazer','puffer jacket','shacket','varsity jacket','wool coat'] },
  { id:'shoes',       label:'Shoes',       sub:['ankle boots','ballet flats','block heels','chunky sneakers','cowboy boots','dad sneakers','kitten heels','loafers','mary janes','mule heels','platform boots','pointed flats','sandal heels','slingbacks','sneakers','strappy sandals','thong sandals','ugg boots'] },
  { id:'bags',        label:'Bags',        sub:['baguette bag','belt bag','bucket bag','canvas tote','chain shoulder bag','clutch','crossbody bag','doctor bag','hobo bag','mini bag','oversized tote','quilted bag','shoulder bag','structured handbag','woven bag'] },
  { id:'accessories', label:'Accessories', sub:['baseball cap','belt','beret','bracelet stack','bucket hat','chain necklace','chunky rings','hair claw','hair scarf','hoop earrings','layered necklace','pearl earrings','pearl necklace','scrunchie','silk scarf','statement earrings','sunglasses','tights'] },
  { id:'swimwear',    label:'Swimwear',    sub:['bikini set','boardshorts','cover-up dress','longline bikini top','one-piece swimsuit','sarong','string bikini','tie-side bottoms','triangle bikini top'] },
  { id:'activewear',  label:'Activewear', sub:['biker shorts','cropped hoodie','cycling leggings','flare leggings','gym shorts','matching set','oversized gym tee','sports bra','tennis skirt','training jacket','yoga leggings'] },
];

const PALETTE = ['#f9c6d8','#e8d5c4','#d4c8e8','#c8d8e8','#c8e8d4','#f0e6c8','#f4d4c0','#e8c8c8','#fce4d6','#e4d6fc'];

// ─── REAL SEED ITEMS — your actual wardrobe ───
const SEED_ITEMS = [
  // ── BAGS ──
  {
    id:'bag1', name:'Cassette Intrecciato Shoulder Bag', brand:'Bottega Veneta',
    cost:4312, category:'bags', subcategory:'crossbody bag',
    aesthetics:['quiet luxury','old money','mob wife'],
    occasions:['going out','date night','wedding guest','business formal'],
    color:'#c8a882', wears:0, image:'assets/items/bag1.png', addedAt:Date.now()-86400000*30, sample:true
  },
  {
    id:'bag2', name:'Calla Woven Tote Bag', brand:'Charles & Keith',
    cost:115, category:'bags', subcategory:'woven bag',
    aesthetics:['boho chic','coastal grandmother','cottage core'],
    occasions:['casual everyday','brunch','beach & holiday','travel'],
    color:'#b8845a', wears:0, image:'assets/items/bag2.png', addedAt:Date.now()-86400000*25, sample:true
  },
  {
    id:'bag3', name:'Floral Beaded Shoulder Bag', brand:'ASOS Design',
    cost:77.99, category:'bags', subcategory:'shoulder bag',
    aesthetics:['Y2K','soft glam','mermaid core'],
    occasions:['going out','date night','festival','brunch'],
    color:'#f0ecc0', wears:0, image:'assets/items/bag3.png', addedAt:Date.now()-86400000*20, sample:true
  },
  {
    id:'bag4', name:'Ruched Pocket Tote Bag in Mono Gingham', brand:'ASOS Design',
    cost:44.99, category:'bags', subcategory:'canvas tote',
    aesthetics:['cottage core','preppy','clean girl'],
    occasions:['casual everyday','travel','brunch','festival'],
    color:'#c8c0b0', wears:0, image:'assets/items/bag4.png', addedAt:Date.now()-86400000*18, sample:true
  },
  {
    id:'bag5', name:'Woven Carry All Bag', brand:'Calvin Klein',
    cost:359.49, category:'bags', subcategory:'structured handbag',
    aesthetics:['minimalist','quiet luxury','old money'],
    occasions:['office wear','business formal','casual everyday'],
    color:'#1a1a1a', wears:0, image:'assets/items/bag5.png', addedAt:Date.now()-86400000*15, sample:true
  },
  {
    id:'bag6', name:'Levy Nylon Tote Bag', brand:'Charles & Keith',
    cost:89.90, category:'bags', subcategory:'oversized tote',
    aesthetics:['minimalist','clean girl','old money'],
    occasions:['office wear','casual everyday','travel'],
    color:'#222222', wears:0, image:'assets/items/bag6.png', addedAt:Date.now()-86400000*12, sample:true
  },
  {
    id:'bag7', name:'Small Split Leather Bag', brand:'Mango',
    cost:119.90, category:'bags', subcategory:'hobo bag',
    aesthetics:['mob wife','mermaid core','Y2K','soft glam'],
    occasions:['going out','date night','festival'],
    color:'#1a5fcc', wears:0, image:'assets/items/bag7.png', addedAt:Date.now()-86400000*10, sample:true
  },
  {
    id:'bag8', name:'ALEX Tote II', brand:'Rabeanco',
    cost:410.00, category:'bags', subcategory:'structured handbag',
    aesthetics:['quiet luxury','minimalist','dark academia'],
    occasions:['office wear','business formal','casual everyday','date night'],
    color:'#1c1c1c', wears:0, image:'assets/items/bag8.png', addedAt:Date.now()-86400000*8, sample:true
  },

  // ── DRESSES ──
  {
    id:'dress1', name:'ZW Collection Jacquard Lace Dress', brand:'Zara',
    cost:109.00, category:'dresses', subcategory:'slip dress',
    aesthetics:['soft glam','cottage core','ballet core'],
    occasions:['date night','going out','brunch','wedding guest'],
    color:'#b8d4b0', wears:0, image:'assets/items/dress1.png', addedAt:Date.now()-86400000*28, sample:true
  },
  {
    id:'dress2', name:'Flared Cotton Dress', brand:'Mango',
    cost:75.90, category:'dresses', subcategory:'sundress',
    aesthetics:['clean girl','minimalist','coastal grandmother'],
    occasions:['casual everyday','brunch','beach & holiday','travel'],
    color:'#f5e878', wears:0, image:'assets/items/dress2.png', addedAt:Date.now()-86400000*24, sample:true
  },
  {
    id:'dress3', name:'Beaded Camisole Dress', brand:'Zara',
    cost:89.90, category:'dresses', subcategory:'mini dress',
    aesthetics:['soft glam','Y2K','mermaid core'],
    occasions:['going out','date night','festival','wedding guest'],
    color:'#f0ece0', wears:0, image:'assets/items/dress3.png', addedAt:Date.now()-86400000*22, sample:true
  },
  {
    id:'dress4', name:'Combined Strap Midi Dress', brand:'Massimo Dutti',
    cost:199.00, category:'dresses', subcategory:'midi wrap dress',
    aesthetics:['minimalist','old money','quiet luxury'],
    occasions:['office wear','date night','business formal','casual everyday'],
    color:'#1c1c1c', wears:0, image:'assets/items/dress4.png', addedAt:Date.now()-86400000*20, sample:true
  },
  {
    id:'dress5', name:'Short Checked Bodice Dress', brand:'Stradivarius',
    cost:29.99, category:'dresses', subcategory:'mini dress',
    aesthetics:['preppy','cottage core','Y2K'],
    occasions:['casual everyday','brunch','date night','festival'],
    color:'#c8a8a0', wears:0, image:'assets/items/dress5.png', addedAt:Date.now()-86400000*16, sample:true
  },
  {
    id:'dress6', name:'Denim Midi Dress', brand:'Massimo Dutti',
    cost:245.00, category:'dresses', subcategory:'midi wrap dress',
    aesthetics:['old money','quiet luxury','clean girl'],
    occasions:['casual everyday','brunch','date night','travel'],
    color:'#2c3e60', wears:0, image:'assets/items/dress6.png', addedAt:Date.now()-86400000*14, sample:true
  },
  {
    id:'dress7', name:'Halter Dress with Buttons', brand:'Bershka',
    cost:75.90, category:'dresses', subcategory:'mini dress',
    aesthetics:['soft glam','ballet core','Y2K'],
    occasions:['going out','date night','festival','brunch'],
    color:'#f4c8c0', wears:0, image:'assets/items/dress7.png', addedAt:Date.now()-86400000*10, sample:true
  },
  {
    id:'dress8', name:'Polka Dot Short Qipao Dress', brand:'Stradivarius',
    cost:25.99, category:'dresses', subcategory:'mini dress',
    aesthetics:['preppy','Y2K','cottage core'],
    occasions:['casual everyday','brunch','date night'],
    color:'#f0f0f0', wears:0, image:'assets/items/dress8.png', addedAt:Date.now()-86400000*8, sample:true
  },
  {
    id:'dress9', name:'Halter Paisley Dress', brand:'Mango',
    cost:99.90, category:'dresses', subcategory:'sundress',
    aesthetics:['boho chic','mermaid core','coastal grandmother'],
    occasions:['beach & holiday','festival','brunch','casual everyday'],
    color:'#f07820', wears:0, image:'assets/items/dress9.png', addedAt:Date.now()-86400000*5, sample:true
  },
  {
    id:'dress10', name:'ZW Collection Printed Slip Dress', brand:'Zara',
    cost:119.00, category:'dresses', subcategory:'slip dress',
    aesthetics:['soft glam','old money','boho chic'],
    occasions:['date night','going out','brunch','wedding guest'],
    color:'#e8c8c0', wears:0, image:'assets/items/dress10.png', addedAt:Date.now()-86400000*3, sample:true
  },
];

// ─── STORAGE ───
function getItems()       { try { return JSON.parse(localStorage.getItem('sc-items')||'null') || SEED_ITEMS; } catch { return SEED_ITEMS; } }
function saveItems(items) { localStorage.setItem('sc-items', JSON.stringify(items)); }
function getWearLog()     { try { return JSON.parse(localStorage.getItem('sc-wearlog')||'[]'); } catch { return []; } }
function saveWearLog(log) { localStorage.setItem('sc-wearlog', JSON.stringify(log)); }
function getEvents()      { try { return JSON.parse(localStorage.getItem('sc-events')||'[]'); } catch { return []; } }
function saveEvents(e)    { localStorage.setItem('sc-events', JSON.stringify(e)); }
function getGcal()        { return localStorage.getItem('sc-gcal') === 'true'; }
function setGcal()        { localStorage.setItem('sc-gcal','true'); }

// ─── CALCULATIONS ───
function getCPW(item) { if (!item.wears) return item.cost.toFixed(2); return (item.cost/item.wears).toFixed(2); }

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

// ─── NAVBAR ───
function initNavScroll() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => { nav.classList.toggle('scrolled', window.scrollY > 20); });
}
function initHamburger() {
  const btn = document.querySelector('.hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => links.classList.toggle('open'));
  links.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => links.classList.remove('open')));
}

// ─── WEATHER ───
const WEATHERS = [
  { temp:24, condition:'sunny',  desc:'Clear & sunny',  icon:'☀️',  humidity:55, wind:12 },
  { temp:18, condition:'cloudy', desc:'Partly cloudy',  icon:'⛅',  humidity:68, wind:18 },
  { temp:14, condition:'rainy',  desc:'Light rain',     icon:'🌧️', humidity:82, wind:22 },
  { temp:28, condition:'hot',    desc:'Hot & bright',   icon:'🌞',  humidity:45, wind:8  },
  { temp:10, condition:'cold',   desc:'Cold & breezy',  icon:'🌬️', humidity:72, wind:35 },
];
function getMockWeather() { return WEATHERS[Math.floor(new Date().getHours()/5) % WEATHERS.length]; }

// ─── GCAL ───
function connectGcal() {
  const today = new Date();
  const fmt = d => d.toISOString().split('T')[0];
  const demoEvents = [
    { id:'gc1', title:'Team Standup',          date:fmt(today),                           type:'office wear',    source:'google' },
    { id:'gc2', title:"Mia's Birthday Dinner", date:fmt(new Date(Date.now()+86400000)),   type:'going out',      source:'google' },
    { id:'gc3', title:'Pilates Class',          date:fmt(new Date(Date.now()+172800000)),  type:'gym & active',   source:'google' },
    { id:'gc4', title:'Client Presentation',   date:fmt(new Date(Date.now()+259200000)),  type:'business formal',source:'google' },
  ];
  const events = getEvents().filter(e => e.source !== 'google');
  saveEvents([...events, ...demoEvents]);
  setGcal();
  return demoEvents;
}

// ─── NAVBAR HTML ───
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
      <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
    </div>
  </nav>`;
}

// ─── FOOTER ───
function renderFooter() {
  return `<footer class="footer"><p>Virtual Closet by Suki Samara &nbsp;·&nbsp; Est. 2026</p></footer>`;
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
});

// ─── VERSION / SEED RESET ───
// If the stored data has old sample items (no real photos), clear it so new seed loads
(function() {
  try {
    const stored = JSON.parse(localStorage.getItem('sc-items') || 'null');
    if (stored) {
      const hasOldSeed = stored.some(i => i.id && i.id.startsWith('s') && !i.id.startsWith('bag') && !i.id.startsWith('dress'));
      if (hasOldSeed) {
        localStorage.removeItem('sc-items');
        localStorage.removeItem('sc-wearlog');
      }
    }
  } catch(e) {}
})();
