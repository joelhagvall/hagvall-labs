// The home hero's 3D symbol. Loaded only through a dynamic import after the
// page has loaded and gone idle (BrandHero in HomePage.tsx), so three.js
// never competes with the first paint; until then, and for reduced motion or
// no WebGL, the static BrandSymbol SVG stands in its place.
//
// The three ribbons of BRAND_PATHS are extruded and hung at different depths,
// each scaled so the perspective projections line up exactly: head-on they
// resolve into the flat symbol, turned they come apart into the folds the
// drawing implies. Motion: one fold-in entrance (the ribbons fly in and spin
// into place), then only what the visitor does: drag to spin (with inertia,
// springing back to the nearest head-on view) and a slight tilt toward the
// pointer. The render loop stops whenever the scene is at rest.
import {
  Color,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  NeutralToneMapping,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Shape,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { BRAND_PATHS } from './BrandSymbol'

// The symbol's bounding box centre in SVG units (see BrandSymbol.tsx) and a
// scale that makes it 1.776 units tall.
const CX = 490
const CY = 422.5
const UNIT = 1 / 290

const FOV = 22
// Camera distance: the symbol fills 80% of the canvas height head-on, the
// same share the SVG placeholder gets, so the crossfade does not jump.
const DIST = (515 * UNIT) / 0.8 / (2 * Math.tan(((FOV / 2) * Math.PI) / 180))

// Rest depth per ribbon and how far apart the entrance starts them. Paint
// order in the SVG is back to front (the tint ribbon overlaps the left one),
// so the first path hangs deepest.
const LAYER_Z = [-0.32, 0, 0.32]
const EXPLODE_Z = [-1.4, 0, 1.4]
const DEPTH = 0.2

const TAU = Math.PI * 2
const ENTRANCE_S = 1.9

// White ribbons with the tint in the middle, as brandOnCobalt draws them.
const COLORS = ['#ffffff', '#c3d2ff', '#ffffff']

function ribbonShape(d: string) {
  const nums = d.match(/-?\d+(\.\d+)?/g)?.map(Number) ?? []
  const shape = new Shape()
  for (let i = 0; i < nums.length; i += 2) {
    const x = (nums[i] - CX) * UNIT
    const y = -(nums[i + 1] - CY) * UNIT
    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  }
  shape.closePath()
  return shape
}

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export function mountBrandScene(host: HTMLElement, onReady: () => void) {
  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')
  canvas.className =
    'absolute inset-0 size-full cursor-grab opacity-0 transition-opacity duration-500 active:cursor-grabbing'
  // Inline rather than Tailwind's touch-pan-y, which drags the --tw-pan-*
  // @property chain into the inlined stylesheet for one element.
  canvas.style.touchAction = 'pan-y'

  let renderer: WebGLRenderer
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  } catch {
    // No WebGL: the SVG placeholder simply stays.
    return () => {}
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = NeutralToneMapping
  host.appendChild(canvas)

  const scene = new Scene()
  const pmrem = new PMREMGenerator(renderer)
  const envTarget = pmrem.fromScene(new RoomEnvironment(), 0.04)
  scene.environment = envTarget.texture
  scene.environmentIntensity = 0.8

  const key = new DirectionalLight(0xffffff, 1.1)
  key.position.set(-3, 4, 5)
  scene.add(key)

  const camera = new PerspectiveCamera(FOV, 1, 0.1, 50)
  camera.position.set(0, 0, DIST)

  const pivot = new Group()
  scene.add(pivot)

  const geometries: ExtrudeGeometry[] = []
  const materials: MeshPhysicalMaterial[] = []
  const layers = BRAND_PATHS.map((path, i) => {
    const geometry = new ExtrudeGeometry(ribbonShape(path.d), {
      depth: DEPTH,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.018,
      bevelSegments: 4,
      curveSegments: 1,
    })
    geometry.translate(0, 0, -DEPTH / 2)
    const material = new MeshPhysicalMaterial({
      color: new Color(COLORS[i]),
      roughness: 0.28,
      metalness: 0,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    })
    geometries.push(geometry)
    materials.push(material)
    const mesh = new Mesh(geometry, material)
    pivot.add(mesh)
    return mesh
  })

  // Places a ribbon at depth z, scaled so that head-on its projection
  // matches a ribbon at z = 0 exactly.
  const placeLayer = (mesh: Mesh, z: number) => {
    mesh.position.z = z
    mesh.scale.setScalar((DIST - z) / DIST)
  }

  // Rotation state. yaw springs to the nearest head-on angle (a multiple of
  // a full turn) once the visitor lets go; tilt eases toward the pointer.
  let yaw = -TAU * 0.75
  let yawVel = 0
  let tiltX = 0
  let tiltY = 0
  let tiltXTarget = 0
  let tiltYTarget = 0
  let dragging = false
  let lastX = 0
  let lastT = 0

  const start = performance.now()
  let entranceDone = false
  let frame = 0
  let last = start
  let shown = false

  const resize = () => {
    const { width, height } = host.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    wake()
  }

  const tick = (now: number) => {
    frame = 0
    const dt = Math.min((now - last) / 1000, 1 / 20)
    last = now

    // Entrance: each ribbon flies in from its exploded depth, staggered,
    // while the whole symbol spins its last three quarters of a turn.
    const t = (now - start) / 1000
    if (!entranceDone) {
      layers.forEach((mesh, i) => {
        const local = Math.min(Math.max((t - i * 0.12) / ENTRANCE_S, 0), 1)
        const e = 1 - easeOutCubic(local)
        placeLayer(mesh, LAYER_Z[i] + EXPLODE_Z[i] * e)
      })
      const spin = Math.min(t / (ENTRANCE_S + 0.24), 1)
      yaw = -TAU * 0.75 * (1 - easeOutCubic(spin))
      if (t >= ENTRANCE_S + 0.24) entranceDone = true
    } else if (!dragging) {
      // Underdamped spring to the nearest head-on view: a hard fling spins
      // through and lands on the next one.
      const target = Math.round(yaw / TAU) * TAU
      const k = 18
      const c = 5.5
      yawVel += (-k * (yaw - target) - c * yawVel) * dt
      yaw += yawVel * dt
    }

    const ease = 1 - Math.exp(-dt * 6)
    tiltX += (tiltXTarget - tiltX) * ease
    tiltY += (tiltYTarget - tiltY) * ease

    pivot.rotation.set(tiltX, yaw + tiltY, 0)
    renderer.render(scene, camera)

    if (!shown) {
      shown = true
      canvas.classList.remove('opacity-0')
      onReady()
    }

    const target = Math.round(yaw / TAU) * TAU
    const atRest =
      entranceDone &&
      !dragging &&
      Math.abs(yaw - target) < 1e-4 &&
      Math.abs(yawVel) < 1e-4 &&
      Math.abs(tiltX - tiltXTarget) < 1e-4 &&
      Math.abs(tiltY - tiltYTarget) < 1e-4
    if (atRest) {
      // Settle exactly head-on so the symbol resolves pixel-true.
      yaw = target
      yawVel = 0
      pivot.rotation.set(tiltX, yaw + tiltY, 0)
      renderer.render(scene, camera)
    } else {
      wake()
    }
  }

  function wake() {
    if (!frame) {
      last = performance.now()
      frame = requestAnimationFrame(tick)
    }
  }

  // Tilt toward a mouse anywhere on the page (touch has no hover).
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== 'mouse' || dragging) return
    const r = host.getBoundingClientRect()
    const nx = (e.clientX - (r.left + r.width / 2)) / window.innerWidth
    const ny = (e.clientY - (r.top + r.height / 2)) / window.innerHeight
    tiltYTarget = Math.max(-1, Math.min(1, nx)) * 0.35
    tiltXTarget = Math.max(-1, Math.min(1, ny)) * 0.25
    wake()
  }

  // Drag to spin. touch-action: pan-y keeps vertical page scrolling on touch.
  const onDown = (e: PointerEvent) => {
    dragging = true
    entranceDone = true
    layers.forEach((mesh, i) => placeLayer(mesh, LAYER_Z[i]))
    lastX = e.clientX
    lastT = e.timeStamp
    yawVel = 0
    canvas.setPointerCapture(e.pointerId)
    wake()
  }
  const onDrag = (e: PointerEvent) => {
    if (!dragging) return
    const dx = e.clientX - lastX
    const dtMs = Math.max(e.timeStamp - lastT, 1)
    const step = (dx / Math.max(host.clientWidth, 1)) * Math.PI * 1.6
    yaw += step
    yawVel = (step / dtMs) * 1000
    lastX = e.clientX
    lastT = e.timeStamp
    wake()
  }
  const onUp = () => {
    dragging = false
    wake()
  }

  window.addEventListener('pointermove', onMove, { passive: true })
  canvas.addEventListener('pointerdown', onDown)
  canvas.addEventListener('pointermove', onDrag)
  canvas.addEventListener('pointerup', onUp)
  canvas.addEventListener('pointercancel', onUp)
  const observer = new ResizeObserver(resize)
  observer.observe(host)
  resize()

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('pointermove', onMove)
    geometries.forEach((g) => g.dispose())
    materials.forEach((m) => m.dispose())
    envTarget.dispose()
    pmrem.dispose()
    renderer.dispose()
    canvas.remove()
  }
}
