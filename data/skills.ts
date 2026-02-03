export interface Skill {
  name: string
  category: 'framework' | 'language' | 'styling' | 'animation' | 'tool' | 'backend'
  highlight?: boolean
}

export const skills: Skill[] = [
  // Frameworks
  { name: 'Vue.js', category: 'framework', highlight: true },
  { name: 'Nuxt', category: 'framework', highlight: true },
  { name: 'React', category: 'framework', highlight: true },
  { name: 'Next.js', category: 'framework', highlight: true },

  // Languages
  { name: 'TypeScript', category: 'language', highlight: true },
  { name: 'JavaScript', category: 'language' },

  // Animation
  { name: 'GSAP', category: 'animation', highlight: true },
  { name: 'Three.js', category: 'animation', highlight: true },

  // Styling
  { name: 'Tailwind', category: 'styling' },
  { name: 'UnoCSS', category: 'styling' },
  { name: 'SCSS', category: 'styling' },

  // Tools
  { name: 'Figma', category: 'tool' },
  { name: 'Git', category: 'tool' },
  { name: 'Docker', category: 'tool' },
  { name: 'Vite', category: 'tool' },

  // Backend
  { name: 'Node.js', category: 'backend' },
  { name: 'GraphQL', category: 'backend' },
  { name: 'REST API', category: 'backend' },
]

// For marquee row 1 - Tech stack
export const marqueeSkills = [
  'VUE.JS',
  'NUXT',
  'REACT',
  'NEXT.JS',
  'TYPESCRIPT',
  'GSAP',
  'THREE.JS',
]

// For marquee row 2 - Stats and keywords
export const marqueeStats = [
  '6+ YEARS',
  '23+ PROJECTS',
  'FRONTEND',
  'ANIMATIONS',
  'PERFORMANCE',
]
