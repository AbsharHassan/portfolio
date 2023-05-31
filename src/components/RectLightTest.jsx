import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, Sphere } from '@react-three/drei'

import * as THREE from 'three'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

const RectLightTest = () => {
  const { scene } = useThree()

  useEffect(() => {
    RectAreaLightUniformsLib.init()

    const rectLight = new THREE.RectAreaLight('red', 100, 4, 10)
    rectLight.position.set(0, 5, -10)
    rectLight.lookAt(0, 0, 0)
    scene.add(rectLight)
    scene.add(new RectAreaLightHelper(rectLight))
  }, [])
  return (
    <>
      <OrbitControls />
      {/* <ambientLight /> */}
      {/* <rectAreaLight
        // ref={rectAreaLight}
        position={[-5, 5, 15]}
        width={4}
        height={10}
        color={'red'}
        intensity={5}
      /> */}
      <Sphere castShadow>
        <meshStandardMaterial color="green" />
      </Sphere>
      <mesh
        receiveShadow
        position={[0, -1.0154152154922487, 0]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[50, 50]} />
        <meshPhongMaterial />
      </mesh>
    </>
  )
}

export default RectLightTest
