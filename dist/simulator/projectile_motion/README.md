# 🚀 Projectile Motion Physics Science Lab Simulation

An interactive, high-precision physics laboratory simulation designed for learning, experimenting, and analyzing **Projectile Motion** from **Basic** to **Advanced** physics levels.

![Level Coverage](https://img.shields.io/badge/Physics_Levels-Basic_to_Advance-blue)
![Numerical Engine](https://img.shields.io/badge/Solvers-Analytical_%7C_Euler_%7C_Euler--Cromer_%7C_RK4-emerald)
![Telemetry](https://img.shields.io/badge/Telemetry-Real--Time_Graphs_%26_CSV-purple)
![Zero Dependency](https://img.shields.io/badge/Dependencies-Zero_Standalone_Web-orange)

---

## 🌟 Quick Start

### Option 1: Run with Python Server (Recommended)
From the project folder, simply run:
```bash
python server.py
```
This automatically launches your browser and navigates to `http://localhost:8080/index.html`.

### Option 2: Open Directly in Any Browser
Double-click `index.html` in your file explorer, or right-click `index.html` and select **Open with Chrome / Edge / Firefox**.

---

## 🔬 Level Progression Breakdown

The simulation provides 4 dedicated modes tailored to different stages of scientific study:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        PROJECTILE MOTION LAB                           │
├───────────────┬──────────────────┬──────────────────┬──────────────────┤
│ 1. BASIC      │ 2. INTERMEDIATE  │ 3. ADVANCE       │ 4. LABS &        │
│    LEVEL      │    LEVEL         │    LEVEL         │    CHALLENGES    │
├───────────────┼──────────────────┼──────────────────┼──────────────────┤
│ • Vacuum      │ • Celestial      │ • Quadratic Drag │ • 5 Guided Lab   │
│   kinematics  │   Bodies (Earth, │   (F_drag)       │   Protocols      │
│ • Parabolic   │   Moon, Mars,    │ • Altitude air   │ • Photogates &   │
│   trajectories│   Jupiter)       │   density ρ(y)   │   Tape Measure   │
│ • v₀, θ, h₀   │ • Projectile     │ • Horizontal     │ • Real-time CSV  │
│   sliders     │   Presets (Mass, │   Wind vectors   │   data export    │
│ • Interactive │   Diameter)      │ • Magnus Effect  │ • Obstacle walls │
│   Cannon aim  │ • Energy gauges  │   (Spin lift)    │ • Target scoring │
│ • Predictive  │   (KE, PE,       │ • RK4 vs Euler   │   system         │
│   formulas    │   Mechanical)    │   numerical drift│                  │
└───────────────┴──────────────────┴──────────────────┴──────────────────┘
```

---

### 🟢 Level 1: Basic Level (Ideal Vacuum Kinematics)
* **Physics Scope**: Constant gravitational acceleration $g = 9.81\text{ m/s}^2$, no air resistance.
* **Core Variables**:
  - Initial Velocity ($v_0$): $1\text{ to }100\text{ m/s}$.
  - Launch Angle ($\theta$): $0^\circ\text{ to }90^\circ$ (drag barrel directly on canvas!).
  - Launch Height ($h_0$): $0\text{ to }30\text{ m}$ (drag pedestal up and down!).
* **Theoretical Predictions**:
  - Apex Max Height:
    $$H_{\text{max}} = h_0 + \frac{v_0^2 \sin^2\theta}{2g}$$
  - Total Flight Time:
    $$T_{\text{flight}} = \frac{v_0 \sin\theta + \sqrt{v_0^2 \sin^2\theta + 2 g h_0}}{g}$$
  - Horizontal Range:
    $$R = v_0 \cos\theta \cdot T_{\text{flight}}$$
  - Optimal Angle for Elevated Launch:
    $$\theta_{\text{opt}} = \arcsin\left(\frac{1}{\sqrt{2 + \frac{2 g h_0}{v_0^2}}}\right)$$
* **Visuals**: Color-coded velocity vector arrows ($\vec{v}$, $v_x$, $v_y$), apex indicator, impact landing marker, and historical "ghost trails".

---

### 🟡 Level 2: Intermediate Level (Celestial Mechanics & Energy)
* **Celestial Environments**:
  - 🌍 **Earth**: $g = 9.81\text{ m/s}^2, \rho = 1.225\text{ kg/m}^3$
  - 🌑 **Moon**: $g = 1.62\text{ m/s}^2, \rho = 0.000\text{ kg/m}^3$ (Observe extreme 6x range expansion!)
  - 🪐 **Mars**: $g = 3.72\text{ m/s}^2, \rho = 0.020\text{ kg/m}^3$
  - 🌕 **Jupiter**: $g = 24.79\text{ m/s}^2, \rho = 0.150\text{ kg/m}^3$ (Heavy gravitational suppression)
  - 🧪 **Vacuum Chamber Earth**: $g = 9.81\text{ m/s}^2, \rho = 0.000\text{ kg/m}^3$
  - 🎛️ **Custom Planet**: Slider from $0.5\text{ to }30.0\text{ m/s}^2$
* **Projectile Presets**:
  - Cannonball ($5.0\text{ kg}, 0.15\text{ m}, C_d = 0.47$)
  - Baseball ($0.145\text{ kg}, 0.074\text{ m}, C_d = 0.30$)
  - Golf Ball ($0.046\text{ kg}, 0.043\text{ m}, C_d = 0.25$)
  - Tennis Ball ($0.057\text{ kg}, 0.067\text{ m}, C_d = 0.55$)
  - Bowling Ball ($7.0\text{ kg}, 0.22\text{ m}, C_d = 0.47$)
  - Football ($0.42\text{ kg}, 0.18\text{ m}, C_d = 0.22$)
  - Rifle Bullet ($0.010\text{ kg}, 0.009\text{ m}, C_d = 0.15$)
  - Feather / Chute ($0.005\text{ kg}, 0.25\text{ m}, C_d = 1.35$)
* **Mechanical Energy Conservation**:
  - Live calculation of Kinetic Energy $KE = \frac{1}{2} m v^2$, Potential Energy $PE = mgy$, and Total Energy $E = KE + PE$.
  - Energy vs. Time graph showing perfect flatline conservation in vacuum.

---

### 🟣 Level 3: Advance Level (Real-World Aerodynamics & Computational Physics)
* **Quadratic Aerodynamic Drag**:
  $$\vec{F}_{\text{drag}} = -\frac{1}{2} \rho(y) C_d A |\vec{v}_{\text{rel}}| \vec{v}_{\text{rel}}$$
  where $\vec{v}_{\text{rel}} = \vec{v} - \vec{v}_{\text{wind}}$.
  - Observe trajectory asymmetry: steep descent slope and terminal velocity cutoff!
* **Horizontal & Vertical Wind Vectors**:
  - Headwind ($-v_w$) vs Tailwind ($+v_w$) with realistic relative velocity drag.
* **Magnus Effect (Spin Aerodynamics)**:
  - Backspin ($\omega > 0$) generates upward aerodynamic lift:
    $$\vec{F}_{\text{magnus}} = \frac{1}{2} C_L \rho A |\vec{v}_{\text{rel}}|^2 \hat{n}$$
  - Topspin ($\omega < 0$) produces downward dive.
* **Barometric Air Density Model**:
  $$\rho(y) = \rho_0 e^{-y / H_{\text{scale}}}$$
* **Numerical Physics Solvers**:
  - **Runge-Kutta 4th Order (RK4)**: 4-stage weighted integration with local truncation error $\mathcal{O}(\Delta t^5)$ and global error $\mathcal{O}(\Delta t^4)$.
  - **Euler-Cromer**: Symplectic semi-implicit method conserving phase-space area.
  - **Forward Euler**: 1st order explicit solver ($x_{n+1} = x_n + v_n \Delta t$). Shows pedagogical artificial energy gain!

---

### 🏆 Level 4: Guided Science Labs & Target Challenges

#### 5 Structured Science Lab Protocols:
1. **Lab 1: Finding the Angle of Maximum Range**: Flat ground vs elevated cliff; symmetry of complementary angles ($30^\circ$ and $60^\circ$).
2. **Lab 2: Independence of Horizontal and Vertical Motion**: The classic "Drop vs Shoot" paradox.
3. **Lab 3: Celestial Gravitational Mechanics**: Verifying inverse proportionality $R \propto 1/g$.
4. **Lab 4: Aerodynamic Drag & Terminal Velocity**: Comparing high-density cannonballs vs lightweight feathers in atmosphere.
5. **Lab 5: Computational Physics & Integrator Energy Drift**: Comparing Euler artificial energy expansion vs RK4 exact conservation.

#### Target Practice & Challenges:
- **Target Ring Scoring**: Bullseye (100 pts), Inner Ring (50 pts), Outer Ring (25 pts) with procedural celebratory confetti and sound chimes.
- **Castle Wall Obstacle**: Test clearance problems over a defensive wall.
- **Virtual Caliper / Tape Measure**: Draggable 2-point measurement tool reporting $\Delta x$, $\Delta y$, direct Euclidean distance, and inclination angle.
- **Twin Photogates / Speed Traps**: Placeable laser gates reporting exact passage velocity, timestamp, and height.
- **Export to CSV**: Download complete lab data table directly into Excel / Google Sheets for formal scientific writeups.

---

## 📂 Project Architecture

```
Projectile_motion/
├── index.html            # Main responsive single-page lab interface
├── server.py             # Optional Python HTTP server with auto-browser launch
├── css/
│   ├── style.css         # Modern scientific dark-mode UI & layout
│   └── lab.css           # Guided experiments, challenges & formula badges
├── js/
│   ├── physics.js        # Physics engine (Ideal, Drag, Wind, Magnus, RK4/Euler)
│   ├── projectiles.js    # Presets for projectiles & celestial environments
│   ├── renderer.js       # HTML5 Canvas visual engine (grid, vectors, cannon, trails)
│   ├── instruments.js    # Virtual tape measure, photogates, target, obstacle wall
│   ├── graphs.js         # Real-time multi-channel canvas graphing system
│   ├── audio.js          # Web Audio API procedural sound synthesizer
│   ├── experiments.js    # Lab protocol definitions and challenge levels
│   └── app.js            # Main application controller and event bus
└── README.md             # Scientific documentation & user manual
```

---

## ⌨️ Controls & Shortcuts

| Action | Control |
| :--- | :--- |
| **Aim Cannon Angle ($\theta$)** | Click and drag the cannon barrel on canvas, or use the Angle slider/input |
| **Adjust Launch Height ($h_0$)** | Click and drag the cannon pedestal vertically, or use the Height slider |
| **Move Target** | Click and drag the target along the ground |
| **Move Measurement Tape** | Drag endpoint A or B anywhere on the canvas |
| **Move Photogates** | Click and drag the sensor head of Gate 1 or Gate 2 |
| **Zoom In / Out** | Scroll wheel up / down over the simulation canvas |
| **Pan Camera** | Click and drag empty space on the canvas |
| **Fire Projectile** | Click the red **🔥 FIRE** button |
| **Pause / Resume** | Click **⏸️ Pause** or press Space |
| **Single Frame Step** | Click **⏭️ Step** (advances 20ms) |
| **Fit View** | Click **🔍 Fit View** to auto-frame the trajectory |

---

## ⚖️ License
Open-source educational resource for students, teachers, and researchers. Free to use, adapt, and expand.
