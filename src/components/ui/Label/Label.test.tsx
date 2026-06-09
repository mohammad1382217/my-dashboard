import { createRef } from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Label } from './Label'

describe('Label', () => {
  it('renders its text and associates via htmlFor', () => {
    render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    )
    expect(screen.getByText('Email')).toHaveAttribute('for', 'email')
  })

  it('shows a required marker when required', () => {
    render(<Label required>Name</Label>)
    expect(screen.getByText('*')).toBeInTheDocument()
  })

  it('omits the marker by default', () => {
    render(<Label>Name</Label>)
    expect(screen.queryByText('*')).toBeNull()
  })

  it('merges className and forwards the ref', () => {
    const ref = createRef<HTMLLabelElement>()
    render(
      <Label ref={ref} className="text-red-500">
        Field
      </Label>,
    )
    expect(ref.current).toBeInstanceOf(HTMLLabelElement)
    expect(ref.current).toHaveClass('text-red-500')
  })
})
