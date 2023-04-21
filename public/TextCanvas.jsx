import { useEffect, useRef, useState, forwardRef, Suspense } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Physics, useSphere, useBox, Debug } from '@react-three/cannon'
import {
  OrbitControls,
  Decal,
  useTexture,
  Sphere,
  Plane,
  Html,
  Text,
  Text3D as Text3DBase,
  Box,
} from '@react-three/drei'

// import CodeFont from '../assets/fonts/CONSOLA.TTF'
import { suspend } from 'suspend-react'
import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js'

// const font = new FontLoader().parse(CodeFont)

const Ball = ({
  sphereRadius,
  png,
  isMouseInside,
  mousePosition,
  planeRef,
  material,
  canvasRef,
  handleVectorToDOM,
}) => {
  let pointLightRef = useRef(null)
  let directionalLightRef = useRef(null)

  const [sphereRef, api] = useSphere(() => ({
    mass: 100,
    position: [100, -50, 0],
    args: [sphereRadius],
    linearDamping: 0.7,
    angularDamping: 0.9,
  }))

  const [decal] = useTexture([png])
  const { camera } = useThree()

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mousePosition, camera)

  const canvas = canvasRef.current

  let targetPoint
  let directionToTarget
  let forceMultiplier = 1000
  let force = []

  useFrame(() => {
    const intersects = raycaster.intersectObject(planeRef.current)

    if (intersects.length > 0) {
      targetPoint = intersects[0].point.setZ(sphereRadius)

      pointLightRef.current.position.set(targetPoint.x, targetPoint.y, 200)

      directionToTarget = [
        targetPoint.x - sphereRef.current.position.x,
        targetPoint.y - sphereRef.current.position.y,
        0,
      ]

      force = [
        directionToTarget[0] * forceMultiplier,
        directionToTarget[1] * forceMultiplier,
        0,
      ]

      if (isMouseInside) {
        api.applyForce(force, [0, 0, 0])
        if (planeRef.current.material.opacity < 0.1) {
          planeRef.current.material.opacity += 0.005
        }
      } else {
        if (planeRef.current.material.opacity > 0) {
          planeRef.current.material.opacity -= 0.005
        }
      }

      api.position.subscribe((positionVector) => {
        sphereRef.current.position.set(
          positionVector[0],
          positionVector[1],
          positionVector[2]
        )
      })

      const sphereVecToDOM = new THREE.Vector3().copy(
        sphereRef.current.position.clone()
      )

      sphereVecToDOM.project(camera)

      sphereVecToDOM.x = Math.round(
        (0.5 + sphereVecToDOM.x / 2) * (canvas.width / window.devicePixelRatio)
      )
      sphereVecToDOM.y = Math.round(
        (0.5 - sphereVecToDOM.y / 2) * (canvas.height / window.devicePixelRatio)
      )

      handleVectorToDOM(sphereVecToDOM)
    }
  })

  return (
    <>
      <pointLight
        castShadow
        ref={pointLightRef}
        position={[0, 0, 500]}
        intensity={2}
        color="#c261fe"
      />
      <Sphere
        castShadow
        args={[sphereRadius, 64, 32]}
        position={[0, 0, 0]}
        ref={sphereRef}
      >
        <meshStandardMaterial
          color="#334155"
          roughness={1}
          // transparent
          // opacity={1}
        />
        <Decal
          position={[0, 0, sphereRadius]}
          map={decal}
          scale={sphereRadius + 3}
          flatShading
        />
        <Decal
          position={[0, 0, -sphereRadius]}
          map={decal}
          scale={sphereRadius + 3}
          flatShading
        />
        <Decal
          position={[0, sphereRadius, 0]}
          map={decal}
          scale={sphereRadius + 3}
          flatShading
        />
        <Decal
          position={[0, -sphereRadius, 0]}
          map={decal}
          scale={sphereRadius + 3}
          flatShading
        />
        <Decal
          position={[sphereRadius, 0, 0]}
          map={decal}
          scale={sphereRadius + 3}
          flatShading
        />
        <Decal
          position={[-sphereRadius, 0, 0]}
          map={decal}
          scale={sphereRadius + 3}
          flatShading
        />
      </Sphere>
    </>
  )
}

const Stage = forwardRef(
  ({ sphereRadius, isMouseInside, mousePosition, material }, ref) => {
    const { size } = useThree()

    const wallOffsetX = 20
    const wallOffsetY = 10

    const [physicsPlaneRef, planeApi] = useBox(() => ({
      mass: 0,
      type: 'Static',
      position: [0, 0, -sphereRadius],
      rotation: [0, 0, 0],
      args: [size.width, size.height, 0.001],
    }))

    // North Wall
    useBox(() => ({
      mass: 0,
      type: 'Static',
      position: [
        0,
        size.height / 2 - wallOffsetY,
        -sphereRadius + size.height / 2,
      ],
      rotation: [Math.PI / 2, 0, 0],
      args: [size.width, size.height, 0.001],
    }))

    // East Wall
    useBox(() => ({
      mass: 0,
      type: 'Static',
      position: [
        size.width / 2 - wallOffsetX,
        0,
        -sphereRadius + size.width / 2,
      ],
      rotation: [0, Math.PI / 2, 0],
      args: [size.width, size.height, 0.001],
    }))

    // South Wall
    useBox(() => ({
      mass: 0,
      type: 'Static',
      position: [
        0,
        -(size.height / 2 - wallOffsetY),
        -sphereRadius + size.height / 2,
      ],
      rotation: [Math.PI / 2, 0, 0],
      args: [size.width, size.height, 0.001],
    }))

    // West Wall
    useBox(() => ({
      mass: 0,
      type: 'Static',
      position: [
        -(size.width / 2 - wallOffsetX),
        0,
        -sphereRadius + size.width / 2,
      ],
      rotation: [0, Math.PI / 2, 0],
      args: [size.width, size.height, 0.001],
    }))

    return (
      <>
        <Plane
          receiveShadow
          ref={ref}
          args={[size.width, size.height]}
          position={[0, 0, -sphereRadius]}
          rotation={[0, 0, 0]}
        >
          <meshStandardMaterial
            color="#c261fe"
            transparent
            opacity={0}
          />
        </Plane>
      </>
    )
  }
)

const Title3D = ({}) => {}

function Text3D({ url, letter }) {
  // Suspend while loading and parsing the TTF file.
  // const font = suspend(() => {
  //   const loader = new TTFLoader()
  //   return new Promise((resolve) => {
  //     loader.load(url, resolve)
  //   })
  // }, [url])

  const width = 90
  const length = 18
  const height = 10

  const [boxRef, api] = useBox(() => ({
    // mass: 0,
    type: 'Static',
    position: [0, 0, -height - height / 2],
    rotation: [0, 0, 0],
    args: [width, length, height],
    linearDamping: 0.9,
    angularDamping: 0.9,
    material: {
      friction: 1,
    },
  }))

  return (
    <Box
      ref={boxRef}
      args={[width, length, height]}
      // position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color="#ff0000"
        transparent
        opacity={0}
      />
      <Text
        fontSize={20}
        position={[0, -1, height + 1]}
        color="#c261fe"
        castShadow
        font={url}
      >
        {letter}
      </Text>
    </Box>
  )
}

const Letter = ({ sphereRadius, letter }) => {
  const width = 90
  const length = 18
  const height = 10

  const [boxRef, api] = useBox(() => ({
    // mass: 0,
    type: 'Static',
    position: [0, 0, -height - height / 2],
    rotation: [0, 0, 0],
    args: [width, length, height],
    linearDamping: 0.9,
    angularDamping: 0.9,
    material: {
      friction: 1,
    },
  }))

  return (
    <Box
      ref={boxRef}
      args={[width, length, height]}
      // position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color="#ff0000"
        transparent
        opacity={0}
      />
      <Text
        fontSize={20}
        position={[0, -1, height + 1]}
        color="#c261fe"
        castShadow
        font="/Inter-Bold.woff"
      >
        {letter}
      </Text>
      {/* <Html castShadow>
        <p className={`frontend-card-heading text-xl font-semibold mb-4`}>
          <code>
            &lt;React
            <span className="text-lg"> /</span>&gt;
          </code>
        </p>
      </Html> */}
    </Box>
  )
}

const TextToWord = ({ word, sphereDomX, sphereDomY }) => {
  let wordContainerRef = useRef(null)
  let wordContentRef = useRef(null)

  useEffect(() => {
    if ((wordContainerRef.current, sphereDomX, sphereDomY)) {
      const containerRect = wordContainerRef.current.getBoundingClientRect()
      const isInside =
        sphereDomX > containerRect.left &&
        sphereDomX < containerRect.right &&
        sphereDomY > containerRect.top &&
        sphereDomY < containerRect.bottom

      if (isInside) {
        wordContainerRef.current.classList.add('broken')
        // wordContainerRef.current.classList.add(`translate-x-${randomInt}`)
        // wordContainerRef.current.classList.add(`translate-y-${randomInt}`)

        let randomIntX = Math.floor(Math.random() * 61) - 30
        let randomIntY = Math.floor(Math.random() * 61) - 30

        wordContainerRef.current.style.transform = `translate(${randomIntX}px, ${randomIntY}px)`
      }

      //   wordRef.current.classList.toggle('text-red-700', isInside)
    }
  }, [sphereDomX, sphereDomY])

  return (
    <span
      className="mr-1 card-text transition-transform duration-300"
      ref={wordContainerRef}
      data-name={word}
    >
      {word}{' '}
    </span>
  )
}

export default function TextCanvas({ title, description, logo }) {
  let titleRef = useRef(null)
  const sphereRadius = 17

  let canvasRef = useRef(null)
  let pointLightRef = useRef(null)

  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3())
  const [sphereDOMposition, setSphereDOMposition] = useState({})
  const [sphereDomX, setSphereDomX] = useState(null)
  const [sphereDomY, setSphereDomY] = useState(null)

  const handleVectorToDOM = (vector) => {
    const canvas = canvasRef.current
    if (canvas) {
      const canvasBounds = canvas.getBoundingClientRect()
      //   setSphereDOMposition({
      //     x: vector.x + canvasBounds.left,
      //     y: vector.y + canvasBounds.top,
      //   })
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

  let planeRef = useRef(null)

  let descriptionRef = useRef(null)
  let descriptionRelativePosition = useRef(null)

  //   useEffect(() => {
  //     if (descriptionRef.current && canvasRef.current) {
  //       const canvas = canvasRef.current.getBoundingClientRect()
  //       const description = descriptionRef.current.getBoundingClientRect()
  //       descriptionRelativePosition.current = {
  //         top: description.top - canvas.top,
  //         left: description.left - canvas.left,
  //         right: description.right - canvas.right,
  //         bottom: description.bottom - canvas.bottom,
  //         width: description.width,
  //         height: description.height,
  //       }
  //     }
  //   }, [descriptionRef])

  //   useEffect(() => {
  //     if (sphereDOMposition) {
  //       const containerRect = descriptionRef.current.getBoundingClientRect()
  //       const isInside =
  //         sphereDOMposition[0] > containerRect.left &&
  //         sphereDOMposition[0] < containerRect.right &&
  //         sphereDOMposition[1] > containerRect.top &&
  //         sphereDOMposition[1] < containerRect.bottom

  //       console.log(isInside)
  //     }
  //   }, [sphereDOMposition])

  let descriptionTextArray = description.split(' ')

  return (
    <div className="w-full h-full relative ">
      <Canvas
        shadows
        className="w-full h-full absolute inset-0 z-50"
        ref={canvasRef}
        onPointerMove={handleMouseMove}
        onPointerEnter={() => {
          setIsMouseInside(true)
        }}
        onPointerLeave={() => {
          setIsMouseInside(false)
        }}
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
          color="#c261fe"
        />

        <Physics
          gravity={[0, 0, -1000]}
          defaultContactMaterial={{ restitution: 1 }}
        >
          {/* <Debug color="green"> */}
          <Ball
            png={logo}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            sphereRadius={sphereRadius}
            planeRef={planeRef}
            canvasRef={canvasRef}
            handleVectorToDOM={handleVectorToDOM}
          />
          <Stage
            sphereRadius={sphereRadius}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            ref={planeRef}
          />
          <Title3D title={title} />
          {/* <Letter
            sphereRadius={sphereRadius}
            letter="<React />"
          /> */}
          {/* <Suspense> */}
          <Text3D
            // url="https://api.fontsource.org/v1/fonts/lora/latin-600-italic.ttf"
            url="/CONSOLA.TTF"
            letter="<React />"
          />
          {/* </Suspense> */}
          {/* </Debug> */}
        </Physics>
      </Canvas>
      <div className="absolute  inset-0 grid grid-cols-4 flex-grow w-[365px] h-[195px] rounded-xl p-8 text-transparent">
        <div className={`col-span-3 pr-5`}>
          <p className={`frontend-card-heading text-xl font-semibold mb-4`}>
            <code>
              &lt;React
              <span className="text-lg"> /</span>&gt;
            </code>
          </p>
          {/* <div className=" text-sm font-medium flex flex-wrap">
            {descriptionTextArray.map((word, index) => (
              <TextToWord
                key={index}
                word={word}
                sphereDomX={sphereDomX}
                sphereDomY={sphereDomY}
              />
            ))}
          </div> */}
        </div>
      </div>
    </div>
  )
}
