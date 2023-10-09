import { useEffect, useRef } from 'react'
import { extend, useFrame, useThree } from '@react-three/fiber'
import { Html, shaderMaterial } from '@react-three/drei'
import gsap from 'gsap'
import { ReactComponent as TestSVG } from '../assets/MacOS_Chrome_Header_1700.svg'
import { Color, Vector3, MathUtils } from 'three'
import glsl from 'babel-plugin-glsl/macro'
import MacbookProHW from './MacbookProHW'

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

const LaptopModel = ({
  vec = new Vector3(),
  fullView,
  leftSide,
  setFullView,
  url,
  inView,
  index,
}) => {
  const { camera, invalidate } = useThree()

  let laptopRef = useRef(null)
  let htmlRef = useRef(null)
  let mousePos = useRef({ x: -1, y: 0.5 })
  let lookAtVector = useRef(new Vector3(-10, 0, 0))

  let forceLoop = useRef(null)

  // const forceInvalidate = () => {
  //   invalidate()
  //   requestAnimationFrame(() => forceInvalidate())
  // }

  // useEffect(() => {
  //   if (inView) {
  //     forceLoop.current = requestAnimationFrame(() => forceInvalidate())
  //     console.log(forceLoop)
  //   } else {
  //     cancelAnimationFrame(forceLoop.current)
  //   }
  // }, [inView])

  useEffect(() => {
    console.log(url)
  }, [url])

  useEffect(() => {
    if (inView && laptopRef) {
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
    }
  }, [inView])

  useEffect(() => {
    gsap.to(laptopRef.current.position, {
      x: fullView ? 0 : leftSide ? 0.75 : -0.75,
      y: fullView ? -0.15 : 0,
      z: fullView ? 1.4 : -0.4,
      duration: 1,
      ease: 'power',
    })
    // gsap.to(camera.position, {
    //   z: fullView ? 2.5 : 4,
    //   duration: 1,
    //   ease: 'power',
    // })
  }, [fullView, leftSide, camera])

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
  })

  useEffect(() => {
    console.log(url)
  }, [url])

  return (
    <mesh
      //this is a comment
      visible={inView}
    >
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
          position={[0.75, 0, -0.4]}
        >
          <mesh
            position={[0, 0, 0.1]}
            // visible={inView}
          >
            <Html
              wrapperClass="laptop"
              transform
              distanceFactor={0.815}
              // visible={inView}
            >
              <div
                ref={htmlRef}
                className="opacity-0 transition-opacity duration-300"
              >
                <TestSVG className="w-full h-full" />
                <iframe
                  title="iframe"
                  src={url}
                  // src="http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login"
                />
                {/* <div className="w-[1600px] h-[800px] bg-red-900"></div> */}
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
    </mesh>
  )
}

export default LaptopModel
