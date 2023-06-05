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
} from '@react-three/drei'
import * as THREE from 'three'
import Spiral from './Spiral'
import V15 from './V15'
import V17 from './V17'
import V18 from './V18'
import V18_3 from './V18_3'
import V18_4 from './V18_4'
import V18_5 from './V18_5'
import V18_6 from './V18_6'
import V18_7 from './V18_7'
import V18_8 from './V18_8'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import gsap from 'gsap'
import V22 from './V22'

const HeroCanvas = ({ isMouseInside, mousePosition }) => {
  return (
    <Canvas
      className="w-full h-full absolute inset-0 "
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}

      //   position: [-2, 2, 6],
    >
      {/* <OrbitControls /> */}
      <color
        attach="background"
        args={['#111018']}
      />
      <fog
        attach="fog"
        args={['#111018', 5, 20]}
      />
      <ambientLight intensity={0.015} />
      <Scene
        isMouseInside={isMouseInside}
        mousePosition={mousePosition}
      />
    </Canvas>
  )
}

export default HeroCanvas

function Scene({ isMouseInside, mousePosition }) {
  // const { progress } = useProgress()
  const { scene, viewport, camera } = useThree()
  const [modelBoundingBox, setModelBoundingBox] = useState(new THREE.Box3())
  const [initialViewportWidth, setInitialViewportWidth] = useState(
    viewport?.width
  )

  useEffect(() => {
    setInitialViewportWidth(viewport?.width)
  }, [])

  // useEffect(() => {
  //   console.log(progress)
  // }, [progress])

  // useEffect(() => {
  //   if (
  //     viewport.width !== initialViewportWidth &&
  //     viewport.width < initialViewportWidth
  //   ) {
  //     modelRef.current.position.setX(
  //       modelRef.current.position.x -
  //         (initialViewportWidth - viewport.width) / 100
  //     )
  //   }
  // }, [viewport])

  // useEffect(() => {
  //   cursorPointLightRef.current.position.set(
  //     mousePosition.x,
  //     mousePosition.y,
  //     2
  //   )
  // }, [mousePosition])

  useEffect(() => {
    if (viewport.width < 8.5 && viewport.width > 6.5) {
      modelRef.current.position.setX(1)
      movingSpotTopRef.current.position.setX(-2)
      mainSceneGroupRef.current.rotation.z = 0.15
      camera.position.setX(-2)
    } else if (viewport.width <= 6.5) {
      modelRef.current.position.setX(0)
      movingSpotTopRef.current.position.setX(-4)
      mainSceneGroupRef.current.rotation.z = 0
      camera.position.setX(0)
    } else {
      modelRef.current.position.setX(2)
      movingSpotTopRef.current.position.setX(0)
      mainSceneGroupRef.current.rotation.z = 0.15
      camera.position.setX(-2)
    }
  }, [viewport.width])

  const colorsArray = [0xc261fe, 0x5a82f9, 0x09a9b8]

  let pointLightRef = useRef(null)
  let sphereRef = useRef(null)
  let modelRef = useRef(null)
  let mainSceneGroupRef = useRef(null)
  let movingSpotTopRef = useRef(null)
  let movingSpotBottomRef = useRef(null)
  let cursorPointLightRef = useRef(null)

  const randomPointLight = () => {
    // console.log('pointlight going')
    const randomNumberColor = Math.floor(Math.random() * 3)
    pointLightRef.current.color.setHex(colorsArray[randomNumberColor])
    // console.log(randomNumberColor)

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

  const handleModelBoundingBox = (box) => {
    setModelBoundingBox(box)
  }

  useEffect(() => {
    const pointLightInterval = setInterval(randomPointLight, 5000)

    return () => {
      clearInterval(pointLightInterval)
    }
  }, [])

  useFrame((state) => {
    const randomNumber = Math.floor(Math.random() * 10) + 1
    // if (isMouseInside) {
    //   pointLightRef.current.intensity = 0.5
    // } else {
    //   pointLightRef.current.intensity = 0
    // }
    // pointLightRef.current.position.set(
    //   (mousePosition.x * viewport.width) / 2,
    //   (mousePosition.y * viewport.height) / 2,
    //   0
    // )
  })
  return (
    <group
      ref={mainSceneGroupRef}
      //leave on new line
      // rotation={[0, 0, 0.15]}
    >
      {/* <OrthographicCamera
        makeDefault
        left={viewport.width / -2}
        right={viewport.width / 2}
        top={viewport.height / 2}
        bottom={viewport.height / -2}
        near={1}
        far={20}
        position={[-2, 2, 6]}
        zoom={150}
      /> */}
      <OrbitControls />
      {/* <Sphere
        args={[0.3, 64, 64]}
        position={[0, 0, 0]}
        ref={sphereRef}
      >
        <MeshDistortMaterial
          //   roughness={0}
          color="white"
          distort={1}
          speed={3}
        />
      </Sphere>
      <pointLight
        castShadow
        position={[0, 0, 3]}
        intensity={10}
        color="purple"
        // decay={0}
        // decay={2}
        distance={5}
        ref={pointLightRef}
        lookAt={sphereRef.current}
      /> */}

      {/* <pointLight
        ref={cursorPointLightRef}
        intensity={1}
        distance={2}
        color="green"
        position={[0, 0, 0]}
      /> */}

      <pointLight
        castShadow
        position={[0, -200, 0]}
        intensity={0}
        // decay={0}
        // decay={2}
        distance={5}
        ref={pointLightRef}
      />

      <group
        position={[0, 0, 0]}
        ref={movingSpotTopRef}
      >
        <MovingSpot
          // color="#7b53d3"
          // color="#b00c3f"
          color="#0c8cbf"
          // position={[3, 3, 2]}
          position={[4, 1, 4]}
          mousePosition={mousePosition}
          // castShadow={false}
          castShadow
          // shadow={{ mapSize: new THREE.Vector2(512, 512) }}
          shadow-mapSize={[256, 256]}
          // ref={movingSpotTopRef}
        />
        <MovingSpot
          // color="#7b53d3"
          color="#0c8cbf"
          // color="#fff"
          // color="#b00c3f"
          // position={[2, 3, 0]}
          position={[4, 3, 3]}
          mousePosition={mousePosition}
          castShadow={false}

          // ref={movingSpotBottomRef}
        />
      </group>
      {/* <MovingSpot
          // color="#7b53d3"
          color="#0c8cbf"
          position={[0, -0.25, 3]}
        /> */}
      {/* <mesh
          position={[0, -1.03, 0]}
          castShadow
          receiveShadow
          geometry={nodes.dragon.geometry}
          material={materials['Default OBJ.001']}
          dispose={null}
        /> */}
      {/* <Sphere ></Sphere> */}
      {/* <V15
          position={[2, -1.15, 2]}
          scale={0.5}
        /> */}
      {/* <V17
          position={[2, -1.15, 2]}
          scale={0.5}
        /> */}
      <group
        position={[2, -1.15, 2]}
        scale={0.5}
        ref={modelRef}
      >
        {/* <V18 handleModelBoundingBox={handleModelBoundingBox} /> */}
        {/* <V18_3 handleModelBoundingBox={handleModelBoundingBox} /> */}
        <V18_8 handleModelBoundingBox={handleModelBoundingBox} />
        {/* <Spiral /> */}
      </group>
      {/* <V22
        position={[2, -1.2, 2]}
        scale={0.5}
      /> */}

      <mesh
        receiveShadow
        position={[0, -1.0154152154922487, 0]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
        // transparent
        // opacity={0.3}
        />
      </mesh>
    </group>
  )
}

function MovingSpot({ vec = new Vector3(), mousePosition, ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)

  useEffect(() => {
    // console.log(viewport)
  }, [])
  useFrame((state) => {
    // console.log(state.mouse)
    // console.log(mousePosition)
    // light.current.target.position.lerp(
    //   vec.set(
    //     (state.mouse.x * viewport.width) / 2,
    //     (state.mouse.y * viewport.height) / 2,
    //     2
    //   ),
    //   0.1
    // )
    // light.current.target.updateMatrixWorld()

    // console.log((2 * -1.5) / viewport.height)

    // const targetX =
    //   (((mousePosition.x + 1) / 2) * (0.6 - 0.01) + 0.01) * viewport.width
    // const targetY =
    //   (((mousePosition.y + 1) * (-0.5 + 1)) / 2 - 1) * viewport.height

    const targetX = ((mousePosition.x + 1) / 2) * 0.2 * viewport.width

    const targetY =
      (((mousePosition.y + 1) * (-0.2 + 0.7)) / 2 - 0.7) * viewport.height

    const scaledX = (mousePosition.x * viewport.width) / 2
    const scaledY = (mousePosition.y * viewport.height) / 2

    light.current.target.position.lerp(
      vec.set(targetX / 2, targetY / 2, 1),
      0.1
    )

    // light.current.target.position.lerp(
    //   vec.set(
    //     (mousePosition.x * viewport.width) / 2,
    //     (mousePosition.y * viewport.height) / 2,
    //     1
    //   ),
    //   0.1
    // )
    // console.log(mousePosition.x, mousePosition.y)

    if (scaledX > 0.6 && scaledX < 3.6 && scaledY > -3.1 && scaledY < -1.5) {
      //     light.current.target.position.lerp(
      //       vec.set(
      //         (mousePosition.x * viewport.width) / 2,
      //         (mousePosition.y * viewport.height) / 2,
      //         1.5
      //       ),
      //       0.1
      //     )
      //   console.log(mousePosition.x, mousePosition.y)
    } else {
    }

    light.current.target.updateMatrixWorld()
  })
  return (
    <SpotLight
      ref={light}
      penumbra={1}
      distance={6}
      //   angle={0.35}
      angle={0.35}
      attenuation={4}
      //   anglePower={4}
      anglePower={6}
      intensity={4}
      // decay={1}
      opacity={0.7}
      // shadow={{
      //   mapSize: { width: 1024, height: 1024 },
      //   opacity: 0.5, // Adjust shadow opacity here
      // }}

      {...props}
    />
  )
}
