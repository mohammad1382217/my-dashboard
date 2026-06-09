import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Empty } from './Empty'

describe('Empty', () => {
  it('renders the title and description', () => {
    render(<Empty title="No results" description="Try another search." />)
    expect(screen.getByText('No results')).toBeInTheDocument()
    expect(screen.getByText('Try another search.')).toBeInTheDocument()
  })

  it('renders an icon and an action', () => {
    render(
      <Empty icon={<svg data-testid="icon" />} title="Empty">
        <button>Add item</button>
      </Empty>,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add item' })).toBeInTheDocument()
  })

  it('omits the description when not provided', () => {
    render(<Empty title="Empty" />)
    expect(screen.getByText('Empty')).toBeInTheDocument()
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Empty ref={ref} className="bg-red-500" title="X" />)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('bg-red-500')
  })
})
