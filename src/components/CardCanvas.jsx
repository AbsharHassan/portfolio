import { useEffect, useRef, useState, Suspense } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Canvas, useFrame } from '@react-three/fiber'
import { Physics, Debug } from '@react-three/cannon'
import { OrbitControls, Text3D as Text3DBase, Html } from '@react-three/drei'
import VanillaTilt from 'vanilla-tilt'

// import CodeFont from '../assets/fonts/CONSOLA.TTF'
import { suspend } from 'suspend-react'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'

// const font = new FontLoader().parse(CodeFont)

import StagePhysics3D from './StagePhysics3D'
import BallPhysics3D from './BallPhysics3D'
import TextTo2DWord from './TextTo2DWord'
import Title3D from './Title3D'
import TitleText3D from './TitleText3D'

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
  isSectionLit,
  sectionTitle,
  title,
  description,
  logo,
  png,
  scale,
  tiltElements,
  handlePointerEnter,
  handlePointerLeave,
  handleTitleRenderConfirm,
  handleVectorToDOM,
  isScreenSmall,
}) {
  const sphereRadius = 25
  const titleTextPosition = [-127.5, 39, -10]

  let canvasRef = useRef(null)
  let planeRef = useRef(null)
  let pointLightRef = useRef(null)
  let htmlDivBackgroundRef = useRef(null)
  let titleFakeShadowRef = useRef(null)
  let iconLogoRef = useRef(null)

  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3())
  const [hasTitleRendered, setHasTitleRendered] = useState(false)
  const [sphereDomX, setSphereDomX] = useState(null)
  const [sphereDomY, setSphereDomY] = useState(null)
  const [colorTheme, setColorTheme] = useState(null)

  const convertVectorToDOM = (vectorX, vectorY) => {
    const canvas = canvasRef.current
    console.log(vectorX, vectorY)
    if (canvas) {
      if (vectorX === null || vectorY === null) {
        handleVectorToDOM(null, null)
      } else {
        const canvasBounds = canvas.getBoundingClientRect()
        const x = vectorX + canvasBounds.left
        const y = vectorY + canvasBounds.top
        handleVectorToDOM(x, y)
      }
      // setSphereDomX(vector.x + canvasBounds.left)
      // setSphereDomY(vector.y + canvasBounds.top)
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

  const onPointerEnter = () => {
    handlePointerEnter()
    setIsMouseInside(true)
    // htmlDivBackgroundRef.current.classList.add('opacity-100')
    // titleFakeShadowRef.current.classList.add('opacity-100')
    // if (isSectionLit) {
    //   iconLogoRef.current.classList.remove('opacity-100')
    //   iconLogoRef.current.classList.add('opacity-0')
    // }
  }
  const onPointerLeave = () => {
    handlePointerLeave()
    setIsMouseInside(false)
    // htmlDivBackgroundRef.current.classList.remove('opacity-100')
    // titleFakeShadowRef.current.classList.remove('opacity-100')
    // iconLogoRef.current.classList.remove('opacity-0')
    // iconLogoRef.current.classList.add('opacity-100')
    // setHasTitleRendered(false)
  }

  const getTitleRenderConfirm = (value) => {
    handleTitleRenderConfirm(isMouseInside && value)
    // setHasTitleRendered(isMouseInside)
    // VanillaTilt.init(tiltElements, {
    //   max: 10,
    //   speed: 1000,
    //   scale: 1.05,
    //   reverse: true,
    // })
  }

  useEffect(() => {
    // console.log(hasTitleRendered)
  }, [hasTitleRendered])

  useEffect(() => {
    // console.log(tiltElements)
  }, [tiltElements])

  useEffect(() => {
    // console.log(isMouseInside)
    if (!isMouseInside) {
      setHasTitleRendered(false)
      tiltElements?.forEach((el) => {
        // console.log(el)
        // el.vanillaTilt?.destroy()
      })
    }
  }, [isMouseInside])

  useEffect(() => {
    if (sectionTitle === 'frontend') {
      setColorTheme({
        light: '#7f4abb',
        plane: '#888',
        title: '#7f4abb',
        ball: '#113',
        roughness: 0.5,
      })
    } else if (sectionTitle === 'backend') {
      setColorTheme({
        light: '#5a82f9',
        plane: '#fff',
        title: '#5a82f9',
        ball: '#113',
        roughness: 0.5,
      })
    } else if (sectionTitle === 'devops') {
      setColorTheme({
        light: '#09a9b8',
        plane: '#fff',
        // plane: '#00e0f4',
        title: '#00e0f4',
        ball: '#133',
        roughness: 0.5,
      })
    }
  }, [sectionTitle])

  // useEffect(() => {
  //   const canvas = canvasRef.current

  //   const handleWheel = (event) => {
  //     if (canvas && canvas.contains(event.target)) {
  //       event.preventDefault()
  //     }
  //   }

  //   window.addEventListener('wheel', handleWheel, { passive: false })

  //   return () => {
  //     window.removeEventListener('wheel', handleWheel)
  //   }
  // }, [])

  let descriptionTextArray = description.split(' ')

  useEffect(() => {
    // console.log(colorTheme)
  }, [colorTheme])

  // useEffect(() => {

  // }, [isScreenSmall])

  return (
    <div className="w-full h-full relative">
      {!isScreenSmall && (
        <Canvas
          key={`${isScreenSmall}`}
          shadows
          className="w-full h-full absolute inset-0"
          ref={canvasRef}
          onPointerMove={handleMouseMove}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          camera={{ position: [0, 0, 500], fov: 20 }}
          // onWheel={(e) => e.preventDefault()}
        >
          {/* <Title3D
          position={titleTextPosition}
          url="/CONSOLA.ttf"
          title={`<${title} />`}
          colorTheme={colorTheme}
          sectionTitle={sectionTitle}
          afterTitleRender={handleTitleRenderConfirm}
          isMouseInside={isMouseInside}
        /> */}

          {isMouseInside && isSectionLit && (
            <>
              <OrbitControls
                enableRotate={false}
                enableZoom={false}
                enablePan={false}
              />
              {/* <ambientLight intensity={4} /> */}
              <pointLight
                castShadow
                ref={pointLightRef}
                position={[0, 0, 500]}
                intensity={2}
                // color="#7f4abb"
                color={`${colorTheme.light}`}
              />

              <Physics
                gravity={[0, 0, -10000]}
                defaultContactMaterial={{ restitution: 1 }}
              >
                {/* <Debug color="green"> */}
                {/* <BallPhysics3D
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
          /> */}

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

                <>
                  <BallPhysics3D
                    colorTheme={colorTheme}
                    png={png}
                    scale={scale}
                    mousePosition={mousePosition}
                    isMouseInside={isMouseInside}
                    sphereRadius={sphereRadius}
                    planeRef={planeRef}
                    canvasRef={canvasRef}
                    convertVectorToDOM={convertVectorToDOM}
                    sectionTitle={sectionTitle}
                  />
                  <StagePhysics3D
                    colorTheme={colorTheme}
                    sphereRadius={sphereRadius}
                    mousePosition={mousePosition}
                    isMouseInside={isMouseInside}
                    ref={planeRef}
                  />

                  {/* <Title3D
                  position={titleTextPosition}
                  url="/CONSOLA.ttf"
                  title={`<${title} />`}
                  colorTheme={colorTheme}
                  sectionTitle={sectionTitle}
                  afterTitleRender={handleTitleRenderConfirm}
                  isMouseInside={isMouseInside}
                /> */}
                  <TitleText3D
                    position={titleTextPosition}
                    url="/CONSOLA.ttf"
                    title={`<${title} />`}
                    colorTheme={colorTheme}
                    sectionTitle={sectionTitle}
                    afterTitleRender={getTitleRenderConfirm}
                    isMouseInside={isMouseInside}
                  />
                  {/* </Suspense> */}
                </>

                {/* </Suspense> */}
                {/* </Debug> */}
              </Physics>
            </>
          )}
        </Canvas>
      )}
      {/* <div className="absolute inset-0 flex-grow h-full w-full rounded-xl text-transparent">
        <div className="grid grid-cols-4 w-full h-full p-8 pb-14 relative">
          <div
            className="absolute inset-0 frontend-canvas-gradient opacity-0 transition-opacity duration-300"
            ref={htmlDivBackgroundRef}
          ></div>
          <div className={`col-span-4 md:col-span-3 pr-5`}>
            <p
              className={`${sectionTitle}-card-heading text-xl font-medium opacity-0 ${
                hasTitleRendered
                  ? 'transition-opacity duration-300 opacity-0 '
                  : 'opacity-100'
              }`}
            >
              <code>&lt;{title} /&gt;</code>
            </p>
            <p
              className="text-black/0 blur-[1px] mt-5 pl-2.5 text-lg font-semibold opacity-0 transition-opacity duration-300 w-0 h-0"
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
      </div> */}
    </div>
  )
}

// ${
//   hasTitleRendered
//     ? 'transition-opacity duration-300 opacity-0 '
//     : 'opacity-100'
// }
