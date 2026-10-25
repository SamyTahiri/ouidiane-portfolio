import { useEffect, useState } from 'react'

// Routeur minimal basé sur le hash : fonctionne sur tout hébergement statique.
// #/            → accueil
// #/projets     → index des projets (idem vitrines, a-propos, contact)
// #/projet/slug → page projet

export const PAGES = ['projets', 'vitrines', 'a-propos', 'contact']

const read = () => {
  const path = window.location.hash.replace(/^#/, '') || '/'
  const [, first = '', second = ''] = path.split('/')
  if (first === 'projet' && second) return { name: 'project', slug: second }
  if (PAGES.includes(first)) return { name: first }
  return { name: 'home' }
}

export function useRoute() {
  const [route, setRoute] = useState(read)
  useEffect(() => {
    const onChange = () => setRoute(read())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])
  return route
}

export const routeKey = (r) => (r.name === 'project' ? `project:${r.slug}` : r.name)

export const href = {
  home: '#/',
  page: (id) => `#/${id}`,
  project: (slug) => `#/projet/${slug}`,
}
