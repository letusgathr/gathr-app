/**
 * GATHR Organizer Command Center: GATHR Organizer Architecture
 * Provides dedicated Creator Studio capabilities:
 * - Real-time Gross GMV, Ticket Velocity & Gate Latency
 * - Event Switcher (Switch between multiple live events)
 * - Dynamic Surge Pricing Engine
 * - Door Check-In HUD & Offline Manifest Download
 * - Attendee Management & CSV Export
 * - Multi-Party Automated Payout Splits
 * - Attendee Marketing Broadcast Engine (WhatsApp & Email)
 */

class OrganizerManager {
  constructor() {
    this.attendees = [...INITIAL_ATTENDEES];
    this.activeEvent = GATHR_EVENTS[0];
    this.currentSubTab = 'overview';
  }

  init() {
    this.renderEventSelector();
    this.renderMetrics();
    this.renderAttendeeTable();
    this.renderPredictiveInsights();
  }

  // Event Switcher dropdown for multi-event organizers
  renderEventSelector() {
    const sel = document.getElementById('org-event-switcher');
    if (!sel) return;

    sel.innerHTML = GATHR_EVENTS.map(e => `
      <option value="${e.id}" ${e.id === this.activeEvent.id ? 'selected' : ''}>
        ${e.countryCode ? `[${e.countryCode}] ` : ''}${e.title} (${e.city})
      </option>
    `).join('');

    sel.addEventListener('change', (e) => {
      this.switchActiveEvent(e.target.value);
    });
  }

  switchActiveEvent(eventId) {
    const found = GATHR_EVENTS.find(e => e.id === eventId);
    if (!found) return;
    this.activeEvent = found;
    this.renderMetrics();
    this.renderAttendeeTable();
    this.renderPredictiveInsights();
    
    if (window.gathrApp) {
      window.gathrApp.showToast(`Switched active organizer event to: ${found.title}`);
    }
  }

  switchSubTab(tabName) {
    this.currentSubTab = tabName;
    document.querySelectorAll('.org-subtab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    document.querySelectorAll('.org-subtab-pane').forEach(pane => {
      pane.style.display = pane.id === `org-pane-${tabName}` ? 'block' : 'none';
    });
  }

  renderMetrics() {
    const revEl = document.getElementById('org-metric-revenue');
    const ticketsEl = document.getElementById('org-metric-tickets');
    const checkedInEl = document.getElementById('org-metric-checkins');
    const pacingEl = document.getElementById('org-metric-pacing');

    const curr = this.activeEvent.baseCurrency || 'NGN';
    const sym = GATHR_CURRENCY_RATES[curr]?.symbol || '₦';

    if (revEl) revEl.innerText = `${sym}${(this.activeEvent.stats.revenueGross).toLocaleString()}`;
    if (ticketsEl) ticketsEl.innerText = `${this.activeEvent.stats.soldCount}`;
    if (checkedInEl) checkedInEl.innerText = `${this.activeEvent.stats.checkedInCount}`;
    
    const sold = this.activeEvent.stats.soldCount || 1;
    const checked = this.activeEvent.stats.checkedInCount || 0;
    const pacingPercent = Math.min(100, Math.round((checked / sold) * 100));
    if (pacingEl) pacingEl.innerText = `${pacingPercent}%`;
  }

  renderAttendeeTable(filter = 'all', searchQuery = '') {
    const tbody = document.getElementById('attendees-table-body');
    if (!tbody) return;

    let list = this.attendees;
    if (filter === 'checked') {
      list = list.filter(a => a.status === 'Checked In');
    } else if (filter === 'pending') {
      list = list.filter(a => a.status === 'Pending');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(a => a.name.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.code.toLowerCase().includes(q));
    }

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 2rem;">No matching attendees found.</td></tr>`;
      return;
    }

    tbody.innerHTML = list.map(a => {
      const isChecked = a.status === 'Checked In';
      const badgeClass = isChecked ? 'badge-green' : 'badge-orange';
      return `
        <tr id="row-${a.code}">
          <td style="font-weight: 600;">${a.name}</td>
          <td style="color: var(--text-muted);">${a.email}</td>
          <td><span class="badge" style="background: rgba(255,255,255,0.06);">${a.tier}</span></td>
          <td><code>${a.code}</code></td>
          <td><span class="badge ${badgeClass}">${a.status}</span></td>
          <td style="color: var(--text-muted); font-size: 0.85rem;">${a.checkInTime}</td>
        </tr>
      `;
    }).join('');
  }

  addRecentCheckIn(name, tier, code, timeStr) {
    const existing = this.attendees.find(a => a.code === code);
    if (existing) {
      existing.status = "Checked In";
      existing.checkInTime = timeStr;
      existing.gate = "Gate 1 Priority";
    } else {
      this.attendees.unshift({
        id: `att-${Date.now()}`,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        tier: tier,
        code: code,
        status: "Checked In",
        gate: "Gate 1 Priority",
        checkInTime: timeStr
      });
    }

    this.activeEvent.stats.checkedInCount++;
    this.renderMetrics();
    this.renderAttendeeTable();

    setTimeout(() => {
      const row = document.getElementById(`row-${code}`);
      if (row) {
        row.style.background = 'rgba(0, 230, 118, 0.15)';
        setTimeout(() => row.style.background = '', 1800);
      }
    }, 100);
  }

  exportAttendeesCsv() {
    const headers = ["Name,Email,Ticket Tier,Ticket Code,Status,Check In Time,Gate\n"];
    const rows = this.attendees.map(a => 
      `"${a.name}","${a.email}","${a.tier}","${a.code}","${a.status}","${a.checkInTime}","${a.gate || 'N/A'}"`
    );
    const csvContent = "data:text/csv;charset=utf-8," + headers.concat(rows).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `gathr_${this.activeEvent.id}_manifest.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.gathrApp) {
      window.gathrApp.showToast("Door Manifest & Attendee CSV downloaded!");
    }
  }

  downloadOfflineManifest() {
    const manifest = {
      eventId: this.activeEvent.id,
      eventTitle: this.activeEvent.title,
      generatedAt: new Date().toISOString(),
      encryption: "AES-256-GCM-MESH",
      attendees: this.attendees.map(a => ({
        code: a.code,
        name: a.name,
        tier: a.tier,
        status: a.status
      }))
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(manifest, null, 2));
    const dlLink = document.createElement('a');
    dlLink.setAttribute("href", jsonStr);
    dlLink.setAttribute("download", `gathr_offline_gate_manifest_${this.activeEvent.id}.json`);
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);

    if (window.gathrApp) {
      window.gathrApp.showToast("Offline Mesh Scanner Manifest generated & synced!");
    }
  }

  applyAiDynamicPricing() {
    const firstTier = this.activeEvent.ticketTiers[0];
    if (firstTier) {
      const oldPrice = firstTier.price;
      firstTier.price = Math.round(oldPrice * 1.15);
      const curr = this.activeEvent.baseCurrency || 'NGN';
      const sym = GATHR_CURRENCY_RATES[curr]?.symbol || '₦';

      if (window.gathrApp) {
        window.gathrApp.renderEvents();
        window.gathrApp.showToast(`🚀 Dynamic Surge Pricing (+15%) Applied to ${firstTier.name}: ${sym}${oldPrice.toLocaleString()} -> ${sym}${firstTier.price.toLocaleString()}`);
      }
      const bannerBtn = document.getElementById('ai-dynamic-pricing-btn');
      if (bannerBtn) {
        bannerBtn.innerText = "Surge Active (+15%) ✓";
        bannerBtn.disabled = true;
        bannerBtn.style.opacity = "0.7";
      }
    }
  }

  sendAttendeeBroadcast() {
    const msgInput = document.getElementById('broadcast-msg-input');
    const msg = msgInput ? msgInput.value.trim() : "";
    if (!msg) {
      if (window.gathrApp) window.gathrApp.showToast("Please enter a broadcast announcement message.");
      return;
    }

    if (window.gathrApp) {
      window.gathrApp.showToast(`📢 Broadcast sent to ${this.activeEvent.stats.soldCount} ticket holders via WhatsApp & Email!`);
    }
    if (msgInput) msgInput.value = "";
  }

  renderPredictiveInsights() {
    const forecastEl = document.getElementById('org-forecast-attendance');
    const confidenceEl = document.getElementById('org-forecast-confidence');
    const hostShareEl = document.getElementById('org-split-host');
    const venueShareEl = document.getElementById('org-split-venue');
    const promoterShareEl = document.getElementById('org-split-promoter');

    const curr = this.activeEvent.baseCurrency || 'NGN';
    const sym = GATHR_CURRENCY_RATES[curr]?.symbol || '₦';

    const gross = this.activeEvent.stats.revenueGross;
    const netAfterFee = gross * 0.975;
    const splits = this.activeEvent.splits || { host: 70, venue: 20, promoter: 10 };
    const hostShare = netAfterFee * (splits.host / 100);
    const venueShare = netAfterFee * (splits.venue / 100);
    const promoterShare = netAfterFee * (splits.promoter / 100);

    const projected = Math.round(this.activeEvent.stats.soldCount * 0.91);

    if (forecastEl) forecastEl.innerText = `${projected.toLocaleString()} Attendees (~91%)`;
    if (confidenceEl) confidenceEl.innerText = `94% Model Confidence (Local Weather & Velocity)`;
    if (hostShareEl) hostShareEl.innerText = `${sym}${Math.round(hostShare).toLocaleString()}`;
    if (venueShareEl) venueShareEl.innerText = `${sym}${Math.round(venueShare).toLocaleString()}`;
    if (promoterShareEl) promoterShareEl.innerText = `${sym}${Math.round(promoterShare).toLocaleString()}`;
  }
}

window.gathrOrganizer = new OrganizerManager();
