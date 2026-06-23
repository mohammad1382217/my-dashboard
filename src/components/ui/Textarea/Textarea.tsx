import { forwardRef, useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

type TextareaSize = 'sm' | 'md' | 'lg'

export interface TextareaProps extends Omit<ComponentPropsWithoutRef<'textarea'>, 'size'> {
  /** Visible label rendered above the field and linked to it. */
  label?: string
  /** Hint shown below the field. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Control padding / min-height. Defaults to "md". */
  size?: TextareaSize
}

const sizeClasses: Record<TextareaSize, string> = {
  sm: 'min-h-16 px-2.5 py-1.5 text-sm',
  md: 'min-h-20 px-3 py-2 text-sm',
  lg: 'min-h-28 px-4 py-2.5 text-base',
}

const base =
  'w-full resize-y rounded-md border bg-white text-slate-900 placeholder:text-slate-400 outline-none transition-[color,background-color,border-color,box-shadow] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-500'

/**
 * Native <textarea> with optional label, helper text and error state.
 * Forwards the ref to the underlying <textarea> and spreads every native prop.
 * `className` is merged last with `twMerge`, so passed utilities cleanly
 * override the built-in ones from the same group.
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, helperText, error, size = 'md', id, className, disabled, required, ...props },
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
    : 'border-slate-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/30 dark:border-zinc-700 dark:focus:border-primary-400'

  const textareaClassName = twMerge(base, sizeClasses[size], stateClasses, className)

  return (
    <div className="flex flex-col gap-1.5">
      {label ? (
        <label htmlFor={fieldId} className="text-sm font-medium text-fg-soft">
          {label}
          {required ? <span className="ms-0.5 text-red-500">*</span> : null}
        </label>
      ) : null}

      <textarea
        ref={ref}
        id={fieldId}
        disabled={disabled}
        required={required}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        className={textareaClassName}
        {...props}
      />

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
