import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { SelectiveBloom } from '@react-three/postprocessing'

export default function BloomSphere({ position }) {
  const sphereRef = useRef()

  // Create a bloom material for the sphere
  //   const bloomMaterial = new MeshDistortMaterial({
  //     color: 'white',
  //     distort: 0.4,
  //     radius: 1,
  //     alphaTest: 0.5,
  //     transparent: true,
  //   })

  // Update the sphere's position based on the mouse movement
  useFrame(({ viewport }) => {
    const x = (position.x / viewport.width) * 2 - 1
    const y = (position.y / viewport.height) * -2 + 1

    sphereRef.current.position.x = x * 3
    sphereRef.current.position.y = y * 3
  })

  return (
    <Sphere
      ref={sphereRef}
      args={[1, 32, 32]}
    >
      <meshBasicMaterial
        attach="material"
        color="white"
      />
      <SelectiveBloom
        luminanceThreshold={0}
        luminanceSmoothing={0.9}
        intensity={0.5}
        radius={0.3}
        renderLayers={['bloom']}
        // bloomMaterial={bloomMaterial}
      />
    </Sphere>
  )
}
