'use client';

import { MutableRefObject } from 'react';
import PaperWorld from './PaperWorld';
import IllustrationLayer from './IllustrationLayer';
import Bench from './Bench';
import Figures from './Figures';
import Skyline from './Skyline';
import Buildings from './Buildings';
import PaintWorld from './PaintWorld';
import TreeCanopy from './TreeCanopy';
import AtmosphericMarks from './AtmosphericMarks';
import ScrollCamera, { CameraDebugState } from './ScrollCamera';
import { CameraProfile } from '@/lib/sceneConfig';
import SceneQualityManager from './SceneQualityManager';

export default function BenchWorld({ progressRef, profile, debugRef, reducedMotion, secondaryReady }: {
  progressRef: MutableRefObject<number>;
  profile: CameraProfile;
  debugRef: MutableRefObject<CameraDebugState>;
  reducedMotion: boolean;
  secondaryReady: boolean;
}) {
  return (
    <>
      <SceneQualityManager profile={profile} />
      <color attach="background" args={['#f2efe2']} />
      <ambientLight intensity={1.6} />
      <directionalLight position={[3,6,8]} intensity={.22} color="#fff7d5" />
      <PaperWorld progressRef={progressRef} />
      <IllustrationLayer texture="/art/source-full.svg" box={[0,0,1087,700]} targetZ={3.25} progressRef={progressRef} fadeOut={[.71,.80]} drift={[-.06,.08]} />
      <IllustrationLayer texture="/art/source-full.svg" box={[0,920,1087,1536]} targetZ={3.7} progressRef={progressRef} fadeOut={[.52,.63]} drift={[.03,-.08]} />
      <IllustrationLayer texture="/art/source-full.svg" box={[0,690,1087,1070]} targetZ={-.35} progressRef={progressRef} fadeOut={[.60,.70]} drift={[-.02,.01]} />
      <Skyline progressRef={progressRef} />
      <Buildings progressRef={progressRef} />
      <Figures progressRef={progressRef} />
      <Bench progressRef={progressRef} />
      <AtmosphericMarks progressRef={progressRef} />
      {secondaryReady && <PaintWorld progressRef={progressRef} profile={profile} />}
      {secondaryReady && <TreeCanopy progressRef={progressRef} profile={profile} />}
      <ScrollCamera progressRef={progressRef} profile={profile} debugRef={debugRef} reducedMotion={reducedMotion} />
    </>
  );
}
