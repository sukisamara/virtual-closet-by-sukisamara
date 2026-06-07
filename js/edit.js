// EDIT.JS — The Edit: shareable outfit card generator

let items = getItems();
let wearLog = getWearLog();
let mode = 'daily'; // daily | weekly | monthly
let ootdPhoto = null;
let selectedItems = new Set();
let caption = '';

const now = new Date();
const DAYS_SHORT = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function setMode(m) { mode = m; render(); }

function handlePhotoUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { ootdPhoto = e.target.result; render(); };
  reader.readAsDataURL(file);
}

function handlePhotoDrop(e) {
  e.preventDefault();
  document.getElementById('photoZone')?.classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => { ootdPhoto = ev.target.result; render(); };
  reader.readAsDataURL(file);
}

function removePhoto() { ootdPhoto = null; render(); }

function toggleItem(id) {
  if (selectedItems.has(id)) selectedItems.delete(id);
  else selectedItems.add(id);
  render();
}

function setCaption(v) { caption = v; }

function getSelectedItems() {
  return [...selectedItems].map(id => items.find(i => i.id === id)).filter(Boolean);
}

function getDominantAesthetics() {
  const counts = {};
  getSelectedItems().forEach(item => {
    item.aesthetics.forEach(a => { counts[a] = (counts[a]||0)+1; });
  });
  return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([a])=>a);
}

function shareToInstagram() {
  alert('✦ In the full app, this downloads a beautifully formatted image card ready to post to Instagram Stories or your feed. Coming with the mobile app!');
}

function shareToCircle() {
  alert('✦ In the full app, this posts your OOTD directly to your Circle feed for friends to see. Coming with Firebase!');
}

// ─── DAILY CARD PREVIEW ───
function renderDailyPreview() {
  const selItems = getSelectedItems();
  const aesthetics = getDominantAesthetics();
  const dateStr = `${DAYS_SHORT[now.getDay()]} ${now.getDate()} ${MONTHS[now.getMonth()]}`;

  return `
  <div class="edit-card" id="theEditCard">
    <div class="edit-card-header">
      <span class="edit-card-brand">Virtual Closet · Suki Samara</span>
      <span class="edit-card-date">${dateStr}</span>
    </div>

    <div class="edit-card-photo">
      ${ootdPhoto
        ? `<img src="${ootdPhoto}" alt="OOTD" />`
        : `<div class="edit-card-photo-placeholder">
            <span style="font-size:48px">📸</span>
            <p>Upload your photo</p>
          </div>`
      }
    </div>

    ${selItems.length ? `
    <div class="edit-card-items">
      ${selItems.map(item=>`
      <div class="edit-callout">
        <div class="edit-callout-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:24px">✨</span>`}
        </div>
        <div class="edit-callout-line"></div>
        <div class="edit-callout-dot"></div>
        <span class="edit-callout-label">${item.brand}</span>
      </div>`).join('')}
    </div>` : ''}

    ${caption ? `<p class="edit-card-caption">"${caption}"</p>` : ''}

    ${aesthetics.length ? `
    <div class="edit-card-aesthetics">
      ${aesthetics.map(a=>`<span class="pill" style="font-size:9px;padding:2px 8px">${a}</span>`).join('')}
    </div>` : ''}

    <div class="edit-card-footer">✦ virtual closet by suki samara · est. 2026</div>
  </div>`;
}

// ─── WEEKLY PREVIEW ───
function renderWeeklyPreview() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const dateStr = d.toISOString().split('T')[0];
    const wears = wearLog.filter(w => w.date === dateStr);
    const firstItem = wears[0]?.itemIds[0] ? items.find(it => it.id === wears[0].itemIds[0]) : null;
    days.push({ label: DAYS_SHORT[d.getDay()], item: firstItem, date: d.getDate() });
  }

  const totalOutfits = days.filter(d => d.item).length;
  const totalPieces = wearLog.filter(w => {
    const d = new Date(w.date);
    return d >= new Date(Date.now() - 7*86400000);
  }).reduce((s,w) => s + w.itemIds.length, 0);

  return `
  <div class="edit-card">
    <div class="edit-card-header">
      <span class="edit-card-brand">Virtual Closet · Suki Samara</span>
      <span class="edit-card-date">This Week</span>
    </div>
    <div style="padding:14px">
      <div class="week-grid">
        ${days.map(d=>`
        <div class="day-cell">
          <div class="day-cell-hdr">${d.label} ${d.date}</div>
          ${d.item
            ? `<div class="day-cell-img" style="background:linear-gradient(135deg,${d.item.color}30,${d.item.color}60)">
                ${d.item.image ? `<img src="${d.item.image}" alt="${d.item.name}" />` : `<span style="font-size:24px">✨</span>`}
               </div>`
            : `<div class="day-cell-empty">·</div>`
          }
        </div>`).join('')}
      </div>
      <div style="display:flex;gap:12px;justify-content:center;padding:8px 0">
        <div style="text-align:center">
          <span style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--text-dark)">${totalOutfits}</span>
          <span style="display:block;font-family:'Courier New',monospace;font-size:8px;letter-spacing:.12em;color:var(--pink)">OUTFITS</span>
        </div>
        <div style="text-align:center">
          <span style="font-family:'Cormorant Garamond',serif;font-size:28px;color:var(--text-dark)">${totalPieces}</span>
          <span style="display:block;font-family:'Courier New',monospace;font-size:8px;letter-spacing:.12em;color:var(--pink)">PIECES WORN</span>
        </div>
      </div>
    </div>
    <div class="edit-card-footer">✦ virtual closet by suki samara · est. 2026</div>
  </div>`;
}

// ─── MONTHLY PREVIEW ───
function renderMonthlyPreview() {
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
  const monthLog = wearLog.filter(w => new Date(w.date).getTime() >= monthStart);
  const totalOutfits = monthLog.length;
  const totalPieces = monthLog.reduce((s,w) => s+w.itemIds.length, 0);

  const counts = {};
  monthLog.forEach(w => w.itemIds.forEach(id => { counts[id] = (counts[id]||0)+1; }));
  const favId = Object.entries(counts).sort((a,b)=>b[1]-a[1])[0]?.[0];
  const favItem = favId ? items.find(i=>i.id===favId) : items[0];

  const aesCounts = {};
  monthLog.forEach(w => w.itemIds.forEach(id => {
    const it = items.find(i=>i.id===id);
    if (it) it.aesthetics.forEach(a => { aesCounts[a]=(aesCounts[a]||0)+1; });
  }));
  const topAes = Object.entries(aesCounts).sort((a,b)=>b[1]-a[1]).slice(0,2).map(([a])=>a);

  return `
  <div class="edit-card">
    <div class="edit-card-header">
      <span class="edit-card-brand">Virtual Closet · Suki Samara</span>
      <span class="edit-card-date">${MONTHS[now.getMonth()]} ${now.getFullYear()}</span>
    </div>
    <div style="padding:16px;display:flex;flex-direction:column;gap:14px">
      <div style="font-family:'Cormorant Garamond',serif;font-size:22px;color:var(--text-dark);text-align:center;padding:8px 0">
        ${topAes.length ? `${MONTHS[now.getMonth()]} was a <em>${topAes[0]}</em> month` : `${MONTHS[now.getMonth()]} in your wardrobe`}
      </div>

      <div class="month-stats">
        <div class="month-stat">
          <span class="month-stat-val">${totalOutfits}</span>
          <span class="month-stat-lbl">OUTFITS</span>
        </div>
        <div class="month-stat">
          <span class="month-stat-val">${totalPieces}</span>
          <span class="month-stat-lbl">PIECES</span>
        </div>
        <div class="month-stat">
          <span class="month-stat-val">${new Set(monthLog.flatMap(w=>w.itemIds)).size}</span>
          <span class="month-stat-lbl">UNIQUE ITEMS</span>
        </div>
      </div>

      ${favItem ? `
      <div style="background:var(--pink-mist);border:1.5px solid var(--border);border-radius:var(--r-md);padding:14px;display:flex;align-items:center;gap:14px">
        <div style="width:64px;height:64px;border-radius:var(--r-sm);overflow:hidden;background:linear-gradient(135deg,${favItem.color}40,${favItem.color}90);display:flex;align-items:center;justify-content:center;padding:6px;flex-shrink:0">
          ${favItem.image ? `<img src="${favItem.image}" alt="${favItem.name}" style="width:auto;max-width:100%;height:auto;max-height:52px;object-fit:contain" />` : '<span style="font-size:28px">✨</span>'}
        </div>
        <div>
          <span style="font-family:'Courier New',monospace;font-size:8px;letter-spacing:.12em;color:var(--pink);display:block;margin-bottom:3px">FAVOURITE THIS MONTH</span>
          <span style="font-family:'Cormorant Garamond',serif;font-size:16px;color:var(--text-dark)">${favItem.name}</span>
          <span style="font-size:11px;color:var(--text-muted);display:block">${favItem.brand}</span>
        </div>
      </div>` : ''}

      ${topAes.length ? `
      <div style="display:flex;flex-wrap:wrap;gap:5px;justify-content:center">
        ${topAes.map(a=>`<span class="pill" style="font-size:10px">${a}</span>`).join('')}
      </div>` : ''}
    </div>
    <div class="edit-card-footer">✦ virtual closet by suki samara · est. 2026</div>
  </div>`;
}

function render() {
  const selItems = getSelectedItems();

  document.getElementById('main').innerHTML = `
  <div class="fade-up" style="margin-bottom:24px">
    <span class="eyebrow">Share your style</span>
    <h1 class="section-title">The Edit</h1>
  </div>

  <!-- Mode selector -->
  <div class="edit-modes fade-up fade-up-1">
    ${[
      {m:'daily',   label:'Daily Look'},
      {m:'weekly',  label:'Week in Review'},
      {m:'monthly', label:'Monthly Wrapped'},
    ].map(o=>`<button class="edit-mode-btn${mode===o.m?' active':''}" onclick="setMode('${o.m}')">${o.label}</button>`).join('')}
  </div>

  <div class="edit-layout">
    <!-- Left: builder -->
    <div class="fade-up fade-up-2">
      ${mode === 'daily' ? `
      <div class="edit-builder">

        <!-- Photo upload -->
        <div class="field-group">
          <label class="field-label">Your OOTD Photo</label>
          <div class="edit-photo-upload${ootdPhoto?' has-img':''}" id="photoZone"
            onclick="document.getElementById('photoInput').click()"
            ondragover="event.preventDefault();this.classList.add('drag')"
            ondragleave="this.classList.remove('drag')"
            ondrop="handlePhotoDrop(event)">
            ${ootdPhoto
              ? `<img src="${ootdPhoto}" alt="OOTD" />`
              : `<div class="edit-upload-placeholder">
                  <span class="edit-upload-icon">📸</span>
                  <p class="edit-upload-main">Drop your photo here</p>
                  <p class="edit-upload-sub">or click to browse · JPG or PNG</p>
                </div>`
            }
          </div>
          <input type="file" id="photoInput" accept="image/*" hidden onchange="handlePhotoUpload(this)" />
          ${ootdPhoto ? `<button class="btn btn-ghost" style="margin-top:8px;font-size:12px;padding:8px" onclick="removePhoto()">✕ Remove photo</button>` : ''}
        </div>

        <!-- Select items -->
        <div class="field-group">
          <label class="field-label">What did you wear? <span style="color:var(--text-muted);font-size:8px;font-weight:400;letter-spacing:0">Select all that apply</span></label>
          <div class="edit-items-grid">
            ${items.map(item=>`
            <div class="edit-item-chip${selectedItems.has(item.id)?' selected':''}" onclick="toggleItem('${item.id}')">
              ${selectedItems.has(item.id) ? `<div class="edit-item-chip-check">✓</div>` : ''}
              <div class="edit-item-chip-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
                ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:24px">✨</span>`}
              </div>
              <p class="edit-item-chip-name">${item.name}</p>
            </div>`).join('')}
          </div>
        </div>

        <!-- Caption -->
        <div class="field-group">
          <label class="field-label">Caption <span style="color:var(--text-muted);font-size:8px;font-weight:400;letter-spacing:0">optional</span></label>
          <textarea class="edit-caption-input" placeholder="How did you feel in this outfit today?"
            oninput="setCaption(this.value);renderPreview()">${caption}</textarea>
        </div>

      </div>` : `
      <div class="edit-builder">
        ${mode === 'weekly'
          ? `<p class="field-label" style="margin-bottom:12px">Your week is generated automatically from your wear log.</p>
             <p style="font-size:14px;color:var(--text-muted)">Log outfits on the Today page to populate your week.</p>`
          : `<p class="field-label" style="margin-bottom:12px">Your monthly wrapped is generated automatically.</p>
             <p style="font-size:14px;color:var(--text-muted)">Keep logging outfits to build your monthly story.</p>`
        }
      </div>`}
    </div>

    <!-- Right: preview -->
    <div class="edit-preview-panel fade-up fade-up-3">
      <span class="eyebrow">Preview</span>

      ${mode === 'daily'   ? renderDailyPreview()   : ''}
      ${mode === 'weekly'  ? renderWeeklyPreview()  : ''}
      ${mode === 'monthly' ? renderMonthlyPreview() : ''}

      <div class="edit-actions" style="margin-top:4px">
        <button class="btn btn-primary edit-action-btn" onclick="shareToInstagram()">
          📸 Download for Instagram
        </button>
        <button class="btn btn-ghost edit-action-btn" onclick="shareToCircle()">
          ◎ Share to My Circle
        </button>
      </div>

      <p style="font-family:'Courier New',monospace;font-size:9px;letter-spacing:.1em;color:var(--text-muted);text-align:center;margin-top:4px">
        FORMATTED FOR INSTAGRAM STORIES + FEED
      </p>
    </div>
  </div>`;
}

function renderPreview() {
  // Live update preview without full re-render
  const previewEl = document.querySelector('.edit-card');
  if (previewEl && mode === 'daily') {
    const newPreview = document.createElement('div');
    newPreview.innerHTML = renderDailyPreview();
    previewEl.replaceWith(newPreview.firstElementChild);
  }
}

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('edit.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
if (!requireAuth()) throw new Error('not authed');
render();
