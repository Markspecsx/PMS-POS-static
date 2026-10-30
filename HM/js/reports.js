// js/reports.js - Thermal Receipt Printing, Folio Invoicing & CSV Export Engine

import { store } from './store.js';

export function initReports() {
  setupReportEventListeners();
}

// --- Thermal Receipt Modal Rendering ---
export function openThermalReceipt(orderId) {
  const order = store.state.orders.find(o => o.id === orderId);
  if (!order) return;

  const modal = document.getElementById("modal-thermal-receipt");
  if (!modal) return;

  const container = document.getElementById("thermal-receipt-content");
  if (!container) return;

  const hotel = store.state.hotelInfo;

  container.innerHTML = `
    <div class="thermal-slip printable-area">
      <div class="thermal-header">
        <div class="thermal-logo-name">${escapeHtml(hotel.name)}</div>
        <div class="thermal-sub">${escapeHtml(hotel.tagline)}</div>
        <div class="thermal-sub">${escapeHtml(hotel.address)}</div>
        <div class="thermal-sub">Tel: ${escapeHtml(hotel.phone)}</div>
        <div class="thermal-sub">Tax ID: ${escapeHtml(hotel.tinNumber)}</div>
      </div>

      <div class="thermal-double-divider"></div>

      <div class="thermal-meta-row">
        <span>Receipt No:</span>
        <strong>${order.ticketNumber} (${order.id})</strong>
      </div>
      <div class="thermal-meta-row">
        <span>Date & Time:</span>
        <span>${order.timestamp}</span>
      </div>
      <div class="thermal-meta-row">
        <span>Order Mode:</span>
        <span>${order.orderType}</span>
      </div>
      <div class="thermal-meta-row">
        <span>Destination:</span>
        <strong>${escapeHtml(order.destination)}</strong>
      </div>
      <div class="thermal-meta-row">
        <span>Guest / Diner:</span>
        <span>${escapeHtml(order.guestName || 'Walk-In Guest')}</span>
      </div>

      <div class="thermal-divider"></div>

      <table class="thermal-items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th style="text-align: center;">Qty</th>
            <th class="col-amt">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${order.items.map(item => `
            <tr>
              <td>${escapeHtml(item.name)}</td>
              <td style="text-align: center;">${item.qty}</td>
              <td class="col-amt">$${(item.price * item.qty).toFixed(2)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="thermal-divider"></div>

      <div class="thermal-meta-row">
        <span>Subtotal:</span>
        <span>$${Number(order.subtotal).toFixed(2)}</span>
      </div>
      ${order.discountAmount > 0 ? `
        <div class="thermal-meta-row">
          <span>Discount (${order.discountType}):</span>
          <span>-$${Number(order.discountAmount).toFixed(2)}</span>
        </div>
      ` : ""}
      <div class="thermal-meta-row">
        <span>VAT / Tax (12%):</span>
        <span>$${Number(order.tax).toFixed(2)}</span>
      </div>
      <div class="thermal-meta-row">
        <span>Service Charge (10%):</span>
        <span>$${Number(order.serviceCharge).toFixed(2)}</span>
      </div>

      <div class="thermal-double-divider"></div>

      <div class="thermal-total-row">
        <span>TOTAL CHARGED:</span>
        <span>$${Number(order.totalAmount).toFixed(2)}</span>
      </div>

      <div class="thermal-meta-row" style="margin-top: 6px;">
        <span>Payment Method:</span>
        <strong>${escapeHtml(order.paymentMethod)}</strong>
      </div>

      <div class="thermal-barcode">
        <div class="barcode-lines"></div>
        <div style="font-size: 8px; letter-spacing: 2px;">*${order.ticketNumber}-${order.id}*</div>
      </div>

      <div class="thermal-footer">
        <div>Thank you for dining at The Grand Azure!</div>
        <div>HM Educational Simulator &bull; Non-Commercial Sandbox</div>
      </div>
    </div>
  `;

  window.app.openModal("modal-thermal-receipt");
}

// --- Formal Hotel Guest Folio Statement Printout ---
export function openFolioPrintout(reservationId) {
  const res = store.state.reservations.find(r => r.id === reservationId);
  if (!res) return;

  const modal = document.getElementById("modal-folio-printout");
  if (!modal) return;

  const container = document.getElementById("folio-printout-content");
  if (!container) return;

  const hotel = store.state.hotelInfo;
  const balance = store.getFolioBalance(res.folio);
  const totalDebits = (res.folio || []).reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
  const totalCredits = (res.folio || []).reduce((sum, item) => sum + (Number(item.credit) || 0), 0);

  container.innerHTML = `
    <div class="folio-printout printable-area">
      <div class="folio-letterhead">
        <div>
          <div class="folio-hotel-name">${escapeHtml(hotel.name)}</div>
          <div style="font-size: 0.85rem; color: var(--color-text-muted);">${escapeHtml(hotel.tagline)}</div>
          <div style="font-size: 0.8rem; color: var(--color-text-muted);">${escapeHtml(hotel.address)} &bull; ${escapeHtml(hotel.phone)}</div>
          <div style="font-size: 0.75rem; color: var(--color-text-light);">TIN: ${escapeHtml(hotel.tinNumber)}</div>
        </div>
        <div>
          <div class="folio-statement-title">Guest Statement / Folio</div>
          <div style="font-family: var(--font-mono); font-weight: 700; font-size: 0.9rem;">Folio Ref: ${res.confirmationCode}</div>
          <div style="font-size: 0.78rem; color: var(--color-text-muted);">Issue Date: ${store.state.activeDate}</div>
        </div>
      </div>

      <div class="folio-details-grid">
        <div>
          <div><strong>Guest Name:</strong> ${escapeHtml(res.guestName)}</div>
          <div><strong>Contact Email:</strong> ${escapeHtml(res.email || 'N/A')}</div>
          <div><strong>Phone:</strong> ${escapeHtml(res.phone || 'N/A')}</div>
          <div><strong>ID Verification:</strong> ${escapeHtml(res.idType)}: ${escapeHtml(res.idNumber)}</div>
        </div>
        <div>
          <div><strong>Room Number:</strong> Room ${res.roomNumber} (${res.roomType})</div>
          <div><strong>Arrival Date:</strong> ${res.checkInDate}</div>
          <div><strong>Departure Date:</strong> ${res.checkOutDate}</div>
          <div><strong>Payment Guarantee:</strong> ${escapeHtml(res.paymentGuarantee)}</div>
        </div>
      </div>

      <table class="data-table" style="margin-bottom: 20px;">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description & Reference</th>
            <th>Category</th>
            <th style="text-align: right;">Charges (Debit)</th>
            <th style="text-align: right;">Credits (Payment)</th>
          </tr>
        </thead>
        <tbody>
          ${(res.folio || []).map(item => `
            <tr>
              <td>${item.date}</td>
              <td><strong>${escapeHtml(item.description)}</strong> <small style="color: var(--color-text-light);">(${item.reference})</small></td>
              <td><span class="badge badge-clean">${item.category}</span></td>
              <td style="text-align: right; color: #DC2626; font-weight: 700;">${item.debit > 0 ? '$' + item.debit.toFixed(2) : '-'}</td>
              <td style="text-align: right; color: #059669; font-weight: 700;">${item.credit > 0 ? '$' + item.credit.toFixed(2) : '-'}</td>
            </tr>
          `).join("")}
        </tbody>
        <tfoot>
          <tr style="background-color: var(--color-bg-subtle); font-weight: 800;">
            <td colspan="3" style="text-align: right;">TOTALS:</td>
            <td style="text-align: right; color: #DC2626;">$${totalDebits.toFixed(2)}</td>
            <td style="text-align: right; color: #059669;">$${totalCredits.toFixed(2)}</td>
          </tr>
        </tfoot>
      </table>

      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; background-color: var(--color-bg-subtle); border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 24px;">
        <div>
          ${Math.abs(balance) < 0.01 ? `
            <div class="folio-stamp-zero">
              <i class="fa-solid fa-stamp"></i> Folio Settled — $0.00 Zero Balance
            </div>
          ` : `
            <div style="color: #DC2626; font-weight: 800; font-size: 0.9rem;">
              <i class="fa-solid fa-clock"></i> Unsettled Account Balance Pending
            </div>
          `}
        </div>
        <div style="text-align: right;">
          <div style="font-size: 0.78rem; color: var(--color-text-muted); text-transform: uppercase;">Outstanding Balance Due</div>
          <div style="font-size: 1.5rem; font-weight: 800; font-family: var(--font-mono); color: ${Math.abs(balance) < 0.01 ? '#059669' : '#DC2626'};">
            $${balance.toFixed(2)}
          </div>
        </div>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 30px; font-size: 0.8rem; color: var(--color-text-muted);">
        <div style="border-top: 1px solid #CBD5E1; padding-top: 8px;">
          Guest Signature: _________________________________
        </div>
        <div style="border-top: 1px solid #CBD5E1; padding-top: 8px;">
          Front Office Cashier: _____________________________
        </div>
      </div>
    </div>
  `;

  window.app.openModal("modal-folio-printout");
}

// --- CSV Export Functions ---
export function exportReservationsCSV() {
  const reservations = store.state.reservations;
  const headers = ["Confirmation Code", "Guest Name", "Email", "Phone", "ID Type", "ID Number", "Room Number", "Room Type", "Check-In", "Check-Out", "Adults", "Nightly Rate", "Total Debits", "Total Credits", "Balance", "Payment Guarantee", "Status"];

  const rows = reservations.map(r => {
    const totalDebits = (r.folio || []).reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
    const totalCredits = (r.folio || []).reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
    const bal = totalDebits - totalCredits;
    return [
      `"${r.confirmationCode}"`,
      `"${r.guestName.replace(/"/g, '""')}"`,
      `"${r.email || ''}"`,
      `"${r.phone || ''}"`,
      `"${r.idType || ''}"`,
      `"${r.idNumber || ''}"`,
      `"${r.roomNumber}"`,
      `"${r.roomType}"`,
      `"${r.checkInDate}"`,
      `"${r.checkOutDate}"`,
      r.adults || 1,
      r.nightlyRate || 0,
      totalDebits.toFixed(2),
      totalCredits.toFixed(2),
      bal.toFixed(2),
      `"${r.paymentGuarantee || ''}"`,
      `"${r.status}"`
    ];
  });

  downloadCSV(`pms_reservations_export_${store.state.activeDate}.csv`, [headers, ...rows]);
  window.app.showToast("success", "Export Complete", "PMS reservations CSV generated and downloaded.");
}

export function exportPosOrdersCSV() {
  const orders = store.state.orders;
  const headers = ["Order ID", "Ticket #", "Timestamp", "Order Type", "Destination / Table", "Guest Name", "Items Summary", "Subtotal", "Discount", "Tax (12%)", "Service Charge (10%)", "Total Amount", "Payment Method", "Status"];

  const rows = orders.map(o => {
    const itemsSummary = o.items.map(i => `${i.qty}x ${i.name}`).join("; ");
    return [
      `"${o.id}"`,
      `"${o.ticketNumber}"`,
      `"${o.timestamp}"`,
      `"${o.orderType}"`,
      `"${o.destination}"`,
      `"${o.guestName || 'Walk-In'}"`,
      `"${itemsSummary.replace(/"/g, '""')}"`,
      Number(o.subtotal).toFixed(2),
      Number(o.discountAmount || 0).toFixed(2),
      Number(o.tax).toFixed(2),
      Number(o.serviceCharge).toFixed(2),
      Number(o.totalAmount).toFixed(2),
      `"${o.paymentMethod.replace(/"/g, '""')}"`,
      `"${o.status}"`
    ];
  });

  downloadCSV(`pos_sales_journal_${store.state.activeDate}.csv`, [headers, ...rows]);
  window.app.showToast("success", "Export Complete", "POS sales journal CSV generated and downloaded.");
}

export function exportHousekeepingCSV() {
  const rooms = store.state.rooms;
  const headers = ["Room Number", "Floor", "Room Type", "Bed Setup", "Nightly Rate", "Hygiene Status", "Occupancy", "Assigned Attendant", "Priority Level", "Notes"];

  const rows = rooms.map(r => [
    `"${r.number}"`,
    r.floor,
    `"${r.type}"`,
    `"${r.bed}"`,
    r.rate,
    `"${r.status}"`,
    `"${r.occupancy}"`,
    `"${r.hkAttendant || 'Unassigned'}"`,
    `"${r.priority || 'Normal'}"`,
    `"${(r.notes || '').replace(/"/g, '""')}"`
  ]);

  downloadCSV(`housekeeping_room_roster_${store.state.activeDate}.csv`, [headers, ...rows]);
  window.app.showToast("success", "Export Complete", "Housekeeping roster CSV generated.");
}

export function exportNightAuditCSV() {
  const metrics = store.getMetrics();
  const headers = ["Audit Date", "Total Rooms", "Occupied Rooms", "Clean Vacant", "Dirty Rooms", "OOO Rooms", "Occupancy Rate (%)", "ADR ($)", "RevPAR ($)", "Room Revenue ($)", "F&B Revenue ($)", "Total Hotel Revenue ($)"];

  const row = [
    `"${store.state.activeDate}"`,
    metrics.totalRooms,
    metrics.occupiedRooms,
    metrics.cleanVacantRooms,
    metrics.dirtyRooms,
    metrics.oooRooms,
    `"${metrics.occupancyRate}%"`,
    `"$${metrics.adr}"`,
    `"$${metrics.revPar}"`,
    `"$${(Number(metrics.totalRevenue) - Number(metrics.fbRevenue)).toFixed(2)}"`,
    `"$${metrics.fbRevenue}"`,
    `"$${metrics.totalRevenue}"`
  ];

  downloadCSV(`hotel_daily_manager_report_${store.state.activeDate}.csv`, [headers, row]);
  window.app.showToast("success", "Export Complete", "Daily manager night audit revenue CSV generated.");
}

function downloadCSV(filename, rows) {
  const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function setupReportEventListeners() {
  const btnExportRes = document.getElementById("btn-export-reservations-csv");
  if (btnExportRes) btnExportRes.addEventListener("click", exportReservationsCSV);

  const btnExportPos = document.getElementById("btn-export-pos-csv");
  if (btnExportPos) btnExportPos.addEventListener("click", exportPosOrdersCSV);

  const btnExportHk = document.getElementById("btn-export-hk-csv");
  if (btnExportHk) btnExportHk.addEventListener("click", exportHousekeepingCSV);

  const btnExportAudit = document.getElementById("btn-export-audit-csv");
  if (btnExportAudit) btnExportAudit.addEventListener("click", exportNightAuditCSV);

  // Print buttons for modals
  const btnPrintThermal = document.getElementById("btn-print-thermal-receipt");
  if (btnPrintThermal) {
    btnPrintThermal.addEventListener("click", () => {
      window.print();
    });
  }

  const btnPrintFolioModal = document.getElementById("btn-print-folio-statement");
  if (btnPrintFolioModal) {
    btnPrintFolioModal.addEventListener("click", () => {
      window.print();
    });
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}
