// space. store logic
const N = n => '₦' + Number(n).toLocaleString('en-NG');
const IMG = (id, w=600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const PRODUCTS = [
  {id:'highlight-bundles-28', name:'Highlight Bundles (28")', cat:'bundles', price:20000, old:27500, tag:'sale', best:true, img:'photo-1522337660859-02fbefca4702'},
  {id:'chic-bob-glueless', name:'Chic Bob (Glueless)', cat:'closures', price:62500, tag:'new', best:true, img:'photo-1531746020798-e6953c6e8e04'},
  {id:'sdd-bouncy-black', name:'SDD Bouncy (Black)', cat:'closures', price:68000, best:true, img:'photo-1529626455594-4ff0802cfb7e'},
  {id:'blonde-rapunzel', name:'Blonde Rapunzel', cat:'frontals', price:75000, tag:'new', img:'photo-1517841905240-472988babdf9'},
  {id:'wig-oprah-natural', name:'Wig Oprah (2) — Natural', cat:'frontals', price:67500, img:'photo-1524504388940-b1c1722653e1'},
  {id:'chic-bob-frontal', name:'Chic Bob Frontal', cat:'frontals', price:65000, best:true, img:'photo-1531123897727-8f129e1688ce'},
  {id:'wig-oprah-highlight', name:'Wig Oprah (2) — Highlight', cat:'new-arrivals', price:67500, tag:'new', img:'photo-1492106087820-71f1a00d2b11'},
  {id:'solange-brown', name:'Solange — Brown Highlight', cat:'new-arrivals', price:72500, img:'photo-1502823403499-6ccfcf4fb453'},
  {id:'honey-blonde-solange', name:'Honey Blonde Solange', cat:'new-arrivals', price:72500, tag:'new', img:'photo-1595476108010-b4d1f102b1b1'},
  {id:'auburn-bouncy', name:'Auburn Bouncy', cat:'closures', price:65000, img:'photo-1605497788044-5a32c7078486'},
  {id:'blonde-holly', name:'Blonde Holly', cat:'frontals', price:65000, img:'photo-1522338242992-e1a54906a8da'},
  {id:'natural-holly', name:'Natural — Wig Holly', cat:'closures', price:65000, best:true, img:'photo-1580618672591-eb180b1a973f'},
  {id:'wig-holly-ginger', name:'Wig Holly — Ginger', cat:'new-arrivals', price:65000, tag:'new', img:'photo-1560066984-138dadb4c035'},
  {id:'dirty-blonde-bussdown', name:'Dirty Blonde Bussdown', cat:'frontals', price:67000, img:'photo-1616683693504-3ea7e9ad6fec'},
  {id:'auburn-fire-holly', name:'Auburn Fire — Wig Holly', cat:'new-arrivals', price:65000, img:'photo-1595959183082-7b570b7e08e2'},
  {id:'holly-layered-honey', name:'Holly Layered Frontal — Honey Brown', cat:'frontals', price:75000, tag:'new', best:true, img:'photo-1522338242992-e1a54906a8da'},
  {id:'wine-donor', name:'Wine Classic Donor Replica', cat:'closures', price:70000, img:'photo-1531746020798-e6953c6e8e04'},
  {id:'lux-choco', name:'Lux Choco — Classic Donor Replica', cat:'closures', price:70000, img:'photo-1529626455594-4ff0802cfb7e'},
  {id:'rapunzel', name:'Rapunzel 30" Bone Straight', cat:'frontals', price:68000, img:'photo-1524504388940-b1c1722653e1'},
  {id:'classic-princess', name:'Classic Princess Wavy', cat:'bundles', price:70000, img:'photo-1580618672591-eb180b1a973f'},
  {id:'rich-auntie', name:'Rich Auntie Blonde (Upgraded)', cat:'new-arrivals', price:75000, tag:'new', best:true, img:'photo-1517841905240-472988babdf9'},
  {id:'natural-fro', name:'Natural Girl Fro (Xtra Volume)', cat:'bundles', price:48500, old:55000, tag:'sale', img:'photo-1595476108010-b4d1f102b1b1'},
  {id:'princess-closure-28', name:'Princess Wavy (Closure — Layered 28")', cat:'closures', price:55000, best:true, img:'photo-1531123897727-8f129e1688ce'},
  {id:'burgundy-wavy', name:'Burgundy Princess Wavy', cat:'frontals', price:69500, tag:'new', img:'photo-1492106087820-71f1a00d2b11'},
];

const CAT_LABEL = {closures:'Closures', frontals:'Frontals', 'new-arrivals':'New Arrivals', bundles:'Bundles'};
let activeFilter = 'all';
let cart = [];
try { cart = JSON.parse(localStorage.getItem('space_cart')||'[]'); } catch(e){ cart = []; }
let quickId = null, quickQty = 1;

const grid = document.getElementById('productGrid');
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
function saveCart(){ localStorage.setItem('space_cart', JSON.stringify(cart)); }

function filteredProducts(){
  if(activeFilter==='all') return PRODUCTS;
  if(activeFilter==='best') return PRODUCTS.filter(p=>p.best);
  return PRODUCTS.filter(p=>p.cat===activeFilter);
}

function renderProducts(){
  const list = filteredProducts();
  resultCount.textContent = `${list.length} product${list.length!==1?'s':''} — ${activeFilter==='all'?'All Products':activeFilter==='best'?'Best Sellers':CAT_LABEL[activeFilter]}`;
  grid.innerHTML = list.map(p=>`
    <article class="card">
      <div class="card-media">
        ${p.tag==='sale'?'<span class="badge sale">SALE</span>':p.tag==='new'?'<span class="badge new">NEW</span>':p.best?'<span class="badge">BEST SELLER</span>':''}
        <img loading="lazy" src="${IMG(p.img)}" alt="${p.name}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${p.id}/600/750'" />
      </div>
      <div class="card-body">
        <span class="cat">${CAT_LABEL[p.cat]||p.cat} • space</span>
        <h3>${p.name}</h3>
        <p class="price">${N(p.price)} ${p.old?`<s>${N(p.old)}</s>`:''}</p>
        <div class="card-actions">
          <button class="add-btn" onclick="addToCart('${p.id}')">Add to cart</button>
          <button class="view-btn" onclick="openQuick('${p.id}')" aria-label="Quick view">👁</button>
        </div>
      </div>
    </article>`).join('');
}

function cartQty(){ return cart.reduce((s,i)=>s+i.qty,0); }
function cartSum(){ return cart.reduce((s,i)=>{ const p=PRODUCTS.find(x=>x.id===i.id); return s+(p?p.price*i.qty:0); },0); }

function renderCart(){
  const q = cartQty(), sum = cartSum();
  cartCount.textContent = q; cartHeadCount.textContent = q; cartTotal.textContent = N(sum);
  if(!cart.length){
    cartItemsEl.innerHTML = `<div class="empty">Your cart is empty.<br><br><a href="#shop" class="btn btn-dark" data-shop-link data-collection="all" onclick="closeAll()">Shop Now</a></div>`;
    bindShopLinks(cartItemsEl);
    return;
  }
  cartItemsEl.innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id); if(!p) return '';
    return `<div class="cart-row">
      <img src="${IMG(p.img,200)}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${p.id}/200/250'" alt="${p.name}" />
      <div><h4>${p.name}</h4><div class="muted">${i.length} • ${N(p.price)}</div>
        <div class="qty"><button onclick="changeQty('${i.key}',-1)">−</button><b>${i.qty}</b><button onclick="changeQty('${i.key}',1)">+</button></div>
        <button class="remove" onclick="removeItem('${i.key}')">remove</button>
      </div>
      <b>${N(p.price*i.qty)}</b>
    </div>`;
  }).join('');
}

window.addToCart = function(id, length='14"', qty=1){
  const key = id+'__'+length;
  const found = cart.find(i=>i.key===key);
  if(found) found.qty += qty; else cart.push({key, id, length, qty});
  saveCart(); renderCart();
  const p = PRODUCTS.find(x=>x.id===id);
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
window.openQuick = function(id){
  const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
  quickId = id; quickQty = 1;
  document.getElementById('qImg').src = IMG(p.img,700);
  document.getElementById('qImg').onerror = function(){ this.onerror=null; this.src=`https://picsum.photos/seed/${p.id}/700/850`; };
  document.getElementById('qCat').textContent = (CAT_LABEL[p.cat]||p.cat) + ' • space';
  document.getElementById('qName').textContent = p.name;
  document.getElementById('qPrice').innerHTML = `${N(p.price)} ${p.old?`<s>${N(p.old)}</s>`:''}`;
  document.getElementById('qQty').textContent = '1';
  document.getElementById('quickModal').classList.add('open');
};
document.getElementById('qPlus').onclick = ()=>{ quickQty++; document.getElementById('qQty').textContent = quickQty; };
document.getElementById('qMinus').onclick = ()=>{ if(quickQty>1) quickQty--; document.getElementById('qQty').textContent = quickQty; };
document.getElementById('qAdd').onclick = ()=>{
  addToCart(quickId, document.getElementById('qLength').value, quickQty);
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

// Every "Shop Now" leads to products: set filter + scroll
function applyCollection(col){
  const map = {all:'all', closures:'closures', frontals:'frontals', 'new-arrivals':'new-arrivals', bundles:'bundles', best:'best'};
  activeFilter = map[col]||'all';
  document.querySelectorAll('.pill').forEach(b=>b.classList.toggle('active', b.dataset.filter===activeFilter));
  renderProducts();
}
function bindShopLinks(root=document){
  root.querySelectorAll('[data-shop-link]').forEach(a=>{
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
  const res = PRODUCTS.filter(p=>p.name.toLowerCase().includes(q)||p.cat.includes(q)).slice(0,12);
  document.getElementById('searchResults').innerHTML = res.length ? res.map(p=>`
    <div class="search-row" onclick="openQuick('${p.id}')">
      <img src="${IMG(p.img,200)}" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${p.id}/200/250'" alt="" />
      <div><b>${p.name}</b><br><small>${CAT_LABEL[p.cat]} • ${N(p.price)}</small></div>
    </div>`).join('') : '<p class="empty">No matches. Try "bob", "frontal", "bouncy".</p>';
}
document.getElementById('searchInput').addEventListener('input', e=>renderSearch(e.target.value));

// Checkout
document.getElementById('checkoutBtn').onclick = ()=>{
  if(!cart.length){ showToast('Your cart is empty — tap Shop Now'); return; }
  closeAll();
  document.getElementById('coSuccess').hidden = true;
  renderCheckoutSummary();
  document.getElementById('checkoutModal').classList.add('open');
};
function renderCheckoutSummary(){
  const del = Number(document.getElementById('oDelivery').value||2450);
  const sub = cartSum();
  document.getElementById('coItems').innerHTML = cart.map(i=>{
    const p = PRODUCTS.find(x=>x.id===i.id);
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
  const orderNo = 'SPC-' + Math.floor(100000 + Math.random()*900000);
  document.getElementById('successMsg').innerHTML = `Order <b>${orderNo}</b> received for <b>${name}</b> — Total <b>${total}</b>.`;
  document.getElementById('coSuccess').hidden = false;
  cart = []; saveCart(); renderCart();
  showToast('Order placed successfully ✦');
});

// Contact + newsletter
document.getElementById('contactForm').addEventListener('submit', e=>{
  e.preventDefault();
  const msg = encodeURIComponent(`Hi space! I'm ${document.getElementById('cName').value}. ${document.getElementById('cMsg').value} (${document.getElementById('cPhone').value})`);
  showToast('Message ready — opening WhatsApp/Instagram');
  window.open(`https://www.instagram.com/codewithfavour/`, '_blank');
  e.target.reset();
});
document.getElementById('newsForm').addEventListener('submit', e=>{
  e.preventDefault();
  showToast('Welcome to space babes ✦ Check your inbox');
  document.getElementById('newsEmail').value='';
});

// Sticky shadow
window.addEventListener('scroll', ()=>{
  document.getElementById('siteHeader').style.boxShadow = window.scrollY>10 ? '0 10px 30px rgba(0,0,0,.08)' : 'none';
});

// init
bindShopLinks();
renderProducts();
renderCart();
