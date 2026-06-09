import { forwardRef, useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
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
  /** Optional disabled, empty first option. Pair with `defaultValue=""`. */
  placeholder?: string
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-8 px-2.5 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const base =
  'w-full appearance-none rounded-md border bg-white text-slate-900 outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100'

/**
 * Native <select> with optional label, helper text, error state and a custom
 * chevron (native arrow hidden via `appearance-none`). Forwards the ref and
 * spreads every native prop; pass <option> elements as children. `className`
 * is merged last with `twMerge`.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, helperText, error, size = 'md', placeholder, id, className, disabled, required, children, ...props },
  ref,
) {
  const autoId = useId()
  const fieldId = id ?? autoId
  const helperId = `${fieldId}-helper`
  const errorId = `${fieldId}-error`

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined

  const stateClasses = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
    : 'border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 dark:border-zinc-700 dark:focus:border-indigo-400'

  // `pe-9` (logical padding-inline-end) after the size classes guarantees room for the chevron on
  // whichever side is the end — right in LTR, left in RTL.
  const selectClassName = twMerge(base, sizeClasses[size], stateClasses, 'pe-9', className)

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-slate-700 dark:text-zinc-300">
          {label}
          {required ? <span className="ms-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        <select
          ref={ref}
          id={fieldId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={selectClassName}
          {...props}
        >
          {placeholder ? (
            <option value="" disabled>
              {placeholder}
            </option>
          ) : null}
          {children}
        </select>

        <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-slate-400">
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
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </div>

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
