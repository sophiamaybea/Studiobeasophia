'use client';

import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useMemo, useRef } from 'react';
import WatercolourMaterial from '@/components/shaders/WatercolourMaterial';
import * as THREE from 'three';
import { cropToWorld, slatConfig, smooth } from '@/lib/sceneConfig';

function BenchSlat({ index, progressRef }: { index: number; progressRef: MutableRefObject<number> }) {
  const cfg = slatConfig[index];
  const placement = cropToWorld(cfg.box);
  const group = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current;
    const opening = smooth(p, 0.04, 0.22);
    const bench = smooth(p, 0.22, 0.35) * (1 - smooth(p, 0.39, 0.49));
    const collapse = smooth(p, 0.9, 1.0);
    const depthFactor = opening * (1 - collapse);
    const z = cfg.z * depthFactor;
    const fan = (index - 1.5) * 0.08 * bench;
    group.current.position.set(placement.x, placement.y + fan, z);
    group.current.scale.set(1 + bench * 0.08, 1 + bench * 0.05, 1);
    group.current.rotation.x = bench * (index % 2 ? 0.018 : -0.012);
  });

  const sideMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#17352b', toneMapped: false }), []);

  return (
    <group ref={group} position={[placement.x, placement.y, 0]} renderOrder={8}>
      <mesh material={sideMaterial}>
        <boxGeometry args={[placement.width * 0.97, placement.height * 0.44, cfg.depth]} />
      </mesh>
      <mesh position={[0, 0, cfg.depth / 2 + 0.006]}>
        <planeGeometry args={[placement.width, placement.height]} />
        <WatercolourMaterial texture="/art/source-bench.svg" crop={cfg.box} sourceSize={[1087,1536]} opacity={1} displacement={.005} />
      </mesh>
    </group>
  );
}

function BenchSupports({ progressRef }: { progressRef: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!group.current) return;
    const p = progressRef.current;
    const opening = smooth(p, .05, .22);
    const collapse = smooth(p, .9, 1);
    group.current.position.z = 1.88 * opening * (1 - collapse);
    group.current.visible = p > .055 && (p < .68 || p > .93);
  });
  return (
    <group ref={group} position={[0, -2.84, 0]}>
      <mesh position={[-2.45, -0.16, 0]} rotation={[0, 0, 0.035]}>
        <boxGeometry args={[0.13, 2.55, 0.18]} />
        <meshBasicMaterial color="#112c24" toneMapped={false} />
      </mesh>
      <mesh position={[2.42, -0.15, 0]} rotation={[0, 0, -0.04]}>
        <boxGeometry args={[0.13, 2.52, 0.18]} />
        <meshBasicMaterial color="#112c24" toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.78, -0.02]}>
        <boxGeometry args={[5.05, 0.11, 0.15]} />
        <meshBasicMaterial color="#18352c" toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function Bench({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <group>
      {slatConfig.map((slat, index) => <BenchSlat key={slat.id} index={index} progressRef={progressRef} />)}
      <BenchSupports progressRef={progressRef} />
    </group>
  );
}
