import { useBox } from '@react-three/cannon'

const PhysicsBox = ({ dimensions, position }) => {
  useBox(() => ({
    type: 'Static',
    mass: 0,
    position: position,
    rotation: [0, 0, 0],
    args: dimensions,
  }))
  return
}

export default PhysicsBox
