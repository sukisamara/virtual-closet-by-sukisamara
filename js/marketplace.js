// MARKETPLACE.JS

let items = getItems();
let activeTab = 'all';
let searchQ = '';
let showListModal = false;
let listingType = 'sell';
let selectedItemId = null;
let listingPrice = '';

// ─── Demo listings (in production these come from Firebase) ───
const DEMO_LISTINGS = [
  { id:'l1', type:'sell', itemId:'dress3', price:45, seller:'Priya M', sellerInitials:'PM', wears:3, listed: Date.now()-86400000*2 },
  { id:'l2', type:'swap', itemId:'bag3',   price:null, seller:'Mei L', sellerInitials:'ML', wears:5, listed: Date.now()-86400000*1 },
  { id:'l3', type:'gift', itemId:'dress5', price:0, seller:'Aisha K', sellerInitials:'AK', wears:8, listed: Date.now()-86400000*3 },
  { id:'l4', type:'sell', itemId:'bag2',   price:65, seller:'Naomi T', sellerInitials:'NT', wears:12, listed: Date.now()-86400000*4 },
  { id:'l5', type:'swap', itemId:'dress9', price:null, seller:'Riya S', sellerInitials:'RS', wears:2, listed: Date.now()-86400000*1 },
  { id:'l6', type:'sell', itemId:'dress6', price:130, seller:'Clara W', sellerInitials:'CW', wears:6, listed: Date.now()-86400000*5 },
];

const DEMO_STORES = [
  { id:'s1', name:'Secondhand Sundays', location:'Tiong Bahru, SG', categories:['vintage','Y2K','minimalist'], featured:true, initial:'S' },
  { id:'s2', name:'The Loop Store', location:'Haji Lane, SG', categories:['boho chic','cottage core'], featured:true, initial:'L' },
  { id:'s3', name:'Worn With Love', location:'Queensway, SG', categories:['quiet luxury','old money'], featured:false, initial:'W' },
  { id:'s4', name:'Circular Studio', location:'Bugis, SG', categories:['minimalist','streetwear'], featured:false, initial:'C' },
];

function getItemById(id) { return items.find(i => i.id === id) || null; }

function filteredListings() {
  return DEMO_LISTINGS.filter(l => {
    if (activeTab !== 'all' && l.type !== activeTab) return false;
    const item = getItemById(l.itemId);
    if (!item) return false;
    if (searchQ && !`${item.name} ${item.brand}`.toLowerCase().includes(searchQ.toLowerCase())) return false;
    return true;
  });
}

function setTab(t) { activeTab = t; render(); }
function setSearch(v) { searchQ = v; render(); }

function openListModal() { showListModal = true; selectedItemId = null; listingPrice = ''; render(); }
function closeListModal() { showListModal = false; render(); }
function setListingType(t) { listingType = t; render(); }
function selectItem(id) { selectedItemId = id; render(); }

function submitListing() {
  if (!selectedItemId) { alert('Please select an item from your wardrobe'); return; }
  // In production: save to Firebase
  alert('✦ Your item has been listed! In the full version this saves to the shared marketplace.');
  closeListModal();
}

function listingTypeLabel(type) {
  if (type === 'sell') return 'Sell';
  if (type === 'swap') return 'Swap';
  if (type === 'gift') return 'Gift';
  if (type === 'borrow') return 'Lend';
  return type;
}

function renderListingCard(listing) {
  const item = getItemById(listing.itemId);
  if (!item) return '';
  const badgeClass = `badge-${listing.type}`;
  const priceHtml = listing.type === 'sell'
    ? `<span class="listing-price">$${listing.price}</span>`
    : listing.type === 'gift'
    ? `<span class="listing-price free">Free ✦</span>`
    : `<span class="listing-price swap-label">Swap ↔</span>`;

  return `
  <div class="listing-card">
    <span class="listing-type-badge ${badgeClass}">${listingTypeLabel(listing.type)}</span>
    <div class="listing-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
      ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:40px">✨</span>`}
    </div>
    <div class="listing-body">
      <p class="listing-wear-tag">Worn ${listing.wears}× · ${item.subcategory || item.category}</p>
      <p class="listing-name">${item.name}</p>
      <p class="listing-brand">${item.brand}</p>
      <div class="listing-bottom">
        ${priceHtml}
        <div class="listing-seller">
          <div class="seller-avatar">${listing.sellerInitials}</div>
          <span class="seller-name">${listing.seller}</span>
        </div>
      </div>
    </div>
  </div>`;
}

function renderListModal() {
  if (!showListModal) return '';
  const myItems = items;
  return `
  <div class="list-modal-overlay" onclick="if(event.target===this)closeListModal()">
    <div class="list-modal">
      <div class="list-modal-hdr">
        <h2 class="list-modal-title">List an Item</h2>
        <button class="modal-close" onclick="closeListModal()">✕</button>
      </div>
      <div class="list-modal-body">

        <div class="field-group">
          <label class="field-label">What would you like to do?</label>
          <div class="listing-type-selector">
            ${[
              {t:'sell', icon:'💰', label:'Sell', sub:'Set a price'},
              {t:'swap', icon:'↔️', label:'Swap', sub:'Trade for something'},
              {t:'gift', icon:'🎁', label:'Gift', sub:'Give it away free'},
              {t:'borrow',icon:'🤝',label:'Lend', sub:'Temporary loan'},
            ].map(o=>`
            <button class="lt-btn${listingType===o.t?' active':''}" onclick="setListingType('${o.t}')">
              <span class="lt-icon">${o.icon}</span>
              <span class="lt-label">${o.label}</span>
              <span class="lt-sub">${o.sub}</span>
            </button>`).join('')}
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Choose from your wardrobe</label>
          <div class="wardrobe-picker">
            ${myItems.map(item=>`
            <div class="wp-item${selectedItemId===item.id?' selected':''}" onclick="selectItem('${item.id}')">
              <div class="wp-item-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:28px">✨</span>`}
              </div>
              <p class="wp-item-name">${item.name}</p>
            </div>`).join('')}
          </div>
        </div>

        ${listingType === 'sell' ? `
        <div class="field-group">
          <label class="field-label">Price ($)</label>
          <input class="field-input" type="number" placeholder="0.00" value="${listingPrice}"
            oninput="listingPrice=this.value" />
          ${selectedItemId ? (() => {
            const it = items.find(i=>i.id===selectedItemId);
            if (!it) return '';
            const suggested = (it.cost * 0.4).toFixed(0);
            return `<p style="font-size:11px;color:var(--text-muted);margin-top:4px">Suggested: $${suggested} (based on original cost $${it.cost})</p>`;
          })() : ''}
        </div>` : ''}

        ${listingType === 'swap' ? `
        <div class="field-group">
          <label class="field-label">What are you looking for?</label>
          <input class="field-input" placeholder="e.g. quiet luxury bag, size S dress…" />
        </div>` : ''}

        <div class="field-group">
          <label class="field-label">Notes (optional)</label>
          <input class="field-input" placeholder="Condition, measurements, pickup location…" />
        </div>

        <button class="btn btn-primary" style="width:100%;justify-content:center;padding:14px" onclick="submitListing()">
          ✦ List Item
        </button>
      </div>
    </div>
  </div>`;
}

function render() {
  const listings = filteredListings();
  document.getElementById('main').innerHTML = `
  <!-- Header -->
  <div class="mkt-header fade-up">
    <span class="eyebrow">Buy · Sell · Swap · Gift</span>
    <h1>Marketplace</h1>
  </div>

  <!-- Hero -->
  <div class="mkt-hero fade-up fade-up-1">
    <div class="mkt-hero-text">
      <h2>Keep clothes in circulation</h2>
      <p>Every piece has a next chapter. List items from your wardrobe, find pieces from your community, or swap directly with friends. Free to list, always.</p>
    </div>
    <button class="mkt-hero-btn" onclick="openListModal()">+ List an Item</button>
  </div>

  <!-- Filters -->
  <div class="mkt-filters fade-up fade-up-2">
    ${['all','sell','swap','gift','borrow'].map(t=>`
    <button class="mkt-tab${activeTab===t?' active':''}" onclick="setTab('${t}')">
      ${t === 'all' ? 'All' : listingTypeLabel(t)}
    </button>`).join('')}
    <div class="mkt-search">
      <span style="color:var(--pink);font-size:12px">✦</span>
      <input placeholder="Search by item, brand, aesthetic…" value="${searchQ}"
        oninput="setSearch(this.value)" />
    </div>
  </div>

  <!-- Featured stores -->
  <div class="mkt-section-hdr fade-up fade-up-2">
    <h3>Thrift Stores Near You</h3>
    <button class="mkt-see-all">See all</button>
  </div>
  <div class="store-grid fade-up fade-up-3">
    ${DEMO_STORES.map(store=>`
    <div class="store-card${store.featured?' store-featured':''}">
      <div class="store-avatar">${store.initial}</div>
      <div class="store-info">
        <p class="store-name">${store.name}</p>
        <p class="store-location">📍 ${store.location}</p>
        <div class="store-tags">
          ${store.categories.slice(0,2).map(c=>`<span class="pill" style="font-size:9px;padding:2px 8px">${c}</span>`).join('')}
        </div>
      </div>
      ${store.featured ? `<span class="store-featured-badge">FEATURED</span>` : ''}
    </div>`).join('')}
  </div>

  <!-- Listings -->
  <div class="mkt-section-hdr fade-up fade-up-3">
    <h3>${activeTab === 'all' ? 'Latest Listings' : listingTypeLabel(activeTab) + ' Listings'}</h3>
    <button class="mkt-see-all">${listings.length} items</button>
  </div>

  ${listings.length === 0
    ? `<div class="empty-state"><span class="empty-icon">✿</span><p>No listings yet — be the first!</p><button class="btn btn-primary" onclick="openListModal()">+ List an Item</button></div>`
    : `<div class="mkt-grid fade-up fade-up-4">${listings.map(renderListingCard).join('')}</div>`
  }

  <!-- List modal -->
  ${renderListModal()}`;
}

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('marketplace.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
if (!requireAuth()) throw new Error('not authed');
render();
