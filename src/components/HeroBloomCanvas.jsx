import { useEffect, useRef } from 'react'
import { Vector3, Color } from 'three'
import { useThree, useFrame, Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'

const HeroBloomCanvas = ({ mousePosition, bloomTheme }) => {
  let composerRef = useRef(null)

  return (
    <Canvas
      className="w-full h-full absolute inset-0 z-10"
      camera={{ position: [0, 0, 50], fov: 20 }}
    >
      <BloomSphere
        mousePosition={mousePosition}
        bloomTheme={bloomTheme}
      />

      <EffectComposer ref={composerRef}>
        <Bloom
          mipmapBlur
          luminanceThreshold={1}
          intensity={1}
          radius={0.85}
        />
      </EffectComposer>
    </Canvas>
  )
}

export default HeroBloomCanvas

const BloomSphere = ({ mousePosition, bloomTheme }) => {
  let bloomSphereRef = useRef(null)

  const viewport = useThree((state) => state.viewport)

  useFrame(() => {
    bloomSphereRef.current.position.lerp(
      new Vector3(
        (mousePosition.x * viewport.width) / 2,
        (mousePosition.y * viewport.height) / 2,
        0
      ),
      0.1
    )
  })

  useEffect(() => {
    console.log(bloomSphereRef.current)
    // bloomSphereRef.current.material.color.lerp(bloomTheme, 0.5)
    gsap.to(bloomSphereRef.current.material.color, {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
    console.log(bloomTheme)
  }, [bloomTheme])

  return (
    <Sphere
      position={[0, 0, 0]}
      args={[0.25]}
      ref={bloomSphereRef}
    >
      <meshBasicMaterial
        // color={new Color(0.48 * 10, 0.33 * 10, 0.83 * 10)}
        toneMapped={false}
      />
    </Sphere>
  )
}
