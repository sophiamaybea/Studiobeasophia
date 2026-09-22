'use client';

import * as THREE from 'three';
const vertexShader=`varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}`;
const fragmentShader=`varying vec2 vUv;float hash(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233)))*43758.5453);}void main(){float fibre=hash(floor(vUv*vec2(900.0,600.0)))*.018;vec3 paper=vec3(.949,.936,.875)*(.992+fibre);gl_FragColor=vec4(paper,1.0);}`;
export default function PaperMaterial(){return <shaderMaterial args={[{vertexShader,fragmentShader,side:THREE.DoubleSide}]} />;}
