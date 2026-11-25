import { useEffect, useRef, useState } from 'react'
import { Link } from '../router.jsx'
import { useReveal } from '../hooks.js'
import { projects, proof } from '../content.js'
import { notes } from '../notes.js'
import Icon from './Icon.jsx'
import SystemMap from './SystemMap.jsx'
import NoteList from './NoteList.jsx'

// Every section opens the same way: a name that matches the nav, and one line on what it is for.
export function SectionHead({ id, title, what, tone, children }) {
  return (
    <div className="shead">
      <div className="shead-text">
        <h2 id={id} className="title">
          <span className={`shead-dot shead-dot--${tone || 'blue'}`} aria-hidden="true" />
          {title}
        </h2>
        <p className="shead-what">{what}</p>
      </div>
      {children && <div className="shead-aside">{children}</div>}
    </div>
  )
}

// A giant underlined text link: the reference's signature move.
export function BigLink({ href, children, external }) {
  const props = external ? { href, target: '_blank', rel: 'noopener noreferrer' } : { href }
  const Tag = external ? 'a' : Link
  return (
    <Tag className="big-link" {...props}>
      <span>{children}</span>
      <Icon name="out" size={28} className="big-arrow" />
    </Tag>
  )
}

export function ProjectCard({ p, tall }) {
  return (
    <a className={`pcard${tall ? ' pcard--tall' : ''}`} href={p.url} target="_blank" rel="noopener noreferrer">
      {p.image ? (
        <img src={p.image} alt="" loading="lazy" decoding="async" className={p.logo ? 'pcard-img is-logo' : 'pcard-img'} />
      ) : (
        <span className="pcard-cover" aria-hidden="true">
          <span>{p.lang}</span>
          <span className="small">Code on GitHub</span>
        </span>
      )}
      <span className="pcard-shade" aria-hidden="true" />
      <span className="pcard-meta small">
        <span>{p.kind === 'Products' ? 'Product' : p.kind}</span>
        <span>{p.year}</span>
      </span>
      <span className="pcard-body">
        <span className="pcard-title">{p.name}</span>
        <span className="pcard-why">{p.why}</span>
      </span>
      <Icon name="out" size={18} className="pcard-out" />
    </a>
  )
}

// Paco-style index: the whole site, scannable in one look.
function Index() {
  const ref = useReveal()
  const pick = (slugs) => slugs.map((s) => projects.find((p) => p.slug === s))
  return (
    <section className="section wrap index" id="index" aria-labelledby="index-title" ref={ref}>
      <SectionHead id="index-title" title="Overview" tone="pear" what="The whole site on one screen: what I'm building now, a few projects, and my latest writing." />
      <div className="index-cols">
        <div>
          <h3 className="index-head small">Building</h3>
          <ul>
            <li>
              <a href="https://scorac.com/" target="_blank" rel="noopener noreferrer" className="index-link">Scorac <Icon name="out" size={13} /></a>
              <p>AI and backend services for 1,000+ concurrent users.</p>
            </li>
            <li>
              <span className="index-plain">ProgrammedHQ</span>
              <p>Websites and web apps for small businesses, with payments.</p>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="index-head small">Projects</h3>
          <ul>
            {pick(['100l-playbook', 'exam-advice', 'tempfileshare']).map((p) => (
              <li key={p.slug}>
                <a href={p.url} target="_blank" rel="noopener noreferrer" className="index-link">{p.name} <Icon name="out" size={13} /></a>
                <p>{p.why}</p>
              </li>
            ))}
            <li><Link href="/work" className="index-link">All {projects.length} projects</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="index-head small">Writing</h3>
          <ul>
            {notes.slice(0, 2).map((n) => (
              <li key={n.slug}>
                <Link href={`/notes/${n.slug}`} className="index-link">{n.title}</Link>
                <p>{n.dateLabel}</p>
              </li>
            ))}
            <li><Link href="/notes" className="index-link">All notes</Link></li>
          </ul>
        </div>
      </div>
      <div className="now">
        <h3 className="index-head small">Now</h3>
        <p>
          <em>Building at Scorac</em>, on AI and backend services that grade code for a lot of people at once, and
          studying Computer Science at Covenant University. Notes are where I write down what I learn along the way.
        </p>
      </div>
    </section>
  )
}

// Rauno-style slides: one project per sheet, swipe or use the buttons.
function WorkStrip() {
  const ref = useReveal()
  const strip = useRef(null)
  const [at, setAt] = useState(0)
  const slides = ['scorac', '100l-playbook', 'exam-advice', 'converge', 'cu-packages', 'random-chat'].map((s) =>
    projects.find((p) => p.slug === s)
  )

  useEffect(() => {
    const el = strip.current
    const on = () => {
      const w = el.firstElementChild?.getBoundingClientRect().width || 1
      setAt(Math.round(el.scrollLeft / (w + 16)))
    }
    el.addEventListener('scroll', on, { passive: true })
    return () => el.removeEventListener('scroll', on)
  }, [])

  const go = (d) => {
    const el = strip.current
    const w = el.firstElementChild.getBoundingClientRect().width + 16
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, at + d)) * w, behavior: reduced ? 'auto' : 'smooth' })
  }

  return (
    <section className="section" id="work" aria-labelledby="work-title" ref={ref}>
      <div className="wrap">
        <SectionHead id="work-title" title="Projects" tone="blue" what="Six things I've built or run the systems behind. Swipe or use the arrows; each one opens the real thing. On the first, click a service to break it.">
        <div className="strip-controls">
          <span className="small muted num" aria-live="polite">{at + 1} / {slides.length}</span>
          <button type="button" className="round-btn" onClick={() => go(-1)} disabled={at === 0} aria-label="Previous project">
            <Icon name="back" size={16} />
          </button>
          <button type="button" className="round-btn" onClick={() => go(1)} disabled={at === slides.length - 1} aria-label="Next project">
            <Icon name="back" size={16} className="flip" />
          </button>
        </div>
        </SectionHead>
      </div>
      <ul
        className="strip"
        ref={strip}
        tabIndex={0}
        aria-label="Projects, scroll sideways"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') { e.preventDefault(); go(1) }
          if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1) }
        }}
      >
        {slides.map((p, n) => (
          <li key={p.slug} className="slide">
            {n === 0 ? (
              <div className="slide-media slide-media--map"><SystemMap /></div>
            ) : (
              <a className="slide-media" href={p.url} target="_blank" rel="noopener noreferrer" tabIndex={-1} aria-hidden="true">
                {p.image ? <img src={p.image} alt="" loading="lazy" decoding="async" className={p.logo ? 'is-logo' : ''} /> : (
                  <span className="pcard-cover"><span>{p.lang}</span><span className="small">Code on GitHub</span></span>
                )}
              </a>
            )}
            <div className="slide-cap">
              <div>
                <h3 className="slide-title">
                  <a href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                </h3>
                <p className="slide-why">{p.why}</p>
              </div>
              <span className="small muted slide-meta" data-kind={p.kind}>{p.kind === 'Products' ? 'Product' : p.kind}, {p.year}</span>
            </div>
          </li>
        ))}
      </ul>
      <div className="wrap">
        <BigLink href="/work">See all my projects</BigLink>
      </div>
    </section>
  )
}

function Numbers() {
  const ref = useReveal()
  return (
    <section className="section wrap split" id="numbers" aria-labelledby="numbers-title" ref={ref}>
      <div className="split-head">
        <SectionHead id="numbers-title" title="Numbers" tone="ice" what="Three figures that show the scale I work at, from production systems and from school." />
      </div>
      <ul className="numbers">
        {proof.map((n) => (
          <li key={n.value}>
            <span className="num-value">{n.value}</span>
            <span className="num-label">{n.label}</span>
            <span className="small muted">{n.source}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

function LatestNotes() {
  const ref = useReveal()
  if (!notes.length) return null
  return (
    <section className="section wrap" id="notes-latest" aria-labelledby="notes-title" ref={ref}>
      <SectionHead id="notes-title" title="Notes" tone="pear" what="Short notes on what I learn while building, newest first. Pick one to read it.">
        <Link href="/notes" className="small quiet-link">All {notes.length}</Link>
      </SectionHead>
      <NoteList items={notes.slice(0, 3)} />
      <BigLink href="/notes">Read my notes</BigLink>
    </section>
  )
}

export { Index, WorkStrip, Numbers, LatestNotes }
