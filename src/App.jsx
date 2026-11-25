import { useEffect, useLayoutEffect, useMemo, useRef } from 'react'
import { Link, matchRoute, useLocation } from './router.jsx'
import { notes, getNote } from './notes.js'
import Hero from './components/Hero.jsx'
import Work from './components/Work.jsx'
import NoteList from './components/NoteList.jsx'
import Contact from './components/Contact.jsx'
import CommandPalette from './components/CommandPalette.jsx'
import WorkPage from './components/WorkPage.jsx'
import { Index, WorkStrip, Numbers, LatestNotes } from './components/Home.jsx'
import Ruler from './components/Ruler.jsx'

const NAME = 'David Eneasato'
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function Home() {
  return (
    <>
      <Hero />
      <Index />
      <WorkStrip />
      <Work />
      <Numbers />
      <LatestNotes />
    </>
  )
}

function NotesIndex() {
  return (
    <section className="wrap page-top" aria-labelledby="page-title">
      <div className="head-row head-row--page">
        <h1 id="page-title" className="display">Notes</h1>
        <span className="small muted">{notes.length} {notes.length === 1 ? 'note' : 'notes'}, newest first</span>
      </div>
      {notes.length ? <NoteList items={notes} /> : <p>Nothing posted yet.</p>}
    </section>
  )
}

function NotePage({ note }) {
  return (
    <article className="wrap article">
      <header className="article-head">
        <p className="small muted"><time dateTime={note.date}>{note.dateLabel}</time></p>
        <h1 className="display article-title">{note.title}</h1>
      </header>
      <div className="prose" dangerouslySetInnerHTML={{ __html: note.html }} />
      <p className="back">
        <Link href="/notes" className="quiet-link">All notes</Link>
      </p>
    </article>
  )
}

function Missing() {
  return (
    <section className="wrap page-top" aria-labelledby="page-title">
      <h1 id="page-title" className="display">Not here.</h1>
      <p className="muted" style={{ marginTop: 20 }}>That page doesn’t exist, or it moved.</p>
      <p className="back"><Link href="/" className="quiet-link">Go to the home page</Link></p>
    </section>
  )
}

export default function App() {
  const loc = useLocation()
  const route = useMemo(() => {
    const r = matchRoute(loc.path)
    if (r.name === 'note') {
      const note = getNote(r.slug)
      return note ? { ...r, note } : { name: 'missing' }
    }
    return r
  }, [loc.path])

  useEffect(() => {
    document.title =
      route.name === 'home' ? `${NAME}, software and infrastructure engineer`
      : route.name === 'work' ? `Work | ${NAME}`
      : route.name === 'notes' ? `Notes | ${NAME}`
      : route.name === 'note' ? `${route.note.title} | ${NAME}`
      : `Not found | ${NAME}`
  }, [route])

  const prevPath = useRef(loc.path)
  useLayoutEffect(() => {
    const samePage = prevPath.current === loc.path
    prevPath.current = loc.path
    if (loc.hash) {
      const el = document.getElementById(loc.hash.slice(1))
      if (el) {
        el.scrollIntoView({ behavior: loc.pushed && samePage && !reduced() ? 'smooth' : 'auto' })
        return
      }
    }
    if (loc.pushed) scrollTo(0, 0)
  }, [loc.key])

  return (
    <>
      <a href="#main" className="skip">Skip to content</a>
      <Ruler home={route.name === 'home'} route={route.name} />
      <main id="main" key={loc.path}>
        {route.name === 'home' && <Home />}
        {route.name === 'work' && <WorkPage />}
        {route.name === 'notes' && <NotesIndex />}
        {route.name === 'note' && <NotePage note={route.note} />}
        {route.name === 'missing' && <Missing />}
        <Contact />
      </main>
      <CommandPalette />
    </>
  )
}
