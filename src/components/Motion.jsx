import { Fragment } from 'react'
import { motion } from 'framer-motion'

// Jetons de mouvement partagés : une seule courbe et quelques durées pour tout le site.
export const EASE = [0.22, 1, 0.36, 1]
export const EASE_INOUT = [0.76, 0, 0.24, 1]

export const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE, delay: i * 0.08 } }),
}

// Apparition au défilement (une seule fois). `as` choisit la balise rendue.
export function Reveal({ as = 'div', i = 0, children, ...rest }) {
  const Tag = motion[as]
  return (
    <Tag variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }} custom={i} {...rest}>
      {children}
    </Tag>
  )
}

// Texte révélé mot à mot, chaque mot glissant hors d’un masque.
export function SplitWords({ text, className, delay = 0, step = 0.035, inView = true }) {
  const words = text.split(' ')
  const trigger = inView ? { whileInView: 'show', viewport: { once: true, margin: '0px 0px -10% 0px' } } : { animate: 'show' }
  return (
    <motion.span className={className} initial="hidden" {...trigger}>
      <span className="sr-only">{text}</span>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className="word-mask" aria-hidden="true">
            <motion.span
              className="word"
              variants={{
                hidden: { y: '110%' },
                show: { y: '0%', transition: { duration: 0.9, ease: EASE, delay: delay + i * step } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </motion.span>
  )
}
