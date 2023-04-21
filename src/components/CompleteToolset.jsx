import React from 'react'
import { ReactComponent as ReactSVG } from '../assets/tech/svg/react-logo.svg'
import { ReactComponent as NodeSVG } from '../assets/tech/svg/nodejs-logo.svg'
import { ReactComponent as LaravelSVG } from '../assets/tech/svg/laravel-logo.svg'
import { ReactComponent as ExpressSVG } from '../assets/tech/svg/expressjs-logo.svg'
import { ReactComponent as MongoSVG } from '../assets/tech/svg/mongoDB-logo.svg'
import { ReactComponent as MaterialSVG } from '../assets/tech/svg/materialUI-logo.svg'
import { ReactComponent as VueSVG } from '../assets/tech/svg/vuejs-logo.svg'
import { ReactComponent as MysqlSVG } from '../assets/tech/svg/mysql-logo.svg'
import { ReactComponent as TailwindSVG } from '../assets/tech/svg/tailwindcss-logo.svg'
import { ReactComponent as DockerSVG } from '../assets/tech/svg/docker-logo.svg'
import { ReactComponent as AwsSVG } from '../assets/tech/svg/aws-logo.svg'
import { ReactComponent as GcpSVG } from '../assets/tech/svg/gcp-logo.svg'

import GeneralToolset from './GeneralToolset'

const CompleteToolset = () => {
  const toolsArrayFE = [
    {
      id: 1,
      title: 'React',
      description:
        'Complex and interactive dashboard with indepth Redux Toolkit and React Router usage.',
      logo: (
        <ReactSVG
          style={{ transform: 'translateZ(0px)' }}
          className="absolute opacity-100 w-16 h-16 bottom-5 right-10 "
        />
      ),
    },
    {
      id: 7,
      title: 'Vue.js',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <VueSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 9,
      title: 'TailwindCSS',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <TailwindSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 6,
      title: 'MaterialUI',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <MaterialSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
  ]

  const toolsArrayBE = [
    {
      id: 2,
      title: 'Node.js',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <NodeSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 4,
      title: 'Express.js',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <ExpressSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 5,
      title: 'MongoDB',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <MongoSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 3,
      title: 'Laravel',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <LaravelSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 8,
      title: 'MySQL',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <MysqlSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
  ]

  const toolsArrayDO = [
    {
      id: 10,
      title: 'Docker',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <DockerSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 11,
      title: 'AWS',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <AwsSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
    {
      id: 12,
      title: 'GCP',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <GcpSVG className="absolute opacity-100 w-16 h-16 bottom-5 right-10 " />
      ),
    },
  ]

  return (
    <section
      id="toolset"
      className="mx-auto py-12 "
    >
      {/* <h2 className="text-4xl font-bold mb-8">
        <code className="text-[#306ee8]">&lt;Toolset&gt;</code>
      </h2> */}

      <div className="mb-5">
        <GeneralToolset
          toolsArray={toolsArrayFE}
          sectionTitle="frontend"
        />
      </div>

      <div className="mb-5">
        <GeneralToolset
          toolsArray={toolsArrayBE}
          sectionTitle="backend"
        />
      </div>

      <div className="mb-[500px]">
        <GeneralToolset
          toolsArray={toolsArrayDO}
          sectionTitle="devops"
        />
      </div>

      {/* <FrontendToolset toolsArray={toolsArrayFE} /> */}
      {/* 
      <BackendToolset toolsArray={toolsArrayBE} />

      <DevOpsToolset toolsArray={toolsArrayDO} /> */}

      {/* <h2 className="text-4xl font-bold mt-8">
        <code className="text-[#306ee8]">&lt;/Toolset&gt;</code>
      </h2> */}
    </section>
  )
}

export default CompleteToolset
