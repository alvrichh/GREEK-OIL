# DEVOO Imports — Frontend

Premium Mediterranean olive oil landing & ecommerce frontend. Built with Vite + SCSS + Vanilla JS + GSAP.

---

## Stack

| Tool | Purpose |
|------|---------|
| [Vite 5](https://vitejs.dev/) | Dev server & bundler |
| SCSS | Modular styling |
| Vanilla JS (ESM) | No framework overhead |
| [GSAP + ScrollTrigger](https://gsap.com/) | Animations |

---

## Install & Run

```bash
# 1. Install dependencies
npm install

# 2. Start dev server (opens http://localhost:3000)
npm run dev

# 3. Build for production
npm run build

# 4. Preview production build
npm run preview
```

---

## Project Structure

```
src/
├── assets/
│   ├── images/          # Gallery and product images (downloaded from devooimports.com)
│   ├── videos/          # Hero background video (PLACEHOLDER — add hero-bg.mp4 here)
│   ├── logos/           # DEVOO logo files
│   └── documents/       # PDFs, catalogs, etc.
├── content/
│   ├── site.json        # Nav, hero, about, gallery, contact data
│   └── products.json    # Product catalog (name, description, images, etc.)
├── js/
│   ├── main.js          # App entry — loads JSONs, renders DOM, inits everything
│   └── animations.js    # All GSAP animations (hero, scroll, floating, counters)
├── scss/
│   ├── base/
│   │   ├── _variables.scss   # Colors, typography, spacing, breakpoints, shadows
│   │   ├── _reset.scss       # Normalize / CSS reset
│   │   └── _typography.scss  # Heading scale, label, lead, section-title
│   ├── components/
│   │   ├── _buttons.scss     # .btn variants (primary, outline, olive)
│   │   ├── _header.scss      # Sticky nav, hamburger, mobile nav
│   │   └── _cards.scss       # .product-card and .value-card
│   ├── sections/
│   │   ├── _hero.scss        # Full-height hero with video bg placeholder
│   │   ├── _products.scss    # Featured product + product grid
│   │   ├── _about.scss       # Story, values grid, stats counter
│   │   ├── _wholesale.scss   # B2B section with services list
│   │   └── _contact.scss     # Contact form + gallery section
│   └── main.scss             # Root import — loads all partials in order
└── index.html                # Entry point
```

---

## Adding New Assets

### Images
1. Place new `.jpg`/`.webp` files in `src/assets/images/`
2. Reference them in `src/content/site.json` (gallery) or `src/content/products.json` (products)
3. Paths use root-relative format: `"/assets/images/my-image.jpg"`

### Hero Video
1. Add video file to `src/assets/videos/hero-bg.mp4`
2. Uncomment the `<video>` tag in `src/index.html` inside `.hero__video-bg`
3. Remove the `--placeholder` class from `.hero__video-bg`

### Logo variants
Place additional logo files in `src/assets/logos/`.

---

## Modifying Products

Edit `src/content/products.json`. Each product supports:

```json
{
  "id": "unique-id",
  "name": "Product Name",
  "subtitle": "Short subtitle",
  "brand": "Brand Name",
  "category": "olive-oil | olives | herbs | pantry",
  "origin": "Region, Greece",
  "description": "Short description for card",
  "longDescription": "Full description for featured view",
  "benefits": ["Benefit 1", "Benefit 2"],
  "image": "/assets/images/filename.jpeg",
  "imagePlaceholder": "Note about missing image",
  "badge": "Optional badge text",
  "available": true,
  "sizes": [{ "label": "500ml", "note": "Standard" }],
  "priceNote": "Contact for pricing"
}
```

- First product in the array = featured hero product on the page
- Remaining products = grid cards below

---

## Modifying Site Content

Edit `src/content/site.json`:

| Key | Controls |
|-----|---------|
| `brand` | Name, tagline, logo path |
| `hero` | Headline, subheadline, CTA labels |
| `nav` | Navigation links |
| `about` | Company story, values |
| `wholesale` | B2B section copy and services |
| `gallery.images` | Gallery photos array |
| `contact` | Contact details, email, social |

---

## Animations

All GSAP logic lives in `src/js/animations.js`. Each function is imported and called in `main.js`.

| Function | What it does |
|----------|-------------|
| `initHeroAnimation()` | Staggered entrance for hero text |
| `initFloatingProduct()` | Floating effect on featured product image |
| `initScrollAnimations()` | Reveals `.fade-up`, `.slide-left`, `.slide-right` elements |
| `initCounters()` | Animates number counters on `[data-count]` elements |
| `initHeroParallax()` | Parallax scroll on hero background |
| `initGalleryReveal()` | Grid reveal with scale + stagger |
| `initHeaderScroll()` | Adds `.scrolled` class to header after 60px scroll |
| `initScrollProgress()` | Animates the gold progress bar at top of page |

To add a new scroll animation: add `class="fade-up"` (or `slide-left`/`slide-right`) to any HTML element — it will automatically animate in when scrolled into view.

---

## Placeholders Needing Replacement

| Item | Location | Notes |
|------|---------|-------|
| Hero video | `src/assets/videos/hero-bg.mp4` | Uncomment `<video>` in index.html |
| Product images (3 items) | `products.json` non-Farmako entries | No images on public site |
| Contact form backend | `main.js` initContactForm() | Wire up Formspree / EmailJS |
| Pricing info | `products.json` | Not listed on public site |
| OG image | `index.html` og:image tag | Add once hero image confirmed |

---

## Next Steps — Design Refinement

1. **Typography** — fine-tune `clamp()` scales per breakpoint
2. **Hero video** — source or produce a product hero video
3. **Product photography** — real bottle shots for all products
4. **Color polish** — review gold/olive balance in dark sections
5. **Micro-interactions** — enhance hover states, cursor effects
6. **SEO** — add JSON-LD structured data for products
7. **Contact form** — connect to Formspree, EmailJS, or a backend
8. **Recipes section** — the current site has recipes worth adding
9. **Blog** — DEVOO has a blog; could integrate as a simple JSON feed
10. **Performance** — convert images to `.webp`, add `<picture>` fallbacks
