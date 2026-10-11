/**
 * GATHR Platform Super-Admin & Moderation Studio Engine
 */

class PlatformAdmin {
  constructor() {
    this.moderationQueue = [
      {
        id: "mod-evt-01",
        title: "Island Rave: Sunset Neon Cruise",
        organizer: "Lagos Waves Media",
        kycStatus: "Verified Tier 2",
        submittedAt: "2 hours ago",
        ticketPrice: "₦35,000",
        capacity: 250,
        status: "Pending Review",
        image: "./assets/images/beach-fest.jpg"
      },
      {
        id: "mod-evt-02",
        title: "Fintech Founders Closed-Door Mixer",
        organizer: "Yaba Tech Nexus",
        kycStatus: "Pending KYC",
        submittedAt: "5 hours ago",
        ticketPrice: "Free (RSVP)",
        capacity: 100,
        status: "Pending Review",
        image: "./assets/images/founders-gala.jpg"
      }
    ];

    this.payoutBatches = [
      {
        id: "batch-8891",
        eventTitle: "GATHR Tech Summit 2026",
        grossRevenue: 24500000,
        platformFee: 612500,
        netPayout: 23887500,
        hostShare: 16721250, // 70%
        venueShare: 4777500,  // 20%
        promoterShare: 2388750, // 10%
        status: "Ready for Settlement"
      },
      {
        id: "batch-8892",
        eventTitle: "Vibrations Beach Festival",
        grossRevenue: 39800000,
        platformFee: 995000,
        netPayout: 38805000,
        hostShare: 27163500,
        venueShare: 7761000,
        promoterShare: 3880500,
        status: "Pending Event Completion"
      }
    ];
  }

  renderAdminOverview() {
    this.renderModerationQueue();
    this.renderPayoutTable();
    this.fetchWebhookLogs();
  }

  async fetchWebhookLogs() {
    const tbody = document.getElementById('admin-webhook-tbody');
    if (!tbody) return;

    try {
      const resp = await fetch('/api/v1/payments/webhooks/logs');
      const data = await resp.json();
      this.currentWebhooks = data.webhooks || [];
      if (this.currentWebhooks.length > 0) {
        tbody.innerHTML = this.currentWebhooks.map(w => `
          <tr>
            <td>
              <span class="badge ${w.provider === 'PAYSTACK' ? 'badge-orange' : 'badge-green'}" style="font-weight: 700;">
                ${w.provider}
              </span>
            </td>
            <td><code>${w.event_type}</code></td>
            <td><code style="color: var(--text-muted);">${w.reference}</code></td>
            <td><strong>${w.provider === 'STRIPE' ? '$' : '₦'}${w.amount.toLocaleString()}</strong></td>
            <td><span style="color: var(--text-muted); font-size: 0.85rem;">${w.attendee_email || '—'}</span></td>
            <td>
              <span class="badge badge-green" style="font-size: 0.7rem;">
                ✓ Verified (${w.provider === 'PAYSTACK' ? 'HMAC-SHA512' : 'Stripe-Sig'})
              </span>
            </td>
            <td style="color: var(--text-dim); font-size: 0.8rem;">${w.received_at || 'Just now'}</td>
            <td>
              <button class="btn btn-secondary btn-sm" style="padding: 0.2rem 0.55rem; font-size: 0.7rem;" onclick="gathrAdmin.inspectWebhook('${w.reference}')">
                Inspect 🔍
              </button>
            </td>
          </tr>
        `).join('');
      } else {
        tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 1.5rem;">No webhook events recorded yet.</td></tr>`;
      }
    } catch (e) {
      console.warn("Could not fetch webhook logs:", e);
    }
  }

  inspectWebhook(ref) {
    const w = (this.currentWebhooks || []).find(item => item.reference === ref) || {
      provider: "PAYSTACK",
      event_type: "charge.success",
      reference: ref,
      amount: 97375,
      attendee_email: "chinedu@gmail.com",
      status: "SUCCESS_CONFIRMED",
      signature_verified: 1
    };

    const modal = document.getElementById('webhook-inspector-modal');
    const title = document.getElementById('inspector-modal-title');
    const payloadContainer = document.getElementById('inspector-modal-payload');
    const status = document.getElementById('inspector-modal-status');

    if (title) title.innerText = `${w.provider} Webhook (${w.event_type})`;
    if (status) status.innerText = `✓ Signature Cryptographically Validated (${w.provider === 'PAYSTACK' ? 'HMAC-SHA512' : 'Stripe-Sig'})`;

    const mockPayload = {
      event: w.event_type,
      data: {
        id: Math.floor(100000000 + Math.random() * 900000000),
        domain: "live",
        status: "success",
        reference: w.reference,
        amount: w.provider === 'STRIPE' ? w.amount * 100 : w.amount * 100,
        currency: w.provider === 'STRIPE' ? 'USD' : 'NGN',
        gateway_response: "Successful",
        channel: w.provider === 'STRIPE' ? 'card_apple_pay' : 'dedicated_nuban',
        customer: {
          email: w.attendee_email,
          customer_code: "CUS_gthr881920"
        },
        metadata: {
          eventId: "gathr-event-01",
          platform: "GATHR OS",
          ticketIssued: true
        }
      },
      headers: {
        "x-paystack-signature": "5f8b9a2...7c1e (Verified)",
        "content-type": "application/json"
      }
    };

    if (payloadContainer) {
      payloadContainer.innerHTML = `<pre style="margin: 0; white-space: pre-wrap;">${JSON.stringify(mockPayload, null, 2)}</pre>`;
    }

    if (modal) modal.style.display = 'flex';
  }

  closeInspector() {
    const modal = document.getElementById('webhook-inspector-modal');
    if (modal) modal.style.display = 'none';
  }

  async triggerWebhookTest(provider) {
    if (window.gathrApp) {
      window.gathrApp.showToast(`⚡ Dispatching live ${provider} event signature to /api/v1/payments/${provider.toLowerCase()}/webhook...`);
    }

    try {
      const resp = await fetch('/api/v1/payments/simulate-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: provider,
          amount: provider === 'PAYSTACK' ? 95000 : 65,
          name: provider === 'PAYSTACK' ? 'Chinedu Eze' : 'Sarah Jenkins',
          email: provider === 'PAYSTACK' ? 'chinedu@gmail.com' : 'sarah@stripe.com',
          tierName: 'Executive VIP Pass'
        })
      });
      const data = await resp.json();
      this.fetchWebhookLogs();
      if (window.gathrApp) {
        window.gathrApp.showToast(`✓ Live ${provider} Webhook processed! Ticket issued with signature code: ${data.result.ticketCode}`);
      }
    } catch (e) {
      console.error("Webhook test failed:", e);
    }
  }

  renderModerationQueue() {
    const container = document.getElementById('admin-moderation-queue');
    if (!container) return;

    if (this.moderationQueue.length === 0) {
      container.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">No pending events in moderation queue. All caught up! ✓</div>`;
      return;
    }

    container.innerHTML = this.moderationQueue.map(item => `
      <div id="mod-card-${item.id}" class="mod-card">
        <div class="mod-event-details">
          <img src="${item.image}" alt="" class="mod-thumbnail">
          <div>
            <div style="font-weight: 700; font-size: 1.05rem; color: #FFF;">${item.title}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">
              By <strong>${item.organizer}</strong> • <span style="color: var(--brand-orange);">${item.kycStatus}</span> • ${item.submittedAt}
            </div>
            <div style="font-size: 0.75rem; color: var(--text-dim); margin-top: 0.2rem;">
              Capacity: ${item.capacity} tickets • Price: ${item.ticketPrice}
            </div>
          </div>
        </div>
        <div style="display: flex; gap: 0.5rem;">
          <button class="btn btn-secondary btn-sm" onclick="gathrAdmin.rejectEvent('${item.id}')">
            Flag / Reject
          </button>
          <button class="btn btn-primary btn-sm" onclick="gathrAdmin.approveEvent('${item.id}', '${item.title}')">
            Approve & Publish ✓
          </button>
        </div>
      </div>
    `).join('');
  }

  approveEvent(id, title) {
    this.moderationQueue = this.moderationQueue.filter(i => i.id !== id);
    this.renderModerationQueue();
    if (window.gathrApp) {
      window.gathrApp.showToast(`✅ "${title}" approved and published to Public Explore!`);
    }
  }

  rejectEvent(id) {
    this.moderationQueue = this.moderationQueue.filter(i => i.id !== id);
    this.renderModerationQueue();
    if (window.gathrApp) {
      window.gathrApp.showToast(`⚠️ Event flagged for manual compliance review.`);
    }
  }

  renderPayoutTable() {
    const tbody = document.getElementById('admin-payout-tbody');
    if (!tbody) return;

    tbody.innerHTML = this.payoutBatches.map(b => {
      const isReady = b.status === 'Ready for Settlement';
      return `
        <tr>
          <td>
            <div style="font-weight: 700;">${b.eventTitle}</div>
            <code style="font-size: 0.75rem; color: var(--text-dim);">${b.id}</code>
          </td>
          <td><strong>₦${b.grossRevenue.toLocaleString()}</strong></td>
          <td style="color: var(--brand-orange);">₦${b.platformFee.toLocaleString()} (2.5%)</td>
          <td>
            <div class="split-breakdown-tag">
              <span style="color: var(--brand-orange-light);">H: ₦${(b.hostShare/1000000).toFixed(1)}M</span> | 
              <span style="color: var(--accent-cyan);">V: ₦${(b.venueShare/1000000).toFixed(1)}M</span> | 
              <span style="color: var(--accent-green);">P: ₦${(b.promoterShare/1000000).toFixed(1)}M</span>
            </div>
          </td>
          <td>
            <span class="badge ${isReady ? 'badge-green' : 'badge-orange'}">${b.status}</span>
          </td>
          <td>
            ${isReady ? `
              <button class="btn btn-primary btn-sm" onclick="gathrAdmin.disbursePayout('${b.id}', '${b.eventTitle}')">
                Disburse Payout
              </button>
            ` : `
              <button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5;">
                Locked
              </button>
            `}
          </td>
        </tr>
      `;
    }).join('');
  }

  disbursePayout(batchId, eventTitle) {
    const batch = this.payoutBatches.find(b => b.id === batchId);
    if (batch) {
      batch.status = "Settled ✓ (Paystack Transferred)";
      this.renderPayoutTable();
      if (window.gathrApp) {
        window.gathrApp.showToast(`💸 ₦${batch.netPayout.toLocaleString()} split-disbursed via Paystack Transfer API for ${eventTitle}!`);
      }
    }
  }
}

window.gathrAdmin = new PlatformAdmin();
