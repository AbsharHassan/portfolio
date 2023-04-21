// import { Sphere, Html } from 'drei'
import { Sphere, Decal, Float, useTexture } from '@react-three/drei'
import { ReactComponent as ReactSVG } from '../assets/tech/svg/react-logo.svg'

const SphereComp = ({ icon }) => {
  const [decal] = useTexture([<ReactSVG />])
  return (
    <Float
      speed={1.75}
      rotationIntensity={1}
      floatIntensity={2}
    >
      <ambientLight
        intensity={0.25}
        args={['#ffffff', 1]}
      />
      <directionalLight position={[0, 0, 0.05]} />
      <mesh
        castShadow
        receiveShadow
        scale={2.75}
      >
        <sphereGeometry args={[1, 64, 32]} />
        {/* <Sphere args={[1, 64, 32]} /> */}
        <meshStandardMaterial
          attach="material"
          color="#0088ff"
          polygonOffset
          polygonOffsetFactor={-5}
          flatShading
        />
        {/* <Decal
          position={[0, 0, 1]}
          map={decal}
        /> */}
      </mesh>
    </Float>
  )
}

export default SphereComp
