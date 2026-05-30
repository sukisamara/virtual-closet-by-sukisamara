// CLOSET.JS

let items   = getItems();
let wearLog = getWearLog();
let activeCat = 'all', activeAes = 'all', activeOcc = 'all';
let search = '', sort = 'newest';
let modalItem = null;

function filtered() {
  return items.filter(item => {
    if (activeCat !== 'all' && item.category !== activeCat) return false;
    if (activeAes !== 'all' && !item.aesthetics.includes(activeAes)) return false;
    if (activeOcc !== 'all' && !item.occasions.includes(activeOcc)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (![item.name, item.brand, item.subcategory||'', item.category].some(s => s.toLowerCase().includes(q))) return false;
    }
    return true;
  }).sort((a,b) => {
    if (sort==='newest')     return b.addedAt - a.addedAt;
    if (sort==='oldest')     return a.addedAt - b.addedAt;
    if (sort==='cost-high')  return b.cost - a.cost;
    if (sort==='cost-low')   return a.cost - b.cost;
    if (sort==='most-worn')  return b.wears - a.wears;
    if (sort==='least-worn') return a.wears - b.wears;
    return 0;
  });
}

function pillSet(arr, active, onclick) {
  return arr.map(v => `<button class="pill${v===active?' active':''}" onclick="${onclick}('${v}')">${v}</button>`).join('');
}

function logWear(id) {
  const item = items.find(i => i.id === id);
  if (!item) return;
  const entry = { id:'w-'+Date.now(), itemIds:[id], date: new Date().toISOString().split('T')[0] };
  wearLog.push(entry);
  saveWearLog(wearLog);
  item.wears++;
  saveItems(items);
  closeModal();
  render();
}

function deleteItem(id) {
  if (!confirm('Remove this item from your closet?')) return;
  items = items.filter(i => i.id !== id);
  saveItems(items);
  closeModal();
  render();
}

function openModal(id) {
  modalItem = items.find(i => i.id === id);
  renderModal();
}

function closeModal() {
  modalItem = null;
  const m = document.getElementById('modal-mount');
  if (m) m.innerHTML = '';
}

function renderModal() {
  const item = modalItem;
  if (!item) return;
  const cpw = getCPW(item);
  const icon = CAT_ICONS[item.category] || '✨';
  const imgHtml = item.image
    ? `<img src="${item.image}" alt="${item.name}" />`
    : `<span class="modal-emoji">${icon}</span>`;

  document.getElementById('modal-mount').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}99)">${imgHtml}</div>
      <div class="modal-body">
        <div class="modal-top">
          <h3 class="modal-name">${item.name}</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <p class="modal-brand">${item.brand} · ${item.subcategory || item.category}</p>
        <div class="modal-stats">
          <div class="mstat"><span class="mstat-val">£${item.cost}</span><span class="mstat-lbl">Cost</span></div>
          <div class="mstat"><span class="mstat-val">${item.wears}</span><span class="mstat-lbl">Times Worn</span></div>
          <div class="mstat"><span class="mstat-val">£${cpw}</span><span class="mstat-lbl">Cost / Wear</span></div>
        </div>
        <div class="modal-tags">
          ${item.aesthetics.map(a=>`<span class="pill active">${a}</span>`).join('')}
          ${item.occasions.map(o=>`<span class="pill">${o}</span>`).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="logWear('${item.id}')">✦ Log Wear</button>
          <button class="btn btn-ghost" onclick="deleteItem('${item.id}')">✕ Remove</button>
        </div>
      </div>
    </div>
  </div>`;
}

function setCat(v) { activeCat=v; render(); }
function setAes(v) { activeAes=v; render(); }
function setOcc(v) { activeOcc=v; render(); }
function setSearch(v) { search=v; render(); }
function setSort(v) { sort=v; render(); }
function clearFilters() { activeCat='all';activeAes='all';activeOcc='all';search=''; document.getElementById('searchInp').value=''; render(); }

function render() {
  const list = filtered();
  const totalVal = items.reduce((s,i)=>s+i.cost,0);
  const totalW   = items.reduce((s,i)=>s+i.wears,0);
  const avgCPW   = items.length ? (items.reduce((s,i)=>s+parseFloat(getCPW(i)),0)/items.length).toFixed(2) : 0;
  const hasFilter = activeCat!=='all'||activeAes!=='all'||activeOcc!=='all'||search;

  document.getElementById('main').innerHTML = `
  <!-- Header -->
  <div class="closet-hdr fade-up">
    <div>
      <span class="eyebrow">Your Wardrobe</span>
      <h1 class="section-title">My Closet</h1>
    </div>
    <div class="hdr-stats">
      <div class="hdr-stat"><span class="hdr-stat-val">${items.length}</span><span class="hdr-stat-lbl">Items</span></div>
      <div class="hdr-stat"><span class="hdr-stat-val">£${totalVal}</span><span class="hdr-stat-lbl">Total Value</span></div>
      <div class="hdr-stat"><span class="hdr-stat-val">£${avgCPW}</span><span class="hdr-stat-lbl">Avg Cost/Wear</span></div>
      <a href="add.html" class="btn btn-primary">+ Add Item</a>
    </div>
  </div>

  <!-- Toolbar -->
  <div class="toolbar fade-up fade-up-1">
    <div class="search-box">
      <span class="search-icon">✦</span>
      <input id="searchInp" class="search-input" placeholder="Search by name, brand, type…"
        value="${search}" oninput="setSearch(this.value)" />
    </div>
    <select class="sort-select" onchange="setSort(this.value)">
      <option value="newest"    ${sort==='newest'?'selected':''}>Newest First</option>
      <option value="oldest"    ${sort==='oldest'?'selected':''}>Oldest First</option>
      <option value="cost-high" ${sort==='cost-high'?'selected':''}>Price: High → Low</option>
      <option value="cost-low"  ${sort==='cost-low'?'selected':''}>Price: Low → High</option>
      <option value="most-worn" ${sort==='most-worn'?'selected':''}>Most Worn</option>
      <option value="least-worn"${sort==='least-worn'?'selected':''}>Needs More Love</option>
    </select>
  </div>

  <!-- Filters -->
  <div class="filters-panel fade-up fade-up-2">
    <div class="filter-row">
      <span class="filter-row-lbl">Category</span>
      <div class="filter-pills">
        <button class="pill${activeCat==='all'?' active':''}" onclick="setCat('all')">All</button>
        ${CATEGORIES.map(c=>`<button class="pill${activeCat===c.id?' active':''}" onclick="setCat('${c.id}')">${c.icon} ${c.label}</button>`).join('')}
      </div>
    </div>
    <div class="filter-row">
      <span class="filter-row-lbl">Aesthetic</span>
      <div class="filter-pills">
        <button class="pill${activeAes==='all'?' active':''}" onclick="setAes('all')">All</button>
        ${AESTHETICS.map(a=>`<button class="pill${activeAes===a?' active':''}" onclick="setAes('${a.replace(/'/g,"\\'")}')">${a}</button>`).join('')}
      </div>
    </div>
    <div class="filter-row">
      <span class="filter-row-lbl">Occasion</span>
      <div class="filter-pills">
        <button class="pill${activeOcc==='all'?' active':''}" onclick="setOcc('all')">All</button>
        ${OCCASIONS.map(o=>`<button class="pill${activeOcc===o?' active':''}" onclick="setOcc('${o.replace(/'/g,"\\'")}')">${o}</button>`).join('')}
      </div>
    </div>
  </div>

  <!-- Results -->
  <div class="results-bar fade-up fade-up-3">
    <span>${list.length} of ${items.length} items</span>
    ${hasFilter ? `<button class="clear-btn" onclick="clearFilters()">Clear filters</button>` : ''}
  </div>

  <!-- Grid -->
  ${list.length === 0
    ? `<div class="empty-state"><span class="empty-icon">✿</span><p>No items match your filters</p><a href="add.html" class="btn btn-primary">Add an item</a></div>`
    : `<div class="items-grid">
        ${list.map(item => `
        <div class="clothing-card" onclick="openModal('${item.id}')">
          <div class="card-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}99)">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span class="card-emoji">${CAT_ICONS[item.category]||'✨'}</span>`}
            <span class="card-cpw">£${getCPW(item)}/wear</span>
          </div>
          <div class="card-body">
            <div class="card-top-row">
              <h4 class="card-name">${item.name}</h4>
              <span class="card-wears">${item.wears}×</span>
            </div>
            <p class="card-brand">${item.brand}</p>
            <p class="card-cost">£${item.cost}</p>
            <div class="card-tags">${item.aesthetics.slice(0,2).map(a=>`<span class="pill">${a}</span>`).join('')}</div>
          </div>
        </div>`).join('')}
      </div>`
  }`;
}

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('closet.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
document.body.insertAdjacentHTML('beforeend', '<div id="modal-mount"></div>');
render();
