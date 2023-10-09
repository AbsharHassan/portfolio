import { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useThree, useFrame, extend } from '@react-three/fiber'
import {
  OrbitControls,
  Sphere,
  Text,
  Wireframe,
  shaderMaterial,
  useMask,
} from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'

import { FontLoader } from 'three/addons/loaders/FontLoader.js'
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js'

const SomeWeirdShaderMaterial = shaderMaterial(
  // Uniforms
  {
    uTexture: null,
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
        uniform sampler2D uTexture;
        varying vec3 vPosition;

        void main() {
            // vec4 color = texture2D(uTexture, vUv);
            vec4 color = texture2D(uTexture, newUv);

            gl_FragColor = color;
            // gl_FragColor = vec4(newUv,0.0, 1.0);
        }
    `
)

extend({ SomeWeirdShaderMaterial })

// const fullScreenPlane = new THREE.PlaneGeometry(
//   window.innerWidth,
//   window.innerHeight,
//   10,
//   10
// )

const sceneOffscreen = new THREE.Scene()

const loader = new FontLoader()

let font

loader.load(
  'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json',
  function (res) {
    const textGeo = new TextGeometry('failure', {
      font: res,

      size: 0.5,
      height: 0,
      curveSegments: 100,
      bevelEnabled: false,
    })

    const mesh = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial())
    sceneOffscreen.add(mesh)
  }
)

const target = new THREE.WebGLRenderTarget(
  window.innerWidth,
  window.innerHeight,
  {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  }
)

const TextToParticlesTestOld = () => {
  return (
    <div className="w-full h-full">
      <Canvas className="w-full h-full">
        <CanvasStuff />
      </Canvas>
    </div>
  )
}

export default TextToParticlesTestOld

const CanvasStuff = () => {
  const { gl, scene, viewport } = useThree()

  let meshRef = useRef(null)

  //   const [font, setFont] = useState(null)

  //   useEffect(() => {
  //     loader.load(
  //       'https://res.cloudinary.com/dydre7amr/raw/upload/v1612950355/font_zsd4dr.json',
  //       function (res) {
  //         setFont(res)
  //       }
  //     )
  //   }, [])

  //   useEffect(() => {
  //     if (font) {
  //       const textGeo = new TextGeometry('failure', {
  //         font: font,

  //         size: 0.5,
  //         height: 0,
  //         // curveSegments: 12,
  //         bevelEnabled: false,
  //       })

  //       const mesh = new THREE.Mesh(textGeo, new THREE.MeshBasicMaterial())
  //       scene.add(mesh)
  //     }
  //   }, [font])

  const fullScreenPlane = useMemo(() => {
    return new THREE.PlaneGeometry(viewport.width, viewport.height, 100, 100)
  })

  useEffect(() => {
    console.log(fullScreenPlane.attributes)
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
  }, [meshRef])

  useFrame((state) => {
    state.gl.setRenderTarget(target)
    state.gl.render(sceneOffscreen, state.camera)
    meshRef.current.material.uniforms.uTexture.value = target.texture
    state.gl.setRenderTarget(null)
    state.gl.clear()
  })
  return (
    <>
      <OrbitControls />
      {/* <mesh ref={meshRef}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <someWeirdShaderMaterial />
      </mesh> */}
      <instancedMesh
        ref={meshRef}
        args={[
          fullScreenPlane,
          //   null,
          null,
          //   fullScreenPlane.attributes.position.count,
          fullScreenPlane.attributes.position.count,
        ]}
      >
        <planeGeometry args={[0.5, 0.5]} />
        <someWeirdShaderMaterial
          // transparent
          depthTest={false}
          depthWrite={false}
        />
      </instancedMesh>
    </>
  )
}
