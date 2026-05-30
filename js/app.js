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

// ─── SAMPLE IMAGES (Unsplash — free to use) ───
const SAMPLE_IMAGES = {
  tops:        'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80',
  bottoms:     'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&q=80',
  skirts:      'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&q=80',
  dresses:     'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80',
  outerwear:   'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&q=80',
  shoes:       'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  bags:        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80',
  accessories: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=400&q=80',
};

const SEED_ITEMS = [
  { id:'s1', name:'Silk Slip Dress',        brand:'Reformation',     cost:220, category:'dresses',     subcategory:'slip dress',         aesthetics:['soft glam','clean girl'],     occasions:['date night','going out'],         color:'#f9c6d8', wears:7,  image: SAMPLE_IMAGES.dresses,     addedAt: Date.now()-86400000*10, sample:true },
  { id:'s2', name:'Tailored Linen Blazer',  brand:'Zara',            cost:95,  category:'outerwear',   subcategory:'blazer',             aesthetics:['quiet luxury','old money'],   occasions:['office wear','brunch'],           color:'#e8d5c4', wears:14, image: SAMPLE_IMAGES.outerwear,   addedAt: Date.now()-86400000*20, sample:true },
  { id:'s3', name:'Pleated Midi Skirt',     brand:'ASOS',            cost:42,  category:'skirts',      subcategory:'pleated midi',       aesthetics:['Y2K','ballet core'],          occasions:['going out','brunch'],             color:'#d4c8e8', wears:5,  image: SAMPLE_IMAGES.skirts,      addedAt: Date.now()-86400000*5,  sample:true },
  { id:'s4', name:'Statement Earrings',     brand:'Mejuri',          cost:78,  category:'accessories', subcategory:'statement earrings', aesthetics:['soft glam','quiet luxury'],   occasions:['office wear','date night'],       color:'#f0e6c8', wears:22, image: SAMPLE_IMAGES.accessories, addedAt: Date.now()-86400000*30, sample:true },
  { id:'s5', name:'Wide Leg Trousers',      brand:'COS',             cost:115, category:'bottoms',     subcategory:'wide leg trousers',  aesthetics:['minimalist','old money'],     occasions:['office wear','business formal'],  color:'#c8d8e8', wears:18, image: SAMPLE_IMAGES.bottoms,     addedAt: Date.now()-86400000*15, sample:true },
  { id:'s6', name:'Strappy Kitten Heels',   brand:'Steve Madden',    cost:88,  category:'shoes',       subcategory:'kitten heels',       aesthetics:['ballet core','soft glam'],    occasions:['going out','date night'],         color:'#f4d4c0', wears:6,  image: SAMPLE_IMAGES.shoes,       addedAt: Date.now()-86400000*8,  sample:true },
  { id:'s7', name:'Ribbed Knit Top',        brand:'Mango',           cost:38,  category:'tops',        subcategory:'knit top',           aesthetics:['clean girl','minimalist'],    occasions:['casual everyday','brunch'],       color:'#f0c4d4', wears:11, image: SAMPLE_IMAGES.tops,        addedAt: Date.now()-86400000*12, sample:true },
  { id:'s8', name:'Mini Leather Crossbody', brand:'Charles & Keith', cost:58,  category:'bags',        subcategory:'crossbody bag',      aesthetics:['quiet luxury','minimalist'],  occasions:['casual everyday','going out'],    color:'#e8c8b8', wears:30, image: SAMPLE_IMAGES.bags,        addedAt: Date.now()-86400000*25, sample:true },
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

// ─── NAVBAR SCROLL ───
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

// ─── RENDER FOOTER (slim) ───
function renderFooter() {
  return `
  <footer class="footer">
    <p>Virtual Closet by Suki Samara &nbsp;·&nbsp; Est. 2026</p>
  </footer>`;
}

// ─── INIT ───
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initHamburger();
});
