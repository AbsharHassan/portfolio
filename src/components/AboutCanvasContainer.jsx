import { useRef, useState } from 'react'
import AboutText from './AboutSectionCanvas'

const AboutCanvasContainer = ({ isVisible }) => {
  let canvasContainerRef = useRef(null)

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (e.movementX > 1 || e.movementY > 1 || 1) {
      const { left, top, width, height } =
        canvasContainerRef.current.getBoundingClientRect()

      // Calculate the mouse position relative to the center of the div
      const offsetX = e.clientX - (left + width / 2)
      const offsetY = e.clientY - (top + height / 2)

      // Normalize the coordinates to [-1, 1] range
      const normalizedX = offsetX / (width / 2)
      const normalizedY = -offsetY / (height / 2)

      setMousePosition({ x: normalizedX, y: normalizedY })
    }
  }

  return (
    <div
      ref={canvasContainerRef}
      className="about-mask bg-red-700 z-[1000]"
      onMouseMove={handleMouseMove}
    >
      <AboutText
        isVisible={isVisible}
        parentContainer={canvasContainerRef}
        mousePosition={mousePosition}
      />
    </div>
  )
}

export default AboutCanvasContainer
