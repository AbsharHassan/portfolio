import { useEffect, useRef } from 'react'

const DummyContact = ({ setDummyHeadingRef }) => {
  let dummyHeadingRef = useRef(null)

  useEffect(() => {
    if (dummyHeadingRef) {
      setDummyHeadingRef(dummyHeadingRef)
    }
  }, [dummyHeadingRef])
  return (
    <div className="h-screen w-screen flex space-x-40 justify-center items-center text-white px-36">
      <div className="w-1/2">
        <h1
          ref={dummyHeadingRef}
          className="font-bold text-4xl mb-6 bg-green-500 inline-block opacity-0"
        >
          Get in Touch
        </h1>
        <h6 className="text-lg">
          I’m open to hearing about new opportunities. Feel free to reach out to
          me if you have a question, or just want to say hi!
        </h6>
      </div>
      <div className="w-1/2">
        <div
          className={`relative w-[500px] h-[600px] rounded-xl backdrop-blur-xl transition-all duration-1000 ease-in-out bg-red-600/20`}
          // test-gradient
        ></div>
      </div>
    </div>
  )
}

export default DummyContact
