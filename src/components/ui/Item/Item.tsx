import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ItemProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Leading slot — icon, avatar or checkbox. */
  leading?: ReactNode
  /** Primary line. */
  title?: ReactNode
  /** Secondary line under the title. */
  description?: ReactNode
  /** Trailing slot — action, value or chevron. */
  trailing?: ReactNode
  /** Render a hover/focus affordance and a pointer cursor. */
  interactive?: boolean
}

/**
 * A flexible content row: optional leading slot, a title + description stack and
 * an optional trailing slot. Use it for list rows, menu-like entries or setting
 * lines. Set `interactive` for hover styling (wrap in a button/anchor yourself
 * for real activation). Arbitrary children replace the title/description stack.
 */
export const Item = forwardRef<HTMLDivElement, ItemProps>(function Item(
  { leading, title, description, trailing, interactive = false, children, className, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      className={twMerge(
        'flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3 text-sm shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-none',
        interactive ? 'cursor-pointer transition-[color,background-color,border-color,box-shadow,transform] hover:bg-slate-50 dark:hover:bg-zinc-800' : null,
        className,
      )}
      {...props}
    >
      {leading ? <span className="shrink-0 text-muted">{leading}</span> : null}
      <div className="flex min-w-0 flex-1 flex-col">
        {children ?? (
          <>
            {title ? <span className="truncate font-medium text-fg">{title}</span> : null}
            {description ? <span className="truncate text-muted">{description}</span> : null}
          </>
        )}
      </div>
      {trailing ? <span className="shrink-0 text-muted">{trailing}</span> : null}
    </div>
  )
})
