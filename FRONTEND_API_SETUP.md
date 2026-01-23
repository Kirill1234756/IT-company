# Настройка API для фронтенда

## Обзор

Фронтенд был обновлен для использования Node.js бекенда вместо Supabase Edge Functions.

## Конфигурация API URL

### Вариант 1: Через переменную окружения (рекомендуется)

Создайте файл `.env` в корне папки `frontend`:

```env
VITE_API_URL=http://localhost:3000/api
```

Для продакшена:
```env
# Пример для этого проекта:
VITE_API_URL=https://api.kodifyweb.ru/api
# Или для другого проекта:
# VITE_API_URL=https://your-domain.com/api
```

### Вариант 2: Через window.API_BASE в index.html

В файле `frontend/index.html` можно переопределить API URL:

```html
<script>
  window.API_BASE = 'http://localhost:3000/api'
</script>
```

### Вариант 3: Использование значения по умолчанию

Если не указан `VITE_API_URL` или `window.API_BASE`, будет использоваться значение по умолчанию:
- Разработка: `http://localhost:3000/api`
- Продакшен: укажите через переменную окружения

## Обновленные API файлы

### 1. `src/api/contact-form.ts`
- ✅ Использует Node.js бекенд
- ✅ Отправляет JSON запросы на `/api/contact-form`
- ✅ Убрана логика Supabase (Authorization headers)

### 2. `src/api/client-form.ts`
- ✅ Использует Node.js бекенд
- ✅ Отправляет `multipart/form-data` для загрузки файлов
- ✅ Поддерживает загрузку файлов через FormData

### 3. `src/api/calculator-form.ts`
- ✅ Использует Node.js бекенд
- ✅ Отправляет JSON запросы на `/api/calculator-form`
- ✅ Убрана логика Supabase

## Проверка работы

1. Убедитесь, что Node.js бекенд запущен на порту 3000:
   ```bash
   cd backend
   npm run dev
   ```

2. Убедитесь, что фронтенд запущен:
   ```bash
   cd frontend
   npm run dev
   ```

3. Проверьте консоль браузера на наличие ошибок CORS или подключения

4. Протестируйте отправку форм:
   - Контактная форма (`/contacts`)
   - Форма "Стать клиентом" (`/client-form`)
   - Калькулятор (`/calculator`)

## CORS настройки

Бекенд настроен на разрешение запросов с:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (если фронтенд на том же порту)
- URL из переменной окружения `FRONTEND_URL`

Если используете другой порт или домен, обновите `FRONTEND_URL` в `.env` бекенда.

## Устранение проблем

### Ошибка: "Failed to fetch" или CORS error
- Проверьте, что бекенд запущен
- Проверьте, что `FRONTEND_URL` в бекенде включает ваш фронтенд URL
- Проверьте, что `VITE_API_URL` указывает на правильный адрес бекенда

### Ошибка: "404 Not Found"
- Убедитесь, что API URL заканчивается на `/api`
- Проверьте, что роуты в бекенде правильно настроены

### Файлы не загружаются (client-form)
- Убедитесь, что используется `multipart/form-data`
- Проверьте, что файл не превышает 20MB
- Проверьте, что тип файла разрешен (PDF, DOC, DOCX, TXT, JPG, JPEG, PNG)













