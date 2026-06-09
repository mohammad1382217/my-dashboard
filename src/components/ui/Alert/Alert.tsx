import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export type AlertVariant = 'info' | 'success' | 'warning' | 'error'

export interface AlertProps extends Omit<ComponentPropsWithoutRef<'div'>, 'title'> {
  /** Colour + default icon + ARIA role. Defaults to "info". */
  variant?: AlertVariant
  /** Bold heading line. */
  title?: ReactNode
  /** Override the default icon. Pass `null` to hide it entirely. */
  icon?: ReactNode
  /** Description / body. */
  children?: ReactNode
}

const variantClasses: Record<AlertVariant, string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-100',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-100',
  warning: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100',
  error: 'border-red-200 bg-red-50 text-red-900 dark:border-red-900 dark:bg-red-950 dark:text-red-100',
}

const iconColor: Record<AlertVariant, string> = {
  info: 'text-blue-500 dark:text-blue-400',
  success: 'text-emerald-500 dark:text-emerald-400',
  warning: 'text-amber-500 dark:text-amber-400',
  error: 'text-red-500 dark:text-red-400',
}

// Single-path icons per variant; the Alert is a base component so inline SVG is allowed.
const iconPaths: Record<AlertVariant, ReactNode> = {
  info: <path d="M12 16v-4M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />,
  success: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4 12 14.01l-3-3" />,
  warning: <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0ZM12 9v4M12 17h.01" />,
  error: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM15 9l-6 6M9 9l6 6" />,
}

/**
 * A coloured callout for inline messages. Four variants drive the palette, the
 * default icon and the ARIA role (`warning`/`error` announce as `alert`, the
 * rest as `status`). Provide a `title` and/or body via children.
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  { variant = 'info', title, icon, children, className, ...props },
  ref,
) {
  const showIcon = icon !== null
  return (
    <div
      ref={ref}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={twMerge('flex gap-3 rounded-lg border p-4 text-sm', variantClasses[variant], className)}
      {...props}
    >
      {showIcon ? (
        <span className={twMerge('mt-0.5 shrink-0', iconColor[variant])}>
          {icon ?? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {iconPaths[variant]}
            </svg>
          )}
        </span>
      ) : null}
      <div className="flex min-w-0 flex-col gap-1">
        {title ? <p className="font-medium">{title}</p> : null}
        {children ? <div className="opacity-90">{children}</div> : null}
      </div>
    </div>
  )
})
