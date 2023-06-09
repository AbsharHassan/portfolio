import { useState, useEffect, useRef } from 'react'
import { useThree, useFrame } from '@react-three/fiber'

export default function TestingBloom({ children }) {
  const { gl, camera, size } = useThree()
  const [scene, setScene] = useState()
  const composer = useRef()
  //   useEffect(
  //     () => void scene && composer.current.setSize(size.width, size.height),
  //     [size]
  //   )

  useEffect(() => {
    void scene && composer.current.setSize(size.width, size.height)
  }, [size])

  useFrame(() => scene && composer.current.render(), 1)

  return (
    <>
      <scene ref={setScene}>{children}</scene>
      <effectComposer
        ref={composer}
        args={[gl]}
      >
        <renderPass
          attachArray="passes"
          scene={scene}
          camera={camera}
        />
        <unrealBloomPass
          attachArray="passes"
          args={[undefined, 1.5, 1, 0]}
        />
      </effectComposer>
    </>
  )
}
