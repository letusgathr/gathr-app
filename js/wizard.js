/**
 * GATHR Event Creator Wizard & WhatsApp Bot Notification Simulator
 */

class EventWizard {
  constructor() {
    this.currentStep = 1;
    this.totalSteps = 4;
    this.formData = {
      title: "",
      category: "Tech & AI",
      description: "",
      city: "Lagos",
      venue: "",
      date: "",
      time: "",
      tierName: "General Admission",
      tierPrice: 20000,
      tierCapacity: 500,
      hostSplit: 70,
      venueSplit: 20,
      promoterSplit: 10
    };
  }

  openWizard() {
    this.currentStep = 1;
    this.updateStepDisplay();
    const modal = document.getElementById('create-event-modal');
    if (modal) modal.classList.add('active');
  }

  closeWizard() {
    const modal = document.getElementById('create-event-modal');
    if (modal) modal.classList.remove('active');
  }

  goToStep(stepNumber) {
    if (stepNumber < 1 || stepNumber > this.totalSteps) return;
    this.currentStep = stepNumber;
    this.updateStepDisplay();
  }

  nextStep() {
    if (this.currentStep === 1) {
      const title = document.getElementById('wiz-title').value.trim();
      const desc = document.getElementById('wiz-desc').value.trim();
      if (!title || !desc) {
        if (window.gathrApp) window.gathrApp.showToast("⚠️ Please enter event title and description.");
        return;
      }
      this.formData.title = title;
      this.formData.description = desc;
      this.formData.category = document.getElementById('wiz-category').value;
    } else if (this.currentStep === 2) {
      const venue = document.getElementById('wiz-venue').value.trim();
      const date = document.getElementById('wiz-date').value.trim();
      if (!venue || !date) {
        if (window.gathrApp) window.gathrApp.showToast("⚠️ Please enter venue and event date.");
        return;
      }
      this.formData.venue = venue;
      this.formData.date = date;
      this.formData.time = document.getElementById('wiz-time').value.trim() || "06:00 PM WAT";
      this.formData.city = document.getElementById('wiz-city').value;
    } else if (this.currentStep === 3) {
      const price = parseInt(document.getElementById('wiz-tier-price').value) || 20000;
      const name = document.getElementById('wiz-tier-name').value.trim() || "Standard Pass";
      const cap = parseInt(document.getElementById('wiz-tier-cap').value) || 300;
      this.formData.tierPrice = price;
      this.formData.tierName = name;
      this.formData.tierCapacity = cap;
    }

    if (this.currentStep < this.totalSteps) {
      this.goToStep(this.currentStep + 1);
    } else {
      this.publishEvent();
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.goToStep(this.currentStep - 1);
    }
  }

  updateStepDisplay() {
    for (let i = 1; i <= this.totalSteps; i++) {
      const stepEl = document.getElementById(`wiz-step-${i}`);
      const bubbleEl = document.getElementById(`step-bubble-${i}`);
      if (stepEl) stepEl.className = `wizard-form-step ${i === this.currentStep ? 'active' : ''}`;
      if (bubbleEl) {
        if (i === this.currentStep) bubbleEl.className = 'step-bubble active';
        else if (i < this.currentStep) bubbleEl.className = 'step-bubble completed';
        else bubbleEl.className = 'step-bubble';
      }
    }

    const prevBtn = document.getElementById('wiz-prev-btn');
    const nextBtn = document.getElementById('wiz-next-btn');
    if (prevBtn) prevBtn.style.visibility = this.currentStep === 1 ? 'hidden' : 'visible';
    if (nextBtn) nextBtn.innerText = this.currentStep === this.totalSteps ? 'Publish Event Live 🚀' : 'Continue →';
  }

  updateSplitSlider(type, val) {
    val = parseInt(val);
    if (type === 'host') {
      this.formData.hostSplit = val;
      document.getElementById('val-host-split').innerText = `${val}%`;
    } else if (type === 'venue') {
      this.formData.venueSplit = val;
      document.getElementById('val-venue-split').innerText = `${val}%`;
    } else if (type === 'promoter') {
      this.formData.promoterSplit = val;
      document.getElementById('val-promoter-split').innerText = `${val}%`;
    }
  }

  async publishEvent() {
    const newId = `gathr-event-${Date.now()}`;
    const newEvent = {
      id: newId,
      title: this.formData.title,
      category: this.formData.category,
      city: this.formData.city,
      venue: this.formData.venue,
      date: this.formData.date,
      time: this.formData.time,
      image: "./assets/images/tech-summit.jpg",
      organizer: "You (Verified Host)",
      verified: true,
      description: this.formData.description,
      minPrice: this.formData.tierPrice,
      currency: "₦",
      currencyCode: "NGN",
      hostSplit: this.formData.hostSplit,
      venueSplit: this.formData.venueSplit,
      promoterSplit: this.formData.promoterSplit,
      ticketTiers: [
        {
          id: `${newId}-tier-1`,
          name: this.formData.tierName,
          price: this.formData.tierPrice,
          capacity: this.formData.tierCapacity,
          remaining: this.formData.tierCapacity,
          perks: "Access Pass, Digital Fast-Track QR, Split-Payout Protected"
        }
      ],
      stats: {
        soldCount: 0,
        revenueGross: 0,
        checkedInCount: 0
      }
    };

    try {
      await fetch('/api/v1/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: this.formData.title,
          category: this.formData.category,
          description: this.formData.description,
          city: this.formData.city,
          venue: this.formData.venue,
          date: this.formData.date,
          time: this.formData.time,
          tierName: this.formData.tierName,
          tierPrice: this.formData.tierPrice,
          tierCapacity: this.formData.tierCapacity,
          hostSplit: this.formData.hostSplit,
          venueSplit: this.formData.venueSplit,
          promoterSplit: this.formData.promoterSplit
        })
      });
    } catch (err) {
      console.warn("Backend event sync note:", err);
    }

    GATHR_EVENTS.unshift(newEvent);
    if (window.gathrApp) {
      window.gathrApp.events = [...GATHR_EVENTS];
      window.gathrApp.renderEvents();
      window.gathrApp.switchView('explore');
      window.gathrApp.showToast(`🎉 Event published! "${newEvent.title}" is now live!`);
    }

    this.closeWizard();
  }

  // Open WhatsApp Ticket Bot Simulator
  openWhatsAppBot(attendeeName = "Chinedu Eze", eventTitle = "GATHR Tech Summit 2026", code = "GTHR-VIP-8812") {
    const modal = document.getElementById('whatsapp-simulator-modal');
    if (!modal) return;

    const qrContainer = document.getElementById('wa-pass-qr-box');
    if (qrContainer && window.gathrTicketEngine) {
      qrContainer.innerHTML = gathrTicketEngine.generateQrSvg(`${code}#WA-VERIFIED`);
    }

    document.getElementById('wa-msg-body').innerHTML = `
      Hello <strong>${attendeeName}</strong>! 🎉<br><br>
      Your access pass for <strong>${eventTitle}</strong> has been confirmed & issued!<br><br>
      📍 <strong>Venue:</strong> Eko Convention Centre, Lagos<br>
      ⏰ <strong>Door Time:</strong> Nov 28, 09:00 AM WAT<br>
      🔑 <strong>Ticket ID:</strong> <code>${code}</code><br><br>
      <em>Present the dynamic QR pass below at Gate 1 VIP for fast-track turnstile entry:</em>
    `;

    modal.classList.add('active');
  }

  closeWhatsAppBot() {
    const modal = document.getElementById('whatsapp-simulator-modal');
    if (modal) modal.classList.remove('active');
  }
}

window.gathrEventWizard = new EventWizard();
