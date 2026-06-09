import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Badge } from './Badge'

describe('Badge', () => {
  it('renders its children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('applies the variant classes', () => {
    render(<Badge variant="success">Active</Badge>)
    expect(screen.getByText('Active').className).toContain('text-emerald-700')
  })

  it('renders a leading status dot when `dot` is set', () => {
    const { container } = render(<Badge dot>Online</Badge>)
    expect(container.querySelector('.bg-current')).not.toBeNull()
  })

  it('omits the dot by default', () => {
    const { container } = render(<Badge>Online</Badge>)
    expect(container.querySelector('.bg-current')).toBeNull()
  })

  it('forwards the ref to the underlying <span>', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Badge ref={ref}>x</Badge>)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
  })

  it('spreads native span props', () => {
    render(<Badge title="status">x</Badge>)
    expect(screen.getByText('x')).toHaveAttribute('title', 'status')
  })

  it('merges className overrides with twMerge', () => {
    render(<Badge className="rounded-md">x</Badge>)
    const badge = screen.getByText('x')
    expect(badge.className).toContain('rounded-md')
    expect(badge.className).not.toContain('rounded-full')
  })
})
