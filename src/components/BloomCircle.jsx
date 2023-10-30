import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'

import { Vector3 } from 'three'
import { useFrame, useThree } from '@react-three/fiber'

import gsap from 'gsap'
import useWindowResize from '../utils/useWindowResize'

import {
  vertexShader as bloomCircleVertexShader,
  fragmentShader as bloomCircleFragmentShader,
  uniforms as bloomCircleUniforms,
} from '../shaders/bloom-circle/bloomCircleShaders'

const BloomCircle = ({ isHeroVisible, assetsLoading }) => {
  const { viewport } = useThree()
  const { bloomTheme } = useSelector((state) => state.threeStore)
  const windowSize = useWindowResize()

  const [delayedAssetsLoading, setDelayedAssetsLoading] = useState(true)

  let meshRef = useRef()

  let mousePosition = useRef({ x: 0, y: 0 })
  let dummyVector = useRef(new Vector3())

  let sphereVelocity = useRef(new Vector3(0, 0, 0))

  useEffect(() => {
    function handle(event) {
      const { clientX, clientY } = event

      const x = (clientX / windowSize.width) * 2 - 1
      const y = -(clientY / windowSize.height) * 2 + 1

      mousePosition.current = { x, y }
    }

    window.addEventListener('mousemove', handle)

    return () => {
      window.removeEventListener('mousemove', handle)
    }
  }, [windowSize])

  useEffect(() => {
    gsap.to(meshRef.current.material.uniforms?.uColor?.value, {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
  }, [bloomTheme])

  useEffect(() => {
    let timeout = setTimeout(() => {
      setDelayedAssetsLoading(assetsLoading)
    }, 3700)

    return () => {
      clearTimeout(timeout)
    }
  }, [assetsLoading])

  useEffect(() => {
    console.log(delayedAssetsLoading)
    if (!delayedAssetsLoading) {
      console.log('run')
      gsap.to(meshRef.current.material.uniforms?.uOpacity, {
        value: isHeroVisible ? 1 : 0,
        ease: 'sine.inOut',
      })
    }
  }, [isHeroVisible, delayedAssetsLoading])

  useFrame(() => {
    const directionToTarget = new Vector3(
      (mousePosition.current.x * viewport.width) / 2,
      (mousePosition.current.y * viewport.height) / 2,
      0
    ).sub(dummyVector.current.clone())

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = sphereVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    dummyVector.current.add(sphereVelocity.current)

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    const normalizedMouse = dummyVector.current.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5

    meshRef.current.material.uniforms.uMousePosition.value = normalizedMouse
  })

  useEffect(() => {
    meshRef.current.material.uniforms.uAspectRatio.value =
      windowSize.height / windowSize.width

    meshRef.current.scale.x = viewport.width
    meshRef.current.scale.y = viewport.height

    return () => {}
  }, [windowSize, viewport, meshRef])

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        transparent
        vertexShader={bloomCircleVertexShader}
        fragmentShader={bloomCircleFragmentShader}
        uniforms={bloomCircleUniforms}
      />
    </mesh>
  )
}

export default BloomCircle
