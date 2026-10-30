# The Grand Azure Hotel & Residences — HM Operations Simulator
### Property Management System (PMS) & Point of Sale (POS) Training Environment

**Educational Sandbox Environment for Hospitality Management (HM) Students & Instructors**

---

## 1. Overview & Pedagogical Purpose
The **Grand Azure Hotel Operations Simulator** bridges hospitality classroom theory with operational software practice. Designed specifically for students in **Front Office Management**, **Food & Beverage Service**, **Housekeeping Operations**, and **Hospitality Information Technology**, this simulation provides hands-on mastery of enterprise hospitality systems (mirroring industry software like *Oracle Opera PMS*, *Oracle MICROS POS*, *Cloudbeds*, and *Fidelio*).

Students experience the real-time ripple effect across hotel departments:
- **Front Desk Check-Out $\rightarrow$ Housekeeping**: Checking out an in-house guest immediately flags the room as **Dirty / Pending Housekeeping** for turn-down and sanitation.
- **Restaurant POS $\rightarrow$ Guest Ledger**: Ordering room service or dining at the restaurant allows charging directly to an active guest's room folio, automatically posting itemized debits, taxes, and service charges.
- **Night Audit**: Running the daily night audit routine posts room rates and taxes across all occupied rooms, reconciles departmental ledgers, and rolls over the operating business date.
- **Zero-Balance Accounting**: Enforces the industry standard rule that guest folios must reach exactly **$0.00** before final departure settlement.

---

## 2. Key Modules & Features

### Module A: Dashboard & Analytics Overview
- **Key Performance Indicators (KPIs)**:
  - **Occupancy Rate (%)**: $\frac{\text{Occupied Rooms}}{\text{Total Available Rooms (excluding OOO)}} \times 100$
  - **Average Daily Rate (ADR)**: $\frac{\text{Total Room Revenue}}{\text{Total Occupied Rooms}}$
  - **RevPAR (Revenue Per Available Room)**: $\text{ADR} \times \text{Occupancy Rate}$ (or $\frac{\text{Room Revenue}}{\text{Total Available Rooms}}$)
  - **Today's Arrivals & Departures Counters**
  - **Daily Total Revenue** (Rooms + F&B POS)
- **Live Room Inventory Progress Bar**: Real-time visual breakdown of Occupied, Available Clean, Dirty, and Out-of-Order (OOO) rooms.
- **Front Office & Housekeeping Feed**: Live chronological log of check-ins, room moves, POS postings, and inspection approvals.
- **Fast Action Shortcuts**: Walk-in check-in, new reservation, restaurant POS terminal, and night audit simulation.

### Module B: PMS – Front Desk & Reservation Management
- **Interactive Floor Plan Matrix**:
  - Organized by Floor (Floor 1: Standard & Superior, Floor 2: Deluxe Ocean View & Balcony, Floor 3: Executive Suites & Presidential Villa).
  - High-contrast HM status badges:
    - **Occupied** (Maroon / Red)
    - **Clean / Available** (Emerald Green)
    - **Dirty / Pending Clean** (Orange)
    - **Out of Order / Maintenance** (Slate Gray)
- **Reservation Registry**: Searchable and filterable table displaying confirmation codes, guest demographics, room assignments, stay dates, and live folio balances.
- **Reservation Engine**:
  - Form validation with ID documentation (Passport, Driver's License, National ID).
  - Built-in **double-booking prevention logic** preventing overlapping stays on the same room.
  - Option for **Immediate Walk-In Check-In**.
- **Guest Folio & Settlement Modal**:
  - Complete statement of debits (room nights, VAT, restaurant dining, minibar, laundry) and credits (advance pre-auth, cash payments, credit cards).
  - Action buttons: *Post Incidental Charge*, *Apply HM Discount (Senior/PWD 20%, Loyalty 10%)*, *Add Payment Credit*, and *Settle & Check Out Guest*.
  - Enforces zero-balance checkout rule with automatic room state transition to **Dirty**.

### Module C: Housekeeping & Room Status Dispatch
- **Turnover Management**: Filter by All, Dirty Only, Clean Only, and Maintenance (OOO).
- **Hygiene State Workflow**:
  - `Dirty / Pending` $\rightarrow$ `Cleaning in Progress / Assigned` $\rightarrow$ `Supervisor Inspected & Clean` $\rightarrow$ `Available for Arrival`.
- **Attendant Assignment**: Assign specific staff (Maria Santos, Juan Dela Cruz, Elena Rostova, David Kim) with operational priority levels (*Urgent / VIP Rush*, *High*, *Normal*).
- **Engineering / Maintenance Integration**: Mark rooms Out-of-Order (OOO) for repairs, automatically removing them from saleable room inventory.

### Module D: POS – Restaurant & Room Service System
- **The Palm Court Restaurant & Lounge**:
  - Categorized menu: Starters, Mains, Desserts, Beverages, and Wine & Cocktails.
  - Item descriptions, dietary labels (*Gluten-Free*, *Vegetarian*, *Chef Special*), and prep times.
- **Order Modes**:
  - **Dine-In**: Selectable table numbers (Tables 1 to 12).
  - **Takeaway / Lobby Bar**: Custom customer name.
  - **Room Charge / Room Service**: Dynamically populated from **currently checked-in PMS guests**, displaying room numbers and guest names.
- **Cart & Calculation**: Real-time subtotal, 12% VAT toggle, 10% Service Charge toggle, and discount options.
- **Settlement & Cash Calculator**:
  - Cash payment with interactive cash tendered and change calculator.
  - Credit Card / Digital Wallet simulation.
  - **Post to Room Folio**: Automatically routes itemized order charge to the guest's PMS folio.
- **Kitchen Display System (KDS)**:
  - 4-stage kitchen order board: `Received` $\rightarrow$ `Preparing` $\rightarrow$ `Ready for Service` $\rightarrow$ `Served / Delivered`.
  - Elapsed timers and one-click stage progression.

### Module E: Reporting, Receipts & CSV Exports
- **Thermal-Style Receipt Generator**: 80mm printable thermal POS slip with hotel letterhead, Tax TIN, ticket #, itemized dishes, tax breakdown, and simulated barcode.
- **Formal Guest Folio Statement (A4)**: Printable official hotel departure statement with letterhead, line-by-line debits/credits, and zero-balance departure seal.
- **CSV Data Export Engine**:
  1. `pms_reservations_export.csv`: Guest names, room #, stay dates, rates, total debits, payments, and balances.
  2. `pos_sales_journal.csv`: Order IDs, ticket #, order type, destination, item details, tax, and totals.
  3. `housekeeping_room_roster.csv`: Room status, floor, type, attendants, priority, and notes.
  4. `hotel_daily_manager_report.csv`: Complete Night Audit KPI summary (Occupancy %, ADR, RevPAR, Room Revenue, F&B Revenue).

### Module F: HM Training Lab & Assessment
- **Guided Operational Scenarios**:
  - **Scenario 1**: Peak Season Walk-In & Late Check-Out Negotiation.
  - **Scenario 2**: VIP Early Arrival & Housekeeping Room Rush.
  - **Scenario 3**: Restaurant Room Charge & PMS Folio Audit.
  - **Scenario 4**: Zero-Balance Folio Settlement & Guest Departure.
  - Real-time **"Verify My Progress"** engine checking actual state conditions with audio fanfare feedback upon completion.
- **Self-Assessment Quiz**: 6 comprehensive multiple-choice questions testing core Front Office, Housekeeping cycle, F&B folio accounting, and RevPAR calculations, with instant scoring and textbook explanations.
- **Hospitality Terminology Knowledge Hub**: Searchable glossary defining ADR, RevPAR, Folio, OOO, City Ledger, Skipper, Sleeper, Night Audit, and Posting.

---

## 3. Technology Stack & Architecture
- **Front-End Architecture**: Pure HTML5, Vanilla CSS3 (Custom Properties / Design Tokens), and Modern JavaScript (ES6+ Modules).
- **Zero External Framework Dependencies**: No React, Vue, Angular, or complex build steps required.
- **Iconography & Typography**: FontAwesome 6 CDN, Google Fonts (*Plus Jakarta Sans*, *Playfair Display*, *JetBrains Mono*).
- **Sound Feedback**: Built-in Web Audio API synthesizer for luxury hotel chimes, check-in tones, and fanfare alerts.
- **Data Persistence**: `localStorage` saves all state changes across reloads, with a prominent **"Reset Simulator Data"** button to restore rich pre-populated seed data at any time.

---

## 4. Running Locally & Deployment

### Running Locally with Node.js
```bash
# In the project directory:
node server.js
```
Then open your browser to: **`http://localhost:8000`**

### Running with Python
```bash
python -m http.server 8000
```
Then open your browser to: **`http://localhost:8000`**

### 1-Click Cloud Deployment
This project is 100% static and ready for instant drag-and-drop deployment:
- **Netlify**: Drag the project folder into Netlify Drop.
- **Vercel**: Deploy via Vercel CLI or link GitHub repository.
- **GitHub Pages**: Push to repository and enable GitHub Pages under Settings $\rightarrow$ Pages.

---

## 5. Educational Attribution & Licensing
*HM Operations Training Simulator — Educational Sandbox Environment (Non-Commercial)*  
Designed for Hospitality Management academic programs, front office laboratory classes, and hotel IT curriculum training.
