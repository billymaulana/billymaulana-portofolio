# Archivo Expanded 800 — metrik terukur (2026-11-23)

Sumber: Google Fonts (OFL), instance `wdth 125, wght 800`, subset latin. Diukur dengan `CanvasRenderingContext2D.measureText`
pada 200 px, `letter-spacing −0,02 em`, famili yang sama dengan yang akan dirender. Berkas: `billy-portfolio-assets/concept-2/fonts/`.

| Teks | Lebar tinta (em) | Ascent tinta (em) | Descent tinta (em) | Ukuran untuk 1344 px | Ukuran untuk 358 px |
|---|---|---|---|---|---|
| BILLY | 3,346 | 0,688 | 0,000 | 401,7 px | 107,0 px |
| MAULANA | 6,419 | 0,688 | 0,012 | **209,4 px** | **55,8 px** |
| BILLY MAULANA | 10,131 | 0,688 | 0,012 | 132,7 px | 35,3 px |
| Billy | 2,397 | 0,725 | 0,205 | 560,7 px | 149,4 px |
| Maulana | 5,096 | 0,725 | 0,012 | **263,7 px** | **70,3 px** |
| Billy Maulana | 7,845 | 0,725 | 0,205 | 171,3 px | 45,6 px |

- Left bearing "B"/"M": 0,085 em (kurangi dari margin agar tinta jatuh di garis kolom).
- Metrik font: ascent 0,88 em, descent 0,21 em → baseline pada line-height L: `(L − 1,09)/2 + 0,88` em dari atas kotak baris.
- Lantai leading: uppercase 0,70 (cap 0,688 + 0,012); sentence case 0,93 (0,725 + 0,205).
- Kontrol: Archivo wdth 100 wght 500 "MAULANA" = 4,842 em; wdth 125 wght 800 tanpa tracking = 6,539 em.

Konsekuensi tata letak: nama satu baris hanya 133–171 px di desktop, jadi skala "bold" dijaga dengan dua kata terpisah,
masing-masing berukuran sama (uppercase 209 px atau sentence case 264 px pada lebar 12 kolom).

## Koreksi 2026-11-23 — posisi baseline di DOM

Baris piksel hasil render (ambang 50% pada batang "B" dan "M") tidak cocok dengan posisi yang dihitung dari metrik:
dengan `line-height: 1`, baseline Archivo Expanded 800 jatuh di **0,823 em** dari tepi atas kotak baris, bukan 0,835 em.
Selisihnya 2,6 px pada 207,8 px (cap-top terukur 45, bukan 48). `ink-audit` membaca posisi dari metrik yang sama, jadi
tidak menangkap selisih ini.

| Besaran | Dari metrik | Dari piksel |
|---|---|---|
| Baseline dari tepi atas kotak baris | 0,835 em | 0,823 em |
| Tinggi kapital | 0,688 em | 0,690 em (143–144 px pada 207,8 px) |

Untuk menaruh cap-top di y = T: `top = T + 0,690 × ukuran − 0,823 × ukuran`. Verifikasi selalu dengan baris piksel.
