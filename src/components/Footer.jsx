const Footer = () => {
  return (
    <div className="z-[100] text-sm text-slate-500 bg-[#111018] py-7 w-full px-32 flex items-center justify-between border-t border-slate-800 ">
      <div>© 2023 Abshar Hassan</div>
      <div>
        Design inspired by:{' '}
        <a
          href="https://linear.app/"
          target="_blank"
          rel="noreferrer"
        >
          Linear
        </a>
        ,{' '}
        <a
          href="https://homunculus.jp/"
          target="_blank"
          rel="noreferrer"
        >
          Homunculus
        </a>
      </div>
    </div>
  )
}

export default Footer
