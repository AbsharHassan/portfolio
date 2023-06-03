import { Suspense, useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { Box, Text, SpotLight, Html, Text3D } from '@react-three/drei'
import { suspend } from 'suspend-react'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader'

import { useBox } from '@react-three/cannon'
import PhysicsBox from './PhysicsBox'

const TitleText3D = ({
  position,
  sectionTitle,
  colorTheme,
  url,
  title,
  afterTitleRender,
  isMouseInside,
}) => {
  let dimX = 1
  let dimY = 18
  let dimZ = 10

  const [isBoxReady, setIsBoxReady] = useState(false)
  const [boxDimensions, setBoxDimensions] = useState(null)
  const [boxPosition, setBoxPosition] = useState(null)
  const [hasRendered, setHasRendered] = useState(false)
  const [textBB, setTextBB] = useState(null)
  const [isSpotLightReady, setIsSpotLightReady] = useState(false)

  let spotLightRef = useRef(null)
  let directionalLightRef = useRef(null)
  let textRef = useRef(null)

  // const [boxRef, api] = useBox(() => ({
  //   type: 'Static',
  //   // position: [-91.5, 44, -dimZ - dimZ / 2],
  //   rotation: [0, 0, 0],
  //   args: [dimX, dimY, dimZ],
  //   linearDamping: 0.9,
  //   angularDamping: 0.9,
  //   material: {
  //     friction: 1,
  //   },
  // }))

  // useEffect(() => {
  //   // console.log(textRef.current)
  //   const textBoundingBox = new THREE.Box3().setFromObject(textRef.current)
  //   const lengthX = textBoundingBox.getSize(new THREE.Vector3()).x
  //   // console.log(lengthX)
  //   // api.position.set(
  //   //   textRef.current.position.x + dimX / 2,
  //   //   textRef.current.position.y,
  //   //   textRef.current.position.z
  //   // )
  // }, [])

  const viewport = useThree((state) => state.viewport)
  useFrame((state) => {
    // spotLightRef.current.target.position.lerp(
    //   new THREE.Vector3().set(-91.5, -44, 0),
    //   //   new THREE.Vector3().set(-91.5, 200, 0),
    //   0.1
    // )
    // spotLightRef.current.target.updateMatrixWorld()
    // directionalLightRef.current.target.position.lerp(
    //   new THREE.Vector3().set(-91.5, -44, 0),
    //   //   new THREE.Vector3().set(-91.5, 200, 0),
    //   0.1
    // )
    // directionalLightRef.current.target.updateMatrixWorld()
    // console.log(directionalLightRef)
    if (textRef.current) {
      const textBoundingBox = new THREE.Box3().setFromObject(textRef.current)
      setTextBB(textBoundingBox)
      //   spotLightRef.current.target = textRef.current
      // console.log(spotLightRef.current.target.position)
      // console.log(textBoundingBox)
      const lengthX = textBoundingBox.max.x - textBoundingBox.min.x
      if (!isSpotLightReady) {
        spotLightRef.current.position.setX(
          spotLightRef.current.position.x + lengthX / 2
        )
        // spotLightRef.current.target.position.set(
        //   (textBoundingBox.max.x + textBoundingBox.min.x) / 2,
        //   (textBoundingBox.max.y + textBoundingBox.min.y) / 2,
        //   (textBoundingBox.max.z + textBoundingBox.min.z) / 2
        // )
        spotLightRef.current.target.position.set(
          (textBoundingBox.max.x + textBoundingBox.min.x) / 2,
          (textBoundingBox.max.y + textBoundingBox.min.y) / 2,
          (textBoundingBox.max.z + textBoundingBox.min.z) / 2
        )
        spotLightRef.current.target.updateMatrixWorld()
        setIsSpotLightReady(true)
      }
      //   spotLightRef.current.target.position.lerp(
      //     new THREE.Vector3().set(
      //       (textBoundingBox.max.x + textBoundingBox.min.x) / 2,
      //       (textBoundingBox.max.y + textBoundingBox.min.y) / 2,
      //       (textBoundingBox.max.z + textBoundingBox.min.z) / 2
      //     ),
      //     0.1
      //   )
      //   spotLightRef.current.target.updateMatrixWorld()
      // console.log(lengthX)
      if (Math.abs(lengthX) !== Infinity) {
        setIsBoxReady(true)
        // console.log(boxRef.current)
        // boxRef.current.updateMatrixWorld
        // api.scaleOverride([50, dimY, dimZ])
        setBoxDimensions([lengthX, dimY, dimZ])
        setBoxPosition([
          textRef.current.position.x + lengthX / 2,
          textRef.current.position.y,
          textRef.current.position.z,
        ])
        // api.position.set(
        //   textRef.current.position.x + lengthX,
        //   textRef.current.position.y,
        //   textRef.current.position.z
        // )
      }
    }
    // spotLightRef.current.target.position.lerp(
    //   new THREE.Vector3().set(-91.5, -44, 0),
    //   //   new THREE.Vector3().set(-91.5, 200, 0),
    //   0.1
    // )
    // spotLightRef.current.target.updateMatrixWorld()
  })

  useEffect(() => {
    return () => {
      // console.log(textRef)
      afterTitleRender(false)
    }
  }, [])

  const font = suspend(() => {
    const loader = new TTFLoader()
    return new Promise((resolve) => {
      loader.load(url, resolve)
    })
  }, [url])

  // if (!isMouseInside) return null

  return (
    <>
      {/* <pointLight
        castShadow
        position={[-60, 100, 200]}
        intensity={1}
        color="#f00"
      /> */}
      {/* <SpotLight
        castShadow
        // position={[-60, 100, 200]}/
        position={[3, 3, 2]}
        // distance={20}
        // decay={}
        // target={new THREE.Object3D(boxRef.current)}
        intensity={10000}
        angle={Math.PI / 15}
        attenuation={0}
        color="#b00c3f"
      /> */}
      {/* <SpotLight
        castShadow
        ref={spotLightRef}
        penumbra={0}
        distance={300}
        angle={Math.PI / 4}
        attenuation={0}
        decay={0.5}
        // anglePower={4}
        intensity={20}
        color="#421773"
        // target={new THREE.Vector3(-91.5, 44, -height - height / 2)}
        position={[-200, 200, 140]}
      /> */}
      {/* <directionalLight
        castShadow
        ref={directionalLightRef} 
        position={[-98, 120, 140]}
        intensity={1}
        color="#f00"
      /> */}
      {/* <Box
        ref={boxRef}
        args={[dimX, dimY, dimZ]}
      >
        <meshStandardMaterial
          color="#ff0000"
          transparent
          opacity={0}
        />
        <Text
          ref={textRef}
          fontSize={17}
          lineHeight={-1}
          letterSpacing={-0.01}
          position={[0, -1, dimZ + 10]}
          color="#7f4abb"
          //   color="#8151b9"
          //   color="#b047f1"
          castShadow
          font={url}
          fillOpacity={1}
        >
          {title}
        </Text>
      </Box> */}
      {isBoxReady && (
        <PhysicsBox
          dimensions={boxDimensions}
          position={boxPosition}
        />
      )}
      {/* <SpotLight
        castShadow
        ref={spotLightRef}
        penumbra={1}
        distance={100}
        angle={0.5235987755982988}
        attenuation={0}
        decay={2}
        // anglePower={4}
        intensity={50}
        // color="#421773"
        color="#fff"
        // target={new THREE.Vector3(-91.5, 44, -height - height / 2)}
        position={[position[0], -position[1] + 30, 50]}
      /> */}
      {/* <Text
        onAfterRender={() => {
          // console.log('rendered successfully')
          // if (isMouseInside) {
          //   afterTitleRender()
          // }
          setHasRendered(true)
        }}
        onUpdate={() => {
          if (hasRendered) afterTitleRender()
        }}
        ref={textRef}
        // fontSize={18.5}
        fontSize={10}
        lineHeight={-1}
        letterSpacing={0.0025}
        position={position}
        // position={[-132, 44, 20]}
        // color="#7f4abb"
        color={`${colorTheme}`}
        //   color="#8151b9"
        //   color="#b047f1"
        castShadow
        font={url}
        fillOpacity={1}
        anchorX="left"
      >
        {title}
      </Text> */}
      <spotLight
        castShadow
        ref={spotLightRef}
        penumbra={1}
        distance={200}
        angle={0.838805238508475}
        attenuation={0}
        decay={2}
        // anglePower={4}
        intensity={15}
        // color="#421773"
        // color="#7f4abb"
        color={`${colorTheme.light}`}
        // color="#fff"
        // target={new THREE.Vector3(-91.5, 44, -height - height / 2)}
        position={[position[0], position[1] + 50, 50]}
      />
      <Suspense>
        <Text3D
          ref={textRef}
          //   rotation={[0.1, 0, 0.1]}
          position={position}
          //   position={[position[0] + 150, position[1] + 40, position[2]]}
          font={font}
          height={1}
          size={13.5}
          curveSegments={32}
          bevelEnabled
          bevelSegments={12}
          castShadow
          letterSpacing={-0.15}
          anchorX={0}
          //   anchorX="left"
          onAfterRender={() => {
            // console.log('rendered successfully')
            // if (isMouseInside) {
            //   afterTitleRender()
            // }
            setHasRendered(true)
          }}
          onUpdate={() => {
            if (hasRendered) afterTitleRender(true)
          }}
        >
          {title}
          <meshStandardMaterial
            polygonOffset={true}
            // polygonOffsetUnits={}
            // color="#7f4abb"
            // transparent
            // opacity={0}
            color={`${colorTheme.title}`}
            roughness={0.3}
          />
        </Text3D>
      </Suspense>
    </>
  )
}

export default TitleText3D
