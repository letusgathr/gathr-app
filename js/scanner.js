/**
 * GATHR Gate Scanner Engine: Camera Viewfinder, Web Audio Synthesizer, & Atomic Check-in
 */

class GateScanner {
  constructor() {
    this.audioCtx = null;
    this.checkedInMap = new Map();
    this.scanHistory = [];
    this.totalScans = 184;
    this.capacity = 500;
    this.currentGate = "Gate 1 (VIP & Fast-Track)";
    this.cameraActive = false;
    this.stream = null;
    
    // Seed already checked-in tickets
    this.checkedInMap.set("GTHR-VIP-9021", {
      name: "Adewale Bello",
      tier: "Executive VIP Pass",
      checkInTime: "09:14 AM",
      gate: "Gate 1 (VIP & Fast-Track)"
    });
    this.checkedInMap.set("GTHR-REG-3419", {
      name: "Ngozi Chukwu",
      tier: "Standard Delegate",
      checkInTime: "09:22 AM",
      gate: "Gate 3 Main"
    });
  }

  initAudio() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // Synthesize Melodic Success Chime (880Hz -> 1320Hz)
  playSuccessSound() {
    this.initAudio();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const osc1 = this.audioCtx.createOscillator();
    const osc2 = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(880, now);
    osc1.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(440, now);
    osc2.frequency.exponentialRampToValueAtTime(880, now + 0.15);

    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.4);
    osc2.stop(now + 0.4);

    if (navigator.vibrate) navigator.vibrate([60, 40, 60]);
  }

  // Synthesize Warning Double Buzz (220Hz / 180Hz)
  playDuplicateSound() {
    this.initAudio();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.setValueAtTime(180, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.4);

    if (navigator.vibrate) navigator.vibrate([150, 100, 150]);
  }

  // Synthesize Sharp Error Alert (440Hz saw alert)
  playInvalidSound() {
    this.initAudio();
    if (!this.audioCtx) return;
    const now = this.audioCtx.currentTime;

    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(330, now + 0.1);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(now);
    osc.stop(now + 0.35);

    if (navigator.vibrate) navigator.vibrate(300);
  }

  /**
   * Process a scanned ticket code
   */
  processTicketCode(ticketCode) {
    const overlay = document.getElementById('scanner-validation-overlay');
    const titleEl = document.getElementById('validation-result-title');
    const subtitleEl = document.getElementById('validation-result-subtitle');
    const iconEl = document.getElementById('validation-result-icon');
    
    overlay.className = 'validation-overlay active';

    // 1. Check if already checked in
    if (this.checkedInMap.has(ticketCode)) {
      const prior = this.checkedInMap.get(ticketCode);
      overlay.classList.add('state-duplicate');
      this.playDuplicateSound();
      
      titleEl.innerText = "ALREADY CHECKED IN";
      subtitleEl.innerHTML = `<strong>${prior.name}</strong> (${prior.tier})<br>First scanned at <strong>${prior.checkInTime}</strong> via <strong>${prior.gate}</strong>. Duplicate entry denied.`;
      iconEl.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
      return;
    }

    // 2. Check if valid unrecognized or corrupt
    if (!ticketCode.startsWith("GTHR-")) {
      overlay.classList.add('state-invalid');
      this.playInvalidSound();

      titleEl.innerText = "INVALID TICKET CODE";
      subtitleEl.innerHTML = `Unrecognized signature: <code>${ticketCode}</code>.<br>This QR pass is either forged or corrupted.`;
      iconEl.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;
      return;
    }

    // 3. Valid Ticket!
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isVip = ticketCode.includes("VIP");
    const isSquad = ticketCode.includes("SQD");
    const tierName = isVip ? "Executive VIP Pass" : (isSquad ? "Squad Pass" : "Builder (Early Bird)");
    const attendeeName = isVip ? "Chinedu Eze" : (isSquad ? "Seyi Adeleke" : "Tolani Oladipo");

    this.checkedInMap.set(ticketCode, {
      name: attendeeName,
      tier: tierName,
      checkInTime: timeStr,
      gate: this.currentGate
    });

    this.totalScans++;
    this.updateHudCounts();
    this.playSuccessSound();

    overlay.classList.add('state-valid');
    titleEl.innerText = "TICKET VALID — ENTRY APPROVED";
    subtitleEl.innerHTML = `Welcome, <strong>${attendeeName}</strong>!<br>Tier: <strong>${tierName}</strong> • Fast-Track Admitted.`;
    iconEl.innerHTML = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`;

    // Add to Organizer attendee list if exists
    if (window.gathrOrganizer) {
      window.gathrOrganizer.addRecentCheckIn(attendeeName, tierName, ticketCode, timeStr);
    }
  }

  updateHudCounts() {
    const countEl = document.getElementById('hud-scanned-count');
    if (countEl) {
      countEl.innerText = `${this.totalScans} / ${this.capacity}`;
    }
  }

  dismissOverlay() {
    const overlay = document.getElementById('scanner-validation-overlay');
    if (overlay) {
      overlay.className = 'validation-overlay';
    }
  }

  async startCamera(videoElement) {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      return false;
    }
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      videoElement.srcObject = this.stream;
      this.cameraActive = true;
      return true;
    } catch (err) {
      console.warn("Camera access denied or unavailable, using simulation mode:", err);
      return false;
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.cameraActive = false;
    }
  }
}

const gathrGateScanner = new GateScanner();
