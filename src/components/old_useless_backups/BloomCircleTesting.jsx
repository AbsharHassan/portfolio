import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'

import {
  vertexShader,
  fragmentShader,
  uniforms,
} from '../../shaders/bloom-circle/bloomCircleShaders'

const BloomCircleTesting = () => {
  const { scene, viewport } = useThree()

  useEffect(() => {
    let geometry = new THREE.PlaneGeometry(
      viewport.width,
      viewport.height,
      10,
      10
    )

    let material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })

    let mesh = new THREE.Mesh(geometry, material)

    scene.add(mesh)
  }, [])

  return <></>
}

export default BloomCircleTesting
