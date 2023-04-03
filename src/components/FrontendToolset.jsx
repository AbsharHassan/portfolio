import { useEffect, useState, useRef } from 'react'
import Lightbar from './Lightbar'

const FrontendToolset = ({ toolsArray }) => {
  let sectionRef = useRef(null)
  let lightbarRef = useRef(null)
  let contentRef = useRef(null)
  let headingTopRef = useRef(null)
  let headingBottomRef = useRef(null)
  let triggerElRef = useRef(null)

  const [isElVisible, setIsElVisible] = useState(false)

  useEffect(() => {
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

    let intervalCounter
    if (isElVisible) {
      intervalCounter = 0
    } else {
      intervalCounter = 100
    }
    const intervalId = setInterval(() => {
      if (isElVisible) {
        console.log(intervalCounter)
        intervalCounter++
        triggerElRef.current.style.webkitMaskImage = `radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / ${
          intervalCounter / 100 + 0.1
        }))`
      } else {
        console.log(intervalCounter)
        intervalCounter--
        triggerElRef.current.style.webkitMaskImage = `radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / ${
          intervalCounter / 100 + 0.1
        }))`
      }
    }, 10)

    setTimeout(() => {
      clearInterval(intervalId)
    }, 1000)

    return () => {
      clearInterval(intervalId)
    }
  }, [isElVisible])

  return (
    <section
      id="frontend-toolset"
      className="frontend-main "
      ref={sectionRef}
    >
      {/* <h3 className="text-2xl font-bold  ml-8">
        <code className="text-[#306ee8]">&lt;frontend&gt;</code>
      </h3> */}

      <Lightbar
        ref={lightbarRef}
        section="frontend"
      />

      <div
        ref={contentRef}
        className="frontend-content pt-10"
      >
        <h3
          ref={headingTopRef}
          className="text-[#c261fe] font-semibold text-center text-5xl relative frontend-heading translate-y-[200%]"
        >
          <code>&lt;frontend&gt;</code>
        </h3>

        <div
          ref={triggerElRef}
          className="max-w-4xl mx-auto grid grid-cols-4 gap-8 p-8 place-items-center frontend-tile-section"
          style={{
            WebkitMaskImage:
              'radial-gradient(ellipse 100% 100% at 50% -20%, rgb(0 0 0 / 1), rgb(0 0 0 / 0))',
          }}
        >
          {toolsArray.map((tool) => (
            <div
              className="frontend-card col-span-2 grid grid-cols-4 flex-grow max-w-[365px] h-[195px] rounded-xl border border-[#8643b088] relative p-8 text-[#a1a0ab] bg-black/20"
              key={tool.id}
            >
              <div className="col-span-3">
                <p className="text-[#ac55e0] text-xl font-semibold mb-4">
                  <code>
                    &lt;{tool.title}
                    <span className="text-lg"> /</span>&gt;
                  </code>
                </p>
                <p className="text-sm font-medium">{tool.description}</p>
              </div>
              {tool.logo}
            </div>
          ))}
        </div>

        <h3
          ref={headingBottomRef}
          className="text-[#c261fe] mx-auto font-semibold text-center text-5xl relative opacity-20 frontend-heading -translate-y-[200%]"
        >
          <code>&lt;/frontend&gt;</code>
        </h3>
      </div>

      {/* <h3 className="text-2xl font-bold my-6 ml-8">
        <code className="text-[#306ee8]">&lt;/frontend&gt;</code>
      </h3> */}
    </section>
  )
}

export default FrontendToolset
