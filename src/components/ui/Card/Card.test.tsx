import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card } from './Card'

describe('Card', () => {
  it('renders the body children', () => {
    render(<Card>Body content</Card>)
    expect(screen.getByText('Body content')).toBeInTheDocument()
  })

  it('renders the title and description as a header', () => {
    render(
      <Card title="Plan" description="Monthly billing">
        Body
      </Card>,
    )
    expect(screen.getByRole('heading', { name: 'Plan' })).toBeInTheDocument()
    expect(screen.getByText('Monthly billing')).toBeInTheDocument()
  })

  it('renders footer content', () => {
    render(<Card footer={<button type="button">Action</button>}>Body</Card>)
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })

  it('forwards the ref to the root element', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Card ref={ref}>Body</Card>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('spreads native props', () => {
    render(<Card data-testid="card">Body</Card>)
    expect(screen.getByTestId('card')).toBeInTheDocument()
  })

  it('merges className overrides with twMerge', () => {
    render(
      <Card data-testid="card" className="rounded-none">
        Body
      </Card>,
    )
    const card = screen.getByTestId('card')
    expect(card.className).toContain('rounded-none')
    expect(card.className).not.toContain('rounded-xl')
  })
})
