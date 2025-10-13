#!/bin/bash

# Скрипт для получения SSL сертификата от Let's Encrypt

# Замените на ваш домен и email
DOMAIN="your-domain.com"
EMAIL="your-email@example.com"

# Создаем директории
mkdir -p ssl webroot

# Получаем сертификат
docker run --rm \
  -v $(pwd)/ssl:/etc/letsencrypt \
  -v $(pwd)/webroot:/var/www/certbot \
  certbot/certbot \
  certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN

# Копируем сертификаты в нужный формат для nginx
cp ssl/live/$DOMAIN/fullchain.pem ssl/certificate.crt
cp ssl/live/$DOMAIN/privkey.pem ssl/private.key

echo "SSL сертификат получен и настроен!"
echo "Теперь запустите: docker-compose up -d"


