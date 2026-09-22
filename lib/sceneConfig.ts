import * as THREE from 'three';

export const SOURCE_SIZE = { width: 1087, height: 1536 } as const;
export const ART_HEIGHT = 10;
export const ART_WIDTH = ART_HEIGHT * (SOURCE_SIZE.width / SOURCE_SIZE.height);

export type CropBox = [number, number, number, number];

export type LayerConfig = {
  id: string;
  texture: string;
  box: CropBox;
  targetZ: number;
  opacity?: number;
};

export const layerConfig: LayerConfig[] = [
  { id: 'trees', texture: '/art/source-full.svg', box: [0, 0, 1087, 700], targetZ: 3.25 },
  { id: 'skyline', texture: '/art/source-full.svg', box: [0, 400, 1087, 990], targetZ: -4.4 },
  { id: 'pedestrians', texture: '/art/source-full.svg', box: [0, 690, 1087, 1070], targetZ: -0.35 },
  { id: 'foreground', texture: '/art/source-full.svg', box: [0, 920, 1087, 1536], targetZ: 3.7 },
  { id: 'left-buildings', texture: '/art/source-full.svg', box: [0, 510, 620, 930], targetZ: -2.0 },
  { id: 'right-buildings', texture: '/art/source-full.svg', box: [760, 510, 1087, 930], targetZ: -2.25 },
  { id: 'tower', texture: '/art/source-full.svg', box: [610, 430, 930, 860], targetZ: -3.25 }
];

export const figureConfig = [
  { id: 'left-man', texture: '/art/source-bench.svg', box: [250, 650, 620, 1390] as CropBox, targetZ: 1.52 },
  { id: 'right-man', texture: '/art/source-bench.svg', box: [560, 650, 940, 1390] as CropBox, targetZ: 1.46 }
] as const;

export const slatConfig = [
  { id: 'slat-1', texture: '/art/source-bench.svg', box: [180, 930, 1010, 1035] as CropBox, z: 2.08, depth: 0.23 },
  { id: 'slat-2', texture: '/art/source-bench.svg', box: [180, 1030, 1010, 1125] as CropBox, z: 2.04, depth: 0.25 },
  { id: 'slat-3', texture: '/art/source-bench.svg', box: [190, 1115, 1000, 1205] as CropBox, z: 2.0, depth: 0.28 },
  { id: 'slat-4', texture: '/art/source-bench.svg', box: [200, 1185, 980, 1265] as CropBox, z: 1.96, depth: 0.31 }
] as const;

export function cropToWorld(box: CropBox) {
  const [x0, y0, x1, y1] = box;
  const wPx = x1 - x0;
  const hPx = y1 - y0;
  const width = ART_WIDTH * (wPx / SOURCE_SIZE.width);
  const height = ART_HEIGHT * (hPx / SOURCE_SIZE.height);
  const cxPx = (x0 + x1) / 2;
  const cyPx = (y0 + y1) / 2;
  const x = (cxPx / SOURCE_SIZE.width - 0.5) * ART_WIDTH;
  const y = (0.5 - cyPx / SOURCE_SIZE.height) * ART_HEIGHT;
  return { width, height, x, y };
}

export type CameraProfile = 'desktop' | 'tablet' | 'mobile';

type CameraPreset = {
  points: THREE.Vector3[];
  targets: THREE.Vector3[];
  fovs: number[];
  rolls: number[];
};

const desktop: CameraPreset = {
  points: [
    new THREE.Vector3(0, 0, 15.0),
    new THREE.Vector3(0.12, 0.18, 13.4),
    new THREE.Vector3(-0.25, -0.9, 8.2),
    new THREE.Vector3(0.05, -2.10, 3.45),
    new THREE.Vector3(0.02, -0.35, 1.22),
    new THREE.Vector3(0.45, 0.25, -2.5),
    new THREE.Vector3(1.1, 0.85, -6.8),
    new THREE.Vector3(-1.0, 1.25, -10.5),
    new THREE.Vector3(0.4, 4.0, -4.0),
    new THREE.Vector3(0, 0, 15.0)
  ],
  targets: [
    new THREE.Vector3(0, -0.1, 0),
    new THREE.Vector3(0, -0.15, 0),
    new THREE.Vector3(0, -1.9, 2.0),
    new THREE.Vector3(0, -2.0, 1.9),
    new THREE.Vector3(0.1, 0.7, -2.0),
    new THREE.Vector3(0.4, 0.8, -5.0),
    new THREE.Vector3(0.6, 0.4, -10.0),
    new THREE.Vector3(-0.2, 2.8, -7.0),
    new THREE.Vector3(0, 4.2, -0.5),
    new THREE.Vector3(0, -0.1, 0)
  ],
  fovs: [33, 34, 35, 41, 43, 42, 45, 44, 40, 33],
  rolls: [0, 0.002, -0.008, 0.013, -0.008, 0.01, -0.016, 0.022, -0.012, 0]
};

const tablet: CameraPreset = {
  points: desktop.points.map((p, i) => new THREE.Vector3(p.x * 0.86, p.y * 0.94, p.z + (i < 2 ? 1.6 : 0.5))),
  targets: desktop.targets.map((p) => new THREE.Vector3(p.x * 0.86, p.y * 0.96, p.z)),
  fovs: desktop.fovs.map((v) => v + 2),
  rolls: desktop.rolls.map((v) => v * 0.7)
};

const mobile: CameraPreset = {
  points: [
    new THREE.Vector3(0, -0.12, 18.2),
    new THREE.Vector3(0.05, -0.15, 16.1),
    new THREE.Vector3(-0.1, -1.05, 10.2),
    new THREE.Vector3(0, -2.25, 4.4),
    new THREE.Vector3(0, -0.55, 1.35),
    new THREE.Vector3(0.2, 0.25, -2.2),
    new THREE.Vector3(0.6, 0.95, -6.0),
    new THREE.Vector3(-0.45, 1.5, -9.5),
    new THREE.Vector3(0.15, 3.7, -3.4),
    new THREE.Vector3(0, -0.12, 18.2)
  ],
  targets: [
    new THREE.Vector3(0, -0.25, 0),
    new THREE.Vector3(0, -0.3, 0),
    new THREE.Vector3(0, -1.95, 2.0),
    new THREE.Vector3(0, -2.05, 1.8),
    new THREE.Vector3(0, 0.5, -1.8),
    new THREE.Vector3(0.2, 0.7, -4.5),
    new THREE.Vector3(0.35, 0.2, -9.0),
    new THREE.Vector3(0, 2.7, -6.0),
    new THREE.Vector3(0, 4.0, -0.2),
    new THREE.Vector3(0, -0.25, 0)
  ],
  fovs: [29, 30, 33, 39, 41, 42, 44, 42, 36, 29],
  rolls: [0, 0, -0.004, 0.007, -0.004, 0.006, -0.008, 0.01, -0.006, 0]
};

export const cameraPresets: Record<CameraProfile, CameraPreset> = { desktop, tablet, mobile };

export const phaseRanges = {
  flat: [0, 0.08],
  opening: [0.08, 0.22],
  bench: [0.22, 0.38],
  figures: [0.38, 0.50],
  city: [0.50, 0.65],
  paint: [0.65, 0.77],
  canopy: [0.77, 0.90],
  collapse: [0.90, 1.0]
} as const;

export const phaseName = (p: number) => {
  if (p < .08) return 'flat illustration';
  if (p < .22) return 'drawing opens';
  if (p < .38) return 'bench fly-through';
  if (p < .50) return 'between figures';
  if (p < .65) return 'city';
  if (p < .77) return 'paint world';
  if (p < .90) return 'canopy';
  return 'return to paper';
};

export function remap(v: number, a: number, b: number) {
  return THREE.MathUtils.clamp((v - a) / (b - a), 0, 1);
}

export function smooth(v: number, a: number, b: number) {
  const t = remap(v, a, b);
  return t * t * (3 - 2 * t);
}
