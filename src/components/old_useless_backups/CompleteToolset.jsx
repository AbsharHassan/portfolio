// import { Vector3 } from 'three'
// import { ReactComponent as ReactSVG } from '../assets/tech/svg/react-logo.svg'
// import ReactPNG from '../assets/tech/png/react.png'
// import { ReactComponent as NodeSVG } from '../assets/tech/svg/nodejs-logo.svg'
// import NodePNG from '../assets/tech/png/nodejs.png'
// import { ReactComponent as LaravelSVG } from '../assets/tech/svg/laravel-logo.svg'
// import LaravelPNG from '../assets/tech/png/laravel-white.png'
// import { ReactComponent as ExpressSVG } from '../assets/tech/svg/expressjs-logo.svg'
// import ExpressPNG from '../assets/tech/png/expressjs.png'
// import { ReactComponent as MongoSVG } from '../assets/tech/svg/mongoDB-logo.svg'
// import MongoPNG from '../assets/tech/png/mongodb.png'
// import { ReactComponent as MaterialSVG } from '../assets/tech/svg/materialUI-logo.svg'
// import MaterialPNG from '../assets/tech/png/materialUI.png'
// import { ReactComponent as VueSVG } from '../assets/tech/svg/vuejs-logo.svg'
// import VuePNG from '../assets/tech/png/vue.png'
// import { ReactComponent as MysqlSVG } from '../assets/tech/svg/mysql-logo.svg'
// import MysqlPNG from '../assets/tech/png/mysql.png'
// import { ReactComponent as TailwindSVG } from '../assets/tech/svg/tailwindcss-logo.svg'
// import TailwindPNG from '../assets/tech/png/tailwindCSS.png'
// import { ReactComponent as DockerSVG } from '../assets/tech/svg/docker-logo.svg'
// import DockerPNG from '../assets/tech/png/docker.png'
// import { ReactComponent as AwsSVG } from '../assets/tech/svg/aws-logo.svg'
// import AwsPNG from '../assets/tech/png/aws.png'
// import { ReactComponent as GcpSVG } from '../assets/tech/svg/gcp-logo.svg'
// import GcpPNG from '../assets/tech/png/gcp-grey.png'
// import { ReactComponent as ThreeSVG } from '../assets/tech/svg/threejs-logo.svg'
// import ThreePNG from '../assets/tech/png/threejs.png'

// import GeneralToolset from '../Toolset'

// const CompleteToolset = () => {
//   const toolsArrayFE = [
//     {
//       id: 1,
//       title: 'React',
//       description:
//         'Complex and interactive dashboard with indepth Redux Toolkit and React Router usage.',
//       logo: (
//         <div className="flex relative ">
//           <ReactSVG
//             style={{ transform: 'translateZ(0px)' }}
//             className=" opacity-70 w-12 h-12 "
//           />
//           {/* <ReactSVG
//             style={{ transform: 'translateZ(0px)' }}
//             className=" opacity-70 w-12 h-12 -mr-8"
//           />
//           <TailwindSVG className=" opacity-50 w-12 h-12 " /> */}
//         </div>
//       ),
//       png: ReactPNG,
//       scale: new Vector3(30, 30, 30),
//     },
//     {
//       id: 2,
//       title: 'Vue.js',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <VueSVG className=" opacity-70 w-12 h-12  " />,
//       png: VuePNG,
//       scale: new Vector3(25, 25, 25),
//     },
//     {
//       id: 3,
//       title: 'TailwindCSS',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <TailwindSVG className=" opacity-70 w-12 h-12  " />,
//       png: TailwindPNG,
//       scale: new Vector3(40, 30, 40),
//     },
//     {
//       id: 4,
//       title: 'MaterialUI',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <MaterialSVG className=" opacity-70 w-12 h-12  " />,
//       png: MaterialPNG,
//       scale: new Vector3(32.5, 25, 25),
//     },
//     {
//       id: 5,
//       title: 'Three.js',
//       description:
//         'Mastered with blender and cannon-es to create epic and interactable 3D scenes.',
//       logo: <ThreeSVG className=" opacity-70 w-12 h-12  " />,
//       png: ThreePNG,
//       scale: new Vector3(40, 40, 40),
//     },
//   ]

//   const toolsArrayBE = [
//     {
//       id: 6,
//       title: 'Node.js',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <NodeSVG className=" opacity-70 w-12 h-12  " />,
//       png: NodePNG,
//       scale: new Vector3(35, 40, 35),
//     },
//     {
//       id: 7,
//       title: 'Express.js',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <ExpressSVG className=" opacity-70 w-12 h-12  " />,
//       png: ExpressPNG,
//       scale: new Vector3(35, 35, 35),
//     },
//     {
//       id: 8,
//       title: 'MongoDB',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <MongoSVG className=" opacity-70 w-12 h-12  " />,
//       png: MongoPNG,
//       scale: new Vector3(20, 40, 40),
//     },
//     {
//       id: 9,
//       title: 'Laravel',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <LaravelSVG className=" opacity-70 w-12 h-12  " />,
//       png: LaravelPNG,
//       scale: new Vector3(35, 35, 35),
//     },
//     {
//       id: 10,
//       title: 'MySQL',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <MysqlSVG className=" opacity-70 w-12 h-12  " />,
//       png: MysqlPNG,
//       scale: new Vector3(32.5, 32.5, 32.5),
//     },
//   ]

//   const toolsArrayDO = [
//     {
//       id: 11,
//       title: 'Docker',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <DockerSVG className=" opacity-70 w-12 h-12  " />,
//       png: DockerPNG,
//       scale: new Vector3(37.5, 37.5, 37.5),
//     },
//     {
//       id: 12,
//       title: 'AWS',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <AwsSVG className=" opacity-70 w-12 h-12  " />,
//       png: AwsPNG,
//       scale: new Vector3(35, 22.5, 30),
//     },
//     {
//       id: 13,
//       title: 'GCP',
//       description:
//         'Railway scales apps to meet user demand, automagically, based on load.',
//       logo: <GcpSVG className=" opacity-70 w-12 h-12  " />,
//       png: GcpPNG,
//       scale: new Vector3(30, 27, 30),
//     },
//   ]

//   const completeArray = [...toolsArrayFE, ...toolsArrayBE, ...toolsArrayDO]

//   return (
//     <section
//       className="mx-auto py-12 mt-96 h-[1000px]"
//     >
//       {/* <h2 className="text-4xl font-bold mb-8">
//         <code className="text-[#306ee8]">&lt;Toolset&gt;</code>
//       </h2> */}

//       <GeneralToolset
//         // toolsArray={toolsArrayFE}
//         toolsArray={completeArray}
//         sectionTitle="frontend"
//       />

//       {/* <div className="">
//         <GeneralToolset
//           toolsArray={toolsArrayBE}
//           sectionTitle="backend"
//         />
//       </div>

//       <div className="mb-[1000px] ">
//         <GeneralToolset
//           toolsArray={toolsArrayDO}
//           sectionTitle="devops"
//         />
//       </div> */}

//       {/* <FrontendToolset toolsArray={toolsArrayFE} /> */}
//       {/*
//       <BackendToolset toolsArray={toolsArrayBE} />

//       <DevOpsToolset toolsArray={toolsArrayDO} /> */}

//       {/* <h2 className="text-4xl font-bold mt-8">
//         <code className="text-[#306ee8]">&lt;/Toolset&gt;</code>
//       </h2> */}
//     </section>
//   )
// }

// export default CompleteToolset
