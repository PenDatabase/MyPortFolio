import { useEffect, useId, useRef, useState } from 'react'
import { useReveal } from '../hooks.js'
import { work } from '../content.js'
import { SectionHead } from './Home.jsx'

function RowFace({ item }) {
  return (
    <span className="row-face grid">
      <span className="company heading">{item.company}</span>
      <span className="meta caption">
        <span>{item.role}</span>
        {item.dates && <span>{item.dates}</span>}
      </span>
      <span className="toggle" aria-hidden="true" />
    </span>
  )
}

function Row({ item, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const id = useId()
  const panel = useRef(null)

  // Closed panels leave the tab order and the accessibility tree.
  useEffect(() => {
    if (open) panel.current.removeAttribute('inert')
    else panel.current.setAttribute('inert', '')
  }, [open])

  return (
    <li>
      <h3>
        <button
          type="button"
          className="row-trigger"
          aria-expanded={open}
          aria-controls={id}
          data-cursor={open ? 'Close' : 'Open'}
          onClick={() => setOpen((o) => !o)}
        >
          <RowFace item={item} />
          {/* Ink copy of the row, wiped in with clip-path on hover. */}
          <span className="row-ink" aria-hidden="true">
            <RowFace item={item} />
          </span>
        </button>
      </h3>
      <div className="panel" id={id} data-open={open} ref={panel}>
        <div className="panel-inner">
          <div className="panel-body grid">
            <ul className="bullets body">
              {item.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </li>
  )
}

export default function Work() {
  const ref = useReveal()
  return (
    <section className="section wrap" id="experience" aria-labelledby="exp-title" ref={ref}>
      <SectionHead id="exp-title" title="Experience" tone="ice" what="Where I've worked and what I did there. Open a row to see the details." />
      <ul className="work-list">
        {work.map((item, i) => (
          <Row key={item.company} item={item} defaultOpen={i === 0} />
        ))}
      </ul>
    </section>
  )
}
