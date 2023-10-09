import glsl from 'babel-plugin-glsl/macro'
import { Vector3, Color, TextureLoader } from 'three'

export const uniforms = {
  uTime: { value: 0 },
  uSpherePos: { value: new Vector3(-20, 0, 0) },
  uTexture: {
    value: new TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
  },
  uColorPurple: { value: new Color(2 * 1, 0.38 * 1, 2 * 1) },
  // uColorPurple: new Color(5.0, 0.38, 5.0),
  // uColorPurple: new Color(2, 0.38, 2),
  uColorBlue: { value: new Color(0.35 * 1, 0.51 * 1, 0.98 * 1) },
  uColorGreen: { value: new Color(0.04 * 1, 0.66 * 1, 0.72 * 1) },
  uSwitch: { value: false },
  uAnimationTime: { value: 0 },
  uAnimationDuration: { value: 0.5 },
  uTriggerTime: { value: 100000000000 },
  uInitialRender: { value: true },
}

export const vertexShader = glsl`
    attribute vec3 pos1;
    attribute vec3 pos2;
    attribute float someBool;
    attribute float randomScale;
    varying vec3 frag_positions;
    varying vec2 vUv;
    uniform vec3 uSpherePos;
    attribute float size;
    attribute float colorRand;
    uniform float uTime;
    varying float colorRandom;
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    void main() {
    // Setting up the varyings
    // frag_positions = pos;
    vUv = uv;
    colorRandom = colorRand;



    vec3 pos = vec3(0.0);  
    float t = 0.0;

    // Setting particle position
    // vec3 particle_position = vec3(0.0);
    vec3 particle_position = (modelMatrix * vec4(pos1, 1.0)).xyz;

    // if(someBool == 1.0) {
    //   particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;
    //   particle_position.z = particle_position.z * randomScale * 1.0;
    //   particle_position.x = particle_position.x * (1.0 - (randomScale * 1.0));
    // } else {
    //   particle_position = vec3(0.0);
    // }
    // particle_position.y = particle_position.y - 2.5;

    // // Simplex noise generation
    // float noiseFreq = 1.5;
    // float noiseAmp = 0.5;
    // float slowTime = 0.1;
    // vec3 noisePos = vec3(size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime);
    // float simplexNoise = snoise3(noisePos) * noiseAmp;

    // // Perlin noise generation
    float perlinNoise = cnoise(particle_position + uTime * 0.5);

    // Creating mouse interactive behaviour
    // float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - particle_position.xy) -0.0, 0.0, 1.0), 10.0);
    // vec3 dir = particle_position - uSpherePos;
    // particle_position = mix(particle_position, uSpherePos + normalize(dir)*0.3, distanceToSphere*0.1);

    // // // Applying noise to partice positions
    // // particle_position.x += simplexNoise*sin(uTime * slowTime);
    // // particle_position.y += simplexNoise*sin(uTime * slowTime);

    // // Applying noise to partice positions

    // // Simplex noise
    // // particle_position.x += simplexNoise;
    // // particle_position.y += simplexNoise;
    // // particle_position = particle_position + normalize(particle_position) * simplexNoise * 1.0;

    // // Perlin noise
    // particle_position.x += perlinNoise;
    // particle_position.y += perlinNoise;
    // particle_position = particle_position + normalize(particle_position) * perlinNoise * 0.05;

    // // Setting size of particles and rendering them
    // vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
    // view_pos.xyz += position * (size + perlinNoise) * 1.0;
    // gl_Position = projectionMatrix * view_pos;


    frag_positions = pos1;



    vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
    view_pos.xyz += position  * 10.0;
    // view_pos.xyz += position  * clamp(perlinNoise *10.0, 4.0, 10.0);
    gl_Position = projectionMatrix * view_pos;

    }
`

export const fragmentShader = glsl`
    varying vec2 vUv;
    varying vec3 frag_positions;
    uniform sampler2D uTexture;
    varying float colorRandom;
    uniform vec3 uColorPurple;
    uniform vec3 uColorBlue;
    uniform vec3 uColorGreen;
    uniform float uTime;
    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;
    uniform bool uInitialRender;

    void main() {
    vec4 texture = texture2D(uTexture, vUv);
    vec3 color = vec3(0.0);

    if (colorRandom >= 0.0 && colorRandom < 0.10) {
        color = uColorPurple;
    } else if (colorRandom >= 0.10 && colorRandom < 0.66) {
        color = uColorBlue;
    } else {
        color = uColorGreen;
    }

    float t = 0.0;
    float alpha = 0.0;
    
    if(uInitialRender == true) {
        alpha = 0.0;
    } else {
        if(uSwitch == true) {
        t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/(uAnimationDuration )); // Interpolation factor
        alpha = mix(0.0, 1.0, t);
        } else {
        t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration + 0.5); // Interpolation factor
        alpha = mix(1.0, 0.0, t);
        }
    }

    float gradient1 = smoothstep(1.0, 0.0, frag_positions.z);
    float gradient2 = smoothstep(-1.0, -0.0, frag_positions.z);

    float someAlpha = 1.0;

    if(frag_positions.x == 0.0 || frag_positions.y == 0.0) {
        someAlpha = 0.0;
    }


    // gl_FragColor = vec4(vUv,0.0,alpha * someAlpha);
    // gl_FragColor = vec4(vUv,0.0,alpha );
    // gl_FragColor = vec4(vUv,0.0,1.0 *gradient1 * gradient2);
    // gl_FragColor = texture;
    // gl_FragColor = vec4(color, texture.a * alpha) * 1.0;
    // gl_FragColor = vec4(color, texture.a * someAlpha) * 1.0;
    gl_FragColor = vec4(color, texture.a*gradient1 * gradient2  * someAlpha) * 1.0;
    }
`
