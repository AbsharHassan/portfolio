import CompleteToolset from './components/CompleteToolset'
// import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Trademark2D from './components/Trademark2D'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Canvas, extend } from '@react-three/fiber'
import {
  Cylinder,
  OrbitControls,
  Plane,
  Sphere,
  shaderMaterial,
  Circle,
} from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'

import Hero from './components/Hero'
import LoadingScreen from './components/LoadingScreen'
import { useProgress } from '@react-three/drei'

import * as THREE from 'three'
import BloomSphere from './components/BloomSphere'
import TestBloomSphere from './components/TestBloomSphere'

// const BloomShaderMaterial = shaderMaterial(
//   // Uniform
//   {
//     uColor: new THREE.Color(1, 1, 0.6),
//   },
//   // Vertex Shader
//   glsl`
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec2 vUv;

//     void main() {
//       vNormal = normalize(normalMatrix * normal);
//       vPosition = position;
//       vUv = uv;

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   // Fragment Shader
//   glsl`
//     uniform vec3 uColor;
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec2 vUv;

//     void main() {
//       // float radial = 1. - vPosition.z;
//       // radial *= radial;

//       float intensity = pow(0.7 - dot(vNormal * 0.5, vec3(0, 0, 1.0)), 3.0);

//       // gl_FragColor = vec4(uColor, 1.) * intensity * intensity;
//       gl_FragColor = vec4(uColor, 1.) ;

//     }
//   `
// )

// const BloomShaderMaterial2 = shaderMaterial(
//   // Uniform
//   {
//     // uColor: new THREE.Color(1 / 6, 1 / 6, 0.6 / 6),
//     uColor: new THREE.Color(1, 1, 0.6),
//     tDiffuse: null,
//     resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
//   },
//   // Vertex Shader
//   glsl`
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec2 vUv;

//     void main() {
//       vNormal = normalize(normalMatrix * normal);
//       // vNormal = normal;
//       vPosition = position;
//       vUv = uv;

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   // Fragment Shader
//   glsl`
//     uniform vec3 uColor;
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec2 vUv;

//     uniform sampler2D tDiffuse;
//     uniform vec2 resolution;

//     void main() {
//       // float radial = 1. - vNormal.z;
//       // radial *= radial*radial;

//       // float intensity = pow(0.005 - dot(vNormal * 1.0, vec3(0, 0, 1.0)), 3.0);

//       // vec3 color = vec3(uColor) * intensity;

//       // // vec3 color = uColor*intensity;
//       // gl_FragColor = vec4(uColor, 1.0) * intensity;
//       // gl_FragColor = vec4(color, 1. * (intensity * intensity* intensity* intensity* intensity));

//       // vec4 color = vec4(0.0);
//       // vec2 offset = 1.0 / resolution;

//       // for (int x =-1; x<5; x++)
//       // {
//       //   for (int y =-1; y<5; y++)
//       //   {
//       //     color += vec4(uColor, 0.5) * pow(0.2 - dot(vNormal * 1.0, vec3(0, 0, 1.0)), 3.0);
//       //   }
//       // }

//       // color /= 500.0;

//       // gl_FragColor = color;

//       // float distance = length(vNormal);
//       // float decayFactor = exp(-distance); // Exponential decay function

//       // vec3 finalColor = uColor * decayFactor;

//       // gl_FragColor = vec4(vec3(distance), 0.5);

//       // float radial = 1. - vNormal.z;
//       // radial *= radial*radial;

//       // float dividingFactor = -2.0 * (vNormal.z) + 1.0;

//       // float intensity = pow(dot(vNormal / 1., vec3(0, 0, -1.0)), 1.0);

//       // // vec3 color = vec3(uColor) * intensity;

//       // float somevar = exp(dot(vNormal, vec3(0,0,-1.0))) -exp(0.1);

//       // // use this to create a star pattern
//       // // vec3 color = vec3(uColor) / (2.0 + pow(abs(vNormal.x * vNormal.y *vNormal.z), 1.0) * 20.);

//       // vec3 color = vec3(uColor) / ((pow(abs(vNormal.z), 0.00000000001) * 5.));

//       // // vec3 color = uColor*intensity;
//       // // gl_FragColor = vec4(uColor, 1.0) * intensity;

//       // vec3 bleh = vec3(uColor) / 3.0;
//       // gl_FragColor = vec4(bleh, 1.0) * somevar;
//       // // gl_FragColor = vec4(somevar, 0, 0, somevar);
//       // // gl_FragColor = vec4(uColor * intensity, 1.0);
//       // // gl_FragColor = vec4(color, 1. * (intensity * intensity* intensity* intensity* intensity));

//       float radial = 1. - vNormal.z;
//       radial *= radial*radial;

//       float intensity = pow(0.005 - dot(vNormal * 1.0, vec3(0, 0, 1.0)), 3.0);

//       vec3 color = vec3(uColor) / 1.4;

//       // vec3 color = uColor*intensity;
//       gl_FragColor = vec4(color, 1.0) * intensity;
//     }
//   `
// )

// const CircleShader = shaderMaterial(
//   // Uniform
//   {
//     // uColor: new THREE.Color(1 / 6, 1 / 6, 0.6 / 6),
//     uColor: new THREE.Color(1, 1, 0.6),
//     tDiffuse: null,
//     resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
//     uRadius: new THREE.Vector3(1.0, 1.0, 0),
//   },
//   // Vertex Shader
//   glsl`
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec2 vUv;

//     void main() {
//       // vNormal = normalize(normalMatrix * normal);
//       vNormal = normal;
//       vPosition = position;
//       vUv = uv;

//       gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//     }
//   `,
//   // Fragment Shader
//   glsl`
//     uniform vec3 uColor;
//     uniform vec3 uRadius;
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec2 vUv;

//     uniform sampler2D tDiffuse;
//     uniform vec2 resolution;

//     void main() {

//       vec3 pos = vPosition + uRadius;

//       gl_FragColor = vec4(abs(vUv.x), abs(vUv.y), 0.0, 1.0);
//     }
//   `
// )

// extend({ BloomShaderMaterial, BloomShaderMaterial2, CircleShader })

function App() {
  let trademark23Ref = useRef(null)
  const { active, progress } = useProgress()

  const [isHeroLoading, setisHeroLoading] = useState(true)

  const toggleIsHeroLoading = (value) => {
    setisHeroLoading(value)
  }

  let ambientRef1 = useRef()
  let sphereRef1 = useRef()

  return (
    <main className={`main ${isHeroLoading ? 'is-hero-loading' : ''}`}>
      {isHeroLoading && (
        <LoadingScreen toggleIsHeroLoading={toggleIsHeroLoading} />
      )}
      <Navbar />
      <Hero />
      {!isHeroLoading && <CompleteToolset />}
      <CompleteToolset />
    </main>
  )
}

export default App
