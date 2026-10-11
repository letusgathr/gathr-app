"""
GATHR Database Engine: SQLite local development database with seed dataset.
"""
import sqlite3
import os
import json

DB_PATH = os.path.join(os.path.dirname(__file__), 'gathr.db')

def get_connection():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    c = conn.cursor()

    c.execute("""
    CREATE TABLE IF NOT EXISTS events (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        description TEXT,
        city TEXT NOT NULL,
        venue TEXT NOT NULL,
        date TEXT NOT NULL,
        time TEXT NOT NULL,
        image TEXT,
        organizer TEXT,
        min_price INTEGER,
        currency TEXT DEFAULT '₦',
        host_split INTEGER DEFAULT 70,
        venue_split INTEGER DEFAULT 20,
        promoter_split INTEGER DEFAULT 10,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS ticket_tiers (
        id TEXT PRIMARY KEY,
        event_id TEXT REFERENCES events(id),
        name TEXT NOT NULL,
        price INTEGER NOT NULL,
        capacity INTEGER NOT NULL,
        remaining INTEGER NOT NULL,
        perks TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        order_ref TEXT UNIQUE NOT NULL,
        event_id TEXT REFERENCES events(id),
        tier_id TEXT,
        attendee_name TEXT NOT NULL,
        attendee_email TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        subtotal INTEGER NOT NULL,
        fee INTEGER NOT NULL,
        total INTEGER NOT NULL,
        status TEXT DEFAULT 'PAID',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        order_ref TEXT,
        event_id TEXT,
        tier_name TEXT NOT NULL,
        attendee_name TEXT NOT NULL,
        attendee_email TEXT NOT NULL,
        ticket_code TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'ISSUED',
        checked_in_at TEXT,
        checked_in_gate TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS check_ins (
        id TEXT PRIMARY KEY,
        ticket_code TEXT NOT NULL,
        event_id TEXT NOT NULL,
        gate_name TEXT NOT NULL,
        result TEXT NOT NULL,
        scan_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS vendors (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        rating REAL NOT NULL,
        reviews_count INTEGER NOT NULL,
        location TEXT NOT NULL,
        starting_price INTEGER NOT NULL,
        verified INTEGER DEFAULT 1,
        image TEXT,
        specialty TEXT,
        contact_email TEXT
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS vendor_rfps (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        vendor_id TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        category TEXT NOT NULL,
        budget INTEGER NOT NULL,
        scope TEXT,
        status TEXT DEFAULT 'Escrow Funded',
        escrow_amount INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS run_of_show (
        id TEXT PRIMARY KEY,
        event_id TEXT NOT NULL,
        time_slot TEXT NOT NULL,
        activity TEXT NOT NULL,
        stage TEXT NOT NULL,
        lead TEXT NOT NULL,
        tech_cue TEXT,
        status TEXT DEFAULT 'Scheduled'
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS networking_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        company TEXT NOT NULL,
        industry TEXT NOT NULL,
        location TEXT NOT NULL,
        stated_goal TEXT NOT NULL,
        icebreaker TEXT NOT NULL,
        avatar TEXT NOT NULL,
        score TEXT NOT NULL
    )
    """)

    c.execute("""
    CREATE TABLE IF NOT EXISTS offline_sync_logs (
        id TEXT PRIMARY KEY,
        ticket_code TEXT NOT NULL,
        gate TEXT NOT NULL,
        scanned_at TEXT NOT NULL,
        synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        device_id TEXT
    )
    """)

    conn.commit()

    # Seed if events table is empty
    c.execute("SELECT COUNT(*) FROM events")
    if c.fetchone()[0] == 0:
        seed_data(conn)

    conn.close()

def seed_data(conn):
    c = conn.cursor()
    events = [
        (
            "gathr-event-01",
            "GATHR Tech Summit: Africa AI & Future of Systems",
            "Tech & AI",
            "The flagship gathering of 3,000+ builders, founders, and engineering leaders shaping Africa's AI ecosystem.",
            "Lagos",
            "Eko Convention Centre, Victoria Island, Lagos",
            "Nov 28, 2026",
            "09:00 AM WAT",
            "./assets/images/tech-summit.jpg",
            "GATHR Technologies & Lagos Innovates",
            15000,
            "₦", 70, 20, 10
        ),
        (
            "gathr-event-02",
            "Vibrations: Afrobeats & Neon Night Festival",
            "Concerts & Festivals",
            "The ultimate beach festival experience combining electrifying Afrobeats headliners and neon art.",
            "Lagos",
            "Landmark Beach, Water Corporation Drive, VI",
            "Dec 19, 2026",
            "06:00 PM WAT",
            "./assets/images/beach-fest.jpg",
            "LiveNation Africa & Mainland Vibes",
            12000,
            "₦", 70, 20, 10
        ),
        (
            "gathr-event-03",
            "Global Founders & VC Private Gala Dinner",
            "Executive Galas",
            "An invitation-backed, high-level evening gathering 120 top venture capitalists and tech founders.",
            "Abuja",
            "Congress Hall, Transcorp Hilton, Maitama, Abuja",
            "Jan 16, 2027",
            "07:00 PM WAT",
            "./assets/images/founders-gala.jpg",
            "African Venture Council & Angel Network",
            150000,
            "₦", 70, 20, 10
        )
    ]

    c.executemany("""
    INSERT INTO events (id, title, category, description, city, venue, date, time, image, organizer, min_price, currency, host_split, venue_split, promoter_split)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, events)

    # Seed Tiers for Event 01
    tiers = [
        ("t1-early", "gathr-event-01", "Builder (Early Bird)", 15000, 500, 142, "Full Keynote Access, Builder Swag Bag"),
        ("t1-regular", "gathr-event-01", "Standard Delegate", 30000, 1200, 840, "Keynotes + Workshops, Catered Lunch"),
        ("t1-vip", "gathr-event-01", "Executive VIP Pass", 95000, 200, 46, "VIP Lounge, Speaker Dinner, Fast-Track Gate Entry"),
        ("t1-squad", "gathr-event-01", "Squad Pass (Group of 4)", 90000, 100, 31, "4 Passes at 25% discount, Reserved Seating"),
        
        ("t2-early", "gathr-event-02", "General Admission", 12000, 2000, 320, "Full Stage Access, Beach Access"),
        ("t2-vip", "gathr-event-02", "VIP Beach Deck", 50000, 350, 82, "Elevated Deck View, Free Drinks Token"),
        
        ("t3-founder", "gathr-event-03", "Founder Ticket", 150000, 60, 12, "4-Course Dinner, Deal Room Directory"),
        ("t3-investor", "gathr-event-03", "LP / GP Partner Pass", 300000, 40, 8, "Private Pre-Dinner Reception, LP Briefing")
    ]

    c.executemany("""
    INSERT INTO ticket_tiers (id, event_id, name, price, capacity, remaining, perks)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    """, tiers)

    # Seed verified tickets
    sample_tickets = [
        ("tkt-01", "GTHR-ORD-1001", "gathr-event-01", "Executive VIP Pass", "Adewale Bello", "adewale@paystack.com", "GTHR-VIP-9021", "CHECKED_IN", "09:14 AM", "Gate 1 (VIP & Fast-Track)"),
        ("tkt-02", "GTHR-ORD-1002", "gathr-event-01", "Standard Delegate", "Ngozi Chukwu", "ngozi@flutterwave.com", "GTHR-REG-3419", "CHECKED_IN", "09:22 AM", "Gate 3 Main"),
        ("tkt-03", "GTHR-ORD-1003", "gathr-event-01", "Executive VIP Pass", "Chinedu Eze", "chinedu@gmail.com", "GTHR-VIP-8812", "ISSUED", None, None),
        ("tkt-04", "GTHR-ORD-1004", "gathr-event-01", "Builder (Early Bird)", "Grace Danladi", "grace.d@techpoint.africa", "GTHR-BDR-7782", "CHECKED_IN", "09:41 AM", "Gate 2 East"),
        ("tkt-05", "GTHR-ORD-1005", "gathr-event-01", "Standard Delegate", "Kester Ojo", "kester@fintech.io", "GTHR-REG-6604", "ISSUED", None, None)
    ]

    c.executemany("""
    INSERT INTO tickets (id, order_ref, event_id, tier_name, attendee_name, attendee_email, ticket_code, status, checked_in_at, checked_in_gate)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, sample_tickets)

    # Seed Vetted Vendors
    vendors = [
        (
            "vnd-01",
            "Pulse Audio-Visual & Stage Dynamics",
            "Audio/Visual & Lighting",
            4.95, 48,
            "Victoria Island, Lagos",
            4500000, 1,
            "./assets/images/tech-summit.jpg",
            "Line-array sound systems, 4K LED concert walls, intelligent moving heads & robotic beam lighting.",
            "bookings@pulseaudio.ng"
        ),
        (
            "vnd-02",
            "Savory Roots Catering & Mixology",
            "Catering & Bar Operations",
            4.92, 34,
            "Ikoyi, Lagos",
            3200000, 1,
            "./assets/images/founders-gala.jpg",
            "Gourmet Pan-African fusion banquets, VIP hospitality lounges, artisan cocktail mixology bars.",
            "events@savoryroots.ng"
        ),
        (
            "vnd-03",
            "Apex Tactical Security & Crowd Flow",
            "Security & Access Marshalling",
            4.98, 62,
            "Lagos / Abuja",
            1800000, 1,
            "./assets/images/beach-fest.jpg",
            "Bouncer details, high-density metal detector portals, VIP close protection, tactical gate marshals.",
            "ops@apexsecurity.africa"
        ),
        (
            "vnd-04",
            "CineStream 4K Multi-Cam & Drone Ops",
            "Media & Live Broadcast",
            4.89, 29,
            "Yaba, Lagos",
            2500000, 1,
            "./assets/images/tech-summit.jpg",
            "Low-latency RTMP cloud streaming, 4K wireless steady-cams, FPV drone flyovers, post-event 4K reels.",
            "production@cinestream.io"
        ),
        (
            "vnd-05",
            "Aura Spatial Experience & Stage Architecture",
            "Event Decor & Staging",
            4.91, 21,
            "Lekki, Lagos",
            3800000, 1,
            "./assets/images/beach-fest.jpg",
            "Custom modular stage rigging, neon aesthetic photo-op installations, branded entry arches.",
            "hello@auraspatial.com"
        )
    ]

    c.executemany("""
    INSERT INTO vendors (id, name, category, rating, reviews_count, location, starting_price, verified, image, specialty, contact_email)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, vendors)

    # Seed Sample Active RFP Escrow
    rfps = [
        (
            "rfp-101",
            "gathr-event-01",
            "vnd-01",
            "Pulse Audio-Visual & Stage Dynamics",
            "Audio/Visual & Lighting",
            4500000,
            "Full mainstage 4K LED wall (12m x 4m), 8 wireless Shure lapels, acoustic delay towers, 100kW backup generator.",
            "Escrow Funded (Milestone 1/2)",
            2250000
        ),
        (
            "rfp-102",
            "gathr-event-01",
            "vnd-02",
            "Savory Roots Catering & Mixology",
            "Catering & Bar Operations",
            3200000,
            "Catered executive buffet for 200 VIP pass holders, continuous artisan espresso bar, barista lounge.",
            "Escrow Funded (Milestone 1/2)",
            1600000
        )
    ]

    c.executemany("""
    INSERT INTO vendor_rfps (id, event_id, vendor_id, vendor_name, category, budget, scope, status, escrow_amount)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, rfps)

    # Seed Run of Show Schedule
    schedule = [
        ("ros-01", "gathr-event-01", "08:00 AM - 09:00 AM", "Gate Access & Holographic Badge Verification", "Entry Atrium & Gates 1-3", "Access Operations Team", "Queue ambient lo-fi playlist; gate scanners online; NFC badge sync active.", "Completed"),
        ("ros-02", "gathr-event-01", "09:00 AM - 09:30 AM", "Opening Keynote: The Architecture of African AI Scale", "Mainstage Arena", "Keynote Speaker & Stage Lead", "Dim arena lighting to 30%; trigger primary keynote visuals on 4K LED wall.", "Scheduled"),
        ("ros-03", "gathr-event-01", "09:30 AM - 10:45 AM", "High-Concurrency Infrastructure Panel", "Mainstage Arena", "Panel Moderator + 4 Guests", "Bring 4 wireless handheld mics live; initiate Q&A audience polling via GATHR app.", "Scheduled"),
        ("ros-04", "gathr-event-01", "10:45 AM - 11:30 AM", "GATHR Radar 1-on-1 Curated Networking Coffee", "VIP Networking Lounge", "AI Matchmaking Concierge", "Background jazz audio; push in-app meeting slot prompts to matched attendees.", "Scheduled"),
        ("ros-05", "gathr-event-01", "11:30 AM - 01:00 PM", "Technical Deep Dives: Offline Systems & Agentic Web", "Hall B (Breakout Track)", "Engineering Directors", "Screen sharing enabled on dual side projectors; live interactive terminals.", "Scheduled"),
        ("ros-06", "gathr-event-01", "01:00 PM - 02:00 PM", "Savory Roots Executive Networking Luncheon", "Courtyard Dining Suite", "Catering & Hospitality Lead", "Buffet stations 1-4 active; dietary color-coded catering cards displayed.", "Scheduled"),
        ("ros-07", "gathr-event-01", "02:00 PM - 04:00 PM", "Startup Pitch Showcase & Venture Capital Deal Room", "Mainstage Arena", "Investor Committee Lead", "Strict 4-minute timer on confidence monitor; live audience voting HUD.", "Scheduled"),
        ("ros-08", "gathr-event-01", "04:00 PM - 06:00 PM", "Sunset Neon Rooftop Mixer & Closing Reception", "Landmark Terrace", "Event DJ & Bar Team", "Afrobeats sunset mix; neon accent fixtures powered on; open networking.", "Scheduled")
    ]

    c.executemany("""
    INSERT INTO run_of_show (id, event_id, time_slot, activity, stage, lead, tech_cue, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, schedule)

    # Seed Radar Networking Profiles
    profiles = [
        (
            "net-01",
            "Dr. Kemi Balogun",
            "Partner",
            "Ventures Platform",
            "Venture Capital & AI",
            "Lagos / London",
            "Deploying seed capital ($250k - $1M) into African AI infrastructure, payments, and offline-first tooling.",
            "Ask Dr. Kemi about Ventures Platform's recent thesis on offline-first agentic infrastructure.",
            "KB",
            "98% Match"
        ),
        (
            "net-02",
            "Tariq Al-Mansoor",
            "Head of AI Engineering",
            "Mono",
            "Fintech & Concurrency",
            "Lagos, Nigeria",
            "Architecting high-concurrency payment routing and sub-second fraud detection pipelines across West Africa.",
            "Ask Tariq how Mono handles transaction state machines during intermittent telecom drops.",
            "TA",
            "94% Match"
        ),
        (
            "net-03",
            "Folake Oladipo",
            "Founder & CEO",
            "HealthStack Africa",
            "HealthTech & Enterprise",
            "Abuja, Nigeria",
            "Scaling B2B hospital operating systems, navigating enterprise compliance, and hiring distributed systems leads.",
            "Ask Folake about her experience navigating hospital procurement cycles and multi-market expansion.",
            "FO",
            "91% Match"
        ),
        (
            "net-04",
            "Ibrahim Danjuma",
            "VP of Product",
            "Kuda Technologies",
            "Digital Banking & Mobile UX",
            "Lagos / Cape Town",
            "Looking to partner with next-gen event ticketing platforms for embedded consumer banking and split-pay savings.",
            "Ask Ibrahim about embedded banking APIs and biometric authentication UX.",
            "ID",
            "89% Match"
        )
    ]

    c.executemany("""
    INSERT INTO networking_profiles (id, name, role, company, industry, location, stated_goal, icebreaker, avatar, score)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, profiles)

    conn.commit()

if __name__ == '__main__':
    # Re-initialize cleanly
    if os.path.exists(DB_PATH):
        try:
            os.remove(DB_PATH)
        except Exception:
            pass
    init_db()
    print("Database cleanly initialized with production records at", DB_PATH)
