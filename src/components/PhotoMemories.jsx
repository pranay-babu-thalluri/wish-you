import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const memories = [
  { src: '/images/Image (2).jpg', alt: 'A special memory with Nikitha', caption: 'Some moments are too beautiful to stay only in memory.', rotation: -2.2, entrance: { x: -180, y: 36 }, decoration: 'tape' },
  { src: '/images/Image (3).jpg', alt: 'Nikitha sharing a beautiful smile', caption: 'This smile has a way of making everything feel lighter.', rotation: 1.8, entrance: { x: 165, y: -28 }, decoration: 'flower' },
  { src: '/images/Image (4).jpg', alt: 'A joyful moment worth remembering with Nikitha', caption: 'One of the many moments worth keeping forever.', rotation: -1.4, entrance: { x: -125, y: -70 }, decoration: 'tape' },
  { src: '/images/Image (5).jpg', alt: 'An ordinary day made special by Nikitha', caption: 'Ordinary days feel special when they have you in them.', rotation: 2.1, entrance: { x: 145, y: 55 }, decoration: 'flower' },
  { src: '/images/Image (6).jpg', alt: 'One more special memory celebrating Nikitha', caption: 'And this is only a small part of everything that makes you special.', rotation: -1.1, entrance: { x: 0, y: -105 }, decoration: 'tape' },
]

function usePersistentCaption(text, index, active, reduced, completedCaptions) {
  const alreadyComplete = completedCaptions.current.has(index)
  const [caption, setCaption] = useState(() => ({ index, displayed: alreadyComplete ? text : '', complete: alreadyComplete }))
  const nextCaption = caption.index === index
    ? caption
    : { index, displayed: alreadyComplete ? text : '', complete: alreadyComplete }

  if (caption.index !== index) setCaption(nextCaption)

  useEffect(() => {
    if (!active || nextCaption.complete) return undefined

    if (reduced) {
      const timer = window.setTimeout(() => {
        completedCaptions.current.add(index)
        setCaption({ index, displayed: text, complete: true })
      }, 90)
      return () => window.clearTimeout(timer)
    }

    const timer = window.setTimeout(() => {
      const characterIndex = nextCaption.displayed.length + 1
      if (characterIndex >= text.length) {
        completedCaptions.current.add(index)
        setCaption({ index, displayed: text, complete: true })
        return
      }
      setCaption({ index, displayed: text.slice(0, characterIndex), complete: false })
    }, nextCaption.displayed.length === 0 ? 420 : /[.!?]/.test(nextCaption.displayed.at(-1)) ? 85 : /[,;]/.test(nextCaption.displayed.at(-1)) ? 55 : 27)
    return () => window.clearTimeout(timer)
  }, [active, completedCaptions, index, nextCaption.complete, nextCaption.displayed, reduced, text])

  return nextCaption
}

function MemoryDecoration({ type }) {
  if (type === 'flower') return <span className="memory-frame-flower" aria-hidden="true"><i /><i /><i /><i /><b /></span>
  return <span className="memory-frame-tape" aria-hidden="true" />
}

function MemoryTransitionCelebration({ direction, reduced }) {
  return (
    <motion.div className="memory-transition-celebration" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {Array.from({ length: 16 }, (_, index) => (
        <motion.i className={`memory-blossom-petal petal-${index % 3}`} key={`petal-${index}`} style={{ '--petal-left': `${4 + ((index * 23) % 92)}%`, '--petal-color': ['#f4a9bd', '#c3a7ed', '#f7c49c'][index % 3] }} initial={{ x: direction * -80, y: -40, opacity: 0, rotate: 0, scale: .45 }} animate={{ x: direction * (45 + index * 9), y: [0, 90 + (index % 5) * 35], opacity: [0, 1, 0], rotate: 180 + index * 34, scale: [0.45, 1, .75] }} transition={{ duration: reduced ? .25 : .8, delay: index * .018, ease: 'easeOut' }} />
      ))}
      {[12, 34, 68, 88].map((left, index) => (
        <motion.span className="memory-transition-balloon" key={left} style={{ left: `${left}%`, '--transition-balloon': ['#b99eea', '#f0a7bd', '#f4bf91', '#bea8ea'][index] }} initial={{ y: '35vh', opacity: 0 }} animate={{ y: '-75vh', x: index % 2 ? 22 : -22, opacity: [0, .8, 0] }} transition={{ duration: reduced ? .3 : 1.05, delay: index * .08, ease: 'easeOut' }} />
      ))}
    </motion.div>
  )
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 600px)').matches)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 600px)')
    const update = () => setMobile(query.matches)
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])
  return mobile
}

export default function PhotoMemories({ currentPhotoIndex, direction, phase, onNavigate, curtainReveal = false }) {
  const reduced = useReducedMotion()
  const mobile = useIsMobile()
  const completedCaptions = useRef(new Set())
  const current = memories[currentPhotoIndex]
  const transitioning = phase === 'photoTransition'
  const finalPhoto = currentPhotoIndex === memories.length - 1
  const previousMemories = memories.slice(Math.max(0, currentPhotoIndex - 2), currentPhotoIndex)
  const { displayed, complete } = usePersistentCaption(current.caption, currentPhotoIndex, phase === 'photoMemories', reduced, completedCaptions)
  const travel = reduced ? .08 : mobile ? .42 : 1
  const rotationScale = reduced ? 0 : mobile ? .45 : 1

  return (
    <motion.section className="photo-memory-scene" aria-label="Photo memories with Nikitha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? .18 : .55 }}>
      <div className="memory-gallery-light" aria-hidden="true"><i /><i /><i /></div>
      <motion.header className="memory-scene-heading" initial={{ opacity: 0, y: 8 }} animate={{ opacity: transitioning ? .35 : 1, y: 0 }} transition={{ duration: reduced ? .18 : curtainReveal ? 1.1 : .4 }}>
        <span>Some moments deserve to be remembered forever.</span>
      </motion.header>

      <div className="memory-polaroid-stage">
        <div className="memory-stack" aria-hidden="true">
          {previousMemories.map((memory, stackIndex) => {
            const distance = previousMemories.length - stackIndex
            return <motion.figure className={`memory-polaroid memory-stack-card stack-distance-${distance}`} key={memory.src} initial={{ opacity: 0, scale: .84 }} animate={{ opacity: distance === 1 ? .26 : .13, scale: distance === 1 ? .94 : .88, rotate: (memory.rotation + (distance === 1 ? -3 : 4)) * (mobile ? .45 : 1), x: distance === 1 ? -20 : 25, y: distance === 1 ? 12 : 24 }} transition={{ duration: reduced ? .18 : .48 }}><div className="memory-image-window"><img src={memory.src} alt="" /></div></motion.figure>
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.figure className="memory-polaroid current-memory-polaroid" key={current.src} initial={curtainReveal ? { opacity: 0, y: reduced ? 5 : 24, rotate: reduced ? 0 : -3, scale: reduced ? .98 : .9, filter: reduced ? 'none' : 'blur(7px)' } : { opacity: 0, x: direction * current.entrance.x * travel, y: reduced ? 10 : current.entrance.y * (mobile ? .3 : .8), rotate: direction * current.rotation * 1.5 * rotationScale, scale: reduced ? .98 : .82 }} animate={transitioning ? { opacity: .18, x: direction * (mobile ? 68 : 125), rotate: direction * 4 * rotationScale, scale: .88 } : { opacity: 1, x: 0, y: 0, rotate: current.rotation * rotationScale, scale: 1, filter: 'blur(0px)' }} exit={{ opacity: 0, x: direction * (mobile ? 62 : 110), scale: .88 }} transition={{ duration: reduced ? .2 : curtainReveal ? 1.25 : .68, ease: [0.16, 1, 0.3, 1] }}>
            <MemoryDecoration type={current.decoration} />
            <div className="memory-image-window"><motion.img src={current.src} alt={current.alt} initial={{ scale: 1.025 }} animate={{ scale: reduced ? 1.01 : 1.065 }} transition={{ duration: reduced ? .2 : 8, ease: 'linear' }} /></div>
            <figcaption><span>{displayed}</span>{!complete && !transitioning && <i className="memory-caption-caret" aria-hidden="true" />}</figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      <AnimatePresence>{transitioning && <MemoryTransitionCelebration direction={direction} reduced={reduced} />}</AnimatePresence>
      <AnimatePresence>
        {complete && !transitioning && (
          <motion.nav className="memory-navigation" aria-label="Memory navigation" initial={{ opacity: 0, y: 9 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}>
            <button type="button" className="memory-nav-button memory-previous-button" onClick={() => onNavigate(-1)} disabled={currentPhotoIndex === 0}><span aria-hidden="true">←</span> Previous</button>
            <button type="button" className="memory-nav-button memory-next-button" onClick={() => onNavigate(1)}>{finalPhoto ? 'Continue' : 'Next'} <span aria-hidden="true">→</span></button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.section>
  )
}
