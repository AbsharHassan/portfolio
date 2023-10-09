import { useEffect, useRef } from 'react'
import { Vector3 } from 'three'
import { useFrame } from '@react-three/fiber'

import gsap from 'gsap'

import IPhone11Model from './IPhone11Model'

const PhoneModel = ({ vec = new Vector3(), fullView, setFullView }) => {
  let phoneMeshRef = useRef(null)
  let mousePos = useRef({ x: -1, y: 0.5 })
  let lookAtVector = useRef(new Vector3(-10, 0, 0))
  let frontPointLightRef = useRef(null)

  useEffect(() => {
    function handle(event) {
      const { clientX, clientY } = event

      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1

      mousePos.current = { x, y }
    }

    document.addEventListener('mousemove', handle)

    return () => {
      document.removeEventListener('mousemove', handle)
    }
  }, [])

  useEffect(() => {
    gsap.to(phoneMeshRef.current.position, {
      x: fullView ? 0 : 0.6,
      z: fullView ? 0.5 : 0,
    })
    gsap.to(frontPointLightRef.current.position, {
      y: fullView ? 2 : 0,
    })
  }, [fullView])

  useFrame(() => {
    if (!fullView) {
      lookAtVector.current.lerp(
        vec.set(mousePos.current.x * 5, mousePos.current.y * 2, 10),
        0.05
      )
      phoneMeshRef.current.lookAt(
        lookAtVector.current.x,
        lookAtVector.current.y,
        lookAtVector.current.z
      )
    } else {
      lookAtVector.current.lerp(vec.set(0, 0, 10), 0.05)
      phoneMeshRef.current.lookAt(
        lookAtVector.current.x,
        lookAtVector.current.y,
        lookAtVector.current.z
      )
    }
  })

  return (
    <>
      <pointLight
        position={[0, 0, -5]}
        intensity={0.5}
        color={'#90caf9'}
      />
      <pointLight
        position={[0, 0, 5]}
        intensity={0.5}
        color={'#90caf9'}
        ref={frontPointLightRef}
      />
      <mesh
        onClick={() => {
          setFullView()
          // if (!fullView) setFullView()
        }}
      >
        <IPhone11Model
          ref={phoneMeshRef}
          position={[0.6, 0, 0]}
          rotation={[0, 0, 0]}
          transparent
          opacity={0}
        />
      </mesh>
    </>
  )
}

export default PhoneModel
