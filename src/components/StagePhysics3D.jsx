import { forwardRef } from 'react'
import { useThree } from '@react-three/fiber'
import { Plane } from '@react-three/drei'
import { useBox } from '@react-three/cannon'

const StagePhysics3D = forwardRef(
  (
    { colorTheme, sphereRadius, isMouseInside, mousePosition, material },
    ref
  ) => {
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
            // color="#ffffff"/
            // color="#7f4abb"
            color={`${colorTheme.plane}`}
            transparent
            opacity={0}
          />
        </Plane>
      </>
    )
  }
)

export default StagePhysics3D
