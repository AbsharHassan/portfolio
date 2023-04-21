import { OrbitControls, Decal, useTexture, Svg } from '@react-three/drei'
import { ReactComponent as ReactSVG } from '../assets/tech/svg/react-logo.svg'
// import myTexture from '../assets/react-png.png'
// import myPNG from '../assets/react-png-nobg.png'
import mySVG from '../assets/tech/svg/react-logo.svg'

const NewSphere = () => {
  //   const svgTexture = useTexture(myPNG)
  //   const [texture] = useTexture(() => new Svg(mySVG).getTexture())
  //   const [decal] = useTexture([<ReactSVG className="w-2 h-2" />])
  return (
    <>
      <OrbitControls />
      <mesh>
        <sphereGeometry args={[1, 64, 32]} />
        <meshStandardMaterial
          color="#00ff83"
          //   map={useTexture(myTexture)}
          //   map={texture}
        />
        <Decal
          position={[0, 0, 1]}
          //   map={svgTexture}
        />
      </mesh>
      <pointLight
        position={[0, 10, 10]}
        intensity={1}
      />

      {/* <ambientLight args={['#ffffff', 1]} /> */}
    </>
  )
}

export default NewSphere

// return (
//     <>
//       <OrbitControls />
//       <mesh>
//         <sphereGeometry args={[1, 64, 32]} />
//         <meshStandardMaterial
//           color="#00ff83"
//           //   map={useTexture(myTexture)}
//         />
//         <Decal
//           position={[0, 0, 1]}
//           map={svgTexture}
//         />
//       </mesh>
//       <pointLight
//         position={[0, 0, 10]}
//         intensity={1}
//       />

//       {/* <ambientLight args={['#ffffff', 1]} /> */}
//     </>
//   )
