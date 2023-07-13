import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Object3D,
  Vector3,
  InstancedBufferAttribute,
  Vector2,
  TextureLoader,
  Color,
} from 'three'
import * as THREE from 'three'
import { useFrame, useThree, extend } from '@react-three/fiber'
import { Sphere, shaderMaterial, useGLTF } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import { useSelector } from 'react-redux'
import gsap from 'gsap'

const SpaceDustShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uSpherePos: new Vector3(20, 0, 0),
    uTexture: new TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
    // uColorPurple: new Color(0.76, 0.38, 1.0),
    uColorPurple: new Color(10.0, 0.38, 10.0),
    uColorBlue: new Color(0.35, 0.51, 0.98),
    uColorGreen: new Color(0.04, 0.66, 0.72),
    uSwitch: false,
    uAnimationTime: 0,
    uAnimationDuration: 0.5,
    uTriggerTime: 100000000000,
  },
  // Vertex Shader
  glsl`
    attribute vec3 pos1;
    attribute vec3 pos2;
    varying vec2 vUv;
    uniform vec3 uSpherePos;
    attribute float size;
    attribute float colorRand;
    uniform float uTime;
    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;
    varying float colorRandom;
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    void main() {
      // Setting up the varyings
      vUv = uv;
      colorRandom = colorRand;

      // vec3 pos = pos2 * cos(uTime * 0.1) + pos1*sin(uTime*0.1);

      vec3 pos = vec3(0.0);  
      float t = 0.0;
      float noiseScale = 0.1;

      if(uSwitch == true) {
        noiseScale = smoothstep(1.0, 0.0, (uTime - uTriggerTime)/uAnimationDuration) * 0.1;
        t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        pos = mix(pos1, pos2, t);
      } else {
        noiseScale = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration) * 0.1;
        t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        pos = mix(pos2, pos1, t);
      }
      
      // Setting particle position 
      vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;

      // Simplex noise generation
      float noiseFreq = 1.5;
      float noiseAmp = 0.5;
      float slowTime = 0.1;
      vec3 noisePos = vec3(size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime);
      float simplexNoise = snoise3(noisePos) * noiseAmp;

      // Perlin noise generation
      float perlinNoise = cnoise(particle_position + uTime * 0.1) * noiseScale;

      // Creating mouse interactive behaviour
      // float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - particle_position.xy) , 0.0, 1.0), 2.0);
      float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - particle_position.xy) -0.0, 0.0, 1.0), 5.0);

      vec3 dir = particle_position - uSpherePos;
      particle_position = mix(particle_position, uSpherePos + normalize(dir)*0.1, distanceToSphere*noiseScale*10.0);

      // // Applying noise to partice positions
      // particle_position.x += simplexNoise*sin(uTime * slowTime);
      // particle_position.y += simplexNoise*sin(uTime * slowTime);

      // Applying noise to partice positions
      
      // Simplex noise
      // particle_position.x += simplexNoise;
      // particle_position.y += simplexNoise;
      // particle_position = particle_position + normalize(particle_position) * simplexNoise * 1.0;

      // Perlin noise
      // if(uSwitch == true) {
      //   particle_position.x += perlinNoise * clamp(1.0/t -0.5, 0.0, 1.0);
      //   particle_position.y += perlinNoise * clamp(1.0/t -0.5, 0.0, 1.0);
      // } else {
      //   particle_position.x += perlinNoise * t;
      //   particle_position.y += perlinNoise * t;
      // }
      // particle_position = particle_position + normalize(particle_position) * perlinNoise * 1.0;

      particle_position.x += perlinNoise;
      particle_position.y += perlinNoise;

      // Setting size of particles and rendering them
      vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
      // view_pos.xyz += position * clamp((size + perlinNoise*10.0 + 0.5), 1.0, 2.5) * 1.0;
      // view_pos.xyz += position * clamp((size*clamp(noiseScale * 10.0, 0.0, 1.0) + perlinNoise*10.0 + 0.5), 1.0, 2.5) * 1.0;
      // view_pos.xyz += position * 2.5;
      // view_pos.xyz += position * 1.0;
      view_pos.xyz += position * 0.75;
      gl_Position = projectionMatrix * view_pos;

    }
    //   void main() {
    //     vUv = uv;
    //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    // }
    `,
  // Fragment Shader
  glsl`
    varying vec2 vUv;
    uniform sampler2D uTexture;
    varying float colorRandom;
    uniform vec3 uColorPurple;
    uniform vec3 uColorBlue;
    uniform vec3 uColorGreen;
    uniform float uTime;
    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;

    void main() {
        vec4 texture = texture2D(uTexture, vUv);
        vec3 color = vec3(0.0);

        if (colorRandom >= 0.0 && colorRandom < 0.10) {
          color = uColorPurple;
        } else if (colorRandom >= 0.10 && colorRandom < 0.66) {
          color = uColorBlue;
        } else {
          color = uColorGreen;
        }

        float t = 0.0;
        float alpha = 1.0;
        
        if(uSwitch == true) {
          t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/(uAnimationDuration + 0.5)); // Interpolation factor
          alpha = mix(1.0, 0.0, t);
        } else {
          t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
          alpha = mix(0.0, 1.0, t);
        }

        gl_FragColor = vec4(vUv,0.0,alpha);
        // gl_FragColor = texture;
        // gl_FragColor = vec4(color, texture.a) * 1.0;
    }
    `
)

extend({ SpaceDustShaderMaterial })

const SpaceDustTest = ({ particleCount, isParticleModelVisible }) => {
  const { nodes } = useGLTF('./models/v18_10.glb')
  const geometry = useMemo(() => {
    // nodes['outer-spiral'].geometry.rotateX(Math.PI / 2)
    return nodes['outer-spiral'].geometry
  }, [nodes])

  const { viewport } = useThree()

  const ANIMATION_DURATION = 0.5

  const [debouncedIsParticleVisible, setDebouncedIsParticleModelVisible] =
    useState(isParticleModelVisible)
  const [animationCounter, setAnimationCounter] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      setMousePosition({ x, y })
    }
    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const mesh = useRef()
  const sphereRef = useRef(new Vector3(0, 0, 0))
  let sphereVelocity = useRef(new Vector3(0, 0, 0))

  const [random, setRandom] = useState(new Float32Array(particleCount * 3))
  const [ordered, setOrdered] = useState(new Float32Array(particleCount * 3))

  useEffect(() => {
    let randomPositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      // let x = Math.random() * 50 - 25
      // let y = Math.random() * 10 - 5
      // let z = Math.random() * 2

      let x =
        Math.random() * (viewport.width + 0.2) - (viewport.width + 0.2) / 2
      let y =
        Math.random() * (viewport.height + 0.2) - (viewport.height + 0.2) / 2
      let z = Math.random() * 2 * 0.2

      randomPositions.set([x, y, z], i * 3)
    }

    setRandom(randomPositions)

    let largeLength = geometry.attributes.position.array.length
    let smallLength = randomPositions.length
    let interval = Math.floor(largeLength / smallLength)

    let completeTarget = []
    let innerIndex = 0
    let populateIndex = 0

    for (let i = 0; i < largeLength; i = i + 3) {
      completeTarget[innerIndex] = {
        x: geometry.attributes.position.array[i] * 0.2 + 0.5,
        y: geometry.attributes.position.array[i + 1] * 0.2,
        z: geometry.attributes.position.array[i + 2] * 0.2,
      }
      innerIndex++
    }

    let orderedPositions = new Float32Array(smallLength)

    for (let i = 0; i < particleCount; i++) {
      let x = completeTarget[populateIndex].x
      let y = -completeTarget[populateIndex].z
      let z = completeTarget[populateIndex].y

      orderedPositions.set([x, y, z], i * 3)
      populateIndex = populateIndex + interval
    }

    setOrdered(orderedPositions)

    mesh.current.geometry.setAttribute(
      'pos1',
      new InstancedBufferAttribute(randomPositions, 3, false)
    )
    mesh.current.geometry.setAttribute(
      'pos2',
      new InstancedBufferAttribute(orderedPositions, 3, false)
    )

    //creates a weird but nice chromatic abbrations effect i guess
    // mesh.current.geometry.rotateX(Math.PI / 2)

    let size = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // let s = Math.random() * 2 + 1
      size[i] = Math.random() * 1.5
    }

    mesh.current.geometry.setAttribute(
      'size',
      new InstancedBufferAttribute(size, 1, false)
    )

    let colorRand = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i++) {
      // let s = Math.random() * 2 + 1
      colorRand[i] = Math.random() * 1
    }

    mesh.current.geometry.setAttribute(
      'colorRand',
      new InstancedBufferAttribute(colorRand, 1, false)
    )
  }, [mesh, particleCount])

  let elapsedTime = useRef(0)
  let triggerTime = useRef(0)

  let somethingRef = useRef(null)

  useEffect(() => {
    if (animationCounter < 2) {
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

  useEffect(() => {
    triggerTime.current = elapsedTime.current

    mesh.current.material.uniforms.uTriggerTime.value = elapsedTime.current
    mesh.current.material.uniforms.uSwitch.value = debouncedIsParticleVisible

    if (!mesh.current.geometry.attributes.pos) return
  }, [debouncedIsParticleVisible])

  useFrame((state) => {
    const time = state.clock.getElapsedTime()

    elapsedTime.current = time

    const directionToTarget = new Vector3(
      (mousePosition.x * viewport.width) / 2,
      (mousePosition.y * viewport.height) / 2,
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

    // sphereRef.current.lerp(
    //   new Vector3(
    //     (mousePosition.x * viewport.width) / 2,
    //     (mousePosition.y * viewport.height) / 2,
    //     0
    //   ),
    //   0.1
    // )

    mesh.current.material.uniforms.uSpherePos.value = sphereRef.current

    mesh.current.material.uniforms.uTime.value = time
  })

  return (
    <instancedMesh
      ref={mesh}
      args={[null, null, particleCount]}
      // rotation={[Math.PI / 2, 0, Math.PI]}
    >
      <planeGeometry args={[0.005, 0.005]} />
      <spaceDustShaderMaterial
        transparent
        depthTest={false}
        ref={somethingRef}
      />
    </instancedMesh>
  )
}

export default SpaceDustTest
