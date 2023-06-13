import { useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'

const TestBloomSphere = () => {
  const { viewport } = useThree()
  let sphereRef1 = useRef(null)

  useFrame((state) => {
    sphereRef1.current.position.set(
      (state.mouse.x * viewport.width) / 2,
      (state.mouse.y * viewport.height) / 2,
      0
    )
  })

  return (
    <Sphere
      position={[0, 0, 0]}
      args={[0.1]}
      ref={sphereRef1}
      wireframe
    >
      <meshBasicMaterial
        color={[1.2, 0, 0]}
        toneMapped={false}
      />
      <pointLight
        intensity={0.1}
        color="red"
      />
    </Sphere>
  )
}

export default TestBloomSphere
