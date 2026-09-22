'use client';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useRef } from 'react';
import * as THREE from 'three';
import { smooth } from '@/lib/sceneConfig';
import WatercolourMaterial from '@/components/shaders/WatercolourMaterial';

type BirdProps={box:[number,number,number,number];start:[number,number,number];progressRef:MutableRefObject<number>;phase:number};
function Bird({box,start,progressRef,phase}:BirdProps){const mesh=useRef<THREE.Mesh>(null);useFrame(({clock})=>{if(!mesh.current)return;const p=progressRef.current,depth=smooth(p,.06,.25)*(1-smooth(p,.88,1)),t=clock.elapsedTime*.07+phase;mesh.current.position.set(start[0]+Math.sin(t)*.18*depth,start[1]+Math.cos(t*.7)*.07*depth,start[2]*depth);mesh.current.rotation.z=Math.sin(t*.8)*.025;mesh.current.visible=(p>.03&&p<.78)||p>.94;});return <mesh ref={mesh} position={start} renderOrder={7}><planeGeometry args={[1.25,.95]}/><WatercolourMaterial texture="/art/source-full.svg" crop={box} opacity={.98} displacement={.004}/></mesh>}
export default function AtmosphericMarks({progressRef}:{progressRef:MutableRefObject<number>}){return <group><Bird box={[255,500,430,640]} start={[-1.45,1.34,-1.15]} progressRef={progressRef} phase={0}/><Bird box={[930,480,1087,630]} start={[2.75,1.44,-2]} progressRef={progressRef} phase={1.4}/></group>}
