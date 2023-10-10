import { useEffect, useRef, useState, Suspense, createRef } from 'react'
import { createClient } from 'contentful'
import { useSelector, useDispatch } from 'react-redux'
import {
  useProgress,
  Stats,
  useGLTF,
  Sphere,
  View,
  PerspectiveCamera,
  OrbitControls,
} from '@react-three/drei'

import Hero from './components/Hero'
import SpaceDustCanvas from './components/SpaceDustCanvas'
import BloomCanvas from './components/BloomCanvas'
import ParticleModel from './components/ParticleModel'
import BackgroundCanvas from './components/BackgroundCanvas'
import NewTestParticleText from './components/NewTestParticleText'
import DistortedTexture from './components/DistortedTexture'
import Navbar from './components/Navbar'
import Projects from './components/Projects'
import About from './components/About'
import Contact from './components/Contact'
import DummyContact from './components/DummyContact'
import Services from './components/Services'
import Footer from './components/Footer'
import Toolset from './components/Toolset'
import NeonButton from './components/NeonButton'
import HeroCanvas from './components/HeroCanvas'
import DynamicCanvas from './components/DynamicCanvas'
import { Canvas } from '@react-three/fiber'

import useRefs from 'react-use-refs'
import LaptopModelViewTesting from './components/LaptopModelViewTesting'
import LaptopModel from './components/LaptopModel'
import PhoneModel from './components/PhoneModel'
import useContentful from './utils/useContentful'
import { useInViewport } from './utils/useInViewport'

function App() {
  let mainRef = useRef(null)
  let scrollContainerRef = useRef(null)

  // maybe merge about and toolset together
  let aboutContainerRef = useRef(null)
  let toolsetContainerRef = useRef(null)

  let heroContainerRef = useRef(null)
  let projectsContainerRef = useRef(null)

  let contactContainerRef = useRef(null)
  let serviceContainerRef = useRef(null)

  const [isParticleModelVisible, setIsParticleModelVisible] = useState(true)
  const [dimBackground, setDimBackground] = useState(false)
  const [isHeroFullVisible, setIsHeroFullVisible] = useState(true)
  const [isHeroVisible, setIsHeroVisible] = useState(true)
  const [isContactVisible, setIsContactVisible] = useState(false)
  const [isServiceVisible, setIsServiceVisible] = useState(false)
  const [isToolsetVisible, setIsToolsetVisible] = useState(false)
  const [dummyHeadingRef, setDummyHeadingRef] = useState(null)
  const [isProjectsVisible, setIsProjectsVisible] = useState(false)
  const [isAboutVisible, setIsAboutVisible] = useState(false)

  // useEffect(() => {
  //   let observerProjects

  //   if (projectsContainerRef.current) {
  //     observerProjects = new IntersectionObserver(([entry]) => {
  //       setIsProjectsVisible(entry.isIntersecting)
  //     })

  //     observerProjects.observe(projectsContainerRef.current)
  //   }

  //   return () => {
  //     observerProjects??.disconnect()
  //   }
  // }, [projectsContainerRef])

  // useEffect(() => {
  //   console.log(isProjectsVisible)
  // }, [isProjectsVisible])

  useEffect(() => {
    const observerHero = new IntersectionObserver(
      ([entry]) => {
        setIsHeroVisible(entry.isIntersecting)
      },
      { threshold: 0.5 } // 1.0 indicates when 100% of the target is visible
    )

    if (heroContainerRef.current) {
      observerHero.observe(heroContainerRef.current)
    }

    return () => {
      observerHero?.disconnect()
    }
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroFullVisible(entry.isIntersecting)
      },
      { threshold: 1 }
    )

    if (heroContainerRef.current) {
      observer.observe(heroContainerRef.current)
    }

    return () => {
      observer?.disconnect()
    }
  }, [])

  useEffect(() => {
    let observerContact

    if (contactContainerRef.current) {
      observerContact = new IntersectionObserver(
        ([entry]) => {
          setIsContactVisible(entry.isIntersecting)
          // console.log(entry.intersectionRect.left)
          // console.log(entry.intersectionRect.top)
        },
        { threshold: 0.5 } // 1.0 indicates when 100% of the target is visible
      )

      observerContact.observe(contactContainerRef.current)
    }

    return () => {
      observerContact?.disconnect()
    }
  }, [contactContainerRef])

  // useEffect(() => {
  //   const updateContactPosition = (e) => {
  //     console.log(contactContainerRef.current.getBoundingClientRect())
  //   }

  //   if (isContactVisible) {
  //     updateContactPosition(null)

  //     window.addEventListener('scroll', updateContactPosition)
  //   }

  //   return () => {
  //     window.removeEventListener('scroll', updateContactPosition)
  //   }
  // }, [isContactVisible])

  useEffect(() => {
    let observerService

    if (serviceContainerRef.current) {
      observerService = new IntersectionObserver(
        ([entry]) => {
          setIsServiceVisible(entry.isIntersecting)
        }
        // { threshold: 0.5 } // 1.0 indicates when 100% of the target is visible
      )

      observerService.observe(serviceContainerRef.current)
    }

    return () => {
      observerService?.disconnect()
    }
  }, [serviceContainerRef])

  useEffect(() => {
    let observerAbout

    if (aboutContainerRef.current) {
      observerAbout = new IntersectionObserver(([entry]) => {
        setIsAboutVisible(entry.isIntersecting)
      })

      observerAbout.observe(aboutContainerRef.current)
    }

    return () => {
      observerAbout?.disconnect()
    }
  }, [aboutContainerRef])

  useEffect(() => {
    let observerToolset

    if (toolsetContainerRef.current) {
      observerToolset = new IntersectionObserver(([entry]) => {
        setIsToolsetVisible(entry.isIntersecting)
      })

      observerToolset.observe(toolsetContainerRef.current)
    }

    return () => {
      observerToolset?.disconnect()
    }
  }, [toolsetContainerRef])

  const [modelRotation, setModelRotation] = useState(0)

  const checkModelRotation = (rotation) => {
    setModelRotation(rotation)
  }

  const handleDummyHeadingRef = (dummyRef) => {
    setDummyHeadingRef(dummyRef)
  }

  const { getProjects } = useContentful()

  const [projectsArray, setProjectsArray] = useState([])

  useEffect(() => {
    getProjects().then((response) => {
      setProjectsArray(response.items)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add dependancy for viewport resize
  useEffect(() => {
    document.body.style.height = `${
      scrollContainerRef.current.getBoundingClientRect().height
    }px`
  }, [scrollContainerRef, projectsArray])

  useEffect(() => {
    requestAnimationFrame(() => skewScrolling())
  }, [])

  const data = {
    ease: 0.1,
    current: 0,
    previous: 0,
    rounded: 0,
  }

  // Scrolling
  const skewScrolling = () => {
    //Set Current to the scroll position amount
    data.current = window.scrollY
    // Set Previous to the scroll previous position
    data.previous += (data.current - data.previous) * data.ease
    // Set rounded to
    data.rounded = Math.round(data.previous * 100) / 100

    // Difference between
    const difference = data.current - data.rounded
    const acceleration = difference / window.innerWidth
    const velocity = +acceleration
    const skew = velocity * 7.5

    //Assign skew and smooth scrolling to the scroll container
    scrollContainerRef.current.style.transform = `translateY(-${data.rounded}px)`

    //loop vai raf
    requestAnimationFrame(() => skewScrolling())
  }

  useEffect(() => {
    // console.log('app rerender')
  })

  const [isSpaceAnimationComplete, setIsSpaceAnimationComplete] =
    useState(false)

  const toggleSpaceAnimationComplete = (value) => {
    setIsSpaceAnimationComplete(value)
  }

  const { bloomTheme } = useSelector((state) => state.threeStore)

  const [someRef, setSomeRef] = useState(null)
  // const [view1, setView1] = useState(null)

  const [fullView, setFullView] = useState(false)

  const [refArray, setRefArray] = useState([])

  const [visibleArray, setVisibleArray] = useState([])

  const [fullViewArray, setFullViewArray] = useState([])

  const arrayOfRefs = useRef([])

  useEffect(() => {
    if (!projectsArray.length) return
  }, [projectsArray])

  const addToRefs = (el) => {
    if (
      el &&
      !refArray.includes({ current: el }) &&
      refArray.length < projectsArray.length
    ) {
      setRefArray((prevRefs) => [...prevRefs, { current: el }])
    }
  }

  useEffect(() => {
    if (refArray.length === projectsArray.length && refArray.length) {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      refArray.map((ref, index) => {
        // vis
      })
    }
  }, [refArray, projectsArray])

  const setIntersectiom = (index, value) => {
    const tempArray = [...visibleArray]

    tempArray[index] = value

    setVisibleArray(tempArray)
  }

  const changeFullViewArray = (index, value) => {
    const tempArray = [...fullViewArray]

    tempArray[index] = value

    setFullViewArray(tempArray)
  }

  return (
    <>
      {/* <Stats /> */}

      <main
        // id="main"
        ref={mainRef}
        // ref={ref}
        // className={`main relative w-full min-h-screen h-[10000px] overflow-hidden`}
        className={`main fixed top-0 left-0 w-full h-full overflow-hidden z-[2000]`}
      >
        <div
          id="main"
          ref={scrollContainerRef}
          className="scroll "
        >
          <div
            ref={heroContainerRef}
            className="min-h-screen mb-[100vh] bg-red-700/0 "
          >
            {/* <Hero /> */}
          </div>

          <div className="w-full h-[10000px]"></div>

          {/* <div
            ref={projectsContainerRef}
            id="projects"
            className="min-h-screen mb-[100vh] bg-red-700/0 mt-[100vh] relative"
          >
            <Projects
              projectsArray={projectsArray}
              // refsArray={refsArray}
              arrayOfRefs={arrayOfRefs}
              addToRefs={addToRefs}
              setIntersectiom={setIntersectiom}
              changeFullViewArray={changeFullViewArray}
            />
          </div>

          <div
            ref={aboutContainerRef}
            className="min-h-screen mb-[100vh] bg-red-700/0 "
          >
            <About sectionTitle={'backend'} />
          </div>

          <div
            ref={toolsetContainerRef}
            className="min-h-screen mb-[100vh] bg-red-700/0 py-[100vh]"
          >
            <Toolset sectionTitle={'frontend'} />
          </div>

          <div
            ref={serviceContainerRef}
            className="min-h-screen my-[100vh] bg-red-700/0 "
          >
            <Services sectionTitle={'services'} />
          </div>

          <div
            ref={contactContainerRef}
            className=" min-h-screen bg-red-700/0 "
          >
            <Contact setDummyHeadingRef={handleDummyHeadingRef} />
          </div> */}

          {/* <Footer /> */}
        </div>
      </main>
      {/* <Navbar contactRef={contactContainerRef} /> */}
      {/* <BackgroundCanvas
        isHeroVisible={isHeroVisible}
        isContactVisible={isContactVisible}
        isServiceVisible={isServiceVisible}
        isAboutVisible={isAboutVisible}
        isToolsetVisible={isToolsetVisible}
        aboutContainerRef={aboutContainerRef}
        checkModelRotation={checkModelRotation}
        dimBackground={dimBackground}
        dummyHeadingRef={dummyHeadingRef}
        contactContainerRef={contactContainerRef}
        view1={projectsContainerRef}
        eventSource={mainRef}
        track1={heroContainerRef}
      /> */}

      {/* <DynamicCanvas
        eventSource={mainRef}
        changeFullViewArray={changeFullViewArray}
        fullViewArray={fullViewArray}
        projectsArray={projectsArray}
        refArray={refArray}
        visibleArray={visibleArray}
      /> */}

      <div className="w-full h-screen absolute top-0 z-[100000000]">
        <HeroCanvas
          // mousePosition={mousePosition}
          bloomTheme={bloomTheme}
        />
      </div>

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
}

export default App
