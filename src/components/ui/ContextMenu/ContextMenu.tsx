import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, MouseEvent as ReactMouseEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ContextMenuItem {
  /** Item label. */
  label: ReactNode
  /** Called when chosen. */
  onSelect?: () => void
  /** Disable this item. */
  disabled?: boolean
}

export interface ContextMenuProps {
  /** Items shown in the menu. */
  items: ContextMenuItem[]
  /** The area that responds to right-click / long-press context events. */
  children: ReactNode
  /** Merged onto the trigger wrapper. */
  className?: string
}

type Point = { x: number; y: number }

/**
 * A right-click (context) menu. Wrap any content; opening is driven by the
 * native `contextmenu` event, so it works with right-click and platform
 * long-press. The menu is portal-rendered at the cursor with full keyboard
 * navigation (arrows skip disabled items, Enter selects, Escape closes) and
 * closes on outside-click. Exposes `role="menu"`/`menuitem`.
 */
export const ContextMenu = forwardRef<HTMLDivElement, ContextMenuProps>(function ContextMenu(
  { items, children, className },
  ref,
) {
  const id = useId()
  const [point, setPoint] = useState<Point | null>(null)
  const [activeIndex, setActiveIndex] = useState(-1)
  const menuRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([])

  const open = point !== null
  const firstEnabled = () => items.findIndex((item) => !item.disabled)

  function onContextMenu(event: ReactMouseEvent<HTMLDivElement>) {
    event.preventDefault()
    setPoint({ x: event.clientX, y: event.clientY })
    setActiveIndex(firstEnabled())
  }

  function close() {
    setPoint(null)
    setActiveIndex(-1)
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

  useEffect(() => {
    if (open && activeIndex >= 0) itemsRef.current[activeIndex]?.focus()
  }, [open, activeIndex])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      if (menuRef.current?.contains(event.target as Node)) return
      close()
    }
    document.addEventListener('pointerdown', onPointerDown)
    window.addEventListener('resize', close)
    window.addEventListener('scroll', close, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('resize', close)
      window.removeEventListener('scroll', close, true)
    }
  }, [open])

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
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      default:
        break
    }
  }

  return (
    <>
      <div ref={ref} onContextMenu={onContextMenu} className={className}>
        {children}
      </div>

      {open
        ? createPortal(
            <div
              ref={menuRef}
              id={`${id}-menu`}
              role="menu"
              aria-orientation="vertical"
              onKeyDown={onMenuKeyDown}
              style={{ top: point.y, left: point.x }}
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
                    'flex w-full items-center rounded-md px-3 py-2 text-start text-sm text-slate-700 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300',
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
