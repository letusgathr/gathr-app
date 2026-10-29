/**
 * GATHR Authentication & Identity Engine (Simplistic Eventbrite Pattern)
 * Attendee First • Email OR Phone Number Support • One-Time Code OTP
 */

class GathrAuth {
  constructor() {
    this.storageKey = 'gathr_auth_session';
    this.currentUser = this.loadSession();
    this.currentMode = 'signin';
    this.selectedRole = 'attendee'; // Attendee is FIRST & default
    this.passwordMode = false;
    this.currentScreen = 'main'; // 'main' | 'finder' | 'otp'
    this.pendingIdentifier = '';
  }

  init() {
    this.renderHeader();
    this.syncRoleUI();
  }

  isOrganizer() {
    return !!(this.currentUser && this.currentUser.role === 'organizer');
  }

  syncRoleUI() {
    const isOrg = this.isOrganizer();
    if (document.body) {
      document.body.classList.toggle('role-organizer', isOrg);
    }
    document.querySelectorAll('.organizer-nav-item').forEach(el => {
      el.style.display = isOrg ? 'flex' : 'none';
    });
  }

  promptOrganizerStudio() {
    if (this.isOrganizer()) {
      if (window.gathrApp) {
        window.gathrApp.switchView('organizer');
      }
    } else {
      this.openModal('signin', 'organizer');
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast("🔒 Organizer Workspace: Sign in to access Creator Studio.");
      }
    }
  }

  promptSwitchToOrganizer() {
    this.openModal('signin', 'organizer');
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast("⚡ Set up or access your Organizer Workspace.");
    }
  }

  handleHostEventClick() {
    if (this.isOrganizer()) {
      if (window.gathrEventWizard) {
        window.gathrEventWizard.openWizard();
      }
    } else {
      this.openModal('signin', 'organizer');
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast("👋 Welcome event host! Sign in with your organizer account to publish gatherings.");
      }
    }
  }

  loadSession() {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Could not read auth session from localStorage', e);
    }
    return null;
  }

  saveSession(user) {
    this.currentUser = user;
    try {
      if (user) {
        localStorage.setItem(this.storageKey, JSON.stringify(user));
      } else {
        localStorage.removeItem(this.storageKey);
      }
    } catch (e) {
      console.warn('Could not save auth session to localStorage', e);
    }
    this.renderHeader();
    this.syncRoleUI();
  }

  // Open Modal - defaults strictly to ATTENDEE first
  openModal(mode = 'signin', role = 'attendee') {
    this.currentMode = mode;
    this.selectedRole = role;
    this.passwordMode = false;
    this.showMainScreen();
    this.updateModalUI();

    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = 'flex';
      setTimeout(() => {
        const input = document.getElementById('auth-identifier-input');
        if (input) input.focus();
      }, 100);
    }
  }

  closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  switchRole(role) {
    this.selectedRole = role;
    this.updateModalUI();
  }

  toggleOrganizerMode() {
    this.selectedRole = (this.selectedRole === 'attendee') ? 'organizer' : 'attendee';
    this.updateModalUI();
  }

  togglePasswordMode() {
    this.passwordMode = !this.passwordMode;
    const pwdField = document.getElementById('auth-password-field');
    const submitBtn = document.getElementById('auth-submit-btn');
    const toggleBtn = document.getElementById('auth-password-toggle-btn');

    if (pwdField) {
      pwdField.style.display = this.passwordMode ? 'block' : 'none';
      if (this.passwordMode) {
        const pwdInput = document.getElementById('auth-password-input');
        if (pwdInput) pwdInput.focus();
      }
    }

    if (submitBtn) {
      submitBtn.textContent = this.passwordMode ? 'Sign In' : 'Continue with one time code';
    }

    if (toggleBtn) {
      toggleBtn.textContent = this.passwordMode ? 'Continue with one-time code instead' : 'Continue with password instead';
    }
  }

  showMainScreen() {
    this.currentScreen = 'main';
    const mainScreen = document.getElementById('auth-main-screen');
    const finderScreen = document.getElementById('auth-finder-screen');
    const otpScreen = document.getElementById('auth-otp-screen');

    if (mainScreen) mainScreen.style.display = 'block';
    if (finderScreen) finderScreen.style.display = 'none';
    if (otpScreen) otpScreen.style.display = 'none';
  }

  openTicketFinder() {
    this.currentScreen = 'finder';
    const mainScreen = document.getElementById('auth-main-screen');
    const finderScreen = document.getElementById('auth-finder-screen');
    const otpScreen = document.getElementById('auth-otp-screen');

    if (mainScreen) mainScreen.style.display = 'none';
    if (finderScreen) finderScreen.style.display = 'block';
    if (otpScreen) otpScreen.style.display = 'none';

    const finderInput = document.getElementById('auth-finder-input');
    const idInput = document.getElementById('auth-identifier-input');
    if (finderInput) {
      if (idInput && idInput.value.trim()) {
        finderInput.value = idInput.value.trim();
      }
      setTimeout(() => finderInput.focus(), 80);
    }
  }

  showOtpScreen(identifier) {
    this.currentScreen = 'otp';
    this.pendingIdentifier = identifier;

    const mainScreen = document.getElementById('auth-main-screen');
    const finderScreen = document.getElementById('auth-finder-screen');
    const otpScreen = document.getElementById('auth-otp-screen');
    const promptText = document.getElementById('auth-otp-prompt-text');

    if (mainScreen) mainScreen.style.display = 'none';
    if (finderScreen) finderScreen.style.display = 'none';
    if (otpScreen) otpScreen.style.display = 'block';

    const isPhone = !identifier.includes('@');
    if (promptText) {
      promptText.innerHTML = `We sent a 6-digit verification code to <strong>${identifier}</strong> via ${isPhone ? 'SMS / WhatsApp' : 'one-time code'}.`;
    }

    const otpInput = document.getElementById('auth-otp-input');
    if (otpInput) {
      otpInput.value = '748201'; // Pre-filled instant test code for effortless verification
      setTimeout(() => otpInput.focus(), 80);
    }

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`📱 Verification code sent to ${identifier} (Code: 748201)`);
    }
  }

  updateModalUI() {
    const isOrganizer = this.selectedRole === 'organizer';

    // Role tabs (Attendee is first)
    const roleAttendee = document.getElementById('auth-role-attendee');
    const roleOrganizer = document.getElementById('auth-role-organizer');
    if (roleAttendee) roleAttendee.classList.toggle('active', !isOrganizer);
    if (roleOrganizer) roleOrganizer.classList.toggle('active', isOrganizer);

    // Organization Brand Field (only shown if Organizer)
    const orgField = document.getElementById('auth-org-field');
    if (orgField) {
      orgField.style.display = isOrganizer ? 'block' : 'none';
    }

    // Name field
    const nameField = document.getElementById('auth-name-field');
    if (nameField) {
      nameField.style.display = isOrganizer ? 'block' : 'none';
    }

    // Subtitle prompt
    const promptEl = document.getElementById('auth-sub-prompt');
    if (promptEl) {
      promptEl.textContent = isOrganizer
        ? "What's your organizer email or phone?"
        : "What’s your email or phone number?";
    }

    // Switch link at bottom
    const toggleBtn = document.getElementById('auth-organizer-toggle-btn');
    if (toggleBtn) {
      toggleBtn.innerHTML = isOrganizer
        ? `← <span style="color: #FF5500; text-decoration: underline;">Back to Attendee Portal</span>`
        : `Host an event? <span style="color: #FF5500; text-decoration: underline;">Switch to Organizer Studio</span>`;
    }
  }

  handleSubmit(e) {
    if (e) e.preventDefault();

    const idInput = document.getElementById('auth-identifier-input');
    const nameInput = document.getElementById('auth-name-input');
    const orgInput = document.getElementById('auth-org-input');
    const pwdInput = document.getElementById('auth-password-input');

    const identifier = idInput ? idInput.value.trim() : '';
    if (!identifier) {
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast('⚠️ Please enter your email address or phone number.');
      } else {
        alert('Please enter your email address or phone number.');
      }
      return;
    }

    // Determine type: Email or Phone
    const isEmail = identifier.includes('@');
    const isPhone = !isEmail && /[\d\s+\-()]{6,}/.test(identifier);

    if (!isEmail && !isPhone) {
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast('⚠️ Please enter a valid email or phone number (+234...).');
      } else {
        alert('Please enter a valid email address or phone number.');
      }
      return;
    }

    // If not in password mode, trigger clean OTP screen
    if (!this.passwordMode) {
      this.showOtpScreen(identifier);
      return;
    }

    // Password mode direct authentication
    this.executeSignIn(identifier, 'password');
  }

  handleOtpSubmit(e) {
    if (e) e.preventDefault();
    const otpInput = document.getElementById('auth-otp-input');
    const code = otpInput ? otpInput.value.trim() : '';

    if (!code || code.length < 4) {
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast('⚠️ Please enter the one-time code sent to your phone/email.');
      }
      return;
    }

    this.executeSignIn(this.pendingIdentifier || '08012345678', 'otp');
  }

  resendOtp() {
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`📲 Code resent to ${this.pendingIdentifier || 'your phone/email'}! (Code: 748201)`);
    }
  }

  executeSignIn(identifier, provider = 'otp') {
    const nameInput = document.getElementById('auth-name-input');
    const orgInput = document.getElementById('auth-org-input');

    const isEmail = identifier.includes('@');
    const isOrganizer = this.selectedRole === 'organizer';

    let formattedName = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : '';
    if (!formattedName) {
      if (isOrganizer) {
        formattedName = 'Event Organizer';
      } else if (isEmail) {
        const username = identifier.split('@')[0];
        formattedName = username.charAt(0).toUpperCase() + username.slice(1);
      } else {
        formattedName = `Passholder (${identifier})`;
      }
    }

    const org = (orgInput && orgInput.value.trim()) ? orgInput.value.trim() : (isOrganizer ? 'GATHR Creator Studio' : null);

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: formattedName,
      identifier: identifier,
      email: isEmail ? identifier : null,
      phone: !isEmail ? identifier : null,
      role: this.selectedRole,
      provider: provider,
      organization: org,
      avatar: isOrganizer ? '🏢' : '👤',
      signedInAt: new Date().toLocaleTimeString()
    };

    this.saveSession(user);
    this.closeModal();

    const contactType = isEmail ? 'email' : 'phone';
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`🎉 Welcome, ${user.name}! Verified via ${contactType} (${identifier}).`);
    }

    // Role-dependent routing
    if (user.role === 'organizer') {
      if (window.gathrApp) {
        window.gathrApp.switchView('organizer');
      }
    } else {
      // For Attendees: check if there's an active ticket, otherwise explore
      if (window.gathrApp && window.gathrApp.userTicket) {
        window.gathrApp.switchView('ticket');
        window.gathrApp.renderUserTicket();
      }
    }
  }

  handleSocialAuth(provider) {
    const isOrganizer = this.selectedRole === 'organizer';
    const name = isOrganizer ? 'LiveNation Africa' : 'Chinedu Eze';
    const email = isOrganizer ? 'events@livenation.africa' : 'chinedu@gmail.com';
    const phone = isOrganizer ? '+234 803 100 2000' : '+234 801 234 5678';

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name,
      identifier: provider === 'WhatsApp' ? phone : email,
      email: provider === 'WhatsApp' ? null : email,
      phone: provider === 'WhatsApp' ? phone : '+234 801 234 5678',
      role: this.selectedRole, // Defaults to 'attendee'
      provider: provider,
      organization: isOrganizer ? 'LiveNation Africa' : null,
      avatar: isOrganizer ? '🏢' : '👤',
      signedInAt: new Date().toLocaleTimeString()
    };

    this.saveSession(user);
    this.closeModal();

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`✨ Signed in via ${provider} as ${user.role === 'organizer' ? 'Event Organizer' : 'Attendee'} (${user.name})`);
    }

    if (user.role === 'organizer' && window.gathrApp) {
      window.gathrApp.switchView('organizer');
    }
  }

  handleTicketFinderSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('auth-finder-input');
    const contact = input ? input.value.trim() : '';

    if (!contact) {
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast('⚠️ Please enter your phone number or email.');
      }
      return;
    }

    // Ensure user session exists for this contact
    if (!this.currentUser) {
      this.executeSignIn(contact, 'ticket-lookup');
    } else {
      this.closeModal();
    }

    // Populate or retrieve ticket pass
    if (window.gathrApp) {
      if (!window.gathrApp.userTicket) {
        const isPhone = !contact.includes('@');
        window.gathrApp.userTicket = {
          event: window.GATHR_EVENTS ? window.GATHR_EVENTS[0] : null,
          tier: { id: 't1-vip', name: 'Executive VIP Pass' },
          attendeeName: isPhone ? `Attendee (${contact})` : 'Chinedu Eze',
          attendeeEmail: isPhone ? null : contact,
          attendeePhone: isPhone ? contact : '+234 801 234 5678',
          ticketCode: `GTHR-VIP-${Math.floor(1000 + Math.random() * 9000)}`,
          orderRef: `GTHR-ORD-${Date.now() % 1000000}`,
          purchaseDate: 'Verified',
          gateway: 'PAYSTACK',
          signatureVerified: true
        };
      }
      window.gathrApp.switchView('ticket');
      window.gathrApp.renderUserTicket();
      if (window.gathrApp.showToast) {
        window.gathrApp.showToast(`🎟️ Found active digital pass registered to ${contact}!`);
      }
    }
  }

  signOut() {
    const oldName = this.currentUser ? this.currentUser.name : 'User';
    this.saveSession(null);
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`Signed out of GATHR (${oldName})`);
    }
    if (window.gathrApp) {
      window.gathrApp.switchView('explore');
    }
  }

  renderHeader() {
    const container = document.getElementById('auth-header-container');
    if (!container) return;

    if (!this.currentUser) {
      container.innerHTML = `
        <button class="utility-select" onclick="gathrAuth.openModal('signin', 'attendee')" style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.28rem 0.85rem; font-weight: 700; background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Sign In / Get Tickets</span>
        </button>
      `;
    } else {
      const u = this.currentUser;
      const isOrg = u.role === 'organizer';
      const displayName = u.organization || u.name;
      const contactDisplay = u.phone || u.email || u.identifier || '';

      container.innerHTML = `
        <div style="position: relative; display: inline-flex; align-items: center;">
          <div class="user-chip-btn" onclick="gathrAuth.toggleProfileDropdown()" style="display: inline-flex; align-items: center; gap: 0.5rem; background: rgba(255, 85, 0, 0.15); border: 1px solid rgba(255, 85, 0, 0.35); padding: 0.25rem 0.75rem; border-radius: 9999px; cursor: pointer;">
            <span style="font-size: 0.9rem;">${u.avatar || (isOrg ? '🏢' : '👤')}</span>
            <span style="color: #FFF; font-weight: 700; font-size: 0.76rem; max-width: 140px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${displayName}
            </span>
            <span class="badge ${isOrg ? 'badge-orange' : 'badge-green'}" style="font-size: 0.62rem; padding: 0.05rem 0.4rem; text-transform: uppercase;">
              ${isOrg ? 'Organizer' : 'Passholder'}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </div>

          <!-- Dropdown Menu -->
          <div id="auth-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 8px); right: 0; background: rgba(18, 18, 24, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; width: 230px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6); padding: 0.5rem; z-index: 250;">
            <div style="padding: 0.5rem 0.65rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 0.4rem;">
              <strong style="color: #FFF; font-size: 0.8rem; display: block;">${u.name}</strong>
              <span style="color: var(--text-dim); font-size: 0.7rem;">${contactDisplay}</span>
            </div>

            ${isOrg ? `
              <button onclick="gathrApp.switchView('organizer'); gathrAuth.toggleProfileDropdown();" style="width: 100%; text-align: left; background: none; border: none; color: #FFF; padding: 0.5rem 0.65rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background='rgba(255,85,0,0.15)'" onmouseout="this.style.background='none'">
                <span>📊</span> Organizer Studio
              </button>
              <button onclick="gathrApp.switchView('scanner'); gathrAuth.toggleProfileDropdown();" style="width: 100%; text-align: left; background: none; border: none; color: #FFF; padding: 0.5rem 0.65rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background='rgba(255,85,0,0.15)'" onmouseout="this.style.background='none'">
                <span>📱</span> Door Scanner HUD
              </button>
              <button onclick="gathrEventWizard.openWizard(); gathrAuth.toggleProfileDropdown();" style="width: 100%; text-align: left; background: none; border: none; color: #FFF; padding: 0.5rem 0.65rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background='rgba(255,85,0,0.15)'" onmouseout="this.style.background='none'">
                <span>➕</span> Create New Event
              </button>
            ` : `
              <button onclick="gathrApp.switchView('ticket'); gathrAuth.toggleProfileDropdown();" style="width: 100%; text-align: left; background: none; border: none; color: #FFF; padding: 0.5rem 0.65rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background='rgba(255,85,0,0.15)'" onmouseout="this.style.background='none'">
                <span>🎟️</span> My Digital Passes
              </button>
              <button onclick="gathrAuth.promptSwitchToOrganizer(); gathrAuth.toggleProfileDropdown();" style="width: 100%; text-align: left; background: none; border: none; color: var(--brand-orange-light); padding: 0.5rem 0.65rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background='rgba(255,85,0,0.15)'" onmouseout="this.style.background='none'">
                <span>⚡</span> Switch to Organizer Mode
              </button>
            `}

            <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); margin: 0.4rem 0;"></div>

            <button onclick="gathrAuth.signOut(); gathrAuth.toggleProfileDropdown();" style="width: 100%; text-align: left; background: none; border: none; color: #FF5252; padding: 0.5rem 0.65rem; font-size: 0.8rem; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 0.5rem;" onmouseover="this.style.background='rgba(255,82,82,0.15)'" onmouseout="this.style.background='none'">
              <span>🚪</span> Sign Out
            </button>
          </div>
        </div>
      `;
    }
  }

  toggleProfileDropdown() {
    const menu = document.getElementById('auth-dropdown-menu');
    if (!menu) return;
    menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
  }
}

const gathrAuth = new GathrAuth();
window.gathrAuth = gathrAuth;
document.addEventListener('DOMContentLoaded', () => {
  gathrAuth.init();
});

// Close profile dropdown on click outside
document.addEventListener('click', (e) => {
  const menu = document.getElementById('auth-dropdown-menu');
  const chip = document.querySelector('.user-chip-btn');
  if (menu && menu.style.display === 'block' && chip && !chip.contains(e.target) && !menu.contains(e.target)) {
    menu.style.display = 'none';
  }
});
