import { useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import { projects } from '../data/projects'
import { href } from '../lib/router'
import { OutlineTitle } from './About'
import { EASE } from './Motion'

const FEATURED = ['bistro-luma', 'salle-de-bain', 'boutique-empire', 'cuisine-vortek']

export const metaOf = (p) => `${p.type} · ${p.tools[0]}`

// Ligne de projet : entre en glissant depuis la droite, décalée selon son rang.
function Row({ project, index, progress, onEnter }) {
  const reduced = useReducedMotion()
  const x = useTransform(progress, [0, 1], [90 + index * 70, 0])
  return (
    <motion.li className="work-row" style={reduced ? undefined : { x }}>
      <a href={href.project(project.slug)} className="work-link" onPointerEnter={() => onEnter(project.slug)} onFocus={() => onEnter(project.slug)}>
        <img className="work-thumb" src={project.cover} alt="" loading="lazy" />
        <span className="work-name">
          {project.title} {project.script}
        </span>
        <span className="work-meta">{metaOf(project)}</span>
      </a>
    </motion.li>
  )
}

export default function SelectedWork() {
  const list = FEATURED.map((s) => projects.find((p) => p.slug === s))
  const listRef = useRef(null)
  const [active, setActive] = useState(null)
  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start end', 'start 0.35'] })

  // Aperçu flottant qui suit le pointeur avec un léger ressort.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const px = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.5 })
  const py = useSpring(my, { stiffness: 260, damping: 26, mass: 0.5 })
  const current = list.find((p) => p.slug === active)

  const onMove = (e) => {
    const r = listRef.current.getBoundingClientRect()
    const x = e.clientX - r.left
    const y = e.clientY - r.top
    // À la première apparition, l’aperçu se place directement sous le pointeur.
    if (!active) {
      px.jump(x)
      py.jump(y)
    }
    mx.set(x)
    my.set(y)
  }

  return (
    <section className="work" aria-labelledby="work-title">
      <div className="work-inner">
        <OutlineTitle id="work-title" before="Projets" after="choisis" className="outline-title--ink" />

        <div ref={listRef} className="work-list" onPointerMove={onMove} onPointerLeave={() => setActive(null)}>
          <ul>
            {list.map((p, i) => (
              <Row key={p.slug} project={p} index={i} progress={scrollYProgress} onEnter={setActive} />
            ))}
          </ul>

          <AnimatePresence>
            {current && (
              <motion.div
                className="work-preview"
                aria-hidden="true"
                style={{ x: px, y: py }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.35, ease: EASE }}
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.img
                    key={current.slug}
                    src={current.cover}
                    alt=""
                    initial={{ opacity: 0, scale: 1.15 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.45, ease: EASE }}
                  />
                </AnimatePresence>
                <span className="work-view">
                  Voir <ArrowUpRightIcon size={16} weight="regular" />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.a
          className="box-button"
          href={href.page('projets')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        >
          Tous les projets <sup>({String(projects.length).padStart(2, '0')})</sup>
        </motion.a>
      </div>
    </section>
  )
}
