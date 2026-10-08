/**
 * GATHR RADAR: AI Intent-Based Matchmaking & Squad Pass Split-Pay Engine
 */

class GathrRadar {
  constructor() {
    this.radarMatches = [
      {
        id: "m-01",
        name: "Dr. Kemi Balogun",
        role: "Partner @ Ventures Platform",
        location: "Lagos / London",
        avatar: "KB",
        score: "96% Match",
        intent: "Looking to deploy seed capital into African AI infrastructure & developer tooling.",
        icebreaker: "Ask Dr. Kemi about Ventures Platform's recent thesis on offline-first agentic infrastructure."
      },
      {
        id: "m-02",
        name: "Tariq Al-Mansoor",
        role: "Head of AI Engineering @ Mono",
        location: "Lagos, Nigeria",
        avatar: "TA",
        score: "92% Match",
        intent: "Architecting high-concurrency payment routing and low-latency fraud detection pipelines.",
        icebreaker: "Ask Tariq how Mono handles transaction state machines during intermittent telecom drops."
      },
      {
        id: "m-03",
        name: "Folake Oladipo",
        role: "Founder & CEO @ HealthStack",
        location: "Abuja, Nigeria",
        avatar: "FO",
        score: "88% Match",
        intent: "Scaling B2B enterprise sales and hiring senior distributed systems engineers.",
        icebreaker: "Ask Folake about her experience navigating enterprise compliance and multi-market expansion."
      }
    ];

    this.squadPassState = {
      orderId: "SQD-88210",
      totalSlots: 4,
      amountPerSlot: 22500,
      currency: "₦",
      members: [
        { name: "Chinedu Eze (Organizer)", email: "chinedu@gmail.com", status: "Paid", paidAt: "08:30 AM" },
        { name: "Seyi Adeleke", email: "seyi.a@tech.ng", status: "Paid", paidAt: "09:05 AM" },
        { name: "Pending Squad Invite #3", email: "—", status: "Awaiting Claim", paidAt: "—" },
        { name: "Pending Squad Invite #4", email: "—", status: "Awaiting Claim", paidAt: "—" }
      ]
    };
  }

  renderRadarMatches() {
    const grid = document.getElementById('radar-matches-grid');
    if (!grid) return;

    grid.innerHTML = this.radarMatches.map(m => `
      <div class="radar-match-card">
        <div class="radar-match-header">
          <div class="match-avatar-info">
            <div class="match-avatar">${m.avatar}</div>
            <div>
              <div style="font-weight: 700; font-size: 1.1rem; color: #FFF;">${m.name}</div>
              <div style="font-size: 0.8rem; color: var(--brand-orange-light);">${m.role}</div>
            </div>
          </div>
          <span class="match-score-badge">${m.score}</span>
        </div>

        <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
          <strong style="color: var(--text-dim); text-transform: uppercase; font-size: 0.7rem;">Stated Goal:</strong> ${m.intent}
        </div>

        <div class="match-icebreaker-box">
          <strong style="color: var(--brand-orange); display: block; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.2rem;">AI Icebreaker Prompt:</strong>
          "${m.icebreaker}"
        </div>

        <button class="btn btn-secondary btn-block btn-sm" onclick="gathrRadar.tapConnect('${m.id}', '${m.name}')">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
          Exchange Digital Contact Card
        </button>
      </div>
    `).join('');
  }

  tapConnect(matchId, name) {
    if (window.gathrApp) {
      window.gathrApp.showToast(`✨ Digital contact badge exchanged with ${name}! Saved to your GATHR Network.`);
    }
  }

  renderSquadPass() {
    const list = document.getElementById('squad-members-list');
    if (!list) return;

    list.innerHTML = this.squadPassState.members.map((m, idx) => {
      const isPaid = m.status === 'Paid';
      return `
        <div class="squad-member-row">
          <div>
            <div style="font-weight: 700; font-size: 0.95rem;">${m.name}</div>
            <div style="font-size: 0.8rem; color: var(--text-muted);">${m.email}</div>
          </div>
          <div style="text-align: right;">
            <span class="badge ${isPaid ? 'badge-green' : 'badge-orange'}" style="margin-bottom: 0.2rem;">
              ${m.status}
            </span>
            <div style="font-size: 0.75rem; color: var(--text-dim);">${isPaid ? '₦22,500 settled' : '₦22,500 pending'}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  copySquadLink() {
    const input = document.getElementById('squad-link-input');
    if (input) {
      navigator.clipboard.writeText(input.value).then(() => {
        if (window.gathrApp) {
          window.gathrApp.showToast("📋 Squad Split-Pay claim link copied to clipboard!");
        }
      });
    }
  }
}

window.gathrRadar = new GathrRadar();
