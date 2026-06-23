import { forwardRef, useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface MenubarItem {
  /** Item label. */
  label: ReactNode
  /** Called when chosen. */
  onSelect?: () => void
  /** Disable this item. */
  disabled?: boolean
}

export interface MenubarMenu {
  /** Top-level trigger text. */
  label: string
  /** Items in this menu. */
  items: MenubarItem[]
}

export interface MenubarProps {
  /** The top-level menus. */
  menus: MenubarMenu[]
  /** Merged onto the menubar container. */
  className?: string
}

type Position = { top: number; left?: number; right?: number }

const triggerClass =
  'rounded-md px-3 py-1.5 text-sm font-medium text-slate-700 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:bg-slate-100 focus-visible:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary-500/40 active:scale-[0.98] data-[open=true]:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:focus-visible:bg-zinc-800 dark:data-[open=true]:bg-zinc-800'

/**
 * A desktop-style menubar: a row of menus, each opening a dropdown. One menu is
 * open at a time; hovering another switches to it. Keyboard follows the ARIA
 * menubar pattern — Left/Right move between menus, Down opens and focuses the
 * first item, Up/Down rove items, Enter selects, Escape closes. The open menu is
 * portal-rendered so it never clips.
 */
export const Menubar = forwardRef<HTMLDivElement, MenubarProps>(function Menubar({ menus, className }, ref) {
  const id = useId()
  const [openIndex, setOpenIndex] = useState(-1)
  const [activeItem, setActiveItem] = useState(-1)
  const [position, setPosition] = useState<Position | null>(null)

  const triggerRefs = useRef<Array<HTMLButtonElement | null>>([])
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const firstEnabled = (menu: MenubarMenu) => menu.items.findIndex((i) => !i.disabled)

  function positionFor(index: number): Position | null {
    const node = triggerRefs.current[index]
    if (!node) return null
    const rect = node.getBoundingClientRect()
    // RTL: anchor the menu to the trigger's right edge so it opens toward the left.
    const rtl = getComputedStyle(node).direction === 'rtl'
    return rtl
      ? { top: rect.bottom + 4, right: Math.max(8, window.innerWidth - rect.right) }
      : { top: rect.bottom + 4, left: Math.max(8, rect.left) }
  }

  function openMenu(index: number, focusItem: number) {
    setPosition(positionFor(index))
    setOpenIndex(index)
    setActiveItem(focusItem)
  }

  function close(focusTrigger: boolean) {
    const wasOpen = openIndex
    setOpenIndex(-1)
    setActiveItem(-1)
    if (focusTrigger && wasOpen >= 0) triggerRefs.current[wasOpen]?.focus()
  }

  useEffect(() => {
    if (openIndex >= 0 && activeItem >= 0) itemRefs.current[activeItem]?.focus()
  }, [openIndex, activeItem])

  useEffect(() => {
    if (openIndex < 0) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (triggerRefs.current[openIndex]?.contains(target)) return
      if (document.getElementById(`${id}-menu`)?.contains(target)) return
      setOpenIndex(-1)
      setActiveItem(-1)
    }
    function reposition() {
      setPosition(positionFor(openIndex))
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
  }, [openIndex])

  function moveMenu(direction: 1 | -1) {
    const count = menus.length
    const next = (openIndex + direction + count) % count
    if (openIndex >= 0) openMenu(next, firstEnabled(menus[next]))
    else triggerRefs.current[next]?.focus()
  }

  function moveItem(direction: 1 | -1) {
    const items = menus[openIndex].items
    const count = items.length
    let index = activeItem
    for (let step = 0; step < count; step += 1) {
      index = (index + direction + count) % count
      if (!items[index].disabled) {
        setActiveItem(index)
        return
      }
    }
  }

  function onTriggerKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, index: number) {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault()
        triggerRefs.current[(index + 1) % menus.length]?.focus()
        break
      case 'ArrowLeft':
        event.preventDefault()
        triggerRefs.current[(index - 1 + menus.length) % menus.length]?.focus()
        break
      case 'ArrowDown':
      case 'Enter':
      case ' ':
        event.preventDefault()
        openMenu(index, firstEnabled(menus[index]))
        break
      case 'Escape':
        if (openIndex === index) {
          event.preventDefault()
          close(true)
        }
        break
      default:
        break
    }
  }

  function onMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveItem(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveItem(-1)
        break
      case 'ArrowRight':
        event.preventDefault()
        moveMenu(1)
        break
      case 'ArrowLeft':
        event.preventDefault()
        moveMenu(-1)
        break
      case 'Enter':
      case ' ': {
        event.preventDefault()
        const item = menus[openIndex].items[activeItem]
        if (item && !item.disabled) {
          item.onSelect?.()
          close(true)
        }
        break
      }
      case 'Escape':
        event.preventDefault()
        close(true)
        break
      default:
        break
    }
  }

  return (
    <>
      <div ref={ref} role="menubar" className={twMerge('inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1 dark:border-zinc-800 dark:bg-zinc-900', className)}>
        {menus.map((menu, index) => (
          <button
            key={menu.label}
            ref={(node) => {
              triggerRefs.current[index] = node
            }}
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={openIndex === index}
            data-open={openIndex === index}
            tabIndex={openIndex < 0 && index === 0 ? 0 : openIndex === index ? 0 : -1}
            onClick={() => (openIndex === index ? close(false) : openMenu(index, -1))}
            onMouseEnter={() => openIndex >= 0 && openIndex !== index && openMenu(index, -1)}
            onKeyDown={(event) => onTriggerKeyDown(event, index)}
            className={triggerClass}
          >
            {menu.label}
          </button>
        ))}
      </div>

      {openIndex >= 0 && position
        ? createPortal(
            <div
              id={`${id}-menu`}
              role="menu"
              aria-label={menus[openIndex].label}
              onKeyDown={onMenuKeyDown}
              style={{ top: position.top, left: position.left, right: position.right }}
              className="fixed z-50 min-w-44 rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10"
            >
              {menus[openIndex].items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  ref={(node) => {
                    itemRefs.current[itemIndex] = node
                  }}
                  type="button"
                  role="menuitem"
                  tabIndex={itemIndex === activeItem ? 0 : -1}
                  disabled={item.disabled}
                  onMouseEnter={() => !item.disabled && setActiveItem(itemIndex)}
                  onClick={() => {
                    if (item.disabled) return
                    item.onSelect?.()
                    close(true)
                  }}
                  className={twMerge(
                    'flex w-full items-center rounded-md px-3 py-2 text-start text-sm text-slate-700 outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-primary-500/40 disabled:cursor-not-allowed disabled:opacity-50 dark:text-zinc-300',
                    itemIndex === activeItem && !item.disabled ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white' : null,
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
