import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber'
import {
  OrbitControls,
  Plane,
  RenderTexture,
  Sphere,
  Text,
  Wireframe,
  shaderMaterial,
  useMask,
} from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'
import gsap from 'gsap'

import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const SomeWeirdShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTexture: null,
    uMask: new THREE.TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
  },
  // Vertex Shader
  glsl`
    attribute vec3 pos;
    attribute vec2 customUv;
    varying vec2 newUv;
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        vPosition = position;
        vUv = uv;
        newUv = customUv;


        vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;
        vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
        view_pos.xyz += position  * 1.0;
        gl_Position = projectionMatrix * view_pos;

        // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
  // Fragment Shader
  glsl`
    varying vec2 vUv;
    varying vec2 newUv;
    uniform sampler2D uMask;
    uniform sampler2D uTexture;
    varying vec3 vPosition;

    void main() {
        // vec4 color = texture2D(uTexture, vUv);
        vec4 maskTexture = texture2D(uMask, vUv);
        vec4 image = texture2D(uTexture, newUv);

        // if()

        gl_FragColor = image;
        // gl_FragColor.a *= maskTexture.a;
        // gl_FragColor = vec4(newUv,0.0, 1.0);
        //  gl_FragColor.a *= maskTexture.a;
    }
    `
)

extend({ SomeWeirdShaderMaterial })

const TextToParticlesTest = () => {
  return (
    <div className="w-full h-full">
      <Canvas className="w-full h-full">
        <CanvasStuff />
      </Canvas>
    </div>
  )
}

export default TextToParticlesTest

const CanvasStuff = () => {
  const { gl, scene, viewport } = useThree()

  let meshRef = useRef(null)
  let textureRef = useRef(null)
  let textRef = useRef(null)
  let particleRef = useRef(null)

  const fullScreenPlane = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height, 100, 100)
  }, [viewport])

  console.log(fullScreenPlane.attributes.position.count)

  useEffect(() => {
    meshRef.current.geometry.setAttribute(
      'pos',
      new THREE.InstancedBufferAttribute(
        fullScreenPlane.attributes.position.array,
        3,
        false
      )
    )

    meshRef.current.geometry.setAttribute(
      'customUv',
      new THREE.InstancedBufferAttribute(
        fullScreenPlane.attributes.uv.array,
        2,
        false
      )
    )

    meshRef.current.material.uniforms.uTexture.value = textureRef.current

    console.log(viewport.width / 5.5810546875)
  }, [meshRef])

  useEffect(() => {
    // gsap.to()
    particleRef.current.parameters.width = 1
  }, [particleRef])

  return (
    <>
      <OrbitControls />

      <RenderTexture ref={textureRef}>
        <Text
          ref={textRef}
          // scale={Math.floor(2.8263018351705993)}
          scale={2.5}
        >
          Get In Touch
        </Text>
      </RenderTexture>

      <instancedMesh
        ref={meshRef}
        args={[
          fullScreenPlane,
          //   null,
          null,
          fullScreenPlane.attributes.position.count,
        ]}
        // visible={false}
      >
        <planeGeometry
          ref={particleRef}
          args={[0.05, 0.05]}
        />
        <someWeirdShaderMaterial
          transparent
          depthTest={false}
          depthWrite={false}
        />
      </instancedMesh>

      {/* <mesh ref={meshRef}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <someWeirdShaderMaterial />
      </mesh> */}
    </>
  )
}
