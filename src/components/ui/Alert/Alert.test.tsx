import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Alert } from './Alert'

describe('Alert', () => {
  it('renders title and body', () => {
    render(<Alert title="Heads up">Something happened.</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Something happened.')).toBeInTheDocument()
  })

  it('uses role=alert for error and warning', () => {
    const { rerender } = render(<Alert variant="error">x</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    rerender(<Alert variant="warning">x</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('uses role=status for info and success', () => {
    render(<Alert variant="success">ok</Alert>)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('hides the icon when icon is null', () => {
    const { container } = render(<Alert variant="info" icon={null}>no icon</Alert>)
    expect(container.querySelector('svg')).toBeNull()
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Alert ref={ref} className="mt-4">x</Alert>)
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current).toHaveClass('mt-4')
  })
})
