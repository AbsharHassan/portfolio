const NeonButton = ({
  children,
  type,
  colorNeon,
  shadow,
  extraClasses,
  handleClick,
}) => {
  return (
    <button
      type={type ? type : 'button'}
      className={`neon-button text-[#0466c8] ${extraClasses}`}
      style={{
        '--clr-neon': colorNeon ? colorNeon : '#3667c4',
        '--opacity-before': shadow ? 0.5 : 0,
        '--opacity-shadow': shadow ? 1 : 0,
      }}
      onClick={handleClick}
    >
      {children}
    </button>
  )
}

export default NeonButton
