import { useEffect, useMemo, useRef, useState } from 'react'
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
import MacbookProHW from './MacbookProHW'
import NoKeyboardV1 from './NoKeyboardV1'

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

const LaptopModelViewTesting = ({
  vec = new Vector3(),
  fullView,
  leftSide,
  setFullView,
  url,
}) => {
  const { camera } = useThree()

  // const { scene } = useGLTF('./models/model.gltf')
  // const { scene } = useGLTF('./models/down_sizing_v2.gltf')
  // const { scene } = useGLTF('./models/down_sizing_v3.gltf')
  const { scene } = useGLTF('./models/macbook-pro-HW.glb')
  // deep clone approach. Maybe replace with sharing the geometry approach described here (https://stackoverflow.com/questions/68813736/use-the-same-gltf-model-twice-in-react-three-fiber-drei-three-js)
  // const copiedScene = useMemo(() => scene.clone(), [scene])

  const boxWidth = 3
  const boxHeight = 2

  let laptopRef = useRef(null)
  let htmlRef = useRef(null)
  let directionalLightRef = useRef(null)
  let mousePos = useRef({ x: -1, y: 0.5 })
  let lookAtVector = useRef(new Vector3(-10, 0, 0))
  let boxRef = useRef(null)

  // useEffect(() => {
  //   camera.lookAt(laptopRef.current)
  // }, [camera])

  // useEffect(() => {
  //   if (laptopRef) {
  //     gsap.to(laptopRef.current.children[0].children[15].rotation, {
  //       x: 3.05,
  //       duration: 2,
  //       ease: 'back',
  //     })
  //     gsap.to(laptopRef.current.children[0].children[15].rotation, {
  //       x: 1.3105023838474816,
  //       delay: 2,
  //       duration: 3,
  //       ease: 'back',
  //       onComplete: () => {
  //         htmlRef.current.classList.remove('opacity-0')
  //         htmlRef.current.classList.add('opacity-100')
  //       },
  //     })
  //     gsap.to(boxRef.current.rotation, {
  //       x: MathUtils.degToRad(85),
  //       duration: 2,
  //       ease: 'back',
  //     })
  //     gsap.to(boxRef.current.rotation, {
  //       x: MathUtils.degToRad(-15),
  //       delay: 2,
  //       duration: 3,
  //       ease: 'back',
  //     })
  //     gsap.to(boxRef.current.material.uniforms.uOpacity, {
  //       value: 1,
  //       delay: 2.2,
  //       duration: 0.2,
  //       ease: 'power',
  //     })
  //     gsap.to(boxRef.current.material.uniforms.uOpacity, {
  //       value: 0,
  //       delay: 3,
  //       duration: 0.2,
  //       ease: 'power',
  //     })
  //     gsap.to(directionalLightRef.current, {
  //       intensity: 1,
  //       duration: 0,
  //       delay: 2.1,
  //     })
  //     gsap.to(directionalLightRef.current, {
  //       intensity: 0,
  //       duration: 1.5,
  //       delay: 2.1,
  //       ease: 'sine',
  //     })
  //     gsap.to(laptopRef.current.children[0].children[8].scale, {
  //       x: 5.796425819396973,
  //       y: 5.796425819396973,
  //       z: 5.796425819396973,
  //       delay: 2,
  //       duration: 0,
  //     })
  //   }
  // }, [laptopRef])

  useEffect(() => {
    if (laptopRef) {
      // gsap.to(laptopRef.current.children[1].rotation, {
      //   x: MathUtils.degToRad(60),
      //   duration: 2,
      //   ease: 'back',
      // })
      gsap.to(laptopRef.current.children[1].rotation, {
        x: MathUtils.degToRad(-20),
        delay: 2,
        duration: 3,
        ease: 'back',
        onComplete: () => {
          htmlRef.current.classList.remove('opacity-0')
          htmlRef.current.classList.add('opacity-100')
        },
      })
      // gsap.to(boxRef.current.rotation, {
      //   x: MathUtils.degToRad(85),
      //   duration: 2,
      //   ease: 'back',
      // })
      // gsap.to(boxRef.current.rotation, {
      //   x: MathUtils.degToRad(-15),
      //   delay: 2,
      //   duration: 3,
      //   ease: 'back',
      // })
      // gsap.to(boxRef.current.material.uniforms.uOpacity, {
      //   value: 1,
      //   delay: 2.2,
      //   duration: 0.2,
      //   ease: 'power',
      // })
      // gsap.to(boxRef.current.material.uniforms.uOpacity, {
      //   value: 0,
      //   delay: 3,
      //   duration: 0.2,
      //   ease: 'power',
      // })
      // gsap.to(directionalLightRef.current, {
      //   intensity: 1,
      //   duration: 0,
      //   delay: 2.1,
      // })
      // gsap.to(directionalLightRef.current, {
      //   intensity: 0,
      //   duration: 1.5,
      //   delay: 2.1,
      //   ease: 'sine',
      // })
      // gsap.to(laptopRef.current.children[0].children[5].scale, {
      //   x: 5.796425819396973,
      //   y: 5.796425819396973,
      //   z: 5.796425819396973,
      //   delay: 2,
      //   duration: 0,
      // })
    }
  }, [laptopRef])

  // useEffect(() => {
  //   gsap.to(laptopRef.current.position, {
  //     x: fullView ? 0 : leftSide ? 0.75 : -0.75,
  //     y: fullView ? -0.85 : -0.7,
  //     duration: 1,
  //     ease: 'power',
  //     // onUpdate: () => {
  //     //   invalidate()
  //     // },
  //   })
  //   gsap.to(camera.position, {
  //     z: fullView ? 2.5 : 5,
  //     duration: 1,
  //     ease: 'power',
  //     // onUpdate: () => {
  //     //   invalidate()
  //     // },
  //   })
  // }, [fullView, leftSide, camera])

  let oldMousePos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    function handle(event) {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      mousePos.current = { x, y }
      // invalidate()
    }

    document.addEventListener('mousemove', handle)

    return () => {
      document.removeEventListener('mousemove', handle)
    }
  }, [])

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
      )
    } else {
      lookAtVector.current.lerp(vec.set(0, -3, 10), 0.05)
      laptopRef.current.lookAt(
        lookAtVector.current.x,
        lookAtVector.current.y,
        lookAtVector.current.z
      )
    }
    console.log(laptopRef.current)
  })

  return (
    <>
      <hemisphereLight
        intensity={0.2}
        color="white"
        position={[0, 0, 0]}
      />
      <pointLight
        position={[0, 0.85, 0]}
        intensity={0.5}
        color={'#90caf9'}
      />
      <mesh
        onClick={() => {
          setFullView()
          // if (!fullView) setFullView()
        }}
      >
        <MacbookProHW
          ref={laptopRef}
          scale={0.35}
          // position={[0.65, 0, -0.4]}
          position={[0, 0, -0.4]}
        >
          {/* <Box
            args={[boxWidth, boxHeight * 2, 0.0001]}
            position={[0, 0, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            ref={boxRef}
            anchorX="bottom"
          >
            <glareShaderMaterial
              transparent
              depthTest={false}
              uColor={new Color(1.1, 1.1, 1.1)}
            />
          </Box> */}

          {/* <directionalLight
            ref={directionalLightRef}
            intensity={0}
            position={[0, 0, 0]}
          /> */}
          <mesh position={[0, 0, 0.1]}>
            <Html
              wrapperClass="laptop"
              transform
              distanceFactor={0.82}
            >
              <div
                ref={htmlRef}
                className="opacity-100 transition-opacity duration-300"
              >
                <TestSVG className="w-full h-full" />
                <iframe
                  title="iframe"
                  // src={url}
                  src="http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login"
                />
                <div className="w-[1600px] h-[800px] bg-red-900"></div>
                <img
                  src="./MacOS_Desktop_fox_wallpaper_bottombar.png"
                  className="opacity-90"
                  alt="MacOS taskbar"
                />
              </div>
            </Html>
          </mesh>
        </MacbookProHW>
      </mesh>
    </>
  )
}

export default LaptopModelViewTesting

// {/* <primitive
//           ref={laptopRef}
//           object={scene}
//           scale={0.5}
//           position={[0.75, -0.7, -0.4]}
//         >
//           <Box
//             args={[boxWidth, boxHeight * 2, 0.0001]}
//             position={[0, 1.57 - boxHeight / 2, -1.1]}
//             rotation={[Math.PI / 2, 0, 0]}
//             ref={boxRef}
//             anchorX="bottom"
//           >
//             <glareShaderMaterial
//               transparent
//               depthTest={false}
//               uColor={new Color(1.1, 1.1, 1.1)}
//             />
//           </Box>

//           <directionalLight
//             ref={directionalLightRef}
//             intensity={0}
//             position={[-1.55, 2, -0.5]}
//           />

//           <mesh
//             position={[0, 1.55, -1.4]}
//             depthTest
//             depthWrite
//           >
//             <Html
//               wrapperClass="laptop"
//               transform
//               distanceFactor={0.75}
//               rotation-x={-0.26}
//             >
//               <div
//                 ref={htmlRef}
//                 className="opacity-0 transition-opacity duration-300"
//               >
//                 <TestSVG className="w-full h-full" />
//                 <iframe
//                   title="iframe"
//                   // src={url}
//                   src="http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login"
//                 />
//                 {/* <div className="w-[1600px] h-[736px] bg-red-900"></div> */}
//                 <img
//                   src="./MacOS_Desktop_fox_wallpaper_bottombar.png"
//                   className="opacity-90"
//                   alt="MacOS taskbar"
//                 />
//               </div>
//             </Html>
//           </mesh>
//         </primitive> */}
