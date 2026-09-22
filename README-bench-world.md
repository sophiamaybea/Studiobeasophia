# Bea Sophia — Bench World

Immersive 2.5D/WebGL reconstruction of the original bench illustration.

## Runtime

- Next.js + React + TypeScript
- Three.js / React Three Fiber / Drei
- GSAP ScrollTrigger
- Custom paper, watercolour, and ink shaders
- Authored Catmull-Rom camera choreography
- Desktop, tablet, and mobile camera paths
- `?debug=1` development HUD
- `prefers-reduced-motion` fallback

The application uses the supplied original artwork as its texture source. The Git branch stores a compressed runtime copy of the full source as text chunks so the original image can be reconstructed deterministically during install without redrawing or generating it.

## Scroll sequence

0–8% flat illustration  
8–22% drawing opens  
22–38% bench fly-through  
38–50% between figures  
50–65% city  
65–77% paint world  
77–90% canopy  
90–100% collapse back to paper
