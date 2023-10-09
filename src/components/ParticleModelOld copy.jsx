import React, { useState, useEffect, useMemo, useRef, forwardRef } from 'react'
import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Text,
  Text3D,
  Wireframe,
  shaderMaterial,
  useGLTF,
} from '@react-three/drei'
import {
  InstancedBufferAttribute,
  TextureLoader,
  Vector3,
  AdditiveBlending,
  CylinderGeometry,
  MathUtils,
  Scene,
  WebGLRenderTarget,
} from 'three'
import glsl from 'babel-plugin-glsl/macro'
import {
  EffectComposer,
  Bloom,
  ChromaticAberration,
  DepthOfField,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import PostFX from '../utils/PostFX'
import * as THREE from 'three'

import { uniforms as particleModelUniforms } from '../shaders/particle-model/particleModelShaders'
import { vertexShader as particleModelVertexShader } from '../shaders/particle-model/particleModelShaders'
import { fragmentShader as particleModelFragmentShader } from '../shaders/particle-model/particleModelShaders'

import { uniforms as floatingParticlelUniforms } from '../shaders/particle-model/floatingParticlesShaders'
import { vertexShader as floatingParticleVertexShader } from '../shaders/particle-model/floatingParticlesShaders'
import { fragmentShader as floatingParticleFragmentShader } from '../shaders/particle-model/floatingParticlesShaders'

import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import { suspend } from 'suspend-react'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader'

gsap.registerPlugin(ScrollTrigger)

//Creating scene and render target for ripple texture effect
const sceneRipples = new THREE.Scene()

const target = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }
)

window.addEventListener('resize', () => {
  target.setSize(window.innerWidth, window.innerHeight)
})

const ParticleModelOld = ({ isParticleModelVisible }) => {
  let containerRef = useRef(null)
  return (
    <div className="w-full h-screen relative">
      <div className="absolute inset-0 w-full h-full flex items-center justify-center ">
        {/* <div className="w-[1070px] h-[633px] overflow-hidden rounded-2xl border border-slate-700  ">
          <div className="w-full h-full test-grad-child relative "></div>
        </div> */}
      </div>
      <div
        className="w-full h-screen fixed inset-0 
        "
        // z-[-20]
        ref={containerRef}
      >
        <Canvas
          camera={{ fov: 10, near: 0.01 }}
          dpr={[1, 2]}
        >
          <OrbitControls />
          <Particles
            ref={containerRef}
            isParticleModelVisible={isParticleModelVisible}
          />
          {/* <EffectComposer>
          <ChromaticAberration
            blendFunction={BlendFunction.ADD} // blend mode
            offset={[0.001 * 5, 0.001 * 5]} // color offset
            radialModulation
            modulationOffset={0.5}
          />
          <Bloom
            mipmapBlur
            luminanceThreshold={0}
            intensity={10}
            radius={0.8}
          />
          <DepthOfField
            // focusDistance={focusDistance}
            // focalLength={focalLength}
            bokehScale={0}
          />
        </EffectComposer> */}
        </Canvas>
      </div>
    </div>
  )
}

export default ParticleModelOld

const Particles = forwardRef(({ isParticleModelVisible }, ref) => {
  // version 3 goes hard (v11)
  // const { nodes } = useGLTF('./models/v18_10.glb')
  const { nodes } = useGLTF('./models/v18_11.glb')
  const textNodes = useGLTF('./models/test_text.glb')

  const crazy = textNodes.nodes.Text.geometry.attributes.position.array

  const { viewport, camera } = useThree()

  const ANIMATION_DURATION = 0.5

  const [debouncedIsParticleVisible, setDebouncedIsParticleModelVisible] =
    useState(isParticleModelVisible)
  const [animationCounter, setAnimationCounter] = useState(0)

  let parentRef = useRef(null)
  let modelMeshRef = useRef(null)
  let elapsedTime = useRef(0)
  let triggerTime = useRef(0)
  const sphereRef = useRef(new Vector3(0, 0, 0))
  const initialRender = useRef(true)
  let sphereVelocity = useRef(new Vector3(0, 0, 0))
  let mousePos = useRef({ x: 0, y: 0 })
  let floatingParentRef = useRef(null)
  let floatingIntermediateRef = useRef(null)
  let floatingParticlesRef = useRef(null)

  const geometry = useMemo(() => {
    // nodes['outer-spiral'].geometry.rotateX(Math.PI / 2)
    return nodes['outer-spiral'].geometry
  }, [nodes])

  const cylinderGeo = useMemo(() => {
    return new CylinderGeometry(
      viewport.width,
      viewport.width,
      viewport.height,
      50,
      50
    ).attributes.position
  }, [])

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
    if (animationCounter < 1) {
      setDebouncedIsParticleModelVisible(isParticleModelVisible)
      setAnimationCounter((v) => v + 1)
      return
    }
    const timer = setTimeout(() => {
      setDebouncedIsParticleModelVisible(isParticleModelVisible)
    }, 250)

    return () => {
      clearTimeout(timer)
    }
  }, [isParticleModelVisible])

  const [shouldRotate, setShouldRotate] = useState(false)
  const [modelShouldRotate, setModelShouldRotate] = useState(false)
  const [particlesShouldRotate, setParticlesShouldRotate] = useState(false)

  useEffect(() => {
    // if (initialRender.current) {
    //   initialRender.current = false
    //   return
    // }

    triggerTime.current = elapsedTime.current

    modelMeshRef.current.material.uniforms.uInitialRender.value = false
    modelMeshRef.current.material.uniforms.uTriggerTime.value =
      elapsedTime.current
    modelMeshRef.current.material.uniforms.uSwitch.value =
      debouncedIsParticleVisible

    floatingParticlesRef.current.material.uniforms.uInitialRender.value = false
    floatingParticlesRef.current.material.uniforms.uTriggerTime.value =
      elapsedTime.current
    floatingParticlesRef.current.material.uniforms.uSwitch.value =
      debouncedIsParticleVisible

    let rotationTimer

    if (debouncedIsParticleVisible) {
      rotationTimer = setTimeout(() => {
        setShouldRotate(true)
        setModelShouldRotate(true)
        setParticlesShouldRotate(true)
      }, ANIMATION_DURATION * 1000)
    } else {
      clearTimeout(rotationTimer)
      setTimeout(() => {
        setShouldRotate(false)
        setModelShouldRotate(false)
        setParticlesShouldRotate(false)
        // modelMeshRef.current.rotation.z = 0
        // parentRef.current.rotation.z = 0
        gsap.to(modelMeshRef.current.rotation, {
          z: 0,
          duration: 0.5,
        })
        gsap.to(parentRef.current.rotation, {
          z: 0,
          duration: 0.5,
        })
      }, ANIMATION_DURATION * 0)
    }

    if (!modelMeshRef.current.geometry.attributes.pos) return

    return () => {
      clearTimeout(rotationTimer)
    }
  }, [debouncedIsParticleVisible])

  const animationRef1 = useRef()
  const animationRef2 = useRef()

  useEffect(() => {
    if (modelShouldRotate) {
      gsap.to(parentRef.current.rotation, {
        z: -2 * Math.PI,
        duration: 100,
        ease: 'linear',
        repeat: -1,
      })
      animationRef1.current = gsap.to(modelMeshRef.current.rotation, {
        scrollTrigger: {
          trigger: document.getElementById('root'),
          onUpdate: (self) => {
            // scrollSomething.current = self.progress
          },

          scrub: 1,
        },
        // z: Math.PI * 0.5,
        z: Math.PI * 3,
      })

      // animationRef2.current = gsap.to(floatingParticlesRef.current.rotation, {
      //   scrollTrigger: {
      //     trigger: document.getElementById('root'),
      //     onUpdate: (self) => {
      //       // scrollSomething.current = self.progress
      //     },

      //     scrub: 1,
      //   },
      //   // z: Math.PI * 0.5,
      //   y: Math.PI * 3,
      // })
    } else {
      animationRef1.current?.kill()
      animationRef2.current?.kill()
    }
  }, [modelShouldRotate])

  useEffect(() => {
    modelMeshRef.current.geometry.setAttribute(
      'pos',
      new InstancedBufferAttribute(geometry.attributes.position.array, 3, false)
    )

    let colorRand = new Float32Array(geometry.attributes.position.count)
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      colorRand[i] = Math.random() * 1
    }

    modelMeshRef.current.geometry.setAttribute(
      'colorRand',
      new InstancedBufferAttribute(colorRand, 1, false)
    )

    let randomSize = new Float32Array(geometry.attributes.position.count)
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      randomSize[i] = Math.random() * 1
    }

    modelMeshRef.current.geometry.setAttribute(
      'randomSize',
      new InstancedBufferAttribute(randomSize, 1, false)
    )
  }, [modelMeshRef])

  const vec = new THREE.Vector3(0, 0, 0)
  let delayedPos = useRef(new THREE.Vector3(0, 0, 0))
  let prevDelayedPos = useRef(new THREE.Vector3(0, 0, 0))

  const [stateDelayedPos, setStateDelayedPos] = useState(
    new THREE.Vector3(0, 0, 0)
  )

  const [statePrevDelayedPos, setStatePrevDelayedPos] = useState(
    new THREE.Vector3(0, 0, 0)
  )

  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    elapsedTime.current = time

    const directionToTarget = new Vector3(
      (mousePos.current.x * viewport.width) / 2,
      (mousePos.current.y * viewport.height) / 2,
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

    // if (shouldRotate) {
    //   parentRef.current.rotation.z -= 0.001
    //   floatingIntermediateRef.current.rotation.y += 0.001
    //   floatingParentRef.current.rotation.z = MathUtils.degToRad(
    //     Math.cos(state.clock.getElapsedTime() * 0.01) * 30
    //   )
    // }

    floatingParentRef.current.rotation.z = MathUtils.degToRad(
      Math.cos(state.clock.getElapsedTime() * 0.01) * 30
    )

    modelMeshRef.current.material.uniforms.uSpherePos.value = sphereRef.current

    modelMeshRef.current.material.uniforms.uTime.value =
      state.clock.getElapsedTime()
    floatingParticlesRef.current.material.uniforms.uTime.value =
      state.clock.getElapsedTime()

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////

    const mousePosTHREE = new THREE.Vector3(
      (mousePos.current.x * state.viewport.width) / 2,
      (mousePos.current.y * state.viewport.height) / 2,
      0
    )
    delayedPos.current.lerp(
      vec.set(mousePosTHREE.x, mousePosTHREE.y, mousePosTHREE.z),
      0.05
    )

    const angleVeritcal = Math.atan(delayedPos.current.y / 5)
    const angleHorizontal = Math.atan(delayedPos.current.x / 5)

    const angleTilt = delayedPos.current.clone().sub(prevDelayedPos.current).x

    camera.rotateX(angleVeritcal * 0.03)
    camera.rotateY(-angleHorizontal * 0.01)
    camera.rotateZ(angleTilt * 0.2)

    const totalAngle = Math.abs(angleVeritcal) + Math.abs(angleHorizontal) * 0.1

    camera.position.z = 5 + totalAngle

    // console.log(prevDelayedPos)

    prevDelayedPos.current = delayedPos.current.clone()

    // console.log(prevDelayedPos.current)

    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
    /////////////////////////////////////////////////////
  })

  useEffect(() => {
    let completeTarget = []
    let innerIndex = 0

    for (let i = 0; i < cylinderGeo.array.length; i = i + 3) {
      if (Math.random() < 0.1) {
        completeTarget[innerIndex] = {
          x: cylinderGeo.array[i],
          y: cylinderGeo.array[i + 1],
          z: cylinderGeo.array[i + 2],
        }
        innerIndex++
      }
    }

    // const filterCondition = (element) => {
    //   element.x !== 0 && element.y !== 0 && element.z !== 0
    // }

    let randomPositions = new Float32Array(completeTarget.length * 3)

    for (let i = 0; i < completeTarget.length; i++) {
      let x = completeTarget[i].x + Math.random() - 0.5
      let y = completeTarget[i].y + (Math.random() - 0.5) * 1.5
      let z = completeTarget[i].z + Math.random()

      randomPositions.set([x, y, z], i * 3)
    }

    const randomBool = new Float32Array(cylinderGeo.count)
    for (let i = 0; i < cylinderGeo.count; i++) {
      if (Math.random() < 0) {
        randomBool[i] = false
      } else {
        randomBool[i] = true
      }
    }

    const colorRand = new Float32Array(cylinderGeo.count)
    for (let i = 0; i < cylinderGeo.count; i++) {
      colorRand[i] = Math.random() * 1
    }

    floatingParticlesRef.current.geometry.setAttribute(
      'colorRand',
      new InstancedBufferAttribute(colorRand, 1, false)
    )

    floatingParticlesRef.current.geometry.setAttribute(
      'someBool',
      new InstancedBufferAttribute(randomBool, 1, false)
    )
    floatingParticlesRef.current.geometry.setAttribute(
      'pos1',
      new InstancedBufferAttribute(randomPositions, 3, false)
    )
  }, [floatingParticlesRef])

  //************************************** */

  const [particlesToWord, setParticlesToWord] = useState(false)

  let particleAnimationRef1 = useRef(null)
  let particleAnimationRef2 = useRef(null)

  useEffect(() => {
    if (particlesShouldRotate) {
      // particleAnimationRef1.current = gsap.to(
      //   floatingParentRef.current.rotation,
      //   {
      //     // add the sin function thing here to introduce a swing
      //     // z: -2 * Math.PI,
      //     // duration: 100,
      //     // ease: 'linear',
      //     // repeat: -1,
      //   }
      // )
      particleAnimationRef1.current = gsap.to(
        floatingIntermediateRef.current.rotation,
        {
          y: 2 * Math.PI,
          duration: 100,
          ease: 'linear',
          repeat: -1,
        }
      )
      particleAnimationRef2.current = gsap.to(
        floatingParticlesRef.current.rotation,
        {
          scrollTrigger: {
            trigger: document.getElementById('root'),
            onUpdate: (self) => {
              // scrollSomething.current = self.progress
            },
            scrub: 1,
          },
          // z: Math.PI * 0.5,
          y: Math.PI * 3,
        }
      )
    } else {
      particleAnimationRef1.current?.kill()
      particleAnimationRef2.current?.kill()
    }
  }, [particlesShouldRotate])

  // useEffect(() => {
  //   if (textRef.current) {
  //     // console.log(floatingParticlesRef.current)
  //     let largeLength =
  //       textRef.current.geometry.attributes.position.array.length
  //     let smallLength = textGeo.attributes.position.array.length
  //     let interval = Math.floor(largeLength / smallLength)
  //     console.log(textGeo.attributes.position.array.length)

  //     let completeTarget = []
  //     let innerIndex = 0
  //     let populateIndex = 0

  //     for (let i = 0; i < largeLength; i = i + 3) {
  //       completeTarget[innerIndex] = {
  //         // x: geometry.attributes.position.array[i] * 0.3 + 0.5,
  //         // y: geometry.attributes.position.array[i + 1] * 0.3,
  //         // z: geometry.attributes.position.array[i + 2] * 0.3,
  //         x: textRef.current.geometry.attributes.position.array[i] * 1,
  //         y: textRef.current.geometry.attributes.position.array[i + 1] * 1,
  //         z: textRef.current.geometry.attributes.position.array[i + 2] * 1,
  //       }
  //       innerIndex++
  //     }

  //     // console.log(completeTarget)

  //     let orderedPositions = new Float32Array(smallLength)

  //     for (let index = 0; index < Math.floor(smallLength / 3); index++) {
  //       let x = completeTarget[populateIndex].x
  //       let y = -completeTarget[populateIndex].z
  //       let z = completeTarget[populateIndex].y

  //       orderedPositions.set([x, y, z], index * 3)
  //       populateIndex = populateIndex + interval
  //     }

  //     floatingParticlesRef.current.geometry.setAttribute(
  //       'pos2',
  //       new InstancedBufferAttribute(
  //         textGeo.attributes.position.array,
  //         3,
  //         false
  //       )
  //     )
  //   }
  // }, [textRef])

  // useEffect(() => {
  //   const someObj = { x: 0 }
  //   gsap.to(someObj, {
  //     x: 1000,
  //     duration: 2,
  //     ease: 'linear',
  //     onUpdate: () => {
  //       console.log(someObj.x)
  //     },
  //   })
  // }, [])

  // useEffect(() => {
  //   if (particlesToWord) {
  //     let largeLength =
  //       textRef.current.geometry.attributes.position.array.length
  //     let smallLength =
  //       floatingParticlesRef.current.geometry.attributes.pos1.array.length
  //     let interval = Math.floor(largeLength / smallLength)
  //     console.log(largeLength)
  //     console.log(smallLength)
  //     console.log(interval)

  //     let completeTarget = []
  //     let innerIndex = 0
  //     let populateIndex = 0

  //     for (let i = 0; i < largeLength; i = i + 3) {
  //       completeTarget[innerIndex] = {
  //         // x: geometry.attributes.position.array[i] * 0.3 + 0.5,
  //         // y: geometry.attributes.position.array[i + 1] * 0.3,
  //         // z: geometry.attributes.position.array[i + 2] * 0.3,
  //         x: textRef.current.geometry.attributes.position.array[i] * 1,
  //         y: textRef.current.geometry.attributes.position.array[i + 1] * 1,
  //         z: textRef.current.geometry.attributes.position.array[i + 2] * 1,
  //       }
  //       innerIndex++
  //     }

  //     console.log(completeTarget)

  //     let orderedPositions = new Float32Array(smallLength)

  //     for (let index = 0; index < Math.floor(smallLength / 3); index++) {
  //       let x = completeTarget[populateIndex].x
  //       let y = -completeTarget[populateIndex].z
  //       let z = completeTarget[populateIndex].y

  //       orderedPositions.set([x, y, z], index * 3)
  //       populateIndex = populateIndex + interval
  //     }

  //     floatingParticlesRef.current.geometry.setAttribute(
  //       'pos2',
  //       new InstancedBufferAttribute(orderedPositions, 3, false)
  //     )
  //   }
  // }, [particlesToWord])

  // useEffect(() => {
  //   let timeout
  //   timeout = setTimeout(() => {
  //     setParticlesShouldRotate(false)
  //     setParticlesToWord(true)
  //   }, 5000)

  //   return () => {
  //     clearTimeout(timeout)
  //   }
  // }, [])

  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************

  const { gl, scene, size } = useThree()

  const texture = useMemo(() => {
    return new TextureLoader().load('./ripple.png')
  }, [])

  let mainMeshRef = useRef(null)

  let [stateMeshes, setStateMeshes] = useState([])
  let [maxRipples] = useState(100)
  let [geoRipples] = useState(() => {
    return new THREE.PlaneGeometry(0.3, 0.3, 1, 1)
  }, [])

  let mousePosition = useRef(new THREE.Vector2(0, 0))
  let prevMousePosition = useRef(new THREE.Vector2(0, 0))
  let currentWave = useRef(0)

  useEffect(() => {
    window.addEventListener('mousemove', (e) => {
      if (e.movementX > 1 || e.movementY > 1 || 1) {
        const { clientX, clientY } = e

        // maybe use the dimensions of the actual container of the canvas
        const x = (clientX / window.innerWidth) * 2 - 1
        const y = -(clientY / window.innerHeight) * 2 + 1

        mousePosition.current.x = (x * viewport.width) / 2
        mousePosition.current.y = (y * viewport.height) / 2
      }
    })

    let tempArray = []

    for (let i = 0; i < maxRipples; i++) {
      let mat = new THREE.MeshBasicMaterial({
        map: texture,
        // blending: AdditiveBlending,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        opacity: 0,
      })

      let newMesh = new THREE.Mesh(geoRipples, mat)
      newMesh.visible = false
      newMesh.rotation.z = 2 * Math.PI * Math.random()
      sceneRipples.add(newMesh)
      tempArray.push(newMesh)
    }

    setStateMeshes(tempArray)

    sceneRipples.add(camera)
  }, [])

  const setNewWave = (x, y, index) => {
    let newMesh = stateMeshes[index]
    newMesh.visible = true
    newMesh.scale.x = newMesh.scale.y = 0.2
    newMesh.position.x = x
    newMesh.position.y = y
    // newMesh.material.opacity = 1
    newMesh.material.opacity = 0.5
  }

  const renderer = new PostFX(gl)

  useFrame((state) => {
    if (stateMeshes.length === maxRipples) {
      if (
        // Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 4 &&
        // Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 4
        // Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 0.1 &&
        // Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.1
        Math.abs(mousePosition.current.x - prevMousePosition.current.x) <
          0.001 &&
        Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.001
        // mousePosition.current.x === prevMousePosition.current.x &&
        // mousePosition.current.y === prevMousePosition.current.y
        // false
      ) {
      } else {
        setNewWave(
          mousePosition.current.x,
          mousePosition.current.y,
          currentWave.current
        )
        currentWave.current = (currentWave.current + 1) % maxRipples
      }

      prevMousePosition.current.x = mousePosition.current.x
      prevMousePosition.current.y = mousePosition.current.y

      stateMeshes.forEach((singleMesh) => {
        if (singleMesh.visible) {
          singleMesh.rotation.z += 0.02
          singleMesh.scale.x = 0.98 * singleMesh.scale.x + 0.075
          singleMesh.scale.y = singleMesh.scale.x
          singleMesh.material.opacity *= 0.96
          if (singleMesh.material.opacity < 0.0002) {
            singleMesh.material.opacity = 0
            singleMesh.visible = false
          }
        }
      })
    }
    // Pass into RenderTarget, pass RenderTarget texture to shader
    state.gl.setRenderTarget(target)
    state.gl.render(sceneRipples, state.camera)
    // mainMeshRef.current.material.uniforms.uDisplacement.value = target.texture
    state.gl.setRenderTarget(null)
    state.gl.clear()

    renderer.render(scene, camera, target.texture)
  }, 1)

  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************
  // *********************************************************************************************************

  return (
    <>
      <mesh
        ref={parentRef}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.5}
        position={[0, 0, 0]}
        // visible={false}
      >
        <instancedMesh
          args={[null, null, geometry.attributes.position.count]}
          ref={modelMeshRef}
        >
          <planeGeometry
            // args={[0.0025, 0.0025]}
            args={[0.002, 0.002]}
            // args={[0.05, 0.05]}
          />
          <shaderMaterial
            blending={AdditiveBlending}
            transparent
            uniforms={particleModelUniforms}
            vertexShader={particleModelVertexShader}
            fragmentShader={particleModelFragmentShader}
          />
        </instancedMesh>
      </mesh>
      <mesh
        scale={0.5}
        ref={floatingParentRef}
        rotation={[0, 0, 0]}
        visible={false}
      >
        <mesh ref={floatingIntermediateRef}>
          <instancedMesh
            args={[null, null, cylinderGeo.count]}
            ref={floatingParticlesRef}
          >
            <planeGeometry
              // args={[0.0025, 0.0025]}
              args={[0.008, 0.008]}
              // args={[0.05, 0.05]}
            />
            <shaderMaterial
              blending={AdditiveBlending}
              transparent
              depthTest={false}
              depthWrite={false}
              uniforms={floatingParticlelUniforms}
              vertexShader={floatingParticleVertexShader}
              fragmentShader={floatingParticleFragmentShader}
            />
          </instancedMesh>
        </mesh>
      </mesh>
    </>
  )
})
