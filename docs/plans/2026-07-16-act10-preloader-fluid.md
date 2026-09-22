# ACT X — Preloader: pembentukan logo natural-fluid & smooth

**Keluhan user**: proses logo terbentuk belum terasa natural fluid & smooth.

## Diagnosis motion (AppPreloader.vue PHASE 2, 1.2s→5.4s)

Satu tween 4.2s `expo.inOut` menyetir SEMUA parameter shader serentak
(explode/strength/flow/fill/fade) + sub-ease smoothstep yang mempercepat
akhir → logo "menyelesaikan diri" secara seragam-mekanis dan mendarat agak
mendadak. Cairan asli tidak begitu: tiap besaran fisik punya waktunya sendiri
dan mendarat dengan tegangan permukaan (overshoot mikro → rileks).

## Re-choreography (ganti isi PHASE 2; total durasi boleh 4.2–5.0s)

Pisahkan ke tween paralel dalam timeline dengan offset & ease berbeda:
1. **explode 3→0**: mulai 0s, durasi 3.2s, `expo.out` — massa besar menyatu
   duluan (gerak besar selesai lebih awal).
2. **strength 1.2→0.12**: mulai 0.4s, durasi 3.4s, `power3.out`, LALU
   0.12→0 durasi 1.0s `power2.out`? DILARANG power2 → gunakan `power3.out`.
   Sisa noise kecil hidup lebih lama = permukaan masih "bernafas" saat bentuk
   sudah terbaca.
3. **converge**: 0→1.06 durasi 2.8s `expo.inOut` mulai 0.6s, lalu 1.06→1.0
   durasi 0.9s `power3.out` — OVERSHOOT tegangan permukaan (logo sedikit
   "menghisap" melewati bentuk final lalu rileks). (Cek dulu semantik
   setConverge di useLiquidBlobs — bila converge bukan 0..1 morph, terapkan
   overshoot pada parameter yang memorph bentuk; laporkan pilihannya.)
4. **flowIntensity 0.12→0.03**: durasi 4.6s `power3.out` (aliran tidak pernah
   berhenti mendadak; sisakan 0.03 sampai exit).
5. **fill 0.85→1.0**: mulai 1.6s durasi 2.2s `power3.out` (terang datang
   SETELAH bentuk mulai terbaca — recognition beat).
6. **fadeToBlack pulse**: pertahankan tapi perhalus (amplitudo 0.05).
7. Micro-tail: setelah semua landing, tahan 0.35s (beat hening) sebelum fase
   exit dimulai — jangan langsung zoom.

Smoothness teknis:
- Pastikan HANYA parameter shader yang berubah per frame (tanpa layout/paint).
- Cek blob.start() loop: satu RAF; tidak ada tween JS berat paralel.
- Jika ada stepping terlihat (banding gerak), pertimbangkan dt-smoothing
  uniform di composable HANYA bila terbukti (laporkan bukti dulu).

## Verifikasi (WAJIB, iterasi ≥2)
Reload localhost:3001 (JANGAN restart server), rekam fase dengan screenshot
pada ~1.5s / 2.5s / 3.5s / 4.5s / 5.2s setelah navigasi; nilai: (a) massa
menyatu organik tanpa pop, (b) tidak ada snap di landing (bandingkan 4.3s vs
4.8s — perubahan harus mikro), (c) permukaan masih hidup halus saat logo
terbaca. Bandingkan antar iterasi, setel offset/ease seperlunya (tetap dalam
famili ease yang diizinkan). typecheck + CI lint pass; console bersih;
?debug flow tetap berfungsi; emit complete/done tetap pada waktunya
(SectionHero bergantung pada ini).
