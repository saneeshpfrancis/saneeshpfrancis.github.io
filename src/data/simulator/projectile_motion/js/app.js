/**
 * Main Application Controller for Projectile Motion Simulation
 * Orchestrates Physics, Renderer, Telemetry Graphs, Lab Protocols, and Interactive UI
 */

import { PhysicsEngine } from './physics.js';
import { PROJECTILE_PRESETS, CELESTIAL_PRESETS } from './projectiles.js';
import { TapeMeasure, Photogate, Target, ObstacleWall } from './instruments.js';
import { SimulationRenderer } from './renderer.js';
import { ScienceGrapher } from './graphs.js';
import { SoundEffects } from './audio.js';
import { GUIDED_EXPERIMENTS, CHALLENGES } from './experiments.js';

export class App {
    constructor() {
        this.physics = new PhysicsEngine();
        this.audio = new SoundEffects();

        // Canvas & Subsystems
        this.simCanvas = document.getElementById('sim-canvas');
        this.renderer = new SimulationRenderer(this.simCanvas);

        this.graphCanvas = document.getElementById('graph-canvas');
        this.grapher = new ScienceGrapher(this.graphCanvas);

        // Simulation State
        this.currentLevel = 'basic'; // 'basic', 'intermediate', 'advance', 'challenges'
        this.simState = 'idle';      // 'idle', 'running', 'paused', 'landed'
        this.simSpeed = 1.0;         // Multiplier: 0.1, 0.25, 0.5, 1.0, 2.0
        this.activeProjectile = { ...PROJECTILE_PRESETS.cannonball };
        this.activeCelestial = { ...CELESTIAL_PRESETS.earth };

        // Core Launch Parameters
        this.launchSpeed = 20.0;     // m/s
        this.launchAngle = 45.0;     // deg
        this.launchHeight = 0.0;     // m

        // Live Simulation Data
        this.currentState = null;
        this.trajectoryHistory = [];
        this.pastTrials = [];        // Max 8 previous trials
        this.trialCounter = 0;
        this.lastTime = 0;

        // Scientific Instruments
        this.tape = new TapeMeasure(0, 0, 30, 0);
        this.photogates = [
            new Photogate(1, 'Gate 1', 15, 0, 15),
            new Photogate(2, 'Gate 2', 30, 0, 15)
        ];
        this.target = new Target(35, 0, 2.5);
        this.wall = new ObstacleWall(25, 1.2, 10);

        // Dragging & Interaction
        this.isInteracting = false;
        this.draggedEntity = null;
        this.dragOffset = { x: 0, y: 0 };
        this.isPanning = false;
        this.panStart = { x: 0, y: 0 };

        // Data Log for Science Experiments
        this.trialLogs = [];

        this.init();
    }

    init() {
        this.bindEvents();
        this.bindCanvasInteractions();
        this.updateAnalyticalPredictions();
        this.updateUIControls();
        this.renderExperimentList();
        this.renderChallengeList();
        this.syncPhysicsWithCelestial();

        // Start render / physics loop
        requestAnimationFrame((t) => this.loop(t));
    }

    syncPhysicsWithCelestial() {
        this.physics.gravity = this.activeCelestial.gravity;
        this.physics.airDensity = this.activeCelestial.airDensity;
        if (this.currentLevel === 'basic') {
            this.physics.enableDrag = false;
            this.physics.enableWind = false;
            this.physics.enableMagnus = false;
        }
    }

    updateUIControls() {
        // Sliders & Number inputs
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val;
        };
        const setText = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setVal('speed-slider', this.launchSpeed);
        setVal('speed-input', this.launchSpeed);
        setVal('angle-slider', this.launchAngle);
        setVal('angle-input', this.launchAngle);
        setVal('height-slider', this.launchHeight);
        setVal('height-input', this.launchHeight);

        setText('val-speed', `${this.launchSpeed.toFixed(1)} m/s`);
        setText('val-angle', `${this.launchAngle.toFixed(1)}°`);
        setText('val-height', `${this.launchHeight.toFixed(1)} m`);

        // Gravity & Air density
        setVal('gravity-slider', this.physics.gravity);
        setText('val-gravity', `${this.physics.gravity.toFixed(2)} m/s²`);
        setVal('density-slider', this.physics.airDensity);
        setText('val-density', `${this.physics.airDensity.toFixed(3)} kg/m³`);

        // Wind & Magnus
        setVal('wind-slider', this.physics.windSpeedX);
        setText('val-wind', `${this.physics.windSpeedX.toFixed(1)} m/s`);
        setVal('spin-slider', this.physics.spinRate);
        setText('val-spin', `${this.physics.spinRate.toFixed(1)} rad/s`);

        // Projectile params
        setVal('custom-mass', this.activeProjectile.mass);
        setVal('custom-diameter', this.activeProjectile.diameter);
        setVal('custom-drag', this.activeProjectile.dragCoefficient);
    }

    /**
     * Compute and display ideal analytical physics theory predictions
     */
    updateAnalyticalPredictions() {
        const pred = PhysicsEngine.getIdealAnalytical(
            this.launchSpeed,
            this.launchAngle,
            this.launchHeight,
            this.physics.gravity
        );

        const setMath = (id, text) => {
            const el = document.getElementById(id);
            if (el) el.textContent = text;
        };

        setMath('pred-range', `${pred.totalRange.toFixed(2)} m`);
        setMath('pred-height', `${pred.maxH.toFixed(2)} m`);
        setMath('pred-time', `${pred.tFlight.toFixed(2)} s`);
        setMath('pred-optimal', `${pred.optimalAngleDeg.toFixed(1)}°`);
        setMath('pred-vimpact', `${pred.vImpact.toFixed(2)} m/s (${pred.impactAngleDeg.toFixed(1)}°)`);

        // Theoretical curve points for ghost overlay
        const ghostSim = this.physics.simulateFullTrajectory(
            this.launchSpeed,
            this.launchAngle,
            this.launchHeight,
            this.activeProjectile
        );
        this.theoreticalCurve = ghostSim.points;
    }

    /**
     * Launch or Relaunch the projectile
     */
    fire() {
        this.audio.playFire();

        const rad = (this.launchAngle * Math.PI) / 180;
        this.currentState = {
            x: 0,
            y: this.launchHeight,
            vx: this.launchSpeed * Math.cos(rad),
            vy: this.launchSpeed * Math.sin(rad),
            t: 0,
            ax: 0,
            ay: -this.physics.gravity
        };

        this.trajectoryHistory = [ { ...this.currentState } ];
        this.simState = 'running';
        this.grapher.reset();

        // Reset photogates & target
        this.photogates.forEach(pg => pg.reset());
        this.target.hitScore = null;

        // Auto-frame view if trajectory is outside current viewport
        const approxRange = this.theoreticalCurve.length > 0 ?
            this.theoreticalCurve[this.theoreticalCurve.length - 1].x : 40;
        const approxHeight = Math.max(15, this.launchHeight * 1.5);
        this.renderer.fitToTrajectory(approxRange, approxHeight);

        this.updateSimButtons();
    }

    pauseToggle() {
        if (this.simState === 'running') {
            this.simState = 'paused';
        } else if (this.simState === 'paused') {
            this.simState = 'running';
        }
        this.updateSimButtons();
    }

    stepFrame() {
        if (this.simState === 'idle') {
            this.fire();
            this.simState = 'paused';
        } else if (this.simState === 'running') {
            this.simState = 'paused';
        }

        if (this.currentState && this.simState === 'paused') {
            this.advancePhysics(0.02); // 20ms step
            this.renderer.renderFrame?.();
        }
    }

    reset() {
        this.simState = 'idle';
        this.currentState = null;
        this.trajectoryHistory = [];
        this.grapher.reset();
        this.photogates.forEach(pg => pg.reset());
        this.target.hitScore = null;
        this.updateSimButtons();
        this.updateHUD(null);
    }

    clearTrails() {
        this.pastTrials = [];
        this.trajectoryHistory = [];
        this.renderer.particles = [];
        this.renderer.confetti = [];
        this.renderTrialTable();
    }

    /**
     * Advance physical state by dt seconds
     */
    advancePhysics(dt) {
        if (!this.currentState) return;

        const subStep = this.physics.fixedDeltaTime;
        let remaining = dt;

        while (remaining > 0 && this.simState === 'running') {
            const stepDt = Math.min(subStep, remaining);
            const prevState = { ...this.currentState };
            const nextState = this.physics.step(this.currentState, this.activeProjectile, stepDt);

            // Check Photogates
            this.photogates.forEach(pg => {
                const trig = pg.checkTrigger(prevState, nextState);
                if (trig) {
                    this.audio.playBeep();
                }
            });

            // Check Obstacle Wall Collision
            if (this.wall.enabled && this.wall.checkCollision(nextState.x, nextState.y, this.activeProjectile.diameter / 2)) {
                this.audio.playImpact();
                this.simState = 'landed';
                this.onLanding(nextState, true);
                break;
            }

            // Check Ground Collision
            if (nextState.y <= 0) {
                // Exact root finding
                const frac = (0 - prevState.y) / (nextState.y - prevState.y || 0.0001);
                const impactT = prevState.t + frac * stepDt;
                const impactX = prevState.x + frac * (nextState.x - prevState.x);
                const impactVx = prevState.vx + frac * (nextState.vx - prevState.vx);
                const impactVy = prevState.vy + frac * (nextState.vy - prevState.vy);

                this.currentState = {
                    x: Math.max(0, impactX),
                    y: 0,
                    vx: impactVx,
                    vy: impactVy,
                    t: impactT,
                    ax: nextState.ax,
                    ay: nextState.ay
                };
                this.trajectoryHistory.push({ ...this.currentState });

                this.simState = 'landed';
                this.audio.playImpact();
                this.onLanding(this.currentState, false);
                break;
            }

            this.currentState = nextState;
            this.trajectoryHistory.push({ ...this.currentState });

            // Spawn smoke trail
            if (Math.random() < 0.3) {
                this.renderer.spawnSmoke(this.currentState.x, this.currentState.y);
            }

            // Telemetry graphing
            const energies = this.physics.computeEnergies(this.currentState, this.activeProjectile);
            this.grapher.addDataPoint({
                t: this.currentState.t,
                x: this.currentState.x,
                y: this.currentState.y,
                vx: this.currentState.vx,
                vy: this.currentState.vy,
                v: energies.speed,
                ke: energies.kinetic,
                pe: energies.potential,
                totalE: energies.total
            });

            remaining -= stepDt;
        }

        this.updateHUD(this.currentState);
    }

    onLanding(finalState, hitWall = false) {
        this.updateSimButtons();

        // Check Target hit
        const hit = this.target.checkHit(finalState.x, finalState.y);
        if (hit) {
            this.audio.playChime();
            this.renderer.spawnConfetti(this.target.x, this.target.y);
        }

        // Save Trial to Past Trials
        this.trialCounter++;
        const trialColors = ['#38bdf8', '#f43f5e', '#a855f7', '#10b981', '#f59e0b', '#ec4899', '#06b6d4', '#eab308'];
        const trialColor = trialColors[(this.trialCounter - 1) % trialColors.length];

        const trialRecord = {
            trialNum: this.trialCounter,
            points: [ ...this.trajectoryHistory ],
            color: trialColor,
            v0: this.launchSpeed,
            angle: this.launchAngle,
            y0: this.launchHeight,
            range: finalState.x,
            tFlight: finalState.t,
            vImpact: Math.sqrt(finalState.vx * finalState.vx + finalState.vy * finalState.vy),
            planet: this.activeCelestial.name,
            drag: this.physics.enableDrag ? 'Yes' : 'No',
            hitScore: hit ? hit.score : 0,
            hitWall
        };

        this.pastTrials.push(trialRecord);
        if (this.pastTrials.length > 8) this.pastTrials.shift();

        this.trialLogs.push(trialRecord);
        this.renderTrialTable();
        this.grapher.render();
    }

    updateHUD(state) {
        if (!state) {
            document.getElementById('hud-time').textContent = '0.00 s';
            document.getElementById('hud-x').textContent = '0.00 m';
            document.getElementById('hud-y').textContent = `${this.launchHeight.toFixed(2)} m`;
            document.getElementById('hud-speed').textContent = `${this.launchSpeed.toFixed(2)} m/s`;
            document.getElementById('hud-ke').textContent = '0.0 J';
            document.getElementById('hud-pe').textContent = '0.0 J';
            return;
        }

        const energies = this.physics.computeEnergies(state, this.activeProjectile);
        document.getElementById('hud-time').textContent = `${state.t.toFixed(2)} s`;
        document.getElementById('hud-x').textContent = `${state.x.toFixed(2)} m`;
        document.getElementById('hud-y').textContent = `${Math.max(0, state.y).toFixed(2)} m`;
        document.getElementById('hud-speed').textContent = `${energies.speed.toFixed(2)} m/s`;
        document.getElementById('hud-ke').textContent = `${energies.kinetic.toFixed(1)} J`;
        document.getElementById('hud-pe').textContent = `${energies.potential.toFixed(1)} J`;
    }

    updateSimButtons() {
        const playBtn = document.getElementById('btn-play-pause');
        if (!playBtn) return;
        if (this.simState === 'running') {
            playBtn.innerHTML = '<span>⏸️</span> Pause';
            playBtn.classList.add('btn-active');
        } else {
            playBtn.innerHTML = '<span>▶️</span> Resume';
            playBtn.classList.remove('btn-active');
        }
    }

    /**
     * Main animation and physics execution loop
     */
    loop(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        const elapsedSec = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Advance physics if running
        if (this.simState === 'running') {
            const dt = Math.min(0.06, elapsedSec) * this.simSpeed;
            this.advancePhysics(dt);
        }

        // Render Canvas
        this.renderer.clear(this.activeCelestial);
        this.renderer.drawGrid(this.activeCelestial);
        this.renderer.drawGhostTrails(this.pastTrials);
        this.renderer.drawTheoreticalTrajectory(this.theoreticalCurve);
        this.renderer.drawTarget(this.target);
        this.renderer.drawObstacle(this.wall);
        this.renderer.drawPhotogates(this.photogates);
        this.renderer.drawTapeMeasure(this.tape);
        this.renderer.drawCannon(this.launchHeight, this.launchAngle);

        // Find apex point
        let apex = null;
        let maxY = -1;
        this.trajectoryHistory.forEach(pt => {
            if (pt.y > maxY) {
                maxY = pt.y;
                apex = pt;
            }
        });
        const landing = this.simState === 'landed' && this.trajectoryHistory.length > 0 ?
            this.trajectoryHistory[this.trajectoryHistory.length - 1] : null;

        this.renderer.drawActiveTrail(this.trajectoryHistory, this.currentState);
        this.renderer.drawApexAndLanding(apex, landing);

        if (this.currentState) {
            // Spin rotation
            const rot = this.currentState.t * this.physics.spinRate;
            this.renderer.drawProjectile(this.currentState, this.activeProjectile, rot);
            this.renderer.drawVectors(this.currentState, this.activeProjectile, this.physics);
        }

        this.renderer.updateAndRenderParticles();

        requestAnimationFrame((t) => this.loop(t));
    }

    /**
     * Level switcher: Basic, Intermediate, Advance, Challenges
     */
    setLevel(level) {
        this.currentLevel = level;

        // UI Tabs update
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.level === level);
        });

        // Toggle panel sections visibility according to level
        const show = (selector, isVisible) => {
            document.querySelectorAll(selector).forEach(el => {
                el.style.display = isVisible ? '' : 'none';
            });
        };

        if (level === 'basic') {
            show('.intermediate-only', false);
            show('.advance-only', false);
            show('.challenges-panel', false);
            show('.main-controls', true);

            this.physics.enableDrag = false;
            this.physics.enableWind = false;
            this.physics.enableMagnus = false;
            this.activeCelestial = { ...CELESTIAL_PRESETS.earth };
            this.activeProjectile = { ...PROJECTILE_PRESETS.cannonball };
            this.wall.enabled = false;
        } else if (level === 'intermediate') {
            show('.intermediate-only', true);
            show('.advance-only', false);
            show('.challenges-panel', false);
            show('.main-controls', true);

            this.physics.enableDrag = false;
            this.physics.enableWind = false;
            this.physics.enableMagnus = false;
        } else if (level === 'advance') {
            show('.intermediate-only', true);
            show('.advance-only', true);
            show('.challenges-panel', false);
            show('.main-controls', true);

            this.physics.enableDrag = true;
        } else if (level === 'challenges') {
            show('.intermediate-only', true);
            show('.advance-only', true);
            show('.challenges-panel', true);
            show('.main-controls', true);
        }

        this.syncPhysicsWithCelestial();
        this.updateAnalyticalPredictions();
        this.updateUIControls();
    }

    /**
     * Render Guided Lab Experiments list
     */
    renderExperimentList() {
        const listEl = document.getElementById('experiments-list');
        if (!listEl) return;

        listEl.innerHTML = GUIDED_EXPERIMENTS.map((exp, idx) => `
            <div class="exp-card ${idx === 0 ? 'active' : ''}" data-exp-id="${exp.id}">
                <div class="exp-badge badge-${exp.level}">${exp.level.toUpperCase()}</div>
                <h4 class="exp-title">${exp.title}</h4>
                <p class="exp-subtitle">${exp.subtitle}</p>
            </div>
        `).join('');

        this.loadExperimentDetails(GUIDED_EXPERIMENTS[0]);

        listEl.addEventListener('click', (e) => {
            const card = e.target.closest('.exp-card');
            if (card) {
                const id = card.dataset.expId;
                const exp = GUIDED_EXPERIMENTS.find(x => x.id === id);
                if (exp) {
                    listEl.querySelectorAll('.exp-card').forEach(c => c.classList.remove('active'));
                    card.classList.add('active');
                    this.loadExperimentDetails(exp);
                }
            }
        });
    }

    loadExperimentDetails(exp) {
        document.getElementById('exp-detail-title').textContent = exp.title;
        document.getElementById('exp-detail-theory').textContent = exp.theory;

        const objEl = document.getElementById('exp-detail-objectives');
        objEl.innerHTML = exp.objectives.map(o => `<li>${o}</li>`).join('');

        const procEl = document.getElementById('exp-detail-procedure');
        procEl.innerHTML = exp.procedure.map(p => `<li>${p}</li>`).join('');

        const applyBtn = document.getElementById('btn-apply-exp-setup');
        applyBtn.onclick = () => {
            if (exp.setup.v0 !== undefined) this.launchSpeed = exp.setup.v0;
            if (exp.setup.angle !== undefined) this.launchAngle = exp.setup.angle;
            if (exp.setup.y0 !== undefined) this.launchHeight = exp.setup.y0;
            if (exp.setup.planet && CELESTIAL_PRESETS[exp.setup.planet]) {
                this.activeCelestial = { ...CELESTIAL_PRESETS[exp.setup.planet] };
                document.getElementById('planet-select').value = exp.setup.planet;
            }
            if (exp.setup.projectile && PROJECTILE_PRESETS[exp.setup.projectile]) {
                this.activeProjectile = { ...PROJECTILE_PRESETS[exp.setup.projectile] };
                document.getElementById('projectile-select').value = exp.setup.projectile;
            }
            if (exp.setup.drag !== undefined) {
                this.physics.enableDrag = exp.setup.drag;
                document.getElementById('toggle-drag').checked = exp.setup.drag;
            }
            if (exp.setup.wind !== undefined) {
                this.physics.windSpeedX = exp.setup.wind;
                this.physics.enableWind = exp.setup.wind !== 0;
            }
            if (exp.setup.targetX !== undefined) {
                this.target.x = exp.setup.targetX;
                this.target.visible = true;
            }
            if (exp.setup.solver) {
                this.physics.solver = exp.setup.solver;
                document.getElementById('solver-select').value = exp.setup.solver;
            }

            this.setLevel(exp.level);
            this.syncPhysicsWithCelestial();
            this.updateAnalyticalPredictions();
            this.updateUIControls();
            this.fire();
        };
    }

    renderChallengeList() {
        const chalEl = document.getElementById('challenges-list');
        if (!chalEl) return;

        chalEl.innerHTML = CHALLENGES.map(c => `
            <div class="challenge-item">
                <div class="chal-header">
                    <span class="chal-title">${c.title}</span>
                    <span class="chal-diff diff-${c.difficulty.toLowerCase()}">${c.difficulty}</span>
                </div>
                <p class="chal-desc">${c.description}</p>
                <div class="chal-hint">💡 Hint: ${c.hint}</div>
                <button class="btn btn-sm btn-primary btn-load-challenge" data-chal-id="${c.id}">Load Challenge</button>
            </div>
        `).join('');

        chalEl.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn-load-challenge');
            if (btn) {
                const chalId = btn.dataset.chalId;
                const chal = CHALLENGES.find(c => c.id === chalId);
                if (chal) {
                    this.loadChallenge(chal);
                }
            }
        });
    }

    loadChallenge(chal) {
        this.target.x = chal.targetX;
        this.target.y = chal.targetY;
        this.target.visible = true;
        this.launchHeight = chal.cannonY;

        if (chal.wall) {
            this.wall.enabled = true;
            this.wall.x = chal.wall.x;
            this.wall.height = chal.wall.height;
            this.wall.width = chal.wall.width;
            document.getElementById('toggle-wall').checked = true;
        } else {
            this.wall.enabled = false;
            document.getElementById('toggle-wall').checked = false;
        }

        this.physics.enableDrag = chal.drag;
        document.getElementById('toggle-drag').checked = chal.drag;
        this.physics.windSpeedX = chal.wind;
        this.physics.enableWind = chal.wind !== 0;

        this.updateAnalyticalPredictions();
        this.updateUIControls();
        this.reset();
        alert(`Loaded ${chal.title}! Set your firing parameters and press FIRE to attempt!`);
    }

    renderTrialTable() {
        const tbody = document.getElementById('trials-tbody');
        if (!tbody) return;

        if (this.trialLogs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" style="text-align:center; color:#64748b; padding:18px;">No trials logged yet. Fire the cannon to record data points!</td></tr>`;
            return;
        }

        tbody.innerHTML = this.trialLogs.slice(-15).reverse().map(t => `
            <tr>
                <td><span class="trial-bullet" style="background:${t.color};"></span>#${t.trialNum}</td>
                <td>${t.angle.toFixed(1)}°</td>
                <td>${t.v0.toFixed(1)} m/s</td>
                <td>${t.y0.toFixed(1)} m</td>
                <td>${t.planet}</td>
                <td>${t.range.toFixed(2)} m</td>
                <td>${t.tFlight.toFixed(2)} s</td>
                <td>${t.vImpact.toFixed(2)} m/s</td>
                <td>${t.hitScore > 0 ? `🎯 ${t.hitScore} pts` : t.hitWall ? '💥 Wall' : '—'}</td>
            </tr>
        `).join('');
    }

    exportCSV() {
        if (this.trialLogs.length === 0) {
            alert('No trials to export! Perform at least one launch first.');
            return;
        }

        const headers = ['Trial', 'Angle (deg)', 'Initial Speed (m/s)', 'Launch Height (m)', 'Planet', 'Drag Enabled', 'Range (m)', 'Flight Time (s)', 'Impact Speed (m/s)', 'Target Score'];
        const rows = this.trialLogs.map(t => [
            t.trialNum,
            t.angle.toFixed(2),
            t.v0.toFixed(2),
            t.y0.toFixed(2),
            `"${t.planet}"`,
            t.drag,
            t.range.toFixed(3),
            t.tFlight.toFixed(3),
            t.vImpact.toFixed(3),
            t.hitScore
        ]);

        const csvContent = 'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `projectile_motion_experiment_data_${Date.now()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    /**
     * Mouse & Touch Canvas Interaction Handler (drag cannon, tape, photogates, target)
     */
    bindCanvasInteractions() {
        const canvas = this.simCanvas;

        const getCoords = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            const screenX = clientX - rect.left;
            const screenY = clientY - rect.top;
            const world = this.renderer.screenToWorld(screenX, screenY);
            return { screenX, screenY, worldX: world.x, worldY: world.y };
        };

        const onDown = (e) => {
            const { screenX, screenY, worldX, worldY } = getCoords(e);

            // 1. Check Tape Measure anchors
            if (this.tape.visible) {
                const s1 = this.renderer.worldToScreen(this.tape.p1.x, this.tape.p1.y);
                const s2 = this.renderer.worldToScreen(this.tape.p2.x, this.tape.p2.y);
                if (Math.hypot(screenX - s1.x, screenY - s1.y) < 18) {
                    this.draggedEntity = 'tape-p1';
                    return;
                }
                if (Math.hypot(screenX - s2.x, screenY - s2.y) < 18) {
                    this.draggedEntity = 'tape-p2';
                    return;
                }
            }

            // 2. Check Photogates
            for (const pg of this.photogates) {
                if (pg.visible) {
                    const top = this.renderer.worldToScreen(pg.x, pg.y + pg.height);
                    if (Math.hypot(screenX - top.x, screenY - top.y) < 22) {
                        this.draggedEntity = `photogate-${pg.id}`;
                        return;
                    }
                }
            }

            // 3. Check Target
            if (this.target.visible) {
                const sTarget = this.renderer.worldToScreen(this.target.x, this.target.y);
                if (Math.hypot(screenX - sTarget.x, screenY - sTarget.y) < 26) {
                    this.draggedEntity = 'target';
                    return;
                }
            }

            // 4. Check Cannon Barrel (Rotate angle)
            const pivot = this.renderer.worldToScreen(0, this.launchHeight);
            const distToPivot = Math.hypot(screenX - pivot.x, screenY - pivot.y);
            if (distToPivot > 10 && distToPivot < 140) {
                this.draggedEntity = 'cannon-angle';
                return;
            }

            // 5. Check Cannon Pedestal (Adjust launch height)
            if (Math.abs(screenX - pivot.x) < 28 && screenY >= pivot.y && screenY <= this.renderer.worldToScreen(0, 0).y) {
                this.draggedEntity = 'cannon-height';
                return;
            }

            // Default: Pan the canvas viewport
            this.isPanning = true;
            this.panStart = { x: screenX - this.renderer.userPanX, y: screenY - this.renderer.userPanY };
        };

        const onMove = (e) => {
            const { screenX, screenY, worldX, worldY } = getCoords(e);

            if (this.isPanning) {
                this.renderer.userPanX = screenX - this.panStart.x;
                this.renderer.userPanY = screenY - this.panStart.y;
                return;
            }

            if (this.draggedEntity === 'cannon-angle') {
                const pivot = this.renderer.worldToScreen(0, this.launchHeight);
                const dx = screenX - pivot.x;
                const dy = pivot.y - screenY; // inverted screen Y
                if (dx > 0) {
                    let deg = (Math.atan2(dy, dx) * 180) / Math.PI;
                    deg = Math.max(0, Math.min(90, Math.round(deg * 2) / 2));
                    this.launchAngle = deg;
                    this.updateUIControls();
                    this.updateAnalyticalPredictions();
                }
            } else if (this.draggedEntity === 'cannon-height') {
                const newH = Math.max(0, Math.min(30, Math.round(worldY * 2) / 2));
                this.launchHeight = newH;
                this.updateUIControls();
                this.updateAnalyticalPredictions();
            } else if (this.draggedEntity === 'target') {
                this.target.x = Math.max(2, Math.min(200, Math.round(worldX * 2) / 2));
            } else if (this.draggedEntity === 'tape-p1') {
                this.tape.p1.x = Math.max(0, worldX);
                this.tape.p1.y = Math.max(0, worldY);
            } else if (this.draggedEntity === 'tape-p2') {
                this.tape.p2.x = Math.max(0, worldX);
                this.tape.p2.y = Math.max(0, worldY);
            } else if (this.draggedEntity?.startsWith('photogate-')) {
                const id = parseInt(this.draggedEntity.split('-')[1]);
                const pg = this.photogates.find(p => p.id === id);
                if (pg) {
                    pg.x = Math.max(1, Math.min(180, Math.round(worldX * 2) / 2));
                }
            }
        };

        const onUp = () => {
            this.draggedEntity = null;
            this.isPanning = false;
        };

        // Mouse Wheel Zoom
        canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            const zoomDelta = e.deltaY < 0 ? 1.15 : 0.87;
            this.renderer.zoomFactor = Math.max(0.3, Math.min(5.0, this.renderer.zoomFactor * zoomDelta));
        }, { passive: false });

        canvas.addEventListener('mousedown', onDown);
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);

        canvas.addEventListener('touchstart', onDown, { passive: true });
        window.addEventListener('touchmove', onMove, { passive: true });
        window.addEventListener('touchend', onUp);
    }

    /**
     * Bind HTML DOM Control Events
     */
    bindEvents() {
        // Level Tabs
        document.querySelectorAll('.level-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.setLevel(tab.dataset.level);
            });
        });

        // Sim Control Buttons
        document.getElementById('btn-fire')?.addEventListener('click', () => this.fire());
        document.getElementById('btn-play-pause')?.addEventListener('click', () => this.pauseToggle());
        document.getElementById('btn-step')?.addEventListener('click', () => this.stepFrame());
        document.getElementById('btn-reset')?.addEventListener('click', () => this.reset());
        document.getElementById('btn-clear-trails')?.addEventListener('click', () => this.clearTrails());
        document.getElementById('btn-fit-view')?.addEventListener('click', () => {
            const r = this.theoreticalCurve.length > 0 ? this.theoreticalCurve[this.theoreticalCurve.length - 1].x : 50;
            this.renderer.fitToTrajectory(r, Math.max(15, this.launchHeight * 1.5));
        });
        document.getElementById('btn-export-csv')?.addEventListener('click', () => this.exportCSV());

        // Speed multi-buttons (0.1x, 0.5x, 1x, 2x)
        document.querySelectorAll('.btn-sim-speed').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.btn-sim-speed').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.simSpeed = parseFloat(btn.dataset.speed);
            });
        });

        // Launch Speed Slider & Input
        const syncSpeed = (val) => {
            this.launchSpeed = Math.max(1, Math.min(100, parseFloat(val) || 1));
            this.updateUIControls();
            this.updateAnalyticalPredictions();
        };
        document.getElementById('speed-slider')?.addEventListener('input', (e) => syncSpeed(e.target.value));
        document.getElementById('speed-input')?.addEventListener('change', (e) => syncSpeed(e.target.value));

        // Launch Angle Slider & Input
        const syncAngle = (val) => {
            this.launchAngle = Math.max(0, Math.min(90, parseFloat(val) || 0));
            this.updateUIControls();
            this.updateAnalyticalPredictions();
        };
        document.getElementById('angle-slider')?.addEventListener('input', (e) => syncAngle(e.target.value));
        document.getElementById('angle-input')?.addEventListener('change', (e) => syncAngle(e.target.value));

        // Launch Height Slider & Input
        const syncHeight = (val) => {
            this.launchHeight = Math.max(0, Math.min(30, parseFloat(val) || 0));
            this.updateUIControls();
            this.updateAnalyticalPredictions();
        };
        document.getElementById('height-slider')?.addEventListener('input', (e) => syncHeight(e.target.value));
        document.getElementById('height-input')?.addEventListener('change', (e) => syncHeight(e.target.value));

        // Celestial Body Selector
        document.getElementById('planet-select')?.addEventListener('change', (e) => {
            const planetId = e.target.value;
            if (CELESTIAL_PRESETS[planetId]) {
                this.activeCelestial = { ...CELESTIAL_PRESETS[planetId] };
                this.syncPhysicsWithCelestial();
                this.updateAnalyticalPredictions();
                this.updateUIControls();
            }
        });

        // Projectile Presets Selector
        document.getElementById('projectile-select')?.addEventListener('change', (e) => {
            const projId = e.target.value;
            if (PROJECTILE_PRESETS[projId]) {
                this.activeProjectile = { ...PROJECTILE_PRESETS[projId] };
                this.updateAnalyticalPredictions();
                this.updateUIControls();
            }
        });

        // Gravity Slider (Intermediate / Custom)
        document.getElementById('gravity-slider')?.addEventListener('input', (e) => {
            this.physics.gravity = parseFloat(e.target.value);
            this.activeCelestial = { ...CELESTIAL_PRESETS.custom, gravity: this.physics.gravity };
            document.getElementById('planet-select').value = 'custom';
            this.updateUIControls();
            this.updateAnalyticalPredictions();
        });

        // Air Resistance Toggle & Drag parameters (Advanced)
        document.getElementById('toggle-drag')?.addEventListener('change', (e) => {
            this.physics.enableDrag = e.target.checked;
            this.updateAnalyticalPredictions();
        });

        document.getElementById('density-slider')?.addEventListener('input', (e) => {
            this.physics.airDensity = parseFloat(e.target.value);
            this.updateUIControls();
            this.updateAnalyticalPredictions();
        });

        document.getElementById('wind-slider')?.addEventListener('input', (e) => {
            this.physics.windSpeedX = parseFloat(e.target.value);
            this.physics.enableWind = this.physics.windSpeedX !== 0;
            this.updateUIControls();
        });

        document.getElementById('spin-slider')?.addEventListener('input', (e) => {
            this.physics.spinRate = parseFloat(e.target.value);
            this.physics.enableMagnus = Math.abs(this.physics.spinRate) > 0.1;
            this.updateUIControls();
        });

        // Numerical Solver Selector (Advanced)
        document.getElementById('solver-select')?.addEventListener('change', (e) => {
            this.physics.solver = e.target.value;
        });

        // Instrument Toggles
        document.getElementById('toggle-tape')?.addEventListener('change', (e) => {
            this.tape.visible = e.target.checked;
        });
        document.getElementById('toggle-photogate1')?.addEventListener('change', (e) => {
            this.photogates[0].visible = e.target.checked;
        });
        document.getElementById('toggle-photogate2')?.addEventListener('change', (e) => {
            this.photogates[1].visible = e.target.checked;
        });
        document.getElementById('toggle-wall')?.addEventListener('change', (e) => {
            this.wall.enabled = e.target.checked;
        });

        // Sound Toggle
        document.getElementById('toggle-sound')?.addEventListener('change', (e) => {
            this.audio.enabled = e.target.checked;
        });

        // Vector Toggles
        document.getElementById('toggle-vec-v')?.addEventListener('change', (e) => {
            this.renderer.showVelocityVector = e.target.checked;
        });
        document.getElementById('toggle-vec-vcomp')?.addEventListener('change', (e) => {
            this.renderer.showComponentVectors = e.target.checked;
        });
        document.getElementById('toggle-vec-a')?.addEventListener('change', (e) => {
            this.renderer.showAccelerationVector = e.target.checked;
        });
        document.getElementById('toggle-vec-drag')?.addEventListener('change', (e) => {
            this.renderer.showDragVector = e.target.checked;
        });

        // Custom Projectile Inputs
        document.getElementById('custom-mass')?.addEventListener('change', (e) => {
            this.activeProjectile.mass = Math.max(0.001, parseFloat(e.target.value) || 1.0);
            this.activeProjectile.id = 'custom';
            document.getElementById('projectile-select').value = 'custom';
            this.updateAnalyticalPredictions();
        });
        document.getElementById('custom-diameter')?.addEventListener('change', (e) => {
            this.activeProjectile.diameter = Math.max(0.001, parseFloat(e.target.value) || 0.1);
            this.activeProjectile.id = 'custom';
            document.getElementById('projectile-select').value = 'custom';
            this.updateAnalyticalPredictions();
        });
        document.getElementById('custom-drag')?.addEventListener('change', (e) => {
            this.activeProjectile.dragCoefficient = Math.max(0, parseFloat(e.target.value) || 0.47);
            this.activeProjectile.id = 'custom';
            document.getElementById('projectile-select').value = 'custom';
            this.updateAnalyticalPredictions();
        });

        // Keyboard Shortcuts
        window.addEventListener('keydown', (e) => {
            // Avoid triggering shortcuts when typing in inputs
            if (['INPUT', 'SELECT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

            if (e.code === 'Space') {
                e.preventDefault();
                if (this.simState === 'idle' || this.simState === 'landed') {
                    this.fire();
                } else {
                    this.pauseToggle();
                }
            } else if (e.key === 'r' || e.key === 'R') {
                this.reset();
            } else if (e.key === 'f' || e.key === 'F') {
                this.fire();
            }
        });

        // Graph Mode Switcher (Position / Velocity / Energy)
        document.querySelectorAll('.graph-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.graph-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.grapher.setMode(tab.dataset.mode);
            });
        });
    }
}

// Bootstrap on DOM Content Loaded
window.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
