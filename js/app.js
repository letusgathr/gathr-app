/**
 * GATHR Core Application Controller & UI Router
 * Eventbrite Case Study Architecture & Global Multi-Currency Platform
 */

class GathrApp {
  constructor() {
    this.events = [...GATHR_EVENTS];
    this.currentView = 'explore';
    this.selectedEvent = this.events[0];
    this.activeCategory = 'all';
    this.activeCountry = 'all';
    this.activeCity = 'all';
    this.searchQuery = '';
    this.preferredCurrency = 'USD'; // Default global currency
    
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

    this.selectedGateway = 'stripe';
    this.currentCheckoutTotal = 0;
    this.qrTimer = null;
    this.showingAllEvents = false;
    this.eventsLimit = 3;
  }

  init() {
    this.renderEvents();
    this.bindEvents();
    this.startTicketQrTicker();
    this.initTicketTilt();
    
    // Initialize Organizer metrics & table
    if (window.gathrOrganizer) {
      window.gathrOrganizer.init();
    }

    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./service-worker.js')
        .then(() => console.log('GATHR Service Worker Registered'))
        .catch(err => console.log('SW registration note:', err));
    }
  }

  // Currency Converter Controller
  setCurrency(currencyCode) {
    if (!GATHR_CURRENCY_RATES[currencyCode]) return;
    this.preferredCurrency = currencyCode;
    const meta = GATHR_CURRENCY_RATES[currencyCode];
    this.renderEvents();
    if (this.checkoutState.event) {
      this.updateCheckoutSummary();
    }
    this.showToast(`Currency updated to ${meta.flag} ${currencyCode} (${meta.symbol})`);
  }

  // Location / Country Filter Controller
  setCountry(countryCode) {
    this.activeCountry = countryCode;
    this.activeCity = 'all';
    this.showingAllEvents = false;
    const citySel = document.getElementById('city-select');
    if (citySel) {
      // Repopulate city select based on country
      if (countryCode === 'all') {
        citySel.innerHTML = `
          <option value="all">📍 All Global Cities</option>
          <optgroup label="South Africa">
            <option value="Cape Town">Cape Town, ZA</option>
            <option value="Johannesburg">Johannesburg, ZA</option>
          </optgroup>
          <optgroup label="Nigeria">
            <option value="Lagos">Lagos, NG</option>
            <option value="Abuja">Abuja, NG</option>
            <option value="Port Harcourt">Port Harcourt, NG</option>
            <option value="Calabar">Calabar, NG</option>
            <option value="Delta">Delta (Asaba / Warri), NG</option>
            <option value="Anambra">Anambra (Awka / Onitsha), NG</option>
            <option value="Ilorin">Ilorin, NG</option>
            <option value="Uyo">Uyo, NG</option>
            <option value="Bayelsa">Bayelsa (Yenagoa), NG</option>
          </optgroup>
          <optgroup label="International Hubs">
            <option value="New York">New York, US</option>
            <option value="London">London, UK</option>
            <option value="Toronto">Toronto, CA</option>
            <option value="Nairobi">Nairobi, KE</option>
            <option value="Accra">Accra, GH</option>
          </optgroup>
        `;
      } else if (countryCode === 'ZA') {
        citySel.innerHTML = `
          <option value="all">📍 All South Africa Cities</option>
          <option value="Cape Town">Cape Town</option>
          <option value="Johannesburg">Johannesburg</option>
        `;
      } else if (countryCode === 'NG') {
        citySel.innerHTML = `
          <option value="all">📍 All Nigeria Cities</option>
          <option value="Lagos">Lagos</option>
          <option value="Abuja">Abuja</option>
          <option value="Port Harcourt">Port Harcourt (Rivers)</option>
          <option value="Calabar">Calabar (Cross River)</option>
          <option value="Delta">Delta (Asaba / Warri)</option>
          <option value="Anambra">Anambra (Awka / Onitsha)</option>
          <option value="Ilorin">Ilorin (Kwara)</option>
          <option value="Uyo">Uyo (Akwa Ibom)</option>
          <option value="Bayelsa">Bayelsa (Yenagoa)</option>
        `;
      } else if (countryCode === 'US') {
        citySel.innerHTML = `<option value="all">📍 All US Cities</option><option value="New York">New York, NY</option>`;
      } else if (countryCode === 'GB') {
        citySel.innerHTML = `<option value="all">📍 All UK Cities</option><option value="London">London</option>`;
      } else if (countryCode === 'CA') {
        citySel.innerHTML = `<option value="all">📍 All Canada Cities</option><option value="Toronto">Toronto, ON</option>`;
      } else if (countryCode === 'KE') {
        citySel.innerHTML = `<option value="all">📍 All Kenya Cities</option><option value="Nairobi">Nairobi</option>`;
      } else if (countryCode === 'GH') {
        citySel.innerHTML = `<option value="all">📍 All Ghana Cities</option><option value="Accra">Accra</option>`;
      }
    }
    this.renderEvents();
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

    // Toggle organizer banner visibility
    const orgBanner = document.getElementById('organizer-mode-banner');
    if (orgBanner) {
      orgBanner.style.display = viewName === 'organizer' ? 'block' : 'none';
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
      if (window.gathrVisuals) window.gathrVisuals.init3DHolographicPass();
    }

    if (viewName === 'planning' && window.gathrPlanning) {
      window.gathrPlanning.init();
    }

    if (viewName === 'organizer' && window.gathrOrganizer) {
      window.gathrOrganizer.init();
    }

    if (viewName === 'radar' && window.gathrRadar) {
      window.gathrRadar.renderRadarMatches();
      window.gathrRadar.renderSquadPass();
    }

    if (viewName === 'admin' && window.gathrAdmin) {
      window.gathrAdmin.renderAdminOverview();
    }
  }

  // Toggle Show More Events (Show 3 initially, expand on click)
  toggleShowMoreEvents() {
    this.showingAllEvents = !this.showingAllEvents;
    this.renderEvents();
    if (!this.showingAllEvents) {
      const grid = document.getElementById('events-grid');
      if (grid) grid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Render Event Cards Grid with Global Multi-Currency Conversion
  renderEvents() {
    const grid = document.getElementById('events-grid');
    const moreContainer = document.getElementById('events-more-container');
    if (!grid) return;

    let filtered = this.events;
    if (this.activeCategory !== 'all') {
      filtered = filtered.filter(e => e.category.toLowerCase() === this.activeCategory.toLowerCase());
    }
    if (this.activeCountry !== 'all') {
      filtered = filtered.filter(e => e.countryCode === this.activeCountry);
    }
    if (this.activeCity !== 'all') {
      filtered = filtered.filter(e => {
        const c = e.city.toLowerCase();
        const target = this.activeCity.toLowerCase();
        return c.includes(target) || target.includes(c);
      });
    }
    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      filtered = filtered.filter(e => 
        e.title.toLowerCase().includes(q) || 
        e.description.toLowerCase().includes(q) || 
        e.venue.toLowerCase().includes(q) || 
        e.city.toLowerCase().includes(q) ||
        (e.state && e.state.toLowerCase().includes(q)) ||
        (e.tags && e.tags.some(t => t.toLowerCase().includes(q))) ||
        (e.country && e.country.toLowerCase().includes(q))
      );
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 4rem 1rem;">
          <p style="font-size: 1.25rem; color: var(--text-muted); margin-bottom: 1rem;">No events found matching your criteria in this region.</p>
          <button class="btn btn-secondary btn-sm" onclick="gathrApp.resetFilters()">Clear Location & Category Filters</button>
        </div>
      `;
      if (moreContainer) moreContainer.innerHTML = '';
      return;
    }

    const totalMatching = filtered.length;
    const shouldLimit = !this.showingAllEvents && totalMatching > this.eventsLimit;
    const displayedEvents = shouldLimit ? filtered.slice(0, this.eventsLimit) : filtered;

    const targetCurr = this.preferredCurrency;
    const currMeta = GATHR_CURRENCY_RATES[targetCurr] || { symbol: "$", flag: "🌐" };

    grid.innerHTML = displayedEvents.map(e => {
      const convertedMin = convertPrice(e.minPrice, e.baseCurrency, targetCurr);
      const isOriginalCurr = e.baseCurrency === targetCurr;
      const originalMeta = GATHR_CURRENCY_RATES[e.baseCurrency] || { symbol: "$" };

      return `
        <div class="event-card liquid-glass-card cinematic-reveal" onclick="gathrApp.openEventDetails('${e.id}')">
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
              <span><strong>${e.city}, ${e.country}</strong> • ${e.venue.split(',')[0]}</span>
            </div>
            <h3 class="event-card-title">${e.title}</h3>
            <p class="event-description-snippet">${e.description}</p>
            <div class="event-footer">
              <div class="event-price-box">
                <span class="price-label">Tickets From</span>
                <span class="price-value">${currMeta.symbol}${convertedMin.toLocaleString()}</span>
                ${!isOriginalCurr ? `<span style="font-size: 0.7rem; color: var(--text-dim); display: block;">(Orig: ${originalMeta.symbol}${e.minPrice.toLocaleString()})</span>` : ''}
              </div>
              <button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); gathrApp.openCheckout('${e.id}')">
                Get Tickets
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Render "More Gatherings" toggle button
    if (moreContainer) {
      if (totalMatching > this.eventsLimit) {
        if (!this.showingAllEvents) {
          const remaining = totalMatching - this.eventsLimit;
          moreContainer.innerHTML = `
            <button class="btn btn-secondary" onclick="gathrApp.toggleShowMoreEvents()" style="padding: 0.85rem 2.2rem; font-size: 0.95rem; font-weight: 700; border-radius: 9999px; box-shadow: 0 4px 20px rgba(0,0,0,0.3); display: inline-flex; align-items: center; gap: 0.5rem; margin: 0 auto;">
              <span>Explore More Gatherings (+${remaining} more)</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            </button>
          `;
        } else {
          moreContainer.innerHTML = `
            <button class="btn btn-secondary btn-sm" onclick="gathrApp.toggleShowMoreEvents()" style="padding: 0.6rem 1.6rem; border-radius: 9999px; display: inline-flex; align-items: center; gap: 0.5rem; margin: 0 auto;">
              <span>Show Fewer Gatherings</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg>
            </button>
          `;
        }
      } else {
        moreContainer.innerHTML = '';
      }
    }

    if (window.gathrVisuals) {
      window.gathrVisuals.initScrollWorld();
    }
  }

  // Open Event Details Modal
  openEventDetails(eventId) {
    const e = this.events.find(ev => ev.id === eventId);
    if (!e) return;
    this.selectedEvent = e;

    const modal = document.getElementById('event-details-modal');
    document.getElementById('modal-event-img').src = e.image;
    document.getElementById('modal-event-title').innerText = e.title;
    document.getElementById('modal-event-category').innerText = `${e.category} • ${e.city}, ${e.country}`;
    document.getElementById('modal-event-date').innerText = `${e.date} • ${e.time}`;
    document.getElementById('modal-event-venue').innerText = e.venue;
    document.getElementById('modal-event-desc').innerText = e.description;
    document.getElementById('modal-event-organizer').innerText = e.organizer;

    const targetCurr = this.preferredCurrency;
    const currMeta = GATHR_CURRENCY_RATES[targetCurr] || { symbol: "$" };

    // Render Tiers
    const tiersWrap = document.getElementById('modal-ticket-tiers');
    tiersWrap.innerHTML = e.ticketTiers.map(t => {
      const convertedPrice = convertPrice(t.price, e.baseCurrency, targetCurr);
      return `
        <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); padding: 1rem 1.25rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; margin-bottom: 0.2rem;">${t.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${t.perks}</div>
            <div style="font-size: 0.75rem; color: var(--brand-orange); margin-top: 0.25rem;">Only ${t.remaining} tickets remaining</div>
          </div>
          <div style="text-align: right;">
            <div style="font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; color: #FFF; margin-bottom: 0.4rem;">
              ${currMeta.symbol}${convertedPrice.toLocaleString()}
            </div>
            <button class="btn btn-outline btn-sm" onclick="gathrApp.openCheckoutWithTier('${e.id}', '${t.id}')">Select</button>
          </div>
        </div>
      `;
    }).join('');

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

    const targetCurr = this.preferredCurrency;
    const currMeta = GATHR_CURRENCY_RATES[targetCurr] || { symbol: "$" };

    document.getElementById('checkout-modal-event-title').innerText = `${e.title} (${e.city}, ${e.country})`;
    document.getElementById('checkout-tier-select').innerHTML = e.ticketTiers.map(t => {
      const converted = convertPrice(t.price, e.baseCurrency, targetCurr);
      return `<option value="${t.id}" ${t.id === tier.id ? 'selected' : ''}>${t.name} (${currMeta.symbol}${converted.toLocaleString()})</option>`;
    }).join('');

    // Pre-select gateway based on event or currency
    if (e.countryCode === 'NG' || targetCurr === 'NGN') {
      this.setPaymentGateway('paystack');
    } else {
      this.setPaymentGateway('stripe');
    }
    document.getElementById('checkout-modal').classList.add('active');
  }

  closeCheckout() {
    document.getElementById('checkout-modal').classList.remove('active');
  }

  setPaymentGateway(gateway) {
    this.selectedGateway = gateway;
    const paystackLabel = document.getElementById('gateway-paystack-label');
    const stripeLabel = document.getElementById('gateway-stripe-label');
    
    if (gateway === 'paystack') {
      if (paystackLabel) {
        paystackLabel.style.background = 'rgba(255,85,0,0.15)';
        paystackLabel.style.borderColor = 'var(--brand-orange)';
      }
      if (stripeLabel) {
        stripeLabel.style.background = 'rgba(255,255,255,0.04)';
        stripeLabel.style.borderColor = 'var(--border-subtle)';
      }
    } else {
      if (stripeLabel) {
        stripeLabel.style.background = 'rgba(0,229,153,0.12)';
        stripeLabel.style.borderColor = 'var(--accent-green)';
      }
      if (paystackLabel) {
        paystackLabel.style.background = 'rgba(255,255,255,0.04)';
        paystackLabel.style.borderColor = 'var(--border-subtle)';
      }
    }
    this.updateCheckoutSummary();
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
    if (q > 8) q = 8;
    this.checkoutState.quantity = q;
    document.getElementById('checkout-qty-display').innerText = q;
    this.updateCheckoutSummary();
  }

  updateCheckoutSummary() {
    const { event, selectedTier, quantity } = this.checkoutState;
    if (!event || !selectedTier) return;

    const targetCurr = this.preferredCurrency;
    const currMeta = GATHR_CURRENCY_RATES[targetCurr] || { symbol: "$" };
    const convertedUnit = convertPrice(selectedTier.price, event.baseCurrency, targetCurr);

    const subtotal = convertedUnit * quantity;
    const fee = Math.max(1, Math.round(subtotal * 0.025));
    const total = subtotal + fee;

    this.currentCheckoutTotal = total;

    const subtotalEl = document.getElementById('checkout-subtotal');
    const feesEl = document.getElementById('checkout-fees');
    const totalEl = document.getElementById('checkout-total');
    const payBtn = document.getElementById('checkout-pay-btn');

    if (subtotalEl) subtotalEl.innerText = `${currMeta.symbol}${subtotal.toLocaleString()}`;
    if (feesEl) feesEl.innerText = `${currMeta.symbol}${fee.toLocaleString()}`;
    if (totalEl) totalEl.innerText = `${currMeta.symbol}${total.toLocaleString()}`;

    if (payBtn) {
      if (this.selectedGateway === 'stripe') {
        payBtn.innerText = `Pay ${currMeta.symbol}${total.toLocaleString()} via Stripe (Visa, MC, Apple Pay) →`;
      } else {
        payBtn.innerText = `Pay ${currMeta.symbol}${total.toLocaleString()} via Paystack (Bank & Cards) →`;
      }
    }
  }

  // Complete Payment & Issue Ticket via Backend API
  async processCheckoutSubmit(e) {
    e.preventDefault();
    const nameInput = document.getElementById('checkout-name').value.trim() || "Chinedu Eze";
    const emailInput = document.getElementById('checkout-email').value.trim() || "chinedu@gmail.com";
    const payBtn = document.getElementById('checkout-pay-btn');
    
    const provider = (this.selectedGateway || 'stripe').toUpperCase();
    const totalAmount = this.currentCheckoutTotal || 150;
    
    payBtn.innerText = `Authorizing Live ${provider} Gateway & Issuing TOTP Pass...`;
    payBtn.disabled = true;

    try {
      const resp = await fetch('/api/v1/payments/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider,
          amount: totalAmount,
          reference: `${provider === 'PAYSTACK' ? 'PSTK' : 'STRIPE'}-${Date.now()}`,
          name: nameInput,
          email: emailInput,
          tierName: this.checkoutState.selectedTier.name,
          tierId: this.checkoutState.selectedTier.id,
          quantity: this.checkoutState.quantity,
          eventId: this.checkoutState.event.id
        })
      });

      const data = await resp.json();
      const issuedCode = (data.result && data.result.ticketCode) || `GTHR-${this.checkoutState.selectedTier.id.includes('vip') ? 'VIP' : 'TKT'}-${Math.floor(1000 + Math.random() * 9000)}`;
      const orderRef = (data.result && data.result.orderRef) || `GTHR-ORD-${Date.now() % 1000000}`;

      this.userTicket = {
        event: this.checkoutState.event,
        tier: this.checkoutState.selectedTier,
        attendeeName: nameInput,
        attendeeEmail: emailInput,
        ticketCode: issuedCode,
        orderRef: orderRef,
        purchaseDate: "Just now",
        gateway: provider,
        signatureVerified: true
      };

      if (window.gathrOrganizer) {
        window.gathrOrganizer.attendees.push({
          id: `att-${Date.now()}`,
          name: nameInput,
          email: emailInput,
          tier: this.checkoutState.selectedTier.name,
          code: issuedCode,
          status: "Pending",
          gate: "Gate 1 (VIP & Fast-Track)",
          checkInTime: "—"
        });
        window.gathrOrganizer.renderAttendeeTable();
      }

      if (window.gathrAdmin) {
        window.gathrAdmin.fetchWebhookLogs();
      }

      this.closeCheckout();
      payBtn.disabled = false;
      payBtn.innerText = "Complete Payment";

      this.showToast(`🎉 Verified via ${provider}! Dynamic ticket pass issued: ${issuedCode}`);
      this.switchView('ticket');
      this.renderUserTicket();
    } catch (err) {
      console.error("Checkout payment error:", err);
      this.showToast("⚠️ Payment processing note: Pass generated via client-side HMAC.");
      payBtn.disabled = false;
      payBtn.innerText = "Complete Payment";
      this.closeCheckout();
      this.switchView('ticket');
      this.renderUserTicket();
    }
  }

  // Render User's Luxury Digital Pass
  renderUserTicket() {
    const t = this.userTicket;
    const titleEl = document.getElementById('pass-event-title');
    const badgeEl = document.getElementById('pass-tier-badge');
    const nameEl = document.getElementById('pass-attendee-name');
    const dateEl = document.getElementById('pass-date');
    const venueEl = document.getElementById('pass-venue');
    const codeEl = document.getElementById('pass-ticket-code');
    const refEl = document.getElementById('pass-order-ref');
    const gatewayEl = document.getElementById('pass-gateway-badge');

    if (titleEl) titleEl.innerText = t.event.title;
    if (badgeEl) badgeEl.innerText = t.tier.name;
    if (nameEl) nameEl.innerText = t.attendeeName;
    if (dateEl) dateEl.innerText = `${t.event.date} • ${t.event.city}`;
    if (venueEl) venueEl.innerText = `${t.event.venue}`;
    if (codeEl) codeEl.innerText = t.ticketCode;
    if (refEl) refEl.innerText = t.orderRef;
    if (gatewayEl) {
      gatewayEl.innerText = `✓ Cryptographic Pass via ${t.gateway || 'Stripe/Paystack'} (HMAC SHA-512)`;
    }

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

  initTicketTilt() {
    if (window.gathrVisuals) {
      window.gathrVisuals.init3DHolographicPass();
    }
  }

  exportAppleWalletPass() {
    const t = this.userTicket;
    this.showToast(`🍏 Apple Wallet: Generating signed .pkpass for "${t.event.title}"...`);
    setTimeout(() => {
      this.showToast(`✓ Pass added to Apple Wallet! Tap your iPhone/Apple Watch at GATHR Turnstiles.`);
    }, 1200);
  }

  exportGoogleWalletPass() {
    const t = this.userTicket;
    this.showToast(`📱 Google Wallet: Syncing event pass credentials...`);
    setTimeout(() => {
      this.showToast(`✓ Saved to Google Wallet! Instant NFC tap enabled.`);
    }, 1000);
  }

  printTicketReceipt() {
    window.print();
  }

  shareTicketWhatsApp() {
    const t = this.userTicket;
    const msg = encodeURIComponent(`🎟️ I just got my verified ticket to *${t.event.title}* via GATHR! See you there: https://letusgather.online/event/${t.event.id}`);
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
    }, 3800);
  }

  resetFilters() {
    this.activeCategory = 'all';
    this.activeCountry = 'all';
    this.activeCity = 'all';
    this.searchQuery = '';
    this.showingAllEvents = false;
    const sInput = document.getElementById('event-search-input');
    if (sInput) sInput.value = '';
    const countrySel = document.getElementById('global-country-select');
    if (countrySel) countrySel.value = 'all';
    const citySel = document.getElementById('city-select');
    if (citySel) citySel.value = 'all';
    document.querySelectorAll('.cat-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
    this.renderEvents();
  }

  // ==========================================================
  // LEGAL & COMPLIANCE HUB MODAL ENGINE
  // ==========================================================
  openLegalModal(docKey = 'tos') {
    const modal = document.getElementById('legal-hub-modal');
    if (!modal) return;
    this.switchLegalDoc(docKey);
    modal.style.display = 'flex';
  }

  closeLegalModal() {
    const modal = document.getElementById('legal-hub-modal');
    if (modal) modal.style.display = 'none';
  }

  switchLegalDoc(docKey) {
    document.querySelectorAll('.legal-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.doc === docKey);
    });

    const contentEl = document.getElementById('legal-doc-body');
    if (!contentEl) return;

    const docs = {
      tos: `
        <h2>GATHR Terms of Service</h2>
        <p><strong>Effective Date:</strong> October 15, 2026 | <strong>Jurisdiction:</strong> Global (US, UK, Canada, Africa, EU)</p>
        <h3>1. Acceptance & Scope</h3>
        <p>Welcome to GATHR Technologies Inc. ("GATHR"). By accessing our event ticketing infrastructure, purchasing digital passes, deploying gate scanners, or utilizing our Creator Studio, you agree to be bound by these Terms.</p>
        <h3>2. Role Distinction: GATHR vs Organizers</h3>
        <p>GATHR is an event operations and ticketing infrastructure technology provider. Unless specified for GATHR-produced flagship summits, independent third-party event organizers create, price, and host all listed events.</p>
        <h3>3. Dynamic Anti-Screenshot Ticketing</h3>
        <p>All GATHR tickets employ dynamic cryptographic TOTP QR codes that auto-refresh every 20 seconds. <strong>Static screenshots or duplicated photos are rejected at the door.</strong></p>
        <h3>4. Anti-Scalping & Unauthorized Resale</h3>
        <p>Tickets purchased on GATHR may not be resold above face value on unauthorized secondary marketplaces. Violating tickets are voided without refund.</p>
        <h3>5. Programmatic Multi-Party Settlement</h3>
        <p>Net ticket proceeds are settled programmatically according to automated split configurations (Organizer, Venue, Promoter). Payout reserves of 5%–10% may be held until event conclusion.</p>
      `,
      privacy: `
        <h2>GATHR Global Privacy Policy</h2>
        <p><strong>Compliance:</strong> Nigeria Data Protection Act 2023 (NDPA), EU/UK GDPR, CCPA/CPRA, Canada PIPEDA</p>
        <h3>1. Roles Under Data Protection Laws</h3>
        <p>GATHR acts as a Data Controller for user account data and platform visitors, and as a Data Processor on behalf of Event Organizers who collect attendee registration information.</p>
        <h3>2. Information We Collect</h3>
        <ul>
          <li><strong>Personal Identifiers:</strong> Name, email address, phone number, organization.</li>
          <li><strong>Door Gate Telemetry:</strong> Check-in timestamp, turnstile device ID, validation status (anti-passback).</li>
          <li><strong>Camera Stream:</strong> Scanner PWA accesses the local device camera strictly for real-time QR decoding. Video streams are never recorded or transmitted to cloud servers.</li>
        </ul>
        <h3>3. Military-Grade Security & Encryption</h3>
        <p>All data is encrypted in transit using TLS 1.3 and at rest with AES-256. Raw payment card numbers are never stored; tokenization is handled directly by PCI-DSS Level 1 certified partners (Paystack, Stripe).</p>
      `,
      dpa: `
        <h2>GATHR Data Processing Agreement (DPA)</h2>
        <p><strong>Statutory Authority:</strong> Article 28 GDPR & Section 31 NDPA 2023</p>
        <h3>1. Controller & Processor Relationship</h3>
        <p>The Event Organizer acts as Data Controller. GATHR acts as Data Processor. GATHR processes attendee personal data solely upon documented instructions from the Organizer.</p>
        <h3>2. Technical & Organizational Measures (TOMs)</h3>
        <p>GATHR implements AES-256 data encryption at rest, tenant database isolation, salted HMAC-SHA512 dynamic ticket hashing, and offline mesh synchronization with zero-knowledge cryptographic checks.</p>
        <h3>3. 72-Hour Security Incident Notification</h3>
        <p>GATHR covenants to notify the Controller within seventy-two (72) hours of confirming any Personal Data breach affecting attendee records.</p>
      `,
      refund: `
        <h2>GATHR Refund & Cancellation Policy</h2>
        <p><strong>Standard:</strong> Transparent, Fair, and Fraud-Proof</p>
        <h3>1. Organizer Refund Tiers</h3>
        <p>Organizers configure one of four standard tiers: Flexible (up to 7 days before event), Moderate (up to 30 days), Emergency Discretionary, or No Refunds (All Sales Final).</p>
        <h3>2. Canceled or Postponed Events</h3>
        <p>If an event is canceled in its entirety, all attendees receive an automatic 100% refund of the ticket face value within 5 to 10 business days. If postponed without a new date within 60 days, tickets are fully refunded.</p>
        <h3>3. Platform Fees</h3>
        <p>Platform and payment gateway fees cover instantaneous cryptographic hashing, digital pass delivery, and bandwidth; they are non-refundable except upon verified GATHR platform failure.</p>
      `
    };

    contentEl.innerHTML = docs[docKey] || docs.tos;
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
        this.showingAllEvents = false;
        this.renderEvents();
      });
    });

    // City dropdown
    const citySelect = document.getElementById('city-select');
    if (citySelect) {
      citySelect.addEventListener('change', (e) => {
        this.activeCity = e.target.value;
        this.showingAllEvents = false;
        this.renderEvents();
      });
    }

    // Country dropdown
    const countrySelect = document.getElementById('global-country-select');
    if (countrySelect) {
      countrySelect.addEventListener('change', (e) => {
        this.setCountry(e.target.value);
      });
    }

    // Currency selector in utility bar
    const currencySelect = document.getElementById('global-currency-select');
    if (currencySelect) {
      currencySelect.addEventListener('change', (e) => {
        this.setCurrency(e.target.value);
      });
    }

    // Search input
    const searchInput = document.getElementById('event-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value;
        this.showingAllEvents = false;
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
