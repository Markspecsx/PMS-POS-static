// js/dashboard.js - Operational Analytics & Live HM KPIs Overview

import { store } from './store.js';

export function initDashboard() {
  renderDashboardMetrics();
  renderStatusBar();
  renderActivityFeed();

  // Listen to store updates
  store.on("stateChanged", () => {
    renderDashboardMetrics();
    renderStatusBar();
    renderActivityFeed();
  });

  // Attach quick action listeners
  setupQuickActions();
}

export function renderDashboardMetrics() {
  const metrics = store.getMetrics();

  // Top metric counters
  setElementText("kpi-total-rooms", metrics.totalRooms);
  setElementText("kpi-occupied-rooms", metrics.occupiedRooms);
  setElementText("kpi-clean-rooms", metrics.cleanVacantRooms);
  setElementText("kpi-dirty-rooms", metrics.dirtyRooms);
  setElementText("kpi-ooo-rooms", metrics.oooRooms);

  // Financial & HM Metrics
  setElementText("kpi-occupancy-rate", `${metrics.occupancyRate}%`);
  setElementText("kpi-adr", `$${metrics.adr}`);
  setElementText("kpi-revpar", `$${metrics.revPar}`);
  setElementText("kpi-arrivals", metrics.arrivals);
  setElementText("kpi-departures", metrics.departures);
  setElementText("kpi-fb-revenue", `$${metrics.fbRevenue}`);
  setElementText("kpi-total-revenue", `$${metrics.totalRevenue}`);
}

export function renderStatusBar() {
  const metrics = store.getMetrics();
  const total = metrics.totalRooms || 1;

  const pctOccupied = ((metrics.occupiedRooms / total) * 100).toFixed(1);
  const pctClean = ((metrics.cleanVacantRooms / total) * 100).toFixed(1);
  const pctDirty = ((metrics.dirtyRooms / total) * 100).toFixed(1);
  const pctOOO = ((metrics.oooRooms / total) * 100).toFixed(1);

  const barOccupied = document.getElementById("bar-occupied");
  const barClean = document.getElementById("bar-clean");
  const barDirty = document.getElementById("bar-dirty");
  const barOOO = document.getElementById("bar-ooo");

  if (barOccupied) barOccupied.style.width = `${pctOccupied}%`;
  if (barClean) barClean.style.width = `${pctClean}%`;
  if (barDirty) barDirty.style.width = `${pctDirty}%`;
  if (barOOO) barOOO.style.width = `${pctOOO}%`;

  setElementText("legend-count-occupied", `${metrics.occupiedRooms} (${pctOccupied}%)`);
  setElementText("legend-count-clean", `${metrics.cleanVacantRooms} (${pctClean}%)`);
  setElementText("legend-count-dirty", `${metrics.dirtyRooms} (${pctDirty}%)`);
  setElementText("legend-count-ooo", `${metrics.oooRooms} (${pctOOO}%)`);
}

export function renderActivityFeed() {
  const container = document.getElementById("dashboard-activity-list");
  if (!container) return;

  const logs = store.state.auditLog.slice(0, 8);
  if (logs.length === 0) {
    container.innerHTML = `<div class="cart-empty-message">No operational activities logged yet.</div>`;
    return;
  }

  container.innerHTML = logs.map(log => `
    <div class="activity-item act-${log.type}">
      <span class="activity-badge">${log.type}</span>
      <div class="activity-text">${escapeHtml(log.message)}</div>
      <span class="activity-time">${log.timestamp.split(" ")[1] || log.timestamp}</span>
    </div>
  `).join("");
}

function setupQuickActions() {
  const btnFastCheckin = document.getElementById("dash-btn-fast-checkin");
  if (btnFastCheckin) {
    btnFastCheckin.addEventListener("click", () => {
      window.app.navigateTo("pms");
      // Trigger new reservation modal with immediate check-in checked
      window.pmsModule.openReservationModal({ immediateCheckIn: true });
    });
  }

  const btnNewRes = document.getElementById("dash-btn-new-res");
  if (btnNewRes) {
    btnNewRes.addEventListener("click", () => {
      window.app.navigateTo("pms");
      window.pmsModule.openReservationModal();
    });
  }

  const btnOpenPos = document.getElementById("dash-btn-pos");
  if (btnOpenPos) {
    btnOpenPos.addEventListener("click", () => {
      window.app.navigateTo("pos");
    });
  }

  const btnNightAudit = document.getElementById("dash-btn-night-audit");
  if (btnNightAudit) {
    btnNightAudit.addEventListener("click", () => {
      window.app.openNightAuditModal();
    });
  }
}

function setElementText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
