import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { CSSPlugin } from 'gsap'
import VanillaTilt from 'vanilla-tilt'
import Lightbar from './Lightbar'
import ReactPNG2 from '../assets/tech/png/react.png'

import ToolsetCard from './ToolsetCard'

const GeneralToolset = ({ sectionTitle, toolsArray }) => {
  gsap.registerPlugin(CSSPlugin)

  let sectionRef = useRef(null)
  let lightbarRef = useRef(null)
  let contentRef = useRef(null)
  let headingTopRef = useRef(null)
  let headingBottomRef = useRef(null)
  let triggerElRef = useRef(null)

  const [isContainerVisibile, setIsContainerVisible] = useState(false)
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

  useEffect(() => {
    setTiltElements(document.querySelectorAll(`.${sectionTitle}-card`))
    // VanillaTilt.init(document.querySelectorAll(`.${sectionTitle}-card`), {
    //   max: 10,
    //   speed: 1000,
    //   scale: 1.05,
    //   reverse: true,
    // })

    const observerForContainer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsContainerVisible(entry.isIntersecting)
      }
      // {
      //   threshold: 1,
      // }
    )
    observerForContainer.observe(triggerElRef.current)

    const checkScreenSm = () => {
      setIsScreenSmall(window.innerWidth < 768 ? true : false)
      setIsScreenMedium(
        window.innerWidth >= 768 && window.innerWidth < 1280 ? true : false
      )
    }

    window.addEventListener('resize', checkScreenSm)

    return () => {
      window.removeEventListener('resize', checkScreenSm)
      observerForContainer.disconnect()
    }
  }, [])

  // useEffect(() => {
  //   setIsScreenSmall(windowWidth < 768 ? true : false)
  // }, [windowWidth])

  useEffect(() => {
    const observerForLight = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setTriggerLight(entry.isIntersecting)
      },
      {
        threshold: isScreenSmall ? 0.2 : isScreenMedium ? 0.4 : 0.85,
      }
    )

    observerForLight.observe(triggerElRef.current)

    return () => {
      observerForLight.disconnect()
    }
  }, [isScreenSmall, isScreenMedium])

  useEffect(() => {
    if (!isScreenSmall) {
      if (isContainerVisibile) {
        gsap.to(`.${sectionTitle}-card`, {
          duration: 0.3,
          opacity: 1,
          translateY: 0,
          stagger: 0.1,
        })
      } else {
        gsap.to(`.${sectionTitle}-card`, {
          duration: 0,
          opacity: 0,
          translateY: 30,
          // stagger: 0.1,
        })
      }
    }
  }, [isContainerVisibile, isScreenSmall])

  useEffect(() => {
    triggerElRef.current.classList.toggle('visible', triggerLight)
    lightbarRef.current.classList.toggle('visible', triggerLight)
    sectionRef.current.classList.toggle('visible', triggerLight)
    headingTopRef.current.classList.toggle('visible', triggerLight)
    headingBottomRef.current.classList.toggle('visible', triggerLight)

    if (triggerLight) {
      gsap.to(triggerElRef.current.style, {
        WebkitMaskImage:
          'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 1))',
        duration: 1,
      })
    } else {
      gsap.to(triggerElRef.current.style, {
        WebkitMaskImage:
          'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
        duration: 1,
      })
    }
  }, [triggerLight])

  //   #2857ff
  return (
    <section
      className={`${sectionTitle}-main `}
      ref={sectionRef}
      onPointerMove={() => {
        // console.log('pointer is moving in grandparent')
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
          className={`font-semibold text-center text-4xl md:text-5xl relative  ${
            sectionTitle === 'backend'
              ? 'translate-y-[160%]'
              : 'translate-y-[200%]'
          } opacity-0 ${sectionTitle}-heading`}
        >
          <code>&lt;{sectionTitle}&gt;</code>
        </h3>

        <div
          ref={triggerElRef}
          className={`mx-auto px-4 pt-6 pb-16 md:p-8 flex flex-col items-center justify-center md:grid gap-8 transition-colors duration-1000 place-items-center ${sectionTitle}-tile-section 
          
          ${
            sectionTitle === 'frontend' &&
            ' md:max-w-3xl lg:max-w-4xl grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
          }
          ${
            sectionTitle === 'backend' &&
            // 'grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
            ' md:max-w-3xl lg:max-w-4xl grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
          }
          ${
            sectionTitle === 'devops' &&
            'md:max-w-3xl lg:max-w-4xl grid-cols-4 xl:max-w-6xl xl:grid-cols-6 '
          }
          
          `}
          style={{
            '--number-cols': 8,
            WebkitMaskImage:
              'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
          }}
        >
          {toolsArray.map((tool, index) => (
            <ToolsetCard
              key={tool.id}
              isSectionLit={triggerLight}
              tool={tool}
              index={index}
              sectionTitle={sectionTitle}
              png={tool.png}
              scale={tool.scale}
              tiltElements={tiltElements}
              isScreenSmall={isScreenSmall}
            />
          ))}
        </div>

        <h3
          ref={headingBottomRef}
          className={`mx-auto font-semibold text-center text-4xl md:text-5xl relative opacity-0 ${sectionTitle}-heading -translate-y-[200%]`}
        >
          <code>&lt;/{sectionTitle}&gt;</code>
        </h3>
      </div>
    </section>
  )
}

export default GeneralToolset
