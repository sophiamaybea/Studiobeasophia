'use client';

import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { CropBox, cropToWorld, smooth } from '@/lib/sceneConfig';
import WatercolourMaterial from '@/components/shaders/WatercolourMaterial';

type Props = {
  texture: string;
  box: CropBox;
  targetZ: number;
  progressRef: MutableRefObject<number>;
  fadeOut?: [number, number];
  displacement?: number;
  drift?: [number, number];
};

export default function PaintedCutout({ texture, box, targetZ, progressRef, fadeOut, displacement = 0.028, drift = [0, 0] }: Props) {
  const placement = cropToWorld(box);
  const mesh = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!mesh.current) return;
    const p = progressRef.current;
    const opening = smooth(p, 0.04, 0.22);
    const collapse = smooth(p, 0.9, 1);
    const depth = opening * (1 - collapse);
    const fade = fadeOut ? 1 - smooth(p, fadeOut[0], fadeOut[1]) : 1;
    mesh.current.visible = (p > 0.03 && fade > 0.01) || p > 0.92;
    mesh.current.position.set(
      placement.x + drift[0] * depth,
      placement.y + drift[1] * depth,
      targetZ * depth
    );
    mesh.current.rotation.y = drift[0] * 0.018 * depth;
  });

  return (
    <mesh ref={mesh} position={[placement.x, placement.y, 0]} renderOrder={6}>
      <planeGeometry args={[placement.width, placement.height, 18, 18]} />
      <WatercolourMaterial texture={texture} crop={box} sourceSize={[1087,1536]} opacity={0.995} displacement={displacement} />
    </mesh>
  );
}
