import { Vector3 } from 'three'
import { useRef, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
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
  Billboard,
} from '@react-three/drei'
import * as THREE from 'three'

import V18_8 from './V18_8'

import gsap from 'gsap'

import {
  EffectComposer,
  Bloom,
  SelectiveBloom,
} from '@react-three/postprocessing'

const HeroCanvas = ({ isMouseInside, mousePosition }) => {
  let lightRef1 = useRef()
  let sphereRef1 = useRef()
  let effectCompRef = useRef()

  // useEffect(() => {
  //   console.log(effectCompRef)
  // }, [effectCompRef])
  return (
    <Canvas
      className="w-full h-full absolute inset-0 "
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      camera={{ position: [-2, 2, 6], fov: 50, near: 1, far: 20 }}
    >
      <Scene
        isMouseInside={isMouseInside}
        mousePosition={mousePosition}
      />
      <ambientLight
        ref={lightRef1}
        intensity={0.015}
      />
      <color
        attach="background"
        args={['#111018']}
      />
      <fog
        attach="fog"
        args={['#111018', 5, 20]}
      />
      {/* <ambientLight
        intensity={0.1}
        ref={lightRef1}
      /> */}
      <Sphere
        args={[0.1]}
        ref={sphereRef1}
      >
        <meshBasicMaterial
          color={[1.2, 1.2, 0.6]}
          toneMapped={false}
        />
        <pointLight intensity={0.05} />
      </Sphere>
      <EffectComposer layers={[0]}>
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          intensity={5}
          radius={0.72}
          layers={[0]}
        />
      </EffectComposer>
    </Canvas>
  )
}

export default HeroCanvas

function Scene({ isMouseInside, mousePosition }) {
  const { scene, viewport, camera } = useThree()

  const colorsArray = [0xc261fe, 0x5a82f9, 0x09a9b8]

  let pointLightRef = useRef(null)
  let modelRef = useRef(null)
  let mainSceneGroupRef = useRef(null)
  let movingSpotLightGroup = useRef(null)
  let lightRef1 = useRef()
  let sphereRef1 = useRef()

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

  // useFrame(() => {
  //   sphereRef1.current.position.setX(mousePosition.x)
  //   sphereRef1.current.position.setY(mousePosition.y)
  // })

  const layersCustom = new THREE.Layers()

  // Assign a unique layer index to your volumetric spotlight
  const volumetricSpotlightLayer = 1
  layersCustom.set(volumetricSpotlightLayer)

  return (
    <>
      <group
        ref={mainSceneGroupRef}
        //leave on new line
        // rotation={[0, 0, 0.15]}
        layers={layersCustom}
      >
        {/* <OrbitControls /> */}

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
          ref={movingSpotLightGroup}
        >
          <MovingSpot
            // color="#7b53d3"
            // color="#b00c3f"
            // color="#0c8cbf"
            // color={[0.1, 0.3, 0.6]}
            position={[3, 3, 2]}
            // position={[3, 3, 3]}
            // position={[4, 1, 4]}
            mousePosition={mousePosition}
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <MovingSpot
            // color="#7b53d3"
            // color="#0c8cbf"
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
          <planeGeometry args={[50, 50]} />
          <meshStandardMaterial
          // transparent
          // opacity={0.3}
          />
        </mesh>
      </group>
    </>
  )
}

function MovingSpot({ vec = new Vector3(), mousePosition, ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)

  useFrame((state) => {
    const targetX =
      ((((mousePosition.x + 1) / 2) * (0.6 - 0.01) + 0.01) * viewport.width) / 2
    const targetY =
      (((mousePosition.y + 1) * (-0.5 + 1)) / 2 - 1) * viewport.height

    const targetZ = 2

    //try using clamp

    // const targetX = ((mousePosition.x + 1) / 2) * 0.2 * viewport.width

    // const targetY =
    //   (((mousePosition.y + 1) * (-0.2 + 0.7)) / 2 - 0.7) * viewport.height

    // const targetZ = 1

    light.current.target.position.lerp(
      vec.set(targetX / 2, targetY / 2, targetZ),
      0.1
    )

    light.current.target.updateMatrixWorld()

    console.log(light)
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
      color={[0.1, 0.1, 0.1]}
      {...props}
    />
  )
}

// {/* <ambientLight
// intensity={0.015}
// ref={ambientRef1}
// />

// <Sphere
// args={[0.5]}
// ref={sphereRef1}
// >
// <meshStandardMaterial color="hotpink" />
// </Sphere>

// <EffectComposer>
// {/* <Bloom
//       intensity={6}
//       luminanceThreshold={0}
//       luminanceSmoothing={0.9}
//       height={300}
//       opacity={3}
//     ></Bloom> */}
// <SelectiveBloom
//   lights={[ambientRef1]} // ⚠️ REQUIRED! all relevant lights
//   selection={[sphereRef1]} // selection of objects that will have bloom effect
//   selectionLayer={10} // selection layer
//   // intensity={1.0} // The bloom intensity.
//   blurPass={undefined} // A blur pass.
//   width={Resizer.AUTO_SIZE} // render width
//   height={Resizer.AUTO_SIZE} // render height
//   kernelSize={KernelSize.LARGE} // blur kernel size
//   // luminanceThreshold={0.9} // luminance threshold. Raise this value to mask out darker elements in the scene.
//   // luminanceSmoothing={0.025} // smoothness of the luminance threshold. Range is [0, 1]

//   intensity={6}
//   luminanceThreshold={0}
//   luminanceSmoothing={0.9}
// />
// </EffectComposer> */}

// {/* <OrthographicCamera
//         makeDefault
//         left={viewport.width / -2}
//         right={viewport.width / 2}
//         top={viewport.height / 2}
//         bottom={viewport.height / -2}
//         near={1}
//         far={20}
//         position={[-2, 2, 6]}
//         zoom={150}
//       /> */}
