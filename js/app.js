/**
 * GATHR Core Application Controller & UI Router
 */

class GathrApp {
  constructor() {
    this.events = [...GATHR_EVENTS];
    this.currentView = 'explore';
    this.selectedEvent = this.events[0];
    this.activeCategory = 'all';
    this.activeCity = 'all';
    this.searchQuery = '';
    
    // User's active ticket
    this.userTicket = {
      event: this.events[0],
      tier: this.events[0].ticketTiers[2], // VIP
      attendeeName: "Chinedu Eze",
      ticketCode: "GTHR-VIP-8812",
      orderRef: "GTHR-ORD-774910",
      purchaseDate: "Today, 08:30 AM"
    };

    // Checkout modal state
    this.checkoutState = {
      event: null,
      selectedTier: null,
      quantity: 1,
      name: "",
      email: ""
    };

    this.qrTimer = null;
  }

  init() {
    this.renderEvents();
    this.bindEvents();
    this.startTicketQrTicker();
    
    // Initialize Organizer metrics & table
    if (window.gathrOrganizer) {
      window.gathrOrganizer.renderMetrics();
      window.gathrOrganizer.renderAttendeeTable();
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('GATHR Service Worker Registered'))
        .catch(err => console.log('SW registration note:', err));
    }
  }

  // View Navigation
  switchView(viewName) {
    this.currentView = viewName;
    
    // Hide all view panels
    document.querySelectorAll('.view-panel').forEach(panel => {
      panel.style.display = 'none';
    });

    // Show target view panel
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
      target.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Update nav button active states
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === viewName);
    });

    // Handle view-specific initializations
    if (viewName === 'scanner') {
      const videoEl = document.getElementById('scanner-video');
      if (videoEl) gathrGateScanner.startCamera(videoEl);
    } else {
      gathrGateScanner.stopCamera();
    }

    if (viewName === 'ticket') {
      this.renderUserTicket();
    }
  }

  // Render Event Cards Grid
  renderEvents() {
    const grid = document.getElementById('events-grid');
    if (!grid) return;

    let filtered = this.events;
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(e => e.category.toLowerCase() === this.activeCategory.toLowerCase());
    }
    if (this.activeCity !== 'all') {
      filtered = filtered.filter(e => e.city.toLowerCase() === this.activeCity.toLowerCase());
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) || 
        e.venue.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 1rem;">No events found matching your criteria.</p>
          <button class="btn btn-secondary btn-sm" onclick="gathrApp.resetFilters()">Clear Filters</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(e => `
      <div class="event-card" onclick="gathrApp.openEventDetails('${e.id}')">
        <div class="event-image-container">
          <img src="${e.image}" alt="${e.title}" class="event-img" loading="lazy" />
          <div class="event-image-overlay">
            <div class="card-top-tags">
              <span class="badge badge-orange">${e.category}</span>
              <span class="event-date-chip">${e.date}</span>
            </div>
          </div>
        </div>
        <div class="event-body">
          <div class="event-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>${e.venue}</span>
          </div>
          <h3 class="event-card-title">${e.title}</h3>
          <p class="event-description-snippet">${e.description}</p>
          <div class="event-footer">
            <div class="event-price-box">
              <span class="price-label">Tickets From</span>
              <span class="price-value">${e.currency}${e.minPrice.toLocaleString()}</span>
            </div>
            <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); gathrApp.openCheckout('${e.id}')">
              Get Tickets
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Open Event Details Modal
  openEventDetails(eventId) {
    const e = this.events.find(ev => ev.id === eventId);
    if (!e) return;
    this.selectedEvent = e;

    const modal = document.getElementById('event-details-modal');
    document.getElementById('modal-event-img').src = e.image;
    document.getElementById('modal-event-title').innerText = e.title;
    document.getElementById('modal-event-category').innerText = e.category;
    document.getElementById('modal-event-date').innerText = `${e.date} • ${e.time}`;
    document.getElementById('modal-event-venue').innerText = e.venue;
    document.getElementById('modal-event-desc').innerText = e.description;
    document.getElementById('modal-event-organizer').innerText = e.organizer;

    // Render Tiers
    const tiersWrap = document.getElementById('modal-ticket-tiers');
    tiersWrap.innerHTML = e.ticketTiers.map(t => `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
        <div>
          <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.2rem;">${t.name}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${t.perks}</div>
          <div style="font-size: 0.75rem; color: var(--brand-orange); margin-top: 0.25rem;">Only ${t.remaining} tickets left</div>
        </div>
        <div style="text-align: right;">
          <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: #FFF; margin-bottom: 0.4rem;">
            ${e.currency}${t.price.toLocaleString()}
          </div>
          <button class="btn btn-outline btn-sm" onclick="gathrApp.openCheckoutWithTier('${e.id}', '${t.id}')">Select</button>
        </div>
      </div>
    `).join('');

    modal.classList.add('active');
  }

  closeEventDetails() {
    document.getElementById('event-details-modal').classList.remove('active');
  }

  // Open Checkout Modal
  openCheckout(eventId) {
    const e = this.events.find(ev => ev.id === eventId);
    if (!e) return;
    this.openCheckoutWithTier(eventId, e.ticketTiers[0].id);
  }

  openCheckoutWithTier(eventId, tierId) {
    this.closeEventDetails();
    const e = this.events.find(ev => ev.id === eventId);
    const tier = e.ticketTiers.find(t => t.id === tierId) || e.ticketTiers[0];

    this.checkoutState.event = e;
    this.checkoutState.selectedTier = tier;
    this.checkoutState.quantity = 1;

    document.getElementById('checkout-modal-event-title').innerText = e.title;
    document.getElementById('checkout-tier-select').innerHTML = e.ticketTiers.map(t => `
      <option value="${t.id}" ${t.id === tier.id ? 'selected' : ''}>${t.name} (${e.currency}${t.price.toLocaleString()})</option>
    `).join('');

    this.updateCheckoutSummary();
    document.getElementById('checkout-modal').classList.add('active');
  }

  closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
  }

  changeCheckoutTier(tierId) {
    const tier = this.checkoutState.event.ticketTiers.find(t => t.id === tierId);
    if (tier) {
      this.checkoutState.selectedTier = tier;
      this.updateCheckoutSummary();
    }
  }

  updateCheckoutQty(delta) {
    let q = this.checkoutState.quantity + delta;
    if (q < 1) q = 1;
    if (q > 6) q = 6;
    this.checkoutState.quantity = q;
    document.getElementById('checkout-qty-display').innerText = q;
    this.updateCheckoutSummary();
  }

  updateCheckoutSummary() {
    const { event, selectedTier, quantity } = this.checkoutState;
    if (!event || !selectedTier) return;

    const subtotal = selectedTier.price * quantity;
    const fee = Math.round(subtotal * 0.025); // 2.5% platform fee
    const total = subtotal + fee;

    document.getElementById('checkout-subtotal').innerText = `${event.currency}${subtotal.toLocaleString()}`;
    document.getElementById('checkout-fees').innerText = `${event.currency}${fee.toLocaleString()}`;
    document.getElementById('checkout-total').innerText = `${event.currency}${total.toLocaleString()}`;
  }

  // Complete Payment & Issue Ticket
  processCheckoutSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('checkout-name').value.trim() || "Chinedu Eze";
    const emailInput = document.getElementById('checkout-email').value.trim() || "chinedu@gmail.com";
    
    const payBtn = document.getElementById('checkout-pay-btn');
    payBtn.innerText = "Authorizing Paystack Gateway...";
    payBtn.disabled = true;

    // Simulate Paystack instant payment processing
    setTimeout(() => {
      payBtn.innerText = "Payment Confirmed!";
      
      const newTicketCode = `GTHR-${this.checkoutState.selectedTier.id.includes('vip') ? 'VIP' : 'TKT'}-${Math.floor(1000 + Math.random() * 9000)}`;
      
      this.userTicket = {
        event: this.checkoutState.event,
        tier: this.checkoutState.selectedTier,
        attendeeName: nameInput,
        ticketCode: newTicketCode,
        orderRef: `GTHR-ORD-${Math.floor(100000 + Math.random() * 900000)}`,
        purchaseDate: "Just now"
      };

      // Add to organizer attendees
      if (window.gathrOrganizer) {
        window.gathrOrganizer.attendees.push({
          id: `att-${Date.now()}`,
          name: nameInput,
          email: emailInput,
          tier: this.checkoutState.selectedTier.name,
          code: newTicketCode,
          status: "Pending",
          gate: "—",
          checkInTime: "—"
        });
        window.gathrOrganizer.renderAttendeeTable();
      }

      this.closeCheckout();
      payBtn.disabled = false;
      payBtn.innerText = "Complete Payment";

      this.showToast(`🎉 Payment Confirmed! Ticket issued for ${this.checkoutState.event.title}`);
      this.switchView('ticket');
    }, 1200);
  }

  // Render User's Luxury Digital Pass
  renderUserTicket() {
    const t = this.userTicket;
    document.getElementById('pass-event-title').innerText = t.event.title;
    document.getElementById('pass-tier-badge').innerText = t.tier.name;
    document.getElementById('pass-attendee-name').innerText = t.attendeeName;
    document.getElementById('pass-date').innerText = t.event.date;
    document.getElementById('pass-venue').innerText = t.event.venue;
    document.getElementById('pass-ticket-code').innerText = t.ticketCode;
    document.getElementById('pass-order-ref').innerText = t.orderRef;

    this.refreshPassQr();
  }

  refreshPassQr() {
    const t = this.userTicket;
    const { code, secondsRemaining } = gathrTicketEngine.getRollingTotp(t.ticketCode);
    const payload = `${t.ticketCode}#${code}`;
    
    const qrContainer = document.getElementById('pass-qr-box');
    if (qrContainer) {
      qrContainer.innerHTML = gathrTicketEngine.generateQrSvg(payload);
    }
    
    const countdownEl = document.getElementById('totp-seconds');
    if (countdownEl) {
      countdownEl.innerText = `${secondsRemaining}s`;
    }
  }

  startTicketQrTicker() {
    if (this.qrTimer) clearInterval(this.qrTimer);
    this.qrTimer = setInterval(() => {
      if (this.currentView === 'ticket') {
        this.refreshPassQr();
      }
    }, 1000);
  }

  shareTicketWhatsApp() {
    const t = this.userTicket;
    const msg = encodeURIComponent(`🎟️ I just got my ticket to *${t.event.title}* via GATHR! See you there: https://letusgather.online/event/${t.event.id}`);
    window.open(`https://api.whatsapp.com/send?text=${msg}`, '_blank');
  }

  showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF5500" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
      <span>${message}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  resetFilters() {
    this.activeCategory = 'all';
    this.activeCity = 'all';
    this.searchQuery = '';
    const sInput = document.getElementById('event-search-input');
    if (sInput) sInput.value = '';
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
    this.renderEvents();
  }

  bindEvents() {
    // Navigation tabs
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchView(btn.dataset.view);
      });
    });

    // Category pills
    document.querySelectorAll('.cat-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        this.activeCategory = e.target.dataset.cat;
        this.renderEvents();
      });
    });

    // City dropdown
    const citySelect = document.getElementById('city-select');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        this.activeCity = e.target.value;
        this.renderEvents();
      });
    }

    // Search input
    const searchInput = document.getElementById('event-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.renderEvents();
      });
    }

    // Checkout form
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
      checkoutForm.addEventListener('submit', (e) => this.processCheckoutSubmit(e));
    }
  }
}

const gathrApp = new GathrApp();
document.addEventListener('DOMContentLoaded', () => {
  gathrApp.init();
});
