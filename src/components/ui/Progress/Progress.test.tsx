import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  it('exposes a progressbar with the right aria values', () => {
    render(<Progress value={40} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toHaveAttribute('aria-valuenow', '40')
    expect(bar).toHaveAttribute('aria-valuemin', '0')
    expect(bar).toHaveAttribute('aria-valuemax', '100')
  })

  it('reflects a custom max', () => {
    render(<Progress value={1} max={4} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '4')
  })

  it('clamps the value to the range', () => {
    render(<Progress value={250} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('shows the label and percentage', () => {
    render(<Progress value={50} label="Uploading" showValue />)
    expect(screen.getByText('Uploading')).toBeInTheDocument()
    expect(screen.getByText('50%')).toBeInTheDocument()
  })

  it('forwards the ref to the track', () => {
    const ref = createRef<HTMLDivElement>()
    render(<Progress ref={ref} value={10} />)
    expect(ref.current).toBe(screen.getByRole('progressbar'))
  })
})
