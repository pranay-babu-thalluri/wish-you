import { useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'

const PETALS = Array.from({ length: 40 }, (_, index) => ({
  id: `petal-${index}`,
  type: index % 6 === 0 ? 'mini' : 'petal',
  startX: (index * 29 + 7) % 104 - 2,
  endX: (index * 47 + 19) % 108 - 4,
  delay: (index % 10) * 0.17 + Math.floor(index / 10) * 0.11,
  duration: 3.15 + (index % 7) * 0.24,
  rotation: -95 + (index * 67) % 190,
  scale: 0.55 + (index % 6) * 0.12,
  driftAmount: -7 + (index % 5) * 3.5,
}))

const ROSES = Array.from({ length: 14 }, (_, index) => ({
  id: `rose-${index}`,
  type: 'rose',
  startX: (index * 41 + 11) % 102 - 1,
  endX: (index * 23 + 17) % 106 - 3,
  delay: 0.18 + (index % 7) * 0.25,
  duration: 3.55 + (index % 5) * 0.31,
  rotation: -70 + (index * 53) % 150,
  scale: 0.62 + (index % 5) * 0.13,
  driftAmount: -8 + (index % 4) * 5,
}))

const LEAVES = Array.from({ length: 6 }, (_, index) => ({
  id: `leaf-${index}`,
  type: 'leaf',
  startX: (index * 57 + 16) % 100,
  endX: (index * 31 + 26) % 100,
  delay: 0.35 + index * 0.31,
  duration: 3.8 + (index % 3) * 0.42,
  rotation: -50 + index * 31,
  scale: 0.68 + (index % 3) * 0.15,
  driftAmount: index % 2 === 0 ? -8 : 8,
}))

const PANEL_BLOOMS = Array.from({ length: 15 }, (_, index) => ({
  left: 5 + (index * 37) % 87,
  top: 3 + (index * 29) % 91,
  scale: 0.68 + (index % 5) * 0.15,
  tone: index % 5,
  rotate: (index * 47) % 80 - 40,
}))

function RoseShape({ compact = false }) {
  return <span className={`rose-shape ${compact ? 'is-compact' : ''}`}><i /><i /><i /><i /><b /></span>
}

function FallingPiece({ config, mobileExtra, reduced }) {
  const middleX = config.startX + config.driftAmount
  return (
    <motion.span
      className={`rose-faller rose-faller-${config.type} ${mobileExtra ? 'rose-mobile-extra' : ''}`}
      initial={{ x: `${config.startX}vw`, y: reduced ? '-4vh' : '-16vh', opacity: 0, rotate: config.rotation, scale: config.scale }}
      animate={{
        x: [`${config.startX}vw`, `${middleX}vw`, `${config.endX}vw`],
        y: reduced ? ['-4vh', '42vh', '102vh'] : ['-16vh', '43vh', '112vh'],
        opacity: [0, 1, 1, .82],
        rotate: reduced ? config.rotation : [config.rotation, config.rotation + 105, config.rotation + 245],
      }}
      transition={{ delay: reduced ? config.delay * .25 : config.delay, duration: reduced ? 1.15 : config.duration, ease: [0.33, 0.05, 0.35, 1] }}
      aria-hidden="true"
    >
      {config.type === 'rose' ? <RoseShape compact /> : <i />}
    </motion.span>
  )
}

function CurtainPanel({ side, phase, reduced, onAnimationComplete }) {
  const opening = phase === 'roseCurtainOpening'
  const closedX = '0%'
  const openX = side === 'left' ? '-106%' : '106%'
  const initialX = side === 'left' ? '-102%' : '102%'

  return (
    <motion.div
      className={`rose-curtain-panel rose-curtain-${side}`}
      initial={{ x: initialX, opacity: reduced ? 0 : 1 }}
      animate={opening
        ? { x: reduced ? openX : openX, opacity: reduced ? 0 : 1, rotateY: reduced ? 0 : side === 'left' ? 9 : -9, scale: reduced ? 1 : 1.025 }
        : { x: closedX, opacity: 1, rotateY: 0, scale: 1 }}
      transition={{ duration: reduced ? .32 : opening ? 1.55 : 2.35, ease: opening ? [0.77, 0, 0.18, 1] : [0.22, 0.72, 0.28, 1] }}
      onAnimationComplete={onAnimationComplete}
    >
      <div className="rose-panel-texture" aria-hidden="true" />
      {PANEL_BLOOMS.map((bloom, index) => (
        <span
          className={`rose-panel-bloom tone-${bloom.tone}`}
          key={`${side}-${index}`}
          style={{ '--bloom-left': `${bloom.left}%`, '--bloom-top': `${bloom.top}%`, '--bloom-scale': bloom.scale, '--bloom-rotate': `${bloom.rotate}deg` }}
          aria-hidden="true"
        ><RoseShape /></span>
      ))}
      <span className="rose-panel-edge" aria-hidden="true" />
    </motion.div>
  )
}

export default function RoseCurtainTransition({ phase, onCovered, onOpen, onOpened }) {
  const reduced = useReducedMotion()
  const opening = phase === 'roseCurtainOpening'
  const visiblePetals = reduced ? PETALS.slice(0, 10) : PETALS
  const visibleRoses = reduced ? ROSES.slice(0, 5) : ROSES
  const visibleLeaves = reduced ? LEAVES.slice(0, 2) : LEAVES

  useEffect(() => {
    if (phase !== 'roseCovered') return undefined
    const timer = window.setTimeout(onOpen, reduced ? 260 : 920)
    return () => window.clearTimeout(timer)
  }, [onOpen, phase, reduced])

  const handleLeftPanelComplete = () => {
    if (phase === 'roseFall') onCovered()
    if (opening) onOpened()
  }

  return (
    <section className={`rose-transition ${opening ? 'is-opening' : ''} ${phase === 'roseCovered' ? 'is-covered' : ''}`} aria-hidden="true">
      <div className="rose-curtain-perspective">
        <CurtainPanel side="left" phase={phase} reduced={reduced} onAnimationComplete={handleLeftPanelComplete} />
        <CurtainPanel side="right" phase={phase} reduced={reduced} />
        <motion.span className="rose-curtain-seam" animate={{ opacity: phase === 'roseCovered' ? [0, .9, .35] : 0, scaleY: phase === 'roseCovered' ? [0.65, 1.06, 1] : .7 }} transition={{ duration: reduced ? .2 : .8 }} />
      </div>

      <div className="falling-rose-layer">
        {visiblePetals.map((piece, index) => <FallingPiece key={piece.id} config={piece} mobileExtra={index >= 24} reduced={reduced} />)}
        {visibleRoses.map((piece, index) => <FallingPiece key={piece.id} config={piece} mobileExtra={index >= 9} reduced={reduced} />)}
        {visibleLeaves.map((piece, index) => <FallingPiece key={piece.id} config={piece} mobileExtra={index >= 4} reduced={reduced} />)}
      </div>
    </section>
  )
}
