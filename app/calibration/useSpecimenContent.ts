import { profile } from '~/constants/profile'
import { projects } from '~/constants/projects'

export function useSpecimenContent() {
  const first = profile.firstName
  const last = profile.lastName
  const rows = projects.filter(p => p.featured).slice(0, 3)

  return {
    first,
    last,
    full: `${first} ${last}`,
    role: profile.title,
    location: profile.location,
    tagline: profile.tagline,
    years: profile.yearsExperience,
    count: profile.projectsCount,
    rows,
    /* Dipecah untuk layout blok: dua suku kata pertama berdiri sendiri, sisanya satu baris. */
    blocks: [first.slice(0, 3), first.slice(3), last],
  }
}
