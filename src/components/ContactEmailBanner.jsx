import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ReactComponent as ArrowSVG } from '../assets/icons/arrow.svg'

const ContactEmailBanner = () => {
  const [bannerHovered, setBannerHovered] = useState(false)
  const [showCopied, setShowCopied] = useState(false)

  let emailBannerGlowRef = useRef(null)
  let emailArrowRef = useRef(null)
  let copiedNotificationRef = useRef(null)

  useEffect(() => {
    gsap.to(emailBannerGlowRef.current, {
      opacity: bannerHovered ? 1 : 0,
      duration: 0.2,
      ease: 'power3.in',
    })
    gsap.to(emailArrowRef.current, {
      rotate: bannerHovered ? 45 : 0,
      duration: 0.2,
      ease: 'power3.in',
    })
  }, [bannerHovered])

  useEffect(() => {
    let timeout

    if (showCopied) {
      timeout = setTimeout(() => {
        setShowCopied(false)
        setBannerHovered(false)
      }, 2000)
    }

    gsap.to(copiedNotificationRef.current, {
      translateY: showCopied ? 0 : 16,
    })

    return () => {
      clearTimeout(timeout)
    }
  }, [showCopied])
  return (
    <div className="w-full lg:flex justify-center items-baseline lg:justify-start lg:space-x-5 ">
      <div
        className="relative flex items-center justify-center lg:inline-block hover:cursor-pointer"
        onMouseEnter={() => {
          setBannerHovered(true)
        }}
        onMouseLeave={() => {
          setBannerHovered(false)
        }}
        onClick={() => {
          navigator.clipboard.writeText('abshar.hassan7@gmail.com')
          setShowCopied(true)
          setBannerHovered(true)
        }}
      >
        <div className="relative">
          <div
            // text-[#9d84ff]
            ref={emailBannerGlowRef}
            className="text-[#3667ff] flex items-center space-x-4 absolute inset-0 z-[-10] blur-md scale-110 "
          >
            <ArrowSVG />
            <p className="text-sm lg:text-base">abshar.hassan7@gmail.com</p>
          </div>
          <div
            // text-[#9d84ff]
            className="text-[#3667c4] flex items-center space-x-4"
          >
            <p ref={emailArrowRef}>
              <ArrowSVG className="translate-y-0.5" />
            </p>
            <p className="text-sm lg:text-base">abshar.hassan7@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="text-xs font-bold z-[5000000] text-green-600 overflow-hidden text-center">
        <div
          ref={copiedNotificationRef}
          className="translate-y-4"
        >
          Copied!
        </div>
      </div>
    </div>
  )
}

export default ContactEmailBanner
