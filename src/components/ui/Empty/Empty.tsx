import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface EmptyProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Optional illustration or icon shown above the title. */
  icon?: ReactNode
  /** The main heading. */
  title: ReactNode
  /** Optional supporting text under the title. */
  description?: ReactNode
  /** Optional actions (e.g. a button) rendered at the bottom. Pass via children. */
  children?: ReactNode
}

/**
 * An empty-state placeholder: centred icon, title, description and an optional
 * action area. Use it when a list, search or panel has nothing to show.
 */
export const Empty = forwardRef<HTMLDivElement, EmptyProps>(function Empty(
  { icon, title, description, children, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-200 p-8 text-center dark:border-zinc-800',
        className,
      )}
      {...props}
    >
      {icon ? (
        <div className="flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-zinc-800 dark:text-zinc-500">
          {icon}
        </div>
      ) : null}
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-900 dark:text-zinc-100">{title}</p>
        {description ? <p className="text-sm text-slate-500 dark:text-zinc-400">{description}</p> : null}
      </div>
      {children ? <div className="mt-1">{children}</div> : null}
    </div>
  )
})
