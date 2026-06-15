/**
 * remove-bg.mjs
 * Removes white/near-white background from product images using sharp.
 * Usage: node scripts/remove-bg.mjs
 */
import { readFile, writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')

// Threshold: pixels whiter than this become transparent
const THRESHOLD = 235

async function removeBackground(inputPath, outputPath) {
  const { default: sharp } = await import('sharp')

  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const px = data
  const { width, height, channels } = info

  for (let i = 0; i < px.length; i += channels) {
    const r = px[i]
    const g = px[i + 1]
    const b = px[i + 2]

    const isNearWhite = r > THRESHOLD && g > THRESHOLD && b > THRESHOLD

    if (isNearWhite) {
      // Smooth anti-aliased edge
      const whiteness = Math.min(r, g, b)
      const alpha = Math.round(((255 - whiteness) / (255 - THRESHOLD)) * 255)
      px[i + 3] = Math.min(alpha, px[i + 3])
    }
  }

  await sharp(Buffer.from(px), {
    raw: { width, height, channels },
  })
    .png({ compressionLevel: 9 })
    .toFile(outputPath)

  console.log(`✓  ${outputPath}`)
}

const jobs = [
  {
    input: join(ROOT, 'src/assets/images/farmako-product.jpeg'),
    output: join(ROOT, 'public/assets/images/farmako-product-nobg.png'),
  },
]

for (const { input, output } of jobs) {
  await removeBackground(input, output)
}
