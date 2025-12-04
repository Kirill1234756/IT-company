/**
 * Скрипт для оптимизации изображений
 * Требуется: npm install -D sharp
 *
 * Использование: node scripts/optimize-images.js
 */

import sharp from 'sharp'
import { readdir, mkdir, stat } from 'fs/promises'
import { join, dirname, extname, basename } from 'path'
import { existsSync } from 'fs'

const INPUT_DIR = 'public/img'
const OUTPUT_DIR = 'public/img'
const WIDTHS = [400, 800, 1200]
const QUALITY = 80

async function optimizeImage(inputPath, outputDir) {
    const ext = extname(inputPath).toLowerCase()
    const baseName = basename(inputPath, ext)
    const inputDir = dirname(inputPath)

    // Создаем директорию для выходных файлов
    if (!existsSync(outputDir)) {
        await mkdir(outputDir, { recursive: true })
    }

    const results = []

    try {
        // Генерируем WebP версии
        for (const width of WIDTHS) {
            const webpPath = join(outputDir, `${baseName}-${width}w.webp`)
            await sharp(inputPath)
                .resize(width, null, { withoutEnlargement: true })
                .webp({ quality: QUALITY })
                .toFile(webpPath)
            results.push({ format: 'webp', width, path: webpPath })
        }

        // Генерируем AVIF версии (опционально, для современных браузеров)
        try {
            for (const width of WIDTHS) {
                const avifPath = join(outputDir, `${baseName}-${width}w.avif`)
                await sharp(inputPath)
                    .resize(width, null, { withoutEnlargement: true })
                    .avif({ quality: QUALITY })
                    .toFile(avifPath)
                results.push({ format: 'avif', width, path: avifPath })
            }
        } catch (error) {
            console.warn(`AVIF not supported, skipping: ${error.message}`)
        }

        console.log(`✓ Optimized: ${inputPath} → ${results.length} files`)
        return results
    } catch (error) {
        console.error(`✗ Failed to optimize ${inputPath}:`, error.message)
        return []
    }
}

async function processDirectory(dir) {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = join(dir, entry.name)

        if (entry.isDirectory()) {
            await processDirectory(fullPath)
        } else if (entry.isFile()) {
            const ext = extname(entry.name).toLowerCase()
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                await optimizeImage(fullPath, dir)
            }
        }
    }
}

async function main() {
    console.log('Starting image optimization...')
    console.log(`Input directory: ${INPUT_DIR}`)
    console.log(`Output directory: ${OUTPUT_DIR}`)
    console.log(`Widths: ${WIDTHS.join(', ')}px`)
    console.log(`Quality: ${QUALITY}%`)
    console.log('')

    try {
        await processDirectory(INPUT_DIR)
        console.log('')
        console.log('✓ Image optimization completed!')
    } catch (error) {
        console.error('✗ Error:', error)
        process.exit(1)
    }
}

main()






















