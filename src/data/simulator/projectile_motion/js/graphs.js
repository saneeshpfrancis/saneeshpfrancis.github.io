/**
 * Multi-Channel Real-time Scientific Telemetry Graphing System
 * Renders:
 * 1. Position vs Time [x(t), y(t)]
 * 2. Velocity vs Time [vx(t), vy(t), |v|(t)]
 * 3. Energy vs Time [Kinetic, Potential, Total Mechanical Energy]
 */

export class ScienceGrapher {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.activeMode = 'position'; // 'position', 'velocity', 'energy'
        this.dataPoints = []; // Array of { t, x, y, vx, vy, v, ke, pe, totalE }

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
            this.width = rect.width;
            this.height = rect.height;
            this.render();
        };
        window.addEventListener('resize', resize);
        resize();
    }

    setMode(mode) {
        this.activeMode = mode;
        this.render();
    }

    reset() {
        this.dataPoints = [];
        this.render();
    }

    addDataPoint(point) {
        this.dataPoints.push(point);
        // Throttle render or render per frame
    }

    render() {
        const ctx = this.ctx;
        if (!ctx) return;

        ctx.save();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(0, 0, this.width, this.height);

        const margin = { top: 25, right: 30, bottom: 35, left: 55 };
        const plotW = this.width - margin.left - margin.right;
        const plotH = this.height - margin.top - margin.bottom;

        if (plotW <= 0 || plotH <= 0) {
            ctx.restore();
            return;
        }

        // Draw Plot Background & Grid
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(margin.left, margin.top, plotW, plotH);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.strokeRect(margin.left, margin.top, plotW, plotH);

        if (this.dataPoints.length === 0) {
            ctx.fillStyle = '#64748b';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Launch projectile to record telemetry curves...', this.width / 2, this.height / 2);
            ctx.restore();
            return;
        }

        // Determine min and max ranges
        let maxT = this.dataPoints[this.dataPoints.length - 1].t || 1;
        maxT = Math.max(1, maxT);

        let series = [];
        let yUnit = '';
        let title = '';

        if (this.activeMode === 'position') {
            title = 'Position vs Time [m vs s]';
            yUnit = 'm';
            series = [
                { name: 'x(t) Horizontal', key: 'x', color: '#38bdf8' },
                { name: 'y(t) Vertical', key: 'y', color: '#a855f7' }
            ];
        } else if (this.activeMode === 'velocity') {
            title = 'Velocity vs Time [m/s vs s]';
            yUnit = 'm/s';
            series = [
                { name: 'v_x(t) Horizontal', key: 'vx', color: '#22c55e' },
                { name: 'v_y(t) Vertical', key: 'vy', color: '#ef4444' },
                { name: '|v|(t) Total Speed', key: 'v', color: '#f59e0b' }
            ];
        } else if (this.activeMode === 'energy') {
            title = 'Mechanical Energy vs Time [Joules vs s]';
            yUnit = 'J';
            series = [
                { name: 'Kinetic (KE)', key: 'ke', color: '#06b6d4' },
                { name: 'Potential (PE)', key: 'pe', color: '#ec4899' },
                { name: 'Total Energy (E)', key: 'totalE', color: '#eab308' }
            ];
        }

        // Calculate Y scale
        let minY = 0;
        let maxY = 1;
        this.dataPoints.forEach(p => {
            series.forEach(s => {
                const val = p[s.key] !== undefined ? p[s.key] : 0;
                if (val < minY) minY = val;
                if (val > maxY) maxY = val;
            });
        });

        // Add 10% headroom
        const yRange = (maxY - minY) || 1;
        maxY += yRange * 0.1;
        if (minY < -0.01) minY -= yRange * 0.1;

        // Grid lines (X & Y)
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.font = '10px ui-monospace, monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'right';

        // 5 horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const frac = i / 4;
            const yVal = minY + (maxY - minY) * (1 - frac);
            const py = margin.top + frac * plotH;
            ctx.beginPath();
            ctx.moveTo(margin.left, py);
            ctx.lineTo(margin.left + plotW, py);
            ctx.stroke();

            ctx.fillText(`${yVal.toFixed(1)} ${yUnit}`, margin.left - 6, py + 3);
        }

        // Zero line if minY < 0
        if (minY < 0 && maxY > 0) {
            const zeroFrac = (maxY - 0) / (maxY - minY);
            const zeroPy = margin.top + zeroFrac * plotH;
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(margin.left, zeroPy);
            ctx.lineTo(margin.left + plotW, zeroPy);
            ctx.stroke();
        }

        // 5 vertical grid lines for time
        ctx.textAlign = 'center';
        for (let i = 0; i <= 4; i++) {
            const frac = i / 4;
            const tVal = frac * maxT;
            const px = margin.left + frac * plotW;
            ctx.beginPath();
            ctx.moveTo(px, margin.top);
            ctx.lineTo(px, margin.top + plotH);
            ctx.stroke();

            ctx.fillText(`${tVal.toFixed(1)}s`, px, margin.top + plotH + 16);
        }

        // Plot Series Lines
        series.forEach(s => {
            ctx.strokeStyle = s.color;
            ctx.lineWidth = 2;
            ctx.beginPath();

            let first = true;
            this.dataPoints.forEach(p => {
                const val = p[s.key] !== undefined ? p[s.key] : 0;
                const px = margin.left + (p.t / maxT) * plotW;
                const py = margin.top + ((maxY - val) / (maxY - minY)) * plotH;

                if (first) {
                    ctx.moveTo(px, py);
                    first = false;
                } else {
                    ctx.lineTo(px, py);
                }
            });
            ctx.stroke();
        });

        // Graph Title and Legend
        ctx.textAlign = 'left';
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#f8fafc';
        ctx.fillText(title, margin.left, 16);

        // Legend chips
        let legendX = margin.left + plotW;
        series.slice().reverse().forEach(s => {
            ctx.font = '10px sans-serif';
            const textW = ctx.measureText(s.name).width;
            legendX -= (textW + 24);

            // Colored bullet
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(legendX + 6, 12, 4, 0, Math.PI * 2);
            ctx.fill();

            // Label
            ctx.fillStyle = '#cbd5e1';
            ctx.fillText(s.name, legendX + 14, 15);
        });

        ctx.restore();
    }
}
