const DELIVERY_FEE = 49;

const menuData = [
  { id: 1, name: "Zesty Lime Poke", price: 249, cat: "Bowls", icon: "🥗", desc: "Avocado, edamame, brown rice & citrus lime glaze." },
  { id: 2, name: "Cilantro Lime Tacos", price: 199, cat: "Mains", icon: "🌮", desc: "Three grilled veggie tacos with fresh lime crema." },
  { id: 3, name: "Matcha Chia Bowl", price: 189, cat: "Bowls", icon: "🍵", desc: "Creamy coconut matcha topped with kiwi & granola." },
  { id: 4, name: "Crispy Herb Fries", price: 109, cat: "Sides", icon: "🍟", desc: "Golden potato wedges tossed in sea salt & lime zest." },
  { id: 5, name: "Pesto Avocado Wrap", price: 219, cat: "Mains", icon: "🌯", desc: "Spinach tortilla, basil pesto, greens & feta." },
  { id: 6, name: "Mint Lime Cooler", price: 89, cat: "Drinks", icon: "🍹", desc: "Sparkling crushed mint, fresh lime & agave." }
];

let cart = {}, activeCat = "All", toastTimer;
const $ = id => document.getElementById(id);
const formatINR = amt => `₹${Math.round(amt).toLocaleString("en-IN")}`;

const showToast = msg => {
  const toast = $("toast");
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
};

const renderMenu = () => {
  const items = activeCat === "All" ? menuData : menuData.filter(d => d.cat === activeCat);
  $("menu").innerHTML = items.map(d => `
    <article class="card">
      <div>
        <div class="card-media">${d.icon.startsWith("http") ? `<img src="${d.icon}" alt="${d.name}">` : d.icon}</div>
        <span class="tag">${d.cat}</span>
        <h3>${d.name}</h3>
        <p>${d.desc}</p>
      </div>
      <div class="card-foot">
        <span class="price">${formatINR(d.price)}</span>
        <button class="btn btn-primary" onclick="updateCart(${d.id}, 1)">+ Add</button>
      </div>
    </article>`).join("");
};

const updateCart = (id, delta) => {
  cart[id] = (cart[id] || 0) + delta;
  if (cart[id] <= 0) delete cart[id];
  renderCart();
  if (delta > 0) {
    const item = menuData.find(d => d.id == id);
    if (item) showToast(`${item.name} added to cart`);
  }
};

const renderCart = () => {
  const entries = Object.entries(cart);
  let count = 0, sub = 0;

  $("cart-items").innerHTML = entries.length ? entries.map(([id, qty]) => {
    const item = menuData.find(d => d.id == id);
    count += qty;
    sub += item.price * qty;
    return `
      <div class="cart-item">
        <div><strong>${item.name}</strong><br><small>${formatINR(item.price * qty)}</small></div>
        <div class="qty">
          <button onclick="updateCart(${id}, -1)">−</button>
          <span>${qty}</span>
          <button onclick="updateCart(${id}, 1)">+</button>
        </div>
      </div>`;
  }).join("") : `<p class="hint">Your cart is empty. Add some zesty dishes!</p>`;

  const total = sub ? sub + DELIVERY_FEE : 0;
  $("badge").textContent = count;
  $("delivery").textContent = formatINR(DELIVERY_FEE);
  $("subtotal").textContent = formatINR(sub);
  $("total").textContent = $("pay-total").textContent = formatINR(total);
  $("checkout-btn").disabled = !entries.length;
};


$("filters").onclick = e => {
  if (!e.target.dataset.cat) return;
  document.querySelector(".chip.active").classList.remove("active");
  e.target.classList.add("active");
  activeCat = e.target.dataset.cat;
  renderMenu();
};


$("add-form").onsubmit = e => {
  e.preventDefault();
  menuData.unshift({
    id: Date.now(),
    name: $("f-name").value,
    price: parseFloat($("f-price").value),
    cat: $("f-cat").value,
    icon: $("f-icon").value,
    desc: $("f-desc").value
  });
  e.target.reset();
  $("add-toggle").checked = false;
  renderMenu();
};


$("checkout-btn").onclick = () => {
  $("cart-toggle").checked = false;
  $("pay-form-wrap").classList.remove("hidden");
  $("pay-success").classList.add("hidden");
  $("pay-toggle").checked = true;
};

$("pay-form").onsubmit = e => {
  e.preventDefault();
  cart = {};
  renderCart();
  $("pay-form-wrap").classList.add("hidden");
  $("pay-success").classList.remove("hidden");
};

renderMenu();
renderCart();