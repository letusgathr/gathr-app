/**
 * GATHR RADAR: AI Intent-Based Matchmaking & Squad Pass Split-Pay Engine
 */

class GathrRadar {
  constructor() {
    this.userProfile = {
      name: "Chinedu Eze",
      title: "Co-Founder & CEO",
      company: "Nexus AI Africa",
      industry: "Fintech & Developer Tooling",
      goal: "raising", // 'raising' | 'investing' | 'hiring' | 'b2b'
      bio: "Building high-throughput payment and infrastructure primitives for African digital economies."
    };

    this.radarMatches = [
      {
        id: "m-01",
        name: "Dr. Kemi Balogun",
        role: "Partner @ Ventures Platform",
        location: "Lagos / London",
        avatar: "KB",
        category: "investor",
        baseScore: 98,
        intent: "Looking to deploy seed capital ($250k - $1M) into African AI infrastructure & developer tooling.",
        icebreaker: "Ask Dr. Kemi about Ventures Platform's recent thesis on offline-first agentic infrastructure."
      },
      {
        id: "m-02",
        name: "Tariq Al-Mansoor",
        role: "Head of AI Engineering @ Mono",
        location: "Lagos, Nigeria",
        avatar: "TA",
        category: "engineer",
        baseScore: 94,
        intent: "Architecting high-concurrency payment routing and low-latency fraud detection pipelines.",
        icebreaker: "Ask Tariq how Mono handles transaction state machines during intermittent telecom drops."
      },
      {
        id: "m-03",
        name: "Folake Oladipo",
        role: "Founder & CEO @ HealthStack",
        location: "Abuja, Nigeria",
        avatar: "FO",
        category: "founder",
        baseScore: 91,
        intent: "Scaling B2B enterprise hospital systems and hiring senior distributed systems engineers.",
        icebreaker: "Ask Folake about her experience navigating enterprise compliance and multi-market expansion."
      },
      {
        id: "m-04",
        name: "Ibrahim Danjuma",
        role: "VP of Product @ Kuda",
        location: "Lagos / Cape Town",
        avatar: "ID",
        category: "product",
        baseScore: 89,
        intent: "Looking to partner with next-gen event platforms for embedded consumer banking and split-pay savings.",
        icebreaker: "Ask Ibrahim about embedded banking APIs and biometric authentication UX."
      }
    ];

    this.selectedMatchForMeeting = null;
    this.selectedTimeSlot = "10:45 AM (Coffee Break)";

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

  setUserGoal(goalKey) {
    this.userProfile.goal = goalKey;
    document.querySelectorAll('.radar-goal-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.goal === goalKey);
    });
    this.renderRadarMatches();
    if (window.gathrApp) {
      const goalLabels = {
        'raising': 'Raising Seed Round',
        'investing': 'Sourcing Deals to Fund',
        'hiring': 'Hiring Senior Tech Leaders',
        'b2b': 'B2B Commercial Partnerships'
      };
      window.gathrApp.showToast(`🎯 Intent updated: "${goalLabels[goalKey]}". Match scores recalculated.`);
    }
  }

  computeScore(match) {
    let score = match.baseScore;
    if (this.userProfile.goal === 'raising' && match.category === 'investor') score = 99;
    else if (this.userProfile.goal === 'hiring' && match.category === 'engineer') score = 98;
    else if (this.userProfile.goal === 'investing' && match.category === 'founder') score = 97;
    else if (this.userProfile.goal === 'b2b' && match.category === 'product') score = 96;
    return `${score}% Match`;
  }

  renderRadarMatches() {
    const grid = document.getElementById('radar-matches-grid');
    if (!grid) return;

    grid.innerHTML = this.radarMatches.map(m => {
      const matchScore = this.computeScore(m);
      return `
        <div class="radar-match-card">
          <div class="radar-match-header">
            <div class="match-avatar-info">
              <div class="match-avatar">${m.avatar}</div>
              <div>
                <div style="font-weight: 700; font-size: 1.1rem; color: #FFF;">${m.name}</div>
                <div style="font-size: 0.8rem; color: var(--brand-orange-light);">${m.role}</div>
              </div>
            </div>
            <span class="match-score-badge">${matchScore}</span>
          </div>

          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.5rem;">
            <strong style="color: var(--text-dim); text-transform: uppercase; font-size: 0.7rem;">Stated Goal:</strong> ${m.intent}
          </div>

          <div class="match-icebreaker-box">
            <strong style="color: var(--brand-orange); display: block; font-size: 0.75rem; text-transform: uppercase; margin-bottom: 0.2rem;">AI Icebreaker Prompt:</strong>
            "${m.icebreaker}"
          </div>

          <div style="display: flex; gap: 0.5rem; margin-top: 1rem;">
            <button class="btn btn-secondary btn-sm" style="flex: 1;" onclick="gathrRadar.tapConnect('${m.id}', '${m.name}')">
              Swap NFC Badge
            </button>
            <button class="btn btn-primary btn-sm" style="flex: 1;" onclick="gathrRadar.openMeetingModal('${m.id}')">
              Book 1-on-1 Sync
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  tapConnect(matchId, name) {
    if (window.gathrApp) {
      window.gathrApp.showToast(`✨ Digital contact badge exchanged with ${name}! Saved to your GATHR Network.`);
    }
  }

  openMeetingModal(matchId) {
    const match = this.radarMatches.find(m => m.id === matchId);
    if (!match) return;
    this.selectedMatchForMeeting = match;

    const modal = document.getElementById('meeting-scheduler-modal');
    const nameEl = document.getElementById('meeting-modal-attendee-name');
    const roleEl = document.getElementById('meeting-modal-attendee-role');

    if (nameEl) nameEl.innerText = match.name;
    if (roleEl) roleEl.innerText = match.role;
    if (modal) modal.style.display = 'flex';
  }

  closeMeetingModal() {
    const modal = document.getElementById('meeting-scheduler-modal');
    if (modal) modal.style.display = 'none';
  }

  selectMeetingSlot(timeStr, btn) {
    this.selectedTimeSlot = timeStr;
    document.querySelectorAll('.time-slot-btn').forEach(b => b.classList.remove('selected'));
    if (btn) btn.classList.add('selected');
  }

  confirmMeeting() {
    if (!this.selectedMatchForMeeting) return;
    this.closeMeetingModal();
    if (window.gathrApp) {
      window.gathrApp.showToast(`🤝 1-on-1 meeting confirmed with ${this.selectedMatchForMeeting.name} at ${this.selectedTimeSlot} (VIP Networking Lounge)! Added to your Run of Show.`);
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

