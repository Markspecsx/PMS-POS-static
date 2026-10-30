// js/pos.js - Point of Sale (POS), Guest Room Folio Posting & Kitchen Display System

import { store } from './store.js';

let activeCategory = "ALL";
let cart = [];
let currentOrderMode = "Dine-In"; // 'Dine-In', 'Takeaway', 'Room Service'
let posViewMode = "menu"; // 'menu' or 'kds'
let taxEnabled = true;
let scEnabled = true;
let selectedDiscountRate = 0;
let selectedDiscountName = "None";

export function initPos() {
  renderMenuCategories();
  renderMenuItems();
  renderCart();
  renderDestinationOptions();
  renderKdsBoard();
  setupPosEventListeners();

  store.on("stateChanged", () => {
    renderDestinationOptions();
    renderKdsBoard();
  });
}

export function renderMenuCategories() {
  const container = document.getElementById("pos-category-pills");
  if (!container) return;

  const categories = ["ALL", "Starters", "Mains", "Desserts", "Beverages", "Wine & Cocktails"];

  container.innerHTML = categories.map(cat => `
    <button class="category-pill ${cat === activeCategory ? 'active' : ''}" data-category="${cat}">
      ${cat === 'ALL' ? '<i class="fa-solid fa-utensils"></i> All Items' : cat}
    </button>
  `).join("");

  container.querySelectorAll(".category-pill").forEach(pill => {
    pill.addEventListener("click", () => {
      container.querySelectorAll(".category-pill").forEach(p => p.classList.remove("active"));
      pill.classList.add("active");
      activeCategory = pill.dataset.category;
      renderMenuItems();
    });
  });
}

export function renderMenuItems() {
  const container = document.getElementById("pos-menu-grid");
  if (!container) return;

  const items = store.state.menuItems;
  const filtered = items.filter(item => {
    if (activeCategory === "ALL") return true;
    return item.category === activeCategory;
  });

  const categoryIcons = {
    "Starters": "fa-solid fa-bowl-food",
    "Mains": "fa-solid fa-drumstick-bite",
    "Desserts": "fa-solid fa-cake-candles",
    "Beverages": "fa-solid fa-mug-hot",
    "Wine & Cocktails": "fa-solid fa-wine-glass"
  };

  container.innerHTML = filtered.map(item => `
    <div class="menu-card" data-item-id="${item.id}">
      <div class="menu-card-visual">
        <i class="${categoryIcons[item.category] || 'fa-solid fa-utensils'}"></i>
        ${item.dietary && item.dietary.length ? `<span class="menu-card-tag">${item.dietary[0]}</span>` : ''}
      </div>
      <div class="menu-card-body">
        <div class="menu-card-title">${escapeHtml(item.name)}</div>
        <div class="menu-card-desc">${escapeHtml(item.description)}</div>
        <div class="menu-card-footer">
          <span class="menu-card-price">$${item.price.toFixed(2)}</span>
          <button class="btn btn-sm btn-primary btn-add-cart" data-item-id="${item.id}">
            <i class="fa-solid fa-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".btn-add-cart").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const itemId = btn.dataset.itemId;
      addToCart(itemId);
    });
  });
}

export function addToCart(itemId) {
  const item = store.state.menuItems.find(m => m.id === itemId);
  if (!item) return;

  const existing = cart.find(ci => ci.id === itemId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: 1,
      category: item.category
    });
  }

  window.app.playSound("pop");
  renderCart();
}

export function updateCartQty(itemId, delta) {
  const itemIndex = cart.findIndex(ci => ci.id === itemId);
  if (itemIndex === -1) return;

  cart[itemIndex].qty += delta;
  if (cart[itemIndex].qty <= 0) {
    cart.splice(itemIndex, 1);
  }

  renderCart();
}

export function clearCart() {
  cart = [];
  renderCart();
}

export function renderCart() {
  const container = document.getElementById("pos-cart-items-list");
  const countBadge = document.getElementById("pos-cart-count");
  if (!container) return;

  const totalItemsCount = cart.reduce((sum, item) => sum + item.qty, 0);
  if (countBadge) countBadge.textContent = `${totalItemsCount} items`;

  if (cart.length === 0) {
    container.innerHTML = `
      <div class="cart-empty-message">
        <i class="fa-solid fa-receipt" style="font-size: 1.8rem; margin-bottom: 8px; display: block; opacity: 0.5;"></i>
        Order ticket is empty.<br>Click items from the menu to add.
      </div>
    `;
    updateSummaryTotals(0, 0, 0, 0, 0);
    const checkoutBtn = document.getElementById("btn-pos-checkout");
    if (checkoutBtn) checkoutBtn.disabled = true;
    return;
  }

  container.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-info">
        <span class="cart-item-name">${escapeHtml(item.name)}</span>
        <span class="cart-item-price">$${item.price.toFixed(2)} each</span>
      </div>
      <div class="cart-item-qty-controls">
        <button class="cart-qty-btn btn-qty-minus" data-item-id="${item.id}">-</button>
        <span class="cart-qty-display">${item.qty}</span>
        <button class="cart-qty-btn btn-qty-plus" data-item-id="${item.id}">+</button>
      </div>
    </div>
  `).join("");

  container.querySelectorAll(".btn-qty-minus").forEach(btn => {
    btn.addEventListener("click", () => updateCartQty(btn.dataset.itemId, -1));
  });

  container.querySelectorAll(".btn-qty-plus").forEach(btn => {
    btn.addEventListener("click", () => updateCartQty(btn.dataset.itemId, 1));
  });

  // Calculate calculations
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = selectedDiscountRate > 0 ? (subtotal * selectedDiscountRate) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);

  const tax = taxEnabled ? (taxableSubtotal * store.state.hotelInfo.taxRate) : 0;
  const serviceCharge = scEnabled ? (taxableSubtotal * store.state.hotelInfo.serviceChargeRate) : 0;
  const total = taxableSubtotal + tax + serviceCharge;

  updateSummaryTotals(subtotal, discountAmount, tax, serviceCharge, total);

  const checkoutBtn = document.getElementById("btn-pos-checkout");
  if (checkoutBtn) checkoutBtn.disabled = false;
}

function updateSummaryTotals(subtotal, discount, tax, serviceCharge, total) {
  setElText("pos-summary-subtotal", `$${subtotal.toFixed(2)}`);
  setElText("pos-summary-discount", `-$${discount.toFixed(2)}`);
  setElText("pos-summary-tax", `$${tax.toFixed(2)}`);
  setElText("pos-summary-sc", `$${serviceCharge.toFixed(2)}`);
  setElText("pos-summary-total", `$${total.toFixed(2)}`);
}

export function renderDestinationOptions() {
  const container = document.getElementById("pos-destination-container");
  if (!container) return;

  if (currentOrderMode === "Dine-In") {
    container.innerHTML = `
      <label class="form-label" style="font-size: 0.74rem;">Select Dining Table</label>
      <select class="form-control" id="pos-select-destination">
        ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(t => `<option value="Table ${t}">Table ${t} (Indoor Terrace)</option>`).join("")}
      </select>
    `;
  } else if (currentOrderMode === "Takeaway") {
    container.innerHTML = `
      <label class="form-label" style="font-size: 0.74rem;">Takeaway Customer / Lobby</label>
      <input type="text" class="form-control" id="pos-select-destination" placeholder="Enter guest or pickup name" value="Lobby Bar Pickup" />
    `;
  } else if (currentOrderMode === "Room Service") {
    // Room Service: Populate with ACTIVE CHECKED-IN PMS GUESTS!
    const checkedInGuests = store.state.reservations.filter(r => r.status === "Checked-In");

    if (checkedInGuests.length === 0) {
      container.innerHTML = `
        <div style="font-size: 0.75rem; color: #DC2626; padding: 6px; background: #FEE2E2; border-radius: 4px;">
          <i class="fa-solid fa-triangle-exclamation"></i> No guests are currently checked-in. Check-in a guest in PMS first.
        </div>
      `;
    } else {
      container.innerHTML = `
        <label class="form-label" style="font-size: 0.74rem;">Select In-House Room / Guest</label>
        <select class="form-control" id="pos-select-destination">
          ${checkedInGuests.map(g => `
            <option value="Room ${g.roomNumber}" data-room-num="${g.roomNumber}" data-guest-name="${escapeHtml(g.guestName)}">
              Room ${g.roomNumber} — ${g.guestName} (${g.roomType})
            </option>
          `).join("")}
        </select>
      `;
    }
  }
}

export function openPosSettlementModal() {
  if (cart.length === 0) {
    window.app.showToast("warning", "Cart Empty", "Please select items from the menu before settling.");
    return;
  }

  const modal = document.getElementById("modal-pos-settlement");
  if (!modal) return;

  const destEl = document.getElementById("pos-select-destination");
  let destination = "Table 1";
  let roomNumber = null;
  let guestName = "Dine-In Guest";

  if (destEl) {
    destination = destEl.value;
    if (currentOrderMode === "Room Service") {
      const selectedOption = destEl.selectedOptions ? destEl.selectedOptions[0] : null;
      if (selectedOption) {
        roomNumber = selectedOption.dataset.roomNum;
        guestName = selectedOption.dataset.guestName;
      }
    }
  }

  // Calculate order figures
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const discountAmount = selectedDiscountRate > 0 ? (subtotal * selectedDiscountRate) : 0;
  const taxableSubtotal = Math.max(0, subtotal - discountAmount);
  const tax = taxEnabled ? (taxableSubtotal * store.state.hotelInfo.taxRate) : 0;
  const serviceCharge = scEnabled ? (taxableSubtotal * store.state.hotelInfo.serviceChargeRate) : 0;
  const total = taxableSubtotal + tax + serviceCharge;

  document.getElementById("settle-order-dest").textContent = `${currentOrderMode} — ${destination}`;
  document.getElementById("settle-total-display").textContent = `$${total.toFixed(2)}`;

  // Payment method options
  const methodSelect = document.getElementById("pos-payment-method-select");
  if (methodSelect) {
    // If room service or linked room, offer Room Charge
    if (currentOrderMode === "Room Service" || roomNumber) {
      methodSelect.innerHTML = `
        <option value="Charge to Room Folio" selected>Charge to Room Folio (Room ${roomNumber})</option>
        <option value="Cash">Cash Settlement</option>
        <option value="Credit Card">Credit Card (Visa / Mastercard)</option>
        <option value="GCash / Digital Wallet">GCash / Digital Wallet</option>
      `;
    } else {
      methodSelect.innerHTML = `
        <option value="Cash" selected>Cash Settlement</option>
        <option value="Credit Card">Credit Card (Visa / Mastercard)</option>
        <option value="GCash / Digital Wallet">GCash / Digital Wallet</option>
        <option value="Charge to In-House Guest Room">Charge to In-House Guest Room</option>
      `;
    }
  }

  // Pre-fill cash tendered
  const cashInput = document.getElementById("pos-cash-tendered");
  const changeDisplay = document.getElementById("pos-cash-change");
  if (cashInput) {
    cashInput.value = Math.ceil(total);
    if (changeDisplay) {
      const change = Math.max(0, parseFloat(cashInput.value) - total);
      changeDisplay.textContent = `$${change.toFixed(2)}`;
    }
  }

  window.app.openModal("modal-pos-settlement");
}

export function renderKdsBoard() {
  const containerReceived = document.getElementById("kds-col-received");
  const containerPreparing = document.getElementById("kds-col-preparing");
  const containerReady = document.getElementById("kds-col-ready");
  const containerServed = document.getElementById("kds-col-served");

  if (!containerReceived || !containerPreparing || !containerReady || !containerServed) return;

  const orders = store.state.orders;

  renderKdsColumn(containerReceived, orders.filter(o => o.kdsStatus === "Received" || !o.kdsStatus), "Received");
  renderKdsColumn(containerPreparing, orders.filter(o => o.kdsStatus === "Preparing"), "Preparing");
  renderKdsColumn(containerReady, orders.filter(o => o.kdsStatus === "Ready"), "Ready");
  renderKdsColumn(containerServed, orders.filter(o => o.kdsStatus === "Completed" || o.status === "Served"), "Served");
}

function renderKdsColumn(container, orders, stageName) {
  if (orders.length === 0) {
    container.innerHTML = `<div style="text-align: center; color: var(--color-text-light); font-size: 0.78rem; padding: 24px 0;">No active tickets in ${stageName}</div>`;
    return;
  }

  container.innerHTML = orders.map(order => `
    <div class="kds-ticket">
      <div class="kds-ticket-top">
        <span class="kds-ticket-num">${order.ticketNumber}</span>
        <span class="badge ${order.orderType === 'Room Service' ? 'badge-dirty' : 'badge-clean'}">${order.orderType}</span>
      </div>
      <div style="font-size: 0.82rem; font-weight: 700; color: var(--color-primary-dark);">
        <i class="fa-solid fa-location-dot text-accent"></i> ${escapeHtml(order.destination)}
      </div>
      <ul class="kds-ticket-items">
        ${order.items.map(item => `
          <li>
            <span><strong>${item.qty}x</strong> ${escapeHtml(item.name)}</span>
            <small style="color: var(--color-text-light);">$${(item.price * item.qty).toFixed(2)}</small>
          </li>
        `).join("")}
      </ul>
      <div style="display: flex; align-items: center; justify-content: space-between; font-size: 0.72rem; color: var(--color-text-muted);">
        <span><i class="fa-solid fa-clock"></i> ${order.timestamp.split(" ")[1] || ''}</span>
        <strong>Total: $${Number(order.totalAmount).toFixed(2)}</strong>
      </div>
      ${order.kdsStatus !== "Completed" && order.status !== "Served" ? `
        <button class="btn btn-sm btn-primary btn-advance-kds" data-order-id="${order.id}">
          <i class="fa-solid fa-forward"></i> Move to ${getNextKdsStageName(order.kdsStatus)}
        </button>
      ` : `
        <span style="font-size: 0.72rem; color: #059669; font-weight: 700; text-align: center;"><i class="fa-solid fa-circle-check"></i> Fulfilled</span>
      `}
    </div>
  `).join("");

  container.querySelectorAll(".btn-advance-kds").forEach(btn => {
    btn.addEventListener("click", () => {
      const orderId = btn.dataset.orderId;
      store.advanceKdsStatus(orderId);
      window.app.playSound("pop");
      renderKdsBoard();
    });
  });
}

function getNextKdsStageName(currentStatus) {
  if (currentStatus === "Received") return "Preparing";
  if (currentStatus === "Preparing") return "Ready for Pickup";
  if (currentStatus === "Ready") return "Served";
  return "Completed";
}

function setupPosEventListeners() {
  // Screen mode switch between Menu and KDS
  const btnViewMenu = document.getElementById("pos-btn-view-menu");
  const btnViewKds = document.getElementById("pos-btn-view-kds");
  const secMenu = document.getElementById("pos-sec-menu-view");
  const secKds = document.getElementById("pos-sec-kds-view");

  if (btnViewMenu && btnViewKds) {
    btnViewMenu.addEventListener("click", () => {
      btnViewMenu.classList.add("active");
      btnViewKds.classList.remove("active");
      if (secMenu) secMenu.style.display = "grid";
      if (secKds) secKds.style.display = "none";
      posViewMode = "menu";
    });

    btnViewKds.addEventListener("click", () => {
      btnViewKds.classList.add("active");
      btnViewMenu.classList.remove("active");
      if (secMenu) secMenu.style.display = "none";
      if (secKds) secKds.style.display = "block";
      posViewMode = "kds";
      renderKdsBoard();
    });
  }

  // Order mode selector buttons
  document.querySelectorAll(".order-mode-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".order-mode-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentOrderMode = btn.dataset.mode;
      renderDestinationOptions();
    });
  });

  // Clear cart button
  const btnClearCart = document.getElementById("btn-pos-clear-cart");
  if (btnClearCart) {
    btnClearCart.addEventListener("click", () => {
      if (cart.length > 0 && confirm("Discard current order ticket?")) {
        clearCart();
      }
    });
  }

  // Discount selector
  const discountSelect = document.getElementById("pos-discount-select");
  if (discountSelect) {
    discountSelect.addEventListener("change", (e) => {
      const val = e.target.value;
      if (val === "SENIOR-20") {
        selectedDiscountRate = 0.20;
        selectedDiscountName = "Senior / PWD 20%";
      } else if (val === "GUEST-10") {
        selectedDiscountRate = 0.10;
        selectedDiscountName = "In-House Guest 10%";
      } else {
        selectedDiscountRate = 0;
        selectedDiscountName = "None";
      }
      renderCart();
    });
  }

  // Tax and Service Charge toggles
  const taxToggle = document.getElementById("pos-toggle-tax");
  if (taxToggle) {
    taxToggle.addEventListener("change", (e) => {
      taxEnabled = e.target.checked;
      renderCart();
    });
  }

  const scToggle = document.getElementById("pos-toggle-sc");
  if (scToggle) {
    scToggle.addEventListener("change", (e) => {
      scEnabled = e.target.checked;
      renderCart();
    });
  }

  // Open Checkout modal
  const btnCheckout = document.getElementById("btn-pos-checkout");
  if (btnCheckout) {
    btnCheckout.addEventListener("click", openPosSettlementModal);
  }

  // Cash tendered live change calculation
  const cashInput = document.getElementById("pos-cash-tendered");
  if (cashInput) {
    cashInput.addEventListener("input", () => {
      const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const discountAmount = selectedDiscountRate > 0 ? (subtotal * selectedDiscountRate) : 0;
      const taxableSubtotal = Math.max(0, subtotal - discountAmount);
      const tax = taxEnabled ? (taxableSubtotal * store.state.hotelInfo.taxRate) : 0;
      const serviceCharge = scEnabled ? (taxableSubtotal * store.state.hotelInfo.serviceChargeRate) : 0;
      const total = taxableSubtotal + tax + serviceCharge;

      const tendered = parseFloat(cashInput.value) || 0;
      const change = Math.max(0, tendered - total);
      setElText("pos-cash-change", `$${change.toFixed(2)}`);
    });
  }

  // Finalize settlement submit
  const formSettle = document.getElementById("form-pos-settlement");
  if (formSettle) {
    formSettle.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const destEl = document.getElementById("pos-select-destination");
        let destination = "Table 1";
        let roomNumber = null;
        let guestName = "Dine-In Guest";

        if (destEl) {
          destination = destEl.value;
          if (currentOrderMode === "Room Service") {
            const opt = destEl.selectedOptions ? destEl.selectedOptions[0] : null;
            if (opt) {
              roomNumber = opt.dataset.roomNum;
              guestName = opt.dataset.guestName;
            }
          }
        }

        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
        const discountAmount = selectedDiscountRate > 0 ? (subtotal * selectedDiscountRate) : 0;
        const taxableSubtotal = Math.max(0, subtotal - discountAmount);
        const tax = taxEnabled ? (taxableSubtotal * store.state.hotelInfo.taxRate) : 0;
        const serviceCharge = scEnabled ? (taxableSubtotal * store.state.hotelInfo.serviceChargeRate) : 0;
        const total = taxableSubtotal + tax + serviceCharge;

        const paymentMethod = document.getElementById("pos-payment-method-select").value;

        // Create POS order & route room charge if selected
        const newOrder = store.createPosOrder({
          orderType: currentOrderMode,
          destination,
          items: JSON.parse(JSON.stringify(cart)),
          subtotal,
          tax,
          serviceCharge,
          discountAmount,
          discountType: selectedDiscountName,
          totalAmount: total,
          paymentMethod,
          roomNumber,
          guestName
        });

        window.app.closeModal("modal-pos-settlement");
        window.app.playSound("checkout");
        window.app.showToast("success", "Order Placed & Paid", `Ticket ${newOrder.ticketNumber} created. Routed to kitchen display.`);

        // Clear cart
        clearCart();

        // Automatically open the Thermal POS Receipt modal
        window.reportsModule.openThermalReceipt(newOrder.id);
      } catch (err) {
        window.app.showToast("error", "Settlement Blocked", err.message);
      }
    });
  }
}

function setElText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
