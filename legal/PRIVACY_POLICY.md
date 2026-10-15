# GATHR — Global Privacy Policy
**Effective Date:** October 15, 2026  
**Last Updated:** October 15, 2026  
**Regulatory Standards:** Nigeria Data Protection Act 2023 (NDPA), EU General Data Protection Regulation (GDPR), UK GDPR, California Consumer Privacy Act (CCPA/CPRA), Personal Information Protection and Electronic Documents Act (PIPEDA, Canada).

---

## 1. Introduction
At **GATHR** ("we", "us", or "our"), safeguarding your personal data and maintaining transparent privacy practices is fundamental to our mission. This Global Privacy Policy explains how GATHR collects, uses, shares, protects, and retains personal data when you interact with our website, mobile passes, organizer studio, and gate scanning infrastructure.

---

## 2. Roles Under Data Protection Laws
- **GATHR as a Data Controller:** For personal data collected when you register an account, browse events, subscribe to platform communications, or contact customer support, GATHR acts as the Data Controller.
- **GATHR as a Data Processor:** When you purchase a ticket for an independent Organizer's event, the Organizer acts as the Data Controller with respect to attendee contact and entry data, and GATHR acts as the Data Processor on behalf of the Organizer. See our [Data Processing Agreement](file:///c:/Users/A/Desktop/MY%20TECH%20PRODUCTS/GATHR/legal/DATA_PROCESSING_AGREEMENT.md).

---

## 3. Data We Collect
We collect personal data in three primary ways: (a) provided directly by you, (b) collected automatically through device interaction, and (c) received from third parties.

### 3.1. Information You Provide
- **Account Credentials:** Full name, email address, password hash, phone number, and organizational affiliations.
- **Attendee Information:** Ticket holder names, dietary restrictions or custom questionnaire answers specified by organizers for specialized summits/galas.
- **Organizer KYC/KYB Data:** Corporate registration numbers, legal entity name, tax identification, representative identity documentation, and bank account details for settlement.
- **Communications:** Feedback, support tickets, messages sent via WhatsApp or email notification services.

### 3.2. Information Collected Automatically
- **Transaction & Order Data:** Event purchased, ticket tier, order ID, amount paid, timestamp, and payment status (GATHR **never** stores raw credit/debit card numbers; all payment card details are tokenized by PCI-DSS Level 1 compliant processors).
- **Gate Entry & Verification Data:** Timestamp of door check-in, gate turnstile number, device ID of the scanner, and validation status (used to ensure anti-passback security).
- **Device & Usage Telemetry:** IP address, browser type, operating system, localized geofencing coordinates (if location permissions are explicitly granted), and session interactions.
- **Camera Access:** For staff using the GATHR Scanner PWA, camera stream access is requested strictly locally on the client device for instant QR image decoding. Video streams are **never** uploaded or recorded to cloud servers.

---

## 4. Legal Basis for Processing
Under GDPR and NDPA, GATHR processes personal data under the following lawful bases:
1. **Contractual Performance:** To issue and deliver your dynamic QR tickets, process payments, and grant entrance to events.
2. **Legitimate Interests:** To prevent ticket fraud, enforce anti-scalping rules, detect cyber threats, optimize scanner response latency, and protect organizers.
3. **Legal Compliance:** To maintain financial audit records, comply with tax reporting obligations, and fulfill regulatory requirements.
4. **Consent:** To send direct marketing communications, deploy analytical cookies, or utilize precise geolocation for nearby event discovery (consent may be withdrawn at any time).

---

## 5. How We Share Information
We never sell, rent, or monetize your personal data. We disclose data solely to:
- **Event Organizers:** When you register for or purchase a ticket to an event, the designated Organizer receives attendee roster details (name, email, ticket tier, check-in status) to facilitate event logistics.
- **PCI-DSS Payment Gateways:** Paystack, Stripe, and Apple/Google Pay for secure, tokenized payment authorizations.
- **Cloud & Infrastructure Providers:** Amazon Web Services (AWS) and Cloudflare for globally distributed CDN hosting, DDoS mitigation, and encrypted database persistence.
- **Messaging Delivery Services:** Twilio and Meta WhatsApp Business API for automated ticket delivery and emergency event broadcast alerts.
- **Legal & Regulatory Authorities:** When required by valid court order, subpoena, or statutory law enforcement request.

---

## 6. International Cross-Border Data Transfers
GATHR operates globally across North America, Europe, the United Kingdom, and Africa. Personal data may be processed in cloud data centers located in regions outside your country of residence (such as AWS US-East, EU-Frankfurt, and South Africa regions). 

When transferring data across international borders, GATHR enforces Standard Contractual Clauses (SCCs), International Data Transfer Agreements (IDTAs), and NDPC adequacy safeguards to guarantee an equivalent level of data protection.

---

## 7. Data Security Measures
GATHR enforces military-grade technical and organizational security measures:
- **Encryption at Rest:** All personal and financial data stored using AES-256 encryption.
- **Encryption in Transit:** Mandatory TLS 1.3 encryption across all public and internal API endpoints.
- **Cryptographic Ticket Proofs:** Tickets utilize keyed HMAC-SHA512 dynamic hashes that refresh every 20 seconds, ensuring that offline or intercepted screenshots cannot be exploited.
- **Role-Based Access Control (RBAC):** Strict least-privilege access for engineering personnel, with mandatory multi-factor authentication (MFA) and immutable audit logging.

---

## 8. Data Retention
- **Order & Financial Records:** Retained for seven (7) years following the transaction to satisfy legal, tax, and financial audit regulations.
- **Attendee Roster Logs:** Retained in active database clusters for twelve (12) months following event completion, after which personal identifiers are anonymized for aggregate attendance statistics.
- **Inactive Accounts:** Accounts with no login activity for twenty-four (24) months are flagged for archival and permanent deletion upon thirty (30) days' written notice.

---

## 9. Your Privacy Rights
Depending on your geographic jurisdiction (GDPR, NDPA, CCPA/CPRA, PIPEDA), you have the right to:
- **Access:** Request a full copy of the personal data GATHR holds about you.
- **Rectification:** Update or correct incomplete or inaccurate personal data.
- **Erasure ("Right to be Forgotten"):** Request deletion of your personal data, subject to statutory tax and financial retention requirements.
- **Data Portability:** Receive your data in a structured, commonly used, machine-readable format (e.g., JSON or CSV).
- **Opt-Out of Direct Marketing:** Unsubscribe from promotional announcements at any time using the one-click link in any email footer.

To exercise any of these rights, email our Data Protection Officer at: `dpo@gathr.cloud`.

---

## 10. Contact Us
**Data Protection Officer (DPO)**  
GATHR Technologies Inc.  
Email: `dpo@gathr.cloud` / `privacy@gathr.cloud`  
Website: [https://gathr.cloud](https://gathr.cloud)
