import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import TestLaptop from './TestLaptop'
import { Vector3 } from 'three'
import { useState } from 'react'

const MockSingleProject = () => {
  return <SingleProjectCanvas />
}

export default MockSingleProject

const SingleProjectCanvas = () => {
  const [fullView, setFullView] = useState(false)
  return (
    <div className="w-full h-screen flex items-center justify-center mx-auto relative">
      <div
        className={`absolute inset-0 h-full bg-green-900/5  transition-all duration-1000 z-50 ${
          fullView ? 'w-[10%]' : 'w-[40%]'
        }`}
        onClick={() => {
          setFullView((v) => !v)
        }}
      ></div>
      <div className="h-full w-full transition-all duration-1000">
        <Canvas
          className="w-full h-full"
          camera={{
            // position: [0, 15, 5],
            // position: [0, 2, 2],
            // lookAt: new Vector3(0, 1.6, -1),
            // position: [0.75, 0, 5],
            // position: [0, 0, 3],
            fov: 20,
          }}
        >
          <OrbitControls />
          {/* <axesHelper args={[2, 2, 2]} /> */}
          <hemisphereLight
            intensity={0.2}
            color="white"
            position={[0, -6, 0]}
          />

          <pointLight
            position={[0, 1, 0]}
            intensity={0.1}
          />
          {/* <PresentationControls> */}
          <TestLaptop fullView={fullView} />
          {/* </PresentationControls> */}

          <EffectComposer>
            <Bloom
              mipmapBlur
              luminanceThreshold={1}
              intensity={1}
              radius={0.5}
            />
          </EffectComposer>
        </Canvas>
      </div>
    </div>
  )
}
