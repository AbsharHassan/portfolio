import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { PerspectiveCamera, useGLTF } from '@react-three/drei'
import gsap from 'gsap'

import {
  uniforms,
  vertexShader,
  fragmentShader,
} from '../shaders/floating-random-particles/floatingRandomParticlesShaders'

const vec = new THREE.Vector3(-20, 0, 0)

const FloatingWordParticles = ({
  isHeroVisible,
  isContactVisible,
  isServiceVisible,
  dummyHeadingRef,
}) => {
  const { viewport } = useThree()

  const { nodes } = useGLTF('./models/v3_Get_In_Touch.glb')

  const [particleCount, setParticleCount] = useState(0)
  const [previousViewport, setPreviousViewport] = useState({
    width: 0,
    height: 0,
  })

  let meshRef = useRef(null)
  let floatingParentRef = useRef(null)
  let floatingIntermediateRef = useRef(null)
  let mousePos = useRef({ x: 0, y: 0 })
  let delayedPos = useRef(new THREE.Vector3(-20, 0, 0))
  let scrollAnimationRef = useRef(null)
  let innerMostRef = useRef(null)
  let customCameraRef = useRef(null)
  let spinAnimation = useRef(null)
  let swingAnimation = useRef(null)
  let swingSetAnimation = useRef(null)
  let cameraAnimation = useRef(null)

  const textGeo = useMemo(() => {
    const geometry = nodes.Text.geometry
    return geometry
  }, [nodes])

  const cylinderGeo = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      (3 * viewport.width) / 1.7872416482900515 +
        (viewport.width < 1 ? 1 : viewport.width < 1.3 && 0.5),
      (3 * viewport.width) / 1.7872416482900515 +
        (viewport.width < 1 ? 1 : viewport.width < 1.3 && 0.5),
      viewport.height * 2,
      50,
      50
    )
    return geometry
  }, [viewport])

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
        new THREE.InstancedBufferAttribute(
          cylinderGeo.attributes.position.array,
          3,
          false
        )
      )
    }
  }, [cylinderGeo])

  useEffect(() => {
    if (
      viewport.width !== previousViewport.width ||
      viewport.height !== previousViewport.height
    ) {
      let positivePositionsZ = []

      for (let i = 0; i < textGeo.attributes.position.array.length; i = i + 3) {
        let x = textGeo.attributes.position.array[i]
        let y = textGeo.attributes.position.array[i + 1]
        let z = textGeo.attributes.position.array[i + 2]

        if (y > 0) {
          positivePositionsZ.push({ x, y, z })
        }
      }

      let beforeSparseArray = positivePositionsZ

      let interval = 1
      setParticleCount(Math.floor(beforeSparseArray.length / interval))
      let pCount = Math.floor(beforeSparseArray.length / interval)
      let populateIndex = 0

      let aWordPos = new Float32Array(pCount * 3)
      let randomNumbers = new Float32Array(pCount)
      let colorRandom = new Float32Array(pCount)

      for (let index = 0; index < pCount; index++) {
        randomNumbers[index] = Math.random()
        colorRandom[index] = Math.random()

        let x =
          beforeSparseArray[populateIndex].x * (viewport.width > 1 ? 1 : 0.7)
        let y =
          -beforeSparseArray[populateIndex].z * (viewport.width > 1 ? 1 : 0.7)
        let z =
          beforeSparseArray[populateIndex].y * (viewport.width > 1 ? 1 : 0.7)

        aWordPos.set([x, y, z], index * 3)
        populateIndex = populateIndex + interval
      }

      meshRef.current.geometry.setAttribute(
        'aWordPos',
        new THREE.InstancedBufferAttribute(aWordPos, 3, false)
      )

      meshRef.current.geometry.setAttribute(
        'aRandom',
        new THREE.InstancedBufferAttribute(randomNumbers, 1, false)
      )

      meshRef.current.geometry.setAttribute(
        'aColorRandom',
        new THREE.InstancedBufferAttribute(colorRandom, 1, false)
      )
    }
    setPreviousViewport({ width: viewport.width, height: viewport.height })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meshRef, textGeo, viewport])

  useFrame((state) => {
    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()

    let fovCompensator = 8.77058760592

    const mousePosTHREE = new THREE.Vector3(
      (mousePos.current.x * state.viewport.width * fovCompensator) / 2,
      (mousePos.current.y * state.viewport.height * fovCompensator) / 2,
      0
    )
    delayedPos.current.lerp(
      vec.set(mousePosTHREE.x, mousePosTHREE.y, mousePosTHREE.z),
      0.1
    )
    meshRef.current.material.uniforms.uMousePos.value = delayedPos.current

    if (isContactVisible && dummyHeadingRef.current) {
      const { left, top, bottom } =
        dummyHeadingRef.current.getBoundingClientRect()

      const x = (left / window.innerWidth) * 2 - 1
      const y = (bottom / window.innerHeight) * -2 + 1

      let verticalScaler =
        state.viewport.width > 1
          ? top / (window.innerHeight / 2)
          : top / window.innerHeight

      const offsetX = (x * state.viewport.width * fovCompensator) / 2
      const offsetY = (y * state.viewport.height * fovCompensator) / 2

      let remappedExtraOffest =
        ((1 - 1.4) / (1.7872416482900515 - 1.1896209942473865)) *
          (state.viewport.width - 1.1896209942473865) +
        1.4

      meshRef.current.material.uniforms.uOffsetX.value =
        window.innerWidth >= 1024 ? offsetX + remappedExtraOffest : 0
      meshRef.current.material.uniforms.uOffsetY.value =
        state.viewport.width > 1
          ? offsetY + (1 - verticalScaler) + 0.225
          : offsetY + (1 - verticalScaler) - 0.1
    }
  })

  useEffect(() => {
    if (isHeroVisible || isServiceVisible) {
      gsap.to(meshRef.current.material.uniforms.uSizeScale, {
        value: 0,
        duration: 2,
      })
    } else if (isContactVisible) {
      gsap.to(meshRef.current.material.uniforms.uSizeScale, {
        value: 2,
        duration: 2,
      })
    } else {
      gsap.to(meshRef.current.material.uniforms.uSizeScale, {
        value: 1,
        duration: 2,
      })
    }
  }, [isHeroVisible, isServiceVisible, isContactVisible])

  // Get rid of unneccesary animations for more performance
  useEffect(() => {
    gsap.to(meshRef.current.material.uniforms.uInterpolate, {
      value: isContactVisible ? 1 : 0,
      duration: 2,
      ease: 'power1',
    })

    let randomTiltAngle =
      Math.random() < 0.5
        ? THREE.MathUtils.degToRad(50)
        : THREE.MathUtils.degToRad(-50)

    if (!isContactVisible) {
      spinAnimation.current?.kill()
      swingAnimation.current?.kill()
      cameraAnimation.current?.kill()

      cameraAnimation.current = gsap.to(customCameraRef.current.position, {
        x: -0.1308784133171829,
        y: 0.7432016797772444,
        z: 2.3164561507987655,
        duration: 1,
      })

      spinAnimation.current = gsap.to(
        floatingIntermediateRef.current.rotation,
        {
          y: 2 * Math.PI,
          duration: 500,
          ease: 'linear',
          repeat: -1,
        }
      )

      swingSetAnimation.current = gsap.to(floatingParentRef.current.rotation, {
        // add the sin function thing here to introduce a swing
        z: randomTiltAngle,
        duration: 2,
        ease: 'sine.inOut',
      })

      swingAnimation.current = gsap.to(floatingParentRef.current.rotation, {
        delay: 2,
        // add the sin function thing here to introduce a swing
        z: -randomTiltAngle,
        duration: 100,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      })
    } else {
      spinAnimation.current?.kill()
      swingAnimation.current?.kill()
      swingSetAnimation.current?.kill()
      cameraAnimation.current?.kill()
      scrollAnimationRef.current?.kill()

      cameraAnimation.current = gsap.to(customCameraRef.current.position, {
        x: 0,
        y: 0,
        z: 5,
        duration: 1,
      })
      spinAnimation.current = gsap.to(
        floatingIntermediateRef.current.rotation,
        {
          y: 0,
          duration: 2,
          ease: 'linear',
          // repeat: -1,
        }
      )
      swingAnimation.current = gsap.to(floatingParentRef.current.rotation, {
        z: 0,
        duration: 1,
        ease: 'sine.inOut',
      })
    }
  }, [isContactVisible])

  return (
    <>
      <PerspectiveCamera
        ref={customCameraRef}
        makeDefault
        position={[-0.1308784133171829, 0.7432016797772444, 2.3164561507987655]}
        fov={75}
        near={0.000001}
      />
      <mesh
        ref={floatingParentRef}
        rotation={[0, 0, THREE.MathUtils.degToRad(0)]}
        scale={0.8}
      >
        <mesh ref={floatingIntermediateRef}>
          <mesh ref={innerMostRef}>
            <instancedMesh
              ref={meshRef}
              args={[null, null, particleCount]}
              rotation={[0, 0, 0]}
            >
              <planeGeometry args={[0.01 * 1, 0.01 * 1]} />

              <shaderMaterial
                transparent
                uniforms={uniforms}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                depthTest={false}
                depthWrite={false}
              />
            </instancedMesh>
          </mesh>
        </mesh>
      </mesh>
    </>
  )
}

export default FloatingWordParticles
