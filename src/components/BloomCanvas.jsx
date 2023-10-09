import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useThree, useFrame, Canvas } from '@react-three/fiber'
import { Sphere } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { useSelector, useDispatch } from 'react-redux'
import { toggleBloomTheme } from '../features/three/threeSlice'

const BloomCanvas = ({ isHeroFullVisible }) => {
  return (
    <div className={`w-full h-screen fixed top-0 z-[-10]`}>
      <Canvas
        className="w-full h-screen"
        // camera={{ position: [0, 0, 50], fov: 20 }}
        camera={{ fov: 10 }}
      >
        <BloomSphere isHeroFullVisible={isHeroFullVisible} />
      </Canvas>
    </div>
  )
}

const BloomSphere = ({ vec = new Vector3(), isHeroFullVisible }) => {
  const viewport = useThree((state) => state.viewport)

  const dispatch = useDispatch()
  const { bloomTheme } = useSelector((state) => state.threeStore)

  let bloomSphereRef = useRef(null)
  let mousePos = useRef({ x: 0, y: 0 })
  let sphereVelocity = useRef(new Vector3(0, 0, 0))

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

  useEffect(() => {
    gsap.to(bloomSphereRef.current.material.color, {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
  }, [bloomTheme])

  useEffect(() => {
    console.log(isHeroFullVisible)
    gsap.to(bloomSphereRef.current.material, {
      opacity: isHeroFullVisible ? 1 : 0,
      duration: 1,
    })
  }, [isHeroFullVisible])

  // https://www.youtube.com/watch?v=V8GnInBUMLo&t=1984s&ab_channel=ConorBailey

  useFrame((state) => {
    // bloomSphereRef.current.position.lerp(
    //   new Vector3(
    //     (mousePos.current.x * viewport.width) / 2,
    //     (mousePos.current.y * viewport.height) / 2,
    //     0
    //   ),
    //   0.1
    // )

    const directionToTarget = vec
      .set(
        (mousePos.current.x * viewport.width) / 2,
        (mousePos.current.y * viewport.height) / 2,
        0
      )
      .sub(bloomSphereRef.current.position.clone())

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = sphereVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    bloomSphereRef.current.position.add(sphereVelocity.current)

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    const normalizedMouse = bloomSphereRef.current.position.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.width / 2)) * 0.5
  })

  return (
    <>
      <Sphere
        visible={true}
        position={[0, 0, 0]}
        args={[0.01]}
        ref={bloomSphereRef}
        onClick={() => {
          dispatch(toggleBloomTheme())
        }}
      >
        <meshBasicMaterial
          // color={new Color(0.48 * 10, 0.33 * 10, 0.83 * 10)}
          toneMapped={false}
          transparent
          opacity={1}
          // color={new Color(0.04, 0.66, 0.72)}
        />
      </Sphere>
      <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0}
          intensity={10.42}
          radius={0.7}
        />
      </EffectComposer>
    </>
  )
}
export default BloomSphere
