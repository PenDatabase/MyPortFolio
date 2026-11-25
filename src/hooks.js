import { useEffect, useRef, useState } from 'react'

// Reveal once when the element scrolls into view.
export function useReveal() {
  const ref = useRef(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.dataset.reveal = 'out'
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = 'in'
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return ref
}

const lagos = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Africa/Lagos',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

// Lagos time, updated on the minute.
export function useLagosTime() {
  const [time, setTime] = useState(() => lagos.format(new Date()))
  useEffect(() => {
    let t
    const tick = () => {
      setTime(lagos.format(new Date()))
      t = setTimeout(tick, 60000 - (Date.now() % 60000) + 20)
    }
    t = setTimeout(tick, 60000 - (Date.now() % 60000) + 20)
    return () => clearTimeout(t)
  }, [])
  return time
}
