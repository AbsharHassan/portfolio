import { Vector3 } from 'three'
import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  useGLTF,
  SpotLight,
  useDepthBuffer,
  Box,
  Html,
  OrbitControls,
  Sphere,
  OrthographicCamera,
} from '@react-three/drei'
import * as THREE from 'three'
import V15 from './V15'
import V17 from './V17'
import V18 from './V18'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { ReactComponent as Trademark23 } from '../assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import HeroCanvas from './HeroCanvas'
import AlternatingText from './AlternatingText'

export default function TestHero() {
  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2())

  let heroSectionRef = useRef(null)

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    // const sectionBounds = event.target.getBoundingClientRect()
    const sectionBounds = heroSectionRef.current.getBoundingClientRect()

    const mouseX =
      ((clientX - sectionBounds.left) / sectionBounds.width) * 2 - 1
    const mouseY =
      -((clientY - sectionBounds.top) / sectionBounds.height) * 2 + 1

    setMousePosition(new THREE.Vector2(mouseX, mouseY))
  }

  return (
    <div
      ref={heroSectionRef}
      className="w-full h-screen relative flex overflow-x-hidden bg-red-900/0"
      // onPointerMove={handleMouseMove}
      onMouseMove={handleMouseMove}
      onPointerEnter={() => {
        setIsMouseInside(true)
      }}
      onPointerLeave={() => {
        setIsMouseInside(false)
      }}
    >
      <div className="w-[100%] bg-blue-700/00 absolute left-0 h-full z-20 text-white  ">
        <div className="h-full flex flex-col justify-center mx-auto px-4 sm:px-12 xl:max-w-7xl">
          <h1 className="text-[36px] sm:text-[60px] lg:text-[72px] font-semibold leading-tight mb-8 ">
            <div className="hidden sm:block">
              <div className=" bg-clip-text text-transparent bg-gradient-to-r from-customViolet to-customBlue">
                Im
                <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px]"></span>
                gine. Build.
                {/* <div>
                  {' '}
                  <span className="opacity-0">I</span>Build.
                </div> */}
              </div>
              <div className=" bg-clip-text text-transparent bg-gradient-to-r from-customBlue  to-customAqua inline ">
                Ship.
              </div>
            </div>
            <div className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-customViolet via-customBlue to-customAqua">
              Im
              <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px] "></span>
              gine. Build. Ship.
            </div>
          </h1>
          <h2 className="sm:text-lg lg:text-xl mb-12 text-slate-400 h-44 sm:h-36 max-w-2xl ">
            Hi, my name is Abshar Hassan. I love using code to breath life into
            great ideas. With resuability, efficiency and best practices in
            mind, I strive to deliver production-grade code. I am your friendly
            neighbourhood{' '}
            <AlternatingText
              singleWord="frontend developer"
              wordsObjectArray={[
                {
                  text: 'frontend developer',
                  classes: 'bg-gradient-to-r from-customViolet to-customBlue',
                  cursor: '#5a82f9',
                },
                {
                  text: 'backend developer',
                  classes: 'bg-gradient-to-r from-customBlue  to-customAqua',
                  cursor: '#09a9b8',
                },
                {
                  text: 'fullstack developer',
                  classes: 'bg-gradient-to-r from-customViolet to-customBlue',
                  cursor: '#5a82f9',
                },
              ]}
            />
          </h2>
          <button className="neon-button w-52 h-12">Call to Action</button>
        </div>
      </div>
      <div className="w-full">
        <Suspense
          fallback={
            <>
              <div className="text-4xl text-red-600">hello world</div>
            </>
          }
        >
          <HeroCanvas
            isMouseInside={isMouseInside}
            mousePosition={mousePosition}
          />
        </Suspense>
        {/* <Canvas
          className="w-full h-full absolute inset-0 "
          shadows
          dpr={[1, 2]}
          camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}
          //   position: [-2, 2, 6],
          onPointerEnter={() => {
            setIsMouseInside(true)
          }}
          onPointerLeave={() => {
            setIsMouseInside(false)
          }}
        >
          <OrbitControls />
          <color
            attach="background"
            args={['#090909']}
          />
          <fog
            attach="fog"
            args={['#090909', 5, 20]}
          />
          <ambientLight intensity={0.015} />
          <Scene
            isMouseInside={isMouseInside}
            mousePosition={mousePosition}
          />
        </Canvas> */}
      </div>
    </div>
  )
}

// function Scene({ isMouseInside, mousePosition }) {
//   const { scene, viewport } = useThree()

//   useEffect(() => {}, [])

//   let pointLightRef = useRef(null)

//   useFrame((state) => {
//     if (isMouseInside) {
//       pointLightRef.current.intensity = 0.5
//     } else {
//       pointLightRef.current.intensity = 0
//     }

//     pointLightRef.current.position.set(
//       (state.mouse.x * viewport.width) / 2,
//       (state.mouse.y * viewport.height) / 2,
//       0
//     )
//   })
//   return (
//     <group rotation={[0, 0, 0.15]}>
//       {/* <OrthographicCamera
//         makeDefault
//         left={viewport.width / -2}
//         right={viewport.width / 2}
//         top={viewport.height / 2}
//         bottom={viewport.height / -2}
//         near={1}
//         far={20}
//         position={[-2, 2, 6]}
//         zoom={100}
//       /> */}
//       <OrbitControls />
//       <pointLight
//         castShadow
//         position={[0, -200, 0]}
//         intensity={0}
//         color="purple"
//         // decay={0}
//         // decay={2}
//         distance={5}
//         ref={pointLightRef}
//       />
//       <MovingSpot
//         // color="#7b53d3"
//         color="#0c8cbf"
//         position={[3, 3, 2]}
//         mousePosition={mousePosition}
//       />
//       <MovingSpot
//         // color="#7b53d3"
//         color="#b00c3f"
//         position={[2, 3, 0]}
//         mousePosition={mousePosition}
//       />
//       {/* <MovingSpot
//         // color="#7b53d3"
//         color="#0c8cbf"
//         position={[0, -0.25, 3]}
//       /> */}
//       {/* <mesh
//         position={[0, -1.03, 0]}
//         castShadow
//         receiveShadow
//         geometry={nodes.dragon.geometry}
//         material={materials['Default OBJ.001']}
//         dispose={null}
//       /> */}
//       {/* <Sphere ></Sphere> */}
//       {/* <V15
//         position={[2, -1.15, 2]}
//         scale={0.5}
//       /> */}
//       {/* <V17
//         position={[2, -1.15, 2]}
//         scale={0.5}
//       /> */}
//       <V18
//         position={[2, -1.15, 2]}
//         scale={0.5}
//       />

//       <mesh
//         receiveShadow
//         position={[0, -1.0154152154922487, 0]}
//         rotation-x={-Math.PI / 2}
//       >
//         <planeGeometry args={[50, 50]} />
//         <meshPhongMaterial />
//       </mesh>
//     </group>
//   )
// }

// function MovingSpot({ vec = new Vector3(), mousePosition, ...props }) {
//   const light = useRef()
//   const viewport = useThree((state) => state.viewport)

//   useEffect(() => {
//     console.log(viewport)
//   }, [])
//   useFrame((state) => {
//     // console.log(state.mouse)
//     // console.log(mousePosition)
//     // light.current.target.position.lerp(
//     //   vec.set(
//     //     (state.mouse.x * viewport.width) / 2,
//     //     (state.mouse.y * viewport.height) / 2,
//     //     2
//     //   ),
//     //   0.1
//     // )
//     // light.current.target.updateMatrixWorld()
//     light.current.target.position.lerp(
//       vec.set(
//         (mousePosition.x * viewport.width) / 2,
//         (mousePosition.y * viewport.height) / 2,
//         1.5
//       ),
//       0.1
//     )
//     light.current.target.updateMatrixWorld()
//   })
//   return (
//     <SpotLight
//       castShadow
//       ref={light}
//       penumbra={1}
//       distance={6}
//       angle={0.35}
//       attenuation={5}
//       anglePower={4}
//       intensity={4}
//       opacity={0.7}
//       // shadow={{
//       //   mapSize: { width: 1024, height: 1024 },
//       //   opacity: 0.5, // Adjust shadow opacity here
//       // }}

//       {...props}
//     />
//   )
// }

// {/* <Trademark23 className="w-[39.5px] h-[39.5px] mt-[31px] -mx-[2] text-customViolet" /> */}
