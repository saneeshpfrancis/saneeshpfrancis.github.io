import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';

export default function App() {
  return (
    <div className="w-screen h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden flex flex-col">
      <header className="p-6 z-10 bg-black/20 backdrop-blur-md border-b border-white/10 shrink-0">
        <h1 className="text-3xl font-extrabold tracking-tight">Spectrometer 3D Lab</h1>
        <p className="text-sm text-slate-300">Interactive simulation of prism refraction experiment.</p>
      </header>
      <main className="flex-1 relative min-h-0">
        <Canvas camera={{ position: [0, 3, 5], fov: 45 }} shadows>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
          <Suspense fallback={null}>
            <group position={[0, -0.5, 0]}>
              {/* Base */}
              <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <cylinderGeometry args={[1.8, 2, 0.15, 64]} />
                <meshStandardMaterial color="#6ee7b7" roughness={0.2} />
              </mesh>
              {/* Prism */}
              <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.8, 0.8, 0.8]} />
                <meshStandardMaterial color="#38bdf8" opacity={0.7} transparent />
              </mesh>
              {/* Telescope arm */}
              <mesh position={[1.8, 1, 0]} rotation={[0, 0, Math.PI / 6]}>
                <cylinderGeometry args={[0.1, 0.1, 1.2, 16]} />
                <meshStandardMaterial color="#334155" />
              </mesh>
              {/* Collimator */}
              <mesh position={[-1.8, 1, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
                <meshStandardMaterial color="#64748b" />
              </mesh>
            </group>
            <OrbitControls />
          </Suspense>
        </Canvas>
        <div className="absolute bottom-8 left-8 bg-black/50 p-6 rounded-2xl border border-white/10 backdrop-blur-md shadow-2xl max-w-xs">
          <h2 className="text-xl font-bold mb-4">Controls</h2>
          <ul className="text-sm space-y-2 text-slate-200">
            <li>• <strong>Drag</strong> to rotate view</li>
            <li>• <strong>Scroll</strong> to zoom</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
