import { useEffect, useMemo, useRef, useState } from 'react'
import {
  Vector3,
  Vector2,
  Color,
  TextureLoader,
  InstancedBufferAttribute,
} from 'three'
import { useThree, useFrame, Canvas, extend } from '@react-three/fiber'
import {
  Circle,
  OrbitControls,
  Sphere,
  shaderMaterial,
  useGLTF,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import gsap from 'gsap'
import { useSelector, useDispatch } from 'react-redux'
import { toggleBloomTheme } from '../features/three/threeSlice'
import MouseTrail from './MouseTrail'
import TestMouseParticles from './TestMouseParticles'
import glsl from 'babel-plugin-glsl/macro'

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
    // uColorPurple: new Color(5.0 / 10, 0.38 / 10, 5.0 / 10),
    // uColorBlue: new Color(0.35 / 10, 0.51 / 10, 0.98 / 10),
    // uColorGreen: new Color(0.04 / 10, 0.66 / 10, 0.72 / 10),
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
      // float perlinNoise = cnoise(particle_position + uTime * 0.1);

      // Creating mouse interactive behaviour
      float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - particle_position.xy) -0.0, 0.0, 1.0), 10.0);
      vec3 dir = particle_position - uSpherePos;
      particle_position = mix(particle_position, uSpherePos + normalize(dir)*0.3, distanceToSphere*0.1);

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
      // // particle_position = particle_position + normalize(particle_position) * perlinNoise * 1.0;


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

      // gl_FragColor = vec4(vUv,0.0,1.);
      // gl_FragColor = texture;
      gl_FragColor = vec4(color/10.0, texture.a) * 1.0;
    }
    `
)

extend({ ParticleShaderMaterial })

const BloomCanvas = () => {
  let composerRef = useRef(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // const [bloomTheme, setBloomTheme] = useState(new Color(0.76, 0.38, 1.0))
  // const { mousePosition } = useSelector((state) => state.threeStore)
  let mainRef = useRef()

  // useEffect(() => {
  //   function handle(event) {
  //     const { clientX, clientY } = event

  //     const x = (clientX / window.innerWidth) * 2 - 1
  //     const y = -(clientY / window.innerHeight) * 2 + 1

  //     setMousePosition({ x, y })
  //   }

  //   document.addEventListener('mousemove', handle)

  //   return () => {
  //     document.removeEventListener('mousemove', handle)
  //   }
  // }, [])

  return (
    <div className="w-screen h-screen fixed inset-0 z-20">
      <Canvas
        className="w-full h-full absolute inset-0  "
        // camera={{ position: [0, 0, 50], fov: 20 }}
        camera={{ fov: 10 }}
        ref={mainRef}
      >
        <BloomSphere

        // mousePosition={mousePosition}
        />

        <EffectComposer ref={composerRef}>
          <Bloom
            mipmapBlur
            luminanceThreshold={0}
            intensity={1.42}
            radius={0.7}
          />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

export default BloomCanvas

const BloomSphere = ({ vec = new Vector3() }) => {
  const dispatch = useDispatch()
  const viewport = useThree((state) => state.viewport)
  const { bloomTheme } = useSelector((state) => state.threeStore)

  // const [sphereVelocity, setSphereVelocity] = useState(new Vector3())
  let sphereVelocity = useRef(new Vector3(0, 0, 0))

  let bloomSphereRef = useRef(null)

  useEffect(() => {
    // bloomSphereRef.current.material.color.lerp(bloomTheme, 0.5)
    gsap.to(bloomSphereRef.current.material.color, {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
  }, [bloomTheme])

  const [circlePositions, setCirclePositions] = useState([])
  const [circleVelocities, setCircleVelocities] = useState(null)

  // const [bloomSphere, setBloomSphere] = useState()
  const [spherePos, setSpherePos] = useState(new Vector3(0, 0, 0))

  let tempArray = useRef([])

  let mousePos = useRef({ x: 0, y: 0 })

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

  const [velo, setVelo] = useState(new Vector3(0, 0, 0))

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

    const directionToTarget = new Vector3(
      (mousePos.current.x * viewport.width) / 2,
      (mousePos.current.y * viewport.height) / 2,
      0
    ).sub(bloomSphereRef.current.position.clone())

    const distanceToTarget = directionToTarget.length()

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    // let accelerationFactor = 0.2
    // let dampingFactor = -0.42

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = sphereVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    bloomSphereRef.current.position.add(sphereVelocity.current)

    // setSpherePos(bloomSphereRef.current.position.clone())

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    // setVelo(sphereVelocity.current.clone())
    // const randomNumber = Math.floor(Math.random() * 10)

    // if (randomNumber === 5) {
    //   // console.log(bloomSphereRef.current.position)
    //   setCirclePositions((prevValue) => [
    //     ...prevValue,
    //     bloomSphereRef.current.position.clone(),
    //   ])
    // }
  })

  useEffect(() => {
    // console.log('help')
  })

  useEffect(() => {
    // console.log(circlePositions)
    // if (circlePositions.length > 3) {
    //   const tempArray = [...circlePositions]
    //   tempArray.shift()
    //   // console.log(tempArray)
    //   setCirclePositions(tempArray)
    //   // console.log('entry removed')
    //   // setCirclePositions((prevPositions) => prevPositions.slice(1))
    // }
    // console.log(circlePositions)
    // console.log(circlePositions.length)
  }, [circlePositions])

  const killCircle = (index) => {
    // const tempArray = [...circlePositions]
    // console.log(tempArray)
    // tempArray.shift()
    // setCirclePositions(tempArray)
    // console.log('kill')

    // setCirclePositions(tempArray.slice(1))
    const tempArray = [...circlePositions]
    tempArray.splice(index, 1)
    setCirclePositions(tempArray)
    // setCirclePositions((prevValue) => prevValue.slice(1))
    // console.log(circlePositions.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Add a new particle position to the array
      setCirclePositions((prevPositions) => {
        const newPosition = bloomSphereRef.current.position.clone()
        // Limit the array length to a maximum of 3
        const updatedPositions = [...prevPositions, newPosition].slice(-10)
        return updatedPositions
      })
    }, 1000) // Add a new particle every 1 second

    return () => {
      clearInterval(interval) // Clear the interval when the component unmounts
    }
  }, [])

  useEffect(() => {
    // console.log('something jappened')
  })

  return (
    <>
      {/* <OrbitControls /> */}
      <Sphere
        position={[0, 0, 0]}
        // args={[0.25]}
        args={[0.01]}
        ref={bloomSphereRef}
        // ref={setBloomSphere}
        onClick={() => {
          dispatch(toggleBloomTheme())
        }}
      >
        <meshBasicMaterial
          // color={new Color(0.48 * 10, 0.33 * 10, 0.83 * 10)}
          toneMapped={false}
          transparent
          opacity={1}
        />
      </Sphere>
      {/* <Particles /> */}
      {/* <TestMouseParticles sphereVelocity={velo} />
      <MouseTrail spherePos={spherePos} /> */}
      {/* {useMemo(
        () => (
          <Circles
            circlePositions={circlePositions}
            killCircle={killCircle}
          />
        ),
        [circlePositions]
      )} */}
      {/* <Circles
        circlePositions={circlePositions}
        killCircle={killCircle}
      /> */}
    </>
  )
}

const Particles = () => {
  const { nodes } = useGLTF('./models/v18_10.glb')
  const { viewport } = useThree()

  let meshRef = useRef(null)

  const sphereRef = useRef(new Vector3(0, 0, 0))
  let sphereVelocity = useRef(new Vector3(0, 0, 0))
  let mousePos = useRef({ x: 0, y: 0 })

  const geometry = useMemo(() => {
    // nodes['outer-spiral'].geometry.rotateX(Math.PI / 2)
    return nodes['outer-spiral'].geometry
  }, [nodes])

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
    // const geometry = new SphereGeometry(1, 100, 100)
    console.log(geometry)

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
    meshRef.current.rotation.z -= 0.001
    meshRef.current.material.uniforms.uSpherePos.value = sphereRef.current

    meshRef.current.material.uniforms.uTime.value = time
  })
  return (
    <>
      {/* <Sphere
        args={[0.01]}
        ref={dumb}
      /> */}
      <instancedMesh
        args={[null, null, geometry.attributes.position.count]}
        ref={meshRef}
        rotation={[Math.PI / 2, 0, 0]}
        scale={0.2}
        position={[0.5, 0, 0]}
      >
        <planeBufferGeometry
          args={[0.001, 0.001]}
          // args={[0.05, 0.05]}
        />
        <particleShaderMaterial
          transparent
          depthTest={false}
        />
      </instancedMesh>
      {/* <mesh
        scale={0.25}
        position={[0.5, 0, 0]}
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
}

const Circles = ({ circlePositions, killCircle }) => {
  useEffect(() => {
    // console.log(circlePositions.length)
    // console.log('rerendering?')
  }, [circlePositions])

  return (
    <>
      {circlePositions.map((pos, i) => {
        console.log('start', i)
        console.log(pos)
        console.log('ends')
      })}
    </>
  )
}

const SingleCircle = ({ position, prevPosition, killCircle, index }) => {
  let circleRef = useRef()

  useEffect(() => {
    // const killTimeout = setTimeout(() => {
    //   // gsap.to(circleRef.current.material, {
    //   //   opacity: 0,
    //   //   duration: 0.2,
    //   //   onComplete: () => {
    //   //     killCircle()
    //   //   },
    //   // })
    //   killCircle(index)
    // }, 1000)

    gsap.to(circleRef.current.material, {
      opacity: 0,
      duration: 0.3,
      // onComplete: () => {
      //   killCircle(index)
      // },
    })

    return () => {
      // console.log('dying')
      // clearTimeout(killTimeout)
    }
  }, [])

  return (
    <Circle
      ref={circleRef}
      args={[0.1]}
      position={[position.x, position.y, position.z]}
    >
      <meshBasicMaterial transparent />
    </Circle>
  )
}

// {/* <Circle
//           args={[0.1]}
//           position={[pos.x, pos.y, pos.z]}
//           key={i}
//         >
//           <meshBasicMaterial />
//         </Circle> */}

// const directionToTarget = new Vector3(
//   (mousePos.current.x * viewport.width) / 2,
//   (mousePos.current.y * viewport.height) / 2,
//   0
// ).sub(bloomSphere.position.clone())

// const distanceToTarget = directionToTarget.length()

// let accelerationFactor = 0.1
// let dampingFactor = -0.3

// // let accelerationFactor = 0.2
// // let dampingFactor = -0.42

// const acceleration = directionToTarget.multiplyScalar(
//   1 * accelerationFactor
// )
// const damping = sphereVelocity.current
//   .clone()
//   .multiplyScalar(1 * dampingFactor)

// bloomSphere.position.add(sphereVelocity.current)

// setSpherePos(bloomSphere.position)

// sphereVelocity.current = sphereVelocity.current
//   .clone()
//   .add(acceleration)
//   .add(damping)

// const randomNumber = Math.floor(Math.random() * 100)

// if (randomNumber === 5) {
//   // console.log(bloomSphereRef.current.position)
//   console.log('somethig haoopened')
//   setCirclePositions(bloomSphereRef.current.position)
//   // setCirclePositions((prevValue) => [
//   //   ...prevValue,
//   //   bloomSphereRef.current.position,
//   // ])
// }

// setCirclePositions([
//   bloomSphereRef.current.position,
//   // bloomSphereRef.current.position,
//   // bloomSphereRef.current.position,
// ])
