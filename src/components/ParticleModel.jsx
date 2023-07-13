import { Canvas, extend, useFrame, useThree } from '@react-three/fiber'
import React, {
  useState,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  forwardRef,
} from 'react'
import V18_8 from './V18_8'
import {
  OrbitControls,
  shaderMaterial,
  useGLTF,
  Sphere,
} from '@react-three/drei'
import {
  SphereGeometry,
  InstancedBufferAttribute,
  TextureLoader,
  Color,
  Vector3,
} from 'three'
import glsl from 'babel-plugin-glsl/macro'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const ParticleShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uSpherePos: new Vector3(-20, 0, 0),
    uTexture: new TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
    // uColorPurple: new Color(0.76, 0.38, 1.0),
    uColorPurple: new Color(5.0, 0.38, 5.0),
    uColorBlue: new Color(0.35, 0.51, 0.98),
    uColorGreen: new Color(0.04, 0.66, 0.72),
    uSwitch: false,
    uAnimationTime: 0,
    uAnimationDuration: 0.5,
    uTriggerTime: 100000000000,
  },
  // Vertex Shader
  glsl`
    attribute vec3 pos;
    varying vec2 vUv;
    uniform vec3 uSpherePos;
    attribute float size;
    attribute float colorRand;
    uniform float uTime;
    varying float colorRandom;
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    void main() {
      // Setting up the varyings
      vUv = uv;
      colorRandom = colorRand;

      // Setting particle position
      vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;
      // particle_position.y = particle_position.y - 2.5;

      // // Simplex noise generation
      // float noiseFreq = 1.5;
      // float noiseAmp = 0.5;
      // float slowTime = 0.1;
      // vec3 noisePos = vec3(size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime);
      // float simplexNoise = snoise3(noisePos) * noiseAmp;

      // // Perlin noise generation
      float perlinNoise = cnoise(particle_position + uTime * 0.1);

      // // Creating mouse interactive behaviour
      // float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - particle_position.xy) -0.0, 0.0, 1.0), 10.0);
      // vec3 dir = particle_position - uSpherePos;
      // particle_position = mix(particle_position, uSpherePos + normalize(dir)*0.3, distanceToSphere*0.1);

      // // // Applying noise to partice positions
      // // particle_position.x += simplexNoise*sin(uTime * slowTime);
      // // particle_position.y += simplexNoise*sin(uTime * slowTime);

      // // Applying noise to partice positions

      // // Simplex noise
      // // particle_position.x += simplexNoise;
      // // particle_position.y += simplexNoise;
      // // particle_position = particle_position + normalize(particle_position) * simplexNoise * 1.0;

      // // Perlin noise
      // particle_position.x += perlinNoise;
      // particle_position.y += perlinNoise;
      // particle_position = particle_position + normalize(particle_position) * perlinNoise * 0.05;

      // // Setting size of particles and rendering them
      // vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
      // view_pos.xyz += position * (size + perlinNoise) * 1.0;
      // gl_Position = projectionMatrix * view_pos;
      vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
      view_pos.xyz += position  * 1.0;
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
      float alpha = 0.0;
      
      if(uSwitch == true) {
        t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        alpha = mix(0.0, 1.0, t);
      } else {
        t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/(uAnimationDuration + 0.5)); // Interpolation factor
        alpha = mix(1.0, 0.0, t);
      }

      gl_FragColor = vec4(vUv,0.0,alpha);
      // gl_FragColor = texture;
      // gl_FragColor = vec4(color, texture.a) * 0.8;
    }
    `
)

extend({ ParticleShaderMaterial })

const ParticleModel = ({ isParticleModelVisible }) => {
  let parentRef = useRef(null)
  return (
    <div
      className="w-full h-screen fixed inset-0 z-[-20] "
      ref={parentRef}
    >
      <Canvas camera={{ fov: 10 }}>
        {/* <OrbitControls /> */}
        {/* <V18_8 /> */}
        <Particles
          ref={parentRef}
          isParticleModelVisible={isParticleModelVisible}
        />
        {/* <EffectComposer>
        <Bloom
          mipmapBlur
          luminanceThreshold={0}
          intensity={1}
          radius={0.8}
        />
      </EffectComposer> */}
      </Canvas>
    </div>
  )
}

export default ParticleModel

const Particles = forwardRef(({ isParticleModelVisible }, ref) => {
  const { nodes } = useGLTF('./models/v18_10.glb')
  const { viewport } = useThree()

  const ANIMATION_DURATION = 0.5

  const [debouncedIsParticleVisible, setDebouncedIsParticleModelVisible] =
    useState(isParticleModelVisible)
  const [animationCounter, setAnimationCounter] = useState(0)

  let parentRef = useRef(null)
  let meshRef = useRef(null)

  const sphereRef = useRef(new Vector3(0, 0, 0))
  let sphereVelocity = useRef(new Vector3(0, 0, 0))
  let mousePos = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    // nodes['outer-spiral'].geometry.rotateX(Math.PI / 2)
    return nodes['outer-spiral'].geometry
  }, [nodes])

  let elapsedTime = useRef(0)
  let triggerTime = useRef(0)

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

    meshRef.current.material.uniforms.uTriggerTime.value = elapsedTime.current
    meshRef.current.material.uniforms.uSwitch.value = debouncedIsParticleVisible

    if (!meshRef.current.geometry.attributes.pos) return
  }, [debouncedIsParticleVisible])

  useEffect(() => {
    // gsap.to(meshRef.current.rotation, {
    //   scrollTrigger: {
    //     trigger: document.getElementById('root'),
    //     onUpdate: (self) => {
    //       // scrollSomething.current = self.progress
    //     },

    //     scrub: 1,
    //   },
    //   z: Math.PI * 3,
    // })

    // gsap.ticker.add(() => {
    //   // meshRef.current.rotation.z -= 0.01
    //   meshRef.current.rotation.set(
    //     Math.PI / 2,
    //     0,
    //     meshRef.current.rotation.z - 0.01
    //   )
    // })

    // console.log(meshRef.current.rotation)

    // gsap.to(meshRef.current.rotation, {
    //   z: '-=3.14',
    //   duration: 2,
    //   repeat: -1,
    //   ease: 'linear',
    // })
    // gsap.to(meshRef.current.rotation, {
    //   scrollTrigger: {
    //     trigger: document.getElementById('root'),
    //     onUpdate: (self) => {
    //       console.log(self.progress)
    //       scrollSomething.current = self.progress
    //     },
    //     scrub: 3,
    //   },
    //   z: Math.PI * 2,
    //   // duration: 2,
    // })

    // ScrollTrigger.create({
    //   trigger: document.getElementById('root'),
    //   onUpdate: (self) => {
    //     console.log(self.progress)
    //   },
    // })

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
    // const geometry = new SphereGeometry(1, 100, 100)
    // console.log(geometry.attributes.position.array)

    const test = new InstancedBufferAttribute(
      geometry.attributes.position.array,
      3,
      false
    )
    // console.log(test)

    meshRef.current.geometry.setAttribute(
      'pos',
      new InstancedBufferAttribute(geometry.attributes.position.array, 3, false)
    )

    let colorRand = new Float32Array(geometry.attributes.position.count)
    for (let i = 0; i < geometry.attributes.position.count; i++) {
      // let s = Math.random() * 2 + 1
      colorRand[i] = Math.random() * 1
    }

    meshRef.current.geometry.setAttribute(
      'colorRand',
      new InstancedBufferAttribute(colorRand, 1, false)
    )
  }, [meshRef])

  let dumb = useRef(null)

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
    // dumb.current.position.add(sphereVelocity.current)

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

    // meshRef.current.rotation.y -= 0.001
    // parentRef.current.rotation.z -= 0.001
    meshRef.current.material.uniforms.uSpherePos.value = sphereRef.current

    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
  })
  return (
    <>
      {/* <Sphere
        args={[0.01]}
        ref={dumb}
      /> */}
      <mesh
        ref={parentRef}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.2}
        position={[0.5, 0, 0]}
      >
        <instancedMesh
          args={[null, null, geometry.attributes.position.count]}
          ref={meshRef}
        >
          <planeGeometry
            args={[0.002, 0.002]}
            // args={[0.05, 0.05]}
          />
          <particleShaderMaterial
            transparent
            depthTest={false}
          />
        </instancedMesh>
      </mesh>
      {/* <mesh
        scale={0.25}
        position={[0.5, 0, 0]}
        rotateX={Math.PI / 2}
        ref={meshRef}
      >
        <V18_8 />
      </mesh>
      <directionalLight
        intensity={10}
        color="purple"
        position={[0, 0, 10]}
      /> */}
    </>
  )
})
