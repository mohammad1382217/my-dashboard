import { forwardRef, useId } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type InputSize = 'sm' | 'md' | 'lg'

export interface InputProps extends Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  /** Visible label rendered above the input and linked to it. */
  label?: string
  /** Hint shown below the input. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Control height/padding. Defaults to "md". */
  size?: InputSize
  /** Element rendered inside the field, before the text. */
  startIcon?: ReactNode
  /** Element rendered inside the field, after the text. */
  endIcon?: ReactNode
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-8 px-2.5 text-sm',
  md: 'h-10 px-3 text-sm',
  lg: 'h-12 px-4 text-base',
}

const base =
  'w-full rounded-md border bg-white text-slate-900 shadow-sm placeholder:text-slate-400 outline-none transition-[color,border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500'

/**
 * Native <input> with optional label, helper text, error state and icons.
 * Forwards the ref to the underlying <input> and spreads every native prop,
 * so it behaves exactly like an <input> wherever you need it.
 *
 * `className` is merged last with `twMerge`, so a passed utility cleanly
 * overrides the built-in one from the same group (e.g. `bg-*`, `h-*`,
 * `rounded-*`, border color) instead of just stacking on top of it.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    size = 'md',
    startIcon,
    endIcon,
    id,
    className,
    disabled,
    required,
    ...props
  },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined

  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ') || undefined

  const stateClasses = hasError
    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
    : 'border-slate-300 hover:border-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:hover:border-zinc-600 dark:focus:border-primary-400'

  const inputClassName = twMerge(
    base,
    sizeClasses[size],
    stateClasses,
    startIcon && 'ps-9',
    endIcon && 'pe-9',
    className,
  )

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={inputId} className="text-sm font-medium text-fg-soft">
          {label}
          {required ? <span className="ms-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      <div className="relative">
        {startIcon ? (
          <span className="pointer-events-none absolute inset-y-0 inset-s-3 flex items-center text-slate-400">
            {startIcon}
          </span>
        ) : null}

        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          required={required}
          aria-invalid={hasError || undefined}
          aria-describedby={describedBy}
          className={inputClassName}
          {...props}
        />

        {endIcon ? (
          <span className="pointer-events-none absolute inset-y-0 inset-e-3 flex items-center text-slate-400">
            {endIcon}
          </span>
        ) : null}
      </div>

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
