---
type: lesson
date: 2026-07-18
job: "Upgrade taste-capture ke section-sweep (cap 6) + re-capture emotion-agency & bymonolog agar fit aturan baru"
outcome: iterated
---

## Yang berhasil
Section sweep cap 6 dengan tabel teknik per-section (Layout/Typography/Motion/Color/Konsep/Teknik) di capture-scaffold.mjs. Enumerasi section dari anchor nav. bymonolog (Lenis native) pakai scrollIntoView; emotion-agency (eScroll) pakai klik anchor nav.

## Yang jadi slop + root cause
Percobaan pertama sweep emotion-agency pakai scrollIntoView/window.scrollY GAGAL — scrollY tetap 0. Root cause: eScroll (juga Locomotive) memindah konten via CSS transform pada wrapper, bukan native scroll, sehingga API scroll browser mati dan screenshot section akan salah (tetap di hero).

## Rule baru
Saat sweep section di situs smooth-scroll: setelah scroll cek window.scrollY. Jika tetap 0 (transform-based: eScroll/Locomotive), trigger scroll via klik anchor nav (a[href$=#id].click()) lalu poll getBoundingClientRect().top sampai stabil — jangan andalkan scrollIntoView. Lenis (native scroll) tetap kompatibel dengan scrollIntoView.

## Sinyal taste baru
Billy ingin SETIAP capture menyapu semua section utama (cap 6) + teknik detail per-section (layout/typography/konsep), bukan hanya hero. Font-system multi-peran (display/body/label/serif accent) penting dicatat — Billy jeli pada tipografi.
