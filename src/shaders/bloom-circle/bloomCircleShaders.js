import { Color, Vector3 } from 'three'
import glsl from 'babel-plugin-glsl/macro'

export const uniforms = {
  uMousePosition: { value: new Vector3(-20, 0, 0) },
  uOpacity: { value: 1.0 },
  uColor: { value: new Color(0.76, 0.38, 1.0) },
  uAspectRatio: { value: window.innerHeight / window.innerWidth },
}

export const vertexShader = glsl`
  precision highp float;

  varying vec2 vUv;
  varying vec2 vPosition;

  void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

export const fragmentShader = glsl`
  precision highp float;
  
  varying vec2 vUv;
  uniform float uAspectRatio;
  uniform float uAspect;
  uniform float uOpacity;
  uniform vec3 uMousePosition;
  uniform vec3 uColorPurple;
  uniform vec3 uColorBlue;
  uniform vec3 uColorGreen;
  uniform vec3 uColor;

  uniform sampler2D uTexture;

  void main() {
    vec2 p = vUv - vec2(0.5);
    p.y *= uAspectRatio;

    vec3 color = vec3(0.0);

    vec3 correctedMousePosition = uMousePosition;
    correctedMousePosition.y *= uAspectRatio;

    float d = length(p - correctedMousePosition.xy);
    float m = 0.01/(d);

    color += m;

    color *= uColor;

    vec4 fragColor = vec4(color, pow(m, 0.5));

    gl_FragColor = fragColor * uOpacity;
  }
`
