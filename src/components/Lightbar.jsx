import { forwardRef } from 'react'

const Lightbar = forwardRef(({ section }, ref) => {
  return (
    <>
      <div
        ref={ref}
        className={`${section === 'frontend' && 'frontend-lightbar'} ${
          section === 'backend' && 'backend-lightbar'
        } ${
          section === 'devops' && 'devops-lightbar'
        } transition-all duration-1000`}
      ></div>
      <svg
        width="0"
        height="0"
      >
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="6.29"
            numOctaves="6"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
    </>
  )
})

export default Lightbar
