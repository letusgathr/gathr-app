/**
 * GATHR Authentication & Identity Engine (Attendee & Organizer Mode)
 * Supports Email Magic Link, One-Click Social Auth, Role Switching & Session Persistence
 */

class GathrAuth {
  constructor() {
    this.storageKey = 'gathr_auth_session';
    this.currentUser = this.loadSession();
    this.currentMode = 'signin'; // 'signin' | 'register'
    this.selectedRole = 'organizer'; // 'organizer' | 'attendee'
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
        window.gathrApp.showToast("🔒 Organizer Workspace: Sign in or register to access Creator Studio.");
      }
    }
  }

  promptSwitchToOrganizer() {
    this.openModal('register', 'organizer');
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast("⚡ Set up your Organizer brand to start publishing events and tracking sales.");
    }
  }

  handleHostEventClick() {
    if (this.isOrganizer()) {
      if (window.gathrEventWizard) {
        window.gathrEventWizard.openWizard();
      }
    } else {
      this.openModal('register', 'organizer');
      if (window.gathrApp && window.gathrApp.showToast) {
        window.gathrApp.showToast("👋 Welcome event host! Sign in or register to publish events and manage ticket tiers.");
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

  openModal(mode = 'signin', role = 'organizer') {
    this.currentMode = mode;
    this.selectedRole = role;
    this.updateModalUI();
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = 'flex';
    }
  }

  closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  switchMode(mode) {
    this.currentMode = mode;
    this.updateModalUI();
  }

  switchRole(role) {
    this.selectedRole = role;
    this.updateModalUI();
  }

  updateModalUI() {
    const isRegister = this.currentMode === 'register';
    const isOrganizer = this.selectedRole === 'organizer';

    // Update main mode tabs
    const signinTab = document.getElementById('auth-tab-signin');
    const registerTab = document.getElementById('auth-tab-register');
    if (signinTab) signinTab.classList.toggle('active', !isRegister);
    if (registerTab) registerTab.classList.toggle('active', isRegister);

    // Update role buttons
    const roleAttendee = document.getElementById('auth-role-attendee');
    const roleOrganizer = document.getElementById('auth-role-organizer');
    if (roleAttendee) roleAttendee.classList.toggle('active', !isOrganizer);
    if (roleOrganizer) roleOrganizer.classList.toggle('active', isOrganizer);

    // Toggle fields specific to Registration or Organizer
    const orgField = document.getElementById('auth-org-field');
    if (orgField) {
      orgField.style.display = (isRegister || isOrganizer) ? 'block' : 'none';
    }

    const nameField = document.getElementById('auth-name-field');
    if (nameField) {
      nameField.style.display = isRegister ? 'block' : 'none';
    }

    const titleEl = document.getElementById('auth-modal-title');
    if (titleEl) {
      if (isRegister) {
        titleEl.textContent = isOrganizer ? 'Create Organizer Account' : 'Create Attendee Account';
      } else {
        titleEl.textContent = isOrganizer ? 'Organizer Portal Sign In' : 'Attendee Sign In';
      }
    }

    const submitBtn = document.getElementById('auth-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = isRegister 
        ? (isOrganizer ? 'Create Organizer Workspace' : 'Create Attendee Account')
        : 'Sign In with Magic Link';
    }
  }

  handleSocialAuth(provider) {
    const isOrganizer = this.selectedRole === 'organizer';
    const name = isOrganizer ? 'LiveNation Africa' : 'Chinedu Eze';
    const email = isOrganizer ? 'events@livenation.africa' : 'chinedu@gmail.com';

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: this.selectedRole,
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

  quickFillDemo(role = 'organizer') {
    const emailInput = document.getElementById('auth-email-input');
    const nameInput = document.getElementById('auth-name-input');
    const orgInput = document.getElementById('auth-org-input');

    this.switchRole(role);

    if (role === 'organizer') {
      if (emailInput) emailInput.value = 'organizer@letusgather.online';
      if (nameInput) nameInput.value = 'Sarah & Tunde Ventures';
      if (orgInput) orgInput.value = 'Mainland Block Party & LiveNation';
    } else {
      if (emailInput) emailInput.value = 'attendee@gathr.app';
      if (nameInput) nameInput.value = 'Chinedu Eze';
      if (orgInput) orgInput.value = '';
    }
  }

  handleSubmit(e) {
    if (e) e.preventDefault();

    const emailInput = document.getElementById('auth-email-input');
    const nameInput = document.getElementById('auth-name-input');
    const orgInput = document.getElementById('auth-org-input');

    const email = emailInput ? emailInput.value.trim() : '';
    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    const name = (nameInput && nameInput.value.trim()) ? nameInput.value.trim() : (this.selectedRole === 'organizer' ? 'Event Organizer' : 'Attendee');
    const org = (orgInput && orgInput.value.trim()) ? orgInput.value.trim() : (this.selectedRole === 'organizer' ? 'GATHR Creator Studio' : null);

    const user = {
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: name,
      email: email,
      role: this.selectedRole,
      provider: 'email',
      organization: org,
      avatar: this.selectedRole === 'organizer' ? '🏢' : '👤',
      signedInAt: new Date().toLocaleTimeString()
    };

    this.saveSession(user);
    this.closeModal();

    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`🎉 Welcome, ${user.name}! Authenticated as ${user.role === 'organizer' ? 'Organizer' : 'Attendee'}.`);
    }

    if (user.role === 'organizer' && window.gathrApp) {
      window.gathrApp.switchView('organizer');
    }
  }

  signOut() {
    const oldName = this.currentUser ? this.currentUser.name : 'User';
    this.saveSession(null);
    if (window.gathrApp && window.gathrApp.showToast) {
      window.gathrApp.showToast(`Signed out of GATHR session (${oldName})`);
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
        <button class="utility-select" onclick="gathrAuth.openModal('signin')" style="display: inline-flex; align-items: center; gap: 0.45rem; padding: 0.28rem 0.85rem; font-weight: 700; background: rgba(255, 255, 255, 0.08); border-color: rgba(255, 255, 255, 0.2);">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Sign In / Register</span>
        </button>
      `;
    } else {
      const u = this.currentUser;
      const isOrg = u.role === 'organizer';
      const displayName = u.organization || u.name;

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
          <div id="auth-dropdown-menu" style="display: none; position: absolute; top: calc(100% + 8px); right: 0; background: rgba(18, 18, 24, 0.95); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; width: 220px; box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6); padding: 0.5rem; z-index: 250;">
            <div style="padding: 0.5rem 0.65rem; border-bottom: 1px solid rgba(255, 255, 255, 0.08); margin-bottom: 0.4rem;">
              <strong style="color: #FFF; font-size: 0.8rem; display: block;">${u.name}</strong>
              <span style="color: var(--text-dim); font-size: 0.7rem;">${u.email}</span>
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
