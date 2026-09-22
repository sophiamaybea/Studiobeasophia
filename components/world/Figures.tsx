'use client';

import type { MutableRefObject } from 'react';
import { figureConfig } from '@/lib/sceneConfig';
import PaintedCutout from './PaintedCutout';

export default function Figures({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <group>
      {figureConfig.map((figure, i) => (
        <PaintedCutout
          key={figure.id}
          texture={figure.texture}
          box={figure.box}
          targetZ={figure.targetZ}
          progressRef={progressRef}
          fadeOut={[0.59, 0.69]}
          displacement={0.022}
          drift={i === 0 ? [-0.08, 0.02] : [0.07, -0.01]}
        />
      ))}
    </group>
  );
}
