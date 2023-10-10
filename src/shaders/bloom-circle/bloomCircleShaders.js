import { Color, Vector2, Vector3 } from 'three'
import glsl from 'babel-plugin-glsl/macro'

export const uniforms = {
  uTime: { value: 0 },
  uSpherePos: { value: new Vector3(-20, 0, 0) },
  uOpacity: { value: 1.0 },
  uColor: { value: new Color(0.76, 0.38, 1.0) },
  uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
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
  uniform vec2 uResolution;
  uniform float uAspectRatio;
  uniform float uAspect;
  uniform float uOpacity;
  uniform vec3 uSpherePos;
  uniform vec3 uColorPurple;
  uniform vec3 uColorBlue;
  uniform vec3 uColorGreen;
  uniform vec3 uColor;

  uniform sampler2D uTexture;

  void main() {
    // vec2 aspectCorrectedUV = vUv;
    // aspectCorrectedUV.x *= uAspect;
    // // Center the texture on the adjusted UV coordinates
    // aspectCorrectedUV.x -= (1.0 - uAspect) / 2.0;

    // vec2 uv = gl_FragCoord.xy/uResolution.xy;
    // vec2 uv = gl_FragCoord.xy/uResolution.xy;
    // uv.y *= uResolution.y/uResolution.x;

    // vec2 p = vUv - vec2(0.5);
    vec2 p = vUv - vec2(0.5);
    p.y *= uAspectRatio;

    // vec4 color = texture2D(uTexture, vUv);
    // gl_FragColor = color;

    vec3 color = vec3(0.0);
    // vec4 color = vec4(0.0);

    vec3 mousePos = uSpherePos;
    mousePos.y *= uAspectRatio;

    float d = length(p - mousePos.xy);
    // float d = length(p - vec2(0.,0.));
    float m = 0.01/(d);

    color += m;

    color *= uColor;
    // color *= vec4(uColorGreen, 1.0);

    vec4 fragColor = vec4(color*1.0, 1.0);
    // vec4 fragColor = vec4(color*1.0, pow(m, 0.5));

    // fragColor += vec4(color, m);

    gl_FragColor = fragColor * uOpacity;
    // gl_FragColor = vec4(vUv, 0.0, 1.0);
    // gl_FragColor = color;

    // gl_FragColor = vec4(vUv, 0.0, 1.0);
  }
`
