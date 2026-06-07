// CIRCLE.JS

let items = getItems();
let showAddFriend = false;
let likedPosts = new Set();

// Demo circle data
const DEMO_FRIENDS = [
  { id:'f1', name:'Priya Menon',   initials:'PM', online:true,  last:'Shared OOTD 2h ago' },
  { id:'f2', name:'Mei Lin',       initials:'ML', online:true,  last:'Listed a bag · 1h ago' },
  { id:'f3', name:'Aisha Khan',    initials:'AK', online:false, last:'Active yesterday' },
  { id:'f4', name:'Naomi Tanaka',  initials:'NT', online:false, last:'Completed a swap · 3d ago' },
];

const DEMO_FEED = [
  {
    id:'p1', type:'ootd', userId:'f1', userName:'Priya Menon', userInitials:'PM',
    time:'2 hours ago',
    caption:'Finally wore my denim midi for the first time in ages — the algorithm was right, I had been neglecting her 🩷',
    ootdImg: null,
    itemIds: ['dress6','bag5','bag1'],
    aesthetics: ['quiet luxury','minimalist'],
    likes: 4,
  },
  {
    id:'p2', type:'swap', userId:'f4', userName:'Naomi Tanaka', userInitials:'NT',
    time:'Yesterday',
    itemA: 'bag3', itemB: 'dress9',
    swapNote: 'Naomi swapped her ASOS beaded bag with Mei Lin\'s Mango paisley dress ✦',
  },
  {
    id:'p3', type:'listing', userId:'f2', userName:'Mei Lin', userInitials:'ML',
    time:'1 hour ago',
    caption:'Loved this but it\'s time for it to find a new home. First dibs to the circle before it goes to the marketplace!',
    itemIds: ['bag2'],
    listingType: 'sell',
    price: 65,
  },
  {
    id:'p4', type:'borrow', userId:'f3', userName:'Aisha Khan', userInitials:'AK',
    time:'3 hours ago',
    itemId: 'bag1',
    borrowerName: 'Priya Menon',
    returnDate: 'Sunday 15 June',
    status: 'pending',
  },
  {
    id:'p5', type:'ootd', userId:'f3', userName:'Aisha Khan', userInitials:'AK',
    time:'Yesterday',
    caption:'Thrift haul from Queensway — $18 total and I am so happy 🌿',
    ootdImg: null,
    itemIds: ['dress5','bag4'],
    aesthetics: ['cottage core','preppy'],
    likes: 6,
  },
];

function getItemById(id) { return items.find(i => i.id === id) || null; }

function toggleLike(postId) {
  if (likedPosts.has(postId)) likedPosts.delete(postId);
  else likedPosts.add(postId);
  render();
}

function toggleAddFriend() { showAddFriend = !showAddFriend; render(); }

function renderFriendItem(f) {
  return `
  <div class="friend-item">
    <div class="friend-avatar">
      ${f.initials}
      ${f.online ? '<span class="friend-online-dot"></span>' : ''}
    </div>
    <div class="friend-info">
      <p class="friend-name">${f.name}</p>
      <p class="friend-last">${f.last}</p>
    </div>
    <div class="friend-actions">
      <button class="friend-action-btn">View</button>
    </div>
  </div>`;
}

function renderOOTDPost(post) {
  const liked = likedPosts.has(post.id);
  const likeCount = post.likes + (liked ? 1 : 0);
  const outfitItems = (post.itemIds || []).map(getItemById).filter(Boolean);

  return `
  <div class="feed-card">
    <div class="feed-card-hdr">
      <div class="feed-avatar">${post.userInitials}</div>
      <div class="feed-user-info">
        <p class="feed-user-name">${post.userName}</p>
        <p class="feed-time">${post.time}</p>
      </div>
      <span class="feed-type-tag tag-ootd">OOTD</span>
    </div>

    ${post.ootdImg
      ? `<div class="ootd-img-wrap"><img src="${post.ootdImg}" alt="OOTD" /></div>`
      : `<div class="ootd-img-wrap" style="min-height:200px;flex-direction:column;gap:8px">
          <span style="font-size:48px">📸</span>
          <p style="font-size:13px;color:var(--text-muted);font-style:italic">No photo uploaded</p>
         </div>`
    }

    ${outfitItems.length ? `
    <div class="ootd-items-strip">
      ${outfitItems.map(item=>`
      <div class="ootd-strip-item" title="${item.name}">
        <div class="ootd-strip-img" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:22px">✨</span>`}
        </div>
        <span class="ootd-strip-name">${item.brand}</span>
      </div>`).join('')}
    </div>` : ''}

    <p class="feed-caption">${post.caption}</p>

    ${post.aesthetics?.length ? `
    <div class="feed-aesthetics">
      ${post.aesthetics.map(a=>`<span class="pill" style="font-size:9px;padding:2px 9px">${a}</span>`).join('')}
    </div>` : ''}

    <div class="feed-actions">
      <button class="feed-action${liked?' liked':''}" onclick="toggleLike('${post.id}')">
        ${liked ? '♥' : '♡'} ${likeCount}
      </button>
      <button class="feed-action">💬 Comment</button>
      <button class="feed-action" style="margin-left:auto">↗ Request item</button>
    </div>
  </div>`;
}

function renderSwapPost(post) {
  const itemA = getItemById(post.itemA);
  const itemB = getItemById(post.itemB);
  return `
  <div class="feed-card">
    <div class="feed-card-hdr">
      <div class="feed-avatar">${post.userInitials}</div>
      <div class="feed-user-info">
        <p class="feed-user-name">${post.userName}</p>
        <p class="feed-time">${post.time}</p>
      </div>
      <span class="feed-type-tag tag-swap">SWAP ✦</span>
    </div>
    <div class="swap-card-body">
      ${itemA ? `
      <div class="swap-item-thumb" style="background:linear-gradient(135deg,${itemA.color}30,${itemA.color}60)">
        ${itemA.image ? `<img src="${itemA.image}" alt="${itemA.name}" />` : `<span style="font-size:28px">✨</span>`}
      </div>` : ''}
      <span class="swap-arrow">↔</span>
      ${itemB ? `
      <div class="swap-item-thumb" style="background:linear-gradient(135deg,${itemB.color}30,${itemB.color}60)">
        ${itemB.image ? `<img src="${itemB.image}" alt="${itemB.name}" />` : `<span style="font-size:28px">✨</span>`}
      </div>` : ''}
      <div class="swap-info">
        <p>${post.swapNote}</p>
      </div>
    </div>
  </div>`;
}

function renderListingPost(post) {
  const outfitItems = (post.itemIds || []).map(getItemById).filter(Boolean);
  const item = outfitItems[0];
  if (!item) return '';
  return `
  <div class="feed-card">
    <div class="feed-card-hdr">
      <div class="feed-avatar">${post.userInitials}</div>
      <div class="feed-user-info">
        <p class="feed-user-name">${post.userName}</p>
        <p class="feed-time">${post.time}</p>
      </div>
      <span class="feed-type-tag tag-listing">${post.listingType === 'sell' ? 'FOR SALE' : 'SWAP'}</span>
    </div>
    <div class="swap-card-body">
      <div class="swap-item-thumb" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
        ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:28px">✨</span>`}
      </div>
      <div class="swap-info">
        <p><strong>${item.name}</strong><br />${item.brand} · ${post.listingType === 'sell' ? `$${post.price}` : 'Open to swap'}</p>
        <p style="margin-top:6px">${post.caption}</p>
      </div>
    </div>
    <div class="feed-actions">
      <button class="feed-action">❤️ Save</button>
      <button class="feed-action btn btn-primary" style="margin-left:auto;font-size:12px;padding:6px 16px">
        ${post.listingType === 'sell' ? '→ Buy' : '→ Offer Swap'}
      </button>
    </div>
  </div>`;
}

function renderBorrowPost(post) {
  const item = getItemById(post.itemId);
  if (!item) return '';
  return `
  <div class="feed-card">
    <div class="feed-card-hdr">
      <div class="feed-avatar">${post.userInitials}</div>
      <div class="feed-user-info">
        <p class="feed-user-name">${post.userName}</p>
        <p class="feed-time">${post.time}</p>
      </div>
      <span class="feed-type-tag tag-borrow">BORROW</span>
    </div>
    <div class="borrow-card-body">
      <div class="borrow-item">
        <div class="swap-item-thumb" style="background:linear-gradient(135deg,${item.color}30,${item.color}60)">
          ${item.image ? `<img src="${item.image}" alt="${item.name}" />` : `<span style="font-size:28px">✨</span>`}
        </div>
        <div class="borrow-info">
          <p><strong>${post.borrowerName}</strong> wants to borrow <strong>${item.name}</strong></p>
          <p>Return by: <strong>${post.returnDate}</strong></p>
        </div>
      </div>
      ${post.status === 'pending' ? `
      <div class="borrow-actions">
        <button class="btn btn-primary borrow-actions">✓ Accept</button>
        <button class="btn btn-ghost">✕ Decline</button>
      </div>` : `<p style="font-size:13px;color:#2d8a4e;font-weight:600">✓ Accepted</p>`}
    </div>
  </div>`;
}

function renderFeedPost(post) {
  if (post.type === 'ootd')    return renderOOTDPost(post);
  if (post.type === 'swap')    return renderSwapPost(post);
  if (post.type === 'listing') return renderListingPost(post);
  if (post.type === 'borrow')  return renderBorrowPost(post);
  return '';
}

function render() {
  document.getElementById('main').innerHTML = `
  <div class="fade-up" style="margin-bottom:28px">
    <span class="eyebrow">Private · Friends only</span>
    <h1 class="section-title">My Circle</h1>
  </div>

  <div class="circle-layout">
    <!-- Sidebar -->
    <div class="circle-sidebar fade-up fade-up-1">
      <div class="circle-sidebar-hdr">
        <h3>Friends (${DEMO_FRIENDS.length})</h3>
        <button class="add-friend-btn" onclick="toggleAddFriend()" title="Add friend">+</button>
      </div>

      ${showAddFriend ? `
      <div class="add-friend-form">
        <input placeholder="Enter email or username…" onkeydown="if(event.key==='Enter'){alert('Invite sent! In the full version this sends a real invite.');toggleAddFriend();}" />
        <button class="btn btn-primary" style="padding:8px 14px;font-size:12px"
          onclick="alert('Invite sent! In the full version this sends a real invite.');toggleAddFriend()">Send</button>
      </div>` : ''}

      <div class="friend-list">
        ${DEMO_FRIENDS.map(renderFriendItem).join('')}
      </div>
    </div>

    <!-- Feed -->
    <div class="fade-up fade-up-2">
      <!-- Post OOTD banner -->
      <div class="post-ootd-banner">
        <div>
          <strong>What are you wearing today?</strong>
          <p>Share your look with your circle</p>
        </div>
        <button class="post-ootd-btn" onclick="window.location.href='edit.html'">📸 Post OOTD</button>
      </div>

      <!-- Feed -->
      <div class="circle-feed">
        ${DEMO_FEED.map(renderFeedPost).join('')}
      </div>
    </div>
  </div>`;
}

// ─── INIT ───
document.getElementById('navbar-mount').innerHTML = renderNavbar('circle.html');
document.getElementById('footer-mount').innerHTML = renderFooter();
if (!requireAuth()) throw new Error('not authed');
render();
