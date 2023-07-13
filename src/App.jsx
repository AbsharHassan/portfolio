import CompleteToolset from './components/CompleteToolset'
// import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Trademark2D from './components/Trademark2D'
import { useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Canvas, extend } from '@react-three/fiber'
import {
  Cylinder,
  OrbitControls,
  Plane,
  Sphere,
  shaderMaterial,
  Circle,
  Stats,
  Html,
} from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'

import Hero from './components/Hero'
import LoadingScreen from './components/LoadingScreen'
import { useProgress } from '@react-three/drei'

import * as THREE from 'three'
import BloomSphere from './components/BloomSphere'
import TestBloomSphere from './components/TestBloomSphere'
import SpaceDustTest from './components/SpaceDustTest'
import HeroParticleCanvas from './components/HeroParticleCanvas'

import { GlobalThreeContext } from './Contexts/GlobalThreeContext'
import BloomCanvas from './components/BloomCanvas'

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
import { useSelector, useDispatch } from 'react-redux'
import { setMousePosition, toggleBloomTheme } from './features/three/threeSlice'
import Projects from './components/Projects'
import ParticleModel from './components/ParticleModel'
import HeroCanvas from './components/HeroCanvas'

function App() {
  const dispatch = useDispatch()
  const { bloomTheme } = useSelector((state) => state.threeStore)
  // const { mousePosition } = useSelector((state) => state.threeStore)

  let trademark23Ref = useRef(null)
  const { active, progress } = useProgress()

  const [isHeroLoading, setisHeroLoading] = useState(true)
  // const [mousePosition, setMousePosition] = useState(new THREE.Vector2())

  const toggleIsHeroLoading = (value) => {
    setisHeroLoading(value)
  }

  let ambientRef1 = useRef()
  let sphereRef1 = useRef()
  let mainRef = useRef()

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const sectionBounds = mainRef.current.getBoundingClientRect()

    const x = ((clientX - sectionBounds.left) / sectionBounds.width) * 2 - 1
    const y = -((clientY - sectionBounds.top) / sectionBounds.height) * 2 + 1

    // setMousePosition(new THREE.Vector2(mouseX, mouseY))

    // dispatch(setMousePosition({ x, y }))
  }

  // useEffect(() => {
  //   console.log('rerenderrrrrrrrrrrrrr')
  // })

  // useEffect(() => {
  //   console.log(mousePosition)
  // }, [mousePosition])

  let deadZoneRef = useRef(null)
  const [isParticleModelVisible, setIsParticleModelVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsParticleModelVisible(!entry.isIntersecting)
      },
      { threshold: 0.5 } // 1.0 indicates when 100% of the target is visible
    )

    if (deadZoneRef.current) {
      observer.observe(deadZoneRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    // <div
    //   className="w-screen h-screen flex items-center justify-center relative"
    //   onPointerMove={handleMouseMove}
    //   ref={canvasRef}
    // >
    //   {/* <div className="w-full h-full absolute inset-0">
    //     <Canvas
    //       className="w-full h-full absolute inset-0 z-10"
    //       // ref={canvasRef}
    //       // onPointerMove={handleMouseMove}
    //       // camera={{ position: [0, -4, 3] }}
    //     >
    //       <OrbitControls />
    //       <SpaceDustTest
    //         particleCount={10000}
    //         mousePosition={mousePosition}
    //       />

    //     </Canvas>
    //   </div>
    //   <div className="w-full h-full absolute inset-0">
    //     <HeroBloomCanvas
    //       mousePosition={mousePosition}
    //       bloomTheme={new THREE.Color(0.76, 0.38, 1.0)}
    //     />
    //   </div> */}
    //   <HeroParticleCanvas mousePosition={mousePosition} />
    // </div>
    <main
      className={`main ${
        isHeroLoading ? 'is-hero-loading' : ''
      } relative w-full min-h-screen h-[10000px]`}
      ref={mainRef}
      // onClick={() => {
      //   dispatch(toggleBloomTheme())
      // }}
    >
      {/* {isHeroLoading && (
        <LoadingScreen toggleIsHeroLoading={toggleIsHeroLoading} />
      )}
      <Stats />

      <Navbar />
      <BloomCanvas />

      <Hero />
      <CompleteToolset /> */}

      {/* <Navbar />
      <BloomCanvas />

      <Hero />

      <Projects /> */}
      {/* <Hero /> */}

      {/* <BloomCanvas /> */}
      {/* <CompleteToolset /> */}

      <div
        ref={deadZoneRef}
        className="w-full h-screen bg-red-900/20"
      ></div>

      <ParticleModel isParticleModelVisible={isParticleModelVisible} />
      <div className="w-full h-full fixed inset-0 ">
        <HeroParticleCanvas
          // mousePosition={mousePosition}
          bloomTheme={bloomTheme}
          isParticleModelVisible={isParticleModelVisible}
        />
      </div>
      {/* <div className="wrapper w-full h-full">
        <div className="browser-bar w-full h-[100px] bg-[#1d1e21] text-white">
          hello world
        </div>
        <div className="iframe">
          <iframe
            title="iframe"
            src="https://flood-tracker.onrender.com/"
            //   src="http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login"
          />
        </div>
      </div> */}
    </main>
    // <div className="w-full h-full ">
    //   <BloomCanvas />
    // </div>
  )
}

export default App
