# GOKU AI — Asisten Pribadi

PWA untuk Android dan desktop. Antarmuka mendukung Bahasa Indonesia/Baso Palembang, input suara browser, dan pembacaan jawaban.

## Arsitektur AI

- Frontend: GitHub Pages.
- Backend: Cloudflare Worker pada `cloudflare-worker/src/index.js`.
- Model: Groq API `openai/gpt-oss-20b` (free-tier subject to Groq limits).
- API key Groq hanya disimpan sebagai Worker Secret `GROQ_API_KEY`, tidak pernah ditanam di frontend.
- Kode akses aplikasi disimpan sebagai Worker Secret `GOKU_ACCESS_CODE`. Pengguna memasukkan kode yang sama pada pengaturan aplikasi.

## Langkah aktivasi backend (perlu dilakukan pemilik akun)

1. Buat akun gratis di https://dash.cloudflare.com/ dan masuk ke **Workers & Pages**.
2. Pilih **Create application → Create Worker**. Beri nama, misalnya `goku-ai-api`.
3. Buka **Edit code**, ganti kode contoh dengan seluruh isi file `cloudflare-worker/src/index.js` dari repositori ini, lalu **Deploy**.
4. Pada Worker, buka **Settings → Variables and Secrets**. Tambahkan dua nilai bertipe **Secret**:
   - `GROQ_API_KEY`: API key dari https://console.groq.com/keys
   - `GOKU_ACCESS_CODE`: buat kode akses acak panjang milik sendiri. Jangan gunakan password akun lain.
5. Simpan secrets dan deploy ulang jika dashboard meminta.
6. Salin alamat Worker, biasanya berbentuk `https://goku-ai-api.<nama-akun>.workers.dev`.
7. Buka aplikasi GOKU AI, isi alamat Worker dan kode akses pada bagian **Hubungkan otak AI GOKU**, tekan **Simpan koneksi**, lalu **Tes koneksi**.

## Batas dan keamanan

- Groq free tier memiliki batas permintaan/token yang berubah menurut model dan akun. Saat kuota habis, tunggu reset atau cek konsol Groq.
- Jangan memasukkan data pribadi sensitif, data medis, password, PIN, atau rahasia perusahaan ke layanan AI gratis. Ketentuan privasi dan penggunaan data provider dapat berubah.
- Kode akses aplikasi bukan pengganti autentikasi pengguna yang kuat. Untuk penggunaan publik/organisasi, tambahkan autentikasi, rate limiting, dan pemantauan biaya sebelum dibuka luas.
- CORS membatasi browser ke domain GitHub Pages resmi, tetapi CORS bukan mekanisme autentikasi.
- AI dapat salah. Verifikasi peraturan K3, keputusan operasional, dan informasi kritis melalui sumber resmi/otoritas terkait.
- PWA tidak dapat menghapus virus, mengontrol perangkat tanpa izin, atau memperbaiki semua gangguan secara mandiri.

## Instal di Android

Buka https://ariefrafie-maker.github.io/GOKU-Assistant/ melalui Chrome Android → menu ⋮ → **Install app** atau **Tambahkan ke layar utama**.

## Status

- [x] PWA responsif dan deployment GitHub Pages
- [x] Antarmuka pengaturan backend dan tes koneksi
- [x] Worker proxy Groq dengan secret server-side, validasi input, CORS, dan batas panjang percakapan
- [ ] Aktivasi akun Cloudflare dan Groq oleh pemilik akun
- [ ] Uji langsung pada perangkat Android/laptop setelah backend aktif
- [ ] Sinkronisasi memori lintas perangkat dan avatar animasi (belum tersedia)
