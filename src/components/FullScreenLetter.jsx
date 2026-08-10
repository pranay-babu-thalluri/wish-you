import { memo, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const paragraphs = [
  'My dearest Nikitha,',
  'Today is not just another day. It is the day someone incredibly special came into this world.',
  'You have a beautiful way of making ordinary moments feel meaningful. Your smile brings warmth, your presence brings peace, and even the smallest conversations with you become memories worth keeping.',
  'On your birthday, I hope life gives you the same happiness that you bring into the lives of the people around you.',
  'May this year bring you calm days, exciting adventures, genuine laughter, beautiful memories and all the love you truly deserve.',
  'Never forget how special you are.',
  'Happy Birthday, Nikitha.',
  'May your heart always stay light, your dreams keep growing, and your smile never lose its magic.',
  'With all my heart, today and always.',
]

function useLetterWriter(reduced) {
  const [position, setPosition] = useState(() => reduced
    ? { paragraphIndex: paragraphs.length - 1, characterIndex: paragraphs.at(-1).length }
    : { paragraphIndex: 0, characterIndex: 0 })
  const [complete, setComplete] = useState(reduced)
  const timerRef = useRef(null)

  useEffect(() => {
    if (reduced) {
      timerRef.current = window.setTimeout(() => {
        setPosition({ paragraphIndex: paragraphs.length - 1, characterIndex: paragraphs.at(-1).length })
        setComplete(true)
      }, 20)
      return () => window.clearTimeout(timerRef.current)
    }

    if (complete) return undefined

    const paragraph = paragraphs[position.paragraphIndex]
    if (position.characterIndex >= paragraph.length) {
      timerRef.current = window.setTimeout(() => {
        if (position.paragraphIndex === paragraphs.length - 1) {
          setComplete(true)
          return
        }
        setPosition({ paragraphIndex: position.paragraphIndex + 1, characterIndex: 0 })
      }, position.paragraphIndex === paragraphs.length - 1 ? 180 : 440)
      return () => window.clearTimeout(timerRef.current)
    }

    const character = paragraph[position.characterIndex]
    const step = /[.!?,;:]/.test(character) ? 1 : 2
    const nextCharacterIndex = Math.min(position.characterIndex + step, paragraph.length)
    const delay = position.characterIndex === 0 ? 340 : /[.!?]/.test(character) ? 165 : /[,;:]/.test(character) ? 70 : 42

    timerRef.current = window.setTimeout(() => {
      setPosition({ paragraphIndex: position.paragraphIndex, characterIndex: nextCharacterIndex })
    }, delay)
    return () => window.clearTimeout(timerRef.current)
  }, [complete, position, reduced])

  const displayed = useMemo(() => paragraphs.map((paragraph, index) => {
    if (complete || index < position.paragraphIndex) return paragraph
    if (index === position.paragraphIndex) return paragraph.slice(0, position.characterIndex)
    return ''
  }), [complete, position])

  return { displayed, complete }
}

const LetterParagraph = memo(function LetterParagraph({ index, text, active, reduced }) {
  const className = `${index === 0 ? 'letter-greeting' : ''} ${index === paragraphs.length - 1 ? 'letter-signature' : ''}`
  return (
    <motion.p className={className} initial={reduced ? { opacity: 0, y: 7 } : false} animate={reduced ? { opacity: 1, y: 0 } : undefined} transition={{ delay: index * 0.09, duration: 0.28 }}>
      {text}{active && <span className="writing-caret" aria-hidden="true" />}
    </motion.p>
  )
})

export default function FullScreenLetter({ onShowBirthday }) {
  const reduced = useReducedMotion()
  const { displayed, complete } = useLetterWriter(reduced)
  const activeParagraph = useMemo(() => {
    const index = displayed.findIndex((text, paragraphIndex) => text.length < paragraphs[paragraphIndex].length)
    return index === -1 ? paragraphs.length - 1 : index
  }, [displayed])

  return (
    <motion.section className="letter-experience" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
      <motion.article className="letter-paper" initial={{ y: reduced ? 22 : 100, scale: reduced ? 0.98 : 0.82, opacity: 0 }} animate={{ y: 0, scale: 1, opacity: 1 }} transition={{ duration: reduced ? 0.3 : 0.9, ease: [0.16, 1, 0.3, 1] }}>
        <span className="paper-flower paper-flower-one" aria-hidden="true"><i /><i /><i /><i /><b /></span>
        <span className="paper-flower paper-flower-two" aria-hidden="true"><i /><i /><i /><i /><b /></span>
        <div className="letter-lines" aria-hidden="true" />
        <div className="letter-content">
          <div className="letter-layout-reserver" aria-hidden="true">
            {paragraphs.map((text, index) => <p key={index} className={`${index === 0 ? 'letter-greeting' : ''} ${index === paragraphs.length - 1 ? 'letter-signature' : ''}`}>{text}</p>)}
          </div>
          <div className="letter-writing-layer">
            {displayed.slice(0, activeParagraph + 1).map((text, index) => (
              <LetterParagraph key={index} index={index} text={text} active={!complete && index === activeParagraph} reduced={reduced} />
            ))}
          </div>
        </div>

        <AnimatePresence>
          {complete && (
            <motion.footer className="letter-finale" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <span className="drawn-heart" aria-hidden="true">♡</span>
              <span className="floral-underline" aria-hidden="true"><i /><b /><i /></span>
              <div className="letter-actions">
                <button type="button" className="birthday-return-button" onClick={onShowBirthday}>Wish <span aria-hidden="true">→</span></button>
              </div>
            </motion.footer>
          )}
        </AnimatePresence>
      </motion.article>
    </motion.section>
  )
}
