import { motion, useReducedMotion } from 'motion/react'

export default function BirthdayEnvelope({ phase, onSettled, onOpen, onOpened }) {
  const reduced = useReducedMotion()
  const waiting = phase === 'waitingForEnvelope'
  const opening = phase === 'envelopeOpening'

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
      className="envelope-stage"
      initial={{ opacity: 0, x: reduced ? 20 : '50vw', y: reduced ? 20 : '42vh', rotate: reduced ? 0 : 8, scale: 0.88 }}
      animate={{ opacity: 1, x: [reduced ? 20 : '50vw', reduced ? 0 : -8, 0], y: [reduced ? 20 : '42vh', -7, 0], rotate: [reduced ? 0 : 8, -1, 0], scale: [0.88, 1.02, 1] }}
      exit={{ opacity: 0 }}
      transition={{ duration: reduced ? 0.3 : 1.05, times: [0, 0.82, 1], ease: [0.16, 1, 0.3, 1] }}
      onAnimationComplete={() => phase === 'envelopeEntering' && onSettled()}
    >
      <motion.div
        className={`envelope-control ${waiting ? 'is-ready' : ''}`}
        role={waiting ? 'button' : undefined}
        tabIndex={waiting ? 0 : -1}
        aria-label={waiting ? 'Open your birthday letter' : undefined}
        onClick={activate}
        onKeyDown={handleKeyDown}
        animate={waiting && !reduced ? { y: [0, -5, 0] } : { y: 0 }}
        transition={{ duration: 2.8, repeat: waiting && !reduced ? Infinity : 0, ease: 'easeInOut' }}
      >
        <div className="envelope-back" aria-hidden="true" />
        <motion.div className="letter-preview" aria-hidden="true" animate={opening ? { y: reduced ? -55 : -125, scale: reduced ? 1.03 : 1.12 } : { y: 0, scale: 0.9 }} transition={{ duration: reduced ? 0.35 : 0.9, delay: reduced ? 0.1 : 0.62, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={() => opening && onOpened()}><span /><span /><span /></motion.div>
        <motion.div className="envelope-flap" aria-hidden="true" animate={opening ? { rotateX: 178, zIndex: 0 } : { rotateX: 0, zIndex: 4 }} transition={{ duration: reduced ? 0.3 : 0.72, ease: [0.22, 1, 0.36, 1] }} />
        <div className="envelope-front" aria-hidden="true" />
        <motion.span className="heart-seal" aria-hidden="true" animate={opening ? { opacity: 0, scale: 1.7, rotate: 18 } : { opacity: 1, scale: 1 }} transition={{ duration: reduced ? 0.2 : 0.4 }}>♥</motion.span>
      </motion.div>
      <motion.div className="envelope-copy" animate={{ opacity: opening ? 0 : 1 }}>
        <p>A letter for you</p><span>Tap to open</span>
      </motion.div>
    </motion.section>
  )
}
