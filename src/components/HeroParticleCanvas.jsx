import { Canvas } from '@react-three/fiber'
import SpaceDustTest from './SpaceDustTest'
import { OrbitControls } from '@react-three/drei'
import { useEffect } from 'react'

const HeroParticleCanvas = ({ isParticleModelVisible }) => {
  return (
    <Canvas
      className="w-full h-full absolute inset-0 z-[-10]"
      camera={{ fov: 10 }}
    >
      {/* <OrbitControls /> */}
      <SpaceDustTest
        particleCount={500}
        isParticleModelVisible={isParticleModelVisible}
        // mousePosition={mousePosition}
      />
    </Canvas>
  )
}

export default HeroParticleCanvas
