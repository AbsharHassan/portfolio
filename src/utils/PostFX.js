/*
  To use it, simply declare:
  `const post = new PostFX(rendering);`
  
  Then on update, instead of:
  `rendering.render(scene, camera);`
  replace with:
  `post.render(scene, camera);`
*/
import {
  WebGLRenderTarget,
  OrthographicCamera,
  RGBAFormat,
  BufferGeometry,
  BufferAttribute,
  Mesh,
  Scene,
  RawShaderMaterial,
  Vector2,
} from 'three'

export default class PostFX {
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

    this.resolution = new Vector2()
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
  }

  render(
    mainScene,
    particlesScene,
    camera,
    ripplesTexture,
    time,
    animationProgress,
    scale,
    mixX,
    modelBrightness,
    particleBrightness,
    modelRipplesMix,
    particleRipplesMix,
    dimmingMix
  ) {
    this.renderer.setRenderTarget(this.target)
    this.renderer.render(mainScene, camera)
    this.renderer.setRenderTarget(null)
    this.renderer.render(this.scene, this.dummyCamera)

    this.material.uniforms.uResolution.value = this.resolution
    this.material.uniforms.uFloatingParticles.value = particlesScene
    this.material.uniforms.uDisplacement.value = ripplesTexture
    this.material.uniforms.uTime.value = time
    this.material.uniforms.uScale.value = scale
    this.material.uniforms.uMixX.value = mixX
    this.material.uniforms.uAnimationProgress.value = animationProgress
    this.material.uniforms.uModelBrightness.value = modelBrightness
    this.material.uniforms.uParticleBrightness.value = particleBrightness
    this.material.uniforms.uModelRipplesMix.value = modelRipplesMix
    this.material.uniforms.uParticleRipplesMix.value = particleRipplesMix
    this.material.uniforms.uDimmingMix.value = dimmingMix
    // this.material.uniforms.uSceneOpacity.value = opacity
  }
}