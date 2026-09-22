# OPTICAL BENCH — rancang ulang sesi kalibrasi

Menggantikan `/calibration` yang ditolak (`docs/awwwards/failures/2026-07-26-calibration-ui.md`,
5/5 tes anti-slop gagal). Stack: Nuxt 4.3 + UnoCSS + GSAP 3.14.2 (Flip, SplitText, CustomEase) + WebGL2.

## 1. Kenapa format berubah

Dua panel berdampingan **secara struktural** selalu gagal NEIGHBOR TEST — duplikasi adalah inti
mekanismenya. Toggle in-place menghapus duplikasi dan, lebih penting, mengubah sifat instrumennya:
perbandingan berhenti jadi "lihat dua gambar" dan jadi "lihat delta bergerak".

**Mekanik inti**: teks A dan B identik; yang berbeda hanya nilai CSS. GSAP **Flip** merekam
posisi tiap karakter di state A → menerapkan style B → menganimasikan dari posisi lama ke baru.
Perbedaan tracking/leading/weight muncul sebagai **jarak tempuh huruf**, bukan tebakan visual.

## 2. Layer, urut z-index

| z | Layer | Isi |
|---|---|---|
| 1 | Field | Canvas WebGL2 fullscreen — garis kontur interferensi dari fbm noise, reaktif ke mouse velocity, pulse radial saat toggle |
| 10 | Bench | Grid editorial: hairline vertikal di kolom 2 dan 5, nomor pasangan, label dimensi |
| 20 | Spesimen | DOM teks tajam (bukan raster) — satu-satunya yang dinilai |
| 30 | Ghost | Overlay varian lain, `mix-blend-mode: difference`, muncul saat tahan `D` |
| 40 | Kontrol | Tombol + input catatan |

## 3. Field shader — angka literal

- fbm 4 oktaf, lacunarity 2.0, gain 0.5
- Kontur: `fract(n * 9.0)` → `smoothstep(0.0, 0.06, ...)` → garis ~1.5px
- Drift: `uTime * 0.035`
- Mouse velocity → `uVel` (0–1, lerp 0.08), mendorong domain warp sebesar `uVel * 0.18`
- Pulse toggle: `uPulse` 0→1 dalam 0.9s, gelombang radial `sin((d - uPulse * 1.4) * 22.0)`
- Warna garis `#0047FF`, ground `#050505`
- **Mask zona baca**: `smoothstep(0.15, 0.52, d)` dari pusat — garis meredup di tengah agar
  tipografi tetap bisa dinilai jernih. Field hidup di tepi, tenang di tempat kerja.

## 4. Motion

| Elemen | Dari → ke | Durasi | Stagger | Easing |
|---|---|---|---|---|
| Karakter (Flip) | posisi A → posisi B | 0.9s | 0.012s dari tengah | `expo.inOut` |
| Field pulse | 0 → 1 | 0.9s | — | `power2.out` |
| Ghost masuk | opacity 0 → 0.85 | 0.35s | — | `power3.out` |
| Ghost keluar | 0.85 → 0 | 0.25s | — | `power2.in` |
| Label nilai | clip-path inset 100%→0 | 0.5s | 0.04s | `expo.out` |

Tidak ada `linear`/`ease`/`power1`. Tidak ada `opacity:0,y:30` sebagai reveal.

## 5. Konten spesimen — editorial nyata

Bukan nama + tagline di kotak. Sumber `app/constants/projects.ts` dan `profile.ts`:

```
BILLY MAULANA                          (display)
Frontend Architect — Bandung, Indonesia (lead)
PLN Mobile          2023  Vue · TypeScript   80M users
Flexben             2023  Nuxt · TypeScript
UNESCO IHP RSC      2022  Nuxt · CMS
Design System       2022  Vue · Storybook    200+ devs
```

Baris proyek memberi kepadatan editorial dan sekaligus **menguji body/label tier** — yang di
versi lama tidak pernah teruji karena hanya ada satu kalimat tagline.

## 6. Interaksi

| Tombol | Aksi |
|---|---|
| `Space` / klik spesimen | Toggle A ↔ B in-place (Flip + pulse) |
| `D` (tahan) | Ghost difference overlay varian lain |
| `1` / `2` | Pilih A / B sebagai jawaban |
| `S` | Skip |
| `←` | Mundur satu pasangan |

Toggle bebas berapa kali sebelum memilih — itu justru yang membuat delta terbaca.

## 7. Gate yang harus lolos

- OBJECT: field kontur = elemen visual non-teks yang jadi konten
- SWAP: ganti nama → baris proyek dan angka ikut berubah, komposisi berbeda
- EMPTY: hapus teks → field kontur + grid hairline masih berdiri
- WOW: momen Flip + pulse
- NEIGHBOR: A dan B tidak pernah tampil bersamaan — tidak ada duplikasi struktur
- Teknik Level 5 (GLSL) + Level 4 (difference blend fungsional)
- `taste-lint` hijau pada rule tipografi

## 8. Jangan

- Jangan render spesimen sebagai raster/texture — instrumen ukur wajib setajam DOM
- Jangan beri `mix-blend-mode` pada teks yang sedang dinilai
- Jangan biarkan field terang di zona baca
- Jangan pakai label mono uppercase mengapit mega-type — pola itu sudah ditolak 2×
