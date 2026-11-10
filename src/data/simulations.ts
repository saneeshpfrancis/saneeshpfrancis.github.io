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
