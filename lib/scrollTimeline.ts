import type { MutableRefObject } from 'react';

type SetupArgs = {
  trigger: HTMLElement;
  progressRef: MutableRefObject<number>;
  onProgress?: (progress: number) => void;
};

export async function setupMasterScroll({ trigger, progressRef, onProgress }: SetupArgs) {
  const gsapModule = await import('gsap');
  const triggerModule = await import('gsap/ScrollTrigger');
  const gsap = gsapModule.gsap;
  const ScrollTrigger = triggerModule.ScrollTrigger;
  gsap.registerPlugin(ScrollTrigger);

  const state = { value: 0 };
  const timeline = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.65,
      invalidateOnRefresh: true,
      onUpdate(self) {
        progressRef.current = self.progress;
        onProgress?.(self.progress);
      }
    }
  });

  timeline.to(state, {
    value: 1,
    duration: 1,
    onUpdate() {
      progressRef.current = state.value;
      onProgress?.(state.value);
    }
  });

  return () => {
    timeline.scrollTrigger?.kill();
    timeline.kill();
  };
}
