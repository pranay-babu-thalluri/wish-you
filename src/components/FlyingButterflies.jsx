import { motion, useReducedMotion } from 'motion/react'

const butterflies = [
  { id: 0, left: '#b598eb', right: '#e9a8cf', accent: '#755394', glow: '#f5d8ff', reverse: false, delay: 0, duration: 14 },
  { id: 1, left: '#d9a6e7', right: '#f1adbb', accent: '#8b547f', glow: '#ffe1ef', reverse: true, delay: 3.5, duration: 16 },
  { id: 2, left: '#e6a1c5', right: '#f3b395', accent: '#985c7a', glow: '#ffe6da', reverse: false, delay: 7, duration: 18 },
]

function ButterflySvg({ butterfly }) {
  const leftGradient = `butterfly-left-${butterfly.id}`
  const rightGradient = `butterfly-right-${butterfly.id}`
  const shineGradient = `butterfly-shine-${butterfly.id}`

  return (
    <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id={leftGradient} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={butterfly.glow} /><stop offset="28%" stopColor={butterfly.left} /><stop offset="100%" stopColor={butterfly.accent} /></linearGradient>
        <linearGradient id={rightGradient} x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor={butterfly.glow} /><stop offset="28%" stopColor={butterfly.right} /><stop offset="100%" stopColor={butterfly.accent} /></linearGradient>
        <radialGradient id={shineGradient} cx="28%" cy="24%" r="70%"><stop offset="0%" stopColor="#fff" stopOpacity=".85" /><stop offset="45%" stopColor="#fff" stopOpacity=".16" /><stop offset="100%" stopColor="#fff" stopOpacity="0" /></radialGradient>
      </defs>
      <g className="flying-wing flying-wing-left">
        <path d="M76 58 C62 20 29 4 10 20 C-4 33 7 57 33 68 C17 80 19 105 40 108 C60 110 72 89 78 66 Z" fill={`url(#${leftGradient})`} />
        <path d="M70 55 C57 31 31 18 17 28 C14 44 36 58 66 62" fill="none" stroke={butterfly.accent} strokeWidth="2" opacity=".35" />
        <ellipse cx="35" cy="34" rx="18" ry="13" fill={`url(#${shineGradient})`} opacity=".7" />
      </g>
      <g className="flying-wing flying-wing-right">
        <path d="M84 58 C98 20 131 4 150 20 C164 33 153 57 127 68 C143 80 141 105 120 108 C100 110 88 89 82 66 Z" fill={`url(#${rightGradient})`} />
        <path d="M90 55 C103 31 129 18 143 28 C146 44 124 58 94 62" fill="none" stroke={butterfly.accent} strokeWidth="2" opacity=".35" />
        <ellipse cx="125" cy="34" rx="18" ry="13" fill={`url(#${shineGradient})`} opacity=".7" />
      </g>
      <ellipse cx="80" cy="65" rx="5" ry="26" fill="#4b375c" />
      <ellipse cx="80" cy="42" rx="6" ry="7" fill="#563e67" />
      <path d="M77 39 C68 23 59 17 51 15 M83 39 C92 23 101 17 109 15" fill="none" stroke="#4b375c" strokeWidth="2" strokeLinecap="round" />
      <circle cx="50" cy="15" r="2.5" fill="#4b375c" /><circle cx="110" cy="15" r="2.5" fill="#4b375c" />
    </svg>
  )
}

export default function FlyingButterflies() {
  const reduced = useReducedMotion()

  return (
    <div className="butterfly-world" aria-hidden="true">
      {butterflies.map((butterfly, index) => {
        const x = butterfly.reverse ? ['115vw', '72vw', '28vw', '-18vw'] : ['-18vw', '28vw', '72vw', '115vw']
        const y = index === 0 ? ['18vh', '54vh', '22vh', '66vh'] : index === 1 ? ['68vh', '26vh', '58vh', '16vh'] : ['42vh', '15vh', '66vh', '34vh']
        return (
          <motion.div
            className="flying-butterfly"
            key={butterfly.id}
            initial={{ opacity: 0, x: x[0], y: y[0] }}
            animate={reduced ? { opacity: index === 0 ? .45 : 0, x: '72vw', y: '18vh' } : { opacity: [0, .88, .88, 0], x, y, rotate: [0, 13, -12, 8] }}
            transition={{ duration: reduced ? .3 : butterfly.duration, delay: reduced ? 0 : butterfly.delay, repeat: reduced ? 0 : Infinity, repeatDelay: 1.6, ease: 'easeInOut' }}
          >
            <span className={`flying-butterfly-inner ${butterfly.reverse ? 'is-reversed' : ''}`}>
              <ButterflySvg butterfly={butterfly} />
              <i className="butterfly-spark spark-one" /><i className="butterfly-spark spark-two" /><i className="butterfly-spark spark-three" />
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
