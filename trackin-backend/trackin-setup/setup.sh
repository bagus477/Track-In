#!/usr/bin/env bash
# Setup backend Track IN (Laravel + SQLite) di WSL Ubuntu.
# Jalankan:  bash setup.sh
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET="$HOME/trackin-backend"

echo "==> 1/6 Install PHP & dependensi"
sudo apt update
sudo apt install -y software-properties-common ca-certificates unzip curl git

if ! apt-cache show php8.3-cli >/dev/null 2>&1; then
  echo "    php8.3 tidak ada di repo bawaan, menambah PPA ondrej/php"
  sudo add-apt-repository -y ppa:ondrej/php
  sudo apt update
fi
sudo apt install -y php8.3-cli php8.3-mbstring php8.3-xml php8.3-curl \
                    php8.3-sqlite3 php8.3-zip php8.3-bcmath

echo "==> 2/6 Install Composer"
if ! command -v composer >/dev/null 2>&1; then
  curl -sS https://getcomposer.org/installer | php
  sudo mv composer.phar /usr/local/bin/composer
fi

echo "==> 3/6 Buat project Laravel di $TARGET"
if [ -d "$TARGET" ]; then
  echo "    Folder $TARGET sudah ada, dipakai ulang."
else
  composer create-project laravel/laravel "$TARGET" --no-interaction
fi
cd "$TARGET"

echo "==> 4/6 Pasang API + Sanctum"
php artisan install:api --no-interaction || true

echo "==> 5/6 Salin kode backend Track IN"
cp -r "$HERE/overlay/." "$TARGET/"

# Pastikan pakai SQLite
touch database/database.sqlite
sed -i 's/^DB_CONNECTION=.*/DB_CONNECTION=sqlite/' .env
sed -i '/^DB_HOST=/d;/^DB_PORT=/d;/^DB_DATABASE=/d;/^DB_USERNAME=/d;/^DB_PASSWORD=/d' .env

echo "==> 6/6 Migrasi database + data contoh"
php artisan migrate:fresh --seed --force

cat <<MSG

Selesai!

Jalankan server API:
    cd $TARGET
    php artisan serve --host=127.0.0.1 --port=8000

Akun demo:
    email    : yusuf@trackin.test
    password : password123

Tes cepat:
    curl http://127.0.0.1:8000/api/ping
MSG
