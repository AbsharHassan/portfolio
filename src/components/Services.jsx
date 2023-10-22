import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { CSSPlugin } from 'gsap'
import VanillaTilt from 'vanilla-tilt'
import Lightbar from './Lightbar'

import ServicesCard from './ServicesCard'
import useContentful from '../utils/useContentful'

gsap.registerPlugin(CSSPlugin)

const Services = ({ sectionTitle, toolsArray }) => {
  const { getServices } = useContentful()

  const [servicesArray, setServicesArray] = useState([])

  useEffect(() => {
    getServices().then((response) => {
      setServicesArray(response.items)
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
  const [tiltElements, setTiltElements] = useState(null)
  const [windowWidth, setWindowWidth] = useState(window.innerWidth)
  const [isScreenMedium, setIsScreenMedium] = useState(
    window.innerWidth >= 768 && window.innerWidth < 1280 ? true : false
  )
  const [isScreenSmall, setIsScreenSmall] = useState(
    window.innerWidth < 768 ? true : false
  )

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
        threshold: isScreenSmall ? 0.2 : isScreenMedium ? 0.4 : 0.85,
      }
    )

    observerForLight.observe(triggerElRef.current)

    return () => {
      observerForLight.disconnect()
    }
  }, [isScreenSmall, isScreenMedium])

  useEffect(() => {
    // if (!isScreenSmall) {
    //   if (isContainerVisibile) {
    //     console.log('show annimation')
    //     animationCards.current?.kill()
    //     animationCards.current = gsap.fromTo(
    //       `.${sectionTitle}-card`,
    //       {
    //         duration: 0,
    //         opacity: 0,
    //         translateY: 30,
    //       },
    //       {
    //         duration: 0.3,
    //         opacity: 1,
    //         translateY: 0,
    //         stagger: 0.1,
    //       }
    //     )
    //   } else {
    //     console.log('exitttttttttt annimation')
    //     animationCards.current?.kill()
    //     animationCards.current = gsap.to(`.${sectionTitle}-card`, {
    //       duration: 0,
    //       opacity: 0,
    //       translateY: 30,
    //       // stagger: 0.1,
    //     })
    //   }
    // }
  }, [isContainerVisibile, isScreenSmall])

  useEffect(() => {
    triggerElRef.current.classList.toggle('visible', triggerLight)
    // lightbarRef.current?.classList.toggle('visible', triggerLight)
    sectionRef.current.classList.toggle('visible', triggerLight)
    headingTopRef.current?.classList.toggle('visible', triggerLight)
    // headingBottomRef.current?.classList.toggle('visible', triggerLight)

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
          } opacity-0 ${sectionTitle}-heading
          back
          `}
        >
          {/* <code>&lt;Service&gt;</code> */}
          What can I do for you?
        </h3>

        <div
          ref={triggerElRef}
          // onMouseMove={handleMouseMove}
          className={`${sectionTitle}-grid max-w-6xl mx-auto md:my-12 p-5 transition-colors duration-1000 place-items-center ${sectionTitle}-tile-section 
           md:grid grid-cols-6 gap-5 gap-y-12 overflow-visible bg-green-700/0
          `}
        >
          {servicesArray.map((service, index) => {
            return (
              <ServicesCard
                key={index}
                service={service.fields}
                sectionTitle={sectionTitle}
              />
            )
          })}
        </div>

        {/* <h3
          ref={headingBottomRef}
          className={`mx-auto font-semibold text-center text-4xl md:text-5xl relative opacity-0 ${sectionTitle}-heading -translate-y-[200%]`}
        >
          <code>&lt;/Service&gt;</code>
        </h3> */}
      </div>
    </section>
  )
}

export default Services
