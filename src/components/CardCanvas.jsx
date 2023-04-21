import { useEffect, useRef, useState, Suspense } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { OrbitControls, Text3D as Text3DBase, Html } from '@react-three/drei'

// import CodeFont from '../assets/fonts/CONSOLA.TTF'
import { suspend } from 'suspend-react'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'

// const font = new FontLoader().parse(CodeFont)

import StagePhysics3D from './StagePhysics3D'
import BallPhysics3D from './BallPhysics3D'
import TextTo2DWord from './TextTo2DWord'
import Title3D from './Title3D'

function Text3D({ url, ...props }) {
  // Suspend while loading and parsing the TTF file.
  const font = suspend(() => {
    const loader = new TTFLoader()
    return new Promise((resolve) => {
      loader.load(url, resolve)
    })
  }, [url])

  return (
    <Text3DBase
      position={[-135, 35, 0]}
      font={font}
      {...props}
    />
  )
}

export default function CardCanvas({
  colorTheme,
  title,
  description,
  logo,
  png,
}) {
  const sphereRadius = 25

  let canvasRef = useRef(null)
  let planeRef = useRef(null)
  let pointLightRef = useRef(null)
  let htmlDivBackgroundRef = useRef(null)
  let titleFakeShadowRef = useRef(null)
  let iconLogoRef = useRef(null)

  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3())
  const [sphereDomX, setSphereDomX] = useState(null)
  const [sphereDomY, setSphereDomY] = useState(null)

  const handleVectorToDOM = (vector) => {
    const canvas = canvasRef.current
    if (canvas) {
      const canvasBounds = canvas.getBoundingClientRect()
      setSphereDomX(vector.x + canvasBounds.left)
      setSphereDomY(vector.y + canvasBounds.top)
    }
  }

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const canvasBounds = event.target.getBoundingClientRect()

    const mouseX = ((clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1
    const mouseY = -((clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1

    const mouseZ = 0

    setMousePosition(new THREE.Vector3(mouseX, mouseY, mouseZ))
  }

  const handlePointerEnter = () => {
    setIsMouseInside(true)
    htmlDivBackgroundRef.current.classList.add('opacity-100')
    titleFakeShadowRef.current.classList.add('opacity-100')
    iconLogoRef.current.classList.remove('opacity-100')
    iconLogoRef.current.classList.add('opacity-0')
  }
  const handlePointerLeave = () => {
    setIsMouseInside(false)
    htmlDivBackgroundRef.current.classList.remove('opacity-100')
    titleFakeShadowRef.current.classList.remove('opacity-100')
    iconLogoRef.current.classList.remove('opacity-0')
    iconLogoRef.current.classList.add('opacity-100')
  }

  // useFrame(() => {
  //   if (isMouseInside) {
  //   }
  // })

  useEffect(() => {
    console.log(isMouseInside)
  }, [isMouseInside])

  useEffect(() => {
    const canvas = canvasRef.current

    const handleWheel = (event) => {
      if (canvas && canvas.contains(event.target)) {
        event.preventDefault()
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  let descriptionTextArray = description.split(' ')

  useEffect(() => {
    console.log(colorTheme)
  }, [colorTheme])

  return (
    <div className="w-full h-full relative ">
      <Canvas
        shadows
        className="w-full h-full absolute inset-0 z-50"
        ref={canvasRef}
        onPointerMove={handleMouseMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        camera={{ position: [0, 0, 500], fov: 20 }}
        onWheel={(e) => e.preventDefault()}
      >
        <OrbitControls
          enableRotate={true}
          enableZoom={false}
          enablePan={false}
        />
        <pointLight
          castShadow
          ref={pointLightRef}
          position={[0, 0, 500]}
          intensity={2}
          // color="#7f4abb"
          color={`${colorTheme}`}
        />

        <Physics
          gravity={[0, 0, -1000]}
          defaultContactMaterial={{ restitution: 1 }}
        >
          {/* <Debug color="green"> */}
          <BallPhysics3D
            colorTheme={colorTheme}
            png={png}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            sphereRadius={sphereRadius}
            planeRef={planeRef}
            canvasRef={canvasRef}
            handleVectorToDOM={handleVectorToDOM}
          />
          <StagePhysics3D
            colorTheme={colorTheme}
            sphereRadius={sphereRadius}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            ref={planeRef}
          />

          {/* <Suspense>
            <Text3D
              url="/FiraCode-Bold.ttf"
              height={7}
              size={13}
              curveSegments={32}
              bevelEnabled
              bevelSegments={12}
              castShadow
            >
              &lt;{title}
              /&gt;
              <meshStandardMaterial
                color="#7f4abb"
                roughness={0.5}
              />
            </Text3D>
          </Suspense> */}
          {/* <Letter
            sphereRadius={sphereRadius}
            title="<React />"
          /> */}
          {/* <Suspense
              fallback={<Html className="text-white text-xl"> help meeee</Html>}
            > */}
          <Title3D
            // url="https://api.fontsource.org/v1/fonts/lora/latin-600-italic.ttf"
            url="/FiraCode-Bold.ttf"
            title={`<${title} />`}
            colorTheme={colorTheme}
          />
          {/* </Suspense> */}
          {/* </Debug> */}
        </Physics>
      </Canvas>
      <div className="absolute inset-0 flex-grow w-[365px] h-[195px] rounded-xl text-transparent ">
        <div className="grid grid-cols-4 w-full h-full p-8 relative">
          <div
            className="absolute inset-0 frontend-canvas-gradient opacity-0 transition-opacity duration-300"
            ref={htmlDivBackgroundRef}
          ></div>
          <div className={`col-span-3 pr-5`}>
            <p
              className="text-black/0 blur-[1px] mt-5 pl-2.5 text-lg font-semibold opacity-0 transition-opacity duration-300"
              ref={titleFakeShadowRef}
            >
              <code>&lt;{title} /&gt;</code>
            </p>
            <div className=" text-sm font-medium flex flex-wrap">
              {descriptionTextArray.map((word, index) => (
                <TextTo2DWord
                  key={index}
                  word={word}
                  sphereDomX={sphereDomX}
                  sphereDomY={sphereDomY}
                  isMouseInside={isMouseInside}
                />
              ))}
            </div>
          </div>
          <span
            className="opacity-100 opacity-0 transition-opacity duration-300"
            ref={iconLogoRef}
          >
            {logo}
          </span>
        </div>
      </div>
    </div>
  )
}
