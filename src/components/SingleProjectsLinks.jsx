import { ReactComponent as GithubSVG } from '../assets/icons/github.svg'
import { ReactComponent as ExternalLinkSVG } from '../assets/icons/external-link.svg'

const SingleProjectsLinks = ({ leftSide, fullView, url, githubLink }) => {
  return (
    <div
      className={`hidden xl:block absolute ${
        leftSide ? 'top-14 right-20' : 'top-14 left-20'
      } flex items-center justify-between space-x-6 z-10 text-[#ccd6f6] ${
        fullView ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-500`}
    >
      <a
        href={githubLink}
        target="_blank"
        rel="noreferrer"
      >
        <GithubSVG
          className={`w-5 h-5 cursor-pointer hover:text-[#5686f5] transition-colors duration-300 opacity-100`}
        />
      </a>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
      >
        <ExternalLinkSVG className="w-5 h-5 cursor-pointer hover:text-[#5686f5] transition-colors duration-300 mr-6 opacity-100 " />
      </a>
    </div>
  )
}

export default SingleProjectsLinks
