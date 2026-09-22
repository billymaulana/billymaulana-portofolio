---
type: lesson
date: 2026-07-16
job: "capture referensi hashgraphvc.com ke taste library"
outcome: iterated
---

## Yang berhasil
Pipeline capture (screenshot desktop+mobile, deteksi stack via evaluate_script, scaffold note, rebuild index) berjalan end-to-end. Deteksi otomatis akurat: font kustom, bg #000209, Lenis, WebGL 2-canvas.

## Yang jadi slop + root cause
Screenshot pertama menangkap AUDIO-GATE splash ('ENTER WITH AUDIO'), bukan hero sebenarnya. Root cause: langsung screenshot begitu halaman load tanpa cek apakah ada entry/audio gate yang menahan konten utama.

## Rule baru
Sebelum screenshot situs award: cek apakah ada entry/audio gate (tombol ENTER/ENTER WITHOUT AUDIO). Jika ada, klik ENTER (pilih tanpa audio agar tak memicu dialog) lalu tunggu hero + animasi load, BARU capture. Jangan pernah menyimpan splash gate sebagai reference hero.

## Sinyal taste baru
Billy menyukai immersive WebGL (ocean + kristal cair refraktif), detail texture realistis 'seperti nyata', dan motion mewah yang transportif ('dibawa ke tempat berbeda', 'enak sekali') — mood serene-premium (calm + luxurious), bukan tense.
