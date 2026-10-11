/**
 * GATHR AI Planning Studio & Vendor Marketplace Engine
 * Phase 2 OS Layer: Run-of-Show Scheduling, AI Budgeting, & Vetted Vendor Sourcing
 */

class GathrPlanning {
  constructor() {
    this.currentTab = 'schedule'; // 'schedule' | 'budget' | 'vendors' | 'rfps'
    this.activeCategory = 'all';

    this.vendors = [
      {
        id: "vnd-01",
        name: "Pulse Audio-Visual & Stage Dynamics",
        category: "Audio/Visual & Lighting",
        categoryKey: "av",
        rating: 4.95,
        reviewsCount: 48,
        location: "Victoria Island, Lagos",
        startingPrice: 4500000,
        verified: true,
        image: "./assets/images/tech-summit.jpg",
        specialty: "Line-array sound systems, 4K LED concert walls, intelligent moving heads & robotic beam lighting.",
        contactEmail: "bookings@pulseaudio.ng"
      },
      {
        id: "vnd-02",
        name: "Savory Roots Catering & Mixology",
        category: "Catering & Bar Operations",
        categoryKey: "catering",
        rating: 4.92,
        reviewsCount: 34,
        location: "Ikoyi, Lagos",
        startingPrice: 3200000,
        verified: true,
        image: "./assets/images/founders-gala.jpg",
        specialty: "Gourmet Pan-African fusion banquets, VIP hospitality lounges, artisan cocktail mixology bars.",
        contactEmail: "events@savoryroots.ng"
      },
      {
        id: "vnd-03",
        name: "Apex Tactical Security & Crowd Flow",
        category: "Security & Marshalling",
        categoryKey: "security",
        rating: 4.98,
        reviewsCount: 62,
        location: "Lagos / Abuja",
        startingPrice: 1800000,
        verified: true,
        image: "./assets/images/beach-fest.jpg",
        specialty: "Bouncer details, high-density metal detector portals, VIP close protection, tactical gate marshals.",
        contactEmail: "ops@apexsecurity.africa"
      },
      {
        id: "vnd-04",
        name: "CineStream 4K Multi-Cam & Drone Ops",
        category: "Media & Broadcast",
        categoryKey: "media",
        rating: 4.89,
        reviewsCount: 29,
        location: "Yaba, Lagos",
        startingPrice: 2500000,
        verified: true,
        image: "./assets/images/tech-summit.jpg",
        specialty: "Low-latency RTMP cloud streaming, 4K wireless steady-cams, FPV drone flyovers, post-event 4K reels.",
        contactEmail: "production@cinestream.io"
      },
      {
        id: "vnd-05",
        name: "Aura Spatial Experience & Stage Architecture",
        category: "Decor & Staging",
        categoryKey: "decor",
        rating: 4.91,
        reviewsCount: 21,
        location: "Lekki, Lagos",
        startingPrice: 3800000,
        verified: true,
        image: "./assets/images/beach-fest.jpg",
        specialty: "Custom modular stage rigging, neon aesthetic photo-op installations, branded entry arches.",
        contactEmail: "hello@auraspatial.com"
      }
    ];

    this.runOfShow = [
      { id: "ros-01", timeSlot: "08:00 AM - 09:00 AM", activity: "Gate Access & Holographic Badge Verification", stage: "Entry Atrium & Gates 1-3", lead: "Access Operations Team", cue: "Ambient lo-fi playlist; gate scanners online; NFC badge sync active.", status: "Completed" },
      { id: "ros-02", timeSlot: "09:00 AM - 09:30 AM", activity: "Opening Keynote: The Architecture of African AI Scale", stage: "Mainstage Arena", lead: "Keynote Speaker & Stage Lead", cue: "Dim arena lighting to 30%; trigger primary keynote visuals on 4K LED wall.", status: "Active Now" },
      { id: "ros-03", timeSlot: "09:30 AM - 10:45 AM", activity: "High-Concurrency Infrastructure Panel", stage: "Mainstage Arena", lead: "Panel Moderator + 4 Guests", cue: "Bring 4 wireless handheld mics live; initiate Q&A audience polling via GATHR app.", status: "Scheduled" },
      { id: "ros-04", timeSlot: "10:45 AM - 11:30 AM", activity: "GATHR Radar 1-on-1 Curated Networking Coffee", stage: "VIP Networking Lounge", lead: "AI Matchmaking Concierge", cue: "Background jazz audio; push in-app meeting slot prompts to matched attendees.", status: "Scheduled" },
      { id: "ros-05", timeSlot: "11:30 AM - 01:00 PM", activity: "Technical Deep Dives: Offline Systems & Agentic Web", stage: "Hall B (Breakout Track)", lead: "Engineering Directors", cue: "Screen sharing enabled on dual side projectors; live interactive terminals.", status: "Scheduled" },
      { id: "ros-06", timeSlot: "01:00 PM - 02:00 PM", activity: "Savory Roots Executive Networking Luncheon", stage: "Courtyard Dining Suite", lead: "Catering & Hospitality Lead", cue: "Buffet stations 1-4 active; dietary color-coded catering cards displayed.", status: "Scheduled" },
      { id: "ros-07", timeSlot: "02:00 PM - 04:00 PM", activity: "Startup Pitch Showcase & Venture Capital Deal Room", stage: "Mainstage Arena", lead: "Investor Committee Lead", cue: "Strict 4-minute timer on confidence monitor; live audience voting HUD.", status: "Scheduled" },
      { id: "ros-08", timeSlot: "04:00 PM - 06:00 PM", activity: "Sunset Neon Rooftop Mixer & Closing Reception", stage: "Landmark Terrace", lead: "Event DJ & Bar Team", cue: "Afrobeats sunset mix; neon accent fixtures powered on; open networking.", status: "Scheduled" }
    ];

    this.activeRfps = [
      { id: "rfp-101", vendorName: "Pulse Audio-Visual", category: "Audio/Visual & Lighting", budget: 4500000, escrowAmount: 2250000, status: "Escrow Funded (Milestone 1/2)", deliverables: "12m 4K LED concert wall, 8 lapel mics, soundcheck signoff" },
      { id: "rfp-102", vendorName: "Savory Roots Catering", category: "Catering & Bar Operations", budget: 3200000, escrowAmount: 1600000, status: "Escrow Funded (Milestone 1/2)", deliverables: "200 VIP plated lunches, continuous artisan coffee bar" }
    ];

    this.budgetState = {
      targetAttendees: 1500,
      avgTicketPrice: 35000,
      venuePct: 22,
      productionPct: 28,
      cateringPct: 18,
      securityPct: 6,
      marketingPct: 10,
      platformFeePct: 2.5
    };
  }

  init() {
    this.renderTabs();
    this.renderRunOfShow();
    this.renderBudgetEstimator();
    this.renderVendors();
    this.renderRfps();
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.planning-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    ['schedule', 'budget', 'vendors', 'rfps'].forEach(t => {
      const el = document.getElementById(`planning-panel-${t}`);
      if (el) el.style.display = (t === tabName) ? 'block' : 'none';
    });
  }

  renderTabs() {
    this.switchTab(this.currentTab);
  }

  renderRunOfShow() {
    const container = document.getElementById('ros-timeline-container');
    if (!container) return;

    container.innerHTML = this.runOfShow.map(item => {
      const isDone = item.status === 'Completed';
      const isNow = item.status === 'Active Now';
      const cardClass = isDone ? 'completed' : (isNow ? 'active-now' : '');
      const badgeStyle = isNow ? 'background: var(--brand-orange); color: #000;' : '';

      return `
        <div class="ros-item-card ${cardClass}">
          <div class="ros-time-badge" style="${badgeStyle}">
            ${item.timeSlot}
          </div>
          <div class="ros-content-wrap">
            <div class="ros-activity-title">
              <span>${item.activity}</span>
              ${isNow ? '<span class="badge-pill" style="background: var(--brand-orange); color: #000; font-size: 0.65rem;">LIVE NOW</span>' : ''}
              ${isDone ? '<span class="badge-pill" style="background: rgba(0,230,118,0.2); color: var(--accent-green); font-size: 0.65rem;">DONE ✓</span>' : ''}
            </div>
            <div style="font-size: 0.85rem; color: var(--text-muted); display: flex; gap: 1rem; flex-wrap: wrap;">
              <span>📍 <strong>Stage:</strong> ${item.stage}</span>
              <span>👤 <strong>Lead:</strong> ${item.lead}</span>
            </div>
            <div class="ros-cue-box">
              <span style="color: var(--brand-amber); font-weight: 700;">Tech & Stage Cue:</span> ${item.cue}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  optimizeTimelineWithAi() {
    if (window.gathrApp) {
      window.gathrApp.showToast("⚡ AI Logistics Agent: Optimizing speaker transitions & inserting 15-min audio soundcheck buffers...");
    }
    setTimeout(() => {
      this.runOfShow.splice(3, 0, {
        id: `ros-opt-${Date.now()}`,
        timeSlot: "10:30 AM - 10:45 AM",
        activity: "AI Buffer & Audience Pulse Check",
        stage: "Mainstage Arena",
        lead: "GATHR Real-Time Engagement Bot",
        cue: "Broadcast 60-second interactive sentiment poll to attendee passes.",
        status: "Scheduled"
      });
      this.renderRunOfShow();
      if (window.gathrApp) {
        window.gathrApp.showToast("✓ Schedule optimized! Buffer slots inserted and stage cues synchronized.");
      }
    }, 1000);
  }

  addCustomRunOfShowItem() {
    const title = prompt("Enter session / activity title:", "Fireside Chat: Cross-Border Liquidity");
    if (!title) return;
    const time = prompt("Enter time slot (e.g. 03:00 PM - 03:45 PM):", "03:00 PM - 03:45 PM");
    if (!time) return;

    this.runOfShow.push({
      id: `ros-${Date.now()}`,
      timeSlot: time,
      activity: title,
      stage: "Mainstage Arena",
      lead: "Session Lead",
      cue: "Dim house lights, test primary wireless mics 1 & 2.",
      status: "Scheduled"
    });
    this.renderRunOfShow();
    if (window.gathrApp) {
      window.gathrApp.showToast(`✓ "${title}" added to live event schedule.`);
    }
  }

  renderBudgetEstimator() {
    const grossGmv = this.budgetState.targetAttendees * this.budgetState.avgTicketPrice;
    const platformFee = grossGmv * (this.budgetState.platformFeePct / 100);
    const venueCost = grossGmv * (this.budgetState.venuePct / 100);
    const productionCost = grossGmv * (this.budgetState.productionPct / 100);
    const cateringCost = grossGmv * (this.budgetState.cateringPct / 100);
    const securityCost = grossGmv * (this.budgetState.securityPct / 100);
    const marketingCost = grossGmv * (this.budgetState.marketingPct / 100);
    const totalExpenses = platformFee + venueCost + productionCost + cateringCost + securityCost + marketingCost;
    const projectedProfit = grossGmv - totalExpenses;

    const gmvEl = document.getElementById('est-gross-gmv');
    const tixEl = document.getElementById('est-attendee-count-label');
    const priceEl = document.getElementById('est-avg-price-label');
    const feeEl = document.getElementById('est-platform-fee');
    const venueEl = document.getElementById('est-venue-cost');
    const prodEl = document.getElementById('est-production-cost');
    const catEl = document.getElementById('est-catering-cost');
    const secEl = document.getElementById('est-security-cost');
    const mktEl = document.getElementById('est-marketing-cost');
    const profitEl = document.getElementById('est-projected-profit');

    if (gmvEl) gmvEl.innerText = `₦${grossGmv.toLocaleString()}`;
    if (tixEl) tixEl.innerText = `${this.budgetState.targetAttendees.toLocaleString()} passes`;
    if (priceEl) priceEl.innerText = `₦${this.budgetState.avgTicketPrice.toLocaleString()}`;
    if (feeEl) feeEl.innerText = `₦${Math.round(platformFee).toLocaleString()}`;
    if (venueEl) venueEl.innerText = `₦${Math.round(venueCost).toLocaleString()}`;
    if (prodEl) prodEl.innerText = `₦${Math.round(productionCost).toLocaleString()}`;
    if (catEl) catEl.innerText = `₦${Math.round(cateringCost).toLocaleString()}`;
    if (secEl) secEl.innerText = `₦${Math.round(securityCost).toLocaleString()}`;
    if (mktEl) mktEl.innerText = `₦${Math.round(marketingCost).toLocaleString()}`;
    if (profitEl) profitEl.innerText = `₦${Math.round(projectedProfit).toLocaleString()}`;
  }

  updateBudgetAttendeeInput(val) {
    this.budgetState.targetAttendees = parseInt(val, 10);
    this.renderBudgetEstimator();
  }

  updateBudgetPriceInput(val) {
    this.budgetState.avgTicketPrice = parseInt(val, 10);
    this.renderBudgetEstimator();
  }

  renderVendors() {
    const grid = document.getElementById('vendor-cards-grid');
    if (!grid) return;

    let list = this.vendors;
    if (this.activeCategory !== 'all') {
      list = list.filter(v => v.categoryKey === this.activeCategory);
    }

    grid.innerHTML = list.map(v => `
      <div class="vendor-card">
        <div class="vendor-img-wrap">
          <img src="${v.image}" alt="${v.name}" class="vendor-img">
          <div class="vendor-badge-cat">${v.category}</div>
          ${v.verified ? '<div class="vendor-verified-pill">VERIFIED PARTNER ✓</div>' : ''}
        </div>
        <div class="vendor-body">
          <div>
            <div class="vendor-title">${v.name}</div>
            <div class="vendor-meta-row">
              <span style="color: var(--brand-amber); font-weight: 700;">★ ${v.rating} (${v.reviewsCount} verified reviews)</span>
              <span>•</span>
              <span>📍 ${v.location}</span>
            </div>
            <div class="vendor-specialty">${v.specialty}</div>
          </div>
          <div class="vendor-footer">
            <div>
              <div class="vendor-price-tag">Packages from</div>
              <div class="vendor-price-val">₦${v.startingPrice.toLocaleString()}</div>
            </div>
            <button class="btn btn-primary btn-sm" onclick="gathrPlanning.openRfpModal('${v.id}')">
              Request RFP & Escrow
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  filterVendors(categoryKey) {
    this.activeCategory = categoryKey;
    document.querySelectorAll('.vendor-cat-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === categoryKey);
    });
    this.renderVendors();
  }

  renderRfps() {
    const container = document.getElementById('rfps-list-container');
    if (!container) return;

    if (this.activeRfps.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No active RFPs yet. Sourced vendors will appear here.</div>`;
      return;
    }

    container.innerHTML = this.activeRfps.map(r => `
      <div class="ros-item-card" style="border-left: 4px solid var(--accent-green);">
        <div class="ros-content-wrap">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-weight: 700; font-size: 1.15rem; color: #FFF;">${r.vendorName}</div>
            <span class="badge badge-green">${r.status}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            Category: <strong>${r.category}</strong> • Agreed Budget: <strong style="color: #FFF;">₦${r.budget.toLocaleString()}</strong>
          </div>
          <div style="font-size: 0.8rem; color: var(--brand-orange-light); background: rgba(255,85,0,0.08); padding: 0.5rem 0.75rem; border-radius: var(--radius-sm);">
            🛡️ <strong>Milestone 1 Escrow Locked:</strong> ₦${r.escrowAmount.toLocaleString()} safely held in GATHR Trust Escrow. Released automatically upon organizer soundcheck confirmation.
          </div>
        </div>
      </div>
    `).join('');
  }

  openRfpModal(vendorId) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const modal = document.getElementById('vendor-rfp-modal');
    const titleEl = document.getElementById('rfp-modal-vendor-title');
    const catEl = document.getElementById('rfp-modal-vendor-cat');
    const budgetInput = document.getElementById('rfp-modal-budget-input');

    if (titleEl) titleEl.innerText = vendor.name;
    if (catEl) catEl.innerText = vendor.category;
    if (budgetInput) budgetInput.value = vendor.startingPrice;

    this.selectedVendorForRfp = vendor;
    if (modal) modal.style.display = 'flex';
  }

  closeRfpModal() {
    const modal = document.getElementById('vendor-rfp-modal');
    if (modal) modal.style.display = 'none';
  }

  submitRfp() {
    const budgetInput = document.getElementById('rfp-modal-budget-input');
    const scopeInput = document.getElementById('rfp-modal-scope-input');
    const budget = parseInt(budgetInput ? budgetInput.value : 3000000, 10);
    const scope = scopeInput ? scopeInput.value : "Mainstage concert sound and robotic lighting setup";

    const newRfp = {
      id: `rfp-${Date.now()}`,
      vendorName: this.selectedVendorForRfp.name,
      category: this.selectedVendorForRfp.category,
      budget: budget,
      escrowAmount: Math.round(budget * 0.5),
      status: "Escrow Funded (Milestone 1/2)",
      deliverables: scope
    };

    this.activeRfps.unshift(newRfp);
    this.renderRfps();
    this.closeRfpModal();

    if (window.gathrApp) {
      window.gathrApp.showToast(`🛡️ RFP sent to ${this.selectedVendorForRfp.name}! Milestone 1 Escrow (₦${newRfp.escrowAmount.toLocaleString()}) funded.`);
    }

    // Attempt backend sync
    fetch('/api/v1/vendors/rfp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 'gathr-event-01',
        vendorId: this.selectedVendorForRfp.id,
        vendorName: this.selectedVendorForRfp.name,
        category: this.selectedVendorForRfp.category,
        budget: budget,
        scope: scope
      })
    }).catch(err => console.log('Backend RFP sync note:', err));
  }
}

window.gathrPlanning = new GathrPlanning();
