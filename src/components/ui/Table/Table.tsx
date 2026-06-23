import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface TableColumn<Row> {
  /** Property name on the row, also the React key for the column. */
  key: string
  /** Header cell content. */
  header: ReactNode
  /** Text alignment for the whole column. Defaults to "start". */
  align?: 'start' | 'center' | 'end'
  /** Extra classes for every cell in this column. */
  className?: string
  /** Custom cell renderer; defaults to `row[key]`. */
  cell?: (row: Row, index: number) => ReactNode
}

export interface TableProps<Row> extends Omit<ComponentPropsWithoutRef<'table'>, 'children'> {
  /** Column definitions. */
  columns: TableColumn<Row>[]
  /** Row data. */
  data: Row[]
  /** Optional caption (visually muted, announced to screen readers). */
  caption?: ReactNode
  /** Stable key per row. Defaults to the row index. */
  getRowKey?: (row: Row, index: number) => string | number
  /** Shown in a full-width row when `data` is empty. */
  emptyContent?: ReactNode
}

const alignClass = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
} as const

/**
 * A data-driven table on native `<table>` semantics, wrapped in a horizontal
 * scroll container. Pass `columns` + `data`; each column reads `row[key]` or a
 * custom `cell` renderer. Generic over the row type, so cells stay type-safe.
 */
export function Table<Row>({ columns, data, caption, getRowKey, emptyContent, className, ...props }: TableProps<Row>) {
  return (
    <div className="w-full overflow-x-auto rounded-lg border border-slate-200 shadow-sm dark:border-zinc-800 dark:shadow-none">
      <table className={twMerge('w-full caption-bottom border-collapse text-sm', className)} {...props}>
        {caption ? <caption className="px-3 py-2 text-xs text-muted">{caption}</caption> : null}
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 dark:border-zinc-800 dark:bg-zinc-900/60">
            {columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                className={twMerge('px-3 py-2.5 font-medium text-muted', alignClass[col.align ?? 'start'], col.className)}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-faint">
                {emptyContent ?? 'No data'}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
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
  )
}
