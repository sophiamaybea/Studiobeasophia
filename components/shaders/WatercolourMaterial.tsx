'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { CropBox } from '@/lib/sceneConfig';
import useCroppedTexture from '@/components/world/useCroppedTexture';

type Props = {
  texture: string;
  crop?: CropBox;
  sourceSize?: [number, number];
  opacity?: number;
  displacement?: number;
  keyIvory?: boolean;
};

const vertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uDisplacement;
  varying vec2 vUv;
  varying float vNoise;
  float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
  void main(){vUv=uv;float n=noise(uv*7.0+uTime*.015);vNoise=n;vec3 p=position;p.z+=(n-.5)*uDisplacement;p.x+=(noise(uv*3.0+2.7)-.5)*uDisplacement*.32;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0);}
`;
const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uKeyIvory;
  varying vec2 vUv;
  varying float vNoise;
  void main(){
    vec4 tex=texture2D(uMap,vUv);
    float pigment=mix(.90,1.055,vNoise);
    float d=distance(tex.rgb,vec3(.945,.943,.885));
    float keyed=mix(1.0,smoothstep(.055,.145,d),uKeyIvory);
    float alpha=tex.a*uOpacity*keyed;
    if(alpha<.025)discard;
    gl_FragColor=vec4(tex.rgb*pigment,alpha);
  }
`;

export default function WatercolourMaterial({ texture, crop, sourceSize=[1087,1536], opacity=1, displacement=.03, keyIvory=true }: Props) {
  const map = useCroppedTexture(texture, crop, sourceSize);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({uMap:{value:map},uTime:{value:0},uOpacity:{value:opacity},uDisplacement:{value:displacement},uKeyIvory:{value:keyIvory?1:0}}), [map,opacity,displacement,keyIvory]);
  useFrame(({clock})=>{if(!materialRef.current)return;const u=materialRef.current.uniforms;u.uTime.value=clock.elapsedTime;u.uOpacity.value=opacity;u.uDisplacement.value=displacement;});
  return <shaderMaterial ref={materialRef} args={[{uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,side:THREE.DoubleSide}]} />;
}
