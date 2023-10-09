import { useEffect, useMemo, useRef } from 'react'
import { Vector3, InstancedBufferAttribute } from 'three'
import { useFrame, useThree, Canvas } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import {
  vertexShader as spaceDustVertexShader,
  fragmentShader as spaceDustFragmentShader,
  uniforms as spaceDustUniforms,
} from '../shaders/space-dust/spaceDustParticlesShaders'
import gsap from 'gsap'

const SpaceDustCanvas = ({
  isHeroVisible,
  modelRotation,
  toggleSpaceAnimationComplete,
}) => {
  return (
    <div className="w-full h-screen fixed top-0 z-[-10]">
      <Canvas
        // consider setting z-index to be below the herocanvas with a semi transparent platform
        className="w-full h-screen "
        camera={{ fov: 10 }}
      >
        {/* <OrbitControls /> */}
        <SpaceDust
          particleCount={500}
          isHeroVisible={isHeroVisible}
          modelRotation={modelRotation}
        />
      </Canvas>
    </div>
  )
}

export default SpaceDustCanvas

const SpaceDust = ({ particleCount, isHeroVisible, modelRotation }) => {
  // Constants
  const { nodes } = useGLTF('./models/v18_11.glb')
  const { viewport } = useThree()

  // Memos
  const geometry = useMemo(() => {
    return nodes['outer-spiral'].geometry
  }, [nodes])

  // Refs
  let meshRef = useRef(null)
  let mousePosition = useRef({ x: 0, y: 0 })
  let initialRender = useRef(true)
  let sphereRef = useRef(new Vector3(0, 0, 0))
  let sphereVelocity = useRef(new Vector3(0, 0, 0))
  let animationRef = useRef(null)

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      mousePosition.current = { x, y }
    }
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  useEffect(() => {
    let randomPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      let x =
        Math.random() * (viewport.width + 0.2) - (viewport.width + 0.2) / 2
      let y =
        Math.random() * (viewport.height + 0.2) - (viewport.height + 0.2) / 2
      let z = Math.random() * 2 * 0.2

      randomPositions.set([x, y, z], i * 3)
    }

    let largeLength = geometry.attributes.position.array.length
    let smallLength = randomPositions.length
    let interval = Math.floor(largeLength / smallLength)

    let completeTarget = []
    let innerIndex = 0
    let populateIndex = 0

    for (let i = 0; i < largeLength; i = i + 3) {
      completeTarget[innerIndex] = {
        x: geometry.attributes.position.array[i] * 0.5,
        y: geometry.attributes.position.array[i + 1] * 0.5,
        z: geometry.attributes.position.array[i + 2] * 0.5,
      }
      innerIndex++
    }

    let orderedPositions = new Float32Array(smallLength)

    for (let i = 0; i < particleCount; i++) {
      let x = completeTarget[populateIndex].x
      let y = -completeTarget[populateIndex].z
      let z = completeTarget[populateIndex].y

      orderedPositions.set([x, y, z], i * 3)
      populateIndex = populateIndex + interval
    }

    meshRef.current.geometry.setAttribute(
      'pos1',
      new InstancedBufferAttribute(randomPositions, 3, false)
    )
    meshRef.current.geometry.setAttribute(
      'pos2',
      new InstancedBufferAttribute(orderedPositions, 3, false)
    )

    //creates a weird but nice chromatic abbrations effect i guess

    let size = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // let s = Math.random() * 2 + 1
      size[i] = Math.random() * 1.5
    }

    meshRef.current.geometry.setAttribute(
      'size',
      new InstancedBufferAttribute(size, 1, false)
    )

    let colorRand = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // let s = Math.random() * 2 + 1
      colorRand[i] = Math.random() * 1
    }

    meshRef.current.geometry.setAttribute(
      'colorRand',
      new InstancedBufferAttribute(colorRand, 1, false)
    )
  }, [meshRef, particleCount, geometry])

  useEffect(() => {
    animationRef.current = gsap.to(
      meshRef.current.material.uniforms.uInterpolate,
      {
        value: isHeroVisible ? 0 : 1,
        duration: 2,
        ease: 'sine.inOut',
        onComplete: () => {},
      }
    )
  }, [isHeroVisible])

  // useEffect(() => {
  //   gsap.to(meshRef.current.rotation, {
  //     y: isParticleModelVisible ? modelRotation + 1 : 0,
  //     duration: 2,
  //   })
  // }, [modelRotation])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    const directionToTarget = new Vector3(
      (mousePosition.current.x * viewport.width) / 2,
      (mousePosition.current.y * viewport.height) / 2,
      0
    ).sub(sphereRef.current)

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = sphereVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    sphereRef.current.add(sphereVelocity.current)

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    meshRef.current.material.uniforms.uSpherePos.value = sphereRef.current

    meshRef.current.material.uniforms.uTime.value = time
  })

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, particleCount]}
    >
      <planeGeometry args={[0.005, 0.005]} />
      <shaderMaterial
        uniforms={spaceDustUniforms}
        vertexShader={spaceDustVertexShader}
        fragmentShader={spaceDustFragmentShader}
        transparent
        depthTest={false}
      />
    </instancedMesh>
  )
}
