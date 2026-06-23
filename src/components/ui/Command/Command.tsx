import { forwardRef, useId, useMemo, useState } from 'react'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CommandItem {
  /** Stable value / React key. */
  value: string
  /** Visible label. */
  label: string
  /** Optional leading icon. */
  icon?: ReactNode
  /** Optional trailing hint (e.g. a shortcut). */
  shortcut?: ReactNode
  /** Group heading this item belongs to. */
  group?: string
  /** Extra terms to match when filtering. */
  keywords?: string[]
  /** Disable selection. */
  disabled?: boolean
  /** Called when chosen. */
  onSelect?: () => void
}

export interface CommandProps {
  /** Command entries. */
  items: CommandItem[]
  /** Search field placeholder. */
  placeholder?: string
  /** Shown when nothing matches. Defaults to "No results". */
  emptyText?: string
  /** Accessible label for the search field. Defaults to "Command". */
  label?: string
  /** Merged onto the outer container. */
  className?: string
}

/**
 * A command palette: a search field over a grouped, filterable list. Filters by
 * label + keywords; Arrow keys move the active item across groups, Enter runs it
 * (`onSelect`). Built inline (drop it into a Dialog for the classic ⌘K overlay).
 * Wires `role="combobox"`/`listbox`/`option` with `aria-activedescendant`.
 */
export const Command = forwardRef<HTMLInputElement, CommandProps>(function Command(
  { items, placeholder = 'Type a command or search…', emptyText = 'No results', label = 'Command', className },
  ref,
) {
  const id = useId()
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter((item) => {
      const haystack = [item.label, ...(item.keywords ?? [])].join(' ').toLowerCase()
      return haystack.includes(q)
    })
  }, [items, query])

  // Group the filtered list while keeping a flat index for keyboard navigation.
  const groups = useMemo(() => {
    const map = new Map<string, { item: CommandItem; index: number }[]>()
    filtered.forEach((item, index) => {
      const key = item.group ?? ''
      const arr = map.get(key) ?? []
      arr.push({ item, index })
      map.set(key, arr)
    })
    return Array.from(map.entries())
  }, [filtered])

  function moveActive(direction: 1 | -1) {
    const count = filtered.length
    if (count === 0) return
    let index = activeIndex
    for (let step = 0; step < count; step += 1) {
      index = (index + direction + count) % count
      if (!filtered[index].disabled) {
        setActiveIndex(index)
        return
      }
    }
  }

  function run(item: CommandItem) {
    if (item.disabled) return
    item.onSelect?.()
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Enter':
        if (filtered[activeIndex]) {
          event.preventDefault()
          run(filtered[activeIndex])
        }
        break
      default:
        break
    }
  }

  return (
    <div className={twMerge('flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-zinc-800 dark:bg-zinc-900', className)}>
      <div className="flex items-center gap-2 border-b border-slate-200 px-3 dark:border-zinc-800">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-slate-400">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          ref={ref}
          type="text"
          role="combobox"
          aria-expanded="true"
          aria-controls={`${id}-list`}
          aria-activedescendant={filtered[activeIndex] ? `${id}-opt-${activeIndex}` : undefined}
          aria-label={label}
          autoComplete="off"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setActiveIndex(0)
          }}
          onKeyDown={onKeyDown}
          className="h-11 w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-faint dark:placeholder:text-zinc-500"
        />
      </div>

      <ul id={`${id}-list`} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto p-1">
        {filtered.length === 0 ? (
          <li className="px-3 py-6 text-center text-sm text-faint">{emptyText}</li>
        ) : (
          groups.map(([group, entries]) => (
            <li key={group || '_'}>
              {group ? <div className="px-2 pt-2 pb-1 text-xs font-medium text-faint">{group}</div> : null}
              <ul>
                {entries.map(({ item, index }) => (
                  <li
                    key={item.value}
                    id={`${id}-opt-${index}`}
                    role="option"
                    aria-selected={index === activeIndex}
                    aria-disabled={item.disabled}
                    onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      run(item)
                    }}
                    className={twMerge(
                      'flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm text-slate-700 transition-[color,background-color] dark:text-zinc-300',
                      index === activeIndex && !item.disabled ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white' : null,
                      item.disabled ? 'cursor-not-allowed opacity-50' : null,
                    )}
                  >
                    {item.icon ? <span className="shrink-0 text-faint">{item.icon}</span> : null}
                    <span className="min-w-0 flex-1 truncate">{item.label}</span>
                    {item.shortcut ? <span className="shrink-0 text-xs text-faint">{item.shortcut}</span> : null}
                  </li>
                ))}
              </ul>
            </li>
          ))
        )}
      </ul>
    </div>
  )
})
