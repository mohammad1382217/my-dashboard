import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ReactNode } from 'react'
import { jalaaliMonthLength, toGregorian, toJalaali } from 'jalaali-js'
import { twMerge } from 'tailwind-merge'

const MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند',
]
// Saturday-first week (شنبه … جمعه).
const WEEKDAYS = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج']
const FA_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
const YEARS_PER_PAGE = 12

function faDigits(value: string | number): string {
  return String(value).replace(/\d/g, (digit) => FA_DIGITS[Number(digit)])
}

function pad2(value: number): string {
  return value < 10 ? `0${value}` : String(value)
}

interface JDate {
  jy: number
  jm: number
  jd: number
}

type Mode = 'days' | 'months' | 'years'
type Position = { top: number; left?: number; right?: number }

/** Saturday-first column (0..6) for a Jalali date. */
function weekColumn(jy: number, jm: number, jd: number): number {
  const g = toGregorian(jy, jm, jd)
  const weekday = new Date(g.gy, g.gm - 1, g.gd).getDay() // 0 Sun … 6 Sat
  return (weekday + 1) % 7
}

function isSameDay(a: JDate, jy: number, jm: number, jd: number): boolean {
  return a.jy === jy && a.jm === jm && a.jd === jd
}

export interface DatePickerJalaliProps {
  /** Controlled selected date (Gregorian Date). Pair with `onChange`. */
  value?: Date | null
  /** Uncontrolled initial date. */
  defaultValue?: Date | null
  /** Fires with the picked date (Gregorian Date). */
  onChange?: (date: Date) => void
  /** Field label. */
  label?: ReactNode
  /** Hint below. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Trigger placeholder when nothing is selected. */
  placeholder?: string
  disabled?: boolean
  /** Merged onto the trigger. */
  className?: string
}

const triggerBase =
  'flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-white px-3 text-sm outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900'
const triggerNormal =
  'border-slate-300 text-slate-900 focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:border-zinc-700 dark:text-zinc-100'
const triggerError =
  'border-red-500 text-slate-900 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30 dark:text-zinc-100'
const navButton =
  'grid size-7 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
const headerLabel =
  'rounded-md px-2 py-1 text-sm font-medium text-slate-900 transition-colors hover:bg-slate-100 dark:text-white dark:hover:bg-zinc-800'

function Chevron({ point }: { point: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={point === 'right' ? 'm9 18 6-6-6-6' : 'm15 18-6-6 6-6'} />
    </svg>
  )
}

/**
 * Jalali (Persian / Shamsi) date picker. The trigger shows the selected date in
 * Jalali with Persian digits; clicking it opens an RTL calendar in a portal (so
 * it never clips or sits behind other UI). The header month and year are
 * clickable to drill into month- and year-grid pickers. Selecting a day reports
 * a Gregorian `Date` via `onChange`. Controlled (`value`) or uncontrolled
 * (`defaultValue`); closes on Escape and outside click. Conversion via `jalaali-js`.
 */
export const DatePickerJalali = forwardRef<HTMLButtonElement, DatePickerJalaliProps>(function DatePickerJalali(
  { value, defaultValue, onChange, label, helperText, error, placeholder = 'انتخاب تاریخ', disabled, className },
  ref,
) {
  const id = useId()
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined

  const isControlled = value !== undefined
  const [internal, setInternal] = useState<Date | null>(defaultValue ?? null)
  const selected = isControlled ? value ?? null : internal

  const todayJ = toJalaali(new Date())
  const selectedJ = selected ? toJalaali(selected) : null

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>('days')
  const [view, setView] = useState<{ jy: number; jm: number }>(() => {
    const base = selectedJ ?? todayJ
    return { jy: base.jy, jm: base.jm }
  })
  const [yearPageStart, setYearPageStart] = useState(() => (selectedJ ?? todayJ).jy - 5)
  const [position, setPosition] = useState<Position | null>(null)

  const wrapperRef = useRef<HTMLDivElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => triggerRef.current as HTMLButtonElement, [])

  function computePosition(): Position | null {
    const trigger = triggerRef.current
    if (!trigger) return null
    const rect = trigger.getBoundingClientRect()
    const rtl = getComputedStyle(trigger).direction === 'rtl'
    return rtl
      ? { top: rect.bottom + 8, right: Math.max(8, window.innerWidth - rect.right) }
      : { top: rect.bottom + 8, left: Math.max(8, rect.left) }
  }

  function toggleOpen() {
    if (open) {
      setOpen(false)
      return
    }
    const base = selected ? toJalaali(selected) : toJalaali(new Date())
    setView({ jy: base.jy, jm: base.jm })
    setMode('days')
    setPosition(computePosition())
    setOpen(true)
  }

  function close() {
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Outside click + Escape + keep the popover anchored on scroll/resize.
  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (wrapperRef.current?.contains(target) || popoverRef.current?.contains(target)) return
      setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') close()
    }
    function reposition() {
      setPosition(computePosition())
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', reposition)
    window.addEventListener('scroll', reposition, true)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', reposition)
      window.removeEventListener('scroll', reposition, true)
    }
  }, [open])

  function shiftMonth(delta: number) {
    setView((current) => {
      let jm = current.jm + delta
      let jy = current.jy
      if (jm < 1) {
        jm = 12
        jy -= 1
      } else if (jm > 12) {
        jm = 1
        jy += 1
      }
      return { jy, jm }
    })
  }

  function handlePrev() {
    if (mode === 'days') shiftMonth(-1)
    else if (mode === 'months') setView((c) => ({ ...c, jy: c.jy - 1 }))
    else setYearPageStart((s) => s - YEARS_PER_PAGE)
  }

  function handleNext() {
    if (mode === 'days') shiftMonth(1)
    else if (mode === 'months') setView((c) => ({ ...c, jy: c.jy + 1 }))
    else setYearPageStart((s) => s + YEARS_PER_PAGE)
  }

  function openYears() {
    setYearPageStart(view.jy - 5)
    setMode('years')
  }

  function pickDay(jd: number) {
    const g = toGregorian(view.jy, view.jm, jd)
    const date = new Date(g.gy, g.gm - 1, g.gd)
    if (!isControlled) setInternal(date)
    onChange?.(date)
    setOpen(false)
    triggerRef.current?.focus()
  }

  const monthLength = jalaaliMonthLength(view.jy, view.jm)
  const firstColumn = weekColumn(view.jy, view.jm, 1)
  const cells: Array<number | null> = []
  for (let i = 0; i < firstColumn; i += 1) cells.push(null)
  for (let day = 1; day <= monthLength; day += 1) cells.push(day)
  while (cells.length % 7 !== 0) cells.push(null)

  const formatted = selectedJ
    ? `${faDigits(selectedJ.jy)}/${faDigits(pad2(selectedJ.jm))}/${faDigits(pad2(selectedJ.jd))}`
    : null

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-zinc-300">
          {label}
        </label>
      ) : null}

      <div ref={wrapperRef} className="relative">
        <button
          ref={triggerRef}
          type="button"
          id={id}
          disabled={disabled}
          onClick={toggleOpen}
          aria-haspopup="dialog"
          aria-expanded={open}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={twMerge(triggerBase, hasError ? triggerError : triggerNormal, className)}
        >
          <span className={formatted ? '' : 'text-slate-400 dark:text-zinc-500'}>{formatted ?? placeholder}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-slate-400">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        </button>
      </div>

      {open && position
        ? createPortal(
            <div
              ref={popoverRef}
              role="dialog"
              aria-label="تقویم"
              dir="rtl"
              style={{ top: position.top, left: position.left, right: position.right }}
              className="fixed z-50 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl dark:border-zinc-800 dark:bg-zinc-900"
            >
              {/* Header */}
              <div className="mb-2 flex items-center justify-between">
                <button type="button" onClick={handlePrev} aria-label="قبلی" className={navButton}>
                  <Chevron point="right" />
                </button>

                <div className="flex items-center gap-1">
                  {mode === 'days' ? (
                    <>
                      <button type="button" onClick={() => setMode('months')} className={headerLabel}>
                        {MONTHS[view.jm - 1]}
                      </button>
                      <button type="button" onClick={openYears} className={headerLabel}>
                        {faDigits(view.jy)}
                      </button>
                    </>
                  ) : mode === 'months' ? (
                    <button type="button" onClick={openYears} className={headerLabel}>
                      {faDigits(view.jy)}
                    </button>
                  ) : (
                    <span className="px-2 text-sm font-medium text-slate-900 dark:text-white">
                      {faDigits(yearPageStart)} – {faDigits(yearPageStart + YEARS_PER_PAGE - 1)}
                    </span>
                  )}
                </div>

                <button type="button" onClick={handleNext} aria-label="بعدی" className={navButton}>
                  <Chevron point="left" />
                </button>
              </div>

              {/* Body */}
              {mode === 'days' ? (
                <>
                  <div className="mb-1 grid grid-cols-7">
                    {WEEKDAYS.map((weekday) => (
                      <span key={weekday} className="grid h-7 place-items-center text-xs font-medium text-slate-400 dark:text-zinc-500">
                        {weekday}
                      </span>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {cells.map((day, index) =>
                      day === null ? (
                        <span key={index} />
                      ) : (
                        <button
                          key={index}
                          type="button"
                          onClick={() => pickDay(day)}
                          aria-current={selectedJ && isSameDay(selectedJ, view.jy, view.jm, day) ? 'date' : undefined}
                          className={twMerge(
                            'grid size-8 place-items-center rounded-md text-sm transition-colors',
                            selectedJ && isSameDay(selectedJ, view.jy, view.jm, day)
                              ? 'bg-indigo-600 text-white'
                              : isSameDay(todayJ, view.jy, view.jm, day)
                                ? 'text-indigo-600 ring-1 ring-inset ring-indigo-300 hover:bg-indigo-50 dark:text-indigo-400 dark:ring-indigo-500/50 dark:hover:bg-indigo-500/10'
                                : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                          )}
                        >
                          {faDigits(day)}
                        </button>
                      ),
                    )}
                  </div>
                </>
              ) : mode === 'months' ? (
                <div className="grid grid-cols-3 gap-1">
                  {MONTHS.map((monthName, index) => (
                    <button
                      key={monthName}
                      type="button"
                      onClick={() => {
                        setView((c) => ({ ...c, jm: index + 1 }))
                        setMode('days')
                      }}
                      className={twMerge(
                        'rounded-md px-2 py-2 text-sm transition-colors',
                        view.jm === index + 1
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                      )}
                    >
                      {monthName}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1">
                  {Array.from({ length: YEARS_PER_PAGE }, (_, i) => yearPageStart + i).map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        setView((c) => ({ ...c, jy: year }))
                        setMode('months')
                      }}
                      className={twMerge(
                        'rounded-md px-2 py-2 text-sm transition-colors',
                        view.jy === year
                          ? 'bg-indigo-600 text-white'
                          : 'text-slate-700 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
                      )}
                    >
                      {faDigits(year)}
                    </button>
                  ))}
                </div>
              )}
            </div>,
            document.body,
          )
        : null}

      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-slate-500 dark:text-zinc-400">
          {helperText}
        </p>
      ) : null}
    </div>
  )
})
