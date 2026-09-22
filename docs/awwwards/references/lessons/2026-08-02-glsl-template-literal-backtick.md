---
type: lesson
slug: glsl-template-literal-backtick
date: 2026-08-02
area: webgl
severity: build-breaking
---

# Backtick di dalam blok GLSL memutus template literal

## Gejala

Dev server menyajikan SSR HTML dengan benar (HTTP 200), tetapi client melempar:

```
TypeError: Failed to fetch dynamically imported module:
http://localhost:3001/_nuxt/pages/explore/hero/index.vue
```

Halaman berakhir sebagai error page Nuxt 500 dan **nol `<canvas>` di DOM**. Console browser
tidak pernah menyebut GLSL, TypeScript, atau nama composable yang sebenarnya rusak — ia hanya
melaporkan modul halaman yang gagal di-fetch, dua tingkat di atas sumbernya.

Pesan sebenarnya hanya muncul di **log dev server**:

```
ERROR  Internal server error: Transform failed with 1 error:
app/composables/useFluidSimulation.ts:701:12: ERROR: Expected ";" but found "clamp"
```

## Sebab

Seluruh shader di `useFluidSimulation.ts` disimpan sebagai template literal:

```ts
const contentDisplayShaderSource = `
  precision highp float;
  ...
`
```

Comment `/* ... */` di dalamnya **bukan comment JavaScript** — ia teks biasa di dalam string,
yang kebetulan juga valid sebagai comment GLSL. Karena itu setiap karakter bersintaks template
literal tetap aktif di sana. Menulis nama fungsi dalam backtick di dalam comment tersebut
menutup literal lebih awal, dan sisa GLSL dibaca esbuild sebagai kode JavaScript — baris
pertama yang memuat `clamp(` langsung menjadi syntax error.

## Aturan

Di dalam blok GLSL, **dua urutan karakter ini dilarang**, termasuk di dalam comment:

| Dilarang | Alasan |
|---|---|
| `` ` `` | menutup template literal |
| `${` | membuka interpolasi; isinya dieksekusi sebagai JS |

Untuk merujuk nama fungsi atau uniform di dalam comment GLSL, tulis polos tanpa pembungkus:
`clamp`, bukan `` `clamp` ``.

## Cara mendiagnosis cepat

Console browser menyesatkan karena menunjuk modul halaman. Baca log dev server dulu, lalu:

```bash
grep -n '`' app/composables/useFluidSimulation.ts
```

Blok GLSL yang sehat hanya menunjukkan **dua** baris per shader: pembuka dan penutup. Baris
backtick ketiga di antara keduanya adalah bug.

## Catatan terkait

Shader di file ini juga tidak ikut Vite HMR — setiap perubahan GLSL butuh **full page reload**,
bukan hot update. Reload yang tampak "tidak berubah" sesudah edit shader hampir selalu HMR,
bukan bukti bahwa perubahannya tidak berpengaruh.
