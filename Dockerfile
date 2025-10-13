# Dockerfile для продакшена с HTTPS
FROM nginx:alpine

# Копируем собранные файлы
COPY dist/ /usr/share/nginx/html/

# Копируем конфигурацию nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Создаем директорию для SSL сертификатов
RUN mkdir -p /etc/nginx/ssl

# Открываем порты
EXPOSE 80 443

# Запускаем nginx
CMD ["nginx", "-g", "daemon off;"]


