import React, { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Plane, useGLTF } from '@react-three/drei'
import { SVGLoader } from 'three/addons/loaders/SVGLoader.js'
import * as THREE from 'three'
// import * as somt from '../assets/tech/svg/tailwindcss-logo.svg'

const Test = () => {
  //   const { nodes } = useGLTF('/react-logo.svg', true)
  const { scene } = useThree()
  const loader = new SVGLoader()
  const url = '/tailwindcss-logo.svg'

  useEffect(() => {
    loader.load(url, function (data) {
      const paths = data.paths
      const group = new THREE.Group()
      group.scale = 0.3

      for (let i = 0; i < paths.length; i++) {
        const path = paths[i]

        const material = new THREE.MeshBasicMaterial({
          color: path.color,
          side: THREE.DoubleSide,
          depthWrite: false,
        })

        const shapes = SVGLoader.createShapes(path)

        for (let j = 0; j < shapes.length; j++) {
          const shape = shapes[j]
          const geometry = new THREE.ShapeGeometry(shape)
          const mesh = new THREE.Mesh(geometry, material)
          group.add(mesh)
        }
      }

      scene.add(group)
    })
  })
  return (
    <>
      <Plane
        position={[0, 0, 0]}
        args={[300, 150]}
      >
        <meshStandardMaterial color="#333" />
      </Plane>
    </>
  )
}

export default Test
