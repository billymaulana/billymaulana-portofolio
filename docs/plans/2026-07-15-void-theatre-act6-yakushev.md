# VOID THEATRE — ACT VI: "SIGNATURE" (eksplorasi layout art-yakushev.com)

**Mandat user**: eksplorasi ganti layout hero meniru art-yakushev.com; font
masthead TETAP Bebas Neue; logo + hamburger TETAP. Layout POSTER (ACT V.2) =
approved & di-snapshot sebelum diganti (docs/snapshots/).

Referensi di-scrape live 2026-07-15. Anatomi:

| art-yakushev.com | Adaptasi Billy |
|---|---|
| Nama raksasa "Artiom*Yakushev*" 1 baris edge-to-edge, baseline MENEMPEL KAKI viewport, di depan media | "BILLYMAULANA" Bebas Neue (terkunci), fit-to-width ink-based existing, yFrac ≈ 0.965 (baseline dekat kaki; cap masuk viewport penuh) + efek liquid-collision TERKUNCI (canvas distortion + difference + fluid) |
| Tagline atas-tengah 2 baris, two-tone: "*A Creative Partner* for companies and brands / that decide to move forward." — frasa kunci serif italic putih, sisanya sans abu | Atas-tengah: "*A Frontend Architect* crafting interfaces / that move millions of people." — "A Frontend Architect" PP Editorial New Italic cream 90%; sisanya Switzer 400 chrome 55%; 2 baris center, ~1.5rem/1.35 |
| Monogram "A" rusuk kiri-tengah, "Я" rusuk kanan-tengah | "B" kiri-tengah, "M" kanan-tengah — Bebas Neue 1.25rem chrome 40%, vertical-center |
| Kiri-bawah: YEREVAN 11:25 AM | Kiri-bawah 2 baris: `BANDUNG — HH:MM:SS GMT+7` (clock useHeroStage existing, hidupkan lagi) + baris 2: dot pulse + AVAILABLE FOR SELECT WORK |
| Tengah-bawah: INSTAGRAM / BEHANCE / LINKEDIN | Tengah-bawah: GITHUB / LINKEDIN / INSTAGRAM (link real dari SectionFooter/constants — cek) |
| Kanan-bawah: HOME WORK INFO CONTACT | Kanan-bawah: WORK ABOUT CONTACT (anchor existing) |
| Media video besar tengah di belakang nama | Fluid canvas fullscreen existing + ambient wisps (media hidup); tanpa elemen media baru |
| BG abu gelap | Void #060610 existing |

## Yang DIHAPUS dari ACT V (layout lama)
Nav row bawah-masthead, kaki 3 blok (role+EXPLORE / SCROLL / klien+VIEW WORK).
Konten role pindah ke tagline; klien tidak tampil di hero (ada di Works).
SCROLL hint: pindah ke... TIDAK ADA di referensi — hapus (scroll cue = nama
menempel kaki, affordance natural).

## Entrance (preloader → hero)
1. 0.0s masthead per-char rise dari bawah kaki (yPercent 100→0 + blur 8→0,
   stagger 0.02 from start, power4.out 1.0s) — muncul "terbit" dari bawah
2. 0.5s tagline: blur 10→0 + rise 16px, 2 baris stagger 0.12
3. 0.8s monogram B/M fade + slide dari rusuk (x ∓12)
4. 1.0s meta bawah 3 blok stagger 0.09; clock mulai
5. Fluid fade-in 1.4s

## Teknis
- Snapshot dulu: `mkdir -p docs/snapshots && cp app/components/SectionHero.vue docs/snapshots/2026-07-15-act5-poster-SectionHero.vue.txt`
- Masthead: mekanisme existing (fit ink-based → indent konversi, overlay DOM
  entrance → crossfade canvas, difference blend, distortion 0.075/0.015) —
  HANYA yFrac berubah + entrance rise-from-bottom. Perhatikan: baseline dekat
  kaki berarti overlay DOM & canvas butuh overflow aman (section overflow
  hidden sudah ada).
- Grain + parallax scroll existing tetap.
- Reduced-motion: semua statis, clock jalan.
- Mobile: masthead tetap kaki (92vw), tagline di atas, meta minimal (clock+nav).

## Gates
typecheck + CI lint pass · console bersih · masthead flush kaki tanpa clipping
cap-height · alignment container (ink B / ink A, pad 57.6) tetap presisi ·
liquid collision effect utuh · verifikasi live screenshot idle + interaksi.
