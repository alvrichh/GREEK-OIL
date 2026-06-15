import puppeteer from 'puppeteer'
import { mkdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '../screenshots')
await mkdir(OUT, { recursive: true })

const browser = await puppeteer.launch({
  headless: true,
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

async function shot(url, name, waitMs = 3000) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
  console.log(`→ ${url}`)
  try {
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 })
  } catch {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
  }
  await new Promise(r => setTimeout(r, waitMs))

  // Full page
  await page.screenshot({ path: join(OUT, `${name}-full.png`), fullPage: true })
  // Above the fold only
  await page.screenshot({ path: join(OUT, `${name}-hero.png`), fullPage: false })

  // Scroll and capture each major section
  const sections = ['#hero','#story','#farmako','#benefits','#about','#gallery','#contact']
  for (const sel of sections) {
    try {
      await page.evaluate((s) => {
        const el = document.querySelector(s)
        if (el) el.scrollIntoView({ behavior: 'instant' })
      }, sel)
      await new Promise(r => setTimeout(r, 600))
      await page.screenshot({ path: join(OUT, `${name}-${sel.replace('#','')}.png`) })
    } catch {}
  }

  console.log(`✓ ${name}`)
  await page.close()
}

await shot('https://devooimports.com/', 'real')
await shot('http://localhost:3000', 'ours', 2000)

await browser.close()
console.log(`\nScreenshots saved to: ${OUT}`)
