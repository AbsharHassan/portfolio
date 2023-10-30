import React, { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { ReactComponent as Trademark } from '../assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import gsap from 'gsap'

const LoadingScreen = ({ toggleAssetsLoading }) => {
  const { active, progress } = useProgress()

  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  let containterRef = useRef(null)
  let contentRef = useRef(null)
  let brandRef = useRef(null)
  let progressIndicator = useRef(null)

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setIsAnimationComplete(true)
    }, 2000)

    return () => {
      clearTimeout(animationTimeout)
    }
  }, [])

  useEffect(() => {
    if (brandRef.current) {
      gsap.to(brandRef.current, {
        strokeDashoffset: 0,
        duration: 2, // Animation duration in seconds
        ease: 'power2.inOut', // Easing function
        repeat: -1, // Repeat indefinitely
        yoyo: true, // Reverse animation to create a ping-pong effect
      })
    }
  }, [brandRef])

  useEffect(() => {
    if (!active && isAnimationComplete) {
      gsap.to(brandRef.current, {
        fillOpacity: 1,
        duration: 0.4,
        ease: 'power2',
      })

      gsap.to(progressIndicator.current, {
        opacity: 0,
        duration: 0.5,
        ease: 'power2',
      })

      gsap.to(brandRef.current, {
        scale: 2,
        duration: 1,
        ease: 'power2.in',
      })

      gsap.to(containterRef.current, {
        delay: 0.5,
        opacity: 0,
        duration: 0.5,
        ease: 'power2',
        onComplete: () => {
          toggleAssetsLoading()
          console.log('complete')
        },
      })
    }
  }, [active, isAnimationComplete])

  return (
    <div
      // className="fixed inset-0 w-full h-screen flex items-center justify-center z-[9999] text-3xl text-slate-300 bg-black "
      className="fixed top-0 left-0 z-[9000000000000000] w-screen h-screen overflow-hidden flex items-center justify-center text-slate-300 bg-black"
      ref={containterRef}
    >
      <div
        className="flex flex-col items-center justify-center scale-100 test-gradient w-full sm:w-[60%] max-w-7xl "
        ref={contentRef}
      >
        <Trademark
          fill="white"
          fillOpacity={0}
          stroke="#e2e8f0"
          ref={brandRef}
          className="w-40 h-w-40 mb-6 "
          style={{
            strokeDasharray: 1045.3275146484375,
            strokeDashoffset: 1045.3275146484375,
          }}
        />
        {/* <div className="mb-3">Readying 3D assets</div> */}
        <div
          ref={progressIndicator}
          className="font-mono text-3xl"
        >
          {progress.toFixed(0)}%
        </div>
      </div>
    </div>
  )
}

export default LoadingScreen
