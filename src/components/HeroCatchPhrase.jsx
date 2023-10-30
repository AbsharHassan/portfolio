import { useEffect, useRef } from 'react'
import { useProgress } from '@react-three/drei'
import gsap from 'gsap'

const HeroCatchPhrase = ({ extraClasses, assetsLoading }) => {
  const { active } = useProgress()

  let imagineRef = useRef(null)
  let buildRef = useRef(null)
  let shipRef = useRef(null)

  // useEffect(() => {
  //   if (!assetsLoading) {
  //     gsap.to(imagineRef.current, { opacity: 1, duration: 0.8 })
  //     gsap.to(buildRef.current, { delay: 0.8, opacity: 1, duration: 0.8 })
  //     gsap.to(shipRef.current, { delay: 1.6, opacity: 1, duration: 0.8 })
  //   }
  // }, [assetsLoading])

  return (
    <h1
      className={`text-[36px] sm:text-[60px] lg:text-[72px] font-semibold leading-tight mb-8 ${extraClasses} `}
    >
      <div className="block">
        <div className="w-fit">
          <div
            ref={imagineRef}
            className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-customViolet to-customIntermediate transition-[opacity,_transform] duration-700 ${
              assetsLoading
                ? 'opacity-0 translate-y-3'
                : 'opacity-100 translate-y-0'
            }`}
          >
            Im
            <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px]"></span>
            gine.
          </div>{' '}
          <div
            ref={buildRef}
            className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-customIntermediate to-customBlue transition-[opacity,_transform] duration-700 delay-700 ${
              assetsLoading
                ? 'opacity-0 translate-y-3'
                : 'opacity-100 translate-y-0'
            } `}
          >
            Build.
          </div>
        </div>
        <div
          ref={shipRef}
          className={`inline-block bg-clip-text text-transparent bg-gradient-to-r from-customBlue  to-customAqua  transition-[opacity,_transform] duration-700 delay-[1400ms] ${
            assetsLoading
              ? 'opacity-0 translate-y-3'
              : 'opacity-100 translate-y-0'
          }`}
        >
          Ship.
        </div>
      </div>
      {/* <div className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-customViolet via-customBlue to-customAqua ">
        Im
        <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px] "></span>
        gine. Build. Ship.
      </div> */}
    </h1>
  )
}

export default HeroCatchPhrase

// bg-clip-text text-transparent bg-gradient-to-r from-customViolet to-customBlue
