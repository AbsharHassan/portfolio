import { useEffect, useState, useRef } from 'react'
import useContentful from '../utils/useContentful'

import gsap from 'gsap'
import { CSSPlugin } from 'gsap'

import Lightbar from './Lightbar'
import ToolsetCard from './ToolsetCard'

gsap.registerPlugin(CSSPlugin)

const Toolset = ({ sectionTitle }) => {
  const { getToolset } = useContentful()

  const [toolsArray, setToolsArray] = useState([])

  useEffect(() => {
    getToolset().then((response) => {
      console.log(response.items)
      setToolsArray(response.items)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  let sectionRef = useRef(null)
  let lightbarRef = useRef(null)
  let contentRef = useRef(null)
  let headingTopRef = useRef(null)
  let headingBottomRef = useRef(null)
  let triggerElRef = useRef(null)
  let animationCards = useRef(null)
  let animationMask = useRef(null)

  const [isContainerVisibile, setIsContainerVisible] = useState(false)
  const [triggerLight, setTriggerLight] = useState(false)
  const [isScreenMedium, setIsScreenMedium] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1280 ? true : false
  )
  const [isScreenSmall, setIsScreenSmall] = useState(
    window.innerWidth < 768 ? true : false
  )
  const [cellOnTop, setCellOnTop] = useState(-1)

  const toggleCellOnTop = (index) => {
    setCellOnTop(index)
  }

  useEffect(() => {
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
        threshold: isScreenSmall ? 0.1 : isScreenMedium ? 0.2 : 0.85,
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
        console.log('show annimation')
        animationCards.current?.kill()
        animationCards.current = gsap.fromTo(
          `.${sectionTitle}-card`,
          {
            duration: 0,
            opacity: 0,
            translateY: 30,
          },
          {
            duration: 0.3,
            opacity: 1,
            translateY: 0,
            stagger: 0.1,
          }
        )
      } else {
        console.log('exitttttttttt annimation')
        animationCards.current?.kill()
        animationCards.current = gsap.to(`.${sectionTitle}-card`, {
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
    lightbarRef.current?.classList.toggle('visible', triggerLight)
    sectionRef.current.classList.toggle('visible', triggerLight)
    headingTopRef.current?.classList.toggle('visible', triggerLight)
    headingBottomRef.current?.classList.toggle('visible', triggerLight)

    if (triggerLight) {
      animationMask.current?.kill()
      animationMask.current = gsap.to(triggerElRef.current.style, {
        WebkitMaskImage:
          'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 1))',
        duration: 1,
      })
    } else {
      animationMask.current?.kill()
      animationMask.current = gsap.to(triggerElRef.current.style, {
        WebkitMaskImage:
          'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
        duration: 1,
      })
    }
  }, [triggerLight])

  //   #2857ff
  return (
    <section
      className={`${sectionTitle}-main min-h-[1000px]`}
      ref={sectionRef}
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
          <code>&lt;toolset&gt;</code>
        </h3>

        <div
          ref={triggerElRef}
          className={`mx-auto my-12 transition-colors duration-1000 place-items-center ${sectionTitle}-tile-section 
          max-w-[950px]  flex flex-col items-center justify-center lg:grid grid-cols-10 gap-5 overflow-visible 
          `}
        >
          {toolsArray.map((tool, index) => {
            return (
              <ToolsetCard
                key={index}
                tool={tool.fields}
                index={index + 1}
                sectionTitle={sectionTitle}
                cellOnTop={cellOnTop}
                toggleCellOnTop={toggleCellOnTop}
              />
            )
          })}
        </div>

        <h3
          ref={headingBottomRef}
          className={`mx-auto font-semibold text-center text-4xl lg:text-5xl relative opacity-0 ${sectionTitle}-heading -translate-y-[200%]`}
        >
          <code>&lt;/toolset&gt;</code>
        </h3>
      </div>
    </section>
  )
}

export default Toolset
