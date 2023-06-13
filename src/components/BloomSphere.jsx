import * as THREE from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { Sphere, shaderMaterial } from '@react-three/drei'
import glsl from 'babel-plugin-glsl/macro'

import heroSphereVertex from '../shaders/hero.sphere.vertex.glsl'
import heroSphereFragment from '../shaders/hero.sphere.fragment.glsl'

const BloomShaderMaterial = shaderMaterial(
  // Uniform
  {
    uColor: new THREE.Color(1 * 10, 1 * 10, 0.6 * 10),
  },
  // Vertex Shader
  glsl`
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = position;
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  // Fragment Shader
  glsl`
    uniform vec3 uColor;
    varying vec3 vNormal;
    varying vec3 vPosition;
    varying vec2 vUv;

    void main() {
      // float radial = 1. - vPosition.z;
      // radial *= radial;

      float intensity = pow(0.7 - dot(vNormal * 0.5, vec3(0, 0, 1.0)), 3.0);

      // gl_FragColor = vec4(uColor, 1.) * intensity * intensity;
      gl_FragColor = vec4(uColor, 3.);

    }
  `
)

const BloomShaderMaterial2 = shaderMaterial(
  // Uniform
  {
    uColor: new THREE.Color(1, 1, 0.6),
    transparent: true,
  },
  // Vertex Shader
  glsl`
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  void main() {
      vNormal = normalize(normalMatrix * normal);
      // vNormal = normal;
      vPosition = position;
      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,
  // Fragment Shader
  glsl`
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  varying vec2 vUv;

  uniform sampler2D tDiffuse;
  uniform vec2 resolution;


  void main() {
      // float radial = 1. - vNormal.z;
      // radial *= radial*radial;
      
      // float intensity = pow(0.005 - dot(vNormal * 1.0, vec3(0, 0, 1.0)), 3.0);
      
      // vec3 color = vec3(uColor) * intensity;
      
      // // vec3 color = uColor*intensity;
      // gl_FragColor = vec4(uColor, 1.0) * intensity;
      // gl_FragColor = vec4(color, 1. * (intensity * intensity* intensity* intensity* intensity));

      // vec4 color = vec4(0.0);
      // vec2 offset = 1.0 / resolution;

      // for (int x =-1; x<5; x++)
      // {
      //   for (int y =-1; y<5; y++)
      //   {
      //     color += vec4(uColor, 0.5) * pow(0.2 - dot(vNormal * 1.0, vec3(0, 0, 1.0)), 3.0);
      //   }
      // }

      // color /= 500.0;

      // gl_FragColor = color;


      // float distance = length(vNormal);
      // float decayFactor = exp(-distance); // Exponential decay function

      // vec3 finalColor = uColor * decayFactor;

      // gl_FragColor = vec4(vec3(distance), 0.5);


      // float radial = 1. - vNormal.z;
      // radial *= radial*radial;

      // float dividingFactor = -2.0 * (vNormal.z) + 1.0; 
      
      // float intensity = pow(dot(vNormal / 1., vec3(0, 0, -1.0)), 1.0);
      
      // // vec3 color = vec3(uColor) * intensity;

      // float somevar = exp(dot(vNormal, vec3(0,0,-1.0))) -exp(0.1);

      // // use this to create a star pattern
      // // vec3 color = vec3(uColor) / (2.0 + pow(abs(vNormal.x * vNormal.y *vNormal.z), 1.0) * 20.);

      // vec3 color = vec3(uColor) / ((pow(abs(vNormal.z), 0.00000000001) * 5.));
      
      // // vec3 color = uColor*intensity;
      // // gl_FragColor = vec4(uColor, 1.0) * intensity;

      // vec3 bleh = vec3(uColor) / 3.0;
      // gl_FragColor = vec4(bleh, 1.0) * somevar;
      // // gl_FragColor = vec4(somevar, 0, 0, somevar);
      // // gl_FragColor = vec4(uColor * intensity, 1.0);
      // // gl_FragColor = vec4(color, 1. * (intensity * intensity* intensity* intensity* intensity));




      float radial = 1. - vNormal.z;
      radial *= radial*radial;
      
      float intensity = pow(0.005 - dot(vNormal * 1.0, vec3(0, 0, 1.0)), 3.0);
      
      vec3 color = vec3(uColor) / 2.0;
      
      // vec3 color = uColor*intensity;
      gl_FragColor = vec4(color*intensity, 1.0*intensity);
      // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  }
  `
)

extend({ BloomShaderMaterial2, BloomShaderMaterial })

export default function BloomSphere() {
  return (
    <>
      <Sphere args={[1.2, 100, 100]}>
        <bloomShaderMaterial2
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
        <Sphere args={[0.1]}>
          <bloomShaderMaterial
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </Sphere>
        <pointLight intensity={0.1} />
      </Sphere>
    </>
  )
}
