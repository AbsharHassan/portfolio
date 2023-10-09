import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Mesh,
  MeshBasicMaterial,
  PlaneGeometry,
  TextureLoader,
  Vector2,
} from 'three'
import { useFrame, useThree } from '@react-three/fiber'

const RipplesTexture = ({ parentContainer, mousePositionProp }) => {
  const { viewport } = useThree()

  const texture = useMemo(() => {
    return new TextureLoader().load('./ripple.png')
  }, [])

  let sceneRef = useRef(null)

  let [stateMeshes, setStateMeshes] = useState([])
  // let [maxRipples] = useState(25)
  let [maxRipples] = useState(100)
  let [geoRipples] = useState(() => {
    return new PlaneGeometry(0.3, 0.3, 1, 1)
  }, [])

  let mousePosition = useRef(new Vector2(0, 0))
  let prevMousePosition = useRef(new Vector2(0, 0))
  let currentWave = useRef(0)

  const handleMouseMove = (e) => {
    if (parentContainer) {
      if (e.movementX > 1 || e.movementY > 1 || 1) {
        const { left, top, width, height } =
          parentContainer.current.getBoundingClientRect()

        // Calculate the mouse position relative to the center of the div
        const offsetX = e.clientX - (left + width / 2)
        const offsetY = e.clientY - (top + height / 2)

        // Normalize the coordinates to [-1, 1] range
        const normalizedX = offsetX / (width / 2)
        const normalizedY = -offsetY / (height / 2)

        mousePosition.current.x = (normalizedX * viewport.width) / 2
        mousePosition.current.y = (normalizedY * viewport.height) / 2
      }
    } else {
      if (e.movementX > 1 || e.movementY > 1 || 1) {
        const { clientX, clientY } = e

        // maybe use the dimensions of the actual container of the canvas
        const x = (clientX / window.innerWidth) * 2 - 1
        const y = -(clientY / window.innerHeight) * 2 + 1

        mousePosition.current.x = (x * viewport.width) / 2
        mousePosition.current.y = (y * viewport.height) / 2
      }
    }
  }

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [parentContainer])

  useEffect(() => {
    let tempArray = []

    for (let i = 0; i < maxRipples; i++) {
      let mat = new MeshBasicMaterial({
        map: texture,
        // blending: AdditiveBlending,
        transparent: true,
        depthTest: false,
        depthWrite: false,
        opacity: 0,
      })

      let newMesh = new Mesh(geoRipples, mat)
      newMesh.visible = false
      newMesh.rotation.z = 2 * Math.PI * Math.random()
      sceneRef.current.add(newMesh)
      tempArray.push(newMesh)
    }

    setStateMeshes(tempArray)
  }, [])

  const setNewWave = (x, y, index) => {
    let newMesh = stateMeshes[index]
    newMesh.visible = true
    if (parentContainer) {
      newMesh.scale.x = newMesh.scale.y = 8
    } else {
      newMesh.scale.x = newMesh.scale.y = 0.2
    }
    newMesh.position.x = x
    newMesh.position.y = y
    // newMesh.material.opacity = 1
    newMesh.material.opacity = 0.5
  }

  useFrame((state) => {
    if (stateMeshes.length === maxRipples) {
      if (
        // Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 4 &&
        // Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 4
        // Math.abs(mousePosition.current.x - prevMousePosition.current.x) < 0.1 &&
        // Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.1
        Math.abs(mousePosition.current.x - prevMousePosition.current.x) <
          0.005 &&
        Math.abs(mousePosition.current.y - prevMousePosition.current.y) < 0.005
        // mousePosition.current.x === prevMousePosition.current.x &&
        // mousePosition.current.y === prevMousePosition.current.y
        // false
      ) {
      } else {
        setNewWave(
          mousePosition.current.x,
          mousePosition.current.y,
          currentWave.current
        )
        currentWave.current = (currentWave.current + 1) % maxRipples
      }

      prevMousePosition.current.x = mousePosition.current.x
      prevMousePosition.current.y = mousePosition.current.y

      stateMeshes.forEach((singleMesh) => {
        if (singleMesh.visible) {
          singleMesh.rotation.z += 0.02
          if (parentContainer) {
            singleMesh.scale.x = 1.0 * singleMesh.scale.x + 0.075 * 3
          } else {
            singleMesh.scale.x = 0.98 * singleMesh.scale.x + 0.025
          }
          singleMesh.scale.y = singleMesh.scale.x
          singleMesh.material.opacity *= 0.96
          if (singleMesh.material.opacity < 0.0002) {
            singleMesh.material.opacity = 0
            singleMesh.visible = false
          }
        }
      })
    }
    // Pass into RenderTarget, pass RenderTarget texture to shader
    // state.gl.setRenderTarget(target)
    // state.gl.render(sceneRipples, state.camera)
    // // mainMeshRef.current.material.uniforms.uDisplacement.value = target.texture
    // state.gl.setRenderTarget(null)
    // state.gl.clear()
  }, 1)

  // const handlePointerMove = (e) => {
  //   const { left, top, width, height } =
  //     parentContainer.current.getBoundingClientRect()

  //   // Calculate the mouse position relative to the center of the div
  //   const offsetX = e.clientX - (left + width / 2)
  //   const offsetY = e.clientY - (top + height / 2)

  //   // Normalize the coordinates to [-1, 1] range
  //   const normalizedX = offsetX / (width / 2)
  //   const normalizedY = -offsetY / (height / 2)

  //   console.log(normalizedX, normalizedY)

  //   mousePosition.current.x = (normalizedX * viewport.width) / 2
  //   mousePosition.current.x = (normalizedY * viewport.height) / 2
  // }

  return (
    <scene
      // onPointerMove={handlePointerMove}
      ref={sceneRef}
    ></scene>
  )
}

export default RipplesTexture
