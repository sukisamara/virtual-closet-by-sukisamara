// ADD.JS — 3-step add item form

let step = 1;
let previewSrc = null;
let form = {
  name:'', brand:'', cost:'', category:'tops', subcategory:'',
  aesthetics:[], occasions:[], color: PALETTE[0], image:null
};

function setForm(key, val) { form[key] = val; renderStep(); }

function toggleTag(arr, val) {
  const idx = form[arr].indexOf(val);
  if (idx > -1) form[arr].splice(idx, 1);
  else form[arr].push(val);
  renderStep();
}

function handleFileInput(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => { previewSrc = e.target.result; form.image = e.target.result; renderStep(); };
  reader.readAsDataURL(file);
}

function handleDrop(e) {
  e.preventDefault();
  document.getElementById('uploadZone').classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (!file || !file.type.startsWith('image/')) return;
  const reader = new FileReader();
  reader.onload = ev => { previewSrc = ev.target.result; form.image = ev.target.result; renderStep(); };
  reader.readAsDataURL(file);
}

function removeImg() { previewSrc = null; form.image = null; renderStep(); }

function setColor(c) { form.color = c; renderStep(); }

function goStep(s) { if (s < step) { step = s; renderStep(); } }

function nextStep() {
  if (step === 1 && (!form.name || !form.brand || !form.cost)) { alert('Please fill in name, brand, and cost'); return; }
  step++;
  renderStep();
}

function prevStep() { step--; renderStep(); }

function submitForm() {
  const items = getItems();
  const newItem = {
    ...form,
    id: 'item-'+Date.now(),
    cost: parseFloat(form.cost),
    wears: 0,
    addedAt: Date.now()
  };
  items.unshift(newItem);
  saveItems(items);
  showSuccess();
}

function showSuccess() {
  document.getElementById('main').innerHTML = `
  <div class="success-screen fade-up">
    <span class="success-star">✦</span>
    <h2>Added to your closet!</h2>
    <p class="t-adult" style="font-size:18px;color:var(--text-muted)">Redirecting you back…</p>
  </div>`;
  setTimeout(() => { window.location.href = 'closet.html'; }, 1500);
}

function renderLeft() {
  const activeCat = CATEGORIES.find(c => c.id === form.category);
  return `
  <div class="add-left">
    <div class="upload-zone${previewSrc?' has-img':''}" id="uploadZone"
      onclick="document.getElementById('fileInp').click()"
      ondragover="event.preventDefault();this.classList.add('drag')"
      ondragleave="this.classList.remove('drag')"
      ondrop="handleDrop(event)">
      ${previewSrc
        ? `<img src="${previewSrc}" alt="Preview" />`
        : `<div class="upload-empty">
            <span class="upload-star">✦</span>
            <p class="upload-main">Drop photo here</p>
            <p class="upload-sub">or click to browse</p>
            <p class="upload-note">PNG with transparent bg works best for background removal</p>
          </div>`
      }
      <input type="file" id="fileInp" accept="image/*" hidden onchange="handleFileInput(this)" />
    </div>
    ${previewSrc ? `<button class="btn btn-ghost remove-img-btn" onclick="removeImg()">✕ Remove photo</button>` : ''}

    <div class="color-section">
      <label class="field-label">Item Colour</label>
      <div class="palette">
        ${PALETTE.map(c=>`<button class="swatch${form.color===c?' active':''}" style="background:${c}" onclick="setColor('${c}')"></button>`).join('')}
      </div>
    </div>
  </div>`;
}

function renderStep() {
  const activeCat = CATEGORIES.find(c => c.id === form.category);
  const stepsHTML = `
  <div class="steps">
    ${['Photo & Details','Tags','Confirm'].map((lbl,i)=>{
      const n=i+1;
      const cls = step===n?'active':step>n?'done':'';
      return `<button class="step-dot ${cls}" onclick="goStep(${n})">${step>n?'✓':n} <span>${lbl}</span></button>`;
    }).join('')}
  </div>`;

  let stepContent = '';

  if (step === 1) {
    stepContent = `
    <div class="form-step fade-up">
      <div class="field-group"><label class="field-label">Item Name *</label>
        <input class="field-input" placeholder="e.g. Silk Slip Dress" value="${form.name}" oninput="form.name=this.value" /></div>
      <div class="field-row">
        <div class="field-group"><label class="field-label">Brand *</label>
          <input class="field-input" placeholder="e.g. Reformation" value="${form.brand}" oninput="form.brand=this.value" /></div>
        <div class="field-group"><label class="field-label">Cost (£) *</label>
          <input class="field-input" type="number" placeholder="0.00" value="${form.cost}" oninput="form.cost=this.value" /></div>
      </div>
      <div class="field-row">
        <div class="field-group"><label class="field-label">Category</label>
          <select class="field-select" onchange="form.category=this.value;form.subcategory='';renderStep()">
            ${CATEGORIES.map(c=>`<option value="${c.id}"${form.category===c.id?' selected':''}>${c.icon} ${c.label}</option>`).join('')}
          </select></div>
        ${activeCat?.sub.length ? `
        <div class="field-group"><label class="field-label">Sub-type</label>
          <select class="field-select" onchange="form.subcategory=this.value">
            <option value="">Select…</option>
            ${activeCat.sub.map(s=>`<option value="${s}"${form.subcategory===s?' selected':''}>${s}</option>`).join('')}
          </select></div>` : ''}
      </div>
      <button class="btn btn-primary step-next" onclick="nextStep()" ${!form.name||!form.brand||!form.cost?'disabled':''}>
        Next: Add Tags →
      </button>
    </div>`;
  }

  if (step === 2) {
    stepContent = `
    <div class="form-step fade-up">
      <div class="tag-section">
        <label class="field-label">Aesthetic Tags <span class="optional">(select all that apply)</span></label>
        <div class="tag-cloud">
          ${AESTHETICS.map(a=>`<button class="pill${form.aesthetics.includes(a)?' active':''}" onclick="toggleTag('aesthetics','${a.replace(/'/g,"\\'")}')">${a}</button>`).join('')}
        </div>
      </div>
      <div class="tag-section">
        <label class="field-label">Occasion Tags <span class="optional">(when would you wear this?)</span></label>
        <div class="tag-cloud">
          ${OCCASIONS.map(o=>`<button class="pill${form.occasions.includes(o)?' active':''}" onclick="toggleTag('occasions','${o.replace(/'/g,"\\'")}')">${o}</button>`).join('')}
        </div>
      </div>
      ${(form.aesthetics.length||form.occasions.length) ? `
      <div class="sel-tags-preview">
        <label class="field-label">Selected</label>
        <div class="sel-tags-row">
          ${form.aesthetics.map(a=>`<span class="stag aes">${a}</span>`).join('')}
          ${form.occasions.map(o=>`<span class="stag occ">${o}</span>`).join('')}
        </div>
      </div>` : ''}
      <div class="step-btns">
        <button class="btn btn-ghost" onclick="prevStep()">← Back</button>
        <button class="btn btn-primary" onclick="nextStep()">Next: Confirm →</button>
      </div>
    </div>`;
  }

  if (step === 3) {
    const activeCat2 = CATEGORIES.find(c=>c.id===form.category);
    stepContent = `
    <div class="form-step fade-up">
      <span class="eyebrow">Confirm Details</span>
      <div class="confirm-card">
        <div class="confirm-img" style="background:linear-gradient(135deg,${form.color}44,${form.color}99)">
          ${form.image ? `<img src="${form.image}" alt="Preview" />` : `<span style="font-size:44px">${activeCat2?.icon||'✨'}</span>`}
        </div>
        <div>
          <h3 class="confirm-name">${form.name||'—'}</h3>
          <p class="confirm-meta">${form.brand||'—'} · £${form.cost||'0'}</p>
          <p class="confirm-cat">${activeCat2?.label||''} ${form.subcategory?'/ '+form.subcategory:''}</p>
          <div class="confirm-tags">
            ${form.aesthetics.map(a=>`<span class="stag aes">${a}</span>`).join('')}
            ${form.occasions.map(o=>`<span class="stag occ">${o}</span>`).join('')}
          </div>
        </div>
      </div>
      <div class="step-btns">
        <button class="btn btn-ghost" onclick="prevStep()">← Back</button>
        <button class="btn btn-primary" onclick="submitForm()" style="flex:2">✦ Add to My Closet</button>
      </div>
    </div>`;
  }

  document.getElementById('main').innerHTML = `
  <div class="add-hdr fade-up">
    <span class="eyebrow">Grow your wardrobe</span>
    <h1 class="section-title">Add New Item</h1>
  </div>
  ${stepsHTML}
  <div class="add-layout">
    ${renderLeft()}
    <div class="add-right">${stepContent}</div>
  </div>`;
}

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('add.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
renderStep();
