// js/store.js - State Management & LocalStorage Persistence for HM Simulator

import { 
  HOTEL_INFO, 
  INITIAL_ROOMS, 
  INITIAL_RESERVATIONS, 
  INITIAL_MENU_ITEMS, 
  INITIAL_ORDERS, 
  HK_STAFF, 
  TRAINING_SCENARIOS, 
  ASSESSMENT_QUIZ 
} from './data.js';

const STORAGE_KEY = "HM_SIMULATOR_V1_STATE";

class SimulatorStore {
  constructor() {
    this.listeners = {};
    this.state = this.loadState();
  }

  loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rooms && parsed.reservations) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to read localStorage, falling back to seed data", e);
    }
    return this.getDefaultState();
  }

  getDefaultState() {
    return {
      hotelInfo: { ...HOTEL_INFO },
      rooms: JSON.parse(JSON.stringify(INITIAL_ROOMS)),
      reservations: JSON.parse(JSON.stringify(INITIAL_RESERVATIONS)),
      menuItems: JSON.parse(JSON.stringify(INITIAL_MENU_ITEMS)),
      orders: JSON.parse(JSON.stringify(INITIAL_ORDERS)),
      hkStaff: JSON.parse(JSON.stringify(HK_STAFF)),
      activeDate: "2026-10-30",
      activeScenarioId: "SCN-1",
      scenarioProgress: {
        "SCN-1": false,
        "SCN-2": false,
        "SCN-3": false,
        "SCN-4": false
      },
      quizAnswers: {},
      quizScore: null,
      soundEnabled: true,
      auditLog: [
        { timestamp: "2026-10-30 06:00", type: "SYSTEM", message: "Morning shift opened. Night audit balanced successfully." },
        { timestamp: "2026-10-30 08:15", type: "HK", message: "Housekeeping floor assignment broadcasted to morning crew." },
        { timestamp: "2026-10-30 09:30", type: "PMS", message: "Room 103 guest departed. Room automatically flipped to Dirty." }
      ]
    };
  }

  save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      this.emit("stateChanged", this.state);
    } catch (e) {
      console.error("Failed to save state to localStorage", e);
    }
  }

  resetToDefaults() {
    this.state = this.getDefaultState();
    this.save();
    this.logAudit("SYSTEM", "Simulator database reset to factory pre-populated state.");
    this.emit("reset", this.state);
  }

  // Reactive Event Bus
  on(event, callback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
    return () => {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, payload) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => {
        try { cb(payload); } catch (err) { console.error(`Error in event listener for ${event}:`, err); }
      });
    }
  }

  logAudit(type, message) {
    const timeStr = `${this.state.activeDate} ${new Date().toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}`;
    this.state.auditLog.unshift({ timestamp: timeStr, type, message });
    if (this.state.auditLog.length > 50) this.state.auditLog.pop();
    this.save();
  }

  // --- Analytical Calculations ---
  getMetrics() {
    const totalRooms = this.state.rooms.length;
    const oooRooms = this.state.rooms.filter(r => r.status === "Maintenance" || r.occupancy === "OOO").length;
    const availableForSale = Math.max(1, totalRooms - oooRooms);
    const occupiedRooms = this.state.rooms.filter(r => r.occupancy === "Occupied").length;
    const cleanVacantRooms = this.state.rooms.filter(r => r.occupancy === "Vacant" && r.status === "Clean").length;
    const dirtyRooms = this.state.rooms.filter(r => r.status === "Dirty").length;

    // Occupancy Rate (%)
    const occupancyRate = ((occupiedRooms / availableForSale) * 100);

    // Active in-house room revenue calculation
    let totalActiveRoomRevenue = 0;
    this.state.rooms.forEach(r => {
      if (r.occupancy === "Occupied") {
        totalActiveRoomRevenue += Number(r.rate) || 0;
      }
    });

    // ADR = Room Revenue / Occupied Rooms
    const adr = occupiedRooms > 0 ? (totalActiveRoomRevenue / occupiedRooms) : 0;

    // RevPAR = Room Revenue / Total Available Rooms
    const revPar = (totalActiveRoomRevenue / availableForSale);

    // Today's Arrivals & Departures
    const today = this.state.activeDate;
    const arrivals = this.state.reservations.filter(r => r.checkInDate === today && r.status === "Reserved").length;
    const departures = this.state.reservations.filter(r => r.checkOutDate === today && r.status === "Checked-In").length;

    // F&B Today's Revenue
    const todayOrders = this.state.orders.filter(o => o.timestamp.startsWith(today));
    const fbRevenue = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

    return {
      totalRooms,
      occupiedRooms,
      cleanVacantRooms,
      dirtyRooms,
      oooRooms,
      availableForSale,
      occupancyRate: occupancyRate.toFixed(1),
      adr: adr.toFixed(2),
      revPar: revPar.toFixed(2),
      arrivals,
      departures,
      fbRevenue: fbRevenue.toFixed(2),
      totalRevenue: (totalActiveRoomRevenue + fbRevenue).toFixed(2)
    };
  }

  // --- Front Office / PMS Methods ---
  createReservation(data) {
    // Overlap validation: check if room is already booked for these dates
    const isDoubleBooked = this.state.reservations.some(r => {
      if (r.status === "Cancelled" || r.status === "Checked-Out") return false;
      if (r.roomNumber !== data.roomNumber) return false;
      // Date overlap check: (StartA <= EndB) and (EndA >= StartB)
      return (data.checkInDate < r.checkOutDate && data.checkOutDate > r.checkInDate);
    });

    if (isDoubleBooked) {
      throw new Error(`Room ${data.roomNumber} already has an active or confirmed booking during these dates. Select a different room.`);
    }

    const room = this.state.rooms.find(r => r.number === data.roomNumber);
    const nightlyRate = Number(data.nightlyRate) || (room ? room.rate : 160);

    const newRes = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      confirmationCode: `GA-${Math.floor(10000 + Math.random() * 90000)}`,
      guestName: data.guestName.trim(),
      email: data.email.trim(),
      phone: data.phone.trim(),
      idType: data.idType || "Passport",
      idNumber: data.idNumber || "N/A",
      roomNumber: data.roomNumber,
      roomType: room ? room.type : data.roomType || "Standard King",
      checkInDate: data.checkInDate,
      checkOutDate: data.checkOutDate,
      adults: Number(data.adults) || 1,
      children: Number(data.children) || 0,
      nightlyRate: nightlyRate,
      status: data.immediateCheckIn ? "Checked-In" : "Reserved",
      paymentGuarantee: data.paymentGuarantee || "Credit Card Pre-Auth",
      specialRequests: data.specialRequests || "None",
      folio: []
    };

    if (data.immediateCheckIn) {
      // Create initial room charge
      const taxAmount = Number((nightlyRate * this.state.hotelInfo.taxRate).toFixed(2));
      newRes.folio.push({
        id: `FOL-${Date.now()}-1`,
        date: this.state.activeDate,
        description: `Room Charge - 1 Night Stay (${newRes.roomType})`,
        category: "Room",
        debit: nightlyRate,
        credit: 0.00,
        reference: `CHECKIN-${newRes.roomNumber}`
      });
      newRes.folio.push({
        id: `FOL-${Date.now()}-2`,
        date: this.state.activeDate,
        description: `Occupancy Tax & VAT (12%)`,
        category: "Tax",
        debit: taxAmount,
        credit: 0.00,
        reference: `TAX-${newRes.roomNumber}`
      });

      if (room) {
        room.occupancy = "Occupied";
        room.guestId = newRes.id;
      }
    }

    this.state.reservations.unshift(newRes);
    this.logAudit("PMS", `Created reservation ${newRes.confirmationCode} for ${newRes.guestName} in Room ${newRes.roomNumber}.`);
    this.save();
    this.checkScenarios();
    return newRes;
  }

  checkInGuest(reservationId) {
    const res = this.state.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    const room = this.state.rooms.find(r => r.number === res.roomNumber);
    if (!room) throw new Error(`Room ${res.roomNumber} not found.`);

    if (room.status === "Dirty") {
      throw new Error(`Cannot check in: Room ${room.number} is currently Dirty. Housekeeping must sanitize and inspect it first.`);
    }
    if (room.status === "Maintenance" || room.occupancy === "OOO") {
      throw new Error(`Cannot check in: Room ${room.number} is Out of Order for maintenance.`);
    }
    if (room.occupancy === "Occupied" && room.guestId !== res.id) {
      throw new Error(`Cannot check in: Room ${room.number} is currently occupied by another guest.`);
    }

    res.status = "Checked-In";
    room.occupancy = "Occupied";
    room.guestId = res.id;

    // If folio is empty, post first night's room charge & tax
    if (!res.folio || res.folio.length === 0) {
      res.folio = [];
      const rate = res.nightlyRate || room.rate;
      const tax = Number((rate * this.state.hotelInfo.taxRate).toFixed(2));
      res.folio.push({
        id: `FOL-${Date.now()}-1`,
        date: this.state.activeDate,
        description: `Room Charge - Night 1 (${room.type})`,
        category: "Room",
        debit: rate,
        credit: 0.00,
        reference: `CHECKIN-${room.number}`
      });
      res.folio.push({
        id: `FOL-${Date.now()}-2`,
        date: this.state.activeDate,
        description: `Room Tax & VAT (12%)`,
        category: "Tax",
        debit: tax,
        credit: 0.00,
        reference: `TAX-${room.number}`
      });
    }

    this.logAudit("PMS", `Checked in guest ${res.guestName} into Room ${room.number}. Room is now Occupied.`);
    this.save();
    this.checkScenarios();
    return res;
  }

  checkOutGuest(reservationId, forceOverride = false) {
    const res = this.state.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    const folioBalance = this.getFolioBalance(res.folio);
    if (Math.abs(folioBalance) > 0.01 && !forceOverride) {
      throw new Error(`Folio must be settled to $0.00 before checkout! Current balance is $${folioBalance.toFixed(2)}. Apply a payment or discount first.`);
    }

    res.status = "Checked-Out";

    // AUTOMATED PMS TRIGGER: Flip room to Dirty / Vacant
    const room = this.state.rooms.find(r => r.number === res.roomNumber);
    if (room) {
      room.occupancy = "Vacant";
      room.guestId = null;
      room.status = "Dirty";
      room.priority = "High";
      room.notes = `Guest ${res.guestName} checked out at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Pending housekeeping turnover.`;
    }

    this.logAudit("PMS", `Checked out ${res.guestName} from Room ${res.roomNumber}. Automated trigger: Room ${res.roomNumber} set to Dirty / Pending HK.`);
    this.save();
    this.checkScenarios();
    return { res, room };
  }

  getFolioBalance(folio = []) {
    const totalDebits = folio.reduce((sum, item) => sum + (Number(item.debit) || 0), 0);
    const totalCredits = folio.reduce((sum, item) => sum + (Number(item.credit) || 0), 0);
    return totalDebits - totalCredits;
  }

  postFolioCharge(reservationId, { description, category, amount, reference }) {
    const res = this.state.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    const debitAmount = parseFloat(amount);
    if (isNaN(debitAmount) || debitAmount <= 0) {
      throw new Error("Charge amount must be a positive number.");
    }

    const item = {
      id: `FOL-${Date.now()}`,
      date: this.state.activeDate,
      description: description || "Incidental Charge",
      category: category || "Incidentals",
      debit: debitAmount,
      credit: 0.00,
      reference: reference || `INC-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (!res.folio) res.folio = [];
    res.folio.push(item);

    this.logAudit("PMS", `Posted ${item.category} charge of $${debitAmount.toFixed(2)} (${item.description}) to Room ${res.roomNumber} (${res.guestName}).`);
    this.save();
    this.checkScenarios();
    return item;
  }

  addFolioPayment(reservationId, { description, amount, paymentMethod, reference }) {
    const res = this.state.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    const creditAmount = parseFloat(amount);
    if (isNaN(creditAmount) || creditAmount <= 0) {
      throw new Error("Payment amount must be greater than zero.");
    }

    const item = {
      id: `FOL-${Date.now()}`,
      date: this.state.activeDate,
      description: `${paymentMethod || 'Payment'} - ${description || 'Folio Settlement'}`,
      category: "Payment",
      debit: 0.00,
      credit: creditAmount,
      reference: reference || `PAY-${Math.floor(1000 + Math.random() * 9000)}`
    };

    if (!res.folio) res.folio = [];
    res.folio.push(item);

    this.logAudit("PMS", `Processed payment of $${creditAmount.toFixed(2)} via ${paymentMethod} on Room ${res.roomNumber} folio.`);
    this.save();
    this.checkScenarios();
    return item;
  }

  applyFolioDiscount(reservationId, { discountName, percentage, fixedAmount }) {
    const res = this.state.reservations.find(r => r.id === reservationId);
    if (!res) throw new Error("Reservation not found.");

    let discountVal = 0;
    const currentBalance = this.getFolioBalance(res.folio);

    if (percentage) {
      discountVal = parseFloat((currentBalance * (percentage / 100)).toFixed(2));
    } else if (fixedAmount) {
      discountVal = parseFloat(fixedAmount);
    }

    if (discountVal <= 0) throw new Error("Invalid discount calculation.");

    const item = {
      id: `FOL-${Date.now()}`,
      date: this.state.activeDate,
      description: `Discount: ${discountName} (${percentage ? percentage + '%' : '$' + discountVal})`,
      category: "Adjustment",
      debit: 0.00,
      credit: discountVal,
      reference: `DISC-${Math.floor(1000 + Math.random() * 9000)}`
    };

    res.folio.push(item);
    this.logAudit("PMS", `Applied discount '${discountName}' of $${discountVal.toFixed(2)} to Room ${res.roomNumber}.`);
    this.save();
    return item;
  }

  // --- Housekeeping Operations ---
  updateRoomStatus(roomNumber, newStatus) {
    const room = this.state.rooms.find(r => r.number === roomNumber);
    if (!room) throw new Error("Room not found.");

    const oldStatus = room.status;
    room.status = newStatus;

    if (newStatus === "Maintenance") {
      room.occupancy = "OOO";
    } else if (newStatus === "Clean" && room.occupancy === "OOO") {
      room.occupancy = "Vacant";
    }

    this.logAudit("HK", `Room ${room.number} status updated from ${oldStatus} to ${newStatus}.`);
    this.save();
    this.checkScenarios();
    return room;
  }

  assignHousekeeper(roomNumber, attendantName, priority, notes) {
    const room = this.state.rooms.find(r => r.number === roomNumber);
    if (!room) throw new Error("Room not found.");

    if (attendantName) room.hkAttendant = attendantName;
    if (priority) room.priority = priority;
    if (notes !== undefined) room.notes = notes;

    this.logAudit("HK", `Room ${room.number} assigned to ${room.hkAttendant} [Priority: ${room.priority}].`);
    this.save();
    this.checkScenarios();
    return room;
  }

  // --- POS Operations ---
  createPosOrder(orderData) {
    const ticketId = `TK-${Math.floor(100 + Math.random() * 900)}`;
    const orderId = `ORD-${Date.now().toString().slice(-4)}`;

    const newOrder = {
      id: orderId,
      ticketNumber: ticketId,
      timestamp: `${this.state.activeDate} ${new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}`,
      orderType: orderData.orderType, // 'Dine-In', 'Takeaway', 'Room Service'
      destination: orderData.destination, // 'Table 3', 'Room 104', 'Lobby'
      items: orderData.items,
      subtotal: orderData.subtotal,
      tax: orderData.tax,
      serviceCharge: orderData.serviceCharge,
      discountAmount: orderData.discountAmount || 0,
      discountType: orderData.discountType || "None",
      totalAmount: orderData.totalAmount,
      paymentMethod: orderData.paymentMethod,
      roomNumber: orderData.roomNumber || null,
      guestName: orderData.guestName || "Walk-In Diner",
      status: "Preparing",
      kdsStatus: "Received"
    };

    // If payment method is "Charge to Room", automatically post to PMS folio!
    if (orderData.orderType === "Room Service" || orderData.paymentMethod.includes("Room") || orderData.roomNumber) {
      if (orderData.roomNumber) {
        const res = this.state.reservations.find(r => r.roomNumber === orderData.roomNumber && r.status === "Checked-In");
        if (!res) {
          throw new Error(`Cannot charge to Room ${orderData.roomNumber}: No active checked-in guest found.`);
        }

        // Post debit to guest folio
        const itemSummary = orderData.items.map(i => `${i.qty}x ${i.name}`).join(", ");
        const chargeItem = {
          id: `FOL-POS-${Date.now()}`,
          date: this.state.activeDate,
          description: `POS Restaurant Charge: ${orderData.destination} (${itemSummary})`,
          category: "F&B",
          debit: orderData.totalAmount,
          credit: 0.00,
          reference: `POS-${orderId}`
        };

        if (!res.folio) res.folio = [];
        res.folio.push(chargeItem);

        this.logAudit("POS", `Room Charge: Posted $${orderData.totalAmount.toFixed(2)} from POS ${ticketId} directly to Room ${res.roomNumber} (${res.guestName}) folio.`);
      }
    }

    this.state.orders.unshift(newOrder);
    this.logAudit("POS", `New POS Order ${ticketId} (${newOrder.orderType}) placed: Total $${newOrder.totalAmount.toFixed(2)}.`);
    this.save();
    this.checkScenarios();
    return newOrder;
  }

  advanceKdsStatus(orderId) {
    const order = this.state.orders.find(o => o.id === orderId);
    if (!order) return;

    if (order.kdsStatus === "Received") {
      order.kdsStatus = "Preparing";
      order.status = "Preparing";
    } else if (order.kdsStatus === "Preparing") {
      order.kdsStatus = "Ready";
      order.status = "Ready for Service";
    } else if (order.kdsStatus === "Ready") {
      order.kdsStatus = "Completed";
      order.status = "Served";
    }

    this.logAudit("KDS", `Kitchen Order ${order.ticketNumber} updated to status: ${order.kdsStatus}.`);
    this.save();
    return order;
  }

  // --- Night Audit Simulation ---
  runNightAuditSimulation() {
    let totalPostedRevenue = 0;
    let postedRoomsCount = 0;

    // For every checked-in room, post room rate + tax
    this.state.rooms.forEach(room => {
      if (room.occupancy === "Occupied" && room.guestId) {
        const res = this.state.reservations.find(r => r.id === room.guestId);
        if (res && res.status === "Checked-In") {
          const rate = res.nightlyRate || room.rate;
          const tax = Number((rate * this.state.hotelInfo.taxRate).toFixed(2));

          res.folio.push({
            id: `FOL-AUDIT-${Date.now()}-${room.number}-1`,
            date: this.state.activeDate,
            description: `Night Audit Room Posting - Stay Charge (${room.type})`,
            category: "Room",
            debit: rate,
            credit: 0.00,
            reference: `AUDIT-${this.state.activeDate}`
          });

          res.folio.push({
            id: `FOL-AUDIT-${Date.now()}-${room.number}-2`,
            date: this.state.activeDate,
            description: `Room Tax & Municipal VAT (12%)`,
            category: "Tax",
            debit: tax,
            credit: 0.00,
            reference: `TAX-${this.state.activeDate}`
          });

          totalPostedRevenue += rate;
          postedRoomsCount++;
        }
      }
    });

    // Advance hotel active date by +1 day
    const currentDate = new Date(this.state.activeDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const nextDate = currentDate.toISOString().split('T')[0];
    const previousDate = this.state.activeDate;
    this.state.activeDate = nextDate;

    this.logAudit("NIGHT-AUDIT", `Night Audit completed for ${previousDate}. Posted room charges across ${postedRoomsCount} occupied rooms ($${totalPostedRevenue.toFixed(2)}). System rolled over to ${nextDate}.`);
    this.save();
    this.checkScenarios();

    return {
      previousDate,
      nextDate,
      postedRoomsCount,
      totalPostedRevenue
    };
  }

  // --- Training Scenarios Engine ---
  checkScenarios() {
    let updated = false;
    TRAINING_SCENARIOS.forEach(scn => {
      if (!this.state.scenarioProgress[scn.id]) {
        try {
          if (scn.checkSuccess(this.state)) {
            this.state.scenarioProgress[scn.id] = true;
            updated = true;
            this.logAudit("TRAINING", `Achievement unlocked: Student successfully completed ${scn.title}!`);
            this.emit("scenarioCompleted", scn);
          }
        } catch (e) {
          console.error("Scenario checker error:", e);
        }
      }
    });
    if (updated) this.save();
  }

  submitQuiz(answers) {
    let score = 0;
    const results = ASSESSMENT_QUIZ.map(q => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) score++;
      return {
        id: q.id,
        question: q.question,
        selected,
        correctIndex: q.correctIndex,
        isCorrect,
        explanation: q.explanation
      };
    });

    const percent = Math.round((score / ASSESSMENT_QUIZ.length) * 100);
    this.state.quizAnswers = answers;
    this.state.quizScore = { score, total: ASSESSMENT_QUIZ.length, percent, results };
    this.logAudit("TRAINING", `Student completed HM Assessment Quiz with score ${score}/${ASSESSMENT_QUIZ.length} (${percent}%).`);
    this.save();
    return this.state.quizScore;
  }
}

export const store = new SimulatorStore();
