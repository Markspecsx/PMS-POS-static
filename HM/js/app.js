// js/app.js - Main Application Orchestration, Audio Synthesizer, Modal System & Routing

import { store } from './store.js';
import { initDashboard } from './dashboard.js';
import { initPms, openReservationModal, openGuestFolioModal } from './pms.js';
import { initHousekeeping } from './housekeeping.js';
import { initPos } from './pos.js';
import { initReports, openThermalReceipt, openFolioPrintout } from './reports.js';
import { initTraining } from './training.js';

class HMApplication {
  constructor() {
    this.audioCtx = null;
    this.soundMuted = false;
    this.currentModule = "dashboard";
  }

  init() {
    // Expose helpers globally
    window.app = this;
    window.pmsModule = { openReservationModal, openGuestFolioModal };
    window.reportsModule = { openThermalReceipt, openFolioPrintout };

    // Initialize all modules
    initDashboard();
    initPms();
    initHousekeeping();
    initPos();
    initReports();
    initTraining();

    this.setupNavigation();
    this.setupModalSystem();
    this.setupAudioContext();
    this.setupGlobalControls();
    this.updateTopbar();

    // Store state listener for topbar and indicators
    store.on("stateChanged", () => {
      this.updateTopbar();
    });

    console.log("HM Operations Training Simulator initialized successfully.");
  }

  // --- Navigation & Routing ---
  setupNavigation() {
    document.querySelectorAll(".nav-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        const targetModule = item.dataset.module;
        if (targetModule) {
          this.navigateTo(targetModule);
        }
      });
    });
  }

  navigateTo(moduleId) {
    this.currentModule = moduleId;

    // Update sidebar active classes
    document.querySelectorAll(".nav-item").forEach(item => {
      if (item.dataset.module === moduleId) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });

    // Update visible module views
    document.querySelectorAll(".module-view").forEach(view => {
      if (view.id === `view-${moduleId}`) {
        view.classList.add("active");
      } else {
        view.classList.remove("active");
      }
    });

    // Update Topbar page titles
    const titles = {
      dashboard: { title: "Operations & Analytics Dashboard", subtitle: "Real-time hotel occupancy, ADR, RevPAR, and front office activity" },
      pms: { title: "PMS — Front Desk & Room Management", subtitle: "Floor plan room matrix, guest reservations, check-ins, and folio settlement" },
      housekeeping: { title: "Housekeeping & Room State Dispatch", subtitle: "Hygiene tracking, room turnover cycle, and staff assignment roster" },
      pos: { title: "The Palm Court Restaurant & POS", subtitle: "F&B order terminal, table assignment, in-house room folio charging & KDS" },
      reports: { title: "Reporting Hub & Operational Exports", subtitle: "Thermal POS slip generation, formal guest invoices, and CSV data exports" },
      training: { title: "HM Training Lab & Assessment", subtitle: "Interactive operational scenario challenges, self-assessment quiz & glossary" }
    };

    const info = titles[moduleId] || { title: "HM Operations Simulator", subtitle: "Educational Sandbox" };
    const titleEl = document.getElementById("topbar-title");
    const subEl = document.getElementById("topbar-subtitle");
    if (titleEl) titleEl.innerHTML = `<i class="${this.getModuleIcon(moduleId)} text-accent"></i> ${info.title}`;
    if (subEl) subEl.textContent = info.subtitle;

    this.playSound("pop");
  }

  getModuleIcon(mod) {
    const icons = {
      dashboard: "fa-solid fa-chart-line",
      pms: "fa-solid fa-hotel",
      housekeeping: "fa-solid fa-broom",
      pos: "fa-solid fa-utensils",
      reports: "fa-solid fa-file-invoice-dollar",
      training: "fa-solid fa-graduation-cap"
    };
    return icons[mod] || "fa-solid fa-desktop";
  }

  // --- Modal System ---
  setupModalSystem() {
    // Close button click
    document.querySelectorAll(".modal-close-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const modal = btn.closest(".modal-overlay");
        if (modal) this.closeModal(modal.id);
      });
    });

    // Click outside backdrop to close
    document.querySelectorAll(".modal-overlay").forEach(modal => {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) {
          this.closeModal(modal.id);
        }
      });
    });

    // Escape key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const openModal = document.querySelector(".modal-overlay.open");
        if (openModal) this.closeModal(openModal.id);
      }
    });
  }

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("open");
      document.body.style.overflow = "hidden";
    }
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("open");
      document.body.style.overflow = "";
    }
  }

  // --- Audio Synthesizer (Web Audio API) ---
  setupAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      // AudioContext will be resumed on first user click
      document.addEventListener("click", () => {
        if (!this.audioCtx) {
          this.audioCtx = new AudioContextClass();
        } else if (this.audioCtx.state === "suspended") {
          this.audioCtx.resume();
        }
      }, { once: true });
    }
  }

  playSound(type) {
    if (this.soundMuted || !this.audioCtx) return;
    try {
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      if (type === "chime") {
        // High-end pleasant luxury bell
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
        osc.start(now);
        osc.stop(now + 0.6);
      } else if (type === "checkout") {
        // Double ding
        osc.type = "sine";
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.12); // E5
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === "checkin") {
        // Warm rising chord
        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.15);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
      } else if (type === "pop") {
        // Subtle click/tap
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === "fanfare") {
        // Success celebration
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
          const noteOsc = this.audioCtx.createOscillator();
          const noteGain = this.audioCtx.createGain();
          noteOsc.connect(noteGain);
          noteGain.connect(this.audioCtx.destination);
          noteOsc.type = "triangle";
          noteOsc.frequency.setValueAtTime(freq, now + (i * 0.1));
          noteGain.gain.setValueAtTime(0.15, now + (i * 0.1));
          noteGain.gain.exponentialRampToValueAtTime(0.001, now + (i * 0.1) + 0.4);
          noteOsc.start(now + (i * 0.1));
          noteOsc.stop(now + (i * 0.1) + 0.4);
        });
      }
    } catch (e) {
      console.warn("Audio synthesizer error:", e);
    }
  }

  // --- Toast Alerts ---
  showToast(type, title, message) {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;

    const icons = {
      success: "fa-solid fa-circle-check",
      error: "fa-solid fa-circle-xmark",
      warning: "fa-solid fa-triangle-exclamation",
      info: "fa-solid fa-circle-info"
    };

    toast.innerHTML = `
      <i class="${icons[type] || icons.info} toast-icon"></i>
      <div class="toast-content">
        <div class="toast-title">${escapeHtml(title)}</div>
        <div class="toast-message">${escapeHtml(message)}</div>
      </div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "opacity 200ms ease, transform 200ms ease";
      setTimeout(() => {
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 200);
    }, 4000);
  }

  // --- Topbar & Global Controls ---
  updateTopbar() {
    const dateEl = document.getElementById("topbar-hotel-date");
    if (dateEl) {
      dateEl.textContent = store.state.activeDate;
    }

    const metrics = store.getMetrics();
    const occEl = document.getElementById("topbar-occ-badge");
    if (occEl) {
      occEl.textContent = `${metrics.occupancyRate}% Occupancy`;
    }

    // Update dirty room count on sidebar badge
    const hkBadge = document.getElementById("nav-badge-hk");
    if (hkBadge) {
      hkBadge.textContent = metrics.dirtyRooms;
      hkBadge.style.display = metrics.dirtyRooms > 0 ? "inline-block" : "none";
    }
  }

  setupGlobalControls() {
    // Sound mute toggle button
    const btnSound = document.getElementById("topbar-btn-sound");
    if (btnSound) {
      btnSound.addEventListener("click", () => {
        this.soundMuted = !this.soundMuted;
        btnSound.innerHTML = this.soundMuted 
          ? '<i class="fa-solid fa-volume-xmark"></i>' 
          : '<i class="fa-solid fa-volume-high"></i>';
        this.showToast("info", "Sound Feedback", this.soundMuted ? "Sound muted" : "Audio cues enabled");
      });
    }

    // Reset Simulator Data button
    const btnResetSidebar = document.getElementById("btn-reset-simulator");
    const btnResetBanner = document.getElementById("banner-btn-reset");

    const handleReset = () => {
      this.openModal("modal-reset-confirm");
    };

    if (btnResetSidebar) btnResetSidebar.addEventListener("click", handleReset);
    if (btnResetBanner) btnResetBanner.addEventListener("click", handleReset);

    const btnConfirmReset = document.getElementById("btn-confirm-reset-data");
    if (btnConfirmReset) {
      btnConfirmReset.addEventListener("click", () => {
        store.resetToDefaults();
        this.closeModal("modal-reset-confirm");
        this.playSound("fanfare");
        this.showToast("success", "Simulator Reset", "Pre-populated sample guests, rooms, menu, and orders have been restored.");
      });
    }

    // Night Audit Simulation Trigger
    const btnNightAuditTop = document.getElementById("topbar-btn-night-audit");
    if (btnNightAuditTop) {
      btnNightAuditTop.addEventListener("click", () => {
        this.openNightAuditModal();
      });
    }

    // Glossary trigger
    const btnGlossary = document.getElementById("topbar-btn-glossary");
    if (btnGlossary) {
      btnGlossary.addEventListener("click", () => {
        this.navigateTo("training");
        const tabGlossary = document.getElementById("train-tab-glossary");
        if (tabGlossary) tabGlossary.click();
      });
    }
  }

  openNightAuditModal() {
    const modal = document.getElementById("modal-night-audit");
    if (!modal) return;

    const metrics = store.getMetrics();
    document.getElementById("audit-current-date").textContent = store.state.activeDate;
    document.getElementById("audit-occupied-rooms").textContent = metrics.occupiedRooms;
    document.getElementById("audit-estimated-revenue").textContent = `$${(parseFloat(metrics.occupiedRooms) * parseFloat(metrics.adr)).toFixed(2)}`;

    const btnRun = document.getElementById("btn-execute-night-audit");
    if (btnRun) {
      btnRun.onclick = () => {
        const result = store.runNightAuditSimulation();
        this.closeModal("modal-night-audit");
        this.playSound("fanfare");
        this.showToast("success", "Night Audit Complete", `Posted $${result.totalPostedRevenue.toFixed(2)} in room revenue across ${result.postedRoomsCount} rooms. Active date rolled over to ${result.nextDate}!`);
      };
    }

    this.openModal("modal-night-audit");
  }
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[m]);
}

// Bootstrap on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  const app = new HMApplication();
  app.init();
});
