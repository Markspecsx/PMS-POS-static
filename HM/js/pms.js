// js/pms.js - Front Desk Operations, Room Matrix & Folio Management

import { store } from './store.js';

let activeFilter = "ALL";
let searchQuery = "";
let currentViewMode = "matrix"; // 'matrix' or 'list'
let selectedReservationId = null;

export function initPms() {
  renderRoomMatrix();
  renderReservationList();
  setupEventListeners();

  store.on("stateChanged", () => {
    renderRoomMatrix();
    renderReservationList();
    if (selectedReservationId) {
      renderGuestFolio(selectedReservationId);
    }
  });
}

export function renderRoomMatrix() {
  const container = document.getElementById("pms-room-matrix");
  if (!container) return;

  const rooms = store.state.rooms;
  const filteredRooms = filterRoomsList(rooms);

  // Group by floors
  const floors = [1, 2, 3];
  let html = "";

  floors.forEach(floor => {
    const floorRooms = filteredRooms.filter(r => r.floor === floor);
    if (floorRooms.length === 0) return;

    html += `
      <div class="floor-section">
        <div class="floor-header">
          <div class="floor-title">
            <i class="fa-solid fa-layer-group text-accent"></i>
            Floor ${floor} — ${getFloorDescription(floor)}
          </div>
          <div class="floor-meta">${floorRooms.length} Rooms</div>
        </div>
        <div class="room-grid">
          ${floorRooms.map(room => renderRoomCard(room)).join("")}
        </div>
      </div>
    `;
  });

  if (!html) {
    container.innerHTML = `
      <div class="card text-center" style="padding: 40px;">
        <i class="fa-solid fa-bed" style="font-size: 2rem; color: var(--color-text-light); margin-bottom: 12px;"></i>
        <p style="color: var(--color-text-muted);">No rooms match your filter or search criteria.</p>
      </div>
    `;
  } else {
    container.innerHTML = html;
  }

  // Attach card click handlers
  container.querySelectorAll(".room-card").forEach(card => {
    card.addEventListener("click", () => {
      const roomNum = card.dataset.roomNumber;
      handleRoomCardClick(roomNum);
    });
  });
}

function renderRoomCard(room) {
  let statusBadgeClass = "badge-clean";
  let statusBadgeText = "Available";
  let cardStatusClass = "status-clean";

  if (room.status === "Maintenance" || room.occupancy === "OOO") {
    statusBadgeClass = "badge-ooo";
    statusBadgeText = "Out of Order";
    cardStatusClass = "status-maintenance";
  } else if (room.occupancy === "Occupied") {
    statusBadgeClass = "badge-occupied";
    statusBadgeText = "Occupied";
    cardStatusClass = "status-occupied";
  } else if (room.status === "Dirty") {
    statusBadgeClass = "badge-dirty";
    statusBadgeText = "Dirty / Pending";
    cardStatusClass = "status-dirty";
  }

  // Check if guest is assigned
  let guestInfoHtml = `<div class="room-vacant-text">Vacant &bull; Ready for check-in</div>`;
  if (room.occupancy === "Occupied" && room.guestId) {
    const res = store.state.reservations.find(r => r.id === room.guestId);
    if (res) {
      guestInfoHtml = `
        <div class="room-guest-name" title="${escapeHtml(res.guestName)}">
          <i class="fa-solid fa-user-check text-accent"></i>
          <span>${escapeHtml(res.guestName)}</span>
        </div>
      `;
    }
  } else if (room.status === "Dirty") {
    guestInfoHtml = `<div class="room-vacant-text" style="color: #EA580C;"><i class="fa-solid fa-broom"></i> Pending sanitation</div>`;
  } else if (room.status === "Maintenance") {
    guestInfoHtml = `<div class="room-vacant-text" style="color: #64748B;"><i class="fa-solid fa-wrench"></i> ${escapeHtml(room.notes || 'Engineering')}</div>`;
  }

  const hkIcon = room.status === "Clean" 
    ? `<span class="room-hk-state hk-clean"><i class="fa-solid fa-check-circle"></i> Clean</span>`
    : (room.status === "Dirty" 
      ? `<span class="room-hk-state hk-dirty"><i class="fa-solid fa-triangle-exclamation"></i> Dirty</span>`
      : `<span class="room-hk-state hk-ooo"><i class="fa-solid fa-wrench"></i> OOO</span>`);

  return `
    <div class="room-card ${cardStatusClass}" data-room-number="${room.number}">
      <div class="room-top">
        <div class="room-number-group">
          <span class="room-number">${room.number}</span>
          <span class="room-type">${room.type}</span>
        </div>
        <span class="badge ${statusBadgeClass}">${statusBadgeText}</span>
      </div>

      ${guestInfoHtml}

      <div class="room-footer">
        <span class="room-rate">$${room.rate}<small style="font-weight: normal; color: var(--color-text-light);">/nt</small></span>
        ${hkIcon}
      </div>
    </div>
  `;
}

function filterRoomsList(rooms) {
  return rooms.filter(room => {
    // Search query filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = room.number.toLowerCase().includes(q);
      const matchType = room.type.toLowerCase().includes(q);
      let matchGuest = false;
      if (room.guestId) {
        const res = store.state.reservations.find(r => r.id === room.guestId);
        if (res && res.guestName.toLowerCase().includes(q)) matchGuest = true;
      }
      if (!matchNum && !matchType && !matchGuest) return false;
    }

    // Tab filter
    if (activeFilter === "ALL") return true;
    if (activeFilter === "FLOOR-1") return room.floor === 1;
    if (activeFilter === "FLOOR-2") return room.floor === 2;
    if (activeFilter === "FLOOR-3") return room.floor === 3;
    if (activeFilter === "OCCUPIED") return room.occupancy === "Occupied";
    if (activeFilter === "CLEAN") return room.occupancy === "Vacant" && room.status === "Clean";
    if (activeFilter === "DIRTY") return room.status === "Dirty";
    if (activeFilter === "OOO") return room.status === "Maintenance" || room.occupancy === "OOO";
    return true;
  });
}

function getFloorDescription(floor) {
  if (floor === 1) return "Standard & Superior Guest Rooms";
  if (floor === 2) return "Deluxe Ocean View & Balcony Rooms";
  if (floor === 3) return "Executive Club Suites & Presidential Villa";
  return "Guest Rooms";
}

export function renderReservationList() {
  const container = document.getElementById("pms-reservation-table-body");
  if (!container) return;

  const resList = store.state.reservations;
  const filtered = resList.filter(res => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = res.guestName.toLowerCase().includes(q);
      const matchRoom = res.roomNumber.toLowerCase().includes(q);
      const matchCode = res.confirmationCode.toLowerCase().includes(q);
      if (!matchName && !matchRoom && !matchCode) return false;
    }
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<tr><td colspan="8" class="text-center" style="padding: 24px; color: var(--color-text-muted);">No reservations found matching search.</td></tr>`;
    return;
  }

  container.innerHTML = filtered.map(res => {
    let badgeClass = "badge-reserved";
    if (res.status === "Checked-In") badgeClass = "badge-occupied";
    if (res.status === "Checked-Out") badgeClass = "badge-ooo";

    const balance = store.getFolioBalance(res.folio);
    const balanceClass = Math.abs(balance) < 0.01 ? "text-success font-weight-bold" : "text-danger font-weight-bold";

    return `
      <tr>
        <td><strong style="font-family: var(--font-mono);">${res.confirmationCode}</strong></td>
        <td>
          <div style="font-weight: 700;">${escapeHtml(res.guestName)}</div>
          <small style="color: var(--color-text-muted);">${escapeHtml(res.phone || res.email)}</small>
        </td>
        <td><span class="badge badge-clean">${res.roomNumber}</span></td>
        <td>${res.roomType}</td>
        <td>${res.checkInDate} &rarr; ${res.checkOutDate}</td>
        <td><span class="${balanceClass}">$${balance.toFixed(2)}</span></td>
        <td><span class="badge ${badgeClass}">${res.status}</span></td>
        <td>
          <div style="display: flex; gap: 6px;">
            ${res.status === "Reserved" ? `
              <button class="btn btn-sm btn-primary action-checkin" data-res-id="${res.id}">
                <i class="fa-solid fa-key"></i> Check In
              </button>
            ` : ""}
            ${res.status === "Checked-In" ? `
              <button class="btn btn-sm btn-accent action-folio" data-res-id="${res.id}">
                <i class="fa-solid fa-receipt"></i> Folio & Settle
              </button>
            ` : ""}
            ${res.status === "Checked-Out" ? `
              <button class="btn btn-sm btn-outline action-folio" data-res-id="${res.id}">
                <i class="fa-solid fa-file-invoice"></i> Closed Folio
              </button>
            ` : ""}
          </div>
        </td>
      </tr>
    `;
  }).join("");

  // Attach table actions
  container.querySelectorAll(".action-checkin").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const resId = btn.dataset.resId;
      try {
        store.checkInGuest(resId);
        window.app.playSound("checkin");
        window.app.showToast("success", "Guest Checked In", "Reservation status updated to Checked-In and room marked Occupied.");
      } catch (err) {
        window.app.showToast("error", "Check-In Blocked", err.message);
      }
    });
  });

  container.querySelectorAll(".action-folio").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const resId = btn.dataset.resId;
      openGuestFolioModal(resId);
    });
  });
}

function handleRoomCardClick(roomNumber) {
  const room = store.state.rooms.find(r => r.number === roomNumber);
  if (!room) return;

  if (room.occupancy === "Occupied" && room.guestId) {
    // Open folio directly
    openGuestFolioModal(room.guestId);
  } else {
    // Open Room Action Drawer/Modal
    openRoomActionModal(room);
  }
}

export function openRoomActionModal(room) {
  const modal = document.getElementById("modal-room-action");
  if (!modal) return;

  document.getElementById("room-action-title").textContent = `Room ${room.number} (${room.type})`;
  document.getElementById("room-action-subtitle").textContent = `Floor ${room.floor} &bull; $${room.rate}/night &bull; Status: ${room.status} (${room.occupancy})`;

  const bodyEl = document.getElementById("room-action-body");
  bodyEl.innerHTML = `
    <div style="display: flex; flex-direction: column; gap: 14px;">
      <div style="background-color: var(--color-bg-subtle); padding: 12px; border-radius: var(--radius-md); font-size: 0.85rem;">
        <div><strong>Bed Configuration:</strong> ${room.bed}</div>
        <div><strong>Housekeeping Status:</strong> ${room.status} (Attendant: ${room.hkAttendant || 'Unassigned'})</div>
        <div><strong>Notes:</strong> ${escapeHtml(room.notes || 'None')}</div>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 6px;">
        ${room.status === "Clean" && room.occupancy === "Vacant" ? `
          <button class="btn btn-primary" id="btn-room-walkin">
            <i class="fa-solid fa-user-plus"></i> Walk-In Fast Check-In
          </button>
          <button class="btn btn-outline" id="btn-room-reserve">
            <i class="fa-solid fa-calendar-plus"></i> Create Future Reservation
          </button>
          <button class="btn btn-outline" id="btn-room-set-dirty" style="color: #EA580C;">
            <i class="fa-solid fa-broom"></i> Mark as Dirty / Needs Sanitation
          </button>
          <button class="btn btn-outline" id="btn-room-set-ooo" style="color: #64748B;">
            <i class="fa-solid fa-wrench"></i> Mark Out of Order (OOO)
          </button>
        ` : ""}

        ${room.status === "Dirty" ? `
          <button class="btn btn-success" id="btn-room-inspect-clean">
            <i class="fa-solid fa-circle-check"></i> Inspect & Mark Clean / Available
          </button>
          <button class="btn btn-outline" id="btn-room-dispatch-hk">
            <i class="fa-solid fa-paper-plane"></i> Dispatch Rush Housekeeper
          </button>
        ` : ""}

        ${room.status === "Maintenance" || room.occupancy === "OOO" ? `
          <button class="btn btn-success" id="btn-room-release-ooo">
            <i class="fa-solid fa-wrench"></i> Maintenance Finished — Release to HK
          </button>
        ` : ""}
      </div>
    </div>
  `;

  // Attach button events
  const btnWalkin = document.getElementById("btn-room-walkin");
  if (btnWalkin) {
    btnWalkin.addEventListener("click", () => {
      window.app.closeModal("modal-room-action");
      openReservationModal({ roomNumber: room.number, immediateCheckIn: true });
    });
  }

  const btnReserve = document.getElementById("btn-room-reserve");
  if (btnReserve) {
    btnReserve.addEventListener("click", () => {
      window.app.closeModal("modal-room-action");
      openReservationModal({ roomNumber: room.number });
    });
  }

  const btnSetDirty = document.getElementById("btn-room-set-dirty");
  if (btnSetDirty) {
    btnSetDirty.addEventListener("click", () => {
      store.updateRoomStatus(room.number, "Dirty");
      window.app.closeModal("modal-room-action");
      window.app.showToast("info", "Room Status Updated", `Room ${room.number} is now marked Dirty.`);
    });
  }

  const btnSetOOO = document.getElementById("btn-room-set-ooo");
  if (btnSetOOO) {
    btnSetOOO.addEventListener("click", () => {
      store.updateRoomStatus(room.number, "Maintenance");
      window.app.closeModal("modal-room-action");
      window.app.showToast("warning", "Room Placed Out of Order", `Room ${room.number} removed from available inventory.`);
    });
  }

  const btnInspectClean = document.getElementById("btn-room-inspect-clean");
  if (btnInspectClean) {
    btnInspectClean.addEventListener("click", () => {
      store.updateRoomStatus(room.number, "Clean");
      window.app.closeModal("modal-room-action");
      window.app.playSound("chime");
      window.app.showToast("success", "Room Inspected & Clean", `Room ${room.number} is now Clean and ready for guest check-in.`);
    });
  }

  const btnDispatchHk = document.getElementById("btn-room-dispatch-hk");
  if (btnDispatchHk) {
    btnDispatchHk.addEventListener("click", () => {
      store.assignHousekeeper(room.number, "Maria Santos", "Urgent", "Rush Clean requested by Front Desk");
      window.app.closeModal("modal-room-action");
      window.app.showToast("success", "Housekeeping Dispatched", `Room ${room.number} assigned to Maria Santos with Urgent priority.`);
    });
  }

  const btnReleaseOOO = document.getElementById("btn-room-release-ooo");
  if (btnReleaseOOO) {
    btnReleaseOOO.addEventListener("click", () => {
      store.updateRoomStatus(room.number, "Clean");
      window.app.closeModal("modal-room-action");
      window.app.showToast("success", "Maintenance Resolved", `Room ${room.number} released and marked Clean.`);
    });
  }

  window.app.openModal("modal-room-action");
}

export function openReservationModal(options = {}) {
  const modal = document.getElementById("modal-new-reservation");
  if (!modal) return;

  const form = document.getElementById("form-new-reservation");
  if (form) form.reset();

  const today = store.state.activeDate;
  const tomorrowDate = new Date(today);
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrow = tomorrowDate.toISOString().split("T")[0];

  const inDateInput = document.getElementById("res-checkin-date");
  const outDateInput = document.getElementById("res-checkout-date");
  if (inDateInput) inDateInput.value = today;
  if (outDateInput) outDateInput.value = tomorrow;

  // Populate Room Dropdown
  updateAvailableRoomsDropdown(options.roomNumber);

  const immediateCheck = document.getElementById("res-immediate-checkin");
  if (immediateCheck) {
    immediateCheck.checked = !!options.immediateCheckIn;
  }

  window.app.openModal("modal-new-reservation");
}

export function updateAvailableRoomsDropdown(preselectRoomNum) {
  const select = document.getElementById("res-room-select");
  if (!select) return;

  const inDate = document.getElementById("res-checkin-date")?.value || store.state.activeDate;
  const outDate = document.getElementById("res-checkout-date")?.value || store.state.activeDate;

  select.innerHTML = "";

  store.state.rooms.forEach(room => {
    // Check if room is OOO
    if (room.status === "Maintenance" || room.occupancy === "OOO") return;

    // Check if double booked
    const isBooked = store.state.reservations.some(r => {
      if (r.status === "Cancelled" || r.status === "Checked-Out") return false;
      if (r.roomNumber !== room.number) return false;
      return (inDate < r.checkOutDate && outDate > r.checkInDate);
    });

    const option = document.createElement("option");
    option.value = room.number;
    option.textContent = `Room ${room.number} — ${room.type} ($${room.rate}/nt)${isBooked ? ' [BOOKED FOR DATES]' : (room.occupancy === 'Occupied' ? ' [Currently In-House]' : ' [Clean/Available]')}`;
    if (isBooked) option.disabled = true;
    if (preselectRoomNum && room.number === preselectRoomNum) option.selected = true;

    select.appendChild(option);
  });
}

export function openGuestFolioModal(reservationId) {
  selectedReservationId = reservationId;
  renderGuestFolio(reservationId);
  window.app.openModal("modal-guest-folio");
}

export function renderGuestFolio(reservationId) {
  const res = store.state.reservations.find(r => r.id === reservationId);
  if (!res) return;

  const guestNameEl = document.getElementById("folio-guest-name");
  const metaGridEl = document.getElementById("folio-meta-grid");
  const itemsTableEl = document.getElementById("folio-items-table-body");

  if (guestNameEl) guestNameEl.textContent = res.guestName;
  if (metaGridEl) {
    metaGridEl.innerHTML = `
      <div class="folio-meta-item">
        <span>Room Assigned</span>
        <strong>Room ${res.roomNumber} (${res.roomType})</strong>
      </div>
      <div class="folio-meta-item">
        <span>Confirmation Code</span>
        <strong>${res.confirmationCode}</strong>
      </div>
      <div class="folio-meta-item">
        <span>Dates of Stay</span>
        <strong>${res.checkInDate} &rarr; ${res.checkOutDate}</strong>
      </div>
      <div class="folio-meta-item">
        <span>Guarantee Method</span>
        <strong>${res.paymentGuarantee}</strong>
      </div>
    `;
  }

  // Folio table rows
  if (itemsTableEl) {
    if (!res.folio || res.folio.length === 0) {
      itemsTableEl.innerHTML = `<tr><td colspan="6" class="text-center" style="padding: 24px; color: var(--color-text-muted);">No charges or payments posted yet.</td></tr>`;
    } else {
      itemsTableEl.innerHTML = res.folio.map(item => `
        <tr>
          <td><small style="color: var(--color-text-muted);">${item.date}</small></td>
          <td><strong>${escapeHtml(item.description)}</strong></td>
          <td><span class="badge ${getCategoryBadge(item.category)}">${item.category}</span></td>
          <td style="color: #DC2626; font-weight: 700; text-align: right;">${item.debit > 0 ? '$' + item.debit.toFixed(2) : '-'}</td>
          <td style="color: #059669; font-weight: 700; text-align: right;">${item.credit > 0 ? '$' + item.credit.toFixed(2) : '-'}</td>
          <td><small style="font-family: var(--font-mono); color: var(--color-text-light);">${item.reference}</small></td>
        </tr>
      `).join("");
    }
  }

  // Calculate totals
  const totalDebits = (res.folio || []).reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const totalCredits = (res.folio || []).reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
  const netBalance = totalDebits - totalCredits;

  const totalDebitsEl = document.getElementById("folio-total-debits");
  const totalCreditsEl = document.getElementById("folio-total-credits");
  const netBalanceEl = document.getElementById("folio-net-balance");

  if (totalDebitsEl) totalDebitsEl.textContent = `$${totalDebits.toFixed(2)}`;
  if (totalCreditsEl) totalCreditsEl.textContent = `$${totalCredits.toFixed(2)}`;
  if (netBalanceEl) {
    netBalanceEl.textContent = `$${netBalance.toFixed(2)}`;
    if (Math.abs(netBalance) < 0.01) {
      netBalanceEl.className = "balance-val val-zero";
    } else {
      netBalanceEl.className = "balance-val val-debit";
    }
  }

  // Checkout Button State
  const checkoutBtn = document.getElementById("btn-folio-checkout");
  if (checkoutBtn) {
    if (res.status === "Checked-Out") {
      checkoutBtn.disabled = true;
      checkoutBtn.innerHTML = `<i class="fa-solid fa-check-circle"></i> Guest Departed (Closed)`;
    } else {
      checkoutBtn.disabled = false;
      checkoutBtn.innerHTML = `<i class="fa-solid fa-door-open"></i> Settle & Check Out Guest`;
    }
  }
}

function getCategoryBadge(category) {
  if (category === "Room") return "badge-occupied";
  if (category === "Tax") return "badge-reserved";
  if (category === "Payment") return "badge-clean";
  if (category === "F&B") return "badge-dirty";
  return "badge-ooo";
}

function setupEventListeners() {
  // Search input
  const searchInput = document.getElementById("pms-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value.trim();
      renderRoomMatrix();
      renderReservationList();
    });
  }

  // Filter chips
  document.querySelectorAll(".pms-filter-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".pms-filter-chip").forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.dataset.filter;
      renderRoomMatrix();
    });
  });

  // Toggle tabs
  const tabMatrix = document.getElementById("tab-pms-matrix");
  const tabList = document.getElementById("tab-pms-list");
  const secMatrix = document.getElementById("sec-pms-matrix");
  const secList = document.getElementById("sec-pms-list");

  if (tabMatrix && tabList) {
    tabMatrix.addEventListener("click", () => {
      tabMatrix.classList.add("active");
      tabList.classList.remove("active");
      if (secMatrix) secMatrix.style.display = "block";
      if (secList) secList.style.display = "none";
      currentViewMode = "matrix";
    });

    tabList.addEventListener("click", () => {
      tabList.classList.add("active");
      tabMatrix.classList.remove("active");
      if (secMatrix) secMatrix.style.display = "none";
      if (secList) secList.style.display = "block";
      currentViewMode = "list";
    });
  }

  // New Reservation Form submission
  const newResForm = document.getElementById("form-new-reservation");
  if (newResForm) {
    newResForm.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const guestName = document.getElementById("res-guest-name").value;
        const email = document.getElementById("res-email").value;
        const phone = document.getElementById("res-phone").value;
        const idType = document.getElementById("res-id-type").value;
        const idNumber = document.getElementById("res-id-number").value;
        const checkInDate = document.getElementById("res-checkin-date").value;
        const checkOutDate = document.getElementById("res-checkout-date").value;
        const roomNumber = document.getElementById("res-room-select").value;
        const adults = document.getElementById("res-adults").value;
        const children = document.getElementById("res-children").value;
        const paymentGuarantee = document.getElementById("res-guarantee").value;
        const specialRequests = document.getElementById("res-special-req").value;
        const immediateCheckIn = document.getElementById("res-immediate-checkin").checked;

        if (checkOutDate <= checkInDate) {
          throw new Error("Check-Out Date must be after Check-In Date.");
        }

        const newRes = store.createReservation({
          guestName, email, phone, idType, idNumber,
          checkInDate, checkOutDate, roomNumber, adults, children,
          paymentGuarantee, specialRequests, immediateCheckIn
        });

        window.app.closeModal("modal-new-reservation");
        window.app.playSound("chime");
        window.app.showToast("success", "Reservation Confirmed", `Reservation ${newRes.confirmationCode} created for ${newRes.guestName}.`);
      } catch (err) {
        window.app.showToast("error", "Validation Error", err.message);
      }
    });
  }

  // Folio Post Incidental Charge Modal Trigger
  const btnPostCharge = document.getElementById("btn-folio-post-charge");
  if (btnPostCharge) {
    btnPostCharge.addEventListener("click", () => {
      if (!selectedReservationId) return;
      openPostChargeModal(selectedReservationId);
    });
  }

  // Folio Apply Discount Trigger
  const btnApplyDiscount = document.getElementById("btn-folio-apply-discount");
  if (btnApplyDiscount) {
    btnApplyDiscount.addEventListener("click", () => {
      if (!selectedReservationId) return;
      openApplyDiscountModal(selectedReservationId);
    });
  }

  // Folio Add Payment Trigger
  const btnAddPayment = document.getElementById("btn-folio-add-payment");
  if (btnAddPayment) {
    btnAddPayment.addEventListener("click", () => {
      if (!selectedReservationId) return;
      openAddPaymentModal(selectedReservationId);
    });
  }

  // Folio Print Folio Statement
  const btnPrintFolio = document.getElementById("btn-folio-print");
  if (btnPrintFolio) {
    btnPrintFolio.addEventListener("click", () => {
      if (!selectedReservationId) return;
      window.reportsModule.openFolioPrintout(selectedReservationId);
    });
  }

  // Settle & Check Out Button
  const btnCheckOut = document.getElementById("btn-folio-checkout");
  if (btnCheckOut) {
    btnCheckOut.addEventListener("click", () => {
      if (!selectedReservationId) return;
      const res = store.state.reservations.find(r => r.id === selectedReservationId);
      if (!res) return;

      const balance = store.getFolioBalance(res.folio);
      if (Math.abs(balance) > 0.01) {
        // Teach student the HM zero-balance principle
        const settleNow = confirm(`HM Instruction Notice: Under standard Front Office accounting, guest folios must be balanced to $0.00 before checkout.\n\nCurrent Unsettled Balance: $${balance.toFixed(2)}.\n\nWould you like to process an automatic full payment credit now to settle this folio to $0.00 and complete checkout?`);
        if (settleNow) {
          store.addFolioPayment(res.id, {
            description: "Final Folio Settlement at Departure",
            amount: balance,
            paymentMethod: "Credit Card (Direct Settle)"
          });
          store.checkOutGuest(res.id);
          window.app.playSound("checkout");
          window.app.showToast("success", "Folio Settled & Checked Out", `Guest ${res.guestName} checked out successfully. Room ${res.roomNumber} has automatically flipped to Dirty / Pending HK!`);
          renderGuestFolio(res.id);
        }
      } else {
        store.checkOutGuest(res.id);
        window.app.playSound("checkout");
        window.app.showToast("success", "Guest Checked Out", `Zero-balance folio verified. Guest ${res.guestName} departed. Room ${res.roomNumber} is now Dirty.`);
        renderGuestFolio(res.id);
      }
    });
  }

  // Post Charge Form Submit
  const postChargeForm = document.getElementById("form-post-charge");
  if (postChargeForm) {
    postChargeForm.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const category = document.getElementById("charge-category").value;
        const description = document.getElementById("charge-desc").value;
        const amount = document.getElementById("charge-amount").value;
        store.postFolioCharge(selectedReservationId, { category, description, amount });
        window.app.closeModal("modal-post-charge");
        window.app.showToast("success", "Charge Posted", `Added $${amount} to folio.`);
        renderGuestFolio(selectedReservationId);
      } catch (err) {
        window.app.showToast("error", "Charge Failed", err.message);
      }
    });
  }

  // Add Payment Form Submit
  const paymentForm = document.getElementById("form-add-payment");
  if (paymentForm) {
    paymentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const paymentMethod = document.getElementById("payment-method").value;
        const amount = document.getElementById("payment-amount").value;
        const description = document.getElementById("payment-desc").value || "Guest Payment";
        store.addFolioPayment(selectedReservationId, { paymentMethod, amount, description });
        window.app.closeModal("modal-add-payment");
        window.app.playSound("chime");
        window.app.showToast("success", "Payment Processed", `Credit of $${amount} recorded.`);
        renderGuestFolio(selectedReservationId);
      } catch (err) {
        window.app.showToast("error", "Payment Failed", err.message);
      }
    });
  }
}

function openPostChargeModal(reservationId) {
  const form = document.getElementById("form-post-charge");
  if (form) form.reset();
  window.app.openModal("modal-post-charge");
}

function openAddPaymentModal(reservationId) {
  const form = document.getElementById("form-add-payment");
  if (form) form.reset();
  const res = store.state.reservations.find(r => r.id === reservationId);
  if (res) {
    const bal = store.getFolioBalance(res.folio);
    const amtInput = document.getElementById("payment-amount");
    if (amtInput && bal > 0) amtInput.value = bal.toFixed(2);
  }
  window.app.openModal("modal-add-payment");
}

function openApplyDiscountModal(reservationId) {
  const res = store.state.reservations.find(r => r.id === reservationId);
  if (!res) return;

  const choice = prompt("Select HM Discount to apply:\n1. 20% Senior Citizen / PWD Discount\n2. 10% Hotel Loyalty Member Promo\n3. $25 Manager Courtesy Voucher\n\nEnter 1, 2, or 3:");
  if (!choice) return;

  try {
    if (choice === "1") {
      store.applyFolioDiscount(reservationId, { discountName: "Senior Citizen / PWD 20%", percentage: 20 });
    } else if (choice === "2") {
      store.applyFolioDiscount(reservationId, { discountName: "Hotel Loyalty Member 10%", percentage: 10 });
    } else if (choice === "3") {
      store.applyFolioDiscount(reservationId, { discountName: "Manager Courtesy Credit", fixedAmount: 25.00 });
    }
    window.app.showToast("success", "Discount Applied", "Folio balance adjusted.");
    renderGuestFolio(reservationId);
  } catch (err) {
    window.app.showToast("error", "Discount Error", err.message);
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
