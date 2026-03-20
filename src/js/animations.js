// ==========================================================
// ANIMATIONS.JS — All ScrollTrigger & GSAP site animations
// ==========================================================

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const isMobile = window.innerWidth < 768

// ==========================================================
// MAIN INIT
// ==========================================================
export function initAnimations(reduced) {
  if (reduced) {
    initReducedMotion()
    return
  }

  initHeroAnimations()
  initConnessioneAnimations()
  initDoloreAnimations()
  initProcessoAnimations()
  initPortfolioAnimations()
  initChiSonoAnimations()
  initCtaAnimations()
  initScrollArrow()
  if (!isMobile) initMagneticButtons() // skip heavy mouse tracking on mobile
  initNavbarOnScroll()
}

// ==========================================================
// REDUCED MOTION — simple fades only
// ==========================================================
function initReducedMotion() {
  // Show navbar
  gsap.set('#navbar', { y: 0, opacity: 1 })

  // Fade in everything that has animation states
  const els = document.querySelectorAll(
    '.hero-line, .title-line, [data-scroll-reveal], .eyebrow, .hero-subtitle, .pain-card, .step .step-content, .connessione-photos, .chi-sono-photo-inner'
  )

  els.forEach(el => {
    gsap.set(el, { opacity: 0 })
    ScrollTrigger.create({
      trigger: el,
      start: 'top 90%',
      onEnter: () => gsap.to(el, { opacity: 1, duration: 0.2 }),
    })
  })

  // Pain cards
  document.querySelectorAll('.pain-card').forEach(card => {
    gsap.set(card, { clipPath: 'none', opacity: 0 })
    ScrollTrigger.create({
      trigger: card,
      start: 'top 90%',
      onEnter: () => gsap.to(card, { opacity: 1, duration: 0.2 }),
    })
  })
}

// ==========================================================
// HERO ANIMATIONS
// ==========================================================
function initHeroAnimations() {
  const heroLines = document.querySelectorAll('.hero-line[data-hero-line]')
  const eyebrowChars = document.querySelectorAll('.hero-content .eyebrow .char')
  const subtitleWords = document.querySelectorAll('.hero-subtitle .word')
  const ctaPrimary = document.getElementById('hero-cta-primary')
  const ctaSecondary = document.getElementById('hero-cta-secondary')

  const tl = gsap.timeline({ delay: 0.15 })

  // Eyebrow chars
  if (eyebrowChars.length) {
    gsap.set(eyebrowChars, { opacity: 0, y: 8 })
    tl.to(eyebrowChars, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.02,
      ease: 'power2.out',
    }, 0)
  }

  // Title lines
  if (heroLines.length) {
    tl.to(heroLines, {
      y: '0%',
      duration: 0.9,
      stagger: 0.18,
      ease: 'power3.out',
    }, 0.2)
  }

  // Subtitle words
  if (subtitleWords.length) {
    gsap.set(subtitleWords, { opacity: 0, y: 12 })
    tl.to(subtitleWords, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.025,
      ease: 'power2.out',
    }, 1.0)
  } else {
    // Fallback if splitting didn't run on subtitle
    const subtitle = document.querySelector('.hero-subtitle')
    if (subtitle) {
      gsap.set(subtitle, { opacity: 0, y: 12 })
      tl.to(subtitle, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }, 1.0)
    }
  }

  // CTAs
  if (ctaPrimary) {
    gsap.set(ctaPrimary, { scale: 0.85, opacity: 0 })
    tl.to(ctaPrimary, { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.7)' }, 1.4)
  }

  if (ctaSecondary) {
    gsap.set(ctaSecondary, { opacity: 0 })
    tl.to(ctaSecondary, { opacity: 1, duration: 0.5, ease: 'power2.out' }, 1.6)
  }
}

// ==========================================================
// CONNESSIONE ANIMATIONS
// ==========================================================
function initConnessioneAnimations() {
  const section = document.getElementById('connessione')
  if (!section) return

  // Eyebrow
  animateEyebrow(section.querySelector('.eyebrow'))

  // Title lines
  animateTitleLines(section.querySelectorAll('.title-line[data-title-line]'), section)

  // Body paragraphs
  section.querySelectorAll('[data-scroll-reveal]').forEach((el, i) => {
    if (el.classList.contains('stat-block')) return
    onScrollEnter(el, () => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.1 })
    })
  })

  // Photos fan-out
  const photos = section.querySelectorAll('[data-photo-card]')
  if (photos.length) {
    gsap.set(photos, { opacity: 0, rotation: 0, x: 0, y: 0 })
    onScrollEnter(section.querySelector('.connessione-photos'), () => {
      gsap.to(photos[0], { opacity: 1, rotation: -3, duration: 0.9, ease: 'power2.out', delay: 0 })
      gsap.to(photos[1], { opacity: 1, rotation: 2, y: -20, duration: 0.9, ease: 'power2.out', delay: 0.15 })
      gsap.to(photos[2], { opacity: 1, rotation: -1, y: -40, duration: 0.9, ease: 'power2.out', delay: 0.3 })
    })
  }

  // Counter: 0 → 78
  const counterEl = document.getElementById('stat-counter-78')
  const statBlock = section.querySelector('.stat-block')
  if (counterEl && statBlock) {
    let counted = false
    onScrollEnter(statBlock, () => {
      if (counted) return
      counted = true
      gsap.to(statBlock, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
      animateCounter(counterEl, 0, 78, 1800)
    })
  }
}

function animateCounter(el, from, to, duration) {
  const startTime = performance.now()

  function update(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    // easeOut cubic
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = Math.round(from + (to - from) * eased)
    if (progress < 1) requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}

// ==========================================================
// DOLORE ANIMATIONS
// ==========================================================
function initDoloreAnimations() {
  const section = document.getElementById('dolore')
  if (!section) return

  animateEyebrow(section.querySelector('.eyebrow'))
  animateTitleLines(section.querySelectorAll('.title-line[data-title-line]'), section)

  // Pain cards: clip-path reveal (desktop) / fade+slide (mobile)
  const cards = section.querySelectorAll('[data-pain-card]')
  cards.forEach((card, i) => {
    if (isMobile) {
      gsap.set(card, { clipPath: 'none', opacity: 0, y: 24 })
    }
    ScrollTrigger.create({
      trigger: card,
      start: 'top 88%',
      onEnter: () => {
        if (isMobile) {
          gsap.to(card, { opacity: 1, y: 0, duration: 0.6, delay: i * 0.12, ease: 'power2.out' })
        } else {
          gsap.to(card, {
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.8,
            delay: i * 0.2,
            ease: 'power2.out',
          })
        }
      },
      once: true,
    })

    // Hover: scale + shadow
    card.addEventListener('mouseenter', () => {
      gsap.to(card, { scale: 1.02, boxShadow: '0 8px 32px rgba(13,13,13,0.15)', duration: 0.3, ease: 'power2.out' })
    })
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { scale: 1, boxShadow: '0 2px 16px rgba(13,13,13,0.08)', duration: 0.3, ease: 'power2.out' })
    })
  })
}

// ==========================================================
// PROCESSO ANIMATIONS
// ==========================================================
function initProcessoAnimations() {
  const section = document.getElementById('come-funziona')
  if (!section) return

  animateEyebrow(section.querySelector('.eyebrow'))
  animateTitleLines(section.querySelectorAll('.title-line[data-title-line]'), section)

  // Step content reveals
  const steps = section.querySelectorAll('.step')
  steps.forEach((step, i) => {
    const content = step.querySelector('.step-content')
    if (!content) return
    gsap.set(content, { opacity: 0, x: -16 })
    onScrollEnter(step, () => {
      gsap.to(content, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.08 })
    })
  })

  // Pricing note
  const pricing = section.querySelector('.pricing-note')
  if (pricing) {
    onScrollEnter(pricing, () => gsap.to(pricing, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }))
  }

  // SVG connecting line — scrub
  const linePath = document.getElementById('steps-line-path')
  if (linePath && steps.length) {
    const stepsWrapper = section.querySelector('.steps-wrapper')
    const totalLength = 600

    gsap.set(linePath, { strokeDashoffset: totalLength })
    ScrollTrigger.create({
      trigger: stepsWrapper,
      start: 'top 70%',
      end: 'bottom 70%',
      scrub: 1,
      onUpdate: self => {
        const remaining = totalLength * (1 - self.progress)
        gsap.set(linePath, { strokeDashoffset: remaining })
      },
    })
  }
}

// ==========================================================
// PORTFOLIO ANIMATIONS
// ==========================================================
export function initPortfolioAnimations() {
  const section = document.getElementById('portfolio')
  if (!section) return

  animateEyebrow(section.querySelector('.eyebrow'))
  animateTitleLines(section.querySelectorAll('.title-line[data-title-line]'), section)

  // Active cards: grayscale + overlay reveal on hover
  const activeCards = section.querySelectorAll('.proj-card--active')
  activeCards.forEach((card, i) => {
    const img = card.querySelector('.proj-img')
    const overlay = card.querySelector('.proj-overlay')

    // Entrance animation
    gsap.set(card, { opacity: 0, y: 30 })
    onScrollEnter(card, () => {
      gsap.to(card, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.1 })
    })

    if (!img || !overlay) return

    // Hover: reveal overlay + color
    card.addEventListener('mouseenter', () => {
      gsap.to(img, { filter: 'grayscale(0)', duration: 0.4, ease: 'power2.out' })
      gsap.to(overlay, { y: '0%', opacity: 1, duration: 0.4, ease: 'power2.out' })
      gsap.to(card, { scale: 1.02, duration: 0.3 })
    })

    card.addEventListener('mouseleave', () => {
      gsap.to(img, { filter: 'grayscale(1)', duration: 0.5, ease: 'power2.inOut' })
      gsap.to(overlay, { y: '100%', duration: 0.4, ease: 'power2.in' })
      gsap.to(card, { scale: 1, duration: 0.3 })
    })

    // Initial states
    gsap.set(overlay, { y: '100%', opacity: 0 })
    gsap.set(img, { filter: 'grayscale(1)' })
  })

  // Placeholder cards: pulse animation
  const placeholders = section.querySelectorAll('.proj-card--placeholder')
  placeholders.forEach((card, i) => {
    gsap.set(card, { opacity: 0 })
    onScrollEnter(card, () => {
      gsap.to(card, { opacity: 1, duration: 0.6, delay: (activeCards.length + i) * 0.08 })
    })
    // Pulse
    gsap.to(card, {
      opacity: 0.55,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      delay: i * 0.5,
    })
  })
}

// ==========================================================
// CHI SONO ANIMATIONS
// ==========================================================
function initChiSonoAnimations() {
  const section = document.getElementById('chi-sono')
  if (!section) return

  animateEyebrow(section.querySelector('.eyebrow'))
  animateTitleLines(section.querySelectorAll('.title-line[data-title-line]'), section)

  // Body paragraphs
  section.querySelectorAll('[data-scroll-reveal]').forEach((el, i) => {
    onScrollEnter(el, () => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', delay: i * 0.1 })
    })
  })

  // Photo reveal: clip-path circle (desktop) / fade (mobile)
  const photoEl = document.getElementById('chi-sono-photo-el')
  if (photoEl) {
    if (isMobile) {
      gsap.set(photoEl, { clipPath: 'none', opacity: 0 })
    }
    onScrollEnter(photoEl, () => {
      if (isMobile) {
        gsap.to(photoEl, { opacity: 1, duration: 0.8, ease: 'power2.out' })
      } else {
        gsap.to(photoEl, { clipPath: 'circle(75% at 50% 50%)', duration: 1, ease: 'power2.out' })
      }
    })

    // Parallax only on desktop
    if (!isMobile) {
      ScrollTrigger.create({
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: self => {
          gsap.set(photoEl, { y: self.progress * -40 })
        },
      })
    }
  }

  // Stats row counters
  const statNums = section.querySelectorAll('[data-counter-num]')
  statNums.forEach(el => {
    const target = parseInt(el.dataset.counterNum)
    const prefix = el.dataset.counterPrefix || ''
    const suffix = el.dataset.counterSuffix || ''
    let counted = false
    if (isNaN(target)) return
    onScrollEnter(el, () => {
      if (counted) return
      counted = true
      animateCounter2(el, 0, target, 1500, prefix, suffix)
    })
  })
}

function animateCounter2(el, from, to, duration, prefix = '', suffix = '') {
  const startTime = performance.now()

  function update(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    el.textContent = prefix + Math.round(from + (to - from) * eased) + suffix
    if (progress < 1) requestAnimationFrame(update)
  }

  requestAnimationFrame(update)
}

// ==========================================================
// CTA ANIMATIONS
// ==========================================================
function initCtaAnimations() {
  const section = document.getElementById('cta-finale')
  if (!section) return

  animateTitleLines(section.querySelectorAll('.title-line[data-title-line]'), section)

  const subtitle = section.querySelector('[data-scroll-reveal]')
  if (subtitle) {
    onScrollEnter(subtitle, () => gsap.to(subtitle, { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' }))
  }

  // CTA button entrance
  const ctaBtn = document.getElementById('cta-wa-btn')
  if (ctaBtn) {
    gsap.set(ctaBtn, { scale: 0.85, opacity: 0 })
    ScrollTrigger.create({
      trigger: ctaBtn,
      start: 'top 90%',
      onEnter: () => {
        gsap.to(ctaBtn, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.5)' })
      },
      once: true,
    })

    // Pulse shadow
    gsap.to(ctaBtn, {
      boxShadow: '0 0 0 16px rgba(196,98,45,0)',
      duration: 3,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
      delay: 2,
    })
  }

  // Decorative "48" rotates with scroll
  const bgNum = section.querySelector('.cta-bg-number')
  if (bgNum) {
    ScrollTrigger.create({
      trigger: section,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 2,
      onUpdate: self => {
        gsap.set(bgNum, { rotation: self.progress * 5 })
      },
    })
  }
}

// ==========================================================
// SCROLL ARROW BOUNCE
// ==========================================================
function initScrollArrow() {
  const arrow = document.getElementById('scroll-arrow')
  if (!arrow) return

  gsap.to(arrow, {
    y: 8,
    duration: 1.2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })

  // Hide when scrolled past hero
  ScrollTrigger.create({
    trigger: '#hero',
    start: 'bottom 80%',
    onEnter: () => gsap.to(arrow.parentElement, { opacity: 0, duration: 0.4 }),
    onLeaveBack: () => gsap.to(arrow.parentElement, { opacity: 1, duration: 0.4 }),
  })
}

// ==========================================================
// MAGNETIC BUTTONS
// ==========================================================
function initMagneticButtons() {
  const btns = document.querySelectorAll('.magnetic-btn')

  btns.forEach(btn => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3.out' })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3.out' })

    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * 0.35
      const dy = (e.clientY - cy) * 0.35
      xTo(Math.max(-10, Math.min(10, dx)))
      yTo(Math.max(-10, Math.min(10, dy)))
    })

    btn.addEventListener('mouseleave', () => {
      xTo(0)
      yTo(0)
    })
  })
}

// ==========================================================
// NAVBAR SCROLL BEHAVIOR
// ==========================================================
function initNavbarOnScroll() {
  const navbar = document.getElementById('navbar')
  if (!navbar) return

  ScrollTrigger.create({
    start: 'top -60px',
    onUpdate: self => {
      if (self.direction === -1) {
        // Scrolling up — ensure visible
        gsap.to(navbar, { y: 0, duration: 0.3, ease: 'power2.out' })
      }
    },
  })
}

// ==========================================================
// REUSABLE HELPERS
// ==========================================================
function animateEyebrow(eyebrow) {
  if (!eyebrow) return
  const chars = eyebrow.querySelectorAll('.char')
  if (!chars.length) {
    gsap.set(eyebrow, { opacity: 0 })
    onScrollEnter(eyebrow, () => gsap.to(eyebrow, { opacity: 1, duration: 0.5 }))
    return
  }
  gsap.set(chars, { opacity: 0, y: 6 })
  onScrollEnter(eyebrow, () => {
    gsap.to(chars, { opacity: 1, y: 0, duration: 0.4, stagger: 0.015, ease: 'power2.out' })
  })
}

function animateTitleLines(lines, trigger) {
  if (!lines || !lines.length) return
  onScrollEnter(trigger || lines[0], () => {
    gsap.to(lines, { y: '0%', duration: 0.85, stagger: 0.14, ease: 'power3.out' })
  })
}

// Safe ScrollTrigger wrapper: fires onEnter at 95% viewport,
// AND fires immediately if element is already in view at init time.
function onScrollEnter(trigger, callback) {
  let fired = false
  const fire = () => { if (!fired) { fired = true; callback() } }

  ScrollTrigger.create({
    trigger,
    start: 'top 95%',
    onEnter: fire,
    once: true,
  })

  // Fallback: if element is already visible when page loads, animate it
  const rect = trigger.getBoundingClientRect()
  if (rect.top < window.innerHeight * 0.95) {
    gsap.delayedCall(0.1, fire)
  }
}
