import {
  OrbitControls,
  OrthographicCamera,
  Sphere,
  shaderMaterial,
  useTexture,
} from '@react-three/drei'
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { AdditiveBlending, Vector2 } from 'three'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import gsap from 'gsap'
import glsl from 'babel-plugin-glsl/macro'

const SceneShaderMaterial = shaderMaterial(
  // Uniforms
  {
    // uDisplacement: new TextureLoader().load(
    //   './particles/—Pngtree—hazy white glow_6016180.png'
    // ),
    uTexture: new TextureLoader().load('./noise.png'),
    uDisplacement: null,
    uAmount: 0.01,
  },
  // Vertex Shader
  glsl`
    varying vec2 vUv;
    
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    varying vec2 vUv;

    uniform sampler2D uDisplacement;
    uniform sampler2D uTexture;
    uniform float uAmount; // Controls the amount of noise

    float PI = 3.141592653589793238;

    float Hash21(vec2 p) {
      p = fract(p*vec2(123.34, 456.21));
      p += dot(p, p+45.32);
      return fract(p.x*p.y);
    }

    void main() {
      vec4 displacement = texture2D(uDisplacement, vUv);
      
      float theta = displacement.r * 2.0 * PI;

      vec2 dir = vec2(sin(theta), cos(theta));

      vec2 uv = vUv + dir * displacement.r * 0.00001;

      // vec4 color = texture2D(uTexture, uv);
      vec4 color = vec4(0.0);

      // Generate random values
      float rand1 = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
      float rand2 = fract(sin(dot(gl_FragCoord.xy, vec2(37.3792, 63.9123))) * 43758.5453);

      // Apply salt and pepper noise
      if (rand1 < uAmount) {
          color.rgba = vec4(1.0); // Salt noise (white)
      }

      //   else if (rand2 < uAmount) {
      //     color.rgba = vec4(0.0); // Pepper noise (black)
      // }

      // vec4 test = color;

      vec4 result = vec4(0.0);

    for (int i = -1; i <= 1; i++) {
        result += color * length(uv - vec2(0.5))*0.5; // Apply convolution to the whole vec4
        color = color.yzwx; // Circularly rotate components of the vec4
    }

    // gl_FragColor = result;

    vec2 pixelCoord = gl_FragCoord.xy;

    vec4 color_new = vec4(0.0);

    bool isMultipleOf4 = mod(pixelCoord.x, 4.0) == 0.0 && mod(pixelCoord.y, 4.0) == 0.0;

    // Calculate the index of the pixel
    int pixelIndex = int(floor(gl_FragCoord.x / 2.0) + floor(gl_FragCoord.y / 2.0));

    if (mod(float(pixelIndex), 10.0) == 0.0) {
      // Color the pixel opaque white
      color_new.rgba = vec4(1.0, 1.0, 1.0, 1.0);
    } 

    vec2 pain = uv;

    pain *= 1.0;

    vec3 col = vec3(0.0);

    col += Hash21(pain);

    gl_FragColor = vec4(col, 0.15);

    // gl_FragColor = color_new;

    // gl_FragColor = vec4(gl_FragCoord.x, gl_FragCoord.y, 0.0, 1.0);

      // gl_FragColor = color;    
      // gl_FragColor = vec4(length(abs(uv - vUv) * 10.0),0.0  , 0.0, 1.0);    
      // gl_FragColor = texture2D(vUv, 1.0, vUv);    

        // gl_FragColor = vec4(uv, 0.0, 1.0);
    }
    `
)

extend({ SceneShaderMaterial })

const sceneMain = new THREE.Scene()
const sceneRipples = new THREE.Scene()

// console.log(sceneRipples)

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

const Contact_Deprecated = () => {
  return (
    <div className="w-full h-full">
      <Canvas className="w-full h-full">
        <CanvasComponent />
      </Canvas>
    </div>
  )
}

export default Contact_Deprecated

const CanvasComponent = () => {
  const { scene, viewport, camera } = useThree()

  const texture = useMemo(() => {
    return new TextureLoader().load('./ripple.png')
  }, [])

  let mainMeshRef = useRef(null)

  let [stateMeshes, setStateMeshes] = useState([])
  let [maxRipples] = useState(100)
  let [geometry] = useState(() => {
    return new THREE.PlaneGeometry(0.6, 0.6, 1, 1)
  }, [])

  let mousePosition = useRef(new Vector2(0, 0))
  let prevMousePosition = useRef(new Vector2(0, 0))
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

      let newMesh = new THREE.Mesh(geometry, mat)
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

  useFrame((state) => {
    if (stateMeshes.length === maxRipples) {
      if (
        // Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 4 &&
        // Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 4
        // Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 0.1 &&
        // Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.1
        mousePosition.current.x === prevMousePosition.current.x &&
        mousePosition.current.y === prevMousePosition.current.y
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
          singleMesh.scale.x = 0.98 * singleMesh.scale.x + 0.1
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
    mainMeshRef.current.material.uniforms.uDisplacement.value = target.texture
    state.gl.setRenderTarget(null)
    state.gl.clear()
  })
  return (
    <>
      <OrbitControls />
      <mesh ref={mainMeshRef}>
        <planeGeometry args={[viewport.width, viewport.height]} />
        <sceneShaderMaterial transparent />
      </mesh>
    </>
  )
}
