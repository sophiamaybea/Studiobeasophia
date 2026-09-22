import type { CameraProfile } from './sceneConfig';

export type QualityTier = {
  dpr: [number, number];
  branchSegments: number;
  paintCount: number;
  fleckCount: number;
};

export function qualityFor(profile: CameraProfile): QualityTier {
  if (profile === 'mobile') {
    return { dpr: [1, 1.25], branchSegments: 18, paintCount: 8, fleckCount: 10 };
  }
  if (profile === 'tablet') {
    return { dpr: [1, 1.4], branchSegments: 26, paintCount: 11, fleckCount: 14 };
  }
  return { dpr: [1, 1.5], branchSegments: 34, paintCount: 14, fleckCount: 18 };
}
