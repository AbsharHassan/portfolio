/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.12 public/models/spiral.glb
*/

import React, { useRef } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Spiral(props) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('./models/spiral.glb')
  const { actions } = useAnimations(animations, group)

  useFrame(() => {
    if (group?.current) {
      group.current.rotation.y = group.current.rotation.y - 0.025
      // const boundingBox = new THREE.Box3().setFromObject(groupRef.current)
      // console.log(boundingBox)
    }
  })

  return (
    <group
      ref={group}
      {...props}
      dispose={null}
    >
      <group name="Scene">
        <mesh
          castShadow
          name="Outer_Spiral"
          geometry={nodes.Outer_Spiral.geometry}
          material={materials['Material.001']}
        />
      </group>
    </group>
  )
}

useGLTF.preload('./models/spiral.glb')