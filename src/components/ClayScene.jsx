import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { DepthOfField, EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

// Pots et outils de peinture qui déferlent depuis le coin supérieur gauche
// à l’ouverture de la page, puis flottent derrière le titre.

const CLAY = '#f3ece1'
// Peintures : saturées et lisibles, dans l’esprit des palettes de ses projets.
const PAINTS = ['#b3263a', '#1f7a5c', '#f2b630', '#e0663a', '#f08fa6', '#2d5fa8', '#7b4bb3']
// Corps des pots : teintes laquées plus douces pour que la peinture ressorte.
const BODIES = ['#f6d4c8', '#cfe5d8', '#fbe7a6', '#c9d7f0', '#f3c7d2', '#e8dccb', '#d7c9ea']

// ---------------------------------------------------------------- matériaux partagés
const clay = new THREE.MeshStandardMaterial({ color: CLAY, roughness: 0.7, metalness: 0 })
const clayDark = new THREE.MeshStandardMaterial({ color: '#c9a86a', roughness: 0.35, metalness: 0.75 })
const wood = new THREE.MeshStandardMaterial({ color: '#d9b98c', roughness: 0.6 })
const paintMats = Object.fromEntries(
  PAINTS.map((c) => [c, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.08 })]),
)
const bodyMats = Object.fromEntries(
  BODIES.map((c) => [c, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 })]),
)

// ---------------------------------------------------------------- géométries partagées
const v2 = (pts) => pts.map(([x, y]) => new THREE.Vector2(x, y))
const G = {
  pot: new THREE.LatheGeometry(
    v2([[0, -0.5], [0.5, -0.5], [0.56, -0.44], [0.56, -0.36], [0.59, -0.33], [0.56, -0.3], [0.56, 0.36], [0.59, 0.39], [0.56, 0.42], [0.56, 0.48], [0.52, 0.5], [0.5, 0.44]]),
    48,
  ),
  potPaint: new THREE.CylinderGeometry(0.5, 0.5, 0.04, 40),
  rim: new THREE.TorusGeometry(0.54, 0.035, 12, 48),
  handle: new THREE.TorusGeometry(0.58, 0.022, 8, 40, Math.PI),
  lid: new THREE.CylinderGeometry(0.6, 0.6, 0.07, 40),
  lip: new THREE.TorusGeometry(0.55, 0.06, 10, 40, 2.1),
  drip: new THREE.CapsuleGeometry(0.07, 0.4, 6, 10),
  dripBead: new THREE.SphereGeometry(0.085, 14, 12),
  brushHandle: new THREE.CylinderGeometry(0.05, 0.075, 1.2, 20),
  brushFerrule: new THREE.CylinderGeometry(0.1, 0.085, 0.3, 24),
  brushBristle: new THREE.CylinderGeometry(0.1, 0.12, 0.22, 24),
  brushTip: new THREE.CylinderGeometry(0.12, 0.04, 0.2, 24),
  rollerCore: new THREE.CylinderGeometry(0.24, 0.24, 1, 32),
  rollerCap: new THREE.CylinderGeometry(0.2, 0.2, 1.08, 24),
  rollerFrame: new THREE.TubeGeometry(
    new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0.56),
      new THREE.Vector3(0, -0.35, 0.62),
      new THREE.Vector3(0, -0.5, 0.1),
      new THREE.Vector3(0, -0.6, -0.3),
      new THREE.Vector3(0, -1.0, -0.35),
    ]),
    32,
    0.03,
    8,
  ),
  rollerHandle: new THREE.CylinderGeometry(0.07, 0.08, 0.6, 20),
  tube: new THREE.LatheGeometry(
    v2([[0, -0.6], [0.06, -0.6], [0.2, -0.45], [0.22, 0.3], [0.2, 0.42], [0.1, 0.5], [0.08, 0.56], [0, 0.56]]),
    32,
  ),
  tubeCap: new THREE.CylinderGeometry(0.1, 0.1, 0.2, 20),
  tubeCrimp: new THREE.BoxGeometry(0.42, 0.08, 0.04),
  tubeBand: new THREE.CylinderGeometry(0.225, 0.225, 0.28, 32, 1, true),
  card: new THREE.BoxGeometry(0.42, 1.1, 0.02),
  cardChip: new THREE.PlaneGeometry(0.34, 0.26),
  // Goutte : x = sin(t)·sin(t/2)^1.4, y = cos(t) — pointe en haut, fond arrondi.
  drop: new THREE.LatheGeometry(
    v2(
      Array.from({ length: 24 }, (_, i) => {
        const t = Math.PI - (i / 23) * Math.PI
        return [Math.max(0.34 * Math.sin(t) * Math.pow(Math.sin(t / 2), 1.4), 0.0001), 0.5 * Math.cos(t)]
      }),
    ),
    32,
  ),
  dab: new THREE.SphereGeometry(0.1, 16, 10),
}

// Palette d’artiste : forme de haricot percée d’un trou pour le pouce.
G.palette = (() => {
  const s = new THREE.Shape()
  s.moveTo(-0.9, 0)
  s.bezierCurveTo(-0.95, 0.55, -0.3, 0.75, 0.25, 0.62)
  s.bezierCurveTo(0.8, 0.5, 1.0, 0.1, 0.85, -0.3)
  s.bezierCurveTo(0.7, -0.68, 0.15, -0.72, -0.05, -0.45)
  s.bezierCurveTo(-0.15, -0.3, -0.35, -0.28, -0.45, -0.42)
  s.bezierCurveTo(-0.7, -0.6, -0.88, -0.35, -0.9, 0)
  const hole = new THREE.Path()
  hole.absarc(-0.45, 0.12, 0.13, 0, Math.PI * 2, true)
  s.holes.push(hole)
  const g = new THREE.ExtrudeGeometry(s, { depth: 0.06, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 4, curveSegments: 32 })
  g.center()
  return g
})()

// ---------------------------------------------------------------- objets
function Pot({ paint, body, lidOff }) {
  const m = paintMats[paint]
  return (
    <group>
      <mesh geometry={G.pot} material={bodyMats[body]} />
      <mesh geometry={G.rim} material={clay} position={[0, 0.47, 0]} rotation-x={Math.PI / 2} />
      <mesh geometry={G.potPaint} material={m} position={[0, 0.44, 0]} />
      <mesh geometry={G.lip} material={m} position={[0, 0.48, 0]} rotation={[Math.PI / 2, 0, 0.4]} />
      {[0.5, 1.05, 1.6, 2.1].map((a, i) => (
        <group key={a} position={[Math.cos(-a - 0.4) * 0.56, 0.42 - i * 0.04, Math.sin(-a - 0.4) * 0.56]} scale={[1, 0.6 + (i % 3) * 0.45, 1]}>
          <mesh geometry={G.drip} material={m} position={[0, -0.27, 0]} />
          <mesh geometry={G.dripBead} material={m} position={[0, -0.5, 0]} />
        </group>
      ))}
      <mesh geometry={G.handle} material={clayDark} position={[0, 0.12, 0]} rotation-x={-1.2} />
      {!lidOff && <mesh geometry={G.lid} material={bodyMats[body]} position={[0.3, 0.75, 0.1]} rotation={[0.2, 0, -0.9]} />}
    </group>
  )
}

function Lid({ paint, body }) {
  return (
    <group>
      <mesh geometry={G.lid} material={bodyMats[body]} />
      <mesh geometry={G.potPaint} material={paintMats[paint]} position={[0, -0.04, 0]} scale={[0.9, 1, 0.9]} />
    </group>
  )
}

function Brush({ paint, handle }) {
  return (
    <group>
      <mesh geometry={G.brushHandle} material={paintMats[handle]} position={[0, 0.7, 0]} />
      <mesh geometry={G.brushFerrule} material={clayDark} position={[0, -0.05, 0]} />
      <mesh geometry={G.brushBristle} material={clay} position={[0, -0.3, 0]} />
      <mesh geometry={G.brushTip} material={paintMats[paint]} position={[0, -0.5, 0]} />
    </group>
  )
}

function Roller({ paint }) {
  return (
    <group>
      <mesh geometry={G.rollerCore} material={paintMats[paint]} rotation-x={Math.PI / 2} position={[0, 0, 0]} />
      <mesh geometry={G.rollerCap} material={clay} rotation-x={Math.PI / 2} />
      <mesh geometry={G.rollerFrame} material={clayDark} />
      <mesh geometry={G.rollerHandle} material={wood} position={[0, -1.3, -0.35]} />
    </group>
  )
}

function Tube({ paint }) {
  return (
    <group>
      <mesh geometry={G.tube} material={bodyMats[BODIES[2]]} scale={[1, 1, 0.75]} />
      <mesh geometry={G.tubeBand} material={paintMats[paint]} position={[0, -0.05, 0]} scale={[1, 1, 0.76]} />
      <mesh geometry={G.tubeCap} material={clayDark} position={[0, 0.66, 0]} />
      <mesh geometry={G.tubeCrimp} material={clay} position={[0, -0.62, 0]} />
    </group>
  )
}

function FanDeck({ colors }) {
  return (
    <group>
      {colors.map((c, i) => (
        <group key={c} rotation-z={(i - (colors.length - 1) / 2) * 0.28} position-z={i * 0.025}>
          <group position-y={0.55}>
            <mesh geometry={G.card} material={clay} />
            <mesh geometry={G.cardChip} material={paintMats[c]} position={[0, 0.3, 0.012]} />
          </group>
        </group>
      ))}
    </group>
  )
}

function Palette({ colors }) {
  const dabs = [[0.1, 0.38], [0.5, 0.25], [0.65, -0.12], [0.4, -0.42], [-0.1, 0.45]]
  return (
    <group>
      <mesh geometry={G.palette} material={wood} />
      {colors.map((c, i) => (
        <mesh key={c} geometry={G.dab} material={paintMats[c]} position={[dabs[i][0], dabs[i][1], 0.07]} scale={[1, 1, 0.45]} />
      ))}
    </group>
  )
}

function Drop({ paint }) {
  return <mesh geometry={G.drop} material={paintMats[paint]} />
}

// ---------------------------------------------------------------- essaim

// Générateur pseudo-aléatoire déterministe : même composition à chaque visite.
function rng(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

// Les pots dominent la composition ; les outils l’accompagnent.
const KINDS = ['pot', 'brush', 'pot', 'palette', 'pot', 'drop', 'roller', 'pot', 'fan', 'pot', 'tube', 'drop']

function buildItems(count, hw, hh, narrow) {
  const r = rng(8)
  return Array.from({ length: count }, (_, i) => {
    const kind = KINDS[i % KINDS.length]
    const paint = PAINTS[i % PAINTS.length]
    const body = BODIES[(i * 3 + 1) % BODIES.length]
    const handle = PAINTS[(i + 3) % PAINTS.length]
    // Répartition : plus dense sur les bords et en profondeur pour laisser le titre lisible.
    const side = r() < 0.5 ? -1 : 1
    const edge = 0.35 + r() * 0.75
    // Les objets proches (grands) restent sur les bords pour ne pas masquer le titre.
    const isNear = i % 5 === 1
    const x = isNear ? side * (0.8 + r() * 0.35) * hw : i % 4 === 0 ? (r() * 2 - 1) * hw * 0.9 : side * edge * hw
    // Le titre est en bas : les objets occupent surtout la partie haute.
    const y = narrow ? (r() * 1.15 - 0.1) * hh : (r() * 1.6 - 0.55) * hh
    // Quelques objets très proches (flous, monumentaux) et d’autres loin derrière le titre.
    const z = isNear ? 2.6 + r() * 1.6 : -8 + r() * 9
    const near = z > 2.5
    return {
      kind,
      paint,
      body,
      handle,
      colors: [0, 2, 4, 1, 3].map((k) => PAINTS[(i + k) % PAINTS.length]),
      rest: new THREE.Vector3(x, y, z),
      start: new THREE.Vector3(-hw * 1.9 - r() * hw, hh * 1.8 + r() * hh * 1.4, z - 2 - r() * 3),
      delay: 0.55 + i * 0.07 + r() * 0.25,
      dur: 1.7 + r() * 0.9,
      scale: (near ? 1.1 : 1.0) + r() * (near ? 0.4 : 0.7),
      rot: new THREE.Euler(r() * 6.28, r() * 6.28, r() * 6.28),
      spin: new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).multiplyScalar(5),
      idle: new THREE.Vector3(r() * 2 - 1, r() * 2 - 1, r() * 2 - 1).multiplyScalar(0.18),
      phase: r() * 6.28,
    }
  })
}

const easeOutBack = (t) => {
  const c1 = 1.25
  const c3 = c1 + 1
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2)
}

function Item({ item }) {
  switch (item.kind) {
    case 'pot':
      return <Pot paint={item.paint} body={item.body} lidOff={item.rest.x > 0} />
    case 'lid':
      return <Lid paint={item.paint} body={item.body} />
    case 'brush':
      return <Brush paint={item.paint} handle={item.handle} />
    case 'roller':
      return <Roller paint={item.paint} />
    case 'tube':
      return <Tube paint={item.paint} />
    case 'fan':
      return <FanDeck colors={item.colors} />
    case 'palette':
      return <Palette colors={item.colors} />
    default:
      return <Drop paint={item.paint} />
  }
}

function Swarm({ started, reduced, pointer, scroll }) {
  const { viewport, camera } = useThree()
  const vp = viewport.getCurrentViewport(camera, [0, 0, 0])
  const hw = vp.width / 2
  const hh = vp.height / 2
  const narrow = vp.width < vp.height
  const count = narrow ? 10 : 18
  const items = useMemo(() => buildItems(count, hw, hh, narrow), [count, hw, hh, narrow])
  const refs = useRef([])
  const root = useRef()
  const t0 = useRef(null)
  const tmp = useMemo(() => new THREE.Vector3(), [])
  const ctrl = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, rawDt) => {
    const dt = Math.min(rawDt, 1 / 30)
    if (!started) return
    if (t0.current === null) t0.current = state.clock.elapsedTime
    const t = state.clock.elapsedTime - t0.current
    const s = scroll.current
    if (root.current) {
      // Au défilement, l’essaim remonte et s’ouvre comme si la caméra plongeait dedans.
      root.current.position.y = THREE.MathUtils.damp(root.current.position.y, s * hh * 1.4, 4, dt)
      root.current.position.z = THREE.MathUtils.damp(root.current.position.z, s * 3, 4, dt)
      if (!reduced) {
        root.current.rotation.y = THREE.MathUtils.damp(root.current.rotation.y, pointer.current.x * 0.08, 2.5, dt)
        root.current.rotation.x = THREE.MathUtils.damp(root.current.rotation.x, -pointer.current.y * 0.05, 2.5, dt)
      }
    }
    items.forEach((it, i) => {
      const o = refs.current[i]
      if (!o) return
      const local = reduced ? 99 : t - it.delay
      if (local < 0) {
        o.visible = false
        return
      }
      o.visible = true
      const k = Math.min(local / it.dur, 1)
      const e = easeOutBack(k)
      // Trajectoire en arc : départ hors champ en haut à gauche, arrivée sur la position de repos.
      ctrl.set((it.start.x + it.rest.x) * 0.5, Math.max(it.start.y, it.rest.y) + hh * 0.4, (it.start.z + it.rest.z) * 0.5)
      const u = Math.min(e, 1.08)
      const a = (1 - u) * (1 - u)
      const b = 2 * (1 - u) * u
      const c = u * u
      tmp.set(
        a * it.start.x + b * ctrl.x + c * it.rest.x,
        a * it.start.y + b * ctrl.y + c * it.rest.y,
        a * it.start.z + b * ctrl.z + c * it.rest.z,
      )
      if (!reduced) {
        tmp.y += Math.sin(state.clock.elapsedTime * 0.6 + it.phase) * 0.12
        tmp.x += Math.cos(state.clock.elapsedTime * 0.45 + it.phase) * 0.06
      }
      o.position.copy(tmp)
      // Rotation : forte pendant la chute, puis ralentit en dérive douce.
      const spinK = reduced ? 0 : Math.max(1 - k, 0) ** 2
      o.rotation.x += (it.spin.x * spinK + it.idle.x) * dt
      o.rotation.y += (it.spin.y * spinK + it.idle.y) * dt
      o.rotation.z += (it.spin.z * spinK + it.idle.z) * dt
    })
  })

  return (
    <group ref={root}>
      {items.map((it, i) => (
        <group
          key={i}
          ref={(el) => (refs.current[i] = el)}
          position={reduced ? it.rest : it.start}
          rotation={it.rot}
          scale={it.scale}
          visible={reduced}
        >
          <Item item={it} />
        </group>
      ))}
    </group>
  )
}

export default function ClayScene({ started = true, active = true, reduced = false }) {
  const pointer = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)
  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    const onScroll = () => {
      scroll.current = window.scrollY / window.innerHeight
    }
    onScroll()
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const blur = !reduced && typeof window !== 'undefined' && window.innerWidth >= 768

  return (
    <Canvas
      className="clay-canvas"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 10], fov: 40, near: 0.1, far: 40 }}
      gl={{ antialias: !blur, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
    >
      <color attach="background" args={['#fbf8f3']} />
      <hemisphereLight args={['#ffffff', '#d8cdbd', 1.35]} />
      <directionalLight position={[-6, 8, 6]} intensity={1.9} color="#fff6ea" />
      <directionalLight position={[6, -3, 4]} intensity={0.35} color="#efe2cf" />
      <Environment resolution={128}>
        <Lightformer form="rect" intensity={1.6} position={[0, 5, 5]} scale={[10, 4, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#f4e6cf" position={[-6, 0, 3]} rotation-y={Math.PI / 2} scale={[8, 5, 1]} />
      </Environment>
      <Swarm started={started} reduced={reduced} pointer={pointer} scroll={scroll} />
      {blur && (
        <EffectComposer multisampling={0}>
          <DepthOfField target={[0, 0, 0]} focalLength={0.3} bokehScale={2.2} height={720} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
