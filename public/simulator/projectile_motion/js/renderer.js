/**
 * Canvas Renderer for Projectile Motion
 * Handles world-to-screen transforms, dynamic auto-zoom/pan, grid drawing,
 * cannon rendering, trajectories, vectors, instruments, and visual particle effects.
 */

export class SimulationRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');

        // Viewport camera transform
        this.pixelsPerMeter = 14;  // Scale factor (px / meter)
        this.originX = 70;         // Canvas px for world x = 0
        this.groundYOffset = 60;   // Canvas px from bottom for world y = 0
        this.userPanX = 0;
        this.userPanY = 0;
        this.zoomFactor = 1.0;

        // Visual toggles
        this.showVelocityVector = true;
        this.showComponentVectors = true;
        this.showAccelerationVector = true;
        this.showDragVector = true;
        this.showTheoreticalCurve = true;
        this.showGrid = true;
        this.showCoordinates = true;

        // Particle system for smoke trail and target impact sparkles
        this.particles = [];
        this.confetti = [];

        // Interaction highlight flags
        this.hoveredObject = null; // 'cannon-barrel', 'cannon-pedestal', 'target', 'tape-p1', 'tape-p2', 'wall'

        this.setupResize();
    }

    setupResize() {
        const resize = () => {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;
            this.canvas.width = rect.width * dpr;
            this.canvas.height = rect.height * dpr;
            this.canvas.style.width = `${rect.width}px`;
            this.canvas.style.height = `${rect.height}px`;
            this.ctx.resetTransform?.();
            this.ctx.scale(dpr, dpr);
            this.displayWidth = rect.width;
            this.displayHeight = rect.height;
        };

        window.addEventListener('resize', resize);
        resize();
    }

    // Coordinate conversions
    worldToScreen(x, y) {
        const scale = this.pixelsPerMeter * this.zoomFactor;
        const screenX = this.originX + this.userPanX + x * scale;
        const screenY = this.displayHeight - this.groundYOffset + this.userPanY - y * scale;
        return { x: screenX, y: screenY };
    }

    screenToWorld(screenX, screenY) {
        const scale = this.pixelsPerMeter * this.zoomFactor;
        const worldX = (screenX - this.originX - this.userPanX) / scale;
        const worldY = (this.displayHeight - this.groundYOffset + this.userPanY - screenY) / scale;
        return { x: worldX, y: worldY };
    }

    /**
     * Auto-frame camera to keep cannon and anticipated trajectory in view
     */
    fitToTrajectory(maxDist = 60, maxHeight = 30) {
        const availableW = this.displayWidth - this.originX - 100;
        const availableH = this.displayHeight - this.groundYOffset - 80;

        if (availableW <= 0 || availableH <= 0) return;

        const scaleX = availableW / Math.max(25, maxDist * 1.15);
        const scaleY = availableH / Math.max(15, maxHeight * 1.25);
        const optimalScale = Math.max(4, Math.min(28, Math.min(scaleX, scaleY)));

        this.pixelsPerMeter = optimalScale;
        this.zoomFactor = 1.0;
        this.userPanX = 0;
        this.userPanY = 0;
    }

    resetView() {
        this.pixelsPerMeter = 14;
        this.zoomFactor = 1.0;
        this.userPanX = 0;
        this.userPanY = 0;
    }

    clear(celestial) {
        const ctx = this.ctx;
        ctx.save();

        // Sky gradient
        const skyGrad = ctx.createLinearGradient(0, 0, 0, this.displayHeight);
        skyGrad.addColorStop(0, celestial.skyColor);
        skyGrad.addColorStop(1, '#0b0f19');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, this.displayWidth, this.displayHeight);

        // Optional space stars for moon / dark sky
        if (celestial.id === 'moon' || celestial.id === 'vacuumEarth') {
            this.drawStarfield();
        }

        ctx.restore();
    }

    drawStarfield() {
        const ctx = this.ctx;
        ctx.save();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        // Deterministic starry background
        for (let i = 0; i < 70; i++) {
            const x = (i * 137.5) % this.displayWidth;
            const y = (i * 97.3) % (this.displayHeight * 0.75);
            const r = (i % 3 === 0) ? 1.5 : 0.8;
            ctx.beginPath();
            ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawGrid(celestial) {
        if (!this.showGrid) return;
        const ctx = this.ctx;
        ctx.save();

        const scale = this.pixelsPerMeter * this.zoomFactor;

        // Dynamic grid interval based on zoom
        let interval = 5; // meters
        if (scale < 7) interval = 20;
        else if (scale < 12) interval = 10;
        else if (scale > 30) interval = 2;
        else if (scale > 60) interval = 1;

        const pOrigin = this.worldToScreen(0, 0);

        // Ground Plane
        ctx.fillStyle = celestial.groundColor || '#166534';
        ctx.fillRect(0, pOrigin.y, this.displayWidth, this.displayHeight - pOrigin.y);

        // Ground surface line
        ctx.strokeStyle = '#22c55e';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, pOrigin.y);
        ctx.lineTo(this.displayWidth, pOrigin.y);
        ctx.stroke();

        // Grid lines & labels
        ctx.font = '11px ui-monospace, SFMono-Regular, monospace';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.lineWidth = 1;

        // Vertical meter grid lines (x)
        const minX = Math.floor(this.screenToWorld(0, 0).x / interval) * interval;
        const maxX = Math.ceil(this.screenToWorld(this.displayWidth, 0).x / interval) * interval;

        for (let x = Math.max(0, minX); x <= maxX; x += interval) {
            const sx = this.worldToScreen(x, 0).x;
            ctx.beginPath();
            ctx.moveTo(sx, 0);
            ctx.lineTo(sx, pOrigin.y);
            ctx.stroke();

            // Ground tick & meter label
            ctx.fillRect(sx - 1, pOrigin.y, 2, 7);
            ctx.fillText(`${x} m`, sx + 3, pOrigin.y + 18);
        }

        // Horizontal meter grid lines (y)
        const maxY = Math.ceil(this.screenToWorld(0, 0).y / interval) * interval;
        for (let y = interval; y <= maxY; y += interval) {
            const sy = this.worldToScreen(0, y).y;
            if (sy < 0 || sy > pOrigin.y) continue;
            ctx.beginPath();
            ctx.moveTo(0, sy);
            ctx.lineTo(this.displayWidth, sy);
            ctx.stroke();

            // Altitude label on Y axis
            ctx.fillText(`${y} m`, pOrigin.x - 38, sy + 4);
        }

        // Origin Y-axis line
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(pOrigin.x, 0);
        ctx.lineTo(pOrigin.x, pOrigin.y);
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Draw the cannon with adjustable angle and pedestal height
     */
    drawCannon(y0, angleDeg, barrelLength = 3.5) {
        const ctx = this.ctx;
        ctx.save();

        const pivot = this.worldToScreen(0, y0);
        const ground = this.worldToScreen(0, 0);
        const scale = this.pixelsPerMeter * this.zoomFactor;

        // 1. Pedestal Tower (from ground up to y0)
        if (y0 > 0.1) {
            ctx.fillStyle = '#334155';
            ctx.strokeStyle = '#64748b';
            ctx.lineWidth = 2;
            const towerW = 22;
            ctx.fillRect(pivot.x - towerW / 2, pivot.y, towerW, ground.y - pivot.y);
            ctx.strokeRect(pivot.x - towerW / 2, pivot.y, towerW, ground.y - pivot.y);

            // Scaffolding cross-bars
            ctx.strokeStyle = '#475569';
            ctx.lineWidth = 1.5;
            for (let yStep = pivot.y; yStep < ground.y - 15; yStep += 20) {
                ctx.beginPath();
                ctx.moveTo(pivot.x - towerW / 2, yStep);
                ctx.lineTo(pivot.x + towerW / 2, yStep + 20);
                ctx.moveTo(pivot.x + towerW / 2, yStep);
                ctx.lineTo(pivot.x - towerW / 2, yStep + 20);
                ctx.stroke();
            }

            // Height indicator banner
            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 11px sans-serif';
            ctx.fillText(`h₀ = ${y0.toFixed(1)}m`, pivot.x + 18, (pivot.y + ground.y) / 2);
        }

        // 2. Cannon Base Mount / Wheel
        ctx.beginPath();
        ctx.arc(pivot.x, pivot.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = '#1e293b';
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 3. Cannon Barrel
        const rad = (angleDeg * Math.PI) / 180;
        const barrelPx = barrelLength * scale;
        const barrelW = 14;

        ctx.save();
        ctx.translate(pivot.x, pivot.y);
        ctx.rotate(-rad); // Canvas y is inverted

        // Barrel gradient
        const barrelGrad = ctx.createLinearGradient(0, -barrelW / 2, 0, barrelW / 2);
        barrelGrad.addColorStop(0, '#64748b');
        barrelGrad.addColorStop(0.5, '#1e293b');
        barrelGrad.addColorStop(1, '#0f172a');

        ctx.fillStyle = barrelGrad;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = this.hoveredObject === 'cannon-barrel' ? 2.5 : 1;
        ctx.beginPath();
        ctx.roundRect(0, -barrelW / 2, barrelPx, barrelW, [0, 4, 4, 0]);
        ctx.fill();
        ctx.stroke();

        // Barrel muzzle rim
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(barrelPx - 3, -barrelW / 2 - 2, 4, barrelW + 4);

        ctx.restore();

        // 4. Angle protractor arc guide
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.7)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(pivot.x, pivot.y, 36, 0, -rad, true);
        ctx.stroke();
        ctx.setLineDash([]);

        // Angle text label
        const labelRad = -rad / 2;
        const labelDist = 48;
        const lx = pivot.x + Math.cos(labelRad) * labelDist;
        const ly = pivot.y + Math.sin(labelRad) * labelDist;
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText(`${angleDeg.toFixed(1)}°`, lx, ly);

        ctx.restore();
    }

    /**
     * Draw previous trials ("Ghost" trajectories) for comparison
     */
    drawGhostTrails(pastTrials) {
        if (!pastTrials || pastTrials.length === 0) return;
        const ctx = this.ctx;
        ctx.save();

        pastTrials.forEach((trial, index) => {
            if (!trial.points || trial.points.length < 2) return;

            const alpha = Math.max(0.2, 0.6 - (pastTrials.length - 1 - index) * 0.12);
            ctx.strokeStyle = trial.color || `rgba(148, 163, 184, ${alpha})`;
            ctx.lineWidth = 1.8;
            ctx.setLineDash([4, 4]);

            ctx.beginPath();
            const start = this.worldToScreen(trial.points[0].x, trial.points[0].y);
            ctx.moveTo(start.x, start.y);

            for (let i = 1; i < trial.points.length; i++) {
                const pt = this.worldToScreen(trial.points[i].x, trial.points[i].y);
                ctx.lineTo(pt.x, pt.y);
            }
            ctx.stroke();

            // Landing label
            const last = trial.points[trial.points.length - 1];
            const pLast = this.worldToScreen(last.x, last.y);
            ctx.fillStyle = trial.color || '#94a3b8';
            ctx.font = '10px ui-monospace, monospace';
            ctx.fillText(`#${trial.trialNum}: ${last.x.toFixed(1)}m`, pLast.x - 15, pLast.y - 8);
        });

        ctx.setLineDash([]);
        ctx.restore();
    }

    /**
     * Draw analytical / theoretical trajectory for ideal comparison
     */
    drawTheoreticalTrajectory(analyticalPoints) {
        if (!this.showTheoreticalCurve || !analyticalPoints || analyticalPoints.length < 2) return;
        const ctx = this.ctx;
        ctx.save();

        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)'; // Amber/Gold faint line
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 6]);

        ctx.beginPath();
        const start = this.worldToScreen(analyticalPoints[0].x, analyticalPoints[0].y);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < analyticalPoints.length; i++) {
            const pt = this.worldToScreen(analyticalPoints[i].x, analyticalPoints[i].y);
            ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.restore();
    }

    /**
     * Draw the active simulation path and breadcrumbs
     */
    drawActiveTrail(historyPoints, currentPoint) {
        if (!historyPoints || historyPoints.length === 0) return;
        const ctx = this.ctx;
        ctx.save();

        // Main trajectory line
        ctx.strokeStyle = '#38bdf8'; // Cyan
        ctx.lineWidth = 3;
        ctx.beginPath();
        const start = this.worldToScreen(historyPoints[0].x, historyPoints[0].y);
        ctx.moveTo(start.x, start.y);

        for (let i = 1; i < historyPoints.length; i++) {
            const pt = this.worldToScreen(historyPoints[i].x, historyPoints[i].y);
            ctx.lineTo(pt.x, pt.y);
        }

        if (currentPoint) {
            const cur = this.worldToScreen(currentPoint.x, currentPoint.y);
            ctx.lineTo(cur.x, cur.y);
        }
        ctx.stroke();

        // Stroboscopic timed dots (every 0.2s)
        ctx.fillStyle = '#67e8f9';
        historyPoints.forEach((pt, idx) => {
            if (idx % 15 === 0) {
                const s = this.worldToScreen(pt.x, pt.y);
                ctx.beginPath();
                ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        ctx.restore();
    }

    /**
     * Draw the projectile itself (rotated if spinning)
     */
    drawProjectile(state, projectile, rotationAngle = 0) {
        if (!state) return;
        const ctx = this.ctx;
        ctx.save();

        const s = this.worldToScreen(state.x, state.y);
        const scale = this.pixelsPerMeter * this.zoomFactor;
        const radiusPx = Math.max(6, (projectile.diameter / 2) * scale);

        ctx.translate(s.x, s.y);
        ctx.rotate(rotationAngle);

        // Outer glow
        const glow = ctx.createRadialGradient(0, 0, radiusPx * 0.5, 0, 0, radiusPx * 1.8);
        glow.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        glow.addColorStop(1, 'rgba(56, 189, 248, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx * 1.8, 0, Math.PI * 2);
        ctx.fill();

        // Body
        ctx.beginPath();
        ctx.arc(0, 0, radiusPx, 0, Math.PI * 2);
        ctx.fillStyle = projectile.color || '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Seam / spin orientation marker
        ctx.beginPath();
        ctx.moveTo(-radiusPx + 2, 0);
        ctx.lineTo(radiusPx - 2, 0);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
    }

    /**
     * Draw physical vector arrows from projectile center:
     * - Velocity (green)
     * - Velocity Components vx, vy (green dashed)
     * - Acceleration / Gravity (orange)
     * - Drag (red)
     */
    drawVectors(state, projectile, engine) {
        if (!state) return;
        const ctx = this.ctx;
        const s = this.worldToScreen(state.x, state.y);

        // Vector length scale: e.g. 1 m/s = 1.8 px
        const vScale = 1.6;
        const aScale = 2.2;

        // 1. Total Velocity Vector
        if (this.showVelocityVector) {
            const vMag = Math.sqrt(state.vx * state.vx + state.vy * state.vy);
            if (vMag > 0.1) {
                const endX = s.x + state.vx * vScale;
                const endY = s.y - state.vy * vScale; // inverted screen Y
                this.drawArrow(s.x, s.y, endX, endY, '#22c55e', 2.5, `v = ${vMag.toFixed(1)} m/s`);

                // Velocity components
                if (this.showComponentVectors) {
                    // vx (horizontal)
                    ctx.save();
                    ctx.setLineDash([3, 3]);
                    this.drawArrow(s.x, s.y, s.x + state.vx * vScale, s.y, 'rgba(34, 197, 94, 0.7)', 1.5, `vx=${state.vx.toFixed(1)}`);
                    // vy (vertical)
                    this.drawArrow(s.x + state.vx * vScale, s.y, endX, endY, 'rgba(34, 197, 94, 0.7)', 1.5, `vy=${state.vy.toFixed(1)}`);
                    ctx.restore();
                }
            }
        }

        // 2. Acceleration Vector
        if (this.showAccelerationVector && (state.ax !== undefined || state.ay !== undefined)) {
            const ax = state.ax || 0;
            const ay = state.ay || -engine.gravity;
            const aMag = Math.sqrt(ax * ax + ay * ay);
            if (aMag > 0.1) {
                const endX = s.x + ax * aScale;
                const endY = s.y - ay * aScale;
                this.drawArrow(s.x, s.y, endX, endY, '#f97316', 2, `a = ${aMag.toFixed(1)} m/s²`);
            }
        }

        // 3. Drag Force Vector
        if (this.showDragVector && engine.enableDrag) {
            const { ax, ay } = engine.computeAcceleration(state, projectile);
            // Drag part of acceleration = total a - gravity
            const dragAx = ax;
            const dragAy = ay - (-engine.gravity);
            const dragAccMag = Math.sqrt(dragAx * dragAx + dragAy * dragAy);

            if (dragAccMag > 0.2) {
                const endX = s.x + dragAx * aScale * 2;
                const endY = s.y - dragAy * aScale * 2;
                this.drawArrow(s.x, s.y, endX, endY, '#ef4444', 2, `F_drag`);
            }
        }
    }

    drawArrow(fromX, fromY, toX, toY, color, width = 2, label = '') {
        const ctx = this.ctx;
        const dx = toX - fromX;
        const dy = toY - fromY;
        const len = Math.sqrt(dx * dx + dy * dy);
        if (len < 5) return;

        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = width;

        // Line
        ctx.beginPath();
        ctx.moveTo(fromX, fromY);
        ctx.lineTo(toX, toY);
        ctx.stroke();

        // Arrow head
        const headLen = Math.min(10, Math.max(6, len * 0.25));
        const angle = Math.atan2(dy, dx);
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - headLen * Math.cos(angle - Math.PI / 6), toY - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(toX - headLen * Math.cos(angle + Math.PI / 6), toY - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();

        // Label
        if (label) {
            ctx.font = 'bold 10px sans-serif';
            ctx.fillStyle = color;
            ctx.fillText(label, toX + 6, toY - 4);
        }

        ctx.restore();
    }

    /**
     * Draw Target, Rings, and Bullseye Marker
     */
    drawTarget(target) {
        if (!target || !target.visible) return;
        const ctx = this.ctx;
        ctx.save();

        const sCenter = this.worldToScreen(target.x, target.y);
        const scale = this.pixelsPerMeter * this.zoomFactor;
        const rPx = target.radius * scale;

        // Target Base Stand
        const ground = this.worldToScreen(target.x, 0);
        ctx.fillStyle = '#475569';
        ctx.fillRect(sCenter.x - 3, sCenter.y, 6, ground.y - sCenter.y);

        // Concentric target rings (flat ground target or elevated)
        const rings = [
            { radius: rPx, color: '#ef4444' },         // Outer red
            { radius: rPx * 0.65, color: '#ffffff' },   // Middle white
            { radius: rPx * 0.35, color: '#ef4444' },   // Inner red
            { radius: rPx * 0.15, color: '#fbbf24' }    // Gold bullseye
        ];

        rings.forEach(ring => {
            ctx.beginPath();
            // Draw as horizontal ellipse when on ground
            ctx.ellipse(sCenter.x, sCenter.y, ring.radius, ring.radius * 0.35, 0, 0, Math.PI * 2);
            ctx.fillStyle = ring.color;
            ctx.fill();
            ctx.strokeStyle = '#0f172a';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Target distance flag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px ui-monospace, monospace';
        ctx.fillText(`Target: ${target.x.toFixed(1)}m`, sCenter.x - 35, sCenter.y + 22);

        // Score banner if hit
        if (target.hitScore) {
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 14px sans-serif';
            ctx.fillText(target.hitScore.label, sCenter.x - 60, sCenter.y - 25);
        }

        ctx.restore();
    }

    /**
     * Draw Obstacle Wall
     */
    drawObstacle(wall) {
        if (!wall || !wall.enabled) return;
        const ctx = this.ctx;
        ctx.save();

        const sTopLeft = this.worldToScreen(wall.x, wall.height);
        const sBottomRight = this.worldToScreen(wall.x + wall.width, 0);
        const w = sBottomRight.x - sTopLeft.x;
        const h = sBottomRight.y - sTopLeft.y;

        // Brick pattern styling
        ctx.fillStyle = '#7f1d1d'; // Dark brick red
        ctx.fillRect(sTopLeft.x, sTopLeft.y, w, h);
        ctx.strokeStyle = '#f87171';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(sTopLeft.x, sTopLeft.y, w, h);

        // Wall Height Label
        ctx.fillStyle = '#fecaca';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillText(`Wall: ${wall.height.toFixed(1)}m`, sTopLeft.x - 12, sTopLeft.y - 8);

        ctx.restore();
    }

    /**
     * Draw Interactive Tape Measure
     */
    drawTapeMeasure(tape) {
        if (!tape || !tape.visible) return;
        const ctx = this.ctx;
        ctx.save();

        const p1 = this.worldToScreen(tape.p1.x, tape.p1.y);
        const p2 = this.worldToScreen(tape.p2.x, tape.p2.y);
        const dist = tape.getDistance();

        // Measurement line
        ctx.strokeStyle = '#facc15'; // Bright yellow
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Anchors
        const drawAnchor = (p, label) => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#facc15';
            ctx.fill();
            ctx.strokeStyle = '#000';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#000';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText(label, p.x - 3, p.y + 3);
        };

        drawAnchor(p1, 'A');
        drawAnchor(p2, 'B');

        // Measurement Readout Box
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;

        const boxW = 145;
        const boxH = 46;
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        ctx.roundRect(midX - boxW / 2, midY - boxH - 12, boxW, boxH, 6);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#fef08a';
        ctx.font = 'bold 12px ui-monospace, monospace';
        ctx.fillText(`Dist: ${dist.total.toFixed(2)} m`, midX - boxW / 2 + 10, midY - boxH + 6);
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText(`Δx: ${dist.dx.toFixed(2)}m | Δy: ${dist.dy.toFixed(2)}m`, midX - boxW / 2 + 10, midY - boxH + 22);

        ctx.restore();
    }

    /**
     * Draw Photogates
     */
    drawPhotogates(photogates) {
        if (!photogates) return;
        const ctx = this.ctx;
        ctx.save();

        photogates.forEach(pg => {
            if (!pg.visible) return;

            const bottom = this.worldToScreen(pg.x, pg.y);
            const top = this.worldToScreen(pg.x, pg.y + pg.height);

            // Gate upright posts
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(bottom.x, bottom.y);
            ctx.lineTo(top.x, top.y);
            ctx.stroke();

            // Laser Beam (vertical line)
            ctx.strokeStyle = pg.triggered ? '#22c55e' : 'rgba(239, 68, 68, 0.7)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(bottom.x, bottom.y);
            ctx.lineTo(top.x, top.y);
            ctx.stroke();
            ctx.setLineDash([]);

            // Gate sensor head
            ctx.fillStyle = pg.triggered ? '#22c55e' : '#ef4444';
            ctx.beginPath();
            ctx.arc(top.x, top.y, 6, 0, Math.PI * 2);
            ctx.fill();

            // Digital readout sign
            const boxW = 120;
            const boxH = 40;
            ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
            ctx.strokeStyle = pg.triggered ? '#22c55e' : '#64748b';
            ctx.lineWidth = 1;
            ctx.roundRect(top.x - boxW / 2, top.y - boxH - 10, boxW, boxH, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 10px sans-serif';
            ctx.fillText(`${pg.label} (x = ${pg.x.toFixed(1)}m)`, top.x - boxW / 2 + 8, top.y - boxH + 4);

            if (pg.lastTriggerData) {
                ctx.fillStyle = '#4ade80';
                ctx.font = 'bold 11px ui-monospace, monospace';
                ctx.fillText(`v = ${pg.lastTriggerData.speed.toFixed(2)} m/s`, top.x - boxW / 2 + 8, top.y - boxH + 18);
                ctx.fillStyle = '#94a3b8';
                ctx.font = '9px ui-monospace, monospace';
                ctx.fillText(`t = ${pg.lastTriggerData.time.toFixed(2)}s | y = ${pg.lastTriggerData.y.toFixed(1)}m`, top.x - boxW / 2 + 8, top.y - boxH + 30);
            } else {
                ctx.fillStyle = '#94a3b8';
                ctx.font = '10px ui-monospace, monospace';
                ctx.fillText('Awaiting pass...', top.x - boxW / 2 + 8, top.y - boxH + 22);
            }
        });

        ctx.restore();
    }

    /**
     * Draw Apex and Landing Annotations
     */
    drawApexAndLanding(apex, landing) {
        const ctx = this.ctx;
        ctx.save();

        if (apex && apex.y > 0.5) {
            const pApex = this.worldToScreen(apex.x, apex.y);
            // Apex point
            ctx.beginPath();
            ctx.arc(pApex.x, pApex.y, 4, 0, Math.PI * 2);
            ctx.fillStyle = '#a855f7';
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Apex callout
            ctx.fillStyle = '#c084fc';
            ctx.font = 'bold 11px ui-monospace, monospace';
            ctx.fillText(`H_max = ${apex.y.toFixed(2)}m (t=${apex.t.toFixed(2)}s)`, pApex.x - 45, pApex.y - 12);
        }

        if (landing && landing.x > 0.1) {
            const pLand = this.worldToScreen(landing.x, 0);
            // Impact point
            ctx.beginPath();
            ctx.arc(pLand.x, pLand.y, 5, 0, Math.PI * 2);
            ctx.fillStyle = '#ef4444';
            ctx.fill();

            // Landing callout
            ctx.fillStyle = '#f87171';
            ctx.font = 'bold 11px ui-monospace, monospace';
            ctx.fillText(`Range = ${landing.x.toFixed(2)}m (t=${landing.t.toFixed(2)}s)`, pLand.x - 35, pLand.y - 12);
        }

        ctx.restore();
    }

    /**
     * Particles (Smoke trail & bullseye confetti)
     */
    spawnSmoke(x, y) {
        const p = this.worldToScreen(x, y);
        this.particles.push({
            x: p.x,
            y: p.y,
            vx: (Math.random() - 0.5) * 0.8,
            vy: (Math.random() - 0.5) * 0.8,
            radius: 3 + Math.random() * 3,
            alpha: 0.6,
            life: 1.0
        });
        if (this.particles.length > 80) this.particles.shift();
    }

    spawnConfetti(targetX, targetY) {
        const origin = this.worldToScreen(targetX, targetY);
        const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        for (let i = 0; i < 45; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spd = 2 + Math.random() * 6;
            this.confetti.push({
                x: origin.x,
                y: origin.y,
                vx: Math.cos(angle) * spd,
                vy: Math.sin(angle) * spd - 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 3 + Math.random() * 4,
                rot: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.2,
                life: 1.0
            });
        }
    }

    updateAndRenderParticles() {
        const ctx = this.ctx;
        ctx.save();

        // Smoke
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.radius += 0.2;
            p.alpha -= 0.02;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
                continue;
            }
            ctx.fillStyle = `rgba(203, 213, 225, ${p.alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Confetti
        for (let i = this.confetti.length - 1; i >= 0; i--) {
            const c = this.confetti[i];
            c.x += c.vx;
            c.y += c.vy;
            c.vy += 0.15; // gravity
            c.rot += c.rotSpeed;
            c.life -= 0.015;
            if (c.life <= 0) {
                this.confetti.splice(i, 1);
                continue;
            }
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rot);
            ctx.fillStyle = c.color;
            ctx.globalAlpha = Math.max(0, c.life);
            ctx.fillRect(-c.size / 2, -c.size / 2, c.size, c.size);
            ctx.restore();
        }

        ctx.restore();
    }
}
