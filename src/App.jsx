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
import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import V3 from './components/V3'
import { Spiral } from './components/Spiral'

function App() {
  let trademark23Ref = useRef(null)

  useEffect(() => {
    // console.log(trademark23Ref.current.childNodes[0].getTotalLength())
    // gsap.to({})
  }, [trademark23Ref])
  return (
    <>
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
      <div className="w-screen h-screen flex item-center justify-center">
        <Canvas className="w-[90%] h-[90%] ">
          <OrbitControls />
          {/* <ambientLight intensity={10} /> */}
          <pointLight
            position={[0, 0, 10]}
            intensity={0.5}
          />
          {/* <V3 position={[0, -2, 0]} /> */}
          <Spiral position={[0, -3, 0]} />
        </Canvas>
      </div>
    </>
  )
}

export default App
