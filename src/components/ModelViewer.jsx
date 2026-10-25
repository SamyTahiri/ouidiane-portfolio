import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Bounds, Environment, Lightformer, OrbitControls, useBounds, useGLTF, useProgress } from '@react-three/drei'
import * as THREE from 'three'

// Indicateur de chargement en DOM classique, par-dessus le canevas.
function Loader() {
  const { active, progress } = useProgress()
  if (!active) return null
  return (
    <p className="viewer-loading" role="status">
      Chargement du modèle… {Math.round(progress)} %
    </p>
  )
}

// Vue « maison de poupée » : un plan de coupe horizontal retire le plafond et le haut des murs.
const CUT = 0.86

function Model({ url }) {
  const { scene } = useGLTF(url)
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene)
    const height = box.min.y + (box.max.y - box.min.y) * CUT
    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), height)
    scene.traverse((child) => {
      if (!child.isMesh) return
      const mats = Array.isArray(child.material) ? child.material : [child.material]
      mats.forEach((m) => {
        // Faces avant uniquement : les murs vus de dos s’effacent.
        m.side = THREE.FrontSide
        m.clippingPlanes = [plane]
      })
    })
  }, [scene])
  return <primitive object={scene} />
}

// Expose les commandes (boutons) au composant parent : alternative au glisser.
function ControlsBridge({ apiRef }) {
  const controls = useThree((s) => s.controls)
  const bounds = useBounds()
  useEffect(() => {
    apiRef.current = {
      rotate: (a) => {
        if (!controls) return
        controls.setAzimuthalAngle(controls.getAzimuthalAngle() + a)
        controls.update()
      },
      zoom: (f) => {
        if (!controls) return
        const cam = controls.object
        cam.position.sub(controls.target).multiplyScalar(f).add(controls.target)
        controls.update()
      },
      top: () => {
        if (!controls) return
        const cam = controls.object
        const d = cam.position.distanceTo(controls.target)
        cam.position.set(controls.target.x, controls.target.y + d, controls.target.z + 0.001)
        controls.update()
      },
      reset: () => bounds.refresh().clip().fit(),
    }
  }, [controls, bounds, apiRef])
  return null
}

export default function ModelViewer({ url, title }) {
  const api = useRef(null)
  return (
    <div className="viewer">
      <Canvas dpr={[1, 1.75]} camera={{ position: [5, 10, 7], fov: 40, near: 0.05, far: 500 }} aria-label={`Modèle 3D interactif : ${title}`} role="img" onCreated={({ gl }) => { gl.localClippingEnabled = true }}>
        <color attach="background" args={['#fbf8f3']} />
        <hemisphereLight args={['#ffffff', '#cfc6ba', 0.55]} />
        <directionalLight position={[6, 10, 6]} intensity={0.9} />
        <Environment resolution={256}>
          <Lightformer form="rect" intensity={1.1} position={[0, 6, 4]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={0.6} color="#f3e2c3" position={[-6, 2, 0]} rotation-y={Math.PI / 2} scale={[8, 4, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <Bounds fit clip observe margin={1.1}>
            <Model url={url} />
            <ControlsBridge apiRef={api} />
          </Bounds>
        </Suspense>
        <OrbitControls makeDefault enableDamping maxPolarAngle={Math.PI / 2.02} />
      </Canvas>
      <Loader />
      <div className="viewer-controls" role="group" aria-label="Commandes du modèle 3D">
        <button type="button" className="pill pill--icon" onClick={() => api.current?.rotate(-Math.PI / 8)} aria-label="Pivoter à gauche">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12a8 8 0 1 0 2.3-5.7M4 4v4h4" /></svg>
        </button>
        <button type="button" className="pill pill--icon" onClick={() => api.current?.rotate(Math.PI / 8)} aria-label="Pivoter à droite">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4" /></svg>
        </button>
        <button type="button" className="pill pill--icon" onClick={() => api.current?.zoom(0.8)} aria-label="Zoom avant">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button type="button" className="pill pill--icon" onClick={() => api.current?.zoom(1.25)} aria-label="Zoom arrière">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14" /></svg>
        </button>
        <button type="button" className="pill" onClick={() => api.current?.top()}>
          Vue de dessus
        </button>
        <button type="button" className="pill" onClick={() => api.current?.reset()}>
          Recentrer
        </button>
      </div>
      <p className="viewer-hint">Glissez pour tourner autour de la pièce · pincez ou défilez pour zoomer</p>
    </div>
  )
}
