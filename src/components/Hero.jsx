import { useRef, useEffect, useState, Suspense } from 'react'

import { Vector2, Color } from 'three'

import { ReactComponent as Trademark23 } from '../assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import HeroCanvas from './HeroCanvas'
import AlternatingText from './AlternatingText'
import HeroBloomCanvas from './HeroBloomCanvas'

const Hero = () => {
  // Constants
  const bloomColorsArray = [
    // new Color(0.48, 0.33, 0.83),
    // new Color(0.35, 0.51, 0.98),
    // new Color(0.04, 0.66, 0.72),
    new Color(0.48 * 10, 0.33 * 10, 0.83 * 10),
    new Color(0.35 * 10, 0.51 * 10, 0.98 * 15),
    new Color(0.04 * 10, 0.66 * 10, 0.72 * 10),
  ]

  // States
  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new Vector2())
  const [bloomTheme, setBloomTheme] = useState(bloomColorsArray[0])

  let heroSectionRef = useRef(null)
  let bloomCounter = useRef(1)

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event

    const sectionBounds = heroSectionRef.current.getBoundingClientRect()

    const mouseX =
      ((clientX - sectionBounds.left) / sectionBounds.width) * 2 - 1
    const mouseY =
      -((clientY - sectionBounds.top) / sectionBounds.height) * 2 + 1

    setMousePosition(new Vector2(mouseX, mouseY))
  }

  const bloomThemeChanger = () => {
    console.log(bloomCounter.current)
    setBloomTheme(bloomColorsArray[bloomCounter.current])

    if (bloomCounter.current !== 2) {
      bloomCounter.current++
    } else {
      bloomCounter.current = 0
    }
  }

  useEffect(() => {
    const bloomThemeInterval = setInterval(bloomThemeChanger, 10000)

    return () => {
      clearInterval(bloomThemeInterval)
    }
  }, [])

  return (
    <div
      ref={heroSectionRef}
      className="w-full h-screen relative flex overflow-x-hidden bg-red-900/0"
      onMouseMove={handleMouseMove}
      onPointerEnter={() => {
        setIsMouseInside(true)
      }}
      onPointerLeave={() => {
        setIsMouseInside(false)
      }}
    >
      <div className="w-[100%] bg-blue-700/00 absolute left-0 h-full z-20 text-white  ">
        <div className="h-full flex flex-col justify-center mx-auto px-4 sm:px-12 xl:max-w-7xl">
          <h1 className="text-[36px] sm:text-[60px] lg:text-[72px] font-semibold leading-tight mb-8 ">
            <div className="hidden sm:block">
              <div className=" bg-clip-text text-transparent bg-gradient-to-r from-customViolet to-customBlue">
                Im
                <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px]"></span>
                gine. Build.
              </div>
              <div className=" bg-clip-text text-transparent bg-gradient-to-r from-customBlue  to-customAqua inline ">
                Ship.
              </div>
            </div>
            <div className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-customViolet via-customBlue to-customAqua">
              Im
              <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px] "></span>
              gine. Build. Ship.
            </div>
          </h1>
          <h2 className="sm:text-lg lg:text-xl mb-12 text-slate-400 h-44 sm:h-36 max-w-2xl ">
            Hi, my name is Abshar Hassan. I love using code to breath life into
            great ideas. With resuability, efficiency and best practices in
            mind, I strive to deliver production-grade code. I am your friendly
            neighbourhood{' '}
            <AlternatingText
              singleWord="frontend developer"
              wordsObjectArray={[
                {
                  text: 'frontend developer',
                  classes: 'bg-gradient-to-r from-customViolet to-customBlue',
                  cursor: '#5a82f9',
                },
                {
                  text: 'backend developer',
                  classes: 'bg-gradient-to-r from-customBlue  to-customAqua',
                  cursor: '#09a9b8',
                },
                {
                  text: 'fullstack developer',
                  classes: 'bg-gradient-to-r from-customViolet to-customBlue',
                  cursor: '#5a82f9',
                },
              ]}
            />
          </h2>
          <button className="neon-button w-52 h-12">Call to Action</button>
        </div>
      </div>
      <div className="w-full h-full relative">
        <div className="w-full h-full absolute inset-0">
          <HeroCanvas
            isMouseInside={isMouseInside}
            mousePosition={mousePosition}
            bloomTheme={bloomTheme}
          />
        </div>
        <div className="w-full h-full absolute inset-0">
          <HeroBloomCanvas
            isMouseInside={isMouseInside}
            mousePosition={mousePosition}
            bloomTheme={bloomTheme}
          />
        </div>
      </div>
    </div>
  )
}

export default Hero
