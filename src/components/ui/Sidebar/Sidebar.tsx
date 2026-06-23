import { forwardRef, useState } from 'react'
import type { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SidebarItem {
  /** Item label (hidden in collapsed/rail mode). */
  label: ReactNode
  /** Leading icon (kept visible when collapsed). */
  icon?: ReactNode
  /** Link target; omit to render a button. */
  href?: string
  /** Mark as the current item. */
  active?: boolean
  /** Click handler (for button items). */
  onSelect?: () => void
  /** Trailing badge/count. */
  badge?: ReactNode
}

export interface SidebarSection {
  /** Optional section heading. */
  label?: string
  items: SidebarItem[]
}

export interface SidebarProps {
  /** Grouped navigation. */
  sections: SidebarSection[]
  /** Brand/header area. */
  header?: ReactNode
  /** Footer area (e.g. a user chip). */
  footer?: ReactNode
  /** Controlled collapsed (rail) state. */
  collapsed?: boolean
  /** Uncontrolled initial collapsed state. */
  defaultCollapsed?: boolean
  /** Fires with the next collapsed state. */
  onCollapsedChange?: (collapsed: boolean) => void
  /** Accessible name for the nav landmark. Defaults to "Sidebar". */
  label?: string
  /** Labels for the collapse toggle (i18n). */
  collapseLabel?: string
  expandLabel?: string
  /** Merged onto the <aside>. */
  className?: string
}

const itemBase =
  'group/item flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-[color,background-color,border-color,box-shadow,transform] focus-visible:ring-2 focus-visible:ring-primary-500/30'
const itemIdle = 'text-slate-600 hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
const itemActive = 'bg-slate-900 text-white dark:bg-zinc-100 dark:text-zinc-900'

/**
 * An application sidebar: a header, grouped navigation sections and a footer,
 * collapsible to an icon-only rail. Data-driven via `sections`; items render as
 * links or buttons and mark the current one with `aria-current`. Controlled
 * collapse via `collapsed` + `onCollapsedChange`, or uncontrolled. RTL-aware
 * (uses logical borders/spacing).
 */
export const Sidebar = forwardRef<HTMLElement, SidebarProps>(function Sidebar(
  { sections, header, footer, collapsed, defaultCollapsed = false, onCollapsedChange, label = 'Sidebar', collapseLabel = 'Collapse sidebar', expandLabel = 'Expand sidebar', className },
  ref,
) {
  const isControlled = collapsed !== undefined
  const [internal, setInternal] = useState(defaultCollapsed)
  const isCollapsed = isControlled ? collapsed : internal

  function toggle() {
    const next = !isCollapsed
    if (!isControlled) setInternal(next)
    onCollapsedChange?.(next)
  }

  return (
    <aside
      ref={ref}
      data-collapsed={isCollapsed}
      className={twMerge(
        'flex h-full flex-col border-e border-slate-200 bg-white transition-[width] duration-200 ease-out dark:border-zinc-800 dark:bg-zinc-900',
        isCollapsed ? 'w-16' : 'w-64',
        className,
      )}
    >
      {header ? <div className="flex h-14 items-center gap-2 overflow-hidden px-3">{header}</div> : null}

      <nav aria-label={label} className="flex-1 overflow-y-auto px-2 py-2">
        {sections.map((section, sIndex) => (
          <div key={sIndex} className="mb-3">
            {section.label && !isCollapsed ? (
              <div className="px-3 pt-2 pb-1 text-xs font-medium tracking-wide text-slate-400 uppercase dark:text-zinc-500">{section.label}</div>
            ) : null}
            <ul className="flex flex-col gap-1">
              {section.items.map((item, iIndex) => {
                const inner = (
                  <>
                    {item.icon ? <span className="shrink-0">{item.icon}</span> : null}
                    {!isCollapsed ? <span className="min-w-0 flex-1 truncate text-start">{item.label}</span> : null}
                    {item.badge && !isCollapsed ? <span className="shrink-0">{item.badge}</span> : null}
                  </>
                )
                const classes = twMerge(itemBase, item.active ? itemActive : itemIdle, isCollapsed ? 'justify-center px-0' : null)
                const title = isCollapsed && typeof item.label === 'string' ? item.label : undefined
                return (
                  <li key={iIndex}>
                    {item.href ? (
                      <a href={item.href} aria-current={item.active ? 'page' : undefined} title={title} className={classes}>
                        {inner}
                      </a>
                    ) : (
                      <button type="button" aria-current={item.active ? 'page' : undefined} title={title} onClick={item.onSelect} className={twMerge(classes, 'w-full')}>
                        {inner}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      <div className="flex items-center gap-2 border-t border-slate-200 p-2 dark:border-zinc-800">
        {footer && !isCollapsed ? <div className="min-w-0 flex-1 overflow-hidden">{footer}</div> : null}
        <button
          type="button"
          onClick={toggle}
          aria-label={isCollapsed ? expandLabel : collapseLabel}
          aria-expanded={!isCollapsed}
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-slate-500 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-primary-500/30 active:scale-[0.98] dark:text-zinc-400 dark:hover:bg-zinc-800"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={isCollapsed ? 'transform-[rotate(180deg)] rtl:transform-[rotate(0deg)]' : 'transform-[rotate(0deg)] rtl:transform-[rotate(180deg)]'}>
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
      </div>
    </aside>
  )
})
