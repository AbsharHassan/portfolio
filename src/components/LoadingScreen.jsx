import React, { useEffect, useRef, useState } from 'react'
import { useProgress } from '@react-three/drei'
import { ReactComponent as Trademark } from '../assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import gsap from 'gsap'

const LoadingScreen = ({ toggleIsHeroLoading }) => {
  const { active, progress } = useProgress()

  // const [isLoading, setIsLoading] = useState(true)
  const [isAnimationComplete, setIsAnimationComplete] = useState(false)

  let containterRef = useRef(null)
  let contentRef = useRef(null)

  useEffect(() => {
    const animationTimeout = setTimeout(() => {
      setIsAnimationComplete(true)
    }, 2500)

    return () => {
      clearTimeout(animationTimeout)
    }
  }, [])

  useEffect(() => {
    if (!active && progress === 100 && isAnimationComplete) {
      gsap.to(contentRef.current, {
        scale: 0.5,
        opacity: 0,
        duration: 1,
        onComplete: () => {
          toggleIsHeroLoading(false)
        },
      })
      // gsap.to(containterRef.current, {
      //   backgroundColor: '#11101800',
      //   duration: 2,
      //   delay: 1,
      //   onComplete: () => {
      //     toggleIsHeroLoading(false)
      //   },
      // })
    }
  }, [active, progress, isAnimationComplete])

  useEffect(() => {
    let x = containterRef.current
    return () => {
      gsap.to(x, {
        backgroundColor: '#11101800',
        duration: 2,
      })
    }
  }, [])

  // if (!isLoading && isAnimationComplete) {
  //   return null
  // }

  return (
    <div
      className="absolute inset-0 w-full h-full flex items-center justify-center z-[9999] text-3xl text-slate-300 bg-[#111018] font-bold"
      ref={containterRef}
    >
      <div
        className="flex flex-col items-center justify-center scale-100"
        ref={contentRef}
      >
        <Trademark className="w-40 h-40 mb-12 svg-animation" />
        <div className="mb-3">Readying 3D assets</div>
        <div>{progress.toFixed(0)}%</div>
      </div>
    </div>
  )
}

export default LoadingScreen
