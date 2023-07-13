import React, { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const TestMouseParticles = ({ spherePosition, sphereVelocity }) => {
  const particleMeshRef = useRef()
  const particlesCount = 100 // Number of particles to create

  // Generate initial particle positions and velocities
  const particleData = new Array(particlesCount).fill().map(() => {
    return {
      position: [0, 0, 0], // Initial position of the particle
      velocity: [0, 0, 0], // Initial velocity of the particle
    }
  })

  // Update particles on each frame
  useFrame(() => {
    const particlePositions = []
    const particleVelocities = []

    // Update particle positions based on the sphere's momentum
    for (let i = 0; i < particlesCount; i++) {
      const particle = particleData[i]
      const { position, velocity } = particle

      // Update particle's position based on the sphere's position and velocity
      position[0] += sphereVelocity[0]
      position[1] += sphereVelocity[1]
      position[2] += sphereVelocity[2]

      // Store the updated position and velocity
      particlePositions.push(...position)
      particleVelocities.push(...velocity)
    }

    // Update the instanced mesh with the new particle positions and velocities
    particleMeshRef.current.instanceMatrix.needsUpdate = true
    particleMeshRef.current.geometry.attributes.position.needsUpdate = true

    particleMeshRef.current.geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(particlePositions, 3)
    )
  })

  return (
    <instancedMesh
      ref={particleMeshRef}
      args={[null, null, particlesCount]}
      frustumCulled={false}
    >
      <sphereBufferGeometry args={[0.1, 16, 16]} />
      {/* <particleMaterial
        uniforms-uTime-value={1.0}
        uniforms-uOpacity-value={1.0}
      /> */}
      <meshBasicMaterial />
    </instancedMesh>
  )
}

export default TestMouseParticles
