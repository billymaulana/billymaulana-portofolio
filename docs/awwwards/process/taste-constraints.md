# Batasan taste (warna, tipografi, layout)

> Dipindah verbatim dari `CLAUDE.md` repo pada 2026-11-23. Bila isi di sini bertentangan dengan `CLAUDE.md` § Cara kerja art director (pelajari taste dari prinsip master brief, jangan meniru situs), `CLAUDE.md` yang berlaku.

**Identity**: Brutalist Expression + Premium Feel + Swiss Grid + Dark Cinematic + Vibrant Chromatic Accents + Liquid/Glass Materials + Extreme Bold Typography

> **Direvisi 2026-07-26** — 5 aturan di bawah dilonggarkan setelah diverifikasi ke 11 entri
> `references/library/`. Baca `docs/awwwards/personal-taste-profile.md` § "Revisi 2026-07-26"
> sebelum menegakkan larangan apa pun di bagian ini.

### Hard Constraints — Colors
- Vibrant > muted **untuk AKSEN**. Ground/palet dasar boleh muted asal koheren dan punya suhu warna jelas *(revisi 2026-07-26 — kata "Always" dicabut)*.
- `mix-blend-mode` systematic per section: `luminosity` (hero heading), `difference` (nav auto-invert + ghost shadows), `screen` (fluid canvas), `overlay` (grain), `color-burn` (warm depth)
- Interaction-driven color > static decoration (fluid velocity → chromatic split)
- **BANNED**: pastel/muted **accents**, purple gradients, invisible gradients (< 0.05 opacity)
- **Bersyarat, tidak lagi BANNED** *(2026-07-26)*: ground terang (wajib hangat `#FFFDF5`/`#FCFCFC`, bukan putih layar, dan dipakai sebagai pergantian ritme antar section); hijau sebagai ground penuh section (yang tetap dilarang: hijau sebagai aksen melayang di atas bg gelap).
- **Identity palette `#0047FF` / `#0166c9` / `#0f0a72` / `#a1e0e7` TIDAK berubah** — revisi di atas soal menilai referensi & memilih ground section, bukan izin mengganti palet brand.

### Palet Liquid Thermal — disukai Billy (dicatat 2026-09-20)

Sumber: `app/pages/liquid/liquid-2.vue` → fungsi `thermal()` di `contentDisplayShaderSource`
(dulu juga ada di `/explore/liquid/liquid-1`; isinya identik, rute itu dihapus 2026-11-23). Hex
dihitung dari konstanta `vec3` shader (`round(v × 255)`), bukan ditaksir dari screenshot.

| Stop | `t` | Hex | Peran |
|---|---|---|---|
| C0 | 0.000 | `#050507` | void — sama dengan background halaman |
| C1 | 0.130 | `#0F0A72` | indigo — sama dengan identity `#0f0a72`; ekor tinta paling dingin |
| C2 | 0.280 | `#3A1A9E` | ungu tua |
| C3 | 0.430 | `#6B2FC8` | violet |
| C4 | 0.560 | `#A32BA8` | magenta |
| C5 | 0.680 | `#D45C6E` | rose |
| C6 | 0.790 | `#EE8A2A` | oranye |
| C7 | 0.875 | `#F8BF27` | amber |
| C8 | 0.935 | `#FEE55D` | kuning |
| C9 | 0.975 | `#FFF5B3` | cream |
| C10 | 1.000 | `#FFFEF5` | putih hangat — inti terpanas, tidak pernah putih layar |

Aturan pemakaian yang membuat palet ini terlihat seperti di rute tersebut:

- Antar-stop di-`mix` dengan `smoothstep`, bukan linear — pita warna tidak punya sambungan keras.
- Stop menyempit ke ujung panas (0.13 → 0.04 → 0.025): nada kuning–cream muncul hanya di inti
  goresan, sisa tubuh tinta berada di indigo–violet–magenta.
- Suhu: `heat = pow(1 − exp(−(presence·0.62 + speed·0.0042)·1.35), 0.62)` — kurva asimtotik,
  inti tidak pernah runtuh jadi bidang cream rata.
- Tepi yang bergerak memakai `thermal(min(heat + 0.34, 1))` — aberasi diambil dari ramp, tidak
  pernah cyan/merah dari pemisahan kanal RGB.
- Ground halaman `#050507`, kanvas `mix-blend-mode: screen`.
- `FLUID.color` (`#0047FF`) **diabaikan** di mode `thermal`. Akibatnya `effect-audit --identity "#0047FF"`
  dan `hue-discipline` selalu FAIL di rute ini, sejak sebelum perbaikan motion. Itu sifat palet, bukan cacat.

### Hard Constraints — Typography
- Extreme viewport-filling scale, If it doesn't feel too big, it's not big enough.
- Negative letter-spacing **berbasis ambang ukuran** *(revisi 2026-07-26)*: rentang terverifikasi `-6px`/`-4px` (display ekstrem) → `-3px` at 120px → `-1px` at 60px → normal di ≤40px.
- Line-height dikunci per tier: display 0.85 · statement 1.0 · body 1.3.
- Weight **300–700 per konteks** — bold bukan syarat; hierarki wajib kontras lewat lompatan ukuran.
- Typography as visual material: text-as-mask, chromatic shadow clones (3x RGB layers), blend modes
- Per-char SplitText stagger 0.02-0.05s, blur-to-sharp scrubbed to scroll. `wrapSpecificText()` for serif accents.
- **BANNED**: safe proportional sizing, generic bold/regular contrast
- **Font monospace DIHINDARI di project ini** *(2026-07-26, permintaan Billy)* — berlaku untuk
  SELURUH peran, termasuk yang biasanya "aman": label, eyebrow, meta-row, counter, nav, HUD,
  ticker, caption, dan angka teknis. Termasuk JetBrains Mono, Fira Code, Space Mono,
  CentSchbook Mono BT, dan `monospace` generik.
  - **Ganti dengan**: famili grotesk yang sama dengan display (jalur single-family), ukuran
    12–14px, **sentence case**, tracking netral s/d `-0.04em` — BUKAN uppercase ber-tracking
    positif; aturan "≤13px → +0.08em uppercase" sudah DICABUT (bukti: 14 dari 15 referensi,
    `personal-taste-profile.md` § "Tracking negatif berlaku di SEMUA tier").
    Kalau yang dibutuhkan hanya kolom angka yang rata, pakai
    `font-variant-numeric: tabular-nums` pada famili non-mono.
  - Referensi di `docs/awwwards/references/library/` yang memakai mono (mis. `isabel-moranta.md`,
    `emotion-agency.md`) tetap sah dinilai dan ditiru **strukturnya** — yang diadopsi rasio,
    tracking, dan sistem label-nya, bukan famili mono-nya.
- **Single font family DIIZINKAN** *(2026-07-26, `BANNED` dicabut)* — syarat: rasio display:body ≥5x dan leading dikunci per tier. Satu famili + ukuran seragam tetap ditolak.


### Hard Constraints — Layout
- Swiss Grid (Van de Graaf, rectangular grid)
- Every section = distinct visual identity. Adjacent sections MUST differ.
- Counter-positioned typography (diagonal tension). Negative space as design element.
- Circular narrative: footer mirrors hero. Site loops, not ends.
- Depth z-stack: bg(1) → atmosphere(2-3) → ghost/blend(3-5) → content(10) → overlay(50+)
- **BANNED**: 3-column card grid, centered hero+CTA, identical section padding, glassmorphism cards, linear structure

---
