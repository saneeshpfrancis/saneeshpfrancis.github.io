/**
 * Virtual Scientific Measurement Instruments:
 * - Tape Measure / Calipers (measures distance, dx, dy, angle)
 * - Photogates (measures speed, timestamp, height when projectile passes)
 * - Movable Target (with score rings)
 * - Obstacle Wall (for obstacle clearance experiments)
 */

export class TapeMeasure {
    constructor(x1 = 0, y1 = 0, x2 = 20, y2 = 0) {
        this.p1 = { x: x1, y: y1 }; // meters
        this.p2 = { x: x2, y: y2 }; // meters
        this.visible = false;
        this.draggingNode = null; // 'p1', 'p2', or 'body'
        this.dragOffset = { x: 0, y: 0 };
    }

    getDistance() {
        const dx = this.p2.x - this.p1.x;
        const dy = this.p2.y - this.p1.y;
        return {
            dx: Math.abs(dx),
            dy: Math.abs(dy),
            total: Math.sqrt(dx * dx + dy * dy),
            angleDeg: (Math.atan2(dy, dx) * 180) / Math.PI
        };
    }
}

export class Photogate {
    constructor(id, label, x = 15, y = 0, height = 15) {
        this.id = id;
        this.label = label;
        this.x = x;           // meters
        this.y = y;           // meters
        this.height = height; // meters
        this.visible = false;
        this.triggered = false;
        this.lastTriggerData = null; // { time, speed, vx, vy, y }
        this.isDragging = false;
    }

    reset() {
        this.triggered = false;
        this.lastTriggerData = null;
    }

    checkTrigger(prevState, currState) {
        if (!this.visible || this.triggered) return null;

        // Check if projectile crossed the photogate vertical line x between prevState and currState
        const crossedX = (prevState.x <= this.x && currState.x >= this.x) ||
                         (prevState.x >= this.x && currState.x <= this.x);

        if (crossedX) {
            // Check if within vertical beam height [this.y, this.y + this.height]
            const frac = (this.x - prevState.x) / (currState.x - prevState.x || 0.0001);
            const crossY = prevState.y + frac * (currState.y - prevState.y);

            if (crossY >= this.y && crossY <= this.y + this.height) {
                const crossT = prevState.t + frac * (currState.t - prevState.t);
                const crossVx = prevState.vx + frac * (currState.vx - prevState.vx);
                const crossVy = prevState.vy + frac * (currState.vy - prevState.vy);
                const speed = Math.sqrt(crossVx * crossVx + crossVy * crossVy);

                this.triggered = true;
                this.lastTriggerData = {
                    time: crossT,
                    speed,
                    vx: crossVx,
                    vy: crossVy,
                    y: crossY
                };
                return this.lastTriggerData;
            }
        }
        return null;
    }
}

export class Target {
    constructor(x = 35, y = 0, radius = 2.5) {
        this.x = x;         // meters from origin
        this.y = y;         // altitude
        this.radius = radius; // outer radius in meters
        this.visible = true;
        this.hitScore = null; // null or score (100, 50, 25)
        this.isDragging = false;
    }

    checkHit(impactX, impactY = 0) {
        const dist = Math.abs(impactX - this.x);
        if (dist <= this.radius) {
            if (dist <= this.radius * 0.25) {
                this.hitScore = { score: 100, label: 'BULLSEYE! 🎯 (100 pts)', dist };
            } else if (dist <= this.radius * 0.6) {
                this.hitScore = { score: 50, label: 'GREAT HIT! 🥈 (50 pts)', dist };
            } else {
                this.hitScore = { score: 25, label: 'ON TARGET! 🥉 (25 pts)', dist };
            }
            return this.hitScore;
        }
        this.hitScore = null;
        return null;
    }
}

export class ObstacleWall {
    constructor(x = 25, width = 1.0, height = 10) {
        this.x = x;          // meters
        this.width = width;  // meters
        this.height = height;// meters
        this.enabled = false;
        this.isDragging = false;
    }

    checkCollision(x, y, radius = 0.1) {
        if (!this.enabled) return false;
        const inX = x + radius >= this.x && x - radius <= this.x + this.width;
        const inY = y - radius <= this.height && y >= 0;
        return inX && inY;
    }
}
