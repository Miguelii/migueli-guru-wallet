/**
 * Converts all non-WebP images in public/assets to WebP format.
 * Deletes the original files after successful conversion.
 *
 * Usage: pnpm convert:webp
 */

import { readdir, unlink } from 'node:fs/promises'
import { join, extname, basename, dirname } from 'node:path'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS_DIR = join(__dirname, '..', 'public', 'assets')
const IMAGE_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.tiff', '.bmp', '.avif'])

async function convertToWebp() {
    const files = await readdir(ASSETS_DIR)

    const imagesToConvert = files.filter((file) => {
        const ext = extname(file).toLowerCase()
        return IMAGE_EXTENSIONS.has(ext)
    })

    if (imagesToConvert.length === 0) {
        console.log('✅ No images to convert — all assets are already WebP.')
        return
    }

    console.log(`🔄 Converting ${imagesToConvert.length} image(s) to WebP...\n`)

    const npxPath = process.execPath.replace(/node$/, 'npx')

    for (const file of imagesToConvert) {
        const inputPath = join(ASSETS_DIR, file)
        const outputName = `${basename(file, extname(file))}.webp`
        const outputPath = join(ASSETS_DIR, outputName)

        try {
            await execFileAsync(npxPath, [
                '--yes',
                'sharp-cli',
                '--input',
                inputPath,
                '--output',
                outputPath,
                '--format',
                'webp',
            ])

            await unlink(inputPath)
            console.log(`  ✅ ${file} → ${outputName}`)
        } catch (error) {
            console.error(`  ❌ Failed to convert ${file}:`, (error as Error).message)
        }
    }

    console.log('\n🎉 Done!')
}

convertToWebp()
