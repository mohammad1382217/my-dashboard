import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import type { ComponentPropsWithoutRef, PointerEvent } from 'react'
import { twMerge } from 'tailwind-merge'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ComponentPropsWithoutRef<'button'> {
  /** Visual style. Defaults to "primary". */
  variant?: ButtonVariant
  /** Height / padding. Defaults to "md". */
  size?: ButtonSize
}

interface Ripple {
  id: number
  x: number
  y: number
  size: number
}

const base =
  'relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md font-medium whitespace-nowrap outline-none select-none transition-[color,background-color,border-color,box-shadow,transform] active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-neutral-900/30 focus-visible:ring-offset-1 dark:focus-visible:ring-white/30 disabled:pointer-events-none disabled:opacity-50'

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-neutral-900 text-white shadow-sm hover:bg-neutral-800 hover:shadow-md dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
  outline: 'border border-neutral-300 bg-white text-neutral-900 shadow-sm hover:bg-neutral-100 hover:border-neutral-400 dark:border-zinc-700 dark:bg-transparent dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:border-zinc-600',
  ghost: 'text-neutral-900 hover:bg-neutral-100 dark:text-zinc-100 dark:hover:bg-zinc-800',
  destructive: 'bg-red-600 text-white shadow-sm hover:bg-red-500 hover:shadow-md',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

/**
 * Native <button> with variants, sizes and a material-style click ripple.
 * Forwards the ref and spreads every native prop. Defaults `type` to "button"
 * to avoid accidental form submits. `className` is merged last with `twMerge`.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', type = 'button', className, children, onPointerDown, ...props },
  ref,
) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement, [])

  const [ripples, setRipples] = useState<Ripple[]>([])
  const nextRippleId = useRef(0)

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    const button = buttonRef.current
    if (button) {
      const rect = button.getBoundingClientRect()
      const diameter = Math.max(rect.width, rect.height)
      const radius = diameter / 2
      setRipples((current) => [
        ...current,
        {
          id: nextRippleId.current++,
          x: event.clientX - rect.left - radius,
          y: event.clientY - rect.top - radius,
          size: diameter,
        },
      ])
    }
    onPointerDown?.(event)
  }

  return (
    <button
      ref={buttonRef}
      type={type}
      onPointerDown={handlePointerDown}
      className={twMerge(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          aria-hidden="true"
          className="ripple"
          style={{ left: ripple.x, top: ripple.y, width: ripple.size, height: ripple.size }}
          onAnimationEnd={() =>
            setRipples((current) => current.filter((r) => r.id !== ripple.id))
          }
        />
      ))}
    </button>
  )
})
