# Ouidiane Rassidi — Portfolio

French-language portfolio for Ouidiane Rassidi (décoration d'intérieur et présentation visuelle).
React + Vite, Framer Motion for all animation, Three.js via React Three Fiber.

```bash
pnpm install
pnpm dev     # http://localhost:5173
pnpm build   # static site in dist/ (any static host works; routes use #/…)
```

## Where things live

- `src/data/projects.js` — all project text, images, materials and palettes (edit content here)
- `public/images/<projet>/` — WebP images extracted from her PDF portfolio
- `public/images/theme/veines.webp` — her gold vein texture, used as a CSS mask
- `src/components/ClayScene.jsx` — the landing's 3D clay paint objects (pots, brushes, rollers, palettes…) with depth of field
- `src/components/Preloader.jsx` — the "ESPACE UN … HUIT" intro, shown once per session
- `src/components/About.jsx` — "À propos" sheet modelled on yannesidibe.com (outlined condensed title, bento cards, scroll-filled text, qualities strip)
- `src/components/SelectedWork.jsx` — home project list with cursor-following preview
- `src/components/WorkPage.jsx` — Projets page: zig-zag cards that bend with scroll speed
- `src/components/ProjectPage.jsx` — case-study page (title, meta + description, photos, 3D visit, next project)
- `src/components/Motion.jsx` — shared Framer Motion helpers (`Reveal`, `SplitWords`, easing tokens)
- `src/components/ModelViewer.jsx` — the 3D room viewer for `.glb` files

## Adding her portrait

Save it as `public/images/portrait.webp` (portrait format, about 4:5), then set `photo: '/images/portrait.webp'` in `profile` in `src/data/projects.js`.

## Adding a 3D room

1. Put the file in `public/models/`, e.g. `public/models/bistro-luma.glb`
2. In `src/data/projects.js`, set `model: '/models/bistro-luma.glb'` on that project

Projects without a model show a "Modèle 3D à venir" placeholder in dev only; it is hidden in production.

Models from SketchUp/SimLab use the old spec-gloss material format, which three.js no longer reads, so convert and compress them first:

```bash
npx @gltf-transform/cli metalrough in.glb tmp.glb
npx @gltf-transform/cli optimize tmp.glb out.glb --compress meshopt --texture-compress webp --texture-size 1024 --simplify-error 0.002
```

The viewer shows rooms as a "dollhouse": a horizontal section plane removes the ceiling and wall tops (`CUT` in `ModelViewer.jsx`).

Landing modelled on garden-eight.com; about, project list and case pages modelled on yannesidibe.com.
Fonts (self-hosted): Cinzel Decorative (hero), League Gothic (outlined section titles), Clash Display
(text — ITF Free Font License via Fontshare, files in `src/assets/fonts`), Pinyon Script (accent).
