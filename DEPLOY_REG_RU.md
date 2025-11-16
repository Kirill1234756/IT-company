# Деплой фронтенда на reg.ru с помощью Docker

## Подготовка

### 1. Требования на сервере reg.ru

- VPS с установленным Docker и Docker Compose
- Доступ по SSH
- Домен `kodifyweb.ru` настроен и указывает на IP сервера

### 2. Подготовка проекта

```bash
# Соберите проект локально
cd frontend
npm run build

# Проверьте, что папка dist/ создана
ls -la dist/
```

## Вариант 1: Деплой с SSL сертификатами от reg.ru

### Шаг 1: Подключитесь к серверу

```bash
ssh user@your-server-ip
```

### Шаг 2: Создайте структуру директорий

```bash
mkdir -p /var/www/kodifyweb
cd /var/www/kodifyweb
```

### Шаг 3: Загрузите файлы на сервер

**Вариант A: Через Git (рекомендуется)**

```bash
# На сервере
git clone https://your-repo-url.git /var/www/kodifyweb
cd /var/www/kodifyweb/frontend
```

**Вариант B: Через SCP**

```bash
# На локальной машине
scp -r frontend/* user@your-server-ip:/var/www/kodifyweb/
```

### Шаг 4: Получите SSL сертификаты от reg.ru

1. Зайдите в панель управления reg.ru
2. Перейдите в раздел SSL сертификатов
3. Получите или установите бесплатный SSL сертификат для `kodifyweb.ru`
4. Скачайте сертификаты:
   - `certificate.crt` (или `fullchain.pem`)
   - `private.key`

### Шаг 5: Создайте директорию для SSL

```bash
mkdir -p /var/www/kodifyweb/ssl
# Загрузите сертификаты в эту директорию
# certificate.crt -> /var/www/kodifyweb/ssl/certificate.crt
# private.key -> /var/www/kodifyweb/ssl/private.key
```

### Шаг 6: Обновите nginx.conf

Отредактируйте `/var/www/kodifyweb/nginx.conf`:

```nginx
server {
    listen 80;
    server_name kodifyweb.ru www.kodifyweb.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name kodifyweb.ru www.kodifyweb.ru;

    # Пути к SSL сертификатам
    ssl_certificate /etc/nginx/ssl/certificate.crt;
    ssl_certificate_key /etc/nginx/ssl/private.key;

    # ... остальная конфигурация
}
```

### Шаг 7: Обновите docker-compose.yml

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
    restart: unless-stopped
    container_name: kodifyweb-frontend
```

### Шаг 8: Соберите и запустите Docker контейнер

```bash
cd /var/www/kodifyweb

# Соберите образ
docker-compose build

# Запустите контейнер
docker-compose up -d

# Проверьте логи
docker-compose logs -f
```

## Вариант 2: Деплой с Let's Encrypt (автоматические SSL)

### Шаг 1-3: Аналогично Варианту 1

### Шаг 4: Используйте обновленный docker-compose.yml с Certbot

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./ssl:/etc/nginx/ssl:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./webroot:/var/www/certbot:ro
    restart: unless-stopped
    container_name: kodifyweb-frontend

  certbot:
    image: certbot/certbot
    volumes:
      - ./ssl:/etc/letsencrypt
      - ./webroot:/var/www/certbot
    command: certonly --webroot --webroot-path=/var/www/certbot --email your-email@example.com --agree-tos --no-eff-email -d kodifyweb.ru -d www.kodifyweb.ru
    depends_on:
      - web
```

### Шаг 5: Обновите nginx.conf для Let's Encrypt

```nginx
server {
    listen 80;
    server_name kodifyweb.ru www.kodifyweb.ru;

    # Для Let's Encrypt
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }

    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name kodifyweb.ru www.kodifyweb.ru;

    ssl_certificate /etc/letsencrypt/live/kodifyweb.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/kodifyweb.ru/privkey.pem;

    # ... остальная конфигурация
}
```

### Шаг 6: Запустите

```bash
# Сначала запустите web для получения сертификата
docker-compose up -d web

# Затем получите сертификат
docker-compose run --rm certbot

# Перезапустите web с SSL
docker-compose restart web
```

## Обновление проекта

### Автоматическое обновление через скрипт

Создайте файл `/var/www/kodifyweb/deploy.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Начинаем деплой..."

# Переходим в директорию проекта
cd /var/www/kodifyweb/frontend

# Обновляем код (если используете Git)
git pull origin main

# Собираем проект
echo "📦 Собираем проект..."
npm ci
npm run build

# Пересобираем Docker образ
echo "🐳 Пересобираем Docker образ..."
cd ..
docker-compose build

# Перезапускаем контейнер
echo "🔄 Перезапускаем контейнер..."
docker-compose up -d

# Проверяем статус
echo "✅ Проверяем статус..."
docker-compose ps

echo "🎉 Деплой завершен!"
```

Сделайте скрипт исполняемым:

```bash
chmod +x /var/www/kodifyweb/deploy.sh
```

Использование:

```bash
/var/www/kodifyweb/deploy.sh
```

## Проверка работы

1. **Проверьте контейнер:**

   ```bash
   docker-compose ps
   docker-compose logs web
   ```

2. **Проверьте доступность:**

   ```bash
   curl -I https://kodifyweb.ru
   ```

3. **Проверьте SSL:**
   - Откройте https://kodifyweb.ru в браузере
   - Проверьте, что сертификат валиден

## Настройка автозапуска

Создайте systemd service `/etc/systemd/system/kodifyweb.service`:

```ini
[Unit]
Description=Kodify Frontend Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/var/www/kodifyweb
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
```

Активируйте:

```bash
sudo systemctl enable kodifyweb
sudo systemctl start kodifyweb
```

## Мониторинг и логи

```bash
# Просмотр логов
docker-compose logs -f web

# Статистика контейнера
docker stats kodifyweb-frontend

# Перезапуск при проблемах
docker-compose restart web
```

## Резервное копирование

```bash
# Бэкап dist/
tar -czf backup-$(date +%Y%m%d).tar.gz /var/www/kodifyweb/frontend/dist/

# Бэкап SSL сертификатов
tar -czf ssl-backup-$(date +%Y%m%d).tar.gz /var/www/kodifyweb/ssl/
```

## Решение проблем

### Контейнер не запускается

```bash
# Проверьте логи
docker-compose logs web

# Проверьте конфигурацию nginx
docker-compose exec web nginx -t
```

### SSL не работает

```bash
# Проверьте пути к сертификатам
docker-compose exec web ls -la /etc/nginx/ssl/

# Проверьте права доступа
chmod 600 /var/www/kodifyweb/ssl/private.key
```

### Порт занят

```bash
# Проверьте, что использует порт 80/443
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443

# Остановите другие сервисы или измените порты в docker-compose.yml
```

## Полезные команды

```bash
# Остановить контейнер
docker-compose down

# Остановить и удалить volumes
docker-compose down -v

# Пересобрать без кэша
docker-compose build --no-cache

# Войти в контейнер
docker-compose exec web sh
```
