// import { useEffect, useRef, useMemo } from 'react'
// import {
//   Object3D,
//   Vector3,
//   InstancedBufferAttribute,
//   Vector2,
//   TextureLoader,
//   Color,
// } from 'three'
// import { useFrame, useThree, extend } from '@react-three/fiber'
// import { Sphere, shaderMaterial } from '@react-three/drei'
// import glsl from 'babel-plugin-glsl/macro'

// const ParticleShaderMaterial = shaderMaterial(
//   // Uniforms
//   {
//     uTime: 0,
//     uSpherePos: new Vector3(20, 0, 0),
//     uTexture: new TextureLoader().load(
//       './particles/—Pngtree—hazy white glow_6016180.png'
//     ),
//     // uColorPurple: new Color(0.76, 0.38, 1.0),
//     uColorPurple: new Color(10.0, 0.38, 10.0),
//     uColorBlue: new Color(0.35, 0.51, 0.98),
//     uColorGreen: new Color(0.04, 0.66, 0.72),
//   },
//   // Vertex Shader
//   glsl`
//       attribute vec3 pos;
//       varying vec2 vUv;
//       uniform vec3 uSpherePos;
//       attribute float size;
//       attribute float colorRand;
//       uniform float uTime;
//       varying float colorRandom;
//       #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
//       #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

//       void main() {
//         // Setting up the varyings
//         vUv = uv;
//         colorRandom = colorRand;

//         // Setting particle position
//         vec3 final_pos = pos + position*1.0;

//         float accelerationFactor = 0.1;
//         float dampingFactor = -0.3;
//         float force = 1.0;

//         vec3 dir = normalize(uSpherePos - final_pos);

//         vec3 displacement = dir * force;

//         // Apply the displacement to the particle's position
//         final_pos = final_pos + displacement;

//         // Creating mouse interactive behaviour
//         // float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - final_pos.xy) -0.3, 0.0, 1.0), 2.0);
//         // vec3 dir = final_pos - uSpherePos;
//         // final_pos = mix(final_pos, uSpherePos + normalize(dir)*0.5, distanceToSphere);

//         // Setting size of particles and rendering them
//         // vec4 view_pos = viewMatrix * vec4(final_pos, 1.0);
//         // view_pos.xyz += position * 1.0;
//         // gl_Position = projectionMatrix * view_pos;

//         gl_Position = projectionMatrix * modelViewMatrix * vec4(final_pos, 1.0);

//       }
//       //   void main() {
//       //     vUv = uv;
//       //     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
//       // }
//       `,
//   // Fragment Shader
//   glsl`
//       varying vec2 vUv;
//       uniform sampler2D uTexture;
//       varying float colorRandom;
//       uniform vec3 uColorPurple;
//       uniform vec3 uColorBlue;
//       uniform vec3 uColorGreen;

//       void main() {
//           vec4 texture = texture2D(uTexture, vUv);
//           vec3 color = vec3(0.0);

//           if (colorRandom >= 0.0 && colorRandom < 0.10) {
//             color = uColorPurple;
//           } else if (colorRandom >= 0.10 && colorRandom < 0.66) {
//             color = uColorBlue;
//           } else {
//             color = uColorGreen;
//           }

//           gl_FragColor = vec4(vUv,0.0,1.);
//           // gl_FragColor = texture;
//         //   gl_FragColor = vec4(color, texture.a) * 1.0;

//       }
//       `
// )

// extend({ ParticleShaderMaterial })

// const MouseTrail = ({ spherePos }) => {
//   let instancedMeshRef = useRef()

//   useEffect(() => {
//     let pos = new Float32Array(100 * 3)
//     for (let i = 0; i < 100; i++) {
//       let x = Math.random() * 10 - 5
//       let y = Math.random() * 6 - 3
//       let z = Math.random() * 2

//       pos.set([x, y, z], i * 3)
//     }

//     instancedMeshRef.current.geometry.setAttribute(
//       'pos',
//       new InstancedBufferAttribute(pos, 3, false)
//     )

//     let size = new Float32Array(100)
//     for (let i = 0; i < 100; i++) {
//       // let s = Math.random() * 2 + 1
//       size[i] = Math.random() * 1
//     }

//     instancedMeshRef.current.geometry.setAttribute(
//       'size',
//       new InstancedBufferAttribute(size, 1, false)
//     )

//     let colorRand = new Float32Array(100)
//     for (let i = 0; i < 100; i++) {
//       // let s = Math.random() * 2 + 1
//       colorRand[i] = Math.random() * 1
//     }

//     instancedMeshRef.current.geometry.setAttribute(
//       'colorRand',
//       new InstancedBufferAttribute(colorRand, 1, false)
//     )
//   }, [instancedMeshRef])

//   useFrame((state) => {
//     const time = state.clock.getElapsedTime()

//     instancedMeshRef.current.material.uniforms.uSpherePos.value = spherePos

//     instancedMeshRef.current.material.uniforms.uTime.value = time
//   })

//   //   const particles = useMemo(() => {
//   //     const temp = []
//   //     for (let i = 0; i < 100; i++) {
//   //       //   const time = Random.range(0, 100);
//   //       //   const factor = Random.range(20, 120);
//   //       //   const speed = Random.range(0.01, 0.015) / 2;
//   //       let x = Math.random() * 10 - 5
//   //       let y = Math.random() * 6 - 3
//   //       let z = Math.random() * 2

//   //       temp.push({ x, y, z })
//   //     }
//   //     return temp
//   //   }, [])

//   //   const dummy = useMemo(() => new Object3D(), [])

//   //   useFrame(() => {
//   //     // Run through the randomized data to calculate some movement
//   //     particles.forEach((particle, index) => {
//   //       let { x, y, z } = particle

//   //       // Update the particle time
//   //       //   const t = (particle.time += speed);

//   //       dummy.position.set(x + spherePos.x, y + spherePos.y, z + spherePos.z)

//   //       dummy.updateMatrix()

//   //       // And apply the matrix to the instanced item
//   //       instancedMeshRef.current.setMatrixAt(index, dummy.matrix)
//   //     })
//   //     instancedMeshRef.current.instanceMatrix.needsUpdate = true
//   //   })

//   return (
//     <instancedMesh
//       //   position={[spherePos.x, spherePos.y, spherePos.z]}
//       ref={instancedMeshRef}
//       args={[null, null, 100]}
//     >
//       <planeGeometry args={[0.1, 0.1]} />
//       <particleShaderMaterial
//         transparent
//         depthTest={false}
//       />
//       {/* <meshBasicMaterial /> */}
//     </instancedMesh>
//   )
// }

// export default MouseTrail
