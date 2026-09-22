'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import BenchWorld from './BenchWorld';
import Loader from '@/components/ui/Loader';
import MinimalNavigation from '@/components/ui/MinimalNavigation';
import { CameraProfile, phaseName } from '@/lib/sceneConfig';
import { setupMasterScroll } from '@/lib/scrollTimeline';
import { qualityFor } from '@/lib/quality';
import type { CameraDebugState } from './ScrollCamera';

function getProfile(): CameraProfile {
  const w = window.innerWidth;
  if (w < 720) return 'mobile';
  if (w < 1100) return 'tablet';
  return 'desktop';
}

function DebugHud({ progressRef, cameraRef }: {
  progressRef: React.MutableRefObject<number>;
  cameraRef: React.MutableRefObject<CameraDebugState>;
}) {
  const [text, setText] = useState('');
  useEffect(() => {
    const id = window.setInterval(() => {
      const p = progressRef.current;
      const c = cameraRef.current;
      setText([
        `progress  ${p.toFixed(4)}`,
        `phase     ${phaseName(p)}`,
        `camera    ${c.position.x.toFixed(2)}  ${c.position.y.toFixed(2)}  ${c.position.z.toFixed(2)}`,
        `target    ${c.target.x.toFixed(2)}  ${c.target.y.toFixed(2)}  ${c.target.z.toFixed(2)}`,
        `fov       ${c.fov.toFixed(1)}`
      ].join('\n'));
    }, 100);
    return () => window.clearInterval(id);
  }, [progressRef, cameraRef]);
  return <div className="debug-hud">{text}</div>;
}

export default function BenchExperience() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const cameraDebugRef = useRef<CameraDebugState>({
    position: new THREE.Vector3(0,0,15),
    target: new THREE.Vector3(),
    fov: 33
  });
  const [profile, setProfile] = useState<CameraProfile>('desktop');
  const [visible, setVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [secondaryReady, setSecondaryReady] = useState(false);
  const [debug, setDebug] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
    setDebug(new URLSearchParams(window.location.search).get('debug') === '1');
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReducedMotion(motion.matches);
    onMotion();
    const onResize = () => setProfile(getProfile());
    const onVisibility = () => setVisible(document.visibilityState !== 'hidden');
    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    motion.addEventListener?.('change', onMotion);
    const idle = window.setTimeout(() => setSecondaryReady(true), profile === 'mobile' ? 850 : 550);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      motion.removeEventListener?.('change', onMotion);
      window.clearTimeout(idle);
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current || reducedMotion) return;
    let dispose: undefined | (() => void);
    setupMasterScroll({ trigger: scrollRef.current, progressRef }).then((cleanup) => { dispose = cleanup; });
    return () => dispose?.();
  }, [reducedMotion]);

  const quality = qualityFor(profile);

  return (
    <main id="world">
      <MinimalNavigation />
      <div className="webgl-shell" aria-label="Interactive three-dimensional ink and watercolour illustration">
        <Canvas
          dpr={quality.dpr}
          frameloop={visible ? 'always' : 'never'}
          camera={{ position: [0,0,15], fov: 33, near: .025, far: 90 }}
          gl={{ antialias: profile !== 'mobile', alpha: false, powerPreference: 'high-performance' }}
          onCreated={({ gl }) => {
            gl.outputColorSpace = THREE.SRGBColorSpace;
            gl.toneMapping = THREE.NoToneMapping;
            gl.setClearColor('#f2efe2', 1);
          }}
        >
          <Suspense fallback={null}>
            <BenchWorld
              progressRef={progressRef}
              profile={profile}
              debugRef={cameraDebugRef}
              reducedMotion={reducedMotion}
              secondaryReady={secondaryReady}
            />
          </Suspense>
        </Canvas>
      </div>
      <Loader />
      <div ref={scrollRef} className="scroll-shell" aria-hidden="true">
        <div className="scroll-marker" />
      </div>
      {debug && <DebugHud progressRef={progressRef} cameraRef={cameraDebugRef} />}
    </main>
  );
}
