const ServicesCard = ({ sectionTitle, service }) => {
  return (
    <div
      // ref={cardRef}
      className={`col-span-2 w-full h-full text-3xl flex items-center justify-center  text-zinc-400 transition-all duration-1000 inset-0 mb-6 md:mb-0`}
    >
      <div
        // onMouseMove={handleMouseMove}
        className={`${sectionTitle}-card w-[338.4px] h-[193.4px] backdrop-blur-lg grid rounded-xl bg-black/0  transition-all duration-1000 relative p-6`}
      >
        <div
          className={`z-[10] w-full h-full flex flex-col items-center justify-start space-y-3`}
        >
          <h1 className="text-center text-lg font-semibold text-[#306ee8]">
            {service.title}
          </h1>
          <p className="text-sm sm:text-sm lg:text-sm flex items-center justify-center text-center">
            {service.description}
          </p>
        </div>
        <div
          className={`${sectionTitle}-card-content absolute inset-[0px] bg-black/40 overflow-hidden`}
        >
          <div className={`services-card-filter w-full h-full`} />
        </div>
      </div>
    </div>
  )
}

export default ServicesCard
