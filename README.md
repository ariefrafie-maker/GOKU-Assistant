# GOKU AI — Asisten Pribadi

PWA tahap awal untuk Android dan desktop. Antarmuka mendukung Bahasa Indonesia dan pilihan gaya Baso Palembang, input suara melalui Web Speech API, dan pembacaan jawaban melalui Speech Synthesis.

## Status fitur
- [x] Antarmuka responsif untuk HP dan laptop
- [x] Manifest PWA dan service worker untuk cache dasar
- [x] Tombol mikrofon (bergantung dukungan browser dan izin)
- [x] Pembacaan teks dengan suara perangkat
- [x] Pilihan Indonesia / Palembang / campuran
- [ ] Mesin AI online (belum terhubung)
- [ ] Sinkronisasi HP–Windows
- [ ] Pengingat/notifikasi terjadwal
- [ ] Avatar manusia fotorealistis dan animasi

## Deploy
GitHub Actions akan menerbitkan situs ke GitHub Pages setelah workflow berjalan. Aktifkan Pages bila diperlukan melalui Settings → Pages → Build and deployment → GitHub Actions.

## Instal di Android
Setelah URL Pages aktif, buka di Chrome Android → menu ⋮ → Install app atau Tambahkan ke layar utama.

## Keamanan
Jangan menaruh API key di HTML/JavaScript yang dikirim ke browser. Integrasi model AI harus melalui backend/server dengan penyimpanan rahasia di sisi server.

Versi awal ini menggunakan respons lokal sederhana; bukan pengganti model AI online.
