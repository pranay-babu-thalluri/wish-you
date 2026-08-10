import { motion, useReducedMotion } from 'motion/react'

const textVariants = (reduced) => ({
  hidden: { opacity: 0, y: reduced ? 4 : 16, filter: reduced ? 'none' : 'blur(5px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduced ? 0.2 : 0.58, ease: [0.22, 1, 0.36, 1] } },
})

export default function BirthdayCard({ phase, onSettled, onSurprise }) {
  const reduced = useReducedMotion()
  const ready = phase === 'waitingForCalendar'
  const entrance = reduced
    ? { y: [-30, 0], opacity: [0, 1], scale: 1 }
    : { y: ['-120vh', 28, -12, 4, 0], opacity: 1, rotate: [-6, 2, -.9, .3, 0], rotateX: [14, -2, 1, 0, 0], scale: [.86, 1.025, .988, 1.006, 1] }

  return (
    <section className="card-stage" aria-live="polite">
      <motion.article
        className="birthday-card"
        initial={{ y: reduced ? -30 : '-120vh', opacity: reduced ? 0 : 1, rotate: reduced ? 0 : -6, rotateX: reduced ? 0 : 14, scale: reduced ? 1 : .86 }}
        animate={entrance}
        exit={{ opacity: 0, scale: 0.94, y: -24 }}
        transition={{ duration: reduced ? 0.3 : 1.75, times: reduced ? [0, 1] : [0, .67, .82, .92, 1], ease: [0.18, .82, .24, 1] }}
        onAnimationComplete={() => phase === 'cardEntering' && onSettled()}
      >
        <div className="card-shimmer" aria-hidden="true" />
        <div className="card-ornamental-frame" aria-hidden="true">
          <i className="card-corner corner-top-left" /><i className="card-corner corner-top-right" />
          <i className="card-corner corner-bottom-left" /><i className="card-corner corner-bottom-right" />
        </div>
        <motion.div className="card-face waiting-message" initial="hidden" animate={ready ? 'visible' : 'hidden'} variants={{ hidden: {}, visible: { transition: { staggerChildren: reduced ? 0.08 : 0.26 } } }}>
          <motion.div className="card-botanical-divider" aria-hidden="true" variants={textVariants(reduced)}>
            <span />
            <i className="leaf leaf-one" />
            <i className="leaf leaf-two" />
            <b />
            <i className="leaf leaf-three" />
            <i className="leaf leaf-four" />
            <span />
          </motion.div>
          <motion.p className="card-kicker" variants={textVariants(reduced)}>Hey gorgeous</motion.p>
          <motion.h1 variants={textVariants(reduced)}>Nikki</motion.h1>
          <motion.div className="card-heart-divider" aria-hidden="true" variants={textVariants(reduced)}>
            <span /><b>♡</b><span />
          </motion.div>
          <motion.p className="card-message" variants={textVariants(reduced)}>You make ordinary moments feel special.</motion.p>
          <motion.p className="card-surprise-note" variants={textVariants(reduced)}>A little <strong>surprise</strong> is waiting for you...</motion.p>
          <motion.button type="button" className="surprise-button" variants={textVariants(reduced)} whileHover={reduced ? undefined : { y: -3 }} whileTap={{ scale: 0.97 }} onClick={onSurprise}>
            Tap me <span aria-hidden="true">✨</span>
          </motion.button>
        </motion.div>
      </motion.article>
    </section>
  )
}
