import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import BallCanvas from '../BallCanvas'
import CardCanvas from './CardCanvas'

const ToolsetCardV3 = ({ sectionTitle, index, tool, logo }) => {
  const [hoveredTool, setHoveredTool] = useState('')
  return (
    <div
      className={`${sectionTitle}-card grid grid-cols-4 flex-grow w-[365px] h-[195px] rounded-xl border relative  text-[#a1a0ab] bg-black/20 overflow-hidden ${
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
      {tool.title === 'React' && (
        <div className="text-white text-3xl col-span-4">
          <CardCanvas logo={logo} />
        </div>
      )}
    </div>
  )
}

export default ToolsetCardV3
