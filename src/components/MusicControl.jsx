import { motion } from 'motion/react'

export default function MusicControl({ isPlaying, onToggle }) {
  return (
    <motion.button type="button" className="music-control" aria-label={isPlaying ? 'Mute birthday music' : 'Play birthday music'} aria-pressed={isPlaying} onClick={onToggle} initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.85 }} transition={{ delay: 0.45, duration: 0.35 }} whileTap={{ scale: 0.93 }}>
      <span className="music-icon" aria-hidden="true">{isPlaying ? '♫' : '♪'}</span><span>{isPlaying ? 'Music on' : 'Music off'}</span>
    </motion.button>
  )
}
