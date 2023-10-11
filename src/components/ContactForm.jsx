import { useState, useEffect, useRef } from 'react'
import emailjs from '@emailjs/browser'
import gsap from 'gsap'
import { ReactComponent as ProcessingSVG } from '../assets/icons/processing.svg'
import NeonButton from './NeonButton'

const ContactForm = () => {
  const messageSuccess =
    'Thank you for your message, I will get back to you as soon as possible :)'
  const messageFailure = 'Something went wrong, please try again later :('

  const [textareaFocus, setTextareaFocus] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultMessage, setResultMessage] = useState('')

  let nameInputRef = useRef(null)
  let emailInputRef = useRef(null)
  let textareaRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsProcessing(true)

    //add these as env vars
    emailjs
      .send(
        'service_c21hvfm',
        'template_7w7o69q',
        {
          from_name: nameInputRef.current.value,
          message: textareaRef.current.value,
          email: emailInputRef.current.value,
        },
        'icBXfj934eizyrT6o'
      )
      .then(
        (result) => {
          setIsProcessing(false)
          setResultMessage(messageSuccess)
          nameInputRef.current.value = ''
          emailInputRef.current.value = ''
          textareaRef.current.value = ''
        },
        (error) => {
          setIsProcessing(false)
          setResultMessage(messageFailure)
          nameInputRef.current.value = ''
          emailInputRef.current.value = ''
          textareaRef.current.value = ''
        }
      )
  }

  useEffect(() => {
    gsap.to('.letter-lines', {
      '--line-color': textareaFocus ? '#023e8a' : 'rgb(71 85 105 / 1)',
      duration: 1,
    })
  }, [textareaFocus])

  useEffect(() => {
    let timeout

    if (resultMessage) {
      timeout = setTimeout(() => {
        setResultMessage('')
      }, 5000)
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [resultMessage])
  return (
    <div
      className={`mb-20 lg:mb-0 relative w-full sm:w-[640px] mx-auto  lg:w-[500px] rounded-xl test-gradient backdrop-blur transition-all duration-1000 ease-in-out `}
      // test-gradient
    >
      <div className="w-full h-full test-grad-child absolute inset-0 bg-red-900/0 overflow-hidden rounded-xl border-slate-7000 p-12 text-slate-400 flex flex-col gap-y-4 z-[-10] ">
        {/* test-grad-child */}
      </div>
      <div className="w-full py-10 px-6 lg:px-16 flex flex-col text-slate-400 focus:outline-none">
        <form
          className="flex flex-col"
          onSubmit={handleSubmit}
        >
          <label className="text-sm w-full flex flex-col justify-between bg-red-700/0 mb-8 lg:mb-12">
            <span className="bg-purple-700/0 -ml-1">Your name</span>
            <input
              // placeholder="Your good name"
              ref={nameInputRef}
              type="from_name"
              className="bg-green-700/0 w-full text-slate-300 focus:outline-0 border-b-4 border-slate-600 focus:border-[#023e8a] transition-colors duration-500 py-1"
            />
          </label>

          <label className="text-sm w-full flex flex-col justify-between bg-red-700/0 mb-8 lg:mb-12">
            <span className="bg-purple-700/0 -ml-1">Your email</span>
            <input
              ref={emailInputRef}
              required
              // placeholder="Your good name"
              type="email"
              className="bg-green-700/0 w-full text-slate-300 focus:outline-0 border-b-4 border-slate-600 focus:border-[#023e8a] transition-colors duration-500 py-1"
            />
          </label>

          <label className="text-sm w-full flex flex-col justify-between bg-red-700/0 mb-6">
            <span className="bg-purple-700/0 -ml-1">Message</span>
            <textarea
              name="message"
              required
              ref={textareaRef}
              className="bg-transparent letter-lines focus:outline-none resize-none h-[200px] text-slate-300"
              style={{
                '--line-color': 'rgb(51 65 85 / 1)',
              }}
              onFocus={() => {
                setTextareaFocus(true)
              }}
              onBlur={() => {
                setTextareaFocus(false)
              }}
            ></textarea>
          </label>

          <div
            className={`w-full h-9 text-sm font-bold tracking-tighter transition-all duration-1000 
            ${resultMessage ? 'mb-12' : 'mb-0'}
        ${
          resultMessage === messageSuccess ? 'text-green-600' : 'text-red-600'
        }`}
          >
            <span
              className={`transition-opacity delay-1000 duration-300 ${
                resultMessage ? 'opacity-100' : 'opacity-100'
              }`}
            >
              {resultMessage}
            </span>
          </div>

          <NeonButton
            type="submit"
            colorNeon="#3667c4"
            shadow={false}
            extraClasses="w-full h-12 tracking-wider hover:text-slate-400"
          >
            {!isProcessing ? (
              <div>Submit</div>
            ) : (
              <div className="w-full flex items-center justify-center ">
                Processing
                <ProcessingSVG className="w-8 h-8 processing-svg" />
              </div>
            )}
          </NeonButton>
        </form>
      </div>
    </div>
  )
}

export default ContactForm
