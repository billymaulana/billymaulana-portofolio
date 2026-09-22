# Reference Note Schema

Satu situs = satu note `references/library/<slug>.md`. Field yang di-index WAJIB top-level; array WAJIB inline (`[a, b]`).

| Field | Tipe | Wajib | Nilai |
| --- | --- | --- | --- |
| type | string | ya | selalu `reference` |
| slug | string | ya | kebab-case = nama file tanpa `.md` |
| title | string | ya | nama situs |
| source_url | string | ya | URL |
| captured | date | ya | YYYY-MM-DD |
| awwwards_status | string | tidak | SOTD \| Honorable Mention \| Nominee \| Non-awwwards |
| category | string[] inline | ya | portfolio\|agency\|ecommerce\|saas\|editorial\|product\|experimental |
| style | string[] inline | ya | dari 14 kategori style-dna-guide §1 |
| fonts | string[] inline | **ya** | nama famili font PERSIS seperti terbaca dari `getComputedStyle`, bukan tebakan. Urut: display/primary dulu, lalu body, lalu label/accent. Mis. `[Suisse, Apparel]` |
| grid | string | **ya** | deskripsi bebas & konkret dengan angka — mis. `Container 20px gutter; baris asimetris 3-kolom 356px + 1069px` |
| grid_type | string[] inline | **ya** | kosakata terkontrol (lihat di bawah) — divalidasi `taste-index.mjs`, nilai di luar daftar = error |
| motion | string[] inline | tidak | scroll-scrub, text-reveal, ... |
| libraries | string[] inline | tidak | gsap, lenis, three, webgpu, framer-motion |
| mood | string[] inline | ya | **2–3 token** dari taxonomy 18 token (lihat di bawah). Satu token saja tidak cukup — kombinasi yang membedakan |
| verdict | string | tidak | kutipan Billy kenapa suka |
| influence | string | tidak | strengthen \| new \| confirm |
| rating | number | tidak | 1-10 (rubrik evaluation-system) |
| thumb | string | tidak | path screenshot desktop relatif ke library/ (mis. `assets/<slug>-desktop.png`) |
| summary | string | tidak | satu baris esensi (fallback: verdict) |

## Kosakata `mood` (diperluas 2026-07-26 — 6 token → 18 token)

Definisi lengkap + penanda terukur per token ada di `../editorial/05-developing-taste.md` §4.
Isi 2–3 token; kombinasi jauh lebih informatif daripada satu token.

| Keluarga | Token |
| --- | --- |
| Ketegangan | `calm` · `tense` · `austere` · `serene` |
| Status | `premium` · `luxurious` · `clinical` · `raw` |
| Energi | `kinetic` · `brutal` · `playful` · `monumental` · `energetic` |
| Atmosfer | `cinematic` · `mystic` · `organic` · `nostalgic` · `surreal` |

Anti-mood (`corporate`, `sterile`, `cute`, `sporty`, `template`) **tidak boleh** dipakai di
field `mood` — kalau sebuah referensi terasa begitu, tulis di `verdict` dan jangan jadikan
benchmark.

Catatan: `taste-index.mjs` belum memvalidasi `mood` (hanya `grid_type`). Kepatuhan pada
kosakata ini bersifat konvensi — jaga manual sampai validasi ditambahkan.

## Kosakata `grid_type` (terkontrol — divalidasi)

Sumber kebenaran ada di `GRID_TYPES` dalam `docs/awwwards/scripts/taste-index.mjs`.
Boleh gabung beberapa (mis. `[swiss, asymmetric, edge-anchored]`). Jangan bikin token baru
tanpa menambahkannya ke `GRID_TYPES` lebih dulu — kalau tidak, `taste-index.mjs` akan menolak note.

| Token | Arti |
| --- | --- |
| `swiss` | Kolom Van de Graaf / international typographic. Grid sebagai fondasi, spacing matematis |
| `editorial` | Kolom majalah/print: meta-row, hairline rule, index table, pull quote |
| `asymmetric` | Counter-positioned, diagonal tension, bobot kiri/kanan sengaja tidak seimbang |
| `edge-anchored` | Konten flush ke gutter/tepi viewport; sudut-sudut dipakai sebagai anchor |
| `full-bleed` | Media atau tipografi menembus seluruh lebar viewport tanpa margin |
| `split-panel` | Pembagian panel berdampingan (50/50 atau serupa), tiap panel punya ground sendiri |
| `centered` | Satu kolom terpusat sebagai struktur utama |
| `modular` | Tile/kartu berulang dengan modul seragam |
| `broken-grid` | Pelanggaran grid yang disengaja, elemen saling tumpuk keluar kolom |
| `scattered` | Elemen tersebar bebas (mosaik foto, tipografi scatter) tanpa kolom tetap |

Field non-index (nested, untuk body/manusia): `typography:` dan `color:` boleh ditulis sebagai blok nested — indexer mengabaikannya.
`fonts` (top-level, ter-index) menyimpan **nama famili** saja untuk query; detail ukuran/weight/tracking tetap di blok `typography:`.

Payload capture juga menerima array `sections` (non-frontmatter): tiap objek `{ name, screenshot, layout, typography, motion, color, concept, technique }` dirender jadi tabel di bawah heading `## Section-by-Section`. Screenshot per-section disimpan `assets/<slug>-<section-slug>.png` (mis. `assets/emotion-agency-the-problem.png`). Hero tetap `assets/<slug>-desktop.png` (= `thumb`) + `assets/<slug>-mobile.png`.

Body mengikuti `../site-analysis-framework.md`. Setelah ubah note jalankan `node docs/awwwards/scripts/taste-index.mjs`.
