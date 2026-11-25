import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

// A tiny pushState router. Paths: "/", "/notes", "/notes/:slug".
const listeners = new Set()

const snapshot = (pushed) => ({
  path: location.pathname,
  hash: location.hash,
  pushed,
  key: Math.random(),
})

export function navigate(to) {
  const url = new URL(to, location.origin)
  const next = url.pathname + url.search + url.hash
  const samePage = url.pathname === location.pathname
  if (next !== location.pathname + location.search + location.hash) history.pushState({}, '', next)
  const update = () => listeners.forEach((fn) => fn(snapshot(true)))

  // Page changes cross-fade with the View Transitions API where it exists; in-page jumps just scroll.
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!samePage && document.startViewTransition && !reduced) {
    // The transition waits for a frame to capture the old page. If none comes (a backgrounded tab),
    // skip the animation and change the page anyway, so navigation can never stall.
    let done = false
    const run = () => {
      if (done) return
      done = true
      flushSync(update)
    }
    const t = document.startViewTransition(run)
    setTimeout(() => {
      if (!done) {
        t.skipTransition()
        run()
      }
    }, 300)
  } else {
    update()
  }
}

export function useLocation() {
  const [loc, setLoc] = useState(() => snapshot(false))
  useEffect(() => {
    const onPop = () => setLoc(snapshot(false))
    listeners.add(setLoc)
    addEventListener('popstate', onPop)
    return () => {
      listeners.delete(setLoc)
      removeEventListener('popstate', onPop)
    }
  }, [])
  return loc
}

export function matchRoute(path) {
  const clean = path.replace(/\/+$/, '') || '/'
  if (clean === '/') return { name: 'home' }
  if (clean === '/notes') return { name: 'notes' }
  if (clean === '/work') return { name: 'work' }
  const m = clean.match(/^\/notes\/([a-z0-9-]+)$/i)
  if (m) return { name: 'note', slug: m[1] }
  return { name: 'missing' }
}

// Internal links: a real <a href> for semantics, client-side navigation on a plain click.
export function Link({ href, onClick, ...props }) {
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={href} onClick={handle} {...props} />
}
