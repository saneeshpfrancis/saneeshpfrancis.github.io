/**
 * ScientificChartManager
 * High-performance native Canvas 2D charts designed for physics laboratory instrumentation.
 * Features:
 * 1. Time-Series (Kinematics: theta, omega, alpha)
 * 2. Energy Decomposition (KE, PE, Total Mechanical Energy)
 * 3. Phase Space Portrait (theta vs. omega) with vector field & separatrix
 * 4. FFT Power Spectrum (Frequency Harmonics analysis)
 */

class ScientificChartManager {
  constructor(canvas, physics) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.physics = physics;

    this.activeMode = 'kinematics'; // 'kinematics', 'energy', 'phase', 'fft'

    // Rolling time-series buffers
    this.maxSamples = 400;
    this.history = {
      time: [],
      theta: [],
      omega: [],
      alpha: [],
      ke: [],
      pe: [],
      totalE: []
    };

    // Phase plane trajectory buffer
    this.phasePoints = [];
    this.maxPhasePoints = 1200;

    // FFT cache
    this.fftSpectrum = [];
    this.lastFFTTime = 0;

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
  }

  setMode(mode) {
    this.activeMode = mode;
  }

  clear() {
    this.history.time = [];
    this.history.theta = [];
    this.history.omega = [];
    this.history.alpha = [];
    this.history.ke = [];
    this.history.pe = [];
    this.history.totalE = [];
    this.phasePoints = [];
    this.fftSpectrum = [];
  }

  recordSample() {
    const t = this.physics.time;
    const th = this.physics.theta;
    const om = this.physics.omega;
    const al = this.physics.alpha;
    const ke = this.physics.calculateKineticEnergy();
    const pe = this.physics.calculatePotentialEnergy();
    const eTot = ke + pe;

    this.history.time.push(t);
    this.history.theta.push(th);
    this.history.omega.push(om);
    this.history.alpha.push(al);
    this.history.ke.push(ke);
    this.history.pe.push(pe);
    this.history.totalE.push(eTot);

    if (this.history.time.length > this.maxSamples) {
      this.history.time.shift();
      this.history.theta.shift();
      this.history.omega.shift();
      this.history.alpha.shift();
      this.history.ke.shift();
      this.history.pe.shift();
      this.history.totalE.shift();
    }

    // Phase plane point: normalize angle into [-pi, pi] or keep continuous
    this.phasePoints.push({ theta: th, omega: om });
    if (this.phasePoints.length > this.maxPhasePoints) {
      this.phasePoints.shift();
    }

    // Periodic FFT calculation (every 0.25 s)
    if (t - this.lastFFTTime > 0.25 && this.history.theta.length >= 128) {
      const dtAvg = (this.history.time[this.history.time.length - 1] - this.history.time[0]) / (this.history.time.length - 1);
      const sampleRate = 1.0 / (dtAvg || 0.016);
      this.fftSpectrum = PendulumPhysics.computeFFT(this.history.theta, sampleRate);
      this.lastFFTTime = t;
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    switch (this.activeMode) {
      case 'kinematics':
        this.renderKinematicsChart();
        break;
      case 'energy':
        this.renderEnergyChart();
        break;
      case 'phase':
        this.renderPhaseSpace();
        break;
      case 'fft':
        this.renderFFTSpectrum();
        break;
    }
  }

  // ==========================================
  // 1. KINEMATICS TIME-SERIES CHART
  // ==========================================
  renderKinematicsChart() {
    const pad = { top: 25, right: 30, bottom: 35, left: 55 };
    const w = this.width - pad.left - pad.right;
    const h = this.height - pad.top - pad.bottom;

    if (w <= 0 || h <= 0) return;

    this.drawChartAxes(pad, w, h, 'Time t (s)', 'Kinematic State (rad, rad/s)');

    if (this.history.time.length < 2) return;

    const tMin = this.history.time[0];
    const tMax = Math.max(tMin + 5, this.history.time[this.history.time.length - 1]);

    // Find y-range across theta and omega
    let maxAbs = 1.5;
    for (let i = 0; i < this.history.theta.length; i++) {
      maxAbs = Math.max(maxAbs, Math.abs(this.history.theta[i]), Math.abs(this.history.omega[i]));
    }
    maxAbs = Math.ceil(maxAbs * 1.2 * 10) / 10;
    const yMin = -maxAbs;
    const yMax = maxAbs;

    // Draw horizontal zero line
    const yZero = pad.top + h * (1.0 - (0 - yMin) / (yMax - yMin));
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    this.ctx.moveTo(pad.left, yZero);
    this.ctx.lineTo(pad.left + w, yZero);
    this.ctx.stroke();

    // Plot Theta (Angle) - Cyan
    this.plotSeries(this.history.time, this.history.theta, tMin, tMax, yMin, yMax, pad, w, h, '#38bdf8', 2);

    // Plot Omega (Angular Velocity) - Emerald Green
    this.plotSeries(this.history.time, this.history.omega, tMin, tMax, yMin, yMax, pad, w, h, '#34d399', 1.5);

    // Legend
    this.drawLegend(pad, [
      { label: `θ: ${this.physics.theta.toFixed(3)} rad (${((this.physics.theta * 180) / Math.PI).toFixed(1)}°)`, color: '#38bdf8' },
      { label: `ω: ${this.physics.omega.toFixed(3)} rad/s`, color: '#34d399' }
    ]);
  }

  // ==========================================
  // 2. ENERGY CHART & DISSIPATION TRACKER
  // ==========================================
  renderEnergyChart() {
    const pad = { top: 25, right: 90, bottom: 35, left: 55 };
    const w = this.width - pad.left - pad.right;
    const h = this.height - pad.top - pad.bottom;

    if (w <= 0 || h <= 0) return;

    this.drawChartAxes(pad, w, h, 'Time t (s)', 'Energy (Joules)');

    if (this.history.time.length < 2) return;

    const tMin = this.history.time[0];
    const tMax = Math.max(tMin + 5, this.history.time[this.history.time.length - 1]);

    let maxE = 0.5;
    for (let i = 0; i < this.history.totalE.length; i++) {
      maxE = Math.max(maxE, this.history.totalE[i]);
    }
    maxE = Math.ceil(maxE * 1.25 * 10) / 10;
    const yMin = 0;
    const yMax = maxE;

    // Plot Kinetic Energy T (Blue)
    this.plotSeries(this.history.time, this.history.ke, tMin, tMax, yMin, yMax, pad, w, h, '#60a5fa', 1.5);

    // Plot Potential Energy V (Green)
    this.plotSeries(this.history.time, this.history.pe, tMin, tMax, yMin, yMax, pad, w, h, '#4ade80', 1.5);

    // Plot Total Mechanical Energy E (Gold)
    this.plotSeries(this.history.time, this.history.totalE, tMin, tMax, yMin, yMax, pad, w, h, '#facc15', 2.5);

    // Energy Breakdown Instantaneous Bar Gauge on Right
    this.renderEnergyBarGauge(pad.left + w + 18, pad.top, 50, h, maxE);

    // Legend
    const curKE = this.physics.calculateKineticEnergy();
    const curPE = this.physics.calculatePotentialEnergy();
    const curTotal = curKE + curPE;

    this.drawLegend(pad, [
      { label: `KE (T): ${curKE.toFixed(3)} J`, color: '#60a5fa' },
      { label: `PE (V): ${curPE.toFixed(3)} J`, color: '#4ade80' },
      { label: `E_tot: ${curTotal.toFixed(3)} J (ΔE: ${this.physics.energyDriftPercent.toFixed(2)}%)`, color: '#facc15' }
    ]);
  }

  renderEnergyBarGauge(x, y, width, height, maxVal) {
    const ke = this.physics.calculateKineticEnergy();
    const pe = this.physics.calculatePotentialEnergy();
    const tot = ke + pe;

    const keHeight = Math.min(height, (ke / maxVal) * height);
    const peHeight = Math.min(height, (pe / maxVal) * height);

    this.ctx.save();
    // Background slot
    this.ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    this.ctx.strokeStyle = '#475569';
    this.ctx.lineWidth = 1;
    this.ctx.fillRect(x, y, width, height);
    this.ctx.strokeRect(x, y, width, height);

    // Stacked bars: PE on bottom, KE on top
    const barWidth = width - 12;
    const barX = x + 6;

    // PE (Green)
    const peY = y + height - peHeight;
    this.ctx.fillStyle = '#22c55e';
    this.ctx.fillRect(barX, peY, barWidth, peHeight);

    // KE (Blue) stacked above
    const keY = peY - keHeight;
    this.ctx.fillStyle = '#3b82f6';
    this.ctx.fillRect(barX, Math.max(y, keY), barWidth, keHeight);

    // Gauge title & labels
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '10px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('Energy', x + width / 2, y - 6);
    this.ctx.fillText(`${tot.toFixed(2)}J`, x + width / 2, y + height + 14);

    this.ctx.restore();
  }

  // ==========================================
  // 3. PHASE SPACE PORTRAIT (θ vs. ω)
  // ==========================================
  renderPhaseSpace() {
    const pad = { top: 25, right: 30, bottom: 35, left: 55 };
    const w = this.width - pad.left - pad.right;
    const h = this.height - pad.top - pad.bottom;

    if (w <= 0 || h <= 0) return;

    this.drawChartAxes(pad, w, h, 'Angle θ (rad)', 'Angular Velocity ω (rad/s)');

    const thetaMin = -Math.PI;
    const thetaMax = Math.PI;
    
    // Dynamic omega scale based on separatrix
    const omega0 = Math.sqrt(this.physics.gravity / this.physics.length);
    const separatrixMaxOmega = 2.0 * omega0;
    const omegaLimit = Math.max(separatrixMaxOmega * 1.25, Math.abs(this.physics.omega) * 1.25, 4.0);

    const omegaMin = -omegaLimit;
    const omegaMax = omegaLimit;

    const toScreenX = (th) => pad.left + ((th - thetaMin) / (thetaMax - thetaMin)) * w;
    const toScreenY = (om) => pad.top + h * (1.0 - (om - omegaMin) / (omegaMax - omegaMin));

    // Draw Vector Flow Field in the phase plane!
    this.renderPhaseFlowField(pad, w, h, thetaMin, thetaMax, omegaMin, omegaMax);

    // Draw Separatrix Curve (E = 2mgL): omega = +/- 2 * omega0 * cos(theta / 2)
    this.renderSeparatrix(pad, w, h, thetaMin, thetaMax, omegaMin, omegaMax, omega0);

    // Draw Phase Trajectory
    if (this.phasePoints.length > 1) {
      this.ctx.save();
      this.ctx.lineWidth = 2;

      for (let i = 1; i < this.phasePoints.length; i++) {
        const p1 = this.phasePoints[i - 1];
        const p2 = this.phasePoints[i];

        // Handle wrap-around across -pi and pi
        if (Math.abs(p2.theta - p1.theta) > Math.PI) continue;

        const x1 = toScreenX(p1.theta);
        const y1 = toScreenY(p1.omega);
        const x2 = toScreenX(p2.theta);
        const y2 = toScreenY(p2.omega);

        const alpha = 0.2 + 0.8 * (i / this.phasePoints.length);
        this.ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
      }

      // Draw current state marker in phase space
      const currentX = toScreenX(this.physics.theta);
      const currentY = toScreenY(this.physics.omega);

      this.ctx.fillStyle = '#f43f5e';
      this.ctx.shadowColor = '#f43f5e';
      this.ctx.shadowBlur = 10;
      this.ctx.beginPath();
      this.ctx.arc(currentX, currentY, 5, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }

    // Legend
    this.drawLegend(pad, [
      { label: 'Phase Flow (θ, ω)', color: '#38bdf8' },
      { label: 'Separatrix (E = 2mgL)', color: '#f59e0b' },
      { label: `State: (${this.physics.theta.toFixed(2)} rad, ${this.physics.omega.toFixed(2)} rad/s)`, color: '#f43f5e' }
    ]);
  }

  renderPhaseFlowField(pad, w, h, thMin, thMax, omMin, omMax) {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(100, 116, 139, 0.35)';
    this.ctx.lineWidth = 1;

    const cols = 14;
    const rows = 10;
    const dth = (thMax - thMin) / cols;
    const dom = (omMax - omMin) / rows;

    for (let c = 0; c <= cols; c++) {
      const th = thMin + c * dth;
      for (let r = 0; r <= rows; r++) {
        const om = omMin + r * dom;

        // Flow derivative: (dtheta/dt, domega/dt) = (omega, alpha)
        const dTheta = om;
        const dOmega = this.physics.computeAcceleration(th, om, this.physics.time);
        const mag = Math.hypot(dTheta, dOmega);

        if (mag < 1e-4) continue;

        const arrowLen = 10;
        const dirX = (dTheta / mag) * arrowLen;
        const dirY = -(dOmega / mag) * arrowLen; // screen y is inverted

        const px = pad.left + ((th - thMin) / (thMax - thMin)) * w;
        const py = pad.top + h * (1.0 - (om - omMin) / (omMax - omMin));

        this.ctx.beginPath();
        this.ctx.moveTo(px, py);
        this.ctx.lineTo(px + dirX, py + dirY);
        this.ctx.stroke();
      }
    }
    this.ctx.restore();
  }

  renderSeparatrix(pad, w, h, thMin, thMax, omMin, omMax, omega0) {
    this.ctx.save();
    this.ctx.strokeStyle = '#f59e0b';
    this.ctx.lineWidth = 1.5;
    this.ctx.setLineDash([4, 4]);

    const toScreenX = (th) => pad.left + ((th - thMin) / (thMax - thMin)) * w;
    const toScreenY = (om) => pad.top + h * (1.0 - (om - omMin) / (omMax - omMin));

    // Upper separatrix: + 2 * omega0 * cos(theta / 2)
    this.ctx.beginPath();
    for (let th = -Math.PI; th <= Math.PI; th += 0.05) {
      const omSep = 2.0 * omega0 * Math.cos(th * 0.5);
      const sx = toScreenX(th);
      const sy = toScreenY(omSep);
      if (th === -Math.PI) this.ctx.moveTo(sx, sy);
      else this.ctx.lineTo(sx, sy);
    }
    this.ctx.stroke();

    // Lower separatrix: - 2 * omega0 * cos(theta / 2)
    this.ctx.beginPath();
    for (let th = -Math.PI; th <= Math.PI; th += 0.05) {
      const omSep = -2.0 * omega0 * Math.cos(th * 0.5);
      const sx = toScreenX(th);
      const sy = toScreenY(omSep);
      if (th === -Math.PI) this.ctx.moveTo(sx, sy);
      else this.ctx.lineTo(sx, sy);
    }
    this.ctx.stroke();

    this.ctx.restore();
  }

  // ==========================================
  // 4. FFT POWER SPECTRUM
  // ==========================================
  renderFFTSpectrum() {
    const pad = { top: 25, right: 30, bottom: 35, left: 55 };
    const w = this.width - pad.left - pad.right;
    const h = this.height - pad.top - pad.bottom;

    if (w <= 0 || h <= 0) return;

    this.drawChartAxes(pad, w, h, 'Frequency (Hz)', 'Magnitude |X(f)|');

    if (!this.fftSpectrum || this.fftSpectrum.length === 0) {
      this.ctx.fillStyle = '#64748b';
      this.ctx.font = '12px system-ui, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('Collecting buffer for spectral analysis...', pad.left + w / 2, pad.top + h / 2);
      return;
    }

    // Limit frequency display to reasonable range (0 to 5 Hz)
    const maxFreq = 4.0;
    const filtered = this.fftSpectrum.filter(item => item.freq <= maxFreq);

    let maxMag = 0.01;
    let peakItem = null;
    filtered.forEach(item => {
      if (item.magnitude > maxMag) {
        maxMag = item.magnitude;
        peakItem = item;
      }
    });

    // Draw spectrum line / bars
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(168, 85, 247, 0.4)';
    this.ctx.strokeStyle = '#c084fc';
    this.ctx.lineWidth = 2;

    this.ctx.beginPath();
    this.ctx.moveTo(pad.left, pad.top + h);

    filtered.forEach(item => {
      const x = pad.left + (item.freq / maxFreq) * w;
      const y = pad.top + h * (1.0 - item.magnitude / maxMag);
      this.ctx.lineTo(x, y);
    });

    this.ctx.lineTo(pad.left + w, pad.top + h);
    this.ctx.closePath();
    this.ctx.fill();
    this.ctx.stroke();

    // Mark Peak Fundamental Frequency
    if (peakItem) {
      const px = pad.left + (peakItem.freq / maxFreq) * w;
      const py = pad.top + h * (1.0 - peakItem.magnitude / maxMag);

      this.ctx.fillStyle = '#fbbf24';
      this.ctx.beginPath();
      this.ctx.arc(px, py, 4, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.fillStyle = '#f8fafc';
      this.ctx.font = 'bold 11px system-ui, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(`f₀ = ${peakItem.freq.toFixed(2)} Hz`, px, py - 10);
    }

    this.ctx.restore();

    // Theoretical fundamental frequency
    const f0Theory = 1.0 / this.physics.getExactPeriod();

    this.drawLegend(pad, [
      { label: `Measured Peak: ${peakItem ? peakItem.freq.toFixed(3) : 0} Hz`, color: '#c084fc' },
      { label: `Theoretical f_exact: ${f0Theory.toFixed(3)} Hz`, color: '#fbbf24' }
    ]);
  }

  // ==========================================
  // SHARED UTILITIES
  // ==========================================
  drawChartAxes(pad, w, h, xLabel, yLabel) {
    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
    this.ctx.lineWidth = 1;

    // Grid lines
    const gridCols = 5;
    for (let i = 0; i <= gridCols; i++) {
      const x = pad.left + (i / gridCols) * w;
      this.ctx.beginPath();
      this.ctx.moveTo(x, pad.top);
      this.ctx.lineTo(x, pad.top + h);
      this.ctx.stroke();
    }

    const gridRows = 4;
    for (let j = 0; j <= gridRows; j++) {
      const y = pad.top + (j / gridRows) * h;
      this.ctx.beginPath();
      this.ctx.moveTo(pad.left, y);
      this.ctx.lineTo(pad.left + w, y);
      this.ctx.stroke();
    }

    // Border
    this.ctx.strokeStyle = '#475569';
    this.ctx.strokeRect(pad.left, pad.top, w, h);

    // Labels
    this.ctx.fillStyle = '#94a3b8';
    this.ctx.font = '11px system-ui, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(xLabel, pad.left + w / 2, pad.top + h + 24);

    this.ctx.save();
    this.ctx.translate(pad.left - 38, pad.top + h / 2);
    this.ctx.rotate(-Math.PI / 2);
    this.ctx.textAlign = 'center';
    this.ctx.fillText(yLabel, 0, 0);
    this.ctx.restore();

    this.ctx.restore();
  }

  plotSeries(xArr, yArr, xMin, xMax, yMin, yMax, pad, w, h, color, lineWidth) {
    if (xArr.length < 2) return;

    this.ctx.save();
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.beginPath();

    for (let i = 0; i < xArr.length; i++) {
      const xNorm = (xArr[i] - xMin) / (xMax - xMin);
      const yNorm = (yArr[i] - yMin) / (yMax - yMin);

      const px = pad.left + Math.max(0, Math.min(w, xNorm * w));
      const py = pad.top + h * (1.0 - Math.max(0, Math.min(1.0, yNorm)));

      if (i === 0) this.ctx.moveTo(px, py);
      else this.ctx.lineTo(px, py);
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  drawLegend(pad, items) {
    this.ctx.save();
    this.ctx.font = '11px system-ui, sans-serif';
    this.ctx.textAlign = 'left';
    this.ctx.textBaseline = 'middle';

    let curX = pad.left + 10;
    const curY = pad.top + 14;

    items.forEach(item => {
      // Color dot
      this.ctx.fillStyle = item.color;
      this.ctx.beginPath();
      this.ctx.arc(curX + 5, curY, 4, 0, Math.PI * 2);
      this.ctx.fill();

      // Text
      this.ctx.fillStyle = '#f8fafc';
      this.ctx.fillText(item.label, curX + 14, curY);

      curX += this.ctx.measureText(item.label).width + 28;
    });

    this.ctx.restore();
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = ScientificChartManager;
}
