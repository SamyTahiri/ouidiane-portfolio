import { motion, useScroll, useTransform } from 'framer-motion'
import { EASE } from './Motion'
import { prefersReducedMotion } from '../lib/motion'

// Titre monumental posé en bas de l’écran, en lignes décalées.
// Deux découpages : trois lignes sur grand écran, quatre sur téléphone.
const SETS = {
  wide: [
    { text: 'L’art de', indent: '6%' },
    { text: 'décorer', indent: '34%' },
    { text: 'chaque espace', indent: '0%' },
  ],
  narrow: [
    { text: 'L’art de', indent: '0%' },
    { text: 'décorer', indent: '22%' },
    { text: 'chaque', indent: '6%' },
    { text: 'espace', indent: '30%' },
  ],
}

function Lines({ lines, ready, set }) {
  let n = 0
  return (
    <span className={`hero-set hero-set--${set}`} aria-hidden="true">
      {lines.map((l) => (
        <span key={l.text} className="hero-line" style={{ '--indent': l.indent }}>
          {l.text.split('').map((ch, i) => {
            const k = n++
            return (
              <motion.span
                key={i}
                className="hero-char"
                initial={{ y: '110%', rotate: 6 }}
                animate={ready ? { y: '0%', rotate: 0 } : undefined}
                transition={{ duration: 1.2, ease: EASE, delay: 0.35 + k * 0.035 }}
              >
                {ch === ' ' ? '\u00a0' : ch}
              </motion.span>
            )
          })}
        </span>
      ))}
    </span>
  )
}

export default function Hero({ ready }) {
  // Pendant que la présentation recouvre le héros, le titre bascule en arrière et s’estompe.
  const { scrollY } = useScroll()
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900
  const rotateX = useTransform(scrollY, [0, vh], [0, 22])
  const scale = useTransform(scrollY, [0, vh], [1, 0.84])
  const opacity = useTransform(scrollY, [0, vh * 0.9], [1, 0.15])
  return (
    <section className="hero" aria-labelledby="hero-title">
      <motion.h1 id="hero-title" className="hero-title" style={{ rotateX, scale, opacity, transformPerspective: 1100, transformOrigin: '50% 100%' }}>
        <span className="sr-only">Ouidiane Rassidi — L’art de décorer chaque espace</span>
        <Lines lines={SETS.wide} ready={ready} set="wide" />
        <Lines lines={SETS.narrow} ready={ready} set="narrow" />
      </motion.h1>
      <motion.button
        type="button"
        className="scroll-cue"
        aria-label="Défiler vers la présentation"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={ready ? { opacity: 1, scale: 1 } : undefined}
        transition={{ duration: 0.6, ease: EASE, delay: 1.6 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        onClick={() => document.getElementById('presentation')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 6v12M7 13l5 5 5-5" />
        </svg>
      </motion.button>
    </section>
  )
}
