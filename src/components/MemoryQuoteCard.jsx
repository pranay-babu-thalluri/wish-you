import { motion, useReducedMotion } from 'motion/react'

const quoteBalloons = [
  { left: 5, color: '#bba0ed', delay: 0 }, { left: 16, color: '#f1a8c2', delay: .8 },
  { left: 29, color: '#f6bd8f', delay: 1.5 }, { left: 70, color: '#c9acee', delay: .4 },
  { left: 84, color: '#efa5bb', delay: 1.1 }, { left: 94, color: '#f3c092', delay: 1.9 },
]

export default function MemoryQuoteCard({ onContinue, isPressed = false }) {
  const reduced = useReducedMotion()

  return (
    <motion.section className="memory-quote-stage" aria-label="A special thought for Nikitha" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? .18 : .6 }}>
      <div className="memory-quote-backdrop" aria-hidden="true">
        <motion.i className="quote-orb quote-orb-one" animate={reduced ? undefined : { y: [0, -24, 0], x: [0, 12, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.i className="quote-orb quote-orb-two" animate={reduced ? undefined : { y: [0, 20, 0], x: [0, -14, 0] }} transition={{ duration: 6.8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.i className="quote-orb quote-orb-three" animate={reduced ? undefined : { y: [0, -16, 0], scale: [1, 1.12, 1] }} transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }} />
        <span className="quote-spark quote-spark-one">✦</span><span className="quote-spark quote-spark-two">✧</span><span className="quote-heart">♡</span>
        {quoteBalloons.map((balloon, index) => (
          <motion.span className="quote-party-balloon" key={balloon.left} style={{ left: `${balloon.left}%`, '--quote-balloon': balloon.color }} initial={{ y: '110vh', opacity: 0 }} animate={reduced ? { y: '68vh', opacity: .45 } : { y: ['110vh', '46vh', '-28vh'], x: [0, index % 2 ? 26 : -22, 0], opacity: [0, .82, .82, 0] }} transition={{ duration: reduced ? .4 : 6.5 + index * .4, delay: balloon.delay, repeat: reduced ? 0 : Infinity, repeatDelay: 1, ease: 'linear' }} />
        ))}
        {[{ left: 13, top: 31 }, { left: 87, top: 24 }, { left: 91, top: 70 }].map((burst, index) => (
          <motion.b className="quote-cracker" key={burst.left} style={{ left: `${burst.left}%`, top: `${burst.top}%` }} initial={{ opacity: 0, scale: .2 }} animate={{ opacity: [0, 1, 0], scale: [.2, 1.25, 1.65], rotate: [0, index % 2 ? 20 : -20] }} transition={{ duration: reduced ? .4 : 1.1, delay: .4 + index * .6, repeat: reduced ? 0 : Infinity, repeatDelay: 3 }}>✦</motion.b>
        ))}
        {Array.from({ length: 16 }, (_, index) => (
          <motion.em className={`quote-confetti quote-confetti-${index % 3}`} key={`quote-confetti-${index}`} style={{ left: `${4 + ((index * 31) % 92)}%`, '--quote-confetti': ['#bc91e6', '#ef9eb9', '#f1a15e', '#8e9fe5'][index % 4] }} initial={{ y: '-8vh', opacity: 0 }} animate={reduced ? { opacity: [0, .6, 0], y: [0, 40] } : { y: ['-8vh', '108vh'], x: [0, (index % 2 ? 1 : -1) * (15 + index)], rotate: [0, 260 + index * 16], opacity: [0, .88, .88, 0] }} transition={{ duration: reduced ? .6 : 4.4 + (index % 5) * .4, delay: (index % 6) * .22, repeat: reduced ? 0 : Infinity, repeatDelay: 1.2, ease: 'linear' }} />
        ))}
      </div>

      <motion.article className="memory-quote-card" initial={{ opacity: 0, y: reduced ? 8 : 48, rotate: reduced ? 0 : -2, scale: reduced ? .98 : .9 }} animate={isPressed ? { opacity: .7, y: 8, rotate: 0, scale: .965, filter: 'brightness(.96)' } : { opacity: 1, y: 0, rotate: 0, scale: 1, filter: 'brightness(1)' }} exit={{ opacity: 0, y: reduced ? -5 : -22, scale: .96 }} transition={{ duration: reduced ? .2 : .9, ease: [0.16, 1, 0.3, 1] }}>
        <span className="memory-quote-ribbon" aria-hidden="true">A little thought</span>
        <span className="memory-quote-flower memory-quote-flower-one" aria-hidden="true">✿</span><span className="memory-quote-flower memory-quote-flower-two" aria-hidden="true">✿</span>
        <span className="memory-quote-leaf memory-quote-leaf-left" aria-hidden="true"><i /><i /><i /></span><span className="memory-quote-leaf memory-quote-leaf-right" aria-hidden="true"><i /><i /><i /></span>
        <p className="memory-quote-kicker">Before we continue...</p>
        <blockquote>“You make ordinary moments feel special.”</blockquote>
        <p className="memory-quote-note">And some of those moments deserve to be kept forever.</p>
        <motion.button type="button" className="memory-quote-button" onClick={onContinue} disabled={isPressed} whileHover={reduced ? undefined : { y: -3 }} whileTap={{ scale: .97 }}>See the memories <span aria-hidden="true">→</span></motion.button>
      </motion.article>
    </motion.section>
  )
}
