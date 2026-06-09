import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Skeleton } from './Skeleton'

describe('Skeleton', () => {
  it('renders an animated, aria-hidden placeholder', () => {
    render(<Skeleton data-testid="sk" />)
    const el = screen.getByTestId('sk')
    expect(el).toHaveAttribute('aria-hidden', 'true')
    expect(el.className).toContain('animate-pulse')
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Skeleton ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('merges className overrides with twMerge', () => {
    render(<Skeleton data-testid="sk" className="rounded-full" />)
    const el = screen.getByTestId('sk')
    expect(el.className).toContain('rounded-full')
    expect(el.className).not.toContain('rounded-md')
  })
})
