import { useBox } from '@react-three/cannon'
import { Box } from '@react-three/drei'

const PhysicsBox = ({ dimensions, position }) => {
  const [boxRef, api] = useBox(() => ({
    type: 'Static',
    mass: 0,
    position: position,
    rotation: [0, 0, 0],
    args: dimensions,
  }))
  return
}

export default PhysicsBox
