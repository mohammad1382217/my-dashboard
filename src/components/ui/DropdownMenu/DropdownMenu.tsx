import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DropdownItem {
  /** Item label. */
  label: ReactNode
  /** Called when the item is chosen. */
  onSelect?: () => void
  /** Disable this item. */
  disabled?: boolean
}

export interface DropdownMenuProps {
  /** Trigger button content. */
  label: ReactNode
  /** The menu items. */
  items: DropdownItem[]
  /** Align the menu's start or end edge with the trigger. Defaults to "start". */
  align?: 'start' | 'end'
  /** Merged onto the trigger button. */
  className?: string
}

type Position = { top: number; left?: number; right?: number }

const triggerClass =
  'inline-flex items-center gap-1.5 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-900 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800'

/**
 * Accessible dropdown menu: a trigger button + a `role="menu"` of `role="menuitem"`
 * buttons rendered in a portal (so it never clips). Arrow keys move the roving
 * focus (skipping disabled items), Home/End jump, Enter/Space select, Escape and
 * Tab close (restoring focus to the trigger). Closes on outside click.
 */
export const DropdownMenu = forwardRef<HTMLButtonElement, DropdownMenuProps>(function DropdownMenu(
  { label, items, align = 'start', className },
  ref,
) {
  const id = useId()
  const [open, setOpen] = useState(false)
  const [position, setPosition] = useState<Position | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([])
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, [])

  const firstEnabled = () => items.findIndex((item) => !item.disabled)
  const lastEnabled = () => {
    for (let i = items.length - 1; i >= 0; i -= 1) if (!items[i].disabled) return i
    return -1
  }

  function computePosition(): Position | null {
    const trigger = triggerRef.current
    if (!trigger) return null
    const rect = trigger.getBoundingClientRect()
    const rtl = getComputedStyle(trigger).direction === 'rtl'
    const top = rect.bottom + 4
    const startSide = rtl ? { right: Math.max(8, window.innerWidth - rect.right) } : { left: Math.max(8, rect.left) }
    const endSide = rtl ? { left: Math.max(8, rect.left) } : { right: Math.max(8, window.innerWidth - rect.right) }
    return { top, ...(align === 'end' ? endSide : startSide) }
  }

  function openMenu(active: number) {
    setPosition(computePosition())
    setActiveIndex(active)
    setOpen(true)
  }

  function close(focusTrigger = true) {
    setOpen(false)
    if (focusTrigger) triggerRef.current?.focus()
  }

  function select(index: number) {
    const item = items[index]
    if (!item || item.disabled) return
    item.onSelect?.()
    close()
  }

  function moveActive(direction: 1 | -1) {
    const count = items.length
    let index = activeIndex
    for (let step = 0; step < count; step += 1) {
      index = (index + direction + count) % count
      if (!items[index].disabled) {
        setActiveIndex(index)
        return
      }
    }
  }

  // Focus the active item whenever it changes while open.
  useEffect(() => {
    if (open && activeIndex >= 0) itemsRef.current[activeIndex]?.focus()
  }, [open, activeIndex])

  // Close on outside pointer-down; keep the menu anchored on scroll/resize.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || menuRef.current?.contains(target)) return
      setOpen(false)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      openMenu(firstEnabled())
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(lastEnabled())
    }
  }

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveActive(-1)
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(firstEnabled())
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(lastEnabled())
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      case 'Tab':
        close(false)
        break
      default:
        break
    }
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        id={`${id}-trigger`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? `${id}-menu` : undefined}
        onClick={() => (open ? close() : openMenu(firstEnabled()))}
        onKeyDown={onTriggerKeyDown}
        className={twMerge(triggerClass, className)}
      >
        {label}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-slate-400">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && position
        ? createPortal(
            <div
              ref={menuRef}
              id={`${id}-menu`}
              role="menu"
              aria-orientation="vertical"
              aria-labelledby={`${id}-trigger`}
              onKeyDown={onMenuKeyDown}
              style={{ top: position.top, left: position.left, right: position.right }}
              className="fixed z-50 min-w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              {items.map((item, index) => (
                <button
                  key={index}
                  ref={(element) => {
                    itemsRef.current[index] = element
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={index === activeIndex ? 0 : -1}
                  disabled={item.disabled}
                  onClick={() => select(index)}
                  onMouseEnter={() => !item.disabled && setActiveIndex(index)}
                  className={twMerge(
                    'flex w-full items-center rounded-md px-3 py-2 text-start text-sm text-slate-700 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300',
                    index === activeIndex && !item.disabled ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white' : null,
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  )
})
