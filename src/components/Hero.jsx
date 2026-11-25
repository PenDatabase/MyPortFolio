import { useEffect, useRef, useState } from 'react'

const WORDS = ['up', 'fast', 'secure', 'boring']
let played = false

function useCycle() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let t
    const tick = () => {
      if (!document.hidden) setI((n) => (n + 1) % WORDS.length)
      t = setTimeout(tick, 2600)
    }
    t = setTimeout(tick, 3400)
    return () => clearTimeout(t)
  }, [])
  return i
}

function CyclingWord({ i }) {
  return (
    <span className="cycle">
      <span className="cycle-sizer">{WORDS.reduce((a, b) => (b.length > a.length ? b : a))}.</span>
      {WORDS.map((w, n) => (
        <span key={w} className="cycle-word" data-state={n === i ? 'in' : n === (i - 1 + WORDS.length) % WORDS.length ? 'out' : 'wait'}>
          {w}.
        </span>
      ))}
    </span>
  )
}

// Staggered statement, Swiss style. Rendered twice: ink below, white on top clipped to the disc.
function Statement({ i }) {
  return (
    <>
      <span className="line"><span className="line-inner" style={{ '--i': 0 }}>David Eneasato</span></span>
      <span className="line indent"><span className="line-inner" style={{ '--i': 1 }}>is a software engineer</span></span>
      <span className="line"><span className="line-inner" style={{ '--i': 2 }}>in Lagos, building</span></span>
      <span className="line indent"><span className="line-inner" style={{ '--i': 3 }}>systems that stay <CyclingWord i={i} /></span></span>
    </>
  )
}

export default function Hero() {
  const [intro] = useState(() => (played ? 'done' : 'play'))
  const i = useCycle()
  const sheet = useRef(null)

  useEffect(() => {
    played = true
  }, [])

  // The disc drifts toward the pointer with a soft, critically damped follow.
  useEffect(() => {
    const el = sheet.current
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches
    const home = () => {
      const r = el.getBoundingClientRect()
      return [r.width * 0.68, r.height * 0.5]
    }
    let [x, y] = home()
    let [tx, ty] = [x, y]
    let frame = 0
    const paint = () => {
      el.style.setProperty('--dx', `${x}px`)
      el.style.setProperty('--dy', `${y}px`)
    }
    paint()
    const loop = () => {
      x += (tx - x) * 0.08
      y += (ty - y) * 0.08
      paint()
      frame = Math.abs(tx - x) + Math.abs(ty - y) > 0.3 ? requestAnimationFrame(loop) : 0
    }
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(loop)
    }
    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      // Follow loosely: the disc travels a third of the way to the pointer.
      const [hx, hy] = home()
      tx = hx + (e.clientX - r.left - hx) * 0.35
      ty = hy + (e.clientY - r.top - hy) * 0.35
      kick()
    }
    const onLeave = () => {
      ;[tx, ty] = home()
      kick()
    }
    const onResize = () => {
      ;[x, y] = home()
      ;[tx, ty] = [x, y]
      paint()
    }
    addEventListener('resize', onResize)
    if (fine && !reduced) {
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerleave', onLeave)
    }
    return () => {
      removeEventListener('resize', onResize)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <section className="hero wrap" data-intro={intro} id="intro" aria-labelledby="hero-title">
      <div className="sheet" ref={sheet}>
        <span className="disc" aria-hidden="true" />
        <span className="disc disc--pear" aria-hidden="true" />
        <h1 id="hero-title" className="statement">
          <span className="visually-hidden">David Eneasato is a software engineer in Lagos, building systems that stay up, fast, secure and boring.</span>
          <span className="statement-ink" aria-hidden="true"><Statement i={i} /></span>
        </h1>
        <span className="statement statement-light" aria-hidden="true"><Statement i={i} /></span>
        <div className="sheet-foot small">
          <span>Backend, AI services and infrastructure</span>
          <span>Currently at Scorac Technologies</span>
        </div>
      </div>
    </section>
  )
}
