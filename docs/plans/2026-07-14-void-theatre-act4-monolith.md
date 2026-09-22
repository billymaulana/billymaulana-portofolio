# VOID THEATRE — ACT IV: "MONOLITH"

**Basis feedback**: layout BILLY/MAULANA + ghost belum memuaskan; user minta
hitungan karakter & width; usulan user: gabung nama / buang ghost dulu.
Meta corners craft (ACT III) DISUKAI — jangan sentuh.

## Matematika (dasar keputusan)

Switzer 700, tracking -0.035em (rasio lebar per em, diukur runtime via
measureText — angka ini hanya acuan desain):
- BILLY (5 char) ≈ 2.56em · MAULANA (7 char) ≈ 4.75em · rasio 1 : 1.86
- Counter-position dua lebar berbeda = tidak pernah seimbang optis → GANTI.

## Komposisi baru: JUSTIFIED MONOLITH (ref: chdartmaker.com stacked justified)

- KEDUA baris fit ke LEBAR SAMA `W = 82vw` desktop (`92vw` ≤768px), flush kiri
  di page margin — tepi kanan otomatis rata karena lebar sama.
- fontB = W / rasioBILLY, fontM = W / rasioMAULANA (runtime measureText,
  bukan hardcode) → BILLY ≈ 1.86× MAULANA. Kontras skala = drama; grid = Swiss.
- Susun BLOK vertikal (cap-height stacking, bukan line-height):
  hB = 0.72·fontB · hM = 0.72·fontM · gap g = 0.12·fontM
  H = hB + g + hM · blockTop = (viewportH − H)/2 + 0.02·viewportH
  baselineB = blockTop + hB · baselineM = baselineB + g + hM
  → yFrac per baris DINAMIS (dihitung ulang saat resize), bukan konstanta.
- Ghost "frontend architect" DIHAPUS dari hero (element + entrance beat +
  drift; hapus attachGhostDrift dari useHeroStage — dead code).
- Meta corners, dot pulse, clock, rotator, index, fluid, distortion,
  crossfade DOM→canvas: TIDAK BERUBAH.
- Entrance nama tetap per-char blur; kedua baris kini dari kiri (x -24),
  MAULANA stagger menyusul BILLY 0.2s.

## Gates
typecheck + lint pass · console bersih · kedua baris rata kiri-kanan presisi
di 1440/2560/mobile · blok centered optis · crossfade tanpa geser.
