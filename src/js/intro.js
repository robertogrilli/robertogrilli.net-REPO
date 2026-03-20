// ==========================================================
// INTRO.JS — Three.js particle background + GSAP sequence
// ==========================================================

import { gsap } from 'gsap'
import * as THREE from 'three'

let renderer, scene, camera, particles, animFrameId

// ==========================================================
// THREE.JS PARTICLE BACKGROUND
// ==========================================================
function initParticles(canvas) {
  const mobile = window.innerWidth < 768

  // Try-catch: WebGL can fail on iOS (memory limits, multiple tabs)
  // If it fails, intro text still plays — just no particles
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'low-power' })
  } catch (e) {
    console.warn('WebGL unavailable, skipping particles:', e)
    return
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1 : 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setClearColor(0x000000, 0)

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000)
  camera.position.z = 5

  const count = mobile ? 120 : 260
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3 + 0] = (Math.random() - 0.5) * 22
    positions[i * 3 + 1] = (Math.random() - 0.5) * 14
    positions[i * 3 + 2] = (Math.random() - 0.5) * 8
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const mat = new THREE.PointsMaterial({
    color: 0xBFA46A,
    size: 0.065,
    transparent: true,
    opacity: 0.4,
    sizeAttenuation: true,
  })

  particles = new THREE.Points(geo, mat)
  scene.add(particles)

  const onResize = () => {
    renderer.setSize(window.innerWidth, window.innerHeight)
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
  }
  window.addEventListener('resize', onResize)

  let lastTime = 0
  const tick = (time) => {
    animFrameId = requestAnimationFrame(tick)
    const delta = (time - lastTime) * 0.001
    lastTime = time

    const pos = particles.geometry.attributes.position
    for (let i = 0; i < count; i++) {
      pos.array[i * 3 + 1] += delta * 0.08
      if (pos.array[i * 3 + 1] > 8) pos.array[i * 3 + 1] = -8
    }
    pos.needsUpdate = true
    particles.rotation.y += delta * 0.012

    renderer.render(scene, camera)
  }
  requestAnimationFrame(tick)
}

function destroyParticles() {
  if (animFrameId) cancelAnimationFrame(animFrameId)
  if (renderer) {
    renderer.dispose()
    renderer = null
  }
}

// ==========================================================
// COMPUTE INTRO FONT SIZE IN PX (avoids clamp() inline issues on mobile)
// ==========================================================
function getWordPx(larger = false) {
  const vw = window.innerWidth
  if (larger) {
    // "tua" — slightly bigger
    return Math.min(Math.max(Math.round(vw * 0.13), 42), 90) + 'px'
  }
  // "ristorante" / "storia"
  return Math.min(Math.max(Math.round(vw * 0.11), 36), 72) + 'px'
}

// ==========================================================
// SPLIT WORD INTO CHAR SPANS
// ==========================================================
function splitWord(wordEl, text, size) {
  wordEl.innerHTML = ''
  wordEl.style.fontSize = size
  wordEl.style.whiteSpace = 'nowrap'
  wordEl.style.opacity = '1'

  return text.split('').map(c => {
    const s = document.createElement('span')
    s.className = 'intro-char'
    s.style.display = 'inline-block'
    s.textContent = c
    wordEl.appendChild(s)
    return s
  })
}

// ==========================================================
// SHOW NAVBAR
// ==========================================================
function showNavbar() {
  const navbar = document.getElementById('navbar')
  if (navbar) {
    gsap.to(navbar, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' })
  }
}

// ==========================================================
// MAIN INTRO EXPORT
// ==========================================================
export function initIntro(onComplete) {
  const overlay = document.getElementById('intro-overlay')
  const canvas = document.getElementById('intro-canvas')
  const wordEl = document.getElementById('intro-word')
  const tagline = document.getElementById('intro-tagline')
  const lines = Array.from(tagline.querySelectorAll('.intro-line'))
  const skipEl = document.getElementById('intro-skip')

  initParticles(canvas)

  gsap.set(skipEl, { opacity: 0 })
  gsap.to(skipEl, { opacity: 1, duration: 0.8, delay: 0.5 })

  let done = false

  const finish = () => {
    if (done) return
    done = true
    tl.kill()
    destroyParticles()
    gsap.to(overlay, {
      opacity: 0,
      duration: 0.45,
      ease: 'power2.inOut',
      onComplete: () => {
        overlay.remove()
        showNavbar()
        onComplete()
      },
    })
  }

  overlay.addEventListener('click', finish, { once: true })

  // Pre-set tagline lines
  lines.forEach(line => gsap.set(line, { clipPath: 'inset(0 100% 0 0)' }))
  gsap.set(tagline, { opacity: 0 })

  // char references — set inside tl.call(), read in subsequent tl.call()
  let c1, c2, c3

  const tl = gsap.timeline({ onComplete: finish })

  // Initial hold
  tl.to({}, { duration: 0.5 })

  // ---- Word 1: "ristorante" ----
  tl.call(() => {
    c1 = splitWord(wordEl, 'ristorante', getWordPx())
    gsap.set(c1, { opacity: 0, y: 30 })
    gsap.to(c1, { opacity: 1, y: 0, duration: 0.55, stagger: 0.04, ease: 'power2.out' })
  })
  tl.to({}, { duration: 1.75 })  // hold while chars animate in + pause
  tl.call(() => {
    gsap.to(c1, { opacity: 0, y: -20, duration: 0.4, stagger: { each: 0.03, from: 'end' }, ease: 'power2.in' })
  })
  tl.to({}, { duration: 0.5 })   // wait for exit to complete

  // ---- Word 2: "storia" ----
  tl.call(() => {
    c2 = splitWord(wordEl, 'storia', getWordPx())
    gsap.set(c2, { opacity: 0, y: 30 })
    gsap.to(c2, { opacity: 1, y: 0, duration: 0.55, stagger: 0.04, ease: 'power2.out' })
  })
  tl.to({}, { duration: 1.65 })
  tl.call(() => {
    gsap.to(c2, { opacity: 0, y: -20, duration: 0.4, stagger: { each: 0.03, from: 'end' }, ease: 'power2.in' })
  })
  tl.to({}, { duration: 0.5 })

  // ---- Word 3: "tua" (larger) ----
  tl.call(() => {
    c3 = splitWord(wordEl, 'tua', getWordPx(true))
    gsap.set(c3, { opacity: 0, y: 30 })
    gsap.to(c3, { opacity: 1, y: 0, duration: 0.55, stagger: 0.04, ease: 'power2.out' })
  })
  tl.to({}, { duration: 1.45 })
  tl.call(() => {
    gsap.to(c3, { opacity: 0, y: -20, duration: 0.4, stagger: { each: 0.03, from: 'end' }, ease: 'power2.in' })
  })
  tl.to({}, { duration: 0.45 })

  // ---- Tagline ----
  tl.call(() => {
    gsap.set(wordEl, { opacity: 0 })
    gsap.set(tagline, { opacity: 1 })
  })

  lines.forEach((line, i) => {
    tl.to(line, { clipPath: 'inset(0 0% 0 0)', duration: 0.65, ease: 'power3.out' }, i === 0 ? '>' : '>-0.35')
  })

  tl.to({}, { duration: 0.9 })
  tl.to(overlay, { opacity: 0, duration: 0.4, ease: 'power2.inOut' })
  tl.to({}, { duration: 0.05 })
}
