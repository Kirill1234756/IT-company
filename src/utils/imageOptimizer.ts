/**
 * Утилита для оптимизации изображений с поддержкой srcset и WebP/AVIF
 */

export interface ImageSrcSet {
    src: string
    srcset?: string
    sizes?: string
    width: number
    height: number
    loading?: 'lazy' | 'eager'
    decoding?: 'async' | 'sync' | 'auto'
    fetchpriority?: 'high' | 'low' | 'auto'
}

/**
 * Генерирует srcset для изображения с разными размерами
 * @param basePath - базовый путь к изображению (без расширения)
 * @param widths - массив ширин для генерации srcset
 * @param format - формат изображения (webp, avif, jpg, png)
 * @param originalPath - оригинальный путь к изображению (для fallback)
 * @returns строка srcset
 */
export function generateSrcSet(
    basePath: string,
    widths: number[],
    format: 'webp' | 'avif' | 'jpg' | 'png' = 'webp',
    originalPath?: string
): string {
    const ext = format === 'jpg' ? 'jpg' : format === 'png' ? 'png' : format

    // Если есть оптимизированные версии, используем их
    // Иначе используем оригинальный файл для всех размеров
    if (originalPath && !originalPath.includes('-400w') && !originalPath.includes('-800w')) {
        // Используем оригинальный файл для всех размеров (браузер сам выберет нужный)
        return widths.map((width) => `${originalPath} ${width}w`).join(', ')
    }

    return widths.map((width) => `${basePath}-${width}w.${ext} ${width}w`).join(', ')
}

/**
 * Генерирует sizes атрибут для responsive images
 * @param breakpoints - объект с breakpoints и размерами
 * @returns строка sizes
 */
export function generateSizes(breakpoints?: {
    mobile?: string
    tablet?: string
    desktop?: string
}): string {
    if (!breakpoints) {
        return '100vw'
    }

    const parts: string[] = []
    if (breakpoints.mobile) {
        parts.push(`(max-width: 768px) ${breakpoints.mobile}`)
    }
    if (breakpoints.tablet) {
        parts.push(`(max-width: 1200px) ${breakpoints.tablet}`)
    }
    if (breakpoints.desktop) {
        parts.push(breakpoints.desktop)
    }

    return parts.length > 0 ? parts.join(', ') : '100vw'
}

/**
 * Создает оптимизированный объект для тега <img> с поддержкой srcset
 * @param imagePath - путь к изображению
 * @param options - опции для оптимизации
 * @returns объект с атрибутами для <img>
 */
export function createOptimizedImage(
    imagePath: string,
    options: {
        width: number
        height: number
        widths?: number[]
        format?: 'webp' | 'avif' | 'jpg' | 'png'
        sizes?: {
            mobile?: string
            tablet?: string
            desktop?: string
        }
        loading?: 'lazy' | 'eager'
        decoding?: 'async' | 'sync' | 'auto'
        fetchpriority?: 'high' | 'low' | 'auto'
        alt: string
    }
): ImageSrcSet {
    const {
        width,
        height,
        widths = [400, 800, 1200],
        sizes,
        loading = 'lazy',
        decoding = 'async',
        fetchpriority = 'low',
    } = options

    // Генерируем srcset - используем оригинальный файл для всех размеров
    // (браузер сам выберет нужный размер на основе sizes атрибута)
    const originalSrcSet = widths.map((width) => `${imagePath} ${width}w`).join(', ')

    // Генерируем sizes
    const sizesAttr = generateSizes(sizes)

    return {
        src: imagePath, // Fallback для старых браузеров
        srcset: originalSrcSet, // Используем оригинальный файл для всех размеров
        sizes: sizesAttr,
        width,
        height,
        loading,
        decoding,
        fetchpriority,
    }
}

/**
 * Проверяет поддержку WebP в браузере
 */
export function supportsWebP(): boolean {
    if (typeof window === 'undefined') return false

    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Проверяет поддержку AVIF в браузере
 */
export function supportsAVIF(): Promise<boolean> {
    return new Promise((resolve) => {
        if (typeof window === 'undefined') {
            resolve(false)
            return
        }

        const avif = new Image()
        avif.onload = avif.onerror = () => {
            resolve(avif.height === 2)
        }
        avif.src =
            'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A='
    })
}











