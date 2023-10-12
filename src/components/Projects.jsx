import { useEffect, useState } from 'react'
import useContentful from '../utils/useContentful'
import SingleProject from './SingleProject'
import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'
import LaptopModel from './LaptopModel'
import PhoneModel from './PhoneModel'

const Projects = ({
  projectsArray,
  refsArray,
  arrayOfRefs,
  addToRefs,
  setIntersectiom,
  changeFullViewArray,
}) => {
  // const projectsArray = [
  //   {
  //     model: 'laptop',
  //     url: 'https://flood-tracker.onrender.com/',
  //     githubLink: 'https://github.com/',
  //     title: (
  //       <>
  //         Flood <span className="flood-analyzer-text-gradient">Tracker</span>
  //       </>
  //     ),
  //     descriptionIntro:
  //       'Lorem ipsum dolor sit, amet consectetur adipisicing elit.Quis, asperiores. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis, asperiores.',
  //     descriptionMain:
  //       'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, soluta voluptatum? Suscipit beatae nulla placeat fugit officiis aperiam. Consectetur, quod. Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam, soluta voluptatum? Suscipit beatae nulla placeat fugit officiis aperiam. Consectetur, quod.',
  //     techList: [
  //       'Preact',
  //       'WebSockets',
  //       'WebTorrent',
  //       'Express',
  //       'Docker',
  //       'DigitalOcean',
  //     ],
  //     //maybe add color scheme as well
  //   },
  //   // {
  //   //   model: 'laptop',
  //   //   url: 'http://simsdockerapp-env-1.eba-atjdtam3.ap-northeast-1.elasticbeanstalk.com/login',
  //   // },
  //   // { model: 'phone', url: null },
  //   // { model: 'laptop', url: null },
  // ]

  // const { getProjects } = useContentful()

  // const [projectsArray, setProjectsArray] = useState([])

  // useEffect(() => {
  //   getProjects().then((response) => {
  //     setProjectsArray(response.items)
  //   })
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return (
    <div
      className="w-full h-full z-[2000] relative"
      id="someProject"
    >
      <h2 className="mb-32 text-7xl text-center font-bold text-slate-300">
        Flagship Projects
      </h2>
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
