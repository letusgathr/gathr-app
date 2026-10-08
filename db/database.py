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

    conn.commit()

if __name__ == '__main__':
    init_db()
    print("Database initialized at", DB_PATH)
