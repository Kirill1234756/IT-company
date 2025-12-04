/**
 * Скрипт для конвертации всех изображений в WebP формат
 * Требуется: npm install -D sharp
 *
 * Использование: node scripts/convert-to-webp.js
 */

import sharp from 'sharp'
import { readdir, mkdir, stat, unlink } from 'fs/promises'
import { join, dirname, extname, basename } from 'path'
import { existsSync } from 'fs'

const INPUT_DIR = 'public/img'
const LOGO_DIR = 'public'
const QUALITY = 85

async function convertToWebp(inputPath, outputPath) {
    try {
        const ext = extname(inputPath).toLowerCase()
        
        // Пропускаем файлы, которые уже в формате webp
        if (ext === '.webp') {
            console.log(`⊘ Skipping (already webp): ${inputPath}`)
            return false
        }

        // Конвертируем в webp
        await sharp(inputPath)
            .webp({ quality: QUALITY })
            .toFile(outputPath)

        console.log(`✓ Converted: ${inputPath} → ${outputPath}`)
        return true
    } catch (error) {
        console.error(`✗ Failed to convert ${inputPath}:`, error.message)
        return false
    }
}

async function processDirectory(dir, baseDir = '') {
    const entries = await readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
        const fullPath = join(dir, entry.name)
        const relativePath = join(baseDir, entry.name)

        if (entry.isDirectory()) {
            await processDirectory(fullPath, relativePath)
        } else if (entry.isFile()) {
            const ext = extname(entry.name).toLowerCase()
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const baseName = basename(entry.name, ext)
                const webpPath = join(dir, `${baseName}.webp`)
                
                // Конвертируем в webp
                const converted = await convertToWebp(fullPath, webpPath)
                
                // Если конвертация успешна, удаляем оригинальный файл
                if (converted) {
                    try {
                        await unlink(fullPath)
                        console.log(`  → Deleted original: ${fullPath}`)
                    } catch (error) {
                        console.warn(`  ⚠ Could not delete original ${fullPath}:`, error.message)
                    }
                }
            }
        }
    }
}

async function processLogos() {
    const logoFiles = ['logo.jpg', 'logo3.png']
    
    for (const logoFile of logoFiles) {
        const logoPath = join(LOGO_DIR, logoFile)
        
        if (existsSync(logoPath)) {
            const ext = extname(logoFile).toLowerCase()
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                const baseName = basename(logoFile, ext)
                const webpPath = join(LOGO_DIR, `${baseName}.webp`)
                
                const converted = await convertToWebp(logoPath, webpPath)
                
                if (converted) {
                    try {
                        await unlink(logoPath)
                        console.log(`  → Deleted original: ${logoPath}`)
                    } catch (error) {
                        console.warn(`  ⚠ Could not delete original ${logoPath}:`, error.message)
                    }
                }
            }
        }
    }
}

async function main() {
    console.log('Starting image conversion to WebP...')
    console.log(`Input directory: ${INPUT_DIR}`)
    console.log(`Logo directory: ${LOGO_DIR}`)
    console.log(`Quality: ${QUALITY}%`)
    console.log('')

    try {
        // Обрабатываем изображения в папке img
        if (existsSync(INPUT_DIR)) {
            await processDirectory(INPUT_DIR)
        } else {
            console.warn(`⚠ Directory ${INPUT_DIR} does not exist`)
        }

        // Обрабатываем логотипы
        await processLogos()

        console.log('')
        console.log('✓ Image conversion to WebP completed!')
        console.log('')
        console.log('⚠ Don\'t forget to update image references in code:')
        console.log('  - Replace .jpg with .webp')
        console.log('  - Replace .png with .webp')
    } catch (error) {
        console.error('✗ Error:', error)
        process.exit(1)
    }
}

main()







