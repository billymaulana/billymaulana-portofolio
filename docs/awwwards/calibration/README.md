---
type: calibration
updated: 2026-07-26
---

# Kalibrasi & Testing Taste Engine

Sistem ini sebelumnya punya **knowledge** (SKILL.md + reference) dan **enforcement** (agent + gate),
tapi tidak punya **pengukuran**. Skor `art-director-critic` tidak pernah divalidasi terhadap
penilaian Billy — akibatnya dua hero lolos semua gate lalu ditolak
(`../failures/INDEX.md`: "Lolos semua gate teknis, tetap ditolak — 2×").

Folder ini menutup lubang itu dengan tiga lapis.

| Lapis | Alat | Menjawab |
|---|---|---|
| 1 · Mekanis | `../scripts/taste-lint.mjs` | Apakah eksekusinya benar? (deterministik, tanpa judgment) |
| 2 · Preferensi | `/calibration` + `assertions.jsonl` | Apakah aturan sistem cocok dengan pilihan nyata Billy? |
| 3 · Prediktif | `predictions.jsonl` + `../scripts/taste-calibration.mjs` | Apakah penilaian sistem makin selaras dari waktu ke waktu? |

**Peringatan yang mengikat**: `taste-lint` hijau mengukur **kebenaran eksekusi**, bukan selera.
Dua route yang sudah ditolak Billy pun bisa mendapat jumlah PASS yang mirip dengan halaman utama.
Jangan pernah menyajikan lint hijau sebagai bukti kualitas desain.

---

## Lapis 1 — taste-lint

15 rule dengan ambang dari `../references/editorial/`. Prosedur lengkap:

```bash
node docs/awwwards/scripts/taste-lint.mjs --emit public/__taste-collect.js
```

Di browser (Chrome DevTools MCP `evaluate_script`, `filePath: .nuxt/snap-<slug>.json`):

```js
async () => {
  await new Promise(r => setTimeout(r, 6000));
  const m = await import('/__taste-collect.js?v=' + Date.now());
  return m.default(document, window);
}
```

```bash
node docs/awwwards/scripts/taste-lint.mjs .nuxt/snap-<slug>.json
rm -f public/__taste-collect.js
```

`rm` **wajib** — file kolektor tidak boleh ikut ter-build atau ter-commit.
`filePath` MCP harus di dalam workspace root; `.nuxt/` sudah di-gitignore sehingga aman.

Baseline pertama ada di `baseline/2026-07-26-*.txt`.

### Rule yang paling menentukan

| Rule | Kenapa penting |
|---|---|
| `tracking-not-global` | Mendeteksi satu nilai `letter-spacing` untuk semua tier — gejala paling langsung dari "font default diperbesar". FAIL → Editorial Craft maksimum 4 |
| `leading-tier` | Leading tidak dikunci per tier = blok teks terasa default |
| `display-body-ratio` | Kalau tidak ada teks ≥64px di DOM, lint menyatakan masthead kemungkinan di canvas dan meminta verifikasi manual |
| `opacity-floor` | Mengecualikan elemen ber-`mix-blend-mode` — grain 0.04 yang diwajibkan taste profile bukan pelanggaran |

---

## Lapis 2 — Sesi kalibrasi A/B

```bash
pnpm dev
# buka http://localhost:3000/calibration
```

Delapan pasangan, masing-masing berbeda pada **satu dimensi saja**, motion tetap hidup.
Keyboard `A` / `B` / `S` (skip), `←` untuk mundur. Jawaban tersimpan di localStorage.

Setelah selesai: **Salin JSONL** → tempel ke `assertions.jsonl` → jalankan
`node docs/awwwards/scripts/taste-calibration.mjs`.

`expectations.json` menyimpan pilihan yang **diprediksi aturan sistem saat ini** untuk tiap
pasangan. Kalau Billy memilih sebaliknya, aturan itu berstatus **CONTRADICTED** dan wajib
direvisi bertanggal — mekanisme yang sama yang menghasilkan revisi 2026-07-26.

Kolom catatan diisi **kata-kata Billy sendiri**, tidak diparafrase. Kutipan mentah adalah sinyal
taste paling akurat yang dimiliki sistem ini.

### Sesi berikutnya

Sesi 1 menguji typography. Yang belum diuji dan layak jadi sesi lanjutan:
ground & palet · densitas/ritme · material (refraksi optik vs prosedural) · easing & durasi.
Tambahkan pasangan baru di `app/calibration/pairs.ts` dan ekspektasinya di `expectations.json`.

---

## Lapis 3 — Prediction log

Sebelum hasil ditunjukkan ke Billy, `art-director-critic` menulis satu baris tersegel:

```json
{"ts":"2026-07-26T08:00:00Z","route":"/hero-v4","a_score":8.6,"t_score":6.2,"mood":["monumental","austere"],"predict":"reject","reasons":["tracking global"],"actual":null}
```

Setelah Billy memberi verdict, isi `actual`:

```json
"actual":{"verdict":"reject","score":5.0,"mood":["sterile"],"quote":"jelek, masih ai slop"}
```

`quote` **wajib verbatim**. `predict` boleh dikosongkan — script menurunkannya dari
`min(a_score, t_score) ≥ 8.0`.

### Metrik

| Metrik | Arti | Target |
|---|---|---|
| **False positive** | critic bilang lolos, Billy menolak | **turun dari waktu ke waktu — ini metrik utama** |
| False negative | critic bilang belum lolos, Billy menerima | rendah, tapi jauh lebih tidak berbahaya |
| Accuracy | kecocokan terima/tolak | naik |
| MAE skor | selisih `min(A,T)` dengan skor Billy | turun |
| Mood Jaccard | irisan token mood prediksi vs aktual | naik |
| Drift | FP rate 10 entri terakhir vs sebelumnya | menurun |

Metrik baru berarti setelah **minimal 3 review beresolusi**. Sebelum itu laporan akan
menyatakannya sendiri, bukan menampilkan angka palsu.

---

## Kenapa false positive yang diutamakan

False negative berarti sistem terlalu keras — biayanya satu iterasi tambahan.
False positive berarti sistem menyatakan sesuatu selesai padahal Billy akan menolaknya —
biayanya kepercayaan, dan itulah yang sudah terjadi dua kali.

Karena itu gate memakai `min(A-score, T-score)`, bukan rata-rata: rata-rata menyembunyikan
kegagalan taste di balik skor Awwwards yang tinggi.
