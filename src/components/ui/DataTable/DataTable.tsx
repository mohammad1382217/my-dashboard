import { useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface DataTableColumn<Row> {
  /** Property name on the row, also the column key. */
  key: string
  /** Header cell content. */
  header: ReactNode
  /** Text alignment. Defaults to "start". */
  align?: 'start' | 'center' | 'end'
  /** Allow sorting by this column. */
  sortable?: boolean
  /** Custom cell renderer; defaults to `row[key]`. */
  cell?: (row: Row, index: number) => ReactNode
  /** Value used for sorting; defaults to `row[key]`. */
  sortValue?: (row: Row) => string | number
  /** Extra classes for every cell in this column. */
  className?: string
}

export interface DataTableProps<Row> {
  columns: DataTableColumn<Row>[]
  data: Row[]
  /** Rows per page. Omit to disable pagination. */
  pageSize?: number
  /** Initial sort. */
  initialSort?: { key: string; direction: 'asc' | 'desc' }
  /** Stable key per row. Defaults to the row index. */
  getRowKey?: (row: Row, index: number) => string | number
  caption?: ReactNode
  /** Shown when there are no rows. */
  emptyContent?: ReactNode
  /** Labels for the pager (i18n). */
  prevLabel?: string
  nextLabel?: string
  /** Builds the "page x of y" string. */
  pageInfo?: (page: number, pages: number) => ReactNode
  className?: string
}

const alignClass = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
} as const

/**
 * A table with client-side sorting and optional pagination. Click a sortable
 * header to cycle ascending → descending (the active column carries `aria-sort`).
 * Set `pageSize` to page the rows with built-in prev/next controls (arrows flip
 * in RTL). Generic over the row type; self-contained.
 */
export function DataTable<Row>({
  columns,
  data,
  pageSize,
  initialSort,
  getRowKey,
  caption,
  emptyContent,
  prevLabel = 'Previous',
  nextLabel = 'Next',
  pageInfo,
  className,
}: DataTableProps<Row>) {
  const [sort, setSort] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(initialSort ?? null)
  const [page, setPage] = useState(1)

  const sorted = useMemo(() => {
    if (!sort) return data
    const col = columns.find((c) => c.key === sort.key)
    if (!col) return data
    const getValue = col.sortValue ?? ((row: Row) => (row as Record<string, string | number>)[sort.key])
    const factor = sort.direction === 'asc' ? 1 : -1
    return [...data].sort((a, b) => {
      const av = getValue(a)
      const bv = getValue(b)
      if (av < bv) return -1 * factor
      if (av > bv) return 1 * factor
      return 0
    })
  }, [data, sort, columns])

  const pages = pageSize ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const safePage = Math.min(page, pages)
  const rows = pageSize ? sorted.slice((safePage - 1) * pageSize, safePage * pageSize) : sorted

  function toggleSort(key: string) {
    setPage(1)
    setSort((prev) => {
      if (!prev || prev.key !== key) return { key, direction: 'asc' }
      return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
    })
  }

  function ariaSort(key: string): 'ascending' | 'descending' | 'none' {
    if (!sort || sort.key !== key) return 'none'
    return sort.direction === 'asc' ? 'ascending' : 'descending'
  }

  return (
    <div className={twMerge('w-full', className)}>
      <div className="w-full overflow-x-auto rounded-lg border border-slate-200 dark:border-zinc-800">
        <table className="w-full caption-bottom border-collapse text-sm">
          {caption ? <caption className="px-3 py-2 text-xs text-slate-500 dark:text-zinc-400">{caption}</caption> : null}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
              {columns.map((col) => {
                const headerCell = (
                  <th
                    key={col.key}
                    scope="col"
                    aria-sort={col.sortable ? ariaSort(col.key) : undefined}
                    className={twMerge('px-3 py-2.5 font-medium text-slate-500 dark:text-zinc-400', alignClass[col.align ?? 'start'], col.className)}
                  >
                    {col.sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className="inline-flex items-center gap-1 rounded-sm outline-none transition-colors hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-indigo-500/30 dark:hover:text-zinc-100"
                      >
                        {col.header}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={twMerge('transition-opacity', sort?.key === col.key ? 'opacity-100' : 'opacity-30')}>
                          {sort?.key === col.key && sort.direction === 'desc' ? <path d="m6 9 6 6 6-6" /> : <path d="m18 15-6-6-6 6" />}
                        </svg>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                )
                return headerCell
              })}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-3 py-8 text-center text-slate-400 dark:text-zinc-500">
                  {emptyContent ?? 'No data'}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={getRowKey ? getRowKey(row, rowIndex) : rowIndex} className="text-slate-700 transition-colors hover:bg-slate-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50">
                  {columns.map((col) => (
                    <td key={col.key} className={twMerge('px-3 py-2.5', alignClass[col.align ?? 'start'], col.className)}>
                      {col.cell ? col.cell(row, rowIndex) : ((row as Record<string, ReactNode>)[col.key] ?? null)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pageSize && pages > 1 ? (
        <div className="mt-3 flex items-center justify-between gap-3 text-sm text-slate-500 dark:text-zinc-400">
          <span>{pageInfo ? pageInfo(safePage, pages) : `Page ${safePage} of ${pages}`}</span>
          <div className="flex gap-1">
            <button
              type="button"
              aria-label={prevLabel}
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 px-2 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>
            <button
              type="button"
              aria-label={nextLabel}
              disabled={safePage >= pages}
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              className="inline-flex h-8 items-center gap-1 rounded-md border border-slate-300 px-2 outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-40 dark:border-zinc-700 dark:hover:bg-zinc-800"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
