import { motion, useReducedMotion } from 'motion/react'

const GLASS_PATH = `
  M112 110
  C98 122 91 143 89 171
  C84 211 61 235 48 269
  C21 340 58 414 122 441
  C145 451 175 451 198 441
  C262 414 299 340 272 269
  C259 235 236 211 231 171
  C229 143 222 122 208 110
  C187 122 133 122 112 110
  Z
`

export default function HangingBulb({ isLit, isDocked, onLightUp, onDocked }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={`bulb-fixture ${isLit ? 'lit' : ''} ${isDocked ? 'compact' : ''}`}
      initial={{ opacity: 0, y: reduceMotion ? 0 : -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0.15 : 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        className="bulb-control"
        aria-label={isLit ? 'The light is on' : 'Turn on the birthday light'}
        aria-pressed={isLit}
        onClick={onLightUp}
      >
        <span className="bulb-wire" aria-hidden="true" />
        <motion.span
          className="bulb-visual"
          initial={false}
          animate={{ scale: isDocked ? 0.34 : isLit ? (reduceMotion ? 0.34 : [1, 1, 0.34]) : 1 }}
          transition={isLit && !isDocked
            ? { duration: reduceMotion ? 0.25 : 2.1, times: reduceMotion ? undefined : [0, 0.42, 1], ease: [0.22, 1, 0.36, 1] }
            : { duration: 0 }}
          onAnimationComplete={() => isLit && !isDocked && onDocked?.()}
        >
          <span className="bulb-aura aura-outer" aria-hidden="true" />
          <span className="bulb-aura aura-middle" aria-hidden="true" />
          <span className="bulb-aura aura-inner" aria-hidden="true" />

        <svg className="bulb-svg" viewBox="0 0 320 500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <defs>
            <radialGradient id="premiumGlassOff" cx="36%" cy="28%" r="78%">
              <stop offset="0%" stopColor="#59616b" stopOpacity="0.16" />
              <stop offset="45%" stopColor="#242a31" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#05080b" stopOpacity="0.48" />
            </radialGradient>
            <radialGradient id="premiumGlassOn" cx="50%" cy="39%" r="70%">
              <stop offset="0%" stopColor="#fffde0" stopOpacity="0.95" />
              <stop offset="24%" stopColor="#ffe890" stopOpacity="0.72" />
              <stop offset="55%" stopColor="#eeb54d" stopOpacity="0.27" />
              <stop offset="100%" stopColor="#b56b13" stopOpacity="0.08" />
            </radialGradient>
            <linearGradient id="premiumMetal" x1="0" x2="1">
              <stop offset="0%" stopColor="#151719" />
              <stop offset="16%" stopColor="#4e5051" />
              <stop offset="33%" stopColor="#17191b" />
              <stop offset="52%" stopColor="#6f6b61" />
              <stop offset="70%" stopColor="#252626" />
              <stop offset="87%" stopColor="#747168" />
              <stop offset="100%" stopColor="#111315" />
            </linearGradient>
            <linearGradient id="premiumMetalOn" x1="0" x2="1">
              <stop offset="0%" stopColor="#21170d" />
              <stop offset="18%" stopColor="#79633f" />
              <stop offset="35%" stopColor="#292014" />
              <stop offset="55%" stopColor="#9c8151" />
              <stop offset="76%" stopColor="#44341f" />
              <stop offset="100%" stopColor="#1b160f" />
            </linearGradient>
            <filter id="premiumFilamentGlow" x="-300%" y="-300%" width="700%" height="700%">
              <feGaussianBlur stdDeviation="7" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="premiumBulbGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="18" />
            </filter>
          </defs>

          <g>
            <path className="holder-body" d="M112 44 Q160 24 208 44 L218 116 Q160 136 102 116 Z" fill="url(#premiumMetal)" />
            <ellipse cx="160" cy="45" rx="48" ry="13" className="holder-edge" />
            <path d="M108 62 Q160 79 212 62" className="holder-line" />
            <path d="M105 80 Q160 97 215 80" className="holder-line" />
            <path d="M103 99 Q160 116 217 99" className="holder-line" />
            <path d="M105 116 Q160 132 215 116" className="holder-line" />
            <rect x="133" y="23" width="54" height="23" rx="7" className="holder-neck" />
          </g>

          <ellipse className="inner-glow" cx="160" cy="266" rx="104" ry="145" fill="#ffbe3f" filter="url(#premiumBulbGlow)" />
          <path className="bulb-glass" d={GLASS_PATH} fill="url(#premiumGlassOff)" />
          <path className="glass-outline" d={GLASS_PATH} />
          <path className="glass-reflection reflection-large" d="M108 145 C85 190 81 229 61 270 C46 302 47 337 61 366" />
          <path className="glass-reflection reflection-small" d="M122 129 C111 139 105 150 101 165" />

          <g className="support-wires">
            <path d="M126 375 L141 245" />
            <path d="M194 375 L179 245" />
            <path d="M141 245 L147 194" />
            <path d="M179 245 L173 194" />
            <path d="M147 194 L173 194" />
          </g>

          <path className="filament-glow" d="M141 244 C147 228 151 259 160 244 C169 229 174 260 180 244" />
          <path className="filament" d="M141 244 C147 228 151 259 160 244 C169 229 174 260 180 244" />
        </svg>

          <span className="bulb-instruction" aria-hidden="true">
            <span className="click-circle"><span /></span>
            <span className="text-off">CLICK TO ILLUMINATE</span>
            <span className="text-on">CLICK TO DIM</span>
          </span>
          <span className="bulb-quote">Every beautiful wish begins with a little spark</span>
        </motion.span>
      </button>
    </motion.div>
  )
}
