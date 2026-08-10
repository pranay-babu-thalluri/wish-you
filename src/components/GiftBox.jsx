import { motion, useReducedMotion } from 'motion/react'

export default function GiftBox({ phase, onSettled, onOpen, onFaded }) {
  const reduced = useReducedMotion()
  const waiting = phase === 'waitingForGiftClick'
  const opening = phase === 'giftOpening' || phase === 'giftFading'
  const fading = phase === 'giftFading'
  const parkedX = reduced ? '28vw' : '32vw'

  const activate = () => {
    if (waiting) onOpen()
  }

  const handleKeyDown = (event) => {
    if (waiting && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault()
      activate()
    }
  }

  return (
    <motion.section
      className="gift-stage"
      initial={{ opacity: 0, y: reduced ? -35 : '-90vh', rotate: reduced ? 0 : -12, scale: 0.82 }}
      animate={fading
        ? { opacity: 0, scale: 0.5, x: parkedX, y: 36 }
        : phase === 'giftEntering'
          ? { opacity: [0, 1, 1, 1], x: '0vw', y: [reduced ? -35 : '-90vh', 16, -7, 0], rotate: reduced ? 0 : [-12, 5, -2, 0], scale: [0.82, 1.04, 0.98, 1] }
          : opening
            ? { opacity: 1, x: ['0vw', '-0.4vw', '0.4vw', parkedX], y: [0, 4, -2, 0], rotate: reduced ? 0 : [0, -2, 2, 0], scale: [1, 0.96, 1.02, 0.68] }
            : { opacity: 1, x: '0vw', y: 0, rotate: 0, scale: 1 }}
      transition={fading
        ? { duration: reduced ? 0.25 : 0.6, delay: reduced ? 0.2 : 1, ease: 'easeInOut' }
        : phase === 'giftEntering'
          ? { duration: reduced ? 0.35 : 1.35, times: [0, 0.68, 0.84, 1], ease: [0.2, 0.75, 0.3, 1] }
          : opening
            ? { duration: reduced ? 0.3 : 0.9, times: [0, 0.2, 0.48, 1], ease: [0.22, 1, 0.36, 1] }
            : { duration: 0.2 }}
      onAnimationComplete={() => fading ? onFaded() : phase === 'giftEntering' && onSettled()}
    >
      <motion.div
        className={`gift-control ${waiting ? 'is-ready' : ''}`}
        role={waiting ? 'button' : undefined}
        tabIndex={waiting ? 0 : -1}
        aria-label={waiting ? 'Open the birthday gift' : undefined}
        onClick={activate}
        onKeyDown={handleKeyDown}
        whileTap={waiting ? { scale: 0.96 } : undefined}
      >
        <motion.div className="gift-glow" aria-hidden="true" animate={opening ? { opacity: [0, 0.85, 0.55], scale: [0.4, 1.5, 1.2] } : { opacity: 0, scale: 0.4 }} transition={{ duration: reduced ? 0.25 : 0.9, delay: reduced ? 0 : 0.25 }} />
        <motion.div className="gift-lid" aria-hidden="true" animate={opening ? { y: reduced ? -28 : -68, x: reduced ? 0 : 13, rotate: reduced ? -4 : 16 } : { y: 0, x: 0, rotate: 0 }} transition={{ duration: reduced ? 0.3 : 0.78, delay: reduced ? 0 : 0.2, ease: [0.22, 1, 0.36, 1] }}>
          <span className="gift-lid-ribbon" />
          <span className="gift-highlight" />
          <span className="gift-bow bow-loop-left" /><span className="gift-bow bow-loop-right" />
          <span className="gift-bow-knot" />
        </motion.div>
        <div className="gift-body" aria-hidden="true"><span className="gift-ribbon" /></div>
        <motion.span className="gift-date-tag" aria-hidden="true" initial={{ opacity: 0, y: -16, rotate: -10 }} animate={{ opacity: 1, y: 0, rotate: 6 }} transition={{ duration: reduced ? 0.2 : 0.55, delay: reduced ? 0 : 0.48 }}><b>11 AUG</b><small>For Nikitha</small></motion.span>
        <motion.span className="gift-sparkle sparkle-a" aria-hidden="true" animate={waiting ? { opacity: [0, 1, 0], scale: [0.4, 1.2, 0.4], rotate: [0, 90, 180] } : { opacity: 0 }} transition={{ duration: 1.8, repeat: waiting && !reduced ? Infinity : 0 }} />
        <motion.span className="gift-sparkle sparkle-b" aria-hidden="true" animate={waiting ? { opacity: [0, 0.8, 0], scale: [0.3, 1, 0.3], rotate: [0, -90, -180] } : { opacity: 0 }} transition={{ duration: 2, delay: 0.45, repeat: waiting && !reduced ? Infinity : 0 }} />
      </motion.div>
      <motion.p className="gift-instruction" initial={{ opacity: 0, y: 7 }} animate={{ opacity: waiting ? 1 : 0, y: waiting ? 0 : 7 }} transition={{ duration: 0.35 }}>Tap the gift</motion.p>
    </motion.section>
  )
}
