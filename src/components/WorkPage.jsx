import { useLayoutEffect, useRef, useState } from 'react'
import { AnimatePresence, LayoutGroup, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'framer-motion'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { projects } from '../data/projects'
import { href } from '../lib/router'
import { Flower } from './About'
import { EASE, SplitWords } from './Motion'
import Footer from './Footer'

const FILTERS = [
  { id: 'tous', label: 'Tous' },
  { id: 'residentiel', label: 'Résidentiel' },
  { id: 'commercial', label: 'Commercial' },
]

// Courbure des cartes selon la vitesse de défilement : les bords se cintrent puis se détendent.
function useBend() {
  const { scrollY } = useScroll()
  const v = useVelocity(scrollY)
  const clamped = useTransform(v, [-2500, 0, 2500], [-1, 0, 1], { clamp: true })
  return useSpring(clamped, { stiffness: 140, damping: 24 })
}

function CurvedCard({ project, index, bend }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const [size, setSize] = useState({ w: 600, h: 400 })
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  const { w, h } = size
  // Bords haut et bas courbés vers le haut (ou le bas) — courbe de Bézier quadratique.
  const clipPath = useTransform(bend, (b) => {
    const k = Math.abs(b) * 46 + 14
    const up = b >= -0.05
    const tc = up ? k : 0
    const tm = up ? 0 : k
    const bc = up ? h : h - k
    const bm = up ? h - k : h
    return `path('M0 ${tc} Q ${w / 2} ${2 * tm - tc} ${w} ${tc} L ${w} ${bc} Q ${w / 2} ${2 * bm - bc} 0 ${bc} Z')`
  })
  const side = index % 2 === 0 ? 'left' : 'right'
  return (
    <motion.li
      className={`curved curved--${side}`}
      layout
      initial={{ opacity: 0, y: 80, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3 } }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE }}
    >
      <motion.a href={href.project(project.slug)} className="curved-link" whileHover="hover">
        <motion.div ref={ref} className="curved-media" style={reduced ? undefined : { clipPath }}>
          <motion.img
            src={project.cover}
            alt=""
            loading="lazy"
            decoding="async"
            variants={{ hover: { scale: 1.06 } }}
            transition={{ duration: 0.9, ease: EASE }}
          />
        </motion.div>
        <span className="curved-tag">
          {project.title} {project.script}
        </span>
        <span className="curved-chip">
          {project.type} · {project.tools[0]}
        </span>
      </motion.a>
    </motion.li>
  )
}

export default function WorkPage() {
  const [filter, setFilter] = useState('tous')
  const list = filter === 'tous' ? projects : projects.filter((p) => p.category === filter)
  const bend = useBend()
  const listRef = useRef(null)
  const [hover, setHover] = useState(false)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const cx = useSpring(mx, { stiffness: 300, damping: 28 })
  const cy = useSpring(my, { stiffness: 300, damping: 28 })

  return (
    <>
      <section className="workpage">
        <h1 className="workpage-statement">
          <SplitWords text="Des intérieurs pensés comme des œuvres à habiter" inView={false} delay={0.2} step={0.06} />
        </h1>
        <div className="workpage-head">
          <motion.span
            className="workpage-rule"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
          />
          <p className="outline-title outline-title--ink workpage-count" aria-label={`${projects.length} projets`}>
            <span>Projets</span>
            <Flower />
            <span>({String(projects.length).padStart(2, '0')})</span>
          </p>
        </div>

        <div className="filters" role="group" aria-label="Filtrer les projets">
          <LayoutGroup>
            {FILTERS.map((f) => (
              <button key={f.id} type="button" className="filter" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                {filter === f.id && <motion.span layoutId="filter-active" className="filter-bg" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
                <span className="filter-label">{f.label}</span>
              </button>
            ))}
          </LayoutGroup>
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} projets affichés
        </p>

        <ul
          ref={listRef}
          className="curved-list"
          onPointerMove={(e) => {
            if (e.pointerType !== 'mouse') return
            mx.set(e.clientX)
            my.set(e.clientY)
          }}
          onPointerOver={(e) => {
            const on = !!e.target.closest('.curved-link')
            // Le curseur « Voir » apparaît directement sous le pointeur.
            if (on && !hover) {
              mx.set(e.clientX)
              my.set(e.clientY)
              cx.jump(e.clientX)
              cy.jump(e.clientY)
            }
            setHover(on)
          }}
          onPointerLeave={() => setHover(false)}
        >
          <AnimatePresence mode="popLayout">
            {list.map((p) => (
              <CurvedCard key={p.slug} project={p} index={projects.indexOf(p)} bend={bend} />
            ))}
          </AnimatePresence>
        </ul>

        <AnimatePresence>
          {hover && (
            <motion.span
              className="cursor-view"
              aria-hidden="true"
              style={{ x: cx, y: cy }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              Voir <ArrowUpRightIcon size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </section>
      <Footer />
    </>
  )
}
