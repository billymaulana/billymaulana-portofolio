# Hero Explore 3 — "MOLTEN INDEX"

> Concept brief + build spec. Art director: Claude. Owner: Billy Maulana.
> Status: **AWAITING APPROVAL** — jangan build sebelum user konfirmasi.

---

## 1. Diagnosis — kenapa 4 iterasi sebelumnya gagal

Keempat hero sebelumnya (Prisma, Axon, Studio, Red) diuji dengan `anti-slop-rules.md`:

| Tes | Prisma | Axon | Studio | Red |
|---|---|---|---|---|
| OBJECT — ada elemen visual non-teks? | video orang lain | video orang lain | video orang lain | video orang lain |
| SWAP — ganti nama, terlihat beda? | GAGAL | GAGAL | GAGAL | GAGAL |
| EMPTY — hapus teks, masih menarik? | GAGAL | GAGAL | GAGAL | GAGAL |
| WOW — berhenti scroll? | GAGAL | GAGAL | GAGAL | GAGAL |

Akar masalahnya satu: **daya tarik visualnya bukan milik Billy.** Semuanya menyewa footage stock. Hapus videonya, tinggal teks di atas warna solid.

Pelanggaran spesifik terhadap taste profile:
- `personal-taste-profile.md` → "user menghindari pendekatan video-heavy, prefer solusi kreatif non-video" — dilanggar 4x
- `anti-slop-rules.md` → font Inter/Roboto/Arial BANNED — Inter dipakai 3x
- Hero wajib 3 layer simultan (type-as-material + mouse **velocity** + WebGL atmosphere) — 0 dari 4 memenuhi
- Minimum 1 GLSL shader per project — tidak ada sama sekali

---

## 2. Sinyal terkuat dari reference library

Tiga referensi berbeda, reaksi Billy nyaris identik:

| Referensi | Verbatim |
|---|---|
| art-yakushev | "text di hero terlihat seperti **prisma atau silver**" |
| chdartmaker | "effect pada fontnya ada **pantulan abu seakan silver/kaca**" |
| latchezarboyadjiev | "effect pantulan pada text heronya terlihat seperti **glass/prisma/silver**" |

**Kesimpulan art director**: tanda tangan taste Billy adalah **huruf yang materialnya logam/kaca**, bukan huruf yang diberi efek. Bedanya fundamental — yang pertama adalah materi, yang kedua adalah dekorasi.

Catatan teknik chdartmaker: ilusi silver-nya **bukan shader** — hanya render 3D monokrom `opacity: 0.7` di belakang teks putih. Murah, efektif. Kita naikkan ke Level 5 (GLSL) karena stack-nya mampu.

---

## 3. Konsep — "MOLTEN INDEX"

### Premis naratif

Billy membangun infrastruktur yang disentuh 80 juta orang tapi tidak pernah terlihat. Struktur rekayasa yang **kaku dan berat**, tapi terasa **cair dan ringan** bagi manusia yang memakainya.

Hero-nya menjadi metafora literal dari itu:

> **Namanya adalah blok logam padat. Di bawah kursor, logam itu meleleh.**

Diam = brutalis, monokrom, berat, industrial.
Disentuh = cair, kromatik, hidup.

Ini lolos SWAP test karena huruf-hurufnya **adalah** materialnya — bentuk "BILLYMAULANA" yang menentukan bagaimana logam mengalir. Ganti nama, patung berubah.
Lolos EMPTY test karena field logam tetap ada tanpa teks.

### Tiga layer simultan (memenuhi aturan hero)

| Layer | Teknik | Level |
|---|---|---|
| **1. Atmosfer** | GLSL fullscreen — domain-warped fBm noise sebagai brushed-metal field, near-black. Bukan partikel. | 5 |
| **2. Masthead** | Teks di-render ke texture, dipakai sebagai displacement + reflection map di shader. Huruf = logam, bukan huruf diberi efek. **Bukan `background-clip: text`** (itu kegagalan #12). | 5 |
| **3. Chroma event** | Mouse **velocity** (bukan posisi) mendorong RGB split di tepi glyph. Diam = 0 chroma. | 4 |

### Color philosophy — 70/20/10 (dari taste profile)

- **70% monokrom** — `#000` kanvas, putih tulang untuk teks
- **20% chrome** — gradasi abu perak di dalam glyph, dari shader
- **10% chromatic event** — `#0047FF` / `#a1e0e7` **hanya muncul saat velocity tinggi**

Accent TIDAK ada di keadaan diam. User harus bergerak untuk membangunkannya → Zeigarnik tension, sesuai catatan taste-mu: "Warna datang dengan alasan".

### Brutalist scaffolding

Bukan sekadar teks besar di tengah. Struktur data-sheet:

- Hairline rules 1px `rgba(255,255,255,0.12)` membentuk Swiss grid yang **terlihat**
- Meta edge-anchored: `BANDUNG, ID · 6°54'S 107°36'E`, `EST. 2018`, `INDEX 001/023`
- Counter brutalist: `(07)` tahun, `(23)` proyek, `(80M)` user — angka besar, tracking negatif
- Logo BM sebagai anchor kiri-atas, flush grid

---

## 4. Tipografi

| Peran | Font | Alasan |
|---|---|---|
| Masthead | **Bebas Neue** | Locked decision `CLAUDE.md` — dipertahankan di eksplorasi layout apapun |
| Display meta / counter | **Animo** | Sudah self-hosted; Billy: "paling suka font display section CTA... Animo, uppercase, brutalist/creative" |
| Data / koordinat | **JetBrains Mono** | Sudah terpasang; memberi nada teknis data-sheet |

Maksimum 3 weight (aturan anti-slop). Tracking negatif agresif: `-0.04em` di masthead.

**Tidak ada Inter, Roboto, Arial, system-ui.**

---

## 5. Motion

- Easing dominan `expo.inOut`; reveal `power4.out`. Tidak ada `linear`/`power1`/`ease`.
- Entrance: per-huruf clip reveal, stagger 0.03s — bukan `opacity:0,y:30`
- Velocity smoothing via GSAP `quickTo`, bukan RAF + CSS var
- Idle-state: shader tetap hidup pelan tanpa mouse (aturan idle-state test)

---

## 6. Aset

**Nol aset eksternal.** Semua prosedural (GLSL + font self-hosted + logo repo).

Alasan: (a) kuota BytePlus habis dan user minta skip kalau blocker, (b) taste profile eksplisit anti-video-heavy, (c) aset prosedural tidak bisa mati seperti Cloudinary 401 / Mux 7-hari.

---

## 7. Build spec

### File
```
app/hero-explore-3/MoltenIndex.vue      — markup + grid brutalis
app/hero-explore-3/useMoltenShader.ts   — WebGL2 setup, uniform, RAF
app/hero-explore-3/molten.frag          — GLSL fragment (maks 60 baris)
app/hero-explore-3/molten.css           — @font-face Animo, scoping
app/pages/hero-explore-3.vue            — route, standalone
```

### Shader — uniform

| Uniform | Tipe | Isi |
|---|---|---|
| `uResolution` | `vec2` | ukuran canvas × DPR |
| `uTime` | `float` | detik, untuk drift idle |
| `uMouse` | `vec2` | posisi ternormalisasi, di-smooth GSAP |
| `uVelocity` | `float` | 0–1, magnitudo kecepatan mouse, decay eksponensial |
| `uTextTex` | `sampler2D` | masthead di-render ke offscreen canvas 2D |

### Algoritma fragment

1. `fbm(p)` 4 oktaf + domain warp → field logam dasar
2. Sample `uTextTex` → `mask`
3. Normal aproksimasi dari gradien fbm → highlight spekular ala brushed metal
4. Di dalam `mask`: naikkan kontras spekular (huruf jadi logam), di luar: redam ke near-black
5. Distorsi radial di sekitar `uMouse` berskala `uVelocity` → efek "meleleh"
6. RGB split: offset sample R dan B sebesar `uVelocity * 0.006` → chroma hanya saat gerak
7. Grain `mix-blend-mode: overlay` opacity 0.04 (wajib per taste profile)

### Gates
`typecheck` · `lint` · `build` · console 0 error · 30-Second Reject Test 5/5 · idle-state test.

---

## 8. Risiko yang saya sadari

| Risiko | Mitigasi |
|---|---|
| Teks di dalam shader bisa buram / aliasing | Render text texture di 2× DPR, gunakan `LINEAR` filtering |
| Efek "meleleh" bisa jadi gimmick murah | Amplitudo kecil (0.001–0.01 per taste profile), decay cepat |
| WebGL2 gagal / reduced-motion | Fallback: masthead statis putih di atas hitam + grid brutalis — tetap lolos OBJECT test |
| Kompleksitas > 200 LOC per file | Shader dipisah ke `.frag`, logic ke composable |

---

## 9. Keputusan yang saya butuhkan dari kamu

1. **Konsep "logam meleleh"** — lanjut, atau arahnya salah?
2. **Masthead font** — Bebas Neue (locked) atau Animo (yang kamu bilang paling suka)?
3. **Chroma hanya saat gerak** — setuju accent tidak muncul di keadaan diam?
