import { useState } from 'react'
import BallCanvas from './BallCanvas'

const ToolsetCard = ({ sectionTitle, index, tool, logo }) => {
  const [hoveredTool, setHoveredTool] = useState('')
  return (
    <div
      className={`${sectionTitle}-card grid grid-cols-4 flex-grow max-w-[365px] h-[195px] rounded-xl border relative p-8 text-[#a1a0ab] bg-black/20 ${
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
      key={tool.id}
      onMouseEnter={() => {
        setHoveredTool(tool.title)
      }}
      onMouseLeave={() => {
        setHoveredTool('')
      }}
    >
      <div className={`col-span-3 `}>
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
      </div>
      <div
        className={`absolute opacity-100  bottom-3 right-3 rounded-full transition-all duration-1000 ${
          hoveredTool === tool.title
            ? 'border-8 border-slate-600 w-24 h-24'
            : 'border-0 border-transparent w-16 h-16'
        }`}
      >
        {hoveredTool === tool.title ? <BallCanvas logo={logo} /> : tool.logo}
      </div>
    </div>
  )
}

export default ToolsetCard
