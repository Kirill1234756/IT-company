/**
 * Утилита для условного логирования
 * Логи выводятся только в режиме разработки
 * В продакшене все методы являются no-op (ничего не делают)
 */

const isDev = import.meta.env.MODE === 'development'

// No-op функции для продакшена (не выполняют никаких действий)
const noop = () => { }

export const logger = {
  log: isDev ? (...args: unknown[]) => console.log(...args) : noop,
  warn: isDev ? (...args: unknown[]) => console.warn(...args) : noop,
  error: (...args: unknown[]) => {
    // Ошибки всегда логируем, даже в продакшене
    console.error(...args)
  },
  info: isDev ? (...args: unknown[]) => console.info(...args) : noop,
  debug: isDev ? (...args: unknown[]) => console.debug(...args) : noop,
}

