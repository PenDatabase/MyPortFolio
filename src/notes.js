import { marked } from 'marked'

// Every Markdown file in /content/notes becomes a note. The filename is the slug.
const files = import.meta.glob('/content/notes/*.md', { query: '?raw', import: 'default', eager: true })

function parse(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  const data = {}
  if (!m) return { data, body: raw }
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.*)$/)
    if (kv) data[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, '')
  }
  return { data, body: m[2] }
}

const fmt = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

export const notes = Object.entries(files)
  .map(([path, raw]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '')
    const { data, body } = parse(raw)
    const date = data.date || '1970-01-01'
    return {
      slug,
      title: data.title || slug.replace(/-/g, ' '),
      date,
      dateLabel: fmt.format(new Date(date + 'T00:00:00Z')),
      html: marked.parse(body),
    }
  })
  .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.title.localeCompare(b.title)))

export const getNote = (slug) => notes.find((n) => n.slug === slug)
