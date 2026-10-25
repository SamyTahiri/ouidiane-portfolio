import { motion } from 'framer-motion'
import { ArrowUpRightIcon } from '@phosphor-icons/react'
import Footer from './Footer'
import About, { Flower } from './About'
import SelectedWork from './SelectedWork'
import { contact, vitrines } from '../data/projects'
import { useLightbox } from './Lightbox'
import { EASE, Reveal, SplitWords } from './Motion'

const pad = (n) => String(n).padStart(2, '0')

export function VitrinesPage() {
  const open = useLightbox()
  const items = vitrines.map((v) => ({ ...v, caption: `Vitrine — ${v.brand}` }))
  return (
    <>
      <section className="page page--plate">
        <h1 className="workpage-statement workpage-statement--light">
          <SplitWords text="Des vitrines conçues et fabriquées à la main" inView={false} delay={0.2} step={0.06} />
        </h1>
        <div className="workpage-head">
          <motion.span className="workpage-rule" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: EASE, delay: 0.6 }} />
          <p className="outline-title workpage-count" aria-label={`${vitrines.length} vitrines`}>
            <span>Vitrines</span>
            <Flower />
            <span>({pad(vitrines.length)})</span>
          </p>
        </div>
        <Reveal as="p" className="lead lead--light">
          Pour chaque vitrine, je découpe des panneaux selon les formes du concept, puis je fabrique séparément les éléments
          graphiques et les volumes avant de les assembler pour créer profondeur et relief.
        </Reveal>
        <ul className="vitrine-grid">
          {items.map((v, i) => (
            <Reveal as="li" key={v.src} i={i % 3}>
              <motion.button type="button" className="vitrine" onClick={() => open(items, i)} whileHover="hover">
                <motion.img
                  src={v.src}
                  alt={v.alt}
                  width={v.w}
                  height={v.h}
                  loading="lazy"
                  decoding="async"
                  variants={{ hover: { scale: 1.04 } }}
                  transition={{ duration: 0.9, ease: EASE }}
                />
                <span className="vitrine-brand">{v.brand}</span>
              </motion.button>
            </Reveal>
          ))}
        </ul>
      </section>
      <Footer />
    </>
  )
}

export function AboutPage() {
  return (
    <>
      <div className="about-page">
        <About />
      </div>
      <SelectedWork />
      <Footer />
    </>
  )
}

export function ContactPage() {
  return (
    <>
      <section className="page contact-page">
        <h1 className="workpage-statement">
          <SplitWords text={'Un espace à transformer, une vitrine à imaginer\u00a0? Parlons-en.'} inView={false} delay={0.2} step={0.05} />
        </h1>
        <ul className="contact-links">
          {[
            { href: `mailto:${contact.email}`, label: contact.email, kicker: 'Courriel' },
            { href: contact.phoneHref, label: contact.phone, kicker: 'Téléphone' },
          ].map((l, i) => (
            <Reveal as="li" key={l.label} i={2 + i}>
              <motion.a className="contact-box" href={l.href} whileHover="hover" initial="rest" animate="rest">
                <span className="contact-kicker">{l.kicker}</span>
                <span className="contact-value">{l.label}</span>
                <motion.span className="contact-arrow" variants={{ rest: { x: 0, y: 0 }, hover: { x: 6, y: -6 } }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
                  <ArrowUpRightIcon size={28} />
                </motion.span>
              </motion.a>
            </Reveal>
          ))}
        </ul>
      </section>
      <Footer />
    </>
  )
}
