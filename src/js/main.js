import '../scss/main.scss'
import {
  initHeroAnimation,
  initStoryAnimation,
  initFarmakoAnimation,
  initBenefitsAnimation,
  initFloatingProduct,
  initScrollAnimations,
  initCounters,
  initHeroParallax,
  initMouseParallax,
  initGalleryReveal,
  initHeaderScroll,
  initScrollProgress,
} from './animations.js'

// ─── CANVAS: remove white background from logo JPEGs ───────
// Works same-origin (localhost). Threshold 230 = near-white.
function makeLogoTransparent(imgEl) {
  if (!imgEl || !imgEl.complete || imgEl.naturalWidth === 0) return

  const canvas = document.createElement('canvas')
  canvas.width = imgEl.naturalWidth
  canvas.height = imgEl.naturalHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(imgEl, 0, 0)

  try {
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const px = data.data
    const THRESH = 230

    for (let i = 0; i < px.length; i += 4) {
      const r = px[i], g = px[i + 1], b = px[i + 2]
      if (r > THRESH && g > THRESH && b > THRESH) {
        // Partial alpha for anti-aliasing: smoother edge
        const whiteness = Math.min(r, g, b)
        const alpha = Math.round(((255 - whiteness) / (255 - THRESH)) * 255)
        px[i + 3] = Math.min(alpha, px[i + 3])
      }
    }

    ctx.putImageData(data, 0, 0)
    imgEl.src = canvas.toDataURL('image/png')
    imgEl.style.background = 'transparent'
  } catch (e) {
    // Cross-origin block — silently skip
  }
}

function initLogoTransparency() {
  const ids = ['devoo-logo-img', 'footer-logo-img']
  ids.forEach(id => {
    const img = document.getElementById(id)
    if (!img) return

    if (img.complete && img.naturalWidth > 0) {
      makeLogoTransparent(img)
    } else {
      img.addEventListener('load', () => makeLogoTransparent(img), { once: true })
    }
  })

  // Mobile header logo
  const mobileLogoImg = document.querySelector('.site-header__logo-mobile img')
  if (mobileLogoImg) {
    if (mobileLogoImg.complete && mobileLogoImg.naturalWidth > 0) {
      makeLogoTransparent(mobileLogoImg)
    } else {
      mobileLogoImg.addEventListener('load', () => makeLogoTransparent(mobileLogoImg), { once: true })
    }
  }
}

// ─── LOAD CONTENT FROM JSONS ──────────────────────────────
async function loadContent() {
  const [siteRes, productsRes] = await Promise.all([
    fetch('/content/site.json'),
    fetch('/content/products.json'),
  ])
  const site = await siteRes.json()
  const { products } = await productsRes.json()
  return { site, products }
}

// ─── RENDER NAV ───────────────────────────────────────────
function renderNav(navItems) {
  const nav = document.getElementById('main-nav')
  const mobileNav = document.getElementById('mobile-nav')

  const desktopLinks = navItems.map(item => {
    if (item.dropdown) {
      const subLinks = item.dropdown.map(sub =>
        `<a href="${sub.href}">${sub.label}</a>`
      ).join('')
      return `
        <div class="nav-dropdown">
          <span class="nav-dropdown__toggle">
            ${item.label}
            <span class="chevron">▾</span>
          </span>
          <div class="nav-dropdown__menu">${subLinks}</div>
        </div>`
    }
    return `<a href="${item.href}">${item.label}</a>`
  }).join('')

  if (nav) nav.innerHTML = desktopLinks

  // Mobile: flat list including dropdown children
  const mobileLinks = navItems.flatMap(item =>
    item.dropdown
      ? item.dropdown.map(sub => `<a href="${sub.href}">${sub.label}</a>`)
      : [`<a href="${item.href}">${item.label}</a>`]
  ).join('')

  if (mobileNav) {
    const closeBtn = mobileNav.querySelector('#mobile-close')
    mobileNav.innerHTML = mobileLinks
    if (closeBtn) mobileNav.prepend(closeBtn)
  }
}

// ─── RENDER GALLERY ───────────────────────────────────────
function renderGallery(images) {
  const grid = document.getElementById('gallery-grid')
  if (!grid) return

  images.forEach((img) => {
    const item = document.createElement('div')
    item.className = 'gallery__item'
    item.setAttribute('role', 'listitem')
    item.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`
    grid.appendChild(item)
  })
}

// ─── MOBILE MENU ──────────────────────────────────────────
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle')
  const mobileNav = document.getElementById('mobile-nav')
  if (!toggle || !mobileNav) return

  function openMenu() {
    toggle.classList.add('open')
    mobileNav.classList.add('open')
    document.body.style.overflow = 'hidden'
    toggle.setAttribute('aria-expanded', 'true')
  }

  function closeMenu() {
    toggle.classList.remove('open')
    mobileNav.classList.remove('open')
    document.body.style.overflow = ''
    toggle.setAttribute('aria-expanded', 'false')
  }

  toggle.addEventListener('click', () => {
    mobileNav.classList.contains('open') ? closeMenu() : openMenu()
  })

  const closeBtn = document.getElementById('mobile-close')
  if (closeBtn) closeBtn.addEventListener('click', closeMenu)

  mobileNav.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') closeMenu()
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu()
  })
}

// ─── CONTACT FORM ─────────────────────────────────────────
function initContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    const btn = form.querySelector('[type="submit"]')
    const original = btn.textContent
    btn.textContent = 'Sent!'
    btn.disabled = true
    setTimeout(() => {
      btn.textContent = original
      btn.disabled = false
      form.reset()
    }, 3000)
  })
}

// ─── CHAT WIDGET ──────────────────────────────────────────
function initChat() {
  const bubble   = document.getElementById('chat-bubble')
  const panel    = document.getElementById('chat-panel')
  const closeBtn = document.getElementById('chat-close')
  const minBtn   = document.getElementById('chat-minimize')
  const sendBtn  = document.getElementById('chat-send')
  const input    = document.getElementById('chat-input')
  const messages = document.getElementById('chat-messages')
  const quickBtn = document.getElementById('chat-question-btn')
  const badge    = bubble?.querySelector('.chat-widget__badge')

  if (!bubble || !panel) return

  function open() {
    panel.classList.add('open')
    panel.setAttribute('aria-hidden', 'false')
    bubble.setAttribute('aria-expanded', 'true')
    if (badge) badge.style.display = 'none'
    input?.focus()
  }

  function close() {
    panel.classList.remove('open')
    panel.setAttribute('aria-hidden', 'true')
    bubble.setAttribute('aria-expanded', 'false')
  }

  function addMessage(text, who) {
    const msg = document.createElement('div')
    msg.className = `chat-widget__msg chat-widget__msg--${who}`
    msg.innerHTML = `<p>${text}</p>`
    messages.appendChild(msg)
    messages.scrollTop = messages.scrollHeight
  }

  function send() {
    const text = input?.value.trim()
    if (!text) return
    addMessage(text, 'user')
    input.value = ''
    sendBtn.disabled = true
    setTimeout(() => {
      addMessage('Thanks for your message! We\'ll get back to you at greeksuperfoods@yahoo.com as soon as possible.', 'bot')
      sendBtn.disabled = false
    }, 800)
  }

  bubble.addEventListener('click', () =>
    panel.classList.contains('open') ? close() : open()
  )
  if (closeBtn) closeBtn.addEventListener('click', close)
  if (minBtn) minBtn.addEventListener('click', close)
  sendBtn?.addEventListener('click', send)
  input?.addEventListener('keydown', e => { if (e.key === 'Enter') send() })
  quickBtn?.addEventListener('click', () => {
    if (input) {
      input.value = 'I have a question: '
      input.focus()
      // move cursor to end
      const len = input.value.length
      input.setSelectionRange(len, len)
    }
  })
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && panel.classList.contains('open')) close()
  })
}

// ─── SMOOTH SCROLL ────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  })
}

// ─── BOOT ─────────────────────────────────────────────────
async function init() {
  try {
    const { site } = await loadContent()

    renderNav(site.nav)
    if (site.gallery?.images) renderGallery(site.gallery.images)

    initLogoTransparency()
    initMobileMenu()
    initContactForm()
    initSmoothScroll()
    initChat()

    // GSAP — order matters: header/progress first, then sections
    initHeaderScroll()
    initScrollProgress()
    initHeroAnimation()
    initHeroParallax()
    initMouseParallax()
    initStoryAnimation()
    initFarmakoAnimation()
    initBenefitsAnimation()
    initFloatingProduct()
    initScrollAnimations()
    initCounters()
    initGalleryReveal()

  } catch (err) {
    console.error('[DEVOO] Init error:', err)
  }
}

document.addEventListener('DOMContentLoaded', init)
