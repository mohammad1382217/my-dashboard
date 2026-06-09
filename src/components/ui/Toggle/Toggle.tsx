import { forwardRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ToggleProps extends Omit<ComponentPropsWithoutRef<'button'>, 'onChange'> {
  /** Controlled pressed state. */
  pressed?: boolean
  /** Uncontrolled initial pressed state. Defaults to false. */
  defaultPressed?: boolean
  /** Fires with the next pressed state when toggled. */
  onPressedChange?: (pressed: boolean) => void
  /** Visual style. Defaults to "default". */
  variant?: 'default' | 'outline'
  /** Size. Defaults to "md". */
  size?: 'sm' | 'md' | 'lg'
  children?: ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium outline-none transition-colors hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-indigo-500/30 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-200 data-[state=on]:text-slate-900 dark:hover:bg-zinc-800 dark:data-[state=on]:bg-zinc-700 dark:data-[state=on]:text-white'

const variantClasses = {
  default: 'bg-transparent text-slate-600 dark:text-zinc-300',
  outline: 'border border-slate-300 bg-transparent text-slate-600 dark:border-zinc-700 dark:text-zinc-300',
} as const

const sizeClasses = {
  sm: 'h-8 min-w-8 px-2',
  md: 'h-9 min-w-9 px-2.5',
  lg: 'h-10 min-w-10 px-3',
} as const

/**
 * A two-state toggle button (`aria-pressed`). Controlled via `pressed` +
 * `onPressedChange`, or uncontrolled via `defaultPressed`. Carries a
 * `data-state="on|off"` hook for styling.
 */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed, defaultPressed = false, onPressedChange, variant = 'default', size = 'md', className, children, ...props },
  ref,
) {
  const isControlled = pressed !== undefined
  const [internal, setInternal] = useState(defaultPressed)
  const isOn = isControlled ? pressed : internal

  function toggle() {
    const next = !isOn
    if (!isControlled) setInternal(next)
    onPressedChange?.(next)
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={isOn}
      data-state={isOn ? 'on' : 'off'}
      onClick={toggle}
      className={twMerge(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </button>
  )
})
