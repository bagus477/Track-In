# Backend Track IN (Laravel + SQLite)

## 1. Jalankan setup (sekali saja)
Di terminal WSL Ubuntu, dari folder ini:

    bash setup.sh

Script akan memasang PHP 8.3, Composer, membuat project Laravel di `~/trackin-backend`,
menyalin kode backend, lalu membuat database SQLite berisi data contoh.

## 2. Jalankan API

    cd ~/trackin-backend
    php artisan serve --host=127.0.0.1 --port=8000

## 3. Ganti file frontend
Salin isi folder `frontend/` (catatan.js, dashboard.js, akun.js) ke folder frontend kamu,
menimpa file lama. `inventaris.js`, `keuangan.js`, dan `index.html` TIDAK perlu diubah.

## 4. Jalankan frontend lewat server (bukan klik dua kali)
`navbar.js` memakai `fetch("navbar.html")`, jadi harus lewat http:

    cd /lokasi/frontend
    python3 -m http.server 5500

Buka http://localhost:5500/index.html dan login:
`yusuf@trackin.test` / `password123`.

## Daftar endpoint (semua kecuali register/login butuh header `Authorization: Bearer <token>`)

| Method | Endpoint | Fungsi |
|---|---|---|
| POST | /api/register | Daftar akun |
| POST | /api/login | Login, balikan `{token, user}` |
| POST | /api/logout | Logout |
| GET / PUT / DELETE | /api/me | Lihat / ubah / hapus akun |
| PUT | /api/me/password | Ganti password (`current_password`, `new_password`) |
| GET POST PUT DELETE | /api/inventory | Inventaris |
| GET POST PUT DELETE | /api/expenses | Pengeluaran |
| GET POST DELETE | /api/incomes | Pemasukan (satu per bulan, POST pada bulan yang sama = update) |
| GET POST PUT DELETE | /api/bills | Tagihan (+ anggota) |
| POST PUT DELETE | /api/bill-members | Pembagian tagihan |
| GET POST PUT DELETE | /api/notes | Catatan |
| PATCH | /api/notes/{id}/pin | Pin / unpin catatan |

Data tiap user terpisah: user hanya bisa melihat dan mengubah datanya sendiri.
