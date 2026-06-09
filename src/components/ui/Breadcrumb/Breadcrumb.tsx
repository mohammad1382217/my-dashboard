import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

export interface BreadcrumbItem {
  /** Visible text. */
  label: ReactNode
  /** Link target. Omit on the current (last) page. */
  href?: string
}

export interface BreadcrumbProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'children'> {
  /** Ordered trail from root to current page. */
  items: BreadcrumbItem[]
  /** Custom separator between items. Defaults to a chevron that flips in RTL. */
  separator?: ReactNode
  /** Accessible name for the nav landmark. Defaults to "Breadcrumb". */
  label?: string
}

const linkClass =
  'rounded-sm text-slate-500 outline-none transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:text-zinc-400 dark:hover:text-zinc-100'

/**
 * A breadcrumb trail. Pass `items` from root to current; the last item is
 * rendered as the current page (`aria-current="page"`, not a link). The default
 * chevron separator flips automatically in RTL via a legacy-safe transform.
 */
export const Breadcrumb = forwardRef<HTMLElement, BreadcrumbProps>(function Breadcrumb(
  { items, separator, label = 'Breadcrumb', className, ...props },
  ref,
) {
  return (
    <nav ref={ref} aria-label={label} className={className} {...props}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={index} className="inline-flex items-center gap-1.5">
              {isLast || !item.href ? (
                <span aria-current={isLast ? 'page' : undefined} className="font-medium text-slate-900 dark:text-zinc-100">
                  {item.label}
                </span>
              ) : (
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              )}
              {isLast ? null : (
                <span aria-hidden="true" className="text-slate-300 dark:text-zinc-600">
                  {separator ?? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  )}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
})
