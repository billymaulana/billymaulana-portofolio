# Kontrak prompt delegasi

> Dipindah verbatim dari `CLAUDE.md` repo pada 2026-11-23. Bila isi di sini bertentangan dengan `CLAUDE.md` § Cara kerja art director (pelajari taste dari prinsip master brief, jangan meniru situs), `CLAUDE.md` yang berlaku.

## Delegation Prompt Contract — Wajib Saat Spawn Agent Build

Spec (11 blok di atas) adalah dokumen untuk MANUSIA. Prompt delegasi adalah instruksi untuk
AGENT, dan keduanya TIDAK sama — agent tidak punya konteks percakapan, tidak melihat referensi,
dan tidak tahu apa yang sudah ditolak. Prompt satu paragraf ("build hero sesuai spec, pakai
tokens ini") adalah penyebab paling sering hasil delegasi melenceng.

**Aturan tunggal**: prompt harus bisa dijalankan agent yang baru pertama kali melihat repo ini,
tanpa satu pun pertanyaan balik, dan hasilnya sudah lolos gate sebelum di-review.

### 14 Blok Wajib (urut)

**1 — Role + fidelity mandate.** Siapa agent itu, dan seberapa bebas dia. Tulis larangan
secara eksplisit sebagai kalimat terpisah: `Do not redesign. Do not reinterpret. Do not
simplify the technique. Do not substitute the library.` Tanpa ini agent akan "memperbaiki"
desain menurut seleranya sendiri.

**2 — Stack terkunci.** `Nuxt 4.3 + Vue 3 <script setup> + TypeScript strict + UnoCSS (Wind4)
+ GSAP + WebGL2`. Tulis juga apa yang DILARANG: React, Tailwind CDN, Framer Motion,
styled-components, komponen UI library. Agent yang di-copy dari prompt publik akan default ke
React/Tailwind kalau ini tidak dikunci.

**3 — File scope.** Daftar path PERSIS yang boleh dibuat/diubah, dan larangan menyentuh yang
lain. Sebut file yang haram diubah beserta alasannya (mis. `app/composables/useFluidSimulation.ts`
= port Pavel Dobryakov, engine JANGAN diubah).

**4 — Mood target 2–3 token** dari taxonomy `references/editorial/05-developing-taste.md` §4,
plus 1 kalimat "kalau hasilnya terasa X, berarti salah".

**5 — Prinsip master brief + keluarga referensi asalnya** *(diganti 2026-11-23, design
explore-concept-2 §8)*. Setiap keputusan visual dipetakan ke prinsip di
`docs/awwwards/master-brief.md` beserta keluarga referensi tempat prinsip itu dipelajari
(mis. "isoline tajam di atas ground hitam bersisa — keluarga poster termal"). Dilarang menulis
"tiru X", "seperti situs X", atau "terinspirasi situs premium".

**6 — Design tokens literal.** Hex, px, em, ms — bukan nama semantik. `#080808` bukan
"hitam pekat"; `237.756px / 180.219px / -0.04em` bukan "display besar".

**7 — Struktur per layer, urut z-index**, dengan string class UnoCSS lengkap apa adanya.

**8 — Blok CSS/GLSL siap tempel** — ditulis utuh, bukan dideskripsikan.

**9 — Algoritma mekanik inti** langkah demi langkah dengan SETIAP angka literal (radius, lerp,
stop gradien, threshold, ukuran buffer, urutan uniform).

**10 — Tabel motion**: elemen | dari → ke | duration | delay | easing. Easing eksplisit
(`power4.out`, `expo.inOut`, `cubic-bezier(0.16,1,0.3,1)`). Stagger sebagai angka increment.

**11 — Copy verbatim** dalam tanda kutip, siap tempel, bersumber `app/constants/profile.ts`.
Agent DILARANG mengarang angka, klaim, atau nama klien.

**12 — Constraint negatif (anti-slop).** Salin BANNED list yang relevan ke dalam prompt —
jangan hanya menunjuk CLAUDE.md. Minimal: tidak ada font monospace, tidak ada 3-column card
grid, tidak ada centered hero+CTA, tidak ada glassmorphism card, tidak ada partikel generik
(Level 0), tidak ada comment kode yang menjelaskan WHAT, tidak ada referensi AI/agent/file
markdown planning di dalam kode.

**13 — Definition of done** yang bisa diperiksa mesin: `bun run typecheck && bun run lint && bun run build`
hijau · browser review (reload, screenshot idle 3s, console bersih dari `[Vue warn]`) ·
`taste-lint` hijau · gate editorial 9 poin.

**14 — Format laporan balik.** File yang diubah + cara menjalankan + screenshot,
**TANPA klaim evaluatif** ("sudah premium", "terlihat bagus" = dilarang). Penilaian adalah
tugas `art-director-critic`, bukan builder.

### Yang membuat prompt delegasi ditolak

- Menyebut "sesuai spec" tanpa menyalin angkanya ke dalam prompt — agent tidak membaca spec-mu
- Tokens semantik ("gelap", "besar", "smooth") menggantikan angka
- Tidak ada blok 12 — hasilnya akan lolos typecheck tapi jadi slop
- Tidak ada blok 1 — agent mendesain ulang dan kamu kehilangan referensi
- Menyalin prompt publik bergaya React/Tailwind/Framer tanpa menerjemahkan ke stack di blok 2

---

