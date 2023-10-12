import { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import SingleProjectDetails from './SingleProjectDetails'
import SingleProjectsLinks from './SingleProjectsLinks'

const SingleProject = ({
  leftSide,
  project,
  index,
  addToRefs,
  setIntersectiom,
  changeFullViewArray,
}) => {
  const [fullView, setFullView] = useState(false)
  const [containerRef, inView] = useInView({
    /* Optional options */
    threshold: 0,
  })

  const toggleFullView = () => {
    setFullView((v) => !v)
  }

  useEffect(() => {
    changeFullViewArray(index, fullView)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullView])

  useEffect(() => {
    setIntersectiom(index, inView)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return (
    <div
      ref={addToRefs}
      className="w-full min-h-screen mx-auto relative mb-40 z-[2000]"
      style={{ position: 'relative' }}
    >
      <div
        ref={containerRef}
        className="absolute inset-0 "
      />
      <div
        className={`hidden xl:block w-1/2 h-full z-[-10]  absolute ${
          leftSide ? 'right-0' : 'left-0'
        }`}
        onClick={() => {
          if (!fullView) toggleFullView()
        }}
      />
      <SingleProjectDetails
        leftSide={leftSide}
        fullView={fullView}
        toggleFullView={toggleFullView}
        project={project}
      />

      <SingleProjectsLinks
        leftSide={leftSide}
        fullView={fullView}
        url={project.url}
        githubLink={project.githubLink}
      />
    </div>
  )
}

export default SingleProject
