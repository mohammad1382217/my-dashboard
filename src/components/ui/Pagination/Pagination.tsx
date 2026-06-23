import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface PaginationProps extends Omit<ComponentPropsWithoutRef<'nav'>, 'onChange'> {
  /** Current page, 1-based. */
  page: number
  /** Total number of pages. */
  count: number
  /** Fires with the next page when a control is activated. */
  onPageChange: (page: number) => void
  /** Pages shown on each side of the current one. Defaults to 1. */
  siblingCount?: number
  /** Accessible name for the nav landmark. Defaults to "Pagination". */
  label?: string
  /** Labels for the previous/next buttons (for i18n). */
  prevLabel?: string
  nextLabel?: string
}

const ELLIPSIS = 'ellipsis'

function range(start: number, end: number): number[] {
  const out: number[] = []
  for (let i = start; i <= end; i += 1) out.push(i)
  return out
}

/** Build the page list with ellipses, e.g. [1, 'ellipsis', 4, 5, 6, 'ellipsis', 20]. */
function buildRange(page: number, count: number, siblingCount: number): (number | typeof ELLIPSIS)[] {
  const total = siblingCount * 2 + 5 // first + last + current + 2 ellipses
  if (count <= total) return range(1, count)

  const leftSibling = Math.max(page - siblingCount, 1)
  const rightSibling = Math.min(page + siblingCount, count)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < count - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblingCount * 2), ELLIPSIS, count]
  }
  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, ELLIPSIS, ...range(count - (2 + siblingCount * 2), count)]
  }
  return [1, ELLIPSIS, ...range(leftSibling, rightSibling), ELLIPSIS, count]
}

const itemBase =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2 text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-primary-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40'
const pageIdle = 'text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
const pageActive = 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'

/**
 * Page navigation with first/last anchoring and ellipses around the current
 * page. Controlled via `page` + `onPageChange`. Prev/next arrows flip in RTL
 * (legacy-safe transform) and disable at the ends. Marks the active page with
 * `aria-current="page"`.
 */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  { page, count, onPageChange, siblingCount = 1, label = 'Pagination', prevLabel = 'Previous', nextLabel = 'Next', className, ...props },
  ref,
) {
  const pages = buildRange(page, count, siblingCount)

  return (
    <nav ref={ref} aria-label={label} className={className} {...props}>
      <ul className="flex items-center gap-1">
        <li>
          <button
            type="button"
            aria-label={prevLabel}
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className={twMerge(itemBase, pageIdle)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        </li>

        {pages.map((value, index) =>
          value === ELLIPSIS ? (
            <li key={`e${index}`} aria-hidden="true" className="inline-flex h-9 min-w-9 items-center justify-center text-faint">
              …
            </li>
          ) : (
            <li key={value}>
              <button
                type="button"
                aria-label={`${label} ${value}`}
                aria-current={value === page ? 'page' : undefined}
                onClick={() => onPageChange(value)}
                className={twMerge(itemBase, value === page ? pageActive : pageIdle)}
              >
                {value}
              </button>
            </li>
          ),
        )}

        <li>
          <button
            type="button"
            aria-label={nextLabel}
            disabled={page >= count}
            onClick={() => onPageChange(page + 1)}
            className={twMerge(itemBase, pageIdle)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  )
})
