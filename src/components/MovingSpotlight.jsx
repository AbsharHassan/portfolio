import { Vector3 } from 'three'
import { useRef, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, SpotLight, useDepthBuffer, Box } from '@react-three/drei'
import * as THREE from 'three'
import V15 from './V15'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

export default function MovingSpotlight() {
  return (
    <Canvas
      className="w-full h-full"
      shadows
      dpr={[1, 2]}
      camera={{ fov: 50, near: 1, far: 20 }}
    >
      {/* position: [-2, 2, 6], */}
      <color
        attach="background"
        args={['#090909']}
      />
      <fog
        attach="fog"
        args={['#090909', 5, 20]}
      />
      <ambientLight intensity={0.015} />
      <Scene />
    </Canvas>
  )
}

function Scene() {
  // This is a super cheap depth buffer that only renders once (frames: 1 is optional!), which works well for static scenes
  // Spots can optionally use that for realism, learn about soft particles here: http://john-chapman-graphics.blogspot.com/2013/01/good-enough-volumetrics-for-spotlights.html
  const depthBuffer = useDepthBuffer({ frames: 1 })
  //   const { nodes, materials } = useGLTF(
  //     'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/dragon/model.gltf'
  //   )

  const { scene } = useThree()

  useEffect(() => {
    RectAreaLightUniformsLib.init()

    const rectLight = new THREE.RectAreaLight('red', 15, 2.5, 1)
    rectLight.position.set(0, 1, -20)
    rectLight.lookAt(0, 0, 10000)
    scene.add(rectLight)
    scene.add(new RectAreaLightHelper(rectLight))
  }, [])
  return (
    <>
      {/* <pointLight
        position={[3, 3, 2]}
        intensity={1}
        castShadow
      /> */}
      <MovingSpot
        // depthBuffer={depthBuffer}
        color="#7b53d3"
        position={[3, 3, 2]}
      />
      <MovingSpot
        // depthBuffer={depthBuffer}
        color="#7b53d3"
        // color="#0c8cbf"
        position={[1, 3, 0]}
      />
      {/* <mesh
        position={[0, -1.03, 0]}
        castShadow
        receiveShadow
        geometry={nodes.dragon.geometry}
        material={materials['Default OBJ.001']}
        dispose={null}
      /> */}
      <V15
        position={[0, -1.15, 1]}
        scale={0.5}
      />
      {/* <Box
        args={[0.5, 0.5, 0.5]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="red" />
      </Box> */}
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

function MovingSpot({ vec = new Vector3(), ...props }) {
  const light = useRef()
  const viewport = useThree((state) => state.viewport)
  useFrame((state) => {
    light.current.target.position.lerp(
      vec.set(
        (state.mouse.x * viewport.width) / 2,
        (state.mouse.y * viewport.height) / 2,
        0
      ),
      0.1
    )
    light.current.target.updateMatrixWorld()
  })
  return (
    <SpotLight
      castShadow
      ref={light}
      penumbra={1}
      distance={6}
      angle={0.35}
      attenuation={5}
      anglePower={4}
      intensity={20}
      {...props}
    />
  )
}
