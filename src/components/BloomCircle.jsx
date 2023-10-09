import { Sphere, shaderMaterial } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import { Object3D, TextureLoader, Vector3, Color } from 'three'
import glsl from 'babel-plugin-glsl/macro'
import { extend, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useSelector } from 'react-redux'

const BloomShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTime: 0,
    uSpherePos: new Vector3(-20, 0, 0),
    uTexture: new TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
    uColorPurple: new Color(0.76, 0.38, 1.0),
    // uColorPurple: new Color(5.0, 0.38, 5.0),
    uColorBlue: new Color(0.35, 0.51, 0.98),
    uColorGreen: new Color(0.04 * 1, 0.66 * 1, 0.72 * 1),
    // uColorPurple: new Color(5.0 / 10, 0.38 / 10, 5.0 / 10),
    // uColorBlue: new Color(0.35 / 10, 0.51 / 10, 0.98 / 10),
    // uColorGreen: new Color(0.04 / 10, 0.66 / 10, 0.72 / 10),
    uAspect: 2.0556744846176622,
    uOpacity: 1.0,
    uColor: new Color(0.76, 0.38, 1.0),
  },
  // Vertex Shader
  glsl`
      varying vec2 vUv;
      varying vec2 vPosition;
  
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
  // Fragment Shader
  glsl`
      varying vec2 vUv;
      uniform float uAspect;
      uniform float uOpacity;
      uniform vec3 uSpherePos;
      uniform vec3 uColorPurple;
      uniform vec3 uColorBlue;
      uniform vec3 uColorGreen;
      uniform vec3 uColor;
  
      uniform sampler2D uTexture;
  
      void main() {
        // vec2 aspectCorrectedUV = vUv;
        // aspectCorrectedUV.x *= uAspect;
        // // Center the texture on the adjusted UV coordinates
        // aspectCorrectedUV.x -= (1.0 - uAspect) / 2.0;
  
        vec2 p = vUv - vec2(0.5);
  
        // vec4 color = texture2D(uTexture, vUv);
        // gl_FragColor = color;
  
        vec3 color = vec3(0.0);
        // vec4 color = vec4(0.0);
  
        float d = length(p - uSpherePos.xy);
        float m = 0.01/(d);
  
        color += m;
  
        color *= uColor;
        // color *= vec4(uColorGreen, 1.0);
  
        vec4 fragColor = vec4(color*1.0, pow(m, 0.5));
  
        // fragColor += vec4(color, m);
  
        gl_FragColor = fragColor * uOpacity;
        // gl_FragColor = color;

        // gl_FragColor = vec4(vUv, 0.0, 1.0);
      }
    `
)

extend({ BloomShaderMaterial })

const BloomCircle = ({ isHeroVisible }) => {
  const { viewport } = useThree()
  const { bloomTheme } = useSelector((state) => state.threeStore)

  let meshRef = useRef()

  let mousePos = useRef({ x: 0, y: 0 })
  let dummyObject = useRef(new Object3D())

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
    gsap.to(meshRef.current.material.uniforms.uColor.value, {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
  }, [bloomTheme])

  useEffect(() => {
    console.log(isHeroVisible)
    gsap.to(meshRef.current.material.uniforms.uOpacity, {
      value: isHeroVisible ? 1 : 0,
      ease: 'sine.inOut',
    })
  }, [isHeroVisible])

  useFrame((state) => {
    const directionToTarget = new Vector3(
      (mousePos.current.x * viewport.width) / 2,
      (mousePos.current.y * viewport.height) / 2,
      0
    ).sub(dummyObject.current.position.clone())

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

    dummyObject.current.position.add(sphereVelocity.current)

    // setSpherePos(dummyObject.current.position.clone())

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    // meshRef.current.material.uniforms.uSpherePos.value =
    //   dummyObject.current.position.clone()

    // setVelo(sphereVelocity.current.clone())
    // const randomNumber = Math.floor(Math.random() * 10)

    // if (randomNumber === 5) {
    //   // console.log(dummyObject.current.position)
    //   setCirclePositions((prevValue) => [
    //     ...prevValue,
    //     dummyObject.current.position.clone(),
    //   ])
    // }

    const normalizedMouse = dummyObject.current.position.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.width / 2)) * 0.5

    meshRef.current.material.uniforms.uSpherePos.value = normalizedMouse
  })

  return (
    <mesh
      ref={meshRef}
      visible={true}
    >
      {/* <circleGeometry /> */}
      <planeGeometry args={[viewport.width, viewport.width]} />
      <bloomShaderMaterial transparent />
    </mesh>
  )
}

export default BloomCircle
