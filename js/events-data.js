/**
 * GATHR Event Dataset & Seed Repository
 */

const GATHR_EVENTS = [
  {
    id: "gathr-event-01",
    title: "GATHR Tech Summit: Africa AI & Future of Systems",
    category: "Tech & AI",
    city: "Lagos",
    venue: "Eko Convention Centre, Victoria Island, Lagos",
    date: "Nov 28, 2026",
    time: "09:00 AM WAT",
    image: "./assets/images/tech-summit.jpg",
    organizer: "GATHR Technologies & Lagos Innovates",
    verified: true,
    description: "The flagship gathering of 3,000+ builders, founders, and engineering leaders shaping Africa's AI ecosystem, autonomous systems, and digital economy infrastructure. Featuring global keynotes, live technical demos, and executive networking.",
    minPrice: 15000,
    currency: "₦",
    currencyCode: "NGN",
    ticketTiers: [
      { id: "t1-early", name: "Builder (Early Bird)", price: 15000, capacity: 500, remaining: 142, perks: "Full Keynote Access, Builder Swag Bag, Digital Pass" },
      { id: "t1-regular", name: "Standard Delegate", price: 30000, capacity: 1200, remaining: 840, perks: "Keynotes + Workshops, Catered Lunch, Networking App" },
      { id: "t1-vip", name: "Executive VIP Pass", price: 95000, capacity: 200, remaining: 46, perks: "VIP Lounge Access, Speaker Dinner, Fast-Track Gate Entry, Gathr Radar AI Matchmaking" },
      { id: "t1-squad", name: "Squad Pass (Group of 4)", price: 90000, capacity: 100, remaining: 31, perks: "4 Standard Passes at 25% discount, Reserved Group Seating" }
    ],
    stats: {
      soldCount: 785,
      revenueGross: 24500000,
      checkedInCount: 184
    }
  },
  {
    id: "gathr-event-02",
    title: "Vibrations: Afrobeats & Neon Night Festival",
    category: "Concerts & Festivals",
    city: "Lagos",
    venue: "Landmark Beach, Water Corporation Drive, Victoria Island",
    date: "Dec 19, 2026",
    time: "06:00 PM WAT",
    image: "./assets/images/beach-fest.jpg",
    organizer: "LiveNation Africa & Mainland Vibes",
    verified: true,
    description: "The ultimate beach festival experience combining electrifying Afrobeats headliners, immersive neon light art installations, world-class sound, beach games, and curated food vendors under the Lagos night sky.",
    minPrice: 12000,
    currency: "₦",
    currencyCode: "NGN",
    ticketTiers: [
      { id: "t2-early", name: "General Admission", price: 12000, capacity: 2000, remaining: 320, perks: "Full Stage Access, Beach Access, Wristband" },
      { id: "t2-vip", name: "VIP Beach Deck", price: 50000, capacity: 350, remaining: 82, perks: "Elevated Deck View, Free Drinks Token, Private Bar, Priority Restrooms" },
      { id: "t2-cabana", name: "Private Beach Cabana (6 Pax)", price: 350000, capacity: 20, remaining: 5, perks: "Private Luxury Cabana, 2 Premium Bottles, Dedicated Waiter, Backstage Pass" }
    ],
    stats: {
      soldCount: 1650,
      revenueGross: 39800000,
      checkedInCount: 420
    }
  },
  {
    id: "gathr-event-03",
    title: "Global Founders & VC Private Gala Dinner",
    category: "Executive Galas",
    city: "Abuja",
    venue: "Congress Hall, Transcorp Hilton, Maitama, Abuja",
    date: "Jan 16, 2027",
    time: "07:00 PM WAT",
    image: "./assets/images/founders-gala.jpg",
    organizer: "African Venture Council & Angel Network",
    verified: true,
    description: "An invitation-backed, high-level evening gathering 120 top venture capitalists, growth-stage tech founders, and policymakers for closed-door discussions, investment deal-making, and a curated 4-course gourmet dinner.",
    minPrice: 150000,
    currency: "₦",
    currencyCode: "NGN",
    ticketTiers: [
      { id: "t3-founder", name: "Founder Ticket (Approved Startups)", price: 150000, capacity: 60, remaining: 12, perks: "4-Course Dinner, Deal Room Directory, Curated Investor Matchmaking" },
      { id: "t3-investor", name: "LP / GP Partner Pass", price: 300000, capacity: 40, remaining: 8, perks: "Private Pre-Dinner Reception, LP Briefing Report, Reserved Table" }
    ],
    stats: {
      soldCount: 80,
      revenueGross: 14400000,
      checkedInCount: 52
    }
  }
];

// Seed checked-in attendees for the Organizer View
const INITIAL_ATTENDEES = [
  { id: "att-101", name: "Adewale Bello", email: "adewale@paystack.com", tier: "Executive VIP Pass", code: "GTHR-VIP-9021", status: "Checked In", gate: "Gate 1 VIP", checkInTime: "09:14 AM" },
  { id: "att-102", name: "Ngozi Chukwu", email: "ngozi@flutterwave.com", tier: "Standard Delegate", code: "GTHR-REG-3419", status: "Checked In", gate: "Gate 3 Main", checkInTime: "09:22 AM" },
  { id: "att-103", name: "Tunde Bakare", email: "tunde@venturecapital.africa", tier: "Executive VIP Pass", code: "GTHR-VIP-1102", status: "Checked In", gate: "Gate 1 VIP", checkInTime: "09:35 AM" },
  { id: "att-104", name: "Grace Danladi", email: "grace.d@techpoint.africa", tier: "Builder (Early Bird)", code: "GTHR-BDR-7782", status: "Checked In", gate: "Gate 2 East", checkInTime: "09:41 AM" },
  { id: "att-105", name: "Kester Ojo", email: "kester@fintech.io", tier: "Standard Delegate", code: "GTHR-REG-6604", status: "Pending", gate: "—", checkInTime: "—" },
  { id: "att-106", name: "Amara Nwosu", email: "amara@designstudio.ng", tier: "Builder (Early Bird)", code: "GTHR-BDR-5531", status: "Pending", gate: "—", checkInTime: "—" },
  { id: "att-107", name: "Femi Adeleke", email: "femi@soundcity.tv", tier: "Squad Pass", code: "GTHR-SQD-9901", status: "Pending", gate: "—", checkInTime: "—" }
];
