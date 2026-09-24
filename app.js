// luxewigs store logic
const N = n => '₦' + Number(n).toLocaleString('en-NG');
const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=700&q=80`;

/* Image strategy (Pinterest-friendly):
   Every photo first tries images/<slug>.jpg (local file).
   → To use your own Pinterest photos: save them into the images/ folder
      with the exact filenames listed in images/README.md, then redeploy.
   → If a local file is missing, the site auto-falls-back to the online
      studio photo, then to a placeholder. The site never shows broken images. */
function imgSrc(local, unsplashId, seed, w){
  const online = unsplashId
    ? `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=${w||700}&q=80`
    : `https://picsum.photos/seed/${seed}/${w||700}/${Math.round((w||700)*1.25)}`;
  return { local: `images/${local}.jpg`, online, seed };
}
function imgTag(local, unsplashId, seed, alt, w){
  const s = imgSrc(local, unsplashId, seed, w);
  return `<img loading="lazy" src="${s.local}" data-online="${s.online}" data-seed="${s.seed}" data-w="${w||700}" alt="${alt}" />`;
}
// Global fallback: local file → online photo → placeholder (never broken)
document.addEventListener('error', e => {
  const t = e.target;
  if (t.tagName !== 'IMG' || t.dataset.done) return;
  if (t.src.includes('images/') && t.dataset.online) { t.src = t.dataset.online; return; }
  t.dataset.done = '1';
  const w = Number(t.dataset.w || 700);
  t.src = `https://picsum.photos/seed/${t.dataset.seed || 'luxewigs'}/${w}/${Math.round(w*1.25)}`;
}, true);

const PRODUCTS = [
  {slug:'p-bone-straight',   name:'Luxe Bone Straight 30"',        cats:['best-sellers','wigs'],        price:68000,               u:'photo-1531746020798-e6953c6e8e04'},
  {slug:'p-body-wave',       name:'Royal Body Wave Frontal',       cats:['best-sellers','frontals'],    price:72500,               u:'photo-1529626455594-4ff0802cfb7e'},
  {slug:'p-kinky-curly',     name:'Luxe Kinky Curly (Glueless)',   cats:['new-arrivals','closures'],    price:65000, tag:'new',     u:'photo-1595476108010-b4d1f102b1b1'},
  {slug:'p-honey-bob',       name:'Honey Blonde Bob',              cats:['blonde','flash-sale'],        price:62000, old:75000, tag:'sale', u:'photo-1492106087820-71f1a00d2b11'},
  {slug:'p-chic-bob',        name:'Chic Black Bob',                cats:['best-sellers','closures'],    price:62500,               u:'photo-1531123897727-8f129e1688ce'},
  {slug:'p-burgundy-wave',   name:'Burgundy Body Wave',            cats:['new-arrivals','frontals'],    price:69500, tag:'new',     u:'photo-1502823403499-6ccfcf4fb453'},
  {slug:'p-platinum-613',    name:'Platinum Blonde 613 Frontal',   cats:['blonde','new-arrivals'],      price:78000, tag:'new',     u:'photo-1517841905240-472988babdf9'},
  {slug:'p-deep-wave',       name:'Deep Wave Closure Unit',        cats:['closures','wigs'],            price:60000,               u:'photo-1524504388940-b1c1722653e1'},
  {slug:'p-highlight-bun',   name:'Highlight Bundles 28"',         cats:['bundles','flash-sale'],       price:52000, old:65000, tag:'sale', u:'photo-1522337660859-02fbefca4702'},
  {slug:'p-sdd-bouncy',      name:'SDD Bouncy (Jet Black)',        cats:['best-sellers','wigs'],        price:68000,               u:'photo-1580618672591-eb180b1a973f'},
  {slug:'p-ginger-kinky',    name:'Ginger Kinky Straight',         cats:['new-arrivals'],               price:66000, tag:'new',     u:'photo-1605497788044-5a32c7078486'},
  {slug:'p-choco-highlight', name:'Choco Highlight Body Wave',     cats:['bundles','best-sellers'],     price:70000,               u:'photo-1560066984-138dadb4c035'},
  {slug:'p-auburn-fire',     name:'Auburn Fire Bussdown',          cats:['flash-sale','frontals'],      price:64000, old:72000, tag:'sale', u:'photo-1595959183082-7b570b7e08e2'},
  {slug:'p-honey-brown',     name:'Honey Brown Layered Frontal',   cats:['blonde','best-sellers'],      price:75000,               u:'photo-1616683693504-3ea7e9ad6fec'},
  {slug:'p-natural-fro',     name:'Natural Girl Fro (Xtra Volume)',cats:['bundles','flash-sale'],       price:48500, old:55000, tag:'sale', u:'photo-1522338242992-e1a54906a8da'},
  {slug:'p-wine-replica',    name:'Wine Donor Replica',            cats:['new-arrivals','closures'],    price:70000,               u:'photo-1524504388940-b1c1722653e1'},
];

const CAT_LABEL = {'best-sellers':'Best Sellers','new-arrivals':'New Arrivals','flash-sale':'Flash Sale','blonde':'Blonde','bundles':'Bundles','closures':'Closures','frontals':'Frontals','wigs':'Wigs'};
let activeFilter = 'all';
let cart = [];
try { cart = JSON.parse(localStorage.getItem('luxewigs_cart')||'[]'); } catch(e){ cart = []; }
let quickSlug = null, quickQty = 1;

const grid = document.getElementById('productGrid');
const bestGrid = document.getElementById('bestGrid');
const resultCount = document.getElementById('resultCount');
const cartItemsEl = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartHeadCount = document.getElementById('cartHeadCount');
const cartTotal = document.getElementById('cartTotal');
const toast = document.getElementById('toast');
const overlay = document.getElementById('overlay');

function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'), 2200);
}
function saveCart(){ localStorage.setItem('luxewigs_cart', JSON.stringify(cart)); }
function primaryCat(p){ return p.cats[0]; }

function cardHTML(p){
  return `
    <article class="card">
      <div class="card-media">
        ${p.tag==='sale'?'<span class="badge sale">FLASH SALE</span>':p.tag==='new'?'<span class="badge new">NEW</span>':p.cats.includes('best-sellers')?'<span class="badge">BEST SELLER</span>':''}
        ${imgTag(p.slug, p.u, p.slug, p.name, 600)}
      </div>
      <div class="card-body">
        <span class="cat">${CAT_LABEL[primaryCat(p)]} • luxewigs</span>
        <h3>${p.name}</h3>
        <p class="price">${N(p.price)} ${p.old?`<s>${N(p.old)}</s>`:''}</p>
        <div class="card-actions">
          <button class="add-btn" onclick="addToCart('${p.slug}')">Add to cart</button>
          <button class="view-btn" onclick="openQuick('${p.slug}')" aria-label="Quick view">👁</button>
        </div>
      </div>
    </article>`;
}

function filteredProducts(){
  if(activeFilter==='all') return PRODUCTS;
  return PRODUCTS.filter(p=>p.cats.includes(activeFilter));
}

function renderProducts(){
  const list = filteredProducts();
  const label = activeFilter==='all' ? 'Shop All' : (CAT_LABEL[activeFilter]||activeFilter);
  resultCount.textContent = `${list.length} product${list.length!==1?'s':''} — ${label}`;
  grid.innerHTML = list.map(cardHTML).join('');
  bestGrid.innerHTML = PRODUCTS.filter(p=>p.cats.includes('best-sellers')).slice(0,4).map(cardHTML).join('');
}

function cartQty(){ return cart.reduce((s,i)=>s+i.qty,0); }
function cartSum(){ return cart.reduce((s,i)=>{ const p=PRODUCTS.find(x=>x.slug===i.slug); return s+(p?p.price*i.qty:0); },0); }

function renderCart(){
  const q = cartQty(), sum = cartSum();
  cartCount.textContent = q; cartHeadCount.textContent = q; cartTotal.textContent = N(sum);
  if(!cart.length){
    cartItemsEl.innerHTML = `<div class="empty">Your cart is empty.<br><br><a href="#shop" class="btn btn-dark" data-shop-link data-collection="all" onclick="closeAll()">SHOP NOW</a></div>`;
    bindShopLinks(cartItemsEl);
    return;
  }
  cartItemsEl.innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(x=>x.slug===i.slug); if(!p) return '';
    const s = imgSrc(p.slug, p.u, p.slug, 200);
    return `<div class="cart-row">
      <img src="${s.local}" data-online="${s.online}" data-seed="${s.seed}" data-w="200" alt="${p.name}" />
      <div><h4>${p.name}</h4><div class="muted">${i.length} • ${N(p.price)}</div>
        <div class="qty"><button onclick="changeQty('${i.key}',-1)">−</button><b>${i.qty}</b><button onclick="changeQty('${i.key}',1)">+</button></div>
        <button class="remove" onclick="removeItem('${i.key}')">remove</button>
      </div>
      <b>${N(p.price*i.qty)}</b>
    </div>`;
  }).join('');
}

window.addToCart = function(slug, length='14"', qty=1){
  const key = slug+'__'+length;
  const found = cart.find(i=>i.key===key);
  if(found) found.qty += qty; else cart.push({key, slug, length, qty});
  saveCart(); renderCart();
  const p = PRODUCTS.find(x=>x.slug===slug);
  showToast(`${p?p.name:'Item'} added to cart`);
  openCart();
};
window.changeQty = function(key,d){
  const it = cart.find(i=>i.key===key); if(!it) return;
  it.qty += d; if(it.qty<=0) cart = cart.filter(i=>i.key!==key);
  saveCart(); renderCart();
};
window.removeItem = function(key){ cart = cart.filter(i=>i.key!==key); saveCart(); renderCart(); };

// Quick view
window.openQuick = function(slug){
  const p = PRODUCTS.find(x=>x.slug===slug); if(!p) return;
  quickSlug = slug; quickQty = 1;
  const s = imgSrc(p.slug, p.u, p.slug, 700);
  const qi = document.getElementById('qImg');
  qi.dataset.online = s.online; qi.dataset.seed = s.seed; qi.dataset.w = '700'; delete qi.dataset.done;
  qi.src = s.local; qi.alt = p.name;
  document.getElementById('qCat').textContent = (CAT_LABEL[primaryCat(p)]||'') + ' • luxewigs';
  document.getElementById('qName').textContent = p.name;
  document.getElementById('qPrice').innerHTML = `${N(p.price)} ${p.old?`<s>${N(p.old)}</s>`:''}`;
  document.getElementById('qQty').textContent = '1';
  document.getElementById('quickModal').classList.add('open');
};
document.getElementById('qPlus').onclick = ()=>{ quickQty++; document.getElementById('qQty').textContent = quickQty; };
document.getElementById('qMinus').onclick = ()=>{ if(quickQty>1) quickQty--; document.getElementById('qQty').textContent = quickQty; };
document.getElementById('qAdd').onclick = ()=>{
  addToCart(quickSlug, document.getElementById('qLength').value, quickQty);
  document.getElementById('quickModal').classList.remove('open');
};

// Filters
document.getElementById('filters').addEventListener('click', e=>{
  const btn = e.target.closest('[data-filter]'); if(!btn) return;
  document.querySelectorAll('.pill').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  activeFilter = btn.dataset.filter;
  renderProducts();
});

// Every SHOP button leads to real products
function applyCollection(col){
  const valid = ['all','best-sellers','new-arrivals','flash-sale','blonde','bundles'];
  activeFilter = valid.includes(col) ? col : 'all';
  document.querySelectorAll('.pill').forEach(b=>b.classList.toggle('active', b.dataset.filter===activeFilter));
  renderProducts();
}
function bindShopLinks(root){
  (root||document).querySelectorAll('[data-shop-link]').forEach(a=>{
    if(a.dataset.bound) return; a.dataset.bound='1';
    a.addEventListener('click', ()=>{
      applyCollection(a.dataset.collection||'all');
      closeAll();
      setTimeout(()=>document.getElementById('shop').scrollIntoView({behavior:'smooth'}), 30);
    });
  });
}

// Drawers
const cartDrawer = document.getElementById('cartDrawer');
const searchDrawer = document.getElementById('searchDrawer');
function openCart(){ renderCart(); cartDrawer.classList.add('open'); overlay.classList.add('show'); }
function closeAll(){
  cartDrawer.classList.remove('open'); searchDrawer.classList.remove('open');
  document.getElementById('quickModal').classList.remove('open');
  document.getElementById('checkoutModal').classList.remove('open');
  overlay.classList.remove('show');
}
window.closeAll = closeAll;
document.getElementById('cartBtn').onclick = openCart;
document.getElementById('searchBtn').onclick = ()=>{ searchDrawer.classList.add('open'); overlay.classList.add('show'); renderSearch(''); document.getElementById('searchInput').focus(); };
document.getElementById('accountBtn').onclick = ()=>showToast('Accounts coming soon — checkout as guest ✦');
document.getElementById('menuBtn').onclick = ()=>document.getElementById('mobileNav').classList.toggle('open');
overlay.onclick = closeAll;
document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeAll);
document.querySelectorAll('[data-close-modal]').forEach(b=>b.onclick=closeAll);
document.querySelectorAll('[data-close-link]').forEach(a=>a.addEventListener('click', closeAll));

// Search
function renderSearch(q){
  q = (q||'').toLowerCase();
  const res = PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.cats.join(' ').includes(q)).slice(0,12);
  document.getElementById('searchResults').innerHTML = res.length ? res.map(p=>{
    const s = imgSrc(p.slug, p.u, p.slug, 200);
    return `
    <div class="search-row" onclick="openQuick('${p.slug}')">
      <img src="${s.local}" data-online="${s.online}" data-seed="${s.seed}" data-w="200" alt="" />
      <div><b>${p.name}</b><br><small>${CAT_LABEL[primaryCat(p)]} • ${N(p.price)}</small></div>
    </div>`;
  }).join('') : '<p class="empty">No matches. Try "bob", "blonde", "bouncy".</p>';
}
document.getElementById('searchInput').addEventListener('input', e=>renderSearch(e.target.value));

// Checkout
document.getElementById('checkoutBtn').onclick = ()=>{
  if(!cart.length){ showToast('Your cart is empty — tap SHOP NOW'); return; }
  closeAll();
  document.getElementById('coSuccess').hidden = true;
  renderCheckoutSummary();
  document.getElementById('checkoutModal').classList.add('open');
};
function renderCheckoutSummary(){
  const del = Number(document.getElementById('oDelivery').value||2450);
  const sub = cartSum();
  document.getElementById('coItems').innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(x=>x.slug===i.slug);
    return `<div class="row"><span>${p.name} (${i.length}) × ${i.qty}</span><b>${N(p.price*i.qty)}</b></div>`;
  }).join('');
  document.getElementById('coSub').textContent = N(sub);
  document.getElementById('coDel').textContent = N(del);
  document.getElementById('coTotal').textContent = N(sub+del);
}
document.getElementById('oDelivery').addEventListener('change', renderCheckoutSummary);
document.getElementById('checkoutForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('oName').value.trim();
  const total = document.getElementById('coTotal').textContent;
  const orderNo = 'LXW-' + Math.floor(100000 + Math.random()*900000);
  document.getElementById('successMsg').innerHTML = `Order <b>${orderNo}</b> received for <b>${name}</b> — Total <b>${total}</b>.`;
  document.getElementById('coSuccess').hidden = false;
  cart = []; saveCart(); renderCart();
  showToast('Order placed successfully ✦');
});

// Contact + newsletter
document.getElementById('contactForm').addEventListener('submit', e=>{
  e.preventDefault();
  showToast('Message ready — opening Instagram');
  window.open('https://www.instagram.com/codewithfavour/', '_blank');
  e.target.reset();
});
document.getElementById('newsForm').addEventListener('submit', e=>{
  e.preventDefault();
  showToast('Welcome to luxewigs babes ✦ Check your inbox');
  document.getElementById('newsEmail').value='';
});

// Sticky shadow
window.addEventListener('scroll', ()=>{
  document.getElementById('siteHeader').style.boxShadow = window.scrollY>10 ? '0 10px 30px rgba(42,22,12,.12)' : 'none';
});

// init
bindShopLinks();
renderProducts();
renderCart();
