# ACT IX — Forensik & kalibrasi identik liquid daspritam.in

**Keluhan user**: (1) motion tidak smooth, butuh feel/ritme; (2) bloom kadang
membesar sampai layar FULL PUTIH; (3) kinetic/fisika belum terasa; target:
IDENTIK dengan mouse effect daspritam.in, diuji berulang di browser.

## Fase 1 — FORENSIK (sebelum menyentuh kode kita)

1. Fetch bundle JS daspritam.in (buka situs → list network JS / parse <script>
   src → fetch tiap bundle) dan grep kunci config Pavel Dobryakov:
   `DENSITY_DISSIPATION|VELOCITY_DISSIPATION|SPLAT_RADIUS|SPLAT_FORCE|CURL|
   PRESSURE|BLOOM_INTENSITY|BLOOM_THRESHOLD|SIM_RESOLUTION|DYE_RESOLUTION|
   SHADING|COLORFUL|SUNRAYS`. Jika ketemu → CATAT SEMUA ANGKA = sumber
   kebenaran. Cek juga generateColor/splat multiplier & pola pointer
   (interpolasi segmen? smoothing? splat saat hover tanpa drag?).
2. Jika bundle minified tanpa nama: cari angka literal berdampingan pola
   config object, atau cari variabel global runtime (evaluate window).
3. Uji perilaku live daspritam dengan 5 SKENARIO (screenshot tiap skenario):
   a. idle 5s (ada auto-splat?) · b. sweep pelan 1 garis · c. flick cepat ·
   d. lingkaran 3x · e. sustained sweep 10s — amati: apakah PERNAH blow-out
   putih? umur trail? ketebalan? respon arah?

## Fase 2 — TERAPKAN & ITERASI (useFluidSimulation.ts)

- Jika angka forensik ketemu: salin PERSIS (kecuali warna — hue lock identity
  tetap). Sesuaikan dye multiplier pointer agar total energi per detik setara
  (perhitungkan beda: kita boost ×4.5 — kemungkinan HARUS turun drastis;
  akar blow-out = akumulasi dye >1 → bloom memutihkan).
- Tambahkan (paritas perilaku Pavel/daspritam):
  - **Interpolasi segmen**: pada pointer bergerak cepat, pecah delta menjadi
    beberapa splat di sepanjang garis lama→baru (trail kontinu, bukan titik).
  - **Pointer smoothing** ringan bila forensik menunjukkan itu (bandingkan
    feel; jangan tambah lag > 1 frame).
  - **Anti-blow-out**: apapun hasil forensik, pastikan sustained sweep 10s
    TIDAK memutihkan layar (uji!); knob: dye multiplier, BLOOM_THRESHOLD,
    clamp dye pada splat.
- ITERASI WAJIB ≥3 putaran: ubah → reload → jalankan 5 skenario yang sama →
  screenshot → bandingkan side-by-side dengan capture daspritam → catat
  perbedaan → setel lagi. Berhenti saat 5 skenario sepadan secara visual.

## Gates
typecheck + CI lint pass · console bersih · skenario (e) sustained 10s tanpa
blow-out putih (screenshot bukti) · trail kontinu pada flick cepat (screenshot)
· laporan tabel: parameter daspritam (forensik) vs parameter final kita ·
efek liquid-collision masthead + hue lock identity TIDAK berubah.
