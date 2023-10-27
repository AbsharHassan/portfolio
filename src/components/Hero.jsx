import { useRef, useEffect, useState, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toggleBloomTheme } from '../features/three/threeSlice'

import { Vector2, Color } from 'three'

import { ReactComponent as Trademark23 } from '../assets/trademark/A_with_leg_missing_tall_with_stroke.svg'
import HeroCanvas from './HeroCanvas'
import AlternatingText from './AlternatingText'
import HeroBloomCanvas from './BloomCanvas'
import HeroParticleCanvas from './old_useless_backups/HeroParticleCanvas'

import VanillaTilt from 'vanilla-tilt'
import HeroCatchPhrase from './HeroCatchPhrase'
import NeonButton from './NeonButton'
import { useInView } from 'react-intersection-observer'

const Hero = () => {
  // Constants
  const dispatch = useDispatch()

  const bloomColorsArray = [
    // new Color(0.48, 0.33, 0.83),
    new Color(0.76, 0.38, 1.0),
    new Color(0.35, 0.51, 0.98),
    new Color(0.04, 0.66, 0.72),
    // new Color(0.48 * 10, 0.33 * 10, 0.83 * 10),
    // new Color(0.35 * 10, 0.51 * 10, 0.98 * 15),
    // new Color(0.04 * 10, 0.66 * 10, 0.72 * 10),
  ]

  // States
  const { bloomTheme } = useSelector((state) => state.threeStore)
  const [isMouseInside, setIsMouseInside] = useState(false)
  const [mousePosition, setMousePosition] = useState(new Vector2())
  // const [bloomTheme, setBloomTheme] = useState(bloomColorsArray[0])

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
    // setBloomTheme(bloomColorsArray[bloomCounter.current])

    // if (bloomCounter.current !== 2) {
    //   bloomCounter.current++
    // } else {
    //   bloomCounter.current = 0
    // }
    dispatch(toggleBloomTheme())
  }

  useEffect(() => {
    const bloomThemeInterval = setInterval(
      () => dispatch(toggleBloomTheme()),
      10000
    )

    return () => {
      clearInterval(bloomThemeInterval)
    }
  }, [])

  // useEffect(() => {
  //   VanillaTilt.init(heroTextContainerRef.current, {
  //     max: 2,
  //     speed: 1000,
  //     // scale: 1.05,
  //     reverse: true,
  //     'full-page-listening': true,
  //   })
  // }, [])

  // useEffect(() => {
  //   const pre = document.querySelector('hero-text-container')

  //   const el = heroTextContainerRef.current

  //   window.addEventListener('mousemove', rotateElement)

  //   function rotateElement(event) {
  //     // get mouse position
  //     const x = event.clientX
  //     const y = event.clientY
  //     // console.log(x, y)

  //     // find the middle
  //     const middleX = window.innerWidth / 2
  //     const middleY = window.innerHeight / 2
  //     // console.log(middleX, middleY)

  //     // get offset from middle as a percentage
  //     // and tone it down a little
  //     const offsetX = ((x - middleX) / middleX) * 45
  //     const offsetY = ((y - middleY) / middleY) * 45

  //     // console.log(element)
  //     // set rotation
  //     heroTextContainerRef.current.style.setProperty(
  //       '--rotateX',
  //       offsetX + 'deg'
  //     )
  //     heroTextContainerRef.current.style.setProperty(
  //       '--rotateY',
  //       -1 * offsetY + 'deg'
  //     )
  //   }

  //   return () => {
  //     window.removeEventListener('mousemove', rotateElement)
  //   }
  // }, [])

  const [heroTextContainerRef, inView] = useInView({ threshold: 1 })

  return (
    <>
      <div
        ref={heroTextContainerRef}
        className="hero-text-container w-[100%]  relative h-screen z-30 text-white "
      >
        <div className="h-full flex flex-col justify-center mx-auto px-4 sm:px-12 xl:max-w-7xl">
          <div className="relative">
            <HeroCatchPhrase />
            {/* <HeroCatchPhrase extraClasses={'absolute inset-0 blur-[50px]'} /> */}
          </div>
          {/* add this to contentful */}
          <h2 className="sm:text-lg lg:text-lg mb-10 text-slate-400 h-44 sm:h-36 max-w-2xl ">
            Hello, I'm Abshar Hassan. I love using the power of code to
            transform innovative ideas into reality. With a focus on
            reusability, efficiency, and industry best practices, I craft
            high-quality, production-grade solutions. I am your friendly
            neighbourhood{' '}
            <AlternatingText
              singleWord="frontend developer"
              wordsObjectArray={[
                {
                  text: 'frontend developer.',
                  classes: 'bg-gradient-to-r from-customViolet to-customBlue',
                  cursor: '#5a82f9',
                },
                {
                  text: 'backend developer.',
                  classes: 'bg-gradient-to-r from-customBlue  to-customAqua',
                  cursor: '#09a9b8',
                },
                {
                  text: 'fullstack developer.',
                  classes: 'bg-gradient-to-r from-customViolet to-customBlue',
                  cursor: '#5a82f9',
                },
                {
                  text: 'ML engineer.',
                  classes: 'bg-gradient-to-r from-customBlue  to-customAqua',
                  cursor: '#09a9b8',
                },
              ]}
            />
          </h2>
          {/* <button className="neon-button w-52 h-12">Call to Action</button> */}
          <NeonButton
            colorNeon="#7b53d3"
            shadow
            type="button"
            extraClasses="w-52 h-12 text-[#7b53d3] hover:text-slate-400"
            handleClick={() => {
              const projectsElement = document.getElementById('projects')
              if (projectsElement) {
                projectsElement.scrollIntoView({ behavior: 'smooth' })
              }
            }}
          >
            See my work
          </NeonButton>
        </div>
        <div
          className={`absolute  w-full h-[38px]  flex justify-center items-center transition-all duration-300 ${
            inView ? 'opacity-100 bottom-[8vh]' : 'bottom-0 opacity-0'
          }`}
        >
          <a
            href="#projects"
            className="w-[26px] h-[38px] rounded-3xl border-2 border-slate-500 flex justify-center items-center"
          >
            <span className="scroll-span w-[4px] h-[10px] bg-slate-600 rounded-md">
              {' '}
            </span>
          </a>
        </div>
      </div>
      {/* <div className="w-full h-screen absolute inset-0 z-[-100]">
        <HeroCanvas
          // mousePosition={mousePosition}
          bloomTheme={bloomTheme}
        />
      </div> */}
      {/* <div className="w-full h-screen absolute top-0 z-[-100]">
        <HeroCanvas
          // mousePosition={mousePosition}
          bloomTheme={bloomTheme}
        />
      </div> */}
    </>
  )
}

export default Hero
