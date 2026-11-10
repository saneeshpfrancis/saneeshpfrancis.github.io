/**
 * PendulumPhysicsEngine
 * Mathematical and computational physics engine for university-level pendulum dynamics.
 * Supports non-linear mechanics, multiple numerical integrators, exact elliptic integrals,
 * phase space flows, energy dissipation, periodic forcing, and FFT spectral analysis.
 */

class PendulumPhysics {
  constructor(params = {}) {
    // Physical Parameters
    this.length = params.length !== undefined ? params.length : 1.0; // m
    this.mass = params.mass !== undefined ? params.mass : 1.0; // kg
    this.gravity = params.gravity !== undefined ? params.gravity : 9.80665; // m/s^2
    this.damping = params.damping !== undefined ? params.damping : 0.05; // b/m, s^-1 (linear damping)
    this.quadraticDamping = params.quadraticDamping !== undefined ? params.quadraticDamping : 0.0; // c_d * rho * A / (2m)
    this.driveAmplitude = params.driveAmplitude !== undefined ? params.driveAmplitude : 0.0; // N*m or F_0/m
    this.driveFrequency = params.driveFrequency !== undefined ? params.driveFrequency : 0.6667; // rad/s or Hz

    // State Variables
    this.theta = params.theta !== undefined ? params.theta : Math.PI / 4; // radians (45 deg)
    this.omega = params.omega !== undefined ? params.omega : 0.0; // rad/s
    this.alpha = 0.0; // rad/s^2
    this.time = 0.0; // s

    // Constraints & Modeling Options
    this.rodType = params.rodType || 'rigid'; // 'rigid' or 'string'
    this.isSlack = false;
    this.integrator = params.integrator || 'rk4'; // 'rk4', 'verlet', 'euler-cromer', 'euler'

    // Initial energy tracking for drift calculation
    this.initialEnergy = this.calculateTotalEnergy();
    this.energyDriftPercent = 0.0;

    // Photogate & Cycle Measurement
    this.cycleCount = 0;
    this.lastZeroCrossTime = null;
    this.zeroCrossings = [];
    this.measuredPeriod = 0.0;
    this.periodHistory = [];
  }

  /**
   * Reset simulation state
   */
  reset(theta0 = Math.PI / 4, omega0 = 0.0) {
    this.theta = theta0;
    this.omega = omega0;
    this.alpha = this.computeAcceleration(this.theta, this.omega, 0.0);
    this.time = 0.0;
    this.isSlack = false;
    this.initialEnergy = this.calculateTotalEnergy();
    this.energyDriftPercent = 0.0;
    this.cycleCount = 0;
    this.lastZeroCrossTime = null;
    this.zeroCrossings = [];
    this.measuredPeriod = 0.0;
    this.periodHistory = [];
  }

  /**
   * Equations of motion: d^2(theta)/dt^2
   * domega/dt = - (g/L) * sin(theta) - gamma * omega - c_quad * omega * |omega| * L + (A / (m*L^2)) * cos(Omega * t)
   */
  computeAcceleration(theta, omega, t) {
    const restoring = -(this.gravity / this.length) * Math.sin(theta);
    const linDamp = -this.damping * omega;
    const quadDamp = -this.quadraticDamping * omega * Math.abs(omega) * this.length;
    
    let driving = 0.0;
    if (this.driveAmplitude > 0) {
      // driving torque / (m * L^2)
      driving = (this.driveAmplitude / (this.mass * this.length * this.length)) * Math.cos(this.driveFrequency * t);
    }

    return restoring + linDamp + quadDamp + driving;
  }

  /**
   * Complete Elliptic Integral of the First Kind K(k) using Arithmetic-Geometric Mean (AGM).
   * Converges quadratically in 4-6 iterations to machine precision (1e-15).
   */
  static ellipticK(k) {
    if (Math.abs(k) >= 1.0) return Infinity;
    if (Math.abs(k) < 1e-12) return Math.PI / 2;

    let a = 1.0;
    let g = Math.sqrt(1.0 - k * k);

    for (let i = 0; i < 20; i++) {
      const aNext = (a + g) * 0.5;
      const gNext = Math.sqrt(a * g);
      if (Math.abs(a - g) < 1e-15) {
        return Math.PI / (2.0 * aNext);
      }
      a = aNext;
      g = gNext;
    }
    return Math.PI / (2.0 * a);
  }

  /**
   * Theoretical Small Angle Period: T_0 = 2 * pi * sqrt(L / g)
   */
  getSmallAnglePeriod() {
    if (this.gravity <= 0 || this.length <= 0) return 0;
    return 2.0 * Math.PI * Math.sqrt(this.length / this.gravity);
  }

  /**
   * Exact Theoretical Period for initial amplitude theta0 using Jacobi Elliptic Integral:
   * T(theta0) = 4 * sqrt(L / g) * K(sin(theta0 / 2))
   */
  getExactPeriod(theta0 = Math.abs(this.theta)) {
    if (this.gravity <= 0 || this.length <= 0) return 0;
    const absTheta = Math.abs(theta0) % (2 * Math.PI);
    const normalizedTheta = absTheta > Math.PI ? 2 * Math.PI - absTheta : absTheta;
    
    if (normalizedTheta >= Math.PI - 1e-6) {
      return Infinity; // Separatrix asymptote
    }
    const k = Math.sin(normalizedTheta / 2.0);
    const K = PendulumPhysics.ellipticK(k);
    return 4.0 * Math.sqrt(this.length / this.gravity) * K;
  }

  /**
   * Borda's series approximation for comparison:
   * T = T_0 * (1 + 1/16 theta0^2 + 11/3072 theta0^4)
   */
  getBordaPeriod(theta0 = Math.abs(this.theta)) {
    const T0 = this.getSmallAnglePeriod();
    const th = Math.abs(theta0);
    return T0 * (1.0 + (1.0 / 16.0) * th * th + (11.0 / 3072.0) * Math.pow(th, 4));
  }

  /**
   * Kinetic Energy: T = 0.5 * m * (L * omega)^2
   */
  calculateKineticEnergy(omega = this.omega) {
    const v = this.length * omega;
    return 0.5 * this.mass * v * v;
  }

  /**
   * Potential Energy (Datum at bottom equilibrium theta = 0):
   * V = m * g * L * (1 - cos(theta))
   */
  calculatePotentialEnergy(theta = this.theta) {
    return this.mass * this.gravity * this.length * (1.0 - Math.cos(theta));
  }

  /**
   * Total Mechanical Energy: E = T + V
   */
  calculateTotalEnergy(theta = this.theta, omega = this.omega) {
    return this.calculateKineticEnergy(omega) + this.calculatePotentialEnergy(theta);
  }

  /**
   * Rod Tension: T_rod = m * (g * cos(theta) + L * omega^2)
   */
  calculateTension(theta = this.theta, omega = this.omega) {
    return this.mass * (this.gravity * Math.cos(theta) + this.length * omega * omega);
  }

  /**
   * Advance simulation by dt using the selected numerical method.
   * To maintain extreme numerical stability at degree level, caller can sub-step.
   */
  step(dt) {
    if (dt <= 0) return;

    // String slackness check
    if (this.rodType === 'string' && !this.isSlack) {
      const tension = this.calculateTension(this.theta, this.omega);
      if (tension < 0) {
        this.isSlack = true;
      }
    }

    const prevTheta = this.theta;

    switch (this.integrator) {
      case 'euler':
        this.stepEuler(dt);
        break;
      case 'euler-cromer':
        this.stepEulerCromer(dt);
        break;
      case 'verlet':
        this.stepVelocityVerlet(dt);
        break;
      case 'rk4':
      default:
        this.stepRK4(dt);
        break;
    }

    this.time += dt;

    // Detect zero crossings for experimental photogate period measurement
    this.detectZeroCrossing(prevTheta, this.theta, this.time);

    // Track energy drift
    if (this.damping === 0 && this.quadraticDamping === 0 && this.driveAmplitude === 0) {
      const currentEnergy = this.calculateTotalEnergy();
      if (Math.abs(this.initialEnergy) > 1e-9) {
        this.energyDriftPercent = ((currentEnergy - this.initialEnergy) / this.initialEnergy) * 100.0;
      }
    }
  }

  /**
   * 4th-Order Runge-Kutta (RK4) Integrator
   */
  stepRK4(dt) {
    const t = this.time;
    const th = this.theta;
    const om = this.omega;

    // k1
    const k1_th = om;
    const k1_om = this.computeAcceleration(th, om, t);

    // k2
    const th_k2 = th + 0.5 * dt * k1_th;
    const om_k2 = om + 0.5 * dt * k1_om;
    const k2_th = om_k2;
    const k2_om = this.computeAcceleration(th_k2, om_k2, t + 0.5 * dt);

    // k3
    const th_k3 = th + 0.5 * dt * k2_th;
    const om_k3 = om + 0.5 * dt * k2_om;
    const k3_th = om_k3;
    const k3_om = this.computeAcceleration(th_k3, om_k3, t + 0.5 * dt);

    // k4
    const th_k4 = th + dt * k3_th;
    const om_k4 = om + dt * k3_om;
    const k4_th = om_k4;
    const k4_om = this.computeAcceleration(th_k4, om_k4, t + dt);

    // Update
    this.theta += (dt / 6.0) * (k1_th + 2.0 * k2_th + 2.0 * k3_th + k4_th);
    this.omega += (dt / 6.0) * (k1_om + 2.0 * k2_om + 2.0 * k3_om + k4_om);
    this.alpha = this.computeAcceleration(this.theta, this.omega, t + dt);
  }

  /**
   * Velocity-Verlet (Symplectic, Order 2)
   */
  stepVelocityVerlet(dt) {
    const aCurrent = this.computeAcceleration(this.theta, this.omega, this.time);
    // Position step
    this.theta += this.omega * dt + 0.5 * aCurrent * dt * dt;
    
    // Preliminary velocity for damping calculation
    const omMid = this.omega + 0.5 * aCurrent * dt;
    const aNext = this.computeAcceleration(this.theta, omMid, this.time + dt);
    
    // Velocity step
    this.omega += 0.5 * (aCurrent + aNext) * dt;
    this.alpha = aNext;
  }

  /**
   * Semi-implicit Euler (Euler-Cromer - Symplectic, Order 1)
   */
  stepEulerCromer(dt) {
    const a = this.computeAcceleration(this.theta, this.omega, this.time);
    this.omega += a * dt;
    this.theta += this.omega * dt;
    this.alpha = a;
  }

  /**
   * Forward Euler (Unstable, Artificial Energy Growth)
   */
  stepEuler(dt) {
    const a = this.computeAcceleration(this.theta, this.omega, this.time);
    this.theta += this.omega * dt;
    this.omega += a * dt;
    this.alpha = a;
  }

  /**
   * Photogate zero-crossing detector with linear interpolation for high precision
   */
  detectZeroCrossing(prevTh, currTh, t) {
    // Check if sign flipped across zero
    if ((prevTh < 0 && currTh >= 0) || (prevTh > 0 && currTh <= 0)) {
      // Linear interpolation for exact time of crossing
      const frac = Math.abs(prevTh) / (Math.abs(prevTh) + Math.abs(currTh));
      const exactCrossingTime = (t - 0.001) + frac * 0.001; // approximate dt slice
      
      const direction = currTh > prevTh ? +1 : -1;

      // Only count full cycles (e.g. crossing in the same direction, +1)
      if (direction === +1) {
        if (this.lastZeroCrossTime !== null) {
          const period = exactCrossingTime - this.lastZeroCrossTime;
          if (period > 0.1) { // debounce jitter
            this.measuredPeriod = period;
            this.periodHistory.push(period);
            if (this.periodHistory.length > 20) this.periodHistory.shift();
            this.cycleCount++;
          }
        }
        this.lastZeroCrossTime = exactCrossingTime;
      }
    }
  }

  /**
   * Average experimentally measured period over recent cycles
   */
  getAverageMeasuredPeriod() {
    if (this.periodHistory.length === 0) return this.measuredPeriod;
    const sum = this.periodHistory.reduce((acc, p) => acc + p, 0);
    return sum / this.periodHistory.length;
  }

  /**
   * Separatrix velocity at given angle theta:
   * E_sep = 2 * m * g * L ==> omega_sep = +/- 2 * sqrt(g / L) * cos(theta / 2)
   */
  getSeparatrixOmega(theta) {
    const omega0 = Math.sqrt(this.gravity / this.length);
    return 2.0 * omega0 * Math.cos(theta * 0.5);
  }

  /**
   * Discrete Fourier Transform (FFT) on time series buffer
   * Computes power spectrum for non-linear frequency analysis.
   */
  static computeFFT(signal, sampleRate) {
    const N = signal.length;
    // Radix-2 Cooley-Tukey (pad or truncate to power of 2)
    const p = Math.floor(Math.log2(N));
    const powerOfTwoN = Math.pow(2, Math.min(p, 10)); // max 1024
    const real = new Float64Array(powerOfTwoN);
    const imag = new Float64Array(powerOfTwoN);

    // Apply Hanning Window to reduce spectral leakage
    for (let i = 0; i < powerOfTwoN; i++) {
      const window = 0.5 * (1.0 - Math.cos((2.0 * Math.PI * i) / (powerOfTwoN - 1)));
      real[i] = signal[N - powerOfTwoN + i] * window;
      imag[i] = 0.0;
    }

    // Bit-reversal permutation
    let j = 0;
    for (let i = 0; i < powerOfTwoN - 1; i++) {
      if (i < j) {
        const tr = real[i]; real[i] = real[j]; real[j] = tr;
        const ti = imag[i]; imag[i] = imag[j]; imag[j] = ti;
      }
      let k = powerOfTwoN >> 1;
      while (k <= j) {
        j -= k;
        k >>= 1;
      }
      j += k;
    }

    // Cooley-Tukey butterfly
    for (let len = 2; len <= powerOfTwoN; len <<= 1) {
      const half = len >> 1;
      const angle = (-2.0 * Math.PI) / len;
      const wStepR = Math.cos(angle);
      const wStepI = Math.sin(angle);

      for (let i = 0; i < powerOfTwoN; i += len) {
        let wr = 1.0;
        let wi = 0.0;
        for (let m = 0; m < half; m++) {
          const pos = i + m;
          const matchPos = pos + half;
          const tr = wr * real[matchPos] - wi * imag[matchPos];
          const ti = wr * imag[matchPos] + wi * real[matchPos];
          real[matchPos] = real[pos] - tr;
          imag[matchPos] = imag[pos] - ti;
          real[pos] += tr;
          imag[pos] += ti;

          const nextWr = wr * wStepR - wi * wStepI;
          wi = wr * wStepI + wi * wStepR;
          wr = nextWr;
        }
      }
    }

    // Compute magnitude spectrum
    const spectrum = [];
    const nyquistIndex = powerOfTwoN / 2;
    const freqBinWidth = sampleRate / powerOfTwoN;

    for (let i = 1; i < nyquistIndex; i++) {
      const mag = Math.sqrt(real[i] * real[i] + imag[i] * imag[i]) / (powerOfTwoN / 2);
      spectrum.push({
        freq: i * freqBinWidth,
        magnitude: mag,
        powerDb: 20 * Math.log10(Math.max(mag, 1e-6))
      });
    }

    return spectrum;
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PendulumPhysics;
}
