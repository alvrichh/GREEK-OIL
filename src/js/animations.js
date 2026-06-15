import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// ─── HERO ENTRANCE ────────────────────────────────────────
export function initHeroAnimation() {
  // Hero elements have opacity:0 in CSS (fire immediately on load — no flash risk)
  const tl = gsap.timeline({ delay: 0.2 })

  tl.to('.site-header__logo-img', { opacity: 1, duration: 0.9, ease: 'power2.out' })
    .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
    .to('.hero__title',   { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out' }, '-=0.5')
    .to('.hero__divider', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.6')
    .to('.hero__subtitle',{ opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5')
    .to('.hero__cta',     { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    .to('.hero__scroll',  { opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.olive-branch--tl', { opacity: 1, x: 0, y: 0, duration: 1.6, ease: 'power2.out' }, '-=1.2')
    .to('.olive-branch--br', { opacity: 1, x: 0, y: 0, duration: 1.6, ease: 'power2.out' }, '<')
}

// ─── STORY SECTION — letter-by-letter headline ────────────
export function initStoryAnimation() {
  const headlineEl = document.getElementById('story-headline')
  if (!headlineEl) return

  // Split headline into char spans
  const rawHTML = headlineEl.innerHTML
  const lines = rawHTML.split('<br>')
  headlineEl.innerHTML = ''
  const allChars = []

  lines.forEach((line, i) => {
    const text = line.replace(/<[^>]*>/g, '').trim()
    text.split('').forEach(c => {
      if (c === ' ') {
        const s = document.createElement('span')
        s.style.cssText = 'display:inline-block;width:0.3em'
        headlineEl.appendChild(s)
      } else {
        const span = document.createElement('span')
        span.className = 'char'
        span.textContent = c
        headlineEl.appendChild(span)
        allChars.push(span)
      }
    })
    if (i < lines.length - 1) headlineEl.appendChild(document.createElement('br'))
  })

  // Set initial states via GSAP (not CSS) so content is visible if JS/scroll fails
  gsap.set('.story__label',   { opacity: 0, y: 20 })
  gsap.set(allChars,          { opacity: 0, y: 32 })
  gsap.set('.story__divider', { opacity: 0 })
  gsap.set('.story__body',    { opacity: 0, y: 16 })
  gsap.set('.olive-branch--tr', { opacity: 0, x: 40 })

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: '.story',
      start: 'top 70%',
      toggleActions: 'play none none none',
    },
  })

  tl.to('.story__label', { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
    .to(allChars, { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out', stagger: 0.022 }, '-=0.2')
    .to('.story__divider', { opacity: 1, duration: 0.6 }, '-=0.3')
    .to('.story__body', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3')
    .to('.olive-branch--tr', { opacity: 1, x: 0, duration: 1.4, ease: 'power2.out' }, '<-0.5')
}

// ─── FARMAKO REVEAL ───────────────────────────────────────
export function initFarmakoAnimation() {
  // Set initial states via GSAP
  gsap.set('.farmako__label',    { opacity: 0, y: 20 })
  gsap.set('.farmako__title',    { opacity: 0, y: 30 })
  gsap.set('.farmako__subtitle', { opacity: 0, y: 20 })
  gsap.set('#farmako-bottle',    { opacity: 0, y: 70 })
  gsap.set('.farmako__story',    { opacity: 0, x: 40 })

  // Intro text
  ScrollTrigger.create({
    trigger: '.farmako__intro',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.timeline()
        .to('.farmako__label',    { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' })
        .to('.farmako__title',    { opacity: 1, y: 0, duration: 1,   ease: 'power3.out' }, '-=0.3')
        .to('.farmako__subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.4')
    },
  })

  // Bottle rises from below
  ScrollTrigger.create({
    trigger: '#farmako-bottle',
    start: 'top 85%',
    once: true,
    onEnter: () => {
      gsap.to('#farmako-bottle', { opacity: 1, y: 0, duration: 1.4, ease: 'power4.out' })
    },
  })

  // Story text slides in
  ScrollTrigger.create({
    trigger: '.farmako__story',
    start: 'top 82%',
    once: true,
    onEnter: () => {
      gsap.to('.farmako__story', { opacity: 1, x: 0, duration: 1, ease: 'power3.out' })
    },
  })
}

// ─── BENEFITS CARDS ───────────────────────────────────────
export function initBenefitsAnimation() {
  // Set initial states via GSAP
  gsap.set('.benefits__label', { opacity: 0, y: 20 })
  gsap.set('.benefits__title', { opacity: 0, y: 24 })
  gsap.set('.benefits__card',  { opacity: 0, y: 40 })

  ScrollTrigger.create({
    trigger: '.benefits',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.timeline()
        .to('.benefits__label', { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
        .to('.benefits__title', { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out' }, '-=0.3')
        .to('.benefits__card',  { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1 }, '-=0.4')
    },
  })
}

// ─── FLOATING BOTTLE ──────────────────────────────────────
export function initFloatingProduct() {
  const el = document.querySelector('#farmako-bottle img')
  if (!el) return

  gsap.to(el, {
    y: -12,
    duration: 3.8,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })
}

// ─── SCROLL-TRIGGERED FADE-UPS ────────────────────────────
export function initScrollAnimations() {
  gsap.utils.toArray('.fade-up').forEach((el) => {
    gsap.set(el, { opacity: 0, y: 40 })
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.stagger-parent').forEach((parent) => {
    const children = parent.querySelectorAll('.stagger-child')
    if (!children.length) return
    gsap.set(children, { opacity: 0, y: 28 })
    gsap.to(children, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: parent, start: 'top 82%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.slide-left').forEach((el) => {
    gsap.set(el, { opacity: 0, x: -40 })
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    })
  })

  gsap.utils.toArray('.slide-right').forEach((el) => {
    gsap.set(el, { opacity: 0, x: 40 })
    gsap.to(el, {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
    })
  })
}

// ─── STAT COUNTER ─────────────────────────────────────────
export function initCounters() {
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10)
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () {
            el.textContent = Math.round(this.targets()[0].val) + (el.dataset.suffix || '')
          },
        })
      },
    })
  })
}

// ─── PARALLAX HERO BG ─────────────────────────────────────
export function initHeroParallax() {
  const bg = document.querySelector('.hero__bg img, .hero__bg video')
  if (!bg) return

  gsap.to(bg, {
    y: '20%', ease: 'none',
    scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 },
  })

  const storyBg = document.querySelector('.story__bg img')
  if (storyBg) {
    gsap.to(storyBg, {
      y: '15%', ease: 'none',
      scrollTrigger: { trigger: '.story', start: 'top bottom', end: 'bottom top', scrub: 1 },
    })
  }
}

// ─── MOUSE PARALLAX ───────────────────────────────────────
export function initMouseParallax() {
  const hero = document.querySelector('.hero')
  if (!hero) return

  const targets = [
    { el: document.querySelector('.hero__logo'),      depth: 0.012 },
    { el: document.querySelector('.hero__title'),     depth: 0.008 },
    { el: document.querySelector('.olive-branch--tl'),depth: 0.025 },
    { el: document.querySelector('.olive-branch--br'),depth: 0.018 },
  ].filter(t => t.el)

  hero.addEventListener('mousemove', (e) => {
    const dx = e.clientX - window.innerWidth  / 2
    const dy = e.clientY - window.innerHeight / 2
    targets.forEach(({ el, depth }) => {
      gsap.to(el, { x: dx * depth, y: dy * depth, duration: 0.8, ease: 'power1.out', overwrite: 'auto' })
    })
  })

  hero.addEventListener('mouseleave', () => {
    targets.forEach(({ el }) => {
      gsap.to(el, { x: 0, y: 0, duration: 1.2, ease: 'power2.inOut', overwrite: 'auto' })
    })
  })
}

// ─── GALLERY REVEAL ───────────────────────────────────────
export function initGalleryReveal() {
  const items = document.querySelectorAll('.gallery__item')
  if (!items.length) return

  gsap.set(items, { opacity: 0, scale: 0.92 })
  gsap.to(items, {
    opacity: 1, scale: 1, duration: 0.65, ease: 'power2.out',
    stagger: { amount: 0.7, grid: 'auto', from: 'start' },
    scrollTrigger: { trigger: '.gallery__grid', start: 'top 80%', toggleActions: 'play none none none' },
  })
}

// ─── HEADER SCROLL STATE ──────────────────────────────────
export function initHeaderScroll() {
  const header = document.querySelector('.site-header')
  const topbar = document.querySelector('.site-topbar')
  if (!header) return

  ScrollTrigger.create({
    start: 'top -80px',
    end: 99999,
    onUpdate: (self) => {
      header.classList.toggle('scrolled', self.isActive)
      if (topbar) {
        topbar.style.opacity = self.isActive ? '0' : '1'
        topbar.style.pointerEvents = self.isActive ? 'none' : 'all'
      }
    },
  })
}

// ─── SCROLL PROGRESS BAR ──────────────────────────────────
export function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress')
  if (!bar) return

  gsap.to(bar, {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.3 },
  })
}
