import React from 'react'
import { ReactComponent as ReactSVG } from '../assets/react-logo.svg'
// import { ReactComponent as ReactSVG } from '../assets/logo.svg'
import { ReactComponent as NodeSVG } from '../assets/nodejs-logo.svg'
import { ReactComponent as LaravelSVG } from '../assets/laravel-logo.svg'
import { ReactComponent as ExpressSVG } from '../assets/expressjs-logo.svg'
import { ReactComponent as MongoSVG } from '../assets/mongoDB-logo.svg'
import { ReactComponent as MaterialSVG } from '../assets/materialUI-logo.svg'
import { ReactComponent as VueSVG } from '../assets/vuejs-logo.svg'
import { ReactComponent as MysqlSVG } from '../assets/mysql-logo.svg'
import { ReactComponent as TailwindSVG } from '../assets/tailwindcss-logo.svg'
import { ReactComponent as DockerSVG } from '../assets/docker-logo.svg'
import { ReactComponent as AwsSVG } from '../assets/aws-logo.svg'
import { ReactComponent as GcpSVG } from '../assets/gcp-logo.svg'

const ToolsetA = () => {
  const toolsArray = [
    {
      id: 1,
      title: 'React',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <ReactSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 2,
      title: 'Node.js',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <NodeSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 3,
      title: 'Laravel',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <LaravelSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 4,
      title: 'Express.js',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <ExpressSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 5,
      title: 'MongoDB',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <MongoSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 6,
      title: 'MaterialUI',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <MaterialSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 7,
      title: 'Vue.js',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <VueSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 8,
      title: 'MySQL',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <MysqlSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 9,
      title: 'TailwindCSS',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <TailwindSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 10,
      title: 'Docker',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <DockerSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 11,
      title: 'AWS',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <AwsSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
    {
      id: 12,
      title: 'GCP',
      description:
        'Railway scales apps to meet user demand, automagically, based on load.',
      logo: (
        <GcpSVG className="absolute opacity-100 w-16 h-16 bottom-3 right-3 " />
      ),
    },
  ]

  return (
    <div className="max-w-7xl mx-auto ">
      <h2 className="text-4xl font-bold mb-12">
        <code className="text-[#306ee8]">&lt;Toolset&gt;</code>
      </h2>
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-8">
        {toolsArray.map((tool) => (
          <div
            className="grid grid-cols-4 flex-grow h-[195px] card-shadow rounded-xl border border-[#183367] relative p-8 text-[#a1a0ab] bg-[#111018]"
            key={tool.id}
          >
            <div className="col-span-3">
              <p className="text-[#8caef2] text-xl font-semibold mb-4">
                <code>
                  &lt;{tool.title}
                  <span className="text-lg"> /</span>&gt;
                </code>
              </p>
              <p className="text-sm font-medium">
                {/* Experience building complex applications. Indepth usage of Redux
                and Redux Toolkit. */}
                {tool.description}
              </p>
            </div>
            {/* <ReactSVG className="absolute opacity-100 w-24 h-24 -bottom-2.5 -right-2.5 " /> */}
            {tool.logo}
          </div>
        ))}
      </div>
      <h2 className="text-4xl font-bold mt-12">
        <code className="text-[#306ee8]">&lt;/Toolset&gt;</code>
      </h2>
    </div>
  )
}

export default ToolsetA
