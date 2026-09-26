// ============================================================================
// HERO WEBGL SCENE — iridescent chrome torus-knot sculpture, wireframe cage,
// orbiting satellites and drifting particle fields, with mouse parallax and
// scroll-driven motion. Falls back gracefully when WebGL is unavailable.
// ============================================================================
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import gsap from 'gsap'

export function initScene(selector) {
  const canvas = document.querySelector(selector)
  if (!canvas) return null

  let renderer
  try {
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
  } catch (err) {
    canvas.style.display = 'none'
    return null
  }

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const isMobile = window.matchMedia('(max-width: 768px)').matches

  renderer.setClearColor(0x0b0b10, 0)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.08

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60)
  camera.position.set(0, 0, 6.4)

  // ---- Lights (environment map does the heavy lifting) ----
  const key = new THREE.DirectionalLight(0xffffff, 1.1)
  key.position.set(3, 5, 4)
  scene.add(key)
  const rim = new THREE.DirectionalLight(0xff5c1f, 2.2)
  rim.position.set(-5, -2, -4)
  scene.add(rim)
  const fill = new THREE.DirectionalLight(0x8b5cff, 1.3)
  fill.position.set(2, -4, 3)
  scene.add(fill)

  // ---- World group (everything floats inside it) ----
  const world = new THREE.Group()
  scene.add(world)

  // Main sculpture — holographic chrome torus knot
  const knot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(1.0, 0.32, isMobile ? 150 : 260, isMobile ? 22 : 40, 2, 3),
    new THREE.MeshPhysicalMaterial({
      color: 0xdfe2ec,
      metalness: 1,
      roughness: 0.13,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 1,
      iridescenceIOR: 1.7,
      iridescenceThicknessRange: [120, 480],
      envMapIntensity: 1.3,
    })
  )
  world.add(knot)

  // Wireframe cage
  const cage = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(2.4, 1)),
    new THREE.LineBasicMaterial({ color: 0x8b8ba6, transparent: true, opacity: 0.2 })
  )
  world.add(cage)

  // Orbiting satellites on tilted elliptical paths
  const satMat = (c) =>
    new THREE.MeshStandardMaterial({ color: c, metalness: 0.9, roughness: 0.28, envMapIntensity: 1.5 })
  const satellites = [
    { mesh: new THREE.Mesh(new THREE.OctahedronGeometry(0.17, 0), satMat(0xff5c1f)), r: 2.1, sp: 0.5, tilt: 0.5, ph: 0 },
    { mesh: new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 12, 26), satMat(0x9b7bff)), r: 2.6, sp: 0.36, tilt: -0.85, ph: 2.2 },
    { mesh: new THREE.Mesh(new THREE.IcosahedronGeometry(0.12, 0), satMat(0xf2f1ee)), r: 1.75, sp: 0.62, tilt: 1.25, ph: 4.4 },
  ]
  satellites.forEach((s) => world.add(s.mesh))

  // Particle fields (soft orange + violet dust)
  const makeCloud = (count, color, size, opacity, minR, maxR) => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const r = minR + Math.random() * (maxR - minR)
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      pos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th) * 0.72
      pos[i * 3 + 2] = r * Math.cos(ph)
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return new THREE.Points(
      geo,
      new THREE.PointsMaterial({
        color,
        size,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    )
  }
  const clouds = [
    makeCloud(isMobile ? 260 : 640, 0xffc39d, 0.045, 0.7, 3.4, 8.5),
    makeCloud(isMobile ? 200 : 520, 0xa88cff, 0.03, 0.5, 3.8, 9),
  ]
  clouds.forEach((c) => world.add(c))

  // ---- Interaction state ----
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 }
  const intro = { v: reduced ? 1 : 0.001 }
  let scrollP = 0
  let anchorX = 0
  let anchorY = 0
  let visible = true

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.tx = (e.clientX / window.innerWidth) * 2 - 1
      mouse.ty = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true }
  )

  const hero = canvas.closest('.hero')
  const onScroll = () => {
    const h = (hero && hero.offsetHeight) || window.innerHeight
    scrollP = Math.max(0, Math.min(1, window.scrollY / h))
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()

  const resize = () => {
    const w = canvas.clientWidth || 1
    const h = canvas.clientHeight || 1
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    if (camera.aspect > 1.15) {
      anchorX = 1.15
      anchorY = 0
    } else {
      anchorX = 0
      anchorY = 0.25
    }
    if (reduced) render()
  }
  window.addEventListener('resize', resize)

  const clock = new THREE.Clock()

  function render() {
    const t = clock.getElapsedTime()
    mouse.x += (mouse.tx - mouse.x) * 0.05
    mouse.y += (mouse.ty - mouse.y) * 0.05

    knot.rotation.y = t * 0.18 + mouse.x * 0.55
    knot.rotation.x = Math.sin(t * 0.24) * 0.32 + mouse.y * 0.3
    cage.rotation.y = -t * 0.06
    cage.rotation.x = Math.sin(t * 0.1) * 0.18

    satellites.forEach((s) => {
      const a = t * s.sp + s.ph
      s.mesh.position.set(
        Math.cos(a) * s.r,
        Math.sin(a) * s.r * Math.sin(s.tilt),
        Math.sin(a) * s.r * Math.cos(s.tilt)
      )
      s.mesh.rotation.set(a * 1.4, a * 0.8, 0)
    })

    clouds[0].rotation.y = t * 0.02
    clouds[1].rotation.y = -t * 0.016
    clouds[0].material.opacity = 0.5 + Math.sin(t * 1.4) * 0.18
    clouds[1].material.opacity = 0.36 + Math.cos(t * 1.1) * 0.14

    const s = Math.max(0.001, intro.v * (1 - scrollP * 0.14))
    world.scale.setScalar(s)
    world.position.set(anchorX, anchorY + Math.sin(t * 0.55) * 0.13 - scrollP * 1.25, 0)
    world.rotation.y = scrollP * 0.55

    camera.position.x = mouse.x * 0.4
    camera.position.y = -mouse.y * 0.28
    camera.lookAt(0, 0, 0)

    renderer.render(scene, camera)
  }

  resize()

  if (reduced) {
    render()
  } else {
    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    }, { threshold: 0.01 })
    if (hero) io.observe(hero)
    renderer.setAnimationLoop(() => {
      if (visible) render()
    })
  }

  return {
    // Called once the preloader finishes — pops the sculpture in.
    intro() {
      canvas.style.opacity = '1'
      if (reduced) {
        render()
        return
      }
      gsap.to(intro, { v: 1, duration: 1.7, ease: 'back.out(1.25)', delay: 0.15 })
    },
  }
}
