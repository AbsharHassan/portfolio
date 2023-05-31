/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.1.12 public/models/v3.glb
*/

import React, { useEffect, useRef } from 'react'
import { OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function V18({ handleModelBoundingBox, ...props }) {
  const { nodes, materials } = useGLTF('./models/v18.glb')
  let groupRef = useRef(null)

  useFrame(() => {
    if (groupRef?.current) {
      groupRef.current.rotation.y = groupRef.current.rotation.y - 0.025

      // const boundingBox = new THREE.Box3().setFromObject(groupRef.current)

      // console.log(boundingBox)
    }
  })

  useEffect(() => {
    const boundingBox = new THREE.Box3().setFromObject(groupRef.current)
    console.log(boundingBox)
    handleModelBoundingBox(boundingBox)
  }, [groupRef])

  return (
    <group
      {...props}
      dispose={null}
      ref={groupRef}
    >
      <mesh
        castShadow
        // receiveShadow
        geometry={nodes['outer-spiral'].geometry}
        // material={nodes['outer-spiral'].material}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial
          fog={false}
          color="#808080"
          roughness={0.1}
          // castShadow
        />
      </mesh>
    </group>
  )
}

useGLTF.preload('./models/v18.glb')
