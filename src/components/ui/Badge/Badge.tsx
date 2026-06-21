import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type BadgeVariant = 'default' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'

export interface BadgeProps extends ComponentPropsWithoutRef<'span'> {
  /** Colour / intent. Defaults to "default". */
  variant?: BadgeVariant
  /** Show a small leading status dot in the current text colour. */
  dot?: boolean
}

const base =
  'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium leading-normal whitespace-nowrap ring-1 ring-inset ring-black/[0.04] transition-colors dark:ring-white/[0.06]'

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300',
  secondary: 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  destructive: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300',
  outline: 'border border-slate-300 text-slate-700 dark:border-zinc-700 dark:text-zinc-300',
}

/**
 * Small status / category label rendered as a <span>. Pick a `variant` colour and
 * optionally show a leading status `dot` (which follows the text colour). Forwards
 * the ref and spreads native span props; `className` is merged last with `twMerge`.
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { variant = 'default', dot = false, className, children, ...props },
  ref,
) {
  return (
    <span ref={ref} className={twMerge(base, variantClasses[variant], className)} {...props}>
      {dot ? <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> : null}
      {children}
    </span>
  )
})
