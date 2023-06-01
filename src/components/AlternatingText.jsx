import React, { useRef } from 'react'
import { useTyping } from '../utils/useTyping'

const AlternatingText = ({ wordsObjectArray }) => {
  const { currentWord, seletectedIndex } = useTyping(wordsObjectArray)

  return (
    <span
      className={`blinking-cursor bg-clip-text text-transparent font-semibold ${wordsObjectArray[seletectedIndex].classes}`}
      style={{
        '--cursor-color': wordsObjectArray[seletectedIndex].cursor,
      }}
    >
      {currentWord}
    </span>
  )
}

export default AlternatingText

//
