import CompleteToolset from './components/CompleteToolset'
import Hero from './components/Hero'
import Navbar from './components/Navbar'
import Trademark2D from './components/Trademark2D'
import { ReactComponent as Trademark1 } from './assets/trademark/A_made_by_Subtract.svg'
import { ReactComponent as Trademark2 } from './assets/trademark/A_rocket_lookalike.svg'
import { ReactComponent as Trademark3 } from './assets/trademark/A_trapeziods_smooth_corners_with_tilt.svg'
import { ReactComponent as Trademark4 } from './assets/trademark/A_trapeziods_smooth_corners.svg'
import { ReactComponent as Trademark5 } from './assets/trademark/A_trapeziods.svg'
import { ReactComponent as Trademark6 } from './assets/trademark/A_upside_down_V_with_tilt.svg'
import { ReactComponent as Trademark7 } from './assets/trademark/A_upside_down_V.svg'
import { ReactComponent as Trademark8 } from './assets/trademark/A_with_circles_at_ends.svg'
import { ReactComponent as Trademark9 } from './assets/trademark/A_with_dot_with_tilt.svg'
import { ReactComponent as Trademark10 } from './assets/trademark/A_with_dot.svg'
import { ReactComponent as Trademark11 } from './assets/trademark/A_with_leg_missing_tall.svg'
import { ReactComponent as Trademark12 } from './assets/trademark/A_with_leg_missing.svg'
import { ReactComponent as Trademark13 } from './assets/trademark/A_with_parallelogram_dot_rounded.svg'
import { ReactComponent as Trademark14 } from './assets/trademark/A_with_parallelogram_dot_tilted_1_rounded.svg'
import { ReactComponent as Trademark15 } from './assets/trademark/A_with_parallelogram_dot_tilted_1.svg'
import { ReactComponent as Trademark16 } from './assets/trademark/A_with_parallelogram_dot_tilted_2.svg'
import { ReactComponent as Trademark17 } from './assets/trademark/A_with_parallelogram_dot.svg'
import { ReactComponent as Trademark18 } from './assets/trademark/A_with_simple_arrow_rounded_with_circle.svg'
import { ReactComponent as Trademark19 } from './assets/trademark/A_with_simple_arrow_rounded_with_middle_bar_normal.svg'
import { ReactComponent as Trademark20 } from './assets/trademark/A_with_simple_arrow_rounded_with_middle_bar_wide.svg'
import { ReactComponent as Trademark21 } from './assets/trademark/A_with_simple_arrow_rounded_with_mini.svg'
import { ReactComponent as Trademark22 } from './assets/trademark/A_with_simple_arrow_rounded.svg'
import { ReactComponent as Trademark23 } from './assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Canvas, extend } from '@react-three/fiber'
import { Cylinder, OrbitControls, Plane, Sphere } from '@react-three/drei'
import V3 from './components/V3'
import V15 from './components/V15'
import { Spiral } from './components/Spiral'
import MovingSpotlight from './components/MovingSpotlight'
import RectLightTest from './components/RectLightTest'
import TestHero from './components/TestHero'
import LoadingScreen from './components/LoadingScreen'
import { useProgress } from '@react-three/drei'
import TestingBloom from './components/TestingBloom'

// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'

import { EffectComposer, Bloom } from '@react-three/postprocessing'
// import { BlurPass, Resizer, KernelSize, Resolution } from 'postprocessing'

import { SelectiveBloom } from '@react-three/postprocessing'
import { BlurPass, Resizer, KernelSize } from 'postprocessing'

// extend({ EffectComposer, RenderPass, UnrealBloomPass })

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
      {/* <div className="w-screen h-screen flex items-center justify-center space-x-8">
        <Trademark11 className="w-40 h-40 text-red-700 " />
        <Trademark23
          ref={trademark23Ref}
          className="w-40 h-40 text-[#c261fe80] svg-animation"
        />

        <div className="flex items-center justify-center space-x-10 mb-20 ">
          <Trademark19 className="w-20 h-20 text-zinc-200 " />
          <Trademark6 className="w-20 h-20 text-zinc-200 " />
          <Trademark3 className="w-20 h-20 text-zinc-200 " />
          <Trademark2D classes="w-20 h-20 text-zinc-200 " />
          <Trademark8 className="w-20 h-20 text-zinc-200 " />
          <Trademark13 className="w-20 h-20 text-zinc-200 " />
          <Trademark16 className="w-20 h-20 text-zinc-200 " />
          <Trademark22 className="w-20 h-20 text-zinc-200 " />
          <Trademark21 className="w-20 h-20 text-zinc-200 " />
          <Trademark20 className="w-20 h-20 text-zinc-200 " />
          <Trademark18 className="w-20 h-20 text-zinc-200 " />
          <Trademark9 className="w-20 h-20 text-zinc-200 " />
        </div>
        <div className="flex items-center justify-center space-x-10  -translate-x-4">
          <Trademark12 className="w-20 h-20 text-zinc-200 " />
          <Trademark2 className="w-20 h-20 text-zinc-200 " />
          <Trademark4 className="w-20 h-20 text-zinc-200 " />
          <Trademark11 className="w-20 h-20 text-zinc-200 " />
          <Trademark5 className="w-20 h-20 text-zinc-200 " />
          <Trademark7 className="w-20 h-20 text-zinc-200 " />
          <Trademark10 className="w-20 h-20 text-zinc-200 " />
          <Trademark15 className="w-20 h-20 text-zinc-200 " />
          <Trademark14 className="w-20 h-20 text-zinc-200 " />
          <Trademark17 className="w-20 h-20 text-zinc-200 " />
          <Trademark1 className="w-20 h-20 text-zinc-200 " />
        </div>
      </div> */}
      {/* <Navbar />
      <Hero />
      <CompleteToolset /> */}
      {/* <div className="w-screen h-screen">
        <MovingSpotlight />
      </div> */}
      {/* <div className="w-screen h-screen">
        <Canvas
          className="w-full h-full"
          shadows
        >
          <RectLightTest />
        </Canvas>
      </div> */}

      {/* <div className="w-screen h-screen ">
        <Canvas className="w-full h-full">
          <ambientLight intensity={0.15} />
          <pointLight
            position={[0, 0, -3]}
            color="purple"
          />

          <OrbitControls />
          <Cylinder
            position={[0, 0, -5]}
            args={[0.25, 0.25, 2, 32]}
            rotation={[0, 0, Math.PI / 2]}
          >
            <meshStandardMaterial />
          </Cylinder>
          <Plane
            position={[0, -2, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            args={[50, 50]}
          >
            <meshStandardMaterial />
          </Plane>
        </Canvas>
      </div> */}

      {/* <div className="w-screen h-screen relative"> */}
      {isHeroLoading && (
        <LoadingScreen toggleIsHeroLoading={toggleIsHeroLoading} />
      )}
      {/* <Navbar /> */}
      <TestHero />
      {!isHeroLoading && <CompleteToolset />}

      {/* </div> */}
    </main>
  )
}

export default App

// <div className="w-screen h-screen flex item-center justify-center">
//   <Canvas
//     className="w-[90%] h-[90%] "
//     shadows
//   >
//     <OrbitControls enableZoom={false} />
//     {/* <ambientLight intensity={10} /> */}
//     <directionalLight
//       position={[0, 30, 10]}
//       intensity={1}
//       castShadow
//     />
//     {/* <V3 position={[0, -2.5, 0]} /> */}
//     <V15
//       position={[0, -2.5, 0]}
//       castShadow
//     />
//     <Plane
//       args={[15, 10]}
//       position={[0, -2.5, 0]}
//       rotation={[-Math.PI / 2, 0, 0]}
//       receiveShadow
//     >
//       <meshStandardMaterial color="#505050" />
//     </Plane>
//     {/* <Spiral position={[0, -3, 0]} /> */}
//   </Canvas>
// </div>

// {/* <div className="w-screen h-screen flex item-center justify-center">
//         <Canvas
//           className="w-[90%] h-[90%] "
//           shadows
//           linear
//           camera={{ position: [0, 0, 120] }}
//         >
//           <OrbitControls />
//           <ambientLight ref={ambientRef1} />
//           {/* <pointLight
//             ref={ambientRef1}
//             position={[0, 0, 30]}
//           /> */}
//           <Sphere
//             args={[10]}
//             ref={sphereRef1}
//           >
//             <meshStandardMaterial color="hotpink" />
//           </Sphere>
//           <Sphere
//             args={[10]}
//             position={[30, 20, 0]}
//           >
//             <meshStandardMaterial color="hotpink" />
//           </Sphere>
//           <EffectComposer>
//             {/* <Bloom
//               intensity={6}
//               luminanceThreshold={0}
//               luminanceSmoothing={0.9}
//               height={300}
//               opacity={3}
//             ></Bloom> */}
//             <SelectiveBloom
//               lights={[ambientRef1]} // ⚠️ REQUIRED! all relevant lights
//               selection={[sphereRef1]} // selection of objects that will have bloom effect
//               selectionLayer={10} // selection layer
//               // intensity={1.0} // The bloom intensity.
//               blurPass={undefined} // A blur pass.
//               width={Resizer.AUTO_SIZE} // render width
//               height={Resizer.AUTO_SIZE} // render height
//               kernelSize={KernelSize.LARGE} // blur kernel size
//               // luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
//               // luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]

//               intensity={6}
//               luminanceThreshold={0}
//               luminanceSmoothing={0.9}
//             />
//           </EffectComposer>
//           {/* <TestingBloom>
//           </TestingBloom> */}
//         </Canvas>
//       </div> */}
