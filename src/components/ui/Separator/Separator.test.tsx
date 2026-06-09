import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Separator } from './Separator'

describe('Separator', () => {
  it('is decorative (role none) by default', () => {
    const { container } = render(<Separator />)
    expect(container.firstChild).toHaveAttribute('role', 'none')
    expect(screen.queryByRole('separator')).toBeNull()
  })

  it('exposes a semantic separator with orientation when not decorative', () => {
    render(<Separator decorative={false} orientation="vertical" />)
    const sep = screen.getByRole('separator')
    expect(sep).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('switches size classes by orientation', () => {
    const { container, rerender } = render(<Separator />)
    expect(container.firstChild).toHaveClass('h-px', 'w-full')
    rerender(<Separator orientation="vertical" />)
    expect(container.firstChild).toHaveClass('h-full', 'w-px')
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    const { container } = render(<Separator ref={ref} className="bg-red-500" />)
    expect(ref.current).toBe(container.firstChild)
    expect(container.firstChild).toHaveClass('bg-red-500')
  })
})
