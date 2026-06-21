import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface CardProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Header heading. */
  title?: ReactNode
  /** Header description under the title. */
  description?: ReactNode
  /** Footer row (e.g. actions), aligned to the end. */
  footer?: ReactNode
}

/**
 * Presentational container with optional header (title + description), body
 * (children) and footer slots, each separated by a divider. Forwards the ref and
 * spreads native div props; `className` is merged last with `twMerge`.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { title, description, footer, children, className, ...props },
  ref,
) {
  const hasHeader = Boolean(title || description)

  return (
    <div
      ref={ref}
      className={twMerge(
        'overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300',
        className,
      )}
      {...props}
    >
      {hasHeader ? (
        <div className="flex flex-col gap-1 border-b border-slate-200 p-5 dark:border-zinc-800">
          {title ? <h3 className="font-semibold text-slate-900 dark:text-white">{title}</h3> : null}
          {description ? <p className="text-sm text-slate-500 dark:text-zinc-400">{description}</p> : null}
        </div>
      ) : null}

      {children ? <div className="p-5">{children}</div> : null}

      {footer ? (
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-200 bg-slate-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30">
          {footer}
        </div>
      ) : null}
    </div>
  )
})
