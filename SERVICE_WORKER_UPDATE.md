# Обновление Service Worker

## Проблема

Service Worker мог кешировать старые запросы к Supabase, что вызывало ошибки после миграции на Node.js бекенд.

## Решение

Service Worker был обновлен:
1. ✅ Версия увеличена до `2.2.0` - это заставит браузер переустановить Service Worker
2. ✅ Добавлен паттерн для исключения Supabase из кеша: `/supabase\.co/`
3. ✅ Улучшено логирование при удалении старых кешей

## Как применить обновление

### Автоматически (рекомендуется)
1. Закройте все вкладки с сайтом
2. Откройте DevTools (`F12`)
3. Перейдите на вкладку "Application" → "Service Workers"
4. Нажмите "Unregister" для старого Service Worker
5. Обновите страницу (`Ctrl + Shift + R`)

### Вручную
1. Откройте DevTools (`F12`)
2. Перейдите на вкладку "Application"
3. В левом меню найдите "Storage"
4. Нажмите "Clear site data"
5. Обновите страницу

### Через консоль
Выполните в консоли браузера:
```javascript
navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
        registration.unregister()
    }
})
```

Затем обновите страницу (`Ctrl + Shift + R`).

## Проверка

После обновления проверьте:
1. ✅ В DevTools → Application → Service Workers видна новая версия `2.2.0`
2. ✅ В консоли нет ошибок о Supabase
3. ✅ Network tab показывает запросы к `localhost:3000/api`
4. ✅ Формы работают корректно













