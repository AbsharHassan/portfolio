import { OrbitControls } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useInView } from 'react-intersection-observer'
import LaptopModel from './LaptopModel'
import PhoneModel from './PhoneModel'
import { useEffect } from 'react'

const SingleProjectCanvas = ({
  fullView,
  leftSide,
  laptop,
  setFullView,
  model,
  project,
}) => {
  const [containerRef, inView, entry] = useInView({
    /* Optional options */
    threshold: 0,
  })

  return (
    <div
      ref={containerRef}
      className="h-full w-full transition-all duration-1000 bg-green-500"
    >
      <Canvas
        className="w-full h-full"
        frameloop={inView ? 'always' : 'never'}
        camera={{
          // position: [0, 15, 5],
          // position: [0, 2, 2],
          // lookAt: new Vector3(0, 1.6, -1),
          // position: [0.75, 0, 5],
          // position: [0, 0, 3],
          fov: 20,
          position: [0, 0, 4],
        }}
      >
        <OrbitControls
          enablePan={false}
          enableRotate={false}
          enableZoom={false}
        />

        {/* add click listener that triggers fullView */}
        {project.model === 'laptop' ? (
          <>
            <LaptopModel
              fullView={fullView}
              leftSide={leftSide}
              setFullView={setFullView}
              url={project.url}
              inView={inView}
            />
          </>
        ) : (
          <>
            <PhoneModel fullView={fullView} />
          </>
        )}
      </Canvas>
    </div>
  )
}

export default SingleProjectCanvas
