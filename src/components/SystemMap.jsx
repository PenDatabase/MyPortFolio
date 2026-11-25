import { useEffect, useMemo, useRef, useState } from 'react'

// A working model of the kind of system David builds. Requests flow along the links;
// click a service to take it down and watch the alert go out and the system recover.
const NODES = {
  users: { label: 'Users', sub: '1,000+ at once', breakable: false },
  api: { label: 'API', sub: 'Django, FastAPI', breakable: true },
  ai: { label: 'AI services', sub: 'LangChain, RAG', breakable: true },
  grading: { label: 'Grading', sub: 'Microservice', breakable: true },
  plag: { label: 'Plagiarism check', sub: '500+ submissions', breakable: true },
  db: { label: 'PostgreSQL', sub: 'Indexed schema', breakable: true },
  alerts: { label: 'Telegram alerts', sub: 'Error logging', breakable: false },
}

const EDGES = [
  ['users', 'api'],
  ['api', 'ai'],
  ['api', 'grading'],
  ['api', 'db'],
  ['ai', 'db'],
  ['grading', 'plag'],
  ['plag', 'db'],
]
// Alerts only light up when something breaks.
const ALERT_FROM = ['api', 'ai', 'grading', 'plag', 'db']

// Label placement per node: [dx, dy, text-anchor]. Chosen so no label crosses a link.
const LAYOUTS = {
  wide: {
    w: 620,
    h: 440,
    pos: {
      users: [40, 200], api: [200, 200], ai: [370, 70], db: [560, 200],
      grading: [370, 330], plag: [560, 330], alerts: [200, 400],
    },
    label: {
      users: [-8, 36, 'start'], api: [-14, -30, 'end'], ai: [0, -34, 'middle'], db: [0, -34, 'middle'],
      grading: [0, 36, 'middle'], plag: [10, 36, 'end'], alerts: [-18, 0, 'end'],
    },
  },
  tall: {
    w: 380,
    h: 560,
    pos: {
      users: [190, 40], api: [190, 150], ai: [110, 270], grading: [260, 270],
      db: [110, 400], plag: [250, 400], alerts: [190, 520],
    },
    label: {
      users: [18, -2, 'start'], api: [18, -2, 'start'], ai: [-18, -2, 'end'], grading: [18, -2, 'start'],
      db: [-18, -2, 'end'], plag: [18, -2, 'start'], alerts: [18, -2, 'start'],
    },
  },
}

const RECOVER_MS = 2200

export default function SystemMap() {
  const [layoutKey, setLayoutKey] = useState(() =>
    typeof window !== 'undefined' && matchMedia('(max-width: 800px)').matches ? 'tall' : 'wide'
  )
  const [down, setDown] = useState(null) // id of the service that's down
  const [phase, setPhase] = useState('up') // up | down | recovering
  const [toast, setToast] = useState(null)
  const svgRef = useRef(null)
  const packetsRef = useRef([])
  const downRef = useRef(null)
  const timers = useRef([])
  downRef.current = down

  const L = LAYOUTS[layoutKey]

  useEffect(() => {
    const mq = matchMedia('(max-width: 800px)')
    const on = () => setLayoutKey(mq.matches ? 'tall' : 'wide')
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])

  // Two packets per link, staggered.
  const packets = useMemo(
    () => EDGES.flatMap(([a, b], i) => [0, 0.5].map((o) => ({ a, b, offset: o + i * 0.137, speed: 0.22 + (i % 3) * 0.05 }))),
    []
  )

  // Packet loop: only while on screen, never under reduced motion.
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return
    let frame = 0
    let visible = true
    let start = performance.now()
    const tick = (now) => {
      const t = (now - start) / 1000
      const { pos } = LAYOUTS[layoutKey]
      packets.forEach((p, i) => {
        const el = packetsRef.current[i]
        if (!el) return
        const blocked = downRef.current && (p.a === downRef.current || p.b === downRef.current)
        const k = (t * p.speed + p.offset) % 1
        const [x1, y1] = pos[p.a]
        const [x2, y2] = pos[p.b]
        el.setAttribute('transform', `translate(${x1 + (x2 - x1) * k} ${y1 + (y2 - y1) * k})`)
        el.style.opacity = blocked ? 0 : Math.min(1, Math.sin(k * Math.PI) * 2)
      })
      if (visible) frame = requestAnimationFrame(tick)
    }
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      cancelAnimationFrame(frame)
      if (visible) frame = requestAnimationFrame(tick)
    })
    io.observe(svgRef.current)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [layoutKey, packets])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const breakService = (id) => {
    if (!NODES[id].breakable || down) return
    const name = NODES[id].label
    setDown(id)
    setPhase('down')
    setToast({ title: 'Alert sent to Telegram', body: `${name} stopped responding. Traffic is being retried.` })
    timers.current.push(
      setTimeout(() => {
        setPhase('recovering')
      }, RECOVER_MS * 0.55),
      setTimeout(() => {
        setDown(null)
        setPhase('up')
        setToast({ title: 'Recovered', body: `${name} is back up. No request was lost.` })
      }, RECOVER_MS),
      setTimeout(() => setToast(null), RECOVER_MS + 2600)
    )
  }

  const status = (id) => (id === down ? (phase === 'recovering' ? 'restarting' : 'down') : null)

  return (
    <figure className="sysmap" data-phase={phase}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${L.w} ${L.h}`}
        className="sysmap-svg"
        role="group"
        aria-label="A model of a backend system: users, API, AI services, grading, plagiarism check, PostgreSQL and Telegram alerts. Each service can be switched off."
      >
        <g className="links">
          {EDGES.map(([a, b]) => {
            const [x1, y1] = L.pos[a]
            const [x2, y2] = L.pos[b]
            const cut = down && (a === down || b === down)
            return <line key={a + b} x1={x1} y1={y1} x2={x2} y2={y2} className={cut ? 'link-line is-cut' : 'link-line'} pathLength="1" />
          })}
          {ALERT_FROM.map((a) => {
            const [x1, y1] = L.pos[a]
            const [x2, y2] = L.pos.alerts
            return (
              <line
                key={'alert' + a}
                x1={x1} y1={y1} x2={x2} y2={y2}
                className={down === a ? 'alert-link is-firing' : 'alert-link'}
              />
            )
          })}
        </g>
        <g className="packets" aria-hidden="true">
          {packets.map((p, i) => (
            <circle key={i} r="2.6" className="packet" ref={(el) => (packetsRef.current[i] = el)} />
          ))}
        </g>
        <g className="nodes">
          {Object.entries(NODES).map(([id, n]) => {
            const [x, y] = L.pos[id]
            const [dx, dy, anchor] = L.label[id]
            const s = status(id)
            return (
              <g
                key={id}
                className={`node${n.breakable ? ' is-breakable' : ''}${s ? ' is-' + s : ''}${id === 'alerts' && down ? ' is-firing' : ''}`}
                transform={`translate(${x} ${y})`}
                {...(n.breakable && {
                  role: 'button',
                  tabIndex: 0,
                  'aria-label': `${n.label}. ${s ? s : 'Running'}. Press to take it down.`,
                  'aria-disabled': !!down,
                  'data-cursor': down ? undefined : 'Break it',
                  onClick: () => breakService(id),
                  onKeyDown: (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      breakService(id)
                    }
                  },
                })}
              >
                <circle r="22" className="hit" />
                <circle r="11" className="halo" />
                <circle r="5.5" className="core" />
                <text x={dx} y={dy} textAnchor={anchor} className="n-label">{n.label}</text>
                <text x={dx} y={dy + 18} textAnchor={anchor} className="n-sub">
                  {s ? s : n.sub}
                </text>
              </g>
            )
          })}
        </g>
      </svg>

      <figcaption className="sysmap-cap">
        A working model of the systems he builds. Click a service to take it down.
      </figcaption>

      <div className="toast-slot" aria-live="polite">
        {toast && (
          <div className="glass toast" key={toast.title}>
            <strong>{toast.title}</strong>
            <span>{toast.body}</span>
          </div>
        )}
      </div>
    </figure>
  )
}
