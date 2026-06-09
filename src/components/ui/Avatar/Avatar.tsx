import { forwardRef, useState } from 'react'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps extends Omit<ComponentPropsWithoutRef<'span'>, 'children'> {
  /** Image URL. Falls back to `fallback` if absent or it fails to load. */
  src?: string
  /** Alt text / accessible name. */
  alt?: string
  /** Shown when there's no image (e.g. initials or an icon). */
  fallback?: ReactNode
  /** Size. Defaults to "md". */
  size?: AvatarSize
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
}

/**
 * Circular avatar that shows an image, falling back to `fallback` (initials or an
 * icon) when there's no `src` or the image fails to load. Forwards the ref to the
 * wrapper <span>; `className` is merged last with `twMerge`.
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(function Avatar(
  { src, alt = '', fallback, size = 'md', className, ...props },
  ref,
) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <span
      ref={ref}
      role={showImage ? undefined : 'img'}
      aria-label={showImage ? undefined : alt || undefined}
      className={twMerge(
        'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-slate-200 font-medium text-slate-600 dark:bg-zinc-700 dark:text-zinc-200',
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {showImage ? (
        <img src={src} alt={alt} className="size-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <span aria-hidden="true">{fallback}</span>
      )}
    </span>
  )
})
