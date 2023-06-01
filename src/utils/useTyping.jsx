import { useEffect, useState } from 'react'

const pauseInterval = 2000
const typingInterval = 100
const deletingInterval = 50

export const useTyping = (wordArray) => {
  const [seletectedIndex, setSelectedIndex] = useState(0)
  const [currentWord, setCurrentWord] = useState('')
  const [phase, setPhase] = useState('typing')

  useEffect(() => {
    switch (phase) {
      case 'typing': {
        const wordDisplayed = wordArray[seletectedIndex].text.slice(
          0,
          currentWord.length + 1
        )

        if (wordDisplayed === currentWord) {
          setPhase('idle')
        }

        const timeout = setTimeout(() => {
          setCurrentWord(wordDisplayed)
        }, typingInterval)

        return () => clearTimeout(timeout)
      }
      case 'deleting': {
        if (!currentWord) {
          const nextIndex = seletectedIndex + 1
          console.log(seletectedIndex[nextIndex])
          setSelectedIndex(wordArray[nextIndex] ? nextIndex : 0)
          setPhase('typing')
          return
        }
        const wordDisplayed = wordArray[seletectedIndex].text.slice(
          0,
          currentWord.length - 1
        )

        const timeout = setTimeout(() => {
          setCurrentWord(wordDisplayed)
        }, deletingInterval)

        return () => clearTimeout(timeout)
      }
      case 'idle': {
        const timeout = setTimeout(() => {
          setPhase('deleting')
        }, pauseInterval)

        return () => clearTimeout(timeout)
      }

      default: {
        const timeout = setTimeout(() => {
          setPhase('deleting')
        }, pauseInterval)

        return () => clearTimeout(timeout)
      }
    }
  }, [currentWord, wordArray, phase, seletectedIndex])

  return { currentWord, seletectedIndex }
}
