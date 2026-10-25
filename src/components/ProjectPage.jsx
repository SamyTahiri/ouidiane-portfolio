import { Suspense, lazy, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDownIcon, ArrowUpRightIcon } from '@phosphor-icons/react'
import { projects } from '../data/projects'
import { href } from '../lib/router'
import { useLightbox } from './Lightbox'
import { EASE, Reveal, SplitWords } from './Motion'
import { OutlineTitle } from './About'
import Footer from './Footer'

const ModelViewer = lazy(() => import('./ModelViewer'))

// Recomposition de la planche d’ambiance du portfolio imprimé (positions en % de la page).
function Moodboard() {
  const pieces = [
    { src: '/images/salon/cuir.webp', cls: 'mb-swatch', style: { left: '2%', top: '12%', width: '10%' } },
    { src: '/images/salon/bois.webp', cls: 'mb-swatch', style: { left: '6%', top: '22%', width: '10%' } },
    { src: '/images/salon/tapis.webp', cls: 'mb-swatch', style: { left: '11%', top: '31%', width: '10%' } },
    { src: '/images/salon/tableau.webp', cls: 'mb-art', style: { left: '45%', top: '20%', width: '38%' } },
    { src: '/images/salon/suspension.webp', cls: 'mb-float', style: { left: '60%', top: '6%', width: '8%' } },
    { src: '/images/salon/fauteuil.webp', cls: 'mb-float', style: { left: '1%', top: '48%', width: '21%' } },
    { src: '/images/salon/canape.webp', cls: 'mb-float', style: { left: '13%', top: '54%', width: '76%' } },
    { src: '/images/salon/lampe.webp', cls: 'mb-float', style: { left: '86%', top: '45%', width: '10%' } },
  ]
  return (
    <div className="moodboard" role="img" aria-label="Planche d’ambiance du salon : fauteuil club en cuir, canapé capitonné cognac, table basse en bois et métal, œuvre abstraite rouille et turquoise, suspensions ambrées, lampe en laiton, échantillons de cuir, bois et bouclé">
      {pieces.map((p, i) => (
        <motion.img
          key={p.src}
          src={p.src}
          alt=""
          className={p.cls}
          style={p.style}
          initial={{ opacity: 0, y: 40, rotate: i % 2 ? 3 : -3 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.09 }}
        />
      ))}
      {[
        { left: '22%', c: '#5b2e12', flip: false },
        { left: '33%', c: '#5a1f22', flip: true },
      ].map((m) => (
        <motion.span
          key={m.left}
          className={`mb-moon${m.flip ? ' mb-moon--flip' : ''}`}
          style={{ left: m.left, top: '35%', '--c': m.c }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 160, damping: 14, delay: 1.2 }}
        />
      ))}
    </div>
  )
}

// Image qui grandit en entrant dans l’écran, comme sur une page d’étude de cas.
function GrowImage({ image, onOpen, priority = false }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center center'] })
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1])
  const radius = useTransform(scrollYProgress, [0, 1], [48, 24])
  return (
    <motion.button ref={ref} type="button" className="grow-image" onClick={onOpen} style={reduced ? undefined : { scale, borderRadius: radius }}>
      <img src={image.src} alt={image.alt} width={image.w} height={image.h} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} />
      <span className="grow-hint" aria-hidden="true">
        Agrandir
      </span>
    </motion.button>
  )
}

function Viewer3D({ project, loaded, onLoad }) {
  if (!project.model) {
    if (!import.meta.env.DEV) return null
    return (
      <section id="visite" className="case-block" aria-labelledby="visite-title">
        <OutlineTitle id="visite-title" before="Visite" after="3D" className="outline-title--ink outline-title--sm" />
        <div className="viewer-placeholder">
          <p>Modèle 3D à venir</p>
          <code>public/models/{project.slug}.glb</code>
        </div>
      </section>
    )
  }
  return (
    <section id="visite" className="case-block" aria-labelledby="visite-title">
      <OutlineTitle id="visite-title" before="Visite" after="3D" className="outline-title--ink outline-title--sm" />
      {loaded ? (
        <Suspense fallback={<div className="viewer viewer--loading" role="status">Préparation de la visite…</div>}>
          <ModelViewer url={project.model} title={`${project.title} ${project.script}`} />
        </Suspense>
      ) : (
        <div className="viewer-poster" style={{ backgroundImage: `url(${project.cover})` }}>
          <motion.button type="button" className="box-button box-button--solid" onClick={onLoad} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            Explorer la pièce en 3D <ArrowUpRightIcon size={18} />
          </motion.button>
        </div>
      )}
    </section>
  )
}

export default function ProjectPage({ slug }) {
  const open = useLightbox()
  const reduced = useReducedMotion()
  const [loaded3d, setLoaded3d] = useState(false)
  const index = projects.findIndex((p) => p.slug === slug)
  const project = projects[index]

  if (!project) {
    return (
      <section className="page notfound">
        <h1 className="case-title">Projet introuvable</h1>
        <p className="lead">Ce projet n’existe pas ou a été déplacé.</p>
        <a className="box-button" href={href.page('projets')}>
          Voir tous les projets
        </a>
      </section>
    )
  }

  const next = projects[(index + 1) % projects.length]
  const gallery = project.gallery.map((g) => ({ ...g, caption: g.alt }))
  const [hero, ...rest] = gallery

  const goTo3d = () => {
    setLoaded3d(true)
    document.getElementById('visite')?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
  }

  return (
    <>
      <article className="case">
        <header className="case-head">
          <a className="case-back" href={href.page('projets')}>
            ← Tous les projets
          </a>
          <h1 className="case-title">
            <SplitWords text={`${project.title} ${project.script}`} inView={false} delay={0.25} step={0.07} />
          </h1>
        </header>

        {project.moodboard ? <Moodboard /> : hero && <GrowImage image={hero} onOpen={() => open(gallery, 0)} priority />}

        {project.model && (
          <Reveal className="case-cta">
            <motion.button type="button" className="box-button" onClick={goTo3d} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              Explorer en 3D <ArrowUpRightIcon size={18} />
            </motion.button>
          </Reveal>
        )}

        <div className="case-info">
          <Reveal className="case-meta">
            <dl>
              <div>
                <dt>Catégorie</dt>
                <dd>{project.category === 'commercial' ? 'Commercial' : 'Résidentiel'}</dd>
              </div>
              <div>
                <dt>Type</dt>
                <dd>{project.type}</dd>
              </div>
              <div className="case-meta-wide">
                <dt>Outils</dt>
                <dd>{project.tools.join(', ')}</dd>
              </div>
              <div className="case-meta-wide">
                <dt>Palette</dt>
                <dd className="palette">
                  {project.palette.map((c, i) => (
                    <motion.span
                      key={c}
                      style={{ background: c }}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: 'spring', stiffness: 260, damping: 16, delay: 0.3 + i * 0.07 }}
                    />
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>
          <div className="case-text">
            {project.description.map((d, i) => (
              <Reveal as="p" key={d} i={i}>
                {d}
              </Reveal>
            ))}
          </div>
        </div>

        {rest.length > 0 && (
          <section className="case-gallery" aria-label="Photos et plans">
            {rest.map((g, i) => (
              <GrowImage key={g.src} image={g} onOpen={() => open(gallery, i + 1)} />
            ))}
          </section>
        )}

        <Viewer3D project={project} loaded={loaded3d} onLoad={() => setLoaded3d(true)} />

        {project.materials.length > 0 && (
          <section className="case-block" aria-labelledby="materiaux-title">
            <OutlineTitle id="materiaux-title" before="Matières" after="couleurs" className="outline-title--ink outline-title--sm" />
            <ul className="materials">
              {project.materials.map((m, i) => (
                <Reveal as="li" key={m.label} i={i}>
                  <motion.div
                    className={`arch${m.cutout ? ' arch--cutout' : ''}`}
                    style={m.color ? { background: m.color } : undefined}
                    whileHover={{ y: -8 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  >
                    {m.src && <img src={m.src} alt="" loading="lazy" decoding="async" />}
                  </motion.div>
                  <span>{m.label}</span>
                </Reveal>
              ))}
            </ul>
          </section>
        )}
      </article>

      <section className="next-case" aria-label="Projet suivant">
        <p className="next-case-label">
          <ArrowDownIcon size={18} aria-hidden="true" /> projet suivant <ArrowDownIcon size={18} aria-hidden="true" />
        </p>
        <motion.a className="next-case-name" href={href.project(next.slug)} whileHover={{ scale: 1.03 }} transition={{ duration: 0.5, ease: EASE }}>
          {next.title} {next.script}
        </motion.a>
        <a className="box-button box-button--light" href={href.page('projets')}>
          Tous les projets <sup>({String(projects.length).padStart(2, '0')})</sup>
        </a>
      </section>
      <Footer />
    </>
  )
}
