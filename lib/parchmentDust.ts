export const parchmentSessionKey = 'skillchain.parchment-entered'

type Point = { x: number; y: number }
type Grain = Point & { vx: number; vy: number; size: number; angle: number; spin: number; born: number; life: number; color: string }

const paper = '#F0E7D8'
const shades = ['#F0E7D8', '#E6D5B7', '#CDA765', '#BCAC96']
const erosionMs = 1080
const durationMs = 1400

export function dissolveParchment(sheet: HTMLCanvasElement, dust: HTMLCanvasElement, logo: HTMLImageElement,
  labels: HTMLElement[], origin: Point, finish: () => void) {
  const base = sheet.getContext('2d')
  const grains = dust.getContext('2d')
  if (!base || !grains) return

  const { width, height } = sheet.getBoundingClientRect()
  if (!width || !height) return
  const scale = Math.min(devicePixelRatio || 1, 1.35, Math.sqrt(2_100_000 / (width * height)))
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)
  sheet.width = dust.width = w
  sheet.height = dust.height = h
  base.fillStyle = paper
  base.fillRect(0, 0, w, h)
  base.setTransform(w / width, 0, 0, h / height, 0, 0)

  const flecks = Math.min(3750, Math.round(width * height / 240))
  for (let i = 0; i < flecks; i++) {
    base.fillStyle = i % 2 ? '#9477560c' : '#ffffff48'
    base.fillRect(Math.random() * width, Math.random() * height, 1, 1)
  }

  if (logo.complete && logo.naturalWidth) {
    const rect = logo.getBoundingClientRect()
    base.drawImage(logo, rect.x, rect.y, rect.width, rect.height)
  }
  for (const label of labels) {
    const rect = label.getBoundingClientRect()
    if (!rect.width || !rect.height) continue
    const style = getComputedStyle(label)
    base.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    base.fillStyle = style.color
    base.textAlign = 'center'
    base.textBaseline = 'middle'
    base.letterSpacing = style.letterSpacing === 'normal' ? '0px' : style.letterSpacing
    const text = label.textContent ?? ''
    base.fillText(style.textTransform === 'uppercase' ? text.toUpperCase() : text, rect.x + rect.width / 2, rect.y + rect.height / 2)
  }
  base.resetTransform()
  grains.setTransform(w / width, 0, 0, h / height, 0, 0)

  // Erase persistent, irregular groups of small cells. Logo and paper share the same pixel layer.
  const cell = Math.max(3, Math.ceil(Math.sqrt(w * h / 85_000)))
  const columns = Math.ceil(w / cell)
  const rows = Math.ceil(h / cell)
  const groups: number[][] = Array.from({ length: 76 }, () => [])
  const limit = Math.hypot(Math.max(origin.x, width - origin.x), Math.max(origin.y, height - origin.y))
  const contactColumn = Math.min(columns - 1, Math.floor(origin.x * w / width / cell))
  const contactRow = Math.min(rows - 1, Math.floor(origin.y * h / height / cell))
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const x = (col + 0.5) * cell * width / w - origin.x
      const y = (row + 0.5) * cell * height / h - origin.y
      const distance = Math.hypot(x, y)
      const texture = Math.sin(x * 0.032) * Math.cos(y * 0.027) * 18 + (Math.random() - 0.5) * 35
      const spread = Math.min(1, Math.max(0, (distance + texture * Math.min(1, distance / 45)) / limit))
      const band = col === contactColumn && row === contactRow ? 0 : Math.floor(spread ** 0.76 * (groups.length - 1))
      groups[band].push(row * columns + col)
    }
  }

  let particles: Grain[] = []
  const budget = width < 700 ? 155 : 320
  let painted = -1
  let frame = 0
  const start = performance.now()
  // Ensure the entrance still clears if the browser throttles animation frames.
  const deadline = window.setTimeout(finish, durationMs + 80)

  function emit(x: number, y: number, now: number) {
    const angle = Math.atan2(y - origin.y, x - origin.x) + (Math.random() - 0.5) * 1.5
    const speed = 18 + Math.random() * 78
    particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 29,
      size: 0.65 + Math.random() * 2.7, angle, spin: (Math.random() - 0.5) * 14,
      born: now, life: 140 + Math.random() * 210, color: shades[Math.floor(Math.random() * shades.length)] })
  }

  function draw(now: number) {
    const elapsed = now - start
    if (elapsed >= durationMs) { finish(); return }
    particles = particles.filter(grain => now - grain.born < grain.life)
    const target = Math.min(groups.length - 1, Math.floor((elapsed / erosionMs) * groups.length))
    for (let group = painted + 1; group <= target; group++) {
      const cells = groups[group]
      const stride = Math.max(1, Math.floor(cells.length / (width < 700 ? 7 : 13)))
      cells.forEach((index, i) => {
        const x = (index % columns) * cell
        const y = Math.floor(index / columns) * cell
        base!.clearRect(x, y, cell, cell)
        if (particles.length < budget && i % stride === 0) emit((x + cell / 2) * width / w, (y + cell / 2) * height / h, now)
      })
    }
    painted = target
    grains!.clearRect(0, 0, width, height)
    for (const grain of particles) {
      const age = now - grain.born
      const seconds = age / 1000
      grains!.save()
      grains!.translate(grain.x + grain.vx * seconds, grain.y + grain.vy * seconds)
      grains!.rotate(grain.angle + grain.spin * seconds)
      grains!.globalAlpha = 0.82 * (1 - age / grain.life)
      grains!.fillStyle = grain.color
      grains!.fillRect(-grain.size / 2, -grain.size / 3, grain.size, grain.size * 0.7)
      grains!.restore()
    }
    frame = requestAnimationFrame(draw)
  }

  draw(start)
  return () => {
    window.clearTimeout(deadline)
    cancelAnimationFrame(frame)
    sheet.width = dust.width = 1
    sheet.height = dust.height = 1
    particles = []
  }
}
