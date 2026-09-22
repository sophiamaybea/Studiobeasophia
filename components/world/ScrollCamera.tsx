'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { MutableRefObject, useMemo } from 'react';
import * as THREE from 'three';
import { cameraPresets, CameraProfile } from '@/lib/sceneConfig';

export type CameraDebugState = { position: THREE.Vector3; target: THREE.Vector3; fov: number };
const anchors = [0,.08,.22,.38,.50,.65,.77,.90,.96,1];

function warp(p: number) {
  let i = anchors.length - 2;
  for (let n=0;n<anchors.length-1;n++) if (p <= anchors[n+1]) { i=n; break; }
  const local = THREE.MathUtils.clamp((p-anchors[i])/(anchors[i+1]-anchors[i]),0,1);
  const eased = local*local*(3-2*local);
  return (i + eased) / (anchors.length - 1);
}

function interpolateArray(values:number[], p:number) {
  let i = anchors.length - 2;
  for (let n=0;n<anchors.length-1;n++) if (p <= anchors[n+1]) { i=n; break; }
  const t = THREE.MathUtils.clamp((p-anchors[i])/(anchors[i+1]-anchors[i]),0,1);
  return THREE.MathUtils.lerp(values[i], values[i+1], t);
}

export default function ScrollCamera({ progressRef, profile, debugRef, reducedMotion=false }: {
  progressRef: MutableRefObject<number>;
  profile: CameraProfile;
  debugRef: MutableRefObject<CameraDebugState>;
  reducedMotion?: boolean;
}) {
  const { camera, pointer } = useThree();
  const preset = cameraPresets[profile];
  const path = useMemo(() => new THREE.CatmullRomCurve3(preset.points, false, 'catmullrom', .42), [preset]);
  const targetPath = useMemo(() => new THREE.CatmullRomCurve3(preset.targets, false, 'catmullrom', .46), [preset]);
  const temp = useMemo(() => ({ pos:new THREE.Vector3(), target:new THREE.Vector3() }), []);

  useFrame(() => {
    const p = reducedMotion ? 0 : progressRef.current;
    const t = warp(p);
    path.getPoint(t, temp.pos);
    targetPath.getPoint(t, temp.target);
    if (profile !== 'mobile') {
      temp.target.x += pointer.x * .10;
      temp.target.y += pointer.y * .065;
    }
    camera.position.lerp(temp.pos, reducedMotion ? .06 : .18);
    camera.lookAt(temp.target);
    camera.rotateZ(interpolateArray(preset.rolls,p));
    const pc = camera as THREE.PerspectiveCamera;
    const nextFov = interpolateArray(preset.fovs,p);
    if (Math.abs(pc.fov-nextFov)>.02) { pc.fov = THREE.MathUtils.lerp(pc.fov,nextFov,.18); pc.updateProjectionMatrix(); }
    debugRef.current.position.copy(camera.position);
    debugRef.current.target.copy(temp.target);
    debugRef.current.fov = pc.fov;
  });
  return null;
}
