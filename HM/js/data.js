// js/data.js - Default Seed Data for HM Operations Training Simulator

export const HOTEL_INFO = {
  name: "The Grand Azure Hotel & Residences",
  tagline: "Luxury Hospitality & Conference Suites",
  address: "742 Bayside Boulevard, Marina District",
  phone: "+1 (555) 839-4000",
  email: "frontdesk@grandazurehotel.edu",
  taxRate: 0.12, // 12% VAT / Room Tax
  serviceChargeRate: 0.10, // 10% Service Charge
  currency: "$",
  tinNumber: "TIN-908-234-118-HM"
};

export const INITIAL_ROOMS = [
  // Floor 1 - Standard & Superior Category
  { id: "101", number: "101", floor: 1, type: "Standard King", bed: "1 King Bed", rate: 160, maxOccupancy: 2, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Quiet courtyard view", hkAttendant: "Maria Santos", priority: "Normal" },
  { id: "102", number: "102", floor: 1, type: "Standard King", bed: "1 King Bed", rate: 160, maxOccupancy: 2, status: "Clean", occupancy: "Occupied", guestId: "RES-1001", notes: "Near elevator, guest requested extra pillow", hkAttendant: "Maria Santos", priority: "Normal" },
  { id: "103", number: "103", floor: 1, type: "Standard Twin", bed: "2 Twin Beds", rate: 150, maxOccupancy: 2, status: "Dirty", occupancy: "Vacant", guestId: null, notes: "Checkout occurred at 10:15 AM - pending turn", hkAttendant: "Juan Dela Cruz", priority: "High" },
  { id: "104", number: "104", floor: 1, type: "Standard Twin", bed: "2 Twin Beds", rate: 150, maxOccupancy: 2, status: "Clean", occupancy: "Occupied", guestId: "RES-1002", notes: "HM Educational Guest VIP", hkAttendant: "Maria Santos", priority: "Normal" },
  { id: "105", number: "105", floor: 1, type: "Standard King", bed: "1 King Bed", rate: 160, maxOccupancy: 2, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Inspected & ready for walk-in", hkAttendant: "Elena Rostova", priority: "Normal" },
  { id: "106", number: "106", floor: 1, type: "Superior King", bed: "1 King Bed", rate: 185, maxOccupancy: 2, status: "Dirty", occupancy: "Vacant", guestId: null, notes: "Deep sanitation required", hkAttendant: "Elena Rostova", priority: "High" },
  { id: "107", number: "107", floor: 1, type: "Superior Twin", bed: "2 Twin Beds", rate: 180, maxOccupancy: 2, status: "Clean", occupancy: "Occupied", guestId: "RES-1003", notes: "Long stay corporate guest", hkAttendant: "Juan Dela Cruz", priority: "Normal" },
  { id: "108", number: "108", floor: 1, type: "Superior King", bed: "1 King Bed", rate: 185, maxOccupancy: 2, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Connecting room with 107", hkAttendant: "Maria Santos", priority: "Normal" },

  // Floor 2 - Deluxe Category
  { id: "201", number: "201", floor: 2, type: "Deluxe Ocean View", bed: "1 King Bed", rate: 260, maxOccupancy: 2, status: "Dirty", occupancy: "Vacant", guestId: null, notes: "VIP arriving early at 12:00 PM - RUSH CLEAN", hkAttendant: "Unassigned", priority: "Urgent" },
  { id: "202", number: "202", floor: 2, type: "Deluxe Ocean View", bed: "1 King Bed", rate: 260, maxOccupancy: 2, status: "Clean", occupancy: "Occupied", guestId: "RES-1004", notes: "Balcony garden facing bay", hkAttendant: "Elena Rostova", priority: "Normal" },
  { id: "203", number: "203", floor: 2, type: "Deluxe Twin", bed: "2 Queen Beds", rate: 240, maxOccupancy: 4, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Family setup prepared", hkAttendant: "Juan Dela Cruz", priority: "Normal" },
  { id: "204", number: "204", floor: 2, type: "Deluxe Ocean View", bed: "1 King Bed", rate: 260, maxOccupancy: 2, status: "Clean", occupancy: "Occupied", guestId: "RES-1005", notes: "Anniversary package requested", hkAttendant: "Maria Santos", priority: "Normal" },
  { id: "205", number: "205", floor: 2, type: "Deluxe Balcony", bed: "1 King Bed", rate: 275, maxOccupancy: 2, status: "Clean", occupancy: "Occupied", guestId: "RES-1006", notes: "DND sign hung intermittently", hkAttendant: "Maria Santos", priority: "Normal" },
  { id: "206", number: "206", floor: 2, type: "Deluxe Twin", bed: "2 Queen Beds", rate: 240, maxOccupancy: 4, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Fresh linens stocked", hkAttendant: "Elena Rostova", priority: "Normal" },
  { id: "207", number: "207", floor: 2, type: "Deluxe Balcony", bed: "1 King Bed", rate: 275, maxOccupancy: 2, status: "Maintenance", occupancy: "OOO", guestId: null, notes: "HVAC cooling compressor repair", hkAttendant: "David Kim", priority: "Urgent" },
  { id: "208", number: "208", floor: 2, type: "Deluxe Balcony", bed: "1 King Bed", rate: 275, maxOccupancy: 2, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Ready for arrival", hkAttendant: "Juan Dela Cruz", priority: "Normal" },

  // Floor 3 - Executive Suites & Luxury Penthouse
  { id: "301", number: "301", floor: 3, type: "Executive Suite", bed: "1 King + Parlor", rate: 420, maxOccupancy: 3, status: "Clean", occupancy: "Occupied", guestId: "RES-1007", notes: "Complimentary club lounge access", hkAttendant: "Elena Rostova", priority: "Normal" },
  { id: "302", number: "302", floor: 3, type: "Executive Suite", bed: "1 King + Parlor", rate: 420, maxOccupancy: 3, status: "Clean", occupancy: "Occupied", guestId: "RES-1008", notes: "Due out today at 12:00 PM", hkAttendant: "Maria Santos", priority: "High" },
  { id: "303", number: "303", floor: 3, type: "Executive Suite", bed: "1 King + Parlor", rate: 420, maxOccupancy: 3, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Club floor privileges included", hkAttendant: "Elena Rostova", priority: "Normal" },
  { id: "304", number: "304", floor: 3, type: "Grand Sea Suite", bed: "1 Super King", rate: 550, maxOccupancy: 4, status: "Clean", occupancy: "Occupied", guestId: "RES-1009", notes: "VIP Diplomatic guest", hkAttendant: "Juan Dela Cruz", priority: "Normal" },
  { id: "305", number: "305", floor: 3, type: "Grand Sea Suite", bed: "1 Super King", rate: 550, maxOccupancy: 4, status: "Dirty", occupancy: "Vacant", guestId: null, notes: "Turndown & deep clean needed", hkAttendant: "Maria Santos", priority: "High" },
  { id: "306", number: "306", floor: 3, type: "Executive Suite", bed: "1 King + Parlor", rate: 420, maxOccupancy: 3, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Equipped with espresso bar", hkAttendant: "Elena Rostova", priority: "Normal" },
  { id: "307", number: "307", floor: 3, type: "Presidential Villa", bed: "2 Master Suites", rate: 850, maxOccupancy: 6, status: "Clean", occupancy: "Occupied", guestId: "RES-1010", notes: "Dedicated butler service assigned", hkAttendant: "Maria Santos", priority: "Normal" },
  { id: "308", number: "308", floor: 3, type: "Presidential Villa", bed: "2 Master Suites", rate: 850, maxOccupancy: 6, status: "Clean", occupancy: "Vacant", guestId: null, notes: "Private terrace plunge pool inspected", hkAttendant: "Elena Rostova", priority: "Normal" }
];

export const INITIAL_RESERVATIONS = [
  {
    id: "RES-1001",
    confirmationCode: "GA-89210",
    guestName: "Alexander Wright",
    email: "a.wright@solardynamics.com",
    phone: "+1 (555) 234-5678",
    idType: "Passport",
    idNumber: "P98745210",
    roomNumber: "102",
    roomType: "Standard King",
    checkInDate: "2026-10-29",
    checkOutDate: "2026-10-31",
    adults: 1,
    children: 0,
    nightlyRate: 160,
    status: "Checked-In",
    paymentGuarantee: "Credit Card (Pre-Auth $500)",
    specialRequests: "Quiet room away from elevator, extra foam pillows",
    folio: [
      { id: "FOL-101", date: "2026-10-29", description: "Room Charge - Night 1", category: "Room", debit: 160.00, credit: 0.00, reference: "NIGHT-AUDIT-1029" },
      { id: "FOL-102", date: "2026-10-29", description: "Occupancy Tax & VAT (12%)", category: "Tax", debit: 19.20, credit: 0.00, reference: "TAX-1029" },
      { id: "FOL-103", date: "2026-10-29", description: "Advance CC Deposit Authorization", category: "Payment", debit: 0.00, credit: 179.20, reference: "CC-PREAUTH-4091" },
      { id: "FOL-104", date: "2026-10-30", description: "Mini Bar - Sparkling Water & Nuts", category: "Incidentals", debit: 18.50, credit: 0.00, reference: "MINIBAR-102" }
    ]
  },
  {
    id: "RES-1002",
    confirmationCode: "GA-89211",
    guestName: "Sophia Chen",
    email: "sophia.chen@globalhm.edu",
    phone: "+1 (555) 345-6789",
    idType: "Driver's License",
    idNumber: "DL-CA-4091882",
    roomNumber: "104",
    roomType: "Standard Twin",
    checkInDate: "2026-10-30",
    checkOutDate: "2026-11-02",
    adults: 2,
    children: 0,
    nightlyRate: 150,
    status: "Checked-In",
    paymentGuarantee: "Corporate Direct Bill",
    specialRequests: "Twin beds confirmed, high floor preferred next stay",
    folio: [
      { id: "FOL-201", date: "2026-10-30", description: "Room Charge - Night 1", category: "Room", debit: 150.00, credit: 0.00, reference: "CHECKIN-104" },
      { id: "FOL-202", date: "2026-10-30", description: "Occupancy Tax & VAT (12%)", category: "Tax", debit: 18.00, credit: 0.00, reference: "TAX-1030" }
    ]
  },
  {
    id: "RES-1003",
    confirmationCode: "GA-89212",
    guestName: "Marcus Sterling",
    email: "m.sterling@sterlingholdings.co",
    phone: "+1 (555) 456-7890",
    idType: "Passport",
    idNumber: "GBR-7729104",
    roomNumber: "107",
    roomType: "Superior Twin",
    checkInDate: "2026-10-28",
    checkOutDate: "2026-11-01",
    adults: 2,
    children: 0,
    nightlyRate: 180,
    status: "Checked-In",
    paymentGuarantee: "Credit Card (Amex **** 3004)",
    specialRequests: "Airport transfer scheduled for departure",
    folio: [
      { id: "FOL-301", date: "2026-10-28", description: "Room Charge - Night 1", category: "Room", debit: 180.00, credit: 0.00, reference: "NIGHT-AUDIT-1028" },
      { id: "FOL-302", date: "2026-10-28", description: "Taxes & Service Fee", category: "Tax", debit: 21.60, credit: 0.00, reference: "TAX-1028" },
      { id: "FOL-303", date: "2026-10-29", description: "Room Charge - Night 2", category: "Room", debit: 180.00, credit: 0.00, reference: "NIGHT-AUDIT-1029" },
      { id: "FOL-304", date: "2026-10-29", description: "Taxes & Service Fee", category: "Tax", debit: 21.60, credit: 0.00, reference: "TAX-1029" },
      { id: "FOL-305", date: "2026-10-29", description: "POS Palm Court Dining - Order #1001", category: "F&B", debit: 74.50, credit: 0.00, reference: "POS-1001" },
      { id: "FOL-306", date: "2026-10-29", description: "Partial CC Payment", category: "Payment", debit: 0.00, credit: 400.00, reference: "CC-AMEX-3004" }
    ]
  },
  {
    id: "RES-1004",
    confirmationCode: "GA-89213",
    guestName: "Isabella Rossi",
    email: "i.rossi@milano-atelier.it",
    phone: "+1 (555) 567-8901",
    idType: "Passport",
    idNumber: "IT-8841029",
    roomNumber: "202",
    roomType: "Deluxe Ocean View",
    checkInDate: "2026-10-29",
    checkOutDate: "2026-10-31",
    adults: 2,
    children: 1,
    nightlyRate: 260,
    status: "Checked-In",
    paymentGuarantee: "Credit Card (Visa **** 8821)",
    specialRequests: "Crib in room, ocean view high floor confirmed",
    folio: [
      { id: "FOL-401", date: "2026-10-29", description: "Room Charge - Night 1", category: "Room", debit: 260.00, credit: 0.00, reference: "NIGHT-AUDIT-1029" },
      { id: "FOL-402", date: "2026-10-29", description: "Occupancy Tax & VAT (12%)", category: "Tax", debit: 31.20, credit: 0.00, reference: "TAX-1029" },
      { id: "FOL-403", date: "2026-10-30", description: "Room Service Breakfast - Order #1002", category: "F&B", debit: 52.00, credit: 0.00, reference: "POS-1002" }
    ]
  },
  {
    id: "RES-1005",
    confirmationCode: "GA-89214",
    guestName: "Dr. David Vance",
    email: "david.vance@stanfordmed.org",
    phone: "+1 (555) 678-9012",
    idType: "National ID",
    idNumber: "US-SSN-9024",
    roomNumber: "204",
    roomType: "Deluxe Ocean View",
    checkInDate: "2026-10-30",
    checkOutDate: "2026-11-03",
    adults: 2,
    children: 0,
    nightlyRate: 260,
    status: "Checked-In",
    paymentGuarantee: "Mastercard (**** 5519)",
    specialRequests: "Anniversary setup - complimentary champagne requested",
    folio: [
      { id: "FOL-501", date: "2026-10-30", description: "Room Charge - Night 1", category: "Room", debit: 260.00, credit: 0.00, reference: "CHECKIN-204" },
      { id: "FOL-502", date: "2026-10-30", description: "Occupancy Tax & VAT (12%)", category: "Tax", debit: 31.20, credit: 0.00, reference: "TAX-1030" }
    ]
  },
  {
    id: "RES-1006",
    confirmationCode: "GA-89215",
    guestName: "Emily Watson",
    email: "emily.watson@horizontech.io",
    phone: "+1 (555) 789-0123",
    idType: "Driver's License",
    idNumber: "DL-NY-992384",
    roomNumber: "205",
    roomType: "Deluxe Balcony",
    checkInDate: "2026-10-27",
    checkOutDate: "2026-10-31",
    adults: 1,
    children: 0,
    nightlyRate: 275,
    status: "Checked-In",
    paymentGuarantee: "Company Amex Corporate",
    specialRequests: "Late check-out 1:00 PM pre-approved",
    folio: [
      { id: "FOL-601", date: "2026-10-27", description: "Room Charge - Night 1", category: "Room", debit: 275.00, credit: 0.00, reference: "NIGHT-1027" },
      { id: "FOL-602", date: "2026-10-28", description: "Room Charge - Night 2", category: "Room", debit: 275.00, credit: 0.00, reference: "NIGHT-1028" },
      { id: "FOL-603", date: "2026-10-29", description: "Room Charge - Night 3", category: "Room", debit: 275.00, credit: 0.00, reference: "NIGHT-1029" },
      { id: "FOL-604", date: "2026-10-29", description: "Taxes Cumulative (12%)", category: "Tax", debit: 99.00, credit: 0.00, reference: "TAX-CUMULATIVE" },
      { id: "FOL-605", date: "2026-10-29", description: "Corporate Direct Credit", category: "Payment", debit: 0.00, credit: 924.00, reference: "CORP-PAY-881" }
    ]
  },
  {
    id: "RES-1007",
    confirmationCode: "GA-89216",
    guestName: "Jonathan Drake",
    email: "j.drake@atlasinvest.com",
    phone: "+1 (555) 890-1234",
    idType: "Passport",
    idNumber: "P-449102",
    roomNumber: "301",
    roomType: "Executive Suite",
    checkInDate: "2026-10-30",
    checkOutDate: "2026-11-04",
    adults: 2,
    children: 0,
    nightlyRate: 420,
    status: "Checked-In",
    paymentGuarantee: "Credit Card (Visa **** 1120)",
    specialRequests: "Executive lounge key required, non-feather bedding",
    folio: [
      { id: "FOL-701", date: "2026-10-30", description: "Room Charge - Night 1", category: "Room", debit: 420.00, credit: 0.00, reference: "CHECKIN-301" },
      { id: "FOL-702", date: "2026-10-30", description: "Suite Luxury Tax & VAT (12%)", category: "Tax", debit: 50.40, credit: 0.00, reference: "TAX-1030" }
    ]
  },
  {
    id: "RES-1008",
    confirmationCode: "GA-89217",
    guestName: "Lady Beatrice Montgomery",
    email: "beatrice.m@montgomery.co.uk",
    phone: "+44 20 7946 0912",
    idType: "Passport",
    idNumber: "UK-5501923",
    roomNumber: "302",
    roomType: "Executive Suite",
    checkInDate: "2026-10-27",
    checkOutDate: "2026-10-30",
    adults: 1,
    children: 0,
    nightlyRate: 420,
    status: "Checked-In",
    paymentGuarantee: "Credit Card (Mastercard **** 9012)",
    specialRequests: "Late departure requested, Earl Grey tea in suite",
    folio: [
      { id: "FOL-801", date: "2026-10-27", description: "Room Charge - Night 1", category: "Room", debit: 420.00, credit: 0.00, reference: "NIGHT-1027" },
      { id: "FOL-802", date: "2026-10-28", description: "Room Charge - Night 2", category: "Room", debit: 420.00, credit: 0.00, reference: "NIGHT-1028" },
      { id: "FOL-803", date: "2026-10-29", description: "Room Charge - Night 3", category: "Room", debit: 420.00, credit: 0.00, reference: "NIGHT-1029" },
      { id: "FOL-804", date: "2026-10-29", description: "Suite Taxes (12%)", category: "Tax", debit: 151.20, credit: 0.00, reference: "TAX-1029" },
      { id: "FOL-805", date: "2026-10-29", description: "Executive Laundry Service", category: "Incidentals", debit: 45.00, credit: 0.00, reference: "LAUNDRY-302" },
      { id: "FOL-806", date: "2026-10-29", description: "Pre-Payment Credit Card", category: "Payment", debit: 0.00, credit: 1400.00, reference: "PAY-CC-9012" }
    ]
  },
  {
    id: "RES-1009",
    confirmationCode: "GA-89218",
    guestName: "Ambassador Kenji Sato",
    email: "k.sato@embassy-tokyo.jp",
    phone: "+81 3 5555 0142",
    idType: "Diplomatic Passport",
    idNumber: "DIP-JPN-00192",
    roomNumber: "304",
    roomType: "Grand Sea Suite",
    checkInDate: "2026-10-30",
    checkOutDate: "2026-11-05",
    adults: 2,
    children: 0,
    nightlyRate: 550,
    status: "Checked-In",
    paymentGuarantee: "Diplomatic Credit Letter",
    specialRequests: "Strict security protocol, green tea selection",
    folio: [
      { id: "FOL-901", date: "2026-10-30", description: "Room Charge - Night 1", category: "Room", debit: 550.00, credit: 0.00, reference: "CHECKIN-304" },
      { id: "FOL-902", date: "2026-10-30", description: "Luxury Tax & VAT (12%)", category: "Tax", debit: 66.00, credit: 0.00, reference: "TAX-1030" }
    ]
  },
  {
    id: "RES-1010",
    confirmationCode: "GA-89219",
    guestName: "Carlos Gutierrez & Family",
    email: "carlos.g@solargroup.mx",
    phone: "+52 55 1234 5678",
    idType: "Passport",
    idNumber: "MEX-991204",
    roomNumber: "307",
    roomType: "Presidential Villa",
    checkInDate: "2026-10-28",
    checkOutDate: "2026-11-02",
    adults: 4,
    children: 2,
    nightlyRate: 850,
    status: "Checked-In",
    paymentGuarantee: "Credit Card (Visa Infinite **** 0088)",
    specialRequests: "Private chef BBQ reservation, pool heating active",
    folio: [
      { id: "FOL-1001", date: "2026-10-28", description: "Room Charge - Night 1", category: "Room", debit: 850.00, credit: 0.00, reference: "NIGHT-1028" },
      { id: "FOL-1002", date: "2026-10-29", description: "Room Charge - Night 2", category: "Room", debit: 850.00, credit: 0.00, reference: "NIGHT-1029" },
      { id: "FOL-1003", date: "2026-10-29", description: "Villa VAT & Municipality Tax (12%)", category: "Tax", debit: 204.00, credit: 0.00, reference: "TAX-1029" },
      { id: "FOL-1004", date: "2026-10-29", description: "POS Palm Court Dinner - Order #1003", category: "F&B", debit: 185.00, credit: 0.00, reference: "POS-1003" },
      { id: "FOL-1005", date: "2026-10-29", description: "Credit Card Advance Deposit", category: "Payment", debit: 0.00, credit: 2000.00, reference: "CC-VISA-0088" }
    ]
  },
  // Upcoming / Confirmed Reservations
  {
    id: "RES-1011",
    confirmationCode: "GA-89220",
    guestName: "Natalie Portman-Smith",
    email: "natalie.p@smithassociates.com",
    phone: "+1 (555) 912-3456",
    idType: "Passport",
    idNumber: "US-8829103",
    roomNumber: "201",
    roomType: "Deluxe Ocean View",
    checkInDate: "2026-10-30",
    checkOutDate: "2026-11-02",
    adults: 1,
    children: 0,
    nightlyRate: 260,
    status: "Reserved",
    paymentGuarantee: "Credit Card (Mastercard **** 4421)",
    specialRequests: "Early check-in 11:30 AM requested (VIP Gold Tier)",
    folio: []
  },
  {
    id: "RES-1012",
    confirmationCode: "GA-89221",
    guestName: "Robert & Clara Jenkins",
    email: "robert.jenkins@gmail.com",
    phone: "+1 (555) 123-9876",
    idType: "Driver's License",
    idNumber: "DL-TX-99014",
    roomNumber: "105",
    roomType: "Standard King",
    checkInDate: "2026-10-30",
    checkOutDate: "2026-11-01",
    adults: 2,
    children: 0,
    nightlyRate: 160,
    status: "Reserved",
    paymentGuarantee: "Cash Deposit on Arrival",
    specialRequests: "Anniversary weekend getaway",
    folio: []
  },
  {
    id: "RES-1013",
    confirmationCode: "GA-89222",
    guestName: "Prof. Arthur Pendelton",
    email: "pendelton.a@oxford.ac.uk",
    phone: "+44 1865 270000",
    idType: "Passport",
    idNumber: "UK-9021948",
    roomNumber: "303",
    roomType: "Executive Suite",
    checkInDate: "2026-10-31",
    checkOutDate: "2026-11-04",
    adults: 1,
    children: 0,
    nightlyRate: 420,
    status: "Reserved",
    paymentGuarantee: "University Grant Card",
    specialRequests: "Desk with reading lamp, high-speed wired internet",
    folio: []
  }
];

export const INITIAL_MENU_ITEMS = [
  // Starters
  {
    id: "M-STARTER-1",
    name: "Truffle Wild Mushroom Soup",
    category: "Starters",
    price: 16.00,
    description: "Slow-simmered forest mushrooms, white truffle oil, thyme croutons, and creme fraiche.",
    dietary: ["Vegetarian"],
    image: "assets/mushroom-soup.jpg",
    prepTimeMinutes: 8
  },
  {
    id: "M-STARTER-2",
    name: "Crispy Calamari Fritti",
    category: "Starters",
    price: 18.50,
    description: "Tender Monterey squid in seasoned semolina crust with garlic aioli and charred lemon.",
    dietary: ["Chef Special"],
    image: "assets/calamari.jpg",
    prepTimeMinutes: 10
  },
  {
    id: "M-STARTER-3",
    name: "Signature Caesar Salad",
    category: "Starters",
    price: 19.00,
    description: "Crisp romaine hearts, shaved 24-month Parmigiano-Reggiano, white anchovies, and garlic toast.",
    dietary: ["Gluten-Free Option"],
    image: "assets/caesar-salad.jpg",
    prepTimeMinutes: 7
  },
  {
    id: "M-STARTER-4",
    name: "Heirloom Tomato Bruschetta",
    category: "Starters",
    price: 14.00,
    description: "Charred sourdough, marinated baby heirloom tomatoes, aged balsamic reduction, basil pearls.",
    dietary: ["Vegetarian", "Vegan"],
    image: "assets/bruschetta.jpg",
    prepTimeMinutes: 6
  },

  // Mains
  {
    id: "M-MAIN-1",
    name: "USDA Prime Ribeye Steak (10oz)",
    category: "Mains",
    price: 48.00,
    description: "Charbroiled center-cut prime beef, roasted garlic herb butter, truffled pomme puree, asparagus.",
    dietary: ["Chef Special", "Gluten-Free"],
    image: "assets/ribeye-steak.jpg",
    prepTimeMinutes: 18
  },
  {
    id: "M-MAIN-2",
    name: "Pan-Seared Atlantic Salmon",
    category: "Mains",
    price: 36.00,
    description: "Crispy skin salmon filet, citrus dill velouté, baby heirloom carrots, saffron wild rice.",
    dietary: ["Gluten-Free"],
    image: "assets/salmon.jpg",
    prepTimeMinutes: 14
  },
  {
    id: "M-MAIN-3",
    name: "Tagliatelle al Tartufo",
    category: "Mains",
    price: 28.00,
    description: "Handmade egg pasta ribbons, black truffle cream, wild portobello mushrooms, Grana Padano.",
    dietary: ["Vegetarian"],
    image: "assets/pasta.jpg",
    prepTimeMinutes: 12
  },
  {
    id: "M-MAIN-4",
    name: "Rosemary Roasted Half Chicken",
    category: "Mains",
    price: 26.50,
    description: "Free-range chicken rubbed with sea salt and fresh rosemary, roasted fingerling potatoes, jus.",
    dietary: ["Gluten-Free"],
    image: "assets/roast-chicken.jpg",
    prepTimeMinutes: 16
  },
  {
    id: "M-MAIN-5",
    name: "The Grand Azure Wagyu Burger",
    category: "Mains",
    price: 25.00,
    description: "Brioche bun, half-pound wagyu beef patty, gruyere cheese, smoked bacon onion jam, truffle fries.",
    dietary: ["Chef Special"],
    image: "assets/wagyu-burger.jpg",
    prepTimeMinutes: 12
  },

  // Desserts
  {
    id: "M-DESSERT-1",
    name: "Belgian Chocolate Lava Cake",
    category: "Desserts",
    price: 14.50,
    description: "Warm molten Valrhona dark chocolate cake served with Madagascar vanilla bean gelato.",
    dietary: ["Vegetarian", "Popular"],
    image: "assets/lava-cake.jpg",
    prepTimeMinutes: 10
  },
  {
    id: "M-DESSERT-2",
    name: "Classic Venetian Tiramisu",
    category: "Desserts",
    price: 13.00,
    description: "Espresso-soaked ladyfingers, velvety mascarpone sabayon, dusting of premium Dutch cocoa.",
    dietary: ["Vegetarian"],
    image: "assets/tiramisu.jpg",
    prepTimeMinutes: 5
  },
  {
    id: "M-DESSERT-3",
    name: "Mango Passionfruit Crème Brûlée",
    category: "Desserts",
    price: 12.50,
    description: "Torched caramelized sugar crust, rich tropical fruit custard, fresh mint and berries.",
    dietary: ["Vegetarian", "Gluten-Free"],
    image: "assets/creme-brulee.jpg",
    prepTimeMinutes: 5
  },

  // Beverages
  {
    id: "M-BEV-1",
    name: "Artisanal Velvet Flat White",
    category: "Beverages",
    price: 6.50,
    description: "Double ristretto espresso pulled from Ethiopian beans with silky textured micro-foam.",
    dietary: ["Hot Beverage"],
    image: "assets/coffee.jpg",
    prepTimeMinutes: 4
  },
  {
    id: "M-BEV-2",
    name: "Fresh Alphonso Mango Frappé",
    category: "Beverages",
    price: 8.00,
    description: "Freshly blended ripe tropical mangoes, coconut milk, crushed ice, honey drizzle.",
    dietary: ["Vegan", "Chilled"],
    image: "assets/mango-shake.jpg",
    prepTimeMinutes: 4
  },
  {
    id: "M-BEV-3",
    name: "Sparkling Lavender Berry Tea",
    category: "Beverages",
    price: 7.50,
    description: "Cold brewed Earl Grey infused with culinary lavender, muddled raspberries, and sparkling water.",
    dietary: ["Non-Alcoholic"],
    image: "assets/iced-tea.jpg",
    prepTimeMinutes: 4
  },

  // Wine & Cocktails
  {
    id: "M-WINE-1",
    name: "Grand Azure Signature Dry Martini",
    category: "Wine & Cocktails",
    price: 17.50,
    description: "Tanqueray No. Ten gin, dry vermouth rinse, hand-stuffed blue cheese olives or lemon twist.",
    dietary: ["Cocktail"],
    image: "assets/martini.jpg",
    prepTimeMinutes: 5
  },
  {
    id: "M-WINE-2",
    name: "Smoked Bourbon Old Fashioned",
    category: "Wine & Cocktails",
    price: 18.00,
    description: "Woodford Reserve bourbon, aromatic bitters, brown sugar cube, torched orange peel and oak smoke.",
    dietary: ["Cocktail"],
    image: "assets/old-fashioned.jpg",
    prepTimeMinutes: 5
  },
  {
    id: "M-WINE-3",
    name: "Napa Valley Cabernet Sauvignon (Glass)",
    category: "Wine & Cocktails",
    price: 19.00,
    description: "Vintage 2021, bold blackberry notes, french oak aging, full bodied finish.",
    dietary: ["Wine by Glass"],
    image: "assets/wine.jpg",
    prepTimeMinutes: 2
  }
];

export const INITIAL_ORDERS = [
  {
    id: "ORD-1001",
    ticketNumber: "TK-101",
    timestamp: "2026-10-29 19:30",
    orderType: "Dine-In",
    destination: "Table 4",
    items: [
      { id: "M-MAIN-1", name: "USDA Prime Ribeye Steak (10oz)", price: 48.00, qty: 1, notes: "Medium Rare" },
      { id: "M-STARTER-1", name: "Truffle Wild Mushroom Soup", price: 16.00, qty: 1, notes: "Extra bread" },
      { id: "M-BEV-1", name: "Artisanal Velvet Flat White", price: 6.50, qty: 1, notes: "Oat milk" }
    ],
    subtotal: 70.50,
    tax: 8.46,
    serviceCharge: 7.05,
    discountAmount: 11.51,
    discountType: "Hotel Guest 10%",
    totalAmount: 74.50,
    paymentMethod: "Charge to Room (Room 107 - Marcus Sterling)",
    roomNumber: "107",
    guestName: "Marcus Sterling",
    status: "Served",
    kdsStatus: "Completed"
  },
  {
    id: "ORD-1002",
    ticketNumber: "TK-102",
    timestamp: "2026-10-30 08:45",
    orderType: "Room Service",
    destination: "Room 202",
    items: [
      { id: "M-MAIN-3", name: "Tagliatelle al Tartufo", price: 28.00, qty: 1, notes: "Warm delivery" },
      { id: "M-BEV-2", name: "Fresh Alphonso Mango Frappé", price: 8.00, qty: 2, notes: "Extra chilled" },
      { id: "M-DESSERT-2", name: "Classic Venetian Tiramisu", price: 13.00, qty: 1, notes: "" }
    ],
    subtotal: 57.00,
    tax: 6.84,
    serviceCharge: 5.70,
    discountAmount: 17.54,
    discountType: "Loyalty Tier",
    totalAmount: 52.00,
    paymentMethod: "Charge to Room (Room 202 - Isabella Rossi)",
    roomNumber: "202",
    guestName: "Isabella Rossi",
    status: "Served",
    kdsStatus: "Completed"
  },
  {
    id: "ORD-1003",
    ticketNumber: "TK-103",
    timestamp: "2026-10-30 20:15",
    orderType: "Room Service",
    destination: "Room 307 (Villa)",
    items: [
      { id: "M-MAIN-1", name: "USDA Prime Ribeye Steak (10oz)", price: 48.00, qty: 2, notes: "1 Medium, 1 Well Done" },
      { id: "M-STARTER-2", name: "Crispy Calamari Fritti", price: 18.50, qty: 2, notes: "" },
      { id: "M-WINE-1", name: "Grand Azure Signature Dry Martini", price: 17.50, qty: 2, notes: "" },
      { id: "M-DESSERT-1", name: "Belgian Chocolate Lava Cake", price: 14.50, qty: 1, notes: "" }
    ],
    subtotal: 182.00,
    tax: 21.84,
    serviceCharge: 18.20,
    discountAmount: 37.04,
    discountType: "VIP Courtesy",
    totalAmount: 185.00,
    paymentMethod: "Charge to Room (Room 307 - Carlos Gutierrez)",
    roomNumber: "307",
    guestName: "Carlos Gutierrez & Family",
    status: "Served",
    kdsStatus: "Completed"
  },
  {
    id: "ORD-1004",
    ticketNumber: "TK-104",
    timestamp: "2026-10-30 21:55",
    orderType: "Dine-In",
    destination: "Table 7",
    items: [
      { id: "M-MAIN-5", name: "The Grand Azure Wagyu Burger", price: 25.00, qty: 2, notes: "Medium, crispy bacon" },
      { id: "M-WINE-2", name: "Smoked Bourbon Old Fashioned", price: 18.00, qty: 2, notes: "" }
    ],
    subtotal: 86.00,
    tax: 10.32,
    serviceCharge: 8.60,
    discountAmount: 0.00,
    discountType: "None",
    totalAmount: 104.92,
    paymentMethod: "Cash (Paid $110.00 - Change $5.08)",
    roomNumber: null,
    guestName: "Walk-In Diner",
    status: "Preparing",
    kdsStatus: "Preparing"
  }
];

export const HK_STAFF = [
  { id: "HK-1", name: "Maria Santos", role: "Executive Housekeeper", shift: "Morning (07:00 - 15:30)", activeRooms: 5, rating: 4.9 },
  { id: "HK-2", name: "Juan Dela Cruz", role: "Senior Floor Attendant", shift: "Morning (07:00 - 15:30)", activeRooms: 4, rating: 4.8 },
  { id: "HK-3", name: "Elena Rostova", role: "Guest Room Attendant", shift: "Swing (15:00 - 23:30)", activeRooms: 4, rating: 4.7 },
  { id: "HK-4", name: "David Kim", role: "Facilities & Maintenance Eng.", shift: "On-Call / Technical", activeRooms: 1, rating: 5.0 }
];

export const TRAINING_SCENARIOS = [
  {
    id: "SCN-1",
    category: "Front Desk & Reservations",
    title: "Scenario 1: Peak Season Walk-In & Late Check-Out Negotiation",
    badge: "Front Office Operations",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    summary: "A walk-in business executive arrives at 2:30 PM requesting an available room for 1 night and insists on a guaranteed 2:00 PM late check-out tomorrow.",
    context: "Real-world HM Context: Front desk agents must balance guest satisfaction with housekeeping turnover deadlines. Standard checkout is 12:00 PM. High hotel occupancy limits late departures.",
    learningObjectives: [
      "Identify an available, clean room in PMS inventory.",
      "Capture complete guest demographic and identification details.",
      "Record operational special requests ('Late Check-out 2:00 PM') on reservation record.",
      "Execute the formal Check-In flow and verify room status transitions from 'Clean / Vacant' to 'Occupied'."
    ],
    steps: [
      { step: 1, description: "Navigate to the PMS module and locate an available clean room (e.g., Room 101, 105, 108, or 203)." },
      { step: 2, description: "Click 'New Reservation' or click the available room's 'Check-In Walk-In' button." },
      { step: 3, description: "Enter guest details: Name 'Robert Sterling', ID Type 'Passport', select Room, and in Special Requests write 'Late Check-out 2:00 PM'." },
      { step: 4, description: "Confirm reservation and complete Check-In to flip room status to Occupied." }
    ],
    checkSuccess: (state) => {
      // Check if a reservation exists with guest name containing Sterling or checked-in walk-in
      const res = state.reservations.find(r => 
        (r.guestName.toLowerCase().includes("sterling") || r.specialRequests?.toLowerCase().includes("late check-out") || r.specialRequests?.toLowerCase().includes("late checkout")) &&
        r.status === "Checked-In"
      );
      return !!res;
    }
  },
  {
    id: "SCN-2",
    category: "Housekeeping Coordination",
    title: "Scenario 2: VIP Early Arrival & Housekeeping Room Rush",
    badge: "HK & Room State Management",
    difficulty: "Intermediate",
    estimatedMinutes: 6,
    summary: "VIP Guest Natalie Portman-Smith (RES-1011) has arrived at the lobby at 11:30 AM before regular check-in. Her assigned Deluxe Ocean View Room 201 is currently 'Dirty'.",
    context: "Real-world HM Context: In hotel operations, when a VIP arrives early, front desk contacts Housekeeping Dispatch to place a 'RUSH' priority clean on the assigned room, or reassigns them if clean inventory is ready.",
    learningObjectives: [
      "Interpret live room status matrices and recognize room blockers.",
      "Coordinate with Housekeeping by prioritizing room turnarounds and assigning staff.",
      "Transition room through the hygiene cycle: Dirty -> In Progress -> Inspected / Clean.",
      "Perform the VIP check-in once the room clears inspection."
    ],
    steps: [
      { step: 1, description: "Navigate to the 'Housekeeping' module and locate Room 201 on the HK Board." },
      { step: 2, description: "Assign attendant 'Maria Santos' and change status from 'Dirty' to 'Clean / Inspected' (or mark Ready)." },
      { step: 3, description: "Return to the PMS module and find reservation RES-1011 (Natalie Portman-Smith)." },
      { step: 4, description: "Click 'Check In' to complete guest arrival and change status to Checked-In." }
    ],
    checkSuccess: (state) => {
      const room201 = state.rooms.find(r => r.number === "201");
      const res1011 = state.reservations.find(r => r.id === "RES-1011");
      return (room201 && room201.occupancy === "Occupied") && (res1011 && res1011.status === "Checked-In");
    }
  },
  {
    id: "SCN-3",
    category: "F&B POS & Folio Integration",
    title: "Scenario 3: Restaurant Room Charge & PMS Folio Audit",
    badge: "F&B POS & Guest Accounting",
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    summary: "Sophia Chen (staying in Room 104) dines at The Palm Court restaurant. She requests to charge her meal directly to her hotel room folio rather than paying cash.",
    context: "Real-world HM Context: Guest accounting relies on the seamless interface between Oracle MICROS / POS and PMS. Front office must ensure charges post to the correct guest folio with detailed line items and audit codes.",
    learningObjectives: [
      "Build a complete F&B order within the POS interface.",
      "Select 'Room Charge / Room Service' mode and link the order to an active checked-in guest (Room 104).",
      "Process settlement with 'Post to Room Folio' payment method.",
      "Open Room 104's Guest Folio in PMS and verify the exact line item debits, taxes, and new total balance."
    ],
    steps: [
      { step: 1, description: "Switch to the 'F&B POS' module." },
      { step: 2, description: "Select 'Room Charge / Room Service' mode and select Room 104 (Sophia Chen)." },
      { step: 3, description: "Add at least 1 food item and 1 beverage to the cart, then proceed to 'Checkout & Settlement'." },
      { step: 4, description: "Choose 'Charge to Room Folio' and confirm payment." },
      { step: 5, description: "Switch to the 'PMS' module, locate Room 104, open her Folio, and inspect the posted POS line item." }
    ],
    checkSuccess: (state) => {
      const res104 = state.reservations.find(r => r.roomNumber === "104" && r.status === "Checked-In");
      if (!res104 || !res104.folio) return false;
      const hasPosCharge = res104.folio.some(item => item.category === "F&B" || item.description.toLowerCase().includes("pos") || item.description.toLowerCase().includes("court"));
      return hasPosCharge;
    }
  },
  {
    id: "SCN-4",
    category: "Night Audit & Folio Settlement",
    title: "Scenario 4: Zero-Balance Folio Settlement & Guest Departure",
    badge: "Front Office Accounting",
    difficulty: "Advanced",
    estimatedMinutes: 6,
    summary: "Lady Beatrice Montgomery in Room 302 is departing. Her folio has accumulated room charges, laundry, and taxes. She must settle her outstanding balance before check-out.",
    context: "Real-world HM Context: Hospitality accounting strictly forbids checking out a guest with an open debit balance without management approval or city ledger transfer. Folios must reach $0.00.",
    learningObjectives: [
      "Open and analyze a multi-line guest folio statement.",
      "Calculate remaining balance (Total Debits minus Total Credits).",
      "Process payment (Cash, Credit Card, or Discount) to balance the folio to exactly $0.00.",
      "Execute the final Check-Out action and observe the automated PMS trigger that marks Room 302 as 'Dirty / Pending Housekeeping'."
    ],
    steps: [
      { step: 1, description: "Navigate to PMS, locate Room 302 (Lady Beatrice Montgomery) and click 'View Folio / Settle'." },
      { step: 2, description: "Notice the remaining unpaid balance on her account." },
      { step: 3, description: "Click 'Add Payment' and process the exact balance amount using Credit Card or Cash." },
      { step: 4, description: "Once the balance reads $0.00, click 'Settle & Check Out Guest'." },
      { step: 5, description: "Check Room 302 on the room grid or HK Board and verify its status is now 'Dirty / Pending HK'." }
    ],
    checkSuccess: (state) => {
      const room302 = state.rooms.find(r => r.number === "302");
      const res302 = state.reservations.find(r => r.id === "RES-1008");
      return (res302 && res302.status === "Checked-Out") && (room302 && room302.status === "Dirty" && room302.occupancy === "Vacant");
    }
  }
];

export const ASSESSMENT_QUIZ = [
  {
    id: "Q-1",
    question: "What is the primary operational objective of the daily Night Audit in a hotel Property Management System (PMS)?",
    options: [
      "To inspect whether housekeeping cleaned all guest rooms during the morning shift.",
      "To reconcile daily financial transactions, post room charges and taxes, balance folios, and roll over the system date.",
      "To calculate the tips for restaurant waitstaff and kitchen attendants.",
      "To cancel all future reservations that do not have a cash deposit."
    ],
    correctIndex: 1,
    explanation: "The Night Audit is a crucial daily accounting procedure. It verifies and posts room rates, taxes, and incidental charges across all in-house guest accounts, balances department ledgers (F&B, Front Office, Spa), and rolls the PMS calendar forward to the next business day."
  },
  {
    id: "Q-2",
    question: "When a guest formally settles their folio and checks out at the front desk, what should the PMS automatically trigger regarding the room's housekeeping status?",
    options: [
      "Flip the room directly to 'Clean & Available' so a new walk-in guest can immediately check in.",
      "Flip the room status to 'Dirty / Pending Housekeeping' and change room occupancy to 'Vacant'.",
      "Change the room to 'Out of Order (OOO)' requiring engineering maintenance approval.",
      "Lock the room door electronically and delete the room from the PMS floor grid."
    ],
    correctIndex: 1,
    explanation: "Upon check-out, the PMS immediately updates room occupancy to 'Vacant' and hygiene status to 'Dirty' (On-Change / Pending Housekeeping). Housekeeping staff are alerted to clean, restock, and sanitize the room before a supervisor marks it inspected and available for new arrivals."
  },
  {
    id: "Q-3",
    question: "A checked-in guest dines at the hotel's fine dining outlet and chooses 'Charge to Room'. In hotel accounting, how is this transaction recorded on the guest's folio?",
    options: [
      "It is posted as a Credit, reducing the amount the guest owes the hotel at checkout.",
      "It is not recorded on the PMS; it is stored solely in the restaurant POS hardware until end-of-month.",
      "It is posted as a Debit to the guest's folio, increasing their outstanding balance payable to the hotel.",
      "It converts the guest's room rate into a discounted corporate rate."
    ],
    correctIndex: 2,
    explanation: "In guest accounting, charges incurred by the guest (room rate, taxes, restaurant food, minibar, spa) are recorded as DEBITS (+), which increase the balance owed. Payments made by the guest (cash, credit card, advance deposit) are CREDITS (-), which reduce the balance."
  },
  {
    id: "Q-4",
    question: "The Grand Azure Hotel has 100 total rooms. 10 rooms are currently Out of Order (OOO) for renovations. On Friday, 72 rooms are occupied. What is the hotel's Occupancy Rate for Friday?",
    options: [
      "72.0%",
      "80.0%",
      "62.0%",
      "90.0%"
    ],
    correctIndex: 1,
    explanation: "Industry Formula: Occupancy Rate (%) = (Total Rooms Occupied / Available Rooms for Sale) × 100. Available Rooms = Total Capacity (100) - Out of Order (10) = 90 rooms. Therefore: (72 ÷ 90) × 100 = 80.0%."
  },
  {
    id: "Q-5",
    question: "What is the difference between a 'Skipper' and a 'Sleeper' in hotel front desk room discrepancy audits?",
    options: [
      "A Skipper is a guest who ordered room service; a Sleeper is a guest who slept in past checkout.",
      "A Skipper is a guest who left without settling their bill; a Sleeper is a room shown as occupied in PMS but is actually vacant.",
      "A Skipper is an early check-in guest; a Sleeper is a late check-in guest.",
      "A Skipper is a VIP suite; a Sleeper is a standard twin room."
    ],
    correctIndex: 1,
    explanation: "In Front Office Management: A 'Skipper' is a guest who departs the hotel without paying their folio. A 'Sleeper' is a room discrepancy where the PMS still lists the room as occupied (due to front desk failing to process checkout), but the guest has actually departed and the room is vacant."
  },
  {
    id: "Q-6",
    question: "Under standard Front Office procedures, why must a guest folio reflect a $0.00 balance before the Front Desk Clerk finalizes the check-out?",
    options: [
      "Because credit cards cannot be processed after a guest walks through the hotel exit doors.",
      "To ensure all debits (charges) are completely matched by credits (payments or authorized direct billing), closing the guest ledger.",
      "Because the PMS server will crash if an unpaid reservation is archived.",
      "To automatically apply a 100% discount to all remaining meals and minibar items."
    ],
    correctIndex: 1,
    explanation: "Zero-balance settlement ensures all guest liabilities are fully resolved or properly transferred to a City Ledger (corporate direct billing). Once balanced to $0.00, the guest folio can be closed, generating an official departure receipt for the guest and preventing uncollectible accounts receivable."
  }
];

export const GLOSSARY_TERMS = [
  { term: "PMS (Property Management System)", definition: "The central software used by hotels to manage reservations, check-ins/check-outs, room assignment, housekeeping states, and guest folios (e.g., Opera, Fidelio, Cloudbeds)." },
  { term: "POS (Point of Sale)", definition: "The computerized system used in hotel food & beverage outlets, spas, and gift shops to input orders, calculate checks, and route charges directly to guest room folios." },
  { term: "Folio", definition: "A detailed statement and continuous record of all financial transactions (debits for services consumed, credits for payments made) between an in-house guest and the hotel." },
  { term: "ADR (Average Daily Rate)", definition: "A key hotel KPI measuring average rental revenue earned per paid occupied room per day: Total Room Revenue ÷ Total Occupied Rooms." },
  { term: "RevPAR (Revenue Per Available Room)", definition: "A core hospitality performance metric evaluating both occupancy and pricing power: Room Revenue ÷ Total Available Rooms (or ADR × Occupancy Rate)." },
  { term: "Night Audit", definition: "A daily reconciliation routine performed during the graveyard shift that audits front office accounts, posts daily room charges & taxes, and prepares daily management reports." },
  { term: "OOO (Out of Order)", definition: "A room status indicating that the room cannot be occupied due to maintenance, plumbing, electrical, or renovation issues, temporarily removing it from saleable inventory." },
  { term: "City Ledger", definition: "A ledger containing non-guest accounts, such as corporate direct billing clients, travel agencies, and credit card companies, payable post-stay via invoice." },
  { term: "Walk-In", definition: "A guest who arrives at the hotel seeking room accommodations without having made a prior reservation." },
  { term: "Turn-Down Service", definition: "An evening housekeeping service where staff prepare the guest bed for sleep, restock fresh towels, close drapes, and provide pillow amenities." },
  { term: "Skipper", definition: "An unpaid room discrepancy where a guest departs the property without settling their outstanding folio." },
  { term: "Posting", definition: "The process of recording a financial transaction (charge debit or payment credit) into a specific folio account." }
];
