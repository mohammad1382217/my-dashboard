import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Spinner } from './Spinner'

describe('Spinner', () => {
  it('exposes a status role with the default label', () => {
    render(<Spinner />)
    expect(screen.getByRole('status')).toBeInTheDocument()
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('uses a custom label', () => {
    render(<Spinner label="در حال بارگذاری" />)
    expect(screen.getByText('در حال بارگذاری')).toBeInTheDocument()
  })

  it('applies the size class', () => {
    const { container } = render(<Spinner size="lg" />)
    expect(container.querySelector('.animate-spin')).toHaveClass('size-8')
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLSpanElement>()
    render(<Spinner ref={ref} className="text-red-500" />)
    expect(ref.current).toBeInstanceOf(HTMLSpanElement)
    expect(ref.current).toHaveClass('text-red-500')
  })
})
