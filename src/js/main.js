// ==========================================================
// MAIN.JS — Entry point, orchestrates all modules
// ==========================================================

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TextPlugin } from 'gsap/TextPlugin'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Splitting from 'splitting'

import { initIntro } from './intro.js'
import { initAnimations } from './animations.js'
import { buildPortfolio } from './portfolio.js'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin, ScrollToPlugin)

// iOS Safari fix: normalizeScroll prevents elastic scroll breaking ScrollTrigger
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
              (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
if (isIOS) {
  ScrollTrigger.normalizeScroll(true)
}

// Refresh ScrollTrigger after fonts/layout settle — critical on mobile
window.addEventListener('load', () => {
  setTimeout(() => ScrollTrigger.refresh(), 400)
})

// ==========================================================
// PROJECT DATA — edit this array to update portfolio
// ==========================================================
export const projects = [
  {
    id: 1,
    name: 'Sicché — Roba Toscana',
    description: 'Street food toscano · Testaccio, Roma',
    url: '[DA INSERIRE — URL del sito live]',
    image: '[DA INSERIRE — screenshot del sito oppure foto del locale]',
    active: true,
  },
  {
    id: 2,
    name: 'Da Oio a Casa Mia',
    description: 'Trattoria romana dal 1994 · Testaccio, Roma',
    url: '[DA INSERIRE — URL del sito live]',
    image: '[DA INSERIRE — screenshot del sito oppure foto del locale]',
    active: true,
  },
  { id: 3, active: false },
  { id: 4, active: false },
  { id: 5, active: false },
]

// ==========================================================
// BOOT
// ==========================================================
function boot() {
  // Build portfolio from data before animations init
  buildPortfolio(projects)

  // Run Splitting on all data-splitting elements
  Splitting({ target: '[data-splitting]', by: 'chars' })

  // Check reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReduced) {
    // Skip intro, show everything immediately
    skipToSite(false)
    initAnimations(true)
    return
  }

  // Check session storage — skip intro on return visits
  const introSeen = sessionStorage.getItem('introSeen')
  if (introSeen) {
    skipToSite(true)
    initAnimations(false)
    return
  }

  // Play full intro
  document.body.classList.add('intro-active')
  initIntro(() => {
    // Callback when intro finishes
    document.body.classList.remove('intro-active')
    sessionStorage.setItem('introSeen', '1')
    initAnimations(false)
  })
}

function skipToSite(instant) {
  const overlay = document.getElementById('intro-overlay')
  if (overlay) overlay.remove()

  const navbar = document.getElementById('navbar')

  if (instant) {
    gsap.set(navbar, { y: 0, opacity: 1 })
  } else {
    gsap.to(navbar, { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' })
  }
}

// ==========================================================
// SMOOTH SCROLL for anchor links
// ==========================================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'))
      if (!target) return
      e.preventDefault()
      gsap.to(window, {
        duration: 1.2,
        scrollTo: { y: target, offsetY: 80 },
        ease: 'power3.inOut',
      })
      // Close mobile menu if open
      const mobileMenu = document.getElementById('mobile-menu')
      if (mobileMenu.classList.contains('is-open')) {
        closeMobileMenu()
      }
    })
  })
}

// ==========================================================
// MOBILE MENU
// ==========================================================
let mobileMenuOpen = false
let mobileMenuTl = null

function openMobileMenu() {
  mobileMenuOpen = true
  const menu = document.getElementById('mobile-menu')
  const links = menu.querySelectorAll('.mobile-link')
  const hamburger = document.getElementById('nav-hamburger')

  menu.classList.add('is-open')
  hamburger.setAttribute('aria-expanded', 'true')
  document.body.style.overflow = 'hidden'

  mobileMenuTl = gsap.timeline()
  mobileMenuTl
    .to(menu, {
      clipPath: 'circle(150% at calc(100% - 40px) 40px)',
      duration: 0.7,
      ease: 'power3.inOut',
    })
    .to(menu.querySelector('.mobile-links'), { opacity: 1, duration: 0.1 }, '-=0.1')
    .to(links, {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.08,
      ease: 'power2.out',
    }, '-=0.2')
}

function closeMobileMenu() {
  mobileMenuOpen = false
  const menu = document.getElementById('mobile-menu')
  const links = menu.querySelectorAll('.mobile-link')
  const hamburger = document.getElementById('nav-hamburger')

  hamburger.setAttribute('aria-expanded', 'false')
  document.body.style.overflow = ''

  gsap.timeline({
    onComplete: () => {
      menu.classList.remove('is-open')
      gsap.set(links, { opacity: 0, y: 20 })
      gsap.set(menu.querySelector('.mobile-links'), { opacity: 0 })
    },
  }).to(menu, {
    clipPath: 'circle(0% at calc(100% - 40px) 40px)',
    duration: 0.6,
    ease: 'power3.inOut',
  })
}

function initMobileMenu() {
  const hamburger = document.getElementById('nav-hamburger')
  const closeBtn = document.getElementById('mobile-menu-close')

  // Init link states
  const links = document.querySelectorAll('.mobile-link')
  gsap.set(links, { opacity: 0, y: 20 })

  hamburger.addEventListener('click', () => {
    if (mobileMenuOpen) closeMobileMenu()
    else openMobileMenu()
  })

  closeBtn.addEventListener('click', closeMobileMenu)

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenuOpen) closeMobileMenu()
  })
}

// ==========================================================
// NAVBAR MODE SWITCHER
// ==========================================================
function initNavbarMode() {
  const navbar = document.getElementById('navbar')
  const darkSections = ['#hero', '#portfolio', '#cta-finale']
  const lightSections = ['#connessione', '#dolore', '#come-funziona', '#chi-sono']

  function setMode(mode) {
    if (mode === 'dark') {
      navbar.classList.add('nav--dark')
      navbar.classList.remove('nav--light')
    } else {
      navbar.classList.add('nav--light')
      navbar.classList.remove('nav--dark')
    }
  }

  // Use IntersectionObserver to detect which section is dominant
  const allSections = [...darkSections, ...lightSections].map(id => document.querySelector(id)).filter(Boolean)

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
          const isDark = darkSections.some(sel => document.querySelector(sel) === entry.target)
          setMode(isDark ? 'dark' : 'light')
        }
      })
    },
    { threshold: 0.3 }
  )

  allSections.forEach(s => observer.observe(s))
  setMode('dark') // initial state
}

// ==========================================================
// CLEANUP on unload
// ==========================================================
window.addEventListener('beforeunload', () => {
  ScrollTrigger.killAll()
})

// ==========================================================
// DOM READY
// ==========================================================
document.addEventListener('DOMContentLoaded', () => {
  // Mark body so CSS safety-net transitions are disabled once GSAP is running
  document.body.classList.add('gsap-active')
  initSmoothScroll()
  initMobileMenu()
  initNavbarMode()
  boot()
})
