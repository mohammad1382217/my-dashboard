import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface NavigationMenuLink {
  label: ReactNode
  href?: string
  description?: ReactNode
}

export interface NavigationMenuEntry {
  /** Trigger label. */
  label: string
  /** Plain link target (when the entry has no dropdown). */
  href?: string
  /** Dropdown content: a list of links, or arbitrary nodes. */
  content?: NavigationMenuLink[] | ReactNode
}

export interface NavigationMenuProps {
  /** Top-level entries. */
  items: NavigationMenuEntry[]
  /** Accessible name for the nav landmark. Defaults to "Main". */
  label?: string
  /** Merged onto the nav container. */
  className?: string
}

type Position = { top: number; left: number }

const triggerClass =
  'inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-slate-700 outline-none transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 data-[open=true]:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800 dark:data-[open=true]:bg-zinc-800'

function isLinkList(content: NavigationMenuEntry['content']): content is NavigationMenuLink[] {
  return Array.isArray(content)
}

/**
 * A site navigation bar where entries can open a dropdown panel on hover or
 * focus (a close delay lets the pointer reach the panel). Entries with only an
 * `href` render as plain links. Panels are portal-rendered (clip-safe) and close
 * on Escape or outside interaction. Provide panel content as a link list or any
 * node.
 */
export const NavigationMenu = forwardRef<HTMLElement, NavigationMenuProps>(function NavigationMenu(
  { items, label = 'Main', className },
  ref,
) {
  const id = useId()
  const [openIndex, setOpenIndex] = useState(-1)
  const [position, setPosition] = useState<Position | null>(null)
  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const timer = useRef<number | undefined>(undefined)

  function positionFor(index: number): Position | null {
    const node = triggerRefs.current[index]
    if (!node) return null
    const rect = node.getBoundingClientRect()
    return { top: rect.bottom + 6, left: rect.left }
  }

  function open(index: number) {
    window.clearTimeout(timer.current)
    setPosition(positionFor(index))
    setOpenIndex(index)
  }
  function scheduleClose() {
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setOpenIndex(-1), 150)
  }
  function closeNow() {
    window.clearTimeout(timer.current)
    setOpenIndex(-1)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  useEffect(() => {
    if (openIndex < 0) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (triggerRefs.current[openIndex]?.contains(target)) return
      if (document.getElementById(`${id}-panel`)?.contains(target)) return
      setOpenIndex(-1)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openIndex])

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      open(index)
    } else if (event.key === 'Escape') {
      closeNow()
    } else if (event.key === 'ArrowRight') {
      event.preventDefault()
      triggerRefs.current[(index + 1) % items.length]?.focus()
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault()
      triggerRefs.current[(index - 1 + items.length) % items.length]?.focus()
    }
  }

  const openContent = openIndex >= 0 ? items[openIndex].content : undefined

  return (
    <nav ref={ref} aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {items.map((entry, index) => (
          <li key={entry.label} onMouseEnter={() => entry.content && open(index)} onMouseLeave={scheduleClose}>
            {entry.content ? (
              <button
                ref={(node) => {
                  triggerRefs.current[index] = node
                }}
                type="button"
                aria-haspopup="true"
                aria-expanded={openIndex === index}
                data-open={openIndex === index}
                onClick={() => open(index)}
                onKeyDown={(event) => onTriggerKeyDown(event, index)}
                className={triggerClass}
              >
                {entry.label}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={twMerge('text-slate-400 transition-transform duration-200', openIndex === index ? 'transform-[rotate(180deg)]' : 'transform-[rotate(0deg)]')}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
            ) : (
              <a href={entry.href} className={triggerClass}>
                {entry.label}
              </a>
            )}
          </li>
        ))}
      </ul>

      {openIndex >= 0 && position && openContent
        ? createPortal(
            <div
              id={`${id}-panel`}
              onMouseEnter={() => window.clearTimeout(timer.current)}
              onMouseLeave={scheduleClose}
              style={{ top: position.top, left: position.left }}
              className="fixed z-50 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {isLinkList(openContent) ? (
                <ul className="flex flex-col">
                  {openContent.map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="block rounded-lg p-3 outline-none transition-colors hover:bg-slate-100 focus-visible:bg-slate-100 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800">
                        <span className="block text-sm font-medium text-slate-900 dark:text-zinc-100">{link.label}</span>
                        {link.description ? <span className="mt-0.5 block text-xs text-slate-500 dark:text-zinc-400">{link.description}</span> : null}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                openContent
              )}
            </div>,
            document.body,
          )
        : null}
    </nav>
  )
})
