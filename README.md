# GATHR

**Powering seamless access to events.**

GATHR is an event ticketing and operations platform intended to help organizers publish events, sell tickets, manage entry, and understand event performance. Its longer-term vision is an AI-enabled event operating system spanning planning, networking, vendor sourcing, and hybrid experiences.

> **Project status:** The supplied project folder contains product/design documents, pitch decks, and brand images. It does not yet contain an application, source code, dependency manifest, or runnable development environment. This README is the implementation guide, not a claim that the software has already been built.

## Contents

- [Source document audit](#source-document-audit)
- [Product direction and scope](#product-direction-and-scope)
- [Recommended MVP](#recommended-mvp)
- [Development decisions](#development-decisions)
- [Architecture](#architecture)
- [Core data and API design](#core-data-and-api-design)
- [Development plan](#development-plan)
- [Security, payments, and event-day reliability](#security-payments-and-event-day-reliability)
- [Testing and release criteria](#testing-and-release-criteria)
- [Competitive advantage recommendations](#competitive-advantage-recommendations)
- [Success metrics](#success-metrics)
- [Suggested repository structure](#suggested-repository-structure)
- [Questions to resolve before implementation](#questions-to-resolve-before-implementation)

## Source document audit

The guide below consolidates the materials currently in the project folder:

| File | What it contributes | Audit notes |
|---|---|---|
| [GATHR — Product Requirement Document.pdf](./GATHR%20%E2%80%94%20Product%20Requirement%20Document.pdf) | Product vision, personas, MVP requirements, technical direction, KPIs, and exclusions | Main requirements source. Recommends React/Next.js, Node.js, PostgreSQL or Firebase, and Paystack or Stripe, leaving key architecture choices open. |
| [GATHR — UIUX Screens Requirement (PRD) 3.pdf](./GATHR%20%E2%80%94%20UIUX%20Screens%20Requirement%20%28PRD%29%203.pdf) | Public, attendee, organizer, admin, and utility screen inventory | Broad screen inventory, with a smaller Phase 1 screen set. Build the priority flows first; do not implement every listed screen for launch. |
| [GATHR Investor Pitch Deck ✅.pdf](./GATHR%20Investor%20Pitch%20Deck%20%E2%9C%85.pdf) | Positioning, business model, long-term roadmap, and fundraising narrative | Describes a much wider platform than the MVP, including matchmaking, vendor sourcing, virtual events, and white-label licensing. Treat these as later hypotheses, not launch commitments. |
| [Gathr Pitch Deck.pdf](./Gathr%20Pitch%20Deck.pdf) | Earlier/alternate visual product presentation | Eight-page visual PDF; its text is not extractable, so its detailed copy cannot be reliably compared as text. The visible design is consistent with the dark/black and orange brand direction. |
| [Gathr logo.PNG](./Gathr%20logo.PNG) | Primary logo artwork | Square black-background artwork with orange emblem, white GATHR wordmark, and orange tagline. The dark background means a light-background/transparent variant would be useful for product UI. |
| [Gathr logo - cinematic .PNG](./Gathr%20logo%20-%20cinematic%20.PNG) | Cinematic brand artwork | High-impact dark promotional treatment. Better suited to a splash, pitch, or campaign image than a small UI logo. |

### Findings and alignment

1. **The MVP and the vision are different scopes.** The PRD explicitly excludes seat maps, live streaming, vendor/sponsor management, white-label pages, and AI forecasting from the MVP. The pitch deck positions several of those capabilities as the eventual platform. This guide keeps them on the roadmap and out of the first release.
2. **The MVP's hardest product promise is operational reliability.** Secure purchase, one-time ticket validation, and check-in despite poor connectivity are the foundation; they should be delivered before broad AI or marketplace work.
3. **The UI/UX document lists more screens than the lean launch requires.** Its Phase 1 list is a suitable starting point, but purchase, ticket delivery, payment failure/retry, and organizer management still need complete states and acceptance criteria.
4. **The technical choices are unresolved in the source material.** This guide proposes a practical default stack below. Confirm market, payment provider, database, and app architecture before implementation.
5. **Business goals need definitions.** The PRD names targets such as 500 active events, 10,000 tickets, 70% monetized events, organizer setup completion, and sub-10-second check-in. Define the measurement window, denominator, and instrumentation for each before using them as launch gates.
6. **Wallet and payout screens imply real financial operations.** Do not implement a stored-value wallet or hold customer funds as a UI-only feature. Start with payment-provider settlement and a transparent payout ledger; confirm legal and provider requirements before expanding.

## Product direction and scope

### Vision

Become a reliable, intuitive event infrastructure platform for emerging and global markets, reducing operational friction for organizers and improving the attendee experience.

### Users

- **Organizers:** create and publish events, configure ticket inventory, track sales, manage staff, and review attendance.
- **Attendees:** discover events, purchase tickets, receive event information, and enter with a valid ticket.
- **Event staff:** validate tickets with narrowly scoped event permissions.
- **Platform operations:** support users, review reported events, investigate payment issues, and audit privileged actions.

### Core problem

Organizers often rely on disconnected tools for ticketing, payments, check-in, and reporting. Attendees may face unclear event information, fraudulent or duplicated tickets, and slow entry. GATHR should initially solve this connected workflow better than a collection of separate tools.

## Recommended MVP

### Include in the first release

1. Public event discovery, search/filter, and event details.
2. Account registration/login and attendee/organizer access.
3. Organizer event creation, draft/publish, ticket types, limits, and sale windows.
4. Hosted checkout through one selected payment provider.
5. Payment-confirmed ticket issuance, attendee ticket history, and email delivery.
6. Ticket QR validation with one-time check-in.
7. Mobile-friendly organizer/staff scanner with a deliberately scoped offline mode.
8. Basic organizer dashboard: sales, paid orders, check-ins, and downloadable attendee/report data.
9. Supportable operational basics: audit trail, refund/cancellation handling, event announcements, and user support route.

### Defer until the core loop is proven

- Seat maps and reserved seating
- Livestreaming or virtual-event infrastructure
- Vendor/sponsor marketplace
- White-label event pages
- Predictive AI, dynamic pricing, or automated vendor negotiation
- Algorithmic attendee matchmaking
- Native mobile apps, unless pilots demonstrate a PWA is insufficient
- Stored-value wallet, complex payout automation, and multi-currency expansion
- A standalone admin product; begin with restricted operational tools only where needed

### MVP end-to-end acceptance flow

An organizer can create and publish an event with a limited number of tickets. An attendee can discover it, complete a successful or failed payment attempt, and receive a ticket only after payment is confirmed. Authorized staff can validate the ticket at the door. The organizer can see ticket sales and check-ins. Replayed payment notifications and repeated scans do not create duplicate tickets, charges, or check-ins.

## Development decisions

The source documents allow multiple choices. The following are **recommendations**, not existing project decisions:

| Topic | Recommended starting point | Why / decision gate |
|---|---|---|
| Web experience | TypeScript with Next.js; responsive web and installable PWA | Supports public discovery, organizer workflows, and a mobile scanner without separate native clients initially. |
| Backend | Node.js modular monolith with a versioned HTTP API | Keeps transactional rules and permissions in one service while the product and team are small. Split services only when scaling or team boundaries require it. |
| Database | PostgreSQL | Orders, inventory, ticket issuance, payment state, and check-ins need relational constraints and transactions. The PRD permits Firebase, but avoid maintaining competing sources of truth. |
| Payments | Select one provider for the launch market; evaluate Paystack first if the initial market is Nigeria | The PRD names Paystack and Stripe but does not decide. Confirm supported payment methods, settlement, fees, refunds, webhook behavior, and onboarding before committing. |
| Scanner | PWA using the device camera, IndexedDB for a constrained offline queue | Fastest way to validate the scanner workflow. Real devices and venue network conditions must be tested early. |
| Background work | Start with a database-backed outbox/job mechanism; add a queue service when load or retry needs justify it | Avoid operating Redis before a demonstrated need. Notifications and exports can be retried asynchronously. |
| File storage | Private object storage with signed upload/download URLs | Keep event media and exports out of the application database; validate file type and size. |
| Deployment | Managed PostgreSQL, app hosting, object storage, and a transactional email service | Prefer managed infrastructure until usage requires bespoke operations. |

### Development environment

Once the application repository is scaffolded, document exact versions and commands in the root package scripts. The intended baseline is:

- Current supported Node.js LTS, pinned in `.nvmrc` or an equivalent version file
- pnpm or npm, selected once and used consistently in local and CI environments
- PostgreSQL for local and hosted environments
- Payment-provider sandbox credentials and webhook forwarding for local payment tests
- Separate development, staging, and production configuration

There are no install/run commands yet because no `package.json`, application source, or local services configuration exists in the supplied folder. Add working setup commands as part of the foundation milestone; do not copy example secrets into source control.

## Architecture

Begin with a **modular monolith**. Keep domain boundaries clear without introducing distributed services before there is a scale or ownership reason.

```text
Browser / installable PWA
        |
        v
Next.js web app and Node.js API
        |
        +-- PostgreSQL: users, events, inventory, orders, tickets, check-ins
        +-- Object storage: event images and generated exports
        +-- Payment provider: checkout, payment status, refunds/settlement
        +-- Email/SMS provider: receipts, tickets, and event notices
        +-- Background jobs/outbox: retryable notifications and reporting
```

### Key design rules

- The server is authoritative for ticket inventory, payment state, ticket ownership, authorization, and online check-in.
- Use PostgreSQL transactions and constraints for operations that must not duplicate or oversell.
- Keep provider-specific payment code behind a small adapter so payment state handling is testable and a provider can be changed deliberately.
- Keep PII out of QR contents, URLs, logs, analytics events, and scanner caches unless strictly needed.
- Treat payment callbacks and scanner sync as at-least-once delivery; make both idempotent.
- Add explicit API validation, structured logs, error reporting, backups, and migrations from the beginning.
- Use an outbox/job pattern for email, exports, and other side effects so a transient provider error does not lose a confirmed order.
- Track timestamps in UTC and render in the event's configured time zone. Store currency as an ISO currency code and amounts in integer minor units.

## Core data and API design

### Suggested data entities

Use UUIDs or another non-guessable public identifier strategy. Define actual schema and retention rules before implementation.

- `users` — identity and account status
- `organizations` — organizer profile and verification state
- `organization_memberships` — user, organization, and role
- `events` — organizer, title, description, venue, time zone, status, publication dates
- `ticket_types` — event, price/currency, capacity, sale window, per-order limits
- `orders` — buyer, event, totals, currency, status, idempotency key
- `order_items` — ticket type, quantity, unit price and immutable purchase-time snapshot
- `payment_attempts` — provider, provider reference, status, amount, currency
- `payment_webhook_events` — provider event ID and processing outcome for deduplication
- `tickets` — order item, ticket type, opaque token hash, status, issued/revoked timestamps
- `check_ins` — ticket, event, scanner/staff identity, timestamp, result, sync metadata
- `scanner_devices` — event-scoped device authorization and revocation
- `refunds` — original payment/order, amount, provider reference, state
- `audit_events` — actor, action, resource, timestamp, minimal safe context
- `outbox_jobs` — retryable email/notification/export work

### Initial API surface (illustrative)

Use consistent error responses, pagination, authorization, request validation, and a documented API version. Exact endpoint names can change during design.

```text
GET    /api/v1/events
GET    /api/v1/events/{eventId}
POST   /api/v1/organizer/events
PATCH  /api/v1/organizer/events/{eventId}
POST   /api/v1/organizer/events/{eventId}/publish
POST   /api/v1/events/{eventId}/orders
POST   /api/v1/orders/{orderId}/checkout
GET    /api/v1/me/tickets
POST   /api/v1/webhooks/{provider}
POST   /api/v1/organizer/events/{eventId}/check-ins/validate
POST   /api/v1/organizer/events/{eventId}/check-ins/sync
GET    /api/v1/organizer/events/{eventId}/summary
```

### Transactional flows to implement and test

**Ticket purchase**

1. Validate event status, sale window, ticket type, quantity, and per-buyer limit.
2. Create an order and reserve inventory atomically with a clear expiration policy.
3. Start checkout with the payment provider; do not treat a browser redirect as proof of payment.
4. Verify provider webhook signature and amount/currency/reference. Record provider event IDs to reject duplicates.
5. On confirmed payment, atomically mark the order paid, commit inventory, and issue tickets exactly once.
6. Queue receipt/ticket delivery. Retry transient delivery failures without reissuing tickets.
7. Expire unpaid reservations safely and release inventory; reconcile uncertain provider states.

**Check-in**

1. Encode a high-entropy opaque ticket credential in the QR, not personal data or an easily enumerable ticket ID.
2. Resolve/verify the credential on the server and confirm event, ticket state, and staff permission.
3. Atomically record the first valid check-in; later attempts return an explicit already-used result.
4. Record who scanned, when, and through which event/device; avoid storing unnecessary attendee details on scanners.
5. Support correction/reversal only through a permissioned, audited operation.

**Offline check-in limitations**

A disconnected scanner cannot know that another disconnected scanner has just accepted the same ticket. Offline mode must therefore be an explicit trade-off, not a promise of global real-time one-time use.

- Before the event, authorize the scanner and download a minimum, event-scoped ticket-validation dataset or signed validation material.
- Encrypt cached data and use device-scoped credentials, expiry, and revocation rules.
- Persist scans locally with unique idempotency keys; display clear offline/online status and queued-sync count.
- On reconnect, sync idempotently, report conflicts, and expose a staff resolution workflow.
- Pilot the scanner with multiple devices and weak/no connectivity. Define acceptable conflict rates and organizer procedure before enabling offline mode broadly.

## Development plan

### Milestone 0 — Product and design decisions

- Confirm initial country/market, event categories, organizer segment, currency, payment provider, and payout flow.
- Interview target organizers and observe event-day ticketing/check-in.
- Turn the UX screen list into wireframes and clickable core-flow prototype.
- Define event/ticket lifecycle, refund/cancellation rules, data retention, and MVP exclusions.
- Convert the PRD into prioritized stories with acceptance criteria and measurable launch goals.

**Exit gate:** product owner approves the MVP, payment/payout model, and key user flows; unresolved legal/provider questions are tracked.

### Milestone 1 — Foundation

- Scaffold the selected web/API architecture and local development workflow.
- Add lint, formatting, type checking, automated tests, CI, environment validation, and database migrations.
- Implement identity, session lifecycle, organizer membership, and role-based authorization.
- Create responsive design tokens and shared components using the supplied brand assets as references.
- Add logging, error reporting, audit-event conventions, and staging deployment.

**Exit gate:** a user can register/login, an organizer can access an isolated workspace, and deployments/migrations can be performed repeatably.

### Milestone 2 — Event creation and discovery

- Implement event draft, edit, preview, publish, close/cancel lifecycle.
- Add ticket types, capacity, sale windows, quantity limits, and event media.
- Build landing/discovery/search/filter/event detail screens and empty/error states.
- Add public/private event access rules and moderation/support hooks.

**Exit gate:** organizer can create and publish an event; attendee sees correct event and availability on web and mobile.

### Milestone 3 — Orders, payments, and tickets

- Implement inventory reservation and order state machine.
- Integrate one provider in sandbox and production with signed webhook verification.
- Implement success, pending, failure, retry, cancellation, refund, and reconciliation states.
- Issue QR credentials only after confirmed payment (or completed free registration).
- Deliver email ticket and provide authenticated ticket history/download.

**Exit gate:** replayed webhooks and concurrent purchases cannot create duplicate payment effects, oversell inventory, or issue duplicate tickets.

### Milestone 4 — Event operations

- Build scanner PWA, event-scoped staff access, manual lookup fallback, and clear scan result states.
- Implement online atomic one-time check-in before enabling offline scanning.
- Add offline dataset/queue/sync only after threat model, operator policy, and multi-device testing.
- Show live counts and permissioned attendee list; protect exports and personal details.

**Exit gate:** realistic event simulation passes entry-time and duplicate/conflict acceptance criteria, including poor-network scenarios.

### Milestone 5 — Organizer insight and pilot

- Build sales, gross/net revenue, ticket inventory, and attendance reporting with definitions shown.
- Add CSV export with access control and audit logging.
- Run internal testing, then a small number of real-event pilots with support coverage.
- Review funnel drop-off, failed payments, check-in latency, support issues, and organizer feedback before public launch.

**Exit gate:** pilot metrics meet thresholds agreed before the pilot; critical support, reconciliation, and incident procedures are documented.

### Milestone 6 — Post-MVP expansion

Only prioritize features supported by user evidence and usage data. Potential extensions include attendee engagement, organizer growth tools, matchmaking, vendor sourcing, virtual/hybrid events, white-label licensing, and advanced analytics.

## Security, payments, and event-day reliability

### Minimum security requirements

- Enforce object-level authorization on every organizer, event, staff, and ticket operation; never trust an ID supplied by the client.
- Use a maintained authentication/session solution, secure cookies, CSRF protections where relevant, rate limits, and secure account recovery.
- Hash passwords with a modern password-hashing algorithm if handling passwords directly; prefer a managed identity provider if it meets requirements.
- Validate and normalize input server-side; use parameterized database queries and output encoding.
- Store secrets in a managed secret store/environment, never in the repo or client bundle. Keep `.env.example` value-free.
- Require HTTPS; encrypt database/object storage backups; define access and retention policies.
- Limit staff roles by event and action; support immediate device/user revocation.
- Verify webhook signatures and reject stale/invalid callbacks. Never trust payment status sent by the browser.
- Log security-relevant actions, but redact credentials, full QR tokens, payment details, and unnecessary PII.
- Test dependency updates, backups, restore procedures, and an incident/support escalation path.

### Reliability targets to define

The PRD asks for page load under 3 seconds, high concurrency, offline-first check-in, and average check-in under 10 seconds. Convert those into measurable tests:

- Choose page-load metric (for example, p75 Largest Contentful Paint) and target devices/network.
- Define check-in timing start/end and measure median and p95 by online/offline mode.
- Load-test ticket release and checkout around expected event traffic; use a documented peak multiplier.
- Exercise payment provider timeout, delayed webhook, duplicate webhook, and provider outage.
- Exercise scanner refresh, device loss, offline queue exhaustion, conflict, and retry behavior.
- Set service-level objectives only after pilot baselines; alert on payment/check-in failures, not just server uptime.

## Testing and release criteria

Automate tests at multiple levels:

- **Unit:** pricing/tax/fee calculation, ticket availability, state transitions, permission rules.
- **Integration:** database transactions, payment adapter/webhooks, email outbox, check-in atomicity.
- **End-to-end:** organizer publish → attendee purchase → ticket delivery → staff scan → report.
- **Concurrency:** last tickets purchased in parallel; duplicate webhook and duplicate scan races.
- **Offline/device:** supported phones, camera permissions, storage limits, interrupted sync, clock skew.
- **Security:** authorization boundaries, QR replay, webhook forgery, rate limits, file upload validation, sensitive logging.
- **Accessibility/usability:** keyboard and screen-reader support for web; readable scanner result states and touch targets.
- **Operational:** backup restore, migration rollback plan, payment reconciliation, and support runbook.

Before public launch:

- No critical/high-severity defects in purchase, ticket issuance, access control, or check-in.
- All payment states reconcile with provider records; refunds/cancellations are testable and auditable.
- Ticket quantity limits and one-time online check-in survive concurrent requests.
- Staff access is least-privilege and event-scoped.
- Terms, privacy notice, refund/cancellation policy, organizer terms, and support contact are approved.
- Monitoring, alerts, backups, restore test, and event-day escalation rota are ready.

## Competitive advantage recommendations

The strongest differentiated positioning is likely not “AI for every step” at launch. It is **the most dependable and easiest way to run an event end to end in the initial target market**. Validate the following hypotheses with organizers and pilots:

### 1. Make check-in reliability the signature feature

- Fast scan feedback, clear valid/duplicate/invalid states, manual lookup, staff roles, and event-level live counts.
- Offline-capable PWA with transparent sync and conflict handling; do not overpromise duplicate prevention across disconnected scanners.
- Offer a pre-event device/network readiness check and simple staff training mode.
- Measure scan latency, queue time, failed scans, sync conflicts, and support incidents.

**Why it can win:** entry is a high-stakes, visible moment where poor tools damage the event experience. Reliability creates organizer trust and repeat use.

### 2. Build for local payments and settlement, not generic checkout

- Select payment methods based on actual target users and provider coverage (for example, cards and bank transfer where available).
- Show fees, payment status, refunds, and payout timing clearly to organizers and attendees.
- Provide a reconciliation view that links ticket sales, provider settlements, refunds, and net proceeds.
- Consider local currency, time zone, and support workflows from day one; confirm tax/regulatory obligations with qualified advisers.

**Why it can win:** localized, transparent money movement can be more valuable than a long feature list. Verify payment choice and fee tolerance in pilots.

### 3. Turn successful events into repeat business

- Give organizers reusable event templates, duplicate-event setup, saved ticket configurations, and attendee opt-in history.
- Add referral/share links and promo codes with attributable conversion reporting.
- Follow up after the event with attendance/export summaries and a one-click “create similar event” workflow.

**Why it can win:** lower setup effort and measurable repeat attendance help retention and organic growth.

### 4. Make the attendee journey useful before and after the ticket

- Clear event details, calendar add, updates/reminders, ticket wallet/download, transfer policy, and accessible support.
- Add opt-in agenda/networking or attendee community features only when the event format benefits from them.
- Consider group attendance and shareable event pages as a discovery loop, with privacy controls.

**Why it can win:** gives attendees a reason to revisit GATHR instead of treating it as a one-time checkout page.

### 5. Add trust and safety as product features

- Organizer/event verification signals, clear refund/cancellation policy, scam/report flow, and reliable ticket status.
- Avoid exposing attendee PII in QR codes or shareable URLs.
- Give organizers auditable staff actions and a clean resolution path for disputed scans or refunds.

**Why it can win:** trust is central to ticket purchases and adoption, especially for unfamiliar events.

### 6. Use AI only where outcomes can be proven

Start with low-risk assistance such as event copy drafts, checklists, schedule suggestions, or post-event summaries. Require organizer approval, label generated content, and never let generated output silently change ticket prices, payment decisions, attendee access, or vendor commitments.

Add matchmaking, demand forecasting, or automated sourcing only after GATHR has reliable, permissioned data and a measurable evaluation method. Make profile use opt-in and explain why recommendations are shown.

### Suggested competitive roadmap

| Priority | Feature | Evidence to collect before expanding |
|---|---|---|
| MVP | Reliable purchase, ticket delivery, event-scoped QR check-in, basic organizer reporting | Purchase conversion, scan latency, duplicate/reject rate, organizer setup completion |
| Next | Offline scanner resilience, reconciliation/payout transparency, organizer templates and repeat-event tools | Pilot incidents, payout questions, organizer repeat rate |
| Later | Referral/affiliate tools, attendee engagement, opt-in networking | Acquisition attribution, attendee return rate, event-specific engagement |
| Strategic | Vendor marketplace, predictive intelligence, hybrid events, white-label licensing | Demand from paying customers, data readiness, unit economics, support burden |

## Success metrics

Instrument event-level funnels and report definitions consistently. Start with the PRD metrics and add operational measures:

| Metric | Definition to establish |
|---|---|
| Organizer activation | Share of newly registered organizers publishing a first event within an agreed period |
| Unaided setup completion | Share of representative organizers completing event setup without staff help in a usability test |
| Discovery-to-purchase conversion | Completed paid/free registrations divided by eligible event detail visits |
| Tickets sold | Issued tickets; report paid and free separately and exclude refunded/revoked tickets as defined |
| Payment success | Confirmed successful payments divided by provider-attempted checkouts |
| Check-in latency | Time from scan start to clear result; report median and p95 online/offline |
| Check-in success/conflict | Accepted entries, rejected tickets, duplicate attempts, and offline sync conflicts |
| Organizer retention | Organizers publishing or managing another event within the chosen cohort window |
| Revenue per event | Define gross sales, fees, refunds, and net proceeds separately |
| Monetized event share | Define what counts as a monetized event and the measurement window |

The source PRD includes targets of 80% unaided event setup, average check-in under 10 seconds, 500 active events in six months, 10,000 tickets sold in three months, and at least 70% of events generating commission. Treat these as proposed goals to confirm and instrument, not established results.

## Suggested repository structure

This is a proposed structure for when implementation begins; it is not present in the current folder.

```text
gathr/
├── apps/
│   ├── web/                 # Public, attendee, and organizer web/PWA
│   └── admin/               # Add only when operational tooling needs justify it
├── packages/
│   ├── ui/                  # Shared accessible components and design tokens
│   ├── contracts/           # API schemas and shared domain types
│   └── config/              # Shared lint, TypeScript, and test configuration
├── services/
│   └── api/                 # Node.js modular monolith/API
├── docs/
│   ├── decisions/           # Architecture decisions and unresolved choices
│   ├── runbooks/            # Event-day and incident procedures
│   └── product/             # Approved requirements and flows
├── infra/                   # Deployment configuration, added as needed
├── .env.example             # Names and safe local defaults only
├── package.json
└── README.md
```

Prefer fewer deployables at launch. The scanner can be a route/app mode within the web PWA until native capabilities or independent deployment needs are proven.

## Questions to resolve before implementation

1. Which country/city and organizer segment will the first pilot target?
2. Is the first release web-only/PWA, and which browsers/devices must be supported?
3. Which payment provider and payment methods are required for the launch market?
4. Who is merchant of record, who receives settlements, and what are the refund/cancellation and payout rules?
5. What is the expected peak ticket-release traffic and event check-in scale?
6. What offline guarantee is acceptable, and how should staff resolve duplicate scans across disconnected devices?
7. Which user data is necessary, what is the retention/deletion policy, and what legal/compliance review is required?
8. How are the PRD's activation, commission, and active-event targets defined and measured?

Resolve these decisions with the product owner and pilot organizers before building provider-dependent or financially regulated features.


3. Outstanding Features to Make GATHR Marketable & Dominant
To outcompete Eventbrite, Luma, Dice, and Tix.africa, GATHR should introduce these high-leverage features:

"WhatsApp-First" Native Experience (Emerging Market Differentiator)
Deliver tickets and Apple/Google Wallet passes instantly via an automated WhatsApp bot.
Send pre-event updates (directions, parking, entry reminders) directly through WhatsApp, boosting open rates from ~20% (email) to >95%.
Dynamic "Anti-Screenshot" Rolling QR Codes
Rolling TOTP QR codes that regenerate every 15–30 seconds with an animated live timestamp, rendering forwarded screenshots useless to fraudsters.
"Gathr Radar": Intent-Based Micro-Networking
“Most event apps end at check-in; GATHR begins at check-in.”
Attendees specify what they do and who they want to meet; 24 hours prior, GATHR suggests 3 curated connections and an AI-generated icebreaker.
Squad Passes & Social Proof Guest Lists
Let one attendee reserve a block of tickets (e.g., table or group of 5) and share individual split-payment links with friends.
Optional opt-in public attendee cards ("See who's going") to drive organic social FOMO.
Automated Multi-Party Split Payouts
Allow organizers to assign split percentages (e.g., 70% Organizer, 20% Venue, 10% Promoter) that automatically disburse upon payment confirmation.
Mesh-Synced "Zero-Drop" Gate Scanner PWA
A camera-based PWA scanner with pre-cached encrypted ticket credentials and local Wi-Fi peer-to-peer sync, guaranteeing instant sub-0.5s check-in even when cellular networks fail at crowded venue doors.
Organizer AI Co-Pilot
Paste brief bullet points or an audio note to auto-generate event copy, ticket tiers, FAQs, and marketing announcements.