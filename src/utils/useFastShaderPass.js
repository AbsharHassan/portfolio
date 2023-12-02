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

// const resolution = new Vector2(window.innerWidth, window.innerHeight)
// const target = new WebGLRenderTarget(resolution.x, resolution.y, {
//   format: RGBAFormat,
//   stencilBuffer: false,
//   depthBuffer: true,
// })

const useFastShaderPass = (fragmentShader, order = 1) => {
  const { gl, scene, camera } = useThree()

  console.log('the order is:' + order)

  //   const dummyCamera = useMemo(() => {
  //     return new OrthographicCamera()
  //   }, [])

  //   const resolution = useMemo(() => {
  //     return new Vector2(window.innerWidth, window.innerHeight)
  //   }, [])

  //   const extraScene = useMemo(() => {
  //     return new Scene()
  //   }, [])

  //   const target = useMemo(() => {
  //     return new WebGLRenderTarget(resolution.x, resolution.y, {
  //       format: RGBAFormat,
  //       stencilBuffer: false,
  //       depthBuffer: true,
  //     })
  //   }, [])

  //   const material = useMemo(() => {
  //     return new RawShaderMaterial({
  //       vertexShader: `precision highp float;
  //         attribute vec2 position;
  //         void main() {
  //           // Look ma! no projection matrix multiplication,
  //           // because we pass the values directly in clip space coordinates.
  //           gl_Position = vec4(position, 1.0, 1.0);
  //         }`,
  //       fragmentShader,
  //       uniforms: {
  //         uScene: { value: target.texture },
  //         uResolution: { value: resolution },
  //         uTime: { value: 0 },
  //       },
  //     })
  //   }, [])

  const [dummyCamera] = useState(new OrthographicCamera())

  const [resolution] = useState(
    new Vector2(window.innerWidth, window.innerHeight)
  )

  const [extraScene] = useState(new Scene())

  const [target] = useState(
    new WebGLRenderTarget(resolution.x, resolution.y, {
      format: RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true,
    })
  )

  const [material] = useState(
    new RawShaderMaterial({
      vertexShader: `precision highp float;
      attribute vec2 position;
      void main() {
        // Look ma! no projection matrix multiplication,
        // because we pass the values directly in clip space coordinates.
        gl_Position = vec4(position, 1.0, 1.0);
      }`,
      fragmentShader,
      uniforms: {
        uScene: { value: target.texture },
        uResolution: { value: resolution },
        uTime: { value: 0 },
      },
    })
  )

  // Method to update the size of the render target
  const updateRenderTargetSize = () => {
    // Get the new size of the renderer's drawing buffer
    gl.getDrawingBufferSize(resolution)

    // Update the size of the render target
    target.setSize(resolution.x, resolution.y)

    // Update any uniforms or properties that depend on the resolution
    material.uniforms.uResolution.value = resolution

    // Update the camera aspect ratio if needed
    const aspect = resolution.x / resolution.y
    dummyCamera.left = -aspect
    dummyCamera.right = aspect
    dummyCamera.updateProjectionMatrix()

    // Update any other size-dependent properties or uniforms here
  }

  // Set up the initial configurations (as soon as renderer becomes available)
  useEffect(() => {
    const geometry = new BufferGeometry()

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])

    geometry.setAttribute('position', new BufferAttribute(vertices, 2, false))

    gl.getDrawingBufferSize(resolution)

    material.uniforms.uScene.value = target.texture

    const triangle = new Mesh(geometry, material)
    triangle.frustumCulled = false

    // testRef.frustumCulled = false
    extraScene.add(triangle)
  }, [gl])

  // useEffect(() => {
  //   window.addEventListener('resize', updateRenderTargetSize)

  //   return () => {
  //     window.removeEventListener('resize', updateRenderTargetSize)
  //   }
  // }, [])

  // Run this on every frame
  useFrame((state) => {
    gl.setRenderTarget(target)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.render(extraScene, dummyCamera)
  }, order)

  return extraScene
}

export default useFastShaderPass
