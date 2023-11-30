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
    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec3 color = vec3(uv, 1.0);
      color = texture2D(uScene, uv).rgb;
      // Do your cool postprocessing here
      color.r += sin(uv.x * 50.0);
      gl_FragColor = vec4(color, 1.0);
    }`,
  uniforms = {},
}) => {
  const { gl, scene, camera } = useThree()

  const extraScene = useRef(new Scene())
  const dummyCamera = useRef(new OrthographicCamera())
  const resolution = useRef(new Vector2(window.innerWidth, window.innerHeight))
  console.log(resolution.current)
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

  // Set up the initial configurations (as soon as renderer becomes available)
  useEffect(() => {
    const geometry = new BufferGeometry()

    // Triangle expressed in clip space coordinates
    const vertices = new Float32Array([-1.0, -1.0, 3.0, -1.0, -1.0, 3.0])

    geometry.setAttribute('position', new BufferAttribute(vertices, 2, false))

    gl.getDrawingBufferSize(resolution.current)

    material.current.uniforms.uScene.value = target.current.texture

    // TODO: handle the resize -> update uResolution uniform and this.target.setSize()

    const triangle = new Mesh(geometry, material.current)
    // Our triangle will be always on screen, so avoid frustum culling checking
    triangle.frustumCulled = false
    extraScene.current.add(triangle)
  }, [gl])

  // Run this on every frame
  useFrame(() => {
    gl.setRenderTarget(target.current)
    gl.render(scene, camera)
    gl.setRenderTarget(null)
    gl.render(extraScene.current, dummyCamera.current)
  }, 1)

  return null
}

export default FastShaderPass
