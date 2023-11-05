const Footer = () => {
  return (
    <div className="z-[100] text-sm text-slate-500 bg-[#111018] py-7 w-full md:px-14 lg:px-32 flex flex-col md:flex-row space-y-5 md:space-y-0 items-center justify-between space-x-5 border-t border-slate-800 ">
      <div>© 2023 Abshar Hassan</div>
      <div>
        Built with <CustomLink href={'https://react.dev/'}>React</CustomLink>{' '}
        and{' '}
        <CustomLink href={'https://www.contentful.com/'}>Contentful</CustomLink>
      </div>
      <div>
        Design inspired by:{' '}
        <CustomLink href={'https://linear.app/'}>Linear</CustomLink>,{' '}
        <CustomLink href={'https://homunculus.jp/'}>Homunculus</CustomLink>
      </div>
    </div>
  )
}

export default Footer

const CustomLink = ({ href, children }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="underline underline-offset-2 transition-colors duration-300 hover:text-slate-300"
    >
      {children}
    </a>
  )
}
