import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

import CardCanvas from './CardCanvas'
import TextTo2DWord from './TextTo2DWord'

const ToolsetCard = ({
  isSectionLit,
  sectionTitle,
  index,
  tool,
  png,
  scale,
  tiltElements,
  isScreenSmall,
}) => {
  let descriptionTextArray = tool.description.split(' ')

  const [hoveredTool, setHoveredTool] = useState('')
  const [colorTheme, setColorTheme] = useState('')
  const [isCardVisible, setIsCardVisible] = useState(!isScreenSmall)
  const [isMouseInside, setIsMouseInside] = useState(false)
  const [hasTitleRendered, setHasTitleRendered] = useState(false)
  const [sphereDomX, setSphereDomX] = useState(null)
  const [sphereDomY, setSphereDomY] = useState(null)

  let cardRef = useRef(null)
  let htmlDivBackgroundRef = useRef(null)
  let iconLogoRef = useRef(null)

  const handleVectorToDOM = (x, y) => {
    setSphereDomX(x)
    setSphereDomY(y)
  }

  const handlePointerEnter = () => {
    setIsMouseInside(true)
    htmlDivBackgroundRef.current.classList.add('opacity-100')
    if (isSectionLit) {
      iconLogoRef.current.classList.remove('opacity-100')
      iconLogoRef.current.classList.add('opacity-0')
    }
  }

  const handlePointerLeave = () => {
    setIsMouseInside(false)
    htmlDivBackgroundRef.current.classList.remove('opacity-100')
    iconLogoRef.current.classList.remove('opacity-0')
    iconLogoRef.current.classList.add('opacity-100')
    setHasTitleRendered(false)
  }

  const handleTitleRenderConfirm = (value) => {
    setHasTitleRendered(value)
  }

  useEffect(() => {
    if (sectionTitle === 'frontend') {
      setColorTheme('#7f4abb')
    } else if (sectionTitle === 'backend') {
      setColorTheme('#5a82f9')
    } else if (sectionTitle === 'devops') {
      setColorTheme('#00e0f4')
    }
  }, [sectionTitle])

  useEffect(() => {
    const observerForCard = new IntersectionObserver(
      (entries) => {
        const entry = entries[0]
        setIsCardVisible(entry.isIntersecting)
      },
      {
        threshold: 0.2,
      }
    )

    observerForCard.observe(cardRef.current)

    return () => {
      observerForCard.disconnect()
    }
  }, [])

  useEffect(() => {
    // cardRef.current.classList.toggle('opacity-0', !isCardVisible)
    // if (isCardVisible) {
    //   // cardRef.current.classList.remove('opacity-0')
    //   // cardRef.current.classList.add('opacity-100')
    //   cardRef.current.style.backgroundColor = 'red'
    // } else {
    //   cardRef.current.style.backgroundColor = 'green'

    //   // cardRef.current.classList.remove('opacity-100')
    //   // cardRef.current.classList.add('opacity-0')
    // }
    if (isCardVisible) {
      gsap.to(cardRef.current, {
        duration: 1,
        opacity: 1,
      })
    } else {
      gsap.to(cardRef.current, {
        duration: 1,
        opacity: 0,
      })
    }
  }, [isCardVisible])

  return (
    <div
      ref={cardRef}
      className={`${sectionTitle}-card col-span-2 text-3xl flex-grow w-full min-h-[195px] md:w-[340px] md:h-[195px] rounded-xl border relative text-[rgb(161,160,171)] bg-black/20 overflow-hidden transition-colors duration-1000  ${
        sectionTitle === 'backend' || sectionTitle === 'frontend'
          ? `${index === 3 && 'xl:col-start-2'} ${
              index === 4 && 'col-start-2 xl:col-start-4'
            }`
          : `${index === 2 && ''}`
      } 
        
      `}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      key={tool.id}
      onMouseEnter={() => {
        setHoveredTool(tool.title)
      }}
      onMouseLeave={() => {
        setHoveredTool('')
      }}
    >
      <div className="w-full h-full">
        <CardCanvas
          isSectionLit={isSectionLit}
          sectionTitle={sectionTitle}
          // colorTheme={colorTheme}
          png={png}
          scale={scale}
          title={tool.title}
          // title={`${tool.title} ${index}`}
          description={tool.description}
          logo={tool.logo}
          tiltElements={tiltElements}
          handlePointerEnter={handlePointerEnter}
          handlePointerLeave={handlePointerLeave}
          handleTitleRenderConfirm={handleTitleRenderConfirm}
          handleVectorToDOM={handleVectorToDOM}
          isScreenSmall={isScreenSmall}
        />
      </div>

      <div className="absolute inset-0 flex-grow h-full w-full rounded-xl text-transparent -z-10">
        <div className=" w-full h-full p-8 pb-14 relative ">
          <div
            className="absolute inset-0 frontend-canvas-gradient opacity-0 transition-opacity duration-300"
            ref={htmlDivBackgroundRef}
          ></div>
          <div className={`col-span-4 md:col-span-3 pr-5`}>
            <p
              className={`${sectionTitle}-card-heading text-xl font-medium opacity-0 mb-5 ${
                hasTitleRendered
                  ? 'transition-opacity duration-300 opacity-0 '
                  : 'opacity-100'
              }`}
            >
              <code>&lt;{tool.title} /&gt;</code>
            </p>

            <div className="text-sm font-medium flex flex-wrap w-[85%]">
              {descriptionTextArray.map((word, index) => (
                <TextTo2DWord
                  key={index}
                  word={word}
                  sphereDomX={sphereDomX}
                  sphereDomY={sphereDomY}
                  isMouseInside={isMouseInside}
                />
              ))}
            </div>
          </div>
          <span
            className="transition-opacity duration-300"
            ref={iconLogoRef}
          >
            {tool.logo}
          </span>
        </div>
      </div>

      {/* {tool.title === 'React' && (
        <div className="text-white text-3xl col-span-4  relative">
          <CardCanvas
            sectionTitle={sectionTitle}
            colorTheme={colorTheme}
            png={png}
            title={tool.title}
            description={tool.description}
            logo={tool.logo}
          />
        </div>
      )} */}

      {/* <div className="text-white text-3xl col-span-4 relative">
        <CardCanvas
          isSectionLit={isSectionLit}
          sectionTitle={sectionTitle}
          // colorTheme={colorTheme}
          png={png}
          title={tool.title}
          // title={`${tool.title} ${index}`}
          description={tool.description}
          logo={tool.logo}
          tiltElements={tiltElements}
        />

      </div> */}
      {/* <div className={`col-span-3 `}>
        <p
          className={`${sectionTitle}-card-heading text-xl font-semibold mb-4`}
          //   style={{ transform: 'translateZ(500px)' }}
        >
          <code>
            &lt;{tool.title}
            <span className="text-lg"> /</span>&gt;
          </code>
        </p>
        <p className="text-sm font-medium">{tool.description}</p>
      </div> */}

      {/* {tool.logo} */}
    </div>
  )

  // return (
  //   <div
  //     className={`${sectionTitle}-card grid grid-cols-4 flex-grow max-w-[365px] h-[195px] rounded-xl border relative p-8 text-[#a1a0ab] bg-black/20 ${
  //       sectionTitle === 'backend'
  //         ? `col-span-2 ${index === 3 && 'col-start-2'} ${
  //             index === 4 && 'col-start-4'
  //           }`
  //         : ''
  //     } ${sectionTitle === 'frontend' && 'col-span-2'}`}
  //     style={{
  //       transformStyle: 'preserve-3d',
  //       perspective: '1000px',
  //     }}
  //     key={tool.id}
  //     onMouseEnter={() => {
  //       setHoveredTool(tool.title)
  //     }}
  //     onMouseLeave={() => {
  //       setHoveredTool('')
  //     }}
  //   >
  //     <div className={`col-span-3 `}>
  //       <p
  //         className={`${sectionTitle}-card-heading text-xl font-semibold mb-4`}
  //         //   style={{ transform: 'translateZ(500px)' }}
  //       >
  //         <code>
  //           &lt;{tool.title}
  //           <span className="text-lg"> /</span>&gt;
  //         </code>
  //       </p>
  //       <p className="text-sm font-medium">{tool.description}</p>
  //     </div>
  //     <div
  //       className={`absolute opacity-100  bottom-3 right-3 rounded-full transition-all duration-1000 ${
  //         hoveredTool === tool.title
  //           ? 'border-8 border-slate-600 w-24 h-24'
  //           : 'border-0 border-transparent w-16 h-16'
  //       }`}
  //     >
  //       {hoveredTool === tool.title ? <BallCanvas logo={logo} /> : tool.logo}
  //     </div>
  //   </div>
  // )
}

export default ToolsetCard
