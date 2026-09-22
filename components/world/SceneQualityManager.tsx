'use client';

import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { CameraProfile } from '@/lib/sceneConfig';
import { qualityFor } from '@/lib/quality';

export default function SceneQualityManager({ profile }: { profile: CameraProfile }) {
  const setDpr = useThree((state) => state.setDpr);
  useEffect(() => {
    const tier = qualityFor(profile);
    const dpr = Math.min(window.devicePixelRatio || 1, tier.dpr[1]);
    setDpr(Math.max(tier.dpr[0], dpr));
  }, [profile, setDpr]);
  return null;
}
