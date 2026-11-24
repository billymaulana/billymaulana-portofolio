# Protokol audit visual

> Dipindah verbatim dari `CLAUDE.md` repo pada 2026-11-23. Bila isi di sini bertentangan dengan `CLAUDE.md` § Cara kerja art director (pelajari taste dari prinsip master brief, jangan meniru situs), `CLAUDE.md` yang berlaku.

## Browser Review — WAJIB Setelah Visual Work

Setiap kali mengerjakan komponen visual (animasi, preloader, shader, transisi), WAJIB verifikasi di browser sebelum selesai:

1. Buka via Chrome DevTools MCP (`list_pages` → `navigate_page reload`)
2. Screenshot langsung setelah load untuk tangkap initial/mid-animation state
3. Cek console messages untuk Vue warn / unhandled errors (`list_console_messages`)
4. Tunggu animasi selesai dan screenshot final state
5. Verifikasi DOM state dengan `evaluate_script` jika diperlukan (cek transform, opacity, ui, dll)

**Khusus GSAP CustomEase**: path SVG harus valid — command `C` butuh tepat 6 angka (cp1x,cp1y cp2x,cp2y ex,ey). Format `M0,0 C0.76,0 0.24,1 1,1` adalah benar. Jangan tambahkan angka extra setelah segment.

### Layout Audit — MELIHAT SCREENSHOT TIDAK CUKUP

> Ditambahkan 2026-07-26 setelah logo menabrak eyebrow selama dua iterasi tanpa terdeteksi.
> Verdict Billy: *"lihat oleh anda sendiri logo terlalu besar dan menabrak text frontend enginer
> apa ini kualitas awwwards? ... terutama ui yang dihasilkan tidak pernah di check"*.
> Detail: `docs/awwwards/failures/2026-07-26-hero-explore-3-v2.md`.

Screenshot satu viewport **bukan** verifikasi. Bug itu lolos karena hanya diuji di 1440×900 dan
390×844 — keduanya kebetulan di sisi aman. Di 1440×780 (laptop dengan toolbar browser, salah satu
ukuran paling umum) elemen bertabrakan 22px dengan luas 2.247px².

**Sebelum klaim selesai untuk kerja visual apa pun, WAJIB:**

```bash
# 1. Ambil snapshot geometri di TIAP viewport lewat evaluate_script:
node docs/awwwards/scripts/layout-audit.mjs           # cetak collector untuk dijalankan di browser
node docs/awwwards/scripts/ink-audit.mjs              # collector kedua — WAJIB, bukan pengganti

# 2. Kumpulkan hasilnya jadi array JSON, lalu:
node docs/awwwards/scripts/layout-audit.mjs snapshots.json
node docs/awwwards/scripts/ink-audit.mjs ink-snapshots.json
```

**Dua audit, bukan satu.** `layout-audit` membaca `getBoundingClientRect`; `ink-audit` membaca
`TextMetrics`. Pada `line-height` di bawah 1, kotak CSS lebih pendek daripada glyph yang digambar
— jadi baris yang tintanya menembus 51px terbaca "tidak tumpang tindih". Terjadi 2026-07-26:
`layout-audit` meluluskan `/hero-explore-3` di **7 dari 7 viewport** sementara Billy melihat
"text billy maulana saling bertabrakkan dan bertumbuk"; `ink-audit` menemukan 11 kegagalan pada
halaman yang sama. Lihat `docs/awwwards/failures/2026-07-26-hero-explore-3-v3.md`.

Tujuh viewport wajib (`AUDIT_VIEWPORTS`): 1920×1080 · 1600×900 · 1440×900 · **1440×780** ·
**1366×768** · 834×1112 · 390×844.

Dua yang ditebalkan adalah yang selama ini terlewat. **Jangan hapus keduanya dari daftar.**

Yang diperiksa: tabrakan bounding box antar elemen, teks yang keluar viewport, scroll horizontal
dokumen, tap target < 44px di viewport sempit, font < 14px untuk teks panjang.

**Klaim "selesai" tanpa melampirkan hasil audit ini ditolak.** `taste-lint` tidak menggantikannya —
15 rule-nya semua memeriksa properti satu elemen (tracking, leading, rasio, measure), tidak ada
satu pun yang memeriksa hubungan geometri antar dua elemen. Layout yang saling menimpa lolos
`taste-lint` dengan skor 15/15.

### Kerja shader / WebGL / efek prosedural — audit piksel WAJIB

> Ditambahkan 2026-08-02 setelah `/explore/liquid/liquid-1` disajikan dengan typecheck, lint,
> build, dan console bersih, lalu ditolak: *"jelek, saat putih tidak terlihat liqudi ... berbeda
> dengan checkpoint/hero-2 liquidnya"*. Detail: `docs/awwwards/failures/2026-08-02-explore-liquid-1-dye-blob.md`.

Tiga audit di atas semuanya bersumber dari **elemen teks**. Pada rute tanpa teks ketiganya lolos
tanpa memeriksa apa pun — itu laporan kosong, bukan hijau. Untuk kerja visual non-teks:

```bash
# idle — reload, tunggu 2-3s TANPA menyentuh mouse
node docs/awwwards/scripts/effect-audit.mjs shot-idle.png --idle --identity "#0047FF"
# active — screenshot saat efek hidup
node docs/awwwards/scripts/effect-audit.mjs shot-active.png --identity "#0047FF"
# efek yang diklaim diambil dari rute lain WAJIB dibandingkan dengan sumbernya
node docs/awwwards/scripts/effect-audit.mjs shot-active.png --ref sumber-active.png
```

Yang diperiksa: kerapatan detail (bidang halus tanpa tepi = "tidak terlihat liquid"), bidang rata,
cakupan saat idle (efek yang menyala sendiri), disiplin hue, kehadiran warna identitas, dan
kesetiaan terhadap sumber. **Saat melaporkan audit apa pun, sebutkan berapa elemen yang benar-benar
diperiksa** — nol elemen berarti laporan itu tidak boleh dipakai sebagai bukti.

### Aturan turunan

- **Logo/mark bujur sangkar**: cek rasio file SVG-nya dulu (`width`/`height` di tag `<svg>`).
  `billy-maulana-logo-white.svg` adalah 500×500 — menyetel `width: 130px` menghasilkan tinggi
  130px juga, 7,5× tinggi label di bawahnya.
- **Elemen absolut dari tepi vs elemen yang di-center** bergerak berlawanan saat viewport
  memendek. Kalau keduanya berbagi kolom yang sama, tabrakan hanya soal waktu. Satukan ke satu
  flow (baris flex) alih-alih menambah margin — itu menghilangkan kelas kegagalannya, bukan
  menggesernya.
- **Leading display diturunkan dari metrik famili, bukan dari angka yang dipakai kemarin.** Ukur
  `actualBoundingBoxAscent + actualBoundingBoxDescent` ÷ `font-size` untuk teks yang sebenarnya
  dipasang, dan pakai hasilnya sebagai lantai `line-height`. Nilai terukur di repo ini: Clash
  Display 0,840 · Suisse 0,900 · Satoshi 0,931–0,985 · Switzer 0,945–0,957 · **PP Editorial New
  1,054**. Leading 0,86 hanya aman untuk satu dari delapan famili.
- **Elemen dengan peran berbeda dilarang mengalir dalam satu baris inline tanpa pemisah.** Label
  11px dan kontak 20px yang sama-sama `inline-block` di satu `div` berakhir bersentuhan pada
  jarak 0,0px dengan baseline meleset 16,8px. Beri `display: block` atau jarak yang ditulis.

