import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpIcon } from '@phosphor-icons/react'
import { contact } from '../data/projects'
import { href } from '../lib/router'
import { EASE } from './Motion'

const YEAR = new Date().getFullYear()
const fmt = new Intl.DateTimeFormat('fr-CA', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Toronto' })

function LocalTime() {
  const [now, setNow] = useState(() => fmt.format(new Date()))
  useEffect(() => {
    const id = setInterval(() => setNow(fmt.format(new Date())), 30000)
    return () => clearInterval(id)
  }, [])
  return <span>{now} · Montréal</span>
}

// Flèche dessinée à la main, tracée quand le pied de page apparaît.
function Doodle() {
  return (
    <svg className="footer-doodle" viewBox="0 0 160 110" aria-hidden="true">
      <motion.path
        d="M150 18c-30-20-70-8-66 20 3 22 34 22 30 2-4-18-40-14-58 6-16 18-22 38-24 58m0 0-12-14m12 14 14-10"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
      />
    </svg>
  )
}

export default function Footer() {
  const reduced = useReducedMotion()
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(contact.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2400)
    } catch {
      window.location.href = `mailto:${contact.email}`
    }
  }

  return (
    <footer className="site-footer">
      <div className="footer-panel">
        <Doodle />
        <motion.p
          className="footer-ask"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Un projet en tête&nbsp;?
        </motion.p>
        <motion.a
          className="footer-cta"
          href={href.page('contact')}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          Écrivez-moi !!!
        </motion.a>

        <div className="footer-meta">
          <div className="footer-col">
            <span className="footer-label">Heure locale</span>
            <LocalTime />
          </div>
          <div className="footer-col">
            <span className="footer-label">Téléphone</span>
            <a href={contact.phoneHref}>{contact.phone}</a>
          </div>
          <div className="footer-col">
            <span className="footer-label">Courriel</span>
            <span className="footer-mail">
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
              <button type="button" className="copy-btn" onClick={copy}>
                {copied ? 'Copié' : 'Copier'}
              </button>
            </span>
            <span className="sr-only" aria-live="polite">
              {copied ? 'Adresse courriel copiée' : ''}
            </span>
          </div>
          <div className="footer-col footer-col--center">
            <motion.button
              type="button"
              className="to-top"
              aria-label="Revenir en haut de la page"
              onClick={() => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' })}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.92 }}
            >
              <ArrowUpIcon size={20} weight="regular" />
            </motion.button>
            <span>© {YEAR} Ouidiane Rassidi</span>
          </div>
          <nav className="footer-col footer-col--end" aria-label="Pied de page">
            <span className="footer-label">Navigation</span>
            <span className="footer-links">
              <a href={href.page('projets')}>Projets</a>
              <a href={href.page('vitrines')}>Vitrines</a>
              <a href={href.page('a-propos')}>À propos</a>
            </span>
          </nav>
        </div>
      </div>
    </footer>
  )
}
