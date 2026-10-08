/**
 * GATHR Organizer Command Center: Analytics, Attendee Operations & CSV Export
 */

class OrganizerManager {
  constructor() {
    this.attendees = [...INITIAL_ATTENDEES];
    this.activeEvent = GATHR_EVENTS[0];
  }

  renderMetrics() {
    const revEl = document.getElementById('org-metric-revenue');
    const ticketsEl = document.getElementById('org-metric-tickets');
    const checkedInEl = document.getElementById('org-metric-checkins');
    const pacingEl = document.getElementById('org-metric-pacing');

    if (revEl) revEl.innerText = `₦${(this.activeEvent.stats.revenueGross).toLocaleString()}`;
    if (ticketsEl) ticketsEl.innerText = `${this.activeEvent.stats.soldCount}`;
    if (checkedInEl) checkedInEl.innerText = `${this.activeEvent.stats.checkedInCount}`;
    if (pacingEl) pacingEl.innerText = `${Math.round((this.activeEvent.stats.checkedInCount / this.activeEvent.stats.soldCount) * 100)}%`;
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
    // Check if attendee already in list
    const existing = this.attendees.find(a => a.code === code);
    if (existing) {
      existing.status = "Checked In";
      existing.checkInTime = timeStr;
      existing.gate = "Gate 1 VIP";
    } else {
      this.attendees.unshift({
        id: `att-${Date.now()}`,
        name: name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
        tier: tier,
        code: code,
        status: "Checked In",
        gate: "Gate 1 VIP",
        checkInTime: timeStr
      });
    }

    this.activeEvent.stats.checkedInCount++;
    this.renderMetrics();
    this.renderAttendeeTable();

    // Pulse animation on the row
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
    link.setAttribute("download", `gathr_${this.activeEvent.id}_attendees.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (window.gathrApp) {
      window.gathrApp.showToast("Attendee CSV Export downloaded successfully!");
    }
  }
}

window.gathrOrganizer = new OrganizerManager();
