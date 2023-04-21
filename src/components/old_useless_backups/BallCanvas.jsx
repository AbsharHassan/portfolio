import { Canvas } from '@react-three/fiber'
import { OrbitControls, Float, Decal, useTexture } from '@react-three/drei'

const Ball = ({ png }) => {
  const [decal] = useTexture([png])

  return (
    // <Float
    //   speed={1.75}
    //   rotationIntensity={1}
    //   floatIntensity={0}
    // >
    <>
      <pointLight
        position={[0, 10, 10]}
        intensity={1}
      />
      <mesh
        castShadow
        receiveShadow
        scale={2.75}
      >
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial
          color="#334155"
          roughness={0.6}
        />
        <Decal
          position={[0, 0, 1]}
          map={decal}
          // rotation={[2 * Math.PI, 0, 6.25]}
          scale={1}
          flatShading
        />
      </mesh>
    </>
    // </Float>
  )
}

const BallCanvas = ({ logo }) => {
  return (
    <Canvas className="w-full h-full">
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3} // Camera can't be rotated below 45 degrees
        maxPolarAngle={Math.PI / 1.5} // Camera can't be rotated above 90 degrees
        minAzimuthAngle={-(Math.PI / 6)}
        maxAzimuthAngle={Math.PI / 6}
      />
      <Ball png={logo} />
    </Canvas>
  )
}

export default BallCanvas
