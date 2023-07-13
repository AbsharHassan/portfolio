import { Vector3 } from 'three'
import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  useGLTF,
  SpotLight,
  useDepthBuffer,
  Box,
  Html,
  OrbitControls,
  Sphere,
  OrthographicCamera,
  MeshDistortMaterial,
  useProgress,
  Stars,
  Sparkles,
} from '@react-three/drei'
import * as THREE from 'three'

import V18_8 from './V18_8'

import gsap from 'gsap'
import MovingSpotLight from './MovingSpotlight'
import SpaceDustTest from './SpaceDustTest'
import { useSelector } from 'react-redux'

const HeroCanvas = ({ isMouseInside, bloomTheme }) => {
  // useEffect(() => {
  //   console.log('r')
  // })
  // const { mousePosition } = useSelector((state) => state.threeStore)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      setMousePosition({ x, y })
    }
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <Canvas
      className="w-full h-full absolute inset-0 "
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 1000 }}
    >
      <OrbitControls />

      <Scene
        isMouseInside={isMouseInside}
        mousePosition={mousePosition}
        bloomTheme={bloomTheme}
      />
      <ambientLight intensity={0.015} />

      {/* <color
        attach="background"
        args={['#111018']}
      /> */}
      <fog
        attach="fog"
        args={['#111018', 5, 10]}
      />
    </Canvas>
  )
}

export default HeroCanvas

function Scene({ isMouseInside, mousePosition, bloomTheme }) {
  const { scene, viewport, camera, gl, size } = useThree()

  const colorsArray = [0xc261fe, 0x5a82f9, 0x09a9b8]

  let pointLightRef = useRef(null)
  let modelRef = useRef(null)
  let mainSceneGroupRef = useRef(null)
  let movingSpotLightGroup = useRef(null)
  let bloomPointLightRef = useRef()
  let pointLightVelocity = useRef(new Vector3(0, 0, 0))
  let bloomLightBackground = useRef()
  let bloomLightForeground = useRef()

  const randomPointLight = () => {
    const randomNumberColor = Math.floor(Math.random() * 3)
    pointLightRef.current.color.setHex(colorsArray[randomNumberColor])

    pointLightRef.current.intensity = 0.5

    const randomNumber = (Math.floor(Math.random() * 21) - 10) / 10
    const xPosition = (randomNumber * viewport.width) / 2
    pointLightRef.current.position.setY(3)
    pointLightRef.current.position.setX(xPosition)
    // pointLightRef.current.position.setZ(xPosition / 2)
    gsap.to(pointLightRef.current.position, {
      y: -2,
      duration: 3.5,
    })
  }

  useEffect(() => {
    // const pointLightInterval = setInterval(randomPointLight, 5000)
    // return () => {
    //   clearInterval(pointLightInterval)
    // }
  }, [])

  useEffect(() => {
    if (viewport.width < 8.5 && viewport.width > 6.5) {
      modelRef.current.position.setX(1)
      movingSpotLightGroup.current.position.setX(-2)
      mainSceneGroupRef.current.rotation.z = 0.15
      camera.position.setX(-2)
    } else if (viewport.width <= 6.5) {
      modelRef.current.position.setX(0)
      movingSpotLightGroup.current.position.setX(-4)
      mainSceneGroupRef.current.rotation.z = 0
      camera.position.setX(0)
    } else {
      modelRef.current.position.setX(2)
      movingSpotLightGroup.current.position.setX(0)
      mainSceneGroupRef.current.rotation.z = 0.15
      camera.position.setX(-2)
    }
  }, [viewport.width])

  useEffect(() => {
    gsap.to([bloomLightBackground.current.color], {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
  }, [bloomTheme])

  useFrame(() => {
    const cameraPosition = new THREE.Vector3(-2, 2, 6) // Replace with your camera position

    // Calculate the position in world coordinates based on camera orientation
    const worldPosition = new THREE.Vector3(
      mousePosition.x,
      mousePosition.y,
      -1
    ).unproject(camera)
    const direction = worldPosition.sub(cameraPosition).normalize()
    const distance = (-cameraPosition.z * 0.7) / direction.z
    const lightPositionBackground = cameraPosition
      .clone()
      .add(direction.multiplyScalar(distance))

    // bloomPointLightRef.current.position.lerp(lightPositionBackground, 0.1)

    const directionToTarget = lightPositionBackground
      .clone()
      .sub(bloomLightBackground.current.position.clone())

    const distanceToTarget = directionToTarget.length()

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = pointLightVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    bloomLightBackground.current.position.add(pointLightVelocity.current)
    // bloomLightForeground.current.position.set(
    //   bloomLightBackground.current.position.x,
    //   bloomLightBackground.current.position.y,
    //   4
    // )

    pointLightVelocity.current = pointLightVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)
  })

  return (
    <>
      <OrbitControls />

      <pointLight
        ref={bloomLightBackground}
        intensity={1}
        distance={3}
        // castShadow
      />
      {/* <pointLight
        ref={bloomLightForeground}
        intensity={1}
        distance={3}
        // castShadow
      /> */}

      <group
        ref={mainSceneGroupRef}
        //leave on new line
        // rotation={[0, 0, 0.15]}
        toneMapped={true}
      >
        <OrbitControls />

        <pointLight
          castShadow
          position={[0, -200, 0]}
          intensity={0}
          // decay={0}
          // decay={2}
          distance={5}
          ref={pointLightRef}
          toneMapped={true}
        />

        <group
          position={[0, 0, 0]}
          ref={movingSpotLightGroup}
          toneMapped={true}
        >
          <MovingSpotLight
            // color="#7b53d3"
            // color="#b00c3f"
            color="#0c8cbf"
            // color={[0.1, 0.3, 0.6]}
            position={[3, 3, 2]}
            // position={[3, 3, 3]}
            // position={[4, 1, 4]}
            mousePosition={mousePosition}
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <MovingSpotLight
            // color="#7b53d3"
            color="#0c8cbf"
            // color={[0.1, 0.3, 0.6]}
            // color="#fff"
            // color="#b00c3f"
            position={[2, 3, 0]}
            // position={[3, 3, 0]}
            // position={[4, 3, 3]}
            mousePosition={mousePosition}
            castShadow={false}
          />
        </group>

        {/* <BloomSphere /> */}

        <group
          position={[2, -1.15, 2]}
          scale={0.5}
          ref={modelRef}
        >
          <V18_8 />
        </group>

        <mesh
          receiveShadow
          position={[0, -1.0154152154922487, 0]}
          rotation-x={-Math.PI / 2}
        >
          <planeGeometry args={[150, 10]} />
          <meshStandardMaterial
            transparent
            opacity={0.75}
          />
        </mesh>
      </group>
    </>
  )
}
