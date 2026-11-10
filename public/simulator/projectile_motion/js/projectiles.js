/**
 * Projectile and Celestial Presets and Data
 */

export const PROJECTILE_PRESETS = {
    cannonball: {
        id: 'cannonball',
        name: 'Cannonball',
        mass: 5.0,          // kg
        diameter: 0.15,     // m
        dragCoefficient: 0.47,
        color: '#34495e',
        emoji: '💣',
        description: 'Dense metal sphere, high inertia, standard baseline.'
    },
    baseball: {
        id: 'baseball',
        name: 'Baseball',
        mass: 0.145,        // kg
        diameter: 0.074,    // m
        dragCoefficient: 0.30,
        color: '#ecf0f1',
        emoji: '⚾',
        description: 'Standard baseball with stitched seam aerodynamics.'
    },
    golfball: {
        id: 'golfball',
        name: 'Golf Ball',
        mass: 0.0459,       // kg
        diameter: 0.0427,   // m
        dragCoefficient: 0.25,
        color: '#ffffff',
        emoji: '⛳',
        description: 'Dimpled surface reduces drag crisis and promotes lift.'
    },
    tennisball: {
        id: 'tennisball',
        name: 'Tennis Ball',
        mass: 0.057,        // kg
        diameter: 0.067,    // m
        dragCoefficient: 0.55,
        color: '#cddc39',
        emoji: '🎾',
        description: 'Felt fuzzy surface creates strong boundary layer drag.'
    },
    bowlingball: {
        id: 'bowlingball',
        name: 'Bowling Ball',
        mass: 7.0,          // kg
        diameter: 0.22,     // m
        dragCoefficient: 0.47,
        color: '#2c3e50',
        emoji: '🎳',
        description: 'Heavy, smooth solid sphere with massive momentum.'
    },
    football: {
        id: 'football',
        name: 'Football',
        mass: 0.42,         // kg
        diameter: 0.18,     // effective cross-section
        dragCoefficient: 0.22,
        color: '#8d6e63',
        emoji: '🏈',
        description: 'Pointed prolate spheroid with streamlined frontal profile.'
    },
    bullet: {
        id: 'bullet',
        name: 'Rifle Bullet',
        mass: 0.010,        // 10g
        diameter: 0.009,    // 9mm
        dragCoefficient: 0.15,
        color: '#f39c12',
        emoji: '🎯',
        description: 'Pointed ogive profile, high sectional density.'
    },
    feather: {
        id: 'feather',
        name: 'Feather / Chute',
        mass: 0.005,        // 5g
        diameter: 0.25,     // 25cm
        dragCoefficient: 1.35,
        color: '#81d4fa',
        emoji: '🪶',
        description: 'Very light weight with high area, reaches low terminal velocity quickly.'
    },
    custom: {
        id: 'custom',
        name: 'Custom Body',
        mass: 1.0,
        diameter: 0.1,
        dragCoefficient: 0.47,
        color: '#9b59b6',
        emoji: '⚙️',
        description: 'User-configurable physical and aerodynamic parameters.'
    }
};

export const CELESTIAL_PRESETS = {
    earth: {
        id: 'earth',
        name: 'Earth (Standard)',
        gravity: 9.81,
        airDensity: 1.225,
        atmosphereName: 'Air (1.225 kg/m³)',
        skyColor: '#1e293b',
        groundColor: '#166534',
        emoji: '🌍'
    },
    moon: {
        id: 'moon',
        name: 'Moon',
        gravity: 1.62,
        airDensity: 0.0,
        atmosphereName: 'Vacuum (0.000 kg/m³)',
        skyColor: '#090d16',
        groundColor: '#64748b',
        emoji: '🌑'
    },
    mars: {
        id: 'mars',
        name: 'Mars',
        gravity: 3.72,
        airDensity: 0.020,
        atmosphereName: 'Thin CO₂ (0.020 kg/m³)',
        skyColor: '#2b1a16',
        groundColor: '#9a3412',
        emoji: '🪐'
    },
    jupiter: {
        id: 'jupiter',
        name: 'Jupiter (Cloud Deck)',
        gravity: 24.79,
        airDensity: 0.150,
        atmosphereName: 'Gas Giant (0.150 kg/m³)',
        skyColor: '#362417',
        groundColor: '#c2410c',
        emoji: '🌕'
    },
    vacuumEarth: {
        id: 'vacuumEarth',
        name: 'Earth (Vacuum Chamber)',
        gravity: 9.81,
        airDensity: 0.0,
        atmosphereName: 'Pure Vacuum (0.000 kg/m³)',
        skyColor: '#0f172a',
        groundColor: '#334155',
        emoji: '🧪'
    },
    custom: {
        id: 'custom',
        name: 'Custom Environment',
        gravity: 9.81,
        airDensity: 1.225,
        atmosphereName: 'Custom Atmosphere',
        skyColor: '#1e293b',
        groundColor: '#166534',
        emoji: '🎛️'
    }
};
