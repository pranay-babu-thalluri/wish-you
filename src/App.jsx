import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import HangingBulb from './components/HangingBulb'
import BirthdayCard from './components/BirthdayCard'
import BirthdayCalendar from './components/BirthdayCalendar'
import FloatingDecorations from './components/FloatingDecorations'
import MusicControl from './components/MusicControl'
import CelebrationBurst from './components/CelebrationBurst'
import CinematicTitle from './components/CinematicTitle'
import MemoryQuoteCard from './components/MemoryQuoteCard'
import PhotoMemories from './components/PhotoMemories'
import RoseCurtainTransition from './components/RoseCurtainTransition'
import BirthdayEnvelope from './components/BirthdayEnvelope'
import FullScreenLetter from './components/FullScreenLetter'
import FlyingButterflies from './components/FlyingButterflies'
import './App.css'

const AUDIO_SOURCE = '/audio/AUDIO-2026-07-19-00-23-56_6523.mp3'
const LETTER_AUDIO_SOURCE = '/audio/reel-DP_b6OkD-az_7983.mp3'

function BirthdayExperience() {
  const [phase, setPhase] = useState('dark')
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0)
  const [photoDirection, setPhotoDirection] = useState(1)
  const audioRef = useRef(null)
  const audioSourceRef = useRef(AUDIO_SOURCE)
  const timersRef = useRef(new Set())
  const fadeTimerRef = useRef(null)
  const titleHoldStartedRef = useRef(false)
  const reduceMotion = useReducedMotion()
  const isLit = phase !== 'dark'

  const clearTimers = useCallback(() => {
    timersRef.current.forEach((timer) => window.clearTimeout(timer))
    timersRef.current.clear()
    window.clearInterval(fadeTimerRef.current)
  }, [])

  const schedule = useCallback((callback, delay) => {
    const timer = window.setTimeout(() => {
      timersRef.current.delete(timer)
      callback()
    }, delay)
    timersRef.current.add(timer)
    return timer
  }, [])

  useEffect(() => {
    const audio = new Audio(AUDIO_SOURCE)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0
    audioRef.current = audio
    return () => {
      clearTimers()
      audio.pause()
      audio.src = ''
    }
  }, [clearTimers])

  const fadeMusicIn = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    window.clearInterval(fadeTimerRef.current)
    const target = 0.32
    const step = reduceMotion ? target : 0.025
    fadeTimerRef.current = window.setInterval(() => {
      if (audio.volume >= target - step) {
        audio.volume = target
        window.clearInterval(fadeTimerRef.current)
      } else audio.volume = Math.min(target, audio.volume + step)
    }, reduceMotion ? 20 : 90)
  }, [reduceMotion])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const nextSource = phase === 'letter' ? LETTER_AUDIO_SOURCE : AUDIO_SOURCE
    if (audioSourceRef.current === nextSource) return

    const shouldResume = isMusicPlaying
    window.clearInterval(fadeTimerRef.current)
    audio.pause()
    audio.src = nextSource
    audio.currentTime = 0
    audio.volume = 0
    audio.load()
    audioSourceRef.current = nextSource

    if (!shouldResume) return

    void audio.play()
      .then(() => fadeMusicIn())
      .catch(() => setIsMusicPlaying(false))
  }, [fadeMusicIn, isMusicPlaying, phase])

  const startMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !audio.paused) return
    try {
      await audio.play()
      setIsMusicPlaying(true)
      fadeMusicIn()
    } catch {
      setIsMusicPlaying(false)
    }
  }, [fadeMusicIn])

  const lightUp = useCallback(() => {
    if (phase !== 'dark') return
    setPhase('lighting')
    void startMusic()
  }, [phase, startMusic])

  const toggleMusic = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) {
      try {
        await audio.play()
        setIsMusicPlaying(true)
        fadeMusicIn()
      } catch {
        setIsMusicPlaying(false)
      }
      return
    }
    window.clearInterval(fadeTimerRef.current)
    audio.pause()
    setIsMusicPlaying(false)
  }, [fadeMusicIn])

  const calendarSettled = useCallback(() => {
    if (phase !== 'calendarEntering') return
    setPhase('calendarReveal')
    schedule(() => setPhase('calendarMessage'), reduceMotion ? 180 : 950)
  }, [phase, reduceMotion, schedule])

  const openCalendarSurprise = useCallback(() => {
    if (phase === 'calendarMessage') setPhase('calendarToGift')
  }, [phase])

  const finishCalendarTransition = useCallback(() => {
    if (phase === 'calendarToGift') setPhase('cinematicTitle')
  }, [phase])

  const startRoseTransition = useCallback(() => {
    if (phase === 'memoryQuoteCard') setPhase('roseFall')
  }, [phase])

  const finishRoseCover = useCallback(() => {
    if (phase === 'roseFall') setPhase('roseCovered')
  }, [phase])

  const openRoseCurtain = useCallback(() => {
    if (phase === 'roseCovered') setPhase('roseCurtainOpening')
  }, [phase])

  const finishRoseCurtain = useCallback(() => {
    if (phase === 'roseCurtainOpening') setPhase('photoMemories')
  }, [phase])

  const navigatePhotoMemory = useCallback((direction) => {
    if (phase !== 'photoMemories') return
    const nextIndex = currentPhotoIndex + direction
    if (nextIndex < 0) return
    const leavingGallery = nextIndex > 4
    setPhotoDirection(direction)
    setPhase('photoTransition')
    schedule(() => {
      if (leavingGallery) {
        setPhase('envelopeEntering')
        return
      }
      setCurrentPhotoIndex(nextIndex)
      setPhase('photoMemories')
    }, reduceMotion ? 220 : 680)
  }, [currentPhotoIndex, phase, reduceMotion, schedule])

  const holdCompletedTitle = useCallback(() => {
    if (phase !== 'cinematicTitle' || titleHoldStartedRef.current) return
    titleHoldStartedRef.current = true
    setPhase('titleHolding')
    schedule(() => {
      setCurrentPhotoIndex(0)
      setPhase('memoryQuoteCard')
    }, reduceMotion ? 1100 : 4000)
  }, [phase, reduceMotion, schedule])

  const titlePhases = ['cinematicTitle', 'titleHolding']
  const birthdayScreenPhases = [...titlePhases, 'birthdayFinale']
  const calendarPhases = ['calendarEntering', 'calendarReveal', 'calendarMessage', 'calendarToGift']
  const rosePhases = ['roseFall', 'roseCovered', 'roseCurtainOpening']
  const photoPhases = ['photoMemories', 'photoTransition']
  const showCelebration = birthdayScreenPhases.includes(phase)
  const envelopePhases = ['envelopeEntering', 'waitingForEnvelope', 'envelopeOpening']
  const isCalm = calendarPhases.includes(phase) || rosePhases.includes(phase) || photoPhases.includes(phase) || envelopePhases.includes(phase) || phase === 'letter'
  const isCalendar = calendarPhases.includes(phase)
  const isBulbScene = ['dark', 'lighting', 'cardEntering', 'waitingForCalendar'].includes(phase)
  const showInitialBackground = ['cardEntering', 'waitingForCalendar'].includes(phase)
  const isBirthdayReveal = birthdayScreenPhases.includes(phase)

  return (
    <motion.main className={`experience ${isLit ? 'is-lit' : ''} ${isCalm ? 'is-calm' : ''} ${isCalendar ? 'is-calendar' : ''} ${isBulbScene ? 'is-bulb-scene' : ''} ${showInitialBackground ? 'has-initial-background' : ''} ${isBirthdayReveal ? 'is-birthday-reveal' : ''}`} animate={{ backgroundColor: showInitialBackground || isBirthdayReveal ? '#eadde9' : '#080b0f' }} transition={{ duration: reduceMotion ? 0.2 : 1.3, ease: 'easeInOut' }}>
      <div className="ambient-gradient" aria-hidden="true" />
      <AnimatePresence>{isLit && !isBulbScene && <FloatingDecorations />}</AnimatePresence>
      <AnimatePresence>
        {['dark', 'lighting', 'cardEntering', 'waitingForCalendar'].includes(phase) && (
          <HangingBulb isLit={isLit} isDocked={showInitialBackground} onLightUp={lightUp} onDocked={() => phase === 'lighting' && setPhase('cardEntering')} />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {['cardEntering', 'waitingForCalendar'].includes(phase) && (
          <BirthdayCard
            key="tap-me-card"
            phase={phase}
            onSettled={() => phase === 'cardEntering' && setPhase('waitingForCalendar')}
            onSurprise={() => phase === 'waitingForCalendar' && setPhase('calendarEntering')}
          />
        )}
        {calendarPhases.includes(phase) && (
          <BirthdayCalendar
            key="birthday-calendar"
            phase={phase}
            onEntered={calendarSettled}
            onContinue={openCalendarSurprise}
            onGiftTransitionComplete={finishCalendarTransition}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>{showCelebration && <CelebrationBurst />}</AnimatePresence>
      <AnimatePresence>{birthdayScreenPhases.includes(phase) && <CinematicTitle onComplete={phase === 'cinematicTitle' ? holdCompletedTitle : undefined} />}</AnimatePresence>
      <AnimatePresence>{['memoryQuoteCard', 'roseFall'].includes(phase) && <MemoryQuoteCard onContinue={startRoseTransition} isPressed={phase === 'roseFall'} />}</AnimatePresence>
      <AnimatePresence>
        {(photoPhases.includes(phase) || phase === 'roseCurtainOpening') && <PhotoMemories currentPhotoIndex={currentPhotoIndex} direction={photoDirection} phase={phase} onNavigate={navigatePhotoMemory} curtainReveal={phase === 'roseCurtainOpening'} />}
      </AnimatePresence>
      <AnimatePresence>
        {rosePhases.includes(phase) && <RoseCurtainTransition phase={phase} onCovered={finishRoseCover} onOpen={openRoseCurtain} onOpened={finishRoseCurtain} />}
      </AnimatePresence>
      <AnimatePresence>
        {envelopePhases.includes(phase) && (
          <BirthdayEnvelope
            phase={phase}
            onSettled={() => phase === 'envelopeEntering' && setPhase('waitingForEnvelope')}
            onOpen={() => phase === 'waitingForEnvelope' && setPhase('envelopeOpening')}
            onOpened={() => phase === 'envelopeOpening' && setPhase('letter')}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>{phase === 'letter' && <FullScreenLetter onShowBirthday={() => setPhase('birthdayFinale')} />}</AnimatePresence>
      <AnimatePresence>{isLit && <MusicControl isPlaying={isMusicPlaying} onToggle={toggleMusic} />}</AnimatePresence>
      <FlyingButterflies />
    </motion.main>
  )
}

export default function App() {
  return <BirthdayExperience />
}
