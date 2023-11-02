import { useTyping } from '../utils/useTyping'

const AlternatingText = ({ singleWord, wordsObjectArray }) => {
  const { currentWord, seletectedIndex, phase } = useTyping(wordsObjectArray)

  return (
    <span
      className={`whitespace-nowrap bg-clip-text text-transparent font-semibold ${
        seletectedIndex % 2 === 0
          ? 'bg-gradient-to-r from-customViolet to-customBlue'
          : 'bg-gradient-to-r from-customBlue  to-customAqua'
      } blinking-cursor ${phase === 'idle' ? 'blinking' : ''}`}
      style={{
        '--cursor-color': seletectedIndex % 2 === 0 ? '#5a82f9' : '#09a9b8',
      }}
    >
      {wordsObjectArray.length !== 0 ? currentWord : singleWord}
    </span>
  )
}

export default AlternatingText
