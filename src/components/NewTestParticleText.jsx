import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber'
import { OrbitControls, shaderMaterial, useGLTF } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import gsap from 'gsap'

import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'
import {
  Bloom,
  ChromaticAberration,
  DepthOfField,
  EffectComposer,
} from '@react-three/postprocessing'

const SomeWeirdShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTexture: null,
    uMask: new THREE.TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
    uTime: 0,
    uMousePos: new THREE.Vector3(-20, 0, 0),
    uColorPurple: new THREE.Color(1.0, 0.38, 1.0),
    uColorBlue: new THREE.Color(0.35, 0.51, 0.98),
    uColorGreen: new THREE.Color(0.04, 0.66, 0.72),

    uSwitch: true,
    uAnimationTime: 0,
    uAnimationDuration: 2,
    uTriggerTime: 100000000000,
  },
  // Vertex Shader
  glsl`
    attribute vec3 aWordPos;
    attribute vec3 aSpreadPos;
    attribute float aRandom;
    attribute float aColorRandom;
    varying float vRandom;
    varying float vColorRandom;
    varying vec2 vUv;
    uniform float uTime;
    uniform vec3 uMousePos;


    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;


    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    vec3 snoiseVec3( vec3 x ){

      float s  = snoise3(vec3( x ));
      float s1 = snoise3(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise3(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;
    
    }
    
    
    vec3 curlNoise( vec3 p ){
      
      const float e = .1;
      vec3 dx = vec3( e   , 0.0 , 0.0 );
      vec3 dy = vec3( 0.0 , e   , 0.0 );
      vec3 dz = vec3( 0.0 , 0.0 , e   );
    
      vec3 p_x0 = snoiseVec3( p - dx );
      vec3 p_x1 = snoiseVec3( p + dx );
      vec3 p_y0 = snoiseVec3( p - dy );
      vec3 p_y1 = snoiseVec3( p + dy );
      vec3 p_z0 = snoiseVec3( p - dz );
      vec3 p_z1 = snoiseVec3( p + dz );
    
      float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;
    
      const float divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );
    
    }
    

    void main() {
        vUv = uv;
        vRandom = aRandom;
        vColorRandom = aColorRandom;

        // Generate random values
        float rand1 = fract(sin(dot(aWordPos.xy, vec2(12.9898, 78.233))) * 43758.5453);
        float rand2 = fract(sin(dot(aWordPos.xy, vec2(37.3792, 63.9123))) * 43758.5453);


        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        vec3 pos = vec3(0.0);  
        float t = 0.0;
        float noiseScale = 1.0;

        if(uSwitch == true) {
          noiseScale = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration);
          t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
          pos = mix(aWordPos, aSpreadPos, t);
        } else {
          noiseScale = smoothstep(1.0, 0.0, (uTime - uTriggerTime)/uAnimationDuration);
          t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
          pos = mix(aSpreadPos, aWordPos, t);
        }
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////

        

        vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;

        // // Perlin noise generation
        float perlinNoise = cnoise(particle_position + uTime * 0.001);
        float perlinNoise2 = cnoise(aSpreadPos*aRandom + aRandom*aRandom);

        // // Perlin noise
        // particle_position.x += 0.1*perlinNoise;
        // particle_position.y += 0.1*perlinNoise;
        // particle_position = particle_position + normalize(particle_position) * perlinNoise * 0.2;

        // vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
        // view_pos.xyz += position  * 1.2*perlinNoise ;
        // gl_Position = projectionMatrix * view_pos;


        vec3 distortion = curlNoise(vec3(
          particle_position.x , 
          particle_position.y ,
          0.0
          ));

        vec3 final_position = particle_position + 0.0*distortion +0.0;  
        final_position.y = final_position.y + noiseScale*(-7.0 + aRandom*10.0);
        final_position.x = final_position.x + noiseScale*(perlinNoise*0.5);


        // float distanceToSphere = pow(2.0 - clamp(length(uMousePos.xy - final_position.xy), 0.0, 1.0), 9.0);
        // vec3 dir = final_position - uMousePos;
        // final_position = mix(final_position, uMousePos + normalize(dir)*0.01, distanceToSphere*0.01);

        float distanceToSphere = pow(2.0 - clamp(length(uMousePos.xy - final_position.xy), 0.0, 1.0), 9.0);
        vec3 dir = final_position - uMousePos;
        final_position = mix(final_position, uMousePos + normalize(dir)*0.01, (1.0-noiseScale) * distanceToSphere*0.00745);


        vec4 view_pos = viewMatrix * vec4(final_position, 1.0);
        view_pos.xyz += position * clamp(10.0*rand1, 1.0, 1.0*(1.0-noiseScale) +1.3);
        // view_pos.xyz += position * 1.0;
        // view_pos.xyz += position * 10.0;
        // gl_Position = projectionMatrix * view_pos;
        gl_Position = projectionMatrix * view_pos;

        // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  // Fragment Shader
  glsl`
    varying vec2 vUv;
    varying float vRandom;
    varying float vColorRandom;
    uniform vec3 uColorPurple;
    uniform vec3 uColorBlue;
    uniform vec3 uColorGreen;
    uniform sampler2D uMask;
    uniform sampler2D uTexture;
    

    void main() {
        // vec4 color = texture2D(uTexture, vUv);
        vec4 maskTexture = texture2D(uMask, vUv);
        // vec4 image = texture2D(uTexture, newUv);

        // gl_FragColor = image;
        // gl_FragColor.a *= maskTexture.a;
        // gl_FragColor = vec4(newUv,0.0, 1.0);
        // gl_FragColor.a *= maskTexture.a;


        // Generate random values
        float rand1 = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
        float rand2 = fract(sin(dot(vUv, vec2(37.3792, 63.9123))) * 43758.5453);

        vec3 color = vec3(0.0);

        if (vColorRandom >= 0.0 && vColorRandom < 0.30) {
          color = uColorPurple;
        } else if (vColorRandom >= 0.30 && vColorRandom < 0.66) {
          color = uColorBlue;
        } else {
          color = uColorGreen;
        }

        vec2 centeredUV = vUv - vec2(0.5);
        float radius = 0.5;
        float distanceFromCenter = length(centeredUV);

        // gl_FragColor = vec4(color, step(distanceFromCenter,radius)) * 1.0;
        gl_FragColor = vec4(color, maskTexture.a) * 1.0;
        // gl_FragColor = vec4(vUv, 0.0,1.0) * 1.0;

        // if(vRandom < 1.0) {
        //   // discard;
        //   // gl_FragColor = vec4(vUv, 0.0, 1.0);
        //   // gl_FragColor.a *= maskTexture.a;
        //   gl_FragColor = vec4(color, maskTexture.a) * 1.0;
        // } else {
        //   gl_FragColor = vec4(0.0);
        // }
      
    }
    `
)

extend({ SomeWeirdShaderMaterial })

const NewTestParticleText = () => {
  return (
    <div className="w-full h-screen">
      <Canvas className="w-full h-full">
        <CanvasStuff />
        {/* <EffectComposer>
          <Bloom
            mipmapBlur
            luminanceThreshold={0}
            intensity={0}
            radius={0.5}
          />
        </EffectComposer> */}
      </Canvas>
    </div>
  )
}

export default NewTestParticleText

const vec = new THREE.Vector3(-20, 0, 0)

const CanvasStuff = () => {
  const { viewport, camera } = useThree()

  // const { nodes } = useGLTF('./models/v3_Text.glb')
  const { nodes } = useGLTF('./models/v3_Get_In_Touch.glb')

  const [someState, setSomeState] = useState(true)

  let meshRef = useRef(null)
  let floatingParentRef = useRef(null)
  let floatingIntermediateRef = useRef(null)

  const textGeo = useMemo(() => {
    const geometry = nodes.Text.geometry
    // geometry.rotateX(Math.PI / 2)
    return geometry
  }, [nodes])

  const cylinderGeo = useMemo(() => {
    const geometry = new THREE.CylinderGeometry(
      5,
      5,
      viewport.height * 2,
      50,
      50
    )
    return geometry
  }, [viewport])

  let mousePos = useRef({ x: 0, y: 0 })
  let delayedPos = useRef(new THREE.Vector3(-20, 0, 0))

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

  const [particleCount, setParticleCount] = useState(0)

  useEffect(() => {
    if (meshRef.current) {
      console.log(cylinderGeo.attributes.position)

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
    let allPositions = []
    let positivePositionsZ = []
    let innerIndex = 0

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
    console.log(pCount)
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
  }, [meshRef, textGeo])

  let elapsedTime = useRef(0)
  let triggerTime = useRef(0)

  let prevDelayedPos = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state) => {
    console.log(state.camera)
    elapsedTime.current = state.clock.getElapsedTime()

    meshRef.current.material.uniforms.uTime.value = state.clock.getElapsedTime()
    const mousePosTHREE = new THREE.Vector3(
      (mousePos.current.x * state.viewport.width) / 2,
      (mousePos.current.y * state.viewport.height) / 2,
      0
    )
    delayedPos.current.lerp(
      vec.set(mousePosTHREE.x, mousePosTHREE.y, mousePosTHREE.z),
      0.1
    )
    meshRef.current.material.uniforms.uMousePos.value = delayedPos.current

    // if (someState) {
    //   floatingParentRef.current.rotation.z = THREE.MathUtils.degToRad(
    //     Math.cos(state.clock.getElapsedTime() * 0.1) * 30
    //   )
    // }

    // const angleVeritcal = Math.atan(delayedPos.current.y / 5)
    // const angleHorizontal = Math.atan(delayedPos.current.x / 5)

    // const angleTilt = delayedPos.current.clone().sub(prevDelayedPos.current).x

    // camera.rotateX(angleVeritcal * 0.003)
    // camera.rotateY(-angleHorizontal * 0.001)
    // camera.rotateZ(angleTilt * 0.02)

    // const totalAngle = Math.abs(angleVeritcal) + Math.abs(angleHorizontal)

    // camera.position.z = 5 + totalAngle * 0.01

    // // console.log(prevDelayedPos)

    // prevDelayedPos.current = delayedPos.current.clone()
  })

  useEffect(() => {
    triggerTime.current = elapsedTime.current

    meshRef.current.material.uniforms.uTriggerTime.value = elapsedTime.current
    meshRef.current.material.uniforms.uSwitch.value = someState
    // if (debouncedIsParticleVisible) {
    //   gsap.to(meshRef.current.rotation, {
    //     y: Math.PI / 2,
    //     duration: 0.5,
    //   })
    // } else {
    //   gsap.to(meshRef.current.rotation, {
    //     y: 0,
    //     duration: 0.5,
    //   })
    // }
  }, [someState])

  let particleAnimationRef1 = useRef(null)
  let particleAnimationRef2 = useRef(null)
  let particleAnimationRef3 = useRef(null)

  useEffect(() => {
    if (someState) {
      particleAnimationRef1.current?.kill()
      particleAnimationRef2.current?.kill()
      particleAnimationRef3.current?.kill()

      // gsap.to(floatingParentRef.current.rotation, {
      //   // add the sin function thing here to introduce a swing
      //   z: THREE.MathUtils.degToRad(30),
      //   duration: 2,
      //   ease: 'sine.inOut',
      //   // repeat: -1,
      //   // yoyo: true,
      // })

      particleAnimationRef1.current = gsap.to(
        floatingIntermediateRef.current.rotation,
        {
          y: 2 * Math.PI,
          duration: 200,
          ease: 'linear',
          repeat: -1,
        }
      )

      let randomTiltAngle =
        Math.random() < 1.0
          ? THREE.MathUtils.degToRad(30)
          : THREE.MathUtils.degToRad(-30)

      gsap.to(floatingParentRef.current.rotation, {
        // add the sin function thing here to introduce a swing
        z: randomTiltAngle,
        duration: 2,
        ease: 'sine.inOut',
        // repeat: -1,
        // yoyo: true,
      })

      particleAnimationRef2.current = gsap.to(
        floatingParentRef.current.rotation,
        {
          delay: 2,
          // add the sin function thing here to introduce a swing
          z: THREE.MathUtils.degToRad(-randomTiltAngle),
          duration: 100,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }
      )
      // particleAnimationRef3.current = gsap.to(meshRef.current.rotation, {
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
      particleAnimationRef1.current?.kill()
      particleAnimationRef2.current?.kill()
      particleAnimationRef3.current?.kill()

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
          // add the sin function thing here to introduce a swing
          z: THREE.MathUtils.degToRad(0),
          duration: 2,
          ease: 'sine.inOut',
          // repeat: -1,
          // yoyo: true,
        }
      )
    }
  }, [someState])

  // useEffect(() => {
  //   let interval

  //   interval = setInterval(() => {
  //     setSomeState((v) => !v)
  //     // meshRef.current.material.uniforms.uSwitch.value =
  //     //   !meshRef.current.material.uniforms.uSwitch.value
  //   }, 20000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  // useEffect(() => {
  //   setTimeout(() => {
  //     let someObj = { x: 0 }

  //     gsap.to(someObj, {
  //       x: 100,
  //       duration: 2,
  //       onUpdate: () => {

  //       }
  //     })
  //   }, 5000)
  // }, [])

  // useEffect(() => {
  //   console.log(
  //     (floatingParentRef.current.rotation.z = THREE.MathUtils.degToRad(10))
  //   )
  // }, [meshRef])

  return (
    <>
      <OrbitControls />
      <mesh
        scale={1}
        ref={floatingParentRef}
        rotation={[0, 0, THREE.MathUtils.degToRad(0)]}
        // visible={false}
      >
        <mesh ref={floatingIntermediateRef}>
          <instancedMesh
            ref={meshRef}
            args={[null, null, particleCount]}
            rotation={[0, 0, 0]}
            // scale={1}
            scale={0.8}
          >
            {/* <circleGeometry args={[0.01]} /> */}
            {/* <planeGeometry args={[0.015, 0.015]} /> works well with scale=1 */}
            <planeGeometry args={[0.01, 0.01]} />
            <someWeirdShaderMaterial
              transparent
              depthTest={false}
              depthWrite={false}
            />
          </instancedMesh>
        </mesh>
      </mesh>
    </>
  )
}

// {/* <instancedMesh
//         ref={meshRef}
//         args={[null, null, particleCount]}
//         rotation={[0, 0, 0]}
//         // scale={1}
//         scale={0.8}
//       >
//         {/* <circleGeometry args={[0.01]} /> */}
//         {/* <planeGeometry args={[0.015, 0.015]} /> works well with scale=1 */}
//         <planeGeometry args={[0.01, 0.01]} />
//         <someWeirdShaderMaterial
//           transparent
//           depthTest={false}
//           depthWrite={false}
//         />
//       </instancedMesh> */}
