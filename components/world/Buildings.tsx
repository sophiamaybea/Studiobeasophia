'use client';

import type { MutableRefObject } from 'react';
import IllustrationLayer from './IllustrationLayer';

export default function Buildings({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <group>
      <IllustrationLayer texture="/art/source-full.svg" box={[0, 510, 620, 930]} targetZ={-2.0} progressRef={progressRef} fadeOut={[0.64, 0.72]} drift={[-0.12, 0.01]} />
      <IllustrationLayer texture="/art/source-full.svg" box={[760, 510, 1087, 930]} targetZ={-2.25} progressRef={progressRef} fadeOut={[0.64, 0.72]} drift={[0.12, 0.01]} />
      <IllustrationLayer texture="/art/source-full.svg" box={[610, 430, 930, 860]} targetZ={-3.25} progressRef={progressRef} fadeOut={[0.67, 0.75]} drift={[0.02, 0.05]} />
    </group>
  );
}
