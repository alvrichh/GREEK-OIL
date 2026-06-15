import puppeteer from 'puppeteer'

const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

const page = await browser.newPage()

// Intercept all network requests to find .glb or model files
const modelUrls = []
page.on('request', req => {
  const url = req.url()
  if (url.includes('.glb') || url.includes('.gltf') || url.includes('model') || url.includes('mesh')) {
    modelUrls.push(url)
  }
})
page.on('response', async res => {
  const url = res.url()
  const ct = res.headers()['content-type'] || ''
  if (ct.includes('model') || ct.includes('octet-stream') || url.includes('.glb') || url.includes('.gltf')) {
    modelUrls.push(`[RESPONSE] ${url} (${ct})`)
  }
})

console.log('→ Loading page and intercepting requests...')
try {
  await page.goto(
    'https://www.3daistudio.com/public/bd1758bd-0f85-4f98-83a5-cb0d64ca122f',
    { waitUntil: 'networkidle0', timeout: 30000 }
  )
} catch {
  console.log('  (timeout)')
}

await new Promise(r => setTimeout(r, 5000))

// Also search page source for any .glb URLs
const glbInSource = await page.evaluate(() => {
  const src = document.documentElement.innerHTML
  const matches = src.match(/https?:\/\/[^\s"'<>]+\.glb[^\s"'<>]*/gi) || []
  return [...new Set(matches)]
})

console.log('\n── Model URLs intercepted ──')
if (modelUrls.length) modelUrls.forEach(u => console.log(' ', u))
else console.log('  none found in network')

console.log('\n── GLB URLs in page source ──')
if (glbInSource.length) glbInSource.forEach(u => console.log(' ', u))
else console.log('  none found in source')

// Check for download buttons
const downloadLinks = await page.evaluate(() =>
  [...document.querySelectorAll('a, button')].map(el => ({
    text: el.textContent.trim().slice(0, 60),
    href: el.href || '',
  })).filter(el => el.text && (el.text.toLowerCase().includes('download') || el.text.toLowerCase().includes('export')))
)

console.log('\n── Download/Export buttons ──')
if (downloadLinks.length) downloadLinks.forEach(l => console.log(`  "${l.text}" → ${l.href}`))
else console.log('  none found')

await browser.close()
