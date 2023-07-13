import { Canvas } from '@react-three/fiber'
import {
  Environment,
  Html,
  OrbitControls,
  PresentationControls,
  useGLTF,
} from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import L_3 from './L_3'
import TestLaptop from './TestLaptop'
import MockSingleProject from './MockSingleProject'

const Projects = () => {
  return (
    <div className="w-full h-full ">
      <MockSingleProject />
    </div>
  )
}

export default Projects

// {/* <L_3>
//           <Html
//             wrapperClass="laptop"
//             transform
//             position={[0, 0.6, 0.015]}
//             distanceFactor={1.16}
//             scale={0.75}
//             occlude="blending"
//             // occlude
//           >
//             <iframe
//               title="iframe"
//               src="https://flood-tracker.onrender.com/"
//               //   src="http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login"
//             />
//           </Html>
//         </L_3> */}
