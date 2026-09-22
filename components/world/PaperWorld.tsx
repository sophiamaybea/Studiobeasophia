'use client';

import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { ART_HEIGHT, ART_WIDTH, smooth } from '@/lib/sceneConfig';
import PaperMaterial from '@/components/shaders/PaperMaterial';

type Props = { progressRef: MutableRefObject<number> };

export default function PaperWorld({ progressRef }: Props) {
  const scene = useTexture('/art/source-full.svg');
  const sceneMat = useRef<THREE.MeshBasicMaterial>(null);
  const sceneMesh = useRef<THREE.Mesh>(null);
  scene.colorSpace = THREE.SRGBColorSpace;
  scene.anisotropy = 8;

  useFrame(() => {
    if (!sceneMat.current || !sceneMesh.current) return;
    const p = progressRef.current;
    const leave = smooth(p, 0.045, 0.125);
    const back = smooth(p, 0.92, 0.992);
    sceneMat.current.opacity = Math.max(1 - leave, back);
    const endScale = THREE.MathUtils.lerp(1, 0.68, smooth(p, 0.955, 1));
    sceneMesh.current.scale.setScalar(endScale);
  });

  return (
    <>
      <mesh position={[0, 0, -13]} scale={[3.7, 3.7, 1]} renderOrder={-10}>
        <planeGeometry args={[ART_WIDTH * 2.1, ART_HEIGHT * 1.5, 1, 1]} />
        <PaperMaterial />
      </mesh>
      <mesh ref={sceneMesh} position={[0, 0, 0]} renderOrder={10}>
        <planeGeometry args={[ART_WIDTH, ART_HEIGHT]} />
        <meshBasicMaterial ref={sceneMat} map={scene} toneMapped={false} transparent depthWrite={false} />
      </mesh>
    </>
  );
}
