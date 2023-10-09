import React from 'react'

const HeroCatchPhrase = ({ extraClasses }) => {
  return (
    <h1
      className={` text-[36px] sm:text-[60px] lg:text-[72px] font-semibold leading-tight mb-8 ${extraClasses} `}
    >
      <div className="hidden sm:block">
        <div className="w-fit bg-clip-text text-transparent bg-gradient-to-r from-customViolet to-customBlue something">
          Im
          <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px]"></span>
          gine. Build.
        </div>
        <div className=" bg-clip-text text-transparent bg-gradient-to-r from-customBlue  to-customAqua inline something ">
          Ship.
        </div>
      </div>
      <div className="sm:hidden bg-clip-text text-transparent bg-gradient-to-r from-customViolet via-customBlue to-customAqua something">
        Im
        <span className="icon-trademark text-[22px] sm:text-[35px] lg:text-[42px] "></span>
        gine. Build. Ship.
      </div>
    </h1>
  )
}

export default HeroCatchPhrase
