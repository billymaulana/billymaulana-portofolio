export interface Project {
  id: string
  name: string
  category: string
  description: string
  thumbnail?: string
  url?: string
  playStore?: string
  appStore?: string
  technologies: string[]
  year: number
  featured: boolean
}

export const projects: Project[] = [
  {
    id: 'pln-mobile',
    name: 'PLN Mobile',
    category: 'Digital Utility Super App',
    description: 'Transforming PLN into digital services by developing a super app to provide a better customer experience and trust. PLN Mobile helps customers to easily access the services provided by PLN Indonesia.',
    thumbnail: '/assets/images/projects/pln-mobile.jpg',
    playStore: 'https://play.google.com/store/apps/details?id=com.icon.pln123',
    technologies: ['Vue.js', 'TypeScript', 'Mobile App'],
    year: 2023,
    featured: true,
  },
  {
    id: 'flexben',
    name: 'Flexben',
    category: 'Employee Benefits Platform',
    description: 'A flexible benefits platform that streamlines the management of employee benefits for organizations of all sizes. Enables companies to customize benefit programs while enhancing employee satisfaction.',
    thumbnail: '/assets/images/projects/flexben.jpg',
    url: 'https://flexben.id',
    technologies: ['Vue.js', 'Nuxt', 'TypeScript'],
    year: 2023,
    featured: true,
  },
  {
    id: 'unesco-ihp',
    name: 'UNESCO IHP RSC',
    category: 'Environmental Research Platform',
    description: 'Comprehensive redesign of the UNESCO IHP RSC website, focusing on the Catalogue of Hydrologic Analysis and River Catalogue. Critical data made accessible to the public and UNESCO Water Family.',
    thumbnail: '/assets/images/projects/unesco.jpg',
    url: 'https://ihp-rscap.org',
    technologies: ['Vue.js', 'Nuxt', 'CMS'],
    year: 2022,
    featured: true,
  },
  {
    id: 'design-system-kbfmf',
    name: 'Design System Libraries',
    category: 'Component Library',
    description: 'Design System Libraries for internal use at KBFMF. Provides the base component for frontend applications with KreditPlus style.',
    thumbnail: '/assets/images/projects/dsl.jpg',
    url: 'https://dsl-kp.web.app',
    technologies: ['Vue.js', 'Storybook', 'NPM Package'],
    year: 2023,
    featured: true,
  },
  {
    id: 'indochat',
    name: 'IndoChat',
    category: 'Social Media Application',
    description: 'IndoChat is a social media app with features like Call, Video and News. Keeping users connected with loved ones and the world.',
    thumbnail: '/assets/images/projects/indochat.jpg',
    url: 'https://indochat.co.id',
    playStore: 'https://play.google.com/store/apps/details?id=id.co.indochat.app',
    appStore: 'https://apps.apple.com/id/app/lndochat/id1470570516',
    technologies: ['Vue.js', 'WebSocket', 'Mobile'],
    year: 2022,
    featured: true,
  },
  {
    id: 'depot',
    name: 'Depot',
    category: 'E-commerce Fulfillment',
    description: 'Robust fulfillment center platform that supports businesses and Depot warehouse operations. Simplifies the entire sales process by integrating multiple marketplaces.',
    thumbnail: '/assets/images/projects/depot.jpg',
    url: 'https://seller.depot.co.id',
    technologies: ['Vue.js', 'TypeScript', 'REST API'],
    year: 2023,
    featured: false,
  },
  {
    id: 'sally',
    name: 'Sally',
    category: 'Finance Application',
    description: 'Web and mobile application designed to streamline credit management processes within PT KB Finansia. Empowers internal employees with credit calculations, applications, and approvals.',
    thumbnail: '/assets/images/projects/sally.jpg',
    url: 'https://sally.kbfinansia.com',
    technologies: ['Vue.js', 'TypeScript', 'Finance'],
    year: 2023,
    featured: false,
  },
  {
    id: 'drupadi',
    name: 'Drupadi',
    category: 'Corporate Travel Platform',
    description: 'Corporate travel management platform helping companies manage travel businesses with travel policies and approval processes.',
    thumbnail: '/assets/images/projects/drupadi.jpg',
    url: 'https://drupadi.id',
    technologies: ['Vue.js', 'Nuxt', 'Travel'],
    year: 2021,
    featured: false,
  },
  {
    id: 'explorer-id',
    name: 'Explorer.ID',
    category: 'Travel E-Commerce',
    description: 'Open trip e-commerce from White Horse targeting millennial users. Mobile apps and web-based e-commerce for extra revenue.',
    thumbnail: '/assets/images/projects/explorer.jpg',
    url: 'https://explorer.id',
    playStore: 'https://play.google.com/store/apps/details?id=id.explorer.mobile',
    appStore: 'https://apps.apple.com/id/app/explorer-id-open-trip-app/id1427266971',
    technologies: ['Vue.js', 'Mobile', 'E-commerce'],
    year: 2020,
    featured: false,
  },
  {
    id: 'travelbiz',
    name: 'TravelBiz.ID',
    category: 'B2B & B2C Marketplace',
    description: 'The first B2B and B2C travel marketplace in Indonesia connecting travel merchants, travel agents, and travelers.',
    thumbnail: '/assets/images/projects/travelbiz.jpg',
    url: 'https://market.travelbiz.id',
    technologies: ['Vue.js', 'Marketplace', 'Travel'],
    year: 2020,
    featured: false,
  },
]

// Get featured projects for landing page
export const featuredProjects = projects.filter(p => p.featured)
