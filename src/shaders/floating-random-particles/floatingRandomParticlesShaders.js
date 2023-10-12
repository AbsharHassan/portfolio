import { TextureLoader, Vector3, Color } from 'three'
import glsl from 'babel-plugin-glsl/macro'

export const uniforms = {
  uTime: { value: 0 },
  uMousePos: { value: new Vector3(-20, 0, 0) },
  uMask: {
    value: new TextureLoader().load(
      './particles/—Pngtree—hazy white glow_6016180.png'
    ),
  },
  uColorPurple: { value: new Color(1.0, 0.38, 1.0) },
  // uColorPurple: new Color(5.0, 0.38, 5.0),
  // uColorPurple: new Color(2, 0.38, 2),
  uColorBlue: { value: new Color(0.35 * 1, 0.51 * 1, 0.98 * 1) },
  uColorGreen: { value: new Color(0.04 * 1, 0.66 * 1, 0.72 * 1) },

  uSwitch: { value: false },
  uAnimationTime: { value: 0 },
  uAnimationDuration: { value: 0.5 },
  uTriggerTime: { value: 100000000000 },
  uInitialRender: { value: true },
  uInterpolate: { value: 0 },
  uSizeScale: { value: 0.0 },
  uOffsetX: { value: 0.0 },
  uOffsetY: { value: 0.0 },
  uTimeScale: { value: 0.001 },
}

export const vertexShader = glsl`
    attribute vec3 aWordPos;
    attribute vec3 aSpreadPos;
    attribute float aRandom;
    attribute float aColorRandom;
    varying float vRandom;
    varying float vColorRandom;
    varying vec2 vUv;
    varying vec3 frag_positions;

    uniform float uTime;
    uniform vec3 uMousePos;
    uniform float uInterpolate;
    uniform float uTimeScale;


    uniform bool uSwitch;
    uniform float uAnimationTime;
    uniform float uAnimationDuration;
    uniform float uTriggerTime;
    uniform float uSizeScale;

    uniform float uOffsetX;
    uniform float uOffsetY;


    #pragma glslify: snoise3 = require(glsl-noise/simplex/3d.glsl);
    #pragma glslify: cnoise = require(glsl-noise/classic/3d.glsl);

    vec3 snoiseVec3( vec3 x ){

      float s  = snoise3(vec3( x ));
      float s1 = snoise3(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
      float s2 = snoise3(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
      vec3 c = vec3( s , s1 , s2 );
      return c;

    }


    vec3 curlNoise( vec3 p ){
      
      const float e = .1;
      vec3 dx = vec3( e   , 0.0 , 0.0 );
      vec3 dy = vec3( 0.0 , e   , 0.0 );
      vec3 dz = vec3( 0.0 , 0.0 , e   );

      vec3 p_x0 = snoiseVec3( p - dx );
      vec3 p_x1 = snoiseVec3( p + dx );
      vec3 p_y0 = snoiseVec3( p - dy );
      vec3 p_y1 = snoiseVec3( p + dy );
      vec3 p_z0 = snoiseVec3( p - dz );
      vec3 p_z1 = snoiseVec3( p + dz );

      float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
      float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
      float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

      const float divisor = 1.0 / ( 2.0 * e );
      return normalize( vec3( x , y , z ) * divisor );

    }


    void main() {
        vUv = uv;
        vRandom = aRandom;
        vColorRandom = aColorRandom;
        frag_positions = aSpreadPos;

        // Generate random values
        float rand1 = fract(sin(dot(aWordPos.xy, vec2(12.9898, 78.233))) * 43758.5453);
        float rand2 = fract(sin(dot(aWordPos.xy, vec2(37.3792, 63.9123))) * 43758.5453);


        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // vec3 pos = vec3(0.0);  
        // float t = 0.0;
        // float noiseScale = 1.0;

        // if(uSwitch == true) {
        //   noiseScale = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration);
        //   t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        //   pos = mix(aWordPos, aSpreadPos, t);
        // } else {
        //   noiseScale = smoothstep(1.0, 0.0, (uTime - uTriggerTime)/uAnimationDuration);
        //   t = smoothstep(0.0, 1.0, (uTime - uTriggerTime)/uAnimationDuration); // Interpolation factor
        //   pos = mix(aSpreadPos, aWordPos, t);
        // }
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////
        // /////////////////////////////////////////////////////////

        vec3 pageWordPos = vec3(aWordPos.x + uOffsetX, aWordPos.y + uOffsetY, aWordPos.z);

        vec3 pos = mix(aSpreadPos, pageWordPos, uInterpolate);


        // vec3 pos = mix(aSpreadPos, pageWordPos, uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate*uInterpolate);

        float noiseScale = mix(1.0, 0.0, uInterpolate); 

        

        vec3 particle_position = (modelMatrix * vec4(pos, 1.0)).xyz;

        // // Perlin noise generation
        // float perlinNoise = cnoise(particle_position + uTime * uTimeScale);
        float perlineNoiseSlow = cnoise(particle_position + uTime * 0.001);
        float perlineNoiseFast = cnoise(particle_position + uTime * 0.3);

        float perlinNoise = mix(perlineNoiseSlow, perlineNoiseFast, uInterpolate);
        // float perlinNoise = cnoise(particle_position + uTime * mix(0.001, 0.2, uSizeScale - 1.0));
        float perlinNoise2 = cnoise(aSpreadPos*aRandom + aRandom*aRandom);

        // // Perlin noise
        // particle_position.x += 0.1*perlinNoise;
        // particle_position.y += 0.1*perlinNoise;
        // particle_position = particle_position + normalize(particle_position) * perlinNoise * 0.2;

        // vec4 view_pos = viewMatrix * vec4(particle_position, 1.0);
        // view_pos.xyz += position  * 1.2*perlinNoise ;
        // gl_Position = projectionMatrix * view_pos;


        vec3 distortion = curlNoise(vec3(
          particle_position.x , 
          particle_position.y ,
          0.0
          ));

        vec3 final_position = particle_position + 0.0*distortion +0.0;  
        final_position.y = final_position.y + noiseScale*(-7.0 + aRandom*10.0);
        final_position.x = final_position.x + noiseScale*(perlinNoise*0.5 );


        // float distanceToSphere = pow(2.0 - clamp(length(uMousePos.xy - final_position.xy), 0.0, 1.0), 9.0);
        // vec3 dir = final_position - uMousePos;
        // final_position = mix(final_position, uMousePos + normalize(dir)*0.01, distanceToSphere*0.01);

        float distanceToSphere = pow(2.0 - clamp(length(uMousePos.xy - final_position.xy), 0.0, 1.0), 9.0);
        vec3 dir = final_position - uMousePos;
        final_position = mix(final_position, uMousePos + normalize(dir)*0.01, (1.0-noiseScale) * distanceToSphere*0.00745);


        vec4 view_pos = viewMatrix * vec4(final_position, 1.0);
        // view_pos.xyz += position * clamp(10.0*rand1, 1.0, 1.0*(1.0-noiseScale) +1.3);
        // view_pos.xyz += position * 1.0 * uSizeScale;
        view_pos.xyz += position * uSizeScale * mix(1.0, clamp(perlinNoise*3.5,1.0,3.5), uSizeScale -1.0);
        // gl_Position = projectionMatrix * view_pos;
        gl_Position = projectionMatrix * view_pos;

        // gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`

export const fragmentShader = glsl`
  varying vec2 vUv;
  varying vec3 frag_positions;
  varying float vRandom;
  varying float vColorRandom;
  uniform vec3 uColorPurple;
  uniform vec3 uColorBlue;
  uniform vec3 uColorGreen;
  uniform sampler2D uMask;
  uniform sampler2D uTexture;
  uniform float uSizeScale;


  void main() {
      // vec4 color = texture2D(uTexture, vUv);
      vec4 maskTexture = texture2D(uMask, vUv);
      // vec4 image = texture2D(uTexture, newUv);

      // gl_FragColor = image;
      // gl_FragColor.a *= maskTexture.a;
      // gl_FragColor = vec4(newUv,0.0, 1.0);
      // gl_FragColor.a *= maskTexture.a;


      // Generate random values
      float rand1 = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
      float rand2 = fract(sin(dot(vUv, vec2(37.3792, 63.9123))) * 43758.5453);

      vec3 color = vec3(0.0);

      if (vColorRandom >= 0.0 && vColorRandom < 0.30) {
        color = uColorPurple;
      } else if (vColorRandom >= 0.30 && vColorRandom < 0.66) {
        color = uColorBlue;
      } else {
        color = uColorGreen;
      }

      vec2 centeredUV = vUv - vec2(0.5);
      float radius = 0.5;
      float distanceFromCenter = length(centeredUV);

      float gradient1 = smoothstep(0.05, 0.0, frag_positions.y);
      float gradient2 = smoothstep(-0.05, -0.0, frag_positions.y);

      // gl_FragColor = vec4(color, step(distanceFromCenter,radius)) * 1.0;
      // gl_FragColor = vec4(color, maskTexture.a ) * 1.0;
      // * mix(1.0, 3.0, clamp(0.0,1.0, uSizeScale -1.0))
      gl_FragColor = vec4(vUv, 0.0,1.0) * 1.0;

      // if(vRandom < 1.0) {
      //   // discard;
      //   // gl_FragColor = vec4(vUv, 0.0, 1.0);
      //   // gl_FragColor.a *= maskTexture.a;
      //   gl_FragColor = vec4(color, maskTexture.a) * 1.0;
      // } else {
      //   gl_FragColor = vec4(0.0);
      // }
    
  }
`
