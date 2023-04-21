import { useEffect, useRef, useState } from 'react'
import BallCanvas from './BallCanvas'

const ToolsetCardV2 = ({ sectionTitle, index, tool, logo }) => {
  const [hoveredTool, setHoveredTool] = useState('')
  const [isMouseOver, setIsMouseOver] = useState(false)

  let textSectionRef = useRef(null)
  let logoSectionRef = useRef(null)

  useEffect(() => {
    // textSectionRef.current.classList.toggle('opacity-0', isMouseOver)
    // logoSectionRef.current.classList.toggle('opacity-0', isMouseOver)
  }, [isMouseOver])
  return (
    <div
      className={`${sectionTitle}-card grid grid-cols-4 flex-grow max-w-[365px] h-[195px] rounded-xl relative  text-[#a1a0ab] bg-black/20 ${
        sectionTitle === 'backend'
          ? `col-span-2 ${index === 3 && 'col-start-2'} ${
              index === 4 && 'col-start-4'
            }`
          : ''
      } ${sectionTitle === 'frontend' && 'col-span-2'}`}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
      onMouseEnter={() => {
        setHoveredTool(tool.title)
        setIsMouseOver(true)
      }}
      onMouseLeave={() => {
        setHoveredTool('')
        setIsMouseOver(false)
      }}
    >
      <div
        className={`col-span-2 pl-8 pt-8 h-full rounded-tl-xl rounded-bl-xl border-y border-l border-[#8643b088] `}
      >
        <div
          className="transition-opacity duration-300 opacity-0"
          ref={textSectionRef}
        >
          <p
            className={`${sectionTitle}-card-heading text-xl font-semibold mb-4 min-w-[225px]`}
            //   style={{ transform: 'translateZ(500px)' }}
          >
            <code>
              &lt;{tool.title}
              <span className="text-lg"> /</span>&gt;
            </code>
          </p>
          <p className="text-sm font-medium min-w-[225px]">
            {tool.description}
          </p>
        </div>
      </div>

      <div className="col-span-2 h-full rounded-tr-xl rounded-br-xl border-y border-r border-[#8643b088]">
        <div
          className="transition-opacity duration-300 opacity-0"
          ref={logoSectionRef}
        >
          {tool.logo}
        </div>
        {/* <div
          className={`absolute opacity-100  bottom-3 right-3 rounded-full transition-all duration-1000 ${
            hoveredTool === tool.title
              ? 'border-8 border-slate-600 w-24 h-24'
              : 'border-0 border-transparent w-16 h-16'
          }`}
        >
          {hoveredTool === tool.title ? <BallCanvas logo={logo} /> : tool.logo}
        </div> */}
      </div>
    </div>
  )
}

export default ToolsetCardV2
