import { forwardRef, useId } from 'react'
import type { ChangeEvent, ComponentPropsWithoutRef, CSSProperties, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SliderProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  /** Field label. */
  label?: ReactNode
  /** Show the current value next to the label. */
  showValue?: boolean
}

/**
 * Range slider built on the native <input type="range"> (native keyboard, drag,
 * form behaviour and RTL come for free), but fully restyled via the `.slider`
 * class: a rounded track, an indigo value fill, and a white thumb with hover /
 * focus ring. The filled portion on WebKit is a gradient keyed off a CSS
 * `--slider-pct` variable (Firefox uses `::-moz-range-progress`), updated live so
 * it tracks both controlled and uncontrolled sliders. Forwards the ref to the input.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, showValue, id, className, value, defaultValue, min = 0, max = 100, onChange, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const current = value ?? defaultValue

  const toPct = (v: unknown) => {
    const lo = Number(min)
    const hi = Number(max)
    const n = Number(v)
    if (!Number.isFinite(n) || hi <= lo) return 0
    return Math.min(100, Math.max(0, ((n - lo) / (hi - lo)) * 100))
  }

  // WebKit has no progress pseudo-element, so the fill is a gradient on the track keyed
  // off --slider-pct. Update it live on input so uncontrolled sliders fill too.
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    event.currentTarget.style.setProperty('--slider-pct', `${toPct(event.currentTarget.value)}%`)
    onChange?.(event)
  }

  return (
    <div className="flex flex-col gap-2">
      {label || showValue ? (
        <div className="flex items-center justify-between text-sm">
          {label ? (
            <label htmlFor={inputId} className="font-medium text-fg-soft">
              {label}
            </label>
          ) : (
            <span />
          )}
          {showValue ? <span className="tabular-nums text-muted">{current}</span> : null}
        </div>
      ) : null}

      <input
        {...props}
        ref={ref}
        id={inputId}
        type="range"
        min={min}
        max={max}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        style={{ '--slider-pct': `${toPct(current ?? min)}%` } as CSSProperties}
        className={twMerge('slider', className)}
      />
    </div>
  )
})
