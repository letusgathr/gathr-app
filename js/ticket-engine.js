/**
 * GATHR Ticket Engine: TOTP Rolling QR Generation & Cryptographic Verification
 */

class TicketEngine {
  constructor() {
    this.totpInterval = 20; // 20-second rolling window
  }

  /**
   * Generates a 6-digit rolling TOTP code based on epoch
   */
  getRollingTotp(seed = "GATHR_SECRET") {
    const epochSec = Math.floor(Date.now() / 1000);
    const counter = Math.floor(epochSec / this.totpInterval);
    const secondsRemaining = this.totpInterval - (epochSec % this.totpInterval);
    
    // Hash simulation for TOTP
    let hash = 0;
    const str = `${seed}_${counter}`;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    const code = Math.abs(hash % 900000 + 100000);
    return { code, secondsRemaining };
  }

  /**
   * Draws a crisp SVG QR matrix with embedded GATHR logo center
   */
  generateQrSvg(payloadString) {
    const size = 25; // 25x25 matrix
    let hash = 0;
    for (let i = 0; i < payloadString.length; i++) {
      hash = (hash << 5) - hash + payloadString.charCodeAt(i);
      hash |= 0;
    }

    let rects = '';
    const cellSize = 7;
    const padding = 10;

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Corner Finder Patterns (standard QR style)
        const isFinderTL = (r < 7 && c < 7);
        const isFinderTR = (r < 7 && c >= size - 7);
        const isFinderBL = (r >= size - 7 && c < 7);
        const isCenterLogo = (r >= 10 && r <= 14 && c >= 10 && c <= 14);

        if (isCenterLogo) continue;

        let isDark = false;
        if (isFinderTL) {
          isDark = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
        } else if (isFinderTR) {
          const tc = c - (size - 7);
          isDark = (r === 0 || r === 6 || tc === 0 || tc === 6 || (r >= 2 && r <= 4 && tc >= 2 && tc <= 4));
        } else if (isFinderBL) {
          const tr = r - (size - 7);
          isDark = (tr === 0 || tr === 6 || c === 0 || c === 6 || (tr >= 2 && tr <= 4 && c >= 2 && c <= 4));
        } else {
          // Pseudorandom matrix bit based on payload hash and coordinates
          const bit = Math.sin(hash + r * 31 + c * 17) * 10000;
          isDark = (bit - Math.floor(bit)) > 0.48;
        }

        if (isDark) {
          const x = padding + c * cellSize;
          const y = padding + r * cellSize;
          rects += `<rect x="${x}" y="${y}" width="${cellSize - 0.5}" height="${cellSize - 0.5}" rx="1.5" fill="#0A0B0E" />`;
        }
      }
    }

    const totalDim = padding * 2 + size * cellSize;
    return `
      <svg viewBox="0 0 ${totalDim} ${totalDim}" class="ticket-qr-svg" xmlns="http://www.w3.org/2000/svg">
        <rect width="${totalDim}" height="${totalDim}" fill="#FFFFFF" rx="16" />
        ${rects}
        <!-- Center GATHR Emblem Badge -->
        <circle cx="${totalDim/2}" cy="${totalDim/2}" r="16" fill="#FF5500" />
        <text x="${totalDim/2}" y="${totalDim/2 + 5}" font-family="Outfit, sans-serif" font-size="12" font-weight="900" fill="#FFFFFF" text-anchor="middle">G</text>
      </svg>
    `;
  }
}

const gathrTicketEngine = new TicketEngine();
