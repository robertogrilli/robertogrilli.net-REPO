// ==========================================================
// PORTFOLIO.JS — Renders portfolio grid from data array
// ==========================================================

export function buildPortfolio(projects) {
  const grid = document.getElementById('portfolio-grid')
  if (!grid) return

  grid.innerHTML = ''

  projects.forEach(proj => {
    if (proj.active) {
      grid.appendChild(createActiveCard(proj))
    } else {
      grid.appendChild(createPlaceholderCard(proj))
    }
  })
}

// ==========================================================
// ACTIVE PROJECT CARD
// ==========================================================
function createActiveCard(proj) {
  const article = document.createElement('article')
  article.className = 'proj-card proj-card--active'
  article.setAttribute('tabindex', '0')
  article.setAttribute('aria-label', proj.name)

  // Image — placeholder or real
  const isRealImage = proj.image && !proj.image.startsWith('[DA')

  if (isRealImage) {
    const img = document.createElement('img')
    img.src = proj.image
    img.alt = proj.name
    img.className = 'proj-img'
    img.loading = 'lazy'
    article.appendChild(img)
  } else {
    // Placeholder image area
    const placeholder = document.createElement('div')
    placeholder.className = 'proj-img proj-img--placeholder'
    placeholder.style.cssText = `
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      background: rgba(245,242,236,0.04);
    `
    placeholder.innerHTML = `
      <span style="font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(191,164,106,0.5);font-family:'DM Sans',sans-serif;">FOTO DA INSERIRE</span>
      <span style="font-size:0.75rem;font-style:italic;color:rgba(245,242,236,0.25);font-family:'Cormorant Garamond',serif;">${proj.name}</span>
    `
    article.appendChild(placeholder)

    // Add a comment to the DOM as data attribute for reference
    article.dataset.photoComment = `[DA INSERIRE — screenshot del sito oppure foto del locale: ${proj.name}]`
  }

  // Overlay
  const overlay = document.createElement('div')
  overlay.className = 'proj-overlay'
  overlay.innerHTML = `
    <h3 class="proj-name">${proj.name}</h3>
    <p class="proj-desc">${proj.description}</p>
    <a href="${proj.url}" class="proj-link" target="_blank" rel="noopener" tabindex="-1">
      Vedi il sito →
    </a>
  `
  article.appendChild(overlay)

  // Keyboard accessibility
  article.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      window.open(proj.url, '_blank', 'noopener')
    }
  })

  return article
}

// ==========================================================
// PLACEHOLDER CARD
// ==========================================================
function createPlaceholderCard(proj) {
  const article = document.createElement('article')
  article.className = 'proj-card proj-card--placeholder'
  article.setAttribute('aria-hidden', 'true')

  // Animated dashed SVG border
  const svgNS = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(svgNS, 'svg')
  svg.setAttribute('class', 'dashed-border')
  svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;'

  const rect = document.createElementNS(svgNS, 'rect')
  rect.setAttribute('x', '2')
  rect.setAttribute('y', '2')
  rect.setAttribute('width', 'calc(100% - 4px)')
  rect.setAttribute('height', 'calc(100% - 4px)')
  rect.setAttribute('rx', '4')
  rect.setAttribute('fill', 'none')
  rect.setAttribute('stroke', 'rgba(245,242,236,0.12)')
  rect.setAttribute('stroke-width', '1.5')
  rect.setAttribute('stroke-dasharray', '8 4')
  svg.appendChild(rect)
  article.appendChild(svg)

  // Text content
  const textWrap = document.createElement('div')
  textWrap.style.cssText = 'position:relative;z-index:1;text-align:center;'
  textWrap.innerHTML = `
    <span class="proj-placeholder-text">Prossimo progetto</span>
    <span class="proj-placeholder-year">2025 →</span>
  `
  article.appendChild(textWrap)

  return article
}
