/**
 * GATHR Event Operating System: AI Planning Studio & Vetted Vendor Marketplace Engine
 * Full Suite: Event Coordination Checklist, Stage Run-of-Show, Verified Vendor Onboarding,
 * Task Sourcing, Direct WhatsApp Channel, and Milestone Escrow Contracts.
 */

class GathrPlanning {
  constructor() {
    this.currentTab = 'checklist'; // 'checklist' | 'schedule' | 'vendors' | 'rfps' | 'budget'
    this.activeCategory = 'all';
    this.searchQuery = '';
    this.selectedLocation = 'all';
    this.verifiedOnly = false;
    this.selectedVendorForRfp = null;

    // Default Vetted Vendor Marketplace Directory
    this.vendors = [
      {
        id: "vnd-01",
        name: "Pulse Audio-Visual & Stage Dynamics",
        category: "Audio/Visual & Lighting",
        categoryKey: "av",
        rating: 4.95,
        reviewsCount: 48,
        location: "Victoria Island, Lagos",
        phone: "+2348031122334",
        startingPrice: 4500000,
        verified: true,
        verifiedTier: "Tier 2 Vetted Partner",
        cacNumber: "RC-1849204",
        responseTime: "< 10 mins",
        image: "./assets/images/tech-summit.jpg",
        specialty: "Line-array concert audio systems, 4K LED stage walls, robotic beam fixtures & 100kVA soundproof backup generators.",
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
        phone: "+2348029988776",
        startingPrice: 3200000,
        verified: true,
        verifiedTier: "Tier 2 Vetted Partner",
        cacNumber: "RC-1728391",
        responseTime: "< 15 mins",
        image: "./assets/images/founders-gala.jpg",
        specialty: "Gourmet Pan-African executive buffets, VIP plated dining, artisan espresso lounges & craft cocktail bars.",
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
        phone: "+2348095544332",
        startingPrice: 1800000,
        verified: true,
        verifiedTier: "Tier 2 Vetted Partner",
        cacNumber: "RC-1650392",
        responseTime: "< 5 mins",
        image: "./assets/images/beach-fest.jpg",
        specialty: "Executive close protection, tactical gate marshals, walk-through metal detector portals & anti-crowd surge barriers.",
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
        phone: "+2348147766554",
        startingPrice: 2500000,
        verified: true,
        verifiedTier: "Tier 2 Vetted Partner",
        cacNumber: "RC-1928475",
        responseTime: "< 20 mins",
        image: "./assets/images/tech-summit.jpg",
        specialty: "Low-latency RTMP cloud streaming, 4K wireless steady-cams, FPV drone flyovers & same-day social media reel edits.",
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
        phone: "+2348083322110",
        startingPrice: 3800000,
        verified: true,
        verifiedTier: "Tier 2 Vetted Partner",
        cacNumber: "RC-1802934",
        responseTime: "< 25 mins",
        image: "./assets/images/beach-fest.jpg",
        specialty: "Modular truss stage architecture, neon aesthetic tunnel entrances, VIP lounge styling & branded photo installations.",
        contactEmail: "hello@auraspatial.com"
      },
      {
        id: "vnd-06",
        name: "VibeSync DJ Collective & Soundscapes",
        category: "DJs & Entertainment",
        categoryKey: "talent",
        rating: 4.97,
        reviewsCount: 53,
        location: "Lagos / Accra / London",
        phone: "+2348076655443",
        startingPrice: 1500000,
        verified: true,
        verifiedTier: "Tier 2 Vetted Partner",
        cacNumber: "RC-1992014",
        responseTime: "< 12 mins",
        image: "./assets/images/afro-fusion.jpg",
        specialty: "Headline Afrobeats & Amapiano festival DJs, live percussionists, MC crowd hypemen & custom event sonic intros.",
        contactEmail: "bookings@vibesync.africa"
      }
    ];

    // Load custom enlisted vendors from local storage
    this.loadPersistedVendors();

    // Event Coordination Checklist Tasks (4 Phases)
    this.checklistTasks = [
      { id: "task-01", eventId: "gathr-event-01", phase: "Pre-Event Architecture", title: "Lock Venue Contract & Fire Safety Clearance", lead: "Venue Director", dueDate: "T-14 Days", status: "Completed", vendorTag: "Landmark Operations" },
      { id: "task-02", eventId: "gathr-event-01", phase: "Pre-Event Architecture", title: "Configure GATHR Multi-Party Split Settlement (Host 70% / Venue 20% / Promoters 10%)", lead: "Finance Lead", dueDate: "T-12 Days", status: "Completed", vendorTag: "GATHR Engine" },
      { id: "task-03", eventId: "gathr-event-01", phase: "Vendor Sourcing & Contracts", title: "Hire Pulse Audio-Visual: 12m 4K LED Concert Wall & Line Arrays", lead: "Production Lead", dueDate: "T-10 Days", status: "Completed", vendorTag: "Pulse Audio-Visual" },
      { id: "task-04", eventId: "gathr-event-01", phase: "Vendor Sourcing & Contracts", title: "Contract Savory Roots: 200 VIP Plated Dinners & Espresso Bar", lead: "Hospitality Lead", dueDate: "T-7 Days", status: "Completed", vendorTag: "Savory Roots Catering" },
      { id: "task-05", eventId: "gathr-event-01", phase: "Vendor Sourcing & Contracts", title: "Deploy Apex Tactical Security: 12 Bouncers & Dual Walk-Through Detectors", lead: "Security Director", dueDate: "T-5 Days", status: "In Progress", vendorTag: "Apex Tactical Security" },
      { id: "task-06", eventId: "gathr-event-01", phase: "Production & Rehearsals", title: "Audio Load-In & Keynote Speaker Wireless Shure Frequency Test", lead: "Tech Director", dueDate: "T-2 Days", status: "In Progress", vendorTag: "Pulse Audio-Visual" },
      { id: "task-07", eventId: "gathr-event-01", phase: "Production & Rehearsals", title: "Synchronize Holographic Passes & Offline Door Scanner Manifests", lead: "Access Operations", dueDate: "T-1 Day", status: "Pending", vendorTag: "GATHR Mesh" },
      { id: "task-08", eventId: "gathr-event-01", phase: "Day-Of Execution & Wrap", title: "Gate 1-3 Turnstiles Online & Real-time Attendance Pacing Monitor", lead: "Gate Manager", dueDate: "Event Day 08:00 AM", status: "Pending", vendorTag: "Gate Operations" },
      { id: "task-09", eventId: "gathr-event-01", phase: "Day-Of Execution & Wrap", title: "Sign-Off On-Site Production & Release Vendor Milestone 2 Escrow", lead: "Executive Producer", dueDate: "Event Day 02:00 PM", status: "Pending", vendorTag: "GATHR Escrow" }
    ];

    // Live Run-of-Show Stage & Audio Cues
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

    // Active Vendor Escrow Contracts
    this.activeRfps = [
      {
        id: "rfp-101",
        vendorId: "vnd-01",
        vendorName: "Pulse Audio-Visual",
        category: "Audio/Visual & Lighting",
        budget: 4500000,
        escrowAmount: 2250000,
        milestone1: { name: "Upfront Escrow Deposit (50%)", amount: 2250000, released: true },
        milestone2: { name: "Load-In & Soundcheck Sign-Off (25%)", amount: 1125000, released: false },
        milestone3: { name: "Post-Event Wrap & Strike Sign-Off (25%)", amount: 1125000, released: false },
        status: "Milestone 1 Funded (50% Locked)",
        deliverables: "12m 4K LED concert wall, 8 lapel mics, line arrays, 100kVA backup power."
      },
      {
        id: "rfp-102",
        vendorId: "vnd-02",
        vendorName: "Savory Roots Catering",
        category: "Catering & Bar Operations",
        budget: 3200000,
        escrowAmount: 1600000,
        milestone1: { name: "Upfront Escrow Deposit (50%)", amount: 1600000, released: true },
        milestone2: { name: "Buffet Station Setup Verification (25%)", amount: 800000, released: false },
        milestone3: { name: "Post-Service Hospitality Sign-Off (25%)", amount: 800000, released: false },
        status: "Milestone 1 Funded (50% Locked)",
        deliverables: "200 VIP plated lunches, continuous artisan espresso bar, VIP lounge canapés."
      }
    ];

    // Dynamic Event P&L Modeler State
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
    this.fetchBackendTasks();
    this.renderTabs();
    this.renderPlanningChecklist();
    this.renderRunOfShow();
    this.renderVendors();
    this.renderRfps();
    this.renderBudgetEstimator();
  }

  loadPersistedVendors() {
    try {
      const saved = localStorage.getItem('gathr_onboarded_vendors');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Prepend custom vendors
          parsed.forEach(v => {
            if (!this.vendors.some(existing => existing.id === v.id)) {
              this.vendors.unshift(v);
            }
          });
        }
      }
    } catch (err) {
      console.log('Local vendor storage read note:', err);
    }
  }

  fetchBackendTasks() {
    fetch('/api/v1/planning/tasks')
      .then(res => res.json())
      .then(data => {
        if (data && data.status === 'success' && Array.isArray(data.tasks) && data.tasks.length > 0) {
          this.checklistTasks = data.tasks;
          this.renderPlanningChecklist();
        }
      })
      .catch(err => console.log('Tasks sync note:', err));
  }

  switchTab(tabName) {
    this.currentTab = tabName;
    document.querySelectorAll('.planning-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    ['checklist', 'schedule', 'vendors', 'rfps', 'budget'].forEach(t => {
      const el = document.getElementById(`planning-panel-${t}`);
      if (el) el.style.display = (t === tabName) ? 'block' : 'none';
    });

    if (tabName === 'checklist') this.renderPlanningChecklist();
    if (tabName === 'vendors') this.renderVendors();
    if (tabName === 'schedule') this.renderRunOfShow();
    if (tabName === 'rfps') this.renderRfps();
    if (tabName === 'budget') this.renderBudgetEstimator();
  }

  renderTabs() {
    this.switchTab(this.currentTab);
  }

  // ==========================================
  // 1. EVENT PLANNING & COORDINATION CHECKLIST
  // ==========================================
  renderPlanningChecklist() {
    const container = document.getElementById('planning-checklist-container');
    const progressBar = document.getElementById('planning-progress-bar');
    const progressText = document.getElementById('planning-progress-text');
    if (!container) return;

    const total = this.checklistTasks.length;
    const completed = this.checklistTasks.filter(t => t.status === 'Completed').length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    if (progressBar) progressBar.style.width = `${pct}%`;
    if (progressText) progressText.innerText = `${completed} of ${total} Tasks Complete (${pct}%)`;

    // Group tasks by phase
    const phases = [
      { name: "Phase 1: Pre-Event Architecture", icon: "🏛️" },
      { name: "Phase 2: Vendor Sourcing & Contracts", icon: "🤝" },
      { name: "Phase 3: Production & Rehearsals", icon: "🎛️" },
      { name: "Phase 4: Day-Of Execution & Wrap", icon: "⚡" }
    ];

    container.innerHTML = phases.map(phase => {
      const phaseTasks = this.checklistTasks.filter(t => t.phase.toLowerCase().includes(phase.name.toLowerCase().replace(/phase \d+: /i, '')) || t.phase === phase.name);
      
      return `
        <div class="planning-phase-card">
          <div class="planning-phase-header">
            <div style="display: flex; align-items: center; gap: 0.6rem;">
              <span style="font-size: 1.25rem;">${phase.icon}</span>
              <h4 style="font-size: 1.15rem; font-weight: 800; color: #FFF; margin: 0;">${phase.name}</h4>
            </div>
            <span class="badge ${phaseTasks.every(t => t.status === 'Completed') && phaseTasks.length > 0 ? 'badge-green' : 'badge-orange'}" style="font-size: 0.75rem;">
              ${phaseTasks.filter(t => t.status === 'Completed').length}/${phaseTasks.length} Ready
            </span>
          </div>

          <div class="planning-tasks-list">
            ${phaseTasks.map(task => {
              const isDone = task.status === 'Completed';
              const isInProg = task.status === 'In Progress';
              return `
                <div class="planning-task-item ${isDone ? 'task-done' : ''}">
                  <label class="planning-task-checkbox-wrap">
                    <input 
                      type="checkbox" 
                      ${isDone ? 'checked' : ''} 
                      onchange="gathrPlanning.toggleTaskStatus('${task.id}')"
                    >
                    <span class="planning-task-checkmark"></span>
                  </label>

                  <div class="planning-task-details">
                    <div class="planning-task-title ${isDone ? 'line-through' : ''}">
                      ${task.title}
                    </div>
                    <div class="planning-task-meta">
                      <span>👤 <strong>Lead:</strong> ${task.lead}</span>
                      <span>📅 <strong>Due:</strong> ${task.dueDate}</span>
                      ${task.vendorTag ? `<span class="planning-vendor-tag">🏷️ ${task.vendorTag}</span>` : ''}
                      ${isInProg ? `<span class="badge-pill" style="background: rgba(255,85,0,0.15); color: var(--brand-orange); font-size: 0.68rem;">IN PROGRESS</span>` : ''}
                    </div>
                  </div>

                  <div class="planning-task-action">
                    ${!isDone && task.vendorTag && task.vendorTag !== 'GATHR Engine' ? `
                      <button class="btn btn-secondary btn-sm" onclick="gathrPlanning.switchTab('vendors')" style="font-size: 0.72rem; padding: 0.25rem 0.6rem;">
                        View Vendor →
                      </button>
                    ` : ''}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  toggleTaskStatus(taskId) {
    const task = this.checklistTasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = task.status === 'Completed' ? 'Pending' : 'Completed';
    this.renderPlanningChecklist();

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`${task.status === 'Completed' ? '✓ Task marked complete:' : 'Task marked pending:'} ${task.title}`);
    }

    // Backend sync
    fetch('/api/v1/planning/tasks/toggle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId: task.id, status: task.status })
    }).catch(err => console.log('Task toggle note:', err));
  }

  addCustomPlanningTask() {
    const title = prompt("Enter task title:", "Arrange 4 VIP Transport Shuttles from Hotel to Venue");
    if (!title) return;
    const lead = prompt("Assign Lead / Responsible Person:", "Logistics Lead");
    const phase = prompt("Phase (1: Pre-Event, 2: Vendors, 3: Production, 4: Day-Of):", "2");
    
    let phaseName = "Phase 2: Vendor Sourcing & Contracts";
    if (phase === '1') phaseName = "Phase 1: Pre-Event Architecture";
    if (phase === '3') phaseName = "Phase 3: Production & Rehearsals";
    if (phase === '4') phaseName = "Phase 4: Day-Of Execution & Wrap";

    const newTask = {
      id: `task-${Date.now()}`,
      eventId: "gathr-event-01",
      phase: phaseName,
      title: title,
      lead: lead || "Event Coordinator",
      dueDate: "T-3 Days",
      status: "Pending",
      vendorTag: "Custom Assignment"
    };

    this.checklistTasks.push(newTask);
    this.renderPlanningChecklist();

    if (window.gathrApp) {
      window.gathrApp.showToast(`✓ Task added to ${phaseName}`);
    }

    fetch('/api/v1/planning/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    }).catch(err => console.log('Add task note:', err));
  }

  // Export full Operational Run-of-Show and Coordination Plan for stage crew & engineers
  exportOperationalPlanManifest() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Please allow popups to export the operational crew plan.");
      return;
    }

    const tasksHtml = this.checklistTasks.map(t => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${t.phase}</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.title}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.lead}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.dueDate}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${t.vendorTag || '-'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${t.status}</strong></td>
      </tr>
    `).join('');

    const rosHtml = this.runOfShow.map(s => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-family: monospace;"><strong>${s.timeSlot}</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;"><strong>${s.activity}</strong></td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${s.stage}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd;">${s.lead}</td>
        <td style="padding: 8px; border-bottom: 1px solid #ddd; font-family: monospace; font-size: 0.85em; color: #555;">${s.cue}</td>
      </tr>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>GATHR Event Production Manifest & Run-of-Show</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 2rem; color: #111; }
          h1 { margin-bottom: 0.25rem; font-size: 1.8rem; }
          .tag { color: #FF5500; font-weight: 700; text-transform: uppercase; font-size: 0.85rem; }
          table { width: 100%; border-collapse: collapse; margin-top: 1rem; margin-bottom: 2.5rem; font-size: 0.9rem; }
          th { text-align: left; background: #F3F4F6; padding: 10px 8px; border-bottom: 2px solid #ccc; font-size: 0.8rem; text-transform: uppercase; }
          .btn-print { background: #000; color: #fff; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: bold; margin-bottom: 1.5rem; }
        </style>
      </head>
      <body>
        <div class="tag">GATHR Event OS • Official Operational Manifest</div>
        <h1>Event Production, Coordination & Stage Run-of-Show</h1>
        <p style="color: #666; margin-bottom: 1.5rem;">Event: <strong>GATHR Tech Summit 2026</strong> | Venue: <strong>Eko Convention Centre</strong> | Generated on: ${new Date().toLocaleString()}</p>
        <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF Manifest</button>

        <h2>1. Master Stage Run-of-Show & Audio Cues</h2>
        <table>
          <thead>
            <tr>
              <th>Time Slot</th>
              <th>Session / Activity</th>
              <th>Stage / Zone</th>
              <th>Lead Person</th>
              <th>Technical & Audio Cue</th>
            </tr>
          </thead>
          <tbody>${rosHtml}</tbody>
        </table>

        <h2>2. Event Logistics & Vendor Coordination Checklist</h2>
        <table>
          <thead>
            <tr>
              <th>Phase</th>
              <th>Task</th>
              <th>Lead</th>
              <th>Due Date</th>
              <th>Vendor / Tag</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>${tasksHtml}</tbody>
        </table>
      </body>
      </html>
    `);
    printWindow.document.close();
  }

  // ==========================================
  // 2. VENDOR ENLISTING & ONBOARDING
  // ==========================================
  openVendorOnboardingModal() {
    const modal = document.getElementById('vendor-onboarding-modal');
    if (modal) modal.style.display = 'flex';
  }

  closeVendorOnboardingModal() {
    const modal = document.getElementById('vendor-onboarding-modal');
    if (modal) modal.style.display = 'none';
  }

  submitVendorOnboarding(event) {
    if (event) event.preventDefault();

    const name = document.getElementById('onboard-vendor-name')?.value?.trim();
    const category = document.getElementById('onboard-vendor-cat')?.value;
    const location = document.getElementById('onboard-vendor-loc')?.value?.trim() || "Lagos, Nigeria";
    const phone = document.getElementById('onboard-vendor-phone')?.value?.trim();
    const email = document.getElementById('onboard-vendor-email')?.value?.trim();
    const specialty = document.getElementById('onboard-vendor-specialty')?.value?.trim();
    const startingPrice = parseInt(document.getElementById('onboard-vendor-price')?.value || "1500000", 10);
    const cacNumber = document.getElementById('onboard-vendor-cac')?.value?.trim() || `RC-${Math.floor(1000000 + Math.random() * 9000000)}`;
    const portfolio = document.getElementById('onboard-vendor-portfolio')?.value?.trim();

    if (!name || !phone || !specialty) {
      alert("Please fill in your Business Name, Phone/WhatsApp number, and Specialty to complete verification.");
      return;
    }

    // Map category key
    let catKey = "av";
    if (category.toLowerCase().includes("cater")) catKey = "catering";
    else if (category.toLowerCase().includes("secur")) catKey = "security";
    else if (category.toLowerCase().includes("media") || category.toLowerCase().includes("drone")) catKey = "media";
    else if (category.toLowerCase().includes("decor") || category.toLowerCase().includes("stage")) catKey = "decor";
    else if (category.toLowerCase().includes("dj") || category.toLowerCase().includes("music")) catKey = "talent";

    const newVendor = {
      id: `vnd-${Date.now()}`,
      name: name,
      category: category,
      categoryKey: catKey,
      rating: 5.0,
      reviewsCount: 1,
      location: location,
      phone: phone,
      startingPrice: startingPrice,
      verified: true,
      verifiedTier: "Tier 2 Vetted Partner",
      cacNumber: cacNumber,
      responseTime: "< 15 mins",
      image: "./assets/images/tech-summit.jpg",
      specialty: specialty,
      contactEmail: email || "vendor@gathr.ng",
      portfolio: portfolio
    };

    // Add to list and save to local storage
    this.vendors.unshift(newVendor);
    try {
      const saved = JSON.parse(localStorage.getItem('gathr_onboarded_vendors') || '[]');
      saved.unshift(newVendor);
      localStorage.setItem('gathr_onboarded_vendors', JSON.stringify(saved));
    } catch (e) {
      console.log('Local vendor persist note:', e);
    }

    this.closeVendorOnboardingModal();
    this.renderVendors();
    this.switchTab('vendors');

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`🎉 Congratulations! "${name}" is now an official GATHR Verified Partner with verified badge.`);
    }

    // Backend sync
    fetch('/api/v1/vendors/enlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newVendor)
    }).catch(err => console.log('Vendor enlist backend sync note:', err));
  }

  // ==========================================
  // 3. VENDOR SOURCING & MARKETPLACE SEARCH
  // ==========================================
  setVendorSearch(q) {
    this.searchQuery = q.toLowerCase().trim();
    this.renderVendors();
  }

  filterVendors(categoryKey) {
    this.activeCategory = categoryKey;
    document.querySelectorAll('.vendor-cat-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.cat === categoryKey);
    });
    this.renderVendors();
  }

  setVendorLocation(loc) {
    this.selectedLocation = loc;
    this.renderVendors();
  }

  toggleVerifiedOnly(checked) {
    this.verifiedOnly = checked;
    this.renderVendors();
  }

  renderVendors() {
    const grid = document.getElementById('vendor-cards-grid');
    if (!grid) return;

    let list = this.vendors;

    // Filter by Category
    if (this.activeCategory !== 'all') {
      list = list.filter(v => v.categoryKey === this.activeCategory);
    }

    // Filter by Location
    if (this.selectedLocation !== 'all') {
      list = list.filter(v => v.location.toLowerCase().includes(this.selectedLocation.toLowerCase()));
    }

    // Filter by Verified Only
    if (this.verifiedOnly) {
      list = list.filter(v => v.verified);
    }

    // Filter by Search Query
    if (this.searchQuery) {
      list = list.filter(v => 
        v.name.toLowerCase().includes(this.searchQuery) ||
        v.specialty.toLowerCase().includes(this.searchQuery) ||
        v.category.toLowerCase().includes(this.searchQuery) ||
        v.location.toLowerCase().includes(this.searchQuery)
      );
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-lg); border: 1px dashed var(--border-subtle);">
          <div style="font-size: 2.5rem; margin-bottom: 0.75rem;">🔍</div>
          <h4 style="font-size: 1.25rem; font-weight: 700; color: #FFF; margin-bottom: 0.35rem;">No verified vendors match your filter</h4>
          <p style="color: var(--text-muted); font-size: 0.9rem; max-width: 480px; margin: 0 auto 1.25rem;">
            Try clearing your search query or enlist your vendor business to take on tasks for this category.
          </p>
          <button class="btn btn-primary btn-sm" onclick="gathrPlanning.openVendorOnboardingModal()">
            + Enlist Your Business as a Vendor
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(v => `
      <div class="vendor-card">
        <div class="vendor-img-wrap">
          <img src="${v.image}" alt="${v.name}" class="vendor-img">
          <div class="vendor-badge-cat">${v.category}</div>
          ${v.verified ? `<div class="vendor-verified-pill" title="CAC Verified & Insured">✓ VERIFIED PARTNER</div>` : ''}
        </div>
        <div class="vendor-body">
          <div>
            <div class="vendor-title">${v.name}</div>
            <div class="vendor-meta-row">
              <span style="color: var(--brand-amber); font-weight: 700;">★ ${v.rating} (${v.reviewsCount} jobs)</span>
              <span>•</span>
              <span>📍 ${v.location}</span>
            </div>
            <div style="font-size: 0.75rem; color: var(--accent-green); margin-bottom: 0.65rem; display: flex; align-items: center; gap: 0.35rem;">
              <span>⚡ Responds ${v.responseTime || '< 15 mins'}</span>
              ${v.cacNumber ? `<span>• 🛡️ ${v.cacNumber}</span>` : ''}
            </div>
            <div class="vendor-specialty">${v.specialty}</div>
          </div>
          <div class="vendor-footer">
            <div>
              <div class="vendor-price-tag">Packages from</div>
              <div class="vendor-price-val">₦${v.startingPrice.toLocaleString()}</div>
            </div>
            <div style="display: flex; gap: 0.45rem;">
              <button 
                class="btn btn-secondary btn-sm" 
                onclick="gathrPlanning.contactVendorWhatsApp('${v.id}')"
                title="Connect directly on WhatsApp"
                style="padding: 0.35rem 0.65rem;"
              >
                💬 WhatsApp
              </button>
              <button class="btn btn-primary btn-sm" onclick="gathrPlanning.openRfpModal('${v.id}')">
                Assign Task & Escrow
              </button>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  contactVendorWhatsApp(vendorId) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const phone = (vendor.phone || "+2348000000000").replace(/[^0-9]/g, '');
    const msg = `Hello ${vendor.name}, I found your verified profile on GATHR and would love to connect regarding ${vendor.category} services for our upcoming event.`;
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`💬 Opening WhatsApp direct channel with ${vendor.name}...`);
    }
  }

  // ==========================================
  // 4. TASK RFP & MILESTONE ESCROW CONTRACTS
  // ==========================================
  openRfpModal(vendorId) {
    const vendor = this.vendors.find(v => v.id === vendorId);
    if (!vendor) return;

    const modal = document.getElementById('vendor-rfp-modal');
    const titleEl = document.getElementById('rfp-modal-vendor-title');
    const catEl = document.getElementById('rfp-modal-vendor-cat');
    const budgetInput = document.getElementById('rfp-modal-budget-input');
    const scopeInput = document.getElementById('rfp-modal-scope-input');

    if (titleEl) titleEl.innerText = vendor.name;
    if (catEl) catEl.innerText = vendor.category;
    if (budgetInput) budgetInput.value = vendor.startingPrice;
    if (scopeInput) {
      scopeInput.value = `Execute full ${vendor.category} scope: ${vendor.specialty}`;
    }

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
    const taskTitleInput = document.getElementById('rfp-modal-task-title-input');

    const budget = parseInt(budgetInput ? budgetInput.value : 3000000, 10);
    const scope = scopeInput ? scopeInput.value : "Standard production deliverables";
    const taskTitle = taskTitleInput ? taskTitleInput.value : `${this.selectedVendorForRfp.category} Execution`;

    const m1 = Math.round(budget * 0.50);
    const m2 = Math.round(budget * 0.25);
    const m3 = Math.round(budget * 0.25);

    const newRfp = {
      id: `rfp-${Date.now()}`,
      vendorId: this.selectedVendorForRfp.id,
      vendorName: this.selectedVendorForRfp.name,
      category: this.selectedVendorForRfp.category,
      budget: budget,
      escrowAmount: m1,
      milestone1: { name: "Upfront Escrow Deposit (50%)", amount: m1, released: true },
      milestone2: { name: "On-Site Soundcheck / Arrival Sign-Off (25%)", amount: m2, released: false },
      milestone3: { name: "Post-Event Wrap & Strike Sign-Off (25%)", amount: m3, released: false },
      status: "Milestone 1 Funded (50% Locked)",
      deliverables: scope
    };

    this.activeRfps.unshift(newRfp);

    // Also auto-add a coordination task in the Event Checklist!
    this.checklistTasks.splice(4, 0, {
      id: `task-rfp-${Date.now()}`,
      eventId: "gathr-event-01",
      phase: "Phase 2: Vendor Sourcing & Contracts",
      title: `${taskTitle}: ${this.selectedVendorForRfp.name}`,
      lead: "Production Lead",
      dueDate: "T-5 Days",
      status: "In Progress",
      vendorTag: this.selectedVendorForRfp.name
    });

    this.renderRfps();
    this.renderPlanningChecklist();
    this.closeRfpModal();
    this.switchTab('rfps');

    if (window.gathrApp) {
      window.gathrApp.showToast(`🛡️ Task contract created for ${this.selectedVendorForRfp.name}! Milestone 1 Escrow (₦${m1.toLocaleString()}) funded.`);
    }

    // Backend sync
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

  releaseMilestone(rfpId, milestoneNum) {
    const rfp = this.activeRfps.find(r => r.id === rfpId);
    if (!rfp) return;

    if (milestoneNum === 2) {
      rfp.milestone2.released = true;
      rfp.status = "Milestone 2 Released (75% Paid)";
    } else if (milestoneNum === 3) {
      rfp.milestone3.released = true;
      rfp.status = "Completed & Fully Disbursed ✓";
    }

    this.renderRfps();

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`✓ Milestone ${milestoneNum} payment successfully released to ${rfp.vendorName}!`);
    }

    fetch('/api/v1/vendors/rfp/release', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rfpId: rfp.id, milestone: milestoneNum })
    }).catch(err => console.log('Milestone release sync note:', err));
  }

  renderRfps() {
    const container = document.getElementById('rfps-list-container');
    if (!container) return;

    if (this.activeRfps.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; color: var(--text-muted); padding: 3rem 1rem; background: var(--bg-surface-elevated); border-radius: var(--radius-lg);">
          <div style="font-size: 2.2rem; margin-bottom: 0.5rem;">🛡️</div>
          <h4 style="color: #FFF; font-weight: 700; margin-bottom: 0.25rem;">No active milestone escrows</h4>
          <p style="font-size: 0.85rem; max-width: 420px; margin: 0 auto 1.25rem;">
            Source verified vendors in the marketplace and fund milestones to safeguard payments.
          </p>
          <button class="btn btn-primary btn-sm" onclick="gathrPlanning.switchTab('vendors')">
            Browse Verified Vendors →
          </button>
        </div>
      `;
      return;
    }

    container.innerHTML = this.activeRfps.map(r => `
      <div class="ros-item-card" style="border-left: 4px solid var(--accent-green); flex-direction: column; align-items: stretch;">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 0.75rem;">
          <div>
            <div style="font-weight: 800; font-size: 1.25rem; color: #FFF;">${r.vendorName}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">
              Category: <strong style="color: #FFF;">${r.category}</strong> • Total Budget: <strong style="color: var(--brand-orange);">₦${r.budget.toLocaleString()}</strong>
            </div>
          </div>
          <span class="badge ${r.status.includes('Completed') ? 'badge-green' : 'badge-orange'}">${r.status}</span>
        </div>

        <div style="font-size: 0.825rem; color: #E5E7EB; background: rgba(0,0,0,0.3); padding: 0.75rem; border-radius: var(--radius-sm); margin-bottom: 1rem;">
          📋 <strong>Deliverables & Scope:</strong> ${r.deliverables}
        </div>

        <!-- Milestone Progress Tracker -->
        <div class="milestones-timeline-grid">
          <!-- Milestone 1 -->
          <div class="milestone-box ${r.milestone1?.released ? 'milestone-done' : ''}">
            <div class="milestone-step-header">
              <span class="milestone-step-pill">1</span>
              <strong style="color: #FFF; font-size: 0.85rem;">Deposit (50%)</strong>
            </div>
            <div class="milestone-step-val">₦${(r.milestone1 ? r.milestone1.amount : r.escrowAmount).toLocaleString()}</div>
            <div class="milestone-step-status" style="color: var(--accent-green);">
              ✓ Locked in Escrow & Released
            </div>
          </div>

          <!-- Milestone 2 -->
          <div class="milestone-box ${r.milestone2?.released ? 'milestone-done' : ''}">
            <div class="milestone-step-header">
              <span class="milestone-step-pill">2</span>
              <strong style="color: #FFF; font-size: 0.85rem;">Soundcheck (25%)</strong>
            </div>
            <div class="milestone-step-val">₦${(r.milestone2 ? r.milestone2.amount : Math.round(r.budget * 0.25)).toLocaleString()}</div>
            <div class="milestone-step-status">
              ${r.milestone2?.released ? '<span style="color: var(--accent-green);">✓ Signed Off & Released</span>' : `
                <button class="btn btn-secondary btn-sm" onclick="gathrPlanning.releaseMilestone('${r.id}', 2)" style="font-size: 0.72rem; padding: 0.25rem 0.5rem; width: 100%;">
                  Sign Off & Release
                </button>
              `}
            </div>
          </div>

          <!-- Milestone 3 -->
          <div class="milestone-box ${r.milestone3?.released ? 'milestone-done' : ''}">
            <div class="milestone-step-header">
              <span class="milestone-step-pill">3</span>
              <strong style="color: #FFF; font-size: 0.85rem;">Wrap / Final (25%)</strong>
            </div>
            <div class="milestone-step-val">₦${(r.milestone3 ? r.milestone3.amount : Math.round(r.budget * 0.25)).toLocaleString()}</div>
            <div class="milestone-step-status">
              ${r.milestone3?.released ? '<span style="color: var(--accent-green);">✓ Disbursed & Settled</span>' : `
                <button class="btn btn-secondary btn-sm" onclick="gathrPlanning.releaseMilestone('${r.id}', 3)" style="font-size: 0.72rem; padding: 0.25rem 0.5rem; width: 100%;" ${!r.milestone2?.released ? 'disabled title="Complete Milestone 2 first"' : ''}>
                  Release Final Payout
                </button>
              `}
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 5. RUN-OF-SHOW STAGE SCHEDULE & CUES
  // ==========================================
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
        activity: "AI Audio Buffer & Live Audience Sentiment Poll",
        stage: "Mainstage Arena",
        lead: "GATHR Real-Time Engagement Bot",
        cue: "Broadcast 60-second interactive sentiment poll to attendee passes.",
        status: "Scheduled"
      });
      this.renderRunOfShow();
      if (window.gathrApp) {
        window.gathrApp.showToast("✓ Schedule optimized! Buffer slots inserted and stage cues synchronized.");
      }
    }, 900);
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

  // ==========================================
  // 6. EVENT ECONOMICS & P&L MODELER
  // ==========================================
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
}

window.gathrPlanning = new GathrPlanning();
