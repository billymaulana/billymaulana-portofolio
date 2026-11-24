import type { RouteRecordNormalized } from 'vue-router'

export interface RouteEntry {
  sheet: string
  path: string
  displayPath: string
  title: string
  group: string
  isDynamic: boolean
}

export interface RouteGroup {
  key: string
  label: string
  entries: RouteEntry[]
}

type UnnumberedEntry = Omit<RouteEntry, 'sheet'>

const TOP_LEVEL = ''

function humanize(segment: string) {
  const words = segment.replace(/[-_]+/g, ' ').trim()
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function deriveTitle(segments: string[]) {
  const staticSegments = segments.filter(segment => !segment.startsWith(':'))
  const last = staticSegments.at(-1) ?? ''
  const parent = staticSegments.at(-2)
  if (parent && /^\d+$/.test(last))
    return `${humanize(parent)} ${last}`
  return humanize(last)
}

function toEntry(record: RouteRecordNormalized): UnnumberedEntry {
  const segments = record.path.split('/').filter(Boolean)
  const title = record.meta.title
  return {
    path: record.path,
    displayPath: record.path.replace(/:(\w+)\([^)]*\)[*+?]?/g, '[$1]'),
    title: typeof title === 'string'
      ? title
      : deriveTitle(segments),
    group: segments.length > 1
      ? segments[0]!
      : TOP_LEVEL,
    isDynamic: record.path.includes(':'),
  }
}

function compareEntries(a: UnnumberedEntry, b: UnnumberedEntry) {
  if (a.group !== b.group) {
    if (a.group === TOP_LEVEL)
      return -1
    if (b.group === TOP_LEVEL)
      return 1
    return a.group.localeCompare(b.group)
  }
  return a.path.localeCompare(b.path, undefined, { numeric: true })
}

/**
 * Catch-all routes compile to a `(.*)` pattern and can never be opened directly,
 * so they are dropped; other dynamic routes stay listed but are not linkable.
 */
function isListable(record: RouteRecordNormalized) {
  return record.path !== '/' && !record.path.includes('(.*)')
}

export function useRouteIndex() {
  const router = useRouter()

  const entries: RouteEntry[] = router.getRoutes()
    .filter(isListable)
    .map(toEntry)
    .sort(compareEntries)
    .map((entry, index) => ({
      ...entry,
      sheet: String(index + 1).padStart(2, '0'),
    }))

  const buckets = new Map<string, RouteEntry[]>()
  for (const entry of entries) {
    const bucket = buckets.get(entry.group)
    if (bucket)
      bucket.push(entry)
    else
      buckets.set(entry.group, [entry])
  }
  const groups: RouteGroup[] = Array.from(buckets, ([key, list]) => ({
    key: key || 'top-level',
    label: key === TOP_LEVEL
      ? 'Top level'
      : humanize(key),
    entries: list,
  }))

  return { entries, groups }
}
