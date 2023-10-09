import { useState, useEffect, useRef, useMemo } from 'react'
import {
  CylinderGeometry,
  InstancedBufferAttribute,
  MathUtils,
  Vector3,
} from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import gsap from 'gsap'

import {
  uniforms,
  vertexShader,
  fragmentShader,
} from '../shaders/floating-random-particles/floatingRandomParticlesShaders'

const FloatingRandomParticles = ({ isContactVisible, isServiceVisible }) => {
  const { viewport } = useThree()
  const { nodes } = useGLTF('./models/v3_Get_In_Touch.glb')

  const textGeo = useMemo(() => {
    const geometry = nodes.Text.geometry
    return geometry
  }, [nodes])

  const cylinderGeo = useMemo(() => {
    const geometry = new CylinderGeometry(
      viewport.width / 2 + 0.1,
      viewport.width / 2 + 0.1,
      viewport.height * 2,
      50,
      50
    )
    return geometry
  }, [viewport])

  const vec3Lerp = useMemo(() => {
    return new Vector3(0, 0, 0)
  }, [])

  const vec3Mouse = useMemo(() => {
    return new Vector3(0, 0, 0)
  }, [])

  const [particleCount, setParticleCount] = useState(0)

  let parentRef = useRef(null)
  let floatingParentRef = useRef(null)
  let floatingIntermediateRef = useRef(null)
  let meshRef = useRef(null)
  let mousePos = useRef({ x: 0, y: 0 })
  let delayedPos = useRef(new Vector3(-20, 0, 0))
  let initialRender = useRef(true)

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
    if (meshRef.current) {
      meshRef.current.geometry.setAttribute(
        'aSpreadPos',
        new InstancedBufferAttribute(
          cylinderGeo.attributes.position.array,
          3,
          false
        )
      )
    }
  }, [cylinderGeo])

  useEffect(() => {
    let positivePositionsZ = []
    let textScale = 0.1

    for (let i = 0; i < textGeo.attributes.position.array.length; i = i + 3) {
      let x = textGeo.attributes.position.array[i] * textScale
      let y = textGeo.attributes.position.array[i + 1] * textScale
      let z = textGeo.attributes.position.array[i + 2] * textScale

      if (y > 0) {
        positivePositionsZ.push({ x, y, z })
      }
    }

    let beforeSparseArray = positivePositionsZ

    let interval = 2
    setParticleCount(Math.floor(beforeSparseArray.length / interval))
    let pCount = Math.floor(beforeSparseArray.length / interval)

    let populateIndex = 0

    let aWordPos = new Float32Array(pCount * 3)
    let randomNumbers = new Float32Array(pCount)
    let colorRandom = new Float32Array(pCount)

    for (let index = 0; index < pCount; index++) {
      randomNumbers[index] = Math.random()
      colorRandom[index] = Math.random()

      let x = beforeSparseArray[populateIndex].x
      let y = -beforeSparseArray[populateIndex].z
      let z = beforeSparseArray[populateIndex].y

      aWordPos.set([x, y, z], index * 3)
      populateIndex = populateIndex + interval
    }

    meshRef.current.geometry.setAttribute(
      'aWordPos',
      new InstancedBufferAttribute(aWordPos, 3, false)
    )

    meshRef.current.geometry.setAttribute(
      'aRandom',
      new InstancedBufferAttribute(randomNumbers, 1, false)
    )

    meshRef.current.geometry.setAttribute(
      'aColorRandom',
      new InstancedBufferAttribute(colorRandom, 1, false)
    )
  }, [meshRef, textGeo])

  let particleScrollAnimation = useRef(null)
  let particleAnimationRef1 = useRef(null)
  let particleAnimationRef2 = useRef(null)
  let particleAnimationRef3 = useRef(null)
  let particleAnimationRef4 = useRef(null)
  let particleAnimationRef5 = useRef(null)
  let particleAnimationRef6 = useRef(null)
  let particleAnimationRef7 = useRef(null)

  useEffect(() => {
    if (!isContactVisible && !isServiceVisible) {
      console.log('triggered')
      particleScrollAnimation.current = gsap.to(parentRef.current.rotation, {
        scrollTrigger: {
          trigger: document.getElementById('root'), // perhaps change this so that the model doesn't spin on appear
          scrub: false,
        },
        y: Math.PI * 3,
      })
    } else {
      particleScrollAnimation.current?.pause()
    }

    if (!isContactVisible) {
      particleAnimationRef1.current?.kill()
      particleAnimationRef2.current?.kill()
      particleAnimationRef3.current?.kill()

      particleAnimationRef1.current = gsap.to(
        floatingIntermediateRef.current.rotation,
        {
          y: 2 * Math.PI,
          duration: 500,
          ease: 'linear',
          repeat: -1,
        }
      )

      let randomTiltAngleZ =
        Math.random() < 0.5 ? MathUtils.degToRad(30) : MathUtils.degToRad(-30)

      let randomTiltAngleX =
        Math.random() < 0.5 ? MathUtils.degToRad(50) : MathUtils.degToRad(-50)

      particleAnimationRef4.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          z: randomTiltAngleZ,
          duration: 2,
          ease: 'sine.inOut',
        }
      )

      particleAnimationRef5.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          x: randomTiltAngleX,
          duration: 2,
          ease: 'sine.inOut',
        }
      )

      particleAnimationRef2.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          delay: 2,
          // add the sin function thing here to introduce a swing
          z: -randomTiltAngleZ,
          duration: 500,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }
      )

      particleAnimationRef3.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          delay: 2,
          // add the sin function thing here to introduce a swing
          x: -randomTiltAngleX,
          duration: 500,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }
      )
    } else {
      particleAnimationRef1.current?.kill()
      particleAnimationRef2.current?.kill()
      particleAnimationRef3.current?.kill()
      particleAnimationRef4.current?.kill()
      particleAnimationRef5.current?.kill()

      particleAnimationRef1.current = gsap.to(
        floatingIntermediateRef.current.rotation,
        {
          y: 0,
          duration: 2,
          ease: 'bounce',
        }
      )

      particleAnimationRef2.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          z: MathUtils.degToRad(0),
          duration: 2,
          ease: 'sine.inOut',
        }
      )

      particleAnimationRef3.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          x: MathUtils.degToRad(0),
          duration: 2,
          ease: 'sine.inOut',
        }
      )
    }

    if (isServiceVisible) {
      particleAnimationRef6.current?.kill()

      particleAnimationRef6.current = gsap.to(parentRef.current.rotation, {
        delay: 0,
        // add the sin function thing here to introduce a swing
        z: MathUtils.degToRad(90),
        duration: 1,
        ease: 'sine.inOut',
      })
    } else {
      particleAnimationRef6.current?.kill()

      particleAnimationRef6.current = gsap.to(parentRef.current.rotation, {
        delay: 0,
        // add the sin function thing here to introduce a swing
        z: MathUtils.degToRad(0),
        duration: 1,
        ease: 'sine.inOut',
      })
    }

    gsap.to(meshRef.current.material.uniforms.uInterpolate, {
      value: isContactVisible ? 1 : 0,
      duration: 2,
      ease: 'sine.inOut',
    })
  }, [isContactVisible, isServiceVisible])

  useEffect(() => {
    gsap.to(meshRef.current.material.uniforms.uSizeScale, {
      value: isServiceVisible ? 10 : 1,
      duration: 2,
    })
  }, [isServiceVisible])

  useFrame((state) => {
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()

    const mousePosTHREE = vec3Mouse.set(
      (mousePos.current.x * state.viewport.width) / 2,
      (mousePos.current.y * state.viewport.height) / 2,
      0
    )
    delayedPos.current.lerp(
      vec3Lerp.set(mousePosTHREE.x, mousePosTHREE.y, mousePosTHREE.z),
      0.1
    )
    meshRef.current.material.uniforms.uMousePos.value = delayedPos.current
  })

  return (
    <mesh ref={parentRef}>
      <mesh
        scale={1}
        ref={floatingParentRef}
        // rotation={[0, MathUtils.degToRad(90), 0]}
      >
        <mesh ref={floatingIntermediateRef}>
          <instancedMesh
            ref={meshRef}
            args={[null, null, particleCount]}
          >
            <planeGeometry args={[0.002, 0.002]} />
            <shaderMaterial
              uniforms={uniforms}
              vertexShader={vertexShader}
              fragmentShader={fragmentShader}
              transparent
              depthTest={false}
              depthWrite={false}
            />
          </instancedMesh>
        </mesh>
      </mesh>
    </mesh>
  )
}

export default FloatingRandomParticles
