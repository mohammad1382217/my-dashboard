import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  /** Append a red asterisk to mark the field as required. */
  required?: boolean
}

/**
 * A form label. Wire it to a control with `htmlFor`. When the associated input
 * is disabled, give it `peer` and this label dims automatically.
 */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(
  { required, children, className, ...props },
  ref,
) {
  return (
    <label
      ref={ref}
      className={twMerge(
        'inline-flex items-center gap-1 text-sm font-medium text-slate-900 select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-60 dark:text-zinc-100',
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="text-red-500">
          *
        </span>
      ) : null}
    </label>
  )
})
