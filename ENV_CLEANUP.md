# Очистка .env файла от Supabase

## Проблема

В файле `frontend/.env` могут остаться переменные Supabase, которые больше не нужны:
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_URL`
- Другие переменные Supabase

## Решение

### 1. Откройте файл `frontend/.env`

### 2. Удалите или закомментируйте все переменные Supabase:

```env
# Удалите или закомментируйте эти строки:
# VITE_SUPABASE_ANON_KEY=...
# VITE_SUPABASE_URL=...
```

### 3. Убедитесь, что есть правильная переменная для Node.js бекенда:

```env
# Для разработки:
VITE_API_URL=http://localhost:3000/api

# Для продакшена:
# Пример для этого проекта:
# VITE_API_URL=https://api.kodifyweb.ru/api
# Или для другого проекта:
# VITE_API_URL=https://your-domain.com/api
```

### 4. Сохраните файл и перезапустите dev сервер:

```bash
cd frontend
npm run dev
```

## Минимальный .env для фронтенда

```env
# API URL для Node.js бекенда
VITE_API_URL=http://localhost:3000/api
```

## Важно

- **Supabase больше не используется** - все переменные Supabase можно удалить
- **VITE_API_URL** должна указывать на ваш Node.js бекенд
- Если `VITE_API_URL` не указана, будет использоваться значение по умолчанию: `http://localhost:3000/api`













