// ANALYTICS.JS

const PIE_COLORS=['#f4a2c3','#e07aaa','#c9558e','#b84d75','#fbf7c6','#f5eda0','#fce4ef','#fde8f2'];

let items=getItems(), wearLog=getWearLog();

function render(){
  const aestheticData=getAestheticStats(items,wearLog).slice(0,8);
  const fav=getFavoriteItem(items,wearLog);
  const totalVal=items.reduce((s,i)=>s+i.cost,0);
  const totalWears=items.reduce((s,i)=>s+i.wears,0);
  const mostWorn=[...items].sort((a,b)=>b.wears-a.wears).slice(0,5);
  const leastWorn=[...items].sort((a,b)=>a.wears-b.wears).slice(0,3);
  const totalAes=aestheticData.reduce((s,d)=>s+d.value,0)||1;

  const catCounts={};
  items.forEach(i=>{ catCounts[i.category]=(catCounts[i.category]||0)+1; });
  const catData=Object.entries(catCounts).sort((a,b)=>b[1]-a[1]);

  document.getElementById('main').innerHTML=`
  <div class="analytics-hdr fade-up">
    <span class="eyebrow">Your Style Data</span>
    <h1 class="section-title">Style Report</h1>
  </div>

  <!-- KPIs -->
  <div class="kpi-strip fade-up fade-up-1">
    <div class="kpi-card"><span class="kpi-icon">✿</span><span class="kpi-val">${items.length}</span><span class="kpi-lbl">Total Items</span></div>
    <div class="kpi-card"><span class="kpi-icon">◉</span><span class="kpi-val">$${totalVal}</span><span class="kpi-lbl">Closet Value</span></div>
    <div class="kpi-card"><span class="kpi-icon">✦</span><span class="kpi-val">${totalWears}</span><span class="kpi-lbl">Total Wears</span></div>
  </div>

  <div class="a-grid">
    <!-- Aesthetic breakdown — 2 column legend, compact pie -->
    <div class="a-card wide fade-up fade-up-2">
      <span class="eyebrow">Your Aesthetic Profile</span>
      <h3 class="a-title">What You Actually Wear</h3>
      ${aestheticData.length?`
      <div class="aes-layout">
        <div style="max-width:180px;margin:0 auto"><canvas id="pieChart" width="180" height="180"></canvas></div>
        <div class="aes-legend two-col">
          ${aestheticData.map((d,i)=>`
          <div class="pie-leg-row">
            <span class="pie-dot" style="background:${PIE_COLORS[i%PIE_COLORS.length]}"></span>
            <span class="pie-leg-name">${d.name}</span>
            <span class="pie-leg-pct">${Math.round((d.value/totalAes)*100)}%</span>
          </div>`).join('')}
        </div>
      </div>`:`<p class="a-empty">Log outfits to see your aesthetic profile</p>`}
    </div>

    <!-- Favourite item -->
    <div class="a-card fade-up fade-up-2">
      <span class="eyebrow">This Month</span>
      <h3 class="a-title">Favourite Item</h3>
      ${fav?`
      <div class="fav-wrap">
        <div class="fav-img" style="background:linear-gradient(135deg,${fav.color}44,${fav.color}99)">
          ${fav.image?`<img src="${fav.image}" alt="${fav.name}" />`:''}
        </div>
        <h4 class="fav-name">${fav.name}</h4>
        <p class="fav-brand">${fav.brand}</p>
        <div class="fav-stats">
          <div class="fav-stat"><span class="fav-stat-val">${fav.wears}×</span><span class="fav-stat-lbl">Times Worn</span></div>
          <div class="fav-stat"><span class="fav-stat-val">$${getCPW(fav)}</span><span class="fav-stat-lbl">Cost / Wear</span></div>
        </div>
        <div class="fav-tags">${fav.aesthetics.map(a=>`<span class="pill active" style="font-size:10px">${a}</span>`).join('')}</div>
      </div>`:`<p class="a-empty">No wears logged yet</p>`}
    </div>

    <!-- Category breakdown -->
    <div class="a-card fade-up fade-up-3">
      <span class="eyebrow">Wardrobe Mix</span>
      <h3 class="a-title">By Category</h3>
      <div class="cat-bars">
        ${catData.map(([cat,count])=>{
          const pct=Math.round((count/items.length)*100);
          return `
          <div class="cat-bar-row">
            <div class="cat-bar-info">
              <div class="cat-bar-top"><span class="cat-bar-name">${cat}</span><span class="cat-bar-count">${count}</span></div>
              <div class="cat-track"><div class="cat-fill" style="width:${pct}%"></div></div>
            </div>
          </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Most worn -->
    <div class="a-card fade-up fade-up-3">
      <span class="eyebrow">Top Performers</span>
      <h3 class="a-title">Most Worn</h3>
      <div class="ranked-list">
        ${mostWorn.map((item,i)=>`
        <div class="ranked-row">
          <span class="rank-num">#${i+1}</span>
          <div class="rank-dot" style="background:linear-gradient(135deg,${item.color}66,${item.color}cc)"></div>
          <div class="rank-info"><p class="rank-name">${item.name}</p><p class="rank-brand">${item.brand}</p></div>
          <span class="rank-wears">${item.wears}×</span>
        </div>`).join('')}
      </div>
    </div>

    <!-- Least worn -->
    <div class="a-card fade-up fade-up-4">
      <span class="eyebrow">Needs More Love ✿</span>
      <h3 class="a-title">Unworn Gems</h3>
      <div class="ranked-list">
        ${leastWorn.map(item=>`
        <div class="ranked-row">
          <div class="rank-dot" style="background:linear-gradient(135deg,${item.color}66,${item.color}cc)"></div>
          <div class="rank-info"><p class="rank-name">${item.name}</p><p class="rank-brand">${item.brand} · $${item.cost}</p></div>
          <span class="rank-wears">${item.wears}×</span>
        </div>`).join('')}
      </div>
    </div>
  </div>`;

  requestAnimationFrame(()=>{
    const pieEl=document.getElementById('pieChart');
    if(pieEl&&aestheticData.length){
      new Chart(pieEl,{
        type:'doughnut',
        data:{ labels:aestheticData.map(d=>d.name), datasets:[{ data:aestheticData.map(d=>d.value), backgroundColor:aestheticData.map((_,i)=>PIE_COLORS[i%PIE_COLORS.length]), borderWidth:2, borderColor:'#fff', hoverOffset:4 }] },
        options:{ cutout:'60%', plugins:{ legend:{display:false}, tooltip:{ callbacks:{ label:ctx=>` ${ctx.label}: ${ctx.parsed}` } } } }
      });
    }
  });
}

document.getElementById('navbar-mount').innerHTML=renderNavbar('analytics.html');
document.getElementById('footer-mount').innerHTML=renderFooter();
if (!requireAuth()) throw new Error('not authed');
render();
