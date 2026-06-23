import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ProgressProps extends Omit<ComponentPropsWithoutRef<'div'>, 'role'> {
  /** Current value (clamped to 0..max). */
  value?: number
  /** Maximum value. Defaults to 100. */
  max?: number
  /** Optional label rendered above the bar. */
  label?: ReactNode
  /** Show the percentage next to the label. */
  showValue?: boolean
}

/**
 * Determinate progress bar. Exposes role="progressbar" with aria-valuenow/min/max
 * and animates the fill width. Forwards the ref to the track; `className` is merged
 * onto the track.
 */
export const Progress = forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = 0, max = 100, label, showValue, className, ...props },
  ref,
) {
  const clamped = Math.max(0, Math.min(max, value))
  const percent = max > 0 ? Math.round((clamped / max) * 100) : 0

  return (
    <div className="flex flex-col gap-1.5">
      {label || showValue ? (
        <div className="flex items-center justify-between text-sm">
          {label ? <span className="font-medium text-fg-soft">{label}</span> : <span />}
          {showValue ? <span className="tabular-nums text-muted">{percent}%</span> : null}
        </div>
      ) : null}

      <div
        ref={ref}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={max}
        className={twMerge('h-2 w-full overflow-hidden rounded-full bg-surface-2', className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-primary-600 transition-all duration-300 ease-out dark:bg-primary-500"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
})
