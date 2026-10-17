/**
 * GATHR Global Event Dataset & Seed Repository
 * Supports International Hubs: US, UK, Canada, Nigeria, Ghana, Kenya, South Africa, Rwanda.
 * Multi-Currency Engine: USD ($), GBP (£), CAD (C$), EUR (€), NGN (₦), KES (KSh), GHS (GH₵).
 */

const GATHR_CURRENCY_RATES = {
  USD: { symbol: "$", rate: 1.0, flag: "🇺🇸" },
  GBP: { symbol: "£", rate: 0.78, flag: "🇬🇧" },
  CAD: { symbol: "C$", rate: 1.36, flag: "🇨🇦" },
  EUR: { symbol: "€", rate: 0.92, flag: "🇪🇺" },
  ZAR: { symbol: "R", rate: 18.2, flag: "🇿🇦" },
  NGN: { symbol: "₦", rate: 1520.0, flag: "🇳🇬" },
  KES: { symbol: "KSh", rate: 130.0, flag: "🇰🇪" },
  GHS: { symbol: "GH₵", rate: 15.5, flag: "🇬🇭" }
};

const GATHR_EVENTS = [
  {
    id: "gathr-event-01",
    title: "GATHR Tech Summit: Africa AI & Future of Systems",
    category: "Tech & AI",
    country: "Nigeria",
    countryCode: "NG",
    city: "Lagos",
    venue: "Eko Convention Centre, Victoria Island, Lagos",
    date: "Nov 28, 2026",
    time: "09:00 AM WAT",
    image: "./assets/images/tech-summit.jpg",
    organizer: "GATHR Technologies & Lagos Innovates",
    verified: true,
    description: "The flagship gathering of 3,000+ builders, founders, and engineering leaders shaping Africa's AI ecosystem, autonomous systems, and digital economy infrastructure. Featuring global keynotes, live technical demos, and executive networking.",
    minPrice: 15000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t1-early", name: "Builder (Early Bird)", price: 15000, currency: "NGN", capacity: 500, remaining: 142, perks: "Full Keynote Access, Builder Swag Bag, Dynamic Digital Pass" },
      { id: "t1-regular", name: "Standard Delegate", price: 30000, currency: "NGN", capacity: 1200, remaining: 840, perks: "Keynotes + Workshops, Catered Lunch, Networking App" },
      { id: "t1-vip", name: "Executive VIP Pass", price: 95000, currency: "NGN", capacity: 200, remaining: 46, perks: "VIP Lounge Access, Speaker Dinner, Fast-Track Gate Entry, Gathr Radar AI Matchmaking" },
      { id: "t1-squad", name: "Squad Pass (Group of 4)", price: 90000, currency: "NGN", capacity: 100, remaining: 31, perks: "4 Standard Passes at 25% discount, Reserved Group Seating" }
    ],
    splits: { host: 70, venue: 20, promoter: 10 },
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
    country: "Nigeria",
    countryCode: "NG",
    city: "Lagos",
    venue: "Landmark Beach, Water Corporation Drive, Victoria Island",
    date: "Dec 19, 2026",
    time: "06:00 PM WAT",
    image: "./assets/images/beach-fest.jpg",
    organizer: "LiveNation Africa & Mainland Vibes",
    verified: true,
    description: "The ultimate beach festival experience combining electrifying Afrobeats headliners, immersive neon light art installations, world-class sound, beach games, and curated food vendors under the Lagos night sky.",
    minPrice: 12000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t2-early", name: "General Admission", price: 12000, currency: "NGN", capacity: 2000, remaining: 320, perks: "Full Stage Access, Beach Access, Dynamic Wristband" },
      { id: "t2-vip", name: "VIP Beach Deck", price: 50000, currency: "NGN", capacity: 350, remaining: 82, perks: "Elevated Deck View, Free Drinks Token, Private Bar, Priority Restrooms" },
      { id: "t2-cabana", name: "Private Beach Cabana (6 Pax)", price: 350000, currency: "NGN", capacity: 20, remaining: 5, perks: "Private Luxury Cabana, 2 Premium Bottles, Dedicated Waiter, Backstage Pass" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
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
    country: "Nigeria",
    countryCode: "NG",
    city: "Abuja",
    venue: "Congress Hall, Transcorp Hilton, Maitama, Abuja",
    date: "Jan 16, 2027",
    time: "07:00 PM WAT",
    image: "./assets/images/founders-gala.jpg",
    organizer: "African Venture Council & Angel Network",
    verified: true,
    description: "An invitation-backed, high-level evening gathering 120 top venture capitalists, growth-stage tech founders, and policymakers for closed-door discussions, investment deal-making, and a curated 4-course gourmet dinner.",
    minPrice: 150000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t3-founder", name: "Founder Ticket (Approved Startups)", price: 150000, currency: "NGN", capacity: 60, remaining: 12, perks: "4-Course Dinner, Deal Room Directory, Curated Investor Matchmaking" },
      { id: "t3-investor", name: "LP / GP Partner Pass", price: 300000, currency: "NGN", capacity: 40, remaining: 8, perks: "Private Pre-Dinner Reception, LP Briefing Report, Reserved Table" }
    ],
    splits: { host: 80, venue: 15, promoter: 5 },
    stats: {
      soldCount: 80,
      revenueGross: 14400000,
      checkedInCount: 52
    }
  },
  {
    id: "gathr-event-04",
    title: "GATHR Global AI & Web3 Summit NYC",
    category: "Tech & AI",
    country: "United States",
    countryCode: "US",
    city: "New York",
    venue: "Javits Center, Hudson Yards, Manhattan, NY",
    date: "Feb 12, 2027",
    time: "08:30 AM EST",
    image: "./assets/images/tech-summit.jpg",
    organizer: "GATHR Global & Silicon Alley Ventures",
    verified: true,
    description: "New York's premier dual-continent technology forum bringing together 2,500 enterprise CTOs, deep-tech AI founders, and frontier market institutional investors. Real-time translation, dynamic stage matchmaking, and investor deal suites.",
    minPrice: 150,
    baseCurrency: "USD",
    ticketTiers: [
      { id: "t4-developer", name: "Builder / Engineer Pass", price: 150, currency: "USD", capacity: 800, remaining: 210, perks: "Keynote Access, AI Hackathon Floor, Career Fair" },
      { id: "t4-allaccess", name: "All-Access Summit Pass", price: 450, currency: "USD", capacity: 1200, remaining: 340, perks: "All Tracks, VIP Afterparty, Catered Lunches, Workshop Pass" },
      { id: "t4-executive", name: "Executive & Investor Pass", price: 1250, currency: "USD", capacity: 150, remaining: 28, perks: "Private VC Lounge, 1-on-1 Deal Rooms, Speaker Dinners, Fast-Track Scanner Entry" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: {
      soldCount: 940,
      revenueGross: 520000,
      checkedInCount: 0
    }
  },
  {
    id: "gathr-event-05",
    title: "Afrobeats UK Summer Jam & Festival",
    category: "Concerts & Festivals",
    country: "United Kingdom",
    countryCode: "GB",
    city: "London",
    venue: "The O2 Arena, Peninsula Square, London",
    date: "May 22, 2027",
    time: "05:00 PM BST",
    image: "./assets/images/beach-fest.jpg",
    organizer: "Live Nation UK & GATHR Live Experiences",
    verified: true,
    description: "The biggest celebration of African music, dance, and culture in Europe. Featuring top international chart-topping artists, spectacular 3D holographic visual production, African culinary village, and world-class live acoustics.",
    minPrice: 45,
    baseCurrency: "GBP",
    ticketTiers: [
      { id: "t5-floor", name: "General Admission (Standing Floor)", price: 45, currency: "GBP", capacity: 8000, remaining: 1420, perks: "Main Floor Arena Access, Festival Booklet" },
      { id: "t5-lower", name: "Lower Tier Reserved Seating", price: 85, currency: "GBP", capacity: 5000, remaining: 890, perks: "Guaranteed Prime Lower Tier Seat, Priority Bar Entry" },
      { id: "t5-vip", name: "VIP Lounge & Golden Circle", price: 220, currency: "GBP", capacity: 500, remaining: 64, perks: "Golden Circle Front-Stage, Private O2 VIP Lounge, Welcome Champagne, NFC Pass" }
    ],
    splits: { host: 70, venue: 20, promoter: 10 },
    stats: {
      soldCount: 4200,
      revenueGross: 310000,
      checkedInCount: 0
    }
  },
  {
    id: "gathr-event-06",
    title: "Innovate Canada: African-Diaspora Tech & Venture Gala",
    category: "Executive Galas",
    country: "Canada",
    countryCode: "CA",
    city: "Toronto",
    venue: "Metro Toronto Convention Centre (MTCC), Downtown Toronto",
    date: "March 18, 2027",
    time: "06:30 PM EDT",
    image: "./assets/images/founders-gala.jpg",
    organizer: "Diaspora Capital Alliance & MaRS Discovery District",
    verified: true,
    description: "Connecting Canadian venture funds, bilateral trade commissions, and top immigrant tech executives. Keynotes by Canadian ministers, pitch competitions with $500K in non-dilutive awards, and a black-tie gala dinner.",
    minPrice: 120,
    baseCurrency: "CAD",
    ticketTiers: [
      { id: "t6-gala", name: "Gala Dinner Ticket", price: 120, currency: "CAD", capacity: 400, remaining: 85, perks: "Black-Tie Dinner, Keynote Hall, Networking Directory" },
      { id: "t6-patron", name: "VIP Patron Table (8 Seats)", price: 1500, currency: "CAD", capacity: 25, remaining: 6, perks: "Reserved VIP Center Table, Wine Pairing, Corporate Logo in Program" }
    ],
    splits: { host: 70, venue: 25, promoter: 5 },
    stats: {
      soldCount: 180,
      revenueGross: 52000,
      checkedInCount: 0
    }
  },
  {
    id: "gathr-event-07",
    title: "Silicon Savannah Tech Week & Founder Mixer",
    category: "Tech & AI",
    country: "Kenya",
    countryCode: "KE",
    city: "Nairobi",
    venue: "Radisson Blu Hotel, Upper Hill, Nairobi",
    date: "April 09, 2027",
    time: "09:00 AM EAT",
    image: "./assets/images/tech-summit.jpg",
    organizer: "Nairobi Innovation Hub & GATHR East Africa",
    verified: true,
    description: "East Africa's most influential technology assembly. Exploring mobile payments, climate tech, cross-border remittance, and generative AI models tailored for emerging markets.",
    minPrice: 3500,
    baseCurrency: "KES",
    ticketTiers: [
      { id: "t7-pass", name: "Standard Delegate Pass", price: 3500, currency: "KES", capacity: 800, remaining: 230, perks: "Access to all Panels, Lunch & Coffee, Digital Event Badge" },
      { id: "t7-investor", name: "Investor & VIP Pass", price: 12000, currency: "KES", capacity: 150, remaining: 42, perks: "VIP Investor Lounge, Curated Deal Flow, Speaker Dinner" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: {
      soldCount: 420,
      revenueGross: 2450000,
      checkedInCount: 0
    }
  },
  {
    id: "gathr-event-08",
    title: "Afrochella / Year of Return Cultural Gathering",
    category: "Concerts & Festivals",
    country: "Ghana",
    countryCode: "GH",
    city: "Accra",
    venue: "El-Wak Stadium, Cantonments, Accra",
    date: "Dec 29, 2026",
    time: "04:00 PM GMT",
    image: "./assets/images/beach-fest.jpg",
    organizer: "Culture Management Group & GATHR West Africa",
    verified: true,
    description: "A world-renowned cultural celebration highlighting Africa's diverse talent, musical giants, fashion showcases, culinary masters, and art installations. Welcoming the global diaspora home to Accra.",
    minPrice: 350,
    baseCurrency: "GHS",
    ticketTiers: [
      { id: "t8-ga", name: "Festival General Admission", price: 350, currency: "GHS", capacity: 15000, remaining: 3400, perks: "Full 2-Day Festival Access, Art Pavilions, Food Village" },
      { id: "t8-vip", name: "VIP Lounge Pass", price: 1200, currency: "GHS", capacity: 1000, remaining: 180, perks: "Raised Viewing Deck, Dedicated Entry Gate, Air-Conditioned Bar" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: {
      soldCount: 8200,
      revenueGross: 4800000,
      checkedInCount: 0
    }
  },
  {
    id: "gathr-event-09",
    title: "Cape Town Sunset Electronic & Amapiano Odyssey",
    category: "Concerts & Festivals",
    country: "South Africa",
    countryCode: "ZA",
    city: "Cape Town",
    state: "Western Cape",
    venue: "Kirstenbosch Botanical Gardens, Newlands, Cape Town",
    date: "Jan 30, 2027",
    time: "03:00 PM SAST",
    image: "./assets/images/beach-fest.jpg",
    organizer: "Ultra South Africa & Cape Live",
    verified: true,
    tags: ["Cape Town", "South Africa", "Western Cape", "Amapiano", "Electronic", "Festival"],
    description: "An open-air musical odyssey against the dramatic backdrop of Table Mountain. Featuring premier Amapiano, Deep House, and electronic headliners alongside craft food, artisan wines, and world-class stage acoustics.",
    minPrice: 380,
    baseCurrency: "ZAR",
    ticketTiers: [
      { id: "t9-ga", name: "Lawn General Admission", price: 380, currency: "ZAR", capacity: 4500, remaining: 1120, perks: "Full Lawn Access, Soundstage Views, Food Village" },
      { id: "t9-vip", name: "VIP Botanical Deck", price: 950, currency: "ZAR", capacity: 500, remaining: 135, perks: "Elevated Deck, Private Botanical Bar, Fast-Track Gate Entry" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: { soldCount: 2200, revenueGross: 836000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-10",
    title: "Johannesburg AI & Frontier FinTech Summit",
    category: "Tech & AI",
    country: "South Africa",
    countryCode: "ZA",
    city: "Johannesburg",
    state: "Gauteng",
    venue: "Sandton Convention Centre, Maude Street, Sandton",
    date: "March 04, 2027",
    time: "09:00 AM SAST",
    image: "./assets/images/tech-summit.jpg",
    organizer: "Southern Africa FinTech Council",
    verified: true,
    tags: ["Johannesburg", "Joburg", "Sandton", "South Africa", "Gauteng", "Fintech", "AI"],
    description: "Southern Africa's flagship financial technology and AI conference. Convening 2,000 banking executives, venture investors, regulatory leaders, and founders scaling continent-wide financial rails.",
    minPrice: 650,
    baseCurrency: "ZAR",
    ticketTiers: [
      { id: "t10-del", name: "Standard Delegate Pass", price: 650, currency: "ZAR", capacity: 1500, remaining: 410, perks: "Access to All Stages, Networking Lunches, Digital Attendee Badge" },
      { id: "t10-vip", name: "Executive VIP Pass", price: 2200, currency: "ZAR", capacity: 200, remaining: 48, perks: "Sandton VIP Lounge, Private Speaker Dinner, 1-on-1 Deal Rooms" }
    ],
    splits: { host: 70, venue: 20, promoter: 10 },
    stats: { soldCount: 680, revenueGross: 442000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-11",
    title: "Port Harcourt Afro-Tech & Oil City Mixer",
    category: "Tech & AI",
    country: "Nigeria",
    countryCode: "NG",
    city: "Port Harcourt",
    state: "Rivers",
    venue: "Plexus Dome, GRA Phase 2, Port Harcourt, Rivers State",
    date: "Dec 05, 2026",
    time: "10:00 AM WAT",
    image: "./assets/images/tech-summit.jpg",
    organizer: "Garden City Innovation Hub & GATHR Rivers",
    verified: true,
    tags: ["Port Harcourt", "Rivers", "PH City", "Niger Delta", "Tech", "Startup"],
    description: "Bringing together South-South Nigeria's rising tech ecosystem, energy transition innovators, creative coders, and venture partners for technical masterclasses and high-impact networking.",
    minPrice: 10000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t11-gen", name: "Builder Delegate Pass", price: 10000, currency: "NGN", capacity: 800, remaining: 240, perks: "Full Day Access, Swag Bag, Networking App" },
      { id: "t11-vip", name: "Executive Networking Pass", price: 35000, currency: "NGN", capacity: 150, remaining: 38, perks: "VIP Lounge, Speaker Luncheon, Direct Investor Pitching" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: { soldCount: 420, revenueGross: 4200000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-12",
    title: "Calabar Carnival Music & Heritage Showcase",
    category: "Concerts & Festivals",
    country: "Nigeria",
    countryCode: "NG",
    city: "Calabar",
    state: "Cross River",
    venue: "U.J. Esuene Stadium & Marina Resort, Calabar, Cross River",
    date: "Dec 27, 2026",
    time: "04:00 PM WAT",
    image: "./assets/images/beach-fest.jpg",
    organizer: "Cross River State Tourism Bureau & GATHR Experiences",
    verified: true,
    tags: ["Calabar", "Cross River", "Carnival", "Festival", "Heritage", "Music"],
    description: "Africa's Biggest Street Party live stage experience. Highlighting Nigeria's finest musical icons, vibrant costume bands, street carnival parades, and legendary Cross River culinary traditions.",
    minPrice: 8000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t12-gen", name: "Grandstand General Admission", price: 8000, currency: "NGN", capacity: 10000, remaining: 2800, perks: "Grandstand Seating, Parade Route Entry, Festival Booklet" },
      { id: "t12-vip", name: "VIP Marina Lounge", price: 30000, currency: "NGN", capacity: 500, remaining: 95, perks: "Waterfront VIP Deck, Complimentary Cocktails, Fast-Track Entry" }
    ],
    splits: { host: 70, venue: 20, promoter: 10 },
    stats: { soldCount: 5200, revenueGross: 41600000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-13",
    title: "Delta State Creative & Innovation Expo",
    category: "Tech & AI",
    country: "Nigeria",
    countryCode: "NG",
    city: "Delta (Asaba / Warri)",
    state: "Delta",
    venue: "The Dome Event Centre, Okpanam Road, Asaba, Delta State",
    date: "Jan 23, 2027",
    time: "09:30 AM WAT",
    image: "./assets/images/tech-summit.jpg",
    organizer: "Delta State Innovation Hub & Warri Tech Network",
    verified: true,
    tags: ["Delta", "Asaba", "Warri", "Delta State", "Innovation", "Youth", "Tech"],
    description: "A dynamic gathering uniting creative technologists, Nollywood media creators, and fintech entrepreneurs across Asaba, Warri, and surrounding commercial districts.",
    minPrice: 7500,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t13-reg", name: "Expo Delegate", price: 7500, currency: "NGN", capacity: 1200, remaining: 350, perks: "All Workshops, Creator Demos, Lunch Voucher" },
      { id: "t13-vip", name: "VIP Creator / Investor Pass", price: 25000, currency: "NGN", capacity: 100, remaining: 22, perks: "VIP Dinner, Private Deal Suites, GATHR Digital Badge" }
    ],
    splits: { host: 80, venue: 15, promoter: 5 },
    stats: { soldCount: 540, revenueGross: 4050000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-14",
    title: "Anambra Commerce, Tech & Industrial Gala",
    category: "Executive Galas",
    country: "Nigeria",
    countryCode: "NG",
    city: "Anambra (Awka / Onitsha)",
    state: "Anambra",
    venue: "International Convention Centre (ICC), Awka, Anambra State",
    date: "Feb 06, 2027",
    time: "06:00 PM WAT",
    image: "./assets/images/founders-gala.jpg",
    organizer: "Anambra Chamber of Commerce & Southeast Angel Network",
    verified: true,
    tags: ["Anambra", "Awka", "Onitsha", "Nnewi", "Commerce", "Manufacturing", "Tech"],
    description: "Connecting Onitsha trade powerhouses, Awka digital innovators, industrial leaders, and diaspora investors for an executive evening of trade partnerships and deal financing.",
    minPrice: 50000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t14-founder", name: "Corporate Delegate", price: 50000, currency: "NGN", capacity: 300, remaining: 75, perks: "Gala Dinner, Deal Book Directory, Business Matchmaking" },
      { id: "t14-table", name: "Executive Table (8 Seats)", price: 400000, currency: "NGN", capacity: 20, remaining: 5, perks: "Front VIP Table, Champagne Service, Company Stage Recognition" }
    ],
    splits: { host: 75, venue: 20, promoter: 5 },
    stats: { soldCount: 160, revenueGross: 8000000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-15",
    title: "Ilorin Harmony Youth & Digital Summit",
    category: "Tech & AI",
    country: "Nigeria",
    countryCode: "NG",
    city: "Ilorin",
    state: "Kwara",
    venue: "Kwara State Banquet Hall, Ahmadu Bello Way, Ilorin",
    date: "Jan 14, 2027",
    time: "10:00 AM WAT",
    image: "./assets/images/tech-summit.jpg",
    organizer: "Kwara Innovates & Youth Tech Federation",
    verified: true,
    tags: ["Ilorin", "Kwara", "Harmony", "Youth", "Digital Skills", "Tech"],
    description: "Empowering 1,500+ young builders and students with modern programming, digital freelancing, design systems, and startup mentorship in the State of Harmony.",
    minPrice: 5000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t15-student", name: "Student / Youth Pass", price: 5000, currency: "NGN", capacity: 1500, remaining: 420, perks: "Full Day Access, Certificate of Attendance, Hackathon Entry" },
      { id: "t15-mentor", name: "Mentor / Sponsor Pass", price: 20000, currency: "NGN", capacity: 80, remaining: 24, perks: "VIP Lounge, Mentor Breakfast, Plaque Recognition" }
    ],
    splits: { host: 80, venue: 15, promoter: 5 },
    stats: { soldCount: 780, revenueGross: 3900000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-16",
    title: "Uyo Dakkada Digital Festival & Live Concert",
    category: "Concerts & Festivals",
    country: "Nigeria",
    countryCode: "NG",
    city: "Uyo",
    state: "Akwa Ibom",
    venue: "Ibom Hall, IBB Avenue, Uyo, Akwa Ibom State",
    date: "Dec 12, 2026",
    time: "05:30 PM WAT",
    image: "./assets/images/beach-fest.jpg",
    organizer: "Dakkada Digital Hub & Akwa Ibom Live",
    verified: true,
    tags: ["Uyo", "Akwa Ibom", "Ibom", "Festival", "Live Music", "Culture"],
    description: "An electrifying fusion of live music headliners, creative digital media installations, local Akwa Ibom cuisine, and youth creative awards under the Uyo night sky.",
    minPrice: 6000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t16-gen", name: "Main Hall Admission", price: 6000, currency: "NGN", capacity: 3000, remaining: 820, perks: "Full Concert Access, Cultural Pavilion, Free Glow Stick" },
      { id: "t16-vip", name: "VIP Ibom Deck", price: 25000, currency: "NGN", capacity: 250, remaining: 40, perks: "Elevated Deck, Complimentary Cocktails, Fast-Track Gate" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: { soldCount: 1400, revenueGross: 8400000, checkedInCount: 0 }
  },
  {
    id: "gathr-event-17",
    title: "Bayelsa Maritime Heritage & Peace Festival",
    category: "Concerts & Festivals",
    country: "Nigeria",
    countryCode: "NG",
    city: "Bayelsa (Yenagoa)",
    state: "Bayelsa",
    venue: "Oxbow Lake Pavilion, Swali, Yenagoa, Bayelsa State",
    date: "Jan 09, 2027",
    time: "03:00 PM WAT",
    image: "./assets/images/beach-fest.jpg",
    organizer: "Bayelsa Cultural Foundation & Niger Delta Creative Collective",
    verified: true,
    tags: ["Bayelsa", "Yenagoa", "Oxbow Lake", "Maritime", "Festival", "Heritage", "Peace"],
    description: "Celebrating Niger Delta maritime traditions, water sports, boat regatta parades, highlife and Afrobeats music, and rich Ijaw cultural culinary heritage on the tranquil shores of Oxbow Lake.",
    minPrice: 5000,
    baseCurrency: "NGN",
    ticketTiers: [
      { id: "t17-gen", name: "Lakeside General Pass", price: 5000, currency: "NGN", capacity: 4000, remaining: 980, perks: "Regatta Viewing, Festival Village Access, Cultural Exhibitions" },
      { id: "t17-vip", name: "VIP Lakefront Pavilion", price: 20000, currency: "NGN", capacity: 200, remaining: 35, perks: "Lakefront Pavilion Seating, VIP Bar Service, Fast Gate Validation" }
    ],
    splits: { host: 75, venue: 15, promoter: 10 },
    stats: { soldCount: 1650, revenueGross: 8250000, checkedInCount: 0 }
  }
];

// Helper to convert prices into selected target currency
function convertPrice(amount, fromCurrency, toCurrency) {
  if (fromCurrency === toCurrency) return Math.round(amount);
  const fromRate = GATHR_CURRENCY_RATES[fromCurrency]?.rate || 1.0;
  const toRate = GATHR_CURRENCY_RATES[toCurrency]?.rate || 1.0;
  // Convert to USD base first, then to target
  const inUSD = amount / fromRate;
  const converted = inUSD * toRate;
  return Math.round(converted);
}

function formatCurrency(amount, currencyCode) {
  const meta = GATHR_CURRENCY_RATES[currencyCode] || { symbol: "$", flag: "🌐" };
  return `${meta.symbol}${amount.toLocaleString()}`;
}

// Seed checked-in attendees for the Organizer View
const INITIAL_ATTENDEES = [
  { id: "att-101", name: "Adewale Bello", email: "adewale@paystack.com", tier: "Executive VIP Pass", code: "GTHR-VIP-9021", status: "Checked In", gate: "Gate 1 VIP", checkInTime: "09:14 AM" },
  { id: "att-102", name: "Sarah Jenkins", email: "s.jenkins@londontech.co.uk", tier: "Standard Delegate", code: "GTHR-REG-3419", status: "Checked In", gate: "Gate 3 Main", checkInTime: "09:22 AM" },
  { id: "att-103", name: "Marcus Thorne", email: "marcus@nycventures.io", tier: "Executive VIP Pass", code: "GTHR-VIP-1102", status: "Checked In", gate: "Gate 1 VIP", checkInTime: "09:35 AM" },
  { id: "att-104", name: "Grace Danladi", email: "grace.d@techpoint.africa", tier: "Builder (Early Bird)", code: "GTHR-BDR-7782", status: "Checked In", gate: "Gate 2 East", checkInTime: "09:41 AM" },
  { id: "att-105", name: "Kester Ojo", email: "kester@fintech.io", tier: "Standard Delegate", code: "GTHR-REG-6604", status: "Pending", gate: "—", checkInTime: "—" },
  { id: "att-106", name: "Amara Nwosu", email: "amara@designstudio.ng", tier: "Builder (Early Bird)", code: "GTHR-BDR-5531", status: "Pending", gate: "—", checkInTime: "—" },
  { id: "att-107", name: "David Kimani", email: "david@safaricom.co.ke", tier: "Executive VIP Pass", code: "GTHR-VIP-9901", status: "Pending", gate: "—", checkInTime: "—" },
  { id: "att-108", name: "Elena Rostova", email: "elena@torontotech.ca", tier: "Standard Delegate", code: "GTHR-REG-8822", status: "Pending", gate: "—", checkInTime: "—" }
];
