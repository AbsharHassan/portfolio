import { useEffect, useRef, useMemo, useState } from 'react'
import { AdditiveBlending, InstancedBufferAttribute, Vector3 } from 'three'
import { OrbitControls, useGLTF } from '@react-three/drei'
import gsap from 'gsap'

import {
  uniforms as particleModelUniforms,
  vertexShader as particleModelVertexShader,
  fragmentShader as particleModelFragmentShader,
} from '../shaders/particle-model/particleModelShaders'
import { useFrame, useThree } from '@react-three/fiber'

const ParticleModelMesh = ({
  isHeroVisible,
  isServiceVisible,
  checkModelRotation,
  isAboutVisible,
  isToolsetVisible,
  aboutContainerRef,
}) => {
  const { viewport, camera } = useThree()
  const { nodes } = useGLTF('./models/v18_11.glb')

  const modelGeometry = useMemo(() => {
    return nodes['outer-spiral'].geometry
  }, [nodes])

  const [modelShouldRotate, setModelShouldRotate] = useState(false)

  let parentRef = useRef(null)
  let intermediateRef = useRef(null)
  let modelMeshRef = useRef(null)
  let scrollAnimationRef = useRef(null)
  let mousePosition = useRef({ x: 0, y: 0 })
  let sphereRef = useRef(new Vector3(0, 0, 0))
  let sphereVelocity = useRef(new Vector3(0, 0, 0))

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      mousePosition.current = { x, y }
    }
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Setting up attributes for use in shaders
  useEffect(() => {
    modelMeshRef.current.geometry.setAttribute(
      'pos',
      new InstancedBufferAttribute(
        modelGeometry.attributes.position.array,
        3,
        false
      )
    )

    let particleCount = modelGeometry.attributes.position.count

    let spaceDustPos = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      let x =
        Math.random() * (viewport.width + 2.0) - (viewport.width + 2.0) / 2
      let y = Math.random() * (viewport.height + 1) - (viewport.height + 1) / 2
      let z = Math.random() * 2 * 0.1

      spaceDustPos.set([x, z, y], i * 3)
    }
    modelMeshRef.current.geometry.setAttribute(
      'aSpaceDustPos',
      new InstancedBufferAttribute(spaceDustPos, 3, false)
    )

    let spaceDustOpacity = new Float32Array(particleCount)
    for (let i = 0; i < modelGeometry.attributes.position.count; i++) {
      spaceDustOpacity[i] = Math.random() < 0.01 ? 1 : 0.0
    }
    modelMeshRef.current.geometry.setAttribute(
      'aSpaceDustOpacity',
      new InstancedBufferAttribute(spaceDustOpacity, 1, false)
    )

    let colorRand = new Float32Array(modelGeometry.attributes.position.count)
    for (let i = 0; i < modelGeometry.attributes.position.count; i++) {
      colorRand[i] = Math.random() * 1
    }

    modelMeshRef.current.geometry.setAttribute(
      'colorRand',
      new InstancedBufferAttribute(colorRand, 1, false)
    )

    let randomSize = new Float32Array(modelGeometry.attributes.position.count)
    for (let i = 0; i < modelGeometry.attributes.position.count; i++) {
      randomSize[i] = Math.random() * 1
    }

    modelMeshRef.current.geometry.setAttribute(
      'randomSize',
      new InstancedBufferAttribute(randomSize, 1, false)
    )
  }, [modelMeshRef, modelGeometry])

  // useEffect(() => {
  //   let counter = 0

  //   let interval

  //   interval = setInterval(() => {
  //     gsap.to(modelMeshRef.current.material.uniforms.uInterpolate, {
  //       value: counter % 2 === 0 ? 1 : 0,
  //       duration: 2,

  //       onComplete: () => {
  //         counter++
  //       },
  //     })
  //   }, 10000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  let rotateAnimation = useRef(null)

  // Spin and onScroll animations of the model
  useEffect(() => {
    if (modelShouldRotate) {
      rotateAnimation.current = gsap.to(parentRef.current.rotation, {
        z: 2 * Math.PI,
        duration: 100,
        ease: 'linear',
        repeat: -1,
      })
      // gsap.to(modelMeshRef.current.rotation, {
      //   z: 2 * Math.PI,
      //   duration: 100,
      //   ease: 'linear',
      //   repeat: -1,
      // })
      scrollAnimationRef.current = gsap.to(modelMeshRef.current.rotation, {
        scrollTrigger: {
          trigger: document.getElementById('main'), // perhaps change this so that the model doesn't spin on appear
          scrub: 1,
          start: false,
        },
        // z: Math.PI * 0.5,
        z: Math.PI * 3,
      })
    } else {
      scrollAnimationRef.current?.kill()
      rotateAnimation.current?.kill()
      // scrollAnimationRef.current?.pause()
      // rotateAnimation.current?.pause()
      gsap.to(parentRef.current.rotation, {
        z: 0,
        duration: 1,
        ease: 'linear',
      })
      gsap.to(modelMeshRef.current.rotation, {
        z: 0,
        duration: 1,
      })
    }
  }, [modelShouldRotate])

  useEffect(() => {
    setModelShouldRotate(!isHeroVisible)
    gsap.to(modelMeshRef.current.material.uniforms.uInterpolate, {
      value: isHeroVisible ? 0 : 1,
      duration: 2,
    })
  }, [isHeroVisible])

  let rotateScrollAnimation = useRef(null)

  useEffect(() => {
    // rotateScrollAnimation.current?.kill()
    // if (isAboutVisible) {
    //   rotateScrollAnimation.current = gsap.to(parentRef.current.rotation, {
    //     scrollTrigger: {
    //       trigger: aboutContainerRef.current, // perhaps change this so that the model doesn't spin on appear
    //       scrub: 1,
    //       start: false,
    //     },
    //     // z: Math.PI * 0.5,
    //     x: Math.PI / 2,
    //   })
    // }

    // gsap.to(parentRef.current.rotation, {
    //   // z: Math.PI * 0.5,

    //   x: isAboutVisible ? 0 : Math.PI / 2,
    //   duration: 1,
    // })
    // gsap.to(camera.position, {
    //   z: isAboutVisible ? 4 : 5,
    //   duration: 1,
    // })
    // gsap.to(camera.position, {
    //   z: isAboutVisible ? 0 : 5,
    //   duration: 1,
    // })
    // gsap.to(camera.rotation, {
    //   x: isAboutVisible ? Math.PI / 2 : 0,
    //   duration: 1,
    // })

    gsap.to(parentRef.current.rotation, {
      // z: Math.PI * 0.5,

      x: isAboutVisible ? 0 : Math.PI / 2,
      // z: isAboutVisible ? Math.PI / 2 : 0,
      duration: 1,
    })

    gsap.to(intermediateRef.current.rotation, {
      z: isAboutVisible ? Math.PI : 0,
      duration: 1,
    })
  }, [isAboutVisible])

  useEffect(() => {
    gsap.to(parentRef.current.rotation, {
      y: isToolsetVisible ? Math.PI / 2 : 0,
      duration: 1,
    })

    gsap.to(intermediateRef.current.rotation, {
      z: isToolsetVisible ? Math.PI : 0,
      duration: 1,
    })
  }, [isToolsetVisible])

  useEffect(() => {
    gsap.to(modelMeshRef.current.material.uniforms.uSizeScale, {
      value: isServiceVisible ? 5 : 1,
      duration: 2,
    })
  }, [isServiceVisible])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    const directionToTarget = new Vector3(
      (mousePosition.current.x * viewport.width) / 2,
      (mousePosition.current.y * viewport.height) / 2,
      0
    ).sub(sphereRef.current)

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = sphereVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    sphereRef.current.add(sphereVelocity.current)

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    modelMeshRef.current.material.uniforms.uSpherePos.value = sphereRef.current

    modelMeshRef.current.material.uniforms.uTime.value = time
  })

  return (
    <>
      {/* <OrbitControls /> */}
      <mesh
        ref={parentRef}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.5}
        position={[0, 0, 0]}
        // visible={false}
      >
        <mesh ref={intermediateRef}>
          <instancedMesh
            args={[null, null, modelGeometry.attributes.position.count]}
            ref={modelMeshRef}
          >
            <planeGeometry
              // args={[0.003, 0.003]}
              args={[0.002, 0.002]}
            />
            {/* <circleGeometry
          // args={[0.003, 0.003]}
          args={[0.001]}
        /> */}
            <shaderMaterial
              blending={AdditiveBlending}
              transparent
              depthTest={false}
              depthWrite={false}
              uniforms={particleModelUniforms}
              vertexShader={particleModelVertexShader}
              fragmentShader={particleModelFragmentShader}
            />
          </instancedMesh>
        </mesh>
      </mesh>
    </>
  )
}

export default ParticleModelMesh
