/**
 * GATHR Native Mobile Bridge (Capacitor iOS & Android Adapter)
 * Connects web runtime to native device hardware:
 * - Native StatusBar styling (#090A0F)
 * - Native Haptics on QR Ticket Scanner verification
 * - Native Splash Screen dismissal
 * - Android Hardware Back Button navigation & modal handling
 * - Native Camera & QR reader permissions
 */

class GathrNativeBridge {
  constructor() {
    this.isNative = false;
    this.hapticsAvailable = false;
    this.backListenersAttached = false;
  }

  init() {
    // Check if running inside Capacitor native container
    this.isNative = !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform());

    console.log(`[GATHR Mobile Bridge] Platform: ${this.isNative ? window.Capacitor.getPlatform() : 'Web/PWA'}`);

    if (this.isNative) {
      document.body.classList.add('gathr-native-mobile');
      document.body.classList.add(`gathr-platform-${window.Capacitor.getPlatform()}`);
      
      this.setupStatusBar();
      this.hideSplashScreen();
      this.setupHardwareBackButton();
    }

    // Check HTML5 navigator vibration support as web fallback
    this.hapticsAvailable = 'vibrate' in navigator || (this.isNative && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics);
  }

  // Configure Native Status Bar
  async setupStatusBar() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.StatusBar) {
        const { StatusBar } = window.Capacitor.Plugins;
        await StatusBar.setStyle({ style: 'DARK' });
        await StatusBar.setBackgroundColor({ color: '#090A0F' });
        await StatusBar.setOverlaysWebView({ overlay: false });
        console.log('[GATHR Mobile Bridge] Status bar configured to #090A0F');
      }
    } catch (e) {
      console.warn('[GATHR Mobile Bridge] StatusBar setup note:', e);
    }
  }

  // Dismiss Native Splash Screen
  async hideSplashScreen() {
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.SplashScreen) {
        const { SplashScreen } = window.Capacitor.Plugins;
        setTimeout(async () => {
          await SplashScreen.hide({ fadeOutDuration: 300 });
          console.log('[GATHR Mobile Bridge] Splash screen dismissed');
        }, 350);
      }
    } catch (e) {
      console.warn('[GATHR Mobile Bridge] SplashScreen dismiss note:', e);
    }
  }

  // Trigger Tactile Haptic Vibration on Door Scanner Check-in
  async triggerScanHaptic(isSuccess = true) {
    try {
      if (this.isNative && window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Haptics) {
        const { Haptics } = window.Capacitor.Plugins;
        if (isSuccess) {
          // Success: double light pulse
          await Haptics.notification({ type: 'SUCCESS' });
        } else {
          // Error / Duplicate: heavy buzz
          await Haptics.notification({ type: 'ERROR' });
        }
        return;
      }
    } catch (e) {
      console.warn('[GATHR Mobile Bridge] Native haptic note:', e);
    }

    // Web Fallback: HTML5 Vibration API
    if ('vibrate' in navigator) {
      try {
        if (isSuccess) {
          navigator.vibrate([40, 60, 40]);
        } else {
          navigator.vibrate([180, 80, 180]);
        }
      } catch (err) {
        // Silent catch on unsupported user agents
      }
    }
  }

  // Android Hardware Back Button Handler
  setupHardwareBackButton() {
    if (this.backListenersAttached) return;
    this.backListenersAttached = true;

    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        const { App } = window.Capacitor.Plugins;
        App.addListener('backButton', () => {
          this.handleBackNavigation();
        });
      }
    } catch (e) {
      console.warn('[GATHR Mobile Bridge] Hardware back button listener note:', e);
    }
  }

  handleBackNavigation() {
    // 1. If mobile navigation drawer is open, close it
    const drawer = document.getElementById('mobile-drawer-overlay');
    if (drawer && drawer.classList.contains('open')) {
      if (window.gathrApp && typeof window.gathrApp.closeMobileMenu === 'function') {
        window.gathrApp.closeMobileMenu();
        return;
      }
    }

    // 2. If any modal is open, close it
    const openModals = [
      { id: 'attendee-chat-modal', close: () => window.gathrRadar && window.gathrRadar.closeChatModal() },
      { id: 'vendor-rfp-modal', close: () => window.gathrPlanning && window.gathrPlanning.closeRfpModal() },
      { id: 'vendor-onboarding-modal', close: () => window.gathrPlanning && window.gathrPlanning.closeVendorOnboardingModal() },
      { id: 'auth-modal', close: () => window.gathrAuth && window.gathrAuth.closeModal() },
      { id: 'legal-docs-modal', close: () => window.gathrApp && window.gathrApp.closeLegalModal() },
      { id: 'checkout-modal', close: () => window.gathrApp && window.gathrApp.closeCheckoutModal() }
    ];

    for (const m of openModals) {
      const el = document.getElementById(m.id);
      if (el && el.style.display && el.style.display !== 'none') {
        m.close();
        return;
      }
    }

    // 3. If on a secondary screen (scanner, organizer, planning, ticket, radar), return to explore
    if (window.gathrApp && window.gathrApp.currentView && window.gathrApp.currentView !== 'explore') {
      window.gathrApp.switchView('explore');
      return;
    }

    // 4. If already on explore, minimize/exit app
    try {
      if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
        window.Capacitor.Plugins.App.exitApp();
      }
    } catch (e) {
      console.log('Exit app call:', e);
    }
  }
}

// Instantiate and expose globally
window.gathrNativeBridge = new GathrNativeBridge();
