# Rejection protocol

> Dipindah verbatim dari `CLAUDE.md` repo pada 2026-11-23. Bila isi di sini bertentangan dengan `CLAUDE.md` § Cara kerja art director (pelajari taste dari prinsip master brief, jangan meniru situs), `CLAUDE.md` yang berlaku.

## Rejection Protocol — WAJIB, Otomatis

**Pemicu**: Billy menyatakan penolakan dengan kata/frasa apa pun —
"jelek", "hapus saja", "tidak suka", "masih jauh", "ai slop", "biasa saja", "kurang".

Begitu pemicu muncul, **HENTIKAN pekerjaan perbaikan**. Dokumentasi dulu, baru perbaikan.
Jangan menawarkan konsep baru di pesan yang sama dengan penolakan.

### Urutan (tidak boleh dilompati)

1. **Screenshot bukti** — capture rute yang ditolak dalam keadaan yang dinilai Billy, simpan ke
   `docs/awwwards/failures/assets/<YYYY-MM-DD>-<slug>-desktop.png`.
   Kalau sudah terlanjur dihapus, tulis catatan tanpa screenshot dan sebutkan alasannya.
2. **Tulis failure note** `docs/awwwards/failures/<YYYY-MM-DD>-<slug>.md` mengikuti
   `docs/awwwards/failures/SCHEMA.md`. **Verdict WAJIB kutipan verbatim** — jangan diperhalus,
   jangan diparafrase.
3. **Diagnosis jujur** — kenapa gagal, tanpa membela diri, tanpa menyalahkan brief yang ambigu.
   Kalau lolos semua gate teknis tapi tetap ditolak, katakan itu dan jelaskan artinya.
   **WAJIB lewat adjective decoder** (`docs/awwwards/references/editorial/03-art-direction.md` §7C):
   terjemahkan kata sifat Billy ("AI slop" / "biasa saja" / "tidak harmoni") jadi dimensi terukur,
   sebutkan baris decoder mana yang gagal beserta angkanya. Dilarang memperbaiki sebelum langkah ini.
4. **Append rule baru** ke `docs/awwwards/anti-slop-rules.md` (format `- (YYYY-MM-DD) ...`).
5. **Update** `docs/awwwards/failures/INDEX.md` — termasuk tabel font-ditolak kalau penolakan
   menyebut tipografi.
6. **Baru** tawarkan langkah berikutnya.

### Pengecualian aturan screenshot

Aturan umum "JANGAN commit screenshot MCP, selalu `rm` setelah dipakai" **TIDAK berlaku** untuk
`docs/awwwards/failures/assets/` dan `docs/awwwards/references/library/assets/`.
Dua folder itu berisi artefak dokumentasi yang disengaja dan memang harus di-commit.
Screenshot debug sementara di luar dua folder itu tetap wajib dihapus.

---

