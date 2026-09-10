/**
 * Decorative animated atom — a nod to physical sciences.
 * Pure SVG + SMIL, no images required.
 */
export function AtomVisual({ className }: { className?: string }) {
  const orbits = [
    { rotate: 0, dur: 7, begin: 0 },
    { rotate: 60, dur: 9, begin: -3 },
    { rotate: 120, dur: 11, begin: -6 },
  ];
  const rx = 165;
  const ry = 62;
  const c = 200;
  const ellipsePath = `M ${c - rx} ${c} a ${rx} ${ry} 0 1 0 ${rx * 2} 0 a ${rx} ${ry} 0 1 0 ${-rx * 2} 0`;

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Animated atom illustration"
    >
      <defs>
        <radialGradient id="nucleus-gradient" cx="40%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="35%" stopColor="var(--primary)" />
          <stop offset="100%" stopColor="var(--accent)" />
        </radialGradient>
        <radialGradient id="nucleus-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orbit-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.15" />
          <stop offset="50%" stopColor="var(--primary)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
        </linearGradient>
        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ambient glow */}
      <circle cx={c} cy={c} r={120} fill="url(#nucleus-glow)" />

      {/* Orbits + electrons */}
      {orbits.map((o, i) => (
        <g key={i} transform={`rotate(${o.rotate} ${c} ${c})`}>
          <path
            id={`orbit-${i}`}
            d={ellipsePath}
            fill="none"
            stroke="url(#orbit-stroke)"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            opacity="0.8"
          />
          <circle r="6.5" fill="var(--primary)" filter="url(#soft-glow)">
            <animateMotion dur={`${o.dur}s`} begin={`${o.begin}s`} repeatCount="indefinite" rotate="auto">
              <mpath href={`#orbit-${i}`} />
            </animateMotion>
          </circle>
          <circle r="2.5" fill="#ffffff" opacity="0.9">
            <animateMotion dur={`${o.dur}s`} begin={`${o.begin}s`} repeatCount="indefinite">
              <mpath href={`#orbit-${i}`} />
            </animateMotion>
          </circle>
        </g>
      ))}

      {/* Nucleus */}
      <circle cx={c} cy={c} r="30" fill="url(#nucleus-gradient)" filter="url(#soft-glow)">
        <animate attributeName="r" values="29;32;29" dur="3.6s" repeatCount="indefinite" />
      </circle>
      <circle cx={c} cy={c} r="44" fill="none" stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="1">
        <animate attributeName="r" values="40;58;40" dur="3.6s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values="0.45;0;0.45" dur="3.6s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
