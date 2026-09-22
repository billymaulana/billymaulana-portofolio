# Failure Note Schema

Satu output yang ditolak Billy = satu note `failures/<date>-<slug>.md`.
Dibuat OTOMATIS setiap Billy menyatakan penolakan ("jelek", "hapus saja", "tidak suka",
"masih jauh", "ai slop"). Tidak menunggu diminta.

Ini terpisah dari `references/library/` (situs bagus milik orang lain) dan dari
`references/lessons/` (pelajaran proses/teknis). Folder ini khusus **karya Claude yang ditolak**,
supaya ada rekaman visual tentang apa yang TIDAK sesuai taste Billy.

## Frontmatter

| Field | Tipe | Wajib | Nilai |
| --- | --- | --- | --- |
| type | string | ya | selalu `failure` |
| slug | string | ya | kebab-case = nama file tanpa tanggal |
| date | date | ya | YYYY-MM-DD |
| route | string | ya | rute yang dinilai, mis. `/hero-explore-3` |
| concept | string | ya | nama konsep yang diajukan |
| verdict | string | ya | **kutipan verbatim Billy**, jangan diparafrase |
| severity | string | ya | `rejected` \| `deleted` \| `iterate` |
| style_attempted | string[] inline | ya | kategori style yang dicoba |
| fonts_used | string[] inline | ya | font yang dipakai — sering jadi akar penolakan |
| technique_level | number | ya | 0-5 dari hierarki `anti-slop-rules.md` |
| screenshot | string | ya | `assets/<date>-<slug>-desktop.png` |
| rule_added | string | tidak | rule baru yang di-append ke `anti-slop-rules.md` |

## Body wajib

1. **Kutipan verbatim** — apa yang Billy tulis, tanpa diperhalus
2. **Apa yang dibangun** — deskripsi faktual + angka (font, ukuran, teknik, uniform)
3. **Diagnosis jujur** — kenapa gagal. DILARANG membela diri atau menyalahkan ambiguitas brief
4. **Tes yang gagal** — dari 5 tes `anti-slop-rules.md` (OBJECT/SWAP/EMPTY/WOW/NEIGHBOR)
5. **Sinyal taste yang didapat** — apa yang SEKARANG diketahui tentang selera Billy yang belum diketahui sebelumnya
6. **Rule baru** — kalimat imperatif untuk di-append ke `anti-slop-rules.md`

## Setelah menulis note

1. Append `rule_added` ke section Rules di `anti-slop-rules.md` (format `- (YYYY-MM-DD) ...`)
2. Update `failures/INDEX.md`
3. Kalau penolakan menyebut FONT, tambahkan font itu ke daftar font-ditolak di `INDEX.md`
