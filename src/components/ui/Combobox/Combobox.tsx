import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ComboboxOption {
  value: string
  label: string
  disabled?: boolean
}

export interface ComboboxProps {
  /** The selectable options. */
  options: ComboboxOption[]
  /** Controlled selected value. */
  value?: string | null
  /** Uncontrolled initial value. */
  defaultValue?: string | null
  /** Fires with the next value (or null if cleared by re-selecting). */
  onChange?: (value: string | null) => void
  /** Placeholder for the text field. */
  placeholder?: string
  /** Shown when the filter matches nothing. Defaults to "No results". */
  emptyText?: string
  /** Disable the whole control. */
  disabled?: boolean
  /** Merged onto the input. */
  className?: string
}

type Position = { top: number; left: number; width: number }

const inputClass =
  'h-10 w-full rounded-md border border-slate-300 bg-white ps-3 pe-9 text-sm text-slate-900 outline-none transition-[color,background-color,border-color,box-shadow,transform] placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500'

/**
 * A text field paired with a filterable listbox (the autocomplete/combobox
 * pattern). Type to filter; Arrow keys move the active option, Enter selects,
 * Escape closes. The listbox is portal-rendered (so it never clips) and wires
 * `role="combobox"`/`listbox`/`option` with `aria-activedescendant`.
 */
export const Combobox = forwardRef<HTMLInputElement, ComboboxProps>(function Combobox(
  { options, value, defaultValue, onChange, placeholder, emptyText = 'No results', disabled, className },
  ref,
) {
  const id = useId()
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<string | null>(defaultValue ?? null)
  const selectedValue = isControlled ? value : internalValue
  const selectedLabel = options.find((o) => o.value === selectedValue)?.label ?? ''

  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searching, setSearching] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [position, setPosition] = useState<Position | null>(null)

  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  useImperativeHandle(ref, () => inputRef.current as HTMLInputElement, [])

  const filtered =
    searching && query ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase())) : options

  function computePosition(): Position | null {
    const node = inputRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    return { top: rect.bottom + 4, left: rect.left, width: rect.width }
  }

  function openList(reset: boolean) {
    if (disabled) return
    if (reset) setSearching(false)
    setPosition(computePosition())
    setActiveIndex(Math.max(0, filtered.findIndex((o) => o.value === selectedValue)))
    setOpen(true)
  }

  function close() {
    setOpen(false)
    setSearching(false)
    setQuery('')
  }

  function commit(option: ComboboxOption) {
    if (option.disabled) return
    if (!isControlled) setInternalValue(option.value)
    onChange?.(option.value)
    setQuery('')
    setSearching(false)
    setOpen(false)
    inputRef.current?.focus()
  }

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (inputRef.current?.contains(target) || listRef.current?.contains(target)) return
      close()
    }
    function reposition() {
      setPosition(computePosition())
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

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

  function onKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openList(true)
        else moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) openList(true)
        else moveActive(-1)
        break
      case 'Enter':
        if (open && filtered[activeIndex]) {
          event.preventDefault()
          commit(filtered[activeIndex])
        }
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          close()
        }
        break
      default:
        break
    }
  }

  const activeId = open && filtered[activeIndex] ? `${id}-opt-${activeIndex}` : undefined

  return (
    <div className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={activeId}
        disabled={disabled}
        placeholder={placeholder}
        value={open ? query || (searching ? '' : selectedLabel) : selectedLabel}
        onChange={(e) => {
          setQuery(e.target.value)
          setSearching(true)
          setActiveIndex(0)
          if (!open) openList(false)
        }}
        onFocus={() => openList(true)}
        onKeyDown={onKeyDown}
        className={twMerge(inputClass, className)}
      />
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="pointer-events-none absolute end-3 top-1/2 transform-[translateY(-50%)] text-slate-400"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>

      {open && position
        ? createPortal(
            <ul
              ref={listRef}
              id={`${id}-listbox`}
              role="listbox"
              style={{ top: position.top, left: position.left, width: position.width }}
              className="fixed z-50 max-h-60 overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10"
            >
              {filtered.length === 0 ? (
                <li className="px-3 py-2 text-sm text-faint">{emptyText}</li>
              ) : (
                filtered.map((option, index) => (
                  <li
                    key={option.value}
                    id={`${id}-opt-${index}`}
                    role="option"
                    aria-selected={option.value === selectedValue}
                    aria-disabled={option.disabled}
                    onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                    onMouseDown={(e) => {
                      e.preventDefault()
                      commit(option)
                    }}
                    className={twMerge(
                      'flex cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm text-slate-700 transition-[color,background-color] dark:text-zinc-300',
                      index === activeIndex && !option.disabled ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white' : null,
                      option.disabled ? 'cursor-not-allowed opacity-50' : null,
                    )}
                  >
                    {option.label}
                    {option.value === selectedValue ? (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="text-primary-600 dark:text-primary-400">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    ) : null}
                  </li>
                ))
              )}
            </ul>,
            document.body,
          )
        : null}
    </div>
  )
})
