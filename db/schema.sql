-- ============================================================================
-- GATHR PRODUCTION POSTGRESQL SCHEMA (v1.0)
-- Powering seamless, fraud-proof access to live and hybrid events
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS & IDENTITY
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'ATTENDEE' CHECK (role IN ('ATTENDEE', 'ORGANIZER', 'STAFF', 'ADMIN')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. ORGANIZATIONS
CREATE TABLE IF NOT EXISTS organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    bank_account_code VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. EVENTS
CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    venue_name VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) DEFAULT 'Nigeria',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'CLOSED', 'CANCELLED')),
    banner_url TEXT,
    host_split_percent INT DEFAULT 70,
    venue_split_percent INT DEFAULT 20,
    promoter_split_percent INT DEFAULT 10,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TICKET TIERS & CAPACITY
CREATE TABLE IF NOT EXISTS ticket_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    price_kobo BIGINT NOT NULL, -- Stored in minor currency units (e.g. kobo or cents)
    currency VARCHAR(10) DEFAULT 'NGN',
    capacity INT NOT NULL,
    sold_count INT DEFAULT 0,
    perks TEXT,
    sale_start TIMESTAMP WITH TIME ZONE,
    sale_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_capacity CHECK (sold_count <= capacity)
);

-- 5. ORDERS & CHECKOUT STATE MACHINE
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_ref VARCHAR(100) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
    subtotal_kobo BIGINT NOT NULL,
    fee_kobo BIGINT NOT NULL,
    total_kobo BIGINT NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    status VARCHAR(50) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED')),
    idempotency_key VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. PAYMENT ATTEMPTS & WEBHOOK DEDUPLICATION
CREATE TABLE IF NOT EXISTS payment_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL, -- 'PAYSTACK', 'STRIPE'
    provider_reference VARCHAR(255) UNIQUE NOT NULL,
    amount_kobo BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'INITIALIZED',
    webhook_event_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TICKETS & DYNAMIC TOTP CREDENTIALS
CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    ticket_tier_id UUID REFERENCES ticket_tiers(id) ON DELETE RESTRICT,
    event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
    attendee_name VARCHAR(255) NOT NULL,
    attendee_email VARCHAR(255) NOT NULL,
    ticket_code VARCHAR(100) UNIQUE NOT NULL, -- Public identifier (e.g. GTHR-VIP-8812)
    secret_salt VARCHAR(100) NOT NULL,       -- Secret seed for TOTP rolling QR validation
    status VARCHAR(50) DEFAULT 'ISSUED' CHECK (status IN ('ISSUED', 'CHECKED_IN', 'REVOKED')),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    checked_in_gate VARCHAR(100),
    checked_in_by_staff UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. CHECK-IN AUDIT TRAIL
CREATE TABLE IF NOT EXISTS check_ins (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID REFERENCES tickets(id) ON DELETE RESTRICT,
    event_id UUID REFERENCES events(id) ON DELETE RESTRICT,
    gate_name VARCHAR(100) NOT NULL,
    staff_user_id UUID REFERENCES users(id),
    scan_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    result VARCHAR(50) NOT NULL, -- 'SUCCESS', 'ALREADY_USED', 'INVALID'
    offline_sync_id VARCHAR(255)
);

-- INDEXES FOR HIGH-THROUGHPUT PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_events_city ON events(city);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(ticket_code);
CREATE INDEX IF NOT EXISTS idx_tickets_event ON tickets(event_id);
CREATE INDEX IF NOT EXISTS idx_orders_ref ON orders(order_ref);
CREATE INDEX IF NOT EXISTS idx_checkins_event ON check_ins(event_id);
