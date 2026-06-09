import { forwardRef, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TabItem {
  /** Stable, unique identifier (the controlled value). */
  value: string
  /** Tab label rendered in the tablist. */
  label: ReactNode
  /** Panel content shown when the tab is selected. */
  content: ReactNode
  /** Disable this tab. */
  disabled?: boolean
}

export type TabsVariant = 'underline' | 'pill'

export interface TabsProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  /** The tabs to render. */
  items: TabItem[]
  /** Visual style: underlined (default) or button/pill with a filled active state. */
  variant?: TabsVariant
  /** Controlled selected value. Pair with `onValueChange`. */
  value?: string
  /** Uncontrolled initial value. Defaults to the first enabled tab. */
  defaultValue?: string
  /** Fires with the next selected value. */
  onValueChange?: (value: string) => void
}

const tabBase =
  'relative z-10 shrink-0 text-sm font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500/40 disabled:cursor-not-allowed disabled:opacity-50'

// Per-variant classes. The moving indicator supplies the active underline / pill,
// so the tabs themselves only switch text colour.
const VARIANTS: Record<
  TabsVariant,
  { list: string; tab: string; selected: string; idle: string; indicator: string }
> = {
  underline: {
    list: 'border-b border-slate-200 dark:border-zinc-800',
    tab: 'px-3 py-2',
    selected: 'text-indigo-600 dark:text-indigo-400',
    idle: 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100',
    indicator: 'bottom-0 h-0.5 rounded-full bg-indigo-500 dark:bg-indigo-400',
  },
  pill: {
    list: '',
    tab: 'rounded-md px-3 py-1.5',
    selected: 'text-slate-900 dark:text-white',
    idle: 'text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100',
    indicator: 'inset-y-0 rounded-md bg-slate-100 dark:bg-zinc-800',
  },
}

/**
 * Data-driven, WAI-ARIA tabs: pass `items={[{ value, label, content }]}`. Renders
 * a `role="tablist"` of `role="tab"` buttons plus a `role="tabpanel"` per item,
 * with correct aria wiring. Roving tabindex + arrow-key navigation (Home/End too)
 * move selection between enabled tabs; the arrow direction flips automatically in
 * RTL. An indicator glides under/behind the active tab (measured from layout, so
 * it animates with transform/width). `variant`: "underline" (default) or "pill".
 * Controlled (`value` + `onValueChange`) or uncontrolled (`defaultValue`).
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { items, variant = 'underline', value, defaultValue, onValueChange, className, ...rest },
  ref,
) {
  const baseId = useId()
  const isControlled = value !== undefined
  const firstEnabled = items.find((item) => !item.disabled)?.value ?? items[0]?.value ?? ''
  const [internal, setInternal] = useState(defaultValue ?? firstEnabled)
  const selected = isControlled ? (value ?? '') : internal

  const styles = VARIANTS[variant]
  const listRef = useRef<HTMLDivElement | null>(null)
  const tabsRef = useRef<Array<HTMLButtonElement | null>>([])
  const currentIndex = Math.max(0, items.findIndex((item) => item.value === selected))

  // Measured geometry of the active tab so the indicator can glide between tabs.
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)

  function measure() {
    const tab = tabsRef.current[currentIndex]
    if (!tab) return
    const next = { left: tab.offsetLeft, width: tab.offsetWidth }
    setIndicator((prev) => (prev && prev.left === next.left && prev.width === next.width ? prev : next))
  }

  // Re-measure after every render (covers selection, variant and label/length
  // changes — e.g. switching language); the guard above stops a render loop.
  useLayoutEffect(measure)

  // Re-measure on resize, when no re-render would otherwise trigger it.
  useEffect(() => {
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex])

  function select(next: string) {
    if (!isControlled) setInternal(next)
    onValueChange?.(next)
  }

  function activate(index: number) {
    const item = items[index]
    if (!item) return
    select(item.value)
    tabsRef.current[index]?.focus()
  }

  function moveByOffset(direction: 1 | -1) {
    const count = items.length
    for (let step = 1; step <= count; step++) {
      const index = (((currentIndex + direction * step) % count) + count) % count
      if (!items[index].disabled) {
        activate(index)
        return
      }
    }
  }

  function moveToEdge(edge: 'first' | 'last') {
    const count = items.length
    for (let i = 0; i < count; i++) {
      const index = edge === 'first' ? i : count - 1 - i
      if (!items[index].disabled) {
        activate(index)
        return
      }
    }
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Home') {
      event.preventDefault()
      moveToEdge('first')
      return
    }
    if (event.key === 'End') {
      event.preventDefault()
      moveToEdge('last')
      return
    }

    let direction: 1 | -1 | 0 = 0
    if (event.key === 'ArrowRight') direction = 1
    else if (event.key === 'ArrowLeft') direction = -1
    if (direction === 0) return

    event.preventDefault()
    // In RTL the visual order is mirrored, so flip what Left/Right mean.
    const rtl = listRef.current ? getComputedStyle(listRef.current).direction === 'rtl' : false
    moveByOffset((rtl ? -direction : direction) as 1 | -1)
  }

  return (
    <div ref={ref} className={twMerge('flex flex-col gap-4', className)} {...rest}>
      <div
        ref={listRef}
        role="tablist"
        aria-orientation="horizontal"
        onKeyDown={handleKeyDown}
        className={twMerge('relative flex items-center gap-1 overflow-x-auto', styles.list)}
      >
        {indicator ? (
          <span
            aria-hidden="true"
            className={twMerge(
              'pointer-events-none absolute left-0 transition-all duration-200 ease-out motion-reduce:transition-none',
              styles.indicator,
            )}
            style={{ transform: `translateX(${indicator.left}px)`, width: `${indicator.width}px` }}
          />
        ) : null}

        {items.map((item, index) => {
          const isSelected = item.value === selected
          return (
            <button
              key={item.value}
              ref={(element) => {
                tabsRef.current[index] = element
              }}
              type="button"
              role="tab"
              id={`${baseId}-tab-${index}`}
              aria-selected={isSelected}
              aria-controls={`${baseId}-panel-${index}`}
              tabIndex={isSelected ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.value)}
              className={twMerge(tabBase, styles.tab, isSelected ? styles.selected : styles.idle)}
            >
              {item.label}
            </button>
          )
        })}
      </div>

      {items.map((item, index) => (
        <div
          key={item.value}
          role="tabpanel"
          id={`${baseId}-panel-${index}`}
          aria-labelledby={`${baseId}-tab-${index}`}
          hidden={item.value !== selected}
          tabIndex={0}
          className="text-sm text-slate-700 outline-none dark:text-zinc-300"
        >
          {item.content}
        </div>
      ))}
    </div>
  )
})
