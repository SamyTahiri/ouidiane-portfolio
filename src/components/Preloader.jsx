import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { EASE, EASE_INOUT } from './Motion'

// Écran d’ouverture : compteur « ESPACE UN … ESPACE HUIT » (un par projet),
// puis deux panneaux qui glissent vers le haut pour dévoiler la page.
const WORDS = ['UN', 'DEUX', 'TROIS', 'QUATRE', 'CINQ', 'SIX', 'SEPT', 'HUIT']
const STEP = 170

export default function Preloader({ onReveal }) {
  const [i, setI] = useState(0)
  const [phase, setPhase] = useState('count') // count → name → exit

  useEffect(() => {
    if (phase === 'count') {
      const id = setTimeout(() => (i < WORDS.length - 1 ? setI(i + 1) : setPhase('name')), STEP)
      return () => clearTimeout(id)
    }
    if (phase === 'name') {
      const id = setTimeout(() => {
        setPhase('exit')
        onReveal()
      }, 750)
      return () => clearTimeout(id)
    }
  }, [i, phase, onReveal])

  const label = phase === 'count' ? `Espace ${WORDS[i]}` : 'Ouidiane Rassidi'

  return (
    <AnimatePresence>
      {phase !== 'exit' && (
        <motion.div className="preloader" role="status" aria-live="polite" key="preloader" exit={{ pointerEvents: 'none' }}>
          <motion.div
            className="preloader-panel preloader-panel--mid"
            exit={{ y: '-100%', transition: { duration: 1, ease: EASE_INOUT, delay: 0.18 } }}
          />
          <motion.div
            className="preloader-panel preloader-panel--dark"
            exit={{ y: '-100%', transition: { duration: 1, ease: EASE_INOUT } }}
          >
            <span className="preloader-mask">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={label}
                  className="preloader-label"
                  initial={{ y: '100%' }}
                  animate={{ y: '0%' }}
                  exit={{ y: '-100%' }}
                  transition={{ duration: 0.16, ease: EASE }}
                >
                  {label}
                </motion.span>
              </AnimatePresence>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
