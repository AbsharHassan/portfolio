import { useState, useEffect } from 'react'

function useWindowResize(throttleTime = 100) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    let timeoutId

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }

      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }, throttleTime)
    }

    // Add the event listener
    window.addEventListener('resize', handleResize)

    // Initial window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })

    // Clean up the event listener
    return () => {
      window.removeEventListener('resize', handleResize)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [throttleTime])

  return windowSize
}

export default useWindowResize
