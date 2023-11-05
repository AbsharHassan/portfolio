import { forwardRef } from 'react'

const Lightbar = forwardRef(({ sectionTitle, extraClasses }, ref) => {
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
        className={`${sectionTitle}-lightbar visible ${extraClasses}`}
      ></div>

      {/* <section
      ref={ref}
      className={`after:bg-[radial-gradient(ellipse_100%_40%_at_50%_60%,rgba(var(--section-color),0.1),transparent) relative flex flex-col items-center overflow-x-clip before:pointer-events-none before:absolute before:h-[40rem] before:w-full before:bg-[conic-gradient(from_90deg_at_80%_50%,#000212,rgb(var(--section-color-dark))),conic-gradient(from_270deg_at_20%_50%,rgb(var(--section-color-dark)),#000212)] before:bg-no-repeat before:transition-[transform,opacity] before:duration-1000 before:ease-in before:[mask:radial-gradient(100%_50%_at_center_center,_black,_transparent)] before:[background-size:50%_100%,50%_100%] before:[background-position:1%_0%,99%_0%] after:pointer-events-none after:absolute after:inset-0
      ${inView && "is-visible before:opacity-100 before:[transform:rotate(180deg)_scale(2)]" }
      ${!inView && "before:rotate-180 before:opacity-40"}
      `}
      style={
        {
          "--section-color": color,
          "--section-color-dark": colorDark,
        } 
      }
    >
      <div className="mt-[12.8rem] mb-16 w-full md:mt-[25.2rem] md:mb-[12.8rem]">
        {children}
      </div>
    </section> */}
    </>
  )
})

export default Lightbar
