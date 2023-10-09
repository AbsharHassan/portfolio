/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 no_keyboard_v1.glb 
*/

import React, { forwardRef, useRef } from 'react'
import { useGLTF } from '@react-three/drei'

const NoKeyboardV1 = (props, ref) => {
  const { nodes, materials } = useGLTF('/models/no_keyboard_v1.glb')
  return (
    <group
      {...props}
      dispose={null}
      ref={ref}
    >
      <mesh
        geometry={nodes.Body.geometry}
        // material={nodes.Body.material}
      >
        <meshPhysicalMaterial
          color={'#818181'}
          // roughness={0.1}
          clearcoat={1}
          clearcoatRoughness={0.1}
          metalness={0.9}
          roughness={0.5}
        />
      </mesh>
      <mesh
        geometry={nodes.Frame.geometry}
        material={materials.Frame}
        position={[0, -0.62, 0.047]}
      />
    </group>
  )
}

useGLTF.preload('/models/no_keyboard_v1.glb')

export default forwardRef(NoKeyboardV1)