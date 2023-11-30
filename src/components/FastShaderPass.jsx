import { useEffect, useRef, useState } from 'react'
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

class PostFX {
  constructor(renderer, vertexShader, fragmentShader, uniforms) {
    this.renderer = renderer
    this.scene = new Scene()
    // three.js for .render() wants a camera, even if we're not using it :(
    this.dummyCamera = new OrthographicCamera()
    this.geometry = new BufferGeometry()

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])

    this.geometry.setAttribute(
      'position',
      new BufferAttribute(vertices, 2, false)
    )

    this.resolution = new Vector2(window.innerWidth, window.innerHeight)
    this.renderer.getDrawingBufferSize(this.resolution)

    this.target = new WebGLRenderTarget(this.resolution.x, this.resolution.y, {
      format: RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true,
    })

    this.material = new RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    })

    this.material.uniforms.uScene.value = this.target.texture

    // TODO: handle the resize -> update uResolution uniform and this.target.setSize()

    this.triangle = new Mesh(this.geometry, this.material)
    // Our triangle will be always on screen, so avoid frustum culling checking
    this.triangle.frustumCulled = false
    this.scene.add(this.triangle)

    // **************** code after this is for resizing ***************** //
    // **************** code after this is for resizing ***************** //
    // **************** code after this is for resizing ***************** //
    // **************** code after this is for resizing ***************** //

    // Add an event listener for window resize
    window.addEventListener('resize', this.onWindowResize.bind(this), false)

    // Initialize the size of the render target
    this.updateRenderTargetSize()
  }

  // Method to handle window resize
  onWindowResize() {
    this.updateRenderTargetSize()
    // Update any other size-dependent properties or uniforms here
  }

  // Method to update the size of the render target
  updateRenderTargetSize() {
    // Get the new size of the renderer's drawing buffer
    this.renderer.getDrawingBufferSize(this.resolution)

    // Update the size of the render target
    this.target.setSize(this.resolution.x, this.resolution.y)

    // Update any uniforms or properties that depend on the resolution
    this.material.uniforms.uResolution.value = this.resolution

    // Update the camera aspect ratio if needed
    const aspect = this.resolution.x / this.resolution.y
    this.dummyCamera.left = -aspect
    this.dummyCamera.right = aspect
    this.dummyCamera.updateProjectionMatrix()

    // Update any other size-dependent properties or uniforms here
  }

  // Don't forget to remove the event listener when you're done with the class
  dispose() {
    window.removeEventListener('resize', this.onWindowResize.bind(this))
  }

  render(mainScene, camera) {
    this.renderer.setRenderTarget(this.target)
    this.renderer.render(mainScene, camera)
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.dummyCamera)
  }
}

const FastShaderPass = ({ vertexShader, fragmentShader, uniforms }) => {
  const { gl, scene, camera } = useThree()

  const extraScene = useRef(new Scene())
  const dummyCamera = useRef(new OrthographicCamera())
  const resolution = useRef(new Vector2())
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
      uniforms,
    })
  )

  useEffect(() => {
    const geometry = new BufferGeometry()

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])

    geometry.setAttribute('position', new BufferAttribute(vertices, 2, false))

    const resolution = new Vector2()
    gl.getDrawingBufferSize(resolution)

    material.current.uniforms.uScene.value = target.current.texture

    // TODO: handle the resize -> update uResolution uniform and this.target.setSize()

    const triangle = new Mesh(geometry, material.current)
    // Our triangle will be always on screen, so avoid frustum culling checking
    triangle.frustumCulled = false
    extraScene.current.add(triangle)
  }, [gl])

  useFrame(() => {
    gl.setRenderTarget(target.current)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.render(extraScene.current, dummyCamera.current)
  }, 1)

  return null
}

export default FastShaderPass
