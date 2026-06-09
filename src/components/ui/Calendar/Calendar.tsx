import { forwardRef, useState } from 'react'
import type { ComponentPropsWithoutRef, KeyboardEvent as ReactKeyboardEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CalendarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  /** Controlled selected date. */
  value?: Date | null
  /** Uncontrolled initial selection. */
  defaultValue?: Date | null
  /** Fires with the chosen date. */
  onChange?: (date: Date) => void
  /** Month to show first (uncontrolled). Defaults to the selection or today. */
  defaultMonth?: Date
  /** Earliest selectable day (inclusive). */
  min?: Date
  /** Latest selectable day (inclusive). */
  max?: Date
  /** First column of the week: 0 Sun, 1 Mon, 6 Sat. Defaults to 0. */
  weekStartsOn?: 0 | 1 | 6
  /** BCP-47 locale for month/weekday names. Defaults to "en-US". */
  locale?: string
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()
}
function addMonths(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth() + n, 1)
}
function addDays(d: Date, n: number) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
}

const navBtn =
  'inline-flex size-8 items-center justify-center rounded-md text-slate-500 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:text-zinc-400 dark:hover:bg-zinc-800'

/**
 * A Gregorian month calendar with single-date selection. Controlled via `value`
 * + `onChange` or uncontrolled via `defaultValue`. Month/weekday names come from
 * `Intl` (`locale`), so it's self-contained. Follows the ARIA grid pattern:
 * roving focus, arrow keys move day-by-day (crossing months), Home/End jump to
 * the week edges, PageUp/PageDown change month. `min`/`max` disable out-of-range
 * days. The chevrons flip in RTL.
 */
export const Calendar = forwardRef<HTMLDivElement, CalendarProps>(function Calendar(
  { value, defaultValue, onChange, defaultMonth, min, max, weekStartsOn = 0, locale = 'en-US', className, ...props },
  ref,
) {
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState<Date | null>(defaultValue ?? null)
  const selected = isControlled ? value : internalValue

  const initialMonth = defaultMonth ?? selected ?? new Date()
  const [month, setMonth] = useState<Date>(new Date(initialMonth.getFullYear(), initialMonth.getMonth(), 1))
  const [focused, setFocused] = useState<Date>(startOfDay(selected ?? initialMonth))

  const today = startOfDay(new Date())
  const minDay = min ? startOfDay(min) : null
  const maxDay = max ? startOfDay(max) : null

  function isDisabled(day: Date) {
    if (minDay && day < minDay) return true
    if (maxDay && day > maxDay) return true
    return false
  }

  function select(day: Date) {
    if (isDisabled(day)) return
    if (!isControlled) setInternalValue(day)
    setFocused(day)
    onChange?.(day)
  }

  function goToMonth(next: Date) {
    setMonth(new Date(next.getFullYear(), next.getMonth(), 1))
  }

  // Weekday header labels in the chosen locale, ordered from weekStartsOn.
  const weekdayFmt = new Intl.DateTimeFormat(locale, { weekday: 'short' })
  const weekdays = Array.from({ length: 7 }, (_, i) => {
    // 2023-01-01 is a Sunday; offset to the desired weekday.
    const ref0 = new Date(2023, 0, 1 + ((weekStartsOn + i) % 7))
    return weekdayFmt.format(ref0)
  })

  const titleFmt = new Intl.DateTimeFormat(locale, { month: 'long', year: 'numeric' })

  // Build the day grid (leading blanks + days, padded to whole weeks).
  const first = new Date(month.getFullYear(), month.getMonth(), 1)
  const leading = (first.getDay() - weekStartsOn + 7) % 7
  const total = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
  const cells: (Date | null)[] = []
  for (let i = 0; i < leading; i += 1) cells.push(null)
  for (let d = 1; d <= total; d += 1) cells.push(new Date(month.getFullYear(), month.getMonth(), d))
  while (cells.length % 7 !== 0) cells.push(null)

  function moveFocus(next: Date, event: ReactKeyboardEvent<HTMLButtonElement>) {
    event.preventDefault()
    setFocused(next)
    if (next.getMonth() !== month.getMonth() || next.getFullYear() !== month.getFullYear()) goToMonth(next)
    // Focus the new day button after the grid re-renders.
    const iso = `${next.getFullYear()}-${next.getMonth()}-${next.getDate()}`
    requestAnimationFrame(() => {
      const el = document.querySelector<HTMLButtonElement>(`[data-day="${iso}"]`)
      el?.focus()
    })
  }

  function onDayKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>, day: Date) {
    switch (event.key) {
      case 'ArrowLeft':
        moveFocus(addDays(day, -1), event)
        break
      case 'ArrowRight':
        moveFocus(addDays(day, 1), event)
        break
      case 'ArrowUp':
        moveFocus(addDays(day, -7), event)
        break
      case 'ArrowDown':
        moveFocus(addDays(day, 7), event)
        break
      case 'Home':
        moveFocus(addDays(day, -((day.getDay() - weekStartsOn + 7) % 7)), event)
        break
      case 'End':
        moveFocus(addDays(day, 6 - ((day.getDay() - weekStartsOn + 7) % 7)), event)
        break
      case 'PageUp':
        moveFocus(addMonths(day, -1), event)
        break
      case 'PageDown':
        moveFocus(addMonths(day, 1), event)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        select(day)
        break
      default:
        break
    }
  }

  return (
    <div
      ref={ref}
      className={twMerge('inline-block w-fit rounded-xl border border-slate-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900', className)}
      {...props}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <button type="button" aria-label="Previous month" onClick={() => goToMonth(addMonths(month, -1))} className={navBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div aria-live="polite" className="text-sm font-medium text-slate-900 dark:text-zinc-100">
          {titleFmt.format(month)}
        </div>
        <button type="button" aria-label="Next month" onClick={() => goToMonth(addMonths(month, 1))} className={navBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <table role="grid" className="border-collapse">
        <thead>
          <tr>
            {weekdays.map((w, i) => (
              <th key={i} scope="col" className="size-9 text-center text-xs font-normal text-slate-400 dark:text-zinc-500">
                {w}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: cells.length / 7 }, (_, week) => (
            <tr key={week}>
              {cells.slice(week * 7, week * 7 + 7).map((day, i) => {
                if (!day) return <td key={i} className="size-9 p-0" />
                const isSelected = selected ? isSameDay(day, selected) : false
                const isToday = isSameDay(day, today)
                const disabled = isDisabled(day)
                const isFocusTarget = isSameDay(day, focused)
                return (
                  <td key={i} className="p-0.5">
                    <button
                      type="button"
                      data-day={`${day.getFullYear()}-${day.getMonth()}-${day.getDate()}`}
                      tabIndex={isFocusTarget ? 0 : -1}
                      disabled={disabled}
                      aria-pressed={isSelected}
                      aria-current={isToday ? 'date' : undefined}
                      onClick={() => select(day)}
                      onKeyDown={(event) => onDayKeyDown(event, day)}
                      className={twMerge(
                        'inline-flex size-8 items-center justify-center rounded-md text-sm text-slate-700 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/40 disabled:pointer-events-none disabled:opacity-30 dark:text-zinc-300 dark:hover:bg-zinc-800',
                        isToday && !isSelected ? 'font-semibold text-indigo-600 dark:text-indigo-400' : null,
                        isSelected ? 'bg-indigo-600 text-white hover:bg-indigo-600 dark:bg-indigo-500 dark:text-white' : null,
                      )}
                    >
                      {day.getDate()}
                    </button>
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})
