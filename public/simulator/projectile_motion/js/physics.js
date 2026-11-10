/**
 * Physics Engine for Projectile Motion Simulation
 * Covers:
 * - Analytical ideal kinematic solutions (Level 1 - Basic)
 * - Environmental gravity & celestial bodies (Level 2 - Intermediate)
 * - Real-world Aerodynamics: Drag, Wind, Magnus Effect, Barometric Density (Level 3 - Advanced)
 * - Numerical Solvers: Euler, Euler-Cromer, Runge-Kutta 4 (RK4) with variable dt
 */

export class PhysicsEngine {
    constructor() {
        // Celestial / Environment defaults
        this.gravity = 9.81;        // m/s^2 (Earth standard)
        this.airDensity = 1.225;     // kg/m^3 (Sea level, 15°C)
        this.enableDrag = false;
        this.enableWind = false;
        this.windSpeedX = 0;        // m/s (+ = tailwind, - = headwind)
        this.windSpeedY = 0;        // m/s (+ = updraft, - = downdraft)
        this.enableMagnus = false;
        this.spinRate = 0;          // rad/s (+ = backspin / lift, - = topspin / dive)
        this.barometricAltitude = false; // Air density decreases with altitude
        this.scaleHeight = 8500;    // meters

        // Integrator setting: 'rk4', 'euler-cromer', 'euler'
        this.solver = 'rk4';
        this.fixedDeltaTime = 0.005; // 5ms physics internal step for high precision
    }

    /**
     * Compute analytical values for ideal projectile motion (no air resistance)
     */
    static getIdealAnalytical(v0, angleDeg, y0, g = 9.81) {
        const rad = (angleDeg * Math.PI) / 180;
        const vx0 = v0 * Math.cos(rad);
        const vy0 = v0 * Math.sin(rad);

        // Time to peak
        const tPeak = vy0 > 0 ? vy0 / g : 0;
        const maxH = y0 + (vy0 > 0 ? (vy0 * vy0) / (2 * g) : 0);

        // Quadratic formula for total flight time: y0 + vy0*t - 0.5*g*t^2 = 0
        // -0.5*g*t^2 + vy0*t + y0 = 0 -> 0.5*g*t^2 - vy0*t - y0 = 0
        const discriminant = vy0 * vy0 + 2 * g * y0;
        const tFlight = (vy0 + Math.sqrt(Math.max(0, discriminant))) / g;

        // Range
        const totalRange = vx0 * tFlight;

        // Impact velocity components
        const vyImpact = vy0 - g * tFlight;
        const vImpact = Math.sqrt(vx0 * vx0 + vyImpact * vyImpact);
        const impactAngleDeg = (Math.atan2(Math.abs(vyImpact), vx0) * 180) / Math.PI;

        // Optimal launch angle for given y0 and v0
        let optimalAngleDeg = 45;
        if (y0 > 0 && v0 > 0) {
            optimalAngleDeg = (Math.asin(1 / Math.sqrt(2 + (2 * g * y0) / (v0 * v0))) * 180) / Math.PI;
        }

        return {
            vx0,
            vy0,
            tPeak,
            maxH,
            tFlight,
            totalRange,
            vImpact,
            vyImpact,
            impactAngleDeg,
            optimalAngleDeg
        };
    }

    /**
     * Get air density at a given altitude
     */
    getAirDensityAtAltitude(y) {
        if (!this.enableDrag) return 0;
        if (!this.barometricAltitude || y <= 0) return this.airDensity;
        return this.airDensity * Math.exp(-y / this.scaleHeight);
    }

    /**
     * Compute net acceleration given state (x, y, vx, vy) and projectile properties
     */
    computeAcceleration(state, projectile) {
        const { y, vx, vy } = state;
        const m = Math.max(0.0001, projectile.mass);
        const area = Math.PI * Math.pow(projectile.diameter / 2, 2);
        const Cd = projectile.dragCoefficient;

        // Gravity vector
        let ax = 0;
        let ay = -this.gravity;

        // Aerodynamics (Drag & Wind)
        if (this.enableDrag) {
            const rho = this.getAirDensityAtAltitude(y);
            const vRelX = vx - (this.enableWind ? this.windSpeedX : 0);
            const vRelY = vy - (this.enableWind ? this.windSpeedY : 0);
            const vRel = Math.sqrt(vRelX * vRelX + vRelY * vRelY);

            if (vRel > 1e-6) {
                // Drag force magnitude: Fd = 0.5 * rho * Cd * A * vRel^2
                const fDrag = 0.5 * rho * Cd * area * vRel * vRel;
                // Opposes relative velocity
                const fDragX = -fDrag * (vRelX / vRel);
                const fDragY = -fDrag * (vRelY / vRel);

                ax += fDragX / m;
                ay += fDragY / m;
            }

            // Magnus Effect (due to spin in 2D plane)
            // Backspin (spinRate > 0) generates upward lift perpendicular to relative velocity
            if (this.enableMagnus && Math.abs(this.spinRate) > 1e-4 && vRel > 1e-6) {
                const r = projectile.diameter / 2;
                // Lift coefficient approximation: Cl ~ (r * omega) / vRel (clamped)
                const spinParam = (r * this.spinRate) / vRel;
                const Cl = Math.min(0.6, Math.max(-0.6, spinParam * 0.5));
                const fLift = 0.5 * rho * Cl * area * vRel * vRel;

                // Lift unit vector is perpendicular to vRel (rotated 90 degrees CCW)
                const perpX = -vRelY / vRel;
                const perpY = vRelX / vRel;

                ax += (fLift * perpX) / m;
                ay += (fLift * perpY) / m;
            }
        }

        return { ax, ay };
    }

    /**
     * Advance state by dt using selected numerical integrator
     */
    step(state, projectile, dt) {
        switch (this.solver) {
            case 'euler':
                return this.stepEuler(state, projectile, dt);
            case 'euler-cromer':
                return this.stepEulerCromer(state, projectile, dt);
            case 'rk4':
            default:
                return this.stepRK4(state, projectile, dt);
        }
    }

    /**
     * Standard Forward Euler (1st order) - exhibits pedagogical energy drift
     */
    stepEuler(state, projectile, dt) {
        const { ax, ay } = this.computeAcceleration(state, projectile);
        return {
            x: state.x + state.vx * dt,
            y: state.y + state.vy * dt,
            vx: state.vx + ax * dt,
            vy: state.vy + ay * dt,
            t: state.t + dt,
            ax,
            ay
        };
    }

    /**
     * Semi-implicit Euler-Cromer (symplectic, better energy conservation for orbits/oscillations)
     */
    stepEulerCromer(state, projectile, dt) {
        const { ax, ay } = this.computeAcceleration(state, projectile);
        const newVx = state.vx + ax * dt;
        const newVy = state.vy + ay * dt;
        return {
            x: state.x + newVx * dt,
            y: state.y + newVy * dt,
            vx: newVx,
            vy: newVy,
            t: state.t + dt,
            ax,
            ay
        };
    }

    /**
     * 4th Order Runge-Kutta (RK4) - high precision ballistics solver
     */
    stepRK4(state, projectile, dt) {
        // k1
        const a1 = this.computeAcceleration(state, projectile);
        const v1x = state.vx;
        const v1y = state.vy;

        // k2
        const s2 = {
            x: state.x + 0.5 * dt * v1x,
            y: state.y + 0.5 * dt * v1y,
            vx: state.vx + 0.5 * dt * a1.ax,
            vy: state.vy + 0.5 * dt * a1.ay,
            t: state.t + 0.5 * dt
        };
        const a2 = this.computeAcceleration(s2, projectile);
        const v2x = s2.vx;
        const v2y = s2.vy;

        // k3
        const s3 = {
            x: state.x + 0.5 * dt * v2x,
            y: state.y + 0.5 * dt * v2y,
            vx: state.vx + 0.5 * dt * a2.ax,
            vy: state.vy + 0.5 * dt * a2.ay,
            t: state.t + 0.5 * dt
        };
        const a3 = this.computeAcceleration(s3, projectile);
        const v3x = s3.vx;
        const v3y = s3.vy;

        // k4
        const s4 = {
            x: state.x + dt * v3x,
            y: state.y + dt * v3y,
            vx: state.vx + dt * a3.ax,
            vy: state.vy + dt * a3.ay,
            t: state.t + dt
        };
        const a4 = this.computeAcceleration(s4, projectile);
        const v4x = s4.vx;
        const v4y = s4.vy;

        // Weighted integration
        const nextX = state.x + (dt / 6) * (v1x + 2 * v2x + 2 * v3x + v4x);
        const nextY = state.y + (dt / 6) * (v1y + 2 * v2y + 2 * v3y + v4y);
        const nextVx = state.vx + (dt / 6) * (a1.ax + 2 * a2.ax + 2 * a3.ax + a4.ax);
        const nextVy = state.vy + (dt / 6) * (a1.ay + 2 * a2.ay + 2 * a3.ay + a4.ay);

        // Average acceleration over the step
        const avgAx = (a1.ax + 2 * a2.ax + 2 * a3.ax + a4.ax) / 6;
        const avgAy = (a1.ay + 2 * a2.ay + 2 * a3.ay + a4.ay) / 6;

        return {
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
            t: state.t + dt,
            ax: avgAx,
            ay: avgAy
        };
    }

    /**
     * Compute mechanical energy of state
     */
    computeEnergies(state, projectile) {
        const m = projectile.mass;
        const speedSq = state.vx * state.vx + state.vy * state.vy;
        const ke = 0.5 * m * speedSq;
        const pe = Math.max(0, m * this.gravity * state.y);
        return {
            kinetic: ke,
            potential: pe,
            total: ke + pe,
            speed: Math.sqrt(speedSq)
        };
    }

    /**
     * Pre-compute an entire trajectory ahead of time for rendering ghost/guide paths
     * or comparing multiple launches.
     */
    simulateFullTrajectory(v0, angleDeg, y0, projectile, maxTime = 120, maxSteps = 20000) {
        const rad = (angleDeg * Math.PI) / 180;
        let state = {
            x: 0,
            y: y0,
            vx: v0 * Math.cos(rad),
            vy: v0 * Math.sin(rad),
            t: 0,
            ax: 0,
            ay: -this.gravity
        };

        const trajectory = [ { ...state } ];
        let maxHeight = y0;
        let tMaxHeight = 0;
        const dt = this.fixedDeltaTime;

        let steps = 0;
        while (steps < maxSteps && state.t < maxTime) {
            const nextState = this.step(state, projectile, dt);

            // Track max height
            if (nextState.y > maxHeight) {
                maxHeight = nextState.y;
                tMaxHeight = nextState.t;
            }

            // Check ground collision
            if (nextState.y <= 0) {
                // Linear interpolation to exact ground impact y=0
                const fraction = (0 - state.y) / (nextState.y - state.y);
                const impactT = state.t + fraction * dt;
                const impactX = state.x + fraction * (nextState.x - state.x);
                const impactVx = state.vx + fraction * (nextState.vx - state.vx);
                const impactVy = state.vy + fraction * (nextState.vy - state.vy);

                const finalImpact = {
                    x: Math.max(0, impactX),
                    y: 0,
                    vx: impactVx,
                    vy: impactVy,
                    t: impactT,
                    ax: nextState.ax,
                    ay: nextState.ay
                };
                trajectory.push(finalImpact);
                break;
            }

            state = nextState;
            trajectory.push({ ...state });
            steps++;
        }

        const finalPoint = trajectory[trajectory.length - 1];
        const vImpact = Math.sqrt(finalPoint.vx * finalPoint.vx + finalPoint.vy * finalPoint.vy);
        const impactAngle = (Math.atan2(Math.abs(finalPoint.vy), Math.max(0.001, finalPoint.vx)) * 180) / Math.PI;

        return {
            points: trajectory,
            maxHeight,
            tMaxHeight,
            range: finalPoint.x,
            tFlight: finalPoint.t,
            vImpact,
            impactAngle
        };
    }
}
