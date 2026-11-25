import { useEffect, useMemo, useRef, useState } from 'react'
import { navigate } from '../router.jsx'
import { person, projects } from '../content.js'
import { notes } from '../notes.js'
import Icon from './Icon.jsx'

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform)
export const openPalette = () => window.dispatchEvent(new Event('palette:open'))

export function PaletteButton({ className = '' }) {
  return (
    <button type="button" className={`kbar-btn ${className}`} onClick={openPalette} aria-haspopup="dialog" aria-label="Jump to anything">
      <Icon name="search" size={15} className="kbar-icon" />
      <kbd>{isMac ? '⌘' : 'Ctrl'} K</kbd>
      <span>Jump to anything</span>
    </button>
  )
}

function useItems() {
  return useMemo(
    () => [
      { group: 'Go to', label: 'Work', hint: 'All projects', icon: 'work', run: () => navigate('/work') },
      { group: 'Go to', label: 'Experience', hint: 'Where I have worked', icon: 'layers', run: () => navigate('/#experience') },
      { group: 'Go to', label: 'Notes', hint: 'Short writing', icon: 'book', run: () => navigate('/notes') },
      { group: 'Go to', label: 'Say hello', hint: 'Contact', icon: 'user', run: () => navigate('/#hello') },
      {
        group: 'Do',
        label: 'Copy email address',
        hint: person.email,
        icon: 'copy',
        run: async (done) => {
          try {
            await navigator.clipboard.writeText(person.email)
            done('Email copied')
          } catch {
            location.href = `mailto:${person.email}`
          }
        },
      },
      { group: 'Do', label: 'Open GitHub', hint: '@PenDatabase', icon: 'github', run: () => open(person.github, '_blank', 'noopener') },
      { group: 'Do', label: 'Open LinkedIn', hint: 'David Eneasato', icon: 'linkedin', run: () => open(person.linkedin, '_blank', 'noopener') },
      ...projects.map((p) => ({
        group: 'Projects',
        label: p.name,
        hint: p.host,
        icon: 'out',
        run: () => open(p.url, '_blank', 'noopener'),
      })),
      ...notes.slice(0, 5).map((n) => ({
        group: 'Notes',
        label: n.title,
        hint: n.dateLabel,
        icon: 'book',
        run: () => navigate(`/notes/${n.slug}`),
      })),
    ],
    []
  )
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false)
  const [q, setQ] = useState('')
  const [active, setActive] = useState(0)
  const [flash, setFlash] = useState('')
  const input = useRef(null)
  const list = useRef(null)
  const returnTo = useRef(null)
  const items = useItems()

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (!s) return items
    return items.filter((it) => `${it.label} ${it.hint} ${it.group}`.toLowerCase().includes(s))
  }, [q, items])

  useEffect(() => {
    const onOpen = () => {
      returnTo.current = document.activeElement
      setOpen(true)
    }
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((o) => {
          if (!o) returnTo.current = document.activeElement
          return !o
        })
      }
    }
    addEventListener('palette:open', onOpen)
    addEventListener('keydown', onKey)
    return () => {
      removeEventListener('palette:open', onOpen)
      removeEventListener('keydown', onKey)
    }
  }, [])

  useEffect(() => {
    if (open) {
      setQ('')
      setActive(0)
      setFlash('')
      requestAnimationFrame(() => input.current?.focus())
      document.documentElement.style.overflow = 'hidden'
    } else {
      document.documentElement.style.overflow = ''
      returnTo.current?.focus?.()
    }
  }, [open])

  useEffect(() => setActive(0), [q])

  useEffect(() => {
    list.current?.querySelector('[data-active="true"]')?.scrollIntoView({ block: 'nearest' })
  }, [active])

  if (!open) return null

  const choose = (it) => {
    if (!it) return
    if (it.group === 'Do' && it.label.startsWith('Copy')) {
      it.run((msg) => {
        setFlash(msg)
        setTimeout(() => setOpen(false), 700)
      })
      return
    }
    setOpen(false)
    it.run()
  }

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(shown.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(shown[active])
    } else if (e.key === 'Tab') {
      e.preventDefault()
    }
  }

  let lastGroup = null
  return (
    <div className="kbar-scrim" onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}>
      <div className="kbar glass" role="dialog" aria-modal="true" aria-label="Jump to anything" onKeyDown={onKeyDown}>
        <div className="kbar-input">
          <Icon name="search" size={18} />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search projects, pages and actions"
            role="combobox"
            aria-expanded="true"
            aria-controls="kbar-list"
            aria-activedescendant={shown[active] ? `kbar-${active}` : undefined}
            autoComplete="off"
            spellCheck="false"
          />
          <kbd>Esc</kbd>
        </div>
        <ul className="kbar-list" id="kbar-list" role="listbox" ref={list}>
          {shown.length === 0 && <li className="kbar-empty">Nothing matches “{q}”. Try a project name.</li>}
          {shown.map((it, n) => {
            const head = it.group !== lastGroup ? it.group : null
            lastGroup = it.group
            return (
              <li key={it.group + it.label} role="presentation">
                {head && <div className="kbar-group small" role="presentation">{head}</div>}
                <div
                  id={`kbar-${n}`}
                  role="option"
                  aria-selected={n === active}
                  data-active={n === active}
                  className="kbar-item"
                  onMouseMove={() => setActive(n)}
                  onClick={() => choose(it)}
                >
                  <Icon name={it.icon} size={16} />
                  <span className="kbar-label">{it.label}</span>
                  <span className="kbar-hint small">{it.hint}</span>
                </div>
              </li>
            )
          })}
        </ul>
        <div className="kbar-foot small" aria-live="polite">
          {flash || 'Arrows to move, Enter to open'}
        </div>
      </div>
    </div>
  )
}
