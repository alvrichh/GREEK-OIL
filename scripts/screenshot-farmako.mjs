import puppeteer from 'puppeteer'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../screenshots')

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--enable-webgl', '--use-gl=swiftshader', '--ignore-gpu-blocklist'],
})

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })

await page.goto('http://localhost:3000', { waitUntil: 'networkidle2', timeout: 20000 })
await new Promise(r => setTimeout(r, 2000))

// Scroll to farmako
await page.evaluate(() => document.querySelector('#farmako')?.scrollIntoView({ behavior: 'instant' }))
await new Promise(r => setTimeout(r, 4000)) // wait for model-viewer to load

await page.screenshot({ path: join(OUT, 'ours-farmako-3d.png') })
console.log('✓ screenshots/ours-farmako-3d.png')

await browser.close()
