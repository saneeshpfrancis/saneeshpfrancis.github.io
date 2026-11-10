/**
 * PendulumRenderer
 * Canvas visualizer for the pendulum laboratory simulation.
 * Handles high-DPI scaling, realistic rendering of mechanical components,
 * vector analysis overlays, interactive drag-and-drop, and photogate sensor feedback.
 */

class PendulumRenderer {
  constructor(canvas, physics) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.physics = physics;

    // Visual configuration options
    this.options = {
      showVectors: true,
      showVelocity: true,
      showAcceleration: true,
      showForces: true,
      showProtractor: true,
      showTrace: true,
      showPhotogate: true,
      vectorScale: 1.0,
      traceLength: 120,
    };

    // Interaction state
    this.isDragging = false;
    this.isHoveringBob = false;
    this.dragOffset = { x: 0, y: 0 };

    // Motion trail history: array of {x, y, alpha}
    this.trail = [];

    // Colors & Theme (CSS variables or adaptive defaults)
    this.theme = {
      rod: '#94a3b8',
      rodHighlight: '#cbd5e1',
      pivot: '#64748b',
      bobBase: '#3b82f6',
      bobGlow: 'rgba(59, 130, 246, 0.4)',
      velocityVec: '#10b981', // green
      accelVec: '#f59e0b', // amber
      gravityVec: '#ef4444', // red
      tensionVec: '#06b6d4', // cyan
      grid: 'rgba(148, 163, 184, 0.15)',
      text: '#f8fafc',
      trail: 'rgba(59, 130, 246, 0.45)',
      photogate: '#ef4444',
      photogateActive: '#22c55e'
    };

    this.setupEventListeners();
    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.width = rect.width;
    this.height = rect.height;

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.resetTransform();
    this.ctx.scale(dpr, dpr);

    // Pivot location in canvas pixels (top-center with pleasant padding)
    this.pivotX = this.width / 2;
    this.pivotY = Math.max(70, this.height * 0.15);

    // Pixels per meter scale factor based on canvas height and pendulum length
    const maxRenderLength = this.height * 0.65;
    this.pixelsPerMeter = maxRenderLength / Math.max(this.physics.length, 1.2);
  }

  setupEventListeners() {
    const getPos = (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      return {
        x: clientX - rect.left,
        y: clientY - rect.top
      };
    };

    const onDown = (e) => {
      const pos = getPos(e);
      const bobPos = this.getBobPosition();
      const radius = this.getBobRadius();
      const dist = Math.hypot(pos.x - bobPos.x, pos.y - bobPos.y);

      if (dist <= radius + 15) {
        this.isDragging = true;
        this.dragOffset = { x: pos.x - bobPos.x, y: pos.y - bobPos.y };
        if (e.cancelable) e.preventDefault();
      }
    };

    const onMove = (e) => {
      const pos = getPos(e);
      const bobPos = this.getBobPosition();
      const radius = this.getBobRadius();
      const dist = Math.hypot(pos.x - bobPos.x, pos.y - bobPos.y);

      this.isHoveringBob = dist <= radius + 15;
      this.canvas.style.cursor = this.isDragging ? 'grabbing' : (this.isHoveringBob ? 'grab' : 'default');

      if (this.isDragging) {
        // Calculate new theta from pivot
        const dx = pos.x - this.pivotX;
        const dy = pos.y - this.pivotY;
        const newTheta = Math.atan2(dx, dy); // atan2(x, y) gives 0 at bottom, positive CW, negative CCW
        
        this.physics.theta = newTheta;
        this.physics.omega = 0.0;
        this.physics.alpha = 0.0;
        this.physics.time = 0.0;
        this.physics.initialEnergy = this.physics.calculateTotalEnergy();
        this.physics.energyDriftPercent = 0.0;
        this.physics.isSlack = false;
        this.trail = [];
        if (e.cancelable) e.preventDefault();
      }
    };

    const onUp = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.canvas.style.cursor = this.isHoveringBob ? 'grab' : 'default';
        this.physics.initialEnergy = this.physics.calculateTotalEnergy();
      }
    };

    this.canvas.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);

    this.canvas.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
  }

  getBobRadius() {
    // Volume proportional to mass, so radius proportional to cbrt(m)
    const baseRadius = 20;
    return Math.max(14, Math.min(36, baseRadius * Math.cbrt(this.physics.mass)));
  }

  getBobPosition() {
    const pixelLength = this.physics.length * this.pixelsPerMeter;
    const x = this.pivotX + pixelLength * Math.sin(this.physics.theta);
    const y = this.pivotY + pixelLength * Math.cos(this.physics.theta);
    return { x, y };
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background grid lines and scale ruler
    this.renderGrid();

    // Draw equilibrium vertical dashed line
    this.renderEquilibriumLine();

    // Draw protractor arc and angle measurement
    if (this.options.showProtractor) {
      this.renderProtractor();
    }

    // Draw Photogate sensor at bottom equilibrium
    if (this.options.showPhotogate) {
      this.renderPhotogate();
    }

    // Update and draw motion trail
    if (this.options.showTrace) {
      this.renderTrail();
    }

    // Draw Rod and Pivot
    this.renderRodAndPivot();

    // Draw Pendulum Bob
    this.renderBob();

    // Draw Analysis Vectors (Velocity, Acceleration, Forces)
    if (this.options.showVectors) {
      this.renderVectors();
    }
  }

  renderGrid() {
    this.ctx.save();
    this.ctx.strokeStyle = this.theme.grid;
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);

    const step = 50;
    for (let x = 0; x < this.width; x += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.height; y += step) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderEquilibriumLine() {
    const maxLen = this.physics.length * this.pixelsPerMeter + 45;
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([5, 5]);
    this.ctx.beginPath();
    this.ctx.moveTo(this.pivotX, this.pivotY);
    this.ctx.lineTo(this.pivotX, this.pivotY + maxLen);
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderProtractor() {
    const r = Math.min(80, this.physics.length * this.pixelsPerMeter * 0.45);
    this.ctx.save();

    // Arc guide
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
    this.ctx.lineWidth = 1.5;
    this.ctx.beginPath();
    this.ctx.arc(this.pivotX, this.pivotY, r, -Math.PI * 0.75, Math.PI * 0.75);
    this.ctx.stroke();

    // Degree tick marks
    const anglesDeg = [-90, -60, -45, -30, 0, 30, 45, 60, 90];
    this.ctx.font = '10px monospace';
    this.ctx.fillStyle = 'rgba(148, 163, 184, 0.7)';
    this.ctx.textAlign = 'center';

    anglesDeg.forEach(deg => {
      const rad = (deg * Math.PI) / 180;
      const x1 = this.pivotX + (r - 6) * Math.sin(rad);
      const y1 = this.pivotY + (r - 6) * Math.cos(rad);
      const x2 = this.pivotX + (r + 4) * Math.sin(rad);
      const y2 = this.pivotY + (r + 4) * Math.cos(rad);

      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.lineTo(x2, y2);
      this.ctx.stroke();

      if (deg % 30 === 0 && deg !== 0) {
        const tx = this.pivotX + (r + 15) * Math.sin(rad);
        const ty = this.pivotY + (r + 15) * Math.cos(rad) + 3;
        this.ctx.fillText(`${deg}°`, tx, ty);
      }
    });

    // Active angle sweep wedge
    const currentTheta = this.physics.theta;
    this.ctx.fillStyle = 'rgba(59, 130, 246, 0.15)';
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 2;
    this.ctx.beginPath();
    this.ctx.moveTo(this.pivotX, this.pivotY);
    // Draw arc from equilibrium (angle = Math.PI/2 in canvas polar coordinates)
    const startAngle = Math.PI * 0.5;
    const endAngle = Math.PI * 0.5 + currentTheta;
    this.ctx.arc(this.pivotX, this.pivotY, r, startAngle, endAngle, currentTheta < 0);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Angle text badge
    const degVal = ((currentTheta * 180) / Math.PI).toFixed(1);
    const radVal = currentTheta.toFixed(3);
    const badgeX = this.pivotX + (r + 28) * Math.sin(currentTheta * 0.5);
    const badgeY = this.pivotY + (r + 28) * Math.cos(currentTheta * 0.5);

    this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    this.ctx.strokeStyle = '#3b82f6';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.roundRect(badgeX - 35, badgeY - 14, 70, 24, 6);
    this.ctx.fill();
    this.ctx.stroke();

    this.ctx.fillStyle = '#60a5fa';
    this.ctx.font = 'bold 11px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`θ = ${degVal}°`, badgeX, badgeY - 2);

    this.ctx.restore();
  }

  renderPhotogate() {
    const bottomY = this.pivotY + this.physics.length * this.pixelsPerMeter;
    const gateWidth = 40;
    const gateHeight = 24;

    // Check if bob intersects gate beam (when |theta| is small)
    const isInterrupted = Math.abs(this.physics.theta) < 0.06;

    this.ctx.save();
    // U-shaped photogate sensor body
    this.ctx.fillStyle = '#1e293b';
    this.ctx.strokeStyle = isInterrupted ? this.theme.photogateActive : '#475569';
    this.ctx.lineWidth = 2;

    // Left post (laser emitter)
    this.ctx.fillRect(this.pivotX - gateWidth / 2 - 6, bottomY - gateHeight / 2, 8, gateHeight);
    this.ctx.strokeRect(this.pivotX - gateWidth / 2 - 6, bottomY - gateHeight / 2, 8, gateHeight);

    // Right post (photodiode detector)
    this.ctx.fillRect(this.pivotX + gateWidth / 2 - 2, bottomY - gateHeight / 2, 8, gateHeight);
    this.ctx.strokeRect(this.pivotX + gateWidth / 2 - 2, bottomY - gateHeight / 2, 8, gateHeight);

    // Optical beam
    this.ctx.beginPath();
    this.ctx.strokeStyle = isInterrupted ? '#22c55e' : 'rgba(239, 68, 68, 0.75)';
    this.ctx.lineWidth = isInterrupted ? 3 : 1.5;
    this.ctx.setLineDash(isInterrupted ? [] : [3, 3]);
    this.ctx.moveTo(this.pivotX - gateWidth / 2 + 2, bottomY);
    this.ctx.lineTo(this.pivotX + gateWidth / 2 - 2, bottomY);
    this.ctx.stroke();

    // Photogate Indicator LED
    this.ctx.fillStyle = isInterrupted ? '#22c55e' : '#ef4444';
    this.ctx.shadowColor = isInterrupted ? '#22c55e' : '#ef4444';
    this.ctx.shadowBlur = isInterrupted ? 10 : 3;
    this.ctx.beginPath();
    this.ctx.arc(this.pivotX - gateWidth / 2 - 2, bottomY - 6, 3, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  renderTrail() {
    const bob = this.getBobPosition();
    this.trail.push({ x: bob.x, y: bob.y, t: Date.now() });

    if (this.trail.length > this.options.traceLength) {
      this.trail.shift();
    }

    if (this.trail.length < 2) return;

    this.ctx.save();
    for (let i = 1; i < this.trail.length; i++) {
      const alpha = (i / this.trail.length) * 0.6;
      this.ctx.strokeStyle = `rgba(96, 165, 250, ${alpha})`;
      this.ctx.lineWidth = (i / this.trail.length) * 3 + 0.5;
      this.ctx.beginPath();
      this.ctx.moveTo(this.trail[i - 1].x, this.trail[i - 1].y);
      this.ctx.lineTo(this.trail[i].x, this.trail[i].y);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderRodAndPivot() {
    const bob = this.getBobPosition();

    this.ctx.save();

    // Rod
    if (this.physics.isSlack) {
      // Loose slack string rendering
      this.ctx.strokeStyle = '#ef4444';
      this.ctx.lineWidth = 2;
      this.ctx.setLineDash([4, 4]);
      this.ctx.beginPath();
      this.ctx.moveTo(this.pivotX, this.pivotY);
      this.ctx.quadraticCurveTo(
        (this.pivotX + bob.x) / 2,
        (this.pivotY + bob.y) / 2 + 25,
        bob.x,
        bob.y
      );
      this.ctx.stroke();
    } else {
      // Rigid rod or taut string
      const isRigid = this.physics.rodType === 'rigid';
      const grad = this.ctx.createLinearGradient(this.pivotX - 5, this.pivotY, bob.x + 5, bob.y);
      grad.addColorStop(0, '#64748b');
      grad.addColorStop(0.5, '#cbd5e1');
      grad.addColorStop(1, '#64748b');

      this.ctx.strokeStyle = isRigid ? grad : '#94a3b8';
      this.ctx.lineWidth = isRigid ? 4.5 : 2;
      this.ctx.lineCap = 'round';
      this.ctx.beginPath();
      this.ctx.moveTo(this.pivotX, this.pivotY);
      this.ctx.lineTo(bob.x, bob.y);
      this.ctx.stroke();
    }

    // Pivot mount fixture
    this.ctx.fillStyle = '#334155';
    this.ctx.beginPath();
    this.ctx.arc(this.pivotX, this.pivotY, 12, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.fillStyle = '#0ea5e9';
    this.ctx.beginPath();
    this.ctx.arc(this.pivotX, this.pivotY, 5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  renderBob() {
    const bob = this.getBobPosition();
    const r = this.getBobRadius();

    this.ctx.save();

    // Glow if hovering or dragging
    if (this.isHoveringBob || this.isDragging) {
      this.ctx.shadowColor = '#38bdf8';
      this.ctx.shadowBlur = 18;
    }

    // Metallic spherical gradient
    const grad = this.ctx.createRadialGradient(
      bob.x - r * 0.35,
      bob.y - r * 0.35,
      r * 0.1,
      bob.x,
      bob.y,
      r
    );
    grad.addColorStop(0, '#93c5fd');
    grad.addColorStop(0.3, '#3b82f6');
    grad.addColorStop(0.8, '#1d4ed8');
    grad.addColorStop(1, '#1e3a8a');

    this.ctx.fillStyle = grad;
    this.ctx.beginPath();
    this.ctx.arc(bob.x, bob.y, r, 0, Math.PI * 2);
    this.ctx.fill();

    // Border ring
    this.ctx.strokeStyle = this.isDragging ? '#ffffff' : '#60a5fa';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();

    // Center of Mass crosshair
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(bob.x - 4, bob.y);
    this.ctx.lineTo(bob.x + 4, bob.y);
    this.ctx.moveTo(bob.x, bob.y - 4);
    this.ctx.lineTo(bob.x, bob.y + 4);
    this.ctx.stroke();

    // Mass label on bob
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = 'bold 11px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(`${this.physics.mass.toFixed(1)}kg`, bob.x, bob.y);

    this.ctx.restore();
  }

  renderVectors() {
    const bob = this.getBobPosition();
    const th = this.physics.theta;
    const om = this.physics.omega;
    const m = this.physics.mass;
    const g = this.physics.gravity;
    const L = this.physics.length;

    const scale = this.options.vectorScale;

    // Unit vectors
    // Radial outwards from pivot: u_r = (sin(th), cos(th))
    const ur_x = Math.sin(th);
    const ur_y = Math.cos(th);
    // Tangential in direction of increasing theta: u_th = (cos(th), -sin(th))
    const uth_x = Math.cos(th);
    const uth_y = -Math.sin(th);

    // 1. Tangential Velocity Vector: v = L * omega * u_th
    if (this.options.showVelocity) {
      const vMag = L * om;
      const vScale = 25 * scale;
      const vx = vMag * uth_x * vScale;
      const vy = vMag * uth_y * vScale;
      this.drawArrow(bob.x, bob.y, bob.x + vx, bob.y + vy, this.theme.velocityVec, 'v', `${(L * om).toFixed(2)} m/s`);
    }

    // 2. Net Acceleration Vector: a = a_r * u_r + a_th * u_th
    // a_r = -L * om^2 (centripetal, towards pivot)
    // a_th = L * alpha (tangential)
    if (this.options.showAcceleration) {
      const ar = -L * om * om;
      const ath = L * this.physics.alpha;
      const aScale = 5 * scale;
      const ax = (ar * ur_x + ath * uth_x) * aScale;
      const ay = (ar * ur_y + ath * uth_y) * aScale;
      const aTotal = Math.hypot(ar, ath);
      this.drawArrow(bob.x, bob.y, bob.x + ax, bob.y + ay, this.theme.accelVec, 'a', `${aTotal.toFixed(2)} m/s²`);
    }

    // 3. Forces: Gravity and Tension
    if (this.options.showForces) {
      const fScale = 6 * scale;

      // Gravity: F_g = m * g downwards
      const fg_y = m * g * fScale;
      this.drawArrow(bob.x, bob.y, bob.x, bob.y + fg_y, this.theme.gravityVec, 'mg', `${(m * g).toFixed(1)} N`);

      // Tension: along -u_r towards pivot
      const tension = this.physics.calculateTension();
      const tx = -tension * ur_x * fScale;
      const ty = -tension * ur_y * fScale;
      this.drawArrow(bob.x, bob.y, bob.x + tx, bob.y + ty, this.theme.tensionVec, 'T', `${tension.toFixed(1)} N`);
    }
  }

  drawArrow(fromX, fromY, toX, toY, color, symbol, valueText) {
    const dx = toX - fromX;
    const dy = toY - fromY;
    const length = Math.hypot(dx, dy);

    if (length < 3) return; // Do not draw microscopic arrows

    const headLength = Math.min(12, Math.max(6, length * 0.25));
    const angle = Math.atan2(dy, dx);

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.fillStyle = color;
    this.ctx.lineWidth = 2.5;

    // Arrow line
    this.ctx.beginPath();
    this.ctx.moveTo(fromX, fromY);
    this.ctx.lineTo(toX, toY);
    this.ctx.stroke();

    // Arrow head
    this.ctx.beginPath();
    this.ctx.moveTo(toX, toY);
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle - Math.PI / 6),
      toY - headLength * Math.sin(angle - Math.PI / 6)
    );
    this.ctx.lineTo(
      toX - headLength * Math.cos(angle + Math.PI / 6),
      toY - headLength * Math.sin(angle + Math.PI / 6)
    );
    this.ctx.closePath();
    this.ctx.fill();

    // Label with value badge
    if (symbol || valueText) {
      const textX = toX + 12 * Math.cos(angle);
      const textY = toY + 12 * Math.sin(angle);

      this.ctx.font = 'bold 11px system-ui, sans-serif';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      // Subtle label background
      const label = `${symbol}: ${valueText}`;
      const textWidth = this.ctx.measureText(label).width;
      this.ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
      this.ctx.fillRect(textX - 3, textY - 8, textWidth + 6, 16);

      this.ctx.fillStyle = color;
      this.ctx.fillText(label, textX, textY);
    }

    this.ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PendulumRenderer;
}
