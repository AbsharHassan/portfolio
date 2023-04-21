import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Decal,
  useTexture,
  Sphere,
  Plane,
  Cylinder,
} from '@react-three/drei'
import {
  Physics,
  useSphere,
  usePlane,
  useBox,
  Debug,
  Co,
} from '@react-three/cannon'
import { useEffect, useRef, useState, forwardRef } from 'react'
import * as THREE from 'three'

const Ball = forwardRef(
  ({ sphereRadius, png, isMouseInside, mousePosition, planeRef }) =>
    // sphereRef
    {
      const [sphereRef, api] = useSphere(() => ({
        mass: 1,
        position: [0, -sphereRadius, sphereRadius],
        args: [sphereRadius],
        // linearDamping: 0.5,
        // angularDamping: 0.5,
      }))

      const [decal] = useTexture([png])
      const { camera, size } = useThree()

      let sphereVelocity = useRef(new THREE.Vector3(0, 0, 0))

      const maxPosX = size.width / 2 - (2 * sphereRadius - 2)
      const minPosX = -size.width / 2 + (2 * sphereRadius - 2)
      const maxPosY = size.height / 2 - (2 * sphereRadius - 10)
      const minPosY = -size.height / 2 + (2 * sphereRadius - 10)

      // useFrame(() => {
      //   const raycaster = new THREE.Raycaster()
      //   raycaster.setFromCamera(mousePosition, camera)
      //   const intersects = raycaster.intersectObject(planeRef.current)

      //   if (intersects.length > 0) {
      //     let targetPosition = intersects[0].point.setZ(sphereRadius)
      //     let distanceToTarget

      //     if (sphereRef.current.position.x >= maxPosX) {
      //       sphereVelocity.current = sphereVelocity.current
      //         .clone()
      //         .setX(-Math.abs(sphereVelocity.current.x))
      //     } else if (sphereRef.current.position.x <= minPosX) {
      //       sphereVelocity.current = sphereVelocity.current
      //         .clone()
      //         .setX(Math.abs(sphereVelocity.current.x))
      //     } else if (sphereRef.current.position.y >= maxPosY) {
      //       sphereVelocity.current = sphereVelocity.current
      //         .clone()
      //         .setY(-Math.abs(sphereVelocity.current.y))
      //     } else if (sphereRef.current.position.y <= minPosY) {
      //       sphereVelocity.current = sphereVelocity.current
      //         .clone()
      //         .setY(Math.abs(sphereVelocity.current.y))
      //     }

      //     distanceToTarget = isMouseInside
      //       ? sphereRef.current.position.distanceTo(targetPosition)
      //       : 0

      //     const directionToTarget = targetPosition
      //       .clone()
      //       .sub(sphereRef.current.position)
      //       .normalize()

      //     const sphereAcceleration = directionToTarget.multiplyScalar(
      //       distanceToTarget * 0.001
      //     )
      //     const sphereDamping = sphereVelocity.current
      //       .clone()
      //       .multiplyScalar(-0.045)

      //     sphereRef.current.position.add(sphereVelocity.current)

      //     api.position.copy(sphereRef.current.position)

      //     console.log(api.quaternion)

      //     sphereVelocity.current = sphereVelocity.current
      //       .clone()
      //       .add(sphereAcceleration)
      //       .add(sphereDamping)
      //       .multiplyScalar(1.02)
      //   }
      // })

      return (
        <>
          <Sphere
            args={[sphereRadius, 64, 32]}
            position={[0, 0, 0]}
            ref={sphereRef}
            // rotation={[Math.PI / 4, 0, 0]}
          >
            <meshStandardMaterial
              color="#334155"
              roughness={0.1}
              transparent
              opacity={0.3}
            />
            {/* <Decal
              position={[0, 0, sphereRadius]}
              map={decal}
              // rotation={[2 * Math.PI, 0, 6.25]}
              scale={sphereRadius + 3}
              flatShading
            />
            <Decal
              position={[0, 0, -sphereRadius]}
              map={decal}
              // rotation={[2 * Math.PI, 0, 6.25]}
              scale={sphereRadius + 3}
              flatShading
            />
            <Decal
              position={[0, sphereRadius, 0]}
              map={decal}
              // rotation={[2 * Math.PI, 0, 6.25]}
              scale={sphereRadius + 3}
              flatShading
            />
            <Decal
              position={[0, -sphereRadius, 0]}
              map={decal}
              // rotation={[2 * Math.PI, 0, 6.25]}
              scale={sphereRadius + 3}
              flatShading
            /> */}
          </Sphere>
        </>
      )
    }
)

const CanvasPlane = forwardRef(({ sphereRadius }, ref) => {
  const { size } = useThree()

  const [physicsPlaneRef] = useBox(() => ({
    mass: 0,
    type: 'Static',
    position: [0, 0, -sphereRadius],
    rotation: [-Math.PI / 10, 0, 0],
    args: [size.width, size.height, -0.001],
  }))

  return (
    <>
      <Plane
        ref={ref}
        args={[size.width, size.height]}
        position={[0, 0, 0]}
        rotation={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#ff0000"
          transparent
          opacity={0}
        />
      </Plane>
    </>
  )
})

export default function CardCanvasOld({ logo }) {
  const sphereRadius = 30

  let canvasRef = useRef(null)
  let pointLightRef = useRef(null)

  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(0, 0, 0))

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event
    const canvasBounds = event.target.getBoundingClientRect()
    const mouseX = ((clientX - canvasBounds.left) / canvasBounds.width) * 2 - 1
    const mouseY = -((clientY - canvasBounds.top) / canvasBounds.height) * 2 + 1

    const mouseZ = 0

    // pointLightRef.current.position.set(new THREE.Vector3(mouseX, mouseY, 500))

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

  let sphereRef = useRef(null)
  let planeRef = useRef(null)

  return (
    <Canvas
      className="w-full h-full"
      ref={canvasRef}
      onPointerMove={handleMouseMove}
      onPointerEnter={() => {
        setIsMouseInside(true)
      }}
      onPointerLeave={() => {
        setIsMouseInside(false)
      }}
      //   orthographic={true}
      camera={{ position: [0, 0, 500], fov: 20 }}
      onWheel={(e) => e.preventDefault()}
    >
      {/* <axesHelper
        lineLength={100}
        args={[50]}
      /> */}
      <OrbitControls
        enableRotate={false}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3} // Camera can't be rotated below 45 degrees
        maxPolarAngle={Math.PI / 1.5} // Camera can't be rotated above 90 degrees
        minAzimuthAngle={-(Math.PI / 6)}
        maxAzimuthAngle={Math.PI / 6}
      />
      <pointLight
        ref={pointLightRef}
        position={[0, 0, 500]}
        intensity={1}
        // color="#ff0000"
      />
      <Physics gravity={[0, 0, -10]}>
        <Debug color="green">
          <Ball
            png={logo}
            mousePosition={mousePosition}
            isMouseInside={isMouseInside}
            sphereRadius={sphereRadius}
            planeRef={planeRef}
            ref={sphereRef}
          />
          <CanvasPlane
            sphereRadius={sphereRadius}
            ref={planeRef}
          />
        </Debug>
      </Physics>
    </Canvas>
  )
}

// export default CardCanvas
