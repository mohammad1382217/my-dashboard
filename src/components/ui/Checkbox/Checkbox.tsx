import { forwardRef, useEffect, useId, useImperativeHandle, useRef } from 'react'
import type { ChangeEvent, ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CheckboxProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  /** Visible label beside the box, linked to the control. */
  label?: ReactNode
  /** Hint shown below. Hidden when an error message is present. */
  helperText?: string
  /** Error message (string) or just the invalid state (true). */
  error?: string | boolean
  /** Mixed/partial state (e.g. a "select all" with some children checked). */
  indeterminate?: boolean
  /** Value-first change callback, alongside the native `onChange`. */
  onCheckedChange?: (checked: boolean) => void
}

// The visual box is an aria-hidden sibling of the real (transparent) input, so the
// `peer-*` variants reach it. Animated with colour + opacity only (legacy-safe).
const boxBase =
  'pointer-events-none absolute inset-0 rounded border bg-white transition-[color,background-color,border-color,box-shadow,transform] peer-focus-visible:ring-2 peer-focus-visible:ring-offset-1 peer-disabled:opacity-60 dark:bg-zinc-900'

const boxNormal =
  'border-slate-300 peer-checked:border-primary-600 peer-checked:bg-primary-600 peer-indeterminate:border-primary-600 peer-indeterminate:bg-primary-600 peer-focus-visible:ring-primary-500/40 dark:border-zinc-600'

const boxError =
  'border-red-500 peer-checked:border-red-600 peer-checked:bg-red-600 peer-indeterminate:border-red-600 peer-indeterminate:bg-red-600 peer-focus-visible:ring-red-500/40'

const markBase = 'pointer-events-none absolute inset-0 m-auto text-white transition-opacity duration-150'

/**
 * Checkbox built on a real (visually hidden) <input type="checkbox">, so native
 * toggling, Space activation, form submission and `:checked` / `:indeterminate`
 * semantics come for free; the styled box reacts purely via `peer-*` variants.
 * Supports controlled/uncontrolled, an `indeterminate` (mixed) state, an optional
 * `label`, helper/error text, `disabled` and `required`. Forwards the ref to the
 * input; `className` is merged onto the control box (e.g. `size-6` to resize).
 */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, helperText, error, indeterminate = false, onCheckedChange, onChange, id, className, disabled, required, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const helperId = `${inputId}-helper`
  const errorId = `${inputId}-error`

  const hasError = Boolean(error)
  const errorMessage = typeof error === 'string' ? error : undefined
  const describedBy =
    [errorMessage ? errorId : null, helperText ? helperId : null].filter(Boolean).join(' ') || undefined

  const innerRef = useRef<HTMLInputElement>(null)
  useImperativeHandle(ref, () => innerRef.current as HTMLInputElement, [])

  // `indeterminate` is a DOM property, not an attribute — set it imperatively.
  useEffect(() => {
    if (innerRef.current) innerRef.current.indeterminate = indeterminate
  }, [indeterminate])

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    onCheckedChange?.(event.target.checked)
  }

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className={twMerge(
          'inline-flex w-fit items-start gap-2.5 text-sm font-medium text-slate-700 select-none dark:text-zinc-300',
          disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
        )}
      >
        <span className={twMerge('relative inline-flex size-5 shrink-0', className)}>
          <input
            {...props}
            ref={innerRef}
            id={inputId}
            type="checkbox"
            disabled={disabled}
            required={required}
            aria-invalid={hasError || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            className="peer absolute inset-0 z-10 size-full cursor-[inherit] rounded opacity-0"
          />
          <span aria-hidden="true" className={twMerge(boxBase, hasError ? boxError : boxNormal)} />
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={twMerge(markBase, 'opacity-0 peer-checked:opacity-100 peer-indeterminate:opacity-0')}
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <svg
            aria-hidden="true"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            className={twMerge(markBase, 'opacity-0 peer-indeterminate:opacity-100')}
          >
            <path d="M5 12h14" />
          </svg>
        </span>

        {label ? (
          <span className="leading-snug">
            {label}
            {required ? (
              <span aria-hidden="true" className="ms-0.5 text-red-500">
                *
              </span>
            ) : null}
          </span>
        ) : null}
      </label>

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
