'use client';

import { useTexture } from '@react-three/drei';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import type { CropBox } from '@/lib/sceneConfig';

export default function useCroppedTexture(path: string, box?: CropBox, sourceSize: [number, number] = [1087, 1536]) {
  const base = useTexture(path);
  const texture = useMemo(() => {
    const t = base.clone();
    t.colorSpace = THREE.SRGBColorSpace;
    t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
    t.anisotropy = 4;
    if (box) {
      const [x0,y0,x1,y1] = box;
      const [w,h] = sourceSize;
      t.repeat.set((x1-x0)/w, (y1-y0)/h);
      t.offset.set(x0/w, 1-y1/h);
    }
    t.needsUpdate = true;
    return t;
  }, [base, box?.[0], box?.[1], box?.[2], box?.[3], sourceSize[0], sourceSize[1]]);
  useEffect(() => () => texture.dispose(), [texture]);
  return texture;
}
