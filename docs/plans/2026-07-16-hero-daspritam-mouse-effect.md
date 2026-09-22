# Hero Mouse Effect — Clone daspritam.in (Approved Design)

**Tanggal**: 2026-07-16
**Status**: Design approved oleh user. Menunggu implementation plan.
**Referensi**: https://www.daspritam.in/ — bundle produksi (`/assets/index-Ct5vtVkz.js`, 272KB) di-download & di-decode penuh. Semua angka di dokumen ini hasil ekstraksi, bukan estimasi.

## Keputusan User (terkunci sesi ini)

1. **Scope**: mouse effect diterapkan ke **hero existing** (`SectionHero.vue`). Layout POSTER "BILLYMAULANA" + Bebas Neue TIDAK berubah.
2. **Fluid invisible — persis referensi**: dye TIDAK dirender ke layar. Fluid hanya menjadi velocity/displacement map. Tinta visible bisa dikembalikan via satu flag, tapi default = invisible.
3. **Approach A**: retune sim Pavel existing (`useFluidSimulation.ts`) + display pass baru. TANPA dependency baru (OGL tidak dipasang — sim referensi juga port Pavel, matematikanya identik).

## Anatomi Referensi (hasil dekode bundle)

Stack referensi: OGL (WebGL minimal) + GSAP + ScrollTrigger + Lenis. Font Satoshi + IBM Plex Mono. Pipeline:

```
mouse/touch ──splat(dx=Δx×5, dy=Δy×5)──▶ Navier-Stokes sim (Pavel) → velocity texture
konten hero ──render──▶ content texture (tMap)
display pass: displace tMap dengan velocity + RGB split → layar
```

### Display shader (EKSTRAKSI VERBATIM — pakai apa adanya)

```glsl
precision highp float;

uniform sampler2D tMap;
uniform sampler2D tFluid;
uniform float uTime;
varying vec2 vUv;

void main() {
  vec3 fluid = texture2D(tFluid, vUv).rgb;
  vec2 uv = vUv;
  vec2 uv2 = vUv - fluid.rg * 0.001;

  vec4 color = texture2D(tMap, uv2);

  vec3 rgb = fluid * 0.003;

  color.g = texture2D(tMap, vec2(uv.x - rgb.x, uv.y + rgb.y)).g;
  color.b = texture2D(tMap, vec2(uv.x - rgb.x, uv.y + rgb.y)).b;

  gl_FragColor = color;
}
```

Catatan: channel R sengaja TIDAK digeser (di-comment di source referensi). Hanya G+B → fringe cyan/magenta.

### Konfigurasi sim referensi (decoded dari konstanta minified)

| Parameter | Referensi | Existing (`useFluidSimulation.ts`) | Aksi |
|---|---|---|---|
| SIM_RESOLUTION | 128 | 128 | ✓ sama |
| DYE_RESOLUTION | 512 | 512 | ✓ sama (dye tak dirender) |
| velocity decay/frame | 0.9 | `VELOCITY_DISSIPATION 6.7` → `1/(1+0.016×6.7) ≈ 0.903` | ✓ ekuivalen |
| density decay/frame | 0.93 | `DENSITY_DISSIPATION 4.5` → `≈ 0.933` | ✓ ekuivalen |
| PRESSURE | 0.8 | 0.8 | ✓ sama |
| CURL | **20** | 14 | **ubah → 20** |
| SPLAT_RADIUS | **0.3** (dipakai `/100` = 0.003) | 0.35 | **ubah → 0.3** |
| Mouse force | dx = Δx × 5 | `SPLAT_FORCE 7200` screen-normalized ≈ Δpx×5 | ✓ ekuivalen |
| dt | 0.016 fixed | `calcDeltaTime()` cap 0.016666 | ✓ ekuivalen |
| Displacement | 0.001 | — (belum ada) | tambah via display shader |
| RGB split | 0.003 | — (belum ada) | tambah via display shader |

Sim referensi memakai Pavel versi lama (decay = multiplier langsung per frame); existing memakai versi baru (`1/(1+dt·k)`). Nilai existing sudah ekuivalen — JANGAN dikonversi ulang, cukup CURL + SPLAT_RADIUS + force yang diubah.

### Karakter feel yang dituju

- Sentuhan mouse **kecil & presisi** (radius 0.003), bukan semburan lebar
- Arus **berpilin ringan** (curl 20) lalu **cepat pulih** (~1 detik, decay 0.9)
- Konten meleleh **halus** (0.001) dengan fringe RGB hanya di area velocity tinggi
- Idle: konten tampil normal & tajam, nol distorsi

## Perubahan per File

| File | Perubahan |
|---|---|
| `app/composables/useFluidSimulation.ts` | `CURL 14→20`, `SPLAT_RADIUS 0.35→0.3` (force & dt sudah ekuivalen — jangan sentuh); mode `renderDye: false`; expose velocity texture; display pass baru (shader di atas, 13 baris < budget 30) |
| `app/composables/useTextDistortion.ts` | Jadi rasterizer murni: gambar masthead ke offscreen canvas; distorsi CPU per-line dinonaktifkan (digantikan displacement GPU) |
| `app/components/SectionHero.vue` | Wiring content canvas → texture → display pass; canvas dye visible dilepas dari layar; DOM masthead tetap ada tersembunyi (a11y/SEO) |

Tanpa dependency baru. Tanpa file baru.

## Scope Efek

- **Meleleh**: masthead `BILLYMAULANA` (satu-satunya konten canvas)
- **Tetap tajam (DOM)**: nav global, meta, clock, social links — konsisten dengan referensi (UI kecil crisp)

## Performa

- Upload canvas→texture HANYA saat resize/font-load, BUKAN per frame (masthead statis)
- Sim tetap 128px; display pass fullscreen 1 sample tMap + 2 sample fringe + 1 sample tFluid = murah

## Verifikasi (browser review WAJIB)

1. Reload tanpa mouse → screenshot 3s → masthead tampil normal, nol distorsi, nol artefak
2. Gerakkan mouse pelan melintasi masthead → lelehan halus mengikuti arus
3. Flick cepat → fringe cyan/magenta muncul lalu pulih ~1 detik
4. Console bersih (tanpa Vue warn / GL error)
5. `pnpm typecheck && pnpm lint && pnpm build` pass
6. GIF perbandingan untuk presentasi ke user — TANPA klaim evaluatif

## Risiko & Mitigasi

- **DPR tinggi + upload texture** → mitigasi: upload on-change saja (lihat Performa)
- **GLSL di template literal tidak hot-reload** → full page reload setiap ubah shader (catatan memory)
- **2-iteration limit**: 2× gagal match feel → STOP, konsultasi user
