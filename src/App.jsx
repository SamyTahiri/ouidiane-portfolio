import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import Header from './components/Header'
import Home from './components/Home'
import Preloader from './components/Preloader'
import ProjectPage from './components/ProjectPage'
import { AboutPage, ContactPage, VitrinesPage } from './components/Pages'
import WorkPage from './components/WorkPage'
import { LightboxProvider } from './components/Lightbox'
import { EASE_INOUT } from './components/Motion'
import { projects } from './data/projects'
import { routeKey, useRoute } from './lib/router'
import { prefersReducedMotion } from './lib/motion'

const SITE = 'Ouidiane Rassidi'
const TITLES = {
  home: `${SITE} — Décoration d’intérieur et présentation visuelle`,
  projets: `Projets — ${SITE}`,
  vitrines: `Vitrines — ${SITE}`,
  'a-propos': `À propos — ${SITE}`,
  contact: `Contact — ${SITE}`,
}

// Le préchargeur ne s’affiche qu’une fois par session, et jamais en mouvement réduit.
const shouldPreload = () => {
  if (prefersReducedMotion()) return false
  try {
    return !sessionStorage.getItem('or-intro')
  } catch {
    return true
  }
}

function Page({ route, ready }) {
  switch (route.name) {
    case 'project':
      return <ProjectPage slug={route.slug} />
    case 'projets':
      return <WorkPage />
    case 'vitrines':
      return <VitrinesPage />
    case 'a-propos':
      return <AboutPage />
    case 'contact':
      return <ContactPage />
    default:
      return <Home ready={ready} />
  }
}

// Rideau de transition : couvre l’ancienne page à la sortie, se retire de la nouvelle à l’entrée.
function Curtains() {
  return (
    <>
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={{ y: '0%' }}
        animate={{ y: '-100%', transitionEnd: { visibility: 'hidden' }, transition: { duration: 0.8, ease: EASE_INOUT, delay: 0.05 } }}
        exit={{ y: '-100%' }}
      />
      <motion.div
        className="curtain"
        aria-hidden="true"
        initial={{ y: '100%', visibility: 'hidden' }}
        animate={{ y: '100%', visibility: 'hidden' }}
        exit={{ y: '0%', visibility: 'visible', transition: { duration: 0.6, ease: EASE_INOUT } }}
      >
        <span>{SITE}</span>
      </motion.div>
    </>
  )
}

export default function App() {
  const route = useRoute()
  const key = routeKey(route)
  const [preload] = useState(shouldPreload)
  const [ready, setReady] = useState(!preload)
  const main = useRef(null)

  const reveal = useCallback(() => {
    setReady(true)
    try {
      sessionStorage.setItem('or-intro', '1')
    } catch {
      /* stockage indisponible : le préchargeur réapparaîtra, sans gravité */
    }
  }, [])

  useEffect(() => {
    if (route.name === 'project') {
      const p = projects.find((x) => x.slug === route.slug)
      document.title = p ? `${p.title} ${p.script} — ${SITE}` : SITE
    } else {
      document.title = TITLES[route.name] || SITE
    }
  }, [route])

  return (
    <MotionConfig reducedMotion="user">
      <LightboxProvider>
        <a className="skip-link" href="#contenu" onClick={(e) => { e.preventDefault(); main.current?.focus() }}>
          Aller au contenu
        </a>
        {preload && <Preloader onReveal={reveal} />}
        <Header route={route} />
        <main id="contenu" ref={main} tabIndex={-1}>
          <AnimatePresence
            mode="wait"
            initial={false}
            onExitComplete={() => {
              // Nouvelle page : retour en haut et focus pour les lecteurs d’écran.
              window.scrollTo(0, 0)
              main.current?.focus({ preventScroll: true })
            }}
          >
            <motion.div key={key} className="page-shell">
              <Page route={route} ready={ready} />
              <Curtains />
            </motion.div>
          </AnimatePresence>
        </main>
      </LightboxProvider>
    </MotionConfig>
  )
}
