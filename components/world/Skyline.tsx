'use client';

import type { MutableRefObject } from 'react';
import IllustrationLayer from './IllustrationLayer';

export default function Skyline({ progressRef }: { progressRef: MutableRefObject<number> }) {
  return (
    <IllustrationLayer
      texture="/art/source-full.svg"
      box={[0, 400, 1087, 990]}
      targetZ={-4.4}
      progressRef={progressRef}
      fadeOut={[0.64, 0.73]}
      drift={[0.08, 0.03]}
    />
  );
}
