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
  uColorPurple: { value: new Color(10.0, 0.38, 10.0) },
  // uColorPurple: new Color(5.0, 0.38, 5.0),
  // uColorPurple: new Color(2, 0.38, 2),
  uColorBlue: { value: new Color(0.35 * 1, 0.51 * 1, 0.98 * 1) },
  uColorGreen: { value: new Color(0.04 * 1, 0.66 * 1, 0.72 * 1) },
  uSwitch: { value: false },
  uAnimationTime: { value: 0 },
  uAnimationDuration: { value: 0.5 },
  uTriggerTime: { value: 100000000000 },
  uInterpolate: { value: 0 },
}

export const vertexShader = glsl`
    attribute vec3 pos1;
    attribute vec3 pos2;
    varying vec2 vUv;
    uniform vec3 uSpherePos;
    attribute float size;
    attribute float colorRand;
    uniform float uTime;
    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;
    varying float colorRandom;
    uniform float uInterpolate;
    
    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    void main() {
        // Setting up the varyings
        vUv = uv;
        colorRandom = colorRand;

        // Declaring some variables
        vec3 pos = vec3(0.0);  
        float t = 0.0;
        float noiseScale = 0.1;

        // if(uSwitch == true) {
        //     noiseScale = smoothstep(1.0, 0.0, (uTime - uTriggerTime)/uAnimationDuration) * 0.1;
        //     t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        //     pos = mix(pos1, pos2, t);
        // } else {
        //     noiseScale = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration) * 0.1;
        //     t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        //     pos = mix(pos2, pos1, t);
        // }

        pos = mix(pos1, pos2, uInterpolate);

        noiseScale = mix(0.1, 0.0, uInterpolate);
        
        // Setting particle position 
        vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;

        // Simplex noise generation
        float noiseFreq = 1.5;
        float noiseAmp = 0.5;
        float slowTime = 0.1;
        vec3 noisePos = vec3(size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime, size*noiseFreq + uTime*slowTime);
        float simplexNoise = snoise3(noisePos) * noiseAmp;

        // Perlin noise generation
        float perlinNoise = cnoise(particle_position + uTime * 0.2) * noiseScale;

        // Creating mouse interactive behaviour
        float distanceToSphere = pow(abs(1.5 - clamp(length(uSpherePos.xy - particle_position.xy), 0.0, 1.0)), 9.0);
        // float distanceToSphere = pow(2.0 - clamp(length(uMousePos.xy - final_position.xy), 0.0, 1.0), 9.0);
        vec3 dir = particle_position - uSpherePos;
        particle_position = mix(particle_position, uSpherePos + normalize(dir)*0.8,  distanceToSphere*0.00745);

        // particle_position = particle_position + normalize(particle_position) * perlinNoise * 1.0;git 
        
        // Applying noise to partice positions

        particle_position.x += perlinNoise *0.5;
        particle_position.y += perlinNoise *0.5;

        // Setting size of particles and rendering them
        vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
        view_pos.xyz += position * clamp((size + perlinNoise*10.0  ), 0.75, 1.5) * 1.0;
        // view_pos.xyz += position * 0.75;
        gl_Position = projectionMatrix * view_pos;
    }
`

export const fragmentShader = glsl`
    varying vec2 vUv;
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
    uniform float uInterpolate;


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
        float alpha = 1.0;
        
        // if(uSwitch == true) {
        // t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/(uAnimationDuration + 0.5)); // Interpolation factor
        // alpha = mix(1.0, 0.0, t);
        // } else {
        // t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        // alpha = mix(0.0, 1.0, t);
        // }

        alpha = mix(1.0, 0.0, uInterpolate);
        

        // gl_FragColor = vec4(vUv,0.0,alpha);
        // gl_FragColor = vec4(vUv,0.0,1.0);
        // gl_FragColor = texture;
        gl_FragColor = vec4(color, texture.a * alpha) * 1.0;
    }
`
