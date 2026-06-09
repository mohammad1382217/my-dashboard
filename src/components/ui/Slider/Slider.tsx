import { forwardRef, useId } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface SliderProps extends Omit<ComponentPropsWithoutRef<'input'>, 'type'> {
  /** Field label. */
  label?: ReactNode
  /** Show the current value next to the label. */
  showValue?: boolean
}

/**
 * Range slider built on the native <input type="range">, tinted with
 * `accent-color`. Native keyboard, drag and form behaviour come for free.
 * Controlled/uncontrolled via the native value props. Forwards the ref to the
 * input; `className` is merged onto it.
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>(function Slider(
  { label, showValue, id, className, value, defaultValue, ...props },
  ref,
) {
  const autoId = useId()
  const inputId = id ?? autoId
  const current = value ?? defaultValue

  return (
    <div className="flex flex-col gap-2">
      {label || showValue ? (
        <div className="flex items-center justify-between text-sm">
          {label ? (
            <label htmlFor={inputId} className="font-medium text-slate-700 dark:text-zinc-300">
              {label}
            </label>
          ) : (
            <span />
          )}
          {showValue ? <span className="tabular-nums text-slate-500 dark:text-zinc-400">{current}</span> : null}
        </div>
      ) : null}

      <input
        ref={ref}
        id={inputId}
        type="range"
        value={value}
        defaultValue={defaultValue}
        className={twMerge(
          'h-2 w-full cursor-pointer accent-indigo-600 disabled:cursor-not-allowed disabled:opacity-60 dark:accent-indigo-500',
          className,
        )}
        {...props}
      />
    </div>
  )
})
