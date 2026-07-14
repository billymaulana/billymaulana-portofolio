# VOID THEATRE — ACT II: "ORBIT" (Hero v2)

**Tanggal**: 2026-07-14 · **Status**: BUILD · **Basis feedback user**:
layout hero tidak disukai; hero terasa kosong/monoton setelah dilihat berulang —
hanya teks + liquid, tidak ada kehidupan idle, tidak ada objek memorable.
Diagnosis: gagal EMPTY test + OBJECT test (30-Second Reject Test).

## Konsep

Panggung teater void. Dua kata nama = aktor di sudut berlawanan (tensi diagonal
Swiss). Di antara keduanya: **orb iridescent** — performer yang bernapas,
persist dari preloader ke hero. Panggung tidak pernah mati: orb morphing,
status berganti, waktu berdetak. Tinta liquid tetap murni reward interaksi.

## Teknik → Referensi (reference-first)

| Teknik | Referensi |
|---|---|
| Counter-positioned dual H1 (BILLY kiri-atas / MAULANA kanan-bawah) | latchezarboyadjiev.com |
| Gradient/iridescent orb + intro scale 0.25→1 + object persist opening→hero | kaitonote.com |
| Number scramble pada index/counter | kaitonote.com |
| Serif italic accent di dalam role line (`wrapSpecificText` pattern) | kaitonote.com / art-yakushev.com |
| Status rotator scramble per-char | art-yakushev.com |
| Fluid ink interaktif (Navier-Stokes, multi-color dye) | daspritam.in |
| Text distortion + chromatic split saat warp | crz.digital / supersolid.agency |
| Blur-to-sharp per-char entrance | art-yakushev.com |

## Layer stack (bawah → atas)

1. `z:1` — bg void #060610 + atmospheric radial + vignette (existing)
2. `z:2` — **orb canvas** (Three.js `useIridescentBlob`, transparent bg), posisi x 58% / y 47%, ukuran ~34vmin
3. `z:3` — fluid ink canvas (existing, `mix-blend-mode: screen`) — tinta melukis DI DEPAN orb
4. `z:4` — grain (existing)
5. `z:5` — text distortion canvas (counter-positioned) + meta grid + frame

## Layout

- **BILLY**: kiri-atas, flush left ke page margin, baseline ~38% viewport height
- **MAULANA**: kanan-bawah, flush right ke page margin, baseline ~78% viewport height
- Ukuran font: clamp besar (target visual ±13vw, tracking -0.035em), SATU canvas
  distortion — `useTextDistortion.lines` diperluas: `{ text, xAlign: 'left'|'right', yFrac }`
- **Meta grid** (Martian Mono / var(--font-mono), 10-11px, tracking 0.14em, chrome 55%):
  - kiri-atas (di bawah nav): `FRONTEND ARCHITECT` + baris kedua serif italic `& creative developer`
  - kanan-atas: `PORTFOLIO — 2026 / V.2`
  - kiri-tengah vertikal: `01 / HERO` (number scramble saat entrance)
  - kiri-bawah: status rotator scramble tiap 8s: `AVAILABLE FOR SELECT WORK` → `VUE · NUXT · TYPESCRIPT` → `WEBGL · GSAP · MOTION`
  - tengah-bawah: scroll hint (existing)
  - kanan-bawah: `BANDUNG, ID — HH:MM:SS GMT+7` (detik berdetak, tabular-nums)
- **Frame hairline** inset 1px (chrome, opacity 0.08–0.12), inset `clamp(1rem, 2vw, 2rem)`,
  digambar saat entrance (scaleX/scaleY dari center, expo.inOut)

## Entrance (sekali per load, setelah preloader complete)

| t | Beat |
|---|---|
| 0.0s | Orb scale 0.25→1 + fade, expo.inOut 1.6s (kontinuitas dari preloader) |
| 0.4s | BILLY per-char: blur 16px→0 + x -24→0, stagger 0.022, power4.out |
| 0.6s | MAULANA per-char sama, dari +24, stagger from end |
| 1.0s | Meta labels scramble-in, stagger 0.09 |
| 1.2s | Frame hairline draw 1.2s expo.inOut |
| 1.4s | Index `01` number-scramble; clock mulai berdetak |

## Idle life (loop, tanpa interaksi — anti-monoton)

- Orb: morph noise perpetual + breathing scale ±3% (sine ~6s) + iridescence drift lambat
- Status rotator scramble tiap 8s
- Clock berdetak tiap detik
- TIDAK ada auto-splat fluid — tinta tetap murni interaksi (Zeigarnik)

## Interaksi

- Fluid ink + text distortion + chromatic (existing, params dipertahankan)
- Fluid detail polish: `SIM_RESOLUTION` 128→256, `CURL` 18→30, `SPLAT_RADIUS` 0.25→0.18
  (filamen tinta lebih halus dan berdetail)
- Orb proximity: cursor < ~200px → lean posisi (GSAP quickTo, lerp feel 0.15, max 14px)
  + noiseStrength naik ~30%
- Velocity pointer → kick noiseStrength orb (velocity-driven, dibatasi/clamped)

## Fallback

- `prefers-reduced-motion`: orb statis tanpa morph, tanpa fluid, teks instan, tanpa scramble
- Mobile/touch: orb lebih kecil di tengah, nama tetap counter-positioned (vw lebih besar),
  meta grid disederhanakan (role + lokasi saja)
- WebGL gagal: fallback teks solid existing

## Quality gates

- `pnpm typecheck && pnpm lint` pass, console bersih dari error/Vue warn baru
- Idle-state test: reload tanpa mouse → panggung tetap hidup (orb + clock + rotator)
- Statement tetap terbaca < 1 detik sejak entrance selesai
- 60fps target; orb pixelRatio cap 2x; semua GL di-dispose saat unmount
