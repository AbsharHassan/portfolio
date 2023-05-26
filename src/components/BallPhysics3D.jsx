import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useThree, useFrame } from '@react-three/fiber'
import { Sphere, Decal, useTexture } from '@react-three/drei'
import { useSphere } from '@react-three/cannon'
import gsap from 'gsap'

const BallPhysics3D = ({
  colorTheme,
  sectionTitle,
  sphereRadius,
  png,
  scale,
  isMouseInside,
  mousePosition,
  planeRef,
  canvasRef,
  convertVectorToDOM,
}) => {
  // const initialPosition = [112.5, -42.5, 0]
  const initialPosition = [107, -44.5, 0]
  const initialRotation = [0, -0.2, 0]
  const [hasBallRendered, setHasBallRendered] = useState(false)
  const [movementBlocker, setMovementBlocker] = useState(true)
  let pointLightRef = useRef(null)
  let plusYDecalRef = useRef(null)

  //use useMemo for the decals i guess
  const [decal] = useTexture([png])
  // console.log((decal.rotation = Math.PI / 2))
  const { camera } = useThree()

  const [sphereRef, api] = useSphere(() => ({
    mass: 100,
    position: initialPosition,
    rotation: initialRotation,
    args: [sphereRadius],
    linearDamping: 0.7,
    angularDamping: 0.9,
  }))

  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(mousePosition, camera)

  const canvas = canvasRef.current

  let targetPoint
  let directionToTarget
  let forceMultiplier = 750
  let force = []

  useFrame(() => {
    // console.log(sphereRef.current)
    const intersects = raycaster.intersectObject(planeRef.current)

    if (intersects.length > 0 && isMouseInside) {
      targetPoint = intersects[0].point.setZ(sphereRadius)

      pointLightRef.current?.position.set(targetPoint.x, targetPoint.y, 200)

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
      //     planeRef.current.material.opacity += 0.005
      //   }
      // } else {
      //   if (planeRef.current.material.opacity > 0) {
      //     planeRef.current.material.opacity -= 0.005
      //   }
      // }

      if (isMouseInside && !movementBlocker) {
        api?.applyForce(force, [0, 0, 0])

        api?.position.subscribe((positionVector) => {
          sphereRef.current?.position.set(
            positionVector[0],
            positionVector[1],
            positionVector[2]
          )
        })

        const sphereVecToDOM = new THREE.Vector3().copy(
          sphereRef.current?.position.clone()
        )

        sphereVecToDOM.project(camera)

        sphereVecToDOM.x = Math.round(
          (0.5 + sphereVecToDOM.x / 2) *
            (canvas.width / window.devicePixelRatio)
        )
        sphereVecToDOM.y = Math.round(
          (0.5 - sphereVecToDOM.y / 2) *
            (canvas.height / window.devicePixelRatio)
        )

        convertVectorToDOM(sphereVecToDOM.x, sphereVecToDOM.y)
      }
    }
  })

  useEffect(() => {
    return () => {
      convertVectorToDOM(null, null)
    }
  }, [])

  // useEffect(() => {
  //   gsap.killTweensOf(sphereRef.current)

  //   if (isMouseInside && hasBallRendered) {

  //     gsap.to(planeRef.current.material, {
  //       opacity: sectionTitle === 'frontend' ? 0.35 : 0.1,
  //       duration: 1,
  //     })
  //     gsap.from(sphereRef.current.scale, {
  //       x: 0,
  //       y: 0,
  //       z: 0,
  //       delay: 0.3,
  //       duration: 1,
  //       ease: 'bounce',
  //       onComplete: () => {
  //         setMovementBlocker(!isMouseInside)
  //       },
  //     })
  //   } else {
  //     gsap.to(planeRef.current.material, {
  //       opacity: 0,
  //       duration: 1,
  //     })
  //     gsap.to(sphereRef.current.scale, {
  //       x: 0,
  //       y: 0,
  //       z: 0,
  //       duration: 0.5,
  //       onComplete: () => {
  //         setMovementBlocker(!isMouseInside)
  //         api?.position.set(
  //           initialPosition[0],
  //           initialPosition[1],
  //           initialPosition[2]
  //         )
  //         api?.rotation.set(
  //           initialRotation[0],
  //           initialRotation[1],
  //           initialRotation[2]
  //         )
  //       },
  //     })
  //   }
  // }, [hasBallRendered])

  useEffect(() => {
    gsap.killTweensOf(sphereRef.current)
    let enteringAnimation
    let exitingAnimation
    if (isMouseInside) {
      exitingAnimation?.kill()
      gsap.to(planeRef.current.material, {
        opacity: sectionTitle === 'frontend' ? 0.35 : 0.1,
        duration: 1,
      })
      enteringAnimation = gsap.to(sphereRef.current.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: 1,
        ease: 'bounce',
        onComplete: () => {
          setMovementBlocker(!isMouseInside)
        },
      })
    } else {
      enteringAnimation?.kill()
      gsap.to(planeRef.current.material, {
        opacity: 0,
        duration: 1,
      })
      exitingAnimation = gsap.to(sphereRef.current.scale, {
        x: 0,
        y: 0,
        z: 0,
        duration: 0.5,
        onComplete: () => {
          setMovementBlocker(!isMouseInside)
          api?.position.set(
            initialPosition[0],
            initialPosition[1],
            initialPosition[2]
          )
          api?.rotation.set(
            initialRotation[0],
            initialRotation[1],
            initialRotation[2]
          )
        },
      })
    }
  }, [isMouseInside])

  // useEffect(() => {
  //   gsap.killTweensOf(sphereRef.current)
  //   let enteringAnimation
  //   let exitingAnimation
  //   if (1) {
  //     exitingAnimation?.kill()
  //     gsap.to(planeRef.current.material, {
  //       opacity: 0.3,
  //       duration: 1,
  //     })
  //     enteringAnimation = gsap.to(sphereRef.current.scale, {
  //       x: 1,
  //       y: 1,
  //       z: 1,
  //       duration: 0.5,
  //       ease: 'bounce',
  //       onComplete: () => {
  //         setMovementBlocker(!isMouseInside)
  //       },
  //     })
  //   } else {
  //     enteringAnimation?.kill()
  //     gsap.to(planeRef.current.material, {
  //       opacity: 0,
  //       duration: 1,
  //     })
  //     exitingAnimation = gsap.to(sphereRef.current.scale, {
  //       x: 0,
  //       y: 0,
  //       z: 0,
  //       duration: 0.5,
  //       onComplete: () => {
  //         setMovementBlocker(!isMouseInside)
  //         api?.position.set(
  //           initialPosition[0],
  //           initialPosition[1],
  //           initialPosition[2]
  //         )
  //         api?.rotation.set(
  //           initialRotation[0],
  //           initialRotation[1],
  //           initialRotation[2]
  //         )
  //       },
  //     })
  //   }
  // }, [])

  return (
    <>
      <pointLight
        castShadow
        ref={pointLightRef}
        position={[0, 0, 500]}
        intensity={0.6}
        // color="#c261fe"
        color={`${colorTheme.light}`}
      />
      <Sphere
        castShadow
        args={[sphereRadius, 64, 32]}
        position={[0, 0, 0]}
        scale={[0, 0, 0]}
        ref={sphereRef}
        onAfterRender={() => {
          setHasBallRendered(true)
        }}
      >
        <meshStandardMaterial
          color={`${colorTheme.ball}`}
          roughness={colorTheme.roughness}
          // transparent
          // opacity={1}
        />
        <Decal
          position={[0, 0, sphereRadius]}
          map={decal}
          // opacity={10}
          scale={scale}
          flatShading
          rotation={[0, 0, 0]}
        />
        <Decal
          position={[0, 0, -sphereRadius]}
          map={decal}
          // scale={scale}
          scale={scale}
          flatShading
          rotation={[0, Math.PI, 0]}
        />
        {/* <Decal
          position={[0, sphereRadius, 0]}
          map={decal}
          scale={scale}
          flatShading
          // ref={plusYDecalRef}
          // rotation={[0, 0, 0]}
        /> */}
        {/* <Decal
          position={[0, 0, -sphereRadius]}
          map={decal}
          scale={scale}
          flatShading
          rotation={[0, Math.PI, 0]}
        />
        <Decal
          position={[0, sphereRadius, 0]}
          map={decal}
          scale={scale}
          flatShading
          rotation={[0, 0, Math.PI]}
        />
        <Decal
          position={[0, -sphereRadius, 0]}
          map={decal}
          opacity={1.5}
          scale={scale}
          flatShading
          rotation={[0, 0, Math.PI]}
        />
        <Decal
          position={[sphereRadius, 0, 0]}
          map={decal}
          scale={scale}
          flatShading
          rotation={[0, 0, 0]}
        />
        <Decal
          position={[-sphereRadius, 0, 0]}
          map={decal}
          scale={scale}
          flatShading
          rotation={[0, 0, 0]}
        /> */}
      </Sphere>
    </>
  )
}

export default BallPhysics3D
