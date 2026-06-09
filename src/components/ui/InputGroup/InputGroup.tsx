import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

export interface InputGroupProps extends ComponentPropsWithoutRef<'input'> {
  /** Addon shown before the field (icon or short text). */
  leading?: ReactNode
  /** Addon shown after the field (icon, unit or a button). */
  trailing?: ReactNode
  /** Merged onto the outer bordered wrapper, not the input. */
  wrapperClassName?: string
}

const wrapperBase =
  'flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-900 transition-colors focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-500/20 has-[input:disabled]:cursor-not-allowed has-[input:disabled]:opacity-60 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100'

/**
 * An input with leading/trailing addons inside a single bordered shell. The
 * border and focus ring live on the wrapper; the inner field is borderless, so
 * icons, units (`kg`, `@`) or a trailing button sit flush. `className` targets
 * the input, `wrapperClassName` the shell.
 */
export const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(function InputGroup(
  { leading, trailing, wrapperClassName, className, ...props },
  ref,
) {
  return (
    <div className={twMerge(wrapperBase, wrapperClassName)}>
      {leading ? <span className="shrink-0 text-slate-400 dark:text-zinc-500">{leading}</span> : null}
      <input
        ref={ref}
        className={twMerge(
          'h-10 w-full min-w-0 border-0 bg-transparent p-0 text-inherit outline-none placeholder:text-slate-400 disabled:cursor-not-allowed dark:placeholder:text-zinc-500',
          className,
        )}
        {...props}
      />
      {trailing ? <span className="shrink-0 text-slate-400 dark:text-zinc-500">{trailing}</span> : null}
    </div>
  )
})
