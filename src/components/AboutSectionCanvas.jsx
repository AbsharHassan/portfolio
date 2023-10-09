import { RenderTexture, Text } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useMemo, useRef, useState } from 'react'

import gsap from 'gsap'
import {
  vertexShader as aboutTextVertexShader,
  fragmentShader as aboutTextFragmentShader,
  uniforms as aboutTextUniforms,
} from '../shaders/about-text/aboutTextShaders'

import PostFX from '../utils/PostFX'
import RipplesTexture from './RipplesTexture'

const AboutSectionCanvas = ({ isVisible, parentContainer, mousePosition }) => {
  let textTexture = useRef(null)

  const [ripplesTex, setRipplesTex] = useState(null)

  return (
    <Canvas className="">
      <Effect
        ripplesTex={ripplesTex}
        isVisible={isVisible}
      />

      <TextScene isVisible={isVisible} />

      <RenderTexture ref={setRipplesTex}>
        <RipplesTexture
          parentContainer={parentContainer}
          mousePositionProp={mousePosition}
        />
      </RenderTexture>
    </Canvas>
  )
}

export default AboutSectionCanvas

const Effect = ({
  isParticleModelVisible,
  isServiceVisible,
  fParticlesTexture,
  ripplesTex,
  dimBackground,
  isVisible,
}) => {
  const { gl, scene, camera } = useThree()

  let aniVal = 0.5

  const renderer = useMemo(() => {
    return new PostFX(
      gl,
      aboutTextVertexShader,
      aboutTextFragmentShader,
      aboutTextUniforms
    )
  }, [gl])

  let opacityAnimation = useRef(null)
  let animationProgress = useRef(aniVal)
  let opacity = useRef(0)

  // useEffect(() => {
  //   opacityAnimation.current?.kill()

  //   opacityAnimation.current = gsap.to(opacity, {
  //     delay: isParticleModelVisible ? 1 : 0,
  //     current: isParticleModelVisible ? 1 : 0,
  //     duration: 2,
  //   })
  // }, [isParticleModelVisible])

  //   useEffect(() => {
  //     console.log(dimBackground)
  //     opacityAnimation.current?.kill()

  //     opacityAnimation.current = gsap.to(opacity, {
  //       current: !dimBackground ? 1 : 0.5,
  //       duration: 2,
  //     })
  //   }, [dimBackground])

  //   useEffect(() => {
  //     gsap.to(animationProgress, {
  //       current: isServiceVisible ? 1 : 0,
  //       duration: 2,
  //     })
  //   }, [isServiceVisible])
  let textRef = useRef(null)

  // useEffect(() => {
  //   let counter = 0
  //   let interval = setInterval(() => {
  //     console.log('running intercal')
  //     gsap.to(animationProgress, {
  //       current: animationProgress.current === aniVal ? 0 : aniVal,
  //       duration: 2,
  //     })
  //     gsap.to(opacity, {
  //       current: opacity.current === 1 ? 0 : 1,
  //       duration: 2,
  //     })
  //     // gsap.to()
  //   }, 5000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  useEffect(() => {
    console.log(isVisible)
    gsap.to(animationProgress, {
      current: isVisible ? 0 : aniVal,
      duration: 2,
    })
    gsap.to(opacity, {
      current: !isVisible ? 0 : 0.9,
      // delay: 1,
      // duration: !isVisible ? 2 : 4,
      duration: 4,
    })
  }, [isVisible])

  return useFrame((state) => {
    renderer.render(
      scene,
      null,
      camera,
      ripplesTex,
      state.clock.getElapsedTime(),
      animationProgress.current,
      opacity.current,
      1,
      0,
      0,
      0,
      0
    )
  }, 1)
}

const TextScene = ({ isVisible }) => {
  let textRef = useRef(null)

  useEffect(() => {
    // console.log(textRef)
    gsap.to(textRef.current, {
      color: isVisible ? '#ccccff' : '#64748b',
      duration: 2,
    })
  }, [isVisible])

  return (
    <>
      <pointLight
        position={[0, 5, 5]}
        intensity={3}
      />
      {/* <color
        attach="background"
        args={['#111018']}
      /> */}
      <Suspense>
        <Text
          font={'./assets/fonts/Inter/Inter-Regular.ttf'}
          maxWidth={48}
          // maxWidth={46}
          fontSize={0.9}
          anchorX="center"
          anchorY="middle"
          lineHeight={1.2}
          textAlign="center"
          // color="#64748b"
          // color="#94a3b8"
          color="#ccccff"
          ref={textRef}
        >
          <meshStandardMaterial roughness={10} />
          Motivated and innovative web developer with a strong foundation in
          full-stack development, gained through hands-on experience in creating
          bespoke and complex applications from concept to deployment. Adept at
          utilizing cutting-edge technologies such as MERN Stack, Laravel, Vue,
          MySQL to develop robust and user-centric web solutions. I have
          successfully developed and deployed projects ranging from student
          information management systems to real-time flood tracking
          applications. My ability to conceptualize, design, and execute
          projects independently, coupled with a strong dedication to continuous
          learning, makes me a motivated and adaptable candidate ready to
        </Text>
      </Suspense>
    </>
  )
}
