import { useEffect, useRef, useState } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import {
  Box,
  Html,
  Plane,
  useGLTF,
  shaderMaterial,
  Float,
  Sphere,
} from '@react-three/drei'
import gsap from 'gsap'
import { ReactComponent as TestSVG } from '../assets/MacOS_Chrome_Header_1700.svg'
import {
  Color,
  Vector3,
  MathUtils,
  Quaternion,
  DirectionalLightHelper,
  Object3D,
} from 'three'
import glsl from 'babel-plugin-glsl/macro'

const GlareShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uColor: new Color(2.0, 0.38, 2.0),
    uOpacity: 0,
  },
  // Vertex Shader
  glsl`
    varying vec2 vUv;
    
    void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    varying vec2 vUv;
    uniform vec3 uColor;
    uniform float uOpacity;

    void main() {
      gl_FragColor = vec4(uColor*1.0, step(0.5, vUv.y)*uOpacity);
    }
  `
)

extend({ GlareShaderMaterial })

const TestLaptop = ({ vec = new Vector3(), fullView }) => {
  const { camera, scene } = useThree()

  const laptop = useGLTF('./models/model.gltf')

  const boxWidth = 3
  const boxHeight = 2

  const [cameraView, setCameraView] = useState(false)

  let laptopRef = useRef(null)
  let htmlRef = useRef(null)
  let directionalLightRef = useRef(null)
  let mousePos = useRef({ x: -1, y: 0.5 })
  let lookAtVector = useRef(new Vector3(-10, 0, 0))
  let boxRef = useRef(null)

  useEffect(() => {
    console.log(camera)
    camera.lookAt(laptopRef.current)
  }, [camera])

  useEffect(() => {
    if (laptopRef) {
      gsap.to(laptopRef.current.children[0].children[15].rotation, {
        // x: 1.3105023838474816,
        x: 3.05,
        // x: Math.PI / 2,
        duration: 2,
        ease: 'back',
      })
      gsap.to(laptopRef.current.children[0].children[15].rotation, {
        x: 1.3105023838474816,
        // x: Math.PI / 2,
        // delay: 0,
        // duration: 0,
        delay: 2,
        duration: 3,
        ease: 'back',
        onComplete: () => {
          htmlRef.current.classList.remove('opacity-0')
          htmlRef.current.classList.add('opacity-100')
        },
      })
      gsap.to(boxRef.current.rotation, {
        // x: 1.3105023838474816,
        x: MathUtils.degToRad(85),
        duration: 2,
        ease: 'back',
      })
      gsap.to(boxRef.current.rotation, {
        // x: 1.3105023838474816,
        x: MathUtils.degToRad(-15),
        delay: 2,
        duration: 3,
        ease: 'back',
      })
      gsap.to(boxRef.current.material.uniforms.uOpacity, {
        value: 1,
        delay: 2.2,
        duration: 0.2,
        ease: 'power',
      })
      gsap.to(boxRef.current.material.uniforms.uOpacity, {
        value: 0,
        delay: 3,
        duration: 0.2,
        ease: 'power',
      })
      gsap.to(directionalLightRef.current, {
        intensity: 1,
        duration: 0,
        delay: 2.1,
      })
      gsap.to(directionalLightRef.current, {
        intensity: 0,
        duration: 1.5,
        delay: 2.1,
        ease: 'sine',
      })
      gsap.to(laptopRef.current.children[0].children[8].scale, {
        x: 5.796425819396973,
        y: 5.796425819396973,
        z: 5.796425819396973,
        delay: 2,
        duration: 0,
      })
    }
  }, [laptopRef])

  useEffect(() => {
    if (fullView) {
      gsap.to(laptopRef.current.position, {
        x: 0,
        y: -0.85,
        duration: 1,
        ease: 'power',
      })
      gsap.to(camera.position, {
        z: 2.5,
        duration: 1,
        ease: 'power',
      })
    } else {
      gsap.to(laptopRef.current.position, {
        x: 0.75,
        y: -0.7,
        duration: 1,
        ease: 'power',
      })
      gsap.to(camera.position, {
        z: 5,
        duration: 1,
        ease: 'power',
      })
    }
  }, [fullView])

  useEffect(() => {
    function handle(event) {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      mousePos.current = { x, y }
    }

    document.addEventListener('mousemove', handle)

    document.addEventListener('dblclick', () => {
      setCameraView((v) => !v)
    })

    return () => {
      document.removeEventListener('mousemove', handle)
    }
  }, [])

  // useEffect(() => {
  //   if (cameraView) {
  //     laptopRef.current.lookAt(0, -2, 5)
  //   }
  // }, [cameraView])

  let cameraLookAtVector = useRef(new Vector3(0, 0, 0))

  useFrame(() => {
    if (!fullView) {
      lookAtVector.current.lerp(
        vec.set(mousePos.current.x * 3, mousePos.current.y - 3, 10),
        0.05
      )
      laptopRef.current.lookAt(
        lookAtVector.current.x,
        lookAtVector.current.y,
        lookAtVector.current.z
        // mousePos.current.x * 3,
        // mousePos.current.y - 3,
        // 10
      )
    } else {
      lookAtVector.current.lerp(vec.set(0, -3, 10), 0.05)
      laptopRef.current.lookAt(
        lookAtVector.current.x,
        lookAtVector.current.y,
        lookAtVector.current.z
      )
      // cameraLookAtVector.current.lerp(vec.set(0, 1, 10), 0.05)
      // camera.lookAt(
      //   cameraLookAtVector.current.x,
      //   cameraLookAtVector.current.y,
      //   cameraLookAtVector.current.z
      // )
    }
    // camera.lookAt(new Vector3(0, -1, -1))
    // camera.translateZ(0.1)
    // camera.lookAt()
    // camera.position.set(0, 0, 3)
    // camera.lookAt(new Vector3(0, 0.5, -10))
    // laptopRef.current.position.setX(laptopRef.current.position.x + 0.01)
  })
  let directionalLightRef2 = useRef(null)

  // const dummy = new Object3D()
  // dummy.position.set([1, -0.15, 0.1])
  // scene.add(dummy)

  // useEffect(() => {
  //   if (directionalLightRef?.current) {
  //     // console.log(())

  //     // directionalLightRef.current.target = dummy
  //     const helper = new DirectionalLightHelper(
  //       directionalLightRef.current,
  //       0.1
  //     )
  //     scene.add(helper)
  //     console.log(directionalLightRef.current.target)
  //   }
  // }, [directionalLightRef])

  // useEffect(() => {
  //   if (directionalLightRef2?.current) {
  //     const helper2 = new DirectionalLightHelper(
  //       directionalLightRef2.current,
  //       0.1
  //     )
  //     scene.add(helper2)
  //     console.log(directionalLightRef2.current.target)
  //   }
  // }, [directionalLightRef2])

  // log
  return (
    <>
      {/* <directionalLight
        ref={directionalLightRef2}
        intensity={100}
        // target={laptop.scene.}
        // color={new Color(10, 10, 10)}
        position={[0.75, 0, 0]}
      /> */}
      {/* <Sphere
        args={[0.1]}
        position={[0.75, 0, 0]}
      />
      <Sphere
        args={[0.1]}
        position={[0, 0, 0]}
      >
        <meshBasicMaterial color="red" />
      </Sphere> */}
      {/* <Sphere
        args={[0.05]}
        position={[1, -0.15, 0.1]}
      /> */}
      <primitive
        ref={laptopRef}
        object={laptop.scene}
        scale={0.5}
        // position-y={-0.3}
        position={[0.75, -0.7, -0.4]}

        // rotation-x={0.26}
        // rotation={[0.26, -0.26, 0]}
        // rotation-y={-0.35}
        // rotation-x={0.05}
        // position-y={-1.7}
        // rotation-x={0.26}
        // position-z={-1}
      >
        <Box
          args={[boxWidth, boxHeight * 2, 0.0001]}
          // position={[
          //   0,
          //   1.57 - (boxHeight * Math.cos(someAngle)) / 2,
          //   -1.114 + (boxHeight * Math.sin(someAngle)) / 2,
          // ]}
          position={[0, 1.57 - boxHeight / 2, -1.1]}
          rotation={[Math.PI / 2, 0, 0]}
          // rotateOnAxis={(new Vector3(1, 1, 0), 1.3)}
          ref={boxRef}
          anchorX="bottom"
        >
          <glareShaderMaterial
            transparent
            depthTest={false}
            uColor={new Color(1.1, 1.1, 1.1)}
          />
        </Box>

        {/* <directionalLight
          ref={directionalLightRef}
          intensity={1}
          // target={laptop.scene.}
          // color={new Color(10, 10, 10)}
          position={[0, 1.6, 0]}
        />
        <Sphere
          args={[0.1]}
          position={[0, 1.6, 0]}
        />
        <Sphere
          args={[0.1]}
          position={[0, 0, 0]}
        /> */}

        <directionalLight
          ref={directionalLightRef}
          intensity={0}
          // target={laptop.scene.}
          // color={new Color(10, 10, 10)}
          // position={[-1.5, 2, -0.5]}
          position={[-1.55, 2, -0.5]}
          // target={new Object3D()}
        />

        {/* <Sphere
          args={[0.1]}
          position={[0, 0, 0]}
        /> */}

        <mesh position={[0, 1.55, -1.4]}>
          <Html
            // calculatePosition={}
            wrapperClass="laptop"
            transform
            // position={[0, 1.55, 0]}
            // distanceFactor={0.78}
            distanceFactor={0.75}
            // scale={0.075}
            rotation-x={-0.26}
            // zIndexRange={[0, 1]}
            // occlude="blending"
            // occlude
          >
            <div
              ref={htmlRef}
              className="opacity-0 transition-opacity duration-300"
            >
              <TestSVG className="w-full h-full" />
              <iframe
                title="iframe"
                src="https://flood-tracker.onrender.com/"
                // src="http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login"
              />
              {/* <div className="w-[1600px] h-[736px] bg-red-900"></div> */}
              <img
                src="./MacOS_Desktop_fox_wallpaper_bottombar.png"
                className="opacity-90"
                alt="MacOS taskbar"
              />
            </div>
          </Html>
        </mesh>
      </primitive>
    </>
  )
}

export default TestLaptop
