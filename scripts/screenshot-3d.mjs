import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../screenshots')
await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--enable-webgl',
    '--use-gl=swiftshader',
    '--enable-accelerated-2d-canvas',
    '--ignore-gpu-blocklist',
    '--disable-web-security',
  ],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })

console.log('→ fetching 3D AI Studio page...')
try {
  await page.goto(
    'https://www.3daistudio.com/public/bd1758bd-0f85-4f98-83a5-cb0d64ca122f',
    { waitUntil: 'networkidle0', timeout: 40000 }
  )
} catch {
  console.log('  (timeout — continuing)')
}

await new Promise(r => setTimeout(r, 8000))

// Check what's in the canvas
const canvasCount = await page.evaluate(() => document.querySelectorAll('canvas').length)
console.log(`  canvases found: ${canvasCount}`)

await page.screenshot({ path: join(OUT, '3d-model.png'), fullPage: false })
console.log('✓ saved screenshots/3d-model.png')
await browser.close()
