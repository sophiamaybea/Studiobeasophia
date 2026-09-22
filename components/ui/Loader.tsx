'use client';

import { useProgress } from '@react-three/drei';
import { CSSProperties, useEffect, useState } from 'react';

export default function Loader() {
  const { active, progress } = useProgress();
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (!active && progress >= 99.9) {
      const id = window.setTimeout(() => setReady(true), 220);
      return () => window.clearTimeout(id);
    }
  }, [active, progress]);
  const style = { '--load-scale': Math.max(.06, progress / 100) } as CSSProperties;
  return (
    <div className="loader" data-ready={ready} aria-hidden={ready}>
      <div>
        <div className="loader-mark" style={style}><span /></div>
        <div className="loader-label">entering the page</div>
      </div>
    </div>
  );
}
