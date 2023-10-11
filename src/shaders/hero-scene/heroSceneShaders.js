import { Color, Vector2, Vector3 } from 'three'
import glsl from 'babel-plugin-glsl/macro'

export const uniforms = {
  uMousePosition: { value: new Vector3(-20, 0, 0) },
  uOpacity: { value: 1.0 },
  uColor: { value: new Color(0.76, 0.38, 1.0) },
  uAspectRatio: { value: window.innerHeight / window.innerWidth },
  uScene: { value: null },
  uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
}

export const vertexShader = glsl`
    precision highp float;

    attribute vec2 position;
    void main() {
    // Look ma! no projection matrix multiplication,
    // because we pass the values directly in clip space coordinates.
    gl_Position = vec4(position, 1.0, 1.0);
    }
`

export const fragmentShader = glsl`
  precision highp float;
  
  uniform vec2 uResolution;
  uniform sampler2D uScene;

  void main() {
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    vec4 color = texture2D(uScene, uv);

    float dimmingGradient = smoothstep(0.625, 0.35, abs(uv - vec2(0.5, 0.6)).y);

    // gl_FragColor = vec4(uv, 0.0, 1.0);
    // gl_FragColor = vec4(dimmingGradient, 0.0,0.0,1.0);
    gl_FragColor = color*dimmingGradient;
  }
`
