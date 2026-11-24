# Kontrak spec art director

> Dipindah verbatim dari `CLAUDE.md` repo pada 2026-11-23. Bila isi di sini bertentangan dengan `CLAUDE.md` § Cara kerja art director (pelajari taste dari prinsip master brief, jangan meniru situs), `CLAUDE.md` yang berlaku.

## Output Contract — Spec Wajib Saat Ditunjuk Art Director

Saat user menunjuk Claude sebagai art director, deliverable-nya BUKAN paragraf konsep.
Deliverable-nya adalah **spec eksekusi** setingkat detail contoh yang user approve.

**Aturan tunggal**: spec harus bisa diserahkan ke developer lain yang belum pernah melihat
project ini, dan dia bisa membangun hasil yang identik **tanpa bertanya apa pun**.

Kalau ada satu saja angka yang ditulis "sekitar", "subtle", "cukup besar", atau "sesuai
selera" — spec itu BELUM SELESAI.

### 11 Blok Wajib (urut, tidak boleh ada yang hilang)

**1 — Header.** Satu paragraf: ini apa, untuk siapa, mekanik utamanya apa, stack persisnya
(Nuxt 4.3 + UnoCSS + GSAP + WebGL2 — bukan React/Tailwind).

**2 — Fonts.** Per font: nama famili, weight persis, cara load (path `@fontsource/*`,
`public/assets/fonts/...`, atau `@font-face` lengkap), dan elemen mana yang memakainya.
Cek dulu apa yang SUDAH ada di repo sebelum menambah dependency.

**3 — Assets.** Tabel `NAMA_KONSTANTA | URL lengkap | status verifikasi`.
Status WAJIB hasil `curl` nyata (`206`/`200`/`401`), bukan asumsi. Kalau ada expiry
(signature Mux/S3), tulis tanggalnya. Aset mati = spec ditolak sebelum dibangun.

**4 — Struktur per layer, urut z-index.** Tiap layer: nomor, z-index, dan **string class
UnoCSS lengkap apa adanya**. Bukan "container gelap dengan padding" — tapi
`absolute inset-0 z-10 h-[130%] w-full object-cover object-top`.

**5 — Blok CSS/GLSL siap tempel.** Setiap class kustom dan setiap shader ditulis utuh,
copy-paste-able. Bukan dideskripsikan.

**6 — Algoritma mekanik inti.** Langkah demi langkah dengan SETIAP angka literal:
radius, faktor lerp, stop gradien, threshold, ukuran buffer, urutan uniform.
Contoh acuan: mask spotlight (radius 260, stop `0→1, 0.4→1, 0.6→0.75, 0.75→0.4, 0.88→0.12, 1→0`),
lerp `0.1`, `MAX_WIDTH = 960`.

**7 — Tabel motion.** Kolom: elemen | dari → ke | duration | delay | easing.
Easing ditulis eksplisit (`expo.inOut`, `power4.out`, `cubic-bezier(0.16,1,0.3,1)`).
Stagger ditulis sebagai angka increment, bukan "berurutan".

**8 — Teks verbatim.** Semua copy ditulis lengkap dalam tanda kutip, siap tempel.
Sumbernya `app/constants/profile.ts` — dilarang mengarang angka atau klaim.

**9 — Tabel responsif.** Kolom: breakpoint | yang berubah. Sebutkan apa yang di-`hidden`,
skala tipografi per tier, dan padding per tier.

**10 — Notes / gotchas.** Daftar "JANGAN" yang spesifik ke implementasi ini.
Contoh: "jangan pakai `video.currentTime` untuk membalik — pakai array `frames[]`",
"`onUnmounted` harus didaftarkan sebelum `await` pertama".

**11 — Summary of the visual effect.** Satu paragraf prosa: apa yang benar-benar
DILIHAT dan DIRASAKAN user, dari diam sampai berinteraksi.

### Gate sebelum spec diserahkan

- Lolos 5 tes di `docs/awwwards/anti-slop-rules.md` (OBJECT / SWAP / EMPTY / WOW / NEIGHBOR)
- **`taste-lint` dijalankan dan dilampirkan** — `node docs/awwwards/scripts/taste-lint.mjs .nuxt/snap-<slug>.json` (prosedur: `docs/awwwards/calibration/README.md`)
- **Gate skor `min(A-score, T-score) >= 8.0`** — rata-rata DILARANG (`docs/awwwards/references/evaluation-system.md`)
- **Prediksi tersegel tercatat** di `docs/awwwards/calibration/predictions.jsonl` sebelum hasil dipresentasikan; isi `actual` setelah Billy memberi verdict
- Lolos **gate editorial 9 poin** di `docs/awwwards/references/editorial/README.md`
  (tracking per ambang · leading per tier · rasio display:body ≥5× · `text-wrap` · `tabular-nums` ·
  hukum spacing antar grup · padding section berbeda dari tetangga · mood target · squint & grayscale test)
- **Mood target 2–3 token** sudah ditulis sebelum build (taxonomy: `references/editorial/05-developing-taste.md` §4)
- Teknik minimal Level 4 pada hierarki anti-slop — Level 0 (partikel generik) ditolak
- Semua aset sudah diverifikasi hidup lewat `curl`
- Tidak ada font BANNED (Inter, Roboto, Arial, system-ui) dan **tidak ada font monospace**
  di peran apa pun — termasuk label/meta/counter (lihat Hard Constraints — Typography)
- Cek `docs/awwwards/personal-taste-profile.md` — khususnya preferensi anti-video-heavy

---


### Yang membuat spec ditolak

- Konsep tanpa angka ("logam yang meleleh", "terasa premium") tanpa blok 4–7
- Aset eksternal yang belum di-`curl`
- Menyalin spec produk lain lalu hanya mengganti nama jadi "Billy Maulana"
- Mengandalkan footage stock sebagai daya tarik utama — hapus videonya, harus masih ada karya
