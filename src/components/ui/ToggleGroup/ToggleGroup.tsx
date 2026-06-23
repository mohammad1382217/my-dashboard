import { forwardRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface ToggleGroupItem {
  /** Stable value reported through onValueChange. */
  value: string
  /** Button content. */
  label: ReactNode
  /** Disable just this item. */
  disabled?: boolean
  /** Accessible label when `label` is icon-only. */
  ariaLabel?: string
}

interface ToggleGroupBaseProps extends Omit<ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  items: ToggleGroupItem[]
  size?: 'sm' | 'md' | 'lg'
}

interface SingleProps extends ToggleGroupBaseProps {
  type?: 'single'
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
}

interface MultipleProps extends ToggleGroupBaseProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type ToggleGroupProps = SingleProps | MultipleProps

type Resolved = ToggleGroupBaseProps & {
  type?: 'single' | 'multiple'
  value?: string | string[] | null
  defaultValue?: string | string[] | null
  onValueChange?: (value: string | string[] | null) => void
}

const sizeClasses = {
  sm: 'h-8 min-w-8 px-2 text-xs',
  md: 'h-9 min-w-9 px-2.5 text-sm',
  lg: 'h-10 min-w-10 px-3 text-sm',
} as const

const itemBase =
  'inline-flex items-center justify-center gap-2 border border-slate-300 font-medium text-slate-600 outline-none transition-[color,background-color,border-color,box-shadow,transform] hover:border-slate-400 hover:bg-slate-100 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-primary-500/30 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-900 data-[state=on]:text-white dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800 dark:data-[state=on]:bg-zinc-100 dark:data-[state=on]:text-zinc-900'

function toList(value: string | string[] | null | undefined): string[] {
  if (Array.isArray(value)) return value
  return typeof value === 'string' ? [value] : []
}

/**
 * A set of toggle buttons, single- or multiple-select. Data-driven via `items`.
 * Controlled with `value` + `onValueChange` or uncontrolled with `defaultValue`.
 * The buttons are visually attached (shared borders, rounded outer ends) and
 * each carries `aria-pressed` inside a `role="group"`.
 */
export const ToggleGroup = forwardRef<HTMLDivElement, ToggleGroupProps>(function ToggleGroup(props, ref) {
  const { items, type = 'single', size = 'md', value, defaultValue, onValueChange, className, ...rest } =
    props as Resolved

  const isControlled = value !== undefined
  const [internal, setInternal] = useState<string[]>(() => toList(defaultValue))
  const selected = isControlled ? toList(value) : internal

  function emit(next: string[]) {
    if (!isControlled) setInternal(next)
    if (!onValueChange) return
    if (type === 'multiple') (onValueChange as (v: string[]) => void)(next)
    else (onValueChange as (v: string | null) => void)(next[0] ?? null)
  }

  function toggle(itemValue: string) {
    const isOn = selected.indexOf(itemValue) !== -1
    if (type === 'multiple') {
      emit(isOn ? selected.filter((v) => v !== itemValue) : [...selected, itemValue])
    } else {
      emit(isOn ? [] : [itemValue])
    }
  }

  return (
    <div
      ref={ref}
      role="group"
      className={twMerge('inline-flex [&>*:first-child]:rounded-s-md [&>*:last-child]:rounded-e-md [&>*:not(:first-child)]:-ms-px', className)}
      {...rest}
    >
      {items.map((item) => {
        const isOn = selected.indexOf(item.value) !== -1
        return (
          <button
            key={item.value}
            type="button"
            aria-pressed={isOn}
            aria-label={item.ariaLabel}
            data-state={isOn ? 'on' : 'off'}
            disabled={item.disabled}
            onClick={() => toggle(item.value)}
            className={twMerge(itemBase, sizeClasses[size])}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
})
