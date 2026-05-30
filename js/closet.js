// CLOSET.JS

let items   = getItems();
let wearLog = getWearLog();
let activeCat = 'all', activeAes = 'all', activeOcc = 'all';
let search = '', sort = 'newest';
let modalItem = null;
let openDropdown = null; // 'cat' | 'aes' | 'occ' | null

function filtered() {
  return items.filter(item => {
    if (activeCat !== 'all' && item.category !== activeCat) return false;
    if (activeAes !== 'all' && !item.aesthetics.includes(activeAes)) return false;
    if (activeOcc !== 'all' && !item.occasions.includes(activeOcc)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (![item.name, item.brand, item.subcategory||'', item.category].some(s=>s.toLowerCase().includes(q))) return false;
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

function toggleDropdown(name) {
  openDropdown = openDropdown === name ? null : name;
  render();
}

function setCat(v)    { activeCat=v; openDropdown=null; render(); }
function setAes(v)    { activeAes=v; openDropdown=null; render(); }
function setOcc(v)    { activeOcc=v; openDropdown=null; render(); }
function setSearch(v) { search=v; render(); }
function setSort(v)   { sort=v; render(); }
function clearFilters() { activeCat='all'; activeAes='all'; activeOcc='all'; search=''; document.getElementById('searchInp').value=''; render(); }

function logWear(id) {
  const item = items.find(i=>i.id===id);
  if (!item) return;
  wearLog.push({ id:'w-'+Date.now(), itemIds:[id], date:new Date().toISOString().split('T')[0] });
  saveWearLog(wearLog);
  item.wears++;
  saveItems(items);
  closeModal();
  render();
}

function deleteItem(id) {
  if (!confirm('Remove this item from your closet?')) return;
  items = items.filter(i=>i.id!==id);
  saveItems(items);
  closeModal();
  render();
}

function openModal(id)  { modalItem = items.find(i=>i.id===id); renderModal(); }
function closeModal()   { modalItem = null; document.getElementById('modal-mount').innerHTML=''; }

function renderModal() {
  const item = modalItem;
  if (!item) return;
  document.getElementById('modal-mount').innerHTML = `
  <div class="modal-overlay" onclick="if(event.target===this)closeModal()">
    <div class="modal">
      <div class="modal-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}99)">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:64px">${item.subcategory||item.category}</span>`}
      </div>
      <div class="modal-body">
        <div class="modal-top">
          <h3 class="modal-name">${item.name}</h3>
          <button class="modal-close" onclick="closeModal()">✕</button>
        </div>
        <p class="modal-brand">${item.brand} · ${item.subcategory||item.category}</p>
        <div class="modal-stats">
          <div class="mstat"><span class="mstat-val">$${item.cost}</span><span class="mstat-lbl">Cost</span></div>
          <div class="mstat"><span class="mstat-val">${item.wears}</span><span class="mstat-lbl">Times Worn</span></div>
          <div class="mstat"><span class="mstat-val">$${getCPW(item)}</span><span class="mstat-lbl">Cost / Wear</span></div>
        </div>
        <div class="modal-tags">
          ${item.aesthetics.map(a=>`<span class="pill active" style="font-size:10px">${a}</span>`).join('')}
          ${item.occasions.map(o=>`<span class="pill" style="font-size:10px">${o}</span>`).join('')}
        </div>
        <div class="modal-actions">
          <button class="btn btn-primary" onclick="logWear('${item.id}')">✦ Log Wear</button>
          <button class="btn btn-ghost" onclick="deleteItem('${item.id}')">✕ Remove</button>
        </div>
      </div>
    </div>
  </div>`;
}

function dropdownBtn(label, value, activeVal, ddKey) {
  const isActive = activeVal !== 'all';
  const isOpen   = openDropdown === ddKey;
  return `
  <div class="dd-wrap">
    <button class="dd-btn${isActive?' dd-active':''}${isOpen?' dd-open':''}" onclick="toggleDropdown('${ddKey}')">
      ${label}${isActive ? ` <span class="dd-chosen">${activeVal}</span>` : ''}
      <span class="dd-arrow">${isOpen?'▲':'▼'}</span>
    </button>
  </div>`;
}

function render() {
  const list = filtered();
  const totalVal = items.reduce((s,i)=>s+i.cost,0);
  const hasFilter = activeCat!=='all'||activeAes!=='all'||activeOcc!=='all'||search;

  document.getElementById('main').innerHTML = `
  <div class="closet-hdr fade-up">
    <div>
      <span class="eyebrow">Your Wardrobe</span>
      <h1 class="section-title">My Closet</h1>
    </div>
    <div class="hdr-stats">
      <div class="hdr-stat"><span class="hdr-stat-val">${items.length}</span><span class="hdr-stat-lbl">items</span></div>
      <div class="hdr-stat"><span class="hdr-stat-val">$${totalVal}</span><span class="hdr-stat-lbl">total value</span></div>
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

    <!-- Dropdown filters -->
    <div class="filter-dropdowns" id="filterDropdowns">
      ${dropdownBtn('Category', activeCat, activeCat, 'cat')}
      ${dropdownBtn('Aesthetic', activeAes, activeAes, 'aes')}
      ${dropdownBtn('Occasion', activeOcc, activeOcc, 'occ')}
      ${hasFilter ? `<button class="clear-link" onclick="clearFilters()">Clear all</button>` : ''}
    </div>

    <select class="sort-select" onchange="setSort(this.value)">
      <option value="newest"    ${sort==='newest'?'selected':''}>Newest</option>
      <option value="oldest"    ${sort==='oldest'?'selected':''}>Oldest</option>
      <option value="cost-high" ${sort==='cost-high'?'selected':''}>Price ↓</option>
      <option value="cost-low"  ${sort==='cost-low'?'selected':''}>Price ↑</option>
      <option value="most-worn" ${sort==='most-worn'?'selected':''}>Most Worn</option>
      <option value="least-worn"${sort==='least-worn'?'selected':''}>Least Worn</option>
    </select>
  </div>

  <!-- Dropdown panels (render below toolbar) -->
  ${openDropdown==='cat' ? `
  <div class="dd-panel fade-up">
    <button class="pill${activeCat==='all'?' active':''}" onclick="setCat('all')">All</button>
    ${CATEGORIES.map(c=>`<button class="pill${activeCat===c.id?' active':''}" onclick="setCat('${c.id}')">${c.label}</button>`).join('')}
  </div>` : ''}
  ${openDropdown==='aes' ? `
  <div class="dd-panel fade-up">
    <button class="pill${activeAes==='all'?' active':''}" onclick="setAes('all')">All</button>
    ${AESTHETICS.map(a=>`<button class="pill${activeAes===a?' active':''}" onclick="setAes('${a.replace(/'/g,"\\'")}')">${a}</button>`).join('')}
  </div>` : ''}
  ${openDropdown==='occ' ? `
  <div class="dd-panel fade-up">
    <button class="pill${activeOcc==='all'?' active':''}" onclick="setOcc('all')">All</button>
    ${OCCASIONS.map(o=>`<button class="pill${activeOcc===o?' active':''}" onclick="setOcc('${o.replace(/'/g,"\\'")}')">${o}</button>`).join('')}
  </div>` : ''}

  <p class="results-count fade-up fade-up-2">${list.length} of ${items.length} items</p>

  ${list.length===0
    ? `<div class="empty-state"><span class="empty-icon">✿</span><p>No items match</p><a href="add.html" class="btn btn-primary">Add an item</a></div>`
    : `<div class="items-grid">
        ${list.map(item=>`
        <div class="clothing-card" onclick="openModal('${item.id}')">
          <div class="card-img" style="background:linear-gradient(135deg,${item.color}44,${item.color}99)">
            ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : ''}
            <span class="card-cpw">$${getCPW(item)}/wear</span>
          </div>
          <div class="card-body">
            <div class="card-top-row">
              <h4 class="card-name">${item.name}</h4>
              <span class="card-wears">${item.wears}×</span>
            </div>
            <p class="card-brand">${item.brand}</p>
            <p class="card-cost">$${item.cost}</p>
            <div class="card-tags">${item.aesthetics.slice(0,2).map(a=>`<span class="pill">${a}</span>`).join('')}</div>
          </div>
        </div>`).join('')}
      </div>`
  }`;
}

document.getElementById('navbar-mount').innerHTML = renderNavbar('closet.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
document.body.insertAdjacentHTML('beforeend','<div id="modal-mount"></div>');
render();
