import { useEffect, useRef } from 'react'
import ContactEmailBanner from './ContactEmailBanner'
import ContactForm from './ContactForm'

const Contact = ({ setDummyHeadingRef }) => {
  let dummyHeadingRef = useRef(null)

  useEffect(() => {
    if (dummyHeadingRef) {
      setDummyHeadingRef(dummyHeadingRef)
    }
  }, [dummyHeadingRef, setDummyHeadingRef])

  return (
    <div className="h-screen w-screen flex space-x-40 justify-center items-center text-white px-32">
      <div className="w-1/2">
        <h1
          ref={dummyHeadingRef}
          className="font-bold text-[#3667c4] text-7xl mb-6 inline-block opacity-0 blur-3xl"
        >
          Get in Touch
        </h1>
        <h6 className="text-lg text-slate-500">
          I’m open to hearing about new opportunities. Feel free to reach out to
          me if you have a question, or just want to say hi!
        </h6>
        <br />
        <ContactEmailBanner />
      </div>
      <div className="w-1/2">
        <ContactForm />
      </div>
    </div>
  )
}

export default Contact
