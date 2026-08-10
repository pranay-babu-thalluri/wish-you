import { motion, useReducedMotion } from 'motion/react'

const shapes = [
  ['orb orb-one', [0, 18, -6, 0], [0, -16, 8, 0], 9], ['orb orb-two', [0, -12, 9, 0], [0, 14, -5, 0], 11],
  ['orb orb-three', [0, 10, -8, 0], [0, -10, 6, 0], 10], ['speck speck-one', [0, 0], [0, -22, 0], 5],
  ['speck speck-two', [0, 0], [0, -17, 0], 6.5], ['speck speck-three', [0, 0], [0, -20, 0], 7],
  ['speck speck-four', [0, 0], [0, -14, 0], 5.8],
]

export default function FloatingDecorations() {
  const reduced = useReducedMotion()
  return <motion.div className="decorations" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.2 : 1.1 }}>{shapes.map(([name, x, y, duration]) => <motion.span key={name} className={name} animate={reduced ? undefined : { x, y }} transition={{ duration, repeat: Infinity, ease: 'easeInOut' }} />)}</motion.div>
}
