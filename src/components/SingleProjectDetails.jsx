import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'

import { ReactComponent as ArrowSVG } from '../assets/icons/arrow.svg'
import { ReactComponent as ShortArrowSVG } from '../assets/icons/arrow-short.svg'
import { ReactComponent as GithubSVG } from '../assets/icons/github.svg'
import { ReactComponent as ExternalLinkSVG } from '../assets/icons/external-link.svg'

const SingleProjectDetails = ({
  leftSide,
  fullView,
  toggleFullView,
  project,
}) => {
  const [delayedFullView, setDelayedFullView] = useState(false)

  let gradientRef = useRef(null)
  let viewButtonRef = useRef(null)
  let contentContainerRef = useRef(null)
  let caseStudyButtonRef = useRef(null)

  useEffect(() => {
    let timeout = setTimeout(() => {
      setDelayedFullView(fullView)
    }, 500)

    if (leftSide) {
      gsap.to(viewButtonRef.current, {
        right: fullView ? 6 : 0,
        duration: 0.2,
      })
      gsap.to(viewButtonRef.current, {
        top: fullView
          ? contentContainerRef.current.getBoundingClientRect().height * 0.5 -
            16
          : 6,
      })
    } else {
      gsap.to(viewButtonRef.current, {
        right: fullView ? '80%' : 0,
        top: fullView
          ? contentContainerRef.current.getBoundingClientRect().height * 0.5 -
            16
          : 6,

        duration: 1,
      })
    }

    return () => {
      clearTimeout(timeout)
    }
  }, [leftSide, fullView])

  return (
    <div
      className={`absolute h-full transition-all duration-1000 ease-in-out z-50 flex items-center  ${
        fullView ? 'w-[10%]' : 'w-[40%]'
      }
        ${leftSide ? 'left-0 top-0' : 'right-0 top-0'}
        `}
    >
      <div className="w-full h-full relative ">
        <div
          className={`absolute h-full w-[450px] flex items-center justify-center transition-all duration-1000 ease-in-out 

            ${
              leftSide
                ? `
            ${fullView ? 'right-[25%]' : 'right-[5%]'}
            `
                : `
            ${fullView ? 'left-[25%]' : 'left-[5%]'}
            `
            }
            `}
        >
          <div
            className={`w-[450px] h-[675px] test-gradient rounded-xl backdrop-blur transition-all duration-1000 ease-in-out ${
              fullView ? '' : ''
            }`}
            // test-gradient
            ref={gradientRef}
          >
            <div
              // test-grad-child
              className={`w-full h-full test-grad-child relative overflow-hidden rounded-xl border border-slate-700 transition-all duration-200 delay-300 py-12 ${
                fullView ? 'px-0' : 'px-12'
              } `}
            >
              <div
                ref={contentContainerRef}
                className="w-full h-full flex flex-col gap-y-4 text-slate-400 relative "
              >
                <div className="w-full h-10 relative mb-2 flex items-center">
                  <h1
                    className={`text-lg font-semibold tracking-tighter md:text-4xl text-slate-300 whitespace-nowrap overflow-hidden transition-all duration-200 absolute top-0 left-0 ${
                      fullView
                        ? 'opacity-0 w-0'
                        : 'delay-500 w-full opacity-100'
                    } `}
                  >
                    {project.title !== 'Flood Tracker' ? (
                      <>{project.title}</>
                    ) : (
                      <>
                        <SpecialTitle title={project.title} />
                      </>
                    )}
                  </h1>
                  <button
                    ref={viewButtonRef}
                    style={{ '--clr-custom': '#3667c4' }}
                    className={`shadow-button w-[84px] whitespace-nowrap text-[#5686f5] flex items-center space-x-1 text-xs tracking-tighter p-2 bg-slate-900 rounded-md hover:bg-black transition-colors duration-1000 absolute right-0`}
                    onClick={toggleFullView}
                  >
                    <div
                      className={`w-full flex justify-evenly transition-opacity duration-200
                        ${leftSide ? 'flex-row' : 'flex-row-reverse'}
                        ${
                          delayedFullView === fullView
                            ? 'opacity-100'
                            : 'opacity-0'
                        }`}
                    >
                      {delayedFullView ? (
                        <>
                          <ArrowSVG
                            className={` translate-y-[1px] scale-75 ${
                              leftSide ? '-rotate-[135deg]' : 'rotate-45'
                            }`}
                          />
                          <span>Details</span>{' '}
                        </>
                      ) : (
                        <>
                          <span>View here</span>{' '}
                          <ArrowSVG
                            className={` scale-75  ${
                              leftSide
                                ? 'rotate-45 ml-1 translate-y-[2px]'
                                : '-rotate-[135deg] mr-1 translate-y-[1px]'
                            }`}
                          />
                        </>
                      )}
                    </div>
                  </button>
                </div>
                <div
                  className={`max-h-[300px] w-full overflow-hidden transition-all duration-200 ${
                    fullView ? 'opacity-0 z-[-10]' : 'delay-500 opacity-100'
                  }`}
                >
                  <p className="mb-4">{project.descriptionIntro}</p>
                  <p>{project.descriptionMain}</p>
                </div>
                <div
                  className={`w-full mb-6 transition-all duration-200 ${
                    fullView
                      ? 'opacity-0 w-0 z-[-10]'
                      : 'delay-500 opacity-100 w-full'
                  } bg-purple-700/0`}
                >
                  <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 mt-6 text-slate-300">
                    {project.techList.map((tech) => (
                      <li
                        key={tech}
                        className="flex items-center group"
                      >
                        <ShortArrowSVG className="text-[#135ceb] inline-block mr-3 transform transition-transform group-hover:translate-x-1" />
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
                <div
                  className={`flex w-full items-center text-[#ccd6f6]  transition-all duration-200 ${
                    fullView ? 'opacity-0  z-[-10]' : 'delay-500 opacity-100'
                  }`}
                >
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <GithubSVG
                      className={`w-5 h-5 cursor-pointer hover:text-[#5686f5] transition-colors duration-300 mr-4 opacity-100`}
                    />
                  </a>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLinkSVG className="w-5 h-5 cursor-pointer hover:text-[#5686f5] transition-colors duration-300 mr-6 opacity-100 " />
                  </a>

                  <div
                    ref={caseStudyButtonRef}
                    className={`relative transition-all duration-200 ${
                      fullView ? 'opacity-0  z-[-10]' : 'delay-500 opacity-100'
                    }`}
                  >
                    <button
                      style={{ '--clr-custom': '#3667c4' }}
                      className="text-[#5686f5] flex items-center space-x-1 text-xs tracking-tighter p-2 bg-black rounded-md hover:bg-slate-900 transition-colors duration-1000 cursor-not-allowed"
                    >
                      <span>Case Study</span>{' '}
                    </button>
                    <p className="absolute mt-[1px] w-full text-right text-[9px]  text-[#707070] font-bold">
                      Coming soon
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SingleProjectDetails

const SpecialTitle = ({ title }) => {
  let arrayOfWords = title.split(' ')

  return (
    <>
      {arrayOfWords[0]}{' '}
      <span className="flood-analyzer-text-gradient">{arrayOfWords[1]}</span>
    </>
  )
}