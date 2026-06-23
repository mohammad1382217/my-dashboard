import { cloneElement, forwardRef, isValidElement, useId } from 'react'
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface FieldProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Field label text. */
  label?: ReactNode
  /** Helper text under the control. */
  description?: ReactNode
  /** Error message; when set, the control is marked invalid and this is announced. */
  error?: ReactNode
  /** Append a required marker to the label. */
  required?: boolean
  /** The single control element (input, select, …). */
  children: ReactNode
}

/**
 * A labelled form field. Wraps a single control and wires accessibility for you:
 * it generates an id, links the `<label>` via `htmlFor`, and injects
 * `aria-describedby` (description + error) and `aria-invalid` onto the control.
 * Self-contained — no dependency on the Label component — so it downloads alone.
 */
export const Field = forwardRef<HTMLDivElement, FieldProps>(function Field(
  { label, description, error, required, children, className, ...props },
  ref,
) {
  const id = useId()
  const descId = `${id}-desc`
  const errId = `${id}-error`

  const childId = isValidElement(children) ? ((children.props as Record<string, unknown>).id as string | undefined) : undefined
  const controlId = childId ?? `${id}-control`

  const describedBy = [description ? descId : null, error ? errId : null].filter(Boolean).join(' ') || undefined

  const control = isValidElement(children)
    ? cloneElement(children as ReactElement<Record<string, unknown>>, {
        id: controlId,
        'aria-describedby': describedBy,
        'aria-invalid': error ? true : undefined,
      })
    : children

  return (
    <div ref={ref} className={twMerge('flex flex-col gap-1.5', className)} {...props}>
      {label ? (
        <label htmlFor={controlId} className="inline-flex items-center gap-1 text-sm font-medium text-slate-900 select-none dark:text-zinc-100">
          {label}
          {required ? (
            <span aria-hidden="true" className="text-red-500">
              *
            </span>
          ) : null}
        </label>
      ) : null}
      {control}
      {description ? (
        <p id={descId} className="text-xs text-muted">
          {description}
        </p>
      ) : null}
      {error ? (
        <p id={errId} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
})
