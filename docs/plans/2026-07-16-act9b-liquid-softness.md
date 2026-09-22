# ACT IX.B — Liquid softness: hilangkan kedip, splash idle, tekstur kasar

**Keluhan user**: (1) referensi TIDAK punya kedip-kedip lighting; (2) hapus
splash random saat tidak ada motion; (3) bentuk kita KASAR — referensi lembut
seperti air; target iterasi terus-menerus sampai visual sepadan.

## Hipotesis akar (dari forensik ACT IX, verifikasi lalu eksekusi)

| Gejala | Akar di kita | Referensi |
|---|---|---|
| Kedip lighting | BLOOM + SUNRAYS aktif (sunrays = flicker radial saat dye lewat threshold) | TIDAK ADA bloom/sunrays |
| Kasar/berkerut | `SHADING: true` (normal-based shading di display shader Pavel memberi relief 3D) + dye multi-hue kontras | Tanpa shading; smear velocity lembut |
| Splash random idle | scheduleWisp (4±1s) di SectionHero + HeroVariant* | Tidak ada auto-splat |

## Eksekusi

1. **useFluidSimulation config**: `SHADING: false`, `BLOOM: false`,
   `SUNRAYS: false` (updateKeywords sudah menangani varian shader).
2. **Hapus ambient wisps**: scheduleWisp + timer + pemanggilan di
   SectionHero.vue, HeroVariantChdartmaker.vue, HeroVariantV3.vue,
   HeroVariantYakushev.vue (grep scheduleWisp/emitSplat). API emitSplat di
   composable BIARKAN (dipakai internal multipleSplats; jangan hapus API).
   CATATAN: idle-state hero jadi murni statis + clock/loop CSS — keputusan
   user (override idle-life sebelumnya).
3. **Kelembutan dye** (iterasi visual, urutan coba):
   a. Tanpa shading dulu — nilai ulang; sering ini saja sudah "air".
   b. Bila tepi dye masih keras: naikkan SPLAT_RADIUS 0.3 → 0.35-0.4
      (smear lebih lebar-lembut) dan/atau turunkan dye mult 1.8 → 1.4.
   c. Bila internal masih bertekstur: CURL 20 → 10-15.
   d. Hue span persepsi: kontras antar-warna membuat marbling terlihat —
      pertimbangkan persempit span hue per-splat (COLOR_UPDATE_SPEED turun /
      hue random per splat → drift pelan) TANPA mengubah rentang hue lock
      0.52–0.75 (terkunci).
4. **Iterasi WAJIB sampai sepadan**: tiap putaran — reload localhost:3001
   (preloader ~13s), skenario: sweep pelan / flick / lingkaran / sustained 8s /
   berhenti+amati 3s; screenshot; bandingkan dengan capture daspritam live
   (side-by-side, sweep serupa di situs mereka). Ulangi ubah-nilai → uji.
   Minimal 3 putaran, teruskan bila belum sepadan (maks 6, lalu laporkan gap
   yang tersisa dengan jujur + opsi).
5. **Studi referensi lebih dalam bila perlu**: boleh unduh bundle daspritam ke
   folder temp DI LUAR repo untuk dibaca (shader chain, nilai uniform);
   DILARANG menyalin kode ke repo; hapus folder temp setelah selesai.

## Gates
typecheck + CI lint pass · console bersih · idle 6s TANPA splash apapun
(screenshot) · sustained tanpa kedip terang (bandingkan 2 screenshot berjarak
1s — tidak ada lonjakan brightness global) · liquid-collision masthead tetap
hidup · laporan side-by-side jujur per iterasi.
