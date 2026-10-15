# GATHR — Data Processing Agreement (DPA)
**Effective Date:** October 15, 2026  
**Governing Regulations:** Article 28 of the EU/UK General Data Protection Regulation (GDPR) & Section 31 of the Nigeria Data Protection Act 2023 (NDPA).

---

This Data Processing Agreement (**"DPA"**) is entered into by and between:
1. **The Event Organizer** using the GATHR Platform to organize, sell tickets to, or manage events (**"Controller"** or **"Organizer"**); and
2. **GATHR Technologies Inc.**, providing cloud ticketing, gate access control, and event operations infrastructure (**"Processor"** or **"GATHR"**).

Together referred to as the **"Parties"** and individually as a **"Party"**.

---

## 1. Purpose and Scope
1.1. This DPA supplements the GATHR [Terms of Service](file:///c:/Users/A/Desktop/MY%20TECH%20PRODUCTS/GATHR/legal/TERMS_OF_SERVICE.md) and applies whenever GATHR processes Personal Data on behalf of the Organizer in connection with the provision of the GATHR Platform.  
1.2. In the event of any conflict between this DPA and the Terms of Service, the terms of this DPA shall govern with respect to Personal Data processing.

---

## 2. Processing Roles & Instructions
2.1. **Role of Controller:** The Organizer acts as the Data Controller with respect to Personal Data collected from event attendees, ticket purchasers, speakers, and event staff.  
2.2. **Role of Processor:** GATHR acts solely as the Data Processor. GATHR processes such Personal Data only on documented, reasonable instructions from the Controller, including with respect to international transfers, unless required to do so by applicable statutory law.  
2.3. **Categories of Data Subjects:** Event attendees, VIP guests, ticket buyers, designated event gate staff, and affiliated vendors.  
2.4. **Types of Personal Data:** Names, email addresses, contact phone numbers, ticket codes, QR check-in status, timestamps, transaction payment references, and organizer-specific survey responses.

---

## 3. Obligations of GATHR (Processor)
3.1. **Confidentiality:** GATHR ensures that all employees, contractors, and agents authorized to process Personal Data are bound by strict statutory or contractual confidentiality obligations.  
3.2. **Security of Processing (Technical & Organizational Measures):** GATHR implements state-of-the-art security measures pursuant to GDPR Article 32 and NDPA Section 39:
   - Dynamic HMAC-SHA512 dynamic QR hashing preventing ticket duplication;
   - Cryptographic encryption of Personal Data in transit (TLS 1.3) and at rest (AES-256);
   - Multi-tenant data segregation ensuring tenant isolation in cloud databases;
   - Real-time DDoS mitigation, rate-limiting, and web application firewalling (WAF);
   - Automated offline local mesh synchronization with cryptographic verification for door check-in scanners.  
3.3. **Sub-processors:** Controller grants general authorization to GATHR to engage sub-processors (including AWS, Cloudflare, Paystack, Stripe, and Twilio) for infrastructure hosting, payment tokenization, and SMS/WhatsApp ticket dispatch. GATHR remains fully liable to Controller for the performance of its sub-processors' obligations.  
3.4. **Personal Data Breach Notification:** GATHR shall notify Controller without undue delay, and in any event within **seventy-two (72) hours**, upon becoming aware of a confirmed Personal Data breach affecting Controller’s attendee data. GATHR shall provide timely information detailing the nature of the breach, affected data categories, and mitigation measures taken.  
3.5. **Assistance with Data Subject Rights:** GATHR shall provide technical tools within the Organizer Studio allowing Controller to fulfill requests from attendees exercising rights of access, rectification, erasure, and data portability.

---

## 4. Obligations of Organizer (Controller)
4.1. **Lawful Basis & Consent:** Controller warrants that it has established a valid lawful basis (including obtaining explicit consent or fulfilling a contract) for collecting Personal Data from attendees and directing GATHR to process it.  
4.2. **Privacy Notice:** Controller shall provide a clear, accessible privacy disclosure to attendees notifying them of the use of GATHR as the event technology and ticketing processor.  
4.3. **Staff Access & Credentials:** Controller shall ensure that gate scanner credentials issued to temporary door staff are restricted to authorized personnel and revoked immediately following event conclusion.

---

## 5. Data Return, Archival & Deletion
5.1. Upon termination of the Organizer’s account or ninety (90) days following the conclusion of an event, GATHR shall, at Controller’s election, either securely delete or return all Personal Data to Controller, unless retention is mandated by statutory tax, accounting, or anti-fraud laws.  
5.2. Anonymized, aggregated statistics (e.g., total scan latency, attendance percentages) that cannot reasonably be linked to any identifiable individual may be retained by GATHR for machine learning model optimization and platform capacity planning.

---

## 6. Audit Rights
6.1. GATHR shall make available to Controller upon reasonable request summaries of third-party security audits (e.g., SOC 2 reports, ISO 27001 certifications, penetration test executive summaries).  
6.2. If a competent supervisory authority (such as the Nigeria Data Protection Commission / NDPC, or an EU Data Protection Authority) mandates an on-site inspection, GATHR shall reasonably cooperate in facilitating such audit under strict confidentiality conditions.

---

## 7. Execution and Acceptance
By deploying the GATHR Platform, creating an event on the GATHR Organizer Studio, or accepting ticket payments via GATHR, Organizer and GATHR mutually execute and enter into this Data Processing Agreement.

**For GATHR Technologies Inc.:**  
*Chief Information Security Officer & Data Protection Officer*  
`dpo@gathr.cloud`
