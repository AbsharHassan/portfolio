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
import { useEffect, useState } from 'react'

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
  const { gl } = useThree()

  const [scene] = useState(new Scene())
  const [dummyCamera] = useState(new OrthographicCamera())

  useEffect(() => {
    const geometry = new BufferGeometry()

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])

    geometry.setAttribute('position', new BufferAttribute(vertices, 2, false))

    const resolution = new Vector2()
    gl.getDrawingBufferSize(resolution)

    const target = new WebGLRenderTarget(resolution.x, resolution.y, {
      format: RGBAFormat,
      stencilBuffer: false,
      depthBuffer: true,
    })

    const material = new RawShaderMaterial({
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
  }, [gl])

  useFrame(() => {})

  return null
}

export default FastShaderPass
