/**
 * PendulumLabApp
 * Main application coordinator for the University Physical Science Pendulum Simulator.
 * Bridges physics engine, 2D renderer, real-time charts, UI controls, photogate timer,
 * preset configurations, data table recording, and CSV export.
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Physics Engine
  const physics = new PendulumPhysics({
    length: 1.0,
    mass: 1.0,
    gravity: 9.80665,
    damping: 0.05,
    theta: Math.PI / 4, // 45 deg
    omega: 0.0,
    integrator: 'rk4',
    rodType: 'rigid'
  });

  // 2. Canvases & Systems
  const simCanvas = document.getElementById('sim-canvas');
  const chartCanvas = document.getElementById('chart-canvas');

  const renderer = new PendulumRenderer(simCanvas, physics);
  const chartManager = new ScientificChartManager(chartCanvas, physics);

  // Simulation execution loop state
  let isRunning = true;
  let timeScale = 1.0;
  let fixedDt = 0.005; // 5ms physics internal step for ultra-high numerical accuracy
  let subSteps = 4; // 4 sub-steps per animation frame (200 Hz integration)
  let lastFrameTime = performance.now();

  // Data Recording
  let isRecording = false;
  const recordedData = [];
  const maxTableRows = 100;

  // DOM Elements
  const playPauseBtn = document.getElementById('btn-play-pause');
  const stepBtn = document.getElementById('btn-step');
  const resetBtn = document.getElementById('btn-reset');
  const timeScaleSelect = document.getElementById('time-scale-select');

  // Sliders and Value Displays
  const lengthInput = document.getElementById('input-length');
  const lengthVal = document.getElementById('val-length');
  const massInput = document.getElementById('input-mass');
  const massVal = document.getElementById('val-mass');
  const gravitySelect = document.getElementById('select-gravity');
  const gravityInput = document.getElementById('input-gravity');
  const gravityVal = document.getElementById('val-gravity');
  const angleInput = document.getElementById('input-angle');
  const angleVal = document.getElementById('val-angle');
  const omegaInput = document.getElementById('input-omega');
  const omegaVal = document.getElementById('val-omega');
  const dampingInput = document.getElementById('input-damping');
  const dampingVal = document.getElementById('val-damping');
  const quadDampingInput = document.getElementById('input-quad-damping');
  const quadDampingVal = document.getElementById('val-quad-damping');
  const driveAmpInput = document.getElementById('input-drive-amp');
  const driveAmpVal = document.getElementById('val-drive-amp');
  const driveFreqInput = document.getElementById('input-drive-freq');
  const driveFreqVal = document.getElementById('val-drive-freq');
  const integratorSelect = document.getElementById('select-integrator');
  const rodTypeSelect = document.getElementById('select-rod-type');

  // Visual Toggles
  const toggleVectors = document.getElementById('chk-vectors');
  const toggleVelocity = document.getElementById('chk-velocity');
  const toggleAccel = document.getElementById('chk-accel');
  const toggleForces = document.getElementById('chk-forces');
  const toggleProtractor = document.getElementById('chk-protractor');
  const toggleTrace = document.getElementById('chk-trace');
  const togglePhotogate = document.getElementById('chk-photogate');

  // Measurement Cards
  const textT0 = document.getElementById('readout-t0');
  const textExactT = document.getElementById('readout-exact-t');
  const textMeasT = document.getElementById('readout-meas-t');
  const textRatio = document.getElementById('readout-ratio');
  const textEnergyDrift = document.getElementById('readout-drift');
  const textCycles = document.getElementById('readout-cycles');

  // Data Table Elements
  const dataTableBody = document.querySelector('#data-table tbody');
  const btnToggleRecord = document.getElementById('btn-toggle-record');
  const btnExportCSV = document.getElementById('btn-export-csv');
  const btnClearData = document.getElementById('btn-clear-data');

  // Presets Buttons
  const presetButtons = document.querySelectorAll('.preset-btn');

  // Theory Modal
  const btnTheory = document.getElementById('btn-theory-guide');
  const modalTheory = document.getElementById('modal-theory');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Chart Mode Tabs
  const chartTabBtns = document.querySelectorAll('.chart-tab-btn');

  // Window Resize
  window.addEventListener('resize', () => {
    renderer.resize();
    chartManager.resize();
  });

  // ==========================================
  // UI EVENT BINDINGS
  // ==========================================

  // Play / Pause
  playPauseBtn.addEventListener('click', () => {
    isRunning = !isRunning;
    playPauseBtn.innerHTML = isRunning 
      ? '<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>Pause' 
      : '<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Play';
    playPauseBtn.classList.toggle('btn-primary', !isRunning);
    playPauseBtn.classList.toggle('btn-accent', isRunning);
  });

  // Step Frame
  stepBtn.addEventListener('click', () => {
    isRunning = false;
    playPauseBtn.innerHTML = '<svg class="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>Play';
    for (let s = 0; s < subSteps; s++) {
      physics.step(fixedDt);
    }
    chartManager.recordSample();
    updateUIReadouts();
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    const th0 = (parseFloat(angleInput.value) * Math.PI) / 180;
    const om0 = parseFloat(omegaInput.value);
    physics.reset(th0, om0);
    chartManager.clear();
    renderer.trail = [];
    updateUIReadouts();
  });

  // Time scale
  timeScaleSelect.addEventListener('change', (e) => {
    timeScale = parseFloat(e.target.value);
  });

  // Length slider
  lengthInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.length = val;
    lengthVal.textContent = val.toFixed(2) + ' m';
    renderer.resize();
    updateUIReadouts();
  });

  // Mass slider
  massInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.mass = val;
    massVal.textContent = val.toFixed(2) + ' kg';
    updateUIReadouts();
  });

  // Gravity selector & custom input
  gravitySelect.addEventListener('change', (e) => {
    const val = e.target.value;
    if (val !== 'custom') {
      const g = parseFloat(val);
      physics.gravity = g;
      gravityInput.value = g;
      gravityVal.textContent = g.toFixed(3) + ' m/s²';
    }
    updateUIReadouts();
  });

  gravityInput.addEventListener('input', (e) => {
    const g = parseFloat(e.target.value);
    physics.gravity = g;
    gravityVal.textContent = g.toFixed(3) + ' m/s²';
    gravitySelect.value = 'custom';
    updateUIReadouts();
  });

  // Angle slider
  angleInput.addEventListener('input', (e) => {
    const deg = parseFloat(e.target.value);
    const rad = (deg * Math.PI) / 180;
    physics.theta = rad;
    physics.omega = 0.0;
    physics.alpha = 0.0;
    physics.time = 0.0;
    physics.initialEnergy = physics.calculateTotalEnergy();
    physics.energyDriftPercent = 0.0;
    angleVal.textContent = deg.toFixed(1) + '° (' + rad.toFixed(2) + ' rad)';
    updateUIReadouts();
  });

  // Omega slider
  omegaInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.omega = val;
    physics.initialEnergy = physics.calculateTotalEnergy();
    omegaVal.textContent = val.toFixed(2) + ' rad/s';
    updateUIReadouts();
  });

  // Damping sliders
  dampingInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.damping = val;
    dampingVal.textContent = val.toFixed(3) + ' s⁻¹';
  });

  quadDampingInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.quadraticDamping = val;
    quadDampingVal.textContent = val.toFixed(4);
  });

  // Driving force
  driveAmpInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.driveAmplitude = val;
    driveAmpVal.textContent = val.toFixed(2) + ' N·m';
  });

  driveFreqInput.addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    physics.driveFrequency = val;
    driveFreqVal.textContent = val.toFixed(3) + ' rad/s';
  });

  // Integrator selector
  integratorSelect.addEventListener('change', (e) => {
    physics.integrator = e.target.value;
  });

  // Rod Type
  rodTypeSelect.addEventListener('change', (e) => {
    physics.rodType = e.target.value;
    physics.isSlack = false;
  });

  // Visual Overlays toggles
  toggleVectors.addEventListener('change', (e) => { renderer.options.showVectors = e.target.checked; });
  toggleVelocity.addEventListener('change', (e) => { renderer.options.showVelocity = e.target.checked; });
  toggleAccel.addEventListener('change', (e) => { renderer.options.showAcceleration = e.target.checked; });
  toggleForces.addEventListener('change', (e) => { renderer.options.showForces = e.target.checked; });
  toggleProtractor.addEventListener('change', (e) => { renderer.options.showProtractor = e.target.checked; });
  toggleTrace.addEventListener('change', (e) => { 
    renderer.options.showTrace = e.target.checked;
    if (!e.target.checked) renderer.trail = [];
  });
  togglePhotogate.addEventListener('change', (e) => { renderer.options.showPhotogate = e.target.checked; });

  // Chart Tab Buttons
  chartTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      chartTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      chartManager.setMode(btn.dataset.chart);
    });
  });

  // Presets Application
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      applyPreset(btn.dataset.preset);
    });
  });

  function applyPreset(name) {
    chartManager.clear();
    renderer.trail = [];

    switch (name) {
      case 'shm':
        // Small-angle harmonic motion (< 5 deg)
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.0;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 0.0;
        physics.integrator = 'rk4';
        physics.reset((5.0 * Math.PI) / 180, 0.0);
        break;

      case 'large-amplitude':
        // 90 deg initial angle, showing large period lengthening
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.0;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 0.0;
        physics.integrator = 'rk4';
        physics.reset((90.0 * Math.PI) / 180, 0.0);
        break;

      case 'separatrix':
        // Near-inverted state (179.5 deg)
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.0;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 0.0;
        physics.integrator = 'rk4';
        physics.reset((179.5 * Math.PI) / 180, 0.0);
        break;

      case 'euler-instability':
        // Demonstrating Forward Euler catastrophic energy divergence
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.0;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 0.0;
        physics.integrator = 'euler';
        physics.reset((30.0 * Math.PI) / 180, 0.0);
        chartManager.setMode('energy');
        syncChartTabs('energy');
        break;

      case 'damped':
        // Underdamped oscillation
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.25;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 0.0;
        physics.integrator = 'rk4';
        physics.reset((60.0 * Math.PI) / 180, 0.0);
        break;

      case 'resonance':
        // Driven at natural frequency: omega0 = sqrt(g/L) ~ 3.13 rad/s
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.15;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 1.2;
        physics.driveFrequency = Math.sqrt(9.80665 / 1.0); // 3.1315 rad/s
        physics.integrator = 'rk4';
        physics.reset(0.0, 0.0);
        break;

      case 'chaos':
        // Non-linear driven damped chaotic pendulum
        physics.length = 1.0;
        physics.mass = 1.0;
        physics.gravity = 9.80665;
        physics.damping = 0.5;
        physics.quadraticDamping = 0.0;
        physics.driveAmplitude = 1.2;
        physics.driveFrequency = 2.0 / 3.0; // 0.6667 rad/s
        physics.integrator = 'rk4';
        physics.reset((60.0 * Math.PI) / 180, 0.0);
        chartManager.setMode('phase');
        syncChartTabs('phase');
        break;
    }

    syncControlsToPhysics();
    updateUIReadouts();
  }

  function syncChartTabs(mode) {
    chartTabBtns.forEach(b => {
      b.classList.toggle('active', b.dataset.chart === mode);
    });
  }

  function syncControlsToPhysics() {
    lengthInput.value = physics.length;
    lengthVal.textContent = physics.length.toFixed(2) + ' m';
    massInput.value = physics.mass;
    massVal.textContent = physics.mass.toFixed(2) + ' kg';
    gravityInput.value = physics.gravity;
    gravityVal.textContent = physics.gravity.toFixed(3) + ' m/s²';
    const deg = (physics.theta * 180) / Math.PI;
    angleInput.value = deg;
    angleVal.textContent = deg.toFixed(1) + '° (' + physics.theta.toFixed(2) + ' rad)';
    omegaInput.value = physics.omega;
    omegaVal.textContent = physics.omega.toFixed(2) + ' rad/s';
    dampingInput.value = physics.damping;
    dampingVal.textContent = physics.damping.toFixed(3) + ' s⁻¹';
    quadDampingInput.value = physics.quadraticDamping;
    quadDampingVal.textContent = physics.quadraticDamping.toFixed(4);
    driveAmpInput.value = physics.driveAmplitude;
    driveAmpVal.textContent = physics.driveAmplitude.toFixed(2) + ' N·m';
    driveFreqInput.value = physics.driveFrequency;
    driveFreqVal.textContent = physics.driveFrequency.toFixed(3) + ' rad/s';
    integratorSelect.value = physics.integrator;
    renderer.resize();
  }

  // ==========================================
  // DATA TABLE RECORDING & CSV EXPORT
  // ==========================================
  btnToggleRecord.addEventListener('click', () => {
    isRecording = !isRecording;
    btnToggleRecord.innerHTML = isRecording
      ? '<span class="inline-block w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse mr-1"></span>Stop Recording'
      : '<svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>Record Data';
    btnToggleRecord.classList.toggle('btn-danger', isRecording);
  });

  btnClearData.addEventListener('click', () => {
    recordedData.length = 0;
    dataTableBody.innerHTML = '';
  });

  btnExportCSV.addEventListener('click', () => {
    if (recordedData.length === 0) {
      alert('No recorded data points yet. Click "Record Data" during simulation.');
      return;
    }

    const headers = ['Time_s', 'Theta_rad', 'Theta_deg', 'Omega_rad_s', 'Alpha_rad_s2', 'KE_J', 'PE_J', 'TotalE_J', 'Tension_N'];
    const rows = recordedData.map(d => [
      d.time.toFixed(4),
      d.theta.toFixed(5),
      ((d.theta * 180) / Math.PI).toFixed(3),
      d.omega.toFixed(5),
      d.alpha.toFixed(5),
      d.ke.toFixed(5),
      d.pe.toFixed(5),
      d.totalE.toFixed(5),
      d.tension.toFixed(5)
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pendulum_lab_data_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });

  let recordThrottle = 0;
  function handleDataRecording() {
    if (!isRecording) return;
    recordThrottle++;
    if (recordThrottle % 6 !== 0) return; // ~10 samples per sec

    const dataPoint = {
      time: physics.time,
      theta: physics.theta,
      omega: physics.omega,
      alpha: physics.alpha,
      ke: physics.calculateKineticEnergy(),
      pe: physics.calculatePotentialEnergy(),
      totalE: physics.calculateTotalEnergy(),
      tension: physics.calculateTension()
    };

    recordedData.push(dataPoint);

    // Append row to DOM table
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${dataPoint.time.toFixed(2)}</td>
      <td>${dataPoint.theta.toFixed(3)} (${((dataPoint.theta * 180) / Math.PI).toFixed(1)}°)</td>
      <td>${dataPoint.omega.toFixed(3)}</td>
      <td>${dataPoint.ke.toFixed(3)}</td>
      <td>${dataPoint.pe.toFixed(3)}</td>
      <td>${dataPoint.totalE.toFixed(3)}</td>
      <td>${dataPoint.tension.toFixed(2)}</td>
    `;

    if (dataTableBody.children.length >= maxTableRows) {
      dataTableBody.removeChild(dataTableBody.firstChild);
    }
    dataTableBody.appendChild(row);
    dataTableBody.parentElement.scrollTop = dataTableBody.parentElement.scrollHeight;
  }

  // ==========================================
  // THEORY MODAL
  // ==========================================
  btnTheory.addEventListener('click', () => {
    modalTheory.classList.remove('hidden');
  });

  btnCloseModal.addEventListener('click', () => {
    modalTheory.classList.add('hidden');
  });

  window.addEventListener('click', (e) => {
    if (e.target === modalTheory) {
      modalTheory.classList.add('hidden');
    }
  });

  // ==========================================
  // UPDATE GAUGES AND METRICS
  // ==========================================
  function updateUIReadouts() {
    const T0 = physics.getSmallAnglePeriod();
    const T_exact = physics.getExactPeriod();
    const T_meas = physics.getAverageMeasuredPeriod();

    textT0.textContent = `${T0.toFixed(4)} s`;
    textExactT.textContent = isFinite(T_exact) ? `${T_exact.toFixed(4)} s` : '∞ (Separatrix)';
    textMeasT.textContent = T_meas > 0 ? `${T_meas.toFixed(4)} s` : '--';

    if (isFinite(T_exact) && T0 > 0) {
      const ratio = T_exact / T0;
      textRatio.textContent = `${ratio.toFixed(4)}× (${((ratio - 1) * 100).toFixed(2)}% longer)`;
    } else {
      textRatio.textContent = '--';
    }

    textEnergyDrift.textContent = `${physics.energyDriftPercent > 0 ? '+' : ''}${physics.energyDriftPercent.toFixed(3)}%`;
    textCycles.textContent = physics.cycleCount;
  }

  // ==========================================
  // MAIN ANIMATION / SIMULATION LOOP
  // ==========================================
  function animate(now) {
    requestAnimationFrame(animate);

    const deltaMs = Math.min(now - lastFrameTime, 100); // clamp for tab switching
    lastFrameTime = now;

    if (isRunning && !renderer.isDragging) {
      // Internal sub-stepping for extreme numerical stability
      const effectiveDt = (fixedDt * timeScale);
      for (let s = 0; s < subSteps; s++) {
        physics.step(effectiveDt);
      }

      chartManager.recordSample();
      handleDataRecording();
      updateUIReadouts();
    }

    // Render Canvas Views
    renderer.render();
    chartManager.render();
  }

  // Kickstart
  syncControlsToPhysics();
  updateUIReadouts();
  requestAnimationFrame(animate);
});
