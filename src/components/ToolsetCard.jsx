import { useEffect, useRef, useState } from 'react'

const ToolsetCard = ({
  sectionTitle,
  index,
  tool,
  cellOnTop,
  toggleCellOnTop,
}) => {
  const [isMouseInside, setIsMouseInside] = useState(false)

  let cardRef = useRef(null)
  let iconLogoRef = useRef(null)

  useEffect(() => {
    if (isMouseInside) {
      toggleCellOnTop(index)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMouseInside])

  return (
    <div
      ref={cardRef}
      className={`md:col-span-2 w-full  flex items-center justify-center h-[85.6px] text-3xl transition-all duration-1000 inset-0 text-transparent relative 
      ${index === 11 && 'md:col-start-3 '}
      ${index === cellOnTop && 'z-50'}
      `}
      key={tool.id}
    >
      <div
        className={`${sectionTitle}-card border backdrop-blur-sm absolute grid rounded-xl bg-black/40 transition-all duration-1000 p-6  ${
          isMouseInside ? 'w-[338.4px] h-[193.4px] ' : 'w-[174px] h-[85.6px] '
        } `}
        onMouseEnter={() => {
          setIsMouseInside(true)
        }}
        onMouseLeave={() => {
          setIsMouseInside(false)
        }}
      >
        <div
          className={`overflow-hidden pr-16 transition-all w-[338.4px] h-[193.4px ${
            isMouseInside
              ? 'opacity-100 delay-300 duration-300 scale-100 translate-x-0 translate-y-0'
              : 'opacity-0 duration-300 scale-0 -translate-x-1/2 -translate-y-1/2'
          }`}
        >
          <p
            className={`${sectionTitle}-card-heading text-xl font-medium opacity-100 mb-5 `}
          >
            <code>&lt;{tool.title} /&gt;</code>
          </p>

          <div className="text-sm font-medium flex flex-wrap w-[85%] text-gray-400">
            {tool.description}
          </div>
        </div>
        <div
          className={` transition-all duration-300 text-white absolute ${
            isMouseInside
              ? 'bottom-0 right-0 -translate-x-1/2 -translate-y-1/2'
              : 'bottom-1/2 right-1/2 translate-x-1/2 translate-y-1/2'
          } `}
          ref={iconLogoRef}
        >
          <img
            src={'https:' + tool.logo.fields.file.url}
            alt={tool.title + ' logo'}
            className="pointer-events-none opacity-70 w-12 h-12"
          />
        </div>
      </div>
    </div>
  )
}

export default ToolsetCard
