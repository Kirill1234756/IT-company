# Настройка HTTPS для защищенной страницы

## Локальная разработка с HTTPS

### Запуск с HTTPS в режиме разработки:

```bash
npm run dev:https
```

### Preview с HTTPS:

```bash
npm run preview:https
```

## Продакшен с HTTPS

### 1. Получение SSL сертификата

Замените в файлах `nginx.conf`, `docker-compose.yml` и `setup-ssl.sh`:

- `your-domain.com` на ваш домен
- `your-email@example.com` на ваш email

Запустите скрипт для получения сертификата:

```bash
npm run ssl:setup
```

### 2. Сборка и запуск

```bash
npm run deploy
```

## Альтернативные способы получения SSL сертификата

### Cloudflare (бесплатно)

1. Зарегистрируйтесь на cloudflare.com
2. Добавьте ваш домен
3. Измените DNS записи на Cloudflare
4. Включите "Full (strict)" SSL режим

### Let's Encrypt с Certbot

```bash
# Установка certbot
sudo apt install certbot python3-certbot-nginx

# Получение сертификата
sudo certbot --nginx -d your-domain.com
```

### Самоподписанный сертификат (только для тестирования)

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes
```

## Проверка безопасности

После настройки HTTPS проверьте ваш сайт на:

- https://www.ssllabs.com/ssltest/
- https://securityheaders.com/

## Важные заголовки безопасности

Конфигурация включает:

- `Strict-Transport-Security` - принудительное использование HTTPS
- `X-Frame-Options` - защита от clickjacking
- `X-Content-Type-Options` - защита от MIME sniffing
- `X-XSS-Protection` - защита от XSS атак
- `Content-Security-Policy` - контроль загружаемых ресурсов


