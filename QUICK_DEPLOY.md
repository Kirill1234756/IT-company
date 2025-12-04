# Быстрый деплой на reg.ru

## Минимальные шаги

### 1. На сервере reg.ru

```bash
# Установите Docker (если еще не установлен)
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Установите Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Загрузите проект на сервер

```bash
# На сервере
mkdir -p /var/www/kodifyweb
cd /var/www/kodifyweb

# Клонируйте репозиторий или загрузите файлы
git clone your-repo-url .
cd frontend
```

### 3. Получите SSL сертификаты от reg.ru

1. Зайдите в панель reg.ru
2. Получите SSL сертификат для `kodifyweb.ru`
3. Скачайте файлы:
   - `certificate.crt` (или `fullchain.pem`)
   - `private.key`

### 4. Создайте директорию для SSL

```bash
mkdir -p ssl
# Загрузите сертификаты:
# certificate.crt -> ssl/certificate.crt
# private.key -> ssl/private.key
chmod 600 ssl/private.key
```

### 5. Обновите nginx.conf

Убедитесь, что пути к SSL правильные:

```nginx
ssl_certificate /etc/nginx/ssl/certificate.crt;
ssl_certificate_key /etc/nginx/ssl/private.key;
```

### 6. Запустите деплой

```bash
# Соберите проект
npm ci
npm run build

# Запустите Docker
docker-compose up -d

# Проверьте статус
docker-compose ps
docker-compose logs -f
```

### 7. Проверьте работу

Откройте в браузере:

- https://kodifyweb.ru

## Обновление проекта

```bash
cd /var/www/kodifyweb/frontend
git pull
npm ci
npm run build
docker-compose build
docker-compose up -d
```

Или используйте скрипт:

```bash
chmod +x deploy.sh
./deploy.sh
```

## Полезные команды

```bash
# Логи
docker-compose logs -f web

# Перезапуск
docker-compose restart web

# Остановка
docker-compose down

# Статус
docker-compose ps
```






















