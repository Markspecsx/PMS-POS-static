// js/housekeeping.js - Housekeeping Coordination & Hygiene Status Board

import { store } from './store.js';

let activeHkFilter = "ALL";
let selectedHkRoomNumber = null;

export function initHousekeeping() {
  renderHkStats();
  renderHkBoard();
  renderHkStaffRoster();
  setupHkEventListeners();

  store.on("stateChanged", () => {
    renderHkStats();
    renderHkBoard();
    renderHkStaffRoster();
  });
}

export function renderHkStats() {
  const rooms = store.state.rooms;
  const dirtyCount = rooms.filter(r => r.status === "Dirty").length;
  const cleanCount = rooms.filter(r => r.status === "Clean").length;
  const oooCount = rooms.filter(r => r.status === "Maintenance" || r.occupancy === "OOO").length;
  const staffCount = store.state.hkStaff.length;

  setElText("hk-stat-dirty", dirtyCount);
  setElText("hk-stat-clean", cleanCount);
  setElText("hk-stat-ooo", oooCount);
  setElText("hk-stat-staff", staffCount);
}

export function renderHkBoard() {
  const container = document.getElementById("hk-room-cards-container");
  if (!container) return;

  const rooms = store.state.rooms;
  const filtered = rooms.filter(room => {
    if (activeHkFilter === "ALL") return true;
    if (activeHkFilter === "DIRTY") return room.status === "Dirty";
    if (activeHkFilter === "CLEAN") return room.status === "Clean";
    if (activeHkFilter === "MAINTENANCE") return room.status === "Maintenance" || room.occupancy === "OOO";
    if (activeHkFilter === "OCCUPIED") return room.occupancy === "Occupied";
    return true;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div class="card text-center" style="grid-column: 1 / -1; padding: 30px; color: var(--color-text-muted);">No rooms matching the selected housekeeping filter.</div>`;
    return;
  }

  container.innerHTML = filtered.map(room => {
    let statusBadge = "badge-clean";
    let statusText = "Clean & Inspected";
    if (room.status === "Dirty") {
      statusBadge = "badge-dirty";
      statusText = "Dirty / Pending";
    } else if (room.status === "Maintenance") {
      statusBadge = "badge-ooo";
      statusText = "Out of Order";
    }

    const priorityClass = `priority-${room.priority || 'Normal'}`;

    return `
      <div class="hk-card" data-room-num="${room.number}">
        <div class="hk-card-header">
          <div>
            <span class="hk-room-id">Room ${room.number}</span>
            <div style="font-size: 0.76rem; color: var(--color-text-muted); font-weight: 600;">Floor ${room.floor} &bull; ${room.type}</div>
          </div>
          <span class="badge ${statusBadge}">${statusText}</span>
        </div>

        <div class="hk-card-body">
          <div class="hk-info-row">
            <span>Occupancy State:</span>
            <strong style="color: ${room.occupancy === 'Occupied' ? '#991B1B' : '#059669'};">${room.occupancy}</strong>
          </div>
          <div class="hk-info-row">
            <span>Assigned Attendant:</span>
            <strong>${escapeHtml(room.hkAttendant || 'Unassigned')}</strong>
          </div>
          <div class="hk-info-row">
            <span>Priority Level:</span>
            <span class="hk-priority-badge ${priorityClass}">${room.priority || 'Normal'}</span>
          </div>

          ${room.notes ? `
            <div class="hk-notes-box">
              <i class="fa-solid fa-note-sticky text-accent" style="margin-right: 4px;"></i>
              ${escapeHtml(room.notes)}
            </div>
          ` : ""}
        </div>

        <div class="hk-card-actions">
          ${room.status === "Dirty" ? `
            <button class="btn btn-sm btn-success hk-action-clean" data-room-num="${room.number}" title="Mark room clean & ready">
              <i class="fa-solid fa-check"></i> Inspect & Clean
            </button>
            <button class="btn btn-sm btn-outline hk-action-assign" data-room-num="${room.number}">
              <i class="fa-solid fa-user-tag"></i> Assign
            </button>
          ` : ""}

          ${room.status === "Clean" ? `
            <button class="btn btn-sm btn-outline hk-action-dirty" data-room-num="${room.number}" style="color: #EA580C;" title="Flag room as dirty">
              <i class="fa-solid fa-broom"></i> Flag Dirty
            </button>
            <button class="btn btn-sm btn-outline hk-action-assign" data-room-num="${room.number}">
              <i class="fa-solid fa-user-tag"></i> Assign
            </button>
          ` : ""}

          ${room.status === "Maintenance" ? `
            <button class="btn btn-sm btn-success hk-action-clean" data-room-num="${room.number}" title="Release to clean inventory">
              <i class="fa-solid fa-wrench"></i> Release OOO
            </button>
          ` : ""}
        </div>
      </div>
    `;
  }).join("");

  // Attach card button handlers
  container.querySelectorAll(".hk-action-clean").forEach(btn => {
    btn.addEventListener("click", () => {
      const roomNum = btn.dataset.roomNum;
      store.updateRoomStatus(roomNum, "Clean");
      window.app.playSound("chime");
      window.app.showToast("success", "Room Inspected", `Room ${roomNum} is now Clean and ready for occupancy.`);
    });
  });

  container.querySelectorAll(".hk-action-dirty").forEach(btn => {
    btn.addEventListener("click", () => {
      const roomNum = btn.dataset.roomNum;
      store.updateRoomStatus(roomNum, "Dirty");
      window.app.showToast("info", "Room Flagged Dirty", `Room ${roomNum} status changed to Dirty / Pending Clean.`);
    });
  });

  container.querySelectorAll(".hk-action-assign").forEach(btn => {
    btn.addEventListener("click", () => {
      const roomNum = btn.dataset.roomNum;
      openHkAssignmentModal(roomNum);
    });
  });
}

export function renderHkStaffRoster() {
  const container = document.getElementById("hk-staff-roster-list");
  if (!container) return;

  const staff = store.state.hkStaff;
  container.innerHTML = staff.map(member => {
    // Count active assigned rooms
    const activeRooms = store.state.rooms.filter(r => r.hkAttendant === member.name).length;
    return `
      <div class="staff-member-item">
        <div class="staff-avatar">${member.name.charAt(0)}</div>
        <div class="staff-details">
          <div class="staff-name">${escapeHtml(member.name)}</div>
          <div class="staff-role">${escapeHtml(member.role)} &bull; ${member.shift}</div>
        </div>
        <span class="staff-badge">${activeRooms} Rooms</span>
      </div>
    `;
  }).join("");
}

export function openHkAssignmentModal(roomNumber) {
  selectedHkRoomNumber = roomNumber;
  const room = store.state.rooms.find(r => r.number === roomNumber);
  if (!room) return;

  const modal = document.getElementById("modal-hk-assignment");
  if (!modal) return;

  document.getElementById("hk-modal-room-title").textContent = `Assign Housekeeper — Room ${room.number}`;

  const attendantSelect = document.getElementById("hk-select-attendant");
  if (attendantSelect) {
    attendantSelect.innerHTML = store.state.hkStaff.map(s => `
      <option value="${s.name}" ${room.hkAttendant === s.name ? 'selected' : ''}>${s.name} (${s.role})</option>
    `).join("");
  }

  const prioritySelect = document.getElementById("hk-select-priority");
  if (prioritySelect) {
    prioritySelect.value = room.priority || "Normal";
  }

  const notesInput = document.getElementById("hk-input-notes");
  if (notesInput) {
    notesInput.value = room.notes || "";
  }

  window.app.openModal("modal-hk-assignment");
}

function setupHkEventListeners() {
  // Filter chips
  document.querySelectorAll(".hk-filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".hk-filter-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeHkFilter = btn.dataset.filter;
      renderHkBoard();
    });
  });

  // Assignment form submit
  const form = document.getElementById("form-hk-assignment");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!selectedHkRoomNumber) return;

      const attendant = document.getElementById("hk-select-attendant").value;
      const priority = document.getElementById("hk-select-priority").value;
      const notes = document.getElementById("hk-input-notes").value;

      store.assignHousekeeper(selectedHkRoomNumber, attendant, priority, notes);
      window.app.closeModal("modal-hk-assignment");
      window.app.showToast("success", "Assignment Saved", `Room ${selectedHkRoomNumber} assigned to ${attendant} [${priority}].`);
    });
  }

  // Quick Action: Mark All Dirty Rooms In Progress / Clean
  const btnCleanAll = document.getElementById("hk-btn-clean-all");
  if (btnCleanAll) {
    btnCleanAll.addEventListener("click", () => {
      const dirtyRooms = store.state.rooms.filter(r => r.status === "Dirty");
      if (dirtyRooms.length === 0) {
        window.app.showToast("info", "No Action Needed", "All rooms are already Clean or in Maintenance.");
        return;
      }
      if (confirm(`Inspect and mark all ${dirtyRooms.length} dirty rooms as Clean?`)) {
        dirtyRooms.forEach(r => store.updateRoomStatus(r.number, "Clean"));
        window.app.playSound("chime");
        window.app.showToast("success", "Housekeeping Complete", `Turnaround finished for ${dirtyRooms.length} rooms.`);
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
