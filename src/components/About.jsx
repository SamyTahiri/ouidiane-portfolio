import { useRef } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import {
  ArmchairIcon,
  CubeIcon,
  LampIcon,
  PaintBrushIcon,
  PaintRollerIcon,
  PaletteIcon,
  RulerIcon,
  StorefrontIcon,
} from '@phosphor-icons/react'
import { profile } from '../data/projects'

const ICONS = { palette: PaletteIcon, ruler: RulerIcon, cube: CubeIcon }

// Fleur de peinture qui tourne entre les deux mots des titres.
export function Flower({ className = 'flower' }) {
  return (
    <motion.svg
      className={className}
      viewBox="0 0 100 100"
      aria-hidden="true"
      animate={{ rotate: 360 }}
      transition={{ duration: 12, ease: 'linear', repeat: Infinity }}
    >
      {Array.from({ length: 12 }, (_, k) => (
        <rect key={k} x="47" y="4" width="6" height="40" rx="3" transform={`rotate(${k * 30} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="10" />
    </motion.svg>
  )
}

// Titre condensé en contour, révélé depuis un flou en glissant de la gauche, et qui se floute en sortant.
export function OutlineTitle({ id, before, after, className = '' }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.92, 1], [0, 1, 1, 0.3])
  const blurPx = useTransform(scrollYProgress, [0, 0.3, 0.92, 1], [14, 0, 0, 6])
  const x = useTransform(scrollYProgress, [0, 0.3], [-80, 0])
  const filter = useMotionTemplate`blur(${blurPx}px)`
  return (
    <motion.h2 ref={ref} id={id} className={`outline-title ${className}`} style={reduced ? undefined : { opacity, filter, x }}>
      <span>{before}</span>
      <Flower />
      <span>{after}</span>
    </motion.h2>
  )
}

// Mosaïque de pixels (fond de la carte chiffre) — générée une fois, déterministe.
const CELLS = (() => {
  let s = 7
  const r = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
  return Array.from({ length: 22 * 22 }, () => 0.04 + r() * 0.16)
})()

function Pixels() {
  const cells = CELLS
  return (
    <svg className="pixels" viewBox="0 0 22 22" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {cells.map((o, i) => (
        <rect key={i} x={i % 22} y={Math.floor(i / 22)} width="0.92" height="0.92" fill="#c9a24a" opacity={o} />
      ))}
    </svg>
  )
}

// Carte « miroir » : elle monte à sa propre vitesse au défilement, puis au survol elle s’incline
// vers le pointeur et un reflet lumineux suit la souris, comme une surface polie.
function Card({ className = '', speed = 1, children }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.55'] })
  const y = useTransform(scrollYProgress, [0, 1], [140 * speed, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1])

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const on = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 180, damping: 20 })
  const sy = useSpring(py, { stiffness: 180, damping: 20 })
  const shine = useSpring(on, { stiffness: 220, damping: 26 })
  const rotateX = useTransform(sy, [0, 1], [7, -7])
  const rotateY = useTransform(sx, [0, 1], [-9, 9])
  const gx = useTransform(sx, (v) => `${v * 100}%`)
  const gy = useTransform(sy, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255, 255, 255, 0.85), rgba(255, 250, 238, 0.35) 28%, transparent 58%)`
  const sheenX = useTransform(sx, [0, 1], ['-55%', '55%'])
  const shadowX = useTransform(sx, (v) => (0.5 - v) * 34)
  const shadowY = useTransform(sy, (v) => (0.5 - v) * 34 + 24)
  const shadowA = useTransform(shine, (v) => 0.16 * v)
  const boxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 60px rgba(58, 42, 23, ${shadowA})`

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width)
    py.set((e.clientY - r.top) / r.height)
    on.set(1)
  }
  const onLeave = () => {
    px.set(0.5)
    py.set(0.5)
    on.set(0)
  }

  const motionStyle = reduced ? { boxShadow } : { y, opacity, rotateX, rotateY, boxShadow, transformPerspective: 900 }
  return (
    <motion.div
      ref={ref}
      className={`about-card ${className}`}
      style={motionStyle}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
    >
      {children}
      <span className="card-shine" aria-hidden="true">
        <motion.span className="card-glare" style={{ background: glare, opacity: shine }} />
        {!reduced && <motion.span className="card-sheen" style={{ x: sheenX, opacity: shine }} />}
      </span>
    </motion.div>
  )
}

// Bandeau défilant : qualités et outils, ponctués d’icônes. S’arrête au survol et en mouvement réduit.
const STRIP_ICONS = [PaintBrushIcon, ArmchairIcon, PaintRollerIcon, LampIcon, StorefrontIcon, PaletteIcon]

function Strip() {
  const items = [...profile.qualities, ...profile.tools]
  const row = items.map((label, i) => {
    const Icon = STRIP_ICONS[i % STRIP_ICONS.length]
    return (
      <li key={label}>
        <Icon size={22} weight="light" aria-hidden="true" />
        <span>{label}</span>
      </li>
    )
  })
  return (
    <div className="strip" aria-label="Qualités et outils">
      <ul className="strip-track">{row}</ul>
      <ul className="strip-track" aria-hidden="true">
        {row}
      </ul>
    </div>
  )
}

export default function About() {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  // Le bas de la feuille s’arrondit en quittant l’écran, comme une page qui se courbe.
  const { scrollYProgress } = useScroll({ target: ref, offset: ['end end', 'end start'] })
  const r = useSpring(useTransform(scrollYProgress, [0, 0.6], [0, 180]), { stiffness: 120, damping: 24 })
  const radius = useMotionTemplate`0 0 50% 50% / 0 0 ${r}px ${r}px`
  const Skill0 = ICONS[profile.skills[0].icon]
  const Skill1 = ICONS[profile.skills[1].icon]
  const Skill2 = ICONS[profile.skills[2].icon]

  return (
    <section id="presentation" ref={ref} className="about" aria-labelledby="about-title" style={reduced ? undefined : { borderRadius: radius }}>
      <div className="about-inner">
        <OutlineTitle id="about-title" before="À" after="propos" />

        <div className="about-grid">
          <Card className="about-portrait" speed={1.3}>
            {profile.photo ? (
              <img src={profile.photo} alt={`Portrait de ${profile.name}`} />
            ) : (
              <div className="about-monogram" role="img" aria-label="Portrait à venir">
                <span>OR</span>
              </div>
            )}
          </Card>

          <Card className="about-text" speed={0.8}>
            <svg className="about-drop" viewBox="0 0 40 52" aria-hidden="true">
              <path d="M20 52C9 52 2 44 2 34 2 22 20 0 20 0s18 22 18 34c0 10-7 18-18 18z" />
            </svg>
            <p className="about-intro">{profile.intro}</p>
          </Card>

          <Card className="about-stat" speed={1.1}>
            <Pixels />
            <span className="about-stat-value">{profile.stat.value}</span>
            <span className="about-stat-label">{profile.stat.label}</span>
          </Card>

          <Card className="about-skill about-skill--1" speed={0.9}>
            <h3>{profile.skills[0].title}</h3>
            <p>{profile.skills[0].text}</p>
            <Skill0 className="about-doodle" size={30} weight="thin" aria-hidden="true" />
          </Card>
          <Card className="about-skill about-skill--2" speed={1.15}>
            <svg className="about-cloud" viewBox="0 0 48 30" aria-hidden="true">
              <path d="M12 30a12 12 0 0 1-1-24A14 14 0 0 1 38 8a11 11 0 0 1-2 22z" />
            </svg>
            <h3>{profile.skills[1].title}</h3>
            <p>{profile.skills[1].text}</p>
            <Skill1 className="about-doodle" size={30} weight="thin" aria-hidden="true" />
          </Card>
          <Card className="about-skill about-skill--3" speed={1.35}>
            <h3>{profile.skills[2].title}</h3>
            <p>{profile.skills[2].text}</p>
            <Skill2 className="about-doodle" size={30} weight="thin" aria-hidden="true" />
          </Card>
        </div>

        <Strip />
      </div>
    </section>
  )
}
