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
        className={`${sectionTitle}-lightbar visible`}
      ></div>
    </>
  )
})

export default Lightbar
