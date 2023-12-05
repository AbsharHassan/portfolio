import glsl from 'babel-plugin-glsl/macro'
import { Vector2 } from 'three'

export const uniforms = {
  uTime: { value: 0 },
  uScene: { value: null },
  uFloatingParticles: { value: null },
  uResolution: { value: new Vector2(window.innerWidth, window.innerHeight) },
  uDisplacement: { value: null },
  uScale: { value: 0 },
  uCosFuncScale1: { value: 0.1 },
  uCosFuncScale2: { value: 0.1 },
  uCosFuncScale3: { value: 0.1 },
  uCosFuncScale4: { value: 0.1 },
  uCosFuncScale5: { value: 0.1 },
  uMixX: { value: 0.15 },
  uAnimationProgress: { value: 0.0 },
  uSceneOpacity: { value: 0.0 },
  uTimeFactor: { value: 0.03 },
  uModelBrightness: { value: 1.0 },
  uParticleBrightness: { value: 1.0 },
  uModelRipplesMix: { value: 1.0 },
  uParticleRipplesMix: { value: 1.0 },
  uDimmingMix: { value: 0.0 },
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

    uniform sampler2D uScene;
    uniform sampler2D uFloatingParticles;
    uniform sampler2D uDisplacement;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float uScale;
    uniform float uMixX;
    uniform float uCosFuncScale1;
    uniform float uCosFuncScale2;
    uniform float uCosFuncScale3;
    uniform float uCosFuncScale4;
    uniform float uCosFuncScale5;
    uniform float uAnimationProgress;
    uniform float uSceneOpacity;
    uniform float uTimeFactor;
    uniform float uModelBrightness;
    uniform float uParticleBrightness;
    uniform float uModelRipplesMix;
    uniform float uParticleRipplesMix;
    uniform float uDimmingMix;

    float PI = 3.141592653589793238;

    // void main() {
    // vec2 uv = gl_FragCoord.xy / uResolution.xy;
    // //   vec3 color = vec3(uv, 1.0);
    // //   color = texture2D(uScene, uv).rgb;
    // //   // Do your cool postprocessing here
    // //   color.r += sin(uv.x * 50.0);


    // vec4 displacement = texture2D(uDisplacement, uv);
    
    // float theta = displacement.r * 2.0 * PI;

    // vec2 dir = vec2(sin(theta), cos(theta));

    // vec2 new_uv = uv + dir * displacement.r * 0.075;

    // vec4 color = texture2D(uScene, new_uv);

    // //   gl_FragColor = vec4(color, 1.0);
    // gl_FragColor = color;
    // }

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;

      vec2 newUV = uv;

      vec2 centeredUV = (1.0 * uv) - vec2(0.5);

      float scaledTime = uTimeFactor*uTime;
      // float scaledTime = 1.0*uTime;


      //scale 100 gives a nice soft glow with nosie effect
      // float scale = abs(uv.x - 0.5) *uScale;
      float scale = 1.75;

      centeredUV += uCosFuncScale1*cos(scale*2.0*centeredUV.yx + scaledTime + vec2(1.2, 3.4));
      centeredUV += uCosFuncScale2*cos(scale*31.0/10.0*centeredUV.yx + 1.4*scaledTime + vec2(2.2, 3.4));
      centeredUV += uCosFuncScale3*cos(scale*7.0*centeredUV.yx + 2.6*scaledTime + vec2(4.2, 1.4));
      centeredUV += uCosFuncScale4*cos(scale*13.0*centeredUV.yx + 3.7*scaledTime + vec2(10.2, 3.4));
      // centeredUV += uCosFuncScale4*0.314*tan(scale*1.0*centeredUV.yx + 0.7*scaledTime + vec2(10.2, 3.4));

      newUV = uv + centeredUV*vec2(1.0, 0.0);
      newUV.x = mix(uv.x, length(centeredUV)*1.0,0.5 * uAnimationProgress); 
      newUV.y = mix(uv.y, 0.0, 1.0 * uAnimationProgress); 

      // // using smoothstep instead of mix gives a nice effect as well
      // newUV.x = smoothstep(uv.x, length(centeredUV)*1.0,uMixX * uAnimationProgress); 
      // newUV.y = smoothstep(uv.y, 0.0, 1.0 * uAnimationProgress); 


      // adding ripples
      vec4 displacement = texture2D(uDisplacement, uv);
      float theta = displacement.r * 2.0 * PI;
      vec2 dir = vec2(sin(theta), cos(theta));
      vec2 ripple_uv = newUV + dir * displacement.r * 0.075;

      // sampler2D fullScene = uScene + uFloatingParticles;

      vec4 colorModel = texture2D(uScene, mix(newUV, ripple_uv, uModelRipplesMix)) * uModelBrightness;
      vec4 colorParticles = texture2D(uFloatingParticles, mix(newUV, ripple_uv, uParticleRipplesMix)) * uParticleBrightness;

      // vec4 colorModel = texture2D(uScene, newUV);
      // vec4 colorParticles = texture2D(uFloatingParticles, newUV);
      

      vec4 color = colorModel + colorParticles;
      // finished adding ripples


      float dimmingGradient = mix(1.0, smoothstep(0.5, 0.25, abs(uv - vec2(0.5)).y), uDimmingMix);
      // float gradient2 = smoothstep(-10.0, -0.0, abs(uv - vec2(0.5)).y);

      // gl_FragColor = color;
      // gl_FragColor = vec4(color.rgb, color.a  ) * gradient1;
      gl_FragColor = vec4(color.rgb, color.a) * dimmingGradient;
      // gl_FragColor = vec4(uv.x, uv.y, 0, 1.0);
      // gl_FragColor = vec4(abs(uv.x - 0.5), 0.0,0.0,1.0);
      // gl_FragColor = vec4(color.rgb, color.a  ) ;
      // gl_FragColor = vec4(gradient1, 0.0, 0.0, 1.0);
      // gl_FragColor = vec4(abs(uv - vec2(0.5)), 0.0, 1.0);

      // gl_FragColor = vec4(length(centeredUV), 0.0, 0.0, 1.0);
    }
`
