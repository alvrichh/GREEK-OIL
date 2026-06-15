import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../screenshots/real-site')
await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

console.log('→ Loading devooimports.com...')
try {
  await page.goto('https://devooimports.com/', { waitUntil: 'networkidle2', timeout: 30000 })
} catch {
  await page.goto('https://devooimports.com/', { waitUntil: 'domcontentloaded', timeout: 30000 })
}
await new Promise(r => setTimeout(r, 3000))

// Full page
await page.screenshot({ path: join(OUT, '00-full.png'), fullPage: true })
console.log('✓ full page')

// Scroll through sections
const pageHeight = await page.evaluate(() => document.body.scrollHeight)
const viewH = 900
const steps = Math.ceil(pageHeight / viewH)

for (let i = 0; i < steps; i++) {
  await page.evaluate((y) => window.scrollTo(0, y), i * viewH)
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: join(OUT, `${String(i+1).padStart(2,'0')}-scroll-${i*viewH}.png`) })
  console.log(`✓ scroll ${i*viewH}px`)
}

// Also visit Farmako page
await page.goto('https://devooimports.com/farmako-olive-oil', { waitUntil: 'networkidle2', timeout: 20000 })
await new Promise(r => setTimeout(r, 2000))
await page.screenshot({ path: join(OUT, 'farmako-page-top.png') })
await page.screenshot({ path: join(OUT, 'farmako-page-full.png'), fullPage: true })
console.log('✓ farmako page')

await browser.close()
console.log(`\nAll saved to: ${OUT}`)
