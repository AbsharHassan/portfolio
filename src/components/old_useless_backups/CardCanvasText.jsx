import { useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'
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
  Text3D,
} from '@react-three/drei'

const Ball = ({
  sphereRadius,
  png,
  isMouseInside,
  mousePosition,
  planeRef,
  material,
}) => {
  let pointLightRef = useRef(null)
  let directionalLightRef = useRef(null)

  const [sphereRef, api] = useSphere(() => ({
    mass: 100,
    position: [0, 0, 0],
    args: [sphereRadius],
    linearDamping: 0.7,
    angularDamping: 0.9,
  }))

  const [decal] = useTexture([png])
  const { camera } = useThree()

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mousePosition, camera)
  let targetPoint
  let directionToTarget
  let forceMultiplier = 1000
  let force = []

  useFrame(() => {
    const intersects = raycaster.intersectObject(planeRef.current)

    if (intersects.length > 0) {
      targetPoint = intersects[0].point.setZ(sphereRadius)

      pointLightRef.current.position.set(targetPoint.x, targetPoint.y, 200)
      // directionalLightRef.current.target = sphereRef.current

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

      // if (isMouseInside) {
      //   api.applyForce(force, [0, 0, 0])
      //   if (planeRef.current.material.opacity < 0.1) {
      //     planeRef.current.material.opacity += 0.01
      //   }
      // } else {
      //   if (planeRef.current.material.opacity > 0) {
      //     planeRef.current.material.opacity -= 0.01
      //   }
      // }

      api.applyForce(force, [0, 0, 0])

      // console.log(planeRef.current.material.opacity)

      api.position.subscribe((positionVector) => {
        sphereRef.current.position.set(
          positionVector[0],
          positionVector[1],
          positionVector[2]
        )
      })
    }
  })

  // useEffect(() => {
  //   console.log(sphereRef.current)
  // }, [sphereRef])
  return (
    <>
      <pointLight
        castShadow
        ref={pointLightRef}
        position={[0, 0, 500]}
        intensity={2}
        color="#c261fe"
      />
      {/* <directionalLight
        castShadow
        ref={directionalLightRef}
        position={[300, 0, 200]}
        intensity={1.5}
        color="#c261fe"
      /> */}
      {/* <spotLight
        castShadow
        ref={pointLightRef}
        position={[300, 0, 200]}
        intensity={2}
        angle={Math.PI / 100}
        // decay={0.4}
        // distance={00}
        color="#c261fe"
      /> */}
      {/* <Html style={{ height: '100%', width: '100%' }}>
        <h1 className="text-white text-xl -z-50">hello world</h1>
      </Html> */}
      {/* <Text
        position={[0, 0, 0]}
        color="white"
        fontSize={20}
      >

      </Text> */}

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
            opacity={0.2}
          />
        </Plane>
      </>
    )
  }
)

export default function CardCanvasText({ logo }) {
  let titleRef = useRef(null)
  const sphereRadius = 25

  let canvasRef = useRef(null)
  let pointLightRef = useRef(null)

  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3())

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event
    const canvasBounds = event.target.getBoundingClientRect()
    const mouseX = ((clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1
    const mouseY = -((clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1

    const mouseZ = 0

    // pointLightRef.current.position.set(new THREE.Vector3(mouseX, mouseY, 500))

    setMousePosition(new THREE.Vector3(mouseX, mouseY, mouseZ))
    // console.log('yeah da mouse do be moving')
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

  // useEffect(() => {
  //   console.log(titleRef)
  // }, [titleRef])

  const raycaster = {
    // Only include the HTML component in the raycasting algorithm
    // and exclude the canvas element
    filter: (intersections) =>
      intersections[0].object instanceof HTMLDivElement,
  }

  return (
    <div className="w-full h-full relative">
      <Canvas
        shadows
        className="w-full h-full absolute inset-0 z-50"
        ref={canvasRef}
        onPointerMove={handleMouseMove}
        // onPointer
        onPointerEnter={() => {
          console.log('yeah the pointer did enter here')
          setIsMouseInside(true)
        }}
        onPointerLeave={() => {
          console.log('went out')

          setIsMouseInside(false)
        }}
        camera={{ position: [0, 0, 500], fov: 20 }}
        onWheel={(e) => e.preventDefault()}
      >
        <Html
          // onPointerMove={handleMouseMove}
          // onPointerEnter={() => {
          //   console.log('hello mouse')
          //   setIsMouseInside(true)
          // }}
          // onPointerLeave={() => {
          //   console.log('bye bye mouse')
          //   setIsMouseInside(false)
          // }}
          // pointerEvents={false}
          occlude="blending"
          castShadow // Make HTML cast a shadow
          receiveShadow // Make HTML receive shadows
          raycaster={raycaster}
          renderOrder={-1000}
          center
          onPointerMove={() => {
            console.log('please help')
          }}
          // position={[-size.width / 2, size.height / 2, -sphereRadius - 16]}
          className="grid grid-cols-4 flex-grow w-[365px] h-[195px] rounded-xl relative  text-[#a1a0ab]  overflow-hidden p-8 "
          // style={{ position: 'absolute', top: 0, left: 0, zIndex: -100 }}
        >
          <div className={`col-span-3 `}>
            <p
              className={`frontend-card-heading text-xl font-semibold mb-4`}
              //   style={{ transform: 'translateZ(500px)' }}
            >
              <code>
                &lt;React
                <span className="text-lg"> /</span>&gt;
              </code>
            </p>
            <p className="text-sm font-medium">
              Railway scales apps to meet user demand, automagically, based on
              load.
            </p>
          </div>
        </Html>

        {/* <Text
          fontSize={20}
          color="#a1a0ab"
          maxWidth={300}
          lineHeight={1.5}
          textAlign="left"
          position={[0, 0, 0]}
        >
          <Text fontSize={20}>{'<React />'}</Text>

          {'\n\n'}
          {
            'Railway scales apps to meet user demand, automagically, based on load.'
          }
        </Text> */}

        {/* <Html
          // onPointerMove={handleMouseMove}
          // onPointerEnter={() => {
          //   console.log('hello mouse')
          //   setIsMouseInside(true)
          // }}
          // onPointerLeave={() => {
          //   console.log('bye bye mouse')
          //   setIsMouseInside(false)
          // }}
          // pointerEvents={false}
          renderOrder={-1}
          // center
          position={[]}
          className="grid grid-cols-4 flex-grow w-[365px] h-[195px] rounded-xl relative  text-[#a1a0ab]  overflow-hidden p-8"
          // style={{ position: 'absolute', top: 0, left: 0, zIndex: -100 }}
        >
          <div className={`col-span-3 `}>
            <p
              className={`frontend-card-heading text-xl font-semibold mb-4`}
              //   style={{ transform: 'translateZ(500px)' }}
            >
              <code>
                &lt;React
                <span className="text-lg"> /</span>&gt;
              </code>
            </p>
            <p className="text-sm font-medium">
              Railway scales apps to meet user demand, automagically, based on
              load.
            </p>
          </div>
        </Html> */}
        <OrbitControls
          enableRotate={false}
          enableZoom={false}
          enablePan={false}
          // minPolarAngle={Math.PI / 3} // Camera can't be rotated below 45 degrees
          // maxPolarAngle={Math.PI / 1.5} // Camera can't be rotated above 90 degrees
          // minAzimuthAngle={-(Math.PI / 6)}
          // maxAzimuthAngle={Math.PI / 6}
        />

        <Physics
          gravity={[0, 0, -10000]}
          defaultContactMaterial={{ restitution: 1 }}
        >
          {/* <Debug color="green"> */}
          <Ball
            png={logo}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            sphereRadius={sphereRadius}
            planeRef={planeRef}
          />
          <Stage
            sphereRadius={sphereRadius}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            ref={planeRef}
          />
          {/* </Debug> */}
        </Physics>
        {/* <Html
          center
          position={[0, 0, 0]}
          className=""
          pointerEvents='none'
        >
          <div className="absolute inset-0 p-8 w-[274px] text-[#a1a0ab]">
            <p
              className={`frontend-card-heading text-xl font-semibold mb-4`}
              //   style={{ transform: 'translateZ(500px)' }}
              ref={titleRef}
            >
              <code>
                &lt;React
                <span className="text-lg"> /</span>&gt;
              </code>
            </p>
            <p className="text-sm font-medium">
              Railway scales apps to meet user demand, automagically, based on
              load.
            </p>
          </div>
        </Html> */}
      </Canvas>
      {/* <div className="absolute inset-0 p-8 w-[274px] text-[#a1a0ab]">
        <p
          className={`frontend-card-heading text-xl font-semibold mb-4`}
          //   style={{ transform: 'translateZ(500px)' }}
          ref={titleRef}
        >
          <code>
            &lt;React
            <span className="text-lg"> /</span>&gt;
          </code>
        </p>
        <p className="text-sm font-medium">
          Railway scales apps to meet user demand, automagically, based on load.
        </p>
      </div> */}
    </div>
  )
}

// export default CardCanvas
