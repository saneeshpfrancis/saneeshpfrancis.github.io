export interface LabExercise {
  id: number;
  title: string;
  objective: string;
  procedure: string;
}

export interface SimulationItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Classical Mechanics" | "Oscillations & Waves" | "Electromagnetism" | "Modern Physics" | "Computational Physics";
  level: string;
  status: "Interactive" | "Under Development" | "Beta";
  folder: string;
  entryFile: string;
  description: string;
  highlights: string[];
  features: string[];
  tags: string[];
  exercises: LabExercise[];
  badgeColor?: string;
  featured?: boolean;
  theory?: {
    title: string;
    equation: string;
    notes: string;
  };
  guidanceTips?: {
    title: string;
    desc: string;
  }[];
}

/**
 * Registry of science simulations.
 *
 * To add a new simulation:
 * 1. Put your HTML/JS simulator files in `src/data/simulator/<your_folder>/index.html`
 * 2. Add an entry to this array.
 * The Vite build system will automatically sync it to public/dist for live serving.
 */
export const simulations: SimulationItem[] = [
  {
    id: "projectile_motion",
    title: "Multilevel Projectile Motion Physics Lab",
    subtitle: "Kinematics · Celestial Gravity · Aerodynamics & Magnus Lift · Computational Solvers",
    category: "Classical Mechanics",
    level: "Basic to Advanced",
    status: "Interactive",
    folder: "projectile_motion",
    entryFile: "index.html",
    description:
      "A comprehensive interactive physical science laboratory simulation exploring projectile kinematics and atmospheric aerodynamics across 4 progressive study levels. Models vacuum ballistic trajectories, multi-planet celestial gravitational fields (Earth, Moon, Mars, Jupiter), altitude-dependent quadratic air drag, wind vectors, Magnus spin lift, and numerical solver stability (RK4, Euler-Cromer, Forward Euler) with real-time vector overlays, photogates, and CSV telemetry export.",
    highlights: [
      "4 Progressive Modes: Basic Kinematics, Celestial Environments, Advanced Aerodynamics, and Labs & Challenges",
      "Multi-Planet Gravity: Earth (9.81 m/s²), Moon (1.62 m/s²), Mars (3.72 m/s²), Jupiter (24.79 m/s²), and custom planets",
      "Real-World Aerodynamics: Quadratic fluid drag F_drag = ½ρ(y)CdAv² with barometric altitude density model",
      "Spin Aerodynamics: Magnus effect topspin dive and backspin lift with adjustable spin rate",
      "Numerical Physics Solvers: Runge-Kutta 4th Order (RK4), Euler-Cromer, and Forward Euler with live energy drift tracking",
      "Virtual Lab Instruments: Draggable 2-point tape measure/caliper, twin laser photogates, obstacle wall, and CSV data logger",
    ],
    features: [
      "Full Interactive Canvas: Drag-and-aim barrel, pedestal height adjustment (0–30 m), target, and calipers",
      "8 Realistic Projectile Presets: Cannonball, Baseball, Golf Ball, Tennis Ball, Bowling Ball, Football, Bullet, Feather",
      "Live Scientific Telemetry: (t, x, y, |v|, KE, PE, Total E) and dynamic force & velocity vector overlays",
      "5 Guided Laboratory Protocols with automated experiment setup and theoretical predictions",
      "Target Scoring Ring System with bullseye detection and celebratory procedural audio chimes",
      "Multi-Channel Real-Time Oscilloscope with CSV data export for MATLAB, Python, and Excel",
    ],
    tags: [
      "Classical Mechanics",
      "Kinematics",
      "Aerodynamics",
      "Magnus Effect",
      "Fluid Resistance",
      "Celestial Gravity",
      "RK4 Integrator",
      "Virtual Labs",
    ],
    exercises: [
      {
        id: 1,
        title: "Finding the Angle of Maximum Range",
        objective:
          "Investigate how launch angle affects horizontal range and apex height across flat ground and elevated launch heights, and explore complementary angle symmetry.",
        procedure:
          "Launch at 45° with v₀ = 20 m/s from h₀ = 0 m and log the Range. Test complementary pairs: 30° vs 60°, then 15° vs 75°. Elevate cannon pedestal to h₀ = 10 m and observe the shift in optimal launch angle below 45°.",
      },
      {
        id: 2,
        title: "Independence of Horizontal and Vertical Motion",
        objective:
          "Prove that horizontal launch velocity has zero impact on vertical acceleration and flight time (the classic dropped vs horizontally fired paradox).",
        procedure:
          "Set cannon to h₀ = 15 m and angle = 0° (pure horizontal). Launch with v₀ = 25 m/s and record flight time t ≈ √(2h₀/g). Test with v₀ = 10 m/s and v₀ = 35 m/s to observe invariant flight duration.",
      },
      {
        id: 3,
        title: "Celestial Gravitational Mechanics",
        objective:
          "Compare projectile trajectories across different celestial bodies to verify inverse proportionality between surface gravity g and horizontal range R.",
        procedure:
          "Fire at 45° with v₀ = 20 m/s on Earth (g = 9.81 m/s²). Switch to the Moon (g = 1.62 m/s²) to observe a 6-fold range expansion. Then test Mars and Jupiter to observe gravitational suppression.",
      },
      {
        id: 4,
        title: "Aerodynamic Drag & Terminal Velocity",
        objective:
          "Examine the deformation of the parabolic trajectory due to quadratic atmospheric fluid resistance and compare high vs low density projectiles.",
        procedure:
          "Enable air resistance on Earth. Launch a heavy Cannonball, then compare with a lightweight Feather/Chute. Observe the asymmetric trajectory, steep descent slope, and terminal velocity descent.",
      },
      {
        id: 5,
        title: "Computational Physics & Integrator Stability",
        objective:
          "Compare numerical integration algorithms (Forward Euler vs Euler-Cromer vs Runge-Kutta 4) and measure artificial numerical energy creation.",
        procedure:
          "Select Forward Euler under Advanced Physics. Fire at 60° and observe upward drift in the Total Energy line. Switch to RK4 and verify that total mechanical energy remains rigorously conserved.",
      },
    ],
    featured: true,
    theory: {
      title: "Ballistic Kinematics, Aerodynamic Drag & Magnus Lift",
      equation: "m(d²r/dt²) = m g - ½ ρ(y) C_d A |v_rel| v_rel + ½ C_L ρ A |v_rel|² (ω × v_rel)/|ω × v_rel|",
      notes:
        "Vacuum Kinematics: R = (v₀² sin 2θ)/g, H_max = h₀ + (v₀² sin²θ)/(2g). Elevated optimal launch angle: θ_opt = arcsin(1 / √(2 + 2gh₀/v₀²)). Numerical Solvers: 4-stage Runge-Kutta 4 (RK4, local error O(Δt⁵)), Symplectic Euler-Cromer, and Forward Euler.",
    },
    guidanceTips: [
      {
        title: "Interactive Cannon Aim",
        desc: "Click and drag the cannon barrel to adjust launch angle, and drag the base pedestal to set height (0–30 m).",
      },
      {
        title: "Celestial Gravity",
        desc: "Switch between Earth, Moon (6x range expansion!), Mars, and Jupiter to verify R ∝ 1/g scaling.",
      },
      {
        title: "Aerodynamics & Spin",
        desc: "Enable air resistance with quadratic drag and apply backspin/topspin to observe Magnus aerodynamic lift.",
      },
      {
        title: "Solvers & Telemetry",
        desc: "Benchmark RK4 vs Euler-Cromer and Forward Euler on the live Energy graph and export CSV data.",
      },
    ],
  },
  {
    id: "simple_pendulum",
    title: "Nonlinear Simple Pendulum Simulator",
    subtitle: "Classical Mechanics · Non-linear Dynamics · Computational Integrators",
    category: "Classical Mechanics",
    level: "Degree Level",
    status: "Interactive",
    folder: "simple_pendulum",
    entryFile: "index.html",
    description:
      "A high-precision, undergraduate physical science simulation modeling large-amplitude nonlinear pendulum dynamics, comparing exact elliptic integral periods against harmonic approximations, benchmarking symplectic vs non-symplectic integrators, and visualizing phase space separatrices and FFT frequency spectra in real time.",
    highlights: [
      "Exact AGM Elliptic Period calculation to machine precision (10⁻¹⁵)",
      "4 Numerical Integrators: RK4, Velocity-Verlet, Euler-Cromer, Forward Euler",
      "Interactive Phase Space (θ vs ω) with Separatrix flow boundary",
      "On-the-fly Fast Fourier Transform (FFT) harmonic power spectrum",
      "Dynamic force & velocity vector overlays with virtual photogate",
      "Real-time data streaming & CSV export for Python, MATLAB, and Excel",
    ],
    features: [
      "Symplectic vs Non-Symplectic Integrator Drift Analysis",
      "Real-Time Oscilloscope for θ(t), ω(t), α(t), and Energy Drift %",
      "Full 360° Drag & Drop Bob Positioning",
      "Photogate Sensor for Experimental Period Timing",
      "Viscous Air Drag & Quadratic Fluid Damping",
      "Periodic Sinusoidal Driving Torque for Chaos Studies",
    ],
    tags: [
      "Classical Mechanics",
      "Nonlinear Dynamics",
      "Symplectic Integrators",
      "Phase Space",
      "Separatrix",
      "FFT Analysis",
      "Virtual Labs",
    ],
    exercises: [
      {
        id: 1,
        title: "Large-Angle Anharmonicity & Elliptic Period Validation",
        objective:
          "Measure the deviation of the pendulum's period from the simple harmonic approximation T₀ = 2π√(L/g) as initial amplitude θ₀ increases.",
        procedure:
          "Set L = 1.0 m, m = 1.0 kg, g = 9.807 m/s², γ = 0. Test angles θ₀ ∈ {5°, 20°, 45°, 60°, 90°, 120°, 150°}. Record measured photogate period and compare against the AGM elliptic integral and Borda's series expansion.",
      },
      {
        id: 2,
        title: "Symplectic vs. Non-Symplectic Integrator Stability",
        objective:
          "Understand Liouville's theorem and artificial numerical energy drift across different mathematical integration methods.",
        procedure:
          "Release bob with θ₀ = 45°, γ = 0. Switch to Forward Euler and observe rapid positive energy divergence. Reset and switch to Velocity-Verlet or Euler-Cromer to observe tight energy conservation. Benchmark local error vs RK4.",
      },
      {
        id: 3,
        title: "Phase Space Topology & The Separatrix",
        objective:
          "Map the topological boundary between bounded oscillatory libration and unbounded whirling rotation in (θ, ω) phase space.",
        procedure:
          "Select Phase Space tab. Click preset 'Separatrix & Inverted (θ₀ = 179.5°)'. Observe asymptotic slowing near the saddle point. Apply initial angular velocity ω₀ > 2√(g/L) to verify entry into continuous rotation.",
      },
      {
        id: 4,
        title: "Harmonic Generation via Fast Fourier Transform (FFT)",
        objective:
          "Demonstrate that nonlinear restoring torque sin(θ) ≈ θ - θ³/6 introduces odd higher harmonics.",
        procedure:
          "Switch to FFT Spectrum tab. Start at small amplitude θ₀ = 5° to verify single fundamental peak f₀. Increase θ₀ to 120° and note the emergence of the 3rd and 5th odd harmonics (3f₀, 5f₀).",
      },
      {
        id: 5,
        title: "Driven Damped Oscillations & Deterministic Chaos",
        objective:
          "Explore strange attractors and sensitivity to initial conditions in driven nonlinear physical systems.",
        procedure:
          "Select preset 'Deterministic Chaos' (γ = 0.5, τ₀ = 1.2, Ω = 2/3 rad/s). Watch the continuous non-repeating trajectory fold and stretch in phase space.",
      },
    ],
    featured: true,
    theory: {
      title: "Mathematical & Theoretical Rigor",
      equation: "d²θ/dt² + γ(dθ/dt) + c_quad(dθ/dt)|dθ/dt|L + (g/L)sin(θ) = τ_drive(t)/(mL²)",
      notes:
        "Exact Period via Arithmetic-Geometric Mean (AGM): T(θ₀) = 4√(L/g) K(sin(θ₀/2)). Separatrix Boundary: ω_sep(θ) = ±2√(g/L) cos(θ/2). Solvers: 4-stage Runge-Kutta 4, Velocity-Verlet, Euler-Cromer, and Forward Euler.",
    },
    guidanceTips: [
      {
        title: "Interactive Drag",
        desc: "Click and drag the pendulum bob in the canvas to set initial angle θ₀.",
      },
      {
        title: "Integrator Benchmark",
        desc: "Switch between Forward Euler, Euler-Cromer, Verlet, and RK4 to view energy drift.",
      },
      {
        title: "Phase Space Flow",
        desc: "View libration vs unbounded rotation across the Separatrix boundary.",
      },
      {
        title: "FFT Harmonic Spectrum",
        desc: "Observe odd non-linear harmonic generation (3f₀, 5f₀) at large amplitudes.",
      },
    ],
  },
];

export const simulationCategories = [
  "All",
  "Classical Mechanics",
  "Oscillations & Waves",
  "Electromagnetism",
  "Computational Physics",
] as const;

export function getSimulationPath(item: SimulationItem): string {
  // Uses Vite base URL or relative root path
  return `./simulator/${item.folder}/${item.entryFile}`;
}
