import { useEffect, useRef } from 'react'
import ContactEmailBanner from './ContactEmailBanner'
import ContactForm from './ContactForm'

const Contact = ({ isContactVisible, setDummyHeadingRef }) => {
  let dummyHeadingRef = useRef(null)

  useEffect(() => {
    if (dummyHeadingRef) {
      setDummyHeadingRef(dummyHeadingRef)
    }
  }, [dummyHeadingRef, setDummyHeadingRef])

  return (
    <div className="min-h-screen w-screen px-5 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-5 xl:space-x-40 xl:px-32 justify-center items-center text-white">
      <div
        className={`lg:w-1/2 transition-opacity duration-[2000ms] ${
          isContactVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <h1
          ref={dummyHeadingRef}
          className="font-bold text-[#3667c4] text-center  text-5xl lg:text-7xl mb-6 lg:inline-block opacity-0 blur-3xls whitespace-nowrap"
        >
          Get in Touch
        </h1>
        {/* add this to contentful */}
        <h6 className="text-sm text-slate-500 text-center lg:text-left lg:text-lg max-w-[640px]">
          Open to exciting opportunities! Feel free to drop me a message here or
          email me directly – let's create something great together.
        </h6>
        <br />
        <ContactEmailBanner />
      </div>
      <div className="w-full lg:w-1/2">
        <ContactForm isContactVisible={isContactVisible} />
      </div>
    </div>
  )
}

export default Contact
