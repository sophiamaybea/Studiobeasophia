'use client';

import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { CropBox, cropToWorld, smooth } from '@/lib/sceneConfig';
import WatercolourMaterial from '@/components/shaders/WatercolourMaterial';

type Props={texture?:string;box:CropBox;targetZ:number;progressRef:MutableRefObject<number>;opacity?:number;fadeOut?:[number,number];drift?:[number,number]};
export default function IllustrationLayer({texture='/art/source-full.svg',box,targetZ,progressRef,opacity=1,fadeOut,drift=[0,0]}:Props){
  const placement=cropToWorld(box);const mesh=useRef<THREE.Mesh>(null);
  useFrame(()=>{if(!mesh.current)return;const p=progressRef.current;const opening=smooth(p,.045,.22);const collapse=smooth(p,.90,1);const depth=opening*(1-collapse);const fade=fadeOut?1-smooth(p,fadeOut[0],fadeOut[1]):1;mesh.current.visible=(p>.025&&fade>.01)||p>.92;mesh.current.position.set(placement.x+drift[0]*depth,placement.y+drift[1]*depth,targetZ*depth);const s=1+Math.abs(targetZ)*.005*depth;mesh.current.scale.set(s,s,1);});
  return <mesh ref={mesh} position={[placement.x,placement.y,0]} renderOrder={2}><planeGeometry args={[placement.width,placement.height,12,12]}/><WatercolourMaterial texture={texture} crop={box} opacity={opacity} displacement={.012}/></mesh>;
}
