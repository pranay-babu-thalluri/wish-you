import { motion, useReducedMotion } from 'motion/react'

const colors = ['#efb4c8', '#c8b7ed', '#ffc5a8', '#a9cfee', '#b9ddcf', '#fff0c7']
const confetti = Array.from({ length: 28 }, (_, index) => ({
  id: index,
  x: ((index * 37) % 92) + 4,
  drift: ((index % 5) - 2) * 24,
  delay: (index % 7) * 0.06,
  duration: 1.8 + (index % 5) * 0.2,
  color: colors[index % colors.length],
  shape: index % 3,
}))

const balloons = Array.from({ length: 10 }, (_, index) => ({
  id: index,
  left: 5 + ((index * 19) % 89),
  delay: (index % 5) * 0.22,
  duration: 5.1 + (index % 4) * 0.65,
  size: 42 + (index % 3) * 10,
  drift: ((index % 4) - 1.5) * 34,
  color: colors[index % colors.length],
}))

const streamers = [
  { color: '#e9a9bf', rotate: -34, length: 150, delay: 0 },
  { color: '#b8a5df', rotate: -18, length: 185, delay: 0.08 },
  { color: '#f3b08f', rotate: -4, length: 165, delay: 0.14 },
  { color: '#99c6e5', rotate: 12, length: 195, delay: 0.2 },
  { color: '#a9d8c5', rotate: 27, length: 155, delay: 0.26 },
  { color: '#f3d991', rotate: 41, length: 175, delay: 0.32 },
]

const titleFlowers = [
  [5, 24], [12, 58], [25, 9], [43, 6], [64, 8], [84, 18],
  [93, 42], [88, 72], [72, 89], [50, 92], [27, 88], [7, 79],
].map(([left, top], index) => ({ id: index, left, top, size: 28 + (index % 4) * 8, color: colors[index % colors.length], delay: 0.22 + (index % 6) * 0.1 }))

const crackerBursts = [
  { left: 20, top: 31, delay: 0.35 },
  { left: 82, top: 27, delay: 0.65 },
  { left: 88, top: 68, delay: 0.95 },
]

const burstRays = Array.from({ length: 8 }, (_, index) => index)

function CornerStreamers({ reduced }) {
  return (
    <motion.div className="corner-streamers" initial={{ opacity: 0, scale: 0.72, rotate: -8 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.22, 1, 0.36, 1] }}>
      <span className="streamer-knot" />
      {streamers.map((streamer, index) => (
        <motion.span
          key={streamer.color}
          className={`corner-ribbon ribbon-${index}`}
          style={{ '--ribbon-color': streamer.color, '--ribbon-rotate': `${streamer.rotate}deg`, '--ribbon-length': `${streamer.length}px` }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 0.95 }}
          transition={{ duration: reduced ? 0.2 : 0.75, delay: reduced ? 0 : streamer.delay, ease: [0.22, 1, 0.36, 1] }}
        />
      ))}
      <span className="streamer-bow bow-left" /><span className="streamer-bow bow-right" />
      <span className="party-star party-star-one">✦</span><span className="party-star party-star-two">✦</span><span className="party-star party-star-three">✦</span>
    </motion.div>
  )
}

function Confetti({ reduced }) {
  return confetti.map((piece, index) => (
    <motion.span
      key={piece.id}
      className={`confetti confetti-shape-${piece.shape} ${index > 16 ? 'desktop-celebration' : ''}`}
      style={{ left: `${piece.x}%`, backgroundColor: piece.color }}
      initial={{ y: '-8vh', x: 0, opacity: 0, rotate: 0 }}
      animate={reduced ? { opacity: [0, 1, 0], y: [0, 35] } : { y: ['-8vh', '105vh'], x: [0, piece.drift, -piece.drift / 2], opacity: [0, 1, 1, 0], rotate: [0, 190, 430] }}
      transition={{ duration: reduced ? 0.7 : piece.duration + 2.6, delay: piece.delay, ease: 'easeIn' }}
    />
  ))
}

function Balloons({ reduced }) {
  return balloons.map((balloon, index) => (
    <motion.div
      key={balloon.id}
      className={`balloon-wrap ${index > 5 ? 'desktop-celebration' : ''}`}
      style={{ left: `${balloon.left}%`, '--balloon-size': `${balloon.size}px`, '--balloon-color': balloon.color }}
      initial={{ y: '82vh', x: `${82 - balloon.left}vw`, opacity: 0 }}
      animate={reduced ? { opacity: [0, 0.75, 0], y: ['72vh', '48vh', '35vh'], x: [`${82 - balloon.left}vw`, 0] } : { y: ['82vh', '48vh', '-35vh'], x: [`${82 - balloon.left}vw`, balloon.drift, -balloon.drift * 0.35], opacity: [0, 0.92, 0.92, 0] }}
      transition={{ duration: reduced ? 0.8 : balloon.duration, delay: balloon.delay, ease: 'linear' }}
    >
      <span className="balloon" /><span className="balloon-string" />
    </motion.div>
  ))
}

function CrackerBursts({ reduced }) {
  return crackerBursts.map((burst, index) => (
    <motion.span
      key={`${burst.left}-${burst.top}`}
      className={`cracker-burst ${index > 1 ? 'desktop-celebration' : ''}`}
      style={{ left: `${burst.left}%`, top: `${burst.top}%` }}
      initial={{ opacity: 0, scale: 0.15, rotate: -14 }}
      animate={{ opacity: [0, 1, 0], scale: [0.15, 1.15, 1.45], rotate: [reduced ? 0 : -14, reduced ? 0 : 8] }}
      transition={{ duration: reduced ? 0.35 : 0.85, delay: reduced ? 0.1 : burst.delay, ease: 'easeOut' }}
    >
      {burstRays.map((ray) => <i key={ray} style={{ '--ray': ray, '--ray-color': colors[(ray + index) % colors.length] }} />)}
      <b>✦</b><em />
    </motion.span>
  ))
}

function TitleFlowers({ reduced }) {
  return titleFlowers.map((flower, index) => (
    <motion.span
      key={flower.id}
      className={`title-flower ${index > 6 ? 'desktop-celebration' : ''}`}
      style={{ left: `${flower.left}%`, top: `${flower.top}%`, '--title-flower-size': `${flower.size}px`, '--title-flower-color': flower.color }}
      initial={{ x: `${82 - flower.left}vw`, y: `${78 - flower.top}vh`, scale: 0.2, rotate: -45, opacity: 0 }}
      animate={reduced ? { x: 0, y: 0, scale: 0.75, rotate: 0, opacity: 0.7 } : { x: 0, y: 0, scale: 1, rotate: 35 + (index % 4) * 28, opacity: 0.88 }}
      transition={{ duration: reduced ? 0.35 : 2 + (index % 3) * 0.28, delay: reduced ? 0.15 : flower.delay, ease: [0.22, 1, 0.36, 1] }}
    ><i /><i /><i /><i /><b /></motion.span>
  ))
}

export default function CelebrationBurst() {
  const reduced = useReducedMotion()
  return (
    <motion.div className="celebration-layer" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <CornerStreamers reduced={reduced} />
      <motion.span className="burst-ring ring-one" initial={{ scale: 0.2, opacity: 0.8 }} animate={{ scale: 4, opacity: 0 }} transition={{ duration: reduced ? 0.3 : 1.1, ease: 'easeOut' }} />
      <motion.span className="burst-ring ring-two" initial={{ scale: 0.15, opacity: 0.65 }} animate={{ scale: 5, opacity: 0 }} transition={{ duration: reduced ? 0.35 : 1.35, delay: 0.12, ease: 'easeOut' }} />
      <CrackerBursts reduced={reduced} />
      <TitleFlowers reduced={reduced} />
      <Confetti reduced={reduced} />
      <Balloons reduced={reduced} />
    </motion.div>
  )
}
