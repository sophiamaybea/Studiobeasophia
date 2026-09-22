'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import type { CropBox } from '@/lib/sceneConfig';
import useCroppedTexture from '@/components/world/useCroppedTexture';

type Props={texture:string;crop?:CropBox;sourceSize?:[number,number];opacity?:number};
const vertexShader=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader=`uniform sampler2D uMap;uniform float uOpacity;varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(41.31,289.17)))*15731.74);}void main(){vec4 tex=texture2D(uMap,vUv);float d=distance(tex.rgb,vec3(.945,.943,.885));float key=smoothstep(.055,.145,d);float density=.9+hash(floor(vUv*210.0))*.1;float a=tex.a*uOpacity*key;if(a<.03)discard;gl_FragColor=vec4(tex.rgb*density,a);}`;
export default function InkMaterial({texture,crop,sourceSize=[1087,1536],opacity=1}:Props){const map=useCroppedTexture(texture,crop,sourceSize);const uniforms=useMemo(()=>({uMap:{value:map},uOpacity:{value:opacity}}),[map,opacity]);uniforms.uOpacity.value=opacity;return <shaderMaterial args={[{uniforms,vertexShader,fragmentShader,transparent:true,depthWrite:false,side:THREE.DoubleSide}]} />;}
