import { useEffect, useMemo, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import PostFX from '../utils/PostFX'

import {
  vertexShader as pixelRiverVextexShader,
  fragmentShader as pixelRiverFragmentShader,
  uniforms as pixelRiverUniforms,
} from '../shaders/pixel-river-distortion/pixelRiverShaders'

const Effect = ({
  isHeroVisible,
  isServiceVisible,
  isContactVisible,
  fParticlesTexture,
  ripplesTexture,
  dimBackground,
}) => {
  const { gl, scene, camera } = useThree()

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
      fParticlesTexture,
      camera,
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

export default Effect
