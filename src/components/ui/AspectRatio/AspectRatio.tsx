import { forwardRef } from 'react'
import type { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'

export interface AspectRatioProps extends ComponentPropsWithoutRef<'div'> {
  /** Width-to-height ratio, e.g. 16 / 9 (the default) or 1 for a square. */
  ratio?: number
}

/**
 * Constrains its content to a fixed aspect ratio. Uses the padding-bottom
 * technique rather than the `aspect-ratio` CSS property, so it works on the
 * old browsers this kit targets. The wrapper sets an explicit `height: 0` so a
 * flex/grid parent's `align-items: stretch` can't override the padding-derived
 * height (otherwise the box stretches to its tallest sibling and the ratio
 * breaks). `className` is merged onto the content box, which is clipped — handy
 * for `<img className="size-full object-cover">`.
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>(function AspectRatio(
  { ratio = 16 / 9, children, className, style, ...props },
  ref,
) {
  return (
    <div className="relative h-0 w-full" style={{ paddingBottom: `${100 / ratio}%` }}>
      <div
        ref={ref}
        className={twMerge('absolute inset-0 overflow-hidden', className)}
        style={style}
        {...props}
      >
        {children}
      </div>
    </div>
  )
})
