import { useEffect, useRef, useState } from 'react'
import useContentful from '../utils/useContentful'
import { useInView } from 'react-intersection-observer'
import SingleProject from './SingleProject'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import LaptopModel from './LaptopModel'
import PhoneModel from './PhoneModel'
import Lightbar from './Lightbar'

const Projects = ({
  projectsArray,
  refsArray,
  arrayOfRefs,
  addToRefs,
  setIntersectiom,
  changeFullViewArray,
}) => {
  const [containerRef, inView] = useInView({
    /* Optional options */
    threshold: 0.05,
  })

  let lightbarRef = useRef(null)

  useEffect(() => {
    lightbarRef.current?.classList.toggle('visible', inView)
  }, [inView])

  return (
    <div
      className="w-full h-full z-[2000] relative pt-14"
      id="someProject"
    >
      <div className="z-[-2000]">
        <Lightbar
          ref={lightbarRef}
          sectionTitle="frontend"
          extraClasses="z-[-2000]"
        />
      </div>
      <h2 className="mt-16 mb-32 text-3xl sm:text-5xl text-center font-bold text-slate-300 ">
        <div
          className={`transition-transform duration-1000 ${
            inView ? 'translate-y-0' : 'translate-y-20'
          }`}
        >
          Flagship Projects
        </div>
      </h2>
      <div ref={containerRef}>
        {projectsArray.map((project, index) => (
          <SingleProject
            key={index}
            leftSide={index % 2 === 0}
            project={project.fields}
            index={index}
            refsArray={refsArray}
            arrayOfRefs={arrayOfRefs}
            addToRefs={addToRefs}
            setIntersectiom={setIntersectiom}
            changeFullViewArray={changeFullViewArray}
            // project={project}
          />
        ))}
      </div>
      {/* <div className="absolute w-full h-full inset-0 z-[1000]">
          <Canvas
            className="bg-purple-400"
            eventSource={{ current: document.getElementById('someProject') }}
            camera={{
              fov: 20,
              position: [0, 0, 4],
            }}
          >
            {projectsArray.map((project, index) => (
              <View
                key={index}
                index={index + 1}
                track={{
                  current: document.getElementById(`project-${index}`)
                    ? document.getElementById(`project-${index}`)
                    : document.getElementById('projects'),
                }}
              >
                {project.fields.model === 'laptop' ? (
                  <>
                    <LaptopModel
                      // inView={el1}
                      fullView={false}
                      leftSide={index % 2 === 0}
                      // setFullView={setFullView}
                      url={project.url}
                      // inView={inView}
                    />
                  </>
                ) : (
                  <>
                    <PhoneModel fullView={false} />
                  </>
                )}
              </View>
            ))}
          </Canvas>
        </div> */}
    </div>
  )
}

export default Projects
