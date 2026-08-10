import { motion, useReducedMotion } from 'motion/react'

export default function CinematicTitle({ onComplete }) {
  const reduced = useReducedMotion()
  const quick = reduced ? 0.2 : 0.85

  return (
    <motion.section
      className="cinematic-title birthday-written-reveal"
      aria-label="Happy Birthday, Nikitha"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: reduced ? 0.2 : 0.7 }}
    >
      <div className="title-core birthday-book-title">
        <motion.p className="birthday-wish-line" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: quick, delay: reduced ? 0 : 0.2 }}>
          <span aria-hidden="true">✦</span> Wishing you a <span aria-hidden="true">✦</span>
        </motion.p>

        <motion.span className="birthday-happy" initial={{ opacity: 0, letterSpacing: '.45em' }} animate={{ opacity: 1, letterSpacing: '.22em' }} transition={{ duration: quick, delay: reduced ? 0.1 : 0.5 }}>
          Happy
        </motion.span>

        <motion.span className="birthday-script" initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }} transition={{ duration: reduced ? 0.3 : 1.45, delay: reduced ? 0.2 : 0.9, ease: [0.22, 1, 0.36, 1] }}>
          Birthday
        </motion.span>

        <motion.div className="birthday-title-divider" aria-hidden="true" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: quick, delay: reduced ? 0.25 : 1.55 }}>
          <span /><b>♥</b><span />
        </motion.div>

        <motion.h1 className="birthday-name" initial={{ opacity: 0, y: 28, filter: reduced ? 'none' : 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: reduced ? 0.35 : 1.05, delay: reduced ? 0.3 : 1.9, ease: [0.22, 1, 0.36, 1] }} onAnimationComplete={onComplete}>
          Nikitha
        </motion.h1>

        <motion.p className="birthday-supporting-copy" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: quick, delay: reduced ? 0.35 : 2.55 }}>
          May your day be filled with love,<br />laughter and beautiful surprises.
        </motion.p>

        <motion.div className="birthday-closing-flourish" aria-hidden="true" initial={{ opacity: 0, scaleX: 0 }} animate={{ opacity: 1, scaleX: 1 }} transition={{ duration: quick, delay: reduced ? 0.4 : 2.9 }}>
          <span /><b>♡</b><span />
        </motion.div>
      </div>
    </motion.section>
  )
}
