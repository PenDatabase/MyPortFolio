import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, navigate } from '../router.jsx'
import { PaletteButton } from './CommandPalette.jsx'

// Every section, named the same way its heading is named on the page.
const STOPS = [
  { id: 'index', label: 'Overview' },
  { id: 'work', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'numbers', label: 'Numbers', wide: true },
  { id: 'notes-latest', label: 'Notes' },
  { id: 'hello', label: 'Contact' },
]

// Labelled links with a sliding highlight on the section you're reading,
// and a thin progress line (the ruler) along the bottom of the bar.
export default function Ruler({ home, route }) {
  const [active, setActive] = useState(null)
  const links = useRef(null)
  const pill = useRef(null)
  const progress = useRef(null)

  useEffect(() => {
    if (!home) {
      setActive(route === 'notes' || route === 'note' ? 'notes-latest' : route === 'work' ? 'work' : null)
      return
    }
    const seen = new Map()
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => seen.set(e.target.id, e.isIntersecting))
        setActive(STOPS.map((s) => s.id).filter((id) => seen.get(id)).pop() || null)
      },
      { rootMargin: '-40% 0px -55% 0px' }
    )
    STOPS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) io.observe(el)
    })
    let frame = 0
    const update = () => {
      frame = 0
      const max = document.documentElement.scrollHeight - innerHeight
      if (progress.current) progress.current.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`
    }
    const on = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', on, { passive: true })
    return () => {
      io.disconnect()
      removeEventListener('scroll', on)
      cancelAnimationFrame(frame)
    }
  }, [home, route])

  const first = useRef(true)
  useLayoutEffect(() => {
    const place = () => {
      const p = pill.current
      const a = links.current?.querySelector(`[data-id="${active}"]`)
      if (!p) return
      if (!a || !a.offsetWidth) {
        p.style.opacity = '0'
        return
      }
      if (first.current) p.dataset.instant = ''
      p.style.opacity = '1'
      p.style.width = `${a.offsetWidth}px`
      p.style.transform = `translateX(${a.offsetLeft}px)`
      if (first.current) {
        p.offsetWidth
        delete p.dataset.instant
        first.current = false
      }
    }
    place()
    const ro = new ResizeObserver(place)
    if (links.current) ro.observe(links.current)
    document.fonts?.ready.then(place)
    return () => ro.disconnect()
  }, [active])

  const go = (e, s) => {
    e.preventDefault()
    if (s.id === 'work' && !home) return navigate('/work')
    if (s.id === 'notes-latest' && !home) return navigate('/notes')
    navigate(`/#${s.id}`)
  }

  return (
    <header className="ruler-bar glass">
      <Link href="/" className="ruler-name">
        <span className="ruler-dot" aria-hidden="true" />
        David Eneasato
      </Link>
      <nav className="ruler-nav" aria-label="Sections">
        <div className="ruler-links" ref={links}>
          <span className="ruler-pill" ref={pill} aria-hidden="true" />
          {STOPS.map((s) => (
            <a
              key={s.id}
              href={`/#${s.id}`}
              data-id={s.id}
              className={s.wide ? 'ruler-link is-wide' : 'ruler-link'}
              aria-current={active === s.id ? 'true' : undefined}
              onClick={(e) => go(e, s)}
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>
      <PaletteButton className="kbar-btn--small" />
      {home && <span className="ruler-progress" ref={progress} aria-hidden="true" />}
    </header>
  )
}
