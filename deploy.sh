#!/bin/bash
set -e

echo "🚀 Начинаем деплой kodifyweb.ru..."

# Цвета для вывода
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверяем, что мы в правильной директории
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Ошибка: package.json не найден. Запустите скрипт из директории frontend${NC}"
    exit 1
fi

# Проверяем, что dist/ существует или собираем проект
if [ ! -d "dist" ] || [ -z "$(ls -A dist 2>/dev/null)" ]; then
    echo -e "${YELLOW}📦 Собираем проект...${NC}"
    npm ci
    npm run build
    
    if [ ! -d "dist" ]; then
        echo -e "${RED}❌ Ошибка: сборка не удалась, папка dist/ не создана${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Проект собран${NC}"
else
    echo -e "${GREEN}✅ Папка dist/ уже существует${NC}"
fi

# Проверяем наличие Docker
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Ошибка: Docker не установлен${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Ошибка: Docker Compose не установлен${NC}"
    exit 1
fi

# Проверяем SSL сертификаты
if [ ! -d "ssl" ]; then
    echo -e "${YELLOW}⚠️  Директория ssl/ не найдена. Создаем...${NC}"
    mkdir -p ssl
    echo -e "${YELLOW}⚠️  ВАЖНО: Загрузите SSL сертификаты в директорию ssl/${NC}"
    echo -e "${YELLOW}   - certificate.crt (или fullchain.pem)${NC}"
    echo -e "${YELLOW}   - private.key${NC}"
fi

# Собираем Docker образ
echo -e "${YELLOW}🐳 Собираем Docker образ...${NC}"
docker-compose build

# Останавливаем старый контейнер (если есть)
echo -e "${YELLOW}🛑 Останавливаем старый контейнер...${NC}"
docker-compose down 2>/dev/null || true

# Запускаем новый контейнер
echo -e "${YELLOW}▶️  Запускаем контейнер...${NC}"
docker-compose up -d

# Ждем немного для запуска
sleep 2

# Проверяем статус
echo -e "${YELLOW}📊 Проверяем статус контейнера...${NC}"
if docker-compose ps | grep -q "Up"; then
    echo -e "${GREEN}✅ Контейнер успешно запущен!${NC}"
    echo ""
    echo -e "${GREEN}📋 Информация о контейнере:${NC}"
    docker-compose ps
    echo ""
    echo -e "${GREEN}🌐 Сайт должен быть доступен по адресу:${NC}"
    echo -e "   - http://kodifyweb.ru"
    echo -e "   - https://kodifyweb.ru"
    echo ""
    echo -e "${YELLOW}📝 Для просмотра логов используйте:${NC}"
    echo -e "   docker-compose logs -f web"
else
    echo -e "${RED}❌ Ошибка: контейнер не запустился${NC}"
    echo -e "${YELLOW}Проверьте логи:${NC}"
    docker-compose logs
    exit 1
fi

echo -e "${GREEN}🎉 Деплой завершен успешно!${NC}"

























