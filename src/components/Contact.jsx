import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks.js'
import { person } from '../content.js'
import Icon from './Icon.jsx'
import { SectionHead } from './Home.jsx'
import { PaletteButton } from './CommandPalette.jsx'

function CopyEmail() {
  const [copied, setCopied] = useState(false)
  const timer = useRef(0)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(person.email)
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), 1800)
    } catch {
      location.href = `mailto:${person.email}`
    }
  }
  return (
    <>
      <button type="button" className="copy email" data-copied={copied} onClick={copy}>
        <span className="address">{person.email}</span>
        <span className="copied" aria-hidden="true">Copied to clipboard</span>
        <Icon name="copy" size={16} />
      </button>
      <span className="visually-hidden" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
    </>
  )
}

export default function Contact() {
  const ref = useReveal()
  return (
    <>
      <section className="section wrap hello" id="hello" aria-labelledby="hello-title" ref={ref}>
        <SectionHead id="hello-title" title="Say hello." tone="pear" what="Need a backend, an AI service or infrastructure that stays up? Copy my email below, or find me on GitHub and LinkedIn." />
        <CopyEmail />
      </section>
      <footer className="wrap footer small">
        <span className="muted">© {new Date().getFullYear()} David Chibueze Eneasato</span>
        <PaletteButton className="kbar-btn--small" />
        <span className="socials">
          <a href={person.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Icon name="github" size={16} /></a>
          <a href={person.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Icon name="linkedin" size={16} /></a>
        </span>
      </footer>
    </>
  )
}
