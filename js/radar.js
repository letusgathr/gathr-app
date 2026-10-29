/**
 * GATHR RADAR: Attendee Community & Event Networking Engine
 * Connects verified attendees and friends going to the same gathering.
 * Supports: Who's Going Directory, Mutual Friends, Real-time Chat,
 * 1-on-1 Coffee/Meetup Sync, and WhatsApp Squad Invites.
 */

class GathrRadar {
  constructor() {
    this.activeEventId = "gathr-event-01";
    this.activeFilter = "all"; // 'all' | 'friends' | 'vip' | 'founders' | 'open'
    this.searchQuery = "";
    this.selectedMatchForMeeting = null;
    this.selectedTimeSlot = "10:45 AM (Coffee Break)";
    this.activeChatAttendee = null;
    this.chatHistories = {};

    this.userProfile = {
      name: "Chinedu Eze",
      role: "Founder & Product Lead",
      company: "Nexus AI Africa",
      goal: "raising", // 'raising' | 'investing' | 'hiring' | 'b2b' | 'social' | 'buddy'
      visible: true
    };

    // Rich Attendee Directory per Event
    this.attendeeCommunities = {
      "gathr-event-01": [
        {
          id: "att-01",
          name: "Dr. Kemi Balogun",
          role: "Partner @ Ventures Platform",
          company: "Ventures Platform",
          location: "Lagos / London",
          avatar: "KB",
          tier: "Executive VIP Pass",
          isFriend: true,
          mutualFriends: ["Seyi Adeleke", "Adewale Bello"],
          category: "investor",
          intent: "Looking to deploy seed capital ($250k - $1M) into African AI infrastructure & developer tooling.",
          icebreaker: "Ask Dr. Kemi about Ventures Platform's thesis on offline-first agentic infrastructure."
        },
        {
          id: "att-02",
          name: "Tariq Al-Mansoor",
          role: "Head of AI Engineering @ Mono",
          company: "Mono",
          location: "Lagos, Nigeria",
          avatar: "TA",
          tier: "Executive VIP Pass",
          isFriend: true,
          mutualFriends: ["Chinedu Eze"],
          category: "engineer",
          intent: "Architecting high-concurrency payment routing and low-latency fraud detection pipelines.",
          icebreaker: "Ask Tariq how Mono handles transaction state machines during intermittent telecom drops."
        },
        {
          id: "att-03",
          name: "Folake Oladipo",
          role: "Founder & CEO @ HealthStack",
          company: "HealthStack",
          location: "Abuja, Nigeria",
          avatar: "FO",
          tier: "Executive VIP Pass",
          isFriend: false,
          mutualFriends: [],
          category: "founder",
          intent: "Scaling B2B enterprise hospital systems and hiring senior distributed systems engineers.",
          icebreaker: "Ask Folake about her experience navigating enterprise compliance and multi-market expansion."
        },
        {
          id: "att-04",
          name: "Seyi Adeleke",
          role: "Principal Architect @ Interswitch",
          company: "Interswitch",
          location: "Lagos, Nigeria",
          avatar: "SA",
          tier: "Builder (Early Bird)",
          isFriend: true,
          mutualFriends: ["Dr. Kemi Balogun", "Adewale Bello"],
          category: "engineer",
          intent: "Exploring autonomous payment agents and next-gen identity primitives.",
          icebreaker: "Ask Seyi about Interswitch's latest distributed ledger initiatives."
        },
        {
          id: "att-05",
          name: "Adewale Bello",
          role: "Staff Engineer @ Paystack",
          company: "Paystack",
          location: "Lagos, Nigeria",
          avatar: "AB",
          tier: "Builder (Early Bird)",
          isFriend: true,
          mutualFriends: ["Seyi Adeleke"],
          category: "engineer",
          intent: "Hacking on open payment APIs and offline TOTP turnstile integrations.",
          icebreaker: "Ask Adewale about webhook signature verification in distributed clusters."
        },
        {
          id: "att-06",
          name: "Grace Danladi",
          role: "Senior Ecosystem Editor @ Techpoint",
          company: "Techpoint Africa",
          location: "Lagos, Nigeria",
          avatar: "GD",
          tier: "Standard Delegate",
          isFriend: false,
          mutualFriends: [],
          category: "media",
          intent: "Covering emerging AI startup showcases and moderating executive fireside chats.",
          icebreaker: "Ask Grace about key tech milestones shaping West African tech in 2026."
        }
      ],
      "gathr-event-02": [
        {
          id: "att-07",
          name: "DJ Neptune & Sound Crew",
          role: "Headlining Producer & DJ",
          company: "Neptune Entertainment",
          location: "Lagos / Atlanta",
          avatar: "DN",
          tier: "VIP Beach Cabana (6 Pax)",
          isFriend: true,
          mutualFriends: ["Tunde Balogun"],
          category: "creator",
          intent: "Curating sunset Afrobeats & Amapiano soundscapes; connecting with fans and music creatives.",
          icebreaker: "Ask DJ Neptune about his upcoming summer festival playlist."
        },
        {
          id: "att-08",
          name: "Tiwa Morgan",
          role: "Creative Director @ NeonVibes",
          company: "NeonVibes",
          location: "Lagos, Nigeria",
          avatar: "TM",
          tier: "VIP Beach Deck",
          isFriend: true,
          mutualFriends: ["Amara Nwosu"],
          category: "creator",
          intent: "Rolling with our beach party squad, neon art light displays, and VIP cabana networking.",
          icebreaker: "Ask Tiwa about the interactive neon light art installations along Landmark beach."
        },
        {
          id: "att-09",
          name: "Amara Nwosu",
          role: "Fashion & Lifestyle Strategist",
          company: "Amara Studios",
          location: "Lagos, Nigeria",
          avatar: "AN",
          tier: "VIP Beach Deck",
          isFriend: true,
          mutualFriends: ["Tiwa Morgan", "Chinedu Eze"],
          category: "creator",
          intent: "Front-row festival dance vibes, sunset beach photos, and meeting creative founders.",
          icebreaker: "Ask Amara about festival style and beachfront creative collaborations."
        },
        {
          id: "att-10",
          name: "Kester Ojo",
          role: "Fintech Product Lead & Music Fan",
          company: "Kuda",
          location: "Lagos, Nigeria",
          avatar: "KO",
          tier: "General Admission",
          isFriend: false,
          mutualFriends: [],
          category: "social",
          intent: "Looking for festival squad members to hang out by the stage and chill with drinks.",
          icebreaker: "Ask Kester about his top 3 Afrobeats albums of all time."
        },
        {
          id: "att-11",
          name: "Tunde Balogun",
          role: "Co-Founder @ Mainland Block Party",
          company: "Mainland Vibes",
          location: "Lagos, Nigeria",
          avatar: "TB",
          tier: "VIP Beach Cabana (6 Pax)",
          isFriend: false,
          mutualFriends: ["DJ Neptune & Sound Crew"],
          category: "creator",
          intent: "Hosting VIP festival partners, stage logistics, and backstage artist hospitality.",
          icebreaker: "Ask Tunde about how Mainland Block Party scaled from 200 to 10,000 attendees."
        }
      ],
      "gathr-event-03": [
        {
          id: "att-12",
          name: "Marcus Thorne",
          role: "Managing Partner @ NYC Ventures",
          company: "NYC Ventures",
          location: "New York / Lagos",
          avatar: "MT",
          tier: "LP / GP Partner Pass",
          isFriend: true,
          mutualFriends: ["Dr. Kemi Balogun"],
          category: "investor",
          intent: "Allocating global institutional capital into African growth-stage tech companies.",
          icebreaker: "Ask Marcus about global LP appetite for frontier market infrastructure."
        },
        {
          id: "att-13",
          name: "Zara Bello",
          role: "Angel Syndicate Lead & Board Director",
          company: "Abuja Angel Syndicate",
          location: "Abuja, Nigeria",
          avatar: "ZB",
          tier: "LP / GP Partner Pass",
          isFriend: true,
          mutualFriends: ["Marcus Thorne"],
          category: "investor",
          intent: "Investing in fintech, agritech, and AI; connecting with high-conviction series A founders.",
          icebreaker: "Ask Zara about angel syndicate syndication across East and West Africa."
        },
        {
          id: "att-14",
          name: "David Kimani",
          role: "VP Corporate Development @ Safaricom",
          company: "Safaricom Ventures",
          location: "Nairobi, Kenya",
          avatar: "DK",
          tier: "Founder Ticket",
          isFriend: false,
          mutualFriends: [],
          category: "investor",
          intent: "Exploring cross-border telecommunications, mobile money, and Pan-African scaling.",
          icebreaker: "Ask David about M-Pesa's next-generation developer platform."
        }
      ],
      "gathr-event-04": [
        {
          id: "att-15",
          name: "Elena Rostova",
          role: "Lead Research Scientist @ AI Frontiers",
          company: "AI Frontiers NYC",
          location: "New York, USA",
          avatar: "ER",
          tier: "Executive Pass",
          isFriend: true,
          mutualFriends: ["Chinedu Eze"],
          category: "engineer",
          intent: "Connecting with frontier AI researchers and real-time model serving architects.",
          icebreaker: "Ask Elena about distributed inference across consumer GPU clusters."
        },
        {
          id: "att-16",
          name: "Liam O'Connor",
          role: "General Partner @ Hudson River Fund",
          company: "Hudson River Fund",
          location: "New York, USA",
          avatar: "LO",
          tier: "Executive Pass",
          isFriend: false,
          mutualFriends: [],
          category: "investor",
          intent: "Leading seed & Series A rounds in enterprise developer infrastructure.",
          icebreaker: "Ask Liam about venture valuations in the NYC tech ecosystem."
        }
      ]
    };

    // Squad Pass State
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

  init() {
    this.syncUserProfile();
    this.renderEventSelector();
    this.renderAttendees();
    this.renderSquadPass();
    this.renderPassAttendees();
  }

  syncUserProfile() {
    if (window.gathrAuth && window.gathrAuth.currentUser) {
      const u = window.gathrAuth.currentUser;
      this.userProfile.name = u.name || this.userProfile.name;
    }
  }

  // Switch Active Event to view attendees for
  switchActiveEvent(eventId) {
    this.activeEventId = eventId;
    this.renderEventSelector();
    this.renderAttendees();
    if (window.gathrApp && window.gathrApp.showToast) {
      const ev = (window.GATHR_EVENTS || []).find(e => e.id === eventId);
      const title = ev ? ev.title : "Event";
      window.gathrApp.showToast(`👥 Viewing attendees & friends attending: ${title}`);
    }
  }

  openEventNetworking(eventId) {
    this.activeEventId = eventId;
    if (window.gathrApp) {
      window.gathrApp.switchView('radar');
    }
    this.switchActiveEvent(eventId);
  }

  openCurrentEventNetworking() {
    const activeEvId = (window.gathrApp && window.gathrApp.userTicket && window.gathrApp.userTicket.event)
      ? window.gathrApp.userTicket.event.id
      : "gathr-event-01";
    this.openEventNetworking(activeEvId);
  }

  // Render Event Selector Dropdown
  renderEventSelector() {
    const sel = document.getElementById('radar-event-select');
    if (!sel) return;

    const events = window.GATHR_EVENTS || [];
    sel.innerHTML = events.map(e => `
      <option value="${e.id}" ${e.id === this.activeEventId ? 'selected' : ''}>
        ${e.title} (${e.city})
      </option>
    `).join('');

    sel.onchange = (e) => {
      this.switchActiveEvent(e.target.value);
    };

    // Update Event Title Banner
    const ev = events.find(e => e.id === this.activeEventId) || events[0];
    const bannerTitle = document.getElementById('radar-event-banner-title');
    const bannerMeta = document.getElementById('radar-event-banner-meta');
    if (bannerTitle && ev) bannerTitle.innerText = ev.title;
    if (bannerMeta && ev) bannerMeta.innerText = `📅 ${ev.date} • 📍 ${ev.venue}`;
  }

  setFilter(filterKey) {
    this.activeFilter = filterKey;
    document.querySelectorAll('.radar-filter-pill').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filterKey);
    });
    this.renderAttendees();
  }

  setSearchQuery(q) {
    this.searchQuery = q.trim().toLowerCase();
    this.renderAttendees();
  }

  setUserGoal(goalKey) {
    this.userProfile.goal = goalKey;
    document.querySelectorAll('.radar-goal-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.goal === goalKey);
    });
    this.renderAttendees();
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`🎯 Networking objective set to "${goalKey.toUpperCase()}". Directory match scores re-calculated.`);
    }
  }

  toggleGuestListVisibility() {
    this.userProfile.visible = !this.userProfile.visible;
    const badge = document.getElementById('radar-visibility-badge');
    if (badge) {
      badge.className = this.userProfile.visible ? 'badge badge-green' : 'badge badge-orange';
      badge.innerText = this.userProfile.visible ? 'Guest List: Visible to Attendees ✓' : 'Guest List: Incognito Mode';
    }
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(this.userProfile.visible ? '👁️ You are now visible to friends and attendees.' : '🕶️ Incognito: You are hidden from public guest list.');
    }
  }

  // Main Attendee Directory Rendering
  renderAttendees() {
    const grid = document.getElementById('radar-matches-grid');
    if (!grid) return;

    let attendees = this.attendeeCommunities[this.activeEventId] || this.attendeeCommunities["gathr-event-01"];

    // Filter by Tab
    if (this.activeFilter === 'friends') {
      attendees = attendees.filter(a => a.isFriend);
    } else if (this.activeFilter === 'vip') {
      attendees = attendees.filter(a => a.tier.toLowerCase().includes('vip'));
    } else if (this.activeFilter === 'founders') {
      attendees = attendees.filter(a => a.category === 'founder' || a.category === 'engineer');
    }

    // Search Query
    if (this.searchQuery) {
      const q = this.searchQuery;
      attendees = attendees.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.role.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.intent.toLowerCase().includes(q) ||
        (a.mutualFriends && a.mutualFriends.some(mf => mf.toLowerCase().includes(q)))
      );
    }

    // Attendee Counters
    const countEl = document.getElementById('radar-attendees-count');
    const friendsCountEl = document.getElementById('radar-friends-count');
    if (countEl) countEl.innerText = `${attendees.length} Verified Attendees`;
    if (friendsCountEl) {
      const totalFriends = (this.attendeeCommunities[this.activeEventId] || []).filter(a => a.isFriend).length;
      friendsCountEl.innerText = `${totalFriends} Mutual Friends Going`;
    }

    if (attendees.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 3rem 1rem; color: var(--text-muted);">
          <p style="font-size: 1.15rem; margin-bottom: 0.5rem;">No matching attendees found for this filter.</p>
          <button class="btn btn-secondary btn-sm" onclick="gathrRadar.setFilter('all')">Show All Attendees</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = attendees.map(a => {
      const isVip = a.tier.toLowerCase().includes('vip');
      return `
        <div class="radar-match-card">
          <div class="radar-match-header">
            <div class="match-avatar-info">
              <div class="match-avatar">${a.avatar}</div>
              <div>
                <div style="font-weight: 700; font-size: 1.05rem; color: #FFF; display: flex; align-items: center; gap: 0.4rem;">
                  <span>${a.name}</span>
                  <span title="Verified Ticket Holder" style="color: var(--accent-green); font-size: 0.85rem;">✓</span>
                </div>
                <div style="font-size: 0.8rem; color: var(--brand-orange-light);">${a.role}</div>
              </div>
            </div>
            <div>
              <span class="${isVip ? 'vip-badge' : 'badge badge-green'}" style="font-size: 0.65rem;">
                ${a.tier}
              </span>
            </div>
          </div>

          ${a.isFriend ? `
            <div style="margin-bottom: 0.6rem;">
              <span class="friend-badge">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                Friend Going With You
              </span>
              ${a.mutualFriends.length > 0 ? `<span style="font-size: 0.72rem; color: var(--text-dim); margin-left: 0.4rem;">Mutuals: ${a.mutualFriends.join(', ')}</span>` : ''}
            </div>
          ` : ''}

          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.65rem; line-height: 1.45;">
            <strong style="color: var(--text-dim); text-transform: uppercase; font-size: 0.68rem; display: block; margin-bottom: 0.15rem;">Stated Vibe / Goal:</strong>
            ${a.intent}
          </div>

          <div class="match-icebreaker-box">
            <strong style="color: var(--brand-orange); display: block; font-size: 0.72rem; text-transform: uppercase; margin-bottom: 0.2rem;">AI Conversation Starter:</strong>
            "${a.icebreaker}"
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.5rem; margin-top: 1rem;">
            <button class="btn btn-primary btn-sm" onclick="gathrRadar.openChatModal('${a.id}')" style="justify-content: center; font-size: 0.78rem;">
              💬 Say Hello
            </button>
            <button class="btn btn-secondary btn-sm" onclick="gathrRadar.openMeetingModal('${a.id}')" style="justify-content: center; font-size: 0.78rem;">
              🤝 Book Meetup
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  // Populate Attendee Preview on Digital Pass Screen
  renderPassAttendees() {
    const grid = document.getElementById('pass-event-attendees-grid');
    if (!grid) return;

    const activeEvId = (window.gathrApp && window.gathrApp.userTicket && window.gathrApp.userTicket.event)
      ? window.gathrApp.userTicket.event.id
      : "gathr-event-01";

    const attendees = (this.attendeeCommunities[activeEvId] || this.attendeeCommunities["gathr-event-01"]).slice(0, 3);

    grid.innerHTML = attendees.map(a => `
      <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--radius-md); padding: 1rem;">
        <div style="display: flex; align-items: center; gap: 0.65rem; margin-bottom: 0.65rem;">
          <div class="match-avatar" style="width: 38px; height: 38px; font-size: 0.9rem;">${a.avatar}</div>
          <div style="overflow: hidden;">
            <strong style="color: #FFF; font-size: 0.95rem; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${a.name}</strong>
            <span style="color: var(--brand-orange-light); font-size: 0.75rem; display: block;">${a.role}</span>
          </div>
        </div>
        <div style="font-size: 0.78rem; color: var(--text-muted); margin-bottom: 0.75rem; line-height: 1.4;">
          "${a.icebreaker}"
        </div>
        <button class="btn btn-secondary btn-sm btn-block" onclick="gathrRadar.openChatModal('${a.id}')" style="font-size: 0.75rem; justify-content: center;">
          💬 Say Hello & Connect
        </button>
      </div>
    `).join('');
  }

  // 1-on-1 Meeting Scheduler Modal
  openMeetingModal(attendeeId) {
    const all = Object.values(this.attendeeCommunities).flat();
    const attendee = all.find(a => a.id === attendeeId);
    if (!attendee) return;
    this.selectedMatchForMeeting = attendee;

    const modal = document.getElementById('meeting-scheduler-modal');
    const nameEl = document.getElementById('meeting-modal-attendee-name');
    const roleEl = document.getElementById('meeting-modal-attendee-role');

    if (nameEl) nameEl.innerText = attendee.name;
    if (roleEl) roleEl.innerText = attendee.role;
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
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`🤝 1-on-1 meeting confirmed with ${this.selectedMatchForMeeting.name} at ${this.selectedTimeSlot}! Venue sync notification sent via WhatsApp.`);
    }
  }

  // Direct Chat Modal
  openChatModal(attendeeId) {
    const all = Object.values(this.attendeeCommunities).flat();
    const attendee = all.find(a => a.id === attendeeId);
    if (!attendee) return;
    this.activeChatAttendee = attendee;

    const modal = document.getElementById('attendee-chat-modal');
    const nameEl = document.getElementById('chat-modal-name');
    const roleEl = document.getElementById('chat-modal-role');
    const avatarEl = document.getElementById('chat-modal-avatar');
    const messagesWrap = document.getElementById('chat-modal-messages');

    if (nameEl) nameEl.innerText = attendee.name;
    if (roleEl) roleEl.innerText = attendee.role;
    if (avatarEl) avatarEl.innerText = attendee.avatar;

    // Load or initialize conversation
    if (!this.chatHistories[attendee.id]) {
      this.chatHistories[attendee.id] = [
        {
          sender: 'them',
          text: `Hey there! Looking forward to attending! ${attendee.icebreaker}`
        }
      ];
    }

    this.renderChatMessages();
    if (modal) modal.style.display = 'flex';

    setTimeout(() => {
      const input = document.getElementById('chat-message-input');
      if (input) input.focus();
    }, 100);
  }

  closeChatModal() {
    const modal = document.getElementById('attendee-chat-modal');
    if (modal) modal.style.display = 'none';
  }

  renderChatMessages() {
    const messagesWrap = document.getElementById('chat-modal-messages');
    if (!messagesWrap || !this.activeChatAttendee) return;

    const history = this.chatHistories[this.activeChatAttendee.id] || [];
    messagesWrap.innerHTML = history.map(msg => `
      <div class="chat-msg-bubble ${msg.sender === 'me' ? 'chat-msg-outgoing' : 'chat-msg-incoming'}">
        ${msg.text}
      </div>
    `).join('');

    messagesWrap.scrollTop = messagesWrap.scrollHeight;
  }

  sendChatMessage(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chat-message-input');
    if (!input || !this.activeChatAttendee) return;

    const text = input.value.trim();
    if (!text) return;

    // Add user message
    this.chatHistories[this.activeChatAttendee.id].push({
      sender: 'me',
      text: text
    });
    input.value = '';
    this.renderChatMessages();

    // Trigger instant simulated response
    setTimeout(() => {
      if (this.activeChatAttendee) {
        this.chatHistories[this.activeChatAttendee.id].push({
          sender: 'them',
          text: `Awesome to connect, Chinedu! Let's definitely link up at the lounge or by the entrance once we arrive. I'll ping you on WhatsApp too!`
        });
        this.renderChatMessages();
      }
    }, 900);
  }

  // Invite Friends to Event Squad via WhatsApp / SMS
  shareEventInvite() {
    const events = window.GATHR_EVENTS || [];
    const ev = events.find(e => e.id === this.activeEventId) || events[0];
    const eventTitle = ev ? ev.title : "GATHR Event";
    const shareUrl = `https://letusgather.online/events/${this.activeEventId}?inviteFrom=${encodeURIComponent(this.userProfile.name)}`;
    const msg = `Hey! I'm attending "${eventTitle}" on GATHR. Join my squad and grab your pass here: ${shareUrl}`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }

    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast("📲 WhatsApp squad invite ready! Link copied to clipboard.");
    }
  }

  // Squad Pass Split-Pay
  renderSquadPass() {
    const list = document.getElementById('squad-members-list');
    if (!list) return;

    list.innerHTML = this.squadPassState.members.map(m => {
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
        if (window.gathrApp && window.gathrApp.showToast) {
          window.gathrApp.showToast("📋 Squad Split-Pay claim link copied to clipboard!");
        }
      });
    }
  }
}

const gathrRadar = new GathrRadar();
window.gathrRadar = gathrRadar;
document.addEventListener('DOMContentLoaded', () => {
  gathrRadar.init();
});
