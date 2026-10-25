import { Suspense, lazy, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion'
import Hero from './Hero'
import About from './About'
import SelectedWork from './SelectedWork'
import Footer from './Footer'
import { useReducedMotion } from '../lib/motion'

const ClayScene = lazy(() => import('./ClayScene'))

const hasWebGL = () => {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

export default function Home({ ready }) {
  const reduced = useReducedMotion()
  const [webgl] = useState(hasWebGL)
  // La scène 3D s’efface pendant que la présentation monte, et ne calcule plus une fois cachée.
  const { scrollY } = useScroll()
  const [heroVisible, setHeroVisible] = useState(true)
  useMotionValueEvent(scrollY, 'change', (v) => setHeroVisible(v < window.innerHeight * 1.1))
  const sceneOpacity = useTransform(scrollY, (v) => 1 - Math.min(v / (window.innerHeight * 0.9), 1))

  return (
    <div className="landing">
      {webgl && (
        <motion.div className="clay-layer" aria-hidden="true" style={{ opacity: sceneOpacity }}>
          <Suspense fallback={null}>
            <ClayScene started={ready} active={heroVisible} reduced={reduced} />
          </Suspense>
        </motion.div>
      )}
      {/* Le héros reste épinglé pendant que la présentation glisse par-dessus. */}
      <div className="hero-stack">
        <div className="hero-wrap">
          <Hero ready={ready} />
        </div>
        <About />
      </div>
      <SelectedWork />
      <Footer />
    </div>
  )
}
