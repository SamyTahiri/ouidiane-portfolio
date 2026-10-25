import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const LightboxContext = createContext(() => {})

export const useLightbox = () => useContext(LightboxContext)

// Visionneuse plein écran basée sur <dialog> : Échap pour fermer, flèches pour naviguer,
// le focus revient automatiquement sur la vignette d’origine.
export function LightboxProvider({ children }) {
  const dialog = useRef(null)
  const [state, setState] = useState({ items: [], index: 0 })

  const open = useCallback((items, index = 0) => {
    setState({ items, index })
    dialog.current?.showModal()
  }, [])

  const close = () => dialog.current?.close()
  const go = useCallback(
    (d) => setState((s) => ({ ...s, index: (s.index + d + s.items.length) % s.items.length })),
    [],
  )

  useEffect(() => {
    const el = dialog.current
    const onKey = (e) => {
      if (!el.open) return
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  const item = state.items[state.index]
  const many = state.items.length > 1

  return (
    <LightboxContext.Provider value={open}>
      {children}
      <dialog
        ref={dialog}
        className="lightbox"
        aria-label="Visionneuse d’images"
        onClick={(e) => {
          if (e.target === dialog.current) close()
        }}
      >
        {item && (
          <figure className="lightbox-figure">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.img
                key={item.src}
                src={item.src}
                alt={item.alt}
                width={item.w}
                height={item.h}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </AnimatePresence>
            <figcaption>
              <span>{item.caption || item.alt}</span>
              {many && (
                <span className="lightbox-count" aria-live="polite">
                  {state.index + 1} / {state.items.length}
                </span>
              )}
            </figcaption>
          </figure>
        )}
        <div className="lightbox-bar">
          {many && (
            <>
              <button type="button" className="pill pill--light pill--icon" onClick={() => go(-1)} aria-label="Image précédente">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg>
              </button>
              <button type="button" className="pill pill--light pill--icon" onClick={() => go(1)} aria-label="Image suivante">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg>
              </button>
            </>
          )}
          <button type="button" className="pill pill--light" onClick={close} autoFocus>
            Fermer
          </button>
        </div>
      </dialog>
    </LightboxContext.Provider>
  )
}
