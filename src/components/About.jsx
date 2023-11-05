import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { CSSPlugin } from 'gsap'
import VanillaTilt from 'vanilla-tilt'
import Lightbar from './Lightbar'
import ReactPNG2 from '../assets/tech/png/react.png'

import ToolsetCard from './ToolsetCard'
import { Canvas } from '@react-three/fiber'
import { Text } from '@react-three/drei'
import AboutSectionCanvas from './AboutSectionCanvas'
import AboutCanvasContainer from './AboutCanvasContainer'
import useContentful from '../utils/useContentful'

gsap.registerPlugin(CSSPlugin)

const About = ({ sectionTitle, toolsArray }) => {
  const { getAbout } = useContentful()

  let sectionRef = useRef(null)
  let lightbarRef = useRef(null)
  let contentRef = useRef(null)
  let headingTopRef = useRef(null)
  let headingBottomRef = useRef(null)
  let triggerElRef = useRef(null)
  let animationCards = useRef(null)
  let animationMask = useRef(null)
  let canvasContainerRef = useRef(null)

  const [isContainerVisibile, setIsContainerVisible] = useState(false)
  const [aboutText, setAboutText] = useState('')
  const [triggerLight, setTriggerLight] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [hoveredTool, setHoveredTool] = useState('')
  const [tiltElements, setTiltElements] = useState(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isScreenMedium, setIsScreenMedium] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1280 ? true : false
  )
  const [isScreenSmall, setIsScreenSmall] = useState(
    window.innerWidth < 768 ? true : false
  )
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')
  const [cellOnTop, setCellOnTop] = useState(-1)

  const toggleCellOnTop = (index) => {
    setCellOnTop(index)
  }

  useEffect(() => {
    setTiltElements(document.querySelectorAll(`.${sectionTitle}-card`))
    // VanillaTilt.init(document.querySelectorAll(`.${sectionTitle}-card`), {
    //   max: 10,
    //   speed: 1000,
    //   scale: 1.05,
    //   reverse: true,
    // })

    const observerForContainer = new IntersectionObserver((entries) => {
      const entry = entries[0]
      setIsContainerVisible(entry.isIntersecting)
    })
    observerForContainer.observe(triggerElRef.current)

    const checkScreenSm = () => {
      setIsScreenSmall(window.innerWidth < 768 ? true : false)
      setIsScreenMedium(
        window.innerWidth >= 768 && window.innerWidth < 1280 ? true : false
      )
    }

    window.addEventListener('resize', checkScreenSm)

    getAbout().then((response) => {
      console.log(response)
      console.log(response.items[0].fields.aboutMe)
      setAboutText(response.items[0].fields.aboutMe)
    })

    return () => {
      window.removeEventListener('resize', checkScreenSm)
      observerForContainer.disconnect()
    }
  }, [])

  useEffect(() => {
    const observerForLight = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setTriggerLight(entry.isIntersecting)
      },
      {
        threshold: isScreenSmall ? 0.2 : isScreenMedium ? 0.4 : 1,
      }
    )

    observerForLight.observe(triggerElRef.current)

    return () => {
      observerForLight.disconnect()
    }
  }, [isScreenSmall, isScreenMedium])

  // useEffect(() => {
  //   if (!isScreenSmall) {
  //     if (isContainerVisibile) {
  //       console.log('show annimation')
  //       animationCards.current?.kill()
  //       animationCards.current = gsap.fromTo(
  //         `.${sectionTitle}-card`,
  //         {
  //           duration: 0,
  //           opacity: 0,
  //           translateY: 30,
  //         },
  //         {
  //           duration: 0.3,
  //           opacity: 1,
  //           translateY: 0,
  //           stagger: 0.1,
  //         }
  //       )
  //     } else {
  //       console.log('exitttttttttt annimation')
  //       animationCards.current?.kill()
  //       animationCards.current = gsap.to(`.${sectionTitle}-card`, {
  //         duration: 0,
  //         opacity: 0,
  //         translateY: 30,
  //         // stagger: 0.1,
  //       })
  //     }
  //   }
  // }, [isContainerVisibile, isScreenSmall])

  useEffect(() => {
    triggerElRef.current.classList.toggle('visible', triggerLight)
    lightbarRef.current?.classList.toggle('visible', triggerLight)
    sectionRef.current.classList.toggle('visible', triggerLight)
    headingTopRef.current?.classList.toggle('visible', triggerLight)
    // headingBottomRef.current?.classList.toggle('visible', triggerLight)

    // if (triggerLight) {
    //   animationMask.current?.kill()
    //   animationMask.current = gsap.to(triggerElRef.current.style, {
    //     WebkitMaskImage:
    //       'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 1))',
    //     duration: 1,
    //   })
    // } else {
    //   animationMask.current?.kill()
    //   animationMask.current = gsap.to(triggerElRef.current.style, {
    //     WebkitMaskImage:
    //       'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
    //     duration: 1,
    //   })
    // }
  }, [triggerLight])

  // useEffect(() => {
  //   // if (canvasContainerRef.current) {
  //   //   canvasContainerRef.current.addEventListener('mousemove', () => {
  //   //     console.log('wow worked')
  //   //   })
  //   // }

  //   return () => {}
  // }, [canvasContainerRef])

  //   #2857ff
  return (
    <section
      className={`${sectionTitle}-main min-h-[1000px] `}
      ref={sectionRef}
      onPointerMove={() => {
        // console.log('pointer is moving in grandparent')
      }}
      style={{
        background:
          'radial-gradient(ellipse 80% 30% at 50% 70%, rgb(0 0 0 / 1) 20%, rgb(0 0 0 / 0))',
      }}
    >
      <Lightbar
        ref={lightbarRef}
        sectionTitle={sectionTitle}
      />

      <div
        ref={contentRef}
        className={`${sectionTitle}-content pt-10`}
      >
        <h3
          ref={headingTopRef}
          className={`font-semibold text-center text-3xl sm:text-4xl md:text-5xl relative  ${
            sectionTitle === 'backend'
              ? 'translate-y-[160%]'
              : 'translate-y-[200%]'
          } opacity-0 ${sectionTitle}-heading`}
        >
          {/* <code>&lt;about&gt;</code> */}A little about me
        </h3>

        <div
          ref={triggerElRef}
          className={`mx-auto my-6 place-items-center 
           text-slate-500 text-sm sm:text-base lg:text-xl text-justify relative
           z-[1000] p-5
           max-w-[950px] 
          `}
          // style={{
          //   // overflow: 'visible',
          //   // '--number-cols': 8,
          //   WebkitMaskImage:
          //     'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
          // }}
        >
          {/* add to contentful */}
          <div
            className={`font-semibold sm:font-normal about-text-gradient text-transparent transition-opacity duration-[1500ms] ${
              triggerLight ? 'opacity-100' : 'opacity-25'
            }`}
          >
            {aboutText}
          </div>
          {/* <div className="about-mask border-2 p-6 border-slate-500 rounded-xl ">
            <AboutSectionCanvas />
          </div> */}
          {/* <div
            ref={canvasContainerRef}
            className="about-mask "
          >
            <AboutSectionCanvas
              isVisible={triggerLight}
              parentContainer={canvasContainerRef}
            />
          </div> */}
          {/* <AboutCanvasContainer isVisible={triggerLight} /> */}
          {/* <div className="bg-green-600/0 absolute inset-0 ">
            <div className="w-[65%] h-full border  mx-auto"></div>
          </div> */}
        </div>

        {/* <h3
          ref={headingBottomRef}
          className={`mx-auto font-semibold text-center text-4xl md:text-5xl relative opacity-0 ${sectionTitle}-heading -translate-y-[200%]`}
        >
          <code>&lt;/about&gt;</code>
        </h3> */}
      </div>
    </section>
  )
}

export default About

// ${
//   sectionTitle === 'frontend' &&
//   ' md:max-w-3xl lg:max-w-4xl grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
// }
// ${
//   sectionTitle === 'backend' &&
//   // 'grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
//   ' md:max-w-3xl lg:max-w-4xl grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
// }
// ${
//   sectionTitle === 'devops' &&
//   'md:max-w-3xl lg:max-w-4xl grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
// }

const TextScene = () => {
  return (
    <Text
      maxWidth={50}
      fontSize={0.9}
      anchorX="center"
      anchorY="middle"
      lineHeight={1.2}
      textAlign="justify"
    >
      Motivated and innovative web developer with a strong foundation in
      full-stack development, gained through hands-on experience in creating
      bespoke and complex applications from concept to deployment. Adept at
      utilizing cutting-edge technologies such as MERN Stack, Laravel, Vue,
      MySQL to develop robust and user-centric web solutions. I have
      successfully developed and deployed projects ranging from student
      information management systems to real-time flood tracking applications.
      My ability to conceptualize, design, and execute projects independently,
      coupled with a strong dedication to continuous learning, makes me a
      motivated and adaptable candidate ready to
    </Text>
  )
}
