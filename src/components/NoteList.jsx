import { Link } from '../router.jsx'

function Face({ n }) {
  return (
    <span className="note-face">
      <time className="date caption" dateTime={n.date}>{n.dateLabel}</time>
      <span className="title subheading">{n.title}</span>
    </span>
  )
}

export default function NoteList({ items }) {
  return (
    <ul className="note-list">
      {items.map((n) => (
        <li key={n.slug}>
          <Link href={`/notes/${n.slug}`} data-cursor="Read">
            <Face n={n} />
            <span className="row-ink" aria-hidden="true">
              <Face n={n} />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
