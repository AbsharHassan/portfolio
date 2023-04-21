import { useEffect, useRef } from 'react'

const TextTo2DWord = ({ word, sphereDomX, sphereDomY, isMouseInside }) => {
  let wordContainerRef = useRef(null)

  useEffect(() => {
    if ((wordContainerRef.current, sphereDomX, sphereDomY)) {
      if (isMouseInside) {
        const containerRect = wordContainerRef.current.getBoundingClientRect()
        const isInside =
          sphereDomX > containerRect.left &&
          sphereDomX < containerRect.right &&
          sphereDomY > containerRect.top &&
          sphereDomY < containerRect.bottom

        if (isInside) {
          wordContainerRef.current.classList.add('broken')

          let randomIntX = Math.floor(Math.random() * 61) - 30
          let randomIntY = Math.floor(Math.random() * 61) - 30
          // let randomIntX =
          //   (Math.floor(Math.random() * 11) + 30) * (Math.random() < 0.5 ? -1 : 1)
          // let randomIntY =
          //   (Math.floor(Math.random() * 11) + 30) * (Math.random() < 0.5 ? -1 : 1)

          wordContainerRef.current.style.transform = `translate(${randomIntX}px, ${randomIntY}px)`
        }
      } else {
        wordContainerRef.current.classList.remove('broken')
        wordContainerRef.current.style.transform = `translate(0px, 0px)`
      }
    }
  }, [sphereDomX, sphereDomY, isMouseInside])

  return (
    <span
      className="mr-1 card-text transition-transform duration-300"
      ref={wordContainerRef}
      data-name={word}
    >
      {word}{' '}
    </span>
  )
}

export default TextTo2DWord
