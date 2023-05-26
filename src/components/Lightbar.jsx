import { forwardRef } from 'react'

const Lightbar = forwardRef(({ sectionTitle }, ref) => {
  return (
    <>
      {/* <div className="absolute inset-0  w-full h- overflow-y-visible overflow-x-hidden">
        <div
          ref={ref}
          className={`${sectionTitle}-lightbar `}
        ></div>
      </div> */}
      <div
        ref={ref}
        className={`${sectionTitle}-lightbar `}
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
