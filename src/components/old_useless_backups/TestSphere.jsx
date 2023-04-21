import React from 'react'
import { Canvas } from '@react-three/fiber'
import {
  Sphere,
  OrbitControls,
  Environment,
  useTexture,
  Float,
  Decal,
} from '@react-three/drei'
import { ReactComponent as ReactSVG } from '../assets/tech/svg/react-logo.svg'

const Ball = (props) => {
  const [decal] = useTexture([<ReactSVG />])

  return (
    <Float
      speed={1.75}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <ambientLight intensity={0.25} />
      <pointLight
        position={[0, 10, 10]}
        intensity={1}
      />
      <mesh>
        <Sphere
          position={[0, 0, 0]}
          args={[1, 32, 32]}
        >
          <meshStandardMaterial color="#00ff83" />
        </Sphere>
      </mesh>

      {/* <Environment preset="studio" /> */}
    </Float>
  )
}

const MySphere = ({ texture }) => {
  const [decal] = useTexture([<ReactSVG />])

  return (
    <mesh>
      <Sphere
        position={[0, 0, 0]}
        args={[1, 32, 32]}
      >
        <meshStandardMaterial color="#00ff83" />
      </Sphere>
      <Decal
        position={[0, 0, 1]}
        map={decal}
      />
    </mesh>
  )
}

const TestSphere = () => {
  return (
    <Canvas style={{ height: '100vh', width: '100vw' }}>
      <OrbitControls />
      {/* <Ball /> */}

      <ambientLight intensity={0.5} />
      <pointLight
        position={[0, 10, 10]}
        intensity={1}
      />
      <MySphere />
      {/* <Sphere
        position={[0, 0, 0]}
        args={[1, 32, 32]}
      >
        <meshStandardMaterial color="#00ff83" />
      </Sphere> */}
    </Canvas>
  )
}

export default TestSphere
