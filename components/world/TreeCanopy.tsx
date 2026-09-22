'use client';
import { useFrame } from '@react-three/fiber';
import { MutableRefObject, useMemo, useRef } from 'react';
import * as THREE from 'three';
import InkMaterial from '@/components/shaders/InkMaterial';
import { CameraProfile, CropBox, smooth } from '@/lib/sceneConfig';
import { qualityFor } from '@/lib/quality';
function makeRibbon(segments:number,width:number,bend:number){const positions:number[]=[],uvs:number[]=[],indices:number[]=[];for(let i=0;i<=segments;i++){const t=i/segments,x=(t-.5)*12,y=Math.sin(t*Math.PI*1.4)*bend+Math.sin(t*5.2)*.28,z=Math.cos(t*Math.PI)*1.6,w=width*(.75+Math.sin(t*Math.PI)*.45);positions.push(x,y-w,z,x,y+w,z);uvs.push(t,0,t,1);if(i<segments){const a=i*2,b=a+1,c=a+2,d=a+3;indices.push(a,c,b,c,d,b)}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g}
function BranchRibbon({box,position,rotation,width,bend,progressRef,profile,index}:{box:CropBox;position:[number,number,number];rotation:[number,number,number];width:number;bend:number;progressRef:MutableRefObject<number>;profile:CameraProfile;index:number}){const mesh=useRef<THREE.Mesh>(null);const geometry=useMemo(()=>makeRibbon(qualityFor(profile).branchSegments,width,bend),[profile,width,bend]);useFrame(()=>{if(!mesh.current)return;const p=progressRef.current,enter=smooth(p,.745+index*.007,.81+index*.006),leave=smooth(p,.895,.955),v=enter*(1-leave);mesh.current.visible=v>.01;mesh.current.scale.setScalar(.72+v*.42);mesh.current.position.z=position[2]+(1-v)*-2.5;});return <mesh ref={mesh} geometry={geometry} position={position} rotation={rotation} visible={false} renderOrder={5}><InkMaterial texture="/art/source-full.svg" crop={box} opacity={.96}/></mesh>}
const branches=[
{box:[0,0,600,260] as CropBox,position:[-1.8,4.2,-3.7] as [number,number,number],rotation:[.2,.4,-.16] as [number,number,number],width:.58,bend:1.45},
{box:[480,0,1087,280] as CropBox,position:[2.4,4.9,-5.2] as [number,number,number],rotation:[-.1,-.45,.18] as [number,number,number],width:.72,bend:1.8},
{box:[0,170,550,520] as CropBox,position:[-3.2,2.5,-6.5] as [number,number,number],rotation:[.6,.18,.45] as [number,number,number],width:.5,bend:1.2},
{box:[520,150,1087,540] as CropBox,position:[3.4,2.9,-7.8] as [number,number,number],rotation:[.5,-.2,-.4] as [number,number,number],width:.62,bend:1.6}];
export default function TreeCanopy({progressRef,profile}:{progressRef:MutableRefObject<number>;profile:CameraProfile}){return <group>{branches.map((b,i)=><BranchRibbon key={i} {...b} progressRef={progressRef} profile={profile} index={i}/>)}</group>}
