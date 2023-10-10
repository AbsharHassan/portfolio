import { Vector3 } from 'three'
import { useRef, useEffect, useState, useMemo } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
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
  shaderMaterial,
  Hud,
} from '@react-three/drei'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'

import V18_8 from './V18_8'

import gsap from 'gsap'
import MovingSpotLight from './MovingSpotlight'

import {
  vertexShader as heroSceneVertexShader,
  fragmentShader as heroSceneFragmentShader,
  uniforms as heroSceneUniforms,
} from '../shaders/hero-scene/heroSceneShaders'
import PostFX from '../utils/PostFX'
import { Color } from 'lamina'

const PlaneShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uSpherePos: new Vector3(-20, 0, 0),
    uTexture: new THREE.TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
    uColorPurple: new THREE.Color(0.76, 0.38, 1.0),
    // uColorPurple: new THREE.Color(5.0, 0.38, 5.0),
    uColorBlue: new THREE.Color(0.35, 0.51, 0.98),
    uColorGreen: new THREE.Color(0.04 * 1, 0.66 * 1, 0.72 * 1),
    // uColorPurple: new Color(5.0 / 10, 0.38 / 10, 5.0 / 10),
    // uColorBlue: new Color(0.35 / 10, 0.51 / 10, 0.98 / 10),
    // uColorGreen: new Color(0.04 / 10, 0.66 / 10, 0.72 / 10),
    uAspect: 2.0556744846176622,
    uOpacity: 1.0,
  },
  // Vertex Shader
  glsl`
      varying vec2 vUv;
      varying vec2 vPosition;
  
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  // Fragment Shader
  glsl`
      varying vec2 vUv;
      uniform float uAspect;
      uniform float uOpacity;
      uniform vec3 uSpherePos;
      uniform vec3 uColorPurple;
      uniform vec3 uColorBlue;
      uniform vec3 uColorGreen;
  
      uniform sampler2D uTexture;
  
      void main() {
        // vec2 aspectCorrectedUV = vUv;
        // aspectCorrectedUV.x *= uAspect;
        // // Center the texture on the adjusted UV coordinates
        // aspectCorrectedUV.x -= (1.0 - uAspect) / 2.0;
  
        vec2 p = vUv - vec2(0.5);
  
        // vec4 color = texture2D(uTexture, vUv);
        // gl_FragColor = color;
  
        vec3 color = vec3(0.0);
        // vec4 color = vec4(0.0);
  
        float d = length(p - uSpherePos.xy);
        float m = 0.01/(d);
  
        color += m;
  
        color *= uColorGreen;
        // color *= vec4(uColorGreen, 1.0);
  
        vec4 fragColor = vec4(color*1.0, pow(m, 0.5));
  
        // fragColor += vec4(color, m);
  
        gl_FragColor = fragColor * uOpacity;
        // gl_FragColor = color;

        float dimmingGradient = smoothstep(0.7, 0., abs(vUv - vec2(0.5, 0.2)).y);

        // gl_FragColor = vec4(vUv, 0.0, 1.0);
        gl_FragColor = vec4(dimmingGradient, 0.0,0.0,1.0);
      }
    `
)

extend({ PlaneShaderMaterial })

const HeroCanvas = ({ bloomTheme }) => {
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
      className="w-full h-full absolute inset-0 z-[100000000]"
      shadows={{ type: THREE.PCFShadowMap }}
      dpr={[1, 2]}
      camera={{
        position: [-2, 2, 6],
        // position: [0, 0, 8],
        fov: 50,
        near: 1,
        far: 1000,
      }}
    >
      <OrbitControls />

      {/* looks kinda good with no fog and ambient light. Test */}

      <ambientLight intensity={0.015} />

      {/* <color
        attach="background"
        args={['#111018']}
      /> */}
      {/* <fog
        attach="fog"
        args={['#111018', 5, 10]}
      /> */}

      {/* 
      <Hud>
        <fog
          attach="fog"
          args={['#0f0', 5, 10]}
        />
      </Hud> */}

      <Scene
        mousePosition={mousePosition}
        bloomTheme={bloomTheme}
      />
    </Canvas>
  )
}

export default HeroCanvas

function Scene({ mousePosition, bloomTheme }) {
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
    gsap.to(bloomLightBackground.current.color, {
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
    let zScaling = 0
    if (mousePosition.x > 0) {
      zScaling = mousePosition.x / 5
    } else {
      zScaling = mousePosition.x / 3
    }
    const distance = (-cameraPosition.z * (0.7 - zScaling)) / direction.z
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

  let mousePos = useRef({ x: 0, y: 0 })
  let delayedPos = useRef(new THREE.Vector3(-20, 0, 0))
  let prevDelayedPos = useRef(new THREE.Vector3(0, 0, 0))

  const vec = useMemo(() => {
    return new THREE.Vector3(-20, 0, 0)
  }, [])

  useEffect(() => {
    function handle(event) {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      mousePos.current = { x, y }
    }

    document.addEventListener('mousemove', handle)

    return () => {
      document.removeEventListener('mousemove', handle)
    }
  }, [])

  // useFrame((state) => {
  //   const mousePosTHREE = new THREE.Vector3(
  //     (mousePos.current.x * state.viewport.width) / 2,
  //     (mousePos.current.y * state.viewport.height) / 2,
  //     0
  //   )
  //   delayedPos.current.lerp(
  //     vec.set(mousePosTHREE.x, mousePosTHREE.y, mousePosTHREE.z),
  //     0.1
  //   )

  //   const angleVeritcal = Math.atan(delayedPos.current.y / 5)
  //   const angleHorizontal = Math.atan(delayedPos.current.x / 5)

  //   const angleTilt = delayedPos.current.clone().sub(prevDelayedPos.current).x

  //   camera.rotateX(angleVeritcal * 0.05)
  //   camera.rotateY(-angleHorizontal * 0.01)
  //   camera.rotateZ(angleTilt * 0.02)

  //   const totalAngle = Math.abs(angleVeritcal) + Math.abs(angleHorizontal)

  //   // camera.position.z = 5 + totalAngle * 0.01

  //   // console.log(prevDelayedPos)

  //   prevDelayedPos.current = delayedPos.current.clone()
  // })

  return (
    <>
      <OrbitControls />

      <pointLight
        ref={bloomLightBackground}
        intensity={3}
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
            // color="#0c8cbf"
            color="red"
            // color={[0.1, 0.3, 0.6]}
            // position={[3, 3, 2]}
            //this one

            position={[3, 3, 2]}
            // position={[3, 3, 3]}
            // position={[4, 1, 4]}
            mousePosition={mousePosition}
            castShadow
            shadow-mapSize={[512, 512]}
          />
          <MovingSpotLight
            // color="#7b53d3"
            // color="#0c8cbf"
            color="red"
            // color={[0.1, 0.3, 0.6]}
            // color="#fff"
            // color="#b00c3f"
            // position={[2, 3, 0]}
            //this one
            position={[1.5, 3, 1.5]}
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
            color="#777"
            transparent
            opacity={1}
          />
        </mesh>
      </group>
      <Effect />
    </>
  )
}

const Effect = () => {
  const { gl, scene, camera } = useThree()

  const renderer = useMemo(() => {
    return new PostFX(
      gl,
      heroSceneVertexShader,
      heroSceneFragmentShader,
      heroSceneUniforms
    )
  }, [gl])

  useEffect(() => {
    return () => {
      renderer?.dispose()
    }
  }, [renderer])

  return useFrame(() => {
    renderer.render(scene, camera)
  }, 1)
}
