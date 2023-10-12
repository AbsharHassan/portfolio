import { useState, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  Html,
  OrbitControls,
  PerformanceMonitor,
  PerspectiveCamera,
  RenderTexture,
  Sphere,
  Text,
  View,
  Hud,
} from '@react-three/drei'

import * as THREE from 'three'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import PostFX from '../utils/PostFX'

import ParticleModelMesh from './ParticleModelMesh'
import FloatingWordParticles from './FloatingWordParticles'
import RipplesTexture from './RipplesTexture'

import {
  vertexShader as pixelRiverVextexShader,
  fragmentShader as pixelRiverFragmentShader,
  uniforms as pixelRiverUniforms,
} from '../shaders/pixel-river-distortion/pixelRiverShaders'
import LaptopModelViewTesting from './LaptopModelViewTesting'
import BloomSphere from './BloomCanvas'
import BloomCircle from './BloomCircle'
import HeroCanvas from './HeroCanvas'
import { useSelector } from 'react-redux'
import MovingSpotLight from './MovingSpotlight'
import V18_8 from './V18_8'
import FloatingWordParticlesTesting from './FloatingWordParticlesTesting'
import useWindowResize from '../utils/useWindowResize'
import BloomCircleTesting from './old_useless_backups/BloomCircleTesting'

gsap.registerPlugin(ScrollTrigger)

const BackgroundCanvas = ({
  isHeroVisible,
  isContactVisible,
  isServiceVisible,
  isAboutVisible,
  isToolsetVisible,
  aboutContainerRef,
  checkModelRotation,
  dimBackground,
  dummyHeadingRef,
  contactContainerRef,
  view1,
  eventSource,
  track1,
}) => {
  let containerRef = useRef(null)

  const { bloomTheme } = useSelector((state) => state.threeStore)

  const windowSize = useWindowResize()

  const [refresh, setRefresh] = useState(false)

  const [modelShouldRotate, setModelShouldRotate] = useState(false)
  const [fParticlesTexture, setFParticlesTexture] = useState(null)
  const [ripplesTexture, setRipplesTexture] = useState(null)
  const [renderRipples, setRenderRipples] = useState(window.innerWidth > 640)

  return (
    <div
      className="w-full h-screen fixed inset-0 z-[-50]
        "
      ref={containerRef}
    >
      <Canvas
        camera={{ fov: 10, near: 0.0001 }}
        dpr={[1, 2]}
      >
        {/* <PerformanceMonitor
          onIncline={() => console.log('incline')}
          onDecline={() => console.log('on the downfall')}
        /> */}

        {/* <OrbitControls /> */}

        {/* <FloatingWordParticlesTesting
          isContactVisible={isContactVisible}
          isServiceVisible={isServiceVisible}
          contactContainerRef={contactContainerRef}
          dummyHeadingRef={dummyHeadingRef}
        /> */}

        <Effect
          isHeroVisible={isHeroVisible}
          isServiceVisible={isServiceVisible}
          isContactVisible={isContactVisible}
          fParticlesTexture={fParticlesTexture}
          ripplesTexture={ripplesTexture}
          dimBackground={dimBackground}
          setRenderRipples={(value) => {
            setRenderRipples(value)
          }}
        />

        <ParticleModelMesh
          // modelShouldRotate={modelShouldRotate}
          // isParticleModelVisible={isHeroVisible}
          isHeroVisible={isHeroVisible}
          modelShouldRotate={true}
          isToolsetVisible={isToolsetVisible}
          isServiceVisible={isServiceVisible}
          checkModelRotation={checkModelRotation}
          isAboutVisible={isAboutVisible}
          aboutContainerRef={aboutContainerRef}
        />

        <Hud renderPriority={1000}>
          <FloatingWordParticles
            isHeroVisible={isHeroVisible}
            isContactVisible={isContactVisible}
            isServiceVisible={isServiceVisible}
            contactContainerRef={contactContainerRef}
            dummyHeadingRef={dummyHeadingRef}
          />
        </Hud>

        <BloomCircle isHeroVisible={isHeroVisible} />

        {/* {!refresh && (
          <BloomCircle
            isHeroVisible={isHeroVisible}
            key={windowSize.width}
          />
        )} */}

        {/* <OrbitControls />

        <BloomCircleTesting /> */}

        {isServiceVisible && renderRipples && (
          <RenderTexture ref={setRipplesTexture}>
            <RipplesTexture parentContainer={null} />
          </RenderTexture>
        )}

        {/* <RenderTexture ref={setFParticlesTexture}>
          <FloatingWordParticles
            isContactVisible={isContactVisible}
            isServiceVisible={isServiceVisible}
            contactContainerRef={contactContainerRef}
            dummyHeadingRef={dummyHeadingRef}
          />
          <BloomCircle />
        </RenderTexture> */}
      </Canvas>
    </div>
  )
}

export default BackgroundCanvas

const Effect = ({
  isHeroVisible,
  isServiceVisible,
  isContactVisible,
  fParticlesTexture,
  ripplesTexture,
  dimBackground,
  setRenderRipples,
}) => {
  const { gl, scene, camera, viewport } = useThree()

  const renderer = useMemo(() => {
    return new PostFX(
      gl,
      pixelRiverVextexShader,
      pixelRiverFragmentShader,
      pixelRiverUniforms
    )
  }, [gl])

  let scale = useRef(0)
  let mixX = useRef(0.15)
  let timeFactor = useRef(0.01)
  let animationProgress = useRef(0)
  let modelBrightness = useRef(1)
  let dimmingMix = useRef(0)
  let particleBrightness = useRef(1)
  let modelRipplesMix = useRef(1)
  let particleRipplesMix = useRef(1)

  useEffect(() => {
    return () => {
      renderer?.dispose()
    }
  }, [])

  useEffect(() => {
    setRenderRipples(viewport.width > 1)
  }, [viewport])

  useEffect(() => {
    // gsap.to(modelBrightness, {
    //   delay: isHeroVisible ? 0 : 1,
    //   current: isHeroVisible ? 0 : 1,
    //   duration: 1,
    // })

    gsap.to(dimmingMix, {
      current: isHeroVisible ? 0 : 1,
      duration: 1,
    })

    gsap.to(particleBrightness, {
      delay: isHeroVisible ? 0 : 1,
      current: isHeroVisible ? 0 : 1,
      duration: 1,
    })
  }, [isHeroVisible])

  useEffect(() => {
    gsap.to(modelBrightness, {
      current: dimBackground ? 0.2 : 1,
      duration: 0.5,
    })
    gsap.to(particleBrightness, {
      current: dimBackground ? 0.2 : 1,
      duration: 0.5,
    })
  }, [dimBackground])

  useEffect(() => {
    gsap.to(animationProgress, {
      current: isServiceVisible ? 1 : 0,
      duration: 2,
    })
  }, [isServiceVisible])

  useEffect(() => {
    gsap.to(modelBrightness, {
      current: isContactVisible ? 0.3 : 1,
      duration: 0.5,
    })
    gsap.to(particleBrightness, {
      current: isContactVisible ? 3 : 1,
      duration: 1,
    })
    gsap.to(particleRipplesMix, {
      current: isContactVisible ? 0 : 1,
      duration: 1,
    })
  }, [isContactVisible])

  useEffect(() => {
    gsap.to(scale, {
      current: 2.0,
      duration: 10,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    gsap.to(mixX, {
      current: 0.45,
      duration: 7.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
  }, [])

  return useFrame((state) => {
    renderer.render(
      scene,
      camera,
      fParticlesTexture,
      ripplesTexture,
      state.clock.getElapsedTime(),
      animationProgress.current,
      scale.current,
      mixX.current,
      modelBrightness.current,
      particleBrightness.current,
      modelRipplesMix.current,
      particleRipplesMix.current,
      dimmingMix.current
    )

    renderer.material.uniforms.uDisplacement.value = ripplesTexture
    renderer.material.uniforms.uTime.value = state.clock.getElapsedTime()
    renderer.material.uniforms.uScale.value = scale
    renderer.material.uniforms.uMixX.value = mixX.current
    renderer.material.uniforms.uAnimationProgress.value =
      animationProgress.current
    renderer.material.uniforms.uModelBrightness.value = modelBrightness.current
    renderer.material.uniforms.uParticleBrightness.value =
      particleBrightness.current
    renderer.material.uniforms.uModelRipplesMix.value = modelRipplesMix.current
    renderer.material.uniforms.uParticleRipplesMix.value =
      particleRipplesMix.current
    renderer.material.uniforms.uDimmingMix.value = dimmingMix.current
  }, 1)
}
