import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type KbdProps = ComponentPropsWithoutRef<'kbd'>

/**
 * Renders a keyboard key, e.g. `<Kbd>⌘</Kbd> <Kbd>K</Kbd>`. Always left-to-right
 * so shortcuts read correctly inside RTL text.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(function Kbd({ className, ...props }, ref) {
  return (
    <kbd
      ref={ref}
      dir="ltr"
      className={twMerge(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-slate-200 bg-slate-100 px-1.5 font-mono text-[0.6875rem] font-medium text-slate-600 shadow-[0_1px_0_1px_rgba(0,0,0,0.04)] dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 dark:shadow-none',
        className,
      )}
      {...props}
    />
  )
})
