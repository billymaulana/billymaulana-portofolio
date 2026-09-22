# ACT VIII — hero-v3 "CROSSING" + kalibrasi liquid daspritam

## 1. hero-v3: hapus project index → konsep grafis "CROSSING" (eksperimental)

Manifesto + project index DIHAPUS. Zona tengah-bawah diisi instalasi grafis
orisinal terinspirasi ide zebra-crossing (LEGAL: pattern garis generik buatan
sendiri via CSS/SVG — DILARANG mereproduksi/meniru foto Abbey Road, siluet
Beatles, atau komposisi fotonya).

Spec instalasi:
- Band penuh-lebar `top 50% → bottom ~18%` (di atas kaki 3 blok existing),
  z di BAWAH fluid canvas (fluid z-3 melukis DI ATAS garis).
- Isi band: **stripes horizontal** ala zebra cross dilihat dari atas:
  7 strip cream rgba(242,239,234,0.92) tebal `clamp(1.5rem, 4.2vh, 2.6rem)`,
  gap sama tebal (void), full-bleed kiri-kanan (TANPA pad — jalan menabrak
  tepi viewport; kontras dengan grid konten lain = keputusan desain sadar,
  tulis di laporan).
- Perspektif eksperimental: `transform: perspective(900px) rotateX(58deg)`
  pada container band (jalan "rebah" ke dalam layar), transform-origin bottom.
- Motion idle: strip bergeser vertikal sangat pelan (yPercent loop seamless,
  durasi ~14s, linear TIDAK BOLEH — pakai none? loop konstan butuh ease none:
  DIKECUALIKAN khusus untuk conveyor loop, catat sebagai keputusan) — jalan
  yang terus berjalan. Reduced-motion: statis.
- Interaksi: tinta fluid melukis di atas garis; garis cream di bawah dye
  membuat tinta terlihat menyala (screen blend existing). Masthead +
  difference tetap.
- Entrance: band clip-path inset(100% 0 0 0) → inset(0) expo.inOut 1.4s
  setelah nav row; stripes stagger tidak perlu (band utuh).
- Collision-check: band boleh menyentuh tepi viewport (by design, full-bleed)
  tapi TIDAK boleh menimpa teks kaki/nav (ukur numerik).

## 2. Kalibrasi liquid ke karakter daspritam.in (SEMUA hero, config global)

Karakter target (dari observasi live daspritam): tinta PEKAT memenuhi layar,
bertahan lama, swirl besar organik, trail tebal mengikuti mouse.
Ubah di useFluidSimulation config (HANYA nilai ini):
- DENSITY_DISSIPATION 0.9 → **0.45** (tinta bertahan ±2× lebih lama)
- SPLAT_RADIUS 0.18 → **0.3** (trail tebal seperti referensi)
- CURL 30 → **40** (swirl lebih besar/organik)
- VELOCITY_DISSIPATION 0.6 → **0.3** (aliran terus bergulir setelah mouse berhenti)
- BLOOM_INTENSITY 0.8 → **0.95**
Dye boost pointer (×4.5) & hue lock TETAP (identity palette menggantikan
merah daspritam — keputusan terkunci).
Verifikasi side-by-side: buka daspritam.in + localhost, sweep serupa,
bandingkan ketebalan/umur trail secara visual, sertakan pengamatan.

## Gates
typecheck + CI lint pass · console bersih · collision numerik · screenshot
hero-v3 idle & mid-interaksi · screenshot index mid-interaksi (liquid baru).
