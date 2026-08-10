import { motion, useReducedMotion } from 'motion/react'

export default function InvitationCard({ onContinue }) {
  const reduced = useReducedMotion()
  return (
    <motion.button
      type="button"
      className="invitation-card"
      aria-label="Come with me to read your birthday letter"
      initial={{ opacity: 0, x: reduced ? 24 : '72vw', rotate: reduced ? 0 : 7, rotateY: reduced ? 0 : -18, scale: 0.94 }}
      animate={{ opacity: 1, x: [reduced ? 24 : '72vw', reduced ? 0 : -12, 0], rotate: [reduced ? 0 : 7, -1.2, 0], rotateY: 0, scale: [0.94, 1.015, 1] }}
      exit={{ opacity: 0, y: -18, scale: 0.96 }}
      transition={{ duration: reduced ? 0.3 : 1.15, times: [0, 0.82, 1], ease: [0.16, 1, 0.3, 1] }}
      whileHover={reduced ? undefined : { y: -4, rotateX: 1.5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onContinue}
    >
      <span className="invitation-envelope-icon" aria-hidden="true"><i /></span>
      <span className="invitation-eyebrow">The celebration has only started...</span>
      <strong>Come with me</strong>
      <span className="invitation-support">There is something I want you to read.</span>
      <span className="invitation-arrow" aria-hidden="true">→</span>
    </motion.button>
  )
}
