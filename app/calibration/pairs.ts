export type SpecimenLayout
  = | 'bleed-bottom'
    | 'split-blocks'
    | 'value-hierarchy'
    | 'scale-jump'
    | 'editorial-dense'
    | 'minimal'
    | 'accent-glyph'

export interface SpecimenComposition {
  layout: SpecimenLayout
  ref: string
  ground: string
  ink: string
  muted: string
  accent: string | null
  displayFamily: string
  displaySize: string
  displayWeight: number
  displayTracking: string
  displayLeading: number
  displayCase: 'uppercase' | 'none'
  bodyFamily: string
  bodySize: string
  bodyWeight: number
  bodyTracking: string
  bodyLeading: number
}

export interface PairVariant {
  label: string
  spec: string
  comp: SpecimenComposition
}

export interface CalibrationPair {
  id: string
  dim: string
  question: string
  hypothesis: string
  a: PairVariant
  b: PairVariant
}

const BASE: SpecimenComposition = {
  layout: 'bleed-bottom',
  ref: '—',
  ground: '#050505',
  ink: '#FAFAFA',
  muted: 'rgb(255 255 255 / 0.42)',
  accent: null,
  displayFamily: 'Switzer, sans-serif',
  displaySize: 'clamp(3rem, min(14vw, 20vh), 15rem)',
  displayWeight: 400,
  displayTracking: '-0.02em',
  displayLeading: 0.9,
  displayCase: 'none',
  bodyFamily: 'Switzer, sans-serif',
  bodySize: '1.25rem',
  bodyWeight: 400,
  bodyTracking: '-0.01em',
  bodyLeading: 1.5,
}

function comp(over: Partial<SpecimenComposition>): SpecimenComposition {
  return { ...BASE, ...over }
}

/* Setiap varian adalah rekonstruksi komposisi dari satu situs di references/library/ yang
   sudah Billy sebut bagus — bukan konfigurasi karangan. Itu syarat agar minimal satu sisi
   layak dipilih (rule 2026-07-26). */
export const pairs: CalibrationPair[] = [
  {
    id: 'composition-bleed-vs-blocks',
    dim: 'Pola komposisi',
    question: 'Mana yang lebih Anda?',
    hypothesis: 'Möbius memotong wordmark di tepi bawah; Vertical memecahnya jadi blok bertumpuk. Dua cara berbeda membuat tipografi jadi arsitektur.',
    a: {
      label: 'Wordmark menembus tepi',
      spec: 'ref Möbius · paragraf kiri-atas · wordmark dipotong tepi bawah · meta kanan-bawah',
      comp: comp({ layout: 'bleed-bottom', ref: 'mobius', displayFamily: 'Inter, sans-serif', displayWeight: 900, displayTracking: '-0.03em', displayLeading: 0.8 }),
    },
    b: {
      label: 'Wordmark dipecah blok',
      spec: 'ref Vertical · BIL / LY / MAULANA bertumpuk · tracking −0.08em',
      comp: comp({ layout: 'split-blocks', ref: 'vertical', displayFamily: 'Inter, sans-serif', displayWeight: 700, displayTracking: '-0.08em', displayLeading: 0.8 }),
    },
  },
  {
    id: 'weight-heavy-vs-light',
    dim: 'Weight display',
    question: 'Mana yang terasa lebih mahal?',
    hypothesis: 'Referensi Inter memakai weight 700–900; referensi Switzer/PP Neue Montreal memakai 300–400 pada ukuran yang sama besar.',
    a: {
      label: 'Berat — Inter 800',
      spec: 'ref Nexola · Inter 800 · tracking 0 · leading 0.80',
      comp: comp({ layout: 'value-hierarchy', ref: 'nexola', displayFamily: 'Inter, sans-serif', displayWeight: 800, displayTracking: '0em', displayLeading: 0.8 }),
    },
    b: {
      label: 'Ringan — Switzer 300',
      spec: 'ref Vitae® · Switzer 300 · tracking −0.10em · leading 0.70',
      comp: comp({ layout: 'value-hierarchy', ref: 'vitaeresume', displayWeight: 300, displayTracking: '-0.1em', displayLeading: 0.7 }),
    },
  },
  {
    id: 'leading-tight-vs-open',
    dim: 'Leading display',
    question: 'Mana jarak barisnya yang pas?',
    hypothesis: 'Viper memakai 0.77, Creative Web Manual 1.00. Keduanya Billy sebut bagus.',
    a: {
      label: 'Rapat 0.77',
      spec: 'ref Viper · leading 0.77 · dua baris nyaris bersentuhan',
      comp: comp({ layout: 'bleed-bottom', ref: 'viper-template', displayFamily: 'Inter, sans-serif', displayWeight: 700, displayTracking: '-0.035em', displayLeading: 0.77 }),
    },
    b: {
      label: 'Terbuka 1.00',
      spec: 'ref Creative Web Manual · leading 1.00 · tracking −0.02em',
      comp: comp({ layout: 'bleed-bottom', ref: 'creativewebmanual', displayWeight: 400, displayTracking: '-0.02em', displayLeading: 1 }),
    },
  },
  {
    id: 'hierarchy-value-vs-scale',
    dim: 'Cara membangun hierarki',
    question: 'Mana yang lebih kuat?',
    hypothesis: 'Mugen membedakan lewat NILAI abu pada ukuran sama; Norvin lewat lompatan ukuran ekstrem.',
    a: {
      label: 'Lewat nilai abu',
      spec: 'ref Mugen · dua baris seukuran, satu #FAFAFA satu #B8B8B8',
      comp: comp({ layout: 'value-hierarchy', ref: 'mugenstudio', displayFamily: 'Inter, sans-serif', displayWeight: 700, displayTracking: '-0.04em', displayLeading: 0.8, muted: '#B8B8B8' }),
    },
    b: {
      label: 'Lewat lompatan ukuran',
      spec: 'ref Norvin · angka indeks raksasa di belakang masthead',
      comp: comp({ layout: 'scale-jump', ref: 'norvin', displayFamily: 'Inter, sans-serif', displayWeight: 600, displayTracking: '-0.06em', displayLeading: 0.93 }),
    },
  },
  {
    id: 'ground-dark-vs-light',
    dim: 'Ground',
    question: 'Mana ground yang lebih Anda?',
    hypothesis: '12 dari 15 referensi memakai hampir-hitam, tapi 3 yang terang juga Anda sebut bagus.',
    a: {
      label: 'Hampir-hitam #0A0A0A',
      spec: 'ref Baselane · ground #0A0A0A · ink #FAFAFA',
      comp: comp({ layout: 'split-blocks', ref: 'baselane', ground: '#0A0A0A', ink: '#FAFAFA', muted: 'rgb(255 255 255 / 0.45)' }),
    },
    b: {
      label: 'Terang hangat #EAEAEA',
      spec: 'ref Creative Web Manual · ground #EAEAEA · ink #070707',
      comp: comp({ layout: 'split-blocks', ref: 'creativewebmanual', ground: '#EAEAEA', ink: '#070707', muted: 'rgb(7 7 7 / 0.5)' }),
    },
  },
  {
    id: 'accent-single-vs-none',
    dim: 'Aksen warna',
    question: 'Mana yang lebih Anda?',
    hypothesis: 'Viper memberi warna pada SATU glyph saja; Monod tidak memakai warna aksen sama sekali.',
    a: {
      label: 'Satu glyph beraksen',
      spec: 'ref Viper · satu glyph ® diberi #0047FF, sisanya netral',
      comp: comp({ layout: 'accent-glyph', ref: 'viper-template', accent: '#0047FF', displayFamily: 'Inter, sans-serif', displayWeight: 700, displayTracking: '-0.035em', displayLeading: 0.8 }),
    },
    b: {
      label: 'Monokrom murni',
      spec: 'ref Mōno™ · nol warna aksen · hitam-putih penuh',
      comp: comp({ layout: 'accent-glyph', ref: 'monod', accent: null, displayFamily: 'Inter, sans-serif', displayWeight: 600, displayTracking: '-0.045em', displayLeading: 0.85 }),
    },
  },
  {
    id: 'case-sentence-vs-upper',
    dim: 'Case display',
    question: 'Mana yang lebih Anda?',
    hypothesis: 'Lyniq & Norvin memakai sentence case; Porto & Plutarch memakai UPPERCASE penuh.',
    a: {
      label: 'Sentence case',
      spec: 'ref Lyniq · sentence case · Inter 700 · tracking −0.06em',
      comp: comp({ layout: 'bleed-bottom', ref: 'lyniq', displayFamily: 'Inter, sans-serif', displayWeight: 700, displayTracking: '-0.06em', displayLeading: 0.8, displayCase: 'none' }),
    },
    b: {
      label: 'UPPERCASE penuh',
      spec: 'ref Plutarch · uppercase · Switzer 300 · tracking −0.04em',
      comp: comp({ layout: 'bleed-bottom', ref: 'plutarch', displayWeight: 300, displayTracking: '-0.04em', displayLeading: 0.9, displayCase: 'uppercase' }),
    },
  },
  {
    id: 'density-minimal-vs-editorial',
    dim: 'Densitas konten',
    question: 'Mana yang lebih Anda?',
    hypothesis: 'Portrixe hanya menampilkan nama + satu kalimat; Creative Web Manual memadatkan angka, teks, dan daftar sekaligus.',
    a: {
      label: 'Minimal',
      spec: 'ref Portrixe · nama + satu kalimat · leading display 1.15',
      comp: comp({ layout: 'minimal', ref: 'portrixe', displayFamily: 'Satoshi, sans-serif', displayWeight: 700, displayTracking: '-0.02em', displayLeading: 1.15 }),
    },
    b: {
      label: 'Padat editorial',
      spec: 'ref Creative Web Manual · angka bab + paragraf + daftar proyek',
      comp: comp({ layout: 'editorial-dense', ref: 'creativewebmanual', displayWeight: 400, displayTracking: '-0.02em', displayLeading: 1 }),
    },
  },
]
