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
  //   uColorPurple: { value: new Color(0.76, 0.38, 1.0) },
  // uColorPurple: new Color(5.0, 0.38, 5.0),
  uColorPurple: { value: new Color(2, 0.38, 2) },
  uColorBlue: { value: new Color(0.35, 0.51, 0.98) },
  uColorGreen: { value: new Color(0.04, 0.66, 0.72) },
  uSwitch: { value: false },
  uAnimationTime: { value: 0 },
  uAnimationDuration: { value: 0.5 },
  uTriggerTime: { value: 100000000000 },
  uInitialRender: { value: true },
  uSizeScale: { value: 1 },
  uInterpolate: { value: 0 },
  uMouseBehaviour: { value: window.innerWidth > 640 ? 1 : 0 },
}

export const vertexShader = glsl`
    attribute vec3 pos;
    attribute vec3 aSpaceDustPos;
    attribute float aSpaceDustOpacity;
    varying float vSpaceDustOpacity;
    varying vec3 frag_positions;
    varying vec2 vUv;
    uniform float uInterpolate;
    uniform vec3 uSpherePos;
    attribute float size;
    attribute float colorRand;
    attribute float randomSize;
    uniform float uTime;
    uniform float uMouseBehaviour;
    uniform float uSizeScale;
    varying float colorRandom;
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    void main() {
        // Setting up the varyings
        frag_positions = pos;
        vUv = uv;
        colorRandom = colorRand;
        vSpaceDustOpacity = aSpaceDustOpacity;

        vec3 actualPos = mix(aSpaceDustPos, pos, uInterpolate);

        // Setting particle position
        vec3 particle_position = (modelMatrix * vec4(actualPos, 1.0)).xyz;
        // particle_position.y = particle_position.y - 1.5; 
        // particle_position.y = particle_position.y - 2.0 

        // particle_position.y = particle_position.y - 2.5;

        // // Simplex noise generation
        // float noiseFreq = 1.5;
        // float noiseAmp = 0.5;
        // float slowTime = 0.1;
        // vec3 noisePos = vec3(size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime);
        // float simplexNoise = snoise3(noisePos) * noiseAmp;

        // // Perlin noise generation
        float perlinNoiseFast = cnoise(particle_position + uTime * 0.3);
        float perlinNoiseSlow = cnoise(particle_position + uTime * 0.2);

        float perlinNoise = mix(perlinNoiseSlow, perlinNoiseFast, uInterpolate);


        // Creating mouse interactive behaviour
        float distanceToSphere = pow(1.0 - clamp(length(uSpherePos.xy - particle_position.xy) -0.0, 0.0, 1.0), 10.0);
        vec3 dir = particle_position - uSpherePos;
        particle_position = mix(particle_position, uSpherePos + normalize(dir)*2.0, mix(0.0 , distanceToSphere*0.1, (1.0 - uInterpolate)*uMouseBehaviour));

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

        


        particle_position.x += perlinNoise * mix(0.025, 0.0, uInterpolate);
        particle_position.y += perlinNoise * mix(0.025, 0.0, uInterpolate);


        vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
        // if(colorRand < 0.09) {
        //   view_pos.xyz += position  * 5.0;
        // } else  {
        //   view_pos.xyz += position  * 1.0;
        // }
        // view_pos.xyz += position  * uSizeScale;
        // view_pos.xyz += position  * clamp(perlinNoise*5.0, 0.5, 5.0);

        view_pos.xyz += position  *  mix(
            clamp(perlinNoise*5.0, mix(2.0, 0.5, uInterpolate), mix(3.0, 3.0, uInterpolate)), 
            uSizeScale, 
            clamp((uSizeScale - 1.0), 0.0, 1.0));

        // view_pos.xyz += position * 3.0;
        // view_pos.xyz += position  * clamp(perlinNoise *15.0, 3.75, 15.0);


        gl_Position = projectionMatrix * view_pos;

    }
`

export const fragmentShader = glsl`
    varying vec2 vUv;
    varying vec3 frag_positions;
    varying float vSpaceDustOpacity;
    uniform sampler2D uTexture;
    varying float colorRandom;
    uniform float uInterpolate;

    uniform vec3 uColorPurple;
    uniform vec3 uColorBlue;
    uniform vec3 uColorGreen;
    uniform float uTime;
    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;
    uniform bool uInitialRender;
    uniform float uSizeScale;


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

        // // for FOV of 10
        // float gradient1 = smoothstep(1.0, 0.0, frag_positions.z);
        // float gradient2 = smoothstep(-1.0, -0.0, frag_positions.z);
        float gradient1 = 1.0;
        float gradient2 = 1.0;
        

        // // for default FOV
        // float gradient1 = smoothstep(1.5, 0.0, frag_positions.z);
        // float gradient2 = smoothstep(-1.5, -0.0, frag_positions.z);

        float actualOpacity = mix(vSpaceDustOpacity, 1.0, uInterpolate);


        // gl_FragColor = vec4(vUv, 0.0,1.0);
        // gl_FragColor = vec4(vUv, 0.0,1.0) * actualOpacity;
        // gl_FragColor = vec4(color,1.0 * gradient1 * gradient2);
        // gl_FragColor = vec4(vUv,0.0,1.0 *gradient1 * gradient2);
        // gl_FragColor = texture;
        // gl_FragColor = vec4(color, texture.a * alpha) * 1.0;
        // gl_FragColor = vec4(color, texture.a) * 1.0;
        gl_FragColor = vec4(color, texture.a*gradient1 * gradient2 ) / max((uSizeScale * 0.5), 1.0) * actualOpacity;
    }
`
