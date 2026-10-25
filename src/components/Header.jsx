import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { href } from '../lib/router'
import { EASE } from './Motion'

const LINKS = [
  { id: 'projets', label: 'Projets' },
  { id: 'vitrines', label: 'Vitrines' },
  { id: 'a-propos', label: 'À propos' },
  { id: 'contact', label: 'Contact' },
]

export default function Header({ route }) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  // Le menu mobile se referme dès que la route change.
  const [openFor, setOpenFor] = useState(null)
  const open = openFor === route
  const { scrollY } = useScroll()

  // L’en-tête se cache en descendant et réapparaît en remontant.
  useMotionValueEvent(scrollY, 'change', (v) => {
    const prev = scrollY.getPrevious() ?? 0
    setScrolled(v > window.innerHeight * 0.6)
    setHidden(v > 240 && v > prev + 4)
    if (v < prev - 4) setHidden(false)
  })

  const current = route.name === 'project' ? 'projets' : route.name
  const home = route.name === 'home'

  return (
    <motion.header
      className={`site-header${scrolled ? ' is-scrolled' : ''}`}
      animate={{ y: hidden && !open ? '-110%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <div className="brand-block">
        <a className="brand" href={href.home} aria-label="Ouidiane Rassidi — accueil">
          Ouidiane Rassidi
        </a>
        <AnimatePresence>
          {home && !scrolled && (
            <motion.p
              className="brand-tagline"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              Décoration d’intérieur
              <br />
              et présentation visuelle
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <nav className="nav-desktop" aria-label="Navigation principale">
        <ul>
          {LINKS.map((l) => (
            <li key={l.id}>
              <a href={href.page(l.id)} aria-current={current === l.id ? 'page' : undefined}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="menu-toggle"
        aria-expanded={open}
        aria-controls="nav-mobile"
        onClick={() => setOpenFor(open ? null : route)}
      >
        {open ? 'Fermer' : 'Menu'}
      </button>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="nav-mobile"
            className="nav-mobile"
            aria-label="Navigation principale"
            initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.4, ease: EASE } }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <ul>
              {LINKS.map((l, i) => (
                <li key={l.id} className="nav-mobile-item">
                  <motion.a
                    href={href.page(l.id)}
                    aria-current={current === l.id ? 'page' : undefined}
                    initial={{ y: '110%' }}
                    animate={{ y: '0%' }}
                    transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.06 }}
                  >
                    {l.label}
                  </motion.a>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
