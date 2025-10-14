# Client Form Backend Implementation Guide

## Обзор

Данный документ описывает API endpoints, которые необходимо реализовать на бэкенде для работы формы "Стать клиентом".

## API Endpoints

### 1. POST /api/client-form

**Описание:** Основной endpoint для отправки формы клиента

**Content-Type:** `multipart/form-data`

**Параметры запроса:**

- `companyDescription` (string, required) - Описание компании
- `task` (string, required) - Задача клиента
- `solutionVision` (string, required) - Видение решения проблемы
- `expectations` (string, required) - Ожидания от результата
- `budget` (string, required) - Планируемый бюджет
- `name` (string, required) - Имя клиента
- `company` (string, required) - Название компании
- `phone` (string, required) - Номер телефона
- `email` (string, required) - Email адрес
- `attachedFile` (file, optional) - Прикрепленный файл (максимум 20 МБ)

**Пример запроса:**

```javascript
const formData = new FormData()
formData.append('companyDescription', 'IT компания...')
formData.append('task', 'Нужен сайт...')
// ... остальные поля
formData.append('attachedFile', fileObject)

fetch('/api/client-form', {
  method: 'POST',
  body: formData,
})
```

**Успешный ответ (200):**

```json
{
  "success": true,
  "clientId": "CLIENT_12345",
  "message": "Заявка успешно отправлена"
}
```

**Ошибка валидации (400):**

```json
{
  "success": false,
  "message": "Ошибки валидации",
  "errors": {
    "email": "Некорректный email",
    "phone": "Некорректный номер телефона"
  }
}
```

**Серверная ошибка (500):**

```json
{
  "success": false,
  "message": "Внутренняя ошибка сервера"
}
```

### 2. POST /api/client-form/validate (опционально)

**Описание:** Валидация формы на сервере

**Content-Type:** `application/json`

**Параметры запроса:**

```json
{
  "companyDescription": "string",
  "task": "string",
  "solutionVision": "string",
  "expectations": "string",
  "budget": "string",
  "name": "string",
  "company": "string",
  "phone": "string",
  "email": "string"
}
```

**Ответ:**

```json
{
  "valid": true,
  "errors": {}
}
```

или

```json
{
  "valid": false,
  "errors": {
    "email": "Некорректный email",
    "phone": "Некорректный номер телефона"
  }
}
```

## Валидация

### Обязательные поля:

- Все текстовые поля должны быть не пустыми
- Email должен соответствовать стандартному формату
- Телефон должен содержать минимум 10 цифр
- Прикрепленный файл не должен превышать 20 МБ

### Поддерживаемые форматы файлов:

- PDF (.pdf)
- Word документы (.doc, .docx)
- Текстовые файлы (.txt)
- Изображения (.jpg, .jpeg, .png)

## Обработка файлов

1. **Проверка размера:** Максимум 20 МБ
2. **Проверка типа:** Только разрешенные форматы
3. **Сохранение:** Рекомендуется сохранять в облачное хранилище (AWS S3, Google Cloud Storage)
4. **Безопасность:** Проверка на вирусы, сканирование содержимого

## База данных

### Рекомендуемая структура таблицы `client_forms`:

```sql
CREATE TABLE client_forms (
  id VARCHAR(36) PRIMARY KEY,
  company_description TEXT NOT NULL,
  task TEXT NOT NULL,
  solution_vision TEXT NOT NULL,
  expectations TEXT NOT NULL,
  budget TEXT NOT NULL,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(255) NOT NULL,
  attached_file_url VARCHAR(500),
  attached_file_name VARCHAR(255),
  attached_file_size INT,
  status ENUM('new', 'in_progress', 'completed', 'rejected') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Уведомления

После успешной отправки формы рекомендуется:

1. **Email уведомление клиенту** - подтверждение получения заявки
2. **Email уведомление команде** - новая заявка от клиента
3. **Сохранение в CRM** - автоматическое создание лида
4. **Логирование** - запись всех действий для аудита

## Безопасность

1. **Rate limiting** - ограничение количества запросов с одного IP
2. **CSRF защита** - защита от межсайтовых атак
3. **Валидация на сервере** - проверка всех данных
4. **Санитизация** - очистка от потенциально опасного контента
5. **Логирование** - запись всех попыток отправки формы

## Примеры реализации

### Node.js + Express

```javascript
const multer = require('multer')
const upload = multer({
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|txt|jpg|jpeg|png/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    if (extname) {
      return cb(null, true)
    } else {
      cb(new Error('Неподдерживаемый тип файла'))
    }
  },
})

app.post('/api/client-form', upload.single('attachedFile'), async (req, res) => {
  try {
    // Валидация данных
    // Сохранение в базу данных
    // Обработка файла
    // Отправка уведомлений

    res.json({
      success: true,
      clientId: generatedId,
      message: 'Заявка успешно отправлена',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Ошибка сервера',
    })
  }
})
```

### Python + FastAPI

```python
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse

@app.post("/api/client-form")
async def submit_client_form(
    company_description: str = Form(...),
    task: str = Form(...),
    solution_vision: str = Form(...),
    expectations: str = Form(...),
    budget: str = Form(...),
    name: str = Form(...),
    company: str = Form(...),
    phone: str = Form(...),
    email: str = Form(...),
    attached_file: UploadFile = File(None)
):
    try:
        # Валидация данных
        # Сохранение в базу данных
        # Обработка файла

        return JSONResponse({
            "success": True,
            "clientId": generated_id,
            "message": "Заявка успешно отправлена"
        })
    except Exception as e:
        return JSONResponse({
            "success": False,
            "message": "Ошибка сервера"
        }, status_code=500)
```

## Тестирование

Рекомендуется создать unit и integration тесты для:

1. Валидации всех полей
2. Обработки файлов
3. Обработки ошибок
4. Rate limiting
5. Безопасности

## Мониторинг

1. **Метрики:** Количество заявок, время обработки, ошибки
2. **Алерты:** Уведомления о критических ошибках
3. **Логи:** Детальное логирование всех операций
4. **Дашборд:** Визуализация статистики заявок

---

**Примечание:** Данный документ содержит базовые требования. Дополнительные требования могут быть добавлены в зависимости от специфики проекта.
