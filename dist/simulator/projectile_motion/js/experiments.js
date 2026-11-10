/**
 * Guided Science Experiments and Challenge Modes
 * Structured laboratory protocols from basic to advanced levels.
 */

export const GUIDED_EXPERIMENTS = [
    {
        id: 'exp1-max-range',
        level: 'basic',
        title: 'Lab 1: Finding the Angle of Maximum Range',
        subtitle: 'Basic Level • Flat Ground vs Elevated Launch',
        objectives: [
            'Investigate how launch angle affects horizontal range and apex height.',
            'Observe the symmetry of complementary angles (e.g. 30° and 60°, 15° and 75°).',
            'Discover why elevating the launcher shifts the optimal angle below 45°.'
        ],
        setup: {
            v0: 20,
            angle: 45,
            y0: 0,
            planet: 'earth',
            drag: false,
            targetX: 40.77
        },
        procedure: [
            '1. Launch at 45° with v₀ = 20 m/s from h₀ = 0 m and log the Range.',
            '2. Test complementary pairs: 30° vs 60°, then 15° vs 75°. Notice identical landing spots!',
            '3. Elevate cannon pedestal to h₀ = 10 m. Fire at 45°, then test 35°–42°. Find the new maximum range.'
        ],
        theory: 'For flat ground in a vacuum, R = (v₀² sin 2θ) / g, which reaches its global maximum at 2θ = 90° (θ = 45°). When elevated by h₀, the optimal angle is θ_opt = arcsin(1 / √(2 + 2gh₀ / v₀²)) < 45°.'
    },
    {
        id: 'exp2-motion-independence',
        level: 'intermediate',
        title: 'Lab 2: Independence of Horizontal and Vertical Motion',
        subtitle: 'Intermediate Level • The Classic Dropped vs Fired Paradox',
        objectives: [
            'Prove that horizontal velocity has zero impact on vertical acceleration.',
            'Observe that a horizontally fired projectile hits the ground at the same time as a dropped projectile.'
        ],
        setup: {
            v0: 25,
            angle: 0, // Horizontal launch
            y0: 15,
            planet: 'earth',
            drag: false,
            targetX: 43.8
        },
        procedure: [
            '1. Set cannon to h₀ = 15m and angle = 0° (purely horizontal).',
            '2. Launch with v₀ = 25 m/s. Measure time of flight with the photogate or data table (t ≈ 1.75s).',
            '3. Now test with v₀ = 10 m/s and v₀ = 35 m/s. Notice that flight time t = √(2h₀/g) remains completely unchanged!'
        ],
        theory: 'Because gravity acts strictly downwards in the vertical axis (a_y = -g) and there is no horizontal acceleration (a_x = 0), horizontal motion x(t) and vertical motion y(t) are completely independent.'
    },
    {
        id: 'exp3-celestial-gravity',
        level: 'intermediate',
        title: 'Lab 3: Celestial Gravitational Mechanics',
        subtitle: 'Intermediate Level • Earth vs Moon vs Mars vs Jupiter',
        objectives: [
            'Compare projectile trajectories across different celestial bodies.',
            'Verify the inverse proportionality between surface gravity g and range R.'
        ],
        setup: {
            v0: 20,
            angle: 45,
            y0: 0,
            planet: 'moon',
            drag: false,
            targetX: 120
        },
        procedure: [
            '1. Fire on Earth (g = 9.81 m/s²). Notice Range ≈ 40.8 m.',
            '2. Switch to Moon (g = 1.62 m/s²). Fire with identical parameters. Notice Range expands 6-fold to ≈ 246.9 m!',
            '3. Switch to Jupiter (g = 24.79 m/s²). Observe the heavy gravitational suppression.'
        ],
        theory: 'Range R = v₀² sin(2θ) / g. Since R ∝ 1/g, lower gravity environments proportionally increase both flight time and horizontal range.'
    },
    {
        id: 'exp4-aerodynamic-drag',
        level: 'advance',
        title: 'Lab 4: Aerodynamic Drag & Terminal Velocity',
        subtitle: 'Advanced Level • Realistic Fluid Dynamics',
        objectives: [
            'Examine the deformation of the parabolic trajectory due to quadratic fluid drag.',
            'Observe terminal descent angle and terminal velocity.',
            'Contrast high-density projectiles (Cannonball) with low-density projectiles (Feather/Chute).'
        ],
        setup: {
            v0: 30,
            angle: 50,
            y0: 0,
            planet: 'earth',
            drag: true,
            projectile: 'feather',
            wind: 0
        },
        procedure: [
            '1. Turn Air Resistance ON. Select the Cannonball and launch. Notice slight range reduction.',
            '2. Now switch projectile to Feather / Chute (high drag area, low mass). Launch again.',
            '3. Inspect the trajectory shape: it is no longer a symmetric parabola! It rises and then drops almost vertically at terminal velocity.'
        ],
        theory: 'Quadratic drag force F_drag = 0.5 ρ C_d A v² continuously removes kinetic energy. At terminal velocity, F_drag balances gravity (mg), preventing further downward acceleration.'
    },
    {
        id: 'exp5-numerical-integrators',
        level: 'advance',
        title: 'Lab 5: Computational Physics & Integrator Stability',
        subtitle: 'Advanced Level • Euler vs Euler-Cromer vs Runge-Kutta 4',
        objectives: [
            'Compare numerical approximation algorithms used in scientific physics simulations.',
            'Observe artificial energy creation in standard Forward Euler compared to RK4.'
        ],
        setup: {
            v0: 30,
            angle: 60,
            y0: 0,
            planet: 'earth',
            drag: false,
            solver: 'euler'
        },
        procedure: [
            '1. Select Euler solver under Advanced Physics. Launch and view the Energy vs Time graph.',
            '2. Notice the total mechanical energy line drifts upwards during flight (numerical energy leakage).',
            '3. Switch solver to Runge-Kutta 4 (RK4). Re-launch and verify that Total Energy remains strictly horizontal (conserved).'
        ],
        theory: 'Forward Euler truncates the Taylor series at O(Δt), producing systematic cumulative error. RK4 matches the Taylor expansion through O(Δt⁴), maintaining high numerical conservation over ballistic trajectories.'
    }
];

export const CHALLENGES = [
    {
        id: 'chal-1',
        title: 'Challenge 1: Target Practice',
        difficulty: 'Basic',
        description: 'Hit the bullseye at 35.0 meters from ground level in vacuum.',
        hint: 'Try v₀ = 19.5 m/s at 45°, or use v₀ = 22 m/s and solve for the required angle!',
        targetX: 35.0,
        targetY: 0,
        cannonY: 0,
        wall: null,
        wind: 0,
        drag: false
    },
    {
        id: 'chal-2',
        title: 'Challenge 2: Cliff Launch to Island Target',
        difficulty: 'Intermediate',
        description: 'The cannon is perched on a 15.0m cliff. Land a cannonball squarely on the 55.0m target.',
        hint: 'Remember that launch height increases flight time. Angles between 35° and 40° provide optimal range!',
        targetX: 55.0,
        targetY: 0,
        cannonY: 15.0,
        wall: null,
        wind: 0,
        drag: false
    },
    {
        id: 'chal-3',
        title: 'Challenge 3: Clear the Castle Wall in High Wind',
        difficulty: 'Advanced',
        description: 'A 12m defensive wall stands at 25m distance with an 8 m/s headwind! Clear the wall and hit the target at 45m.',
        hint: 'You need high launch angle to clear the 12m wall, but higher speed to fight the headwind drag!',
        targetX: 45.0,
        targetY: 0,
        cannonY: 0,
        wall: { x: 25.0, height: 12.0, width: 1.5 },
        wind: -8.0,
        drag: true
    }
];
