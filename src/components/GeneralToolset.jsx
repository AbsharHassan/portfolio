import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { CSSPlugin } from 'gsap'
import VanillaTilt from 'vanilla-tilt'
import Lightbar from './Lightbar'
import ReactPNG2 from '../assets/tech/png/react-png-nobg.png'

import ToolsetCard from './ToolsetCard'

const GeneralToolset = ({ sectionTitle, toolsArray }) => {
  gsap.registerPlugin(CSSPlugin)

  let sectionRef = useRef(null)
  let lightbarRef = useRef(null)
  let contentRef = useRef(null)
  let headingTopRef = useRef(null)
  let headingBottomRef = useRef(null)
  let triggerElRef = useRef(null)

  const [isElVisible, setIsElVisible] = useState(false)
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [hoveredTool, setHoveredTool] = useState('')

  useEffect(() => {
    VanillaTilt.init(document.querySelectorAll(`.${sectionTitle}-card`), {
      max: 10,
      speed: 1000,
      scale: 1.05,
      reverse: true,
    })

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsElVisible(entry.isIntersecting)
      },
      {
        threshold: 0.85,
      }
    )
    observer.observe(triggerElRef.current)
  }, [])

  useEffect(() => {
    triggerElRef.current.classList.toggle('visible', isElVisible)
    lightbarRef.current.classList.toggle('visible', isElVisible)
    sectionRef.current.classList.toggle('visible', isElVisible)
    headingTopRef.current.classList.toggle('visible', isElVisible)
    headingBottomRef.current.classList.toggle('visible', isElVisible)
    // contentRef.current.classList.toggle('visible', isElVisible)

    // let intervalCounter
    // if (isElVisible) {
    //   intervalCounter = 0
    // } else {
    //   intervalCounter = 100
    // }
    // const intervalId = setInterval(() => {
    //   if (isElVisible) {
    //     // console.log(intervalCounter)
    //     intervalCounter++
    //     triggerElRef.current.style.webkitMaskImage = `radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / ${
    //       intervalCounter / 100 + 0.1
    //     }))`
    //   } else {
    //     // console.log(intervalCounter)
    //     intervalCounter--
    //     triggerElRef.current.style.webkitMaskImage = `radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / ${
    //       intervalCounter / 100 + 0.1
    //     }))`
    //   }
    // }, 10)

    // setTimeout(() => {
    //   clearInterval(intervalId)
    // }, 1000)

    // return () => {
    //   clearInterval(intervalId)
    // }
    if (isElVisible) {
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
  }, [isElVisible])

  //   #2857ff
  return (
    <section
      className={`${sectionTitle}-main`}
      ref={sectionRef}
    >
      <Lightbar
        ref={lightbarRef}
        section={sectionTitle}
      />

      <div
        ref={contentRef}
        className={`${sectionTitle}-content pt-10`}
      >
        <h3
          ref={headingTopRef}
          className={`font-semibold text-center text-5xl relative  ${
            sectionTitle === 'backend'
              ? 'translate-y-[160%]'
              : 'translate-y-[200%]'
          } opacity-70 ${sectionTitle}-heading`}
        >
          <code>&lt;{sectionTitle}&gt;</code>
        </h3>

        <div
          ref={triggerElRef}
          className={`mx-auto grid gap-8 p-8 place-items-center ${sectionTitle}-tile-section`}
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
          }}
        >
          {toolsArray.map((tool, index) => (
            <ToolsetCard
              key={tool.id}
              tool={tool}
              index={index}
              sectionTitle={sectionTitle}
              png={ReactPNG2}
            />
          ))}
        </div>

        <h3
          ref={headingBottomRef}
          className={`mx-auto font-semibold text-center text-5xl relative opacity-0 ${sectionTitle}-heading -translate-y-[200%]`}
        >
          <code>&lt;/{sectionTitle}&gt;</code>
        </h3>
      </div>
    </section>
  )
}

export default GeneralToolset
