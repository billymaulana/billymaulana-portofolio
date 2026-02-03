export interface Profile {
  name: string
  firstName: string
  lastName: string
  title: string
  tagline: string
  bio: string
  location: string
  email: string
  phone: string
  website: string
  linkedin: string
  github: string
  instagram: string
  yearsExperience: number
  projectsCount: number
  companiesCount: number
  resumeUrl: string
}

export const profile: Profile = {
  name: 'Billy Maulana',
  firstName: 'billy',
  lastName: 'maulana',
  title: 'Frontend Engineer',
  tagline: 'Transforming pixels into performance. Building interfaces that move millions.',
  bio: `Bandung, Indonesia. 7+ years deep in the Vue.js trenches, turning Figma dreams into buttery-smooth reality.

Built PLN Mobile — Indonesia's utility super app serving 80M+ users. Architected design systems that 200+ developers ship with daily. I don't just write code; I craft experiences that users feel.

Currently leading frontend at SigmaTech. Always hunting for that perfect 60fps.`,
  location: 'Bandung, Indonesia',
  email: 'billymaulana1999@gmail.com',
  phone: '+62 838 4047 4590',
  website: 'www.billymaulana.com',
  linkedin: 'https://linkedin.com/in/billy-maulana',
  github: 'https://github.com/billymaulana',
  instagram: 'https://instagram.com/billymaulana',
  yearsExperience: 7,
  projectsCount: 23,
  companiesCount: 4,
  resumeUrl: '/Billy Maulana - Resume.pdf',
}

export interface Experience {
  company: string
  role: string
  type: 'fulltime' | 'contract' | 'internship'
  startYear: number
  endYear: number | null
  description: string
  isLead?: boolean
}

export const experiences: Experience[] = [
  {
    company: 'SigmaTech',
    role: 'Front-End Developer',
    type: 'contract',
    startYear: 2023,
    endYear: null,
    description: 'Programmer outsourcing company with reliable developers and development processes.',
    isLead: true,
  },
  {
    company: 'IndoChat',
    role: 'Front-End Developer',
    type: 'contract',
    startYear: 2022,
    endYear: 2023,
    description: 'Social media app keeping users connected with loved ones and the world.',
  },
  {
    company: 'Vhiweb',
    role: 'Lead Developer',
    type: 'fulltime',
    startYear: 2018,
    endYear: 2022,
    description: 'Modern Digital Agency solving client\'s real-world digital problems.',
    isLead: true,
  },
  {
    company: 'HWTours',
    role: 'Full-Stack Developer',
    type: 'fulltime',
    startYear: 2017,
    endYear: 2017,
    description: 'Travel agent providing accommodation, hotels, tour packages, and flights.',
  },
  {
    company: 'Smooets',
    role: 'Back-End Developer',
    type: 'internship',
    startYear: 2016,
    endYear: 2016,
    description: 'Programmer outsourcing company - internship experience.',
  },
]
