import { OrbitControls, Sphere, shaderMaterial } from '@react-three/drei'
import React, { useEffect, useRef } from 'react'
import {
  Object3D,
  TextureLoader,
  Vector3,
  Color,
  Vector2,
  PlaneGeometry,
  RawShaderMaterial,
} from 'three'
import glsl from 'babel-plugin-glsl/macro'
import { extend, useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useSelector } from 'react-redux'
import useWindowResize from '../utils/useWindowResize'

import {
  vertexShader as bloomCircleVertexShader,
  fragmentShader as bloomCircleFragmentShader,
  uniforms as bloomCircleUniforms,
} from '../shaders/bloom-circle/bloomCircleShaders'

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
    uResolution: new Vector2(window.innerWidth, window.innerHeight),
    uAspectRatio: window.innerHeight / window.innerWidth,
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
      uniform vec2 uResolution;
      uniform float uAspectRatio;
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

        // vec2 uv = gl_FragCoord.xy/uResolution.xy;
        // vec2 uv = gl_FragCoord.xy/uResolution.xy;
        // uv.y *= uResolution.y/uResolution.x;

        // vec2 p = vUv - vec2(0.5);
        vec2 p = vUv - vec2(0.5);
        p.y *= uAspectRatio;

        // vec4 color = texture2D(uTexture, vUv);
        // gl_FragColor = color;

        vec3 color = vec3(0.0);
        // vec4 color = vec4(0.0);

        vec3 mousePos = uSpherePos;
        mousePos.y *= uAspectRatio;

        float d = length(p - mousePos.xy);
        // float d = length(p - vec2(0.,0.));
        float m = 0.01/(d);

        color += m;

        color *= uColor;
        // color *= vec4(uColorGreen, 1.0);

        vec4 fragColor = vec4(color*1.0, 1.0);
        // vec4 fragColor = vec4(color*1.0, pow(m, 0.5));

        // fragColor += vec4(color, m);

        gl_FragColor = fragColor * uOpacity;
        // gl_FragColor = vec4(uResolution.x/1536.0, 0.0, 0.0, 1.0);
        // gl_FragColor = color;

        // gl_FragColor = vec4(vUv, 0.0, 1.0);
      }
    `
)

extend({ BloomShaderMaterial })

const BloomCircle = ({ isHeroVisible }) => {
  const { viewport } = useThree()
  const { bloomTheme } = useSelector((state) => state.threeStore)
  const windowSize = useWindowResize()

  let meshRef = useRef()

  let mousePos = useRef({ x: 0, y: 0 })
  let dummyObject = useRef(new Object3D())
  let viewportVector = useRef(new Vector3())

  let sphereVelocity = useRef(new Vector3(0, 0, 0))

  useEffect(() => {
    function handle(event) {
      const { clientX, clientY } = event

      const x = (clientX / windowSize.width) * 2 - 1
      const y = -(clientY / windowSize.height) * 2 + 1

      mousePos.current = { x, y }
    }

    window.addEventListener('mousemove', handle)

    return () => {
      window.removeEventListener('mousemove', handle)
    }
  }, [windowSize])

  useEffect(() => {
    console.log('mounting')

    return () => {
      console.log('unmounting')
    }
  }, [])

  useEffect(() => {
    gsap.to(meshRef.current.material.uniforms?.uColor?.value, {
      r: bloomTheme.r,
      g: bloomTheme.g,
      b: bloomTheme.b,
      duration: 1,
    })
  }, [bloomTheme])

  useEffect(() => {
    gsap.to(meshRef.current.material.uniforms?.uOpacity, {
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

    let accelerationFactor = 0.1
    let dampingFactor = -0.3

    const acceleration = directionToTarget.multiplyScalar(
      1 * accelerationFactor
    )
    const damping = sphereVelocity.current
      .clone()
      .multiplyScalar(1 * dampingFactor)

    dummyObject.current.position.add(sphereVelocity.current)

    sphereVelocity.current = sphereVelocity.current
      .clone()
      .add(acceleration)
      .add(damping)

    const normalizedMouse = dummyObject.current.position.clone()
    normalizedMouse.x = (normalizedMouse.x / (viewport.width / 2)) * 0.5
    normalizedMouse.y = (normalizedMouse.y / (viewport.height / 2)) * 0.5

    meshRef.current.material.uniforms.uSpherePos.value = normalizedMouse
  })

  useEffect(() => {
    let newGeometry = new PlaneGeometry(viewport.width, viewport.height)

    // let newMaterial = new RawShaderMaterial({
    //   vertexShader: bloomCircleVertexShader,
    //   fragmentShader: bloomCircleFragmentShader,
    //   uniforms: bloomCircleUniforms,
    //   transparent: true,
    // })

    // meshRef.current.material = newMaterial

    meshRef.current.material.uniforms.uAspectRatio.value =
      windowSize.height / windowSize.width

    // meshRef.current.scale.x = viewport.width
    // meshRef.current.scale.y = viewport.height

    meshRef.current.matrixWorldNeedsUpdate = true
    console.log(meshRef.current)
    // meshRef.current.instanceMatrix.needsUpdate = true

    meshRef.current.geometry = newGeometry

    return () => {
      // newGeometry.dispose()
      // newMaterial.dispose()
    }
  }, [windowSize, viewport, meshRef])

  return (
    <>
      <OrbitControls />
      <mesh
        ref={meshRef}
        visible={true}
        key={windowSize.width}
      >
        <planeGeometry args={[1, 1]} />
        <bloomShaderMaterial transparent />
      </mesh>
    </>
  )
}

export default BloomCircle
