import { useEffect, useRef, useState, forwardRef, useMemo } from 'react'
import {
  Scene,
  OrthographicCamera,
  BufferGeometry,
  BufferAttribute,
  Vector2,
  WebGLRenderTarget,
  RGBAFormat,
  RawShaderMaterial,
  Mesh,
} from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Hud } from '@react-three/drei'

const FastShaderPass = ({
  vertexShader = `precision highp float;
    attribute vec2 position;
    void main() {
      // Look ma! no projection matrix multiplication,
      // because we pass the values directly in clip space coordinates.
      gl_Position = vec4(position, 1.0, 1.0);
    }`,
  fragmentShader = `precision highp float;
    uniform sampler2D uScene;
    uniform vec2 uResolution;
    uniform float uTime;

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec3 color = vec3(uv, 1.0);
      color = texture2D(uScene, uv).rgb;
      // Do your cool postprocessing here
      color.r += sin(uv.x * 50.0 * cos(uTime));
      gl_FragColor = vec4(color, 1.0);
    }`,
  uniforms,
}) => {
  const { gl, scene, camera } = useThree()

  const vertices = useMemo(() => {
    const positions = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])
    return new BufferAttribute(positions, 2, false)
  }, [])

  const extraScene = useRef(new Scene())
  const dummyCamera = useRef(new OrthographicCamera())
  const resolution = useRef(new Vector2(window.innerWidth, window.innerHeight))
  const target = useRef(
    new WebGLRenderTarget(resolution.current.x, resolution.current.y, {
      format: RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true,
    })
  )
  const material = useRef(
    new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uScene: { value: target.current.texture },
        uResolution: { value: resolution.current },
      },
    })
  )

  let testRef = useRef(null)

  // Method to update the size of the render target
  const updateRenderTargetSize = () => {
    // Get the new size of the renderer's drawing buffer
    gl.getDrawingBufferSize(resolution.current)

    // Update the size of the render target
    target.current.setSize(resolution.current.x, resolution.current.y)

    // Update any uniforms or properties that depend on the resolution
    material.current.uniforms.uResolution.value = resolution.current

    // Update the camera aspect ratio if needed
    const aspect = resolution.current.x / resolution.current.y
    dummyCamera.current.left = -aspect
    dummyCamera.current.right = aspect
    dummyCamera.current.updateProjectionMatrix()

    // Update any other size-dependent properties or uniforms here
  }

  // Set up the initial configurations (as soon as renderer becomes available)
  useEffect(() => {
    const geometry = new BufferGeometry()

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])

    geometry.setAttribute('position', new BufferAttribute(vertices, 2, false))

    gl.getDrawingBufferSize(resolution.current)

    console.log(testRef.current)

    testRef.current.parent = null

    testRef.current.children[0].material.uniforms.uScene.value =
      target.current.texture
    // material.current.uniforms.uScene.value = target.current.texture

    // TODO: handle the resize -> update uResolution uniform and this.target.setSize()

    const triangle = new Mesh(geometry, material.current)
    triangle.frustumCulled = false

    console.log(testRef)
    console.log(extraScene)

    // testRef.current.frustumCulled = false
    extraScene.current.add(triangle)
  }, [gl])

  // useEffect(() => {
  //   window.addEventListener('resize', updateRenderTargetSize)

  //   return () => {
  //     window.removeEventListener('resize', updateRenderTargetSize)
  //   }
  // }, [])

  // Run this on every frame
  useFrame((state) => {
    gl.setRenderTarget(target.current)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.render(extraScene.current, dummyCamera.current)
  }, 1)

  return (
    // <scene ref={testRef}>

    // </scene>
    // null

    // <Hud>
    <scene ref={testRef}></scene>
    // {/* </Hud> */}

    // <mesh ref={testRef}>
    //   <bufferGeometry>
    //     <bufferAttribute
    //       attach={'attributes-position'}
    //       {...vertices}
    //     />
    //   </bufferGeometry>
    //   <rawShaderMaterial
    //     vertexShader={vertexShader}
    //     fragmentShader={fragmentShader}
    //     uniforms={{
    //       uScene: { value: target.current.texture },
    //       uResolution: { value: resolution.current },
    //     }}
    //   />
    // </mesh>
  )
}

export default FastShaderPass
// export default forwardRef(FastShaderPass)
