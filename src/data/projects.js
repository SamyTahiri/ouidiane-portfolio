// Contenu du portfolio — tous les textes sont en français.
// Pour ajouter un modèle 3D à un projet : déposer le fichier dans /public/models/
// puis renseigner `model: '/models/<nom>.glb'` sur le projet.

const img = (folder, name) => `/images/${folder}/${name}.webp`

export const projects = [
  {
    slug: 'bistro-luma',
    title: 'Bistro',
    script: 'Luma',
    category: 'commercial',
    type: 'Restauration',
    tools: ['SketchUp', 'Rendu 3D assisté par IA'],
    summary:
      'Un concept inspiré du glamour et de l’élégance, où le rouge, le noir et le blanc créent une ambiance théâtrale et raffinée.',
    description: [
      'Un concept inspiré du glamour et de l’élégance, où le rouge, le noir et le blanc créent une ambiance théâtrale et raffinée.',
      'Les motifs géométriques, les luminaires élégants et les arches florales apportent caractère et sophistication à l’espace.',
    ],
    cover: img('bistro-luma', 'rendu'),
    ratio: '1232 / 651',
    gallery: [
      { src: img('bistro-luma', 'rendu'), alt: 'Rendu 3D de la salle du Bistro Luma : banquettes velours bordeaux, sol géométrique noir et blanc, piano à queue', w: 1232, h: 651 },
      { src: img('bistro-luma', 'sketchup'), alt: 'Modélisation SketchUp de la scène et de l’arche florale du Bistro Luma', w: 962, h: 406 },
      { src: img('bistro-luma', 'plan'), alt: 'Plan d’aménagement du Bistro Luma', w: 679, h: 325 },
      { src: img('bistro-luma', 'materiaux'), alt: 'Planche de matériaux : peinture murs, plancher salle, peinture mur d’entrée, comptoir bar, plancher scène', w: 749, h: 419 },
    ],
    materials: [
      { src: img('bistro-luma', 'tabouret'), label: 'Tabouret velours', cutout: true },
      { src: img('bistro-luma', 'fauteuil'), label: 'Fauteuil noir', cutout: true },
      { src: img('bistro-luma', 'table'), label: 'Table bistro', cutout: true },
      { src: img('bistro-luma', 'lustre'), label: 'Applique cristal', cutout: true },
    ],
    palette: ['#1d1d1f', '#8e2a2c', '#f2efe9', '#b8955a'],
    model: null,
  },
  {
    slug: 'salle-de-bain',
    title: 'Salle de bain',
    script: 'Concept complet',
    category: 'residentiel',
    type: 'Résidentiel',
    tools: ['Concept complet', 'Rendu 3D'],
    summary:
      'Une salle de bain haut de gamme alliant élégance, confort et fonctionnalité.',
    description: [
      'Conception d’une salle de bain haut de gamme alliant élégance, confort et fonctionnalité.',
      'Les matériaux nobles, les finitions raffinées et l’éclairage créent une ambiance luxueuse et apaisante.',
    ],
    cover: img('salle-de-bain', 'rendu'),
    ratio: '1180 / 651',
    gallery: [
      { src: img('salle-de-bain', 'rendu'), alt: 'Rendu de la salle de bain : baignoire îlot bordeaux, foyer encastré, vanités en marbre rouge', w: 1180, h: 651 },
      { src: img('salle-de-bain', 'elevations'), alt: 'Élévations de la salle de bain avec planche d’inspiration', w: 1440, h: 810 },
    ],
    materials: [
      { src: img('salle-de-bain', 'marbre-bordeaux'), label: 'Marbre bordeaux' },
      { src: img('salle-de-bain', 'travertin'), label: 'Travertin' },
      { src: img('cuisine-vortek', 'or'), label: 'Laiton brossé' },
    ],
    palette: ['#5e1f2b', '#d9cfc2', '#b8955a', '#f3eee8'],
    model: '/models/salle-de-bain.glb',
  },
  {
    slug: 'boutique-empire',
    title: 'Boutique',
    script: 'Empire',
    category: 'commercial',
    type: 'Commerce de détail',
    tools: ['SketchUp', 'Rendu 3D assisté par IA'],
    summary:
      'Un espace de vente lumineux aux courbes douces, où le rose poudré et le marbre mettent la collection en scène.',
    description: [
      'Modélisation et concept réalisés avec SketchUp, rendu 3D avec le soutien de l’IA.',
      'Présentoirs ronds rétroéclairés, niches en arche et vitrine sur podium composent un parcours fluide autour de la collection.',
    ],
    cover: img('boutique-empire', 'rendu'),
    ratio: '1200 / 675',
    gallery: [
      { src: img('boutique-empire', 'rendu'), alt: 'Rendu de la Boutique Empire : sol en marbre, présentoirs ronds et vitrine rose poudré', w: 1200, h: 675 },
      { src: img('boutique-empire', 'sketchup'), alt: 'Modélisation SketchUp de la Boutique Empire', w: 727, h: 450 },
    ],
    materials: [],
    palette: ['#e8c9cc', '#efe9e2', '#cfc6bb', '#b8955a'],
    model: '/models/boutique-empire.glb',
  },
  {
    slug: 'cuisine-vortek',
    title: 'Cuisine',
    script: 'Sketchup et Vortek',
    category: 'residentiel',
    type: 'Résidentiel',
    tools: ['SketchUp', 'Vortek'],
    summary:
      'Une cuisine ouverte aux teintes prune et marbre blanc, rehaussée de laiton et de velours rouge.',
    description: [
      'Modélisation SketchUp et rendu Vortek d’une cuisine ouverte sur la salle à manger.',
      'Le marbre blanc veiné, les façades prune et les touches de laiton dialoguent avec les chaises en velours rouge.',
    ],
    cover: img('cuisine-vortek', 'rendu'),
    ratio: '1200 / 675',
    gallery: [
      { src: img('cuisine-vortek', 'rendu'), alt: 'Rendu Vortek de la cuisine : îlot en marbre, tabourets rouges et laiton, façades prune', w: 1200, h: 675 },
      { src: img('cuisine-vortek', 'sketchup'), alt: 'Modélisation SketchUp de la cuisine et de la salle à manger', w: 521, h: 307 },
    ],
    materials: [
      { src: img('cuisine-vortek', 'marbre'), label: 'Marbre Calacatta' },
      { src: img('cuisine-vortek', 'or'), label: 'Laiton' },
      { color: '#a8919f', label: 'Prune adoucie' },
    ],
    palette: ['#a8919f', '#f1ece4', '#c9a24a', '#7c1f2a'],
    model: '/models/cuisine-vortek.glb',
  },
  {
    slug: 'chambre-hotel',
    title: 'Chambre',
    script: 'd’hôtel',
    category: 'commercial',
    type: 'Hôtellerie',
    tools: ['SketchUp', 'Vortek'],
    summary:
      'Une chambre d’hôtel graphique et pop, entre bois gris, fauteuil œuf chartreuse et art urbain.',
    description: [
      'Modélisation et concept réalisés avec SketchUp et Vortek.',
      'Le plan ouvert relie l’espace bureau, le coin lecture et la salle de bain vitrée, ponctués d’œuvres colorées.',
    ],
    cover: img('chambre-hotel', 'vue-2'),
    ratio: '879 / 396',
    gallery: [
      { src: img('chambre-hotel', 'vue-2'), alt: 'Vue d’ensemble de la chambre d’hôtel : lit, bureau, fauteuil œuf jaune et salle de bain', w: 879, h: 396 },
      { src: img('chambre-hotel', 'vue-1'), alt: 'Vue de la chambre d’hôtel côté bureau et murale colorée', w: 882, h: 397 },
      { src: img('chambre-hotel', 'plan'), alt: 'Plan de la chambre d’hôtel', w: 393, h: 399 },
    ],
    materials: [
      { src: img('chambre-hotel', 'fauteuil'), label: 'Fauteuil œuf', cutout: true },
      { src: img('chambre-hotel', 'bois'), label: 'Bois cérusé' },
      { src: img('chambre-hotel', 'rail'), label: 'Rail d’éclairage', cutout: true },
    ],
    palette: ['#bfc72a', '#5a5a5c', '#d8cbb7', '#2c6fa3'],
    model: '/models/chambre-hotel.glb',
  },
  {
    slug: 'cuisine-tropicale',
    title: 'Cuisine',
    script: '2020 Design',
    category: 'residentiel',
    type: 'Résidentiel',
    tools: ['2020 Design'],
    summary:
      'Une cuisine moderne pensée pour allier esthétique, fonctionnalité et convivialité.',
    description: [
      'Conception d’une cuisine moderne pensée pour allier esthétique, fonctionnalité et convivialité.',
      'Le projet met en valeur des matériaux élégants, des lignes épurées et une palette de couleurs harmonieuse.',
    ],
    cover: img('cuisine-tropicale', 'rendu'),
    ratio: '1072 / 599',
    gallery: [
      { src: img('cuisine-tropicale', 'rendu'), alt: 'Rendu 2020 Design de la cuisine : papier peint tropical, tabourets velours vert, comptoir lunch', w: 1072, h: 599 },
    ],
    materials: [
      { src: img('cuisine-tropicale', 'papier-peint'), label: 'Papier peint tropical' },
      { src: img('cuisine-tropicale', 'ceramique-noyer'), label: 'Céramique & noyer' },
      { src: img('cuisine-tropicale', 'quartz-blanc'), label: 'Quartz blanc' },
      { src: img('cuisine-tropicale', 'plafonnier'), label: 'Plafonnier laiton', cutout: true },
      { src: img('cuisine-tropicale', 'tabourets'), label: 'Tabourets velours', cutout: true },
    ],
    palette: ['#1f5e4a', '#e9a3b6', '#8a6446', '#f4f2ee'],
    model: '/models/cuisine-tropicale.glb',
  },
  {
    slug: 'cuisine-contemporaine',
    title: 'Cuisine',
    script: 'contemporaine',
    category: 'residentiel',
    type: 'Résidentiel',
    tools: ['2020 Design', 'Plans techniques'],
    summary:
      'Une cuisine en L aux façades de bois cannelé, accompagnée de ses plans d’aménagement et d’éclairage.',
    description: [
      'Conception complète réalisée avec 2020 Design : rendu, plan d’aménagement et plan d’éclairage.',
      'Le bois cannelé gris, le quartz veiné et les accents noirs structurent un espace sobre et chaleureux.',
    ],
    cover: img('cuisine-grise', 'rendu'),
    ratio: '1000 / 563',
    gallery: [
      { src: img('cuisine-grise', 'rendu'), alt: 'Rendu 2020 Design de la cuisine en bois cannelé gris avec îlot et tabourets noirs', w: 1000, h: 563 },
      { src: img('cuisine-grise', 'plan-amenagement'), alt: 'Plan d’aménagement de la cuisine', w: 800, h: 450 },
      { src: img('cuisine-grise', 'plan-eclairage'), alt: 'Plan d’éclairage de la cuisine avec légende électrique', w: 800, h: 450 },
    ],
    materials: [
      { src: img('cuisine-grise', 'marbre'), label: 'Quartz veiné' },
      { src: img('cuisine-grise', 'bois'), label: 'Bois cannelé', cutout: true },
      { src: img('cuisine-grise', 'noir'), label: 'Noir velours', cutout: true },
    ],
    palette: ['#6f6a65', '#f1efec', '#1d1d1f', '#a59a8e'],
    model: '/models/cuisine-contemporaine.glb',
  },
  {
    slug: 'salon-mood-board',
    title: 'Salon',
    script: 'Mood Board',
    category: 'residentiel',
    type: 'Planche d’ambiance',
    tools: ['Direction artistique', 'Sélection mobilier'],
    summary:
      'Une ambiance chaleureuse de cuir cognac, de bois brut et d’art abstrait aux reflets cuivrés.',
    description: [
      'Planche d’ambiance pour un salon chaleureux : cuir cognac patiné, bois brut et textures naturelles.',
      'L’œuvre abstraite aux tons rouille et turquoise donne le ton aux suspensions ambrées et au laiton.',
    ],
    cover: img('salon', 'canape'),
    ratio: '1093 / 900',
    moodboard: true,
    gallery: [],
    materials: [
      { src: img('salon', 'cuir'), label: 'Cuir cognac' },
      { src: img('salon', 'bois'), label: 'Bois brut' },
      { src: img('salon', 'tapis'), label: 'Bouclé naturel' },
      { color: '#5b2e12', label: 'Brun chocolat' },
      { color: '#5a1f22', label: 'Bordeaux' },
    ],
    palette: ['#8a4a26', '#5b2e12', '#2f8a86', '#c9a24a'],
    model: null,
  },
]

export const vitrines = [
  { src: img('vitrines', 'davidstea'), brand: 'DAVIDsTEA', alt: 'Vitrine DAVIDsTEA : fenêtre turquoise découpée, fruits géants en relief et clôture blanche', w: 789, h: 1400 },
  { src: img('vitrines', 'prada'), brand: 'Prada', alt: 'Vitrine Prada : fleurs pop, podiums jaunes et rayures colorées', w: 404, h: 665 },
  { src: img('vitrines', 'perle-de-nuit'), brand: 'Perle de nuit', alt: 'Vitrine Perle de nuit : mannequins en robe de soirée devant des cadres dorés', w: 676, h: 962 },
  { src: img('vitrines', 'audemars-piguet'), brand: 'Audemars Piguet', alt: 'Présentoir Audemars Piguet : montre au centre d’une sculpture en étoile bleue', w: 540, h: 1170 },
  { src: img('vitrines', 'xtra-sport'), brand: 'Xtra-Sport', alt: 'Vitrine Xtra-Sport : losange graphique, chaussures et mannequin', w: 440, h: 732 },
  { src: img('vitrines', 'hugo-boss'), brand: 'Hugo Boss', alt: 'Présentoir Hugo Boss : gratte-ciel bleus et échiquier', w: 800, h: 451 },
  { src: img('vitrines', 'victorias-secret'), brand: 'Victoria’s Secret', alt: 'Vitrine Victoria’s Secret : mannequins aux ailes rouges et blanches', w: 676, h: 716 },
]

// Présentation (écrite à la première personne : c’est Ouidiane qui parle).
// Pour la photo : déposer /public/images/portrait.webp puis renseigner `photo`.
export const profile = {
  name: 'Ouidiane Rassidi',
  role: 'Décoratrice d’intérieur et présentatrice visuelle',
  photo: null,
  intro:
    'Décoratrice d’intérieur et présentatrice visuelle, je conçois des espaces où chaque matière, chaque couleur et chaque lumière a sa raison d’être. Du premier croquis à la planche d’ambiance, du plan technique au rendu 3D, j’accompagne particuliers et commerces avec une approche à la fois artistique et rigoureuse.',
  qualities: ['Sens du détail', 'Créativité', 'Écoute', 'Maîtrise technique', 'Savoir-faire manuel'],
  // Chiffre tiré du portfolio imprimé.
  stat: { value: '08', label: 'projets d’intérieur' },
  skills: [
    { icon: 'palette', title: 'Planches d’ambiance', text: 'Je réunis matières, couleurs et mobilier pour fixer l’ambiance dès le départ.' },
    { icon: 'ruler', title: 'Plans', text: 'Du plan d’aménagement au plan d’éclairage, je dessine chaque détail.' },
    { icon: 'cube', title: 'Rendus 3D et vitrines', text: 'Avec SketchUp, Vortek et 2020 Design, je vous fais visiter votre espace avant les travaux, et je fabrique mes vitrines à la main.' },
  ],
  tools: ['SketchUp', 'Vortek', '2020 Design', 'Rendu assisté par IA'],
}

export const contact = {
  phone: '514-467-5767',
  phoneHref: 'tel:+15144675767',
  email: 'widi.rassidi@gmail.com',
}
