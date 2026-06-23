import { Children, Fragment, forwardRef, isValidElement, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ComponentPropsWithoutRef, KeyboardEvent as ReactKeyboardEvent, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type SelectSize = 'sm' | 'md' | 'lg'

export interface SelectProps extends Omit<ComponentPropsWithoutRef<'select'>, 'size'> {
  /** Visible label rendered above the control and linked to it. */
  label?: string
  /** Hint shown below the control. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Control height / padding. Defaults to "md". */
  size?: SelectSize
  /** Optional disabled, empty first option / trigger hint. Pair with `defaultValue=""`. */
  placeholder?: string
}

/** A single resolved option flattened from the <option>/<optgroup> children. */
interface OptionItem {
  value: string
  label: string
  disabled?: boolean
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-2.5 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const triggerBase =
  'flex w-full select-none appearance-none items-center justify-between gap-2 rounded-md border bg-white text-start text-slate-900 shadow-sm outline-none transition-[color,background-color,border-color,box-shadow,transform] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100'

type Position = { top: number; left: number; width: number }

/** Flatten <option> (and <optgroup>) children into a plain list the listbox can render. */
function collectOptions(children: ReactNode): OptionItem[] {
  const out: OptionItem[] = []
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return
    if (child.type === 'option') {
      const props = child.props as { value?: string | number; children?: ReactNode; disabled?: boolean }
      const value = props.value != null ? String(props.value) : ''
      const label = typeof props.children === 'string' ? props.children : String(props.children ?? value)
      out.push({ value, label, disabled: props.disabled })
    } else if (child.type === 'optgroup' || child.type === Fragment) {
      // Recurse into <optgroup> and fragments so grouped / fragment-wrapped <option>s are found.
      out.push(...collectOptions((child.props as { children?: ReactNode }).children))
    }
  })
  return out
}

/** Set a <select>'s value through the native setter and fire a real `change` so React's `onChange` runs. */
function nativeSelect(el: HTMLSelectElement, value: string) {
  const setter = Object.getOwnPropertyDescriptor(window.HTMLSelectElement.prototype, 'value')?.set
  setter?.call(el, value)
  el.dispatchEvent(new Event('change', { bubbles: true }))
}

/**
 * Select with a CUSTOM, fully styled options dropdown — native <select> popups are
 * OS-rendered and unstyleable, so the visible control is a styled trigger + a
 * portal listbox (padding, hover, keyboard nav, a selected check). A real but
 * visually-hidden <select> is kept in the DOM as the source of truth: it preserves
 * native form submission (`name`/`value`/`required`), the `onChange(event)` contract
 * (consumers still read `event.target.value`), and the forwarded ref. Pass <option>
 * elements as children exactly like a native select. `className` lands on the trigger.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helperText, error, size = 'md', placeholder, id, className, disabled, required, children, value, defaultValue, onChange, ...props },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const labelId = `${fieldId}-label`
  const triggerId = `${fieldId}-trigger`
  const listboxId = `${fieldId}-listbox`
  const helperId = `${fieldId}-helper`
  const errorId = `${fieldId}-error`

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined

  const options = collectOptions(children)

  const selectRef = useRef<HTMLSelectElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  useImperativeHandle(ref, () => selectRef.current as HTMLSelectElement, [])

  // The visible trigger mirrors the hidden <select>'s current value.
  const isControlled = value !== undefined
  const [currentValue, setCurrentValue] = useState<string>(() =>
    value != null ? String(value) : defaultValue != null ? String(defaultValue) : '',
  )
  // Sync display from the controlled prop, and (on mount) from whatever the native
  // <select> resolved to (it auto-selects the first option when uncontrolled).
  useEffect(() => {
    if (isControlled) setCurrentValue(value != null ? String(value) : '')
  }, [value, isControlled])
  useEffect(() => {
    if (!isControlled && selectRef.current) setCurrentValue(selectRef.current.value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedLabel = options.find((o) => o.value === currentValue)?.label ?? ''

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [position, setPosition] = useState<Position | null>(null)

  function computePosition(): Position | null {
    const node = triggerRef.current
    if (!node) return null
    const rect = node.getBoundingClientRect()
    return { top: rect.bottom + 4, left: rect.left, width: rect.width }
  }

  function openList() {
    if (disabled) return
    setPosition(computePosition())
    const selected = options.findIndex((o) => o.value === currentValue)
    setActiveIndex(selected >= 0 ? selected : options.findIndex((o) => !o.disabled))
    setOpen(true)
  }

  function close() {
    setOpen(false)
  }

  function commit(option: OptionItem) {
    if (option.disabled) return
    if (selectRef.current) nativeSelect(selectRef.current, option.value)
    setOpen(false)
    triggerRef.current?.focus()
  }

  // Keep the active option scrolled into view.
  useEffect(() => {
    if (!open) return
    const list = listRef.current
    const active = list?.children[activeIndex] as HTMLElement | undefined
    if (typeof active?.scrollIntoView === 'function') active.scrollIntoView({ block: 'nearest' })
  }, [open, activeIndex])

  useEffect(() => {
    if (!open) return
    function onPointerDown(event: PointerEvent) {
      const target = event.target as Node
      if (triggerRef.current?.contains(target) || listRef.current?.contains(target)) return
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
    const count = options.length
    if (count === 0) return
    let index = activeIndex
    for (let step = 0; step < count; step += 1) {
      index = (index + direction + count) % count
      if (!options[index].disabled) {
        setActiveIndex(index)
        return
      }
    }
  }

  function onKeyDown(event: ReactKeyboardEvent<HTMLButtonElement>) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        if (!open) openList()
        else moveActive(1)
        break
      case 'ArrowUp':
        event.preventDefault()
        if (!open) openList()
        else moveActive(-1)
        break
      case 'Home':
        if (open) {
          event.preventDefault()
          setActiveIndex(options.findIndex((o) => !o.disabled))
        }
        break
      case 'End':
        if (open) {
          event.preventDefault()
          for (let i = options.length - 1; i >= 0; i -= 1) {
            if (!options[i].disabled) {
              setActiveIndex(i)
              break
            }
          }
        }
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        if (open && options[activeIndex]) commit(options[activeIndex])
        else openList()
        break
      case 'Escape':
        if (open) {
          event.preventDefault()
          close()
        }
        break
      case 'Tab':
        if (open) close()
        break
      default:
        break
    }
  }

  const stateClasses = hasError
    ? 'border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/30'
    : 'border-slate-300 hover:border-slate-400 focus-visible:border-primary-500 focus-visible:ring-2 focus-visible:ring-primary-500/30 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus-visible:border-primary-400'

  const openRing = open && !hasError ? 'border-primary-500 ring-2 ring-primary-500/30 dark:border-primary-400' : null
  const activeId = open && options[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label
          id={labelId}
          onClick={() => triggerRef.current?.focus()}
          className="w-fit text-sm font-medium text-fg-soft"
        >
          {label}
          {required ? <span className="ms-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      {/* Source of truth: a real, visually-hidden <select> for form submission, the
          onChange(event) contract, and the forwarded ref. */}
      <select
        {...props}
        ref={selectRef}
        id={fieldId}
        aria-hidden="true"
        tabIndex={-1}
        disabled={disabled}
        required={required}
        value={value}
        defaultValue={defaultValue}
        onChange={(event) => {
          setCurrentValue(event.target.value)
          onChange?.(event)
        }}
        className="sr-only"
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </select>

      <button
        ref={triggerRef}
        type="button"
        id={triggerId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-labelledby={label ? labelId : undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        disabled={disabled}
        onClick={() => (open ? close() : openList())}
        onKeyDown={onKeyDown}
        className={twMerge(triggerBase, sizeClasses[size], stateClasses, openRing, className)}
      >
        <span className={twMerge('min-w-0 flex-1 truncate', !selectedLabel && 'text-faint')}>
          {selectedLabel || placeholder || ' '}
        </span>
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
          className={twMerge('pointer-events-none shrink-0 text-slate-400 transition-transform duration-200', open && 'transform-[rotate(180deg)]')}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && position
        ? createPortal(
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-activedescendant={activeId}
              style={{ top: position.top, left: position.left, width: position.width }}
              className="fixed z-50 max-h-60 select-none overflow-y-auto rounded-lg border border-slate-200 bg-white p-1 shadow-lg ring-1 ring-black/5 dark:border-zinc-800 dark:bg-zinc-900 dark:ring-white/10"
            >
              {options.map((option, index) => (
                <li
                  key={`${option.value}-${index}`}
                  id={`${listboxId}-opt-${index}`}
                  role="option"
                  aria-selected={option.value === currentValue}
                  aria-disabled={option.disabled || undefined}
                  onMouseEnter={() => !option.disabled && setActiveIndex(index)}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    commit(option)
                  }}
                  className={twMerge(
                    'flex cursor-pointer items-center justify-between gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition-[color,background-color] dark:text-zinc-300',
                    index === activeIndex && !option.disabled ? 'bg-slate-100 text-slate-900 dark:bg-zinc-800 dark:text-white' : null,
                    option.disabled ? 'cursor-not-allowed opacity-50' : null,
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {option.value === currentValue ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 text-primary-600 dark:text-primary-400">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : null}
                </li>
              ))}
            </ul>,
            document.body,
          )
        : null}

      {errorMessage ? (
        <p id={errorId} className="text-sm text-red-600">
          {errorMessage}
        </p>
      ) : helperText ? (
        <p id={helperId} className="text-sm text-muted">
          {helperText}
        </p>
      ) : null}
    </div>
  )
})
