import { useLayoutEffect, useRef, useState } from 'react'
import { CATEGORIES, projects } from '../content.js'
import { ProjectCard } from './Home.jsx'

export default function WorkPage() {
  const [cat, setCat] = useState('All')
  const tabs = useRef(null)
  const pill = useRef(null)
  const shown = cat === 'All' ? projects : projects.filter((p) => p.kind === cat)
  const count = (c) => (c === 'All' ? projects.length : projects.filter((p) => p.kind === c).length)

  // Sliding pill under the active filter.
  useLayoutEffect(() => {
    const a = tabs.current?.querySelector('[aria-pressed="true"]')
    if (!a || !pill.current) return
    pill.current.style.width = a.offsetWidth + 'px'
    pill.current.style.transform = `translateX(${a.offsetLeft}px)`
  }, [cat])

  return (
    <section className="wrap page-top" aria-labelledby="page-title">
      <div className="head-row head-row--page">
        <h1 id="page-title" className="display">Work</h1>
        <span className="small muted">2024 to now</span>
      </div>
      <div className="filters" ref={tabs} role="group" aria-label="Filter projects">
        <span className="filter-pill" ref={pill} aria-hidden="true" />
        {CATEGORIES.map((c) => (
          <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>
            {c} <span className="filter-count">{count(c)}</span>
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">{shown.length} projects shown</p>
      <ul className="work-grid" key={cat}>
        {shown.map((p, i) => (
          <li key={p.slug} style={{ '--i': i }}>
            <ProjectCard p={p} />
          </li>
        ))}
      </ul>
    </section>
  )
}
