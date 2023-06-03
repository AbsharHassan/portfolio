import { useTyping } from '../utils/useTyping'

const AlternatingText = ({ wordsObjectArray }) => {
  const { currentWord, seletectedIndex, phase } = useTyping(wordsObjectArray)

  return (
    <span
      className={`whitespace-nowrap bg-clip-text text-transparent font-semibold ${
        wordsObjectArray[seletectedIndex].classes
      } blinking-cursor ${phase === 'idle' ? 'blinking' : ''}`}
      style={{
        '--cursor-color': wordsObjectArray[seletectedIndex].cursor,
      }}
    >
      {currentWord}
    </span>
  )
}

export default AlternatingText
