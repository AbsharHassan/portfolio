import { Canvas } from '@react-three/fiber'
import { View } from '@react-three/drei'

import LaptopModel from './LaptopModel'
import PhoneModel from './PhoneModel'
import ParticleModelMesh from './ParticleModelMesh'

const DynamicCanvas = ({
  eventSource,
  visibleArray,
  projectsArray,
  refArray,
  fullViewArray,
  changeFullViewArray,
}) => {
  return (
    <div className="w-full h-screen fixed inset-0 z-[-50]">
      <Canvas
        className="bg-blue-700/0"
        eventSource={eventSource}
        camera={{
          fov: 20,
          position: [0, 0, 4],
        }}
        // frameloop={visibleArray.includes(true) ? 'always' : 'never'}
      >
        {/* <View
          index={1}
          track={eventSource}
        >
          <ParticleModelMesh
            // modelShouldRotate={modelShouldRotate}
            // isParticleModelVisible={isHeroVisible}
            // isHeroVisible={isHeroVisible}
            modelShouldRotate={true}
            // isServiceVisible={isServiceVisible}
            checkModelRotation={() => {
              console.log('hello pain')
            }}
          />
        </View> */}
        {projectsArray.map((project, index) => (
          <View
            key={index}
            index={index + 2}
            track={refArray[index]}
          >
            {project.fields.model === 'laptop' ? (
              <>
                <LaptopModel
                  inView={visibleArray[index]}
                  fullView={fullViewArray[index]}
                  leftSide={index % 2 === 0}
                  index={index}
                  changeFullViewArray={changeFullViewArray}
                  // setFullView={setFullView}
                  url={project.fields.url}
                  // inView={inView}
                />
              </>
            ) : (
              <>
                <PhoneModel
                  fullView={fullViewArray[index]}
                  inView={visibleArray[index]}
                />
              </>
            )}
          </View>
        ))}
      </Canvas>
    </div>
  )
}

export default DynamicCanvas
