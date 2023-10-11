import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { SpotLight } from '@react-three/drei'
import { Vector3 } from 'three'

const MovingSpotLight = ({ vec = new Vector3(), mousePosition, ...props }) => {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)

  useFrame((state) => {
    const targetX =
      ((((mousePosition.x + 1) / 2) * (0.6 - 0.01) + 0.01) * viewport.width) / 2
    const targetY =
      (((mousePosition.y + 1) * (-0.5 + 1)) / 2 - 1) * viewport.height

    const targetZ = 2

    light.current.target.position.lerp(
      vec.set(targetX / 2, targetY / 2, targetZ),
      0.1
    )

    light.current.target.updateMatrixWorld()
  })
  return (
    <SpotLight
      ref={light}
      penumbra={1}
      distance={7}
      angle={0.45}
      // angle={0.25}
      attenuation={4}
      //   anglePower={4}
      anglePower={4}
      intensity={10}
      // decay={1}
      opacity={0.7}
      // shadow={{
      //   mapSize: { width: 1024, height: 1024 },
      //   opacity: 0.5, // Adjust shadow opacity here
      // }}
      {...props}
    />
  )
}

export default MovingSpotLight
