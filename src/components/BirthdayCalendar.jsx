import { useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const augustDays = [
  ...Array.from({ length: 6 }, (_, index) => ({ id: `blank-${index}`, day: null })),
  ...Array.from({ length: 31 }, (_, index) => ({ id: `day-${index + 1}`, day: index + 1 })),
]

const dateSparkles = [
  { x: -29, y: -22, delay: 0 },
  { x: 28, y: -18, delay: 0.08 },
  { x: 33, y: 17, delay: 0.16 },
  { x: -31, y: 20, delay: 0.24 },
  { x: 3, y: -31, delay: 0.12 },
  { x: 7, y: 31, delay: 0.2 },
]

const calendarBalloons = [
  { left: 7, color: '#c6a7ed', delay: 0 },
  { left: 18, color: '#f2b1c7', delay: .5 },
  { left: 34, color: '#f6c08e', delay: 1.1 },
  { left: 67, color: '#d5b4ee', delay: .3 },
  { left: 82, color: '#efa5b9', delay: .85 },
  { left: 93, color: '#f4c496', delay: 1.35 },
]

function CalendarCelebration({ reduced }) {
  return (
    <motion.div className="calendar-celebration" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {calendarBalloons.map((balloon, index) => (
        <motion.span
          className="calendar-party-balloon"
          key={balloon.left}
          style={{ left: `${balloon.left}%`, '--calendar-balloon': balloon.color }}
          initial={{ y: '105vh', opacity: 0 }}
          animate={reduced ? { y: '62vh', opacity: .55 } : { y: ['105vh', '48vh', '-24vh'], x: [0, index % 2 ? 22 : -18, 0], opacity: [0, .78, .78, 0] }}
          transition={{ duration: reduced ? .4 : 6.2 + index * .35, delay: balloon.delay, repeat: reduced ? 0 : Infinity, repeatDelay: 1.2, ease: 'linear' }}
        />
      ))}
      {[12, 27, 74, 89].map((left, index) => (
        <motion.i className="calendar-party-bubble" key={left} style={{ left: `${left}%`, top: `${18 + (index % 2) * 48}%` }} animate={reduced ? undefined : { y: [12, -20, 12], scale: [1, 1.15, 1] }} transition={{ duration: 3.8 + index, repeat: Infinity, ease: 'easeInOut' }} />
      ))}
      {Array.from({ length: 18 }, (_, index) => (
        <motion.em
          className={`calendar-confetti calendar-confetti-${index % 3}`}
          key={`calendar-confetti-${index}`}
          style={{ left: `${3 + ((index * 29) % 94)}%`, '--calendar-confetti-color': ['#d39adf', '#f3a3b8', '#eda45f', '#9d87db'][index % 4] }}
          initial={{ y: '-8vh', opacity: 0, rotate: 0 }}
          animate={reduced ? { opacity: [0, .7, 0], y: [0, 45] } : { y: ['-8vh', '108vh'], x: [0, (index % 2 ? 1 : -1) * (18 + index)], opacity: [0, .9, .9, 0], rotate: [0, 220 + index * 18] }}
          transition={{ duration: reduced ? .65 : 4.2 + (index % 5) * .35, delay: (index % 7) * .18, repeat: reduced ? 0 : Infinity, repeatDelay: 1.4, ease: 'linear' }}
        />
      ))}
      {[{ left: 16, top: 28 }, { left: 84, top: 25 }, { left: 88, top: 72 }].map((burst, index) => (
        <motion.b className="calendar-cracker" key={burst.left} style={{ left: `${burst.left}%`, top: `${burst.top}%` }} initial={{ opacity: 0, scale: .2 }} animate={{ opacity: [0, 1, 0], scale: [.2, 1.25, 1.6], rotate: [0, index % 2 ? 18 : -18] }} transition={{ duration: reduced ? .4 : 1.05, delay: .35 + index * .55, repeat: reduced ? 0 : Infinity, repeatDelay: 3.2 }}>✦</motion.b>
      ))}
    </motion.div>
  )
}

function FloralCorner({ className }) {
  return <span className={`calendar-flower ${className}`} aria-hidden="true"><i /><i /><i /><i /><b /></span>
}

export default function BirthdayCalendar({ phase, onEntered, onContinue, onGiftTransitionComplete }) {
  const reduced = useReducedMotion()
  const enteredRef = useRef(false)
  const giftTransitionRef = useRef(false)
  const highlighted = phase === 'calendarMessage' || phase === 'calendarToGift'
  const transitioning = phase === 'calendarToGift'

  const completeCalendarMotion = () => {
    if (phase === 'calendarEntering' && !enteredRef.current) {
      enteredRef.current = true
      onEntered()
    }
    if (transitioning && !giftTransitionRef.current) {
      giftTransitionRef.current = true
      onGiftTransitionComplete()
    }
  }

  const activateContinue = () => {
    if (phase === 'calendarMessage') onContinue()
  }

  const handleContinueKeyDown = (event) => {
    if (!['Enter', ' ', 'Space', 'Spacebar'].includes(event.key)) return
    event.preventDefault()
    activateContinue()
  }

  return (
    <motion.section className="calendar-scene" aria-label="August birthday calendar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduced ? 0.18 : 0.5 }}>
      <motion.div className="calendar-screen-dim" aria-hidden="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: reduced ? 0.15 : 0.55 }} />
      <AnimatePresence>{highlighted && <CalendarCelebration reduced={reduced} />}</AnimatePresence>

      <motion.article
        className="birthday-calendar"
        initial={{ y: reduced ? 15 : -95, opacity: 0, rotate: reduced ? 0 : -5, rotateX: reduced ? 0 : 18, scale: reduced ? 0.98 : 0.84 }}
        animate={transitioning
          ? { y: reduced ? -12 : -80, opacity: 0, rotate: reduced ? 0 : 2.5, rotateX: reduced ? 0 : 15, scale: reduced ? 0.96 : 0.82 }
          : { y: 0, opacity: 1, rotate: 0, rotateX: 0, scale: 1 }}
        transition={transitioning
          ? { duration: reduced ? 0.24 : 0.82, ease: [0.4, 0, 0.2, 1] }
          : { type: reduced ? 'tween' : 'spring', duration: reduced ? 0.22 : undefined, stiffness: 96, damping: 17, mass: 0.92 }}
        onAnimationComplete={completeCalendarMotion}
      >
        <FloralCorner className="calendar-flower-one" />
        <FloralCorner className="calendar-flower-two" />

        <header className="calendar-header">
          <span className="calendar-keepsake">A month worth remembering</span>
          <h2>August</h2>
          <span className="calendar-year">11 · NIKITHA</span>
        </header>

        <div className="calendar-grid" role="grid" aria-label="August monthly calendar">
          {weekdays.map((weekday) => <div className="calendar-weekday" role="columnheader" key={weekday}>{weekday}</div>)}
          {augustDays.map(({ id, day }) => {
            if (!day) return <div className="calendar-day is-empty" role="gridcell" aria-hidden="true" key={id} />
            const birthday = day === 11
            return (
              <div
                className={`calendar-day ${birthday ? 'birthday-date' : ''} ${birthday && highlighted ? 'is-highlighted' : ''}`}
                role="gridcell"
                aria-current={birthday ? 'date' : undefined}
                aria-label={birthday ? 'August 11, Nikitha’s birthday' : `August ${day}`}
                key={id}
              >
                {birthday && <motion.span className="birthday-ring" aria-hidden="true" initial={false} animate={highlighted ? { opacity: [0, 0.62, 0], scale: [0.72, 1.45, 1.75] } : { opacity: 0, scale: 0.72 }} transition={{ duration: reduced ? 0.35 : 1.35 }} />}
                <motion.span className="calendar-day-number" animate={birthday && highlighted ? { scale: reduced ? 1.05 : [1, 1.2, 1.08] } : { scale: 1 }} transition={{ duration: reduced ? 0.25 : 0.7, ease: 'easeOut' }}>{day}</motion.span>
                {birthday && (
                  <>
                    <motion.span className="birthday-visible-icon" aria-hidden="true" initial={{ opacity: 0, scale: 0 }} animate={highlighted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0 }} transition={{ delay: reduced ? 0 : 0.18 }}>♥</motion.span>
                    <motion.span className="special-day-label" initial={{ opacity: 0, y: 3 }} animate={highlighted ? { opacity: 1, y: 0 } : { opacity: 0, y: 3 }} transition={{ delay: reduced ? 0 : 0.25 }}>Her special day</motion.span>
                    {!reduced && highlighted && <span className="date-sparkles" aria-hidden="true">{dateSparkles.map((sparkle, index) => <motion.i key={index} style={{ '--sparkle-x': `${sparkle.x}px`, '--sparkle-y': `${sparkle.y}px` }} initial={{ opacity: 0, x: 0, y: 0, scale: 0 }} animate={{ opacity: [0, 1, 0], x: sparkle.x, y: sparkle.y, scale: [0, 1, 0] }} transition={{ duration: 0.7, delay: sparkle.delay }} />)}</span>}
                  </>
                )}
              </div>
            )
          })}
        </div>

        <motion.div className="calendar-message" aria-live="polite" initial={false} animate={highlighted ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }} transition={{ duration: reduced ? 0.2 : 0.55, delay: reduced ? 0 : 0.55 }}>
          <p className="calendar-message-date">August 11</p>
          <p>The day the world became a little more beautiful.</p>
          <span>And the reason this little celebration exists.</span>
          <motion.button
            type="button"
            className="calendar-continue-button"
            disabled={!highlighted || transitioning}
            onClick={activateContinue}
            onKeyDown={handleContinueKeyDown}
            initial={false}
            animate={highlighted && !transitioning ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ delay: reduced ? 0 : 0.82, duration: 0.4 }}
          >Open the surprise <span aria-hidden="true">→</span></motion.button>
        </motion.div>
      </motion.article>

      {transitioning && (
        <motion.div className="calendar-transform-tag" aria-hidden="true" initial={{ opacity: 0, y: -10, rotate: -4, scale: 1.08 }} animate={{ opacity: [0, 1, 1, 0], y: [0, 32, 145, 190], rotate: [-4, 4, 7, 7], scale: [1.08, 1, 0.82, 0.72] }} transition={{ duration: reduced ? 0.24 : 0.85, times: [0, 0.2, 0.78, 1], ease: 'easeInOut' }}>
          <span>11 AUG</span>
          <small>For Nikitha</small>
        </motion.div>
      )}
    </motion.section>
  )
}
